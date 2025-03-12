<template>
  <!-- 订单 -->
  <div class="groupChat">
    <div v-loading="loading" class="PurchaseRecord">
      <div v-for="(item, index) in tableData" :key="index" class="attList">
        <div class="attListTitle">
          订单号:
          <AppIconClipboard :src="item.orderNo">
            <span class="a_link" @click="gotoDetail(item)">{{
              item.orderNo
            }}</span>
          </AppIconClipboard>
          <!-- <span>{{ item.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> -->
        </div>
        <div v-for="(info, i) in item.list" :key="i" class="goodsList">
          <div class="goodsname">{{ info.contentName }}</div>
          <div class="goodsListform">
            <div class="formLabel">支付状态：</div>
            <MyStatus
              v-if="info.orderStatus"
              :status="orderStatus[info.orderStatus].type"
            >
              <span>{{ orderStatus[info.orderStatus].name }}</span>
            </MyStatus>
          </div>
          <div class="goodsListform">
            <div class="formLabel">支付金额：</div>
            <div v-if="[1, 3, 4].includes(info.orderStatus)" class="formValue">
              --
            </div>
            <div v-else class="formValue">
              ￥{{ info.payerTotal | filtersMoneyByZero }}
            </div>
          </div>
          <div class="goodsListform">
            <div class="formLabel">首次跟进人：</div>
            <div class="formValue">{{ info.followerNickName || '--' }}</div>
          </div>
          <div class="goodsListform">
            <div class="formLabel">渠道：</div>
            <div class="formValue">
              {{ item.channelSource | getOptionsValue(channelSourceType)
              }}{{ getThirdShopName(item, info) }}
            </div>
          </div>
          <div class="goodsListform">
            <div class="formLabel">下单时间：</div>
            <div class="formValue">{{ item.createTime }}</div>
          </div>
          <div v-if="info.isDisplayAddress" class="goodsListform formValueList">
            <div class="formLabel">收货信息：</div>
            <div v-if="info.receiverAddress" class="formValue warpAddress">
              <div>
                <div v-if="info.receiverName">
                  收货人姓名：{{ info.receiverName }}
                </div>
                <div v-if="info.receiverPhone" class="formValuePhone">
                  收货人电话：
                  <tablePhoneItem
                    v-model="info.receiverPhone"
                    :row-data="{ orderNo: item.orderNo }"
                    type="orderNo"
                  />
                </div>
              </div>
              <div v-if="info.receiverAddress">
                收货地址：{{ info.receiverAddress }}
              </div>
              <div>填写时间：{{ info.receiverCreateTime }}</div>
            </div>
            <div v-else class="formValue">
              <span>未上传</span>
              <el-button
                v-if="info.orderStatus == 2"
                icon="el-icon-map-location"
                type="primary"
                style="margin-left: 10px"
                size="mini"
                @click="handleSite(item.orderNo,item)"
              >填写地址</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="tableData.length === 0" class="noData">
        <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
        <div class="noDataText">暂无数据</div>
      </div>
      <el-pagination
        class="pagination m-t-20"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :pager-count="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <siteDrawer
      v-if="visible"
      :visible.sync="visible"
      :order-no="orderNo"
      :third-shop-id="thirdShopId"
      @handleOk="handleOk"
    />
  </div>
</template>

<script>
import { getOrderFeignPage } from '@/api/business'
import MyStatus from './MyStatus.vue'
import AppIconClipboard from '@/components/AppIconClipboard'
import { mapState, mapGetters } from 'vuex'
import { getOptionsValue } from '@/filters'
import { userTerminal } from '@/utils/enum'
import siteDrawer from './siteDrawer'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
export default {
  components: {
    MyStatus,
    AppIconClipboard,
    tablePhoneItem,
    siteDrawer
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      orderNo: '',
      thirdShopId: '',
      visible: false,
      tableData: [],
      currentPage: 1,
      total: 0,
      loading: false,
      pageSize: 10,
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
      }
    }
  },
  computed: {
    ...mapState({
      chatUser: state => state.im.chatUser
    }),
    ...mapGetters(['goodsType_obj', 'channelSourceType'])
  },
  mounted() {
    this.$store.dispatch('option/getChannelsourceType')
    this.currentPage = 1
    this.getList()
  },
  methods: {
    handleOk() {
      this.getList()
    },
    handleSite(orderNo, item) {
      this.orderNo = orderNo
      this.thirdShopId = item.list[0].thirdShopId
      this.visible = true
    },
    getThirdShopName(item, list) {
      if (item.channelSource === 3 && item.userTerminal) {
        const userTerminalName = getOptionsValue(
          item.userTerminal,
          userTerminal
        )
        return `| ${userTerminalName}`
      }
      if (
        item.channelSource &&
        item.channelSource !== 3 &&
        list.thirdShopName
      ) {
        return `| ${list.thirdShopName}`
      }
      return ''
    },
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
      console.log(this.data)
      if (!this.data[0]) {
        return
      }
      this.loading = true
      // this.tableData = []
      const params = {
        current: this.currentPage,
        size: this.size,
        userId: this.data[0].userId,
        // userId: '1676a22303304a12812fe81cc1a46476',
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
      getOrderFeignPage(params)
        .then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.groupChat {
  border-radius: 6px;
  width: 100%;
  .PurchaseRecord {
    flex: 1 0 0;
    overflow: auto;
    .attList {
      width: 100%;
      margin: auto;
      margin-top: 16px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #d8dce6;
      .attListTitle {
        background: #e7f0ff;
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
          align-items: center;
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
            max-width: 640px;
            word-break: break-all;
            .formValuePhone {
              display: flex;
              align-items: center;
            }
            > span {
              color: #f53f3f;
              font-size: 14px;
            }
          }
        }
        .formValueList {
          align-items: flex-start;
        }
      }
      .goodsList + .goodsList {
        border-top: 1px solid #f5f5f5;
      }
    }
  }
}
.pagination {
  text-align: right;
}
.syncbtn {
  margin-bottom: 4px;
}
.warpAddress {
  width: 100%;
  background: #f5f5f5;
  padding: 10px;
  color: #999999 !important;
  border-radius: 4px;
  font-size: 14px !important;
  margin-top: -7px !important;
  > div:nth-last-of-type(1) {
    margin-bottom: 0;
  }
  > div:nth-of-type(1) {
    display: flex;
    line-height: 1;
    padding-top: 5px;
    > div:nth-of-type(2) {
      margin-left: 20px;
      border-left: 1px solid #999999;
      padding-left: 20px;
    }
  }
  > div {
    margin-bottom: 5px;
  }
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
</style>
