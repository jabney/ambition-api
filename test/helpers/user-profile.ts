import { IProfileInfo } from '../../src/models/profile-info.interface'

type UserData = {[key: string]: IProfileInfo}

const userData: UserData = {
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
export const userCredentials = (userKey: keyof typeof userData = 'rando') => {
  const { email, password } = userData[userKey]
  return { email, password }
}

/**
 *
 */
export const userProfile = (userKey: keyof typeof userData = 'rando') => {
  const user = userData[userKey]
  return JSON.parse(JSON.stringify(user)) as IProfileInfo
}

export const users = JSON.parse(JSON.stringify(userData)) as typeof userData
export const userEmails = Object.values(userData).map(user => user.email)

export default userData
