import { ProductNotFoundError } from '@ingeze/api-error'
import { Products } from 'src/models/product.schema.js'
import { User } from 'src/models/user.schema.js'
import { IProductSchema, ProductDto, ProductUpdateDto } from 'src/types/product.types.js'

export class ProductRepository {
  async getMountProducts(): Promise<number> {
    return await Products.countDocuments()
  }

  async getAllProducts(page: number, limit: number): Promise<IProductSchema[]> {
    const products = await Products
      .find()
      .populate('owner', '_id username')
      .skip((page - 1) * limit)
      .limit(limit)

    return products
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
}
