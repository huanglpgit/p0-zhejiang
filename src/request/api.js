import {
    fetch,
    aiopsPost,
    aiopsGet
} from '../request/http';
//登录=====================================================================
export const pLogin = (params) => aiopsPost({
    url: '/api/security/login',
    data: params
});
//菜单导航=====================================================================
export const getMenus = (params) => aiopsGet({
    url: "/json/header.json",
      //url:'/api/security/getMenuInfo',
});
//退出=====================================================================
export const pLogout = () => aiopsGet({
    url: '/api/security/out'
});
//智能组件-异常检测=====================================================================
//指标类型
export const getZhuanyes = (params) => aiopsGet({
    url: '/api/thresholdFreeAlert/api/giop/types'
});
//预测指标 根据指标类型进行联动
export const getPriTypes = (params) => aiopsGet({
    url: '/api/thresholdFreeAlert/api/giop/index',
    params: params
});
//输入框模糊联想下拉
export const getLenoven = (params) => aiopsGet({
    url: '/api/thresholdFreeAlert/api/giop/lenoven',
    params: params
});
//画面数据展示
export const getPageDisplay = (params) => aiopsGet({
    url: '/api/thresholdFreeAlert/api/giop/pageDisplay',
    params: params
});