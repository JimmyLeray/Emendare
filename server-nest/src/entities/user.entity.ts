import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm'
import { Amend } from '../entities'

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectID

  @Column()
  email: string

  @Column()
  password: string

  @Column({ default: process.env.NODE_ENV !== 'production' })
  activated: boolean

  @Column({ default: Date.now })
  created: Date

  @Column({ default: Date.now })
  lastEventDate: Date

  @Column({ default: null })
  activationToken: string

  @Column({ default: [] })
  followedTexts: string[]

  @Column({ default: [] })
  upVotes: string[]

  @Column({ default: [] })
  indVotes: string[]

  @Column({ default: [] })
  downVotes: string[]

  @Column({
    default: {
      newText: true,
      newAmend: true,
      amendAccepted: true,
      amendRefused: true
    }
  })
  notifications: {
    newText: boolean
    newAmend: boolean
    amendAccepted: boolean
    amendRefused: boolean
  }

  constructor(email: string, password: string, activationToken: string) {
    this.email = email
    this.password = password
    this.activationToken = activationToken
  }
}
