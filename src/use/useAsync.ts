import { ref } from 'vue'
import type { UnwrapRef } from 'vue'

export function useAsync<T>(asyncFn: () => Promise<T>, initValue: T, immediate = true) {
  const pending = ref(false)
  const data = ref(initValue)
  const error = ref(null)
  const execute = function () {
    pending.value = true
    error.value = null
    return asyncFn()
      .then(res => {
        data.value = res as UnwrapRef<T>
        pending.value = false
      })
      .catch(err => {
        error.value = err
        pending.value = false
      })
  }
  if (immediate) {
    execute()
  }
  return {
    pending, //是否正在请求中
    data, //后台返回的数据
    error, //后台返回的错误信息
    execute //执行函数的句柄
  }
}
