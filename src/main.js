import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import TreeTabale from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须return config
  return config
})
Vue.prototype.$http = axios


Vue.config.productionTip = false

Vue.component('tree-table', TreeTabale)
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor, /* { default global options } */)

// 定义全局时间格式化过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y =dt.getFullYear()
  const m = ('0' + dt.getMonth() + 1).slice(-2)
  const d = (dt.getDate() + '').padStart(2, 0)
  const h = (dt.getHours() + '').padStart(2, 0)
  const mm = (dt.getMinutes() + '').padStart(2, 0)
  const ss = (dt.getSeconds() + '').padStart(2, 0)

  return `${y} - ${m} - ${d} ${h}:${mm}:${ss}`
}) 

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
