/**
 * @description  全局权限指令
 */
import Vue from 'vue'
import store from '@/store'
let { getters } = store

/**
 * 权限指令 控制无权限的情况下不显示该元素
 */
Vue.directive('power', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding) {
    let roles = getters.roles
    if (binding.value == "" || !roles.includes(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
})