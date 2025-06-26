import { Products } from 'src/models/product.schema.js'
import { User } from 'src/models/user.schema.js'
import { IProductSchema, ProductDto } from 'src/types/product.types.js'

export class ProductRepository {
  async getMountProducts(): Promise<number> {
    return await Products.countDocuments()
  }

  async getAllProducts(page: number, limit: number): Promise<IProductSchema[]> {
    return await Products
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
  }

  async createOrUpdateProducts(userId: string, data: ProductDto): Promise<IProductSchema> {
    const existingProduct = await Products.findOne({ title: data.title, owner: userId })
    if (existingProduct) {
      existingProduct.quantity += 1
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
}
