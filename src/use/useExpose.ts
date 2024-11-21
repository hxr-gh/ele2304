import { extend } from '@/utils/basic'
import { getCurrentInstance } from 'vue'

//暴露一些方法或属性供给组件使用
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useExpose<T = Record<string, any>>(apis: T) {
  //useExpose这个Hooks在OpSwipeItem组件中调用，所以这里获取到的就是OpSwipeItem组件的实例
  const instance = getCurrentInstance() //获取当前组件的实例

  //如果实例有值的话
  if (instance) {
    //apis传的这些方法挂载到instance实例中，从而在OpSwipeItem组件中使用
    extend(instance, apis)
  }
}
