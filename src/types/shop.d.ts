//商品列表
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

export interface IService {
  type: number //服务的类型
  label: string //具体的服务
}

export interface IActivity {
  type: number //活动的类型
  tips?: string //提示信息
  infos?: string[] //活动的信息
}

//商品详情
export interface IShopDetail extends IShop {
  announcement: string //公告
  discounts: IDiscount[] //优惠
  redbags: IRedbag[] //红包
}

export interface IDiscount {
  type: number //优惠的类型
  label: string //优惠的名称
  content: IDiscountContent[] //优惠的内容
}

export interface IRedbag {
  type: number
  count: number
  if: string //红包的使用条件
}
export interface IDiscountContent {
  if: number //满多少
  count: number //减多少
  limit: number //优惠上限
  label: string //任选优惠文案
}
