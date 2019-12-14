import { IProfileInfo } from '../../src/models/profile-info.interface'

type Users = {[key: string]: IProfileInfo}

const users: Users = {
  rando: {
    email: 'rando@ambition.example.com',
    password: 'asdf',
    first: 'Rando',
    last: 'Calrissian',
  },
  admin: {
    email: 'admin@ambition.example.com',
    password: 'asdf',
    first: 'Admin',
    last: 'Smith',
  },
  super: {
    email: 'super@ambition.example.com',
    password: 'asdf',
    first: 'Super',
    last: 'Guy',
  },
}

/**
 *
 */
export const userCredentials = (userKey: keyof typeof users = 'rando') => {
  const { email, password } = users[userKey]
  return { email, password }
}

/**
 *
 */
export const userProfile = (userKey: keyof typeof users = 'rando') => {
  const user = users[userKey]
  return JSON.parse(JSON.stringify(user)) as IProfileInfo
}

export default JSON.parse(JSON.stringify(users)) as typeof users
