<template>
  <div v-if="texts.length" class="notice">
    <div class="notice-cnt">
      <svg-icon icon-class="noticeBar" class-name="icon-noticeBar" size="24" />
      <div
        class="vertical-text-carousel"
        :style="{ height: carouselHeight + 'px' }"
      >
        <div
          v-if="texts.length"
          class="text-wrapper"
          :style="{ transform: 'translateY(' + offset + 'px)' }"
        >
          <div v-for="(item, index) in texts" :key="index" class="text-item">
            <el-popover
              placement="bottom"
              width="319"
              trigger="hover"
              :content="item.desc"
            >
              <div
                slot="reference"
                class="text-cnt"
                :style="item.style || {}"
                @click="handle(item)"
              >
                {{ item.text }}
              </div>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
    <DownloadModal ref="DownloadModal" />
  </div>
</template>

<script>
import DownloadModal from '@/components/DownloadModal/index.vue'
import { mapGetters } from 'vuex'
import { getBrowser2UserAgent } from '@/utils/index'
export default {
  components: { DownloadModal },
  data() {
    return {
      texts: [
        // {
        //   text: '下载伏羲云客户端',
        //   desc: '系统检测到你未启动【伏羲云客户端】，将导致无法同步账号数据，并且无法正常操作账号一键发布等功能',
        //   link: 'DownloadModal'
        // }
        // {
        //   text: '下载Chrome浏览器',
        //   desc: '检测到你当前使用的不是chrome浏览器，可能存在系统不兼容等问题，请下载chrome浏览器使用伏羲云系统!',
        //   link: 'https://www.google.com/intl/zh-CN/chrome/'
        // }
      ], // 文字内容
      offset: 0, // 偏移量
      currentIndex: 0, // 当前索引
      timer: null, // 定时器
      carouselHeight: 28, // 文字滚动框高度
      transitionDuration: 5, // 动画过渡时间
      isDev: process.env.NODE_ENV === 'development',
      isShow: true,
      isChrome: true
    }
  },
  computed: {
    ...mapGetters(['isNewSocketVideoPublish', 'addRouters'])
  },
  watch: {
    isNewSocketVideoPublish: {
      handler: function (val, oldVal) {
        this.init()
      },
      deep: true
    }
  },
  async mounted() {
    await this.init()
    this.autoPlay()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    initText() {
      // 判断是否为 谷歌浏览器
      const browserType = getBrowser2UserAgent()
      this.isChrome = browserType === 'isChrome'
      if (!this.isChrome) {
        this.texts.push({
          text: '下载Chrome浏览器',
          desc: '检测到你当前使用的不是chrome浏览器，可能存在系统不兼容等问题，请下载chrome浏览器使用伏羲云系统!',
          link: 'https://www.google.cn/chrome/index.html'
        })
      }
    },
    init() {
      this.texts = []
      const permsList = this.getPermsList(this.addRouters)
      this.initText()
      setTimeout(() => {
        this.offset = 0
        const isShow = this.isNewSocketVideoPublish
        //  && this.isChrome
        if (permsList.includes('videoPublish') && !isShow && !this.isDev) {
          this.texts.push({
            text: '下载伏羲云客户端',
            desc: '系统检测到你未启动【伏羲云客户端Plus】，将导致无法同步账号数据，并且无法正常操作账号一键发布等功能',
            link: 'DownloadModal'
          })
        }
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
    autoPlay() {
      this.timer = setInterval(() => {
        this.next()
      }, this.transitionDuration * 1000)
    },
    next() {
      if (this.texts.length === 1) return
      this.currentIndex++
      this.offset = -this.currentIndex * this.carouselHeight
      if (this.currentIndex === this.texts.length - 1) {
        setTimeout(() => {
          this.currentIndex = 0
          this.offset = 0
        }, this.transitionDuration * 1000)
      }
    },
    handle({ link }) {
      if (link === 'DownloadModal') {
        this.$refs.DownloadModal.show()
      } else {
        window.open(link)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.notice {
  flex-shrink: 0;
  height: auto;
  margin: 0 16px;
  display: inline-flex;
  align-items: center;
  .notice-cnt {
    display: inline-flex;
    align-items: center;
    position: relative;
    padding: 0 4px;
    border-radius: 6px 6px 6px 6px;
    border: 1px solid #dcdfe5;
    box-sizing: border-box;
  }
}
.vertical-text-carousel {
  width: 125px;
  height: 28px;
  overflow: hidden;
}

.text-wrapper {
  transition: transform 0.5s ease;
}

.text-item {
  height: 28px;
  line-height: 28px;
  text-align: center;
}
.text-cnt {
  display: block;
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  font-size: 14px;
  color: #0c6fff;
  line-height: 28px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
}
.icon-noticeBar {
  margin-right: 4px;
}
</style>
