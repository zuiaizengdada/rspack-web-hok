
import '@/assets/css/markdown-css/github-markdown-light.css'
import 'highlight.js/styles/atom-one-dark.css'
import hljs from 'highlight.js'
import Vue from 'vue'
// 通过 import * as hljs from 'highlight.js' 引入
Vue.directive('highlight', function (el) {
  const blocks = el.querySelectorAll('pre code')
  blocks.forEach(block => {
    hljs.highlightElement(block)
    block.classList.add('hljs')
  })
})

