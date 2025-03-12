<template>
  <div class="pageWrap">
    <div class="titleHeader">
      <MTitle>优惠券数据</MTitle>
      <div class="p-r-20 tips">
        数据统计时间
        <el-date-picker
          v-model="timeData"
          disabled
          style="width: 320px; margin-left: 8px"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          size="small"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
    </div>
    <div v-loading="loading" class="pageContent">
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{
          background: '#EFF2F6',
          padding: '9px 0',
          color: '#333',
          'font-weight': 700,
          'letter-spacing': '1px'
        }"
        :class="{ 'zb-table': true, 'el-table-null': !tableData.length }"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column prop="couponName" label="优惠券名称" width="166px">
          <template slot-scope="{ row }">
            <span class="text_hidden">{{ row.couponName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="discountMethod"
          label="优惠券类型"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.discountMethod | getOptionsValue(couponDiscountMethodType) }}
          </template>
        </el-table-column>
        <el-table-column prop="couponContent" label="优惠内容">
          <template slot-scope="{ row }">
            {{ row | filtersName }}
          </template>
        </el-table-column>
        <el-table-column
          prop="receiveCount"
          label="已领取张数"
          align="center"
        />
        <el-table-column
          prop="receiveUserCount"
          label="已领取人数"
          align="center"
        />
        <el-table-column prop="applyCount" label="使用人数" align="center" />
        <el-table-column
          prop="notApplyCount"
          label="未使用人数"
          align="center"
        />
        <el-table-column
          prop="useCount"
          label="使用优惠券笔数"
          align="center"
        />
        <el-table-column
          prop="discountsFee"
          label="使用优惠券金额"
          align="center"
        >
          <template slot-scope="{ row }">
            ￥{{ row.discountsFee | filtersMoneyByZero }}
          </template>
        </el-table-column>
        <template slot="empty">
          <el-empty :image-size="70" description="暂无数据" />
        </template>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { oneLiveRoomReportCoupon } from '@/api/liveRoom/kanban.js'
import { couponDiscountMethodType } from '@/views/live/columns.js'
import { filtersMoneyByZeroNoSplit, filtersMoneyByZero } from '@/filters'
import moment from 'moment'
export default {
  filters: {
    filtersName(row) {
      if (row.discountMethod === 1) {
        // 满减
        return `满${filtersMoneyByZeroNoSplit(
          row.satisfiedAmount
        )}元减${filtersMoneyByZeroNoSplit(row.subtractAmount)}元`
      } else if (row.discountMethod === 2) {
        // 直减
        return `直减${filtersMoneyByZeroNoSplit(row.directReductionAmount)}元`
      } else if (row.discountMethod === 3) {
        // 折扣
        return `${row.sale}折`
      }
      return ''
    }
  },
  components: {},
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      couponDiscountMethodType,
      originalData: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dataCount: {
        sumApplyCount: 0, // 使用人数汇总
        sumDiscountsFee: 0, // 使用优惠券金额汇总
        sumNotApplyCount: 0, // 未使用人数汇总
        sumReceiveCount: 0, // 已领取张数汇总
        sumReceiveUserCount: 0, // 已领取人数汇总
        sumUseCount: 0 // 使用优惠券笔数汇总
      },
      timeData: ['', '']
    }
  },
  watch: {
    detail: {
      handler: function (val) {
        if (val && val.endTime) {
          this.timeData = [
            moment(val.startTime).format('YYYY-MM-DD HH:mm'),
            moment(val.endTime).add(48, 'hour').format('YYYY-MM-DD HH:mm')
          ]
        } else if (val) {
          const startTime = moment(val.startTime).format('YYYY-MM-DD HH:mm')
          const nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm')
          if (nowTime > startTime) {
            this.timeData = [startTime, nowTime]
          } else {
            this.timeData = [nowTime, startTime]
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.currentPage = 1
    this.getList()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.renderTableData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.renderTableData()
    },
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        liveRoomId: this.$route.params.id
      }
      oneLiveRoomReportCoupon(data)
        .then(res => {
          this.dataCount = {
            sumApplyCount: res.data.sumApplyCount, // 使用人数汇总
            sumDiscountsFee: res.data.sumDiscountsFee, // 使用优惠券金额汇总
            sumNotApplyCount: res.data.sumNotApplyCount, // 未使用人数汇总
            sumReceiveCount: res.data.sumReceiveCount, // 已领取张数汇总
            sumReceiveUserCount: res.data.sumReceiveUserCount, // 已领取人数汇总
            sumUseCount: res.data.sumUseCount // 使用优惠券笔数汇总
          }
          this.originalData = res.data.couponList
          this.total = res.data.couponList.length
          this.currentPage = 1
          this.renderTableData()
          this.loading = false
          console.log(res)
        })
        .catch(() => {
          this.loading = false
        })
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      const obj = {
        0: '合计',
        1: '——',
        2: '——',
        3: 'sumReceiveCount', // 已领取张数汇总
        4: 'sumReceiveUserCount', // 已领取人数汇总
        5: 'sumApplyCount', // 使用人数
        6: 'sumNotApplyCount', // 未使用人数
        7: 'sumUseCount', // 使用优惠券笔数
        8: 'sumDiscountsFee' // 使用优惠券金额
      }
      columns.forEach((column, index) => {
        if ([8].includes(index)) {
          sums[index] = '￥' + filtersMoneyByZero(this.dataCount[obj[index]])
          return
        }
        if (index > 2) {
          sums[index] = this.dataCount[obj[index]]
          return
        }
        sums[index] = obj[index]
        return
      })

      return sums
    },
    renderTableData() {
      this.tableData = this.originalData.slice(
        (this.currentPage - 1) * this.pageSize,
        (this.currentPage - 1) * this.pageSize + this.pageSize
      )
      console.log(this.tableData, 'this.tableData')
    }
  }
}
</script>

<style lang='scss' scoped>
.pageWrap {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  .titleHeader {
    padding-left: 20px;
    height: 58px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tips {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }
  }
  .pageContent {
    padding: 0 20px;
    background: #fff;
    // height: 112px;
  }
  .pagination {
    padding-right: 20px;
    margin-top: 10px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-shadow: 0px -1px 4px 0px rgba(0, 0, 0, 0.05);
  }
}
.p-r-20 {
  padding-right: 20px;
}
</style>
