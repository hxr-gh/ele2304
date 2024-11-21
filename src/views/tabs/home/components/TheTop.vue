// 上方蓝色区域

<script lang="ts" setup>
// import { ref } from 'vue'
import OpSearch from '@/components/OpSearch.vue'
import type { ISearchRecommend } from '../../../../types/index'

interface IProps {
  recommends: ISearchRecommend[]
}
defineProps<IProps>()

interface IEmits {
  (e: 'searchClick'): void
}
const emits = defineEmits<IEmits>()

// const searchValue = ref('test')

// const onSearch = (v?: string | number) => {
//   console.log('onSearch', v)
// }
// const onCancel = () => {
//   console.log('onCancel')
// }
// const onClear = () => {
//   console.log('onClear')
// }
</script>

<template>
  <div class="home-top">
    <!-- 状态栏 -->
    <div class="top">
      <img class="location-icon" src="@/assets/imgs/index_page/location.png" alt="" />
      <div class="location">幸福小区（北一区东南门）</div>
      <img class="shopcart-icon" src="@/assets/imgs/index_page/shopcart.png" alt="" />
      <img class="comments-icon" src="@/assets/imgs/index_page/comments.png" alt="" />
    </div>
    <!-- 搜索框 -->
    <!-- <VanSearch
      shape="round"
      background="linear-gradient(to right, rgb(53, 200, 250), rgb(31, 175, 243))"
      placeholder="世界茶饮 35减2"
    >
      <template #right-icon>
        <div>搜索</div>
      </template>
    </VanSearch> -->
    <!-- <OpSearch
      shape="round"
      background="linear-gradient(to right, rgb(53, 200, 250), rgb(31, 175, 243))"
      placeholder="世界茶饮 35减2"
      v-model="searchValue"
      @search="onSearch"
      @cancel="onCancel"
      @clear="onClear"
      show-action
    > -->
    <VanSticky>
      <OpSearch
        shape="round"
        background="linear-gradient(to right, rgb(53, 200, 250), rgb(31, 175, 243))"
        placeholder="世界茶饮 35减2"
        @inputClick="emits('searchClick')"
      >
        <template #right-icon>
          <div @click="emits('searchClick')">搜索</div>
        </template>
      </OpSearch>
    </VanSticky>
    <!-- 推荐词 -->
    <div class="search-recommend">
      <div class="tag" v-for="v in recommends" :key="v.value">{{ v.label }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-top {
  background: linear-gradient(to right, rgb(53, 200, 250), rgb(31, 175, 243));
  color: white;
  .top {
    display: flex;
    align-items: center;
    padding: 10px 10px 0 10px;
    line-height: 15px;
    font-size: 15px;
    font-weight: bold;
    .location-icon {
      width: 22px;
      height: 22px;
    }
    .location {
      flex: 1;
    }
    .shopcart-icon {
      width: 24px;
      height: 24px;
    }
    .comments-icon {
      width: 28px;
      height: 24px;
      margin-left: 10px;
    }
  }
  .search-recommend {
    display: flex;
    padding: 0 10px 8px;
    .tag {
      font-size: 12px;
      border-radius: 10px;
      background-color: rgb(242, 242, 242, 0.3);
      padding: 2px 8px;
      margin-right: 10px;
    }
  }
}
</style>

<style lang="scss">
.home-top {
  .van-field__right-icon {
    margin-right: 0;
  }
}
</style>
