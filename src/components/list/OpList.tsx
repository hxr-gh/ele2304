import './OpList.scss'
import { useScrollParent } from '@/use/useScrollParent'
import { useRect } from '@/use/useRect'
import { Loading as VanLoading } from 'vant'
import { createNamespace } from '@/utils/create'
import { defineComponent, nextTick, onMounted, onUpdated, ref } from 'vue'
import { useEventListenter } from '@/use/useEventListenter'

const [name, bem] = createNamespace('list') //创建命名空间和类名，bem方法可快速生成样式的className

export default defineComponent({
  name,
  props: {
    //偏移量
    offset: {
      type: Number,
      default: 300
    },
    //方向
    direction: {
      type: String,
      default: 'down'
    },
    //是否加载中
    loading: {
      type: Boolean
    },
    //是否加载完毕
    finished: {
      type: Boolean
    },
    //加载完毕的文字
    finishedText: {
      type: String
    },
    //加载中的文字
    loadingText: {
      type: String
    }
  },
  setup(props, { slots, emit }) {
    const root = ref() //根标签
    const placeholder = ref() //标记是否到顶部或底部

    const loading = ref(props.loading) //是否加载中
    //渲染加载中时展示效果
    const renderLoading = () => {
      //如果是加载中并且没有加载完毕的话
      if (loading.value && !props.finished) {
        //返回渲染展示效果
        return (
          <div class={bem('loading')}>
            {slots.loading ? (
              slots.loading()
            ) : (
              <VanLoading class={bem('loading-icon')}>{props.loadingText || '加载中'}</VanLoading>
            )}
          </div>
        )
      }
    }
    //渲染加载完毕时展示效果
    const renderFinishedText = () => {
      if (props.finished) {
        const text = slots.finished ? slots.finished() : props.finishedText
        if (text) {
          return <div class={bem('finished-text')}>{text}</div>
        }
      }
    }

    //校验是否加载中
    const check = () => {
      //在下一个DOM更新循环结束后执行延迟回调
      //列表滚动后下一个渲染周期去触发校验
      nextTick(() => {
        //
        if (loading.value || props.finished) {
          //
          return
        }
        //调用Hooks，传入scrollParent元素，可获取此元素的相对位置信息
        const scrollParentRect = useRect(scrollParent)
        //
        if (!scrollParentRect.height) {
          return
        }
        //调用Hooks，传入placeholder元素，可获取该元素的相对位置信息
        const placeholderRect = useRect(placeholder)
        //是否滚动到顶部或底部
        let isReachEdge = false
        //解构props
        const { direction, offset } = props
        //如果是向上滚动的话
        if (direction === 'up') {
          //isReachEdge = 滚动容器的top - placeholderRect的top
          isReachEdge = scrollParentRect.top - placeholderRect.top <= offset
        } else {
          isReachEdge = placeholderRect.bottom - scrollParentRect.bottom <= offset
        }
        //如果到达边界的话
        if (isReachEdge) {
          loading.value = true
          emit('update:loading', true)
          emit('load')
        }
      })
    }
    //生命周期
    onMounted(() => {
      check()
    })
    //生命周期
    onUpdated(() => {
      loading.value = props.loading //子父状态同步
    })

    //Hooks，参数root表示要获取的滚动容器OpList
    const scrollParent = useScrollParent(root)
    //调用Hooks，给scrollParent绑定scroll事件，回调函数是check
    useEventListenter('scroll', check, {
      target: scrollParent,
      passive: true //不阻止默认行为，告诉浏览器无需查询，不用preventDefault阻止默认动作目的是提高性能
    })

    return () => {
      const Content = slots.default?.() //插槽传的列表内容
      const Placeholder = <div ref={placeholder} class={bem('placeholder')}></div> //标记是否到顶部或底部

      return (
        <div ref={root} class={bem()}>
          {props.direction === 'down' ? Content : Placeholder}
          {renderLoading()}
          {renderFinishedText()}
          {props.direction === 'up' ? Content : Placeholder}
        </div>
      )
    }
  }
})
