import { describe, it, beforeAll, expect } from "vitest"

describe('Wishlist API', () => {
    let token: string
    beforeAll(() => {
        token = 'Bearer access_token'
    })

    describe('GET /wishlist/', () => {
        it('should get all products from wishlist', async () => {
            const res = await request(app)
                .get('/wishlist/')
                .set('Authorization', token)

            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('products')
            expect(Array.isArray(res.body.products)).toBe(true)
        })
    })

    describe('POST /wishlist/:productId', () => {
        it('should add produt to wishlist', async () => {
            const res = await request(app)
                .post('/wishlist/671f50b7d4dbeff95c3d9b33')
                .set('Authorization', token)
                
            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('message')
            expect(res.body).toHaveProperty('data')
            expect(res.body.message).toMatch(/added|successfully/i)
            expect(res.body.data).toHaveProperty('userId')
            expect(res.body.data).toHaveProperty('products')
            expect((typeof res.body.data.userId)).toBe('string')
            expect(Array.isArray(res.body.data.products)).toBe(true)
        })
    })

    describe('DELETE /wishlist/:productId', () => {
        it('should delete product to wishlist sucessfully', async () => {
            const res = await request(app)
                .delete('/wishlist/671f50b7d4dbeff95c3d9b33')
                .set('Authorization', token)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('message')
            expect(res.body.message).toMatch(/removed|successfully/i)
        })
    })
})

import app from '../src/main'
import request from 'supertest' 