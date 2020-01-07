




import Vue from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
//使用部分elementUI组件
import {Loading} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//echarts 建议改成按需引入
import echarts from 'echarts' //引入echarts
Vue.prototype.$echarts = echarts //引入组件
//拖拽组件
import VueDraggableResizable from 'vue-draggable-resizable';
Vue.component('vue-draggable-resizable', VueDraggableResizable);
//基本配置信息
import BASE from "../src/config/base";
import App from './App';


import router from './router'
import axios from 'axios'
import qs from 'qs'
Vue.prototype.$BASE = BASE 
Vue.prototype.$axios = axios    //全局注册，使用方法为:this.$axios
Vue.prototype.qs = qs           //全局注册，使用方法为:this.qs
Vue.config.productionTip = false;

Vue.use(Antd);
Vue.use(Loading);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
