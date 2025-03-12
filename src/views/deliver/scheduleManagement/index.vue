<template>
  <!-- 班期管理 -->
  <div class="pageWrap">
    <div class="navHeader">
      <div
        v-for="(item, index) in arr"
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
import { mapGetters } from 'vuex'
export default {
  name: 'ScheduleManagement',
  components: {},
  data() {
    return {
      arr: []
    }
  },
  computed: {
    ...mapGetters(['permission_routes'])
  },
  created() {},
  mounted() {
    this.pageInit()
  },
  methods: {
    pageInit() {
      const currentRouter = this.permission_routes.filter(v => {
        return v.path === '/deliver'
      })
      if (currentRouter.length > 0 && currentRouter[0].children) {
        const liveListArr = currentRouter[0].children.filter(v => {
          return v.path === 'scheduleManagement'
        })
        if (liveListArr.length > 0) {
          this.arr =
            liveListArr[0].children.filter(v =>
              [
                'scheduleManagementAllSchedule',
                'scheduleManagementMySchedule'
              ].includes(v.path)
            ) || []
        }
      }
      if (this.$route.path === '/deliver/scheduleManagement') {
        if (this.arr.length > 0) {
          this.$router.replace({ name: this.arr[0].name })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pageWrap {
  min-width: 1300px;
  background: #fff;
  padding: 10px 0px;
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
  height: calc(100% - 236px);
}
</style>
