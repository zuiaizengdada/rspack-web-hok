// modeules  文件里面配置
// longTime    Boolean   默认：false    是否存储浏览器缓存     例：modules/search.js

import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

// 过滤需要持久存储的modules
const paths = Object.keys(modules)?.filter(item => modules[item]?.longTime) || []

const store = new Vuex.Store({
  modules,
  getters,
  // 持久化存储
  plugins: [createPersistedState({
    key: 'store',
    paths: paths
  })]
})

export default store
