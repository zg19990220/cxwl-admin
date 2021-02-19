import { login, getUserMenu, logOut } from '@/api/login'
import { Message, Notification } from 'element-ui'
import router, { resetRouter } from '@/router'
/**
 * token 凭证
 * refresh_token 刷新token凭证
 * userName 用户名（没什么用）
 */
const state = {
  token: localStorage.getItem(process.env.VUE_APP_TOKEN_KEY) ? localStorage.getItem(process.env.VUE_APP_TOKEN_KEY) : '',
  refresh_token: localStorage.getItem(process.env.VUE_APP_REFRESH_TOKEN_KEY) ? localStorage.getItem(process.env.VUE_APP_REFRESH_TOKEN_KEY) : '',
  userName: localStorage.getItem(process.env.VUE_APP_USER_NAME) ? localStorage.getItem(process.env.VUE_APP_USER_NAME) : 'user',
}
const mutations = {
  SET_TOKEN(state, payload) {
    state.token = payload
    localStorage.setItem(process.env.VUE_APP_TOKEN_KEY, payload)
  },
  SET_REFRESH_TOKEN(state, payload) {
    state.refresh_token = payload
    localStorage.setItem(process.env.VUE_APP_REFRESH_TOKEN_KEY, payload)
  },
  SET_NAME(state, payload) {
    state.userName = payload
    localStorage.setItem(process.env.VUE_APP_USER_NAME, payload)
  },
  //删除user 所有数据 退出登录、token失效 时处理
  DEL_TOKEN(state) {
    state.token = ''
    state.userName = ''
    state.refresh_token = ''
    localStorage.removeItem(process.env.VUE_APP_TOKEN_KEY)
    localStorage.removeItem(process.env.VUE_APP_USER_NAME)
    localStorage.removeItem(process.env.VUE_APP_REFRESH_TOKEN_KEY)
  }
}
const actions = {
  /**
   * 登录
   */
  _login({ commit }, payload) {
    return new Promise((resolve, reject) => {
      login(payload)
        .then(res => {
          if (res.code === 0) {
            Notification({
              title: '登陆成功',
              duration: 1500,
              showClose: false,
              type: 'success'
            });
            commit('SET_TOKEN', res.data.token)
            commit('SET_NAME', payload.user_phone)
            commit('SET_REFRESH_TOKEN', res.data.refresh_token)
            resolve(res)
          } else {
            reject(res)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  /**
   * 更新refresh_token
   */
  _refresh({ commit }, data) {
    commit('SET_TOKEN', data.token)
    commit('SET_REFRESH_TOKEN', data.refresh_token)
  },
  /**
   * 退出登录
   */
  _loginOut({ commit, rootState }) {
    commit('DEL_TOKEN')
    rootState.permission.addRoutes = []
    rootState.permission.routes = []

    //清空异步路由
    resetRouter()
    router.push({
      path: '/login',
      query: {
        redirect: '/'
      }
    })
    // 退出登录接口  已弃用
    // logOut().then(res => {}).catch(err => {})
  },
  /**
   * 获取角色权限 
   */
  _getUserMenu(a) {
    return new Promise((resolve, reject) => {
      getUserMenu()
        .then(res => {
          if (res.code == 0) {
            resolve(res.data)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
