<template>
  <div>
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
    </HokSearchForm>
    <DataRow
      v-loading="isDataLoading"
      :list="dataRowList"
      element-loading-spinner="el-icon-loading"
    />
    <CustomTable
      ref="customTableRef"
      height="400px"
      :columns="columns"
      :get-list="getList"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    >
      <template v-slot:operate="{ scope }">
        <el-button type="text" @click="rechargeRecord(scope.row)">
          充值记录
        </el-button>
        <el-button type="text" @click="consumptionRecord(scope.row)">
          消费记录
        </el-button>
      </template>
    </CustomTable>
    <GiftDialog v-model="dialogVisible" />
  </div>
</template>
<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import CustomTable from '@/components/baseCpns/table'
import { columns, formConfig } from './columns'
import DataRow from '@/views/digitalPerson/components/dataRow/index.vue'
import GiftDialog from './components/giftDialog/index.vue'
import {
  getCostPage,
  getCostInfo,
  getOrganizationByName
} from '@/api/aiVideoManage/setMealModule'
import { filterPrice } from '@/utils/index'
import moment from 'moment'
export default {
  name: 'CostOverview',
  components: {
    HokSearchForm,
    CustomTable,
    DataRow,
    GiftDialog
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
          },
          {
            label: '赠送',
            fn: () => {
              this.openDialog()
            },
            className: ['right']
          }
        ]
      },
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      dialogVisible: false,
      dataRowList: [
        {
          title: '充值总金额',
          isPrefix: true,
          number: '0'
        },
        {
          title: '形象克隆总数',
          isRight: true,
          isGift: true,
          number: '0',
          number2: '0',
          number3: '0'
        },
        {
          title: '声音克隆总数',
          isRight: true,
          isGift: true,
          number: '0',
          number2: '0',
          number3: '0'
        },
        {
          title: '视频生成时长（分钟）',
          isRight: true,
          isGift: true,
          number: '0',
          number2: '0',
          number3: '0'
        }
      ],
      isDataLoading: false,
      orgList: []
    }
  },
  mounted() {
    this.formOpts.formData = {}
    this.searchFn()
    this.getOrganizationByName()
  },
  methods: {
    filterPrice,
    getOrganizationByName() {
      getOrganizationByName({ searchKey: '' })
        .then(res => {
          const { data } = res
          this.orgList = data
        })
        .catch(() => {})
    },
    getCostInfo() {
      const params = {
        ...this.formOpts.formData
      }
      if (params.times && params.times.length) {
        params.startTime = params.times[0]
        params.endTime = params.times[1]
        delete params.times
      }
      this.isDataLoading = true
      getCostInfo(params)
        .then(res => {
          this.isDataLoading = false
          const { data } = res
          this.dataRowList[0].number = data.payTotal || 0
          if (data.characterPurchaseSum) {
            const spt = data.characterPurchaseSum.split(',')
            this.dataRowList[1].number = spt[0]
            this.dataRowList[1].number2 = spt[1]
            this.dataRowList[1].number3 = spt[2]
          } else {
            this.dataRowList[1].number = '0'
            this.dataRowList[1].number2 = '0'
            this.dataRowList[1].number3 = '0'
          }
          if (data.voiceTrainingSum) {
            const spt = data.voiceTrainingSum.split(',')
            this.dataRowList[2].number = spt[0]
            this.dataRowList[2].number2 = spt[1]
            this.dataRowList[2].number3 = spt[2]
          } else {
            this.dataRowList[2].number = '0'
            this.dataRowList[2].number2 = '0'
            this.dataRowList[2].number3 = '0'
          }
          if (data.videoDurationSum) {
            const spt = data.videoDurationSum.split(',')
            this.dataRowList[3].number = spt[0]
            this.dataRowList[3].number2 = spt[1]
            this.dataRowList[3].number3 = spt[2]
          } else {
            this.dataRowList[3].number = '0'
            this.dataRowList[3].number2 = '0'
            this.dataRowList[3].number3 = '0'
          }
        })
        .catch(() => {
          this.isDataLoading = false
        })
    },
    openDialog() {
      this.dialogVisible = true
    },
    consumptionRecord(row) {
      this.$router.push({
        path: '/orgSettlement/consumptionRecord?orgId=' + row.orgId
      })
    },
    rechargeRecord(row) {
      this.$router.push({
        path: '/orgSettlement/rechargeRecord?orgId=' + row.orgId
      })
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
      }
      this.getCostInfo()
      this.$refs.customTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        ...this.tableConfig,
        ...this.formOpts.formData
      }
      if (params.times && params.times.length) {
        params.startTime = params.times[0]
        params.endTime = params.times[1]
        delete params.times
      }
      return new Promise((resolve, reject) => {
        getCostPage(params)
          .then(res => {
            res.data.items.forEach(item => {
              item.payTotalMap = item.payTotal
              item.lastTime = item.lastTime
                ? moment(item.lastTime).format('YYYY-MM-DD HH:mm:ss')
                : '-'
              item.characterPurchaseSum = item.characterPurchaseSum
                ? item.characterPurchaseSum.replace(/,/g, '/')
                : '-'
              item.voiceTrainingSum = item.voiceTrainingSum
                ? item.voiceTrainingSum.replace(/,/g, '/')
                : '-'
              item.videoDurationSum = item.videoDurationSum
                ? item.videoDurationSum.replace(/,/g, '/')
                : '-'
            })
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
