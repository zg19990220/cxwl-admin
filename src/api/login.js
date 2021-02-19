import $axios from './index'
const api = {
  login:"login",
  getUserGrade:"getUserGrade",
  logOut:"logOut",
  refreshToken:"refreshToken",
  getUserMenu:"getUserMenu"
}
export function login(data={}) {
  return $axios.post(api.login, data)
}
export function getUserGrade(data={}) {
  return $axios.post(api.getUserGrade,data)
}
export function logOut(data={}){
  return $axios.post(api.logOut,data)
}

export function refreshToken(data={}){
  return $axios.post(api.refreshToken,data)
}

export function getUserMenu(data={}){
  return $axios.post(api.getUserMenu,data)
}