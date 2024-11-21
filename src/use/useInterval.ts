import { onMounted } from 'vue'

export function useInterval(fn: () => void, delay: number) {
  const timer = setInterval(() => {
    fn()
  }, delay)
  const clear = () => {
    clearInterval(timer)
  }
  onMounted(clear)
  return clear
}
