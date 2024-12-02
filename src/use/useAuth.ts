import { auth } from '@/api/user'
import { useUserStore } from '@/stores/user'
import type { ILoginInfo } from '@/types'
import { computed } from 'vue'

export function useAuth() {
  const store = useUserStore() //内存中的用户信息
  const user = computed(() => store.getUserInfo) //状态管理中的用户信息

  const login = async (data: ILoginInfo) => {
    const { token, userInfo } = await auth(data)
    store.setInfo({ token, userInfo })
  }

  const logout = () => {
    store.removeInfo()
  }

  return {
    user, //用户信息
    login, //登录
    logout //退出登录
  }
}
