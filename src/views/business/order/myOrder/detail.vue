<template>
  <div class="page_wrap">
    <div class="header">
      <span
        class="pointer"
        @click="$router.push({ path: '/business/myOrder/list' })"
        >我的订单</span
      >
      > 订单详情
    </div>

    <div class="order-detail">
      <div>
        <div class="deliver-info">
          <div>
            <i
              v-if="detail.orderStatus === 2"
              class="el-icon-success"
              style="color: #21c11f; font-size: 18px"
              :style="{ color: orderStatus[detail.orderStatus || 0].color }"
            />
            <span
              class="m-l-10 deliverTips"
              :style="{ color: orderStatus[detail.orderStatus || 0].color }"
            >
              {{ orderStatus[detail.orderStatus || 0].name }}
            </span>
          </div>
        </div>
      </div>

      <div class="module-item">
        <div class="module-title">
          <div class="module-title-text">订单信息</div>
        </div>
        <div class="module-content">
          <div class="single-line">
            <div class="info-item">
              订单号: <span>{{ detail.orderNo || '--' }}</span>
            </div>
            <div class="info-item">
              支付方式:
              <span>{{
                detail.paymentType | getOptionsValue(paymentType_options)
              }}</span>
            </div>
            <div class="info-item">
              下单时间: <span>{{ detail.createTime || '--' }}</span>
            </div>
          </div>
          <hr />
          <div class="single-line">
            <div class="info-item">
              优惠信息:
              <span>{{ (detail.discountsFee || 0) | filtersMoney }}元</span>
            </div>
            <div class="info-item">
              渠道来源:
              <span
                >{{ detail.channelSource | getOptionsValue(channelSourceType)
                }}{{ thirdShopName }}</span
              >
            </div>
            <div class="info-item">
              支付时间: <span>{{ detail.updateTime || '--' }}</span>
            </div>
          </div>
          <div class="single-line">
            <div class="info-item">结算时间: <span>--</span></div>
          </div>
        </div>
      </div>

      <div class="module-item">
        <div class="module-title">
          <div class="module-title-text">支付信息</div>
        </div>
        <div class="module-content">
          <div class="single-line">
            <div class="info-item">
              交易单号: <span>{{ detail.transactionId || '--' }}</span>
            </div>
            <div class="info-item">
              商户单号: <span>{{ detail.paymentNo || '--' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="module-item">
        <div class="module-title">
          <div class="module-title-text">买家信息</div>
        </div>
        <div class="module-content">
          <div class="single-line">
            <div class="info-item">
              用户ID:
              <span class="a_link" @click="gotoUserDetails(detail.userId)">{{
                detail.userId || '--'
              }}</span>
            </div>
            <div class="info-item">
              买家昵称: <span>{{ detail.userName || '--' }}</span>
            </div>
            <div class="info-item">
              买家手机号: <span>{{ detail.userPhone || '--' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="module-item">
        <div class="module-title">
          <div class="module-title-text">发票信息</div>
        </div>
        <div class="module-content">
          <div class="single-line">
            <div class="info-item">发票抬头: <span>--</span></div>
            <div class="info-item">企业税号: <span>--</span></div>
            <div class="info-item">注册地址: <span>--</span></div>
          </div>
          <div class="single-line">
            <div class="info-item">注册电话: <span>--</span></div>
            <div class="info-item">开户银行: <span>--</span></div>
            <div class="info-item">银行账户: <span>--</span></div>
          </div>
          <div class="single-line">
            <div class="info-item">收票邮箱: <span>--</span></div>
            <div class="info-item">收票手机号: <span>--</span></div>
          </div>
        </div>
      </div> -->
      <div class="module-item">
        <div class="module-title">
          <div class="module-title-text">商品信息</div>
        </div>
        <el-table
          :data="detail.list"
          style="width: 100%"
          border
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column label="商品名称" prop="goodsName" />
          <el-table-column label="商品类型" prop="goodsType">
            <template slot-scope="{ row }">
              {{ goodsType_obj[row.goodsType] }}
            </template>
          </el-table-column>
          <el-table-column label="商品单价（元）" prop="goodsPrices">
            <template slot-scope="{ row }">
              {{ (row.goodsPrices || 0) | filtersMoney }}
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="goodsNum" />
          <el-table-column label="小计（元）" prop="payerTotal">
            <template slot-scope="{ row }">
              {{ (row.payerTotal || 0) | filtersMoney }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <span class="a_link" @click="applyAfterSalesCard(row)"
                >开通售后卡</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="clear-fix page_footer">
        <div class="price-summary clear-fix">
          <div class="summary-item clear-fix">
            <span class="title">优惠金额:</span>
            <span class="content"
              >￥ {{ (detail.discountsFee || 0) | filtersMoney }}</span
            >
          </div>
          <div class="summary-item total clear-fix">
            <span class="title"
              >订单合计{{ detail.list.length }}件商品，实收:</span
            >
            <span class="content"
              >￥ {{ detail.payerTotal | filtersMoney }}</span
            >
          </div>
        </div>
      </div>

      <div class="module-item">
        <div class="module-title">
          <div class="module-title-text">退款记录</div>
        </div>
        <el-table
          :data="afterSaleList"
          style="width: 100%"
          border
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column label="商品名称" prop="goodsName">
            <template slot-scope="{ row }">
              <div class="goods-img-info">
                <div class="goods-img">
                  <el-image
                    :src="row.coverUrl"
                    fit="contain"
                    style="width: 100%; height: 100%"
                  />
                </div>
                <div class="goods-info">
                  <div class="EC3" :title="row.goodsName">
                    {{ row.goodsName }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="退款金额（元）" prop="refundFee">
            <template slot-scope="{ row }">
              {{ (row.refundFee || 0) | filtersMoney }}
            </template>
          </el-table-column>
          <el-table-column label="退款状态" prop="status">
            <template slot-scope="{ row }">
              {{ { 1: '未处理', 2: '已退款', 3: '已关闭' }[row.status] }}
            </template>
          </el-table-column>
          <el-table-column label="退款类型" prop="afterSaleMode">
            <template slot-scope="{ row }">
              {{ { 1: '仅退款' }[row.afterSaleMode] }}
            </template>
          </el-table-column>
          <el-table-column label="申请时间" prop="createTime" />
          <el-table-column label="退款时间" prop="refundTime" />
          <el-table-column label="操作人" prop="operationName">
            <template slot-scope="{ row }">
              <span>{{ row.operationName }}</span>
              <el-button
                class="m-l-20"
                type="text"
                @click="gotoDetailDetail(row)"
                >售后详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="module-item">
        <div class="module-title">
          <div class="module-title-text">跟进记录</div>
        </div>
        <div>
          <el-button
            v-permission="['system:order:follower', permsList]"
            type="primary"
            :loading="modal.loading"
            @click="openAddModal"
            >新增</el-button
          >
        </div>

        <el-table v-loading="loading" :data="tableData" border class="m-t-20">
          <el-table-column prop="createTime" label="跟进时间" />
          <el-table-column prop="content" label="跟进内容" />
          <el-table-column prop="createName" label="跟进人" />
          <el-table-column prop="followType" label="跟进方式">
            <template slot-scope="{ row }">
              {{ { 1: '电话', 2: '微信', 3: '站内' }[row.followType] }}
            </template>
          </el-table-column>
          <el-table-column prop="nextFollowTime" label="下次跟进" />
        </el-table>
        <div style="float: right">
          <el-pagination
            background
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 新增跟进弹框 -->
    <AppDialog
      v-model="modal.visible"
      :title="modal.title"
      width="700px"
      height="400px"
      @success="addUserFollow"
    >
      <div v-loading="modal.loading" class="choose_resource m-t-20 p-10">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="跟进内容" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 10 }"
            />
          </el-form-item>
          <el-form-item label="跟进方式">
            <el-select v-model="form.followType" placeholder="请选择">
              <el-option label="电话" :value="1" />
              <el-option label="微信" :value="2" />
              <el-option label="站内" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="下次跟进">
            <el-date-picker
              v-model="form.nextFollowTime"
              :picker-options="DatePicker"
              type="datetime"
              placeholder="选择日期时间"
            />
          </el-form-item>
        </el-form>
      </div>
    </AppDialog>

    <!-- 用户详情弹框 -->
    <Modal
      title="用户详情"
      :type="UserInfoDialog.type"
      size="1200px"
      width="1200px"
      :visible.sync="UserInfoDialog.visible"
    >
      <UserInfoModal
        :type="UserInfoDialog.type"
        :visible.sync="UserInfoDialog.visible"
        :user-id="UserInfoDialog.userId"
        @close="UserInfoDialog.visible = false"
      />
    </Modal>

    <!-- 售后订单详情弹框 -->
    <el-drawer
      title="售后订单详情"
      :visible.sync="AfterOrderDialog.visible"
      direction="rtl"
      size="1200px"
    >
      <AfterOrderDetailModal
        :visible="AfterOrderDialog.visible"
        :type="AfterOrderDialog.type"
        :order-no="AfterOrderDialog.orderNo"
      />
    </el-drawer>
  </div>
</template>

<script>
import {
  getOrderDetail,
  goodsAfterSaleList,
  goodsAfterSaleCard
} from '@/api/business'
import { mapGetters } from 'vuex'
import AppDialog from '@/components/AppDialog'
import { userFollow, addFollowByOrderNo } from '@/api/user/member'
import Modal from '@/components/Modal'
import UserInfoModal from '@/components/Modal/user/userInfo.vue'
import AfterOrderDetailModal from '@/components/Modal/order/afterOrderDetail.vue'
export default {
  name: 'OrderDetail',
  components: {
    AppDialog,
    Modal,
    UserInfoModal,
    AfterOrderDetailModal
  },
  data() {
    return {
      detail: {
        orderNo: '', // 订单号
        orderStatus: '', // 订单状态
        createTime: '', // 下单时间
        paymentType: '', // 支付方式.1:微信 2:阿里
        userTerminal: '', // 渠道来源
        thirdShopName: '',
        list: []
      },
      afterSaleList: [], // 退款记录
      orderStatus: {
        1: {
          color: '#E6A23C',
          name: '未支付'
        },
        2: {
          color: '#21c11f',
          name: '支付成功'
        },
        3: {
          color: '#E6A23C',
          name: '超时已关闭'
        },
        4: {
          color: '#E6A23C',
          name: '用户已取消'
        },
        5: {
          color: '#E6A23C',
          name: '退款中'
        },
        6: {
          color: '#E6A23C',
          name: '部分退款'
        },
        7: {
          color: '#21c11f',
          name: '全部退款'
        },
        8: {
          color: '#F56C6C',
          name: '退款异常'
        },
        0: {
          color: '#909399',
          name: '无订单状态'
        }
      },
      modal: {
        visible: false,
        title: '新增',
        loading: false
      },
      loading: false,
      form: {
        content: '',
        userId: '',
        nextFollowTime: '',
        followType: 1
      },
      // 跟进记录数据
      pageSize: 10,
      tableData: [],
      currentPage: 1,
      total: 0,
      rules: {
        content: [
          { required: true, message: '请输入跟进内容', trigger: 'blur' }
        ]
      },
      DatePicker: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      UserInfoDialog: {
        title: '',
        visible: false,
        type: 1,
        userId: ''
      },
      AfterOrderDialog: {
        type: 1,
        visible: false,
        orderNo: ''
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters([
      'channelSourceType',
      'orderStatus_options',
      'goodsType_options',
      'paymentType_options',
      'goodsType_obj'
    ]),
    thirdShopName() {
      const thirdShopName =
        this.detail.list &&
        this.detail.list.length &&
        this.detail.list[0].thirdShopName
      return thirdShopName ? ` | ${thirdShopName}` : ''
    }
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
    this.getDetail()
    this.getGoodsAfterSaleList()
  },
  activated() {
    this.getDetail()
    this.getGoodsAfterSaleList()
    this.getList()
  },
  methods: {
    getDetail() {
      this.loading = true
      getOrderDetail(this.$route.params.id)
        .then(res => {
          this.detail = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取退款记录列表
    getGoodsAfterSaleList() {
      goodsAfterSaleList({ orderNo: this.$route.params.id }).then(res => {
        this.afterSaleList = res.data
      })
    },

    /** 跟进记录模块 */
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    // 获取跟进记录列表
    getList() {
      this.loading = true
      const params = {
        current: this.currentPage,
        size: this.pageSize,
        orderNo: this.$route.params.id
        // userId: this.$route.params.id
      }
      userFollow(params)
        .then(res => {
          this.loading = false
          this.tableData = res.data.records
          this.total = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    addUserFollow() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.modal.loading = true
          addFollowByOrderNo(this.form)
            .then(res => {
              this.modal.loading = false
              this.modal.visible = false
              this.$notify.success({
                title: '提示',
                message: '提交成功'
              })
              this.getList()
            })
            .catch(() => {
              this.modal.loading = false
            })
        } else {
          return false
        }
      })
    },
    // 打开新增跟进记录弹框
    openAddModal() {
      this.form = {
        content: '',
        followType: 1,
        nextFollowTime: '',
        orderNo: this.$route.params.id,
        userId: ''
      }
      this.modal.visible = true
    },
    // 跳转用户详情页面
    gotoUserDetails(userId) {
      // this.$router.push(`/messageManager/memberDetail/${userId}`)
      this.UserInfoDialog = {
        visible: true,
        type: 1,
        userId: userId
      }
    },
    applyAfterSalesCard(row) {
      this.$delModal({
        tips: `确定给【${row.goodsName}】商品发放售后卡?`,
        success: () => {
          this.loading = true
          goodsAfterSaleCard(row.id)
            .then(res => {
              this.$message({
                showClose: true,
                duration: 0,
                type: 'success',
                message: res.data
              })
              this.loading = false
              this.getDetail()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    gotoDetailDetail(row) {
      this.AfterOrderDialog = {
        visible: true,
        type: 1,
        orderNo: row.afterSaleNo
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px 21px;
  .header {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: rgba(51, 51, 51, 0.9);
    line-height: 24px;
    margin-bottom: 30px;
  }
  .header_tips {
    font-size: 20px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 0.9);
    line-height: 28px;
    position: relative;
    padding-left: 10px;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 5px;
      width: 4px;
      height: 20px;
      background: #0c6fff;
      border-radius: 3px;
    }
  }
  .tips {
    // margin-top: 20px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 22px;
  }
  .order-detail {
    .deliver-info {
      padding: 20px;
      margin-bottom: 40px;
      width: 100%;
      background: #f5f7fa;
      .deliverTips {
        align-items: center;
        height: 22px;
        font-size: 20px;
        font-weight: bold;
        color: #21c11f;
        line-height: 22px;
      }
    }
  }
  .module-item {
    width: 100%;
    padding-bottom: 20px;
    .module-title {
      height: 22px;
      line-height: 22px;
      margin: 0 0 24px 0;
      .module-title-text {
        float: left;
        font-size: 16px;
        font-weight: bold;
        padding: 0 8px 0 8px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        position: relative;
        color: #353535;
        &::before {
          content: '';
          position: absolute;
          width: 2px;
          height: 14px;
          margin: 3px 0;
          background: #1b8afa;
          left: 0;
        }
      }
    }
    .module-content {
      padding: 0;
      .single-line {
        width: 100%;
        height: 40px;
        padding: 0 10px;
        font-size: 14px;
        > .info-item {
          width: 33.3%;
          height: 20px;
          line-height: 20px;
          padding-right: 10px;
          float: left;
          color: #666666;
          -o-text-overflow: ellipsis;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: relative;
          > span {
            color: #353535;
          }
        }
      }
      > hr {
        margin: 0 10px 17px;
        border: 0;
        height: 0;
        border-top: 1px solid #eee;
      }
    }
  }
  .main-table {
    width: 100%;
    position: relative;
    .table-header {
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      font-weight: 600;
      background-color: #f5f7fa;
      text-align: center;
      color: #353535;
      .header-item {
        float: left;
        box-sizing: border-box;
        &:nth-child(1) {
          width: 20%;
          text-align: left;
          padding-left: 10px;
        }
        &:nth-child(2) {
          width: 10%;
        }
        &:nth-child(3) {
          width: 6%;
        }
        &:nth-child(4) {
          width: 7%;
        }
        &:nth-child(5) {
          width: 20%;
        }
        &:nth-child(6) {
          width: 11%;
        }
        &:nth-child(7) {
          width: 11%;
        }
        &:nth-child(8) {
          width: 15%;
        }
      }
    }
    .table-body {
      width: 100%;
      height: 106px;
      font-size: 14px;
      display: flex;
      .body-item {
        position: relative;
        line-height: 90px;
        text-align: center;
        &:nth-child(1) {
          overflow: hidden;
          white-space: nowrap;
          -o-text-overflow: ellipsis;
          text-overflow: ellipsis;
          text-align: left;
          padding-left: 10px;
          width: 20%;
          .goods-img-info {
            display: flex;
            align-items: center;
            .goods-img {
              width: 64px;
              height: 64px;
              min-width: 64px;
              background: #999;
            }
            .goods-info {
              padding-left: 8px;
              width: 100%;
              height: 80px;
              line-height: 20px;
              vertical-align: top;
              display: inline-block;
              overflow: hidden;
              margin-top: 15px;
              .goods-type {
                width: 100%;
                height: 18px;
                font-size: 14px;
                color: #999999;
                margin-right: 8px;
              }
              .goods-period {
                margin-top: 4px;
                width: 100%;
                height: 16px;
                font-size: 12px;
                color: #b2b2b2;
                line-height: 16px;
                overflow: hidden;
                -o-text-overflow: ellipsis;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
        &:nth-child(2) {
          width: 10%;
        }
        &:nth-child(3) {
          width: 6%;
        }
        &:nth-child(4) {
          width: 7%;
        }
        &:nth-child(5) {
          width: 20%;
        }
        &:nth-child(6) {
          width: 11%;
        }
        &:nth-child(7) {
          width: 11%;
        }
        &:nth-child(8) {
          width: 15%;
          border-left: 1px solid #eee;
        }
      }
    }
  }
  .page_footer {
    height: 80px;
    .price-summary {
      margin-top: 15px;
      float: right;
      .summary-item {
        margin-bottom: 8px;
        .title {
          display: inline-block;
          width: 200px;
          text-align: right;
          color: #333333;
        }
        .content {
          // float: right;
          display: inline-block;
          // width: 100px;
          margin-left: 35px;
        }
      }
      .total {
        color: #333333;
        font-weight: bolder;
      }
    }
  }
}
.goods-img-info {
  display: flex;
  align-items: center;
  .goods-img {
    width: 64px;
    height: 64px;
    min-width: 64px;
    background: #eee;
  }
  .goods-info {
    min-height: 60px;
    padding-left: 8px;
    display: grid;

    .goods-type {
      width: 100%;
      height: 18px;
      line-height: 18px;
      font-size: 14px;
      color: #999999;
      margin-right: 8px;
    }
    .goods-period {
      width: 100%;
      height: 16px;
      font-size: 12px;
      color: #b2b2b2;
      line-height: 16px;
      overflow: hidden;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
