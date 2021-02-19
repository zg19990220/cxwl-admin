
import { asyncRoute, publicRoutes,indexRoute } from '@/router/config.js'

import {getPower}  from '@/utils/util'
// import {flat,formatUserGrade,getChildMenuId}  from '@/utils/util'

import generate  from '@/utils/generate'

/**
 * routes  路由表
 * addRoutes  后台获取的路由表
 */
const state = {
  routes: [],    
  addRoutes: [],
  power:[]
}
const mutations = {
  SET_ROUTES(state, payload) {
    //通用路由和权限路由
    state.routes = [...publicRoutes, ...payload]
    state.addRoutes = payload
  },
  DEL_ROUTES() {
    state.routes = []
    state.addRoutes = []
  },
  SET_POWER(state, payload) {
    state.power = payload
  },
}
 
const actions = {
  getAsyncRoutes({ commit, rootGetters }, menu) {
    return new Promise(resolve => {
      commit('SET_POWER', getPower(menu))
      let asyncRoutes = generate(menu)
      // let asyncRoutes = asyncLoadRouter(menu)

      //合并首页路由
      asyncRoute.children = [indexRoute, ...asyncRoutes]
      commit('SET_ROUTES', asyncRoute.children)
      resolve(asyncRoute)
    })
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
