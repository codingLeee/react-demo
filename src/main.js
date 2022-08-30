// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import moment from "moment";
import store from './store'
import "./permission";
import "./lib/filter";
import 'default-passive-events';

import echarts from "echarts";
import 'echarts-wordcloud'
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;

import mapBoxGl from 'mapbox-gl';
Vue.prototype.$mapboxgl = mapBoxGl;

// import '@cgcs2000/mapbox-gl/dist/mapbox-gl.css'
// import mapboxgl from '@cgcs2000/mapbox-gl';
// Vue.prototype.$mapboxgl = mapboxgl;

import './lib/_globals';
import './lib/flexible';
import './lib/drag';
Vue.prototype.$moment = moment;
moment.suppressDeprecationWarnings = true;
moment.locale("zh-cn");

import 'element-ui/lib/theme-chalk/index.css'
import element from './lib/element.js'
Vue.use(element)

if (!global._babelPolyfill) {
  require('babel-polyfill');
}

//导出excel
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
Vue.prototype.$FileSaver = FileSaver; //设置全局
Vue.prototype.$XLSX = XLSX; //设置全局

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
