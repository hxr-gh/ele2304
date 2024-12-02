import type { IMenuList } from '@/types'
import axios from './base'

//商家整体商品列表
export const fetchGoodsListData = (shopId: string) => {
  return axios.get<IMenuList, IMenuList>('goods_list', {
    params: {
      shopId
    }
  })
}
