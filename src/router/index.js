import Vue from 'vue'
import Router from 'vue-router'

// 懒加载写法
const Login = () => import ('@/components/login.vue')
const Home = () => import ('@/components/home.vue')
const Users = () => import ('@/components/users.vue')
const Rights = () => import ('@/components/rights.vue')
const Roles = () => import ('@/components/roles.vue')
const Goodslist = () => import ('@/components/goodslist.vue')
const GoodsAdd = () => import ('@/components/goodsadd.vue')
const Params = () => import ('@/components/params.vue')
const Goodscate = () => import ('@/components/goodscate.vue')
const Orders = () => import ('@/components/order.vue')
const Report = () => import ('@/components/report.vue')

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
    }, {
      name: "goods",
      path: "/goods",
      component: Goodslist
    }, {
      name: "goodsadd",
      path: "/goods/add",
      component: GoodsAdd
    }, {
      name: "params",
      path: "/params",
      component: Params
    }, {
      name: "categories",
      path: "/categories",
      component: Goodscate
    }, {
      name: "orders",
      path: "/orders",
      component: Orders
    }, {
      name: "reports",
      path: "/reports",
      component: Report
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