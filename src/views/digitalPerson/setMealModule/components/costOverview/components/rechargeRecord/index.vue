<template>
  <div class="wrapper">
    <div class="page_top">
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        class="form-breadcrumb"
      >
        <el-breadcrumb-item :to="{ path: '/orgSettlement/setMealModule' }">
          <span style="color: #777777">数字人</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>充值记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-divider />
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
    >
      <template #orgId>
        <el-select
          v-model="formOpts.formData.orgId"
          filterable
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in orgList"
            :key="item.organizationId"
            :label="item.name"
            :value="item.organizationId"
          />
        </el-select>
      </template>
      <template #orderStatus>
        <el-select
          v-model="formOpts.formData.orderStatus"
          clearable
          placeholder="请选择"
        >
          <el-option label="待支付" :value="1" />
          <el-option label="支付成功" :value="2" />
          <el-option label="取消支付" :value="3" />
        </el-select>
      </template>
    </HokSearchForm>
    <CustomTable
      ref="customTableRef"
      height="490px"
      :columns="columns"
      :get-list="getList"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    >
      <template v-slot:orderStatus="{ scope }">
        <div v-if="scope.row.orderStatus === 1" class="status-treatPay">
          <img
            src="@/assets/image/aigc/digitalVideoManage/time@3x.png"
            alt=""
          />
          待支付
        </div>
        <div v-if="scope.row.orderStatus === 2" class="status-treatPay-text">
          <img
            src="@/assets/image/aigc/digitalVideoManage/check-circle-filled@3x.png"
            alt=""
          />
          支付完成
        </div>
        <div
          v-if="scope.row.orderStatus === 3"
          class="status-treatPay-text-cancel"
        >
          <img
            src="@/assets/image/aigc/digitalVideoManage/close-circle-filledv.png"
            alt=""
          />
          取消支付
        </div>
      </template>
      <template v-slot:operate="{ scope }">
        <el-button
          v-if="scope.row.orderType === 1 && scope.row.orderStatus === 1"
          type="primary"
          @click="handleReceivePayment(scope.row)"
        >
          确认收款
        </el-button>
        <el-button
          v-if="scope.row.orderType === 2 && scope.row.orderStatus === 1"
          type="primary"
          @click="handleConfirmGift(scope.row)"
        >
          确认赠送
        </el-button>
      </template>
    </CustomTable>
    <SubmitGiftDialog
      v-model="submitGiftDialogVisible"
      :row-data="rowData"
      @success="searchFn"
    />
    <ReceivePaymentDialog
      v-model="receivePaymentDialogVisible"
      :row-data="rowData"
      @success="searchFn"
    />
  </div>
</template>
<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import CustomTable from '@/components/baseCpns/table'
import { columns, formConfig } from './columns'
import SubmitGiftDialog from './components/submitGiftDialog'
import ReceivePaymentDialog from './components/receivePaymentDialog'
import {
  getPayRecordPage,
  getOrganizationByName
} from '@/api/aiVideoManage/setMealModule'
import { filterPrice } from '@/utils/index'
export default {
  name: 'OrgListDialog',
  components: {
    HokSearchForm,
    CustomTable,
    SubmitGiftDialog,
    ReceivePaymentDialog
  },
  data() {
    return {
      columns,
      formOpts: {
        ...formConfig,
        operatorList: [
          {
            label: '查询',
            bind: { plain: true },
            fn: () => {
              this.searchFn()
            }
          },
          {
            label: '重置',
            type: 'plain',
            fn: () => {
              this.searchFn(true)
            }
          }
        ]
      },
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      submitGiftDialogVisible: false,
      receivePaymentDialogVisible: false,
      orgList: [],
      rowData: {}
    }
  },
  created() {
    this.formOpts.formData.orgId = this.$route.query?.orgId
      ? Number(this.$route.query?.orgId)
      : undefined
  },
  mounted() {
    this.searchFn()
    this.getOrganizationByName()
  },
  methods: {
    getOrganizationByName() {
      getOrganizationByName({ searchKey: '' })
        .then(res => {
          const { data } = res
          this.orgList = data
        })
        .catch(() => {})
    },
    handleReceivePayment(row) {
      this.rowData = row
      this.receivePaymentDialogVisible = true
    },
    handleConfirmGift(row) {
      this.rowData = row
      this.submitGiftDialogVisible = true
    },
    dialogBeforeClose() {
      this.$emit('change', false)
    },
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.searchFn(false, false)
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.searchFn()
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      if (isClear) {
        this.tableConfig.pageSize = 10
        this.formOpts.formData = {}

        // this.formOpts.formData.orgId = this.$route.query?.orgId
        //   ? Number(this.$route.query?.orgId)
        //   : undefined
      }
      this.$refs.customTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        ...this.tableConfig,
        ...this.formOpts.formData,
        orgId: this.formOpts.formData.orgId
      }
      if (params.times && params.times.length) {
        params.startTime = params.times[0]
        params.endTime = params.times[1]
        delete params.times
      }
      return new Promise((resolve, reject) => {
        getPayRecordPage(params).then(res => {
          res.data.items.forEach(item => {
            item.orderTypeName = item.orderType === 1 ? '购买' : '赠送'
            item.payTotalMap = item.payTotal
          })
          resolve(res)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  background-color: #fff;
  padding: 20px;
}
.footer {
  position: absolute;
  height: 68px;
  bottom: 0;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.status-treatPay {
  color: #ff7d00;
  text-align: center;
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  display: flex;
  align-items: center;
  border-radius: 12px;
  width: 74px;
  height: 24px;
  padding: 0 8px;
  background: #fff2e6;
  display: flex;
  align-items: center;
  img {
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }
}
.status-treatPay-text {
  color: #00b42a;
  text-align: center;
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  border-radius: 12px;
  background: #e6f7ea;
  width: 86px;
  height: 24px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  img {
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }
}
.status-treatPay-text-cancel {
  color: #ff0000;
  text-align: center;
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  border-radius: 12px;
  background: #feecec;
  width: 86px;
  height: 24px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  img {
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }
}
::v-deep {
  .org-list-dialog {
    .el-drawer__header {
      padding-bottom: 20px !important;
      margin-bottom: 0 !important;
      border-bottom: 1px solid #eff2f6;
      span {
        font-size: 16px;
        color: #000;
        font-weight: 600;
        font-family: 'Microsoft YaHei';
        letter-spacing: 1px;
      }
    }
    .el-drawer__body {
      padding: 20px 23px 68px 23px;
    }
  }
}
</style>
