// hooks钩子

import type { Ref } from 'vue' //加type表示导入的是类型
import { ref } from 'vue'

export function useToggle(initState: boolean): [Ref<boolean>, () => void] {
  const state = ref(initState)
  const toogel = function () {
    state.value = !state.value
  }
  return [state, toogel]
}
