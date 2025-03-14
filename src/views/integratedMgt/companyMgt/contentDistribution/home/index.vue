<template>
  <div class="content-distribution-home hoc-main-height">
    <el-tabs v-model="activeName" class="hok-tabs">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.label"
        :label="item.label"
        :name="item.name"
        lazy
      />
    </el-tabs>
    <template v-if="activeName === 'Desensitization'">
      <Desensitization />
    </template>
    <template v-else-if="activeName === 'Finished'">
      <Finished />
    </template>
  </div>
</template>

<script>
import Finished from './finished/finished'
import Desensitization from './desensitization/desensitization'
export default {
  name: 'ContentDistributionHome',
  components: { Finished, Desensitization },
  data() {
    return {
      activeName: 'Desensitization',
      tabs: [
        { label: '脱敏视频', name: 'Desensitization' },
        { label: '成品视频', name: 'Finished' }
      ]
    }
  },
  created() {
    const { tab } = this.$route.query
    if (tab === 'Finished') {
      this.activeName = 'Finished'
    } else {
      this.activeName = 'Desensitization'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.content-distribution-home {
  min-width: 1100px;
  width: 100%;
  background: #fff;
  padding: 0;
  border-radius: 10px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.05);
}
::v-deep .hok-tabs {
  .el-tabs__nav-wrap {
    padding: 0 20px;
    .el-tabs__item {
      color: #000000;
      font-size: 14px;
      font-weight: 500;
      line-height: 48px;
      height: 48px;
      &.is-active {
        color: var(--subMenuActive);
      }
    }
  }
}
::v-deep .el-table .cell {
  font-weight: 500;
  font-size: 14px;
  color: #333;
}
</style>
