import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../src/main'

describe('Users API', () => {
    let token: string

    beforeAll(() => {
        token = 'Bearer access_token'
    })

    describe('GET /users/:username', () => {
        it('should get all products from user by username', async () => {
            const res = await request(app).get('/users/testuser')
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('success')
			expect(res.body).toHaveProperty('message')
			expect(res.body).toHaveProperty('pagination')
			expect(res.body).toHaveProperty('data')
            expect(Array.isArray(res.body.data.products)).toBe(true)
        })
    })

    describe('PATH /users/verify/:token', () => {
        it('should validate account user by token', async () => {
            const res = await request(app).patch('/users/verify/123456789asdfghjkl')
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toMatch(/validated|successfully/)
        })
    })
})