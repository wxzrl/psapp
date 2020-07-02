import Vue from 'vue'
import App from './App'
import request from './common/uni.request.js'
import api from './api/index.js'
import url from './common/config.js'


// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts

Vue.config.productionTip = false
Vue.prototype.$request = request
Vue.prototype.$api = api
Vue.prototype.$url = url

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
