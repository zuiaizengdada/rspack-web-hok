<template>
  <div class="container">
    <div class="reception-content">
      <search
        :type="type"
        @submit="onRefresh"
        @add="addPerson"
        @show="handleShowLog"
      />
      <dynamicTable
        ref="table"
        v-model="tableData"
        class="reception-table"
        row-key="id"
        height="300px"
        checkbox
        :columns="columns"
        :get-list-api="getList"
        @selectionChange="handleSelectionChange"
      >
        <template #footer>
          <el-button
            style="margin-left: 20px; color: #f53f3f"
            type="text"
            :disabled="disabled"
            @click="handleDel"
          >批量移除</el-button>
          <el-button
            v-if="[1, 4].includes(dataType)"
            style="margin-left: 20px"
            :disabled="disabled"
            type="text"
            @click="handleUpdate"
          >批量更新分配人数</el-button>
        </template>
        <template #jobStatus="{ row }">
          <MIconStatus
            :background="
              getOptionsValueByKey('value', 'background', row.status, jobOption)
            "
            :color="
              getOptionsValueByKey('value', 'color', row.status, jobOption)
            "
            :icon-class="
              getOptionsValueByKey('value', 'icon', row.status, jobOption)
            "
            :title="
              getOptionsValueByKey('value', 'label', row.status, jobOption)
            "
          />
        </template>
        <template #receptionStatus="{ row }">
          <MIconStatus
            :background="
              getOptionsValueByKey(
                'value',
                'background',
                row.receptionStatus,
                receptionOption
              )
            "
            :color="
              getOptionsValueByKey(
                'value',
                'color',
                row.receptionStatus,
                receptionOption
              )
            "
            :icon-class="
              getOptionsValueByKey(
                'value',
                'icon',
                row.receptionStatus,
                receptionOption
              )
            "
            :title="
              getOptionsValueByKey(
                'value',
                'label',
                row.receptionStatus,
                receptionOption
              )
            "
          />
        </template>
        <template #maxClueNum="{ row }">
          <el-input-number
            v-model="row.maxClueNum"
            controls-position="right"
            style="width: 100px"
            :max="2000"
            :min="1"
            :disabled="disabled"
            :controls="false"
            step-strictly
            @blur="handleMaxClueNumBlur(row)"
          />
        </template>
        <template #sort="{ row }">
          <el-input-number
            v-model="row.sort"
            controls-position="right"
            style="width: 100px"
            :disabled="disabled"
            :controls="false"
            step-strictly
            @blur="handleChangeSort(row)"
          />
        </template>
        <template #action="{ row }">
          <el-button
            v-if="row.receptionStatus !== 2"
            type="text"
            :disabled="disabled || row.status === 1"
            @click="handleChangeStatus(row)"
          >暂停分配</el-button>
          <el-button
            v-else
            type="text"
            :disabled="disabled || row.status === 1"
            @click="handleChangeStatus(row)"
          >继续分配</el-button>
        </template>
      </dynamicTable>
    </div>
    <operateLog ref="operateLog" />
    <addUserModal
      ref="addUserModal"
      :data-type="dataType"
      @success="handleAddUserModal"
    />
  </div>
</template>

