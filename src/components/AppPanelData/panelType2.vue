<template>
  <div
    :class="[selectList.includes(sort)?'panel2 selectPanel':'panel2',isPersonal?'sty2':'',flag?'fristy':'']"
    @click="$emit('selectPanel',sort)"
  >
    <img v-if="selectList.includes(sort)" :src="iconPanel" class="iconPanl">
    <div :class="`tips tips${sort}`" />
    <span class="f-r-t">
      <em>{{ content.title }}</em>
      <el-tooltip class="item" effect="dark" :content="content.titleTips" placement="top">
        <img src="@/assets/image/product/icon.png">
      </el-tooltip>
    </span>
    <div v-if="flag" class="type2 fl fl_ai_c ">
      <div class="price-box fl1">
        <div v-if="content.amount || content.amount === 0" class="price">
          ¥ {{ filterPrice(content.amount) }}
        </div>
      </div>
      <div class="price-box fl1">
        <div class="monthPrice mt0">
          <span v-if="content.contemporaneousPeriodAmount || content.contemporaneousPeriodAmount===0">
            {{ title }}:¥ {{ filterPrice(content.contemporaneousPeriodAmount) }}
          </span>
          <span v-if="content.contemporaneousPeriodOrderTotal || content.contemporaneousPeriodOrderTotal === 0">
            {{ title }}: {{ content.contemporaneousPeriodOrderTotal }}
          </span>
          <span v-if="content.contemporaneousPeriodRatio !== null" class="ti-ri">
            <i :class="fillClassString(content.contemporaneousPeriodRatio)" />
            <strong>{{ fillDataString(content.contemporaneousPeriodRatio) }}</strong>
          </span>
        </div>
        <div v-if="content.contemporaneousPeriodRefundRate" class="monthPrice">
          <span>
            {{ title }}:¥ {{ fillDataString(content.contemporaneousPeriodRefundRate) }}
          </span>
          <span v-if="content.refundRate !== null" class="ti-ri">
            <i :class="fillClassString(content.contemporaneousPeriodRefundRate)" />
            <strong>{{ fillDataString(content.contemporaneousPeriodRefundRate) }}</strong>
          </span>
        </div>
      </div>
    </div>
    <div v-if="!flag">
      <div class="price-box">
        <div v-if="content.amount || content.amount === 0" class="price">
          ¥ {{ filterPrice(content.amount) }}
        </div>
        <div v-if="content.total|| content.total === 0" class="price">
          {{ content.total }}
        </div>
        <div v-if="content.refundRate">
          <span class="refundRate">
            退费率
          </span>
          <span>
            <strong>{{ fillDataString(content.refundRate) }}</strong>
          </span>
        </div>
      </div>
      <div class="price-box">
        <div class="monthPrice">
          <span v-if="content.contemporaneousPeriodAmount || content.contemporaneousPeriodAmount===0">
            {{ title }}:¥ {{ filterPrice(content.contemporaneousPeriodAmount) }}
          </span>
          <span v-if="content.contemporaneousPeriodOrderTotal || content.contemporaneousPeriodOrderTotal === 0">
            {{ title }}: {{ content.contemporaneousPeriodOrderTotal }}
          </span>
          <span v-if="content.contemporaneousPeriodRatio !== null" class="ti-ri">
            <i :class="fillClassString(content.contemporaneousPeriodRatio)" />
            <strong>{{ fillDataString(content.contemporaneousPeriodRatio) }}</strong>
          </span>
        </div>
        <div v-if="content.contemporaneousPeriodRefundRate" class="monthPrice">
          <span>
            {{ title }}:¥ {{ fillDataString(content.contemporaneousPeriodRefundRate) }}
          </span>
          <span v-if="content.refundRate !== null" class="ti-ri">
            <i :class="fillClassString(content.contemporaneousPeriodRefundRate)" />
            <strong>{{ fillDataString(content.contemporaneousPeriodRefundRate) }}</strong>
          </span>
        </div>
      </div>
    </div>
    <div class="bottom-data">
      <div class="free-pay">
        <div class="free-box">
          <div class="free">
            <span class="freeTips" />
            <span class="freeFont">免费</span>
            <span class="freeProportion">{{ fillDataString(content.freeRatio) }}</span>
          </div>
          <div v-if="(content.freeAmount || content.freeAmount === 0)" class="freePrice">
            ¥ {{ filterPrice(content.freeAmount) }}
          </div>
          <div v-if="content.freeOrderTotal || content.freeOrderTotal === 0" class="freePrice">
            {{ content.freeOrderTotal }}
          </div>
          <div class="monthPrice">
            <span>{{ title }}:</span>
            <span class="price-box-details">
              <span v-if="content.freeContemporaneousPeriodAmount || content.freeContemporaneousPeriodAmount===0">
                ¥ {{ filterPrice(content.freeContemporaneousPeriodAmount) }}
              </span>
              <span
                v-if="content.freeContemporaneousPeriodOrderTotal || content.freeContemporaneousPeriodOrderTotal===0"
              >
                {{ (content.freeContemporaneousPeriodOrderTotal) }}
              </span>
              <span v-if="content.freeContemporaneousPeriodRatio !== null" class="ti-ri">
                <i :class="fillClassString(content.freeContemporaneousPeriodRatio)" />
                <strong>{{ fillDataString(content.freeContemporaneousPeriodRatio) }}</strong>
              </span>
            </span>
          </div>
        </div>
        <div class="pay-box">
          <div class="pay">
            <span class="payTips" />
            <span class="payFont">付费</span>
            <span class="payProportion">{{ fillDataString(content.payRatio) }}</span>
          </div>
          <div v-if="(content.payAmount || content.payAmount === 0)" class="freePrice">
            ¥ {{ filterPrice(content.payAmount) }}
          </div>
          <div v-if="content.payOrderTotal || content.payOrderTotal === 0" class="freePrice">
            {{ content.payOrderTotal }}
          </div>
          <div class="monthPrice">
            <span>{{ title }}:</span>
            <span class="price-box-details">
              <span v-if="content.payContemporaneousPeriodAmount || content.payContemporaneousPeriodAmount===0">
                ¥ {{ filterPrice(content.payContemporaneousPeriodAmount) }}
              </span>
              <span v-if="content.payContemporaneousPeriodOrderTotal || content.payContemporaneousPeriodOrderTotal===0">
                {{ (content.payContemporaneousPeriodOrderTotal) }}
              </span>
              <span v-if="content.payContemporaneousPeriodRatio !== null" class="ti-ri">
                <i :class="fillClassString(content.payContemporaneousPeriodRatio)" />
                <strong>{{ fillDataString(content.payContemporaneousPeriodRatio) }}</strong>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import iconPanel from '@/assets/svg/panel/selectTips.svg'

