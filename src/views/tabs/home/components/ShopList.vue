<script lang="ts" setup>
import ShopItem from './ShopItem.vue'
import OpList from '@/components/list/OpList'
import { fetchShopList } from '@/api/shop'
import type { IShop } from '@/types'
import { ref } from 'vue'

const shopList = ref([] as IShop[])
const loading = ref(false)
const finished = ref(false)

let page = 1
//后台数据
const onLoad = async () => {
  const { data, total } = await fetchShopList({
    _page: page++, //第几页
    _limit: 5 //每页个数
  })
  shopList.value.push(...data)
  loading.value = false
  //判断数据是否加载完毕
  if (shopList.value.length >= total) {
    finished.value = true
  }
}
</script>

<template>
  <!-- 首页列表 -->
  <div class="home-shop-list">
    <!-- 列表 -->
    <op-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- 每一条 -->
      <shop-item v-for="v in shopList" :key="v.id" :data="v"></shop-item>
    </op-list>
  </div>
</template>

<style lang="scss" scoped>
.home-shop-list {
  padding: 8px 10px;
}
</style>
