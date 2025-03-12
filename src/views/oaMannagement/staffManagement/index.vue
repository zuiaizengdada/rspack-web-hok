<template>
  <div class="organization">
    <Organization />
  </div>
</template>
<script>
import Organization from './components/organization'

export default {
  components: { Organization },
  data() {
    return {
      activeName: 'organization'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.organization {
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  height: calc(100vh - 160px);
}
::v-deep .el-tabs {
  height: 100%;
}
::v-deep .el-tabs__content {
  height: calc(100% - 55px);
}
::v-deep .el-tabs__content .el-tab-pane {
  height: 100%;
}
::v-deep .el-table th.el-table-column--selection > .cell {
  display: flex;
  justify-content: space-around;
}
</style>
