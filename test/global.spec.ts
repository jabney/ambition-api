import { connection } from 'mongoose'
import { deleteTestData, addToWhitelist } from './helpers/db-utils'
import users from './helpers/user-profile'

const emails = Object.values(users).map(user => user.email)

beforeEach(async () => {
  await deleteTestData()
  await addToWhitelist(emails)
})

after(async () => {
  await connection.close()
})
