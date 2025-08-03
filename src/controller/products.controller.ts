import { BadRequestError, ValidationProductError } from '@ingeze/api-error'
import { NextFunction, Request, Response } from 'express'
import { validatePaginationParams } from 'src/dtos/pagination.dto.js'
import { ProductUpdateValidation, ProductValidation } from 'src/dtos/product.dto.js'
import { ProductsService } from 'src/service/products.service.js'
import { ProductDto } from 'src/types/product.types.js'
import { getCurrentUserById } from 'src/utils/getCurrentUserID.js'

export class ProtectedController {
  constructor(private readonly productsService: ProductsService) {}
  getAllProducts = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20

      validatePaginationParams(page || 1, limit || 20)

      const result = await this.productsService.getAllProducts(page, limit)
      const products = result.products

      const pagination = {
        current_page: result.page,
        limit: result.limit,
        total_products: result.totalProducts,
        total_page: result.totalPage,
        count: result.products.length
      }

      if (result.products.length === 0) {
        res.status(200).json({
          suucess: true,
          message: 'No products found',
          pagination,
          products: {}
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        pagination: pagination,
        data: {
          products
        }
      })
    } catch (err) {
      next(err)
    }
  }

  getProductById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const result = await this.productsService.getProductById(id)
      res.status(200).json({
        success: true,
        message: 'Products',
        data: result
      })
    } catch (err) {
      next(err)
    }
  }

  addProduct = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = ProductValidation(req.body)
      if (!validated) throw new BadRequestError({ reason: validated })

      const userId = getCurrentUserById(req)

      const result: ProductDto[] = await Promise.all(
        validated.map(product => this.productsService.createProduct(userId, product))
      )

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product: result
      })
    } catch (err) {
      next(err)
    }
  }

  updateProduct = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validateData = ProductUpdateValidation(req.body)

      const { id: productId } = req.params
      if (!productId) throw new BadRequestError({ reason: 'Query empty' })

      if (!validateData) {
        throw new ValidationProductError({ reason: validateData })
      }

      const userId = getCurrentUserById(req)

      const result = await this.productsService.updateProduct(userId, productId, validateData)
      console.log(result)

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product: result
      })
    } catch (err) {
      console.error(err)
      next(err)
    }
  }
}
