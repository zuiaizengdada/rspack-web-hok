<template>
  <!-- IP数据对比图 -->
  <div class="compared">
    <MCard>
      <div class="search">
        <div class="search_left">
          <MTitle title="IP数据对比图" class="m-r-16" />
          <el-select v-model="search.ranking" size="small" @change="rankingChange">
            <el-option label="前10名IP" :value="10">前10名IP</el-option>
            <el-option label="前20名IP" :value="20">前20名IP</el-option>
            <el-option label="前30名IP" :value="30">前30名IP</el-option>
          </el-select>
        </div>
        <div>
          <AppDatepicker
            :show="[0, 1, 7, 30]"
            :default="30"
            :search="search.time"
            :picker-options="pickerOptions"
            @change="timeChange"
          />
        </div>
      </div>
      <div class="histogram" style="margin-left: 20px; margin-right: 20px">
        <div id="compared" style="width: 100%; height: 100%" />
      </div>
      <div class="radio">
        <el-radio-group v-model="radio" @change="typeChange()">
          <el-radio label="caseCount">选题数</el-radio>
          <el-radio label="planCount">计划数</el-radio>
          <el-radio label="coursewareCount">课件数</el-radio>
          <el-radio label="courseCount">课程数</el-radio>
          <el-radio label="achievement">业绩数</el-radio>
        </el-radio-group>
      </div>
    </MCard>
    <MCard class="page_wrap_footer m-t-22">
      <el-table
        :data="tableData"
        class="m_table"
        size="small"
        :header-cell-style="{ background: '#f5f5f5' }"
        :default-sort="{ prop: 'date', order: 'descending' }"
      >
        <el-table-column prop="teacherId" label="师资ID" width="180" align="center" />
        <el-table-column prop="teacherName" label="IP姓名" width="180" align="center" />
        <el-table-column prop="caseCount" label="选题数" align="center" sortable />
        <el-table-column prop="planCount" label="计划数" align="center" sortable />
        <el-table-column prop="coursewareCount" label="课件数" align="center" sortable />
        <el-table-column prop="courseCount" label="课程数" align="center" sortable />
        <el-table-column prop="achievement" label="业绩数" align="center" sortable />
      </el-table>
    </MCard>
  </div>
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
import { teacherReportContrast } from '@/api/tearchCenter/index'
import AppDatepicker from './datePicker/index.vue'
import BigNumber from 'bignumber.js'
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
      radio: 'caseCount',
      data: [], // 柱状图数据
      tableData: [], // 列表数据
      typeOption: {
        caseCount: '选题数',
        planCount: '计划数',
        coursewareCount: '课件数',
        courseCount: '课程数',
        achievement: '业绩数'
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 1 * 24 * 60 * 60 * 1000
        }
      }
    }
  },
  mounted() {
    this.initChart()
    this.$_resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    this.$_initResizeEvent()
  },
  activated() {
    this.$_initResizeEvent()
  },
  deactivated() {
    this.$_destroyResizeEvent()
  },
  methods: {
    rankingChange() {
      this.getDetail()
    },
    typeChange() {
      this.tableData.sort((a, b) => {
        return b[this.radio] - a[this.radio]
      })
      this.getDetail()
      // this.data = []
      // this.tableData.forEach((v) => {
      //   this.data.push([v.teacherName, v.caseCount, v.planCount, v.coursewareCount, v.courseCount, v.achievement])
      // })
      // this.draw()
      // const obj = {
      //   caseCount: 2,
      //   planCount: 3,
      //   coursewareCount: 4,
      //   courseCount: 5,
      //   achievement: 6
      // }
      // this.search.type = obj[this.radio]
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('compared'))
      this.getDetail()
    },
    timeChange(val) {
      this.search.time = val
      this.getDetail()
    },
    // 获取IP数据对比
    getDetail() {
      console.log(this.search)
      const rangeObj = {
        0: 1,
        1: 2,
        7: 3,
        30: 4
      }
      const obj = {
        caseCount: 2,
        planCount: 3,
        coursewareCount: 4,
        courseCount: 5,
        achievement: 6
      }
      let startDate = ''
      let endDate = ''
      if (this.search.time.active === '') {
        startDate = this.search.time.time[0]
        endDate = this.search.time.time[1]
      }
      this.loading = true
      const params = {
        startDate, // 开始日期
        endDate, // 截止日期
        range: rangeObj[this.search.time.active], // 查询范围1-今天 2-昨天 3-近七天 4-近30天
        ranking: this.search.ranking, // 排名,直接传10,20,30
        type: obj[this.radio] // 查询类型 1综合评分 2选题数 3计划数 4 课件数 5课程数 6业绩数
      }
      if (!startDate) {
        delete params.startDate
      }
      if (!endDate) {
        delete params.endDate
      }
      teacherReportContrast(params)
        .then((res) => {
          this.data = []
          res.data.map((v) => {
            v.achievement = Number(new BigNumber(v.achievement).div(100).toNumber())
          })
          res.data.sort((a, b) => {
            return b[this.radio] - a[this.radio]
          })
          res.data.forEach((v) => {
            this.data.push([v.teacherName, v.caseCount, v.planCount, v.coursewareCount, v.courseCount, v.achievement])
          })
          console.log(res.data)
          this.tableData = res.data
          this.draw()
          this.loading = false
        })
        .catch((err) => {
          console.log(err)
          this.loading = false
        })
    },
    draw() {
      const options = {
        legend: {
          show: true,
          top: 'bottom'
        },
        tooltip: {},
        dataset: [
          {
            dimensions: ['teacherName', 'caseCount', 'planCount', 'coursewareCount', 'courseCount', 'achievement'],
            source: this.data
          },
          {
            transform: {
              type: 'sort',
              config: { dimension: 'achievement', order: 'desc' }
            }
          }
        ],
        dataZoom: undefined,
        xAxis: {
          type: 'category',
          axisLabel: {
            formatter: (params) => {
              let newParamsName = ''
              const paramsNameNumber = params?.length ?? 1
              const provideNumber = 4
              const rowNumber = Math.ceil(paramsNameNumber / provideNumber)
              if (paramsNameNumber > provideNumber) {
                for (let p = 0; p < rowNumber; p++) {
                  let tempStr = ''
                  const start = p * provideNumber
                  const end = start + provideNumber
                  if (p === rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber)
                  } else {
                    tempStr = params.substring(start, end) + '\n'
                  }
                  newParamsName += tempStr
                }
              } else {
                newParamsName = params
              }
              return newParamsName
            }
          }
        },
        yAxis: {
          minInterval: 1
        },
        series: [
          {
            type: 'bar',
            barWidth: 42,
            itemStyle: {
              color: '#0C6FFF'
            },

            datasetIndex: 0,
            encode: { x: 'teacherName', y: this.radio }
          }
        ]
      }
      if (this.data.length > 10) {
        options.dataZoom = {
          show: true, // 为true 滚动条出现
          realtime: true,
          type: 'slider', // 有type这个属性，滚动条在最下面，也可以不行，写y：36，这表示距离顶端36px，一般就是在图上面。
          height: 10, // 表示滚动条的高度，也就是粗细
          startValue: 0, // 从头开始。
          endValue: 10 // 最多10个
        }
      } else {
        options.dataZoom = undefined
      }
      this.chart.setOption(options)
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
.compared {
  .search {
    margin-left: 20px;
    margin-right: 20px;
    display: flex;
    justify-content: space-between;
    .search_left {
      display: flex;
      align-items: center;
    }
  }
  .histogram {
    height: 432px;
  }
}
.radio {
  text-align: center;
}
.page_wrap_footer {
  padding-left: 20px;
  padding-right: 20px;
}
</style>
