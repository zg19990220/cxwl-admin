import $axios from './index'

const api = {
  getDocList:"getDocList",
  addDoc:"addDoc",
  getDoc:"getDoc", 
  modDoc:"modDoc",
  delDoc:"delDoc",
  getResGroups:"getResGroups",
  delResGroup:"delResGroup",
  addResGroup:"addResGroup"
}

export function getDocList(data={}) {
  return $axios.post(api.getDocList, data)
}

export function addDoc(data={}) {
  return $axios.post(api.addDoc, data)
}

export function getDoc(data={}) {
  return $axios.post(api.getDoc, data)
}

export function modDoc(data={}) {
  return $axios.post(api.modDoc, data)
}

export function delDoc(data={}) {
  return $axios.post(api.delDoc, data)
}

export function getResGroups(data={}) {
  return $axios.post(api.getResGroups, data)
}

export function delResGroup(data={}) {
  return $axios.post(api.delResGroup, data)
}

export function addResGroup(data={}) {
  return $axios.post(api.addResGroup, data)
}