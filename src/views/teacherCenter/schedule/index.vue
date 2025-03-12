<template>
  <div class="schedule-container hoc-main-height">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="排期汇总表" name="first">
        <scheduleSummary />
      </el-tab-pane>
      <el-tab-pane label="IP排期表" name="second">
        <teacherSchedule />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import teacherSchedule from './teacherSchedule'
import scheduleSummary from './scheduleSummary'
export default {
  components: {
    teacherSchedule,
    scheduleSummary
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const tab = this.$route.query.tab
      if (tab) {
        this.activeName = tab
      }
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style lang="scss" scoped>
.schedule-container ::v-deep {
  background: #fff;
  padding: 15px;
  .el-tabs__item {
    font-size: 16px;
  }
}
</style>
