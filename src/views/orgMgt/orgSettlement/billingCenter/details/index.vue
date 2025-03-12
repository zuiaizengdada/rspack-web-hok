<template>
  <div v-loading="loading" class="coupon-center-add">
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="gray">
        <span @click="goBack">账单总览</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>账单明细</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hok-main">
      <div class="title mb20">
        账单信息
        <el-button
          v-if="billInfo.billNo"
          :loading="exportLoading"
          type="primary"
          class="btn float_r"
          size="mini"
          @click="handleExport"
        >
          导出明细
        </el-button>
      </div>
      <div class="info-cell">
        <span>
          账期<strong>{{ billInfo.billCycle || '--' }}</strong>
        </span>
        <span>
          账单编号
          <strong>
            {{ billInfo.billNo || '--' }}
            <i
              class="el-icon-document-copy icon-copy"
              @click="copyBtn(billInfo.billNo)"
            />
          </strong>
        </span>
        <span>
          机构名称<strong>{{ billInfo.tenantName || '--' }}</strong>
        </span>
      </div>
      <div class="details-settlement-table">
        <BlueTable
          :columns="totalConfig.columns"
          :table-data="totalConfig.tableData"
        />
      </div>
      <div class="title mt20 mb20">费用信息</div>
      <BlueTable
        :columns="billChargerConfig.columns"
        :table-data="billChargerConfig.tableData"
        :option-obj="billChargerConfig.optionObj"
        :disabled="settlementDis"
      />
      <template v-if="billDiscountsConfig.tableData.length">
        <div class="title mt20 mb20">优惠信息</div>
        <BlueTable
          :columns="billDiscountsConfig.columns"
          :table-data="billDiscountsConfig.tableData"
        />
      </template>
      <template v-if="payConfig.tableData.length">
        <div class="title mt20 mb20">支付信息</div>
        <BlueTable
          :columns="payConfig.columns"
          :table-data="payConfig.tableData"
        />
      </template>
    </div>
    <div v-if="pageType === 'settlement' && billInfo.status === 2" class="btns">
      <el-button
        type="primary"
        class="btn"
        size="small"
        @click="handleSettlement"
      >
        去结算
      </el-button>
    </div>
    <div v-if="pageType === 'confirm' && billInfo.status === 4" class="btns">
      <el-button class="btn" size="small" @click="goBack"> 返回列表 </el-button>
      <el-button type="primary" class="btn" size="small" @click="handleConfirm">
        确认账单
      </el-button>
    </div>
  </div>
</template>

<script>
import BlueTable from './cpn/blueTable.vue'

import {
  getBillDetailApi,
  listBillChargesApi,
  listBillDiscountsApi,
  getBillSettlementRecordApi,
  expenseTypeApi,
  billExportApi,
  confirmBillApi
} from '@/api/orgSettlement/billingCenter.js'
import { feesOpts, billtables } from '../data.js'

