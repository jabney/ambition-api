import { IProfileInfo } from '../../src/models/profile-info.interface'

const signupData = {
  rando: {
    email: 'rando@ambition.example.com',
    password: 'asdf',
    first: 'Rando',
    last: 'Calrissian',
  } as IProfileInfo,
  jabroni: {
    email: 'jabroni@ambition.example.com',
    password: 'asdf',
    first: 'Jabroni',
    last: 'Jackpot',
  } as IProfileInfo,
  admin: {
    email: 'admin@ambition.example.com',
    password: 'asdf',
    first: 'Admin',
    last: 'Smith',
  } as IProfileInfo,
  super: {
    email: 'super@ambition.example.com',
    password: 'asdf',
    first: 'Super',
    last: 'Guy',
  } as IProfileInfo,
}

/**
 * Get a full signup profile including first, last name.
 */
export const signupInfo = (userKey: keyof typeof signupData = 'rando') => {
  const user = signupData[userKey]
  return JSON.parse(JSON.stringify(user)) as IProfileInfo
}

/**
 * Get email, password credentials.
 */
export const signinCredentials = (userKey: keyof typeof signupData = 'rando') => {
  const { email, password } = signupData[userKey]
  return { email, password }
}

export const users = JSON.parse(JSON.stringify(signupData)) as typeof signupData
export const userEmails = Object.values(signupData).map(user => user.email)

export default signupData
