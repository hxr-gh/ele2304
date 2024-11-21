import axios from './base'
import type { IMeInfo } from '@/types'

export const fetchMePageData = () => {
  return axios.get<IMeInfo, IMeInfo>('me_page') //使用两个泛型目的是Promise请求时使用拦截器
}
