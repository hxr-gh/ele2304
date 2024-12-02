<script lang="ts" setup>
import { useToggle } from '@/use/useToggle'
import type { IDiscount, IDiscountContent, IShopDetail } from '@/types'
import { computed } from 'vue'

interface IProps {
  data: IShopDetail
}
const props = defineProps<IProps>()

//模板中服务部分显示三个
const topThreeServices = computed(() => props.data.services.slice(0, 3))

//模板中满减部分拼串
enum DiscountEnum { //枚举
  Reduction = 1, //满减
  Dilivery = 2, //配送
  Special = 3, //特价
  Optional = 4 //任选
}
const reductionArr = computed(() => {
  const reduction = props.data.discounts.find(v => v.type === DiscountEnum.Reduction)
  return reduction ? reduction.content : []
})
const reductionLabel = computed(() => {
  return reductionArr.value.map(v => `满${v.if}减${v.count}`)
})

//点击满减切换动作面板
const [isPopupShown, showPopup] = useToggle(false)

//数组扁平化
const formetter = (v: IDiscount) => {
  //对象的类型属于满减优惠的话，即type===1的话
  if (v.type === DiscountEnum.Reduction) {
    return '全店' + v.content.map((cv: IDiscountContent) => `满${cv.if}减${cv.count}`).join(',')
  }
  //对象的类型属于配送优惠的话，即type===2的话
  if (v.type === DiscountEnum.Dilivery) {
    return v.content.map((cv: IDiscountContent) => `满${cv.if}减${cv.count},${cv.limit}`).join(',')
  }
  //对象的类型属于特价优惠的话，即type===3的话
  if (v.type === DiscountEnum.Special) {
    return v.content.map((cv: IDiscountContent) => `特价${cv.count}元起`).join(',')
  }
  //对象的类型属于任选优惠的话，即type===4的话
  if (v.type === DiscountEnum.Optional) {
    return v.content.map((cv: IDiscountContent) => `部分商品${cv.label}`).join(',')
  }
  //以上情况都不存在的话
  return ''
}
//模板中优惠部分拼串
const discountList = computed(() => {
  return props.data.discounts.map(v => {
    return {
      type: v.type,
      label: v.label,
      text: formetter(v) //调用数组扁平化方法
    }
  })
})
</script>

<template>
  <div class="shop-header">
    <!-- 商家信息 -->
    <div class="shop-header__info">
      <!-- 左 -->
      <div class="info__left">
        <!-- 商家名 -->
        <div class="shop_name op-ellipsis">
          {{ data.shopName }}<span v-if="data.branch">({{ data.branch }})</span>
        </div>
        <!-- 第二行 -->
        <div class="delivery">
          <!-- 专送 -->
          <div class="delivery-tag op-thin-border" v-if="data.deliveryTags">
            {{ data.deliveryTags[0] }}
          </div>
          <!-- 时间 -->
          <div class="delivery-time">{{ data.deliveryTime }}</div>
          <!-- 销量 -->
          <div class="monthly-count">月售{{ data.monthlyCount }}</div>
        </div>
      </div>
      <!-- 右 -->
      <div class="info__right">
        <img :src="data.postUrl" alt="" />
      </div>
    </div>
    <!-- 服务 -->
    <div class="shop-header__service">
      <div class="service" v-for="v in topThreeServices" :key="v.label">
        <!-- 小图标 -->
        <VanIcon name="passed"></VanIcon>
        <!-- 文字 -->
        {{ v.label }}
      </div>
    </div>
    <!-- 公告 -->
    <div class="shop-header__announcement op-ellipsis">公告：{{ data.announcement }}</div>
    <!-- 红包 -->
    <div class="shop-header__redbags">
      <div class="redbag" v-for="v in data.redbags" :key="v.type">
        <span class="redbag-left">
          ￥<span class="count">{{ v.count }}</span>
          <span>{{ v.if }}</span>
        </span>
        <span class="redbag-right">领</span>
      </div>
    </div>
    <!-- 满减 -->
    <div class="shop-header__discounts" @click="showPopup">
      <div class="flex">
        <div class="activity op-thin-border" v-for="v in reductionLabel" :key="v">{{ v }}</div>
      </div>
      <VanIcon name="arrow-down" color="rgb(207, 207, 207)"></VanIcon>
    </div>
  </div>

  <!-- 点击满减切换动作面板 -->
  <VanActionSheet class="shop-header__action-sheet" v-model:show="isPopupShown" title="红包优惠">
    <div class="content">
      <h4>红包</h4>
      <div class="red-bag" v-for="v in reductionArr" :key="`${v.if}_${v.count}`">
        <!-- 左 -->
        <div class="l op-center">
          <div class="count">
            <span class="symbol">￥</span><span class="num">{{ v.count }}</span>
          </div>
        </div>
        <!-- 中 -->
        <div class="m flex">
          <div class="type">店铺专享红包</div>
          <div class="detail">满￥{{ v.if }}可用2024.12.12到期</div>
        </div>
        <!-- 右 -->
        <div class="r op-center">
          <div class="receive op-center">领取</div>
        </div>
      </div>
      <h4>商家会员专享</h4>
      <div class="menbership">
        <!-- 左 -->
        <div class="l op-center flex-col">
          <div class="count"><span class="symbol">￥</span><span class="num">5</span></div>
          <div class="detail">满0.01元可用</div>
        </div>
        <!-- 中 -->
        <div class="m flex">
          <div class="type">配送费满减</div>
          <div class="detail">全场可用，获得后30天内有效</div>
        </div>
        <!-- 右 -->
        <div class="r op-center">
          <div class="open op-center">立即开通</div>
        </div>
      </div>
      <h4>优惠</h4>
      <div class="discount">
        <div class="display-flex" v-for="v in discountList" :key="v.type">
          <div>{{ v.label }}：</div>
          <div>{{ v.text }}</div>
        </div>
      </div>
    </div>
  </VanActionSheet>
