<template>
  <div class="outbound-container">
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      style="height: calc(100vh - 220px)"
      :get-list-api="getList"
      @sort-change="handleSortChange"
    >
      <template #action="{ row }">
        <el-button type="text" @click="handleEdit(row)">编辑</el-button>
        <el-button
          type="text"
          style="color: #f53f3f"
          @click="handleDel(row)"
        >删除</el-button>
        <el-button type="text" @click="handleLog(row)">日志</el-button>
      </template>
      <template #submitBtn>
        <el-button
          size="small"
          type="primary"
          @click="handleAdd"
        >新增</el-button>
      </template>
    </dynamicTable>
    <addModal ref="addModal" @success="onRefresh" />
    <logModal ref="logModal" />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import addModal from './components/addModal'
import logModal from './components/logModal'
import { getRulePage, ruleDelete, getRuleType } from '@/api/privateArea/rule'
export default {
  components: {
    dynamicTable,
    addModal,
    logModal
  },
  data() {
    return {
      tableData: [],
      columns: [
        {
          prop: 'ruleTypeName',
          label: '规则触发',
          type: 'text',
          showInSearch: true,
          valueType: 'select',
          formProps: {
            defaultValue: '',
            options: [],
            formAliasName: 'ruleType'
          }
        },
        { prop: 'tagContent', label: '标签内容', type: 'text' },
        { prop: 'createUserName', label: '创建人', type: 'text' },
        {
          prop: 'status',
          label: '状态',
          type: 'text',
          slotFn: row => row.status ? '开启' : '关闭',
          showInSearch: true,
          valueType: 'select',
          formProps: {
            defaultValue: '',
            options: [
              {
                label: '开启',
                value: 1
              },
              {
                label: '关闭',
                value: 0
              }
            ]
          }
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'text',
          sortable: 'custom'
        },
        { prop: 'updateUserName', label: '最新更新人', type: 'text' },
        {
          prop: 'updateTime',
          label: '更新时间',
          type: 'text',
          sortable: 'custom'
        },
        { prop: 'action', label: '操作', type: 'slot' }
      ],
      sortName: undefined,
      sortType: undefined
    }
  },
  mounted() {
    this.getRuleType()
  },
  methods: {
    handleEdit(row) {
      this.$refs.addModal.open(row, 2)
    },
    async getRuleType() {
      const { data } = await getRuleType()
      this.columns[0].formProps.options = data.map(i => {
        return {
          value: i.ruleType,
          label: i.ruleName
        }
      })
    },
    handleDel(row) {
      this.$delModal({
        tips: `是否删除这条规则?`,
        success: () => {
          this.del(row)
        }
      })
    },
    async del(row) {
      const { code } = await ruleDelete({ id: row.id })
      if (code === 1) {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.onRefresh()
      }
    },
    handleSortChange({ column, prop, order }) {
      this.sortName = prop
      this.sortType = order === 'ascending' ? 'asc' : 'desc'
      this.onRefresh()
      console.log({ column, prop, order })
    },
    getList(params) {
      return getRulePage({
        ...params,
        sortName: this.sortName,
        sortType: this.sortType
      })
    },
    onRefresh() {
      this.$nextTick(() => {
        this.$refs.table.onRefresh()
      })
    },
    handleAdd() {
      this.$refs.addModal.open({}, 1)
    },
    handleLog(row) {
      this.$refs.logModal.open(row.id)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.outbound-container {
  @include responsive-height(76px);
  display: flex;
  flex-direction: column;
}
</style>
