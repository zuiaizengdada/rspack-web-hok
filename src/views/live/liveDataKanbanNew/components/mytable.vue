<template>
  <el-table
    ref="table"
    class="table_wrap"
    :data="tableData"
    style="width: 100%"
    :header-cell-style="headerCellStyle"
    :cell-style="cellStyle"
    show-summary
    :summary-method="getSummaries"
    @expand-change="expandChange"
  >
    <el-table-column label="直播日期" prop="startTime" width="96px">
      <template slot-scope="{ row }">
        {{ row.startTime | parseTime('{y}-{m}-{d}') }}
      </template>
    </el-table-column>
    <el-table-column label="开播时间" prop="startTime" width="75px">
      <template slot-scope="{ row }">
        {{ row.startTime | parseTime('{h}:{i}:{s}') }}
      </template>
    </el-table-column>
    <el-table-column label="直播名称" prop="name" width="200px">
      <template slot-scope="{ row }">
        <span class="a_link" @click.stop="gotoLiveDetailData(row)">{{ row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column label="助教" prop="teachers" show-overflow-tooltip width="90px">
      <template slot-scope="{ row }">
        {{ row.teachers | renderTearch }}
      </template>
    </el-table-column>
    <el-table-column label="直播模式" prop="liveModel" width="74px">
      <template slot-scope="{ row }">
        {{ row.liveModel | getOptionsValue(liveModeOption) }}
      </template>
    </el-table-column>
    <el-table-column label="使用素材名称" prop="videoName" width="200px" />
    <el-table-column prop="newClueCount" label="新量线索量" align="center" width="81px">
      <template slot="header">
        <MTips text="新量线索量" tips="只统计新量，不统计存量。" align="center" />
      </template>
    </el-table-column>
    <el-table-column prop="newFlowApplyCount" label="新量报名人数" align="center" width="81px">
      <template slot="header">
        <MTips text="新量报名人数" tips="新量报名人数" align="center" />
      </template>
    </el-table-column>
    <el-table-column prop="oldFlowApplyCount" label="存量报名人数" align="center" width="81px">
      <template slot="header">
        <MTips text="存量报名人数" tips="存量报名人数" align="center" />
      </template>
    </el-table-column>
    <el-table-column prop="totalApplyCount" label="总报名人数" align="center" width="81px">
      <template slot="header">
        <MTips text="总报名人数" tips="总报名人数" align="center" />
      </template>
    </el-table-column>
    <el-table-column prop="newFlowCoursesCount" label="新量到课人数" align="center" width="81px">
      <template slot="header">
        <MTips text="新量到课人数" tips="新量到课人数" align="center" />
      </template>
    </el-table-column>
    <el-table-column prop="totalCoursesCount" :label="attendClassTime === '' ? '' : '总到课人数'" align="center" width="81px">
      <template v-if="attendClassTime !== ''" slot="header">
        <MTips text="总到课人数" :tips="`到课的人数（含游客），且观看直播大于${attendClassTime}分钟`" align="center"><div><div>总到课</div><div>人数</div></div></MTips>
      </template>
    </el-table-column>
    <el-table-column prop="newFlowCourseRate" label="新量线索到课率" align="center" width="81px">
      <template slot="header">
        <MTips text="新量线索到课率" tips="新量到课人数除以新量线索量*100%" align="center"><div><div style="white-space: nowrap;">新量线索</div><div>到课率</div></div></MTips>
      </template>
      <template slot-scope="{ row }">
        {{ row.newFlowCourseRate | renderRate }}%
      </template>
    </el-table-column>

    <el-table-column prop="newFlowOrderCount" label="新量订单数" align="center" width="81px">
      <template slot="header">
        <MTips text="新量订单数" tips="指任务下关联了直播间的线索量下的已成交的订单数。" align="center" />
      </template>
    </el-table-column>

    <el-table-column prop="oldFlowOrderCount" label="存量订单数" align="center" width="81px">
      <template slot="header">
        <MTips text="存量订单数" tips="指任务下没有关联直播间的线索量下的已成交的订单数。" align="center" />
      </template>
    </el-table-column>

    <el-table-column prop="totalOrderCount" label="转化总订单数" align="center" width="81px">
      <template slot="header">
        <MTips text="转化总订单数" tips="转化总订单数" align="center" />
      </template>
    </el-table-column>

    <el-table-column prop="attendTransRate" label="新量到课转化率" align="center" width="91px">
      <template slot="header">
        <MTips text="新量到课转化率" tips="新量订单数除以新量线索到课率*100%" align="center"><div><div>新量到课</div><div>转化率</div></div></MTips>
      </template>
      <template slot-scope="{ row }">
        {{ row.attendTransRate | renderRate }}%
      </template>
    </el-table-column>
    <el-table-column prop="clueTransRate" label="线索转化率" align="center" width="81px">
      <template slot="header">
        <MTips text="线索转化率" tips="转化总订单数除以新量线索量*100%" align="center"><div><div>线索</div><div>转化率</div></div></MTips>
      </template>
      <template slot-scope="{ row }">
        {{ row.clueTransRate | renderRate }}%
      </template>
    </el-table-column>
    <el-table-column prop="price" label="单价" align="center" width="81px">
      <template slot="header">
        <MTips text="单价" tips="GMV除以转化订单数" align="center" />
      </template>
      <template slot-scope="{ row }">
        {{ row.price | filtersMoneyByZero }}
      </template>
    </el-table-column>
    <el-table-column prop="gmv" label="转化GMV" align="center" width="81px">
      <template slot="header">
        <MTips text="转化GMV" tips="该场直播转化的总业绩" align="center"><div><div>转化</div><div>GMV</div></div></MTips>
      </template>
      <template slot-scope="{ row }">
        {{ row.gmv | filtersMoneyByZero }}
      </template>
    </el-table-column>

    <el-table-column prop="oldFlowGmv" label="存量转化GMV" align="center" width="81px">
      <template slot="header">
        <MTips text="存量转化GMV" tips="指存量已成交的订单累计的业绩数。" align="center" />
      </template>
      <template slot-scope="{ row }">
        {{ row.oldFlowGmv | filtersMoneyByZero }}
      </template>
    </el-table-column>

    <el-table-column prop="oldFlowGmvRate" label="存量转化占比" align="center" width="81px">
      <template slot="header">
        <MTips text="存量转化占比" tips="指存量已成交的业绩数除以【新量】+【存量】的百分比。" align="center" />
      </template>
      <template slot-scope="{ row }">
        {{ row.oldFlowGmvRate | renderRate }}%
      </template>
    </el-table-column>

    <el-table-column prop="singleClueOut" label="单条线索产出" align="center" width="105px">
      <template slot="header">
        <MTips text="单条线索产出" tips="总产出/总线索" align="center"><div><div>单条</div><div>线索产出</div></div></MTips>
      </template>
      <template slot-scope="{ row }">
        {{ row.singleClueOut | filtersMoneyByZero }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import contextmenu from '@/views/live/liveRoom/components/contextmenu/index.js'
import { liveModeOption } from '@/views/live/columns.js'
import { filtersMoneyByZero } from '@/filters'
import { liveRoomDataBoard } from '@/api/liveRoom/kanban.js'
import { canEnterLiveRoom } from '@/api/liveRoom/index'
import BigNumber from 'bignumber.js'
import { mapGetters, mapState } from 'vuex'
export default {
  components: {},
  filters: {
    renderTearch(val) {
      if (!val || val.length === 0) return ''
      return val.reduce((pre, next) => {
        next && (pre = `${pre}${pre ? '、' : ''}${next.userName}`)
        return pre
      }, '')
    },
    renderRate(val) {
      if (!val) return 0
      return val.toFixed(2).toString().replace(/(\.00)$/, '')
    }
  },
  props: {
    dataCount: {
      type: Object,
      default: () => {
        return {
          attendPeopleNumSum: 0,
          attendTransRateSum: 0,
          clueAttendRateSum: 0,
          clueSum: 0,
          clueTransRateSum: 0,
          gmvSum: 0,
          priceSum: 0,
          signUpPeopleNumSum: 0,
          singleClueOutSum: 0,
          transformOrderCountSum: 0
        }
      }
    }
  },
  data() {
    return {
      tableData: [],
      liveModeOption,
      expandTable: {
        loading: false,
        rowTableData: [],
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      headerCellStyle: {
        background: '#E9EFF7',
        fontSize: '12px',
        fontFamily: 'PingFangSC-Medium, PingFang SC',
        fontWeight: 'bolder',
        color: '#2C3242',
        lineHeight: '17px',
        borderLeft: '1px solid #fff'
      },
      cellStyle: {
        fontSize: '12px',
        fontFamily: 'PingFangSC-Regular, PingFang SC',
        fontWeight: '400',
        color: '#2C3242'
      },
      loading: false,
      timers: null,
      dataRowCount: {
        clueNum: 0, // 线索量合计
        addWechatNum: 0, // 加微数合计
        addWechatRate: 0, // 加微率合计
        signUpNum: 0, // 报名人数合计
        attendPeopleNum: 0, // 到课人数合计
        attendPeopleRate: 0, // 到课率合计
        orderNum: 0, // 转化订单数合计
        attendPeopleOrderRate: 0, // 到课转化率合计
        clueOrderRate: 0, // 线索转化率合计
        gmv: 0, // 转化GMV合计
        singleClueOutput: ''// 单条线索产出合计
      },
      tagger: false,
      enterLiveRoom: false,
      openRow: {
        loading: false,
        rowTableData: [],
        total: 0,
        pageSize: 10,
        currentPage: 1
      } // 记录展开的row
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState({
      attendClassTime: state => state.liveSetting.attendClassTime
    })
  },
  mounted() {
    this.canEnterLiveRoom()
  },
  methods: {
    renderContent() {
      return this.attendClassTime
    },
    canEnterLiveRoom() {
      return canEnterLiveRoom().then(res => {
        this.enterLiveRoom = res.data
      })
    },
    rowClick(row, column, event) {
      this.$refs.table.toggleRowExpansion(row)
    },
    expandChange(row) {
      row.rowTableData = []
      row.loading = false
      row.total = 0
      row.pageSize = 10
      row.currentPage = 1
      if (this.openRow) {
        this.$refs.table.toggleRowExpansion(this.openRow, false)
        this.openRow = {}
      }
      row.open = !row.open
      if (row.open) {
        this.openRow = row
        this.init()
      }
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      const obj = {
        0: '合计',
        1: '',
        2: '——', //
        3: '', //
        4: '——', //
        5: '', //
        6: 'newClueCount', // 新量线索量
        7: 'newFlowApplyCount', // 新量报名人数
        8: 'oldFlowApplyCount', // 存量报名人数
        9: 'totalApplyCount', // 总报名人数
        10: 'newFlowCoursesCount', // 新量到课人数
        11: 'totalCoursesCount', // 总到课人数
        12: 'newFlowCourseRate', // 新量线索到课率
        // 13: 'clueAttendRateSum', // 线索到课率
        13: 'newFlowOrderCount', // 新量订单数
        14: 'oldFlowOrderCount', // 存量订单数
        15: 'totalOrderCount', // 转化总订单数
        16: 'attendTransRateSum', // 到课转化率 16
        17: 'clueTransRateSum', // 线索转化率 17
        18: 'priceSum', // 单价 18
        19: 'gmvSum', // 转化GMV 19
        20: 'oldFlowGmv', // 存量转化GMV 20
        21: 'oldFlowGmvRate', // 存量转化占比 21
        22: 'singleClueOutSum' // 单条线索产出
      }
      columns.forEach((column, index) => {
        if ([18, 19, 20, 22].includes(index)) {
          sums[index] = filtersMoneyByZero(this.dataCount[obj[index]])
          return
        }
        if ([12, 21, 16, 17].includes(index)) {
          sums[index] = (this.dataCount[obj[index]] || 0).toFixed(2).toString().replace(/(\.00)$/, '') + '%'
          return
        }
        if (index > 5) {
          sums[index] = this.dataCount[obj[index]]
          return
        }
        sums[index] = obj[index]
        return
      })

      return sums
    },
    getRowSummaries(param) {
      const { columns } = param
      const sums = []
      const obj = {
        0: '合计',
        1: 'newClueCount', // 新量线索量
        2: 'addWechatNum', // 加微数
        3: 'addWechatRate', // 加微率
        4: 'newFlowApplyCount', // 新量报名人数
        5: 'oldFlowApplyCount', // 存量报名人数
        6: 'totalApplyCount', // 总报名人数
        7: 'newFlowCoursesCount', // 新量到课人数
        8: 'totalCoursesCount', // 总到课人数
        9: 'newFlowCourseRate', // 新量线索到课率
        // 10: 'attendPeopleRate', // 线索到课率
        10: 'newFlowOrderCount', // 新量订单数
        11: 'oldFlowOrderCount', // 存量订单数
        12: 'totalOrderCount', // 转化总订单数
        13: 'attendPeopleOrderRate', // 到课转化率 13
        14: 'clueOrderRate', // 线索转化率 14
        15: 'gmv', // 转化GMV 15
        16: 'oldFlowGmv', // 存量转化GMV 16
        17: 'oldFlowGmvRate', // 存量转化占比 17
        18: 'singleClueOutput' // 单条线索产出
      }
      columns.forEach((column, index) => {
        if ([3, 9, 17, 13, 14].includes(index)) {
          sums[index] = (this.dataRowCount[obj[index]] || 0) + '%'
          return
        }
        if ([16, 15, 18].includes(index)) {
          sums[index] = filtersMoneyByZero(this.dataRowCount[obj[index]]) || 0
          return
        }
        if (index > 0) {
          sums[index] = this.dataRowCount[obj[index]]
          return
        }
        sums[index] = obj[index]
        return
      })

      return sums
    },
    closeExpand() {
      this.tableData.map(v => {
        this.$refs.table.toggleRowExpansion(v, false)
      })
      // this.openRow = {
      //   loading: false,
      //   rowTableData: [],
      //   total: 0,
      //   pageSize: 10,
      //   currentPage: 1
      // }
    },
    handleSizeChange(val) {
      this.openRow.pageSize = val
      this.openRow.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.openRow.currentPage = val
      this.getList()
    },
    getList() {
      this.openRow.loading = true
      const data = {
        liveRoomId: this.openRow.liveRoomId,
        pageIndex: this.openRow.currentPage,
        pageSize: this.openRow.pageSize
      }
      liveRoomDataBoard(data).then(res => {
        this.dataRowCount = {
          ...res.data
          // clueNum: res.data.clueNum, // 线索量合计
          // addWechatNum: res.data.addWechatNum, // 加微数合计
          // addWechatRate: res.data.addWechatRate, // 加微率合计
          // signUpNum: res.data.signUpNum, // 报名人数合计
          // attendPeopleNum: res.data.attendPeopleNum, // 到课人数合计
          // attendPeopleRate: res.data.attendPeopleRate, // 到课率合计
          // orderNum: res.data.orderNum, // 转化订单数合计
          // attendPeopleOrderRate: res.data.attendPeopleOrderRate, // 到课转化率合计
          // clueOrderRate: res.data.clueOrderRate, // 线索转化率合计
          // gmv: res.data.gmv, // 转化GMV合计
          // singleClueOutput: res.data.singleClueOutput// 单条线索产出合计
        }
        res.data.pageData.data.items.map((v, i) => {
          v.gmv = this.filtersMoney(v.gmv)
          v.singleClueOutput = this.filtersMoney(v.singleClueOutput)
          v.id = ((this.openRow.currentPage - 1) * this.openRow.pageSize) + i
        })
        this.openRow.rowTableData = res.data.pageData.data.items
        this.openRow.total = res.data.pageData.data.total
        console.log(this.openRow, 'this.openRow')
        this.openRow.loading = false
        this.$refs.table && this.$refs.table.doLayout()
      }).catch(() => {
        this.openRow.loading = false
        this.$forceUpdate()
      })
    },
    init() {
      // this.expandTable = {
      //   loading: true,
      //   rowTableData: [],
      //   total: 0,
      //   pageSize: 10,
      //   currentPage: 1
      // }
      this.getList()
    },
    cellMouseEnter(row, column, cell, event) {
      const windowWidth = window.innerWidth
      clearInterval(this.timers)
      this.timers = null
      if (row.open) { return }
      let left = event.pageX
      if (event.pageX > windowWidth - 160) {
        left = left - 168
      }
      this.timers = setInterval(() => {
        console.log(event.pageX, 'event.pageX')
        const tools = [['点击查看单场数据']]
        const markHeight = 53
        contextmenu.open({
          left,
          top: event.pageY,
          markHeight,
          tools,
          onClickFn: (el, res) => {
            console.log(el, res)
          }
        })
      }, 1000)
    },
    cellMouseLeave(row, column, cell, event) {
      clearInterval(this.timers)
      this.timers = null
      contextmenu.close()
    },
    setTableData(arr) {
      arr.map(v => {
        v.rowTableData = []
        v.loading = false
        v.total = 0
        v.pageSize = 10
        v.currentPage = 1
      })
      console.log(this.tableData, 'this.tableData')
      this.tableData = arr
    },
    // 金额处理：分转元 并添加，分割，以及取小数点后两位
    filtersMoney(money, flag = true) {
      const str = flag ? parseFloat(BigNumber(Math.abs(+money || 0)).div(100)) : parseFloat(BigNumber(Math.abs(+money || 0)))
      return parseFloat(str)
        .toFixed(2)
        .toString()
        .split('')
        .reverse()
        .join('')
        .replace(/(\d{3})/g, '$1,')
        .replace(/\,$/, '')
        .split('')
        .reverse()
        .join('').replace(/(\.00)$/, '')
    },
    // 点击直播间名称跳转直播间数据
    gotoLiveDetailData(row) {
      if (!this.canShowGotoLiveRoom(row)) {
        return this.$message.error('你暂无权限访问。')
      }
      const { href } = this.$router.resolve({
        path: `/live/liveDetail/${row.liveRoomId}?type=dataStatistics`
      })
      window.open(href, '_blank')
    },
    canShowGotoLiveRoom(row) {
      if (this.enterLiveRoom) {
        return true
      }
      if (!row.teachers || row.teachers.length === 0) {
        return false
      }
      const obj = row.teachers.find(v => v.userId === this.userInfo.userId)
      return Boolean(obj)
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
  .tips {
    .tipsText {
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bolder;
      color: #2C3242;
      // line-height: 12px;
    }
    .iconText {
      margin-left: 2px;
      width: 12px;
      height: 12px;
    }
  }
  .el-table th.el-table__cell > .cell {
    padding-left: 8px;
  }
  .el-table__footer-wrapper .el-table__cell{
    background: #E9EFF7;
    font-size: 12px;
    font-weight: bolder;
    color: #2C3242;
    // line-height: 17px;
    border-left: 1px solid #fff;
  }
  .el-table__expanded-cell {
    padding: 0!important;
  }
  .el-input__inner {
    background: transparent;
  }
  .el-pager li {
    background: transparent;
  }
  .el-pagination button {
    background: transparent;
  }
  .el-table th.el-table__cell.is-leaf, .el-table td.el-table__cell {
    border-bottom: 0px;
  }
  .el-table__footer-wrapper td.el-table__cell {
    border-top: 0px;
  }
}
.expandTable {
  background: #F5F5F5;
  padding: 11px;
}
::v-deep {
  .expandTable .el-table__footer-wrapper .el-table__cell{
    background: #fff;
    font-size: 12px;
    font-weight: bolder;
    color: #2C3242;
    // line-height: 17px;
  }
}
.pagination {
  padding-top: 23px;
  padding-bottom: 6px;
  text-align: right;
}
</style>
