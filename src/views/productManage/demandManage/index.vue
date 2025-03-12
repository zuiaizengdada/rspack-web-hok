<template>
  <div class="demand-container">
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      :get-list-api="getList"
    >
      <template #headerBtn>
        <el-button
          v-permission="['web:demandManage:add', permsList]"
          type="primary"
          size="small"
          plain
          @click="openModel({ type: 'add' })"
        >
          新增话题
        </el-button>
      </template>
      <template #action="{row}">
        <el-button
          v-permission="['web:demandManage:detail', permsList]"
          type="text"
          @click="openDetail(row)"
        >
          详情
        </el-button>
        <el-button
          v-permission="['web:demandManage:edit', permsList]"
          type="text"
          @click="openModel({ row, type: 'edit' })"
        >
          编辑
        </el-button>
        <el-button v-permission="['web:demandManage:seek', permsList]" type="text" @click="caseLink(row)">
          寻找选题</el-button>
      </template>
    </dynamicTable>
    <modal ref="modal" @close="handleClose" />
    <detail ref="detail" @close="handleClose" />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { getColumns } from './column'
import { demandList } from '@/api/product/demand'
import modal from './components/modal'
import detail from './components/detail'
import { getDomainData } from '@/utils/getApiData'
export default {
  name: 'DemandManagement',
  components: {
    dynamicTable,
    modal,
    detail
  },
  data() {
    return {
      tableData: [],
      columns: getColumns.call(this),
      domain: [],
      params: {},
      permsList: this.$route.meta.permsList || []
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    async init() {
      const domainList = await getDomainData()
      this.columns.forEach((i) => {
        if (i.prop === 'fieldName') {
          i.formProps.options = domainList
        }
      })
      const { teacherId, teacherName } = this.$route.query
      if (teacherName && teacherId) {
        this.columns.forEach((i) => {
          if (i.prop === 'teacherName') {
            i.formProps.remoteMethod(teacherName)
              .then(res => {
                this.$refs.table.query = {}
                i.formProps.options = res.data
                i.formProps.defaultValue = teacherId
                this.$refs.table.onRefresh({
                  teacherId
                })
              })
          }
        })
      }
    },
    openDetail(row) {
      this.$refs.detail.open({ row, params: this.params, total: this.$refs.table.config.total })
    },
    handleClose() {
      this.$refs.table.onRefresh()
    },
    caseLink(row) {
      this.$router.push({
        path: '/productManage/caseFinding',
        query: {
          keyword: row.keyword,
          industryName: row.industryName,
          fieldName: row.fieldName
        }
      })
    },
    getList(params) {
      this.params = params
      return demandList(params)
    },
    openModel({ type, row }) {
      this.$refs.modal?.open({ type, row })
    }
  }
}
</script>
<style lang="scss" scoped>
.demand-container {
  height: calc(100vh - 90px);
}
</style>
