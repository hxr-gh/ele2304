import type { IShop, IPaginate, IList, IShopDetail } from '@/types'
import axios from './base'

//商品列表
export const fetchShopList = ({ _page, _limit }: IPaginate) => {
  return axios.get<IList<IShop>, IList<IShop>>('shop_list', {
    params: {
      _page,
      _limit
    }
  })
}

//商品详情
export const fetchShopPageData = (id: string) => {
  return axios.get<IShopDetail, IShopDetail>('shop_page', {
    params: {
      id
    }
  })
}
