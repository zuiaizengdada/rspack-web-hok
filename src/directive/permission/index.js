
import Vue from 'vue'
const instructFiles = require.context('./', true, /\.js$/)
const instructs = instructFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = instructFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})
for (const key in instructs) {
  if (instructs[key]) {
    Vue.directive(key, instructs[key])
    window[key] = instructs[key]
  }
}
