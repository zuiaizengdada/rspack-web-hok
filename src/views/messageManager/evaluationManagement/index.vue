<template>
  <div class="evaluation-container">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="`待审核(${num})`" name="pendingReview" />
      <el-tab-pane label="审核通过" name="approveReview" />
      <el-tab-pane label="审核不通过" name="rejectReview" />
    </el-tabs>
    <components :is="activeName" class="evaluation-box" @setNum="setNum" />
  </div>
</template>
<script>
import pendingReview from './components/pendingReview/index'
import approveReview from './components/approveReview/index'
import rejectReview from './components/rejectReview/index'
export default {
  components: {
    pendingReview,
    approveReview,
    rejectReview
  },
  data() {
    return {
      activeName: 'pendingReview',
      num: 0
    }
  },
  methods: {
    setNum(num) {
      this.num = num
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.evaluation-container ::v-deep {
  @include responsive-height(20px);
  /* display: flex;
  flex-direction: column; */
  background: #fff;
  border-radius: 15px;
  .el-tabs__header {
    margin: 0px;
  }
  .page_content {
    padding-bottom: 0px;
  }
  .el-tabs {
    padding: 10px 15px 0;
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
  }
  .evaluation-box {
    flex: 1;
  }
  .filter-container {
    padding: 0px;
  }
  .my-table {
  @include responsive-height(250px);
  }
}
</style>
