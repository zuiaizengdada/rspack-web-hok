import Vue from 'vue'
import store from '@/store'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
// import liveLink from './liveLink.vue'
// import changeRobot from './changeRobot.vue'
// import exportScript from './exportScript.vue'
// import addLottery from './addLottery.vue'
// import editLottery from './editLottery.vue'
// import detailLottery from './detailLottery.vue'
// import prizeWinner from './prizeWinner.vue'
// import selectGift from './selectGift.vue'
// import problemEdit from './problemEdit.vue'
// import problemDetail from './problemDetail.vue'
// import addCoupon from './addCoupon.vue'
// import couponRecord from './couponRecord.vue'
// import signRecord from './signRecord.vue'
// 更换用户名弹框
// const LiveLink = Vue.extend(liveLink)
// const ChangeRobot = Vue.extend(changeRobot)
// const ExportScript = Vue.extend(exportScript)
// const AddLottery = Vue.extend(addLottery)
// const EditLottery = Vue.extend(editLottery)
// const DetailLottery = Vue.extend(detailLottery)
// const ProblemEdit = Vue.extend(problemEdit)
// const ProblemDetail = Vue.extend(problemDetail)
// const PrizeWinner = Vue.extend(prizeWinner)
// const SelectGift = Vue.extend(selectGift)
// const AddCoupon = Vue.extend(addCoupon)
// const CouponRecord = Vue.extend(couponRecord)
// const SignRecord = Vue.extend(signRecord)

// const TYPE = { LiveLink, ChangeRobot, ExportScript, AddLottery, EditLottery, DetailLottery, PrizeWinner, SelectGift, ProblemEdit, ProblemDetail, AddCoupon, CouponRecord, SignRecord }
const requireComponent = require.context(
  // 其组件目录的相对路径
  '@/views/product/Dialog',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /\w+\.vue$/
)
const TYPE = {}
requireComponent.keys().forEach(fileName => {
  const componentName = upperFirst(
    camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )
  const componentConfig = requireComponent(fileName)
  TYPE[componentName] = Vue.extend(componentConfig.default || componentConfig)
})

Vue.prototype.$store = store
let instance

export default {
  open(options = {}) {
    if (!(options.type || TYPE[options.type])) {
      return new Error('缺少type参数')
    }
    if (instance) {
      document.body.removeChild(instance.$el)
    }
    // if (!instance) {
    // }
    instance = new TYPE[options.type]({ el: document.createElement('div') })
    for (const key in options) {
      instance[key] = options[key]
    }
    document.body.appendChild(instance.$el)

    Vue.nextTick(() => {
      Vue.prototype.$store = store
      instance.visible = true
    })
  },

  close() {
    if (instance) {
      instance.visible = false
    }
  }
}
