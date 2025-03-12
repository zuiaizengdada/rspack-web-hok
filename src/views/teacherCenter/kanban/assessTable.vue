<template>
  <!-- 师资评估情况表 -->
  <div class="assessTable">
    <MCard class="m-t-22">
      <div class="trend-container">
        <div class="search">
          <div class="search_left">
            <MTitle title="师资评估情况表" class="m-r-16" />
          </div>
          <div>
            <AppDatepicker
              :show="[ 1, 7, 30]"
              :default="30"
              :search="search.time"
              :picker-options="pickerOptions"
              @change="timeChange"
              @blur="currentTime = ''"
            />
          </div>
        </div>
        <dynamicTable
          ref="table"
          key="assessTable"
          v-model="tableData"
          class="histogram"
          immediate-check
          :hide-pagination="true"
          :columns="columns"
          show-summary
          :summary-method="getSummaries"
          :get-list-api="getList"
          :config-props="{layout:'total, prev, pager, next'}"
        >
          <template #needAssessNum="{ row }">
            <el-button type="text" style="color:rgb(96, 98, 102)" @click="goLink('needAssessNum',row)">{{
              row.needAssessNum
            }}</el-button>
          </template>
          <template #realityNeedAssessNum="{ row }">
            <el-button type="text" style="color:rgb(96, 98, 102)" @click="goLink('realityNeedAssessNum',row)">{{
              row.realityNeedAssessNum
            }}</el-button>
          </template>
          <template #haveNeedAssessNum="{ row }">
            <el-button type="text" style="color:rgb(96, 98, 102)" @click="goLink('haveNeedAssessNum',row)">{{
              row.haveNeedAssessNum
            }}</el-button>
          </template>
          <template #noNeedAssessNum="{ row }">
            <el-button type="text" style="color:rgb(96, 98, 102)" @click="goLink('noNeedAssessNum',row)">{{
              row.noNeedAssessNum
            }}</el-button>
          </template>
          <template #assessRatio="{ row }">
            <span>{{
              row.assessRatio
            }}%</span>
          </template>
          <template #underFiveNum="{ row }">
            <el-button type="text" style="color:rgb(96, 98, 102)" @click="goLink('underFiveNum',row)">{{
              row.underFiveNum
            }}</el-button>
          </template>
          <template #fiveToSixNum="{ row }">
            <el-button type="text" style="color:rgb(96, 98, 102)" @click="goLink('fiveToSixNum',row)">{{
              row.fiveToSixNum
            }}</el-button>
          </template>
          <template #sixToSevenNum="{ row }">
            <el-button type="text" style="color:rgb(96, 98, 102)" @click="goLink('sixToSevenNum',row)">{{
              row.sixToSevenNum
            }}</el-button>
          </template>
          <template #sevenToEightNum="{ row }">
            <el-button type="text" style="color:rgb(96, 98, 102)" @click="goLink('sevenToEightNum',row)">{{
              row.sevenToEightNum
            }}</el-button>
          </template>
          <template #eightToTenNum="{ row }">
            <el-button type="text" style="color:rgb(96, 98, 102)" @click="goLink('eightToTenNum',row)">{{
              row.eightToTenNum
            }}</el-button>
          </template>
        </dynamicTable>
      </div>
    </MCard>
  </div>
</template>

<script>
import AppDatepicker from '@/components/AppDatePicker'
import dynamicTable from '@/components/DynamicTable/table'
import BigNumber from 'bignumber.js'
import { teacherReportUserAssess } from '@/api/tearchCenter/index'

