<template>
  <div class="page-content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="我的视频" name="myvideo">
        <myvide ref="myvide" />
      </el-tab-pane>
      <el-tab-pane label="共享视频" name="sharevideo">
        <shareVideo ref="sharevideo" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import myvide from './myVideo/list.vue'
import shareVideo from './shareVideo/list.vue'
export default {
  components: {
    myvide,
    shareVideo
  },
  data() {
    return {
      activeName: 'myvideo'
    }
  },
  watch: {},
  mounted() {},
  created() {
    this.activeName = this.$route.query.activeName || 'myvideo'
  },
  methods: {
    handleClick(tab, event) {
      console.log(this.$refs[tab.name], tab.name, 'this.$refs[tab.name]')
      this.$refs[tab.name].loadTeacherData()
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page-content {
  height: 100%;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  ::v-deep .el-tabs {
    height: 100%;
  }
  ::v-deep .el-tabs__item {
    font-size: 16px;
  }
  ::v-deep .el-tabs__content {
    height: calc(100% - 40px);
  }
  ::v-deep .el-tabs__header {
    margin: 0;
  }
  ::v-deep .el-tab-pane {
    height: 100%;
  }
}
</style>
