<template>
  <div class="sending-container">
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      :get-list-api="getList"
      class="dialog-table"
    >
      <template #action="{row}">
        <el-button
          type="text"
          @click="handleShowDetail(row)"
        >详情</el-button>
        <el-button
          v-if="row.status === 0"
          style="margin-left:10px"
          type="text"
          @click="handleEdit(row)"
        >编辑</el-button>
        <el-button
          v-show="row.status === 3"
          style="margin-left:10px"
          type="text"
          @click="delModal(row,1)"
        >重启</el-button>
        <el-button
          v-show="row.status === 1"
          style="margin-left:10px"
          type="text"
          @click="delModal(row,3)"
        >暂停</el-button>
        <el-button
          v-show="[0,3].includes(row.status)"
          style="margin-left:10px"
          type="text"
          @click="delModal(row,4)"
        >关闭</el-button>
      </template>
      <template #num="{row}">
        <el-button
          v-if="row.num"
          type="text"
          @click="handleShowPush(row)"
        >{{ row.num }}</el-button>
        <span v-else>{{ row.num }}</span>
      </template>
      <template #submitBtn>
        <el-button
          type="primary"
          size="mini"
          @click="handleAdd"
        ><i class="el-icon-plus el-icon--left" />新增</el-button>
      </template>
      <template #taskStatus="{row}">
        <MIconStatus
          :background="getOptionsValueByKey('value','background',row.status,statusOption)"
          :color="getOptionsValueByKey('value','color', row.status,statusOption)"
          :icon-class="getOptionsValueByKey('value', 'icon', row.status, statusOption)"
          :title="getOptionsValueByKey('value','label',row.status,statusOption)"
        />
      </template>
    </dynamicTable>
    <taskDrawer ref="taskDrawer" @success="onRefresh" />
    <taskDetailDrawer ref="taskDetailDrawer" />
    <pushDetailDrawer ref="pushDetailDrawer" />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import taskDrawer from './taskDrawer'
import taskDetailDrawer from './taskDetailDrawer'
import pushDetailDrawer from './pushDetailDrawer'
import { groupPage, groupUpdateStatus } from '@/api/privateArea/toolbox'
import { getOptionsValueByKey } from '@/filters/index'
import { taskStatus } from '@/utils/enum'
import { getList2Obj } from '@/utils/index'
const taskStatusOptions = getList2Obj(taskStatus)
export default {
  components: {
    dynamicTable,
    taskDrawer,
    taskDetailDrawer,
    pushDetailDrawer
  },
  data() {
    return {
      tableData: [],
      columns: [
        {
          prop: 'title',
          label: '任务名称',
          showInSearch: true
        },
        {
          prop: 'content',
          label: '模版内容',
          showInSearch: true,
          width: 300
        },
        {
          prop: 'taskObject',
          label: '任务对象',
          slotFn: () => '全量粉丝'
        },
        {
          prop: 'num',
          type: 'slot',
          label: '推送数量'
        },
        {
          prop: 'taskStatus',
          label: '任务状态',
          showInSearch: true,
          valueType: 'select',
          width: 120,
          formProps: {
            options: [
              { label: '全部', value: undefined },
              ...taskStatusOptions
            ],
            formAliasName: 'status'
          },
          type: 'slot',
          slotFn: (row) => taskStatus[row.status]
        },
        {
          prop: 'planStartTime',
          label: '任务计划开始时间',
          width: 140
        },
        {
          prop: 'startTime',
          label: '执行开始时间',
          width: 120
        },
        {
          prop: 'endTime',
          label: '执行结束时间',
          width: 120
        },
        {
          prop: 'action',
          type: 'slot',
          label: '操作',
          width: 180
        }
      ],
      statusOption: [
        { label: '未开始', value: 0, background: '#FEECEC', color: '#F53F3F', icon: 'icon_taskStatus0' },
        { label: '进行中', value: 1, background: '#E7F0FF', color: '#0C6FFF', icon: 'icon_taskStatus1' },
        { label: '已关闭', value: 4, background: '#F5F5F5', color: '#777777', icon: 'icon_taskStatus3' },
        { label: '暂停中', value: 3, background: '#FEF1EC', color: '#FF7D00', icon: 'icon_taskStatus4' }
      ],
      id: ''
    }
  },
  methods: {
    getOptionsValueByKey,
    getList(params) {
      const id = this.$route.query.id
      return groupPage({
        ...params,
        id
      })
    },
    handleShowPush(row) {
      this.$refs.pushDetailDrawer.open(row)
    },
    handleAdd() {
      this.$uweb && this.$uweb.setAction('Event_TemplateBatchSending_add')
      this.$refs.taskDrawer.open({
        type: 'add'
      })
    },
    handleEdit(row) {
      this.$uweb && this.$uweb.setAction('Event_TemplateBatchSending_edit')
      this.$refs.taskDrawer.open({
        type: 'edit',
        ...row
      })
    },
    onRefresh() {
      this.$nextTick(() => {
        this.$refs.table.onRefresh()
      })
    },
    delModal(row, status) {
      this.$delModal({
        tips: `是否确定操作?`,
        success: () => {
          this.handleChangeStatus(row, status)
        }
      })
    },
    async handleChangeStatus(row, status) {
      if (status === 1) {
        this.$uweb && this.$uweb.setAction('Event_TemplateBatchSending_start')
      } else if (status === 4) {
        this.$uweb && this.$uweb.setAction('Event_TemplateBatchSending_suspend')
      } else {
        this.$uweb && this.$uweb.setAction('Event_TemplateBatchSending_close')
      }
      const { code } = await groupUpdateStatus({
        id: row.id,
        status
      })
      if (code === 1) {
        this.$message.success('操作成功')
        this.onRefresh()
      }
    },
    handleShowDetail(row) {
      this.$refs.taskDetailDrawer.open(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.sending-container ::v-deep{
    padding-top: 20px;
    height: 100%;
    .filter-container{
        padding: 0 0px 20px 0px
    }
    .my-table{
        margin: 0px;
    }
    .dialog-table{
        height: 100%;
    }
}
</style>
