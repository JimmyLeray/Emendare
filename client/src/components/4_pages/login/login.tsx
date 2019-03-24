/*
 * Page de connexion
 * Le but de cette page est de permettre aux utilisateurs :
 * - de se connecter avec leur email / mot de passe
 * - d'accèder à la page d'inscription
 * - TODO : d'accèder à une page de récupération de mot de passe
 */

import React from 'react'
import { Redirect } from 'react-router-dom'
import {
  Button,
  Buttons,
  Link,
  Notification,
  Page,
  Input,
  Hero
} from '../../../components'
import { Socket } from '../../../services'
import { path } from '../../../config'

interface ILoginPageProps {
  location?: any
}

interface ILoginPageState {
  email: string
  password: string
  error: any
  redirectToReferrer: boolean
}

export class LoginPage extends React.Component<
  ILoginPageProps,
  ILoginPageState
> {
  private change: any
  private submit: any

  constructor(props: ILoginPageProps) {
    super(props)

    this.change = (name: string) => (event: any) => {
      this.setState({ [name]: event.target.value } as any)
    }

    this.submit = (event: any) => {
      event.preventDefault()

      Socket.fetch('login', {
        password: this.state.password,
        email: this.state.email
      })
        .then(async ({ token }: any) => {
          localStorage.setItem('token', token)
          await Socket.fetch('user')
          this.setState({ redirectToReferrer: true })
        })
        .catch(error => {
          this.setState({ error })
        })
    }

    this.state = {
      email: '',
      password: '',
      error: null,
      redirectToReferrer: false
    }
  }

  public componentWillUnmount() {
    Socket.off('login')
  }

  public render() {
    if (this.state.redirectToReferrer) {
      return (
        <Redirect
          to={
            (this.props.location &&
              this.props.location.state &&
              this.props.location.state.from) ||
            path.home
          }
        />
      )
    }

    return (
      <Page title="Connexion">
        <Hero title="Se connecter" className="has-text-centered" />
        <form
          onSubmit={this.submit}
          style={{ maxWidth: '350px', margin: 'auto' }}
        >
          <div className="field">
            <div className="control has-icons-left has-icons-right">
              <Input
                autoFocus={true}
                ariaLabel="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.change('email')}
                className="input is-medium"
                type="email"
                iconLeft="fa-envelope"
              />
            </div>
          </div>
          <div className="field">
            <div className="control has-icons-left">
              <Input
                placeholder="Mot de passe"
                ariaLabel="Mot de passe"
                value={this.state.password}
                onChange={this.change('password')}
                className="input is-medium"
                type="password"
                iconLeft="fa-lock"
              />
            </div>
            <div className="has-text-right" style={{ marginTop: 4 }}>
              <Link to={path.reset} className="is-text">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>
          <div className="has-text-centered">
            <Buttons>
              <Button
                type="submit"
                className="is-medium is-success is-fullwidth"
                disabled={!this.state.email || !this.state.password}
              >
                Connexion
              </Button>
              <Button to={path.subscribe} className="is-fullwidth">
                Je n'ai pas de compte
              </Button>
            </Buttons>
          </div>
          <br />
          {this.state.error && (
            <Notification className="is-danger has-text-centered">
              {this.state.error.message}
            </Notification>
          )}
        </form>
      </Page>
    )
  }
}
