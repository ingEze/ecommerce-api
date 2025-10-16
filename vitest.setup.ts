/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { UserRepository } from 'src/repository/user.repository.js'
import { UserService } from 'src/service/user.service.js'
import { IGetAllProducts, IProductSchema } from 'src/types/product.types.js'
import { vi } from 'vitest'

const userService = new UserService(new UserRepository())

vi.mock('nodemailer', () => {
  return {
    createTransport: vi.fn().mockReturnValue({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'mocked-message-id' })
    })
  }
})

vi.mock('@ingeze/api-error', () => {
  return {
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
    ProductNotFoundError: class ProductNotFoundError extends Error {
      status = 404
      constructor(msg?: any) {
        super(typeof msg === 'string' ? msg : JSON.stringify(msg || { reason: 'Product not found' }))
      }
    },
    UserNotFoundError: class UserNotFoundError extends Error {
      status = 404
      constructor(msg?: any) {
        super(typeof msg === 'string' ? msg : JSON.stringify(msg || { reason: 'User not found' }))
      }
    },
    ValidationProductError: class ValidationProductError extends Error {
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
    },
    InvalidCredentialsError: class InvalidCredentialsError extends Error {
      status = 401
      constructor(msg: any) {
        super(typeof msg === 'string' ? msg : JSON.stringify(msg))
      }
    },
    UserValidationError: class UserValidationError extends Error {
      status = 400
      constructor(msg: any) {
        super(typeof msg === 'string' ? msg : JSON.stringify(msg))
      }
    },
    EmailNotFoundError: class EmailNotFoundError extends Error {
      status = 404
      constructor(msg: any) {
        super(typeof msg === 'string' ? msg : JSON.stringify(msg))
      }
    }
  }
})

vi.mock('@ingeze/api-error/express', () => ({
  expressErrorMiddleware: (err: any, req: any, res: any, next: any) => {
    const statusCode = err.status || err.statusCode || 500
    res.status(statusCode).json({ error: err.message })
  }
}))

// MOCK MONGOOSE
vi.mock('mongoose', async() => {
  const actual = await vi.importActual('mongoose')

  const MockSchema = class {
    constructor(obj: any) {
      return obj
    }
  }

  return {
    ...actual,
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    Schema: MockSchema,
    model: vi.fn().mockImplementation((name) => {
      return {
        findOne: vi.fn().mockResolvedValue(null),
        findById: vi.fn().mockResolvedValue(null),
        find: vi.fn().mockReturnValue({
          skip: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              sort: vi.fn().mockResolvedValue([])
            })
          })
        }),
        create: vi.fn().mockResolvedValue({}),
        updateOne: vi.fn().mockResolvedValue({}),
        findByIdAndUpdate: vi.fn().mockResolvedValue({}),
        countDocuments: vi.fn().mockResolvedValue(0)
      }
    }),
    Types: {
      ObjectId: {
        isValid: (id: string) => /^[0-9a-f]{24}$/i.test(id)
      }
    }
  }
})

// MOCK SCHEMAS
vi.mock('src/models/user.schema', () => ({
  User: {
    findById: vi.fn((id) => ({
      populate: vi.fn().mockResolvedValue({
        _id: id || '671f50b7d4dbeff95c3d9b33',
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'hashed_Password123!',
        role: ['User'],
        isActive: true,
        products: [],
        save: vi.fn()
      })
    })),
    findByIdAndUpdate: vi.fn().mockResolvedValue({}),
    findOne: vi.fn((query) => {
      if (
        (query && query.email === 'testuser@example.com') ||
        (query && query.username === 'testuser')
      ) {
        return Promise.resolve({
          _id: '671f50b7d4dbeff95c3d9b33',
          email: 'testuser@example.com',
          username: 'testuser',
          password: 'hashed_Password123!',
          role: ['User'],
          isActive: true,
          products: [],
          save: vi.fn()
        })
      }
      return Promise.resolve(null)
    }),
    countDocuments: vi.fn().mockResolvedValue(0),
    find: vi.fn().mockReturnValue({
      skip: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          sort: vi.fn().mockResolvedValue([])
        })
      })
    }),
    create: vi.fn().mockImplementation((data) =>
      Promise.resolve({
        ...data,
        _id: '671f50b7d4dbeff95c3d9b34',
        save: vi.fn()
      })
    )
  }
}))

