import React from 'react'
// interfaces
import { IArgument, IUser } from '../../../../../interfaces'
// Components
import { Media, Icon, StopWatch } from '../../../components'
// Helpers
import { hasUserDownVote, hasUserUpVote } from '../../../helpers'

interface IArgumentProps {
  data: IArgument
  amendID: string
  upVoteArgument: any
  downVoteArgument: any
  user: IUser | null
}

export const Argument = ({
  data,
  amendID,
  upVoteArgument,
  downVoteArgument,
  user
}: IArgumentProps) => (
  <Media>
    <Media.Left>
      <div
        className="is-size-5"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <a
          className="button is-medium"
          onClick={() => upVoteArgument(data._id, amendID)}
          style={{ border: 'none', background: 'none' }}
        >
          <Icon
            name="fas fa-sort-up"
            style={{
              fontSize: '2rem',
              display: 'flex',
              alignItems: 'flex-end'
            }}
            className={
              user && hasUserUpVote(user.argumentUpVotes, amendID, data._id)
                ? 'has-text-grey'
                : 'has-text-grey-light'
            }
          />
        </a>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {data.upVotesCount}
        </div>
        <a
          className="button is-medium"
          onClick={() => downVoteArgument(data._id, amendID)}
          style={{ border: 'none', background: 'none' }}
        >
          <Icon
            name="fas fa-sort-down"
            style={{
              fontSize: '2rem',
              display: 'flex',
              alignItems: 'flex-start'
            }}
            className={
              user && hasUserDownVote(user.argumentDownVotes, amendID, data._id)
                ? 'has-text-grey'
                : 'has-text-grey-light'
            }
          />
        </a>
      </div>
    </Media.Left>
    <Media.Content>
      <div className="content">
        <p>
          {data.type === 'up' ? (
            <strong>
              <Icon name="fa-check" className="has-text-info" size="fa-lg" />{' '}
              Pour
            </strong>
          ) : (
            <strong>
              <Icon name="fa-times" className="has-text-danger" size="fa-lg" />{' '}
              Contre
            </strong>
          )}
          {' - '}
          <small className="is-italic">
            <StopWatch date={data.created} />
          </small>
          <br />
          <br />
          {data.text}
        </p>
      </div>
    </Media.Content>
  </Media>
)
