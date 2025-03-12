<template>
  <div class="history-cnt">
    <div
      :class="['history-fixed', scrollTop ? 'history-fixed-shadow' : '']"
      :style="{ right: '0px' }"
    >
      <el-tabs
        v-model="curName"
        type="card"
        @tab-remove="removeTab"
        @tab-click="selectTab"
      >
        <el-tab-pane
          v-for="(item, index) in history"
          :key="item.path"
          :label="item.title"
          :name="item.path"
          :closable="index !== 0"
          :index="index"
          :active-menu="item.path"
        />
      </el-tabs>
      <!--
        :style="{ left: cntMenuLeft, top: cntMenuTop }" -->
      <div
        v-if="cntMenuVisible"
        class="cnt-menu-visible"
        :style="{ left: cntMenuLeft + 'px', top: cntMenuTop + 'px' }"
      >
        <p @click="menuBtn('all')">关闭所有标签页</p>
        <p @click="menuBtn('other')">关闭其他标签页</p>
        <p
          :class="{ grey: pathIndex === history.length - 1 }"
          @click="menuBtn('right')"
        >
          关闭右侧标签页
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { filterAsyncRouter } from '@/store/modules/permission'
import store from '@/store'
export default {
  name: 'HocHistory',
  data() {
    return {
      curName: '',
      scrollTop: false,
      cntMenuVisible: false,
      cntMenuLeft: 0,
      cntMenuTop: 0,
      pathIndex: null // 右击页签下标history的位置
    }
  },
  computed: {
    ...mapGetters([
      'historyWhiteList',
      'history',
      'curHistory',
      'topHeaderPath',
      'topRouter'
    ]),
    isHome: function () {
      return this.$route.path === '/home'
    }
  },
  watch: {
    curHistory: {
      handler(obj) {
        if (obj?.joinPath) {
          this.curName = obj.joinPath
          // 首页所有模块共享 不处理
          if (obj?.joinPath !== '/home') this.setMenu(obj.firstPath)
        }
      },
      immediate: true // 立即触发一次监听
    },
    cntMenuVisible: {
      handler(val) {
        if (val) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.throttledHandleScroll)
    this.initContextmenu()
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.throttledHandleScroll)
  },
  /**
   *  selectTab 切换tab
   *  removeTab 删除tab
   */
  methods: {
    ...mapActions('user', ['setHistory']),
    throttledHandleScroll(event) {
      clearTimeout(this.scrollThrottleTimeout)
      this.scrollThrottleTimeout = setTimeout(() => {
        const scrollPosition = window.scrollY || window.pageYOffset
        this.scrollTop = scrollPosition || 0
      }, 10)
    },
    tansformQuery(query) {
      const newQuery = {}
      for (const key in query) {
        newQuery[key] = query[key]
      }
      return newQuery
    },
    selectTab(obj) {
      const path = obj.name
      if (path !== this.$route.path) {
        const cur = this.history.find(f => f.path === path)
        cur.query = this.tansformQuery(cur?.query || {})
        // name可能同名 删除name,只使用path
        delete cur.name
        this.$router.push(cur)
      }
    },
    removeTab(routerPath) {
      if (routerPath === this.curName) {
        // 删除正在访问的路由 需要重新跳转到最近一个路由去
        const index = this.history.findIndex(f => f.path === routerPath)
        this.$router.push(this.history[index - 1])
      }
      this.setHistory({ type: 'remove', data: routerPath })
    },
    async setMenu(path) {
      this.$store.commit('permission/SET_TOP_HEADER_PATH', path)
      const changeRouter = this.topRouter.find(item => item.path === path)
      const sidebarRoutes = filterAsyncRouter(changeRouter?.children || [])
      await this.$store.dispatch('permission/SetSidebarRouters', sidebarRoutes)
    },

    // 右击处理
    initContextmenu() {
      const HistortEl = document.querySelector('.history-cnt')
      const tabEl = HistortEl.querySelector('.el-tabs__nav.is-top')
      tabEl.oncontextmenu = this.handleContextMenu
    },
    handleContextMenu(e) {
      e.preventDefault()
      this.cntMenuLeft = e.clientX
      this.cntMenuTop = e.clientY + 20
      this.cntMenuVisible = true
      let id = e.target.getAttribute('aria-controls')
      // 没有id的话是因为在X上右击 向上找父类
      if (!id) id = e.target.parentNode.getAttribute('aria-controls')
      const paneEl = document.getElementById(`${id}`)
      const path = paneEl.getAttribute('active-menu')
      this.pathIndex = this.history.findIndex(f => f.path === path)
    },
    closeMenu() {
      this.cntMenuVisible = false
    },
    menuBtn(type) {
      store.commit('user/SET_HISTORY', {
        type: 'splice',
        data: {
          spliceType: type,
          pathIndex: this.pathIndex
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.history-cnt {
  height: $historyHeight;
  background: linear-gradient(
    180deg,
    rgba(246, 250, 255, 1) 20%,
    rgba(246, 250, 255, 0) 100%
  );
  .history-fixed {
    position: fixed;
    top: $headHeight;
    left: $sideBarWidth + 40px;
    z-index: 999;
    min-width: calc(100vw - (#{$sideBarWidth} + 240px));
    /* padding: 10px 0 0 0; */
    /* background: $pageBg; */
    background: linear-gradient(
      180deg,
      rgba(246, 250, 255, 1) 20%,
      rgba(246, 250, 255, 0) 100%
    );
  }
  .cnt-menu-visible {
    width: 110px;
    height: auto;
    border-radius: 8px;
    overflow: hidden;
    opacity: 1;
    background: #ffffff;
    box-shadow: 0 2px 4px 0 #10101040;
    position: fixed;
    z-index: 1000;
    p {
      color: #000000;
      font-size: 12px;
      font-weight: 400;
      padding: 8px 0 8px 6px;
      &:hover {
        background: #e7f0ff;
        color: #0c6fff;
        cursor: pointer;
      }
      &.grey {
        color: #a6a6a6;
        background: #fff;
        cursor: not-allowed;
      }
    }
  }
  ::v-deep .el-tabs--card > .el-tabs__header {
    border: none;
    .el-tabs__nav {
      background: #fff;
      padding: 2px 0 0;
      height: 38px;
      border-radius: 8px 8px 8px 8px;
      box-sizing: border-box;
    }
    .el-tabs__nav,
    .el-tabs__item,
    .el-tabs__item:first-child {
      border: none;
    }
    .el-tabs__item:first-child {
      border-radius: 8px 0 0 8px;
    }
    .el-tabs__item:last-child {
      border-radius: 8px 8px 8px 0;
    }
    .el-icon-close {
      font-size: 14px;
      color: #333;
    }
  }
  ::v-deep .el-tabs__item {
    border-radius: 8px 8px 0 0;
    height: 36px;
    line-height: 36px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    font-style: normal;
    text-transform: none;
    padding: 0 18px 0 18px;
    position: relative;
    /* &.is-active:not(:first-child)::after {
      border: none;
    }
    &.is-active:first-child::before {
      border: none;
    } */
    &.is-active {
      background: #e7f0ff;
      &::before {
        content: '';
        position: absolute;
        width: 11px;
        height: 10px;
        left: -10px;
        bottom: 0;
        background: radial-gradient(
          circle at 0 0,
          transparent 10px,
          #e7f0ff 11px
        );
      }
      &::after {
        content: '';
        position: absolute;
        width: 11px;
        height: 10px;
        right: -10px;
        bottom: 0;
        background: #000;
        background: radial-gradient(
          circle at 100% 0,
          transparent 10px,
          #e7f0ff 11px
        );
      }
      &:first-child::before,
      &:last-child::after {
        height: 0;
        width: 0;
      }
    }
    /* 去除下一个元素的边框 */
    &.is-active + .el-tabs__item::before {
      width: 0;
    }
    &:hover {
      color: #0c6fff;
    }
  }
  ::v-deep .el-tabs__nav-next,
  ::v-deep .el-tabs__nav-prev {
    line-height: 58px;
  }
}
::v-deep .el-tabs__nav-wrap {
  padding-top: 10px;
  .el-tabs__nav-scroll {
    padding: 10px 0;
  }
  .el-tabs__nav {
    transition: box-shadow 1.5s ease;
    .el-tabs__item:focus.is-active.is-focus:not(:active) {
      box-shadow: none;
    }
  }
}

::v-deep .history-fixed-shadow {
  .el-tabs__nav {
    box-shadow: 0 5px 10px 0 #0000001a;
  }
}
</style>
