import { computed } from 'vue'

const parseJSON = (value: string) => {
  try {
    return value === 'undefined' ? undefined : JSON.parse(value ?? '') //value ?? ''指value ? value : ''
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return undefined
  }
}

export function useLocalStorage<T>(key: string, initalValue: T) {
  const readValue = () => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? parseJSON(item) : initalValue
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return initalValue
    }
  }

  const storeValue = computed(() => readValue())

  const setValue = (value: T) => {
    try {
      const newValue = value instanceof Function ? value(storeValue) : value
      window.localStorage.setItem(key, JSON.stringify(newValue))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return
    }
  }

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  }

  return {
    value: storeValue,
    setValue,
    removeItem
  }
}
