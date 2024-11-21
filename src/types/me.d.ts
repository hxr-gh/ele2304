export interface IMeInfo {
  cards: ICard[]
  superCard: ISuperCard
}

export interface ICard {
  label: string //卡片标题
  size: number //图标大小
  items: IItem[] //图标
}

export interface IItem {
  count: number //图标后数字
  iconUrl: string //图标地址
  label: string //图标文案
}

export interface ISuperCard {
  beanCount: number //吃货豆的数量
  tips: string //提示信息
}
