<template>
  <!-- 讲师数据对比图 -->
  <div class="compared">
    <MCard class="m-t-22">
      <div class="trend-container">
        <div class="search">
          <div class="search_left">
            <MTitle title="师资开发情况表" class="m-r-16" />
          </div>
          <div>
            <AppDatepicker
              :show="[ 1, 7, 30]"
              :default="7"
              :search="search.time"
              :picker-options="pickerOptions"
              @change="timeChange"
              @blur="currentTime = ''"
            />
          </div>
        </div>
        <div class="histogram">
          <!-- <dynamicTable
            ref="table"
            v-model="tableData"
            immediate-check
            :hide-pagination="true"
            :columns="columns"
            :show-summary="true"
            :get-list-api="getList"
            :config-props="{layout:'total, prev, pager, next'}"
          >
            <template #newPreliminary="{ row }">
              <el-button type="text" @click="goLink('newPreliminary',row)">{{
                row.newPreliminary
              }}</el-button>
            </template>
            <template #preliminaryPassAssess="{ row }">
              <el-button type="text" @click="goLink('preliminaryPassAssess',row)">{{
                row.preliminaryPassAssess
              }}</el-button>
            </template>
            <template #preliminaryPassAssessPlus="{ row }">
              <el-button type="text" @click="goLink('preliminaryPassAssessPlus',row)">{{
                row.preliminaryPassAssessPlus
              }}</el-button>
            </template>
            <template #newArchives="{ row }">
              <el-button type="text" @click="goLink('newArchives',row)">{{
                row.newArchives
              }}</el-button>
            </template>
            <template #initiateAssess="{ row }">
              <el-button type="text" @click="goLink('initiateAssess',row)">{{
                row.initiateAssess
              }}</el-button>
            </template>
            <template #scord="{ row }">
              <el-button type="text" @click="goLink('scord',row)">{{
                row.scord
              }}</el-button>
            </template>
          </dynamicTable> -->
          <el-table
            key="funnelChart"
            ref="funnelChart"
            v-loading="loading"
            :data="tableData"
            show-summary
            height="100%"
            :header-cell-style="{ background: '#f5f5f5' }"
          >
            <el-table-column v-for="(item,index) in columns" :key="index" :prop="item.prop" :label="item.label" :sortable="item.sortable" :width="item.width">
              <template slot-scope="{ row }">
                <el-button v-if="item.type === 'slot'" type="text" @click="goLink(item.prop ,row)">
                  {{ row[item.prop] }}
                </el-button>
                <span v-else>
                  {{ row[item.prop] }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </MCard>
    <!-- 表格 -->

  </div>
</template>

<script>
import { getStatisticsTeacher } from '@/api/tearchCenter/index'
import AppDatepicker from '@/components/AppDatePicker'
// import dynamicTable from '@/components/DynamicTable/table'
export default {
  components: {
    AppDatepicker
    // dynamicTable
  },
  data() {
    return {
      search: {
        time: {
          active: 1,
          time: ['', '']
        },
        ranking: 10,
        type: 6 // 查询类型1-综合评分 2-案例数 3-计划数 4-课件数 5-课程数 6-业绩数
      },
      loading: false,
      tableData: [],
      currentTime: '',
      columns: [
        {
          prop: 'userName',
          label: '师资创建人',
          type: 'text',
          visible: true
        },
        {
          prop: 'newPreliminary',
          label: '新建初审',
          type: 'slot',
          visible: true,
          sortable: true
        },
        {
          prop: 'preliminaryPassAssess',
          label: '初审通过(需要评估)',
          width: 180,
          type: 'slot',
          visible: true,
          sortable: true
        },
        {
          prop: 'preliminaryPassAssessPlus',
          label: '初审通过(评估+建联)',
          width: 180,
          type: 'slot',
          visible: true,
          sortable: true
        },
        {
          prop: 'preliminaryReject',
          label: '初审未通过',
          type: 'text',
          visible: true,
          sortable: true
        },
        {
          prop: 'newArchives',
          label: '新建档案',
          type: 'slot',
          visible: true,
          sortable: true
        },
        {
          prop: 'initiateAssess',
          label: '发起评估',
          type: 'slot',
          visible: true,
          sortable: true
        },
        {
          prop: 'scord',
          label: '评分>=65',
          type: 'text', // 暂时text
          visible: true,
          sortable: true
        },
        {
          prop: 'followNum',
          label: '跟进数量',
          type: 'text',
          visible: true
        }
      ],
      pickerOptions: {
        disabledDate: (time) => {
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
  methods: {
    init() {
      // this.$nextTick(() => {
      //   this.$refs.table?.onRefresh()
      // })
      this.getList()
    },
    timeChange(val) {
      this.search.time = val
      this.init()
    },
    // 获取讲师数据对比
    getList() {
      const startDate = this.search.time.time[0]
      const endDate = this.search.time.time[1]
      this.loading = true
      getStatisticsTeacher({ startDate, endDate }).then(res => {
        this.tableData = res.data
        this.$nextTick(() => {
          this.$refs.funnelChart.doLayout()
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // async getList() {
    //   const startDate = this.search.time.time[0]
    //   const endDate = this.search.time.time[1]
    //   this.loading = true
    //   const { data } = await getStatisticsTeacher({
    //     startDate, // 开始日期
    //     endDate // 截止日期
    //   })
    //   return {
    //     data: {
    //       items: data
    //     }
    //   }
    // },
    goLink(type, row) {
      const startDate = this.search.time.time[0]
      const endDate = this.search.time.time[1]
      const approve = ['newPreliminary', 'preliminaryPassAssess', 'preliminaryPassAssessPlus']
      const teacher = ['newArchives', 'initiateAssess']
      if (approve.includes(type)) {
        const query = {
          activeName: 'third',
          createUserName: row.userName
        }
        if (type === 'newPreliminary') {
          query.createTimeBegin = startDate
          query.createTimeEnd = endDate
        }
        if (type === 'preliminaryPassAssess' || type === 'preliminaryPassAssessPlus') {
          query.auditTimeBegin = startDate
          query.auditTimeEnd = endDate
          query.auditResult = type === 'preliminaryPassAssess' ? 4 : 5
        }
        this.$router.push({
          path: '/teacherCenter/teachFile/list',
          query
        })
        return
      }
      if (teacher.includes(type)) {
        const query = {
          activeName: 'first',
          createTimeBegin: startDate,
          createTimeEnd: endDate,
          createUserName: row.userName
        }
        if (type === 'initiateAssess') {
          query.assessFlag = 1
        }
        this.$router.push({
          path: '/teacherCenter/teachFile/list',
          query
        })
        return
      }
      const query = {
        beginTime: startDate,
        endTime: endDate,
        assessStatus: '3',
        beginRating: 65,
        createUserName: row.userName
      }
      this.$router.push({
        path: '/teacherCenter/teacherAssessment/list',
        query
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.compared ::v-deep{
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

        &:last-child{
          margin-right: 0px;
        }
      }
      .is-select.search_item{
        color: #FFFFFF;
        background-color: #0C6FFF;
        background-image: url('../../../assets/image/kanban_bg.png');
        background-repeat:no-repeat ;
        background-size: 151px 134px;
        background-position: 110% 8px;
        .value{
          color: #FFFFFF;
        }
        .label{
            font-size: 16px;
            font-weight: 500;
            color: #fff;
          }
      }
    }
  }
  .center-btn{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 26px;
  }
  .histogram {
    height: 432px;
    padding-top: 20px;
  }
}
.radio {
  text-align: center;
}

</style>
