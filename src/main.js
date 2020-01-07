




import Vue from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
//使用部分elementUI组件
import {Loading} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';


import router from './router'
import axios from 'axios'
import qs from 'qs'
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
