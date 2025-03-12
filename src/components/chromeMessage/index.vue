<template>
  <div v-show="!isChrome" class="el-message el-message--error" style="top: 20px; z-index: 9999;width:1000px">
    <svg-icon icon-class="icon_error" class-name="icon-error" />
    <div class="el-message__content content">
      <div>
        <span>检测到你当前使用的不是Chrome浏览器，可能存在系统不兼容等问题，请下载Chrome浏览器使用伏羲云系统！</span>
      </div>
      <span
        class="a_span"
        @click="handleOpenView"
      >下载Chrome浏览器</span>
      <!-- <span class="close" @click="handleClose">我知道了</span> -->
    </div>
  </div>
</template>

<script>
import { getBrowser2UserAgent } from '@/utils/index'
export default {
  name: 'ChromeMessage',
  data() {
    return {
      isChrome: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.init()
    }, 2000)
  },
  methods: {
    init() {
      const browserType = getBrowser2UserAgent()
      console.log(browserType, 'browserType')
      this.isChrome = browserType === 'isChrome'
    },
    handleOpenView() {
      window.open('https://www.google.cn/intl/zh-CN/chrome/')
    },
    handleClose() {
      this.isChrome = true
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-error{
    font-size: 20px;
    margin-right: 10px;
}
.content{
    display:flex;
    justify-content: space-between;
    align-items: center;
    flex:1;
    .a_span{
        font-weight: 500;
        color: #0C6FFF;
        font-size: 16px;
        cursor: pointer;
    }
    .close{
        font-size: 14px;
        color: #777777;
        font-weight: 500;
        cursor: pointer;
    }
}
</style>
