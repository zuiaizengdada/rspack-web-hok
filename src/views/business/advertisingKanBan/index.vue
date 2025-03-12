<template>
  <div class="page-content">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="千川类" name="qichuan">
        <kanban v-if="activeName == 'qichuan'" />
      </el-tab-pane>
      <!-- <el-tab-pane
        label="信息流类"
        name="xinxiliu"
      ><kanban v-if="activeName == 'xinxiliu'" />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import kanban from './components/kanban'
export default {
  components: { kanban },
  data() {
    return {
      activeName: 'qichuan'
    }
  },
  methods: {
    // 切换
    handleClick(tab, event) {}
  }
}
</script>

<style lang="scss" scoped>
.page-content {
  height: 100%;
  padding: 0 0 20px 0;

  ::v-deep .el-tabs {
    height: 100%;
  }
  ::v-deep .el-tabs__nav {
    border: none;
  }
  ::v-deep .el-tabs__item {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border: none;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
    background: #f5f5f5;
    width: 200px;
    text-align: center;
  }
  ::v-deep .is-active {
    background-color: #ffffff;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #0c6fff;
  }
  ::v-deep .el-tabs__content {
    height: calc(100% - 40px);
  }
  ::v-deep .el-tabs__header {
    margin: 0;
    border-bottom: none;
  }
  ::v-deep .el-tab-pane {
    height: 100%;
  }
}
</style>