vi.mock('src/models/product.schema', () => {
  return {
    Products: {
      findOne: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation((data) =>
        Promise.resolve({
          ...data,
          _id: 'mocked_product_id',
          owner: '671f50b7d4dbeff95c3d9b33',
          save: vi.fn(),
          toObject: vi.fn().mockReturnValue({
            ...data,
            _id: 'mocked_product_id',
            owner: '671f50b7d4dbeff95c3d9b33'
          })
        })
      ),
      find: vi.fn().mockReturnValue({
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        sort: vi.fn().mockResolvedValue([
          {
            _id: 'mocked_product_id',
            title: 'Test Product',
            price: 10,
            description: 'A test product',
            quantity: 2,
            owner: '671f50b7d4dbeff95c3d9b33'
          }
        ])
      }),
      findById: vi.fn().mockImplementation((id) => {
        if (id === 'mocked_product_id') {
          return Promise.resolve({
            _id: id,
            title: 'Test Product',
            price: 10,
            description: 'A test product',
            quantity: 2,
            owner: '671f50b7d4dbeff95c3d9b33',
            deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1 }),
            save: vi.fn().mockResolvedValue(true)
          })
        }
        if (id === '507f1f77bcf86cd799439011') {
          return Promise.resolve({
            _id: id,
            title: 'Other User Product',
            price: 10,
            description: 'A test product',
            quantity: 2,
            owner: 'different_user_id_123',
            deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1 }),
            save: vi.fn().mockResolvedValue(true)
          })
        }
        return Promise.resolve(null)
      }),
      findByIdAndUpdate: vi.fn().mockImplementation((id, update) => {
        if (id === 'mocked_product_id') {
          return Promise.resolve({
            _id: id,
            title: 'Test Product',
            price: update.$set?.price || update.price || 10,
            description: 'A test product',
            quantity: 2,
            owner: '671f50b7d4dbeff95c3d9b33'
          })
        }
        return Promise.resolve(null)
      }),
      deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1 }),
      countDocuments: vi.fn().mockResolvedValue(1)
    }
  }
})

vi.mock('src/models/order.schema', () => ({
  Order: {
    findOne: vi.fn().mockResolvedValue(null),
    findById: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({}),
    updateOne: vi.fn().mockResolvedValue({}),
    find: vi.fn().mockReturnValue({
      skip: vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnValue({
          sort: vi.fn().mockResolvedValue([])
        })
      })
    })
  }
}))

vi.mock('src/models/payment.schema', () => ({
  Payment: {
    findOne: vi.fn().mockResolvedValue(null),
    findById: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({}),
    updateOne: vi.fn().mockResolvedValue({}),
    find: vi.fn().mockResolvedValue([])
  }
}))

// MOCK MIDDLEWARE
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

vi.mock('src/middleware/userRole.middleware', () => ({
  roleUserMiddleware: (req: any, res: any, next: any) => {
    next()
  }
}))

vi.mock('src/middleware/checkIsActive.middleware', () => ({
  checkIsActive: (req: any, res: any, next: any) => {
    next()
  }
}))

vi.mock('src/middleware/rateLimit.middleware', () => ({
  globalRateLimiter: (req: any, res: any, next: any) => next(),
  authRateLimiter: (req: any, res: any, next: any) => next(),
  forgotPasswordRateLimiter: (req: any, res: any, next: any) => next(),
  loginRateLimiter: (req: any, res: any, next: any) => next()
}))

vi.mock('src/middleware/morgan.middleware', () => ({
  morganMiddleware: (req: any, res: any, next: any) => next()
}))

vi.mock('src/middleware/errorLogger.middleware', () => ({
  errorLogger: (req: any, res: any, next: any) => next()
}))

vi.mock('src/middleware/index', () => ({
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
  },
  checkIsActive: (req: any, res: any, next: any) => {
    next()
  },
  roleUserMiddleware: (req: any, res: any, next: any) => {
    next()
  },
  morganMiddleware: (req: any, res: any, next: any) => {
    next()
  },
  errorLogger: (err: any, req: any, res: any, next: any) => {
    next(err)
  },
  authRateLimiter: (req: any, res: any, next: any) => next(),
  forgotPasswordRateLimiter: (req: any, res: any, next: any) => next(),
  globalRateLimiter: (req: any, res: any, next: any) => next()
}))

