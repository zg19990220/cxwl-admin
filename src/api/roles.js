import $axios from './index'

export function getAllRolse(data={}) {
  const url = '/getRoles'
  return $axios.post(url,data)
}
