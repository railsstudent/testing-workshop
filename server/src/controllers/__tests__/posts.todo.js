// eslint-disable-next-line no-unused-vars
import {generate, initDb} from 'til-server-test-utils'
import db from '../../utils/db'
import * as postsController from '../posts.todo'

// I'll give this one to you. You want the database to be fresh
// the initDb function will initialize the database with random users and posts
// you can rely on that fact in your tests if you want.
// (For example, getPosts should return all the posts in the DB)
beforeEach(() => initDb())

test('getPosts returns all posts in the database', async () => {
  // here you'll need to Arrange, Act, and Assert
  // Arrange: set up the req and res mock objects
  // Act: Call getPosts on the postsController with the req and res
  // Assert:
  //   - ensure that your mock object functions were called properly
  //   - BONUS: ensure that the posts returned are the ones in the database `await db.getPosts()`
  const req = {}
  const res = {
    json: jest.fn(),
  }
  await postsController.getPosts(req, res)
  expect(res.json).toHaveBeenCalledTimes(1)
  const actualPosts = await db.getPosts()
  expect(res.json).toHaveBeenCalledWith({posts: actualPosts})
  const {posts} = res.json.mock.calls[0][0]
  expect(posts).toEqual(actualPosts)
})

test('getPost returns the specific post', async () => {
  // here you'll need to Arrange, Act, and Assert
  // Arrange:
  //   - create a test post and insert it into the database using `await db.insertPost(generate.postData())`
  //   - set up the req and res mock objects. Make sure the req.params has the test post ID
  // Act: Call getPost on the postsController with the req and res
  // Assert:
  //   - ensure that your mock object functions were called properly
  //   - BONUS: ensure that the post you got back is the same one in the db
  const testPost = await db.insertPost(generate.postData())
  const req = {
    params: {id: testPost.id},
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

  await postsController.getPost(req, res)
  expect(res.json).toHaveBeenCalledTimes(1)
  const actualPost = await db.getPost(req.params.id)
  expect(res.json).toHaveBeenCalledWith({post: actualPost})
  expect(res.status(400).send).toHaveBeenCalledTimes(0)
  const {post} = res.json.mock.calls[0][0]
  expect(post).toEqual(testPost)
  expect(post).toEqual(actualPost)
})

test('updatePost updates the post with the given changes', async () => {
  // BONUS: If you have extra time, try to implement this test as well!
  const title = generate.title()
  const testPost = await db.insertPost(generate.postData())
  const req = {
    params: {
      id: testPost.id,
    },
    body: {title},
    user: {id: testPost.authorId},
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

  await postsController.updatePost(req, res)
  expect(res.json).toHaveBeenCalledTimes(1)
  expect(res.status(400).send).toHaveBeenCalledTimes(0)
  expect(res.status(403).send).toHaveBeenCalledTimes(0)
  const {post} = res.json.mock.calls[0][0]
  expect(post).toEqual({...testPost, title})
  const actualPost = await db.getPost(post.id)
  expect(post).toEqual(actualPost)
})

// Here's where you'll add your new `deletePost` tests!
// - Think more about use cases than code coverage and use those use cases to title your tests
// - Write the code and tests iteratively as little as necessary at a time.
// - Create and use a `setup` test object(s) factory to keep your tests focused

//////// Elaboration & Feedback /////////
// When you've finished with the exercises:
// 1. Copy the URL below into your browser and fill out the form
// 2. remove the `.skip` from the test below
// 3. Change submitted from `false` to `true`
// 4. And you're all done!
/*
http://ws.kcd.im/?ws=Testing&e=postsController&em=
*/
test.skip('I submitted my elaboration and feedback', () => {
  const submitted = false // change this when you've submitted!
  expect(submitted).toBe(true)
})
////////////////////////////////
