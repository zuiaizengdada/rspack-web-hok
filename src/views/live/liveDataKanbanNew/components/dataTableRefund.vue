<template>
  <div class="bill-fees-home">
    <MTitle>退款明细</MTitle>
    <div>
      <HokSearchForm
        :form-opts="formOptsDataTableRefund"
        :ref-obj.sync="formOptsDataTableRefund.ref"
        class="pd20 sh-top"
      >
        <template #time>
          <el-date-picker
            v-model="formOptsDataTableRefund.formData.time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="false"
            @change="searchFn"
          />
        </template>
        <template #phone>
          <el-input v-model="formOptsDataTableRefund.formData.phone" maxlength="11" placeholder="请输入手机号码" @blur="searchFn" />
        </template>
      </HokSearchForm>
    </div>
    <kanBantable
      ref="zbTableRefundRef"
      :columns="columns"
      :is-pages="true"
      :get-list="getList"
      :hb-line="4"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    >
      <template v-slot:userName="{scope}">
        {{ scope.row.userName? scope.row.userName:'-' }}
      </template>
      <template v-slot:phone="{scope}">
        <span v-if="scope.row.phoneAreaCode">
          (+{{ scope.row.phoneAreaCode }})
        </span>
        <tablePhoneItem
          v-model="scope.row.phone"
          :row-data="{ uid: scope.row.userId }"
          type="user"
        />
      </template>
      <template v-slot:courseName="{scope}">
        {{ scope.row.courseName? scope.row.courseName:'-' }}
      </template>
      <template v-slot:payAmount="{scope}">
        {{ filterPrice(scope.row.payAmount) }}
      </template>
      <template v-slot:refundAmount="{scope}">
        {{ filterPrice(scope.row.refundAmount) }}
      </template>
      <template v-slot:orderNo="{scope}">
        {{ scope.row.orderNo?scope.row.orderNo:'-' }}
      </template>
      <template v-slot:orderStatus="{scope}">
        <span v-if="scope.row.orderStatus === 0">未支付</span>
        <span v-if="scope.row.orderStatus === 1">支付成功</span>
        <span v-if="scope.row.orderStatus === 4">用户已取消</span>
        <span v-if="scope.row.orderStatus === 5">退款中</span>
        <span v-if="scope.row.orderStatus === 3">部分退款</span>
        <span v-if="scope.row.orderStatus === 2">已退款</span>
        <span v-if="scope.row.orderStatus === 8">交易结束</span>
        <span v-if="scope.row.orderStatus === 9">没有向第三方发起支付请求</span>
        <span v-if="scope.row.orderStatus === 10">退款金额异常</span>
        <span v-if="scope.row.orderStatus === 11">部分付款</span>
        <span v-if="scope.row.orderStatus === 12">转课关闭</span>
      </template>
    </kanBantable>
  </div>
</template>

<script>
import { curwordRefundOpts, refundOptsColumns } from './tableData.js'
import { cloneDeep } from 'lodash'
import kanBantable from './newTable.vue'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { filterPrice } from '@/utils/index.js'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import {
  getRefundPageData // 所有直播间数据看板-直播数据统计
} from '@/api/liveRoom/kanban.js'
export default {
  components: {
    HokSearchForm,
    kanBantable,
    tablePhoneItem
  },
  props: {
    teacherId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      columns: refundOptsColumns,
      formOptsDataTableRefund: {
        ...cloneDeep(curwordRefundOpts.form),
        operatorList: [
          { label: '查询', type: 'primary', fn: this.searchFn, bind: { plain: true } }
        ]
      },
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        basics: cloneDeep(curwordRefundOpts.table)
      },
      loading: false,
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },

  created() {

  },
  methods: {
    filterPrice,
    init(data) {
      console.log('到refund表格：', data)
      this.formOptsDataTableRefund.form = { ...data }
      this.formOptsDataTableRefund.formData.time = data.time.time
      this.$refs.zbTableRefundRef.init()
    },
    getList() {
      const params = {
        ...this.tableConfig,
        phone: this.formOptsDataTableRefund.formData.phone ? this.formOptsDataTableRefund.formData.phone : '',
        teacherId: this.teacherId ? this.teacherId : '',
        startDate: this.formOptsDataTableRefund.formData.time && this.formOptsDataTableRefund.formData.time[0] ? this.formOptsDataTableRefund.formData.time[0] : '',
        endDate: this.formOptsDataTableRefund.formData.time && this.formOptsDataTableRefund.formData.time[1] ? this.formOptsDataTableRefund.formData.time[1] : ''
      }
      return getRefundPageData(params)
    },
    searchFn() {
      this.tableConfig.pageIndex = 1
      this.$refs.zbTableRefundRef.init()
    },
    clearFn() {
      this.formOpts.ref.resetFields()
      this.formOpts.formData = cloneDeep(curwordRefundOpts.form.formData)
      this.$refs.zbTableRefundRef.init()
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.$refs.zbTableRefundRef.init()
    },
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.$refs.zbTableRefundRef.init()
    },
    handleSearch() {
      this.tableConfig.pageIndex = 1
      this.$refs.zbTableRefundRef.init()
    }
  }
}
</script>

  <style lang="scss" scoped>
  @import '~@/styles/variables.scss';
  .sh-top {
      margin-top: 18px;
  }
  .coupon-table {
      flex: 1;
      overflow: hidden;
      .title {
        color: #161616;
        font-family: 'PingFang SC';
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
      }
      .txt {
        color: #161616;
        font-family: 'PingFang SC';
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
      }
      .blue-desc {
        color: #0c6fff;
        font-family: 'PingFang SC';
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
      }
      .orange-desc {
        color: #ff7d00;
        font-family: 'PingFang SC';
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
      }
      .grey-desc {
        color: #999999;
        font-family: 'PingFang SC';
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
      }
      .audit-status-box {
        font-family: 'PingFang SC';
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        padding: 0 10px;
        display: inline-block;
        position: relative;
        &.audit-status1 {
          padding-left: 24px;
          color: #ff7d00;
          flex-shrink: 0;
          border-radius: 12px;
          background: #fff2e6;
          &::before {
            content: '';
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            height: 12px;
            width: 12px;
            background: url('~@/assets/image/coupon/icn_chushen.png') no-repeat;
            background-size: 100%;
          }
        }
        &.audit-status2 {
          padding-left: 24px;
          color: #f53f3f;
          flex-shrink: 0;
          border-radius: 12px;
          background: #feecec;
          &::before {
            content: '';
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            height: 12px;
            width: 12px;
            background: url('~@/assets/image/coupon/icn_bohui.png') no-repeat;
            background-size: 100%;
          }
        }
        &.audit-status3 {
          padding-left: 24px;
          color: #00b42a;
          flex-shrink: 0;
          border-radius: 12px;
          background: #e6f7ea;
          &::before {
            content: '';
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            height: 12px;
            width: 12px;
            background: url('~@/assets/image/coupon/icn_check.png') no-repeat;
            background-size: 100%;
          }
        }
      }
    }
  </style>
