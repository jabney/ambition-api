import { connection } from 'mongoose'
import { deleteTestData } from './helpers/db'

beforeEach(async () => {
  await deleteTestData()
})

after(async () => {
  await connection.close()
})