// MOCK REPOSITORIES
vi.mock('src/repository/user.repository', () => ({
  UserRepository: class {
    findUserById = vi.fn().mockResolvedValue({
      _id: '671f50b7d4dbeff95c3d9b33',
      email: 'testuser@example.com',
      username: 'testuser',
      password: 'hashed_Password123!',
      role: ['User'],
      isActive: true
    })
    findUserByUsername = vi.fn().mockImplementation((username) => {
      if (username === 'testuser') {
        return Promise.resolve({
          _id: '671f50b7d4dbeff95c3d9b33',
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'hashed_Password123!',
          role: ['User'],
          isActive: true
        })
      }
      return Promise.resolve(null)
    })
    findUserByEmail = vi.fn().mockImplementation((email) => {
      if (email === 'testuser@example.com') {
        return Promise.resolve({
          _id: '671f50b7d4dbeff95c3d9b33',
          email: 'testuser@example.com',
          username: 'testuser',
          password: 'hashed_Password123!',
          role: ['User'],
          isActive: true
        })
      }
      return Promise.resolve(null)
    })
    getStatusAccount = vi.fn().mockResolvedValue(true)
    createUser = vi.fn().mockImplementation((data) =>
      Promise.resolve({
        ...data,
        _id: '671f50b7d4dbeff95c3d9b34',
        save: vi.fn()
      })
    )
    updatePassword = vi.fn().mockResolvedValue(undefined)
    getProducts = vi.fn().mockResolvedValue([
      {
        _id: 'prod1',
        title: 'Mock Product 1',
        price: 10,
        description: 'A test product',
        quantity: 5,
        owner: 'user123'
      }
    ])
    updateStatusAccount = vi.fn().mockResolvedValue({})
    updateUsername = vi.fn().mockResolvedValue({ username: 'testUpdated' })
    updateEmail = vi.fn().mockResolvedValue({ email: 'newEmail@example.com' })
  }
}))

vi.mock('src/repository/products.repository', () => ({
  ProductRepository: class {
    createProduct = vi.fn().mockImplementation((data) =>
      Promise.resolve({
        ...data,
        _id: 'mocked_product_id',
        owner: '671f50b7d4dbeff95c3d9b33'
      })
    )

    getAllProducts = vi.fn().mockResolvedValue({
      products: [
        {
          _id: 'mocked_product_id',
          title: 'Test Product',
          price: 10,
          description: 'A test product',
          quantity: 2,
          owner: 'mocked_username'
        }
      ],
      totalProducts: 1
    })

    getProductById = vi.fn().mockImplementation((id) => {
      if (id === 'mocked_product_id' || id === '507f1f77bcf86cd799439011') {
        return Promise.resolve({
          _id: id,
          title: 'Test Product',
          price: 10,
          description: 'A test product',
          quantity: 2,
          owner: id === 'mocked_product_id' ? '671f50b7d4dbeff95c3d9b33' : 'different_user_id_123'
        })
      }
      return Promise.resolve(null)
    })

    updateProducts = vi.fn().mockImplementation((productId, userId, updateData) => {
      if (productId === 'mocked_product_id') {
        return Promise.resolve({
          _id: productId,
          title: 'Test Product',
          price: updateData.price || 10,
          description: updateData.description || 'A test product',
          quantity: updateData.quantity || 2,
          owner: userId
        })
      }
      const ProductNotFoundError = class extends Error {
        status = 404
        constructor(msg: any) {
          super(typeof msg === 'string' ? msg : JSON.stringify(msg))
          this.name = 'ProductNotFoundError'
        }
      }
      throw new ProductNotFoundError({ reason: 'Product not found in user' })
    })

    deleteProduct = vi.fn().mockImplementation((productId, userId) => {
      if (productId === 'mocked_product_id' && userId === '671f50b7d4dbeff95c3d9b33') {
        return Promise.resolve({
          success: true,
          message: 'Product deleted successfully'
        })
      }
      if (productId === '507f1f77bcf86cd799439011') {
        const ForbiddenUserError = class extends Error {
          status = 403
          constructor(msg: any) {
            super(typeof msg === 'string' ? msg : JSON.stringify(msg))
            this.name = 'ForbiddenUserError'
          }
        }
        throw new ForbiddenUserError({ reason: 'You are not the owner of this product' })
      }
      const ProductNotFoundError = class extends Error {
        status = 404
        constructor(msg: any) {
          super(typeof msg === 'string' ? msg : JSON.stringify(msg))
          this.name = 'ProductNotFoundError'
        }
      }
      throw new ProductNotFoundError({ reason: 'Product not found' })
    })

    addProductsToUser = vi.fn().mockResolvedValue(undefined)
  }
}))

