import { useLocalStorage } from '@/use/useLocalStorage'
import axios from 'axios'
import { showDialog } from 'vant'

//创建axios实例
const instance = axios.create({
  baseURL: '/api'
})

//请求的拦截器，携带令牌
instance.interceptors.request.use(config => {
  const { value: token } = useLocalStorage('token', '')
  if (config.headers && token.value) {
    config.headers['x-token'] = token.value
  }
  return config
})

//响应的拦截器
instance.interceptors.response.use(
  response => {
    const { data: _data } = response
    const { data, code, msg } = _data
    //判断状态码
    if (code != 0) {
      //弹出vanu-ui中的对话框
      showDialog({
        message: msg
      }).then(() => {
        //关闭vanu-ui中的对话框
      })
      return Promise.reject(msg) //返回接口返回的错误信息
    }
    return data //返回接口返回的数据
  },
  err => {
    if (err.response && err.response.status === 401) {
      showDialog({
        message: '请登录'
      }).then(() => {
        //关闭vanu-ui中的对话框
      })
    }
  }
)

export default instance
