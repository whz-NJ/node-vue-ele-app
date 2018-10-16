import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './http'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$axios = axios; // 这样就可以在各个组件里使用this.$axios 变量了。
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
