<template>
  <div class="page_wrap_view">
    <div class="viewData" :class="{active: active}" @click="$emit('onClick')">
      <div class="title">
        <span>{{ title }}</span>
        <el-tooltip class="item" :content="tips" placement="top">
          <img v-if="tips" src="@/assets/image/product/icon.png" class="iconText">
        </el-tooltip>
      </div>

      <div class="dataNumber">
        <i v-if="loading" class="el-icon-loading statisticsLoading" />
        <template v-else>
          <template v-if="Number(data) > 10000000">
            <el-tooltip class="item" effect="dark" :content="`${render ? render(data) : (data.toString() || '0')}`" placement="top">
              <span>{{ data | filtersLarge }}</span>
            </el-tooltip>
          </template>
          <template v-else>
            {{ render ? render(data) : (data || 0) }}
          </template>
        </template>
      </div>

      <div v-if="rateText" class="rate">
        <i v-if="loading" class="el-icon-loading statisticsLoading" />
        <span v-if="!loading" class="rateText">{{ rateText }}</span>
        <span v-if="!loading" class="rateNumber">{{ rate | filtersRateFn }}%</span>
        <template v-if="!loading">
          <img v-if="rate > 0" src="~@/assets/image/live/up.png" alt="">
          <img v-if="rate < 0" src="~@/assets/image/live/down.png" alt="">
        </template>
      </div>

      <img v-if="active" class="gouxuan" src="~@/assets/image/live/gouxuan.png">
    </div>

    <div v-if="!ifLast" class="line" />
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
export default {
  filters: {
    // 百分比处理(小数转百分制，取2位小数)
    filtersRateFn(rate) {
      if (!rate) {
        return '0'
      } else {
        return parseFloat(BigNumber(Math.abs(+rate || 0))).toFixed(2)
          .toString()
          .replace(/(\.00)$/, '')
      }
    },
    filtersLarge(number) {
      console.log(number, 'number')
      if (!number) {
        return '0'
      } else {
        return BigNumber(number).div(1000000).toString().match(/^\d+(?:\.\d{0,2})?/) + '万'
      }
    }
  },
  components: {},
  props: {
    active: {
      type: Boolean,
      default: false
    },
    ifLast: {
      type: Boolean,
      default: false
    },
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
    },
    render: {
      type: [Function, null],
      default: null
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    // 如果显示的数据超过
  }
}
</script>

<style lang='scss' scoped>
.page_wrap_view {
  padding-left: 16px;
  position: relative;
  .viewData {
    margin-right: 16px;
    display: flex;
    flex-direction: column;
    text-align: center;
    height: 126px;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    .title {
      padding-top: 16px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3C455C;
      line-height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      .iconText {
        margin-left: 8px;
        width: 16px;
        height: 16px;
      }
    }
    .dataNumber {
      margin-top: 12px;
      font-size: 32px;
      font-family: Arial-BoldMT, Arial;
      font-weight: bolder;
      color: #2C3242;
      line-height: 37px;
    }
    .rate {
      margin-top: 9px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      .rateText {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #757575;
        line-height: 17px;
      }
      .rateNumber {
        margin-left: 8px;
        font-size: 14px;
        font-family: ArialMT;
        color: #2C3242;
        line-height: 16px;
      }
      > img {
        margin-left: 2px;
        width: 16px;
        height: 16px;
      }
    }
    &:hover {
      background: #F7F7F7;
    }
    .gouxuan {
      position: absolute;
      right: -1px;
      top: -1px;
      width: 22px;
      height: 19px;
    }
  }
  .line {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 78px;
    background: #E8EBEE;
  }
  .active {
    background: #F4FBFF!important;
    border: 1px solid #00A3FF!important;
  }
}
</style>

