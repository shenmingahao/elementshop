// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import axios from 'axios';
import qs from 'qs';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';

Vue.config.productionTip = false
Vue.use(ElementUI, {
  size: 'small'
});
Vue.prototype.$axios=axios;
Vue.prototype.$qs=qs;

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

