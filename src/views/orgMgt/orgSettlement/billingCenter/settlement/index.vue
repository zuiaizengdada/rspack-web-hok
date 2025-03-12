<template>
  <div v-loading="loading" class="coupon-center-add">
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="gray">
        <span class="pointer" @click="goBack(0)">账单总览</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="gray">
        <span class="pointer" @click="goBack(1)">账单明细</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span>账单结算</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hok-main">
      <div class="title mb20">账单信息</div>
      <div class="info-cell">
        <span>
          账期<strong>{{ billInfo.billCycle || '--' }}</strong>
        </span>
        <span>
          账单编号<strong>{{ billInfo.billNo || '--' }}</strong>
        </span>
        <span>
          机构名称<strong>{{ billInfo.tenantName || '--' }}</strong>
        </span>
      </div>
      <div class="settlement-table">
        <BlueTable
          :columns="totalConfig.columns"
          :table-data="totalConfig.tableData"
        />
      </div>
      <div class="title mt20 mb20">结算信息</div>
      <div class="settlement-cell">
        <el-form
          ref="settlementRef"
          label-position="left"
          :model="form"
          :rules="rules"
        >
          <div class="settlement-title">结算金额</div>
          <el-form-item label="支付时间" class="flex plr20" prop="paymentTime">
            <el-date-picker
              v-model="form.paymentTime"
              class="w256"
              type="datetime"
              placeholder="选择日期时间"
              default-time="00:00:00"
            />
          </el-form-item>

          <div class="flex flex-between plr20 bt1 pt15">
            <div class="flex">
              <div class="flex">
                <span class="settlement-txt"> 费用凭证 </span>
                <UploadFile
                  @change="value => uploadChange(value, 'paymentVoucher')"
                />
              </div>
              <div class="flex ml45">
                <span class="settlement-txt"> 发票凭证 </span>
                <UploadFile
                  @change="value => uploadChange(value, 'invoiceVoucher')"
                />
              </div>
              <div class="desc">
                只能上传.pdf,.jpg,.png,.jpeg格式文件,大小不能超过20M
              </div>
            </div>
            <el-form-item label="结算金额" class="flex" prop="settleAmount">
              <el-input
                v-model="form.settleAmount"
                class="w229"
                type="number"
                placeholder="请输入结算金额"
                clearable
              >
                <span slot="prefix" class="unit">￥</span>
              </el-input>
            </el-form-item>
          </div>
        </el-form>
        <div />
      </div>
    </div>
    <div class="btns">
      <el-button
        type="primary"
        class="btn"
        size="small"
        @click="handleSettlement"
      >
        确认结算
      </el-button>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import Decimal from 'decimal.js'
import moment from 'moment'
import BlueTable from '../details/cpn/blueTable.vue'
import UploadFile from './cpns/uploadFile.vue'

