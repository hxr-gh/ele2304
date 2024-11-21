import { unref, type Ref } from 'vue'

const isWindow = (val: unknown) => val === window

//包含相关位置信息的一个对象
function makeDOMRect(width: number, height: number) {
  //坐标值
  return {
    top: 0,
    left: 0,
    bottom: height,
    right: width,
    width,
    height
  }
}

export function useRect(elementOrRef: Element | Window | Ref<Element | Window>) {
  //unref()如果参数是ref则返回它的value，否则返回参数本身
  //unref(val)相当于 val = isRef(val) ? val.value : val
  const element = unref(elementOrRef) //element要么是Element类型的对象，要么是Window类型的对象

  //判断传进来的element是否是window类型
  if (isWindow(element)) {
    const { innerWidth, innerHeight } = element as Window
    //返回包含相关位置信息的一个对象
    return makeDOMRect(innerWidth, innerHeight)
  }
  //如果element是元素的话才会有getBoundingClientRect方法
  if ((element as Element).getBoundingClientRect) {
    return (element as Element).getBoundingClientRect()
  }
  //两个if都不走的话返回包含相关位置信息的一个对象
  return makeDOMRect(0, 0)
}
