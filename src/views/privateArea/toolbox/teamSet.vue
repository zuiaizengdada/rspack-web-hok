<template>
  <div class="outbound-container">
    <dynamicTable
      ref="table"
      v-model="tableData"
      style="height: calc(100vh - 220px)"
      :columns="columns"
      :get-list-api="getList"
    >
      <template #action="{ row }">
        <el-button type="text" @click="handleEdit(row)">编辑</el-button>
        <el-button
          type="text"
          style="color: #f53f3f"
          @click="handleRemove(row)"
        >删除</el-button>
      </template>
      <template #headerBtn>
        <span class="form-item">
          团队权重配置：
          <el-switch
            v-model="config.teamAssignType"
            :active-value="1"
            :inactive-value="2"
            @change="handleChange"
          />
        </span>
        <el-button
          size="small"
          type="primary"
          @click="openAddModel"
        ><i class="el-icon-plus" /> 新增团队</el-button>
      </template>
    </dynamicTable>
    <addTeam ref="addModal" @success="onRefresh" />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import addTeam from './components/addTeam'
import {
  getClueAssignList,
  deleteClueAssignSet
} from '@/api/privateArea/toolbox'
import {
  saleTaskConfigDetail,
  saleTaskConfigSetting
} from '@/api/saleTask/index'
export default {
  components: {
    dynamicTable,
    addTeam
  },
  data() {
    return {
      tableData: [],
      columns: [
        {
          prop: 'deptName',
          label: '团队名称',
          type: 'text'
        },
        {
          prop: 'assignmentRule',
          label: '分配规则',
          slotFn: row => {
            return this.$getdictName('ASSIGNMENTRULE_TYPE', row.assignmentRule)
          }
        },
        {
          prop: 'assignmentWeights',
          label: '线索分配权重',
          type: 'text'
        },
        { prop: 'createTime', label: '创建时间', type: 'text' },
        { prop: 'action', label: '操作', type: 'slot' }
      ],
      config: {
        dispatchType: 1,
        refundType: 1,
        teamAssignType: 1
      }
    }
  },
  mounted() {
    this.getPopupDetails()
  },
  methods: {
    getList(params) {
      return getClueAssignList(params)
    },
    async handleChange() {
      const { code } = await saleTaskConfigSetting(this.config)
      if (code === 1) {
        this.$message.success('修改成功')
      }
    },
    onRefresh() {
      this.$nextTick(() => {
        this.$refs.table.onRefresh()
      })
    },
    async getPopupDetails() {
      const { data } = await saleTaskConfigDetail()
      this.config = data
    },
    handleEdit(row) {
      this.$refs.addModal.open(row, 'EDIT')
    },
    openAddModel() {
      this.$refs.addModal.open({}, 'ADD')
    },
    async updateStatus(row) {
      const { code } = await deleteClueAssignSet(row.id)
      if (code === 1) {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.onRefresh()
      }
    },
    handleRemove(row) {
      this.$delModal({
        tips: `是否确定操作?`,
        success: () => {
          this.updateStatus(row)
        }
      })
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
  .form-item {
    color: #333;
    margin-right: 10px;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
  }
}
</style>
