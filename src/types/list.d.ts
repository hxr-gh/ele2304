export interface IPaginate {
  _page: number
  _limit: number
}

//IShop商家的数组
export interface IList<T> {
  data: T[]
  total: number
}
