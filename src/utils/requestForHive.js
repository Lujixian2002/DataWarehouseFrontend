// import store from '@/store'
import axios from 'axios'


const service = axios.create({
    // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    baseURL:'http://localhost:8849/',
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 1000000,  // request timeout
    // withCredentials: true//携带cookie
    async: true,
    crossDomain: true,
})

//暴露出去
export default service
