
<template>
  <div class="keword-container">
    <dynamicTable ref="table" v-model="tableData" immediate-check :columns="columns" :get-list-api="getList">
      <template #headerBtn>
        <el-button v-permission="['web:demandManage:add', permsList]" type="primary" size="small" plain @click="openModel">新增话题</el-button>
        <el-button type="primary" plain size="small" @click="demandLink">话题管理</el-button>
      </template>
      <template #action="{ row }">
        <el-button v-permission="['web:problemManage:detail', permsList]" type="text" @click="openDetail(row)">详情</el-button>
      </template>
    </dynamicTable>
    <modal ref="modal" @close="handleClose" />
    <update ref="update" />
    <detail ref="detail" @close="handleClose" />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import update from './components/update'
import { getColumns } from './column'
import { questionPage } from '@/api/product/question'
import modal from '../demandManage/components/modal'
import detail from './components/detail'
import { getTradeData, getDeptData } from '@/utils/getApiData'
import { getDict } from '@/utils/index'
export default {
  name: 'DemandManagement',
  components: {
    dynamicTable,
    modal,
    update,
    detail
  },
  data() {
    return {
      tableData: [],
      params: {},
      questionBasicReq: {},
      permsList: this.$route.meta.permsList || [],
      columns: [
        {
          prop: 'keyword',
          label: '问题关键词',
          type: 'text',
          formProps: {
            sort: 1,
            defaultValue: '',
            labelWidth: '90px'
          },
          showInSearch: true,
          valueType: 'text',
          visible: false
        },
        ...getColumns.call(this)
      ],
      keyId: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const params = this.$route.query ?? {}
      const trade = await getTradeData()
      const dept = await getDeptData()
      const turnover = await getDict('sys_turnover')
      const companySize = await getDict('sys_company_size')
      const channelSource = await getDict('sys_source_channel')
      this.columns.forEach((i) => {
        if (i.prop === 'industry') {
          i.formProps.options = this.setValue(trade)
        }
        if (i.prop === 'deptName') {
          i.formProps.options = this.setValue(dept)
        }
        if (i.prop === 'channelTime' && params.endTime && params.startTime) {
          i.formProps.defaultValue = [params.startTime, params.endTime]
        }
        if (i.prop === 'turnover') {
          i.formProps.options = turnover.map((i) => {
            return {
              value: i.dictLabel,
              label: i.dictLabel
            }
          })
        }
        if (i.prop === 'companySize') {
          i.formProps.options = companySize.map((i) => {
            return {
              value: i.dictLabel,
              label: i.dictLabel
            }
          })
        }
        if (i.prop === 'channelSource') {
          i.formProps.options = channelSource.map((i) => {
            return {
              value: i.dictLabel,
              label: i.dictLabel
            }
          })
        }
        for (const key in params) {
          if (i.prop === key) {
            i.formProps.defaultValue = params[key]
          }
        }
      })
      this.columns[0].formProps.defaultValue = this.$route.params.keyword
      this.keyId = params.keyId
      this.questionBasicReq = JSON.parse(params.questionBasicReq)
      this.$refs.table.onRefresh(params)
    },
    demandLink() {
      this.$router.push('/productManage/demandManage/index')
    },
    setValue(data) {
      data.forEach((i) => {
        i.value = i.label
        if (i.children && i.children.length) {
          this.setValue(i.children)
        }
      })
      return data
    },
    getList(params) {
      // eslint-disable-next-line no-unused-vars
      const { pageIndex, pageSize, ...data } = params
      this.params = data
      return questionPage({
        ...params,
        questionBasicReq: this.questionBasicReq,
        keyWord: this.$route.params.keyword
      })
    },
    handleClose() {
      this.$refs.table.onRefresh()
    },
    openModel() {
      this.$refs.modal.open({
        type: 'add',
        row: {
          keyword: this.$route.params.keyword,
          questionQueryReq: { ...this.params, keyWord: this.$route.params.keyword, questionBasicReq: this.questionBasicReq },
          questionKeywordId: this.keyId
        }
      })
    },
    openUpdate() {
      this.$refs.update.open()
    },
    openDetail(row) {
      this.$refs.detail.open({ ...row, total: this.$refs.table.config.total, params: { ...this.params, keyWord: this.$route.params.keyword, questionBasicReq: this.questionBasicReq } })
    }
  }
}
</script>
<style lang="scss" scoped>
.keword-container {
  height: calc(100vh - 100px);
}
</style>
