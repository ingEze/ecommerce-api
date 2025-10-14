import request from 'supertest'
import { describe, it, expect, beforeAll } from 'vitest'
import app from '../src/main'

describe('Products API', () => {
	let token: string
	let createdProductId: string

	beforeAll(async () => {
		token = 'Bearer access_token'
		createdProductId = 'mocked_product_id'
	})

	describe('POST /protected/products', () => {
		it('should create a new product', async () => {
			const product = [{
				title: 'Test Product',
				price: 10,
				description: 'A test product',
				quantity: 2
			}]
			const res = await request(app)
				.post('/protected/products')
				.set('Authorization', token)
				.send(product)

			expect(res.statusCode).toBe(201)
			expect(res.body).toHaveProperty('product')
			expect(Array.isArray(res.body.product)).toBe(true)
		})

		it('should return 400 for invalid data', async () => {
			const res = await request(app)
				.post('/protected/products')
				.set('Authorization', token)
				.send([{ price: 10 }])

			expect(res.statusCode).toBe(400)
			expect(res.body).toHaveProperty('error')
		})
	})

	describe('GET /protected/products', () => {
		it('should return a list of products', async () => {
			const res = await request(app).get('/protected/products')
			expect(res.status).toBe(200)
			expect(res.body).toHaveProperty('success')
			expect(res.body).toHaveProperty('message')
			expect(res.body).toHaveProperty('pagination')
			expect(res.body).toHaveProperty('data')
			expect(Array.isArray(res.body.data.products)).toBe(true)
		})
	})

	describe('GET /protected/products/:id', () => {
		it('should return 400 for invalid id', async () => {
			const res = await request(app).get('/protected/products/invalidid')
			expect(res.statusCode).toBe(400)
			expect(res.body).toHaveProperty('error')
		})

		it('should return 404 for not found', async () => {
			const res = await request(app).get('/protected/products/fakeID')
			expect([404, 400]).toContain(res.status)
		})
	})

	describe('PATCH /protected/products/:id', () => {
		it('should update a product', async () => {
			const res = await request(app)
				.patch(`/protected/products/${createdProductId}`)
				.set('Authorization', token)
				.send({ price: 20 })

			expect([200, 204]).toContain(res.status)
			expect(res.body).toHaveProperty('success')
		})

		it('should return 400 for invalid id', async () => {
			const res = await request(app)
				.patch('/protected/products/invalidid')
				.set('Authorization', token)
				.send({ price: 20 })

			expect([400, 404]).toContain(res.status)
		})
	})

	describe('DELETE /protected/products/:id', () => {
		it('should delete a product', async () => {
			const res = await request(app)
				.delete(`/protected/products/${createdProductId}`)
				.set('Authorization', token)

			expect([200, 204]).toContain(res.status)
			expect(res.body).toHaveProperty('success')
		})

		it('should return 403 when user is not owner', async () => {
			const res = await request(app)
				.delete('/protected/products/507f1f77bcf86cd799439011')
				.set('Authorization', token)

			expect([403, 404]).toContain(res.status)
		})
	})
})