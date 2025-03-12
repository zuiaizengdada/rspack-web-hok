<template>
  <div class="teacher-container">
    <span class="title"><em class="title-em" @click="toPlanManage">计划管理&nbsp;&nbsp;<i class="el-icon-arrow-right" /></em>{{ title }}IP-选题</span>
    <dynamicTable
      ref="table"
      v-model="tableData"
      checkbox
      :columns="columns"
      immediate-check
      :get-list-api="getList"
      :reset-refresh-fn="resetRefresh"
      @selectionChange="handleSelectionChange"
    >
      <template #headerBtn>
        <el-button v-permission="['web:teacherCaseManage:batchDelete', permsList]" type="primary" @click="batchDelete">批量删除</el-button>
      </template>
      <template #action="{ row }">
        <el-button v-permission="['web:teacherCaseManage:detail', permsList]" type="text" @click="openDetail(row)">详情</el-button>
        <el-button v-permission="['web:teacherCaseManage:edit', permsList]" type="text" :disabled="row.finalized" @click="openEdit(row)">编辑</el-button>
        <el-button v-permission="['web:teacherCaseManage:delete', permsList]" type="text" :disabled="row.finalized" @click="handleDel(row)">删除</el-button>
      </template>
    </dynamicTable>
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { getColumns } from './column'
import { planTeacherDropdown, planCaseScreen, planCaseBatchDelete } from '@/api/product/plan'
import { getTradeData, getDomainData } from '@/utils/getApiData'
export default {
  name: 'DemandManagement',
  components: {
    dynamicTable
  },
  data() {
    return {
      tableData: [],
      columns: getColumns.call(this),
      title: '',
      multipleSelection: [],
      isReset: false,
      finalized: false,
      permsList: this.$route.meta.permsList || []
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const trade = await getTradeData()
      const domainList = await getDomainData()
      const { data } = await planTeacherDropdown({ teacherId: this.$route.params.teacherId })
      this.columns.forEach((i) => {
        if (i.prop === 'industryName') {
          i.formProps.options = trade
        }
        if (i.prop === 'fieldName') {
          i.formProps.options = domainList
        }
        if (i.prop === 'planName') {
          i.formProps.options = data.items.map((i) => {
            this.title = i.teacherName
            return {
              label: i.planName,
              value: i.planId
            }
          })
          i.formProps.defaultValue = this.$route.query.planId
        }
      })
      this.isReset = true
      this.$refs.table.onRefresh()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    resetRefresh() {
      this.columns.forEach((i) => {
        if (i.prop === 'planName') {
          // 此处是为了触发watch
          i.formProps.defaultValue = ''
          i.formProps.defaultValue = this.$route.query.planId
        }
      })
      this.isReset = true
      this.$refs.table.onRefresh()
    },
    async batchDelete() {
      const planCaseIds = this.multipleSelection.map((i) => i.planCaseId)
      this.$delModal({
        tips: `确定删除这${this.multipleSelection.length}个选题吗？`,
        success: async () => {
          const { code } = await planCaseBatchDelete({ planCaseIds })
          if (code === 1) {
            this.$notify.success('删除成功')
            this.$refs.table.onRefresh()
          }
        }
      })
    },
    getList(params) {
      if (this.isReset) {
        params.planId = this.$route.query.planId
        this.isReset = false
      }
      if (this.$route.query.planId) {
        params.planId = this.$route.query.planId
      }
      console.log('dddddddddddd:', params)
      return planCaseScreen({
        ...params,
        teacherId: this.$route.params.teacherId
      })
    },
    toPlanManage() {
      this.$router.push('/productManage/planManage')
    },
    handleDel(row) {
      const planCaseIds = [row.planCaseId]
      this.$delModal({
        tips: `确定删除这1个选题吗？`,
        success: async () => {
          const { code } = await planCaseBatchDelete({ planCaseIds })
          if (code === 1) {
            this.$notify.success('删除成功')
            this.$refs.table.onRefresh()
          }
        }
      })
    },
    openEdit(row) {
      const id = row.planCaseId
      this.$router.push({
        name: 'caseManageModal',
        query: { id, isPlan: true }
      })
    },
    openDetail(row) {
      this.$router.push(`/caseManage/details/${row.planCaseId}?isPlan=true`)
    }
  }
}
</script>
<style lang="scss" scoped>
.teacher-container {
  height: calc(100vh - 120px);
  background-color: #fff;
  padding-top: 15px;
  border-radius: 15px;
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-left: 25px;
    color: #333;
    .title-em {
      font-style: normal;
      color: #777;
      cursor: pointer;
    }
  }
}
</style>
