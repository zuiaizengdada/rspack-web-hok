<template>
  <div v-loading="loading" class="page_wrap">
    <div class="content">
      <div
        class="table-module"
        :class="showBorder ? 'table-module-border' : ''"
      >
        <div class="main-table">
          <div
            class="table-header clearfix"
            :style="{ borderRadius: showBorder ? '6px 6px 0 0' : '' }"
          >
            <div class="header-item">商品名称</div>
            <div class="header-item">单价</div>
            <div class="header-item">订单号</div>
            <div class="header-item">赠送时间</div>
            <div class="header-item">交付状态</div>
            <div class="header-item">完成情况(已完成/总节数)</div>
          </div>

          <div
            v-if="tableData && tableData.length === 0"
            class="table-empty-text"
          >
            所选时段，没有符合条件得订单，请重新筛选
          </div>

          <div v-else class="table-body">
            <div v-for="(listItem, itemIndex) in tableData" :key="itemIndex">
              <div class="table-body">
                <div
                  class="table-body-row"
                  :class="
                    itemIndex === tableData.length - 1 ? 'table-body-row-box' : ''
                  "
                  :style="{
                    marginBottom:
                      showBorder && tableData - 1 == itemIndex ? '16px' : ''
                  }"
                >
                  <div class="body-item">
                    <div class="goods-img-info">
                      <div class="goods-img">
                        <ImagePreviewer
                          :src="listItem.coverUrl"
                          fit="contain"
                          style="width: 100%; height: 100%; border-radius: 6px"
                        />
                      </div>
                      <div class="goods-info">
                        <div class="EC3" :title="listItem.contentName">
                          {{ listItem.contentName }}
                        </div>
                        <!-- <div class="goods-type">
                          {{ goodsType_obj[listItem.goodsType] }}
                        </div> -->
                      </div>
                    </div>
                  </div>
                  <div class="body-item">
                    {{ (listItem.goodsPrices || 0) | filtersMoney }}
                  </div>
                  <div class="body-item">
                    <AppIconClipboard :src="listItem.orderNo">
                      <span
                        class="a_link"
                      >{{ listItem.orderNo }}</span>
                    </AppIconClipboard>
                  </div>
                  <div class="body-item">{{ listItem.giveTime }}</div>
                  <div class="body-item">{{ listItem.deliverStatusName }}</div>
                  <div class="body-item">{{ listItem.finishInfo }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-pagination
          v-if="search.pagination"
          class="ss-pagination-warpper m-t-20 m-b-20"
          :current-page="search.current"
          :page-size="search.size"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AppIconClipboard from '@/components/AppIconClipboard'
import { mapGetters } from 'vuex'
export default {
  name: 'OrderList',
  components: {
    AppIconClipboard
  },
  props: {
    operation: {
      type: Boolean,
      default: true
    },
    seeDetailModel: {
      type: Boolean,
      default: true
    },
    showBorder: {
      type: Boolean,
      default: false
    },
    operationColumn: {
      type: Boolean,
      default: true
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
    // search: {
    //   type: Object,
    //   default: null
    // }
  },
  data() {
    return {
      refundDateTime: new Date(),
      loading: false,
      search: {
        order: { label: 'orderNo', value: '' }, // 订单搜索
        time: { label: 1, value: ['', ''] }, // 订单时间
        goodsName: '', // 商品名称
        orderStatus: '', // 订单状态
        orderType: '', // 订单类型
        userTerminal: '', // 渠道来源
        channelSource: '', // 渠道来源
        thirdShopId: '', // 第三方店铺id
        thirdShopName: '', // 第三方店铺名称
        paymentType: '', // 支付方式
        folowerId: '', // 跟进人员id
        folowername: '', // 跟进人员姓名
        payPromotion: '', // 筛选推广
        orderAudit: '', // 审核状态
        current: 1, // 当前页
        size: 10, // 每页条数
        activeIndex: 0, // 当前类别
        activeName: '', // 当前类别名称
        approvalName: '', // 当前审批名称
        pagination: false // 开启分页显示
      },
      listTab: [
        { id: '1', name: '全部订单' },
        { id: '2', name: '线上订单' },
        { id: '3', name: '线下订单' },
        { id: '4', name: '退款订单' }
      ],
      currentTabIndex: '1',
      total: 0,
      // tableData: [],
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
      deliverStatusObj: {
        1: '待交付',
        2: '交付中',
        3: '延期交付',
        4: '锁定交付',
        5: '已交付',
        6: '已关闭',
        7: '其他'
      },
      memberModal: {
        visible: false,
        title: '成员信息',
        loading: false,
        current: 1,
        size: 10,
        total: 0,
        row: {}
      },
      // 学员信息list
      memberList: [],
      changePriceModel: {
        visible: false,
        title: '改价',
        loading: false,
        data: {}, // 列表数据
        payerTotal: 0, // 总价应付
        changePrice: 0, // 改价应付
        orderNo: ''
      },
      // 跟进人员弹框
      followUserModel: {
        visible: false,
        data: [
          { userId: '', userName: '', roleName: '班主任', role: 1 },
          { userId: '', userName: '', roleName: '销售', role: 2 },
          { userId: '', userName: '', roleName: '客服', role: 3 }
        ],
        orderNo: '',
        subOrderId: '',
        title: '添加跟进人员'
      },
      followUserLogModel: {
        visible: false,
        orderNo: ''
      },
      exportLoading: false,
      permsList: this.$route.meta.permsList || [],
      refundModel: {
        visible: false,
        title: '',
        refundPrice: '',
        prcie: '',
        orderNo: ''
      }
    }
  },
  computed: {
    ...mapGetters(['goodsType_obj'])
  }
}
</script>

  <style scoped lang="scss">
  .page_wrap {
    min-width: 1200px;
    height: 100%;
    // background-color: #fff;
    .content {
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 8px;
        height: 10px;
        background-color: rgba(0, 0, 0, 0);
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background-color: rgba(0, 0, 0, 0.2);
        transition: all 0.4s ease;
        -moz-transition: all 0.4s ease;
        -webkit-transition: all 0.4s ease;
        -o-transition: all 0.4s ease;
      }
      &::-webkit-scrollbar-track {
        background-color: rgba(0, 0, 0, 0.1);
      }
      .footer-tabs {
        margin-top: 16px;
      }
      .table-module {
        padding: 0 20px;

        .ss-pagination-warpper {
          text-align: right;
        }
        .table-empty-text {
          width: 100%;
          height: 100px;
          line-height: 100px;
          font-size: 16px;
          text-align: center;
          color: #5e7382;
        }
        .main-table {
          width: 100%;
          .table-header {
            width: 100%;
            line-height: 40px;
            background: #f3f3f3;
            border-radius: 6px;
            padding: 0px 20px 0 13px;
            .header-item {
              float: left;
              box-sizing: border-box;
              font-size: 16px;
              color: #333333;
              position: relative;
              &:nth-child(1) {
                width: 21%;
                // padding-left: 16px;
              }
              &:nth-child(2) {
                width: 11%;
              }
              &:nth-child(3) {
                width: 19%;
              }
              &:nth-child(4) {
                width: 14%;
              }
              &:nth-child(5) {
                width: 16%;
              }
              &:nth-child(6) {
                width: 17%;
              }
              &:nth-child(7) {
                width: 10%;
              }
              &:nth-child(8) {
                width: 10%;
              }
              &:nth-child(9) {
                width: 10%;
              }
              &:nth-child(10) {
                width: 8%;
              }
              &:nth-child(11) {
                width: 8%;
              }
            }
          }

          .table-body {
            width: 100%;
            font-size: 14px;
            .table-title-row {
              position: relative;
              padding: 0 50px 0 15px;
              margin-top: 16px;
              background: #fbfcfe;
              border: 1px solid #eee;
              min-height: 44px;
              line-height: 28px;
              height: auto;
              overflow: hidden;
              color: #333;
              font-size: 14px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              //   justify-content: space-between;
              border-radius: 8px 8px 0px 0px;
              .table-title-row-l {
                display: flex;
                height: 100%;
                align-items: center;
                .order-box {
                  width: 750px;
                }
                .pay-box {
                  width: 100px;
                }
                .audit-list {
                  margin-left: 20px;
                  display: flex;
                  justify-items: center;
                  .audit-box {
                    line-height: 24px;
                    padding: 0 10px;
                    height: 24px;
                    font-size: 12px;
                    font-family: MicrosoftYaHei;
                    color: #ff7d00;
                    background: #fff2e6;
                    border-radius: 12px;
                    display: inline;
                    .icon-svg {
                      margin-right: 4px;
                    }
                  }
                  .audit-box-succeed {
                    background: #e6f7ea;
                    color: #00b42a;
                  }
                  .audit-box-fail {
                    background: #feecec;
                    color: #f53f3f;
                  }
                  .audit-box-review {
                    background: #fff2cc;
                    color: #ffc619;
                  }
                }
              }
              .title-item {
                margin-right: 24px;
                height: 42px;
                line-height: 42px;
                float: left;
              }
              .title-item-font {
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #777777;
                span {
                  font-size: 14px;
                  font-family: MicrosoftYaHei;
                  color: #333333;
                }
              }
              .color-tag-area {
                display: flex;
                align-items: center;
                position: absolute;
                right: 0;
                top: 0;
                padding: 0 15px;
                height: 42px;
                line-height: 42px;
                color: #105cfb;
                cursor: pointer;
                > img {
                  width: 16px;
                  height: 16px;
                }
              }
            }
            .table-body {
              border-radius: 0px 0px 8px 8px;
              border: 1px solid #e7e7e7;
              border-top: none;
              padding: 13px 20px 0 13px;
              .table-body-row {
                border-bottom: 1px solid #e7e7e7;
                padding-bottom: 13px;
                margin-bottom: 13px;
                width: 100%;
                display: flex;
                align-items: center;
                .body-item {
                  box-sizing: border-box;
                  position: relative;
                  &:nth-child(1) {
                    width: 21%;
                  }
                  &:nth-child(2) {
                    width: 11%;
                  }
                  &:nth-child(3) {
                    width: 19%;
                  }
                  &:nth-child(4) {
                    width: 14%;
                  }
                  &:nth-child(5) {
                    width: 16%;
                  }
                  &:nth-child(6) {
                    width: 17%;
                  }
                  &:nth-child(7) {
                    display: flex;
                    width: 10%;
                    justify-content: space-between;
                    // width: 10%;
                  }
                  &:nth-child(8) {
                    width: 10%;
                  }
                  &:nth-child(9) {
                    width: 10%;
                  }
                  &:nth-child(10) {
                    width: 8%;
                  }
                  &:nth-child(11) {
                    width: 8%;
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
                }
              }
              .table-body-row-box {
                // border-radius: 8px;
                border: none;
                padding-bottom: 0;
              }
            }
          }
        }
      }
      .table-module-border {
        padding: 0px;
        border-radius: 8px;
        border: 1px solid #e7e7e7;
      }
    }
  }
  .customer-info-box {
    max-height: 400px;
    overflow: auto;
    padding-top: 20px;
  }
  .memberCard {
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .memberInfo {
    width: 450px;
    line-height: 20px;
    display: flex;
    flex-wrap: wrap;
    > div {
      width: 33.33%;
      > span:nth-child(1) {
        // margin-right: 8px;
        word-break: keep-all;
        line-height: 22px;
        font-size: 14px;
      }
      > span:nth-child(2) {
        white-space: pre-wrap;
        word-break: break-all;
        line-height: 22px;
        font-size: 14px;
      }
    }
  }
  .table-empty-text {
    width: 100%;
    height: 100px;
    line-height: 100px;
    font-size: 16px;
    text-align: center;
    color: #5e7382;
  }
  .change-price-model {
    width: 800px;
    padding: 20px;
    box-sizing: border-box;
  }
  .goods_picture {
    width: 82px;
    height: 60px;
    border-radius: 4px;
    background: rgb(245, 247, 250);
  }
  .goods_info {
    line-height: 1.5;
    width: calc(100% - 82px);
    height: 60px;
    flex: 1;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    .goods_name {
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      word-wrap: break-word;
      font-size: 14px;
      color: #353535;
      cursor: pointer;
    }
  }
  .change-price-model-footer {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .change-price-model-footer-view {
      display: flex;
      margin-top: 20px;
      width: 50%;
      .change-price-model-footer-view-label {
        width: 82px;
        margin-right: 12px;
        font-size: 14px;
        color: #606266;
      }
      .change-price-model-footer-view-name {
        font-size: 14px;
        color: #606266;
      }
    }
  }
  .follow-user-model {
    width: 800px;
    padding: 20px;
    box-sizing: border-box;
    .follow-user {
      margin-bottom: 20px;
      line-height: 32px;
      .roleName {
        width: 80px;
      }
    }
  }
  .follow-user-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: auto;
    width: 100%;
    height: 66px;
    background-color: #fafbfc;
    border-radius: 2px 2px 0 0;
  }
  .followerUserTips {
    color: #1890ff;
    cursor: pointer;
    // &:active {
    //   color: ;
    // }
  }
  ::v-deep .ss-material-box-header-title {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold !important;
    color: #333333;
  }
  .full-price {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    padding: 20px;
    .full-price-ps {
      font-size: 14px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;
    }
    .full-price-box {
      display: flex;
      justify-content: flex-end;
      font-size: 16px;
      padding-top: 32px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;
    }
    .refund-prcie {
      color: #f53f3f;
    }
  }
  .partial-price {
    padding: 20px;
    .partial-price-in-box {
      .partial-price-in {
        width: 92px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        margin: 0 8px;
      }
      .partial-price-in-ps {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #f53f3f;
        margin-left: 18px;
      }
    }
    .partial-price-in-toast {
      display: flex;
      justify-content: space-between;
      margin-top: 23px;
      .partial-price-in-toast-l {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        span {
          font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
          font-weight: bold;
        }
      }
      .partial-price-in-toast-r {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
      }
    }
    .refund-prcie {
      color: #f53f3f;
    }
  }
  .footer-box {
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
  }
  .m-r20 {
    margin-right: 20px;
  }
  ::v-deep .el-input__inner {
    height: 32px;
  }
  ::v-deep ::-webkit-scrollbar-track {
    background: #ededed;
    border-radius: 0;
  }
  ::v-deep ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 10px;
    height: 10px;
  }
  ::v-deep :hover ::-webkit-scrollbar-track-piece {
    cursor: pointer;
    background: #ededed;
    border-radius: 0;
  }

  ::v-deep :hover::-webkit-scrollbar-thumb:hover {
    cursor: pointer;
    border-radius: 5px;
    background: #acacac;
    transition: color 0.2s ease;
  }

  ::v-deep :hover::-webkit-scrollbar-thumb:vertical {
    cursor: pointer;
    border-radius: 5px;
    background: #acacac;
    transition: color 0.2s ease;
  }
  ::v-deep input::-webkit-outer-spin-button,
  ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  ::v-deep input[type='number'] {
    -moz-appearance: textfield;
  }
  .border-warn ::v-deep .el-input__inner {
    border-radius: 4px;
    border: 1px solid #f53f3f !important;
  }
  .loading-box {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: 1;
  }
  </style>
