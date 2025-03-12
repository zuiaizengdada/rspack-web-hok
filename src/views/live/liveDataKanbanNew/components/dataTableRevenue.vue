<template>
  <div class="bill-fees-home">
    <MTitle>营收明细</MTitle>
    <div>
      <HokSearchForm
        :form-opts="formOptsDataTableRevenue"
        :ref-obj.sync="formOptsDataTableRevenue.ref"
        class="pd20 sh-top"
      >
        <template #time>
          <el-date-picker
            v-model="formOptsDataTableRevenue.formData.time"
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
          <el-input v-model="formOptsDataTableRevenue.formData.phone" maxlength="11" placeholder="请输入手机号码" @blur="searchFn" />
        </template>
      </HokSearchForm>
    </div>
    <kanBantable
      ref="zbTableRef"
      :columns="columnsForTable"
      :is-pages="true"
      :get-list="getList"
      :hb-line="7"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    >
      <template v-slot:userName="{scope}">
        {{ scope.row.userName }}
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
        {{ returnChangeLabel(scope.row.orderChannel) }}
      </template>
      <template v-slot:liveName="{scope}">
        {{ scope.row.liveName ?scope.row.liveName: '-' }}
      </template>
      <template v-slot:scriptName="{scope}">
        {{ scope.row.scriptName ?scope.row.scriptName:'-' }}
      </template>
      <template v-slot:payAmount="{scope}">
        {{ filterPrice(scope.row.payAmount) }}
      </template>

    </kanBantable>
  </div>
</template>

<script>
import { curwordOpts, columnsForRevenueClom } from './tableData.js'
import { cloneDeep } from 'lodash'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import kanBantable from './newTable.vue'
import { mapGetters } from 'vuex'
import { filterPrice } from '@/utils/index.js'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import {
  getRevenuePage // 所有直播间数据看板-直播数据统计
} from '@/api/liveRoom/kanban.js'
import moment from 'moment'

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
      columnsForTable: columnsForRevenueClom,
      formOptsDataTableRevenue: {
        ...cloneDeep(curwordOpts.form),
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
        basics: cloneDeep(curwordOpts.table)
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
    // this.formOptsDataTableRevenue.formData.time = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
  },
  methods: {
    filterPrice,
    returnChangeLabel(channel) {
      let returnString = ''
      this.channelSourceType.some(item => {
        if (item.value === channel) {
          returnString = item.label
        }
      })
      return returnString
    },
    moment,
    init(data) {
      this.formOptsDataTableRevenue.formData.time = data.time.time
      this.$refs.zbTableRef.init()
    },
    getList() {
      const params = {
        ...this.tableConfig,
        phone: this.formOptsDataTableRevenue.formData.phone,
        teacherId: this.teacherId ? this.teacherId : '',
        startDate: this.formOptsDataTableRevenue.formData.time && this.formOptsDataTableRevenue.formData.time[0] ? this.formOptsDataTableRevenue.formData.time[0] : '',
        endDate: this.formOptsDataTableRevenue.formData.time && this.formOptsDataTableRevenue.formData.time[1] ? this.formOptsDataTableRevenue.formData.time[1] : ''
      }
      return getRevenuePage(params)
    },
    searchFn() {
      this.tableConfig.pageIndex = 1
      this.$refs.zbTableRef.init()
    },
    clearFn() {
      this.formOptsDataTableRevenue.ref.resetFields()
      // this.formOptsDataTableRevenue.formData = cloneDeep(curwordOpts.form.formData)
      this.$refs.zbTableRef.init()
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.$refs.zbTableRef.init()
    },
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.$refs.zbTableRef.init()
    },
    handleSearch() {
      this.tableConfig.pageIndex = 1
      this.$refs.zbTableRef.init()
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
