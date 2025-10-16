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
            expect(res.body.message).toMatch(/validated|successfully/i)
        })
    })

    describe('PATH /users/me/username', () => {
        it('should change username successfully', async () => {
            const res = await request(app)
                .patch('/users/me/username')
                .set('Authorization', token)
                .send({ 
                    username: 'testUserUpdate',
                    password: 'Password123!'
                })
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('message')
            expect(res.body).toHaveProperty('data')
            expect(res.body.message).toMatch(/updated|successfully/)
            expect(typeof res.body.data.username).toBe('string')
        })

        it('should return 401 when changing username with wrong password', async () => {
            const res = await request(app)
                .patch('/users/me/username')
                .set('Authorization', token)
                .send({
                    username: 'newUsername',
                    password: 'wrongPassword!'
                })
                expect([400, 401]).toContain(res.statusCode)
                expect(res.body).toHaveProperty('error')
                expect(JSON.parse(res.body.error).reason).toMatch(/invalid|password|credentials/i)

        })
    })

    describe('PATH /users/me/password', () => {
        it('should change the user\' password', async () => {
            const res = await request(app)
                .patch('/users/me/password')
                .set('Authorized', token)
                .send({
                    password: 'newPassword123!',
                    currentPassword: 'Password123!'
                })
                expect(res.statusCode).toBe(200)
                expect(res.body).toHaveProperty('message')
                expect(res.body.message).toMatch(/updated|successfully/i)
        })
        it('should return 401 when changing password with wrong current password', async () => {
            const res = await request(app)
                .patch('/users/me/password')
                .set('Authorized', token)
                .send({
                    password: 'newPassword123!',
                    currentPassword: 'Password1234!'
                })
                expect(res.statusCode).toBe(401)
                expect(res.body).toHaveProperty('error')
                expect(JSON.parse(res.body.error).reason).toMatch(/invalid|password|credentials/i)
        })
    })

    describe('PATH /users/me/email', () => {
        it('should change the user\'s email', async () => {
            const res = await request(app)
                .patch('/users/me/email')
                .set('Authorization', token)
                .send({
                    email: 'newEmail@example.com',
                    password: 'Password123!'
                })

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toMatch(/updated|successfully/i)
            expect(res.body).toHaveProperty('data')
            expect(typeof res.body.data.email).toBe('string')
        })

        it('should return 400 when changing email with wrong password', async () => {
            const res = await request(app)
                .patch('/users/me/email')
                .set('Authorization', token)
                .send({
                    email: 'newEmail@example.com',
                    password: 'wrongPassword123!'
                })

            expect([400, 401]).toContain(res.statusCode)
            expect(res.body).toHaveProperty('error')
            expect(JSON.parse(res.body.error).reason).toMatch(/invalid|password|credentials/i)
        })
    })

    describe('PATH /users/me/status', () => {
        it('should change the user\'s status to active', async () => {
            const res = await request(app)
              .patch('/users/me/status')
              .set('Authorization', token)
              .send({
                  isActive: false,
                  password: 'Password123!'
              })
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toMatch(/activated|disabled/i)
        })
    })
})