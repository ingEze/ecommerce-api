/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { vi } from 'vitest'

vi.mock('@ingeze/api-error', () => ({
  ForbiddenUserError: class ForbiddenUserError extends Error {
    status = 403
    constructor(msg: string) {
      super(msg)
    }
  },
  UnauthorizedError: class UnauthorizedError extends Error {
    status = 401
    constructor(msg: string) {
      super(msg)
    }
  }
}))

vi.mock('mongoose', async() => {
  const actual = await vi.importActual('mongoose')
  return {
    ...actual,
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined)
  }
})

vi.mock('@ingeze/api-error/express', () => ({
  expressErrorMiddleware: (err: any, req: any, res: any, next: any) => {
    res.status(err.status || 500).json({ error: err.message })
  }
}))

vi.mock('@ingeze/api-error', () => ({
  ForbiddenUserError: class ForbiddenUserError extends Error {
    status = 403
    constructor(msg: any) {
      super(typeof msg === 'string' ? msg : JSON.stringify(msg))
    }
  },
  UnauthorizedError: class UnauthorizedError extends Error {
    status = 401
    constructor(msg: any) {
      super(typeof msg === 'string' ? msg : JSON.stringify(msg))
    }
  },
  BadRequestError: class BadRequestError extends Error {
    status = 400
    constructor(msg: any) {
      super(typeof msg === 'string' ? msg : JSON.stringify(msg))
    }
  },
  NotFoundError: class NotFoundError extends Error {
    status = 404
    constructor(msg: any) {
      super(typeof msg === 'string' ? msg : JSON.stringify(msg))
    }
  }
}))

vi.mock('src/middleware/authToken.middleware', () => ({
  authWithRefreshMiddleware: (req: any, res: any, next: any) => {
    req.user = { _id: '671f50b7d4dbeff95c3d9b33' }
    next()
  },
  accessTokenMiddleware: (req: any, res: any, next: any) => {
    req.user = { _id: '671f50b7d4dbeff95c3d9b33' }
    next()
  },
  refreshTokenMiddleware: (req: any, res: any, next: any) => {
    req.user = { _id: '671f50b7d4dbeff95c3d9b33' }
    next()
  }
}))

vi.mock('src/repository/user.repository', () => ({
  UserRepository: class {
    findUserById = vi.fn().mockResolvedValue({
      _id: '671f50b7d4dbeff95c3d9b33',
      role: ['User'],
      isActive: true
    })
    getStatusAccount = vi.fn().mockResolvedValue(true)
  }
}))

const mockOrder = {
  userId: '671f50b7d4dbeff95c3d9b33',
  items: [
    { productId: '671f50b7d4dbeff95c3d9b32', title: 'productTitle', quantity: 2, price: 50 }
  ],
  total: 100,
  totalWithWax: 110,
  status: 'pending',
  shippingAddress: {
    street: '123 Main St',
    city: 'Buenos Aires',
    zip: '1000'
  }
}
vi.mock('src/repository/order.repository', () => ({
  OrderRepository: class {
    createOrder = vi.fn().mockResolvedValue({
      _id: '671f50b7d4dbeff95c3d9b31',
      userId: '671f50b7d4dbeff95c3d9b33',
      items: [],
      total: 79.98,
      status: 'pending'
    })
    checkStock = vi.fn().mockResolvedValue(new Map([
      ['671f50b7d4dbeff95c3d9b32', { stock: 10 }]
    ]))
    getOwners = vi.fn().mockResolvedValue({
      _id: '671f50b7d4dbeff95c3d9b33'
    })
    findPendingOrderById = vi.fn().mockResolvedValue(mockOrder)
    createPaymentRecord = vi.fn().mockResolvedValue({
      paymentId: 'a1b2c3d4e5f6',
      orderId: '68dd83d3ad4827dcd6496b63',
      method: 'credit_card' as const,
      amount: 110,
      status: 'paid' as const,
      currency: 'USD',
      transactionId: 'CC_123456789',
      createdAt: new Date()
    })
    getPendingPaymentByOrderId = vi.fn().mockResolvedValue({
      userId: '671f50b7d4dbeff95c3d9b33',
      method: 'credit_card',
      details: {
        cardNumber: '4111111111111111',
        fistName: 'Maria',
        lastName: 'Gomez',
        expiration: '12/27',
        cvv: '123'
      }
    })
    processPaymentWithTransaction = vi.fn().mockResolvedValue(mockOrder)
    updateProcessPaymentToStatusPaid = vi.fn().mockResolvedValue({
      paymentId: 'a1b2c3d4e5f6',
      status: 'paid',
      orderId: '68eaa00ca6f85da6f99a31a9',
      method: 'credit_card',
      amount: 133.05159999999998,
      currency: 'USD',
      transactionId: 'CC-1760206873170-0.lqfy0qckm0f',
      createdAt: new Date()
    })
    getPaymentsByOrderId = vi.fn().mockResolvedValue({ orderId: '68dd83d3ad4827dcd6496b63' })
  }
}))
