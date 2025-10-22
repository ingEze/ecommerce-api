import { ForbiddenUserError, ProductNotFoundError, UserNotFoundError } from '@ingeze/api-error'
import { ObjectId, FilterQuery } from 'mongoose'
import { Products } from '../models/product.schema.js'
import { User } from '../models/user.schema.js'
import { IProductSchema, ProductDto, ProductUpdateDto } from '../types/product.types.js'

export class ProductRepository {
  async getMountProducts(filter: object = {}): Promise<number> {
    return await Products.countDocuments(filter)
  }

  async getAllProducts(
    page: number,
    limit: number,
    filter: {
      title?: string,
      minPrice?: number | string,
      maxPrice?: number,
      sort?: 'price_asc' | 'price_desc'
    } = {}
  ): Promise<IProductSchema[]> {

    const query: FilterQuery<IProductSchema> = {
      deletedAt: { $exists: false },
      quantity: { $gt: 0 },
      isActive: true
    }

    if (filter?.title) {
      query.title = { $regex: filter.title, $options: 'i' }
    }

    if (filter?.minPrice || filter?.maxPrice) query.price = {}

    if (filter.minPrice) {
      if (filter.minPrice === 'free') {
        query.price.$eq = 0
      } else {
        query.price.$gte = Number(filter.minPrice)
      }
    }

    if (filter.maxPrice) {
      query.price.$lte = filter.maxPrice
    }

    const sortOrder = filter.sort === 'price_desc' ? -1 : 1
    const products = await Products
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ price: sortOrder })

    return products
  }

  async getUserById(userId: ObjectId): Promise<string> {
    const user = await User.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user?.username
  }

  async getProductById(productId: string): Promise<IProductSchema> {
    const product = await Products.findOne({
      _id: productId,
      deletedAt: { $exists: false }
    })
    if (!product) throw new ProductNotFoundError()
    return product
  }

  async createProducts(userId: string, data: ProductDto): Promise<IProductSchema> {
    const existingProduct = await Products.findOne({
      title: data.title,
      owner: userId
    })
    if (existingProduct) {
      existingProduct.quantity += data.quantity ? data.quantity : 1
      await existingProduct.save()

      await User.findByIdAndUpdate(userId,
        { $addToSet: { products: existingProduct._id } }
      )

      return existingProduct
    }

    const product = await Products.create({ ...data, owner: userId })
    await User.findByIdAndUpdate(userId,
      { $push: { products: product._id } }
    )

    return product
  }

  async updateProducts(userId: string, productId: string, data: ProductUpdateDto): Promise<void> {
    const user = await User.findById(userId).populate('products')
    if (!user) throw new UserNotFoundError()

    const products = user?.products as IProductSchema[] | undefined
    const product = products?.find(p => p._id.toString() === productId)

    if (!product) throw new ProductNotFoundError({ reason: 'Product not found in user' })

    await Products.updateOne(
      { _id: product },
      { $set: data }
    )
  }

  async deleteProduct(userId: string, productId: string): Promise<void> {
    const product = await Products.findById(productId)
    if (!product) throw new ProductNotFoundError()

    const user = await User.findById(userId)
    if (!user) throw new UserNotFoundError()

    const role = user?.role
    const owner = product?.owner

    if (userId !== owner.toString() && !role?.includes('Admin')) {
      throw new ForbiddenUserError({ reason: 'You do not have permission to delete this item' })
    }

    await Products.findByIdAndUpdate(
      product._id,
      { deletedAt: new Date(), isActive: false }
    )
  }
}
