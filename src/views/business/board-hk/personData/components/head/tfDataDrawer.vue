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
        <launchStatistics ref="launchStatistics" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import launchStatistics from '@/views/business/board-hk/personData/components/head/launchStatistics'
export default {
  components: {
    launchStatistics
  },
  props: {
  },
  data() {
    return {
      drawerFlag: false,
      direction: 'rtl'
    }
  },
  watch: {
  },
  mounted() {},
  methods: {
    handleClose() {
      this.drawerFlag = false
    },
    loadData() {
      const uid = this.$route.query?.uId
      const deptId = this.$route.query?.deptId
      this.$nextTick(() => {
        if (uid) {
          this.$refs.launchStatistics.search.advertiserPutterUid = uid
          this.$refs.launchStatistics.search.deptId = deptId
          const search = {
            timeForYear: new Date().getFullYear() + '', // 选择日期的年份
            timeForMonth: (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1 + '', // 选择日期的月份
            pageIndex: 1,
            pageSize: 10,
            advertiserId: '', // 投放账号
            advertiserPutterUid: uid, // 投放人员
            roiReachFlag: '', // 达标状态
            deptId: deptId // 投放部门
          }
          this.$refs.launchStatistics.searchFn(search)
        } else {
          const search = {
            timeForYear: new Date().getFullYear() + '', // 选择日期的年份
            timeForMonth: (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1 + '', // 选择日期的月份
            pageIndex: 1,
            pageSize: 10,
            advertiserId: '', // 投放账号
            advertiserPutterUid: this.$store.getters.userInfo.userId, // 投放人员
            roiReachFlag: '', // 达标状态
            deptId: deptId // 投放部门
          }
          this.$refs.launchStatistics.searchFn(search)
        }
      })
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

