// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 引入垫片兼容IE
import "babel-polyfill";
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import http from "./http";
// 引入全局工具函数
import * as utils from "./utils";
// 引入全局过滤器
// import '@/filters'
import animated from "animate.css";
// 引入完整的饿了么组件库
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
Vue.use(animated);
import VCharts from 'v-charts';
Vue.use(VCharts);
import Clipboard from 'clipboard'
Vue.prototype.Clipboard = Clipboard

import LottiePlayer from 'lottie-player-vue';
Vue.use(LottiePlayer);

// 将http绑定到vue原型上
Vue.prototype.$http = http;
// 将公共汽车绑定到vue原型上
Vue.prototype.$bus = new Vue();
// Vue 的全局配置
Vue.config.productionTip = false;


import ossClient from './utils/aliyun.oss.client';
Vue.prototype.$ossClient = ossClient;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