</template>

<style lang="scss">
.shop-header {
  background: white;
  border-radius: 10px;
  font-size: 12px;
  padding: 10px;
  margin: var(--op-page-padding);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);

  &__info {
    display: flex;
    margin-bottom: 5px;

    .info__left {
      flex: 1;
      .shop-name {
        width: 90%;
        font-size: 19px;
        font-weight: bold;
        margin: 6px 0 8px 0;
      }
      .delivery {
        display: flex;
        .delivery-tag {
          color: var(--op-primary-color);
          padding: 1px 5px;
          &::before {
            border: 1px solid var(--op-primary-color);
          }
        }
        .delivery-time {
          margin-left: 10px;
        }
        .monthly-count {
          margin-left: 10px;
        }
      }
    }
    .info__right {
      img {
        width: 50px;
        height: 50px;
      }
    }
  }
  &__service {
    display: flex;
    margin-bottom: 5px;

    .service {
      margin-right: 5px;
    }
  }
  &__announcement {
    color: gray;
  }
  &__redbags {
    display: flex;
    margin-top: 10px;
    margin-bottom: 5px;

    .redbag {
      color: white;
      margin-right: 5px;
      display: flex;
      .redbag-left {
        display: flex;
        align-items: center;
        padding: 2px 4px;
        border-radius: 4px 2px 2px 4px;
        border-right: 2px dashed rgb(252, 91, 68);
        background: linear-gradient(to right, rgb(252, 120, 85), rgb(252, 91, 68));
        .count {
          font-size: 18px;
          margin-right: 4px;
        }
      }
      .redbag-right {
        display: flex;
        align-items: center;
        padding: 2px 10px 2px 4px;
        background: rgb(252, 91, 68);
        border-radius: 2px 4px 4px 2px;
      }
    }
  }
  &__discounts {
    display: flex;
    margin-top: 10px;

    .flex {
      flex: 1;
    }

    .activity {
      display: inline-block;
      color: rgb(247, 68, 68);
      padding: 0 4px;
      margin-right: 5px;
      margin-bottom: 2px;
      &::before {
        border: 1px solid rgb(247, 68, 68);
      }
    }
  }

  //动作面板的样式
  &__action-sheet {
    background: rgb(244, 244, 244) !important;

    .content {
      margin: 20px 10px;
      h4 {
        font-size: 15px;
        margin: 10px 0;
      }
      .red-bag,
      .menbership {
        display: flex;
        background: white;
        margin-bottom: 10px;
        padding: 25px 0;
        border-radius: 10px;

        .symbol {
          font-weight: bold;
        }
        .num {
          font-size: 30px;
          line-height: 0.7;
          font-weight: bold;
          margin-bottom: 3px;
        }
        .l {
          width: 90px;
          text-align: center;
        }
        .flex-col {
          flex-direction: column;
        }

        .type {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .detail {
          font-size: 12px;
          color: var(--van-gray-7);
        }
        .r {
          width: 90px;
          .receive {
            font-size: 13px;
            width: 75px;
            height: 30px;
            background: linear-gradient(to right, rgb(253, 113, 78), rgb(252, 76, 60));
            color: white;
            border-radius: 15px;
          }
          .open {
            font-size: 13px;
            width: 75px;
            height: 30px;
            background: linear-gradient(to right, rgb(241, 216, 191), rgb(230, 185, 164));
            color: rgb(86, 42, 31);
            border-radius: 15px;
          }
        }
        .op-center {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .flex {
          flex: 1;
        }
      }
      .red-bag {
        .count {
          color: rgb(252, 76, 60);
          display: flex;
          align-items: flex-end;
        }
      }
      .menbership {
        .count {
          color: rgb(133, 71, 0);
          display: flex;
          align-items: flex-end;
        }
      }
      .discount {
        .display-flex {
          display: flex;
        }
      }
    }
  }
}
</style>
