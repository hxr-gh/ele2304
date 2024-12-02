import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { IGood } from '@/types'

export interface ICartState {
  items: IGood[]
  checkedIds: number[]
}

export const useCartStore = defineStore('cart', () => {
  const state: ICartState = reactive({
    items: [], //有哪些商品
    checkedIds: [] //勾选了哪些商品
  })

  const total = computed(() => state.items.reduce((p, v) => p + v.cartCount, 0))

  const totalPrice = computed(
    () => state.items.reduce((p, v) => p + v.price * v.cartCount, 0).toFixed(2) //.toFixed(2)保留两位小数
  )

  const totalOldPrice = computed(
    () => state.items.reduce((p, v) => p + v.oldPrice * v.cartCount, 0).toFixed(2) //.toFixed(2)保留两位小数
  )

  const isAllChecked = computed(() => state.items.length === state.checkedIds.length)

  const cartCountById = (id: number) => {
    return state.items.find(v => v.id === id)?.cartCount
  }

  const pushProductToCart = (item: IGood) => {
    const cartItem = state.items.find(v => v.id === item.id)
    //如果购物车里有这个商品的话
    if (cartItem) {
      cartItem.cartCount++
      return
    }
    //购物车里没有这个商品的话
    item.cartCount = 1
    state.items.push(item)
    const isIncluded = state.checkedIds.includes(item.id) //.includes(item.id)是否包含item.id
    if (!isIncluded) {
      state.checkedIds.push(item.id)
    }
  }

  const removeProductToCart = (item: IGood) => {
    const cartItemIndex = state.items.findIndex(v => v.id === item.id)
    const cartItem = state.items[cartItemIndex]
    if (cartItem) {
      cartItem.cartCount--
      if (cartItem.cartCount === 0) {
        state.items.splice(cartItemIndex, 1)
        const index = state.checkedIds.findIndex(v => v === item.id)
        if (index > -1) {
          state.checkedIds.splice(index, 1)
        }
      }
    }
  }

  const setCartItems = (items: IGood[]) => {
    state.items = items
    state.checkedIds = items.filter(v => v.checked).map(v => v.id)
  }

  const setCheckedIds = (ids: number[]) => {
    state.checkedIds = ids
  }

  const toggleAllChecked = (isAllChecked: boolean) => {
    const ids = isAllChecked ? state.items.map(v => v.id) : []
    state.checkedIds = ids
  }

  return {
    state, //被全局管理的状态
    total, //总商品数量
    totalPrice, //总价
    totalOldPrice, //旧总价
    isAllChecked, //是否全选
    cartCountById, //根据商品ID获取商品个数
    pushProductToCart, //添加到购物车
    removeProductToCart, //从购物车移除
    setCartItems, //设置所有的商品
    setCheckedIds, //设置所有选中的ID
    toggleAllChecked //切换全选全不选
  }
})
