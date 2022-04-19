import Vue from "vue"
import Vuex from 'vuex'
import CartMoudel from '@/store/cart.js'
// 导入用户的 vuex 模块
import UserMoudel from './user.js'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    'm_cart': CartMoudel,
    'm_user': UserMoudel,
  }
})
export default store
