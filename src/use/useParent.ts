import type { Child } from './useChildren'
import { getCurrentInstance, inject, onUnmounted } from 'vue'
import type { InjectionKey } from 'vue'

//定义类型，包含泛型T和两个方法
export type ParentProvide<T> = T & {
  link(instance: Child): void
  unlink(instance: Child): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any //key是string字符串类型但值是any任意类型的
}

export function useParent<T>(key: InjectionKey<ParentProvide<T>>) {
  //注入接收
  const parent = inject(key, null)
  //判断有无接收到
  if (!parent) {
    return {
      parent: null
    }
  }
  //获取当前组件的实例
  const instance = getCurrentInstance()
  //解构接收到的对象
  const { link, unlink } = parent
  //把一个子组件添加到children数组中，参数child指接收一个子组件
  link(instance)
  //把一个子组件从children数组中删除
  onUnmounted(() => unlink(instance))
  //返回
  return { parent }
}
