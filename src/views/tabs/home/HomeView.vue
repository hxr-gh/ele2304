// 首页

<script lang="ts" setup>
import TheTransformer from './components/TheTransformer.vue'
import OpLoadingView from '@/components/OpLoadingView.vue'
import type { IHomeInfo } from '../../../types'
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

const { data, pending } = useAsync(fetchHomePageData, {} as IHomeInfo)
</script>

<template>
  <div class="home-page">
    <transition name="fade">
      <!-- 搜索页 -->
      <search-view v-if="isSearchViewShow" @cancel="toggleSearchView"></search-view>
    </transition>
    <!-- 上方蓝色区域 -->
    <the-top :recommends="data.searchRecomments" @searchClick="toggleSearchView"></the-top>
    <!-- 骨架屏 -->
    <op-loading-view :loading="pending" type="skeleton">
      <div class="home-page__banner">
        <img :src="v.imgUrl" alt="" v-for="v in data.banner" :key="v.imgUrl" />
      </div>
      <the-transformer :data="data.transformer"></the-transformer>
    </op-loading-view>
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

  &__banner {
    img {
      width: 100%;
      padding-top: 10px;
      background-color: #fff;
    }
  }
}
</style>
