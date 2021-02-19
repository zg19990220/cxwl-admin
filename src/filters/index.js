/**
 * @description 全局过滤器
 */
import Vue from 'vue'
import store from '@/store'

/**
 * 金额转换
 */
Vue.filter('formatMoney', function (money) {
  return (parseFloat(money) / 100).toFixed(2);
})

