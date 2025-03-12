<template>
  <div class="page-content">
    <originalVideo />
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="原视频" name="originalVideo">
        <originalVideo />
      </el-tab-pane>
      <el-tab-pane label="脱敏视频" name="desensitizationVideo">
        <desensitizationVideo />
      </el-tab-pane>
    </el-tabs> -->
  </div>
</template>

<script>
import originalVideo from './originalVideo/list.vue'
export default {
  components: {
    originalVideo
  },
  data() {
    return {
      activeName: 'originalVideo'
    }
  },
  watch: {
    $route: {
      handler(n) {
        const route = n.query
        this.activeName = route.tab && route.tab === '1' ? 'desensitizationVideo' : 'originalVideo'
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleClick(tab) {
      this.$router.push('/videoManagement/desensitized?tab=' + tab.index)
    }
  }
}
</script>

<style lang='scss' scoped>
.page-content {
  // height: 100%;
  height: calc(100vh - 90px);
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  ::v-deep .el-tabs__header {
    margin: 0;
  }
  ::v-deep .el-tabs__item {
    font-size: 16px;
  }
}
</style>
