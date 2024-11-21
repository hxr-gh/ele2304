import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'

type ScrollElement = HTMLElement | Window
const defaultRoot = window

const overflowScrollReg = /scroll|auto|overlay/i //正则

//判断参数node是否是元素节点
function isElement(node: Element) {
  const ELEMENT_NODE_TYPE = 1 //为1说明是元素节点
  //标签名不是<html>也不是<body>，并且节点类型为1，说明是元素节点
  return node.tagName !== 'HTML' && node.tagName !== 'BODY' && node.nodeType === ELEMENT_NODE_TYPE
}

//根据传入的参数el获取可滚动的元素，如果el不是可滚动元素就逐层向上找各级父节点
function getScrollElement(el: Element, root: ScrollElement) {
  let node = el
  //循环条件，node存在并且node不是root（root默认值是window），并且node是元素节点
  while (node && node !== root && isElement(node)) {
    //调用getComputedStyle方法API获取参数node元素节点的style样式
    //从样式中找overflowY的样式，从而判断元素是否可滚动
    const { overflowY } = window.getComputedStyle(node)
    //用正则匹配overflowY的样式，如果overflowY的值是scroll|auto|overlay其中之一的话
    if (overflowScrollReg.test(overflowY)) {
      //就认为node元素是可滚动的，就直接返回node元素
      return node
    }
    //正则没匹配上就不会走if判断，就找父节点
    node = node.parentNode as Element
  }
  //如果逐级父节点都不是可滚动的元素，就返回root节点，root默认值是window
  return root
}

export function useScrollParent(el: Ref<Element>, root: ScrollElement = defaultRoot) {
  const scrollParent = ref()

  onMounted(() => {
    //
    if (el.value) {
      scrollParent.value = getScrollElement(el.value, root)
    }
  })

  return scrollParent
}
