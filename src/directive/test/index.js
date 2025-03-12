import testalert from './test'
const install = function(Vue) {
  Vue.directive('testalert', testalert)
}

if (window.Vue) {
  window.testalert = testalert
  Vue.use(install); // eslint-disable-line
}

testalert.install = install
export default testalert
