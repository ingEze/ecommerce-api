import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../src/main'

describe('Orders API', () => {
  let token: string
  
  beforeAll(async () => {
    token = 'Bearer access_token'
  })

  describe('POST /orders', () => {
      it('should create a new order successfully', async () => {
        const newOrder = {
          userId: '671f50b7d4dbeff95c3d9b33',
          items: [
            { productId: '671f50b7d4dbeff95c3d9b32', title: 'Wireless Mouse', price: 39.99, quantity: 2 }
          ],
          total: 79.98,
          totalWithWax: 83.98,
          status: 'pending',
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            zip: '10001'
          }
        }

        const res = await request(app)
          .post('/orders')
          .set('Authorization', token)
          .send(newOrder)

        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty('message', 'Order created successfully')
        expect(res.body).toHaveProperty('data')
      })
  })

  describe('POST /orders/:orderId/process-payment', () => {
    it('should proccess payment successfully', async () => {
      const processPaymentData = {
        userId: '671f50b7d4dbeff95c3d9b33',
        method: "credit_card",
        details: {
          cardNumber: "4111111111111111",
          fistName: "Maria",
          lastName: "Gomez",
          expiration: "12/27",
          cvv: "123"
        }
      }

      const res = await request(app)
        .post('/orders/671f50b7d4dbeff95c3d9b32/process-payment')
        .set('Authorization', token)
        .send(processPaymentData)

      expect(res.statusCode).toBe(200) 
      expect(res.body).toHaveProperty('message', 'Payment processed successfully')
      expect(res.body).toHaveProperty('data')
      expect(res.body).toHaveProperty('nextStep', {
          action: 'confirm_payment',
          endpoint: `/orders/671f50b7d4dbeff95c3d9b32/confirm-payment`,
          description: 'Call this endpoint to finalize the transaction'
      })
    })
  })

  describe('POST /orders/:orderId/confirm-payment', () => {
    it('should confirm payment successfully', async () => {
      const res = await request(app)
        .post('/orders/671f50b7d4dbeff95c3d9b32/confirm-payment')
        .set('Authorization', token)
        .send()

      const paymentId = 'a1b2c3d4e5f6'

      expect(res.statusCode).toBe(201)
      expect(res.body).toHaveProperty('data')
      expect(res.body.data).toHaveProperty('payment')
      expect(res.body.data.order._id).toBeUndefined() 
      expect(res.body.data.payment.paymentId).toBe(paymentId)
    })
  })

  describe('GET /orders/:orderId/payments', () => {
    it('should get all payments', async () => {
      const res = await request(app)
        .get('/orders/671f50b7d4dbeff95c3d9b32/payments')
        .set('Authorization', token)
        
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('data')
    })
  })
})