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
        <launchStatistics />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import launchStatistics from '@/views/business/operateData/components/head/launchStatistics'
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

