<template>
  <div class="entry-box">
    <div class="add-order-warp">
      <!-- <div class="crumbs-box" @click="goback">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="nav-list" style="cursor:pointer;">优惠券</el-breadcrumb-item>
          <el-breadcrumb-item v-if="fromTab === 'couponExamine'" class="nav-add">优惠券审核</el-breadcrumb-item>
          <el-breadcrumb-item v-else class="nav-add">优惠券详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div> -->
      <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="gray">
          <span @click="goback">优惠券</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          {{ fromTab === 'couponExamine' ? '优惠券审核' : '优惠券详情' }}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-form ref="form" :model="form" label-width="80px" class="form-box">
        <div class="add-coupon-row">
          <div class="common-box">
            <div class="common-title">基本信息</div>
          </div>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="优惠券名称">
              <p>{{ form.couponName }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人">
              <p>{{ form.createdByName }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="优惠券ID">
              <p>{{ form.couponNo }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.auditStatus === 5" label="优惠券状态">
              <p v-if="form.useStatus === 1">待开始</p>
              <p v-if="form.useStatus === 2">生效中</p>
              <p v-if="form.useStatus === 3">已过期</p>
              <p v-if="form.useStatus === 4">已作废</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="领取时间">
              <p>{{ form.claimStartTime }} - {{ form.claimEndTime }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <p>{{ form.createdAt }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="券有效期">
              <p v-if="form.expireDays">
                领取后{{ form.expireDays }} 天内有效期
              </p>
              <p v-else>{{ form.useStartTime }} - {{ form.useEndTime }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="add-coupon-row" style="margin-top: 25px">
          <div class="common-box">
            <div class="common-title">优惠设置</div>
          </div>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="优惠方式">
              <p>{{ form.discountMethodString }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="直减">
              <p>{{ form.discountContentString }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="发放数量">
              <p>{{ form.issueCount }} 张</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="每人限领取">
              <p>{{ form.claimCount }} 张</p>
            </el-form-item>
          </el-col>
          <el-col v-if=" form.deptNames " :span="8">
            <el-form-item
              label="员工可用范围"
            >
              <p>{{ form.deptNames.join(',') }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="add-coupon-row" style="margin-top: 25px">
          <div class="common-box">
            <div class="common-title">商品选择</div>
          </div>
        </div>
        <el-row>
          <el-col :span="24" class="add-goods-row">
            <span
              v-if="chooseGoodsArray.length > 0"
              class="tips-gs"
            >已选择<em>{{ chooseGoodsArray.length }}</em>个商品</span>
          </el-col>
        </el-row>
        <el-row
          v-if="chooseGoodsArray.length > 0"
          style="width: 1000px; margin-top: 15px"
        >
          <el-table
            ref="goodsDataTable"
            :data="chooseGoodsArray"
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="headerCellStyle"
          >
            <el-table-column label="商品信息" width="460">
              <template slot-scope="scope">
                <div class="goods-mess-row">
                  <ImagePreviewer
                    class="image-previewer"
                    :src="scope.row.coverUrl"
                    alt=""
                    fit="contain"
                  />
                  <span class="good-mess-detail">
                    <p>{{ scope.row.contentName }}</p>
                    <span v-if="scope.row.disabled" class="tips">{{
                      drawerTips
                    }}</span>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="商品价格" header-align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.goodsType === 5" class="goods-types-row">
                  <el-popover
                    placement="bottom"
                    width="450px"
                    trigger="hover"
                    popper-class="message-popover"
                  >
                    <el-table
                      :data="scope.row.materialSpecVos"
                      :header-cell-style="headerCellStyle"
                      style="width: 100%; border: 1px solid rgb(245, 245, 245)"
                    >
                      <el-table-column prop="specName" label="规格" />
                      <el-table-column label="价格">
                        <template slot-scope="scope">
                          <p>¥ {{ (scope.row.salePrice / 100).toFixed(2) }}</p>
                        </template>
                      </el-table-column>
                    </el-table>
                    <p slot="reference" class="search-price-p">查看规格报价</p>
                  </el-popover>
                </div>
                <p v-else class="goods-type-price">
                  <em>¥</em>{{
                    scope.row.salePrice
                      ? (scope.row.salePrice / 100).toFixed(2)
                      : 0
                  }}
                </p>
              </template>
            </el-table-column>
            <el-table-column label="类型" width="150">
              <template slot-scope="scope">
                <p v-if="scope.row.goodsType === 3">专栏</p>
                <p v-if="scope.row.goodsType === 4">大专栏</p>
                <p v-if="scope.row.goodsType === 5">线下课</p>
                <p v-if="scope.row.goodsType === 8">直播课</p>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <div class="add-coupon-row" style="margin-top: 20px">
          <div class="common-box">
            <div class="common-title">审核记录</div>
          </div>
        </div>
        <el-row style="width: 1000px">
          <el-table
            ref="shenHeDataTable"
            :data="shenheDataArray"
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="headerCellStyle"
          >
            <el-table-column prop="auditType" label="审核流程" />
            <el-table-column prop="auditNickName" label="操作人" />
            <el-table-column prop="auditStatus" label="审核状态" width="150">
              <template slot-scope="scope">
                <div v-if="scope.row.auditStatus === 1" class="audit-div-cls">
                  <img src="../../../../assets/image/coupon/icn_chushen.png" />
                  <p>待初审</p>
                </div>
                <div
                  v-if="scope.row.auditStatus === 2"
                  class="audit-div-cls audit-bohui-cls"
                >
                  <img src="../../../../assets/image/coupon/icn_bohui.png" />
                  <p>审核驳回</p>
                </div>
                <div
                  v-if="scope.row.auditStatus === 3"
                  class="audit-div-cls audit-fushen-cls"
                >
                  <img src="../../../../assets/image/coupon/icn_fushen.png" />
                  <p>待复审</p>
                </div>
                <div
                  v-if="scope.row.auditStatus === 4"
                  class="audit-div-cls audit-bohui-cls"
                >
                  <img src="../../../../assets/image/coupon/icn_bohui.png" />
                  <p>审核驳回</p>
                </div>
                <div
                  v-if="scope.row.auditStatus === 5"
                  class="audit-div-cls audit-tongguo-cls"
                >
                  <img src="../../../../assets/image/coupon/icn_check.png" />
                  <p>审核通过</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="驳回原因">
              <template slot-scope="scope">
                <p v-if="scope.row.remark">{{ scope.row.remark }}</p>
                <p v-else>无</p>
              </template>
            </el-table-column>
            <el-table-column prop="auditTime" label="变更时间" />
          </el-table>
        </el-row>
        <el-row
          v-if="
            fromTab === 'couponExamine' &&
              (form.auditStatus === 1 || form.auditStatus === 3)
          "
          class="submit-row-cls"
        >
          <el-form-item class="submit-row-cls-submit">
            <el-button
              style="margin-right: 20px"
              type="primary"
              size="small"
              @click="sureToTg"
            >通过</el-button>
            <el-button size="small" @click="toCancel">驳回</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <el-dialog
      title="确定通过"
      :close-on-click-modal="false"
      :visible.sync="cancelDialog"
      width="30%"
    >
      <span
        class="tips-cls-btn"
      >请确认优惠券内容无误，审核通过后，券种将创建成功。</span>
      <p class="tips-red-cls">注意：请确定参与优惠的商品无误，防止损失</p>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="sureToTongguo"
        >确 定</el-button>
        <el-button size="small" @click="cancelDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="驳回原因"
      :visible.sync="cancelSubmit"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-input
        v-model="remark"
        type="textarea"
        class="big-text-area"
        placeholder="请输入驳回原因"
        maxlength="200"
        show-word-limit
      />
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="sureToBohui"
        >确 定</el-button>
        <el-button size="small" @click="cancelSubmit = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCouponInfoDetail,
  getGoodsDataForCoupon,
  couponReviewOrPass,
  couponPreliminary,
  auditorReviewerApproved,
  reexaminationRejection,
  searchAuditRecords
} from '@/api/marketingTools/coupon.js'
export default {
  name: 'CouponDataDetail',
  components: {},
  // eslint-disable-next-line vue/require-prop-types
  props: [],
  data() {
    return {
      formChoose: this.$route.query.formChoose
        ? this.$route.query.formChoose
        : '',
      fromTab: this.$route.query.fromTab
        ? this.$route.query.fromTab
        : 'couponManager',
      shenheDataArray: [],
      remark: '',
      cancelSubmit: false,
      cancelDialog: false,
      headerCellStyle: {
        'background-color': 'rgb(245, 245, 245)'
      },
      chooseGoodsArray: [],
      form: {},
      couponNo: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.couponNo = this.$route.query.couponNo
    this.loadData()
  },
  methods: {
    goback() {
      const prevPath = this.$route.query.prevPath
      if (this.fromTab === 'couponDetail') {
        if (prevPath) {
          this.$router.push({
            path: prevPath,
            query: {
              fromTab: this.fromTab,
              formChoose: this.formChoose,
              search: this.$route.query.search
            }
          })
        } else {
          this.$router.push({
            name: 'couponDetail',
            query: {
              fromTab: this.fromTab,
              formChoose: this.formChoose,
              search: this.$route.query.search
            }
          })
        }
      } else {
        if (prevPath) {
          this.$router.push({
            path: prevPath,
            query: {
              fromTab: this.fromTab,
              dataType: this.$route.query.dataType,
              search: this.$route.query.search
            }
          })
        } else {
          this.$router.push({
            path:
              '/yxgj/couponManager?fromTab=couponManager&dataType=' +
              this.$route.query.dataType +
              '&search=' +
              this.$route.query.search
          })
        }
      }
    },
    toCancel() {
      this.cancelSubmit = true
    },
    sureToBohui() {
      if (this.remark === '') {
        this.$message.error('请填写驳回原因！')
        return
      }
      if (this.form.auditStatus === 1) {
        const params = {
          auditorType: 2,
          id: this.form.id,
          type: this.form.auditStatus,
          remark: this.remark
        }
        couponPreliminary(params).then(res => {
          if (res.code === 1) {
            this.$message.success('已驳回')
            this.cancelSubmit = false
            this.$router.push({
              name: 'couponManager',
              query: {
                fromTab: this.fromTab,
                dataType: this.$route.query.dataType,
                search: this.$route.query.search
              }
            })
          }
        })
      } else {
        const params = {
          auditorType: 2,
          id: this.form.id,
          type: this.form.auditStatus,
          remark: this.remark
        }
        reexaminationRejection(params).then(res => {
          if (res.code === 1) {
            this.$message.success('已驳回')
            this.cancelSubmit = false
            this.$router.push({
              name: 'couponManager',
              query: {
                fromTab: this.fromTab,
                dataType: this.$route.query.dataType,
                search: this.$route.query.search
              }
            })
          }
        })
      }
    },
    sureToTg() {
      if (this.form.auditStatus === 1) {
        const params = {
          auditorType: 1,
          id: this.form.id,
          type: this.form.auditStatus
        }
        couponReviewOrPass(params).then(res => {
          if (res.code === 1) {
            this.$message.success('初审通过')
            this.cancelDialog = false
            this.$router.push({
              path:
                '/yxgj/couponManager?fromTab=couponManager&dataType=' +
                this.$route.query.dataType +
                '&search=' +
                this.$route.query.search
            })
          }
        })
      } else if (this.form.auditStatus === 3) {
        this.cancelDialog = true
      }
    },
    sureToTongguo() {
      if (this.form.auditStatus === 3) {
        const params = {
          auditorType: 1,
          id: this.form.id,
          type: this.form.auditStatus
        }
        auditorReviewerApproved(params).then(res => {
          if (res.code === 1) {
            this.$message.success('初审通过')
            this.cancelDialog = false
            this.$router.push({
              path:
                '/yxgj/couponManager?fromTab=couponManager&dataType=' +
                this.$route.query.dataType +
                '&search=' +
                this.$route.query.search
            })
          }
        })
      }
    },
    loadData() {
      const params = {
        couponNo: this.couponNo
      }
      getCouponInfoDetail(params).then(res => {
        if (res.code === 1) {
          this.form = res.data
          if (this.form.discountMethod === 1) {
            this.form.discountMethodString = '指定商品满减优惠券'
            const priceArray = this.form.discountContent.split(',')
            this.form.discountContentString =
              '满  ' +
              parseFloat(priceArray[0]) / 100 +
              '  元减  ' +
              parseFloat(priceArray[1]) / 100 +
              '  元'
          } else if (this.form.discountMethod === 2) {
            this.form.discountMethodString = '指定商品直减优惠券'
            this.form.discountContentString =
              '直减  ' + parseFloat(this.form.discountContent) / 100 + '  元'
          } else if (this.form.discountMethod === 3) {
            this.form.discountMethodString = '指定商品折扣优惠券'
            this.form.discountContentString = this.form.discountContent + '  折'
          }
          this.loadGoodsData()
        }
      })
      searchAuditRecords(params).then(res => {
        if (res.code === 1) {
          this.shenheDataArray = res.data
        }
      })
    },
    loadGoodsData() {
      const params = {
        current: 1,
        size: 1000,
        goodsTypes: [3, 4, 5, 8],
        goodIds: this.form.goodsIds
      }
      getGoodsDataForCoupon(params).then(res => {
        if (res.code === 1) {
          this.chooseGoodsArray = res.data.records
        }
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
.entry-box {
  overflow: hidden;
  .add-order-warp {
    padding: 0 20px 20px 20px;
    background: #ffffff;
    min-height: 750px;
    border-radius: 10px;
    .crumbs-box {
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #eff2f6;
    }
    .common-box {
      .common-title {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #333333;
        position: relative;
        padding-left: 12px;
        margin-bottom: 16px;
        &:before {
          position: absolute;
          content: '';
          width: 4px;
          height: 24px;
          background: #0c6fff;
          border-radius: 6px;
          top: 0;
          left: 0;
        }
      }
    }
    .search-order {
      display: flex;
      .search-in {
        margin-right: 10px;
      }
    }
    .order-list {
      max-width: 1200px;
      overflow-x: auto;
      // overflow: scroll;
      // height: 186px;
      background: #ffffff;
    }
    .table-box {
      background: #ffffff;
      max-width: 1200px;
      overflow-x: auto;
      .table-img-box {
        display: flex;
        align-items: center;
        .table-img-box-l {
          width: 64px;
          height: 64px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 6px;
          }
        }
        .table-img-box-r {
          flex: 1;
          margin-left: 8px;
        }
      }
      .table-txt {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #777777;
        line-height: 22px;
        display: -webkit-box;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      .table-txt-del {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #f53f3f;
        cursor: pointer;
      }
      .table-in {
        display: flex;
        align-items: center;
        align-content: space-around;
        :nth-child(1) {
          margin-right: 6px;
        }
        :nth-child(3) {
          margin-left: 2px;
        }
      }
    }

    .input-box {
      width: 296px;
      height: 32px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      font-family: MicrosoftYaHei;
      color: #dcdfe6;
      padding: 0 15px;
    }

    .label-ps {
      margin-top: 8px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #999999;
    }
    .water-header {
      display: flex;
      align-items: center;
      padding-bottom: 16px;
      .water-title {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        position: relative;
        padding-left: 10px;
        &::before {
          position: absolute;
          top: 2px;
          left: 24px;
          content: '*';
          color: #f53f3f;
        }
      }
      .common-title-width {
        width: 92px !important;
        font-size: 14px;
        color: #606266;
        font-weight: bold;
        padding-left: 34px;
      }
      .water-btn {
        width: 132px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        margin-left: 8px;
        cursor: pointer;
        .icon-plus {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
    .water-list {
      .water-child {
        padding: 20px 12px 16px 12px;
        background: #f7fbff;
        border-radius: 8px;
        margin-bottom: 20px;
        overflow: hidden;
        min-width: 1000px;
        .water-child-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .water-child-header-l {
            font-size: 16px;
            font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
            font-weight: bold;
            color: #333333;
          }
          .water-child-header-r {
            width: 68px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #f53f3f;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #f53f3f;
            cursor: pointer;
          }
        }
      }
      .water-child-box {
        .water-child-box-title {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #333333;
          padding-right: 8px;
          text-align: right;
          white-space: nowrap;
          display: inline-block;
          width: 78px;
        }
        .water-child-box-title-max {
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: #777777;
        }
      }
    }
    .pay-box {
      .price-num {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #777777;
        text-align: right;
      }
      .price-common-title {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #333333;
        text-align: right;
        .price-num-green {
          color: #00b42a;
        }
        .price-num-blue {
          color: #0c6fff;
        }
        .price-num-red {
          color: #f53f3f;
        }
      }
      .price-tomast {
        text-align: right;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #f53f3f;
      }
    }
    .foot-box {
      display: flex;
      justify-content: center;
      margin-top: 40px;
    }
    .upload-img {
      display: flex;
      .avatar-uploader-icon-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 90px;
        border-radius: 4px;
        background-color: #f3f3f3;
        margin-right: 10px;
      }
    }
  }
}
.breadcrumb {
  height: 48px;
  border-bottom: 1px solid #dfe4ed;
  padding: 0 20px;
  margin: 0 -20px 20px -20px;
  ::v-deep .el-breadcrumb__inner {
    font-size: 15px;
    font-weight: 500;
    line-height: 48px;
    color: #000;
  }
  .gray {
    ::v-deep .el-breadcrumb__inner {
      color: #777777;
      cursor: pointer;
    }
  }
}
// main end
.nav-list ::v-deep .el-breadcrumb__inner {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold !important;
  color: #777777;
}
.nav-add ::v-deep .el-breadcrumb__inner {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold !important;
  color: #333333;
}
::v-deep .el-icon-arrow-right {
  font-size: 7px !important;
  color: #a9a9a9 !important;
}
::v-deep .el-form-item {
  margin-bottom: 0 !important;
}
// crumbs end
::v-deep .el-form-item__label {
  min-width: 100px !important;
  font-weight: 500 !important;
  // width: 70px !important;
}
.water-child-box ::v-deep .el-form-item {
  margin: 0;
}
.el-form-item.el-form-item--medium {
  display: flex;
  justify-content: flex-start;
}
.form-box {
  min-width: 1600px;
}
.form-box ::v-deep .el-form-item__content {
  margin: 0 !important;
}

.table-box ::v-deep .el-table th.el-table__cell {
  background: #f3f3f3;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
}
.table-in ::v-deep .el-input__inner {
  width: 92px;
}
// table end

.goods-in-num50 ::v-deep .el-input__inner {
  width: 50px;
  text-align: center;
}
.goods-in-num80 ::v-deep .el-input__inner {
  width: 80px;
  text-align: center;
}

.goods-in-num-red ::v-deep .el-input__inner {
  border: 1px solid #f53f3f;
}
::v-deep .el-input__inner {
  height: 32px;
}
.flex-box {
  display: flex;
}
.flex-item {
  align-items: center;
}
.m-r8 {
  margin-right: 8px;
}
.m-r32 {
  margin-right: 32px;
}
.m-t10 {
  margin-top: 10px;
}
.m-t20 {
  margin-top: 20px;
}
.m-b20 {
  margin-bottom: 20px;
}
.m-b16 {
  margin-bottom: 16px;
}
.no-txt {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #f53f3f;
  margin: 16px 0 32px 0;
}
.ok-txt {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #00b42a;
  margin: 16px 0 32px 0;
}
.button-h32 {
  height: 32px;
}
.w-200 ::v-deep .el-input__inner {
  width: 200px;
}
.w-296 ::v-deep .el-input__inner {
  width: 296px;
}
::v-deep .el-input-number--medium {
  width: 296px;
}
.w-496 ::v-deep .el-input__inner {
  width: 496px;
}
::v-deep .table-module {
  padding: 0 !important;
}
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type='number'] {
  -moz-appearance: textfield;
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

.text-area-cls {
  width: 100%;
  float: left;
  ::v-deep .el-form-item__content {
    width: 700px;
  }
  ::v-deep .el-textarea textarea {
    float: left;
    width: 100%;
  }
}
.add-goods-cls {
  width: 100%;
  padding-bottom: 20px;
  padding-left: 25px;
}

.add-coupon-row {
  width: 100%;
}

.submit-row-cls {
  text-align: center;
  width: 1100px;
  margin-top: 30px;
  .submit-row-cls-submit {
    width: 180px;
    margin: 0 auto;
    text-align: center;
  }
}

.input-width {
  width: 296px;
}

.link-in {
  width: 210px;
  margin-top: -8px;
  margin-left: 10px;
}

.time-zdy {
  margin-left: 103px;
}

::v-deep .el-radio__label {
  font-weight: bold;
}

.short-input {
  width: 150px;
  margin-left: 11px;
  margin-right: 11px;
}

.long-input {
  width: 362px;
}

.add-goods-row {
  margin-left: 10px;
  margin-top: 10px;
}
.tips-gs {
  margin-left: 10px;
  font-size: 14px;
  color: #333;
  em {
    padding: 0 5px;
    color: #0c6fff;
    font-style: normal;
  }
}

.add-goods-block {
  width: 100%;
}

.image-previewer {
  float: left;
  width: 80px;
  height: 80px;
  border-radius: 2px;
  margin-right: 10px;
  border: 0;
  vertical-align: middle;
  background: rgb(245, 247, 250);
}
.good-mess-detail {
  float: left;
  width: 320px;
  height: 60px;
  margin-left: 15px;
  p {
    width: 100%;
    line-height: 20px;
    min-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .tips {
    color: #f53f3f;
    line-height: 20px;
    font-size: 12px;
  }
}
.goods-type-price {
  text-align: center;
  font-size: 14px;
  color: #333;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  em {
    font-style: normal;
    margin-right: 10px;
  }
}
.search-price-p {
  width: 100%;
  cursor: pointer;
  text-align: center;
  color: #0c6fff;
}

.tips-red-cls {
  color: #f53f3f;
  width: 100%;
  text-align: center;
  margin-top: 10px;
}
.tips-cls-btn {
  width: 100%;
  display: inline-block;
  text-align: center;
}

::v-deep .el-dialog__header {
  border-bottom: 1px solid #e7e7e7;
}

.big-text-area {
  width: 100%;
  height: 400px;
}

::v-deep .el-textarea__inner {
  height: 405px;
}

.audit-div-cls {
  padding: 3px 10px;
  border-radius: 12px;
  background: #fff2e6;
  display: inline-block;
  img {
    float: left;
    width: 16px;
    height: 16px;
    margin-top: 4px;
    margin-right: 5px;
  }
  p {
    float: left;
    color: #ff7d00;
    font-size: 12px;
  }
}
.audit-bohui-cls {
  background: #feecec;
  p {
    color: #f53f3f;
  }
}
.audit-fushen-cls {
  background: #fff2cc;
  p {
    color: #ffc619;
  }
}
.audit-tongguo-cls {
  background: #e6f7ea;
  p {
    color: #00b42a;
  }
}
</style>

