import { useLocalStorage } from '@/use/useLocalStorage'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { IUserInfo } from '@/types'

//声明类型
export interface IUserState {
  userInfo: IUserInfo
  token: string
}

//获取默认用户信息
const getDefaultUserInfo: () => IUserInfo = () => ({
  id: '',
  avatar: 'https://b.yzcdn.cn/vant/icon-demo-1126.png',
  nikename: '请登录'
})

export const useUserStore = defineStore('user', () => {
  const {
    value: $userInfo,
    setValue: $setUserInfoValue,
    removeItem: $removeUserInfoItem
  } = useLocalStorage('userInfo', getDefaultUserInfo())

  const { setValue: $setTokenInfoValue, removeItem: $removeTokenInfoItem } = useLocalStorage(
    'token',
    ''
  )

  //管理的状态
  const state = ref({
    userInfo: getDefaultUserInfo(),
    token: ''
  })
  //取
  const getUserInfo = computed(() => {
    if (!state.value.userInfo || !state.value.userInfo.id) {
      state.value.userInfo = $userInfo.value
    }

    return state.value.userInfo
  })
  //存
  const setInfo = ({ token, userInfo }: IUserState) => {
    state.value.userInfo = userInfo
    state.value.token = token

    $setUserInfoValue(userInfo)
    $setTokenInfoValue(token)
  }
  //删
  const removeInfo = () => {
    state.value.userInfo = getDefaultUserInfo()
    state.value.token = ''

    $removeUserInfoItem()
    $removeTokenInfoItem()
  }

  return {
    state,
    getUserInfo,
    setInfo,
    removeInfo
  }
})