vi.mock('src/repository/auth.repository', () => ({
  AuthRepository: class {
    findUserByEmail = vi.fn().mockImplementation((email) => {
      if (email === 'testuser@example.com') {
        return Promise.resolve({
          _id: '671f50b7d4dbeff95c3d9b33',
          email: 'testuser@example.com',
          username: 'testuser',
          password: 'hashed_Password123!',
          role: ['User'],
          isActive: true
        })
      }
      return Promise.resolve(null)
    })
    findUserByUsername = vi.fn().mockImplementation((username) => {
      if (username === 'testuser') {
        return Promise.resolve({
          _id: '671f50b7d4dbeff95c3d9b33',
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'hashed_Password123!',
          role: ['User'],
          isActive: true
        })
      }
      return Promise.resolve(null)
    })
  }
}))

vi.mock('src/repository/wishlist.repository', () => ({
  WishlistRepository: class WishlistRepository {
    getProducts = vi.fn().mockResolvedValue(
      [{
        userId: '671f50b7d4dbeff95c3d9b33',
        products: {
          productId: {
            _id: 'mocked_id',
            title: 'mock_title',
            price: 24
          }
        }
      }]
    )
    addProduct = vi.fn().mockResolvedValue({
      userId: '671f50b7d4dbeff95c3d9b33',
      products: [{
        productId: 'mocked_product_id'
      }]
    })
    deleteProductToWishlist = vi.fn().mockResolvedValue({})
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

// MOCK SERVICES
const mockProducts = [
  {
    _id: 'prod1',
    title: 'Mock Product 1',
    price: 10,
    description: 'A test product',
    quantity: 5,
    owner: 'user123'
  },
  {
    _id: 'prod2',
    title: 'Mock Product 2',
    price: 20,
    description: 'Another test product',
    quantity: 3,
    owner: 'user123'
  }
]
vi.spyOn(userService, 'getProductsByUser').mockImplementation(
  (page: number, limit: number, username: string): Promise<IGetAllProducts> => {
    const totalProducts = mockProducts.length
    const totalPage = Math.ceil(totalProducts / limit)

    return Promise.resolve({
      page,
      limit,
      totalPage,
      totalProducts,
      products: mockProducts as unknown as IProductSchema[]
    })
  }
)
vi.spyOn(userService, 'activeAccount').mockResolvedValue()
vi.spyOn(userService, 'updateUsername').mockResolvedValue({ username: 'testUpdated' })
vi.spyOn(userService, 'updateStatusAccount').mockResolvedValue()

vi.mock('src/service/products.service', () => ({
  ProductsService: class {
    createProduct = vi.fn().mockImplementation((userId, productData) =>
      Promise.resolve({
        _id: 'mocked_product_id',
        title: productData.title,
        price: productData.price,
        description: productData.description,
        quantity: productData.quantity,
        owner: userId
      })
    )

    getAllProducts = vi.fn().mockResolvedValue({
      products: [
        {
          _id: 'mocked_product_id',
          title: 'Test Product',
          price: 10,
          description: 'A test product',
          quantity: 2,
          owner: 'mocked_username'
        }
      ],
      totalProducts: 1,
      totalPages: 1,
      currentPage: 1
    })

    getProductById = vi.fn().mockImplementation((id) => {
      if (id === 'mocked_product_id' || id === '507f1f77bcf86cd799439011') {
        return Promise.resolve({
          _id: id,
          title: 'Test Product',
          price: 10,
          description: 'A test product',
          quantity: 2,
          owner: id === 'mocked_product_id' ? 'mocked_username' : 'other_user'
        })
      }
      return Promise.resolve(null)
    })

    updateProduct = vi.fn().mockImplementation((userId, productId, updateData) => {
      if (productId === 'mocked_product_id') {
        return Promise.resolve({
          _id: productId,
          title: updateData.title || 'Test Product',
          price: updateData.price || 10,
          description: updateData.description || 'A test product',
          quantity: updateData.quantity || 2,
          owner: userId
        })
      }
      const ProductNotFoundError = class extends Error {
        status = 404
        constructor(msg: any) {
          super(typeof msg === 'string' ? msg : JSON.stringify(msg))
          this.name = 'ProductNotFoundError'
        }
      }
      throw new ProductNotFoundError({ reason: 'Product not found' })
    })

    deleteProduct = vi.fn().mockImplementation((userId, productId) => {
      if (productId === 'mocked_product_id' && userId === '671f50b7d4dbeff95c3d9b33') {
        return Promise.resolve({
          success: true,
          message: 'Product deleted successfully'
        })
      }
      if (productId === '507f1f77bcf86cd799439011') {
        const ForbiddenUserError = class extends Error {
          status = 403
          constructor(msg: any) {
            super(typeof msg === 'string' ? msg : JSON.stringify(msg))
            this.name = 'ForbiddenUserError'
          }
        }
        throw new ForbiddenUserError({ reason: 'You are not the owner of this product' })
      }
      const ProductNotFoundError = class extends Error {
        status = 404
        constructor(msg: any) {
          super(typeof msg === 'string' ? msg : JSON.stringify(msg))
          this.name = 'ProductNotFoundError'
        }
      }
      throw new ProductNotFoundError({ reason: 'Product not found' })
    })
  }
}))

vi.mock('src/service/email.service', () => ({
  EmailService: class {
    sendVerificationAccountEmail = vi.fn().mockResolvedValue(undefined)
    sendResetEmail = vi.fn().mockResolvedValue(undefined)
  }
}))

vi.mock('src/service/wishlist.service', () => ({
  WishlistService: class WishlistService {
    getProductToWishlist = vi.fn().mockResolvedValue(
      [{
        userId: '671f50b7d4dbeff95c3d9b33',
        products: {
          productId: {
            _id: 'mocked_id',
            title: 'mock_title',
            price: 24
          }
        }
      }]
    )
    addProduct = vi.fn().mockResolvedValue({
      userId: '671f50b7d4dbeff95c3d9b33',
      products: [{
        productId: 'mocked_product_id'
      }]
    })
    deleteProductToWishlist = vi.fn().mockResolvedValue({})
  }
}))

// MOCK UTILS
vi.mock('src/utils/hashPassword', () => ({
  comparePassword: vi.fn().mockImplementation((input, hash) => {
    if (input === 'Password123!' && hash === 'hashed_Password123!') {
      return Promise.resolve(true)
    }
    if (input === hash) {
      return Promise.resolve(true)
    }
    return Promise.resolve(false)
  }),
  hashedPassword: vi.fn((password) => Promise.resolve(`hashed_${password}`))
}))

vi.mock('src/utils/jwt', () => ({
  generateAuthToken: vi.fn().mockReturnValue('mocked_access_token'),
  generateRefreshToken: vi.fn().mockReturnValue('mocked_refresh_token'),
  generateAccountActivationToken: vi.fn().mockReturnValue('mocked_activation_token'),
  generateResetTokenForMail: vi.fn().mockReturnValue('mocked_reset_token'),
  verifyResetTokenForMail: vi.fn().mockReturnValue('671f50b7d4dbeff95c3d9b33'),
  verifyAccountActivationToken: vi.fn().mockResolvedValue('671f50b7d4dbeff95c3d9b39')
}))

vi.mock('src/utils/getCurrentUserID', () => ({
  getCurrentUserById: (req: any) => req.user?._id || '671f50b7d4dbeff95c3d9b33'
}))

vi.mock('src/utils/formatProduct', () => ({
  formatProducts: vi.fn().mockImplementation((product) => ({
    title: product.title,
    price: product.price,
    description: product.description,
    quantity: product.quantity,
    owner: 'mocked_username',
    _id: product._id
  }))
}))

vi.mock('src/db/mongoDB/connectDB', () => ({
  connectDB: vi.fn().mockResolvedValue(undefined)
}))

vi.mock('src/utils/firstUserAdmin', () => ({
  createAdminIfNotExists: vi.fn().mockResolvedValue(undefined)
}))

vi.mock('../docs/swagger', () => ({
  setupSwagger: vi.fn()
}))

vi.mock('src/config/index', () => ({
  config: {
    url: {
      PORT: 3033,
      APP_URL: 'http://localhost'
    },
    db: {
      URI: 'mongodb://localhost:27017/mini-ecommerce-api'
    },
    adminUser: {
      ADMIN_EMAIL: 'admin@example.com',
      ADMIN_PASSWORD: 'Admin123!'
    },
    jwt: {
      AUTH_TOKEN_SECRET: '123745',
      AUTH_REFRESH_SECRET: '123745',
      RESET_TOKEN_SECRET: '123745',
      ACCOUNT_ACTIVATE_SECRET: '123745'
    }
  }
}))

vi.mock('src/utils/dataEmptyError', () => ({
  checkRequiredFields: vi.fn()
}))

// MOCK DTOs
vi.mock('src/dtos/auth.dto', () => ({
  ValidateLogin: vi.fn((data) => data),
  registerValidationData: vi.fn((data) => data),
  ValidateResetPassword: vi.fn((data) => data),
  ValidateEmail: vi.fn((data) => data)
}))

vi.mock('src/dtos/products.dto', () => ({
  validateProductData: vi.fn((data) => data),
  validateUpdateProductData: vi.fn((data) => data)
}))

vi.mock('src/dtos/products.dto', () => ({
  validateProductData: vi.fn((data) => data),
  validateUpdateProductData: vi.fn((data) => data)
}))
