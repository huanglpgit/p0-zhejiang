import axios from 'axios'
import Vue from 'vue';
import qs from 'qs'

import {
    message
} from "ant-design-vue";
import {
    Loading
  } from 'element-ui';

// 环境的切换
// if (process.env.NODE_ENV == 'development') {    
//     axios.defaults.baseURL = 'https://www.baidu.com';} 
// else if (process.env.NODE_ENV == 'debug') {    
//     axios.defaults.baseURL = 'https://www.ceshi.com';
// } 
// else if (process.env.NODE_ENV == 'production') {    
//     axios.defaults.baseURL = 'https://www.production.com';
// }
//设置超时时间
axios.defaults.timeout = 100000;
axios.defaults.headers = {
    "Content-Type": "application/json; charset=utf-8",
    'Access-Control-Allow-Origin': '*'
};
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    //post请求传参
    if (config.method.toUpperCase() === "POST") {
        config.data = JSON.stringify(config.data);
    }
    //添加token
    var ssg = window.sessionStorage;
    // if (ssg) {
    //     token = ssg.getItem("token");
    //     if (token) {
    //         config.headers['X-Authorization'] = token;
    //     }
    // }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
//http response 拦截器 各种状态码处理 注意401和403的处理
axios.interceptors.response.use(function (response) {
    if (response.status == '200') {
        return response.data;
    } else {
        message.error('网络故障，请稍后再试');
        return Promise.reject(response.data);
    }
}, function (error) {
    if (error.message.includes('timeout')) {
        message.error('请求超时，请稍后再试');
        return Promise.reject(error);
    } else if (error.message.includes('401')) {
        message.error('未授权,请尝试刷新页面获取授权');
        //window.location.href = $.giopLoginURL + window.location.href.split('?')[0];
        return Promise.reject(error);
    } else if (error.message.includes('404')) {
        message.error('接口404');
        return Promise.reject(error);
    } else if (error.message.includes('403')) {
        // try {
        //     var json = JSON.parse(XMLHttpRequest.responseText);
        //     var gotoUrl = json.goto;
        //     if(gotoUrl == null) {
        //         window.location.href = $.giopLoginURL + window.location.href.split('?')[0];
        //     } else {
        //         window.location.href = gotoUrl;
        //     }
        // } catch(error) {
        //     window.location.href = $.giopLoginURL + window.location.href.split('?')[0];
        // }
        //跳转到错误页面 需后台一起修改 http://10.1.253.97:8087/giop/msgpage/error.min.html
        let toPage = error.response.data.goto;
        router.replace({
            path: '/error' //待修改为toPage
        });
        return Promise.reject(error);
    }
    return Promise.reject(error);
});

//axios二次封装
export function fetch(option) {
    let defaultOps = {
        url: '',
        method: 'get', //默认使用get
        isLoading: false, //默认请求前不使用loading
        params: option.params ? option.params : '', //添加到url的请求字符串中的，用于get请求
        data: option.data ? option.data : '' //添加到请求体（body）中的， 用于post等请求
    }
    option = Object.assign(defaultOps, option);
    let loadingInstance = null;
    if (option.isLoading) {
      loadingInstance = Loading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    }
    return new Promise((resolve, reject) => {
        axios(option).then(res => {
            //关闭loading
           
            resolve(res);
        }, err => {
            loadingInstance && loadingInstance.close();
            reject(err);
        });
    });
};
//post 方法
export function aiopsPost(option) {
    let defaultOps = {
        url: '',
        method: 'POST', 
        isLoading: false, //默认请求前不使用loading
        params: option.params ? option.params : '', //添加到url的请求字符串中的，用于get请求
        data: option.data ? option.data : '' //添加到请求体（body）中的， 用于post等请求
    }
    option = Object.assign(defaultOps, option);
    let loadingInstance = null;
    if (option.isLoading) {
      loadingInstance = Loading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    }
    return new Promise((resolve, reject) => {
        axios(option).then(res => {
            //关闭loading
            loadingInstance && loadingInstance.close();
            resolve(res);
        }, err => {
            loadingInstance && loadingInstance.close();
            reject(err);
        });
    });
};
//get 方法
export function aiopsGet(option) {
    let defaultOps = {
        url: '',
        method: 'GET', //默认使用get
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        isLoading: false, //默认请求前不使用loading
        params: option.params ? option.params : '', //添加到url的请求字符串中的，用于get请求
        data: option.data ? option.data : '' //添加到请求体（body）中的， 用于post等请求
    }
    option = Object.assign(defaultOps, option);
    let loadingInstance = null;
    if (option.isLoading) {
      loadingInstance = Loading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    }
    return new Promise((resolve, reject) => {
        axios(option).then(res => {
            //关闭loading
            loadingInstance && loadingInstance.close();
            resolve(res);
        }, err => {
            loadingInstance && loadingInstance.close();
            reject(err);
        });
    });
};
Vue.prototype.$fetch = fetch;
Vue.prototype.$aiopsPost = aiopsPost;