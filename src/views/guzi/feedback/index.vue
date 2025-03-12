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
    <div class="flex flex-right m-r-20">
      <el-button
        class="hok-button"
        type="primary"
        plain
        size="small"
        @click="exportFeedback"
      >
        记录导出
      </el-button>
    </div>
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
      <template slot="status" slot-scope="scope">
        <div :class="{status1:scope.row.status ===1,status2:scope.row.status ===2}">
          {{ scope.row.status===1? '未处理' :'已处理' }}
        </div>
      </template>
      <template slot="picUrls" slot-scope="scope">
        <div class="flex">
          <el-image
            v-for="(item,index) in scope.row.picUrls"
            :key="index"
            style="width: 60px; height: 60px"
            :src="item"
            fit="contain"
            class="mr-2"
            :preview-src-list="scope.row.picUrls"
          />
        </div>
      </template>
      <template slot="action" slot-scope="scope">
        <div>
          <el-button type="text" @click="editFn(scope.row)"> 处理详情 </el-button>
        </div>
      </template>
    </MPageLayout>
    <AddDialog ref="addDialogRef" @callback="searchFn" />
  </div>
</template>

<script>
import moment from 'moment'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import AddDialog from './cpns/addDialog.vue'
import { cloneDeep } from 'lodash'
import { downloadFile } from '@/utils'
import { deepClone } from '@/utils/FormGenerator/index'

import { curwordOpts } from './data.js'
import {
  feedbackList, feedbackExport, getFeedTypeList
} from '@/api/guzi/feedback.js'
export default {
  components: { HokSearchForm, AddDialog },
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
        ...cloneDeep(curwordOpts.form),
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
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        basics: cloneDeep(curwordOpts.table)
      },
      loading: false
    }
  },
  created() {
    this.initOption()
    this.getTableInfo()
  },
  methods: {
    async initOption() {
      const { data } = await getFeedTypeList()
      this.formOpts.optionsObj.feedCode = [
        { name: '全部', code: '' },
        ...(data || [])
      ]
    },
    formMat() {
      const req = deepClone(this.formOpts.formData)
      delete req.time
      if (
        this.formOpts.formData.time &&
        this.formOpts.formData.time[0] &&
        this.formOpts.formData.time[1]
      ) {
        req.startTime = moment(this.formOpts.formData.time[0]).format('YYYY-MM-DD')
        req.endTime = moment(this.formOpts.formData.time[1]).format('YYYY-MM-DD')
      }
      for (const key in req) {
        if (req[key] === '') {
          delete req[key]
        }
      }
      return req
    },
    async getTableInfo() {
      this.loading = true
      try {
        const req = this.formMat()
        const { data } = await feedbackList({
          ...req,
          pageSize: this.config.pageSize,
          pageIndex: this.config.currentPage
        })
        this.$set(this.config, 'tableData', data.items.map(i => ({ ...i, picUrls: JSON.parse(i.picUrls) })) || [])
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
      this.formOpts.formData = cloneDeep(curwordOpts.form.formData)
      this.getTableInfo()
    },
    editFn(row) {
      this.$refs.addDialogRef.dialogFn(true, row)
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
    async exportFeedback() {
      const req = this.formMat()
      const res = await feedbackExport({
        ...req,
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage })
      downloadFile(res, '意见反馈.xls')
    }
    // MPageLayout --end
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.c_red{
  color: red;
}
.coupon-center-audit {
  @include responsive-height(20px);
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
.status1{
  color: #FF2E00;
}
.status2{
  color: #34C759;
}
</style>
