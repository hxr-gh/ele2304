import { EventEmitter } from '@/utils/event'

let eventBus: EventEmitter

export function useEventBus() {
  //如果eventBus为空的话
  if (!eventBus) {
    //初始化一个事件通知类的实例并赋值
    eventBus = new EventEmitter() //单例模式
  }
  return eventBus
}
