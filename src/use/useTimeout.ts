import { onMounted } from 'vue'

export function useTimeout(fn: () => void, delay: number) {
  const timer = setTimeout(() => {
    fn()
  }, delay)
  const clear = () => {
    clearTimeout(timer)
  }
  onMounted(clear)
  return clear
}
