import { onMounted, nextTick, onActivated } from 'vue'

export function onMountedOrActivated(hook: () => void) {
  let mounted: boolean //组件是否已Mounted挂载

  //生命周期
  onMounted(() => {
    //添加或移除监听的具体操作
    hook()
    //下一次更新时Mounted挂载设为true
    nextTick(() => {
      mounted = true
    })
  })

  //生命周期
  onActivated(() => {
    if (mounted) {
      hook()
    }
  })
}
