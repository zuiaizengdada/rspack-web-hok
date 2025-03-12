<template>
  <div class="top-cls">
    <div class="data-search">
      <span class="left-title"><i />数据概况</span>
      <div class="right-search">
        <AppDatepicker
          :show="[1, 7, 30]"
          :default="30"
          :search="search.time"
          :picker-options="pickerOptions"
          @change="timeChange"
        />
      </div>

      <div class="data-font-show">
        <div class="dfs-row f-show">
          <span class="f-r-t">
            <em>总问题数</em>
            <el-tooltip class="item" effect="dark" content="收集的问题总数" placement="top">
              <img src="@/assets/image/product/icon.png" />
            </el-tooltip>
          </span>
          <div class="f-r-d">
            <span class="ti-po">{{ dataOverviewResult.questionCount }}</span>
            <span class="ti-ri">
              <em>环比上期</em>
              <i v-if="dataOverviewResult.planCountMom !== 0" :class="fillClassString(dataOverviewResult.questionCountMom)" />
              <strong>{{ fillDataString(dataOverviewResult.questionCountMom) }}</strong>
            </span>
          </div>
        </div>
        <div class="dfs-row">
          <span class="f-r-t"><em>总话题数</em>
            <el-tooltip class="item" effect="dark" content="收集的选题总数" placement="top">
              <img src="@/assets/image/product/icon.png" />
            </el-tooltip>
          </span>
          <div class="f-r-d">
            <span class="ti-po">{{ dataOverviewResult.demandCount }}</span>
            <span class="ti-ri">
              <em>环比上期</em>
              <i v-if="dataOverviewResult.planCountMom !== 0" :class="fillClassString(dataOverviewResult.demandCountMom)" />
              <strong>{{ fillDataString(dataOverviewResult.demandCountMom) }}</strong>
            </span>
          </div>
        </div>
        <div class="dfs-row">
          <span class="f-r-t"><em>总选题数</em>
            <el-tooltip class="item" effect="dark" content="收集整理的选题总数" placement="top">
              <img src="@/assets/image/product/icon.png" />
            </el-tooltip>
          </span>
          <div class="f-r-d">
            <span class="ti-po">{{ dataOverviewResult.caseCount }}</span>
            <span class="ti-ri">
              <em>环比上期</em>
              <i v-if="dataOverviewResult.planCountMom !== 0" :class="fillClassString(dataOverviewResult.caseCountMom)" />
              <strong>{{ fillDataString(dataOverviewResult.caseCountMom) }}</strong>
            </span>
          </div>
        </div>
        <div class="dfs-row">
          <span class="f-r-t"><em>总计划数</em>
            <el-tooltip class="item" effect="dark" content="计划总数" placement="top">
              <img src="@/assets/image/product/icon.png" />
            </el-tooltip>
          </span>
          <div class="f-r-d">
            <span class="ti-po">{{ dataOverviewResult.planCount }}</span>
            <span class="ti-ri">
              <em>环比上期</em>
              <i v-if="dataOverviewResult.planCountMom !== 0" :class="fillClassString(dataOverviewResult.planCountMom)" />
              <strong>{{ fillDataString(dataOverviewResult.planCountMom) }}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="data-block">
      <div class="data-block-left">
        <p class="dbl-title">话题对比图</p>
        <div class="xq-dt">
          <div id="table_wrap_charts" class="chart-div" />
        </div>
      </div>
      <div class="data-block-right">
        <p class="dbl-title">话题行业排行榜</p>
        <div class="plb-row">
          <span class="header-span">
            <p class="f-p">排名</p>
            <p class="s-p">行业选题</p>
            <p class="t-p">对应话题数</p>
          </span>
          <div v-for="(item, index) in xuqiuPhbList" :key="index" class="content-r">
            <span class="f-con">
              <img v-if="index < 3" :src="getImgUrl(index + 1)">
              <p v-else>{{ index + 1 }}</p>
            </span>
            <span class="s-con"> {{ item.industry }}</span>
            <span class="t-con"> {{ item.demandCount }} </span>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
