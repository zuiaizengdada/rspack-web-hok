<template>
  <div
    v-show="permsList.includes('videoPublish')&&!isShow && !isDev &&isChrome"
    class="fuxiTips"
  >
    <svg-icon icon-class="icon_error" class-name="icon-error" />
    <div class="el-message__content content">
      <div>
        <span>系统检测到你未启动【伏羲云客户端Plus】，将导致无法同步账号数据，以及正常操作账号一键发布等功能，请点击下载安装！</span>
      </div>
      <span class="a_span" @click="handleOpenView">下载伏羲云客户端</span>
      <!-- <span class="close" @click="handleClose">我知道了</span> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getBrowser2UserAgent } from '@/utils/index'

export default {
  name: 'ChromeMessage',
  data() {
    return {
      permsList: [],
      isShow: true,
      isChrome: true,
      isDev: process.env.NODE_ENV === 'development'
    }
  },
  // 监听addRouters改变
  watch: {
    addRouters: {
      handler: function (val, oldVal) {
        this.init()
      },
      deep: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.init()
    }, 2000)
  },
  copmuted: {
    ...mapGetters(['isNewSocketVideoPublish', 'addRouters']),
    isShow() {
      return this.isNewSocketVideoPublish
    }
  },
  methods: {
    init() {
      this.permsList = this.getPermsList(this.addRouters)
      const browserType = getBrowser2UserAgent()
      this.isChrome = browserType === 'isChrome'
      setTimeout(() => {
        this.isShow = this.isNewSocketVideoPublish
        console.log(this.isShow, 'this.isShow')
      }, 2000)
    },
    // 递归判断数组里面是否有videoPublish参数权限
    getPermsList(arr) {
      let permsList = []
      arr.forEach(item => {
        if (item.children && item.children.length > 0) {
          permsList = permsList.concat(this.getPermsList(item.children))
        } else {
          permsList.push(item.path)
        }
      })
      return permsList
    },
    handleOpenView() {
      this.$emit('openDownloadModal')
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-error {
  font-size: 20px;
  margin-right: 10px;
}
.fuxiTips {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 36px;
  box-sizing: border-box;
  background-color: #ffeded;
  border-color: #ffdbdb;
  height: 50px;
  position: absolute;
  top: 0;
}
.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  .a_span {
    font-weight: 500;
    color: #0c6fff;
    font-size: 16px;
    cursor: pointer;
  }
  .close {
    font-size: 14px;
    color: #777777;
    font-weight: 500;
    cursor: pointer;
  }
}
</style>
