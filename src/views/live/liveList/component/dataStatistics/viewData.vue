<template>
  <div class="viewData">
    <div class="title">
      <span>{{ title }}</span>
      <el-tooltip class="item" :content="tips" placement="top">
        <img v-if="tips" src="@/assets/image/product/icon.png" class="iconText">
      </el-tooltip>
    </div>

    <div class="dataNumber">
      <i v-if="loading" class="el-icon-loading statisticsLoading" />
      <template v-else>{{ data }}</template>
    </div>

    <div v-if="rateText" class="rate">
      <span class="rateText">{{ rateText }}</span>
      <span class="rateValue">
        <i v-if="loading" class="el-icon-loading statisticsLoading" />
        <template v-else>{{ rate }}</template>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    tips: {
      type: String,
      default: ''
    },
    data: {
      type: [String, Number, null],
      default: ''
    },
    rateText: {
      type: String,
      default: ''
    },
    rate: {
      type: [String, Number, null],
      default: ''
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.viewData {
    display: flex;
    flex-direction: column;
    .title {
       font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
        display: flex;
        align-items: center;
        .iconText {
            margin-left: 8px;
            width: 16px;
            height: 16px;
        }
    }
    .dataNumber {
        margin-top: 16px;
        font-size: 24px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #161616;
        line-height: 24px;
        white-space: nowrap;
    }
    .rate {
        margin-top: 16px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 22px;
        .rateText {
            margin-right: 1em;
        }
    }
}
</style>

