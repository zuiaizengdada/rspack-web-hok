<template>
  <!-- 暂不应用 -->
  <div class="zb-wrapper">
    <el-tabs v-model="activeName" class="zb-tabs">
      <el-tab-pane label="所有直播间" name="first">
        <ZBList v-if="activeName === 'first'" />
      </el-tab-pane>
      <el-tab-pane
        label="我的直播间"
        name="second"
      >
        <ZBMYList
          v-if="activeName === 'second'"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ZBList from './components/list'
import ZBMYList from './components/myList'
export default {
  components: {
    ZBList,
    ZBMYList
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style lang="scss" scoped>
.zb-wrapper {
  position: relative;
  width: 100%;
  border-radius: 10px;
  background-color: #fff;
}
::v-deep {
  .zb-tabs {
    .el-tabs__header {
      padding-top: 10px;
      .el-tabs__nav-wrap {
        padding-left: 20px;
        &::after {
          height: 1px;
          background-color: #eff2f6;
        }
      }
    }
  }
}
</style>
