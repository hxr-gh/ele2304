import { ref } from 'vue'

//小球的类型
interface IEnterItem {
  isShown: boolean //小球是否显示
  el: HTMLElement //哪个元素要加抛物线动画
}

export function useTransition(count = 10) {
  const createItems = (_count: number) => {
    const result = []
    for (let i = 0; i < _count; i++) {
      result.push({
        isShown: false, //小球默认不显示
        el: {} as HTMLElement //哪个元素要加抛物线动画
      })
    }
    return result
  }
  const items = ref(createItems(count)) //默认10个，每个小球是一个{isShown: false, el: {}}对象

  const enteredItems = [] as IEnterItem[] //数组里的元素都是正在做动画效果的小球
  const start = (el: HTMLElement) => {
    //在items所有小球的数组中find查找一个item小球，看是否显示，要找的是不显示的
    const item = items.value.find(v => !v.isShown) //.find()方法是找到第一个满足条件的元素并返回该元素的值，如果没有找到满足条件的元素则返回undefined
    //如果查找到不显示的小球的话
    if (item) {
      item.isShown = true //显示小球
      item.el = el //小球此次就是从传入的参数el元素开始做动画，参数el相当于+加号按钮
      enteredItems.push(item)
    }
  }

  const beforeEnter = (el: Element) => {
    //获取正在做动画效果的小球中的最后一个
    const item = enteredItems[enteredItems.length - 1]

    //获取+加号按钮的位置信息
    const rect = item.el.getBoundingClientRect()
    const x = rect.left - 32
    const y = -(window.innerHeight - rect.top - 22)
    //设置外层div元素的样式
    ;(el as HTMLElement).style.display = '' //让其显示
    ;(el as HTMLElement).style.transform = `translate3d(0, ${y}px, 0)` //沿y轴位移

    //获取内层div元素
    const inner = el.getElementsByClassName('inner')[0] as HTMLElement
    //如果获取到的话，设置内层div元素的样式
    if (inner) {
      inner.style.transform = `translate3d(${x}px, 0, 0)` //沿x轴位移
    }
  }

  const enter = (el: Element, done: () => void) => {
    //给小球添加动画结束时的事件监听，结束时调用done这个回调函数
    el.addEventListener('transitionend', done) //参数done是Transition动画结束的回调方法
    //开启定时器，如不传第二个参数将使用默认值，约16ms
    setTimeout(() => {
      ;(el as HTMLElement).style.transform = `translate3d(0, 0, 0)`
      const inner = el.getElementsByClassName('inner')[0] as HTMLElement
      if (inner) {
        inner.style.transform = `translate3d(0, 0, 0)`
      }
    })
  }

  const afterEnter = (el: Element) => {
    //把小球从正在做动画效果的小球数组中去掉，把第一个小球去掉
    const item = enteredItems.shift()
    //如果有值的话，隐藏小球
    if (item) {
      item.isShown = false
      //把小球从哪个+加号按钮开始运动的置空
      // item.el = {}
      ;(el as HTMLElement).style.display = 'none' //让其隐藏
    }
  }

  return {
    items, //所有小球的数组
    start, //开始动画（点击+加号按钮）
    beforeEnter, //动画执行前的起始位置
    enter, //动画执行中
    afterEnter //动画执行结束
  }
}