import { cloneDeep } from 'lodash'
import { copy } from '@/utils'
export default {
  name: 'BillingCenterDetails',
  components: {
    BlueTable
  },
  data() {
    return {
      loading: false,
      exportLoading: false,
      pageType: null,
      billInfo: {},
      totalConfig: {
        tableData: [],
        columns: cloneDeep(feesOpts.detailTotalTable)
      },
      billChargerConfig: {
        tableData: [],
        optionObj: { expenseType: [] },
        columns: [
          ...billtables.feesColumns,
          {
            prop: 'action',
            type: 'button',
            btns: [
              {
                label: '用量明细',
                fn: this.goUsageDetails
              }
            ],
            label: '操作',
            minWidth: 142
          }
        ]
      },
      billDiscountsConfig: {
        tableData: [],
        columns: billtables.preColumns
      },
      payConfig: {
        tableData: [],
        columns: billtables.payColumns
      },
      expenseTypeOption: [
        {
          code: 1,
          message: '账号付费'
        },
        {
          code: 2,
          message: '按量付费'
        },
        {
          code: 3,
          message: 'GMV付费'
        }
      ]
    }
  },
  computed: {
    settlementDis() {
      console.log(this.billInfo.billCycle)
      // 2024 3~5月不能点击用量明细
      return ['2024-03', '2024-04', '2024-05'].includes(this.billInfo.billCycle)
    }
  },
  created() {
    if (this.$route.query?.billNo) {
      this.getOptions()
      this.init(this.$route.query.billNo)
      this.pageType = this.$route.query.type
    } else {
      this.$message.error('当前数据无账单编号')
      this.goBack()
    }
  },
  methods: {
    async init(billNo) {
      this.loading = true
      try {
        const { data } = await getBillDetailApi({ billNo })
        this.billInfo = data
        if ([2, 3].includes(data.status)) {
          this.getBillSettlementRecord(billNo)
          this.totalConfig.columns.push({
            prop: 'paidAmount',
            label: '实付金额',
            className: ['total-price'],
            type: 'price',
            labelTips: '当前机构账单实付金额总计。'
          })
        }
        this.totalConfig.tableData = [data]
        this.getTable(billNo)
      } catch (error) {
        console.log('grantCouponApi-------error', error)
      }
      this.loading = false
    },
    getOptions() {
      expenseTypeApi().then(res => {
        this.$set(
          this.billChargerConfig.optionObj,
          'expenseType',
          res.data || []
        )
        // this.billChargerConfig.optionObj.expenseType = res.data || []
      })
    },
    // 获取费用信息 / 优惠信息
    getTable(billNo) {
      listBillChargesApi({ billNo }).then(res => {
        this.billChargerConfig.tableData = res.data || []
      })
      listBillDiscountsApi({ billNo }).then(res => {
        this.billDiscountsConfig.tableData = res.data || []
      })
    },
    // 支付信息 获取
    getBillSettlementRecord(billNo) {
      getBillSettlementRecordApi({ billNo }).then(res => {
        this.payConfig.tableData = res.data || []
      })
    },
    handleSettlement() {
      const prevPath = this.$route.query?.prevPath
      this.$router.push({
        name: 'BillingCenterSettlement',
        query: {
          prevPath: JSON.stringify([
            { path: prevPath, name: '账单中心' },
            {
              path: this.$route.path,
              name: '账单详情',
              query: this.$route.query
            }
          ]),
          billNo: this.billInfo.billNo
        }
      })
    },
    handleConfirm() {
      if (this.loading) return
      this.$confirm('账单已确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(async () => {
        this.loading = true
        try {
          await confirmBillApi({
            billNo: this.billInfo.billNo
          })
          this.$message.success('已提交结算')
          this.goBack()
        } catch (error) {
          console.log('grantCouponApi-------error', error)
        }
        this.loading = false
      })
    },
    goUsageDetails(row) {
      const prevPath = this.$route.query?.prevPath
      const isPt = !prevPath.includes('orgFees')
      this.$router.push({
        name: isPt
          ? 'BillingCenterUsageDetails'
          : 'FeesBillingCenterUsageDetails',
        query: {
          prevPath: JSON.stringify([
            { path: prevPath, name: '账单中心' },
            {
              path: this.$route.path,
              name: '账单详情',
              query: this.$route.query
            }
          ]),
          billCycle: this.billInfo.billCycle + '-01',
          tenantId: this.billInfo.tenantId,
          code: row.productChargesItemNo
        }
      })
    },
    handleExport() {
      this.exportLoading = true
      billExportApi({
        billNo: this.billInfo.billNo,
        tenantName: this.billInfo.tenantName
      })
        .then(res => {
          this.exportLoading = false
          window.location = res.data
          window.open(res.data, '_self')
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    copyBtn(txt) {
      copy(txt)
      this.$message.success('复制成功')
    },
    goBack(path) {
      const prevPath = this.$route.query?.prevPath
      if (prevPath) {
        this.$router.replace({
          path: prevPath
        })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.float_r {
  float: right;
}
.coupon-center-add {
  min-width: 1100px;
  width: 100%;
  background: #fff;
  padding: 0;
  border-radius: 5px;
  position: relative;
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
    width: 100%;
    .mb20 {
      margin-bottom: 20px;
    }
    .mt20 {
      margin-top: 20px;
    }
    .icon-copy {
      cursor: pointer;
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
  }
}
::v-deep .details-settlement-table {
  .el-table {
    border-radius: 8px;
  }
  .el-table--border {
    border-radius: 8px;
  }
  .el-table th.el-table__cell.is-leaf,
  .el-table td.el-table__cell {
    border-bottom: none;
  }
  thead tr {
    th {
      &.el-table__cell.is-leaf {
        padding-left: 12px;
      }
      background-color: #ebf7ff;
      &:first-child {
        border-radius: 8px 0 0 0;
      }
      &:nth-last-child(2) {
        border-radius: 0 8px 0 0;
      }
      .cell {
        padding: 0 4px !important;
        color: #5c6387;
        .tipsText {
          color: #5c6387;
        }
      }
    }
  }
  tbody tr {
    td {
      &:first-child {
        border-radius: 0 0 0 8px;
      }

      &:last-child {
        border-radius: 0 0 8px 0;
      }
    }
  }
  .cell {
    color: #777777;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
    padding: 16px 10px 16px 12px;
    text-align: left;
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
</style>
