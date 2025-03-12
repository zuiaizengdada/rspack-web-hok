<template>
  <div class="home-group-item">
    <div class="top">
      <div class="title">{{ title }}</div>
      <div v-if="maxWidth > 20" class="carousel">
        <i class="carousel-icon el-icon-arrow-left" @click="carouselFn(-1)" />
        <i class="carousel-icon el-icon-arrow-right" @click="carouselFn(1)" />
      </div>
    </div>
    <div :ref="'bottomScrollRef' + refKey" class="bottom-scroll">
      <div
        :ref="'bottomRef' + refKey"
        class="bottom"
        :style="{ transform: `translateX(-${curLeft}px)` }"
      >
        <div
          v-for="(item, index) in list"
          :key="index"
          @click.stop="gotoPage(item)"
        >
          <template v-if="item.meta && item.meta.bigIcon">
            <img :src="item.meta.bigIcon" alt="" />
          </template>
          <template v-else>
            <img :src="defaultBigIcon" alt="" />
          </template>
          <div>
            <p>
              <template v-if="item.meta && item.meta.title">
                {{ item.meta.title }}
              </template>
              <template v-else>
                {{ '--' }}
              </template>
            </p>
          </div>
        </div>
      </div>
      <div v-if="curLeft > 0" class="shadow-left" />
      <div v-if="curLeft < maxWidth - 20" class="shadow-right" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { filterAsyncRouter } from '@/store/modules/permission'
export default {
  name: 'HomeGroupItem',
  props: {
    refKey: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      curLeft: 0,
      maxWidth: 0,
      scrollWidth: 0,
      defaultBigIcon:
        'https://oss.hokkj.cn/hok_liveRoom/img/fccmf583scg000081.png',
      setTimer: null,
      observer: null
    }
  },
  computed: {
    ...mapGetters(['topRouter'])
  },
  mounted() {
    this.$nextTick(() => {
      try {
        const targetElement = this.$refs['bottomScrollRef' + this.refKey]
        this.observer = new ResizeObserver(entries => {
          entries.forEach(entry => {
            this.setWidth(entry.contentRect.width)
          })
        })
        if (targetElement) this.observer.observe(targetElement)
      } catch (error) {
        console.log('error---ResizeObserver', error)
      }
    })
  },
  destroyed() {
    try {
      const targetElement = this.$refs['bottomScrollRef' + this.refKey]
      if (targetElement) this.observer.unobserve(targetElement)
    } catch (error) {
      console.log('error---unobserve', error)
    }
  },
  methods: {
    setWidth(width) {
      if (this.setTimer) clearTimeout(this.setTimer)
      this.setTimer = setTimeout(() => {
        this.scrollWidth =
          width || this.$refs['bottomScrollRef' + this.refKey]?.clientWidth
        this.maxWidth = this.list.length * 100 - this.scrollWidth + 20
      })
    },
    carouselFn(num) {
      if (
        (this.curLeft === 0 && num === -1) ||
        (this.curLeft >= this.maxWidth - 20 && num === 1)
      ) {
        return
      }
      const sum = this.curLeft + num * 300
      if (sum > this.maxWidth) {
        this.curLeft = this.maxWidth - 20
      } else if (sum < 100) {
        this.curLeft = 0
      } else {
        this.curLeft = sum
      }
    },
    async gotoPage(item) {
      console.log('item----', item)
      const changeRouter = this.topRouter.find(i => i.id === item.firstId)
      const sidebarRoutes = filterAsyncRouter(changeRouter.children)
      this.$store.commit('permission/SET_TOP_HEADER_PATH', item.topParentPath)
      await this.$store.dispatch('permission/SetSidebarRouters', sidebarRoutes)
      if (item.path) {
        this.$router.push({ path: item.joinPath, meta: item.meta })
      } else {
        this.$message.warning('该菜单未配置路由')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-group-item {
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  width: calc(50% - 10px);
  margin-bottom: 20px;
  .top {
    padding: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      color: #2c3242;
      font-size: 16px;
      font-weight: 400;
      line-height: 20px;
    }
    .carousel-icon {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid #bfbfbf;
      color: #bfbfbf;
      font-size: 12px;
      line-height: 17px;
      text-align: center;
      margin-left: 10px;
      font-weight: bold;
      &:hover {
        color: #0c6fff;
        border-color: #0c6fff;
        cursor: pointer;
      }
    }
  }
  .bottom-scroll {
    width: 100%;
    padding-left: 14px;
    overflow-x: auto;
    position: relative;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    .bottom {
      display: flex;
      width: auto;
      transition: transform 0.5s ease-out;
      cursor: pointer;
      > div {
        margin-right: 24px;
      }
      img {
        height: 76px;
        width: 76px;
        max-width: 76px;
      }
      p {
        color: #2c3242;
        font-size: 12px;
        font-weight: 400;
        text-align: center;
        line-height: 18px;
        margin: 10px 0;
      }
    }
    .shadow-right {
      position: absolute;
      top: 0;
      right: 0;
      display: inline-block;
      height: 100%;
      width: 61px;
      background: linear-gradient(90deg, #ffffff00 0%, #ffffff 100%);
    }
    .shadow-left {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      height: 100%;
      width: 61px;
      background: linear-gradient(-90deg, #ffffff00 0%, #ffffff 100%);
    }
  }
}
</style>
