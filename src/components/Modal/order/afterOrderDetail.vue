<!-- 售后订单详情弹框 -->
<template>
  <div v-loading="loading" :class="`group${type == 2 ? 'Dialog' : 'Drawer'}`">
    <div class="form">
      <div class="page_wrap">
        <!-- <div class="header">
          <span class="pointer" @click="$router.push({path: '/business/paySetting'})">售后维权</span>
          > 订单详情
        </div> -->

        <div v-loading="loading" class="order-detail clearfix">
          <div>
            <div class="deliver-info">
              <div>
                <i v-if="detail.status === 2" class="el-icon-success" style="color: #21c11f; font-size: 18px" :style="{color: orderStatus[detail.status || 0].color}" />
                <span class="m-l-10 deliverTips" :style="{color: orderStatus[detail.status || 0].color}">
                  {{ orderStatus[detail.status || 0].name }}
                </span>

                <el-tooltip v-if="detail.status && detail.status === 1 && time === 0 && num === 0" class="item" effect="dark" content="点击刷新订单数据" placement="top-start">
                  <i class="el-icon-refresh-right a_link" @click="refresh()" />
                </el-tooltip>
                <el-tooltip v-if="detail.status && detail.status === 1 && time > 0 && num > 0" class="item" effect="dark" content="处理中请稍后" placement="top-start">
                  <i class="el-icon-loading" />
                </el-tooltip>
              </div>
            </div>
          </div>

          <el-card v-if="detail.status === 0 && detail.channelSource === 3" shadow="always">
            <el-form ref="form" label-width="80px" :model="form" :inline="true">
              <div>
                <el-form-item label="可退金额: ">
                  <div>{{ (detail.payerTotal || 0) | filtersMoney }}元</div>
                </el-form-item>
                <el-form-item label="退款金额: ">
                  <el-input v-model="form.refundFee" type="number" :min="0">
                    <span slot="suffix" class="m-r-10">元</span>
                  </el-input>
                </el-form-item>
                <el-form-item label="备注说明: ">
                  <el-input v-model="form.remark" class="w-300" />
                </el-form-item>
              </div>

              <div class="single-line">
                <el-radio-group v-model="form.permissions">
                  <el-radio :label="1">保留课程权限</el-radio>
                  <el-radio :label="2">解除课程权限</el-radio>
                </el-radio-group>
              </div>

              <div class="single-line m-t-20">
                <div>
                  <el-button v-permission="['system:after:confirm', permsList]" type="primary" class="m-r-10" :loading="loading" @click="sure()">确认退款</el-button>
                  <el-tooltip class="item" effect="dark" content="退款原路返回,退款金额不能大于申请金额." placement="right">
                    <i class="el-icon-info" />
                  </el-tooltip>
                </div>
              </div>
            </el-form>
          </el-card>

          <div v-else class="module-item m-t-20 clearfix">
            <div class="module-title">
              <div class="module-title-text">退款信息</div>
            </div>
            <div class="module-content">
              <div class="single-line">
                <div class="info-item">退款金额: <span>{{ (detail.refundFee || 0) | filtersMoney }}元</span></div>
                <div class="info-item">课程权限: <span>{{ {1: '保留课程权限', 2: '解除课程权限'}[detail.permissions] }}</span></div>
                <div class="info-item">说明: <span>{{ detail.remark }}</span></div>
              </div>
            </div>
          </div>

          <div class="module-item m-t-20 clearfix">
            <div class="module-title">
              <div class="module-title-text">售后信息</div>
            </div>
            <div class="module-content">
              <div class="single-line">
                <div class="info-item">售后单号: <span>{{ detail.afterSaleNo || '--' }}</span></div>
                <div class="info-item">退款方式: <span>{{ {1: '仅退款'}[detail.afterSaleMode] }}</span></div>
                <div class="info-item">售后类型: <span>{{ {1: '用户主动退款', 2: '平台仲裁退款'}[detail.afterSaleType] }}</span></div>
              </div>
              <hr>
              <div class="single-line">
                <div class="info-item">客户昵称: <span>{{ (detail.userName || '--') }}</span></div>
                <div class="info-item">客户手机: <span>{{ detail.userPhone || '--' }}</span></div>
              </div>
              <div class="single-line">
                <div class="info-item">申请金额: <span>{{ (detail.appliedFee || 0) | filtersMoney }}元</span></div>
                <div class="info-item">退款原因: <span>{{ detail.reason }}</span></div>
              </div>
              <div class="single-line">
                <div class="info-item">客户补充描述: <span>{{ detail.supplement || '--' }}</span></div>
              </div>
              <div class="single-line w-100p clearfix voucherUrlsBox">
                <div class="voucherUrlslabel">
                  <span>客户上传凭证:</span>
                  <div class="m-l-10 voucherUrlsValue">
                    <el-image v-for="(item, index) in detail.voucherUrls" :key="index" class="voucherImgage" style="width: 100px; height: 100px" :src="item" fit="contain" :preview-src-list="detail.voucherUrls" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="module-item">
            <div class="module-title">
              <div class="module-title-text">售后商品</div>
            </div>
            <el-table :data="detail.list" style="width: 100%" border :header-cell-style="{background: '#f5f5f5'}">
              <el-table-column label="商品名称" prop="goodsName">
                <template slot-scope="{ row }">
                  <div class="goods-img-info">
                    <div class="goods-img">
                      <el-image :src="row.coverUrl" fit="contain" style="width: 100%; height: 100%" />
                    </div>
                    <div class="goods-info">
                      <div class="EC3" :title="row.goodsName">{{ row.goodsName }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="商品价格（元）" prop="payerTotal">
                <template slot-scope="{ row }">
                  {{ (row.payerTotal || 0) | filtersMoney }}
                </template>
              </el-table-column>
              <el-table-column label="优惠价格（元）" prop="discountsFee">
                <template slot-scope="{ row }">
                  {{ (row.discountsFee || 0) | filtersMoney }}
                </template>
              </el-table-column>
              <el-table-column label="课程时长" prop="materialDes">
                <template slot-scope="{ row }">
                  {{ row.materialDes | filterTime }}
                </template>
              </el-table-column>
              <el-table-column label="学习时长" prop="duration">
                <template slot-scope="{ row }">
                  {{ row.duration | filterTime }}
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="module-item">
            <div class="module-title">
              <div class="module-title-text">售后订单</div>
            </div>
            <div class="module-content">
              <div class="single-line">
                <div class="info-item">订单号:
                  <AppIconClipboard :src="detail.orderNo">
                    <!-- <span class="a_link">{{ row.orderNo }}</span> -->
                    <span>{{ detail.orderNo|| '--' }}</span>
                  </AppIconClipboard>
                </div>
              </div>

              <div class="single-line">
                <div class="info-item">订单金额: <span>{{ (detail.goodsTotalFee || 0) | filtersMoney }} 元</span></div>
                <div class="info-item">订单实付: <span>{{ (detail.payerTotal || 0) | filtersMoney }} 元</span></div>
                <div class="info-item">订单优惠: <span>{{ (detail.discountsFee || 0) | filtersMoney }} 元</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-drawer__footer">
      <el-button size="small" @click="$emit('close')">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { getSaleDetail, sureGoodsAfterSale } from '@/api/business'
import { mapGetters } from 'vuex'
import AppIconClipboard from '@/components/AppIconClipboard'
export default {
  components: {
    AppIconClipboard
  },
  props: {
    type: {
      type: Number,
      default: 1
    },
    visible: {
      type: Boolean,
      default: false
    },
    orderNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: true,
      form: {
        permissions: 2, // 课程权限 1:保留 2:解除
        refundFee: 0, // 退款金额【单位：分】
        remark: ''
      },
      detail: {
        channelSource: '',
        afterSaleMode: '', // 退款方式 1:仅退款
        afterSaleNo: '', // 售后单号
        afterSaleType: '', // 售后类型 1:用户主动退款 2:平台仲裁退款
        appliedFee: 0, // 申请金额(可退金额)【单位：分】
        discountsFee: 0, // 优惠金额【单位：分】
        list: [],
        goodsSubVo: { // 售后商品
          coverUrl: '', // 横版封面存储路径
          discountsFee: 0, // 优惠金额【单位：分】
          duration: 0, // 学习时长【单位：秒】
          goodsName: '', // 商品名称
          materialDes: '', // 课程时长【单位：秒】
          payerTotal: 0 // 商品价格【单位：分】
        },
        goodsTotalFee: 0, // 订单总价【单位：分】
        orderNo: '', // 商户订单号
        payerTotal: 0, // 订单实付【单位：分】
        reason: '', // 退款原因
        remark: '', // 备注
        status: '', // 售后状态 1:未处理 2: 退款中 3: 已退款 4:已关闭
        supplement: '', // 补充描述
        userName: '', // 用户昵称
        userPhone: '', // 用户手机号
        voucherUrls: [] // 凭证url 多个使用【,】分割
      },
      afterSaleList: [], // 退款记录
      orderStatus: {
        0: {
          color: '#F56C6C',
          name: '未处理'
        },
        1: {
          color: '#E6A23C',
          name: '退款中'
        },
        2: {
          color: '#409EFF',
          name: '已退款'
        },
        3: {
          color: '#909399',
          name: '已关闭'
        },
        4: {
          color: '#F56C6C',
          name: '退款异常'
        },
        5: {
          color: '#E6A23C',
          name: '处理中'
        },
        6: {
          color: '#909399',
          name: '商家拒绝退款'
        },
        7: {
          color: '#909399',
          name: '部分退款'
        }
      },
      time: 30,
      num: 2,
      interval: null,
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters([
      'userTerminal_options',
      'orderStatus_options',
      'goodsType_options',
      'paymentType_options'
    ])
  },
  watch: {
    visible: {
      handler(newValue) {
        console.log(newValue)
        if (newValue) {
          this.getDetail()
        } else {
          clearInterval(this.interval)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    refresh() {
      this.time = 30
      this.num = 2
      this.getDetail()
    },
    getDetail() {
      this.loading = true

      const params = {
        afterSaleNo: this.orderNo
      }
      getSaleDetail(params).then(res => {
        console.log(res, '详情信息')
        let voucherUrls = []
        if (res.data.voucherUrls && res.data.voucherUrls.length > 0) {
          voucherUrls = res.data.voucherUrls.replace(/,$/gi, '').split(',')
        }
        this.detail = {
          channelSource: res.data.channelSource,
          afterSaleMode: res.data.afterSaleMode || '',
          afterSaleNo: res.data.afterSaleNo || '',
          afterSaleType: res.data.afterSaleType || '',
          appliedFee: res.data.appliedFee,
          discountsFee: res.data.discountsFee || '',
          list: [
            {
              coverUrl: res.data.goodsSubVo.coverUrl || '',
              discountsFee: res.data.goodsSubVo.discountsFee || '',
              duration: res.data.goodsSubVo.duration || '',
              goodsName: res.data.goodsSubVo.goodsName || '',
              materialDes: res.data.goodsSubVo.materialDes || '',
              payerTotal: res.data.goodsSubVo.payerTotal || ''
            }
          ],
          goodsTotalFee: res.data.goodsTotalFee || '',
          orderNo: res.data.orderNo || '',
          payerTotal: res.data.payerTotal || '',
          reason: res.data.reason || '',
          remark: res.data.remark || '',
          status: res.data.status,
          supplement: res.data.supplement || '',
          userName: res.data.userName || '',
          userPhone: res.data.userPhone || '',
          refundFee: res.data.refundFee || 0,
          permissions: res.data.permissions || '',
          voucherUrls
        }
        this.form.refundFee = this.detail.appliedFee / 100
        this.loading = false

        const _this = this
        if (res.data.status === 1 && this.time === 30 && this.num === 2 && !this.interval) {
          this.interval = setInterval(function() {
            console.log(_this.time, _this.num)
            _this.time--
            if (_this.time <= 0 && _this.num > 0) {
              _this.time = 30
              _this.num = _this.num - 1
              _this.getDetail()
            }
            if (_this.time <= 30 && _this.num <= 0) {
              clearInterval(_this.interval)
              _this.time = 0
              _this.num = 0
            }
          }, 1000)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    sure() {
      if (this.loading) {
        return
      }
      if (this.form.refundFee > (this.detail.appliedFee / 100)) {
        return this.$message.error('退款金额不能大于申请金额')
      }
      this.loading = true
      const data = {
        afterSaleNo: this.detail.afterSaleNo,
        permissions: this.form.permissions, // 课程权限 1:保留 2:解除
        refundFee: (this.form.refundFee || 0) * 100, // 退款金额【单位：分】
        remark: this.form.remark
      }
      sureGoodsAfterSale(data).then(res => {
        this.$notify.success({
          title: '提示',
          message: '操作成功'
        })
        this.getDetail()
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;
  .form {
    // flex: 1;
    height: calc(100vh - 77px - 50px);
    width: 100%;
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .demo-drawer__footer {
    width: 100%;
    height: 50px;
    padding-top: 10px;
    padding-left: 10px;
    -webkit-box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }
  .form_avatar {
    display: flex;
    align-items: center;
    .form_btn {
      height: 30px;
      margin-left: 10px;
    }
  }
  .form_textarea {
    width: 600px;
    margin-right: 10px;
  }
}
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
      content: "";
      position: absolute;
      left: 0;
      top: 5px;
      width: 4px;
      height: 20px;
      background: #0C6FFF;
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
          content: "";
          position: absolute;
          width: 2px;
          height: 14px;
          margin: 3px 0;
          background: #1b8afa;
          left: 0;
        }
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

.voucherUrlsBox {
  height: 100%!important;
  .voucherUrlslabel {
    display: flex;
    flex-wrap: wrap;
    .voucherUrlsValue {
      flex: 1;
      .voucherImgage {
        margin-right: 10px;
        background: rgb(245, 247, 250);
      }
    }
  }
}
</style>
