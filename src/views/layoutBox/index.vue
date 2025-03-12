<!-- 新增缓存上次访问过的三级路由  -  菜单配置当前路由是否缓存 -->
<template>
  <MCard class="pageWrap">
    <div class="navHeader">
      <div
        v-for="(item, index) in pathList"
        :key="index"
        class="navItem"
        :class="{ 'navItem-active': getActive(item) }"
        @click="handlePath(item)"
      >
        {{ item.meta.title }}
      </div>
    </div>
    <div class="content">
      <router-view />
    </div>
  </MCard>
</template>

<script>
// 当前路由地址
let layoutBox = {}
import { mapGetters } from 'vuex'
import { queryEmployeeType } from '@/api/liveRoom/index'
export default {
  name: 'LayoutBox',
  components: {},
  data() {
    return {
      pathList: [],
      employeeType: '' // 查询当前登录人的员工类型 1-负责人 2-小伙伴
    }
  },
  computed: {
    ...mapGetters(['permission_routes', 'initPage'])
  },
  // async beforeRouteEnter(to, from, next) {
  //   if (to.path === '/privateLive/liveNewRoom') {
  //     const qx = await queryEmployeeType()
  //     console.log('pathList------')
  //     if (qx && qx.data === 2) {
  //       next('/privateLive/liveNewRoom/myNewLive')
  //       return
  //     } else {
  //       next()
  //     }
  //   } else {
  //     next()
  //   }
  // },
  async created() {
    await this.getQueryEmployeeType()
  },

  mounted() {
    this.pageInit()
  },
  activated() {
    this.pageInit()
  },
  methods: {
    async getQueryEmployeeType() {
      try {
        const qx = await queryEmployeeType()
        if (qx) {
          this.employeeType = qx.data
        }
      } catch (error) {
        console.log('error', error)
      }
    },
    getActive(item) {
      // 兼容4级路由
      const children =
        item?.children?.filter(
          i => i.name === this.$route.name || i.path === this.$route.path
        ) ?? []
      return this.$route.name === item.name || children.length
    },
    getStorePath(j) {
      layoutBox = j
      // 直播列表 是员工默认定位到 我的直播
      if (
        layoutBox.name === 'liveNewList' &&
        layoutBox.children &&
        this.employeeType === 2
      ) {
        const routeobj = j.children.find(f => f.path === 'myNewLive')
        if (routeobj) return routeobj
      }
      const bol = layoutBox?.meta?.noCache
      if (bol) return j?.children[0]
      return (
        j.children?.find(item => item?.path === this.initPage[j?.path]) ||
        j.children[0]
      )
    },
    handlePath(item) {
      const bol = layoutBox?.meta?.noCache
      if (!bol) {
        this.$store.dispatch('table/setInitPage', {
          [layoutBox.path]: item?.path
        })
      }
      this.$router.push({ name: item.name })
    },
    pageInit() {
      const path = this.$route.path
      const name = this.$route.name
      console.log('path---', path, name)
      // 一级路由
      this.permission_routes?.forEach(i => {
        i.children &&
          i.children?.forEach(j => {
            if (j.path === path || j.name === name) {
              if (j.children.length) {
                const isPath = this.getStorePath(j)
                this.$router.replace({ name: isPath.name })
              }
            } else {
              j.children &&
                j.children?.forEach(v => {
                  if (v.path === path || v.name === name) {
                    this.pathList =
                      j.children?.filter(item => !item.hidden) || []
                  }
                  if (v.children?.length) {
                    v.children.forEach(item => {
                      if (item.path === path || item.name === name) {
                        this.pathList =
                          j.children?.filter(item => !item.hidden) || []
                      }
                    })
                  }
                })
            }
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pageWrap {
  min-width: 1400px;
}
.card {
  padding: 10px 0 0 0;
}
.navHeader {
  display: flex;
  border-bottom: 1px solid #eff2f6;
  padding-left: 20px;
  .navItem {
    font-size: 14px;
    font-family: 'Microsoft YaHei';
    color: #000;
    line-height: 24px;
    border-bottom: 2px solid #fff;
    padding-bottom: 9px;
    margin-right: 20px;
    cursor: pointer;
  }
  .navItem-active {
    color: #0c6fff;
    border-color: #0c6fff;
  }
}
.pageWrap {
  height: calc(100% - 72px);
  display: flex;
  flex-direction: column;
}
.content {
  height: 100%;
}
</style>
