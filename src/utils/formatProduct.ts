import { UserRepository } from '../repository/user.repository.js'
import { IProductSchema } from '../types/product.types.js'

export async function formatProducts(product: IProductSchema): Promise<IProductSchema> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, __v, owner, ...rest } = product.toObject()
  const ownerData = await new UserRepository().findUserById(owner._id)
  return {
    id: _id.toString(),
    ...rest,
    owner: ownerData && typeof ownerData === 'object'
      ? {
        id: ownerData?._id.toString(),
        username: ownerData?.username
      }
      : owner
  }
}
