import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'

// 单独引入提示信息组件
import { Message } from 'element-ui'

Vue.use(Router)
 
const router = new Router({
  routes: [{
    name: 'home',
    path: '/',
    component: Home,
    
    children: [{
      name: "users",
      path: "/users",
      component: Users
    }, {
      name: "rights",
      path: "/rights",
      component: Rights
    }, {
      name: "roles",
      path: "/roles",
      component: Roles
    }]
  }, {
    name: 'login',
    path: '/login',
    component: Login
  }]
})

/**
 *  在路由配置之前 -> 在路由配置生效之前 -> 拦截路由配置 (路由守卫)
 *  判断 token
 *    如果有token，继续让路由配置生效 渲染home
 *    如果没有token，执行登录的路由配置
 */

//  拦截路由配置
router.beforeEach((to, from, next) => {
  // console.log("拦截路由");

  // 如果要去的是登录 -> 继续执行路由配置 next()
  if (to.name==="login") {
    next();
  } else {
    // 如果要去的是home -> 判断token -> 如果有token -> next() -> 如果没有token，回到login登录页
    const token = localStorage.getItem('token');
    if(!token) {
      Message.warning("请先登录");

      // 回到登录页
      router.push({
        name: "login"
      })
    } else {
      next();
    }
  }
})

export default router;