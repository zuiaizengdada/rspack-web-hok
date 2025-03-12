<template>
  <div class="promotionPerformance">
    <!-- 推广业绩 -->
    <div class="dataOverView">
      <DataOverView />
    </div>
    <div class="table_wrap">
      <el-tabs v-model="activeName">
        <el-tab-pane label="推广业绩" name="performance" />
        <el-tab-pane label="推广记录" name="log" class="tabContent" />
      </el-tabs>
      <div class="tabContent">
        <components :is="activeName" />
      </div>
    </div>
  </div>
</template>

<script>
import DataOverView from './dataOverview.vue'
import performance from './promotionPerformance/performance.vue'
import log from './promotionPerformance/log.vue'
export default {
  name: 'PromotionPerformance',
  components: {
    DataOverView,
    performance,
    log
  },
  data() {
    return {
      activeName: 'performance'
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.promotionPerformance {
  height: 100%;
  min-width: 1400px;
  // background: #fff;
  .dataOverView {
    height: 200px;
    background: #fff;
  }
  .table_wrap {
    margin-top: 10px;
    height: calc(100% - 210px);
    background: #fff;
    padding: 10px;
    .tabContent {
      height: calc(100% - 44px);
    }
  }
}
</style>