export default {
  name: 'PanelType2',
  props: {
    content: {
      type: Object,
      default: () => {
      }
    },
    flag: {
      type: Boolean,
      default: false
    },
    isPersonal: {
      type: Boolean,
      default: false
    },
    sort: {
      type: Number,
      default: 0
    },
    selectList: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: '较昨日'
    }
  },
  data() {
    return {
      iconPanel
    }
  },
  methods: {
    fillClassString(num) {
      if (num < 0) {
        return 'red-p'
      } else {
        return 'green-p'
      }
    },
    // 过滤所有的数值
    filterPrice(num) {
      if (num === null) {
        return 0
      } else {
        const newNum = num / 100
        if (newNum < 10000000) {
          return newNum
        } else {
          return (newNum / 10000).toFixed(2) + '万'
        }
      }
    },
    fillDataString(num) {
      if (num !== 0 && num !== null) {
        const nums = Math.abs(num * 1).toFixed(2)
        return nums + '%'
      } else {
        return '0%'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fristy {
  height: 159px !important;
}

.type2 {
  .mt0 {
    margin-top: 0px;
  }
}

.panel2 {
  position: relative;
  height: 183px;
  min-width: 362px;
  padding: 10px 16px;
  box-sizing: border-box;
  background: #FAFAFA;
  border-radius: 8px;
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;

  .price-box {
    display: flex;
    align-items: center;

    .refundRate {
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #0C6FFF;
      margin-right: 5px;
    }

    > div {
      flex: 1;
    }
  }

  .bottom-data {
    display: flex;
    align-items: center;
    justify-content: space-between;
    //margin-top: 20px;
    .free-box, .pay-box {
      flex: 1;

    }

    .free-pay {
      display: flex;
      align-items: center;
      margin-top: 4px;
      justify-content: space-between;
      width: 100%;
    }

    .free, .pay {
      display: flex;
      align-items: center;

      .freeTips {
        background: #00D7C7;
      }

      .payTips {
        background: #0C6FFF;
      }

      .freeTips, .payTips {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        border: 1px solid #FFFFFF;
      }

      .freeFont, .payFont {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        margin-left: 4px;
      }

      .freeProportion {
        color: #00D7C7;
        border: 1px solid #00D7C7;
      }

      .payProportion {
        color: #0C6FFF;
        border: 1px solid #0C6FFF;
      }

      .freeProportion, .payProportion {
        padding: 0 7px;
        border-radius: 4px;
        box-sizing: border-box;
        margin-left: 8px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
      }
    }

    .freePrice {
      margin-top: 4px;
      font-size: 15px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: 600;
      color: #161616;
      line-height: 22px;
    }
  }

  .monthPrice {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 20px;
    margin-top: 4px;
    min-width: 170px;
    display: flex;
    align-items: flex-start;

    .price-box-details {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .ti-ri {
      //width: 59%;
      //padding-top: 8px;
      //text-align: right;
      //margin-left: 4px;

      em {
        font-style: normal;
        color: #777;
        font-size: 12px;
        margin-right: 8px;
      }

      .red-p {
        width: 11px;
        height: 11px;
        display: inline-block;
        background-image: url('../../assets/image/product/down.png');
        background-size: 100% 100%;
      }

      .green-p {
        width: 11px;
        height: 11px;
        margin-right: 2px;
        display: inline-block;
        background-image: url('../../assets/image/product/up.png');
        background-size: 100% 100%;
      }

      i {
        font-size: 16px;
      }

      strong {
        font-size: 12px;
        font-family: 'DIN Alternate Bold';
        font-weight: bold;
        max-width: 54px;
        text-align: right;
        color: #161616;
        display: inline-block;
      }
    }
  }

  .price {
    font-size: 18px;
    font-family: DINAlternate-Bold, DINAlternate;
    font-weight: bold;
    color: #161616;
  }

  .f-r-t {
    width: 100%;
    display: inline-block;
    font-size: 16px;
    color: #777;

    em {
      float: left;
      font-style: normal;
    }

    img {
      float: left;
      width: 16px;
      margin-top: 5px;
      margin-left: 8px;
    }
  }

  .iconPanl {
    position: absolute;
    top: -1px;
    right: -1px;
  }

  .tips {
    position: absolute;
    left: 0;
    top: 10px;
    width: 6px;
    height: 86px;
    border-radius: 0px 100px 100px 0px;
  }

  .tips2 {
    background: #6C27FF;
  }

  .tips3 {
    background: #FF5962;
  }

  .tips4 {
    background: #2BC6FE;
  }

  .tips5 {
    background: #FFCA69;
  }

  .tips6 {
    background: #00E3DB;
  }

  .tips7 {
    background: #A5E20D;
  }

  .tips8 {
    background: #2BC6FE;
  }
}

.sty2 {
  height: 200px !important;
  min-width: 467px !important;
}

.selectPanel {
  border: 1px solid #0C6FFF;
  background: #F2F9FF;
  box-sizing: border-box;
}
</style>
