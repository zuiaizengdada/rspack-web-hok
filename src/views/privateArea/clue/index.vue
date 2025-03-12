<template>
  <div class="pageWrap">
    <div v-if="routeName !== 'clueKanban'" class="navHeader">
      <div
        v-for="(item, index) in permsList"
        :key="index"
        class="navItem"
        :class="{ active: $route.name === item.name }"
        @click="$router.push({ name: item.name })"
      >
        {{ item.meta.title }}
      </div>
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
let initPermList = []
export default {
  provide() {
    return {
      call: this.call
    }
  },
  data() {
    return {
      routeName: this.$route.name || 'clueMy',
      permsList: [...initPermList],
      visibleCallPhone: false,
      tmpList: [],
      callClueId: undefined,
      callPhone: undefined,
      isAutoCall: false
    }
  },
  async created() {
    await this.$store.dispatch('user/viewingFlag', 'privateAreaClue')
    this.init()
  },
  activated() {
    this.init()
  },
  mounted() {},
  methods: {
    call(record) {
      eventBus.$emit('handleCall', { ...record })
    },
    getRoutesPermsList(key) {
      const permissionRoutes = this.$store.getters['permission_routes']
      let child = []
      const getRoutesChild = (arr, path) => {
        arr.forEach(i => {
          if (
            i.path === path &&
            i.name === 'privateAreaClue' &&
            i?.children?.length
          ) {
            child = i.children
          }
          if (i.children && i.children.length) {
            getRoutesChild(i.children, path)
          }
        })
      }
      getRoutesChild(permissionRoutes, key)
      return child
    },
    beforeRouteUpdate(to, from, next) {
      console.log(1111111)
      next()
    },
    init() {
      const query = {}
      this.routeName = this.$route.name
      if (this.$route.query.taskId && this.$route.query.taskName) {
        query.taskId = this.$route.query.taskId
        query.taskName = this.$route.query.taskName
      }
      const showPageName = ['clueAll', 'clueMy', 'clueDepartment', 'CluePublicSea']
      const child = this.getRoutesPermsList('clue')?.filter(
        item => !item.hidden && showPageName.includes(item.name)
      )
      this.permsList = [...child]
      initPermList = [...child]
      if (this.$route.path === '/privateArea/clue') {
        if (this.permsList.length > 0) {
          this.$router.replace({
            name: this.permsList[0].name,
            query: query.taskId ? query : {}
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pageWrap {
  padding: 20px 0;
  min-width: 1300px;
  position: relative;
  background: #fff;
  border-radius: 10px;
}
.navHeader {
  display: flex;
  border-bottom: 1px solid #eff2f6;
  padding-left: 20px;
  .navItem {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 24px;
    border-bottom: 2px solid #fff;
    padding-bottom: 9px;
    margin-right: 20px;
    cursor: pointer;
  }
  .active {
    color: #0c6fff;
    border-color: #0c6fff;
  }
}
.content {
  height: calc(100vh - 240px);
}
</style>
