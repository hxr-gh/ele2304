<script lang="ts" setup>
import ShopCart from './components/ShopCart.vue'
import OpTodo from '@/components/OpTodo.vue'
import GoodsList from './components/GoodsList.vue'
import ShopHeader from './components/ShopHeader.vue'
import { useRoute } from 'vue-router'
import OpLoadingView from '@/components/OpLoadingView.vue'
import { fetchShopPageData } from '@/api/shop'
import { useAsync } from '@/use/useAsync'
import { PRIMARY_COLOR } from '@/config'
import { ref } from 'vue'

//tab选项卡数据
const TAB_LIST = [
  {
    value: 1,
    label: '全部商品',
    component: GoodsList
  },
  {
    value: 2,
    label: '评价',
    component: OpTodo
  },
  {
    value: 3,
    label: '商家',
    component: OpTodo
  }
]
const active = ref(TAB_LIST[0].value)

//对应路由
const route = useRoute()
const { id } = route.params

//数据
const { data, pending } = useAsync(() => fetchShopPageData(id as string), {
  announcement: '', //公告
  discounts: [], //优惠
  redbags: [], //红包
  activitys: [], //活动
  branch: '', //分店名
  comments: [], //评论
  deliveryDistance: '', //配送距离
  deliveryStrategy: '', //配送满减
  deliveryStratingPrice: '', //配送价格
  deliveryTags: [], //配送标签
  deliveryTime: '', //配送时间
  id: '', //商家ID
  monthlyCount: 0, //月售
  postUrl: '', //头图
  bgUrl: '', //背景图
  score: 0, //评分
  services: [], //服务
  shopName: '', //商家名
  tops: [] //排名
})

//点击返回上一页
const onClickLeft = () => history.back()
</script>

<template>
  <!-- 商品详情 -->
  <div class="shop-page">
    <!-- 导航栏 -->
    <VanNavBar left-text="返回" left-arrow @click-left="onClickLeft">是的法国红酒看里</VanNavBar>
    <!-- 骨架屏 -->
    <OpLoadingView :loading="pending" type="skeleton">
      <!-- 头信息 -->
      <ShopHeader :data="data"></ShopHeader>
      <!-- 选项卡 -->
      <VanTabs v-model:active="active" :color="PRIMARY_COLOR" swipeable animated sticky>
        <VanTab v-for="v in TAB_LIST" :key="v.value" :title="v.label" :name="v.value">
          <component :is="v.component"></component>
        </VanTab>
      </VanTabs>
      <!-- 购物车 -->
      <ShopCart v-if="active === 1"></ShopCart>
    </OpLoadingView>
  </div>
</template>

<style lang="scss">
.shop-page {
  .van-tabs__line,
  .van-nav-bar {
    z-index: 0;
  }
}
</style>
