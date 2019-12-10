import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import '@/plugins/resource'
import '@/plugins/mask'
import '@/plugins/toast'
import '@/plugins/dialog'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { appInfo } from '@/common'

document.title = appInfo.name.charAt(0).toUpperCase() + appInfo.name.slice(1)

Vue.config.productionTip = false

// User authorization token
const token = localStorage.getItem('token')
// @ts-ignore
Vue.http.headers.common['Authorization'] = token

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
