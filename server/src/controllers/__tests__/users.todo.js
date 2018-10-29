import {omit} from 'lodash'
import {initDb} from 'til-server-test-utils'
import db from '../../utils/db'
import * as userController from '../users.todo'

//////// Elaboration & Feedback /////////
// When you've finished with the exercises:
// 1. Copy the URL below into your browser and fill out the form
// 2. remove the `.skip` from the test below
// 3. Change submitted from `false` to `true`
// 4. And you're all done!
/*
http://ws.kcd.im/?ws=Testing&e=users%20test$20object%20factories&em=
*/

beforeEach(() => initDb())

test.skip('I submitted my elaboration and feedback', () => {
  const submitted = false // change this when you've submitted!
  expect(submitted).toBe(true)
})
////////////////////////////////

test('getUsers returns all users in the database', async () => {
  const req = {}
  const res = {
    json: jest.fn(),
  }

  await userController.getUsers(req, res)
  expect(res.json).toHaveBeenCalledTimes(1)
  console.log('res.json.mock.calls[0]', res.json.mock.calls[0])
  const firstCall = res.json.mock.calls[0]
  const firstArg = firstCall[0]
  const {users} = firstArg
  expect(users.length).toBeGreaterThan(0)
  const actualUsers = await db.getUsers()
  expect(users).toEqual(actualUsers.map(u => omit(u, ['salt', 'hash'])))
})
