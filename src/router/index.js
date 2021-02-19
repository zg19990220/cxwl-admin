import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { publicRoutes, notfound } from './config'
import getTitle from '@/utils/getTitle'
Vue.use(Router)

const creatRouter = () => {
  return new Router({
    routes: publicRoutes,
    scrollBehavior() {
      return { x: 0, y: 0 }
    }
  })
}

const router = creatRouter()

// 解决addRoute不能删除动态路由问题
export function resetRouter() {
  const reset = creatRouter()
  router.matcher = reset.matcher
}

// 导航守卫
router.beforeEach(async (to, from, next) => {
  document.title = getTitle(to.meta.title)
  if (to.path === '/login') {
    next()
  } else {
    if (store.getters.token) {
      const hasRoutes = store.getters.routes.length > 0
      if (hasRoutes) {
        next()
      } else {
        try {
          if (store.getters.routes.length == 0) {
            const menu = await store.dispatch('user/_getUserMenu')
            const addRoutes = await store.dispatch(
              'permission/getAsyncRoutes',
              menu  ,
            )
            //最后加上异步路由和404路由
            router.addRoutes([addRoutes, notfound])
          }
          next({ ...to, replace: true })
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  }
})
export default router
