import { useParent } from '@/use/useParent'
import { useExpose } from '@/use/useExpose'
import { SWIPE_KEY } from './OpSwipe'
import type { CSSProperties } from 'vue'
import { createNamespace } from '@/utils/create'
import { computed, defineComponent, reactive } from 'vue'

const [name, bem] = createNamespace('swipe-item') //创建命名空间和类名，bem方法可快速生成样式的className

export default defineComponent({
  name,
  setup(props, { slots }) {
    //item状态
    const state = reactive({
      offset: 0 //item偏移的距离
    })

    //获取父实例
    const { parent } = useParent(SWIPE_KEY)

    //动态样式
    const style = computed(() => {
      //CSSProperties类型是vue中的css属性样式
      const style1: CSSProperties = {}
      //如果有父实例并且有大小
      if (parent) {
        if (parent.size.value) {
          style1[parent.props.vertical ? 'height' : 'width'] = `${parent.size.value}px` //判断纵向还是横向
        }
        //如果偏移量有值就设置偏移量的样式
        if (state.offset) {
          style1.transform = `translate${parent.props.vertical ? 'Y' : 'X'}(${state.offset}px)`
        }
      }
      return style1
    })

    //偏移量的动态值
    const setOffset = (offset: number) => {
      state.offset = offset
    }
    useExpose({ setOffset }) //调用Hooks，暴露方法

    //总模板
    return () => (
      <div class={bem()} style={style.value}>
        {slots.default?.()}
      </div>
    )
  }
})
