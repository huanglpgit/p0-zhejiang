import Vue from 'vue'
import VueRouter from 'vue-router'
import Abnormal from '../views/Abnormal.vue'

import _BASE from "../config/base";

Vue.use(VueRouter)



const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue'),
    meta: {
      title: '登录',
      breadcrumbList: []
    }
  },
  {
    path: '/opcomponent/abnormal',
    name: 'abnormal',
    component: Abnormal,
    meta: {
      title: '异常检测',
      breadcrumbList: ['智能组件', '异常检测']
    }
  },
  {
    path: '/opcomponent/rerules',
    name: 'rerules',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/Rerules.vue'),
    meta: {
      title: '告警关系规则',
      breadcrumbList: ['智能组件', '告警根因分析', '告警关系规则']
    }
  },
  {
    path: '/opcomponent/depend',
    name: 'depend',
    component: () => import('../views/Depend.vue'),
    meta: {
      title: '告警关系规则图',
      breadcrumbList: ['智能组件', '告警根因分析', '告警关系规则图']
    }
  },
  {
    path: '/opcomponent/caposition',
    name: 'caposition',
    component: () => import('../views/Caposition.vue'),
    meta: {
      title: '告警根因定位',
      breadcrumbList: ['智能组件', '告警根因分析', '告警根因定位']
    }
  },
  {
    path: '/msgpage/error',
    name: 'error',
    component: () => import('../views/error.vue'),
    meta: {
      title: '错误页面'
    }
  },
  {
    path: '/msgpage/noauth',
    name: 'noauth',
    component: () => import('../views/noauth.vue'),
    meta: {
      title: '无权限'
    }
  },
  //404页面直接跳到登录页面 需要放在最后
  { path: '*', redirect: '/login' }
]
const router = new VueRouter({
  mode: 'history',
  base: _BASE.APP_NAME,//页面访问路径前加上项目前缀
  routes // (缩写) 相当于 routes: routes
})

export default router
