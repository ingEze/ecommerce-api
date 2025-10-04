export interface IPagination {
  page: number;
  limit: number;
  totalPage: number;
  totalProducts: number;
}

export function paginate(totalProducts: number, page = 1, limit = 10): IPagination {
  const totalPage = Math.ceil(totalProducts / limit)
  return {
    page,
    limit,
    totalPage,
    totalProducts
  }
}
