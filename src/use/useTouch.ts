import { ref } from 'vue'

//判断滑动方向是水平还是垂直
const getDirection = (x: number, y: number) => {
  //如果x轴方向的触摸大于y轴方向则认为是水平滑动
  if (x > y) {
    return 'horizontal'
  }
  //如果y轴方向的触摸大于x轴方向则认为是垂直滑动
  if (y > x) {
    return 'vertical'
  }
  //如果正正好好相等（多数不会相等）
  return ''
}

export function useTouch() {
  const startX = ref(0)
  const startY = ref(0)
  const deltaX = ref(0)
  const deltaY = ref(0)
  const offsetX = ref(0)
  const offsetY = ref(0)
  const direction = ref('')

  const isHorizontal = () => direction.value === 'horizontal'
  const isVertical = () => direction.value === 'vertical'

  const reset = () => {
    deltaX.value = 0
    deltaY.value = 0
    offsetX.value = 0
    offsetY.value = 0
  }

  const start = (event: TouchEvent) => {
    reset() //调用数据重置
    //event.touches表示当前跟踪的触摸操作的touch对象的数组
    //例，一根手指触屏时event.touches.length为1，两根手指触屏时event.touches.length为2
    //event.touches[0]表示只取第一根手指的touch对象
    //clientX是触摸目标在视口中的X坐标，clientY是触摸目标在视口中的Y坐标
    startX.value = event.touches[0].clientX //获取触摸的起始坐标
    startY.value = event.touches[0].clientY //获取触摸的起始坐标
  }

  const move = (event: TouchEvent) => {
    const touch = event.touches[0] //获取第一根手指的touch对象
    deltaX.value = (touch.clientX < 0 ? 0 : touch.clientX) - startX.value //获取手指在屏幕上水平方向的移动差量
    deltaY.value = touch.clientY - startY.value //获取手指在屏幕上垂直方向的移动差量
    offsetX.value = Math.abs(deltaX.value) //获取水平方向的移动距离
    offsetY.value = Math.abs(deltaY.value) //获取垂直方向的移动距离
    //锁定方向距离，经验数为10
    const LOCK_DIRECTION_DISTANCE = 10
    //如果没有滑动方向即不是水平也不是垂直，或者水平方向和垂直方向的移动距离都小于经验数的话
    if (
      !direction.value ||
      (offsetX.value < LOCK_DIRECTION_DISTANCE && offsetY.value < LOCK_DIRECTION_DISTANCE)
    ) {
      //获取滑动方向是水平还是垂直
      direction.value = getDirection(offsetX.value, offsetY.value)
    }
  }

  return {
    start, //开始触摸
    move, //移动
    reset, //数据重置
    startX, //起始的X轴坐标
    startY, //起始的X轴坐标
    deltaX, //手指在屏幕上水平方向的移动差量（右滑为正，左滑为负，它的绝对值就是offsetX）
    deltaY, //手指在屏幕上垂直方向的移动差量（右滑为正，左滑为负，它的绝对值就是offsetY）
    offsetX, //水平方向的移动距离
    offsetY, //垂直方向的移动距离
    direction, //滑动方向是水平还是垂直
    isHorizontal, //是否是水平滑动
    isVertical //是否是垂直滑动
  }
}
