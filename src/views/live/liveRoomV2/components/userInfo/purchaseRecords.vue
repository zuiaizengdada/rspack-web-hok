<template>
  <div class="purchaseRecords">
    <div class="purchaseRecordsTitle"><MTitle>历史购买记录</MTitle></div>
    <div class="myTable">
      <div class="myTableHeader t_th">
        <div>商品订单</div><div>支付状态</div><div>支付金额</div><div />
      </div>
      <div class="myTableBody">
        <div v-for="(item) in tableData" :key="item.orderNo" class="t_body_td">
          <div class="t_body_td_th t_tb" :style="{'border-radius': item.show ? '5px 5px 0px 0px' : '5px'}">
            <div>订单编号: {{ item.orderNo }}</div>
            <div>{{ orderStatus[item.orderStatus].name }}</div>
            <div>
              <div v-if="[1,3,4].includes(item.orderStatus)" class="formValue">--</div>
              <div v-else class="formValue">￥{{ item.payerTotal | filtersMoneyByZero }}</div>
            </div>
            <div @click="item.show = !item.show">{{ item.show ? '收起' : '展开' }}<i :class="item.show ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" /></div>
          </div>
          <div v-if="item.show" class="t_collapse">
            <div v-for="(e) in item.list" :key="e.id" class="t_tr">
              <div class="goodsView">
                <ImagePreviewer :src="e.coverUrl" fit="contain" style="width: 28px; height: 28px; min-width: 28px; min-height: 28px;border-radius: 6px" />
                <span class="m-l-10">{{ e.goodsName }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="tableData.length === 0" class="no_data">
          暂无数据
        </div>
      </div>
    </div>

    <el-pagination
      class="purchaseRecordspage"
      :current-page="currentPage"
      :pager-count="5"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total,prev,pager,next,jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getOrderPage } from '@/api/business'
export default {
  components: {},
  props: {
    userId: {
      type: String,
      default: ''
    },
    liveRoomId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      orderStatus: {
        1: {
          type: 'error',
          name: '未支付'
        },
        2: {
          type: 'success',
          name: '支付成功'
        },
        3: {
          type: 'error',
          name: '超时已关闭'
        },
        4: {
          type: 'error',
          name: '用户已取消'
        },
        5: {
          type: 'warning',
          name: '退款中'
        },
        6: {
          type: 'warning',
          name: '部分退款'
        },
        7: {
          type: 'success',
          name: '全部退款'
        },
        8: {
          type: 'success',
          name: '交易结束'
        },
        9: {
          type: 'warning',
          name: '没有向第三方发起支付请求'
        },
        10: {
          type: 'error',
          name: '退款金额异常'
        },
        11: {
          type: 'success',
          name: '部分付款'
        },
        12: {
          type: 'error',
          name: '转课关闭'
        }
      },
      loading: false,
      currentPage: 1,
      total: 0,
      pageSize: 10
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      this.list = []
      const params = {
        current: this.currentPage,
        size: this.pageSize,
        userId: this.userId,
        timeType: 1,
        orderStatus: '',
        paymentType: '',
        userTerminal: '',
        channelSource: '',
        thirdShopId: '',
        folowerId: '',
        payPromotion: '',
        examineStatus: '',
        orderConfigId: '',
        type: 1
      }
      getOrderPage(params).then(res => {
        console.log(res, 'res')
        res.data.records.map(v => {
          v.show = true
        })
        this.tableData = res.data.records
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    init() {
      this.loading = true
      this.tableData = []
      this.currentPage = 1
      this.getList()
    }
  }
}
</script>

<style lang='scss' scoped>
.purchaseRecords {
  padding-right: 15px;

  .myTable {
    margin-top: 15px;
    border-radius: 5px;
    border: 1px solid #F2F2F2;
    background: #fff;
    color: #000000;
    font-family: "Microsoft YaHei";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    .myTableHeader {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      height: 38px;
      font-weight: bolder;
      background: #F7F7F7;
      border-bottom: 1px solid #F2F2F2;
    }
    .myTableBody {
      max-height: 400px;
      overflow: auto;
      padding: 7px 9px;
      .t_body_td {
        width: 100%;
        .t_body_td_th {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 5px 5px;
          border: 1px solid #F2F2F2;
          background: #F7F7F7;
          text-align: center;
        }
        .t_collapse {
          // display: flex;
          // align-items: center;
          border-radius: 0 0 5px 5px;
          border-bottom: 1px solid #F2F2F2;
          border-left: 1px solid #F2F2F2;
          border-right: 1px solid #F2F2F2;
          .t_tr {
            padding: 8px 11px;
            .goodsView {
              color: #333;
              display: flex;
              align-items: center;
              justify-content: left;
            }
          }
          .t_tr + .t_tr {
            border-top: 1px solid #F2F2F2;
          }
        }
      }
      .t_body_td + .t_body_td {
        margin-top: 5px;
      }
    }

    .t_th {
      >:nth-child(1) {
        width: 300px;
      }
      >:nth-child(2) {
        width: 150px;
      }
      >:nth-child(3) {
        width: 150px;
      }
      >:nth-child(4) {
        flex: 1 0 0;
      }
    }
    .t_tb {
      color: #000;
      >:nth-child(1) {
        width: 289px;
        padding-left: 9px;
        text-align: left;
        word-wrap: break-word;
        padding: 13px 9px;
      }
      >:nth-child(2) {
        width: 150px;
        padding: 13px 9px;
      }
      >:nth-child(3) {
        width: 150px;
        padding: 13px 9px;
      }
      >:nth-child(4) {
        padding: 13px 9px;
        flex: 1 0 0;
        text-align: center;
        color: #0c6fff;
        cursor: pointer;
      }
    }

    .myTableBody {
      // line-height: 46px;
      color: #909399;
      text-align: center;
      font-size: 14px;
    }
  }
}
.purchaseRecordspage {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 15px;
}
</style>
