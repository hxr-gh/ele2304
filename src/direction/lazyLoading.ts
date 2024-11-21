// 懒加载

import type { App, DirectiveBinding } from 'vue'

const vLazy = (observer: IntersectionObserver) => {
  return {
    beforeMount: (el: HTMLImageElement, binding: DirectiveBinding) => {
      el.classList.add('op-lazyload')
      const { value } = binding
      el.dataset.origin = value
      observer.observe(el)
    }
  }
}

const lazyPlugin = {
  install(app: App) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(item => {
          //isIntersecting判断每个元素是否跟root相交
          if (item.isIntersecting) {
            //开始加载图片，把dataset.origin的值放到src中
            const el = item.target as HTMLImageElement
            el.src = el.dataset.origin as string
            el.classList.remove('op-lazyload')
            //停止监听
            observer.unobserve(el)
          }
        })
      },
      {
        rootMargin: '0px 0px -100px 0px' //交叉视图100px开始派发事件加载图片
      }
    )

    app.directive('lazy', vLazy(observer))
  }
}

export default lazyPlugin
