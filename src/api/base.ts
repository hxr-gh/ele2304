import axios from 'axios'
import { showDialog } from 'vant'

//创建axios实例
const instance = axios.create({
  baseURL: '/api'
})

//响应的拦截器
instance.interceptors.response.use(response => {
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
})

export default instance
