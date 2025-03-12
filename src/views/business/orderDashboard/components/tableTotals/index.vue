<template>
  <div class="table-wrap">

    <div v-if="tableData.length" class="table-box">
      <div class="tab-header">
        <div v-for="item in tabList" :key="item.id" class="tab-header-item" :class="item.id === 0 ? 'tab-header-first-child':''">{{ item.title }}</div>
      </div>
      <div class="tab-content">
        <div v-for="item in tableData" :key="item.id" class="tab-content-child">
          <div class="tab-content-item tab-content-first-child">{{ item.channel }}</div>
          <div class="tab-content-item">{{ item.shop }}</div>
          <div class="tab-content-item">{{ item.thirdParty }}</div>
          <div class="tab-content-item">{{ item.shouldPush }}</div>
          <div class="tab-content-item">{{ item.noPay }}</div>
          <div class="tab-content-item">{{ item.paid }}</div>
          <div class="tab-content-item">{{ item.refunded }}</div>
          <div class="tab-content-item">{{ item.partialRefundOrderNum }}</div>
          <div class="tab-content-item">{{ item.amountPaid_unit }}</div>
          <div class="tab-content-item">{{ item.refundedAmount_unit }}</div>
          <div class="tab-content-item">{{ item.revenue_unit }}</div>
          <div class="tab-content-item">{{ item.totalAmount_unit }}</div>
        </div>
      </div>
      <div class="tab-foot">
        <div class="tab-foot-child">
          <div class="tab-foot-item tab-foot-first-child">合</div>
          <div class="tab-foot-item">计</div>
          <div class="tab-foot-item">{{ tableFoot.thirdParty }}</div>
          <div class="tab-foot-item">{{ tableFoot.shouldPush }}</div>
          <div class="tab-foot-item">{{ tableFoot.noPay }}</div>
          <div class="tab-foot-item">{{ tableFoot.paid }}</div>
          <div class="tab-foot-item">{{ tableFoot.refunded }}</div>
          <div class="tab-foot-item">{{ tableFoot.partialRefundOrderNum }}</div>
          <div class="tab-foot-item">{{ tableFoot.amountPaid }}</div>
          <div class="tab-foot-item">{{ tableFoot.refundedAmount }}</div>
          <div class="tab-foot-item">{{ tableFoot.revenue }}</div>
          <div class="tab-foot-item">{{ tableFoot.totalAmount }}</div></div>
      </div>
    </div>
    <!-- <el-table
      v-if="tableData.length"
      id="table"
      ref="table"
      :data="tableData"
      border
      show-summary
      style="width: 100%"
      empty-text="暂无数据"
    >
      <el-table-column
        prop="channel"
        label="渠道"
        width="180"
      />
      <el-table-column
        prop="shop"
        label="店铺"
      />
      <el-table-column
        prop="thirdParty"
        label="第三方订单总数"
      />
      <el-table-column
        prop="shouldPush"
        label="应推送订单数"
      />
      <el-table-column
        prop="noPay"
        label="未付款订单数"
      />
      <el-table-column
        prop="paid"
        label="已付款订单数"
      />
      <el-table-column
        prop="refunded"
        label="已退款订单数"
      />
      <el-table-column
        prop="partialRefundOrderNum"
        label="部分退款订单数"
      />
      <el-table-column
        prop="amountPaid"
        label="已付款金额"
      />
      <el-table-column
        prop="refundedAmount"
        label="已退款金额"
      />
      <el-table-column
        prop="revenue"
        label="收入"
      />
      <el-table-column
        prop="totalAmount"
        label="订单总金额"
      />
    </el-table> -->

    <el-table
      v-if="syncTableData.length"
      id="syncTable"
      ref="syncTable"
      :data="syncTableData"
      border
      show-summary
      style="width: 100%"
      empty-text="暂无数据"
    >
      <el-table-column label="渠道信息">
        <el-table-column
          prop="channelSource"
          label="渠道"
          width="146"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.channelSource | getOptionsValue(channelSourceType) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="shopName"
          label="店铺"
          width="146"
        />
      </el-table-column>
      <el-table-column label="总订单">
        <el-table-column
          width="150px"
          prop="syncTotalOrder_thirdOrderNum"
          label="第三方订单总数"
        />
        <el-table-column
          width="150px"
          prop="syncTotalOrder_pushOrderNum"
          label="应推送订单数"
        />
        <el-table-column
          width="150px"
          prop="syncTotalOrder_syncHokOrderNum"
          label="同步获客"
        />
        <el-table-column
          width="150px"
          prop="syncTotalOrder_syncBosumOrderNum"
          label="同步博商"
        />
      </el-table-column>
      <el-table-column label="未付款订单">
        <el-table-column
          width="150px"
          prop="syncUnPayOrder_unPayOrderNum"
          label="未付款订单数"
        />
        <el-table-column
          width="150px"
          prop="syncUnPayOrder_syncHokOrderNum"
          label="同步获客订单数"
        />
        <el-table-column
          width="150px"
          prop="syncUnPayOrder_syncBosumOrderNum"
          label="同步博商订单数"
        />
      </el-table-column>
      <el-table-column label="已付款订单">
        <el-table-column
          width="150px"
          prop="syncPayOrder_payOrderNum"
          label="已付款订单数"
        />
        <el-table-column
          width="150px"
          prop="syncPayOrder_syncHokOrderNum"
          label="同步获客订单数"
        />
        <el-table-column
          width="150px"
          prop="syncPayOrder_syncBosumOrderNum"
          label="同步博商订单数"
        />
      </el-table-column>
      <el-table-column label="已退款订单">
        <el-table-column
          width="150px"
          prop="syncRefundOrder_refundOrderNum"
          label="已退款订单数"
        />
        <el-table-column
          width="150px"
          fixed="right"
          prop="syncRefundOrder_syncHokOrderNum"
          label="同步获客订单数"
        />
        <el-table-column
          width="150px"
          fixed="right"
          prop="syncRefundOrder_syncBosumOrderNum"
          label="同步博商订单数"
        />
      </el-table-column>
      <el-table-column label="部分退款订单" width="450px" fixed="right">
        <el-table-column
          width="150px"
          prop="syncPartialRefundOrder_partialRefundOrderNum"
          label="部分退款订单数"
        />
        <el-table-column
          width="150px"
          prop="syncPartialRefundOrder_syncHokOrderNum"
          label="同步获客订单数"
        />
        <el-table-column
          width="150px"
          prop="syncPartialRefundOrder_syncBosumOrderNum"
          label="同步博商订单数"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TableTotals',
  components: {
  },
  // eslint-disable-next-line vue/require-prop-types
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    syncTableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tabList: [
        {
          id: 0,
          title: '渠道',
          content: []
        },
        {
          id: 1,
          title: '店铺',
          content: []
        },
        {
          id: 2,
          title: '第三方订单总数',
          content: []
        },
        {
          id: 3,
          title: '应推送订单数',
          content: []
        },
        {
          id: 4,
          title: '未付款订单数',
          content: []
        },
        {
          id: 5,
          title: '已付款订单数',
          content: []
        },
        {
          id: 6,
          title: '已退款订单数',
          content: []
        },
        {
          id: 7,
          title: '部分退款订单数',
          content: []
        },
        {
          id: 8,
          title: '已付款金额',
          content: []
        },
        {
          id: 9,
          title: '已退款金额',
          content: []
        },
        {
          id: 10,
          title: '收入',
          content: []
        },
        {
          id: 11,
          title: '订单总金额',
          content: []
        }
      ],
      tableFoot: {
        thirdParty: '0', shouldPush: '0', noPay: '0', paid: '0', refunded: '0', partialRefundOrderNum: '0', amountPaid: '0.00', refundedAmount: '0.00', revenue: '0.00', totalAmount: '0.00'
      }
    }
  },
  computed: {
    ...mapGetters([
      'channelSourceType'
    ])
  },
  watch: {
    // 监听table这个对象
    tableData: {
      // 立即监听
      immediate: true,
      handler(val) {
        let thirdParty = 0
        let shouldPush = 0
        let noPay = 0
        let paid = 0
        let refunded = 0
        let partialRefundOrderNum = 0
        let amountPaid = 0
        let refundedAmount = 0
        let revenue = 0
        let totalAmount = 0
        val.map((v, i) => {
          thirdParty = Number(v.thirdParty) + thirdParty
          shouldPush = Number(v.shouldPush) + shouldPush
          noPay = Number(v.noPay) + noPay
          paid = Number(v.paid) + paid
          refunded = Number(v.refunded) + refunded
          partialRefundOrderNum = Number(v.partialRefundOrderNum) + partialRefundOrderNum
          amountPaid = Number(v.amountPaid) + amountPaid
          refundedAmount = Number(v.refundedAmount) + refundedAmount
          revenue = Number(v.revenue) + revenue
          totalAmount = Number(v.totalAmount) + totalAmount
          v.amountPaid_unit = v.amountPaid > 0 ? this.numberNuit(Number(v.amountPaid)) : '0.00'
          v.refundedAmount_unit = v.refundedAmount > 0 ? this.numberNuit(Number(v.refundedAmount)) : '0.00'
          v.revenue_unit = v.revenue > 0 ? this.numberNuit(Number(v.revenue)) : '0.00'
          v.totalAmount_unit = v.totalAmount > 0 ? this.numberNuit(Number(v.totalAmount)) : '0.00'
        })
        thirdParty > 0 ? this.tableFoot.thirdParty = thirdParty : ''
        shouldPush > 0 ? this.tableFoot.shouldPush = shouldPush : ''
        noPay > 0 ? this.tableFoot.noPay = noPay : ''
        paid > 0 ? this.tableFoot.paid = paid : ''
        refunded > 0 ? this.tableFoot.refunded = refunded : ''
        partialRefundOrderNum > 0 ? this.tableFoot.partialRefundOrderNum = partialRefundOrderNum : ''
        amountPaid > 0 ? this.tableFoot.amountPaid = this.numberNuit(Number((amountPaid).toFixed(2))) : ''
        refundedAmount > 0 ? this.tableFoot.refundedAmount = this.numberNuit(Number((refundedAmount).toFixed(2))) : ''
        revenue > 0 ? this.tableFoot.revenue = this.numberNuit(Number((revenue).toFixed(2))) : ''
        totalAmount > 0 ? this.tableFoot.totalAmount = this.numberNuit(Number((totalAmount).toFixed(2))) : ''

        // this.$nextTick(() => {
        //   const tds = document.querySelectorAll(
        //     '#table .el-table__footer-wrapper tr>td'
        //   )
        //   // colSpan合并列
        //   tds[0].colSpan = 2
        //   tds[0].style.textAlign = 'center'
        //   tds[1].style.display = 'none'
        // })
      }
    },
    syncTableData: {
      // 立即监听
      immediate: true,
      handler(val) {
        if (val.length) {
          this.$nextTick(() => {
            const tds = document.querySelectorAll(
              '#syncTable .el-table__footer-wrapper tr>td'
            )
            // colSpan合并列
            tds[0].colSpan = 2
            tds[0].style.textAlign = 'center'
            tds[1].style.display = 'none'
          })
        }
      }
    }
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
    // console.log('tableData', this.tableData)
  },
  mounted() {
  },
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          index > 7 ? this.numberFormat(sums[index]) : sums[index]
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    isInteger(num) {
      return num % 1 === 0
    },
    numberFormat(value) {
      const param = {}
      let result = ''
      const k = 10000
      const sizes = ['', '万', '亿', '万亿']
      let i
      let numArray = []
      this.isInteger(value) ? '' : numArray = String(value).split('.')
      if (value < k) {
        param.value = value
        param.unit = ''
        param.decimal = ''
      } else {
        i = Math.log(value) / Math.log(k)
        param.value = ((value / Math.pow(k, i))).toFixed(0)
        param.unit = sizes[i]
        numArray.length ? param.decimal = numArray[1] : param.decimal = ''
      }
      result = param.value + param.unit
      param.decimal ? result = result + '.' + param.decimal : ''

      return result
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 0) {
          return [1, 2]
        } else if (columnIndex === 1) {
          return [0, 0]
        }
      }
    },
    numberNuit(num) {
      let result = ''
      if (num > 10000) {
        const _num = String(num)
        const _num_length = String(num).length
        if (num % 1 === 0) { // 取整
          if (_num_length === 5) {
            result = _num + '万'
          } else if (_num_length === 6) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 1) {
                result_txt = (result_txt + v) + '万'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 7) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 2) {
                result_txt = (result_txt + v) + '万'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 8) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 3) {
                result_txt = (result_txt + v) + '万'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 9) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v + '亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 10) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 1) {
                result_txt = (result_txt + v) + '亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 11) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 2) {
                result_txt = (result_txt + v) + '亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 12) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 3) {
                result_txt = (result_txt + v) + '亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 13) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v + '万亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 14) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 1) {
                result_txt = (result_txt + v) + '万亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 15) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 2) {
                result_txt = (result_txt + v) + '万亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 16) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 3) {
                result_txt = (result_txt + v) + '万亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 17) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v + '千亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 18) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 1) {
                result_txt = (result_txt + v) + '万亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 19) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 2) {
                result_txt = (result_txt + v) + '万亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 20) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 3) {
                result_txt = (result_txt + v) + '万亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 21) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 4) {
                result_txt = (result_txt + v) + '万亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else {
            result = num
            console.log('额度过大，不做处理')
          }
          result = result + '.00'
        } else {
          const _numArray = String(num).split('.')
          const _num = String(_numArray[0])
          const _num_length = String(_num).length
          if (_num_length === 5) {
            result = _num + '万'
          } else if (_num_length === 6) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 1) {
                result_txt = (result_txt + v) + '万'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 7) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 2) {
                result_txt = (result_txt + v) + '万'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 8) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 3) {
                result_txt = (result_txt + v) + '万'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 9) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v + '亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 10) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 1) {
                result_txt = (result_txt + v) + '亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 11) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 2) {
                result_txt = (result_txt + v) + '亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 12) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 3) {
                result_txt = (result_txt + v) + '亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 13) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v + '万亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 14) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 1) {
                result_txt = (result_txt + v) + '万亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 15) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 2) {
                result_txt = (result_txt + v) + '万亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 16) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 3) {
                result_txt = (result_txt + v) + '万亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 17) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v + '千亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 18) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 1) {
                result_txt = (result_txt + v) + '万亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 19) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 2) {
                result_txt = (result_txt + v) + '万亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 20) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 3) {
                result_txt = (result_txt + v) + '万亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else if (_num_length === 21) {
            let result_txt = ''
            const arr = _num.split('')
            arr.map((v, i) => {
              if (i === 0) {
                result_txt = v
              } else if (i === 4) {
                result_txt = (result_txt + v) + '万亿'
              } else {
                result_txt = result_txt + v
              }
            })
            result = result_txt
          } else {
            result = num
            console.log('额度过大，不做处理')
          }
          if (_numArray[1].length === 1) {
            _numArray[1] = _numArray[1] + '0'
          }
          result = result + '.' + _numArray[1]
        }
      } else {
        result = num
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.table-wrap {
  .table-box {
    .tab-header {
      display: flex;
      .tab-header-item {
        width: 8.88%;
        font-size: 14px;
        font-weight: bold;
        color: #777777;
        padding: 12.5px 10px;
        border: 1px solid rgb(223, 230, 236);
        border-left: none;
        background-color: #F5F7FA;
        display: flex;
          align-items: center;
        &:nth-last-child(1) {
          border-right: 1px solid rgb(223, 230, 236);
        }
      }
      .tab-header-first-child {
        border-left: 1px solid rgb(223, 230, 236);
      }
    }
    .tab-content {
      .tab-content-child {
        display: flex;
        &:hover {
          background-color: #F5F7FA;
          transition: background-color 0.25s #F5F7FA;
        }
        .tab-content-item {
          width: 8.88%;
          font-size: 14px;
          color: #777777;
          padding: 12.5px 10px;
          border: 1px solid rgb(223, 230, 236);
          border-left: none;
          border-top: none;
          display: flex;
          align-items: center;
          &:nth-last-child(1) {
            border-right: 1px solid rgb(223, 230, 236);
          }
        }
        .tab-content-first-child {
          border-left: 1px solid rgb(223, 230, 236);
        }
      }
    }
    .tab-foot {
      .tab-foot-child {
        display: flex;
        .tab-foot-item {
          display: flex;
          width: 8.88%;
          font-size: 14px;
          background-color: #F5F7FA;
          color: #606266;
          padding: 12.5px 10px;
          border: 1px solid rgb(223, 230, 236);
          border-left: none;
          // border-right: none;
          border-top: none;
          &:nth-last-child(1) {
            border-right: 1px solid rgb(223, 230, 236);
          }
        }
        .tab-foot-first-child {
          display: flex;
          justify-content: flex-end;
          border-right: none;
          border-left: 1px solid rgb(223, 230, 236);
        }
      }
    }
  }
}
::v-deep ::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
}
::v-deep ::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
}
::v-deep :hover ::-webkit-scrollbar-track-piece {
  cursor: pointer;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

::v-deep :hover::-webkit-scrollbar-thumb:hover {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.1);
  transition: color 0.2s ease;
}

::v-deep :hover::-webkit-scrollbar-thumb:vertical {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.1);
  transition: color 0.2s ease;
}
</style>

