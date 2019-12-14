import { connection } from 'mongoose'
import { deleteTestData } from './helpers/db-utils'


beforeEach(async () => {
  await deleteTestData()
})

after(async () => {
  await connection.close()
})