<script>
import echarts from 'echarts'
import AppDatepicker from './datePicker/datepick.vue'
// import { debounce } from '@/utils'
import {
  getDemandDatas,
  allDataGetData,
  getCompariseonDiagram
} from '@/api/product/courseManage'
export default {
  components: {
    AppDatepicker
  },
  data() {
    return {
      search: {
        time: {
          active: 1,
          time: ['', '']
        },
        ranking: 10,
        type: 6 // 查询类型1-综合评分 2-选题数 3-计划数 4-课件数 5-课程数 6-业绩数
      },
      dataOverviewResult: {},
      xuqiuPhbList: [],
      chart: {},
      keywordsListChartData: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  // mounted() {
  //   this.$_resizeHandler = debounce(() => {
  //     console.log('fdsfdsfdsfsdfdfs')
  //     if (this.chart) {
  //       this.chart.resize()
  //     }
  //   }, 100)
  //   this.$_initResizeEvent()
  // },
  // activated() {
  //   this.$_initResizeEvent()
  // },
  // deactivated() {
  //   this.$_destroyResizeEvent()
  // },
  created() {},
  methods: {
    timeChange(val) {
      this.search.time = val
      // this.getDetail()
      // this.getXqphbList()
      this.loadOverviewData()
      // this.getXqKeywordList()
    },
    fillClassString(num) {
      if (num < 0) {
        return 'red-p'
      } else {
        return 'green-p'
      }
    },
    fillDataString(num) {
      const nums = Math.abs(num * 100).toFixed(2)
      return nums + '%'
    },
    getXqKeywordList() {
      const params = {
        startTime: this.search.time.time[0],
        endTime: this.search.time.time[1]
      }
      getCompariseonDiagram(params).then((res) => {
        if (res.success) {
          console.log('####################:', res)
          this.keywordsListChartData = res.data
          this.chart = echarts.init(document.getElementById('table_wrap_charts'))
          const xDataArr = []
          const yDataArr = []
          this.keywordsListChartData.forEach((value) => {
            if (value.keyword.length > 5) {
              value.keyword = value.keyword.substring(0, 5) + '...'
            }
            xDataArr.push(value.keyword)
            yDataArr.push(value.addCount)
          })
          console.log('xDataArr: ', xDataArr)
          console.log('yDataArr: ', yDataArr)
          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: xDataArr,
                axisLabel: {
                  interval: 0
                },
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                type: 'bar',
                barWidth: '42',
                itemStyle: {
                  normal: {
                    color: '#0C6FFF'
                  }
                },
                data: yDataArr
              }
            ]
          }
          this.chart.setOption(option)
        }
      })
    },
    getXqphbList() {
      const params = {
        startTime: this.search.time.time[0],
        endTime: this.search.time.time[1]
      }
      getDemandDatas(params).then((res) => {
        if (res.success) {
          this.xuqiuPhbList = res.data
        }
      })
    },
    getImgUrl(num) {
      return require('@/assets/image/product/' + num + '.png')
    },
    loadOverviewData() {
      const params = {
        startTime: this.search.time.time[0],
        endTime: this.search.time.time[1]
      }
      allDataGetData(params).then((res) => {
        console.log(res)
        if (res.success) {
          this.dataOverviewResult = res.data
        }
      })
    },
    // 注册页面变化监听
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    // 移除页面变化监听
    $_destroyResizeEvent() {
      window.removeEventListener('resize', this.$_resizeHandler)
    }
  }
}
</script>
<style lang="scss" scoped>
.data-search {
  width: 100%;
  .left-title {
    width: 100px;
    height: 32px;
    line-height: 32px;
    padding-left: 10px;
    color: #333;
    font-size: 16px;
    font-weight: bold;
    font-family: '微软雅黑';
    i {
      width: 4px;
      height: 24px;
      margin-top: 3px;
      float: left;
      background: #0c6fff;
      border-radius: 8px;
    }
  }
  .right-search {
    float: right;
    height: 30px;
    .date-choose {
      margin-left: 10px;
      position: relative;
      .data_icon {
        position: absolute;
        top: 11px;
        right: 10px;
        z-index: 9;
        color: #c0c4cc;
        font-size: 14px;
        transform: translateY(-50%);
      }
      ::v-deep .el-range__close-icon {
        position: absolute;
        right: 10px;
        top: 11px;
        transform: translateY(-50%);
      }
    }
  }
}
.data-font-show {
  margin-top: 20px;
  width: 100%;
  height: 105px;
  .dfs-row {
    float: left;
    width: 24%;
    height: 105px;
    background-color: #f2f9ff;
    margin-left: 1.33%;
    border-radius: 8px;
    .f-r-t {
      margin-top: 15px;
      width: 100%;
      padding: 0 15px;
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
    .f-r-d {
      width: 100%;
      margin-top: 12px;
      height: 30px;
      span {
        padding: 0 15px;
        text-align: left;
        float: left;
      }
      .ti-po {
        width: 41%;
        color: #161616;
        font-size: 28px;
        font-family: 'DIN Alternate Bold';
        font-weight: bold;
        margin-top: -5px;
      }
      .ti-ri {
        width: 59%;
        padding-top: 8px;
        text-align: right;
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
          background-image: url('../../../../assets/image/product/down.png');
          background-size: 100% 100%;
        }
        .green-p {
          width: 11px;
          height: 11px;
          margin-right: 2px;
          display: inline-block;
          background-image: url('../../../../assets/image/product/up.png');
          background-size: 100% 100%;
        }
        i {
          font-size: 16px;
        }
        strong {
          font-size: 16px;
          font-family: 'DIN Alternate Bold';
          font-weight: bold;
          max-width: 54px;
          text-align: right;
          display: inline-block;
        }
      }
    }
  }
  .f-show {
    margin-left: 0;
  }
}
.data-block {
  width: 100%;
  margin-top: 30px;
  margin-bottom: 30px;
  display: flex;
  align-items: flex-start;
}
.dbl-title {
  margin: 0;
  padding: 0;
  font-size: 16px;
  color: #333;
  img {
    width: 16px;
    display: inline-block;
  }
}
.data-block-left {
  flex: 1 1 auto;
  .xq-dt {
    margin-top: 20px;
    width: 100%;
    height: 450px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    .xq-dt-top {
      width: 100%;
      height: 100px;
      margin-top: 10px;
      padding-left: 10px;
      span {
        width: 165px;
        height: 100px;
        padding: 0 10px;
        background: #f2f9ff;
        float: left;
        margin-right: 30px;
        border-radius: 8px;
        p {
          font-size: 14px;
          color: #777;
          margin-top: 20px;
          height: 20px;
          line-height: 20px;
          display: inline-block;
          em {
            float: left;
            color: #777;
            font-size: 14px;
            font-weight: 400;
            height: 20px;
            line-height: 20px;
            font-style: normal;
          }
          img {
            float: left;
            width: 14px;
            height: 14px;
            margin-top: 3px;
            margin-left: 5px;
          }
        }
        em {
          font-family: 'DIN Alternate Bold';
          font-size: 28px;
          color: #161616;
          font-style: normal;
          font-weight: bold;
        }
      }
    }
  }
}
.data-block-right {
  flex: 0 0 auto;
  width: 340px;
  margin-left: 30px;
  .plb-row {
    margin-top: 20px;
    width: 338px;
    height: 450px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 20px 20px;
    .header-span {
      width: 100%;
      display: inline-block;
      margin-bottom: 15px;
      p {
        float: left;
        margin: 0;
        font-size: 16px;
        color: #777;
      }
      .f-p {
        width: 50px;
        text-align: center;
      }
      .s-p {
        width: 152px;
        padding-left: 30px;
        text-align: center;
      }
      .t-p {
        width: 90px;
        text-align: right;
      }
    }
    .content-r {
      width: 100%;
      float: left;
      margin-top: 5px;
      margin-bottom: 5px;
      span {
        float: left;
        font-size: 14px;
        color: #161616;
        text-align: center;
        line-height: 25px;
        font-weight: bold;
      }
      .f-con {
        width: 37px;
        img {
          width: 25px;
          margin-left: 5px;
        }
        p {
          width: 22px;
          height: 22px;
          line-height: 22px;
          background: #f7fbff;
          border-radius: 100%;
          display: inline-block;
        }
      }
      .s-con {
        width: 190px;
        color: #333;
        height: 25px;
        padding-left: 30px;
        overflow: hidden;
        font-size: 14px;
        font-weight: 400;
      }
      .t-con {
        width: 60px;
        text-align: right;
      }
    }
  }
}

.chart-div {
  width: 100%;
  height: 450px;
}
</style>
