<template>
  <div v-loading="loadding" class="wrapper-online-view" :class="itemObj.bizType === bizTypeActive?'active-show':''" @click="changeTheBizType(itemObj)">
    <div class="wrapper-top-cls">
      <div class="wrapper-top-cls-left">
        <span>{{ itemObj.bizTypeName }}</span>
        <span class="gmv-left-gmv"><em />{{ formatNumber(itemObj.orderCount,0) }}单</span>
        <span v-if="chooseType === 1" class="gmv-right-detail" @click.stop="chooseBangDan(itemObj)">详情&nbsp;&nbsp;></span>
      </div>
      <div class="wrapper-center-cls">
        <span class="gmv-span"><em>￥</em>{{ filterPriceNoCompany(itemObj.amount) }}<em>{{ filterPriceReturnCompany(itemObj.amount) }}</em></span>
        <div class="gmv-center-detail">
          <span>对比{{ contrastString }}</span>
          <span class="lc">{{ filterPrice(itemObj.amountDiffer) }}</span>
          <em />
          <div v-if="itemObj.bizType === bizTypeActive" class="huanbi-cls">
            <span>{{ itemObj.amountLinkRatio>1000?'1000%+':itemObj.amountLinkRatio+'%' }}</span>
            <img v-if="itemObj.amountLinkRatio < 0" src="../../../../../assets/image/business/icn_down.png" />
            <img v-else-if="itemObj.amountLinkRatio > 0" src="../../../../../assets/image/business/icn_up.png" />
          </div>
          <div v-else class="huanbi-cls">
            <div v-if="itemObj.bizTypeName === '退款'">
              <span :class="itemObj.amountLinkRatio>0?'red-span':'green-span'">{{ itemObj.amountLinkRatio>1000?'1000%+':itemObj.amountLinkRatio+'%' }}</span>
              <img v-if="itemObj.amountLinkRatio < 0" src="../../../../../assets/image/business/icn_green_down.png" />
              <img v-else-if="itemObj.amountLinkRatio > 0" src="../../../../../assets/image/business/icn_red_down.png" />
            </div>
            <div v-else>
              <span :class="itemObj.amountLinkRatio>0?'green-span':'red-span'">{{ itemObj.amountLinkRatio>1000?'1000%+':itemObj.amountLinkRatio+'%' }}</span>
              <img v-if="itemObj.amountLinkRatio < 0" src="../../../../../assets/image/business/icn_red_up.png" />
              <img v-else-if="itemObj.amountLinkRatio > 0" src="../../../../../assets/image/business/icn_green_up.png" />
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { filterPrice, filterPriceNoCompany, filterPriceReturnCompany, formatNumber } from '@/utils'
export default {
  components: {
  },
  props: {
    itemObj: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: function() {
        return {
          amount: 0,
          amountDiffer: 0,
          amountLinkRatio: 0,
          bizType: 0,
          bizTypeName: '',
          orderCount: 0,
          refundRatio: 0
        }
      }
    },
    chooseType: {
      type: [String, Number],
      default: 0
    },
    contrastString: {
      type: String,
      default: ''
    },
    bizTypeActive: {
      type: [String, Number],
      default: 0
    },
    loadding: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  provide() {
  },
  mounted() {
  },
  created() {
  },
  methods: {
    filterPrice,
    formatNumber,
    filterPriceNoCompany,
    filterPriceReturnCompany,
    changeTheBizType(obj) {
      this.$emit('changeTheBizType', obj)
    },
    chooseBangDan(obj) {
      this.$emit('changeToList', obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper-online-view {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    .wrapper-top-cls {
      width: 100%;
      height: 40px;
      padding: 20px 20px;
      .wrapper-top-cls-left {
        width: 100%;
        span {
            color: #000;
            font-family: "Microsoft YaHei";
            font-size: 18px;
            font-style: normal;
            font-weight: 600;
            line-height: 16px;
        }
        span.gmv-left-gmv {
            margin-left: 10px;
            border-radius: 20px;
            background: #E9F2FF;
            padding: 6px 12px;
            color: #3e4d89;
            font-family: "Microsoft YaHei";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            display: inline-block;
            em {
              float: left;
              width: 8px;
              height: 8px;
              margin-top: 4px;
              background: #3E4E89;
              border-radius: 100%;
              margin-right: 6px;
            }
        }
        .gmv-right-detail {
          float: right;
          margin-top: 4px;
          color: #666;
          font-family: "Microsoft YaHei";
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 14px;
          cursor: pointer;
        }
      }
    }
    .wrapper-center-cls {
      width: 100%;
      height: 100px;
      margin-top: -21px;
      text-align: center;
      .gmv-span {
            color: #000;
            text-align: center;
            font-family: "Microsoft YaHei";
            font-size: 34px;
            font-style: normal;
            font-weight: 600;
            em {
                font-style: normal;
                font-size: 20px;
                margin-left: 5px;
                font-weight: lighter;
            }
      }
      .gmv-center-detail {
          width: 100%;
          span {
              color: #666;
              text-align: center;
              font-family: "Microsoft YaHei";
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: 14px;
          }
          span.lc {
              margin-left: 8px;
          }
          em {
              width: 1px;
              height: 14px;
              background: #fff;
              margin-left: 10px;
              margin-right: 10px;
              display: inline-block;
          }
          img {
              width: 16px;
              height: 16px;
              margin-left: 8px;
              margin-top: -2px;
              display: inline-block;
          }
      }
    }
}

.active-show {
  background: linear-gradient(315deg, #00C8FF 0%, #0091FF 100%);
  .wrapper-top-cls{
    .wrapper-top-cls-left {
        width: 100%;
        span {
            color: #fff;
        }
        span.gmv-left-gmv {
          background: #ffffff33;
          color: #fff;
          em {
              background: #fff;
          }
        }
        .gmv-right-detail {
          color: #fff;
        }
      }
  }
  .wrapper-center-cls {
      width: 100%;
      height: 100px;
      text-align: center;
      .gmv-span {
        color: #ffffff;
      }
      .gmv-center-detail {
        width: 100%;
        span {
          color: #d3f3ff;
        }
        em {
          background: #fff;
        }
      }
    }
}

.huanbi-cls {
  display: inline-block;
}
.green-span {
  color: #43CF7C!important;
}
.red-span {
  color: #D43030!important;
}

.hidden-cls {
  display: none;
}
</style>
