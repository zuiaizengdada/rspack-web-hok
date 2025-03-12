<template>
  <div class="page_wrap_view" :class="{active: active}">
    <div class="viewData" @click="$emit('onClick')">
      <div class="title">
        <span>{{ title }}</span>
        <el-tooltip class="item" :content="tips" placement="top">
          <img v-if="tips" src="@/assets/image/product/icon.png" class="iconText" />
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
        <template v-if="!loading">
          <div v-if="keyItem === 'refundAmount'">
            <img v-if="rate > 0" src="~@/assets/image/live/icn_red_down.png" alt="" />
            <img v-if="rate < 0" src="~@/assets/image/live/icn_green_down.png" alt="" />
          </div>
          <div v-else>
            <img v-if="rate > 0" src="~@/assets/image/live/icn_green_up.png" alt="" />
            <img v-if="rate < 0" src="~@/assets/image/live/icn_red_up.png" alt="" />
          </div>

        </template>
        <div v-if="keyItem === 'refundAmount'">
          <span v-if="!loading" class="rateNumber" :class="rate > 0?'red-span':'green-span'">{{ rate | filtersRateFn }}%</span>
        </div>
        <div v-else>
          <span v-if="!loading" class="rateNumber" :class="rate > 0?'green-span':'red-span'">{{ rate | filtersRateFn }}%</span>
        </div>

      </div>
    </div>
    <img v-if="active" class="gouxuan" src="~@/assets/image/live/gouxuan.png" />
    <img class="btn-live" src="~@/assets/image/live/icn_bottom.png" />
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
    keyItem: {
      type: String,
      default: ''
    },
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
  border: 1px solid #F2F2F2;
  border-radius: 5px;
  height: 160px;
  .viewData {
    margin-right: 11px;
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
      span {
        float: left;
        margin-left: 0px;
        color: #000;
      }
      .iconText {
        float: right;
        width: 16px;
        height: 16px;
      }
    }
    .dataNumber {
      margin-top: 20px;
      font-size: 34px;
      font-family: Arial-BoldMT, Arial;
      font-weight: normal;
      color: #000;
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
        color: #000;
        line-height: 17px;
      }
      .rateNumber {
        margin-left: 2px;
        font-size: 14px;
        font-family: ArialMT;
        color: #2C3242;
        line-height: 16px;
      }
      .green-span {
        color: #43CF7C;
      }
      .red-span {
        color: #D43030;
      }
      > img {
        margin-left: 2px;
        width: 16px;
        height: 16px;
      }
    }

  }
  .gouxuan {
    position: absolute;
    right: -1px;
    top: -1px;
    width: 18px;
    height: 18px;
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
}
.page_wrap_view:hover {
  // background: #F7F7F7;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.12);
}
.active {
  border: 1px solid #0c6fff!important;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.12);
}

.btn-live {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 30px;
}
</style>

