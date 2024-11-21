<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useToggle } from '@/use/useToggle'
import type { IShop } from '@/types'
import { computed } from 'vue'

interface IProps {
  data: IShop
}
const props = defineProps<IProps>()

const [isMoreShow, showMore] = useToggle(false)

//商家名分店名
const shopName = computed(() => `${props.data.shopName}(${props.data.branch})`)
//具体活动
const reduction = computed(() => {
  return props.data.activitys.find(v => v.type === 2)?.infos || [] //后台数据中2为满减3为特价
})
//点击跳转到商家详情
const router = useRouter()
const gotoShop = (id: number | string) => {
  router.push({
    name: 'shop', //跳转到哪个路由所指定的路由名
    params: { id } //携带的参数
  })
}
</script>

<template>
  <div class="home-shop-item" @click="gotoShop(data.id)">
    <!-- 头图 -->
    <img class="home-shop-item__poster" v-lazy="data.postUrl" alt="" />
    <!-- 右半部分 -->
    <div class="home-shop-item__info">
      <!-- 第一行 -->
      <div class="info__top">
        <!-- 商家名 -->
        <div class="info__name op-ellipsis">{{ shopName }}</div>
        <!-- 小图标 -->
        <VanIcon name="weapp-nav" color="rgb(207, 207, 207)" style="margin-left: 10px"></VanIcon>
      </div>
      <!-- 第二行 -->
      <div class="info__desc">
        <!-- 评分 -->
        <span class="score">{{ data.score }}</span>
        <!-- 月售 -->
        <span class="monthly-count">月售{{ data.monthlyCount }}</span>
        <!-- 配送时间 -->
        <span class="delivery-time">{{ data.deliveryTime }}</span>
        <!-- 配送距离 -->
        <span class="delivery-distance">{{ data.deliveryDistance }}</span>
      </div>
      <!-- 第三行 -->
      <div class="info__desc">
        <!-- 起送 -->
        <span class="delivery-strating-price">起送{{ data.deliveryStratingPrice }}</span>
        <!-- 配送策略 -->
        <span class="delivery-strategy">{{ data.deliveryStrategy }}</span>
        <!-- 蓝骑士专送 -->
        <span class="delivery-tag op-thin-border" v-for="v in data.deliveryTags" :key="v">
          {{ v }}
        </span>
      </div>
      <!-- 第四行 评论 -->
      <div class="info__comment">{{ data.comments[0] }}</div>
      <!-- 第五行 -->
      <div class="info__more" @click.stop="showMore">
        <!-- 活动 -->
        <div class="label" v-if="isMoreShow">活动</div>
        <!-- 具体活动 -->
        <div class="activities">
          <!-- 上收 -->
          <div class="activity op-thin-border" v-if="!isMoreShow">
            {{ reduction[0] }} | {{ reduction[1] }}
          </div>
          <!-- 下展 -->
          <template v-else>
            <div class="activity op-thin-border" v-for="v in reduction" :key="v">
              {{ v }}
            </div>
          </template>
        </div>
        <!-- 小箭头 -->
        <VanIcon :name="`arrow-${isMoreShow ? 'up' : 'down'}`" color="rgb(207, 207, 207)"></VanIcon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-shop-item {
  background: white;
  border-radius: 10px;
  padding: 15px 15px 12px 10px;
  margin-bottom: 10px;
  font-size: 12px;
  text-align: left;
  display: flex;

  &__poster {
    width: 105px;
    height: 105px;
  }

  &__info {
    margin-left: 10px;
    width: 0;
    flex: 1;

    .info__top {
      display: flex;
      .info__name {
        font-weight: bold;
        font-size: 16px;
        line-height: 16px;
        margin-bottom: 4px;
      }
    }

    .info__desc {
      display: flex;
      align-items: baseline;
      margin-bottom: 4px;
      color: gray;
      .score {
        color: rgb(252, 95, 4);
        font-weight: bold;
        margin-right: 7px;
      }
      .monthly-count {
        flex: 1;
      }
      .delivery-time {
        margin-right: 7px;
      }
      .delivery-distance {
        display: inline-block;
        vertical-align: baseline;
      }
      .delivery-strating-price {
        margin-right: 5px;
      }
      .delivery-strategy {
        flex: 1;
        margin-right: 6px;
      }
      .delivery-tag {
        color: var(--op-primary-color);
        padding: 1px 2px;
        &:before {
          border: 1px solid var(--op-primary-color);
        }
      }
    }

    .info__comment {
      border-radius: 2px;
      color: rgb(252, 95, 4);
      background: rgb(253, 239, 229);
      width: fit-content;
      padding: 1px 5px;
      margin-bottom: 5px;
      font-size: 10px;
    }

    .info__more {
      display: flex;
      .label {
        width: 35px;
        color: gray;
      }
      .activities {
        flex: 1;
      }
      .van-icon {
        margin-top: 3px;
      }

      .activity {
        display: inline-block;
        color: rgb(247, 68, 68);
        padding: 0 4px;
        margin-right: 5px;
        margin-bottom: 2px;
        font-size: 10px;
        &:before {
          border: 1px solid rgb(247, 68, 68);
        }
      }
    }
  }
}
</style>
