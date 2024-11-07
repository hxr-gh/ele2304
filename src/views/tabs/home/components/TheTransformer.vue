<script lang="ts" setup>
import type { ITransformer } from '../../../../types'

interface IProps {
  data: ITransformer[]
}
defineProps<IProps>()
</script>

<template>
  <div class="home-transformer">
    <div class="home-transformer__item" v-for="v in data" :key="v.label">
      <img :src="v.imgUrl" alt="" />
      <div>{{ v.label }}</div>
    </div>
  </div>
</template>

<style lang="scss">
// 网格布局
.home-transformer {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 10px;
  &__item {
    font-size: 13px;
    line-height: 15px;
    text-align: center;
    img {
      width: 48px;
    }
  }
}
</style>
