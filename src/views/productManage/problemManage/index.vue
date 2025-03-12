
<template>
  <div class="problem-container">
    <dynamicTable ref="table" v-model="tableData" immediate-check :columns="columns" :get-list-api="getList">
      <template #headerBtn>
        <el-button
          v-permission="['web:problemManage:results', permsList]"
          type="primary"
          size="small"
          plain
          @click="openModel"
        >查看结果</el-button>
        <el-button
          v-permission="['web:problemManage:import', permsList]"
          type="primary"
          size="small"
          plain
          @click="openUpdate"
        >一键导入</el-button>
      </template>
      <template #action="{ row }">
        <el-button
          v-permission="['web:problemManage:detail', permsList]"
          type="text"
          @click="openDetail(row)"
        >详情</el-button>
      </template>
    </dynamicTable>
    <modal ref="modal" />
    <update ref="update" />
    <detail ref="detail" @close="handleClose" />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import update from './components/update'
import modal from './components/modal'
import detail from './components/detail'
import { getColumns } from './column'
import { questionPage } from '@/api/product/question'
import { getTradeData, getDeptData } from '@/utils/getApiData'
import { getDict } from '@/utils/index'
import moment from 'moment'
export default {
  name: 'ProblemManage',
  components: {
    dynamicTable,
    modal,
    update,
    detail
  },
  data() {
    return {
      tableData: [],
      columns: getColumns.call(this),
      params: {},
      channelSource: {},
      currentTime: '',
      permsList: this.$route.meta.permsList || []
    }
  },
  created() {
    this.init()
  },
  activated() {
    this.$refs.table.onRefresh()
  },
  methods: {
    async init() {
      const trade = await getTradeData()
      const dept = await getDeptData()
      const turnover = await getDict('sys_turnover')
      const companySize = await getDict('sys_company_size')
      const channelSource = await getDict('sys_source_channel')
      const params = {}
      this.columns.forEach((i) => {
        if (i.prop === 'industry') {
          i.formProps.options = this.setValue(trade)
        }
        if (i.prop === 'deptName') {
          i.formProps.options = this.setValue(dept)
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
        if (i.prop === 'channelTime') {
          const startTime = moment().subtract(6, 'days').format('YYYY-MM-DD')
          const endTime = moment().format('YYYY-MM-DD')
          i.formProps.defaultValue = [startTime, endTime]
          params.startTime = startTime
          params.endTime = endTime
        }
      })
      this.$refs.table.onRefresh(params)
    },
    handleClose() {
      this.$refs.table.onRefresh()
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
      return questionPage(params)
    },
    async openModel() {
      if (!this.tableData.length) {
        this.$notify.warning('问题列表没有数据，请先添加问题再查看结果')
        return
      }
      this.$refs.modal.open(this.params)
    },
    openUpdate() {
      this.$refs.update.open()
    },
    openDetail(row) {
      this.$refs.detail.open({ ...row, total: this.$refs.table.config.total, params: this.params })
    }
  }
}
</script>
<style lang="scss" scoped>
.problem-container {
  height: calc(100vh - 90px);
}
</style>
