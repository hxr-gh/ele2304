import { onMountedOrActivated } from './onMountedOrActivated'
import { isRef, onDeactivated, onUnmounted, unref, watch, type Ref } from 'vue'

type TargetRef = EventTarget | Ref<EventTarget>

export type UseEventListenerOptions = {
  target?: TargetRef //要监听的元素
  capture?: boolean //捕获
  passive?: boolean //passive为ture时表示监听器内部不会调用preventDefault阻止默认滑动行为
}

//函数重载
export function useEventListenter<K extends keyof DocumentEventMap>(
  type: K,
  listener: (event: DocumentEventMap[K]) => void,
  options?: UseEventListenerOptions
): void

//参数type的类型是泛型K
//K的取值是DocumentEventMap类型的key，即Map类型，其中是键值对
//DocumentEventMap的key一般为touch/touchmove/click等等的事件
export function useEventListenter(
  type: string,
  listener: EventListener,
  options: UseEventListenerOptions = {}
) {
  //解构
  const { target = window, capture = false, passive = false } = options

  //给target添加监听事件
  const add = (target: TargetRef) => {
    //从target里获取element这个DOM，解构DOM，把它unref取value
    const element = unref(target)
    //如果有元素的话
    if (element) {
      //添加监听事件
      element.addEventListener(type, listener, {
        passive,
        capture
      })
    }
  }

  //给target移除监听事件
  const remove = (target: TargetRef) => {
    const element = unref(target)
    if (element) {
      //移除监听事件
      element.removeEventListener(type, listener, capture)
    }
  }

  //onActivated（激活）进入页面时会触发，onDeactivated（解散）离开页面时会触发，这两个生命周期只有在keep-alive模式下才可以使用。
  onMountedOrActivated(() => add(target))
  onUnmounted(() => remove(target))
  onDeactivated(() => remove(target))

  //如果元素是Ref有代理有响应式的话
  if (isRef(target)) {
    //那么元素可能会被修改，所以监视元素的值的变化
    watch(target, (val: TargetRef, oldVal: TargetRef) => {
      remove(oldVal) //移除旧值
      add(val) //添加新值
    })
  }
}
