<template>
  <div class="coupon-center-audit">
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
    >
      <template #couponInfo>
        <div class="flex pl-2">
          <el-select
            v-model="couponType.value"
            class="two-min-select w102"
            placeholder="请选择"
            @change="couponTypeChange"
          >
            <el-option
              v-for="item in couponType.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <template v-if="couponType.value === 'No'">
            <el-input
              v-model="formOpts.formData.couponNo"
              class="pl10"
              placeholder="请输入优惠券ID"
              clearable
            />
          </template>
          <template v-else>
            <el-input
              v-model="formOpts.formData.couponName"
              class="pl10"
              placeholder="请输入优惠券名称"
              clearable
            />
          </template>
        </div>
      </template>
    </HokSearchForm>
    <MPageLayout
      ref="couponTableRef"
      type="tablePage"
      class="coupon-table"
      :slot-arr="config.basics.slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.basics.columns"
      :loading="loading"
      table-index-width="62px"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="couponName" slot-scope="scope">
        <div>
          <p class="title">{{ scope.row.couponName }}</p>
          <p class="blue-desc">
            ID:{{ scope.row.couponNo }}
            <i
              class="el-icon-document-copy icon-copy"
              @click="copyBtn(scope.row.couponNo)"
            />
          </p>
          <p class="orange-desc">
            {{
              scope.row.couponType
                | rowOptionsFt(
                  formOpts.optionsObj.couponType,
                  'code',
                  'message'
                )
            }}
          </p>
        </div>
      </template>
      <template slot="couponContent" slot-scope="scope">
        <div>
          <p class="txt">{{ scope.row.couponContent }}</p>
          <p class="grey-desc">{{ scope.row.remark }}</p>
        </div>
      </template>
      <template slot="auditStatus" slot-scope="scope">
        <div
          :class="['audit-status-box', 'audit-status' + scope.row.auditStatus]"
        >
          {{
            scope.row.auditStatus
              | rowOptionsFt(formOpts.optionsObj.auditStatus)
          }}
        </div>
      </template>
      <template slot="action" slot-scope="scope">
        <div>
          <el-button type="text" @click="goDetail(scope.row)"> 详情 </el-button>
        </div>
      </template>
    </MPageLayout>
  </div>
</template>

<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { cloneDeep } from 'lodash'
import { copy } from '@/utils'

import { couponAudit } from '../../../data.js'
import {
  pageListCouponInfosApi,
  couponTypesApi,
  discountMethodsApi
} from '@/api/orgSettlement/couponCenter.js'
export default {
  components: { HokSearchForm },
  filters: {
    rowOptionsFt(value, Arr, key = 'value', label = 'label') {
      for (const item of Arr) {
        if (value === item[key]) return item[label]
      }
      return value
    }
  },
  data() {
    return {
      formOpts: {
        ...cloneDeep(couponAudit.form),
        operatorList: [
          { label: '搜索', fn: this.searchFn },
          {
            label: '重置',
            fn: this.clearFn,
            type: 'plain',
            bind: { plain: true }
          }
        ]
      },
      loading: false,
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        basics: cloneDeep(couponAudit.table)
      },
      couponType: {
        value: 'Name',
        options: [
          { label: '优惠券名称', value: 'Name' },
          { label: '优惠券ID', value: 'No' }
        ]
      }
    }
  },
  created() {
    this.initOption()
    this.getTableInfo()
  },
  methods: {
    initOption() {
      couponTypesApi().then(res => {
        if (res.success) {
          this.formOpts.optionsObj.couponType = [
            { message: '全部', code: '' },
            ...res.data
          ]
        }
      })
      discountMethodsApi().then(res => {
        if (res.success) {
          this.formOpts.optionsObj.discountMethod = [
            { message: '全部', code: '' },
            ...res.data
          ]
        }
      })
    },
    async getTableInfo() {
      this.loading = true
      try {
        const { data } = await pageListCouponInfosApi({
          ...this.formOpts.formData,
          pageSize: this.config.pageSize,
          pageIndex: this.config.currentPage
        })
        this.$set(this.config, 'tableData', data.items || [])
        this.$set(this.config, 'total', data.total)
        this.$nextTick(() => {
          this.$refs.couponTableRef?.doLayout()
        })
      } catch (error) {
        console.log('error------getTableInfo', error)
      }
      this.loading = false
    },
    searchFn() {
      this.config.currentPage = 1
      this.getTableInfo()
    },
    clearFn() {
      this.formOpts.ref.resetFields()
      console.log('couponAudit.form.formData-------', couponAudit.form.formData)
      this.formOpts.formData = cloneDeep(couponAudit.form.formData)
      // this.couponTypeChange()
      this.getTableInfo()
    },
    goDetail(row) {
      console.log('this.$route.path--', this.$route.path)
      this.$router.push({
        name: 'CouponCenterDetails',
        query: {
          prevPath: this.$route.path + '?active=audit',
          couponNo: row.couponNo
        }
      })
    },
    // MPageLayout
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getTableInfo()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getTableInfo()
    },
    handleSearch() {
      this.config.currentPage = 1
      this.getTableInfo()
    },
    couponTypeChange() {
      this.formOpts.formData.couponName = undefined
      this.formOpts.formData.couponNo = undefined
    },
    copyBtn(txt) {
      copy(txt)
      this.$message.success('复制成功')
    }
    // MPageLayout --end
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.coupon-center-audit {
  @include responsive-height(68px);
  min-width: 1100px;
  width: 100%;
  background: #fff;
  border-radius: 5px;
  padding: 0 0 0 0;
  display: flex;
  flex-direction: column;
  .pd20 {
    padding: 20px;
  }
  .pl10 {
    padding-left: 10px;
  }
  .icon-copy{
    cursor: pointer;
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
  .two-min-select {
    flex-shrink: 0;
    box-sizing: border-box;
    border-right: 1px solid #dcdee1;
    &.w102 {
      width: 102px !important;
    }
  }
}
::v-deep .el-table {
  th.el-table__cell > .cell {
    font-weight: 600;
  }
  .cell {
    font-weight: 450;
    font-size: 14px;
    color: #333;
  }
  .el-button + .el-button {
    margin-left: 20px;
  }
}
</style>
