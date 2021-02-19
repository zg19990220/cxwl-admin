/**
 * 路由相关属性说明
 */

import Layout from '@/layout'

/*
*通用routers
*/
export const publicRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login'),
    meta: { title: '登录' },
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    meta: { title: "404" },
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
]

//首页路由
export const indexRoute = {
  path: '/',
  name: 'Home',
  hidden: true,
  component: () => import(`@/views/dashboard`),
  meta: { title: '首页', icon: 'el-icon-s-data' }
}

//异步路由载体 后端获取的动态路由添加到children
export const asyncRoute = {
  path: '/',
  component: Layout,
  redirect: '/',
  children: []
}


//404
export const notfound = {
  path: '*',
  name: '*',
  redirect: '/404',
  hidden: true
}
