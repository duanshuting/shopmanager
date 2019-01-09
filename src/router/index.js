import Vue from "vue";
// import VueRouter from "vue-router";
import Router from "vue-router";

// 单独引入组件
import { Message } from "element-ui";

// import Login from '../components/login.vue'
// @符号->  src
// 懒加载写法 ->

// const Foo = () =>
//     import ('./Foo.vue')

const Login = () => import("@/components/login.vue");

const Home = () => import("@/components/home.vue");

const Users = () => import("@/components/users.vue");

const Rights = () => import("@/components/rights.vue");

const Roles = () => import("@/components/roles.vue");
const Goodslist = () => import("@/components/goodslist.vue");
const GoodsAdd = () => import("@/components/goodsadd.vue");
const Params = () => import("@/components/params.vue");
const Goodscate = () => import("@/components/goodscate.vue");
const Orders = () => import("@/components/order.vue");
const Report = () => import("@/components/report.vue");

Vue.use(Router);

const router = new Router({
  routes: [
    {
      name: "home",
      path: "/",
      component: Home,
      children: [
        {
          name: "users",
          path: "/users",
          component: Users
        },
        {
          name: "rights",
          path: "/rights",
          component: Rights
        },
        {
          name: "roles",
          path: "/roles",
          component: Roles
        },
        {
          name: "goods",
          path: "/goods",
          component: Goodslist
        },
        {
          name: "goodsadd",
          path: "/goodsadd",
          component: GoodsAdd
        },
        {
          name: "params",
          path: "/params",
          component: Params
        },
        {
          name: "categories",
          path: "/categories",
          component: Goodscate
        },
        {
          name: "orders",
          path: "/orders",
          component: Orders
        },
        {
          name: "reports",
          path: "/reports",
          component: Report
        }
      ]

      // redirect: {
      //     name: 'login'
      // }
    },
    {
      name: "login",
      path: "/login",
      component: Login
    }
  ]
});

// 拦截路由配置

// app.use((req,res,next)=>{
//   next();
// });

router.beforeEach((to, from, next) => {
  // ...
  // 如果要去的是登录 -> 继续执行路由配置 next()
  if (to.name === "login") {
    next();
  } else {
    // 如果要去的是home -> 判断token -> 如果有token -> next() -> 如果没有token->回到login登录
    const token = localStorage.getItem("token");
    if (!token) {
      // js代码编程式导航->去login组件
      // this.$router->vm.路由对象 -> 路由对象.push
      // this.$message.warning("请先登录");
      Message.warning("请先登录");

      router.push({
        name: "login"
      });
    } else {
      next();
    }
  }
});

export default router;

// 在路由配置生效之前 -> 在路由配置生效之前  -> 拦截路由配置
// 去判断token
// 如果有  继续让路由配置生效 渲染home
// 如果token没有 执行登录的路由配置
