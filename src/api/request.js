import axios from 'axios';

//配置项
const requests = axios.create({
    baseURL: '/api',
    //延长超时时间，改善低速网络环境的使用体验
    timeout: 30000,
    // /跨域请求时是否需要使用凭证
    withCredentials: true
})

//请求拦截器
requests.interceptors.request.use((config) => {
    return config
})
//响应拦截器
requests.interceptors.response.use((res) => {
    if (res.data == 'Fails.') {
        return false
    }
    if (res.data == 'Ok.') {
        return true
    }
    return res.data
}, (error) => {
    return Promise.reject(new Error('faile'))
})


export default requests