import { Message } from 'element-ui'

export default {
  update(el, binding) {
    el.addEventListener('click', function() {
      console.log(binding, '111')
      Message.error({
        message: '开发中'
      })
    })
  }
}
