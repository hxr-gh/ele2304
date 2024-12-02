<script lang="ts" setup>
import { useCartStore } from '@/stores/cart'
import type { IGood } from '@/types'
import { computed } from 'vue'

interface IProps {
  data: IGood
}
const props = defineProps<IProps>()

const store = useCartStore() //全局状态管理

//是否显示减号和数字
// const cartCount = ref(props.data.cartCount)
const cartCount = computed(() => store.cartCountById(props.data.id))

//数量减少
const minus = () => {
  // cartCount.value--
  store.removeProductToCart(props.data)
}
//数量增加
const add = () => {
  // cartCount.value++
  store.pushProductToCart(props.data)
}
</script>

<template>
  <!-- 数量 -->
  <div class="shop-cart-control">
    <!-- - -->
    <Transition name="move">
      <div class="minus" @click.stop="minus" v-if="cartCount"></div>
    </Transition>
    <!-- 数字 -->
    <Transition name="fade">
      <div class="count" v-if="cartCount">{{ cartCount }}</div>
    </Transition>
    <!-- + -->
    <div class="add" @click.stop="add"></div>
  </div>
</template>

<style lang="scss" scoped>
.shop-cart-control {
  display: flex;
  align-items: center;
  height: 22px;
  .add {
    background: var(--op-primary-color);
    border-radius: 50%;
    width: 22px;
    height: 22px;
    position: relative;
    &:before {
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      content: '';
      width: 50%;
      height: 2px;
      background: white;
      border-radius: 2px;
      transform: translate(-50%, -50%);
    }
    &:after {
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      content: '';
      width: 50%;
      height: 2px;
      background: white;
      border-radius: 2px;
      transform: translate(-50%, -50%) rotate(90deg);
    }
  }
  .count {
    width: 30px;
    text-align: center;

    &.fade-enter-active,
    &.fade-leave-active {
      transition: all 0.2s ease-out;
    }
    &.fade-enter-form,
    &.fade-leave-to {
      opacity: 0;
    }
  }
  .minus {
    background: white;
    border: 1px solid var(--op-primary-color);
    border-radius: 50%;
    width: 22px;
    height: 22px;
    box-sizing: border-box;
    position: relative;
    &:before {
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      content: '';
      width: 50%;
      height: 2px;
      background: var(--op-primary-color);
      border-radius: 2px;
      transform: translate(-50%, -50%);
    }

    &.move-enter-active,
    &.move-leave-active {
      transition: all 0.3s ease-out;
    }
    &.move-enter-form,
    &.move-leave-to {
      opacity: 0;
      transform: translateX(34px) rotate(180deg);
    }
  }
}
</style>
