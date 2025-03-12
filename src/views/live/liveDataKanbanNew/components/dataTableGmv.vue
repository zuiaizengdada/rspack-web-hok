<template>
  <div class="bill-fees-home">
    <MTitle>GMV</MTitle>
    <div>
      <HokSearchForm
        :form-opts="formOptsGMVForm"
        :ref-obj.sync="formOptsGMVForm.ref"
        class="pd20 sh-top"
      >
        <template #time>
          <el-date-picker
            v-model="formOptsGMVForm.formData.time"
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
          <el-input v-model="formOptsGMVForm.formData.phone" maxlength="11" placeholder="请输入手机号码" @blur="searchFn" />
        </template>
      </HokSearchForm>
    </div>
    <kanBantable
      ref="zbTableRefGmv"
      :columns="columns"
      :get-list="getList"
      :hb-line="6"
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
      <template v-slot:orderChannel="{scope}">
        {{ scope.row.orderChannel | getOptionsValue(channelSourceType) }}
      </template>
      <template v-slot:liveName="{scope}">
        {{ scope.row.liveName? scope.row.liveName:'-' }}
      </template>
      <template v-slot:scriptName="{scope}">
        {{ scope.row.scriptName? scope.row.scriptName:'-' }}
      </template>
      <template v-slot:courseName="{scope}">
        {{ scope.row.courseName? scope.row.courseName:'-' }}
      </template>
      <template v-slot:payAmount="{scope}">
        {{ filterPrice(scope.row.payAmount) }}
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
import { curwordGmvOpts, gmvColumns } from './tableData.js'
import { cloneDeep } from 'lodash'
import kanBantable from './newTable.vue'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { mapGetters } from 'vuex'
import { filterPrice } from '@/utils/index.js'
import { getOptionsValue } from '@/filters'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'

import {
  getGmvPageData // 所有直播间数据看板-直播数据统计
} from '@/api/liveRoom/kanban.js'
export default {
  components: {
    HokSearchForm,
    kanBantable,
    tablePhoneItem
  },
  data() {
    return {
      columns: gmvColumns,
      formOptsGMVForm: {
        ...cloneDeep(curwordGmvOpts.form),
        operatorList: [
          { label: '查询', type: 'primary', fn: this.searchFn, bind: { plain: true } }
        ]
      },
      loading: false,
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    ...mapGetters(['channelSourceType'])
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
  },
  methods: {
    getOptionsValue,
    filterPrice,
    init(data) {
      this.formOptsGMVForm.form = { ...data }
      this.formOptsGMVForm.formData.userId = data.userId
      this.formOptsGMVForm.formData.time = data.time.time
      this.$refs.zbTableRefGmv.init()
    },
    getList() {
      const params = {
        ...this.tableConfig,
        phone: this.formOptsGMVForm.formData.phone ? this.formOptsGMVForm.formData.phone : '',
        teacherId: this.formOptsGMVForm.formData.userId ? this.formOptsGMVForm.formData.userId : '',
        startDate: this.formOptsGMVForm.formData.time && this.formOptsGMVForm.formData.time[0] ? this.formOptsGMVForm.formData.time[0] : '',
        endDate: this.formOptsGMVForm.formData.time && this.formOptsGMVForm.formData.time[1] ? this.formOptsGMVForm.formData.time[1] : ''
      }
      console.log('UUUUUUUUUUUUUU:', params)
      return getGmvPageData(params)
    },
    searchFn() {
      this.tableConfig.pageIndex = 1
      this.$refs.zbTableRefGmv.init()
    },
    clearFn() {
      this.formOptsGMVForm.ref.resetFields()
      this.formOptsGMVForm.formData = cloneDeep(curwordGmvOpts.form.formData)
      this.$refs.zbTableRefGmv.init()
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.$refs.zbTableRefGmv.init()
    },
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.$refs.zbTableRefGmv.init()
    },
    handleSearch() {
      this.tableConfig.currentPage = 1
      this.$refs.zbTableRefGmv.init()
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
