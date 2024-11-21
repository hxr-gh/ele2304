// 首页

<script lang="ts" setup>
import { HOME_TABS } from './config'
import { ref } from 'vue'
import { PRIMARY_COLOR, TRANSPARENT } from '@/config/index'
import OpSwipeItem from '@/components/swipe/OpSwipeItem'
import OpSwipe from '@/components/swipe/OpSwipe'
import CountDown from './components/CountDown.vue'
import ScrollBar from './components/ScrollBar.vue'
import TheTransformer from './components/TheTransformer.vue'
import OpLoadingView from '@/components/OpLoadingView.vue'
import type { ICountdown, IHomeInfo } from '../../../types'
import { useAsync } from '@/use/useAsync'
import { fetchHomePageData } from '@/api/home'
import TheTop from './components/TheTop.vue'
import { useToggle } from '@/use/useToggle'
import SearchView from '../../search/SearchView.vue'

// const recommends = [
//   {
//     value: 1,
//     label: '牛腩'
//   },
//   {
//     value: 2,
//     label: '色拉'
//   }
// ]

const [isSearchViewShow, toggleSearchView] = useToggle(false)

const { data, pending } = useAsync(fetchHomePageData, {
  banner: [],
  searchRecomments: [],
  transformer: [],
  scrollBarInfoList: [],
  countdown: {} as ICountdown,
  activities: []
} as IHomeInfo)

const tabBackgroundColor = ref(TRANSPARENT) //透明背景色
//滚动事件，参数isFixed指是否滚动到吸顶位置，相当于e.isFixed
const onTabScroll = ({ isFixed }: { isFixed: boolean }) => {
  //吸顶白色，未吸顶透明色
  tabBackgroundColor.value = isFixed ? 'white' : TRANSPARENT
}
</script>

<template>
  <div class="home-page">
    <!-- 搜索页 -->
    <transition name="fade">
      <search-view v-if="isSearchViewShow" @cancel="toggleSearchView"></search-view>
    </transition>
    <!-- 首页 -->
    <div v-show="!isSearchViewShow">
      <!-- 上方蓝色区域 -->
      <the-top :recommends="data.searchRecomments" @searchClick="toggleSearchView"></the-top>
      <!-- 骨架屏 -->
      <op-loading-view :loading="pending" type="skeleton">
        <div class="home-page__banner">
          <img :src="v.imgUrl" alt="" v-for="v in data.banner" :key="v.imgUrl" />
        </div>
        <!-- 金刚位 -->
        <the-transformer :data="data.transformer"></the-transformer>
        <!-- 滚动提示栏 -->
        <scroll-bar :data="data.scrollBarInfoList"></scroll-bar>
        <!-- 限时抢购和轮播图 -->
        <div class="home-page__activity">
          <!-- 限时抢购 -->
          <count-down :data="data.countdown"></count-down>
          <!-- 轮播图 -->
          <op-swipe class="home-page__activity__swipe" :autoplay="3000" :loop="true">
            <op-swipe-item v-for="v in data.activities" :key="v">
              <img :src="v" alt="" />
            </op-swipe-item>
          </op-swipe>
        </div>
        <!-- 首页列表 -->
        <VanTabs
          sticky
          offset-top="44px"
          :color="PRIMARY_COLOR"
          :background="tabBackgroundColor"
          @scroll="onTabScroll"
        >
          <VanTab v-for="v in HOME_TABS" :key="v.value" :title="v.title">
            <component :is="v.component"></component>
          </VanTab>
        </VanTabs>
      </op-loading-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 淡入淡出动画样式
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.home-page {
  background-color: var(--op-gray-bg-color);
  padding-bottom: 70px;

  &__banner {
    img {
      width: 100%;
      padding-top: 10px;
      background-color: #fff;
    }
  }

  &__activity {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px;

    &__swipe {
      border-radius: 8px;
      width: 180px;
      height: 170px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
