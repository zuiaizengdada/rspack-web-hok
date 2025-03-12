import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css
import '@/styles/FormGenerator/index.scss'
import App from './App'
import store from './store'
import router from './router'

import '@/utils/auto-regist-components.js'
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import 'vue-custom-scrollbar/dist/vueScrollbar.css'
import * as filters from './filters' // global filters
import { Message } from 'element-ui'
import '@/views/formMaking/iconfont/iconfont.css'
import '@/views/formMaking/styles/index.scss'
import '@/views/formMaking/styles/cover.scss'
import { getFileType } from '@/utils/index'
import '@/directive/highlight'

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
// 四级地址
import VueAreaLinkage from 'area-linkage-vue'
import Shepherd from '@wytxer/shepherd-vue'

Vue.use(VueAreaLinkage)
Vue.use(VXETable)
Vue.use(Shepherd)

import './mixin'
// 权限指令
// import checkPer from '@/utils/permission'
// import permission from './components/Permission'
// Vue.use(checkPer)
// Vue.use(permission)

import versionTood from '@/api/versionUpdate'
// console.log('测试')
// 定时获取版本号
setInterval(() => {
  versionTood.isNewVersion()
}, 12000)
// UploadAuth上传 兼容IE11
if (!FileReader.prototype.readAsBinaryString) {
  FileReader.prototype.readAsBinaryString = function (fileData) {
    var binary = ''
    var pt = this
    var reader = new FileReader()
    reader.onload = function (e) {
      var bytes = new Uint8Array(reader.result)
      var length = bytes.byteLength
      for (var i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      // pt.result  - readonly so assign binary
      pt.content = binary
      pt.onload()
    }
    reader.readAsArrayBuffer(fileData)
  }
}
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})
require('@/plugins/index')
import AppClipboard from '@/components/AppClipboard/index.js'
import AppActivation from '@/components/AppActivation/index.js'
// register global utility filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.directive('testalert', {
  componentUpdated: (el, binding) => {
    el.onclick = () => {
      console.log(binding, '111')
      Message.warning({
        message: '敬请期待'
      })
    }
  }
})

Vue.directive('share', {
  inserted: (el, binding) => {
    el.onclick = () => {
      AppClipboard.open({ src: process.env.VUE_APP_H5_URL + binding.value })
    }
  },
  componentUpdated: (el, binding) => {
    el.onclick = () => {
      AppClipboard.open({ src: process.env.VUE_APP_H5_URL + binding.value })
    }
  }
})

Vue.directive('activation', {
  componentUpdated: (el, binding) => {
    el.onclick = () => {
      AppActivation.open({ src: process.env.VUE_APP_ACTIVATION_URL + binding.value })
    }
  }
})
import './directive/permission'
console.log('测试')
// Vue.directive('permission', permission)
import { VueJsonp } from 'vue-jsonp'
Vue.prototype.$jsonp = VueJsonp
Vue.use(VueJsonp)
import formName from '@/components/FormGenerator/formName'
Vue.use(formName)
import formTitle from '@/components/FormGenerator/formTitle'
Vue.use(formTitle)
// 全局注册 ImagePreviewer 组件
import ImagePreviewer from '@/components/ImagePreviewer/index.vue'
Vue.component('ImagePreviewer', ImagePreviewer)
import contextmenu from '@/components/contextmenu/index.js'
Vue.prototype.$contextmenu = contextmenu

Vue.prototype.$openYixiaoer = function () {
  // const a = document.createElement('a') // 创建a标签
  // a.setAttribute('href', 'yixiaoerHokApp://') // href链接
  // a.click()
}
Vue.prototype.ExportExcel2 = function (list, tHeader1, tHeader2, merges, filterVal, title) {
  // 导出数据
  this.list = list

  // 表头数据对应名字
  this.filterVal = filterVal
  // 数据方法
  this.formatJson = function (filterVal, jsonData) {
    return jsonData.map((v) => filterVal.map((j) => v[j]))
  }
  // 导出文件的方法
  this.export2Excel2 = function () {
    require.ensure([], () => {
      const { export_json_to_excel } = require('@/Excel/Export2Excel')

      const filterVal = this.filterVal
      const list = this.list
      const data = this.formatJson(filterVal, list)
      export_json_to_excel({ multiHeader: tHeader1, multiHeader2: tHeader2, data, filename: title, merges })
    })
  }
}

Vue.prototype.getPrColor = function (val) {
  const markColors = [
    { label: '#718637', value: 'GREEN' },
    { label: '#D22C36', value: 'RED' },
    { label: '#AF8BB1', value: 'PURPLE' },
    { label: '#E96F24', value: 'ORANGE' },
    { label: '#D0A12B', value: 'YELLOW' },
    { label: '#FFFFFF', value: 'WHITE' },
    { label: '#428DFC', value: 'BLUE' },
    { label: '#19F4D6', value: 'CYAN' }
  ]
  let markColor = val
  markColors.forEach(item => {
    if (val === item.value) {
      markColor = item.label
    }
  })
  return markColor
}

Vue.prototype.ExportExcel = function (list, tHeader2, merges, filterVal, title) {
  // 导出数据
  this.list = list

  // 表头数据对应名字
  this.filterVal = filterVal
  // 数据方法
  this.formatJson = function (filterVal, jsonData) {
    return jsonData.map((v) => filterVal.map((j) => v[j]))
  }
  // 导出文件的方法
  this.export2Excel = function () {
    require.ensure([], () => {
      const { export_json_to_excel } = require('@/Excel/Export2Excel')

      const filterVal = this.filterVal
      const list = this.list
      const data = this.formatJson(filterVal, list)
      export_json_to_excel({ multiHeader: tHeader2, data, filename: title, merges })
    })
  }
}

// 友盟埋点
import miniProgram from '@/utils/miniProgram'
if (process.env.NODE_ENV === 'production') {
  Vue.prototype.$uweb = miniProgram
  miniProgram.init()
}

Vue.prototype.$getUuiD = (randomLength) => {
  return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36) + Math.floor(Math.random() * 10) + 1
}
Vue.directive('removeAriaHidden', {
  bind(el, binding) {
    const ariaEls = el.querySelectorAll('.el-radio__original')
    ariaEls.forEach((item) => {
      item.removeAttribute('aria-hidden')
    })
  }
})

Vue.prototype.$getFileType = getFileType

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
