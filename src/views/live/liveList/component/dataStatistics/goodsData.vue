<template>
  <div class="pageWrap">
    <div class="titleHeader">
      <MTitle>带货商品数据</MTitle>
      <div class="p-r-20 tips">数据统计时间
        <el-date-picker
          v-model="timeData"
          disabled
          style="width: 320px;margin-left: 8px"
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
        :header-cell-style="{ background: '#f5f5f5' }"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column prop="itemId" label="商品" width="211">
          <template slot-scope="{ row }">
            <div class="ImageViewer">
              <div class="imgUrl">
                <ImagePreviewer style="width: 100%; height: 100%;" :src="row.itemImageurl" fit="contain" :preview-src-list="[row.itemImageurl]" />
              </div>
              <span class="m-l-10 text_hidden">
                {{ row.itemName }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsPrice" label="商品原价" align="center">
          <template slot-scope="{ row }">
            ￥{{ row.goodsPrice | filtersMoneyByZero }}
          </template>
        </el-table-column>
        <el-table-column prop="clickCount" label="点击次数" align="center" />
        <el-table-column prop="clickUserCount" label="点击人数" align="center" />
        <el-table-column prop="transactionsUserCount" label="成交人数" align="center" />
        <el-table-column prop="transactionsOrderCount" label="成交笔数" align="center" />
        <el-table-column prop="transactionsAmount" label="成交金额" align="center">
          <template slot-scope="{ row }">
            ￥{{ row.transactionsAmount | filtersMoneyByZero }}
          </template>
        </el-table-column>
        <el-table-column prop="refundOrderCount" label="退款笔数" align="center" />
        <el-table-column prop="refundAmount" label="退款金额" align="center">
          <template slot-scope="{ row }">
            ￥{{ row.refundAmount | filtersMoneyByZero }}
          </template>
        </el-table-column>
        <el-table-column prop="revenue" label="实际营收" align="center">
          <template slot-scope="{ row }">
            ￥{{ row.revenue | filtersMoneyByZero }}
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
import { oneLiveRoomReportGoods } from '@/api/liveRoom/kanban.js'
import { filtersMoneyByZero } from '@/filters'
import moment from 'moment'
export default {
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
      originalData: [], // 数据源
      tableData: [], // 显示的列表数据
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dataCount: {
        sumClickCount: 0, // 点击次数汇总
        sumClickUserCount: 0, // 点击人数汇总
        sumRefundAmount: 0, // 退款金额汇总
        sumRefundOrderCount: 0, // 退款笔数汇总
        sumRevenue: 0, // 实际营收汇总
        sumTransactionsAmount: 0, // 成交金额汇总
        sumTransactionsOrderCount: 0, // 成交笔数汇总
        sumTransactionsUserCount: 0 // 成交人数汇总
      },
      timeData: ['', '']
    }
  },
  watch: {
    detail: {
      handler: function(val) {
        if (val && val.endTime) {
          this.timeData = [moment(val.startTime).format('YYYY-MM-DD HH:mm'), moment(val.endTime).add(48, 'hour').format('YYYY-MM-DD HH:mm')]
        } else if (val) {
          const startTime = moment(val.startTime).format('YYYY-MM-DD HH:mm')
          const nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm')
          console.log(startTime, nowTime, '11111')
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
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        liveRoomId: this.$route.params.id
      }
      oneLiveRoomReportGoods(data).then(res => {
        this.dataCount = {
          sumClickCount: res.data.sumClickCount, // 点击次数汇总
          sumClickUserCount: res.data.sumClickUserCount, // 点击人数汇总
          sumRefundAmount: res.data.sumRefundAmount, // 退款金额汇总
          sumRefundOrderCount: res.data.sumRefundOrderCount, // 退款笔数汇总
          sumRevenue: res.data.sumRevenue, // 实际营收汇总
          sumTransactionsAmount: res.data.sumTransactionsAmount, // 成交金额汇总
          sumTransactionsOrderCount: res.data.sumTransactionsOrderCount, // 成交笔数汇总
          sumTransactionsUserCount: res.data.sumTransactionsUserCount // 成交人数汇总
        }
        this.originalData = res.data.goodsList
        this.total = res.data.goodsList.length
        this.currentPage = 1
        this.renderTableData()
        this.loading = false
        console.log(res)
      }).catch(() => {
        this.loading = false
      })
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      const obj = {
        0: '总计',
        1: '',
        2: 'sumClickCount', // 点击次数汇总
        3: 'sumClickUserCount', // 点击人数汇总
        4: 'sumTransactionsUserCount', // 成交人数汇总
        5: 'sumTransactionsOrderCount', // 成交笔数汇总
        6: 'sumTransactionsAmount', // 成交金额汇总
        7: 'sumRefundOrderCount', // 退款笔数汇总
        8: 'sumRefundAmount', // 退款金额汇总
        9: 'sumRevenue' // 实际营收汇总
      }
      columns.forEach((column, index) => {
        if ([6, 8, 9].includes(index)) {
          sums[index] = '￥' + filtersMoneyByZero(this.dataCount[obj[index]])
          return
        }
        if (index > 1) {
          sums[index] = this.dataCount[obj[index]]
          return
        }
        sums[index] = obj[index]
        return
      })

      return sums
    },
    renderTableData() {
      this.tableData = this.originalData.slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize)
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
    align-items: center;
    justify-content: space-between;
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
  }
  .pagination {
    padding-right: 20px;
    margin-top: 10px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-shadow: 0px -1px 4px 0px rgba(0,0,0,0.05);
  }
}
.p-r-20 {
  padding-right: 20px;
}
.ImageViewer {
  display: flex;
  align-items: center;
  .imgUrl {
    background: #fafafa;
    width: 80px;
    height: 60px;
    max-width: 80px;
    min-width: 80px;
  }
}
</style>
