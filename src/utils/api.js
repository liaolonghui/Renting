import axios from 'axios'
import { BASE_URL } from './url'

const API = axios.create({
  baseURL: BASE_URL
})

API.interceptors.request.use(config => {
  const { url } = config
  if (url.startsWith('/user') && !url.startsWith('/user/login') && !url.startsWith('/user/registered')) { // 以/user开头 且不是登陆注册
    // 添加authorization
    config.headers.Authorization = localStorage.getItem('hkzf_token')
  }
  return config
})

API.interceptors.response.use(response => {
  const { status } = response.data
  if (status === 400) {
    // token失效
    localStorage.removeItem('hkzf_token')
  }
  return response
})

export default API