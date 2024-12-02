<script lang="ts" setup>
import CartControl from './CartControl.vue'
import type { IGood } from '@/types'
import { useRouter } from 'vue-router'

interface IProps {
  data: IGood
}
const props = defineProps<IProps>()

//点击列表跳转到详情页
const router = useRouter()
const gotoGoods = () => {
  router.push({
    name: 'goods',
    params: {
      id: props.data.id
    }
  })
}
</script>

<template>
  <div class="shop-goods-item" @click="gotoGoods">
    <!-- 商品图片 -->
    <img class="img" v-lazy="data.imgUrl" src="" alt="" />
    <!-- 商品信息 -->
    <div class="content">
      <!-- 商品名 -->
      <div class="name">{{ data.name }}</div>
      <!-- 提示信息 -->
      <div class="tips op-ellipsis" v-if="data.tips">{{ data.tips }}</div>
      <!-- 月售/评分 -->
      <div class="extra">
        <span class="count">月售{{ data.sellCount }}份</span>
        <span>评分{{ data.rating }}</span>
      </div>
      <!-- 价格 -->
      <div class="price">
        <!-- 新价格 -->
        <div class="now">
          ￥<span>{{ data.price }}</span>
        </div>
        <!-- 旧价格 -->
        <div class="old">￥{{ data.oldPrice }}</div>
      </div>
      <!-- 数量 -->
      <div class="cart-control-wrapper">
        <CartControl :data="data"></CartControl>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shop-goods-item {
  display: flex;
  font-size: 12px;
  margin-bottom: 20px;

  .img {
    width: 85px;
    height: 85px;
    border-radius: 5px;
  }
  .content {
    flex: 1;
    margin-left: 10px;
    position: relative;
    .name {
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 4px;
    }
    .tips {
      width: 180px;
      color: gray;
      margin-bottom: 4px;
    }
    .extra {
      color: gray;
      margin-bottom: 4px;
      .count {
        margin-right: 6px;
      }
    }
    .price {
      display: flex;
      align-items: baseline;
      margin-top: 18px;
      .now {
        color: red;
        margin-right: 4px;
        span {
          font-size: 18px;
        }
      }
      .old {
        color: gray;
        text-decoration: line-through;
      }
    }
    .cart-control-wrapper {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}
</style>
