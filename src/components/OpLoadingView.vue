// 骨架屏

<script lang="ts" setup>
interface IProps {
  loading: boolean
  // type: string
  type: 'loading' | 'skeleton'
}
defineProps<IProps>()
</script>

<template>
  <div class="op-loading-view" v-if="loading">
    <slot name="template">
      <!-- loading -->
      <div class="loading-wrapper" v-if="type === 'loading'">
        <VanLoading></VanLoading>
      </div>
      <!-- skeleton -->
      <div class="skeleton-wrapper" v-if="type === 'skeleton'">
        <VanSkeleton :row="10"></VanSkeleton>
        <VanSkeleton :row="5" title avatar></VanSkeleton>
        <VanSkeleton :row="5" title></VanSkeleton>
      </div>
    </slot>
  </div>
  <!-- 正文内容 -->
  <slot v-else></slot>
</template>

<style lang="scss" scoped>
.op-loading-view {
  .loading-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }
  .skeleton-wrapper {
    padding: 20px 10px;
  }
}
</style>
