<template>
  <div class="AppDatePicker">
    <el-drawer
      title="投放账号数据"
      :visible.sync="drawerFlag"
      :direction="direction"
      :size="1100"
      :before-close="handleClose"
    >
      <div class="tfzh-content">
        <launchStatistics ref="launchStatisticsRef" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import launchStatistics from './launchStatistics'
export default {
  components: {
    launchStatistics
  },
  data() {
    return {
      deptId: '',
      drawerFlag: false,
      direction: 'rtl'
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    toLoaderDeptID(id) {
      this.$nextTick(() => {
        const search = {
          timeForYear: new Date().getFullYear() + '', // 选择日期的年份
          timeForMonth: (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1 + '', // 选择日期的月份
          pageIndex: 1,
          pageSize: 10,
          advertiserId: '', // 投放账号
          advertiserPutterUid: '', // 投放人员
          roiReachFlag: '', // 达标状态
          deptIdFlag: '',
          hasDeptFlag: !!id,
          deptId: id // 投放部门
        }
        // this.$refs.launchStatisticsRef.search.secondDeptId = id
        // this.$refs.launchStatisticsRef.search.hasDeptFlag = !!id
        this.$refs.launchStatisticsRef.searchFn(search)
      })
    },
    handleClose() {
      this.drawerFlag = false
    }
  }
}
</script>

  <style lang="scss" scoped>
  ::v-deep .el-drawer__header{
      padding-bottom: 15px;
      margin-bottom: 15px!important;
      border-bottom: 1px solid #ececec!important;
  }

  .tfzh-content {
      padding: 0px 15px;
  }
  </style>

