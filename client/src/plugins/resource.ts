import Vue from 'vue'
import Resource from 'vue-resource'
// @ts-ignore
import VueProgressBar from 'vue-progressbar'
// @ts-ignore
import ProgressBarInterceptor from 'vue-resource-progressbar-interceptor'

const options = {
  color: 'rgba(255,255,255,.5)',
  thickness: '4px',
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(Resource)
Vue.use(VueProgressBar, options)
Vue.use(ProgressBarInterceptor)
