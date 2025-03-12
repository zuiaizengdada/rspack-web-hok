<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="728px"
    top="40px"
    append-to-body
    :close-on-click-modal="false"
    class="dialog-container"
  >
    <div class="dialog-cell">
      <span>分配模式：</span>
      <span>轮询分配</span>
    </div>
    <div class="dialog-cell">
      <span>兜底员工：</span>
      <el-tag v-if="followUserName">{{ followUserName }}</el-tag>
    </div>
    <div class="dialog-cell">
      <span>接待员工：</span>
    </div>
    <dynamicTable
      ref="table"
      v-model="tableData"
      immediate-check
      class="dialog-table"
      :columns="columns"
      :get-list-api="getList"
    >
      <template #radio="{ row }">
        <el-radio v-model="selectValue" :label="row.id" />
      </template>
      <template #jobStatus="{row}">
        <MIconStatus
          :background="getOptionsValueByKey('value','background',row.status,jobOption)"
          :color="getOptionsValueByKey('value','color', row.status,jobOption)"
          :icon-class="getOptionsValueByKey('value', 'icon', row.status, jobOption)"
          :title="getOptionsValueByKey('value','label',row.status,jobOption)"
        />
      </template>
      <template #receptionStatus="{row}">
        <MIconStatus
          :background="getOptionsValueByKey('value','background',row.receptionStatus,receptionOption)"
          :color="getOptionsValueByKey('value','color', row.receptionStatus,receptionOption)"
          :icon-class="getOptionsValueByKey('value', 'icon', row.receptionStatus, receptionOption)"
          :title="getOptionsValueByKey('value','label',row.receptionStatus,receptionOption)"
        />
      </template>
    </dynamicTable>
  </el-dialog>
</template>

<script>

import dynamicTable from '@/components/DynamicTable/table'
import { getOptionsValueByKey } from '@/filters/index'
import {
  // receptionWarehouseGetId,
  receptionWarehousePage,
  receptionWarehouseDefault
} from '@/api/privateArea/toolbox'
export default {
  name: 'SelectAllocation',
  components: {
    dynamicTable
  },
  data() {
    return {
      tableData: [],
      visible: false,
      selectValue: '',
      form: {},
      title: '',
      columns: [
        {
          prop: 'deptName',
          label: '部门名称',
          visible: true
        },
        {
          prop: 'followUserName',
          label: '跟进人姓名',
          visible: true
        },
        {
          prop: 'jobStatus',
          label: '在职状态',
          visible: true,
          type: 'slot'
        },
        {
          prop: 'receptionStatus',
          label: '分配状态',
          visible: true,
          type: 'slot'
        },
        {
          prop: 'createTime',
          label: '加入时间',
          width: 140,
          visible: true
        }
      ],
      id: '',
      followUserName: '',
      jobOption: [
        { label: '在职', value: 0, background: '#E6F7EA', color: '#00B42A', icon: 'icon_jobStatus0' },
        { label: '离职', value: 1, background: '#EEF2F9', color: '#717F99', icon: 'icon_jobStatus1' }
      ],
      receptionOption: [
        { label: '正常分配', value: 1, background: '#E6F7EA', color: '#00B42A', icon: 'icon_receptionStatus1' },
        { label: '暂停分配', value: 2, background: '#FEF1EC', color: '#FF7D00', icon: 'icon_taskStatus4' }
      ]
    }
  },
  methods: {
    getOptionsValueByKey,
    getList(params) {
      return receptionWarehousePage({
        id: this.id,
        ...params
      })
    },
    async getDetail() {
      const { data } = await receptionWarehouseDefault(this.id)
      this.followUserName = data.followUserName
    },
    onRefresh() {
      this.$nextTick(() => {
        this.$refs.table.onRefresh()
      })
    },
    open(row) {
      this.visible = true
      this.id = row.id
      this.title = row.name
      this.onRefresh()
      this.getDetail()
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-container ::v-deep{
  .dialog-cell{
    margin-bottom: 20px;
  }
    .el-dialog__header{
        border-bottom: 1px solid #E7E7E7;
    }
    .filter-container{
        padding: 0px;
    }
    .my-table{
        margin:0px;
    }
    .dialog-table{
      border-radius: 6px;
      border: 1px solid #EFF2F6;
      height: 548px;
    }
}

</style>
