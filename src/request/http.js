import axios from 'axios'
import qs from 'qs'

// 环境的切换
if (process.env.NODE_ENV == 'development') {    
    axios.defaults.baseURL = 'https://www.baidu.com';} 
else if (process.env.NODE_ENV == 'debug') {    
    axios.defaults.baseURL = 'https://www.ceshi.com';
} 
else if (process.env.NODE_ENV == 'production') {    
    axios.defaults.baseURL = 'https://www.production.com';
}
//设置超时时间
axios.defaults.timeout = 10000;