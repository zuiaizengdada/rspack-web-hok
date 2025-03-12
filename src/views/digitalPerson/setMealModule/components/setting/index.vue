<template>
  <div>
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
    />

    <CustomTable
      ref="customTableRef"
      height="578px"
      :columns="columns"
      :get-list="getList"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    >
      <template v-slot:operate="{ scope }">
        <el-button type="text" @click="edit(scope.row)"> 编辑 </el-button>
      </template>
    </CustomTable>
    <AddDialog v-model="addDialogVisible" :row="row" @success="successAdd" />
  </div>
</template>
<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import CustomTable from '@/components/baseCpns/table'
import AddDialog from './component/addDialog/index.vue'
import { columns, formConfig } from './columns'
import { getSetMealList } from '@/api/aiVideoManage/setMealModule'
import { filterPrice } from '@/utils/index'
import moment from 'moment'
export default {
  name: 'Setting',
  components: {
    HokSearchForm,
    CustomTable,
    AddDialog
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
            label: '新增套餐',
            fn: () => {
              this.add()
            },
            className: ['right']
          }
        ]
      },
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      addDialogVisible: false,
      row: {}
    }
  },
  mounted() {
    this.formOpts.formData = {}
    this.searchFn()
  },
  methods: {
    filterPrice,
    successAdd() {
      this.addDialogVisible = false
      this.searchFn()
    },
    edit(row) {
      this.row = { ...row, isDeleted: row.isDeleted === '启用' ? 0 : 1 }
      this.addDialogVisible = true
    },
    add() {
      this.row = {}
      this.addDialogVisible = true
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
      this.$refs.customTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        ...this.formOpts.formData,
        ...this.tableConfig
      }
      return new Promise((resolve, reject) => {
        getSetMealList(params).then(res => {
          res.data.items.forEach(item => {
            item.isDeleted = item.isDeleted === 0 ? '启用' : '停用'
            item.packagePriceMap = filterPrice(item.packagePrice || 0)
            item.updateTime = item.updateTime
              ? moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
              : '-'
          })
          resolve(res)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
