import { BadRequestError, ValidationProductError } from '@ingeze/api-error'
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { validatePaginationParams } from '../dtos/pagination.dto.js'
import { ProductUpdateValidation, ProductValidation } from '../dtos/product.dto.js'
import { validateQuerys } from '../dtos/productsQuery.dto.js'
import { ProductsService } from '../service/products.service.js'
import { IQueryDTO, ProductDto } from '../types/product.types.js'
import { getCurrentUserById } from '../utils/getCurrentUserID.js'

export class ProtectedController {
  constructor(private readonly productsService: ProductsService) {}
  getAllProducts = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20

      const querys: IQueryDTO = {
        username: req.query.user?.toString(),
        search: req.query.search?.toString(),

        minPrice: req.query.minPrice === 'free'
          ? 'free'
          : req.query.minPrice
            ? Number(req.query.minPrice)
            : undefined,

        maxPrice: req.query.maxPrice
          ? Number(req.query.maxPrice)
          : undefined,

        sort: typeof req.query.sort === 'string' &&
        (req.query.sort === 'price_asc' || req.query.sort === 'price_desc')
          ? req.query.sort
          : undefined
      }

      validateQuerys(querys)
      validatePaginationParams(page || 1, limit || 20)

      const result = await this.productsService.getAllProducts(page, limit, querys)

      const { products, ...pagination } = result

      if (result.products.length === 0) {
        res.status(200).json({
          success: true,
          message: 'No products found',
          pagination,
          data: {
            products: []
          }
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
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError({ reason: 'Invalid ID' })
      }

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
      let validated
      try {
        validated = ProductValidation(req.body)
      } catch (err) {
        if (err instanceof Error && err.name === 'ZodError') {
          throw new BadRequestError({ reason: 'Invalid product data' })
        }
        throw err
      }

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

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product: result
      })
    } catch (err) {
      next(err)
    }
  }

  deletedProduct = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id: productId } = req.params
      const userId = getCurrentUserById(req)

      await this.productsService.deleteProduct(userId, productId)

      res.status(200).json({
        success: true,
        message: 'Product removed successfully'
      })
    } catch (err) {
      next(err)
    }
  }
}
