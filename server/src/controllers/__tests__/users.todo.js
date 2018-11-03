import {omit} from 'lodash'
import {initDb, generate} from 'til-server-test-utils'
import db from '../../utils/db'
import * as userController from '../users.todo'

// this setup is common across controllers, so it may be useful to
// add this to the utils, but I'll leave it here for you :)
function setup() {
  const req = {
    body: {},
  }
  const res = {}
  Object.assign(res, {
    status: jest.fn(
      function status() {
        return this
      }.bind(res),
    ),
    json: jest.fn(
      function json() {
        return this
      }.bind(res),
    ),
    send: jest.fn(
      function send() {
        return this
      }.bind(res),
    ),
  })
  return {req, res}
}

const safeUser = u => omit(u, ['salt', 'hash'])

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
  const firstCall = res.json.mock.calls[0]
  const firstArg = firstCall[0]
  const {users} = firstArg
  expect(users.length).toBeGreaterThan(0)
  const actualUsers = await db.getUsers()
  expect(users).toEqual(actualUsers.map(u => omit(u, ['salt', 'hash'])))
})

test('deleteUser should return 403 if user.id does not match request param id', async () => {
  const testUser = await db.insertUser(generate.userData())
  const {req, res} = setup()
  req.params = {id: testUser.id}

  await userController.deleteUser(req, res)
  expect(res.json).not.toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(403)
  expect(res.send).toHaveBeenCalledTimes(1)

  const userFromDB = await db.getUser(testUser.id)
  expect(userFromDB).toEqual(testUser)
})

test('deleteUser should return 404 if request param id does not exist', async () => {
  const id = generate.id()
  const {req, res} = setup()
  req.params = {
    id,
  }
  req.user = {
    id,
  }

  await userController.deleteUser(req, res)
  expect(res.json).not.toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status).toHaveBeenCalledWith(404)
  expect(res.send).toHaveBeenCalledTimes(1)
})

test('deleteUser should delete a user', async () => {
  const testUser = await db.insertUser(generate.userData())
  const id = testUser.id
  const {req, res} = setup()
  req.params = {
    id,
  }
  req.user = {
    id,
  }

  await userController.deleteUser(req, res)
  expect(res.json).toHaveBeenCalledTimes(1)
  const firstArg = res.json.mock.calls[0][0]
  const {user} = firstArg
  expect(user).toEqual(safeUser(testUser))

  const actualUser = await db.getUser(id)
  expect(actualUser).not.toBeDefined()
})
