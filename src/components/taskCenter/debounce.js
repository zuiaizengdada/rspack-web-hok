// 按钮做防抖
export default {
  data() {
    return {
      debounceTimer: null
    }
  },
  methods: {
    debounceMethods(func, ...args) {
      const context = this
      if (this.debounceTimer) clearTimeout(this.debounceTimer)
      const callNow = !this.debounceTimer // 是否立即执行
      this.debounceTimer = setTimeout(() => {
        this.debounceTimer = null
      }, 1000)
      if (callNow) func.apply(context, args)
    }
  }
}

// 可以用全部引入

// import Vue from 'vue';
// import debounce from '../src/mixins/debounce'

// Vue.mixin(debounce)
// 也可以在按需引入

// import mixin from '@/mixins/mixin'  //按需引入需要的页面

// export default {

// 	mixins: [mixin],   //这样就可以直接使用方法了   this.方法名()

//     data() {
// 	    return {
// 	    }
//     },

// 	mounted() {

// 	}
// }

// 改写原本的点击方式，例如本来的方式

// @click="save(item,index)"
// 传参直接写入方法的后面即可

// @click="debounceMethods(save,item,index)"
