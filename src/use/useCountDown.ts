import { rAF, cancelRAF } from '@/utils/raf'
import { computed, ref } from 'vue'

//定义类型（当前时间的类型）
type CurrentTime = {
  days: number //距离结束的天数
  hours: number //距离结束的小时数
  minutes: number //距离结束的分钟数
  seconds: number //距离结束的秒数
  milliseconds: number //距离结束的毫秒数
  total: number //共要倒计时的时间
}

//定义类型（useCountDown这个Hooks的参数options的类型，表示传入的参数options的选项有哪些）
type UseCountDownOptions = {
  time: number //需要倒计时多久
  millisecond?: boolean //是否是毫秒级别的倒计时
  onChange?: (current: CurrentTime) => void //当倒计时发生改变时的函数
  onFinish?: () => void //当倒计时完成时的函数
}

const SECOND = 1000 //一秒有1000毫秒
const MINUTE = 60 * SECOND //一分钟有60秒，即60000毫秒
const HOUR = 60 * MINUTE //一小时有60分钟，即3600000毫秒
const DAY = 24 * HOUR //一天有24小时，即86400000毫秒
//计算当前时间，参数time是毫秒数表示接收remain需要倒计时多久
const parseTime = (time: number) => {
  const days = Math.floor(time / DAY) //距离结束的天数
  const hours = Math.floor((time % DAY) / HOUR) //距离结束的小时数
  const minutes = Math.floor((time % HOUR) / MINUTE) //距离结束的分钟数
  const seconds = Math.floor((time % MINUTE) / SECOND) //距离结束的秒数
  const milliseconds = Math.floor(time % SECOND) //距离结束的毫秒数
  //返回当前时间
  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    total: time //共要倒计时的时间，total=参数time=常量remain
  }
}

//判断当前倒计时的时间和需要倒计时多久是否为同一秒
const isSameSecond = (time1: number, time2: number) => {
  //换算成秒数并取整，如果秒数相同则在同一秒
  return Math.floor(time1 / SECOND) === Math.floor(time2 / SECOND)
}

//定义Hooks
export function useCountDown(options: UseCountDownOptions) {
  let rafId: number //取消rAF的句柄
  let counting: boolean //是否开始计时
  let endTime: number //计时结束的时间
  const remain = ref(options.time) //需要倒计时多久
  const current = computed(() => parseTime(remain.value)) //当前时间

  //暂停计时
  const pause = () => {
    counting = false //关闭计时
    cancelRAF(rafId)
  }

  //获取当前倒计时的时间
  const getCurrentRemain = () => Math.max(endTime - Date.now(), 0)

  //设置需要倒计时多久
  const setRemain = (value: number) => {
    remain.value = value
    options.onChange?.(current.value)
    //如果倒计时的值为0的话
    if (value === 0) {
      pause() //暂停倒计时
      options.onFinish?.() //倒计时完成
    }
  }

  //毫秒级别的倒计时
  const microTick = () => {
    //每隔16.67ms刷新一帧，刷新一次调一次rAF()
    rafId = rAF(() => {
      //判断是否正在倒计时，如果开始计时的话
      if (counting) {
        const currentRemain = getCurrentRemain() //获取当前倒计时的时间
        setRemain(currentRemain) //设置需要倒计时多久
        //如果剩下的倒计时的值大于0的话，就继续调此方法，继续循环
        if (remain.value > 0) {
          microTick()
        }
      }
    })
  }
  //非毫秒级别的倒计时
  const macroTick = () => {
    rafId = rAF(() => {
      if (counting) {
        const currentRemain = getCurrentRemain()
        //判断当前倒计时的时间与之前的remain.value是否在同一秒，如果不在同一秒的话就设置需要倒计时多久
        //或者当前倒计时的时间为0时
        if (!isSameSecond(currentRemain, remain.value) || currentRemain === 0) {
          setRemain(currentRemain)
        }
        if (remain.value > 0) {
          macroTick()
        }
      }
    })
  }

  //计时中
  const tick = () => {
    //判断选项参数中有无毫秒
    if (options.millisecond) {
      microTick() //调用
    } else {
      macroTick() //调用
    }
  }

  //开始计时
  const start = () => {
    //如果还没开始计时的话
    if (!counting) {
      endTime = Date.now() + remain.value //计时结束的时间
      counting = true //开始计时
      tick() //调用
    }
  }

  //重置时间
  const reset = (totalTime = options.time) => {
    pause()
    remain.value = totalTime
  }

  return {
    start, //开始计时
    pause, //暂停计时
    reset, //重置时间
    current //当前时间
  }
}
