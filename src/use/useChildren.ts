import type { ParentProvide } from './useParent'
import { provide, reactive } from 'vue'
import type { ComponentInternalInstance, InjectionKey } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NotNullChild = ComponentInternalInstance & Record<string, any> //声明类型
export type Child = NotNullChild | null //声明类型

export function useChildren<T>(key: InjectionKey<ParentProvide<T>>) {
  //定义属性
  const children = reactive<Child[]>([])
  //定义方法
  const linkChildren = (value?: T) => {
    //把一个子组件添加到children数组中，参数child指接收一个子组件
    const link = (child: Child) => {
      children.push(child)
    }
    //把一个子组件从children数组中删除
    const unlink = (child: Child) => {
      const index = children.indexOf(child) //获取索引
      children.splice(index, 1)
    }

    //提供传递
    provide(key, {
      link,
      unlink,
      ...value
    })
  }

  return {
    children,
    linkChildren
  }
}
