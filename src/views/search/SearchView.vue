// 搜索页

<script lang="ts" setup>
import { useDebounce } from '../../use/useDebounce'
import { useToggle } from '@/use/useToggle'
import { fetchSearchData } from '@/api/search'
import { ref, computed, watch } from 'vue'
import OpSearch from '@/components/OpSearch.vue'
import type { ISearchResult } from '../../types'

interface IEmits {
  (e: 'cancel'): void
}
const emits = defineEmits<IEmits>()

const searchValue = ref('')
const searchResult = ref([] as ISearchResult[])
const onSearch = async (v?: string | number) => {
  // console.log('onSearch', v)
  try {
    searchState.value = DOING
    const { list } = await fetchSearchData(v as string)
    searchResult.value = list
  } finally {
    searchState.value = DONE
  }
}
const [INIT, DONE, DOING] = [-1, 0, 1]
const searchState = ref(INIT)

const [isHistoryTagShow, toggleHistoryTag] = useToggle(false)
const HISTORY_TAGS = [
  '比萨',
  '栗子',
  '切果NOW',
  '炒饭',
  '出前一丁',
  '玉米',
  '牛腩',
  '土豆焗饭',
  '烧烤',
  '水果'
]
const historyTags = computed(() =>
  isHistoryTagShow.value ? HISTORY_TAGS : HISTORY_TAGS.slice(0, 5)
)

const onTagClick = (v: string) => {
  searchValue.value = v
  onSearch(v)
}

// watch(
//   searchValue,
//   useDebounce(nv => {
//     if (!nv) {
//       searchValue.value = ''
//       return
//     }
//     onSearch(nv as string)
//   }, 1000)
// )
const debounceValue = useDebounce(searchValue, 1000)
watch(debounceValue, nv => {
  if (!nv) {
    searchValue.value = ''
    return
  }
  onSearch(nv as string)
})
</script>

<template>
  <div class="search-view">
    <!-- 搜索框 -->
    <op-search
      show-action
      v-model="searchValue"
      shape="round"
      placeholder="请输入搜索关键字"
      @search="onSearch"
      @cancel="emits('cancel')"
    ></op-search>
    <!-- 搜索历史 -->
    <div class="search-view__history" v-if="!searchValue">
      <div class="label">搜索历史</div>
      <transition-group name="list">
        <div class="history-tag" v-for="v in historyTags" :key="v" @click="onTagClick(v)">
          {{ v }}
        </div>
        <div class="history-tag" @click="toggleHistoryTag" key="key">
          <VanIcon name="arrow-up" v-if="isHistoryTagShow"></VanIcon>
          <VanIcon name="arrow-down" v-else></VanIcon>
        </div>
      </transition-group>
    </div>
    <!-- 搜索结果 -->
    <div class="search-view__result" v-else>
      <!-- 正在搜索中 -->
      <div class="searching" v-if="searchState === DOING">正在搜索中</div>
      <!-- 搜索结果 -->
      <template v-if="searchState === DONE">
        <!-- 有搜索结果 -->
        <div class="result-item" v-for="v in searchResult" :key="v.label">
          <VanIcon name="search"></VanIcon>
          <div class="name">{{ v.label }}</div>
          <div class="count">约{{ v.resultCount }}个结果</div>
        </div>
        <!-- 无搜索结果 -->
        <div class="no-result" v-if="!searchResult.length">暂无推荐</div>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.search-view {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  z-index: 999;

  &__history {
    padding: var(--van-padding-sm);
    .label {
      margin-bottom: var(--van-padding-xs);
    }
    .history-tag {
      display: inline-block;
      font-size: 12px;
      border-radius: 10px;
      color: var(--van-gray-6);
      background: var(--van-gray-1);
      padding: 4px 8px;
      margin-right: 10px;
      margin-bottom: var(--van-padding-xs);
    }
  }

  &__result {
    .result-item {
      display: flex;
      align-items: center;
      font-size: 12px;
      padding: 10px;
      border-radius: 1px solid var(--van-grey-1);
      .name {
        flex: 1;
        padding-left: 6px;
      }
      .count {
        font-size: 12px;
        color: var(--van-grey-6);
      }
    }
    .no-result,
    .searching {
      font-size: 12px;
      padding: 100px 0;
      text-align: center;
      color: var(--van-gray-6);
    }
  }
}
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
