<template>
  <div class="receive-record-model">
    <el-drawer
      :visible.sync="visible"
      title="认领记录"
      size="1300px"
      :wrapper-closable="false"
      direction="rtl"
      @close="close"
    >
      <div class="box">
        <HokSearchForm
          :form-opts="formOpts"
          :ref-obj.sync="formOpts.ref"
          class="pd20"
          style="margin-top: 20px"
        >
          <template #time1ortime2>
            <div class="flex pl-2">
              <div
                style="width: 80px; "
              >认领时间</div>
              <el-date-picker
                v-model="
                  formOpts.formData.time1ortime2Val"
                style="padding-left: 1px"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="searchFn()"
              />
            </div>
          </template>
        </HokSearchForm>

        <ZBTable
          ref="zbTableRef"
          key="receiveRecord"
          data-key="records"
          :columns="columns"
          height="650px"
          :get-list="getList"
          is-left-bottom-slot
          @handleSizeChangeEmit="handleSizeChangeEmit"
          @handleCurrentChangeEmit="handleCurrentChangeEmit"
        >
          <template v-slot:projectName="{ scope }">
            {{ scope.row.projectName }}
            <!-- <i class="el-icon-edit-outline" @click="onhandleEdit(scope.row)" /> -->
          </template>
          <template v-slot:createdAt="{ scope }">
            {{
              moment(scope.row.createdAt).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            }} </template>
          <template v-slot:examineStatus="{ scope }">
            {{ findLabelByValue(scope.row.examineStatus,examineStatusOptions ) }}
            <!-- <i class="el-icon-edit-outline" @click="onhandleEdit(scope.row)" /> -->
          </template>
          <template v-slot:operate="{ scope }">
            <el-button
              type="text"
              @click="onhandleDetail(scope.row.id)"
            >
              查看
            </el-button>
          </template>
        </ZBTable>
      </div>
      <receiveDetail ref="detail" />
    </el-drawer>
  </div>
</template>
<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { columns, formConfig, examineStatusOptions } from './columns'
import { orderclaimrecord } from '@/api/order/index.js'
import moment from 'moment'
import { findLabelByValue } from '@/utils/index'
import receiveDetail from './receiveDetail.vue'
export default {
  components: {
    HokSearchForm,
    ZBTable,
    receiveDetail
  },
  data() {
    return {
      columns,
      examineStatusOptions,
      formOpts: {
        ...formConfig,
        operatorList: []
      },
      tableConfig: {
        current: 1,
        size: 10
      },
      visible: false,
      queryType: 2
    }
  },
  mounted() {
  },
  methods: {
    moment,
    findLabelByValue,
    setOperatorList() {
      const arr = [
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
      // 搜索按钮
      this.$set(this.formOpts, 'operatorList', arr)
    },
    open(type) {
      this.queryType = type || 2
      this.visible = true
      this.setOperatorList()
      this.$nextTick(() => {
        this.searchFn()
      })
    },
    onhandleDetail(id) {
      this.$refs.detail.open(id)
    },

    handleCurrentChangeEmit(val) {
      this.tableConfig.current = val
      this.searchFn(false, false)
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.size = val
      this.searchFn()
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.current = 1
      }
      if (isClear) {
        this.tableConfig.pageSize = 10
        this.formOpts.formData = {
          orderNo: undefined,
          examineStatus: undefined,
          time1ortime2: 'time1',
          time1ortime2Val: ['', ''],
          time1: ''
        }
      }
      this.$refs.zbTableRef && this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        ...this.tableConfig,
        orderNo: this.formOpts.formData.orderNo,
        examineStatus: this.formOpts.formData.examineStatus,
        queryType: this.queryType,
        [this.formOpts.formData.time1ortime2]:
          this.formOpts.formData.time1ortime2Val
      }
      if (params.time1) {
        params.claimStartTime =
          params.time1 && params.time1[0] ? params.time1[0] + ' 00:00:00' : undefined
        params.claimEndTime =
          params.time1 && params.time1[1] ? params.time1[1] + ' 23:59:59' : undefined
      }
      delete params.time1
      return orderclaimrecord(params)
    },
    close() {
      this.tableConfig.pageSize = 10
      this.formOpts.formData = {
        orderNo: undefined,
        examineStatus: undefined,
        time1ortime2: 'time1',
        time1ortime2Val: ['', ''],
        time1: ''
      }
    }
  }
}
</script>
<style lang="scss" scope>
.box {
    padding:0 20px
}
::v-deep .el-drawer__header{
    margin-bottom: 0px !important;
  }
.receive-record-model::v-deep {
  .el-drawer__header{
    margin-bottom: 0px !important;
  }
  ::v-deep .el-drawer__header{
    margin-bottom: 0px !important;
    color: #000000 !important;
  }
}
</style>
