import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'

const testUser = {
  email: 'testuser@example.com',
  username: 'testuser',
  password: 'Password123!'
}

describe('Auth API', () => {
  beforeEach(() => {
    vi.spyOn(hashPassword, 'comparePassword').mockImplementation((input: string, hash: string) => {
      if (input === 'Password123!' && hash === 'hashed_Password123!') {
        return Promise.resolve(true)
      }
      if(input === hash) {
        return Promise.resolve(true)
      }
      return Promise.resolve(false)
    })
  })

  afterEach(() => {
        vi.resetAllMocks()
  })

  describe('POST /auth/register', () => {
    it('should register user successfully', async () => {
      const randomEmail = `user_${Date.now()}@test.com`
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: randomEmail,
          username: 'testRandom',
          password: 'Password123!'
        })

      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toMatch(/verification email/i)
    })
  })

  describe('POST /auth/login', () => {
    it('should login user successfully', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toMatch(/login/i)
    })

    it('should login with wrong password', async() => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongPassword123!'
        })

        expect(res.statusCode).toBe(401)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toMatch(/error|incorrect/i)
    })
  })

  describe('PATH /auth/forgot-password', () => {
    it('should request password reset', async () => {
      const res = await request(app)
        .patch('/auth/forgot-password')
        .send({ email: testUser.email })

      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toMatch(/password reset|code sent/i)
    })
  })
})

import request from 'supertest'
import app from '../src/main'
import * as hashPassword from '../src/utils/hashPassword'