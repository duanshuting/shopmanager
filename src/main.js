// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import MyBread from '@/components/cusBread.vue'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/index.css'
import App from './App'
import router from './router'
import Http from './plugins/http'
import Moment from 'moment'

Vue.use(Http)

Vue.use(ElementUI)

Vue.config.productionTip = false

// 定义全局组件
Vue.component(MyBread.name, MyBread)

// 处理日期格式的全局过滤器
Vue.filter("fmtDate", (v) => {
  return Moment(v).format('YYYY-MM-DD')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // 下面这两行和之前的render作用是一样的
  components: { App },
  template: '<App/>'
})