<script>
import { getColumns } from './columns'
import { getOptionsValueByKey } from '@/filters/index'
import dynamicTable from '@/components/DynamicTable/table'
import search from './search'
import operateLog from './operateLog'
import addUserModal from './addUserModal'
import {
  receptionPage,
  receptionUpdateStatus,
  receptionStaffRemove,
  updateTaskMaxClueNum,
  receptionAdd,
  receptionStaffAdd,
  receptionSet
} from '@/api/privateArea/toolbox'
export default {
  components: {
    dynamicTable,
    search,
    operateLog,
    addUserModal
  },
  props: {
    type: {
      default: 'add',
      type: String
    },
    disabled: {
      default: false,
      type: Boolean
    },
    dataType: {
      default: 1,
      type: Number
    },
    taskId: {
      type: String,
      default: ''
    },
    isDefault: {
      default: false,
      type: Boolean
    },
    deptId: {
      type: [String, Number],
      default: ''
    },
    modelType: {
      default: 1,
      type: Number
    }
  },
  data() {
    return {
      columns: getColumns.call(this),
      multipleSelection: [],
      tempDataList: [],
      receptionOption: [
        {
          label: '正常分配',
          value: 1,
          background: '#E6F7EA',
          color: '#00B42A',
          icon: 'icon_receptionStatus1'
        },
        {
          label: '暂停分配',
          value: 2,
          background: '#FEF1EC',
          color: '#FF7D00',
          icon: 'icon_taskStatus4'
        }
      ],
      jobOption: [
        {
          label: '在职',
          value: 0,
          background: '#E6F7EA',
          color: '#00B42A',
          icon: 'icon_jobStatus0'
        },
        {
          label: '离职',
          value: 1,
          background: '#EEF2F9',
          color: '#717F99',
          icon: 'icon_jobStatus1'
        }
      ],
      tableData: [],
      userName: '',
      staffAssignType: 1
    }
  },
  watch: {
    dataType() {
      if ([1, 4].includes(this.dataType)) {
        this.columns[4].visible = true
        this.columns[5].visible = true
      } else {
        this.columns[4].visible = false
        this.columns[5].visible = false
      }
    }
  },
  methods: {
    getOptionsValueByKey,
    async handleUpdate() {
      if (!this.multipleSelection.length) {
        this.$message.error('请先勾选员工')
        return
      }
      this.$prompt('请输入最大线索数', '批量更新分配人数', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(0|[1-9]\d{0,2}|500)$/,
        beforeClose: async (action, instance, done) => {
          console.log(action, instance, done)
          if (action === 'confirm') {
            const inputValue = parseInt(instance.inputValue, 10)
            console.log(inputValue)
            if (inputValue >= 1 && inputValue <= 500) {
              // 处理输入值
              const params = this.multipleSelection.map(i => {
                return {
                  id: i.id,
                  maxClueNum: inputValue,
                  receptionStatus: i.receptionStatus,
                  sysUserId: i.sysUserId,
                  isDefault: this.isDefault
                }
              })
              const { code, data } = await updateTaskMaxClueNum(params)
              if (code === 1) {
                this.$message.success(data)
                this.onRefresh()
              }
              done() // 手动关闭弹框
            } else {
              this.$message.error('请输入1到500之间的整数')
            }
          }
          if (action === 'cancel') {
            done()
          }
        },
        inputErrorMessage: '请输入1到500之间的整数'
      })
    },
    addPerson() {
      this.$refs.addUserModal.open(this.initForm, this.deptId)
    },
    getList(params) {
      this.$emit('refresh')
      if (this.taskId) {
        return receptionPage({
          ...params,
          taskId: this.taskId,
          isDefault: this.isDefault,
          deptId: this.deptId || undefined
        })
      }
      return {
        data: {
          items: [],
          total: 0
        }
      }
    },
    async handleDel() {
      if (!this.multipleSelection.length) {
        this.$message.error('请先勾选员工')
        return
      }
      const params = this.multipleSelection.map(i => {
        return {
          id: i.id,
          sysUserId: i.sysUserId,
          taskId: this.taskId,
          isDefault: this.isDefault,
          deptId: this.deptId
        }
      })
      const { code } = await receptionStaffRemove(params)
      if (code === 1) {
        this.$message.success('移除成功')
        this.$refs.table.config.pageIndex = 1
        this.onRefresh()
      }
    },
    async handleChangeStatus(row) {
      const { code } = await receptionUpdateStatus({
        id: row.id,
        sort: row.sort,
        sysUserId: row.sysUserId,
        receptionStatus: row.receptionStatus === 1 ? 2 : 1,
        isDefault: this.isDefault
      })
      if (code === 1) {
        this.$message.success('修改成功')
        this.onRefresh()
      }
    },
    async handleChangeSort(row) {
      const { code } = await receptionUpdateStatus({
        id: row.id,
        sort: row.sort || 0,
        sysUserId: row.sysUserId,
        isDefault: this.isDefault
      })
      if (code === 1) {
        this.$message.success('修改成功')
        this.onRefresh()
      }
    },
    async handleMaxClueNumBlur(row) {
      const { id, maxClueNum = 0, receptionStatus, sysUserId } = row
      const { code, data } = await updateTaskMaxClueNum([
        {
          id,
          maxClueNum,
          receptionStatus,
          sysUserId,
          isDefault: this.isDefault
        }
      ])
      if (code === 1) {
        this.$message.success(data)
        this.onRefresh()
      }
    },
    onRefresh(params = {}) {
      this.$nextTick(() => {
        this.multipleSelection = []
        this.$refs.table.toggleSelection()
        this.$refs.table.onRefresh(params)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleShowLog() {
      this.$refs.operateLog.open(this.taskId, this.isDefault)
    },
    addAssessUser() {
      this.$refs.addUserModal.open(this.initForm)
    },
    handleAddUserModal(data) {
      const receptionUserList = data?.assessUsers?.map(i => {
        return {
          isDefault: this.isDefault,
          sysUserId: i.userId,
          receptionStatus: 1,
          maxClueNum: data.maxClueNum,
          taskId: this.taskId,
          deptId: this.deptId,
          modelType: this.modelType
        }
      })
      this.tempDataList = receptionUserList
      this.receptionAdd(receptionUserList)
    },
    async receptionAdd(params) {
      let resCode
      let successNum
      if (this.type === 'add') {
        const { data, code } = await receptionAdd(params)
        this.$emit('change', data.tempTaskId)
        // this.taskId = data.tempTaskId
        successNum = data.successNum
        resCode = code
      } else {
        const { code, data } = await receptionStaffAdd(params)
        resCode = code
        successNum = data.successNum
      }
      if (resCode === 1) {
        if (successNum) {
          this.$message.success(`成功添加${successNum}个`)
        } else {
          this.$message.error(`添加人员不在当前部门`)
          return
        }
        this.$refs.addUserModal.visible = false
        this.onRefresh()
      }
    },
    setSelectUser() {
      this.$AddressBook2({
        visible: true,
        multiple: false,
        type: [1],
        checkUser: this.assessUsers,
        success: async res => {
          res.user.forEach(v => {
            v.userName = v.nickName
          })
          const params = {
            sysUserId: res.user[0]?.userId,
            id: this.taskId
          }
          const { code, data } = await receptionSet(params)
          if (code === 1) {
            if (data.tempTaskId && this.type === 'add') {
              //   this.taskId = data.tempTaskId
              this.$emit('change', data.tempTaskId)
            }
            this.$message.success('兜底人员修改成功')
            this.onRefresh()
            this.saleTaskDeptDoQuery()
          }
        }
      })
    }
  }
}
</script>

<style></style>
