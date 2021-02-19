/**
 * tabsRoute tab标签页 当前缓存的路由页
 * opened    侧边栏收缩 toggle boolen
 * base_img  图片根路径（解决有的接口返回相对路径，有的返回绝对路径，只好这样做了，用了一个图片组件，再次包装el-image，在组件文件夹）
 */
const state = {
  opened: sessionStorage.getItem('open')
    ? sessionStorage.getItem('open')
    : 'false',
  tabsRoute: [], 
  base_img:process.env.VUE_APP_BASE_IMG
}
const mutations = {
  SET_TAB_ROUTE(state, payload) {
    state.tabsRoute = payload
  },
  DEL_TAB_ROUTE(state, payload){
    state.tabsRoute = state.tabsRoute.filter(item=>{
        return item.name != payload    
    })
  },
  SET_OPENED(state, payload) {
    state.opened = String(payload)
    sessionStorage.setItem('open', payload)
  }
}
export default {
  namespaced: true,
  state,
  mutations
}
