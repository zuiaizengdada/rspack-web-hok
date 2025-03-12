<template>
  <div
    :class="selectList.includes(sort) ? 'panel1 selectPanel' : 'panel1'"
    style="margin-left: 0px"
    @click="$emit('selectPanel', sort)"
  >
    <img v-if="selectList.includes(sort)" :src="iconPanel" class="iconPanl">
    <div :class="`tips${sort}`" />
    <div class="top-data">
      <span class="f-r-t">
        <em>{{ content.title }}</em>
        <el-tooltip
          class="item"
          effect="dark"
          :content="content.titleTips"
          placement="top"
        >
          <img src="@/assets/image/product/icon.png">
        </el-tooltip>
      </span>
      <div class="fl fl_ai_c w-100p">
        <div class="price fl1">¥ {{ filterPrice(content.amount) }}</div>
        <div class="monthPrice fl1">
          <span>
            环比:¥ {{ filterPrice(content.contemporaneousPeriodAmount) }}
          </span>
          <span
            v-if="
              content.contemporaneousPeriodRatio !== 0 &&
                content.contemporaneousPeriodRatio !== null
            "
            class="ti-ri"
          >
            <i :class="fillClassString(content.contemporaneousPeriodRatio)" />
            <strong>{{
              fillDataString(content.contemporaneousPeriodRatio)
            }}</strong>
          </span>
        </div>
      </div>
      <div class="fl fl_ai_c w-100p">
        <div class="monthPrice fl1">
          <span> 本月:¥ {{ filterPrice(content.currentMonthAmount) }} </span>
          <span
            v-if="
              content.toMonthPayRatio !== 0 && content.toMonthPayRatio !== null
            "
            class="ti-ri"
          >
            <i :class="fillClassString(content.toMonthPayRatio)" />
            <strong>{{ fillDataString(content.toMonthPayRatio) }}</strong>
          </span>
        </div>
        <div class="monthPrice fl1">
          今日:¥ {{ filterPrice(content.toDayAmount) }}
        </div>
      </div>
    </div>
    <div class="bottom-data">
      <div class="free-pay">
        <div class="free-box">
          <div class="free">
            <span class="freeTips" />
            <span class="freeFont">免费</span>
            <span class="freeProportion">{{
              fillDataString(content.freeRatio)
            }}</span>
          </div>
          <div class="fl fl_ai_c m-t-5 m-b-5">
            <div class="freePrice">¥ {{ filterPrice(content.freeAmount) }}</div>
            <div class="monthPrice">
              <span class="m-l-8">
                环比:¥ {{ filterPrice(content.freeContemporaneousPeriodAmount) }}
              </span>
              <span
                v-if="
                  content.freeContemporaneousPeriodRatio !== 0 &&
                    content.freeContemporaneousPeriodRatio !== null
                "
                class="ti-ri m-l-8"
              >
                <i
                  :class="fillClassString(content.freeContemporaneousPeriodRatio)"
                />
                <strong>{{
                  fillDataString(content.freeContemporaneousPeriodRatio)
                }}</strong>
              </span>
            </div>
          </div>
        </div>
        <div class="pay-box">
          <div class="pay">
            <span class="payTips" />
            <span class="payFont">付费</span>
            <span class="payProportion">{{
              fillDataString(content.payRatio)
            }}</span>
          </div>
          <div class="fl fl_ai_c m-t-5">
            <div class="freePrice">¥ {{ filterPrice(content.payAmount) }}</div>
            <div class="monthPrice">
              <span class="m-l-8">
                环比:¥ {{ filterPrice(content.payContemporaneousPeriodAmount) }}
              </span>
              <span
                v-if="
                  content.payContemporaneousPeriodRatio !== 0 &&
                    content.payContemporaneousPeriodRatio !== null
                "
                class="ti-ri m-l-8"
              >
                <i
                  :class="fillClassString(content.payContemporaneousPeriodRatio)"
                />
                <strong>{{
                  fillDataString(content.payContemporaneousPeriodRatio)
                }}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div id="compared" style="width: 120px; height: 120px" />
      </div>
    </div>
  </div>
</template>

<script>
import iconPanel from '@/assets/svg/panel/selectTips.svg'
import echarts from 'echarts'

export default {
  name: 'PanelType1',
  props: {
    content: {
      type: Object,
      default: () => {}
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
    }
  },
  data() {
    return {
      iconPanel
    }
  },
  watch: {
    content: {
      handler() {
        this.initChart()
        if (this.chart) {
          this.chart.resize()
        }
      }
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    // 初始化echarts
    initChart() {
      this.chart = echarts.init(document.getElementById('compared'))
      const freeAmount = Number(this.content.freeAmount / 100)
      const payAmount = Number(this.content.payAmount / 100)
      console.log(freeAmount, payAmount)
      const option = {
        series: [
          {
            type: 'pie',
            label: {
              position: 'inner',
              fontSize: 12,
              formatter: params => {
                if (params.data.ratio == null) {
                  return params.name + '\n\n' + '50%'
                } else {
                  return params.name + '\n\n' + (params.data.ratio + '%')
                }
                // const str = params.name + '\n\n' + params.value
                // return str
              }
            },
            color: ['#00D7C7', '#0C6FFF'],
            data: [
              {
                value: freeAmount || 0,
                name: '免费',
                ratio: this.content.freeRatio
              },
              {
                value: payAmount || 0,
                name: '付费',
                ratio: this.content.payRatio
              }
            ]
          }
        ]
      }
      this.chart.setOption(option)
    },
    fillClassString(num) {
      if (num < 0) {
        return 'red-p'
      } else {
        return 'green-p'
      }
    },
    // 过去所有的数值
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
.panel1 {
  position: relative;
  width: 467px;
  height: 220px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid transparent;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .free-pay{
    display: flex;
    flex-direction: column;
  }
  .bottom-data {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    margin-top: 10px;
    .free,
    .pay {
      display: flex;
      align-items: center;

      .freeTips {
        background: #00d7c7;
      }

      .payTips {
        background: #0c6fff;
      }

      .freeTips,
      .payTips {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        border: 1px solid #ffffff;
      }

      .freeFont,
      .payFont {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        margin-left: 4px;
      }

      .freeProportion {
        color: #00d7c7;
        border: 1px solid #00d7c7;
      }

      .payProportion {
        color: #0c6fff;
        border: 1px solid #0c6fff;
      }

      .freeProportion,
      .payProportion {
        padding: 4px 8px;
        border-radius: 4px;
        box-sizing: border-box;
        margin-left: 8px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
      }
    }

    // .pay-box {
    //   //margin-top: 20px;
    // }

    .freePrice {
      min-width: 95px;
      font-size: 14px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #161616;
      line-height: 22px;
    }
  }

  .top-data {
    //border-bottom: 1px solid #e6e6e6;
    padding: 10px 16px 0 16px;
    box-sizing: border-box;
  }

  .monthPrice {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 20px;
    //margin-top: 8px;
    min-width: 180px;
    .ti-ri {
      width: 59%;
      padding-top: 8px;
      text-align: right;
      margin-left: 4px;

      em {
        font-style: normal;
        color: #777;
        font-size: 14px;
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
        font-size: 14px;
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

  .tips1 {
    position: absolute;
    left: 0;
    top: 10px;
    width: 6px;
    height: 96px;
    background: #0c6fff;
    border-radius: 0px 100px 100px 0px;
  }
}

.selectPanel {
  border: 1px solid #0c6fff;
  background: #f2f9ff;
  box-sizing: border-box;
}
</style>
