import { useEventListenter } from '@/use/useEventListenter'
import { useTouch } from '@/use/useTouch'
import './OpSwipe.scss'
import { useChildren, type NotNullChild } from '@/use/useChildren'
import { doubleRaf } from '@/utils/raf'
import { clamp } from '@/utils/format'
import { createNamespace } from '@/utils/create'
import { computed, defineComponent, onMounted, reactive, ref, onBeforeUnmount, watch } from 'vue'

const [name, bem] = createNamespace('swipe') //创建命名空间和类名，bem方法可快速生成样式的className

export const SWIPE_KEY = Symbol(name)

export type SwipeState = {
  rect: { width: number; height: number } | null
  width: number
  height: number
  offset: number
  active: number
  swiping: boolean
}

export default defineComponent({
  name,
  props: {
    //
    autoplay: {
      type: Number,
      default: 0
    },
    //
    duration: {
      type: Number,
      default: 500
    },
    //
    loop: {
      type: Boolean,
      default: true
    },
    //
    showIndicators: {
      type: Boolean,
      default: true
    },
    //
    vertical: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { slots }) {
    const root = ref() //根标签
    const track = ref() //包裹所有swipeItem的容器
    const state = reactive<SwipeState>({
      rect: null, //track的位置
      offset: 0, //track偏移的距离
      width: 0, //track宽度
      height: 0, //track高度
      active: 0, //当前轮播到哪个swipeItem
      swiping: false //当前是否正在轮播
    })

    const touch = useTouch() //触摸的Hooks
    const { children, linkChildren } = useChildren(SWIPE_KEY)
    const delta = computed(() => (props.vertical ? touch.deltaY.value : touch.deltaX.value)) //判断纵向滚动还是横向滚动从而使用移动差量
    const count = computed(() => children.length) //获取swipeItem的个数
    const size = computed(() => state[props.vertical ? 'height' : 'width']) //获取swipeItem的宽或高
    const trackSize = computed(() => count.value * size.value) //获取包裹所有swipeItem的容器的宽或高
    //获取包裹所有swipeItem的容器的样式
    const trackStyle = computed(() => {
      const mainAxis = props.vertical ? 'height' : 'width'
      const style = {
        transitionDuration: `${state.swiping ? 0 : props.duration}ms`, //动画过渡的时间
        transform: `translate${props.vertical ? 'Y' : 'X'}(${state.offset}px)`, //动画位移的距离
        [mainAxis]: `${trackSize.value}px`
      }
      return style
    })

    //暂停定时器
    let timeout: number
    const stopAutoPlay = () => clearTimeout(timeout)

    //最小偏移量
    const minOffset = computed(() => {
      if (state.rect) {
        const base = props.vertical ? state.rect.height : state.rect.width //判断是否为纵向滚动
        return base - trackSize.value
      }
      return 0
    })

    //当前激活的小圆点的索引
    const activeIndicator = computed(() => {
      return (state.active + count.value) % count.value
    })

    //目标移动到哪张的计算
    const getTargetActive = (pace: number) => {
      const { active } = state //当前在哪张
      if (pace) {
        //走到边界时
        if (props.loop) {
          //clamp(a, b, c)指控制a的值在b到c的范围内，控制目标张的索引不超出范围
          return clamp(active + pace, -1, count.value)
        }
        //正常滚动时
        return clamp(active + pace, 0, count.value - 1)
      }
      return active
    }

    //目标移动的偏移量的计算
    const getTargetOffset = (targetActive: number, offset = 0) => {
      //当前的位置 = 下一张的索引 * 当前轮播卡片的大小
      const currentPosition = targetActive * size.value
      //目标偏移量 = 传入的参数 - 当前的位置
      const targetOffset = offset - currentPosition
      //返回
      return targetOffset
    }

    //移动
    //有两种方式，一种是根据pace步长移动，一种是根据偏移量移动
    const move = ({ pace = 0, offset = 0 }) => {
      if (count.value <= 1) {
        return
      }
      //目标移动到哪张
      const targetActive = getTargetActive(pace)
      //目标移动的偏移量
      const targetOffset = getTargetOffset(targetActive, offset)
      //判断
      if (props.loop) {
        //正向滚动
        if (children[0] && targetOffset !== minOffset.value) {
          const outRightBound = targetOffset < minOffset.value //右侧边界
          children[0].setOffset(outRightBound ? trackSize.value : 0)
        }
        //反向滚动
        if (children[count.value - 1] && targetOffset !== 0) {
          const outLeftBound = targetOffset > 0 //左侧边界
          ;(children[count.value - 1] as unknown as NotNullChild).setOffset(
            outLeftBound ? -trackSize.value : 0
          )
        }
      }
      //赋值
      state.active = targetActive
      state.offset = targetOffset
    }

    //校正位置
    const corectPosition = () => {
      state.swiping = true
      //如果轮播到左边界或右边界
      if (state.active <= -1) {
        //调用移动
        move({
          pace: count.value
        })
      } else if (state.active >= count.value) {
        //调用移动
        move({
          pace: -count.value
        })
      }
    }

    //继续播放下一张
    const next = () => {
      corectPosition() //调用校正位置
      //为什么要double？
      //因为corectPosition完成位置重置最多需两次渲染
      //第一次是swipeItem卡片的setOffset偏移量，第二次是track的offset
      //为了保证真正滚动时位置已经重置，所以这里需doubleRaf，渲染两次
      doubleRaf(() => {
        state.swiping = false
        //调用移动的方法，参数表示移动多少
        move({
          pace: 1 //步长为1，表示每次移动一个卡片
        })
      })
    }

    //自动播放
    const autoPlay = () => {
      stopAutoPlay() //调用暂停定时器
      if (props.autoplay > 0 && count.value > 1) {
        //开始定时器
        timeout = setTimeout(() => {
          next() //调用继续播放下一张
          autoPlay() //递归
        }, props.autoplay)
      }
    }

    //初始化
    const init = () => {
      if (!root.value) {
        return
      }
      const rect = {
        width: root.value?.offsetWidth, //包裹所有swipeItem的容器的宽
        height: root.value?.offsetHeight //包裹所有swipeItem的容器的高
      }
      state.rect = rect
      state.width = rect.width
      state.height = rect.height
      autoPlay() //调用自动播放
    }

    let touchStartTime: number //触摸开始的时间
    //触摸开始
    const onTouchStart = (event: TouchEvent) => {
      touch.start(event) //调用Hooks里的方法并传参，通过参数event获取触摸的位置，记录触摸开始的位置
      touchStartTime = Date.now() //获取当前时间，方便计算移动速度
      stopAutoPlay() //停止自动播放
      corectPosition() //校正位置
    }
    //触摸中
    const onTouchMove = (event: TouchEvent) => {
      touch.move(event) //调用Hooks里的方法并传参，通过参数event获取触摸的距离
      event.preventDefault() //阻止默认行为，因多点触控应用中会产生混乱
      move({ offset: delta.value }) //根据偏移量移动，设置手指移动的距离
    }
    //触摸结束
    const onTouchEnd = () => {
      const duration = Date.now() - touchStartTime //获取触摸的持续时间
      const speed = delta.value / duration //获取滑动速度，速度=距离/时间
      //如果滑动速度大于0.25，或者滑动距离大于一半，则滑动到下一张
      const shouldSwipe = Math.abs(speed) > 0.25 || Math.abs(delta.value) > size.value / 2
      //如果需要滑动到下一张的话
      if (shouldSwipe) {
        //获取水平或垂直的滑动距离
        const offset = props.vertical ? touch.offsetY.value : touch.offsetX.value
        let pace = 0 //步长
        //当需要循环滚动时
        if (props.loop) {
          //判断滑动距离是否大于0
          //大于0时，看是正向滑动还是反向滑动
          //差量大于0时，取-1，滑动上一张
          //差量不大于0时，取1，滑动下一张
          pace = offset > 0 ? (delta.value > 0 ? -1 : 1) : 0
        } else {
          //当不需要循环滚动时
          //根据差量大不大于0判断向上取整还是向下取整
          //差量除swipeItem的宽或高
          pace = -Math[delta.value > 0 ? 'ceil' : 'floor'](delta.value / size.value)
        }
        move({ pace }) //根据步长移动
      } else {
        //如果不需要滑动到下一张的话
        move({ pace: 0 })
      }
      state.swiping = false //取消当前是否正在轮播
      autoPlay() //调用自动播放
    }

    //渲染小圆点，map()的第一个参数是遍历到的元素的值，此处用不到，所以用_占位
    const renderDot = (_: number, index: number) => {
      const active = index === activeIndicator.value
      return <i class={bem('indicator', { active })}></i>
    }
    //根据轮播图的数量渲染小圆点并返回小圆点模板
    const renderIndicator = () => {
      if (props.showIndicators) {
        return <div class={bem('indicators')}>{Array(count.value).fill('').map(renderDot)}</div>
      }
    }

    //调用链接子组件，useChildren.ts中的方法
    linkChildren({
      size,
      props
    })

    //生命周期
    onMounted(init)
    onBeforeUnmount(stopAutoPlay)

    //监视自动轮播的间隔时间，值发生改变时重新自动播放
    watch(() => props.autoplay, autoPlay)

    //调用Hooks， 监听touchmove事件，事件触发时回调onTouchMove方法
    useEventListenter('touchmove', onTouchMove, {
      target: track //监听track这个div
    })

    //总模板
    return () => (
      <div ref={root} class={bem()}>
        <div
          ref={track}
          class={bem('track')}
          style={trackStyle.value}
          onTouchstart={onTouchStart}
          onTouchend={onTouchEnd}
        >
          {slots.default?.()}
        </div>
        {renderIndicator()}
      </div>
    )
  }
})
