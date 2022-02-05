import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Permission from '../components/permission/Permission.vue'
import Role from '../components/permission/Role.vue'

// 导入全局样式
import '../assets/css/global.css'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login'},
  { path: '/login', component: Login },
  { 
    path: '/home', 
    component: Home, 
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Role },
      { path: '/rights', component:Permission }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 放行
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
})

export default router
