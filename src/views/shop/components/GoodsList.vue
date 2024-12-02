<script lang="ts" setup>
import { useCartStore } from '@/stores/cart'
import GoodsItem from './GoodsItem.vue'
import { fetchGoodsListData } from '@/api/goods'
import { useAsync } from '@/use/useAsync'
import OpLoadingView from '@/components/OpLoadingView.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { IGood, IMenu } from '@/types'

//对应路由
const route = useRoute()
const { id } = route.params
//数据
const { data, pending } = useAsync(
  () => fetchGoodsListData(id as string).then(v => v.data),
  [] as IMenu[]
)

const { setCartItems } = useCartStore() //全局状态管理
//nv是IMenu数组类型，nv.reduce()遍历出的v是IMenu对象类型
//v里有goods属性，goods属性是IGoods[]类型的，表示这个类目下的所有商品
//...v.goods表示把这个类目下的所有商品展开，存入p这个数组中
//p从空数组开始，每次遍历时，...p把原来数组当中的内容展开放入数组，再...v.goods放入新类目的商品
//cartGoods就是获取到的所有商品的数组，放入购物车
watch(data, nv => {
  const cartGoods = nv
    .reduce((p: IGood[], v: IMenu) => [...p, ...v.goods], [])
    .filter(v => v.cartCount) //过滤出数量不为0的商品返回新数组
  setCartItems(cartGoods)
})

//对应数据
const categoryActive = ref(0)
</script>

<template>
  <!-- 商家整体商品列表 -->
  <OpLoadingView :loading="pending" type="skeleton">
    <div class="shop-goods-list">
      <!-- 侧边栏 -->
      <VanSidebar v-model="categoryActive">
        <VanSidebarItem v-for="v in data" :key="v.label" :title="v.label"></VanSidebarItem>
      </VanSidebar>
      <!-- 列表 -->
      <div class="list">
        <template v-for="v in data" :key="v.label">
          <div class="category-name">{{ v.label }}</div>
          <GoodsItem v-for="cv in v.goods" :key="cv.id" :data="cv"></GoodsItem>
        </template>
      </div>
    </div>
  </OpLoadingView>
</template>

<style lang="scss" scoped>
.shop-goods-list {
  --van-sidebar-selected-border-color: none;
  --van-sidebar-padding: 14px var(--van-padding-sm);
  --van-sidebar-font-size: 13px;

  display: flex;

  .list {
    flex: 1;
    margin: 0 10px;

    .category-name {
      font-size: 15px;
      font-weight: bold;
      padding: 10px 0;
      line-height: 1.2;
    }
  }
}
</style>
