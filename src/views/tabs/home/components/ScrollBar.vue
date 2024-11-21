<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { IScrollBarInfo } from '../../../../types'
import { useInterval } from '../../../../use/useInterval'
// import { useTimeout } from '../../../../use/useTimeout'

interface IProps {
  intervalTime?: number
  transitionTime?: number
  height?: number
  data: IScrollBarInfo[]
}
const props = withDefaults(defineProps<IProps>(), {
  intervalTime: 3000,
  transitionTime: 1000,
  height: 40
})

//获取DOM结构
const containerRef = ref()
onMounted(() => {
  const container = containerRef.value //整个容器
  const count = container.children.length //总数
  const firstSwipeItem = container.children[0] //第一条
  container.style.height = `${count * props.height}px` //整个容器高度
  let index = 0 //滚动到哪一条
  //循环滚动，第一个参数指滚动，第二个参数指每隔三秒
  useInterval(() => {
    index++
    //如果超过总数，需将第一条元素接到后边
    if (index >= count) {
      firstSwipeItem.style.transform = `translateY(${index * props.height}px)` //位移
      //第一条元素滚动结束后，将整个容器位置重置
      const timeout = setTimeout(() => {
        //位置重置
        firstSwipeItem.style.transform = ''
        container.style.transform = ''
        container.style.transition = ''
        clearTimeout(timeout)
      }, props.transitionTime)
    }
    container.style.transform = `translateY(-${index * props.height}px)` //位移
    container.style.transition = `all linear ${props.transitionTime}ms` //过渡
    index = index % count //取余
  }, props.intervalTime)
})

const heightPx = `${props.height}px` //样式中的高度40px
</script>

<template>
  <div class="home-scroll-bar">
    <div class="home-scroll-bar__swipe">
      <div ref="containerRef">
        <div class="swipe-item" v-for="v in props.data" :key="v.type">
          <div class="scroll-bar__info" :class="`scroll-bar__info__${v.type}`">
            <span class="info-badge">{{ v.badge }}</span>
            <span class="info-detail" v-html="v.detail"></span>
            <span class="info-btn op-thin-border">{{ v.btn }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-scroll-bar {
  --bean-color: rgb(252, 164, 40);
  --hongbao-color: rgb(252, 68, 25);
}

.home-scroll-bar {
  --bean-color: rgb(252, 164, 40);
  --hongbao-color: rgb(252, 68, 25);
  &__swipe {
    background: white;
    border-radius: 8px;
    margin: 5px 10px;
    font-size: 13px;
    position: relative;
    overflow: hidden;
    height: v-bind(heightPx);
    .swipe-item {
      height: v-bind(heightPx);
    }
  }
  .scroll-bar__info {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 10px;
    height: 100%;

    .info-badge {
      border-radius: 5px;
      padding: 2px 6px;
      color: white;
      margin-right: 6px;
      font-size: 12px;
    }
    .info-detail {
      flex: 1;
    }
    .info-btn {
      padding: 3px 14px;
      font-size: 12px;
      &.op-thin-border:before {
        border-radius: 50px;
      }
    }

    .info-num {
      font-weight: bold;
      margin: 0 2px;
    }

    &__bean {
      .info-badge {
        background: var(--bean-color);
      }
      .info-btn {
        color: var(--bean-color);
        &:before {
          border-color: var(--bean-color);
        }
      }
      .info-num {
        color: var(--bean-color);
      }
    }

    &__hongbao {
      .info-badge {
        background: var(--hongbao-color);
      }
      .info-btn {
        color: var(--hongbao-color);
        &:before {
          border-color: var(--hongbao-color);
        }
      }
      .info-num {
        color: var(--hongbao-color);
      }
    }
  }
}
</style>
