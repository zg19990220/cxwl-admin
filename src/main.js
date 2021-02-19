import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from './store' 

import 'default-passive-events' //消除control的警告
import '@/style/index.scss' // glob scss
import './plugins/element.js'
import './directives'
import animated from 'animate.css'
import '@/assets/iconfont/iconfont.css'
import BaseElImage from '@/components/BaseElImage'
Vue.use(animated)
Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()
//跟路径图片组件
Vue.component('BaseElImage',BaseElImage)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
