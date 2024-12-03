//回调函数类型的签名，可接收任意参数无返回值
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fn = (...args: any[]) => void

//事件对象的类型
interface Events {
  //以键值对的方式保存，键是name字符串表示事件名称，值是函数的数组表示事件回调的函数
  [name: string]: Fn[]
}

//事件监听类【发布与订阅的模式】
export class EventEmitter {
  //用来保存有多少种事件
  events: Events

  //构造函数
  constructor() {
    //初始化事件对象
    this.events = {}
  }

  //监听一个事件（事件的类型，事件的回调）【订阅事件】
  on(type: string, fn: Fn) {
    //如果事件对象中没有这个事件的话
    if (!this.events[type]) {
      //就添加这个事件，键是事件名，值是空数组
      this.events[type] = []
    }
    //把这个事件的回调添加到值的空数组中
    this.events[type].push(fn)
  }

  //移除事件监听（事件的类型，事件的回调）参数可选【取消订阅事件】
  off(type?: string, fn?: Fn) {
    //如果两个参数都没传的话
    if (!type && !fn) {
      //就把所有的events都去掉，所有的事件和事件回调都去掉
      this.events = {}
      //返回当前类的实例
      return this
    }

    //如果传了事件的类型这一参数
    if (type) {
      //如果没传事件的回调，就把所有这个类型的事件回调置空
      if (!fn) {
        this.events[type] = []
        return this
      }
      //如果传了事件的回调，就获取这些事件的回调数组
      const events = this.events[type]
      //如果事件的回调数组是空的，就不做任何事
      if (!events) {
        return this
      }
      //如果事件的回调数组不是空的，就获取数组的长度
      let count = events.length
      //while循环，--表示从数组的最后开始
      while (count--) {
        //如果在events里找到这个回调的话
        if (events[count] === fn) {
          //就从count这个位置开始，去掉一个元素（即这个回调方法）直到所有回调都移除，循环结束
          events.splice(count, 1)
        }
      }
    }
  }

  //触发事件监听（事件的类型，回调方法的参数）【发布事件】
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(type: string, ...args: any[]) {
    //根据事件的名称找到事件回调的数组
    const events = this.events[type]
    //如果这个事件没有回调的话，就直接返回
    if (!events) {
      return
    }
    //否则就执行所有的回调
    let ret
    //循环回调数组
    for (let i = 0; i < events.length; i++) {
      //获取一个回调函数
      const fn = events[i]
      //如果获取到这个回调的话，就执行这个回调
      if (fn) {
        //.apply()方法可立即执行fn这个函数并可传递指定的参数args
        ret = fn.apply(this, args) as unknown //ret用来保存执行的结果
        //如果执行结果为true的话，就直接返回true，后边的循环都不在执行
        if (ret === true) {
          return ret
        }
      }
    }
  }

  //销毁【内存管理】
  destroy() {
    this.events = {} //置空事件对象
  }
}
