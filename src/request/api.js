/**
 * ac开头 auto-complete输入框 输入联想模糊下拉
 * tb开头 table表格list
*/
import _BASE from "../config/base";
import {
    fetch,
    aiopsPost,
    aiopsGet
} from '../request/http';
//登录=====================================================================
export const pLogin = (params) => aiopsPost({
    url: _BASE.urlPrefix+'/security/login',
    params: params
});
//菜单导航=====================================================================
export const getMenus = (params) => aiopsGet({
    url: "/json/header.json",
      //url:_BASE.urlPrefix+'/api/security/getMenuInfo',
});
//退出=====================================================================
export const pLogout = () => aiopsGet({
    url: _BASE.urlPrefix+'/security/out'
});
//智能组件-异常检测=====================================================================
//指标类型
export const getZhuanyes = (params) => aiopsGet({
    url: _BASE.urlPrefix+'/thresholdFreeAlert/api/giop/types'
});
//预测指标 根据指标类型进行联动
export const getPriTypes = (params) => aiopsGet({
    url: _BASE.urlPrefix+'/thresholdFreeAlert/api/giop/index',
    params: params
});
//输入框模糊联想下拉
export const getLenoven = (params) => aiopsGet({
    url: _BASE.urlPrefix+'/thresholdFreeAlert/api/giop/lenoven',
    params: params
});
//画面数据展示
export const getPageDisplay = (params) => aiopsGet({
    url: _BASE.urlPrefix+'/thresholdFreeAlert/api/giop/pageDisplay',
    params: params
});
//智能组件-告警根因分析-告警关系规则=====================================================================
//训练分组
export const getDomains = () => aiopsGet({
    url: _BASE.urlPrefix+'/alarmanalysis/api/giop/alarmanalysis/domain'
});
//主告警对象类型
export const getMasterTypes = (params={}) => aiopsGet({
    url: _BASE.urlPrefix+'/alarmanalysis/api/giop/alarmanalysis/master',
    params: params
});
//主告警标题
export const acMasters = (params={}) => aiopsGet({
    url: _BASE.urlPrefix+'/alarmanalysis/api/giop/alarmanalysis/masterLenoven',
    params: params
});
//次告警对象类型
export const getSlaveTypes = (params={}) => aiopsGet({
    url: _BASE.urlPrefix+'/alarmanalysis/api/giop/alarmanalysis/slave',
    params: params
});
//次告警标题
export const acSlaves = (params={}) => aiopsGet({
    url: _BASE.urlPrefix+'/alarmanalysis/api/giop/alarmanalysis/slaveLenoven',
    params: params
});
//列表
export const tbRerules = (params={}) => aiopsGet({
    url: _BASE.urlPrefix+'/alarmanalysis/api/giop/alarmanalysis/work/List',
    params: params
});
//智能组件-告警根因分析-告警关系规则图=====================================================================
//告警对象类型
export const rerulesVis = (params={}) => aiopsGet({
    url: _BASE.urlPrefix+'/alarmanalysis/api/giop/alarmanalysis/list',
    //url:'/json/vis.json',
    params: params
});
//智能组件-告警根因分析-告警根因定位=====================================================================
//训练分组
export const getDomainsCause = () => aiopsGet({
    url: _BASE.urlPrefix+'/alarmanalysis/api/giop/rootCauseLocation/domain'
});
//告警对象类型（可输入下拉框）
export const getMasterTypesCause = (params={}) => aiopsGet({
    url: _BASE.urlPrefix+'/alarmanalysis/api/giop/rootCauseLocation/alarmTypeLenovo',
    params: params
});
//列表-第一屏
export const tbCaposition = (params={}) => aiopsGet({
    url: _BASE.urlPrefix+'/alarmanalysis/api/giop/rootCauseLocation/list',
    params: params
});
//第二屏 根因拓扑图
export const capositionVis = (params={}) => aiopsGet({
    url: _BASE.urlPrefix+'/alarmanalysis/api/giop/rootCauseLocation/listBySeqNo',
    //url:'/json/vis.json',
    params: params
});