<template>
  <div :class="selectList.includes(sort)?'panel1 selectPanel':'panel1'" @click="$emit('selectPanel',sort)">
    <img v-if="selectList.includes(sort)" :src="iconPanel" class="iconPanl">
    <div :class="`tips${sort}`" />
    <div class="top-data">
      <span class="f-r-t">
        <em>{{ content.title }}</em>
        <el-tooltip class="item" effect="dark" :content="content.titleTips" placement="top">
          <img src="@/assets/image/product/icon.png">
        </el-tooltip>
      </span>
      <div class="fl fl_ai_c">
        <div class="price fl1">
          ¥ {{ filterPrice(content.amount) }}
        </div>
        <!--        <div class="todayPrice fl1">-->
        <!--          <span>今日:</span>-->
        <!--          <span style="margin-left: 8px">¥ {{ filterPrice(content.toDayAmount) }}</span>-->
        <!--        </div>-->
      </div>
      <div class="fl fl_ai_c fl_jc_sb">
        <div class="monthPrice fl1">
          <div>
            {{ title }}:
          </div>
          <div class="fl fl_ai_c w-100p">
            <div class="blPrice">
              ¥ {{ filterPrice(content.contemporaneousPeriodAmount) }}
            </div>
            <div v-if="content.contemporaneousPeriodRatio !== null" class="ti-ri" style="margin-left: 4px;flex: 1">
              <i :class="fillClassString(content.contemporaneousPeriodRatio)" />
              <strong>{{ fillDataString(content.contemporaneousPeriodRatio) }}</strong>
            </div>
          </div>
        </div>
        <div class="monthPrice fl1">
          <div>
            本月:
          </div>
          <div class="fl fl_ai_c w-100p">
            <div class="blPrice">
              ¥ {{ filterPrice(content.currentMonthAmount) }}
            </div>
            <div v-if="content.toMonthPayRatio !== null" class="ti-ri" style="margin-left: 4px;flex: 1">
              <i :class="fillClassString(content.toMonthPayRatio)" />
              <strong>{{ fillDataString(content.toMonthPayRatio) }}</strong>
            </div>
          </div>
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
          <div class="freePrice">
            ¥ {{ filterPrice(content.freeAmount) }}
          </div>
          <div class="monthPrice btSty">
            <div>
              {{ title }}:
            </div>
            <div class="m-l-4">
              <div class="blPrice">
                ¥ {{ filterPrice(content.freeContemporaneousPeriodAmount) }}
              </div>
              <div
                v-if="content.freeContemporaneousPeriodRatio !== null"
                class="ti-ri"
              >
                <i :class="fillClassString(content.freeContemporaneousPeriodRatio)" />
                <strong>{{ fillDataString(content.freeContemporaneousPeriodRatio) }}</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="pay-box">
          <div class="pay">
            <span class="payTips" />
            <span class="payFont">付费</span>
            <span class="payProportion">{{ fillDataString(content.payRatio) }}</span>
          </div>
          <div class="freePrice">
            ¥ {{ filterPrice(content.payAmount) }}
          </div>
          <div class="monthPrice btSty">
            <div>
              {{ title }}:
            </div>
            <div class="m-l-4">
              <div>
                ¥ {{ filterPrice(content.payContemporaneousPeriodAmount) }}
              </div>
              <div
                v-if="content.payContemporaneousPeriodRatio !== null"
                class="ti-ri"
              >
                <i :class="fillClassString(content.payContemporaneousPeriodRatio)" />
                <strong>{{ fillDataString(content.payContemporaneousPeriodRatio) }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div id="compared" style="width: 160px; height: 160px" />
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
      default: () => {
      }
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
            cursor: 'auto',
            label: {
              position: 'inner',
              fontSize: 14,
              formatter: (params) => {
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

<style lang="scss" >
#compared>div>canvas {
cursor: default;
}

.panel1 {
  position: relative;
  width: 362px;
  height: 358px;
  background: #FAFAFA;
  border-radius: 8px;
  border: 1px solid transparent;
  box-sizing: border-box;
  .blPrice{
    font-weight: bold;
  }
  .todayPrice {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #777777;
    line-height: 20px;

    :nth-child(2) {
      font-weight: bold;
    }
  }
  .btSty{
    display: flex;
    align-items: flex-start;
    :nth-child(2){
      flex: 1;
    }
  }
  .bottom-data {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 5px;
    padding: 10px 16px;

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
        padding: 4px 8px;
        border-radius: 11px;
        box-sizing: border-box;
        margin-left: 8px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
      }
    }

    .pay-box {
      margin-top: 10px;
    }

    .freePrice {
      margin-top: 4px;
      font-size: 16px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #161616;
      line-height: 22px;
    }
  }

  .top-data {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #E6E6E6;
    padding: 10px 16px;
    box-sizing: border-box;
  }

  .monthPrice {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 20px;
    margin-top: 4px;
    min-width: 180px;

    .ti-ri {
      width: 59%;
      text-align: left;

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
    font-size: 23px;
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
    height: 166px;
    background: #0C6FFF;
    border-radius: 0px 100px 100px 0px;
  }
}

.selectPanel {
  border: 1px solid #0C6FFF;
  background: #F2F9FF;
  box-sizing: border-box;
}
</style>

