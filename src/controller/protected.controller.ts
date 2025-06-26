import { BadRequestError, UnauthorizedError } from '@ingeze/api-error'
import { NextFunction, Request, Response } from 'express'
import { validatePaginationParams } from 'src/dtos/pagination.dto.js'
import { ProductValidation } from 'src/dtos/product.dto.js'
import { ProductsService } from 'src/service/protected.service.js'
import { checkRequiredFields } from 'src/utils/dataEmptyError.js'

export class ProtectedController {
  constructor(private readonly productsService: ProductsService) {}
  getAllProducts = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20

      validatePaginationParams(page || 1, limit || 20)

      const result = await this.productsService.getAllProducts(page, limit)

      const productResult = {
        products: result.products,
        totalProducts: result.totalProducts,
        limit: result.limit,
        maxPage: result.maxPage
      }

      res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        pagination: {
          current_page: page,
          limit: productResult.limit,
          total_products: productResult.totalProducts,
          max_page: productResult.maxPage
        },
        data: {
          count: productResult.products.length,
          products: productResult.products
        }
      })
    } catch (err) {
      next(err)
    }
  }

  addProduct = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        title,
        price,
        description,
        quantity
      } = req.body

      checkRequiredFields({ title, price, description })

      if (!ProductValidation({ title, price, description })) {
        throw new BadRequestError({ reason: 'Product data is invalid.' })
      } else if (price <= 0) {
        throw new BadRequestError({ reason: 'Price must be a positive number.' })
      }

      const userId = req.user?._id
      if (!userId) throw new UnauthorizedError({ reason: 'User not authorized' })

      const result = await this.productsService.createProduct(userId, { title, price, description, quantity })

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product: result
      })
    } catch (err) {
      next(err)
    }
  }
}
