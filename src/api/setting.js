import $axios from './index'

const api = {
  getSysRoleList:"getSysRoleList",    //获取角色数据
  addSysRole:"addSysRole",            //增加
  modSysRole:"modSysRole",            //修改
  delSysRole:"delSysRole",            //删除

  getSysUserList:"getSysUserList",    //获取用户数据
  addSysUser:"addSysUser",            //增加
  modSysUser:"modSysUser",            //修改
  delSysUser:"delSysUser",            //删除
  modSysUserPwd:"modSysUserPwd",       //修改密码
  resumSysUser:"resumSysUser"

}


//获取角色列表
export function getSysRoleList(data={}) {
  return $axios.get(api.getSysRoleList, data)
}

//添加角色
export function addSysRole(data={}) {
  return $axios.get(api.addSysRole, data)
}

//修改角色
export function modSysRole(data={}) {
  return $axios.get(api.modSysRole, data)
}

//删除角色
export function delSysRole(data={}) {
  return $axios.get(api.delSysRole, data)
}

//获取系统用户列表
export function getSysUserList(data={}) {
  return $axios.get(api.getSysUserList, data)
}

//添加系统用户
export function addSysUser(data={}) {
  return $axios.get(api.addSysUser, data)
}

//修改系统用户
export function modSysUser(data={}) {
  return $axios.get(api.modSysUser, data)
}

//删除系统用户
export function delSysUser(data={}) {
  return $axios.get(api.delSysUser, data)
}

//修改系统用户密码
export function modSysUserPwd(data={}) {
  return $axios.get(api.modSysUserPwd, data)
}

//恢复用户
export function resumSysUser(data={}) {
  return $axios.get(api.resumSysUser, data)
}