export default {
  components: {
    AppDatepicker,
    dynamicTable
  },
  data() {
    return {
      search: {
        time: {
          active: 1,
          time: ['', '']
        }
      },
      tableData: [],
      currentTime: '',
      columns: [
        {
          prop: 'userName',
          label: '评估人',
          type: 'text',
          visible: true
        },
        {
          prop: 'needAssessNum',
          label: '需要评估次数',
          type: 'slot',
          visible: true
        },
        {
          prop: 'realityNeedAssessNum',
          label: '实际评估次数',
          type: 'slot',
          visible: true
        },
        // {
        //   prop: 'haveNeedAssessNum',
        //   label: '评估中次数',
        //   type: 'slot',
        //   visible: true
        // },
        {
          prop: 'noNeedAssessNum',
          label: '未评估次数',
          type: 'slot',
          visible: true
        },
        {
          prop: 'assessRatio',
          label: '未评估百分比',
          type: 'slot',
          visible: true
        },
        {
          prop: 'overallRating',
          label: '综合平均分',
          type: 'text',
          visible: true
        },
        {
          prop: 'underFiveNum',
          label: '50分以下次数',
          type: 'slot',
          visible: true
        },
        {
          prop: 'fiveToSixNum',
          label: '50-60分次数',
          type: 'slot',
          visible: true
        },
        {
          prop: 'sixToSevenNum',
          label: '60-70分次数',
          type: 'slot',
          visible: true
        },
        {
          prop: 'sevenToEightNum',
          label: '70-80分以下次数',
          type: 'slot',
          visible: true
        },
        {
          prop: 'eightToTenNum',
          label: '80-100分次数',
          type: 'slot',
          visible: true
        }
      ],
      pickerOptions: {
        disabledDate: (time) => {
          // 限制今天之后的
          if (time.getTime() > Date.now()) {
            return true
          }
          // eslint-disable-next-line eqeqeq
          if (this.currentTime !== '') {
            // 一年以内
            const one = 364 * 24 * 3600 * 1000
            const minTime = this.currentTime - one
            const maxTime = this.currentTime + one
            return time.getTime() < minTime || this.getTime() > maxTime
          }
        }
      },
      onPick: ({ maxDate, minDate }) => {
        this.currentTime = minDate.getTime()
        if (maxDate) {
          this.currentTime = ''
        }
      }
    }
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.$refs.table?.onRefresh()
      })
    },
    timeChange(val) {
      this.search.time = val
      this.init()
    },
    // 获取数据
    async getList() {
      const startDate = this.search.time.time[0]
      const endDate = this.search.time.time[1]
      const { data } = await teacherReportUserAssess({
        startDate, // 开始日期
        endDate // 截止日期
      })
      return {
        data: {
          items: data
        }
      }
    },

    goLink(type, row) {
      return
      // const startDate = this.search.time.time[0]
      // const endDate = this.search.time.time[1]
      // const query = {
      //   beginTime: startDate,
      //   endTime: endDate,
      //   assessStatus: '',
      //   beginRating: 0,
      //   endRating: 100,
      //   assessorSysUser: row.userName,
      //   assessByMe: ''
      // }
      // // 需要评估次数参数
      // // if (type === 'needAssessNum') {
      // //   query.assessByMe = 1
      // // }
      // //  assessByMe: '需要我评估的': 1 '我参与评估的': 2
      // //  assessStatus : '未评估': 1 '评估中': 2 '已评估': 3
      // // 实际评估次数参数
      // if (type === 'realityNeedAssessNum') {
      //   query.assessStatus = 3
      //   query.assessByMe = 2
      // }
      // // 评估中次数
      // if (type === 'haveNeedAssessNum') {
      //   query.assessStatus = 2
      //   query.assessByMe = 1
      // }
      // // 未评估次数
      // if (type === 'noNeedAssessNum') {
      //   query.assessStatus = 1
      //   query.assessByMe = 1
      // }
      // // 50分以下参数
      // if (type === 'underFiveNum') {
      //   query.assessStatus = 3
      //   query.assessByMe = 2
      //   query.endRating = 50
      // }
      // // 50-60分次数参数
      // if (type === 'fiveToSixNum') {
      //   query.assessStatus = 3
      //   query.assessByMe = 2
      //   query.beginRating = 50
      //   query.endRating = 60
      // }
      // // 60-70分次数参数
      // if (type === 'sixToSevenNum') {
      //   query.assessStatus = 3
      //   query.assessByMe = 2
      //   query.beginRating = 60
      //   query.endRating = 70
      // }
      // // 70-80分次数参数
      // if (type === 'sevenToEightNum') {
      //   query.assessStatus = 3
      //   query.assessByMe = 2
      //   query.beginRating = 70
      //   query.endRating = 80
      // }
      // // 80-100分次数参数
      // if (type === 'eightToTenNum') {
      //   query.assessStatus = 3
      //   query.assessByMe = 2
      //   query.beginRating = 80
      //   query.endRating = 100
      // }
      // this.$router.push({
      //   path: '/teacherCenter/teacherAssessment/list',
      //   query
      // })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return BigNumber(prev).plus(curr).toNumber()
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = 0
        }
      })
      if (sums[1] !== 0) {
        sums[4] = BigNumber(Math.abs(sums[3] || 0)).div(sums[1] || 0).times(100).toFixed(0).toString() + '%'
        sums[5] = BigNumber(Math.abs(sums[5] || 0)).div(data.length || 0).toFixed(2)
      } else {
        sums[4] = '0%'
      }
      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.assessTable ::v-deep {
  .my-table{
    margin: 0px;
  }
  .trend-container{
    padding: 0 20px;
    .search {
      display: flex;
      justify-content: space-between;
      .search_left {
        display: flex;
        align-items: center;
      }
    }
    .search_type{
      display: flex;
      width: 100%;
      margin-top: 42px;
      .search_item{
        flex: 1;
        border-radius: 6px;
        height: 116px;
        margin-right: 20px;
        font-size: 16px;
        color: #333333;
        cursor: pointer;
        .search_box{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          .value{
            margin-top: 15px;
            font-size: 24px;
            font-weight: bold;
            color: #161616;
          }
          .label{
            font-size: 16px;
            font-weight: 500;
            color: #161616;
          }
        }

      }
    }
  }

  .histogram {
    height: 432px;
  }
}

</style>
