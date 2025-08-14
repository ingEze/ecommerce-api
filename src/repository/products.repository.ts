import { ForbiddenUserError, ProductNotFoundError, UserNotFoundError } from '@ingeze/api-error'
import { ObjectId } from 'mongoose'
import { Products } from 'src/models/product.schema.js'
import { User } from 'src/models/user.schema.js'
import { IProductSchema, ProductDto, ProductUpdateDto } from 'src/types/product.types.js'

export class ProductRepository {
  async getMountProducts(filter: object = {}): Promise<number> {
    return await Products.countDocuments(filter)
  }

  async getAllProducts(page: number, limit: number, filter: { title?: string } = {}): Promise<IProductSchema[]> {
    let products

    if (filter?.title) {
      products = await Products
        .find({
          title: { $regex: filter.title, $options: 'i' }
        })

      return products
    }

    products = await Products
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)

    return products
  }

  async getUserById(userId: ObjectId): Promise<string> {
    const user = await User.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user?.username
  }

  async getProductById(productId: string): Promise<IProductSchema> {
    const product = await Products.findById(productId)
    if (!product) throw new ProductNotFoundError()
    return product
  }

  async createProducts(userId: string, data: ProductDto): Promise<IProductSchema> {
    const existingProduct = await Products.findOne({ title: data.title, owner: userId })
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

    const role = user?.role
    const owner = product?.owner

    if (userId !== owner.toString() && !role?.includes('Admin')) {
      throw new ForbiddenUserError({ reason: 'You do not have permission to delete this item' })
    }
  }
}
