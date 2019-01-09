// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ELEMENT from 'element-ui'
import MyBread from '@/components/cusBread.vue'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/index.css'
import Http from './plugins/http'
import moment from 'moment'

import App from './App'
import router from './router'

// 全局组件
// 组件名， 组件选项所在对象
// 组件的名字应该由组件本身提供
Vue.component(MyBread.name, MyBread);

// 处理日期格式
Vue.filter('fmtDate', (v) => {
    return moment(v).format('YYYY-MM-DD')
});

Vue.use(Http)
    
Vue.use(ELEMENT)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    // 下面这两行和之前的render作用是一样的
    components: {
        App
    },
    template: '<App/>'
})