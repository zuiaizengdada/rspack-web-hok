<template>
  <div class="top-menu">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <template v-for="item in topRouter">
        <el-tab-pane
          v-if="!item.hidden"
          :key="item.path"
          :label="item.meta.title"
          :name="item.path"
        />
      </template>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import router from '@/router'
import { filterAsyncRouter } from '@/store/modules/permission'
export default {
  name: 'TopMenu',
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['topRouter', 'topHeaderPath']),
    activeName: {
      get() {
        return this.topHeaderPath
      },
      set(val) {
        this.$store.commit('permission/SET_TOP_HEADER_PATH', val)
      }
    }
  },

  created() {
    // 递归判断当前路由是否在topRouter路由中，并把顶级路由的name赋值给activeName
    const currentRouter = router.currentRoute
    const currentRouterName = currentRouter.name
    // this.activeName = this.topRouter[0].path
    this.$store.commit('permission/SET_TOP_HEADER_PATH', this.topRouter[0]?.path || '')
    const getCurrentName = this.getCrrrentRouterName(
      currentRouterName,
      this.topRouter
    )
    if (getCurrentName) {
      this.$store.commit('permission/SET_TOP_HEADER_PATH', getCurrentName.path)
      this.handleClick({ name: getCurrentName.path })
    }
  },
  methods: {
    // 递归查找这个路由中是否有这个name，并返回这个路由第一级的path
    getCrrrentRouterName(name, arr, parent = null) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === name) {
          return parent || arr[i]
        }
        if (arr[i].children) {
          const foundNode = this.getCrrrentRouterName(
            name,
            arr[i].children,
            parent || arr[i]
          )
          if (foundNode) {
            return foundNode
          }
        }
      }
      return null
    },
    async handleClick(obj) {
      const changeRouter = this.topRouter.find(item => item.path === obj.name)
      const sidebarRoutes = filterAsyncRouter(changeRouter.children)
      await this.$store.dispatch('permission/SetSidebarRouters', sidebarRoutes)
    }
  }
}
</script>

<style lang="scss" scoped>
.top-menu {
  flex: 1;
  -ms-flex-align: start;
  overflow: auto hidden;
  padding: 0 20px 0 35px;
}

::v-deep .el-tabs__header {
  margin: 0;
  .el-tabs__item {
    height: 68px;
    line-height: 68px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    text-align: left;
    font-style: normal;
    text-transform: none;
    &.is-active {
      color: #0c6fff;
    }
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    line-height: 68px;
  }
  .el-tabs__nav-prev,
  .el-tabs__nav-next {
    &.is-disabled {
      color: #0c6fff;
    }
  }
  .el-tabs__active-bar {
    height: 4px;
  }
  .el-tabs__nav-wrap::after {
    height: 0;
  }
}
</style>
