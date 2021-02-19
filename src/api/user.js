import $axios from './index'

const api = {
  userList:"list"
}

export function userList(data={}) {
  return $axios.post(api.userList,data,'gm/user')
}