<template>
  <div class="index-container">
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="脱敏数据" name="first">
        <TabDesensitization v-if="activeTabName==='first'" />
      </el-tab-pane>
      <el-tab-pane label="使用数据" name="second">
        <TabUseData v-if="activeTabName==='second'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import TabDesensitization from './components/TabDesensitizationData/index.vue'
import TabUseData from './components/TabUseData/index.vue'
export default {
  components: {
    TabDesensitization,
    TabUseData
  },
  data() {
    return {
      activeTabName: 'first'
    }
  }
}
</script>
<style lang="scss" scoped>
 ::v-deep .el-tabs__item{
  font-size: 16px;
}
.index-container{
  background: #fff;
  border-radius: 10px;
  min-height: 100%;
  padding: 15px 20px;
}
</style>
