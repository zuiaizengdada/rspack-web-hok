import Vue from 'vue'
import phoneModel from './index.vue'

const OrderBox = Vue.extend(phoneModel)

phoneModel.install = function (data) {
  const instance = new OrderBox({
    data
  }).$mount()

  document.body.appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.dialogVisible = true
  })
}
export default phoneModel.install
