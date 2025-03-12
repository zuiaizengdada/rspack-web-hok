<template>
  <div class="online-student-container">
    <div class="student-control">
      <div class="student-list">
        <div
          v-for="item in tabs"
          :key="item.name"
          class="student-child"
          :class="{'student-active':getActive(item)}"
          @click="onClickPath(item)"
        >
          {{ item.title }}
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      pathList: [],
      optionsApproval: [],
      tabs: [],
      active: ''
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'initPage'
    ])
  },
  activated() {
    this.pageInit()
  },
  mounted() {
    this.pageInit()
  },
  methods: {
    onClickPath(item) {
      this.$router.replace({ name: item.name })
      this.$store.dispatch('table/setInitPage', { '/deliver/studentManagement/live': item.path })
      this.active = item.name
    },
    getActive(item) {
      return this.$route.name === item.name
    },
    pageInit() {
      const currentRouter = this.permission_routes.filter(v => v.path === '/deliver')
      if (currentRouter.length && currentRouter[0].children) {
        const liveListArr = currentRouter[0].children.filter(v => v.path === 'studentManagement')
        if (liveListArr.length) {
          this.pathList = liveListArr[0].children.filter(i => i.path === '/deliver/studentManagement/live')
          this.tabs = this.pathList[0]?.children.map(i => {
            return {
              ...i,
              title: i.meta.title
            }
          }) ?? []
          if (this.$route.path === '/deliver/studentManagement/live') {
            if (this.tabs.length > 0) {
              this.$uweb?.setAction('Event_Play_page')
              const isPath = this.tabs?.find(item => item.path === this.initPage['/deliver/studentManagement/live']) || this.tabs[0]
              this.onClickPath(isPath)
            }
          }
          console.log('333', this.tabs)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.student-control {
  background: #f3f3f3;
  border-radius: 4px;
  padding: 2px;
  margin: 15px 30px;
  display: inline-block;
  .student-list {
    display: flex;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
              supported by Chrome, Edge, Opera and Firefox */
    .student-child {
      width: 88px;
      height: 32px;
      line-height: 32px;
      background: #f3f3f3;
      border-radius: 2px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      text-align: center;
      cursor: pointer;
    }
    .student-active {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #0c6fff;
      background: #ffffff;
    }
  }
}
</style>
