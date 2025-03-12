// 地址本: 选人
import Vue from 'vue'
import AddressBook from './index.vue'
const Toast = Vue.extend(AddressBook)

let instance

export default {
  open(options = {}) {
    if (!instance) {
      instance = new Toast({
        el: document.createElement('div')
      })
    }
    if (instance.visible) return
    instance.tips = typeof options === 'string' ? options : options.tips || ''
    document.body.appendChild(instance.$el)

    Vue.nextTick(() => {
      instance.visible = true
    })
  },

  close() {
    if (instance) {
      instance.visible = false
    }
  },

  install(vue) {
    const ToastCon = vue.extend(AddressBook)
    const ins = new ToastCon()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$AddressBook2 = (obj) => {
      const {
        checkDept = [],
        checkUser = [],
        visible = false,
        multiple = true,
        isShowSelect = false,
        title = '选择',
        type = [0],
        params = {},
        disabledDept = [],
        disabledUser = [],
        maxlength = 0,
        minlength = 1,
        ifAll = false,
        defaultParentId = '0'
      } = obj
      console.log(type, 'type')
      ins.title = title
      ins.parentId = defaultParentId
      ins.visible = visible
      ins.multiple = multiple
      ins.isShowSelect = isShowSelect
      ins.type = type
      ins.params = params
      ins.disabledDept = disabledDept
      ins.disabledUser = disabledUser
      ins.defaultCheckUser = checkUser
      ins.defaultCheckDept = checkDept
      ins.maxlength = maxlength
      ins.minlength = minlength
      ins.ifAll = ifAll
      if (type.includes(0)) {
        // 选部门
        // ins.checkDept = JSON.parse(JSON.stringify(defultCheck))
        ins.checkDept = JSON.parse(JSON.stringify(checkDept))
        const checkDeptIds = []
        ins.checkDept.map(v => {
          return checkDeptIds.push(v.deptId)
        })
        ins.checkDeptIds = checkDeptIds
      } else if (type.includes(1)) {
        // 选人
        ins.checkUser = JSON.parse(JSON.stringify(checkUser))
        const checkUserIds = []
        ins.checkUser.map(v => {
          return checkUserIds.push(v.userId)
        })
        ins.checkUserIds = checkUserIds
      }
      if (obj.success) {
        ins.success = obj.success
      }
    }
  }
}
