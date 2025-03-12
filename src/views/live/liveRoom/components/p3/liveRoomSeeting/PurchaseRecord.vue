<template>
  <!-- 购买记录 -->
  <div v-loading="loading" class="pageWrap">
    <div class="PurchaseRecord overflowOuto">
      <div v-for="(item, index) in list" :key="index" class="attList">
        <div class="attListTitle">
          <span>{{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </div>
        <div v-for="(info, i) in item.list" :key="i" class="goodsList">
          <div class="goodsname">{{ info.contentName }}</div>
          <div class="goodsListform">
            <div class="formLabel">支付状态：</div>
            <MyStatus v-if="info.orderStatus" :status="orderStatus[info.orderStatus].type">
              <span>{{ orderStatus[info.orderStatus].name }}</span>
            </MyStatus>
          </div>
          <div class="goodsListform">
            <div class="formLabel">支付金额：</div>
            <div v-if="[1,3,4].includes(info.orderStatus)" class="formValue">--</div>
            <div v-else class="formValue">￥{{ info.payerTotal | filtersMoneyByZero }}</div>
          </div>
        </div>
      </div>
      <div v-if="list.length === 0" class="noData">
        <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
        <div class="noDataText">暂无数据</div>
      </div>
    </div>
    <div v-if="list && list.length > 0" class="pagination">
      <div>共{{ total }}条</div>
      <pagination :total="total" :current="current" :size="size" @currentChange="currentChange" />
    </div>
  </div>
</template>

<script>
import pagination from './pagination.vue'
import MyStatus from './MyStatus.vue'
import { getOrderPage } from '@/api/business'
import { mapState } from 'vuex'
export default {
  components: {
    MyStatus,
    pagination
  },
  data() {
    return {
      list: [],
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
      total: 10,
      current: 1,
      size: 10
    }
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser
    })
  },
  watch: {
    'chatUser': {
      handler(val) {
        this.current = 1
        this.getList()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.current = 1
    this.getList()
    // this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.list = []
      const params = {
        current: this.current,
        size: this.size,
        userId: this.chatUser.userId,
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
        this.list = res.data.records
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    currentChange(val) {
      this.current = val
      this.getList()
    }
  }
}
</script>

<style lang='scss' scoped>
.pageWrap {
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  .PurchaseRecord {
      flex: 1 0 0;
    overflow: auto;
      .attList {
          width: 320px;
          margin: auto;
          margin-top: 20px;
          background: #FFFFFF;
          border-radius: 4px;
          border: 1px solid #D8DCE6;
          .attListTitle {
              background: #E7F0FF;
              font-size: 16px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              line-height: 22px;
              padding: 7px 20px;
          }
          .goodsList {
              padding: 10px 0;
              margin: 0 20px;
              .goodsname {
                  font-size: 16px;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: bold;
                  color: #333333;
                  line-height: 22px;
                  margin-bottom: 10px;
              }
              .goodsListform {
                  margin-bottom: 10px;
                  display: flex;
                  flex-wrap: wrap;
                  .formLabel {
                      font-size: 16px;
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 400;
                      color: #777777;
                      line-height: 22px;
                  }
                  .formValue {
                      font-size: 16px;
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 400;
                      color: #333333;
                      line-height: 22px;
                  }
              }
          }
          .goodsList + .goodsList {
              border-top: 1px solid #F5F5F5;
          }
      }
  }
  .pagination {
    width: 368px;
    height: 62px;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 18px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 22px;
    user-select:none;
  }
  .noData {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
    > img {
      width: 250px;
    }
    .noDataText {
      margin-top: 16px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 22px;
    }
  }
}
</style>
