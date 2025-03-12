<template>
  <div class="wrapper-online-account-chart">
    <MTitle>{{ title }}占比</MTitle>
    <div id="tearchChartData" class="account-chart-row" />
    <div class="account-tearch-list">
      <span v-for="(item,index) in dataArray" :key="index">
        <em :style="{backgroundColor: dangqianUserArray[index]}" />
        <strong>{{ item.name }}</strong>
        <i>{{ item.ratio>1000?'1000%+':item.ratio+'%' }}</i>
      </span>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { filterPrice } from '@/utils'
export default {
  components: {
  },
  data() {
    return {
      colorArray: ['#F14F59', '#FF9865', '#F0AC01', '#F7DD01', '#D6D604', '#77BD41', '#1EAD6E', '#22BAD2', '#00A1D6', '#1E8FCF', '#016FB9', '#402B8B', '#701E82', '#9B0C81', '#CA1687'],
      option: {},
      title: '',
      dataArray: [],
      formAccountChart: {},
      zongjiObject: {},
      dangqianUserArray: []
    }
  },
  provide() {
  },
  mounted() {
  },
  created() {
    // this.init(arr)
  },
  methods: {
    filterPrice,
    getRamdomColorFormColorArr(index) {
      if (index < this.colorArray.length) {
        this.dangqianUserArray.push(this.colorArray[index])
        return this.colorArray[index]
      } else {
        this.dangqianUserArray.push(this.colorArray[index - this.colorArray.length])
        return this.colorArray[index - this.colorArray.length]
      }
    },
    init(arr, titleString, type, formData) {
      this.formAccountChart = formData
      this.title = titleString
      this.dataArray = []
      this.$nextTick(() => {
        this.chartDom = echarts.init(document.getElementById('tearchChartData'))

        const arrArray = []

        arr.some((item, index) => {
          arr.some((objAr, index) => {
            if (type === 1 && objAr.teacherName === '总计') {
              this.zongjiObject = objAr
            }
            if (type === 2 && objAr.orderChannelName === '总计') {
              this.zongjiObject = objAr
            }
            if (type === 3 && objAr.shopName === '合计') {
              this.zongjiObject = objAr
            }
            if (type === 4 && objAr.employeeName === '总计') {
              this.zongjiObject = objAr
            }
          })
          let valueData = 0
          let ratioData = 0
          if (this.formAccountChart.bizTypeActive === 3) {
            valueData = item.gmv
            ratioData = ((item.gmv / this.zongjiObject.gmv) * 100).toFixed(2)
          } else if (this.formAccountChart.bizTypeActive === 2) {
            valueData = item.refundAmount
            ratioData = ((item.refundAmount / this.zongjiObject.refundAmount) * 100).toFixed(2)
          } else {
            valueData = item.revenue
            ratioData = ((item.revenue / this.zongjiObject.revenue) * 100).toFixed(2)
          }

          if (type === 4) {
            if (item.employeeName !== '总计') {
              const labelString = item.employeeName
              const obj = {
                name: labelString,
                value: item.amount < 0 ? 0 : item.amount,
                ratio: item.percent,
                itemStyle: {
                  color: this.getRamdomColorFormColorArr(index)
                }
              }
              arrArray.push(obj)
            }
          } else if (type === 1) {
            if (item.teacherName !== '总计') {
              const labelString = item.teacherName
              const obj = {
                name: labelString,
                value: valueData < 0 ? 0 : valueData,
                ratio: ratioData,
                itemStyle: {
                  color: this.getRamdomColorFormColorArr(index)
                }
              }
              arrArray.push(obj)
            }
          } else if (type === 2) {
            if (item.orderChannelName !== '总计') {
              const labelString = item.orderChannelName
              const obj = {
                name: labelString,
                value: valueData < 0 ? 0 : valueData,
                ratio: ratioData,
                itemStyle: {
                  color: this.getRamdomColorFormColorArr(index)
                }
              }
              arrArray.push(obj)
            }
          } else if (type === 3) {
            if (item.shopName !== '合计') {
              const labelString = item.shopName
              const obj = {
                name: labelString,
                value: valueData < 0 ? 0 : valueData,
                ratio: ratioData,
                itemStyle: {
                  color: this.getRamdomColorFormColorArr(index)
                }
              }
              arrArray.push(obj)
            }
          }
        })
        this.dataArray = arrArray
        this.option = {
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              console.log('ddddddd:', params)
              return '<div><p>' + this.title + '</p><p>' + params.name + '：' + this.filterPrice(params.data.value) + '</p><p>占比：' + ((params.percent > 1000) ? '1000%+' : params.percent + '%') + '</p></div>'
            }
          },
          series: [
            {
              name: this.title,
              type: 'pie',
              radius: ['40%', '80%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: 40,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: arrArray
            }
          ]
        }
        // this.option.series.data = arrArray
        this.chartDom.setOption(this.option)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper-online-account-chart {
    width: 100%;
    padding: 15px;
    .account-chart-row {
        width: 100%;
        height: 270px;
    }
    .account-tearch-list {
        width: 100%;
        margin-top: 20px;
        height: 140px;
        overflow-y: auto;
        span {
            float: left;
            width: 50%;
            height: 30px;
            em {
                float: left;
                width: 10px;
                height: 4px;
                flex-shrink: 0;
                border-radius: 5px;
                background: #819BFF;
                margin-top: 12px;
                margin-left: 15px;
            }
            strong {
                float: left;
                width: 70px;
                height: 26px;
                line-height: 26px;
                flex-direction: column;
                justify-content: center;
                flex-shrink: 0;
                color: #000000;
                font-family: "Microsoft YaHei";
                font-size: 14px;
                font-style: normal;
                font-weight: 600;
                margin-left: 8px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
            }
            i {
                font-style: normal;
                color: #666;
            }
        }
    }
}
</style>
