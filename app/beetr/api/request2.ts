import axios from "axios";
//创建axios实例
import { baseUrl } from ".";
import { TOKEN_CREDENTIALS } from '@beetr/constant'
import { throttle } from '@beetr/hooks'
const service = axios.create({
  baseURL: baseUrl,
  timeout: 50000,//超时时间
})
import { isLoading } from '~~/store/user'
// const showLoading = isLoading()
import { ElNotification } from 'element-plus'
// 错误提示
const toastMessage = (msg: string) =>
  ElNotification({
    type: 'error',
    message: msg,
    title: '错误提示',
  })
// 加入节流函数toast
const throttleToast = throttle(toastMessage, 2000, true)
service.interceptors.request.use(
  (config: any) => {
    // showLoading.changeShow(true)
    config.data = (config.data)
    var cookieToken = useCookie(TOKEN_CREDENTIALS)
    config.headers =
      { 'X-Access-Token': cookieToken.value || '' }
    return config
  }, error => {
    return Promise.reject(error)
  }
)
service.interceptors.request.use((config) => {
  return config
}, error => {//处理错误请求return Promise.reject(error)
  return Promise.reject(error)
})
service.interceptors.response.use((res) => {
  // console.log(res)
  if (res.data.code == 1) {
    return Promise.resolve(res.data)
  } else {
    throttleToast(res.data.message)
    return Promise.resolve(res.data)
  }
  // return res
}, (err) => {
  return Promise.reject(err)
})
export default service
