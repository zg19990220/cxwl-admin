const getters = {
  token: state => state.user.token,
  refresh_token: state => state.user.refresh_token,
  userName: state => state.user.userName,
  roles: state => state.user.roles,
  introduce: state => state.user.introduce,
  routes: state => state.permission.routes,
  power: state => state.permission.power,
  addRoutes: state => state.permission.addRoutes,
  opened: state => {
    if (state.app.opened === 'false') {
      return false
    } else if (state.app.opened === 'true') {
      return true
    }
  },
  tabsRoute: state => state.app.tabsRoute,
  base_img: state => state.app.base_img,
}
export default getters
