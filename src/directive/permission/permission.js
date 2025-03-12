function checkPermission(el, binding) {
  const { value } = binding
  // const roles = store.getters && store.getters.roles
  if (value && value instanceof Array) {
    if (value[1] && value[1] instanceof Array) {
      const permissionArr = value[0].split(',')
      let hasPermission = false
      const index = permissionArr.findIndex(v => value[1].includes(v))
      hasPermission = index > -1
      // const hasPermission = value[1].includes(value[0])
      // value[1]
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
    // }
  } else {
    throw new Error(`need roles! Like v-permission="['system:user:add',['system:user:add']]"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  },
  beforeUpdate(el, binding) {
    checkPermission(el, binding)
  }
}