import {
  getBillDetailApi,
  billSettlementApi
} from '@/api/orgSettlement/billingCenter.js'
import { feesOpts } from '../data.js'
export default {
  name: 'BillingCenterSettlement',
  components: {
    BlueTable,
    UploadFile
  },
  data() {
    const settleAmountValid = (rule, value, callback) => {
      // const number = Number(this.form.settleAmount)
      // if (!/^\d+(\.\d{1,2})?$/.test(number)) {
      //   callback(new Error('仅限输入2位小数'))
      // } else {
      //   callback()
      // }
      callback()
    }
    return {
      loading: false,
      pageType: null,
      billInfo: {},
      totalConfig: {
        tableData: [],
        columns: cloneDeep(feesOpts.detailTotalTable)
      },
      form: {
        billNo: '', // 账单编号
        invoiceVoucher: '', // 发票凭证
        paymentVoucher: '', // 支付凭证 费用凭证
        remark: '', // 备注说明
        paymentTime: null, // 支付时间
        settleAmount: undefined // 结算金额，单位为分
      },
      rules: {
        paymentTime: [
          { required: true, message: '请选择支付时间', trigger: 'change' }
        ],
        settleAmount: [
          { required: true, message: '请输入结算金额', trigger: 'blur' },
          { validator: settleAmountValid, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.$route.query?.billNo) {
      this.init(this.$route.query.billNo)
      this.form.billNo = this.$route.query.billNo
    } else {
      this.$message.error('当前数据无账单编号')
      this.goBack()
    }
    this.totalConfig.columns.push({
      prop: 'paidAmount',
      label: '实付金额',
      className: ['total-price'],
      type: 'price',
      labelTips: '当前机构账单实付金额总计。'
    })
  },
  methods: {
    async init(billNo) {
      this.loading = true
      try {
        const { data } = await getBillDetailApi({ billNo })
        this.billInfo = data
        this.totalConfig.tableData = [data]
      } catch (error) {
        console.log('grantCouponApi-------error', error)
      }
      this.loading = false
    },
    handleSettlement() {
      this.$refs.settlementRef.validate(async v => {
        if (!v) return
        if (!this.form.paymentVoucher) {
          this.$message.error('请上传费用凭证')
          return
        }
        if (!this.form.invoiceVoucher) {
          this.$message.error('请上传发票凭证')
          return
        }
        this.loading = true
        const req = cloneDeep(this.form)
        if (req.paymentTime) {
          req.paymentTime =
            moment(req.paymentTime).format('YYYY-MM-DD') + ' 00:00:00'
        }
        if (req.settleAmount) {
          req.settleAmount = Decimal(req.settleAmount).mul(100)
        }
        try {
          await billSettlementApi(req).then(res => {
            this.$message.success('已提交结算')
            this.goBack(0)
          })
        } catch (error) {
          console.log('billSettlementApi---------error', billSettlementApi)
          // this.$message.error(error.message)
        }
        this.loading = false
      })
    },
    uploadChange(value, key) {
      this.$set(this.form, key, value[0].url)
    },

    goBack(index) {
      let prevPath = this.$route.query?.prevPath
      if (typeof prevPath === 'string') prevPath = JSON.parse(prevPath)
      if (prevPath) {
        this.$router.replace({
          path: prevPath[index].path,
          query: prevPath[index].query
        })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.w229 {
  width: 229px;
}
.w256 {
  width: 256px;
}
@import '~@/styles/variables.scss';
.coupon-center-add {
  min-width: 1100px;
  width: 100%;
  background: #fff;
  padding: 0;
  border-radius: 5px;
  position: relative;
  .pointer {
    cursor: pointer;
  }
  .breadcrumb {
    height: 48px;
    border-bottom: 1px solid #dfe4ed;
    padding: 0 20px;
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
  .hok-main {
    @include responsive-height(68px);
    overflow-y: auto;
    padding: 25px 20px 92px 20px;
    .mb20 {
      margin-bottom: 20px;
    }
    .mt20 {
      margin-top: 20px;
    }
    .ml45 {
      margin-left: 45px;
    }
    .mb15 {
      margin-bottom: 15px;
    }
    .title {
      color: #000000;
      text-align: center;
      font-family: 'Microsoft YaHei';
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 18px;
      padding-left: 11px;
      text-align: left;
      position: relative;

      &::before {
        content: '';
        height: 100%;
        width: 2px;
        background: #0c6fff;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .info-cell {
      height: 49px;
      flex-shrink: 0;
      border-radius: 8px;
      border: 1px solid #eff2f6;
      background: #fbfcff;
      line-height: 49px;
      margin-bottom: 20px;
      padding: 0 13px;
      span {
        color: #4a4a4a;
        font-family: 'Microsoft YaHei';
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 16px;
        strong {
          margin: 0 30px 0 18px;
        }
      }
    }
    .settlement-cell {
      height: auto;
      flex-shrink: 0;
      border-radius: 8px;
      border: 1px solid #dcdee1;
      background: #fff;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      padding: 20px 0 0 0;
      .settlement-title {
        color: #000000;
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 18px;
        padding: 0 20px 15px 20px;
        text-align: left;
        position: relative;
      }
      .plr20 {
        padding: 0 20px;
      }
      .pt15 {
        padding-top: 15px;
      }
      .bt1 {
        border-top: 1px solid #dcdee1;
      }
      .settlement-txt {
        color: rgb(0, 0, 0);
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 32px;
        margin-right: 16px;
      }
      .desc {
        color: rgb(119, 119, 119);
        font-size: 14px;
        line-height: 32px;
        margin-left: 20px;
      }
      .unit {
        color: #000000;
        font-size: 14px;
        margin-left: 4px;
      }
    }
  }

  .btns {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    padding: 20px 0;
    box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, 5%);
    border-radius: 0 0 5px 5px;
    background: #fff;
    z-index: 1;
    .btn {
      width: 217px;
    }
  }
}
::v-deep {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
  .settlement-table {
    .cell {
      color: #777777;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 14px;
    }
    thead th {
      background-color: #e7e7e7;
      .cell {
        color: #5c6387;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 14px;
      }
    }
  }
}
</style>
