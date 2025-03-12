<template>
  <!-- IP数据对比图 -->
  <div class="compared">
    <MCard class="m-t-22">
      <div class="trend-container">
        <div class="search">
          <div class="search_left">
            <MTitle title="IP评分区间数据" class="m-r-16" />
          </div>
          <div>
            <AppDatepicker
              :show="[1, 7, 30]"
              :default="7"
              :search="search.time"
              :picker-options="pickerOptions"
              @change="timeChange"
              @blur="currentTime = ''"
            />
          </div>
        </div>
        <div class="search_type">
          <el-card
            v-for="item in typeList"
            :key="item.key"
            :class="{ 'is-select': item.check }"
            class="search_item"
            shadow="hover"
            @click.native="handleSelectType(item)"
          >
            <div class="search_box">
              <span class="label">{{ item.label }}</span>
              <span
                class="value"
              >{{ item.value }}
                <span class="label">名</span>
              </span>
            </div>
          </el-card>
        </div>
        <div class="histogram">
          <dynamicTable
            ref="table"
            v-model="tableData"
            immediate-check
            :hide-pagination="hidePagination"
            :columns="columns"
            :get-list-api="getList"
            :config-props="{ layout: 'total, prev, pager, next' }"
          >
            <template #teacherName="{ row }">
              <el-button type="text" @click="goTeacherAssessmentLink(row)">{{
                row.teacherName
              }}</el-button>
            </template>
          </dynamicTable>
        </div>
      </div>
    </MCard>
    <!-- 表格 -->
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { teacherAssessTrend } from '@/api/tearchCenter/index'
import AppDatepicker from '@/components/AppDatePicker'
import { getOptionsValue } from '@/filters'
import { getDict } from '@/utils/index'
const typeObj = {
  lessFive: 2,
  five2Six: 3,
  six2Seven: 4,
  seven2Eight: 5,
  eight2Ten: 6
}
export default {
  components: {
    AppDatepicker,
    dynamicTable
  },
  data() {
    return {
      search: {
        time: {
          active: 2,
          time: ['', '']
        }
      },
      hidePagination: false,
      select: 'six2Seven',
      tableData: [], // 列表数据
      COOPERATION_TYPE: [],
      columns: [
        {
          prop: 'teacherName',
          label: 'IP姓名',
          type: 'slot',
          visible: true
        },
        {
          prop: 'overallRating',
          label: '综合评分',
          type: 'text',
          visible: true,
          slotFn: row => (row.overallRating / 100).toFixed(2) + '分'
        },
        {
          prop: 'expiresTime',
          label: '评估截止时间',
          type: 'text',
          visible: true
        },
        {
          prop: 'teacherName',
          label: '合作状态',
          type: 'text',
          visible: true,
          slotFn: row =>
            getOptionsValue(row.cooperateStatus, this.COOPERATION_TYPE)
        }
      ],
      typeList: [
        {
          key: 'lessFive',
          label: '50分以下IP',
          value: 0,
          check: false
        },
        {
          key: 'five2Six',
          label: '50-60分IP',
          value: 0,
          check: false
        },
        {
          key: 'six2Seven',
          label: '60-70分IP',
          value: 0,
          check: true
        },
        {
          key: 'seven2Eight',
          label: '70-80分IP',
          value: 0,
          check: false
        },
        {
          key: 'eight2Ten',
          label: '80-100分IP',
          value: 0,
          check: false
        }
      ],
      currentTime: '',
      pickerOptions: {
        disabledDate: time => {
          // 先限制今天之前
          if (time.getTime() > Date.now()) {
            return true
          }
          // eslint-disable-next-line eqeqeq
          if (this.currentTime != '') {
            // 一年以内
            const one = 364 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            const minTime = this.currentTime - one
            const maxTime = this.currentTime + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      }
    }
  },
  async mounted() {
    this.COOPERATION_TYPE = await getDict('COOPERATION_TYPE')
    this.init()
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.$refs.table?.onRefresh()
      })
    },
    goTeacherAssessmentLink(row) {
      this.$router.push(
        `/teacherCenter/teacherAssessment/detail/${row.teacherId}`
      )
    },
    timeChange(val) {
      this.search.time = val
      this.init()
    },
    // 获取讲师数据对比
    getList(params) {
      const startDate = this.search.time.time[0] || undefined
      const endDate = this.search.time.time[1] || undefined
      const pointType = typeObj[this.select] || undefined
      this.loading = true
      return teacherAssessTrend({
        ...params,
        startDate, // 开始日期
        endDate, // 截止日期
        pointType
      }).then(({ data }) => {
        this.typeList.forEach(i => {
          i.value = data[i.key] ?? 0
        })
        this.$nextTick(() => {
          this.hidePagination =
            data.trendData.total < this.$refs.table?.config.pageSize
        })
        return {
          data: data.trendData
        }
      })
    },
    handleSelectType(item) {
      this.typeList.forEach(i => {
        i.check = false
        if (i.key === item.key) {
          item.check = true
        }
      })
      this.select = item.key
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.compared ::v-deep {
  .my-table {
    margin: 0px;
  }
  .trend-container {
    padding: 0 20px;
    .search {
      display: flex;
      justify-content: space-between;
      .search_left {
        display: flex;
        align-items: center;
      }
    }
    .search_type {
      display: flex;
      width: 100%;
      margin-top: 42px;
      .search_item {
        flex: 1;
        border-radius: 6px;
        height: 116px;
        margin-right: 20px;
        font-size: 16px;
        color: #333333;
        cursor: pointer;
        .search_box {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          .value {
            margin-top: 15px;
            font-size: 24px;
            font-weight: bold;
            color: #161616;
          }
          .label {
            font-size: 16px;
            font-weight: 500;
            color: #161616;
          }
        }

        &:last-child {
          margin-right: 0px;
        }
      }
      .is-select.search_item {
        color: #ffffff;
        background-color: #0c6fff;
        background-image: url('../../../assets/image/kanban_bg.png');
        background-repeat: no-repeat;
        background-size: 151px 134px;
        background-position: 110% 8px;
        .value {
          color: #ffffff;
        }
        .label {
          font-size: 16px;
          font-weight: 500;
          color: #fff;
        }
      }
    }
  }
  .histogram {
    height: 432px;
  }
}
.radio {
  text-align: center;
}
</style>
