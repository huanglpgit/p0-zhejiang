




import Vue from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';
import router from './router'
import axios from 'axios'
import qs from 'qs'
Vue.prototype.$axios = axios    //全局注册，使用方法为:this.$axios
Vue.prototype.qs = qs           //全局注册，使用方法为:this.qs
Vue.config.productionTip = false;

Vue.use(Antd);


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
