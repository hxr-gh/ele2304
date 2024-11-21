export interface IShop {
  activitys: IActivity[] //商家活动
  branch: string //商家分店
  comments: string[] //评论、简介
  deliveryDistance: string //配送距离
  deliveryStrategy: string //配送策略
  deliveryStratingPrice: string //起送费
  deliveryTags: string[] //配送标签
  deliveryTime: string //配送时间
  id: string //商家ID
  monthlyCount: number //月销量
  postUrl: string //头图
  bgUrl: string //背景图
  score: number //评分
  services: IService[] //商家提供服务
  shopName: string //商家店名
  tops: string[] //热销排名信息
}

//商家提供服务
export interface IService {
  type: number //服务的类型
  label: string //具体的服务
}

//商家活动
export interface IActivity {
  type: number //活动的类型
  tips?: string //提示信息
  infos?: string[] //活动的信息
}

//
export interface IShopDetail extends IShop {
  announcement: string
  discounts: IDiscount[]
  redbags: IRedbag[]
}

//
export interface IDiscount {
  type: number
  label: string
  content: IDiscountContent[]
}

//
export interface IRedbag {
  type: number
  count: number
  if: string
}

//
export interface IDiscountContent {
  count: number
  if: number
  limit: number
  label: string
}
