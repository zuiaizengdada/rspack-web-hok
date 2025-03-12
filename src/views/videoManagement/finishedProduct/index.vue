<template>
  <div class="finished-product hoc-main-height">
    <el-tabs v-model="activeName" class="hok-tabs">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.label"
        :label="item.label"
        :name="item.name"
        lazy
      />
    </el-tabs>
    <component :is="activeName" />
  </div>
</template>

<script>
import FinishFedProductMy from './cpns/finishedProductMy'
import FinishedProductToMe from './cpns/finishedProductToMe'
export default {
  name: 'ContentDistributionHome',
  components: { FinishFedProductMy, FinishedProductToMe },
  data() {
    return {
      activeName: 'FinishFedProductMy',
      tabs: [
        { label: '我的视频', name: 'FinishFedProductMy' },
        { label: '分发给我', name: 'FinishedProductToMe' }
      ]
    }
  },
  created() {
    const { tab } = this.$route.query
    if (tab === 'FinishedProductToMe') {
      this.activeName = 'FinishedProductToMe'
    } else {
      this.activeName = 'FinishFedProductMy'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.finished-product {
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
        color: $subMenuActive;
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
