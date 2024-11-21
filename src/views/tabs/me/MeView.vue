<script lang="ts" setup>
import type { ISuperCard } from '@/types'
import { fetchMePageData } from '@/api/me'
import { useAsync } from '@/use/useAsync'
import OpLoadingView from '@/components/OpLoadingView.vue'
import { useRouter } from 'vue-router'

const { data, pending } = useAsync(fetchMePageData, {
  cards: [],
  superCard: {} as ISuperCard
})

//导入路由Hooks
const router = useRouter()
//点击请登录跳转到登录
const gotoLogin = () => {
  router.push({
    name: 'login' //跳转到哪个路由所指定的路由名
  })
}
</script>

<template>
  <!-- 我的 -->
  <div class="me-page op-fullscreen">
    <!-- 顶部 -->
    <div class="me-page__top">
      <!-- 头像 -->
      <img class="avatar" src="https://b.yzcdn.cn/vant/icon-demo-1126.png" alt="" />
      <!-- 请登录/姓名 -->
      <div class="name" @click="gotoLogin">请登录</div>
      <!-- 账号登录 -->
      <div class="account op-thin-border" @click="gotoLogin">账号登录</div>
    </div>
    <!-- 骨架屏 -->
    <OpLoadingView :loading="pending" type="skeleton">
      <!-- 黑卡片 -->
      <div class="me-page__super-card">
        <!-- 左侧 -->
        <div class="super-card__left">
          <!-- 上 -->
          <div class="super-card__left__top">
            <!-- 超级吃货卡 -->
            <img class="card-img" src="@/assets/imgs/me_page/super-card.png" alt="" />
            <!-- | -->
            <div class="divider"></div>
            <!-- 吃货豆 -->
            <div class="bean">吃货豆：</div>
            <!-- 吃货豆数字 -->
            <div class="bean-count">{{ data.superCard.beanCount }}</div>
          </div>
          <!-- 提示信息 -->
          <div class="super-card__left__tips">{{ data.superCard.tips }}</div>
        </div>
        <!-- 小图标 -->
        <VanIcon name="arrow" size="14" color="rgb(212, 189, 178)"></VanIcon>
      </div>
      <!-- 白卡片 -->
      <div class="me-page__card" v-for="v in data.cards" :key="v.label">
        <!-- 标题 -->
        <div class="me-page__card__title">{{ v.label }}</div>
        <!-- 图标 -->
        <div class="me-page__card__items">
          <div class="me-page__card__item" v-for="cv in v.items" :key="cv.iconUrl">
            <!-- 小图标 -->
            <VanIcon :name="cv.iconUrl" :size="v.size"></VanIcon>
            <!-- 文字 -->
            <div class="label">
              {{ cv.label }}
              <!-- 数字 -->
              <span class="count" v-if="cv.count">{{ cv.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </OpLoadingView>
  </div>
</template>

<style lang="scss" scoped>
.me-page {
  background: var(--op-gray-bg-color);
  padding: 0 10px 75px 10px;

  &__top {
    padding: 10px;
    display: flex;
    align-items: center;
    background: rgb(244, 244, 244);
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .name {
      flex: 1;
      font-size: 15px;
      text-align: left;
    }
    .account {
      color: rgb(33, 179, 244);
      font-size: 10px;
      padding: 1px 10px;
      &:before {
        border-color: rgb(33, 179, 244);
        border-radius: 50px;
      }
    }
  }
  &__super-card {
    border-radius: 8px;
    background: rgb(42, 33, 46);
    color: rgb(253, 208, 159);
    display: flex;
    align-items: center;
    padding: 10px 10px 10px 20px;
    margin-bottom: 15px;
    .super-card__left {
      flex: 1;
      &__top {
        display: flex;
        align-items: center;
        .card-img {
          width: 81px;
          height: 23px;
        }
        .divider {
          position: relative;
          width: 1px;
          height: 20px;
          margin: 0 10px;
          &:before {
            content: '';
            position: absolute;
            top: -50%;
            left: 0;
            width: 200%;
            height: 200%;
            transform: scale(0.5);
            background: rgb(253, 208, 159);
          }
        }
        .bean {
          font-size: 12px;
          font-weight: bold;
          align-items: baseline;
        }
        .bean-count {
          font-weight: bold;
          font-size: 22px;
          line-height: 22px;
        }
      }
      &__tips {
        font-size: 12px;
        margin-top: 6px;
        color: rgb(212, 189, 178);
      }
    }
  }
  &__card {
    background: white;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;

    &__title {
      font-weight: bold;
    }
    &__items {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
    }
    &__item {
      margin-top: 10px;
      text-align: center;
      .label {
        font-size: 12px;
        color: gray;
        margin-top: 5px;
      }
      .count {
        font-weight: bold;
        color: black;
      }
    }
  }
}
</style>
