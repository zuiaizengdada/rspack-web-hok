<template>
  <div class="container reception-container">
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      class="reception-form"
      label-width="100px"
    >
      <el-form-item label="分配模式：" prop="assignment">
        <el-radio v-model="form.assignment" :label="1">轮询分配</el-radio>
        <span class="tips">按照更新时间倒序进行轮询分配</span>
      </el-form-item>
      <el-form-item label="兜底员工：" prop="assessUsers">
        <el-button
          v-if="!assessUsers.length"
          :disabled="disabled"
          type="primary"
          size="mini"
          @click="selectUser"
        ><i class="el-icon-plus el-icon--left" />新增</el-button>
        <div v-else>
          <el-tag :closable="!disabled" @close="delAssessUsers">{{
            userName
          }}</el-tag>
          <el-button
            type="primary"
            plain
            :disabled="disabled"
            size="mini"
            class="reception-replace-btn"
            @click="setSelectUser"
          >更换员工</el-button>
        </div>
      </el-form-item>
      <el-form-item label="接待员工：" prop="reception">
        <el-button
          type="primary"
          :disabled="disabled"
          size="mini"
          @click="addAssessUser"
        ><i class="el-icon-plus el-icon--left" />新增</el-button>
      </el-form-item>
    </el-form>
    <div class="reception-content">
      <search :type="type" @submit="onRefresh" @show="handleShowLog" />
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
        <template #action="{ row }">
          <el-button
            v-if="row.receptionStatus !== 2"
            type="text"
            :disabled="disabled"
            @click="handleChangeStatus(row)"
          >暂停分配</el-button>
          <el-button
            v-else
            type="text"
            :disabled="disabled"
            @click="handleChangeStatus(row)"
          >继续分配</el-button>
        </template>
      </dynamicTable>
    </div>
    <div v-if="type === 'add'" class="reception-footer">
      <el-button size="small" @click="onhandleBackStep">上一步</el-button>
      <el-button
        type="primary"
        size="small"
        @click="handleNextStep"
      >下一步</el-button>
      <el-button
        type="primary"
        size="small"
        @click="handleShowAllocation"
      >选择已有分配规则</el-button>
      <el-button
        class="reception-footer__btn"
        size="small"
        @click="handleSave"
      >保存到分配规则库</el-button>
    </div>
    <allocationSelect ref="allocationSelect" @submit="handleSelect" />
    <saveDialog ref="saveDialog" @save="save" />
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
import dynamicTable from '@/components/DynamicTable/table'
import allocationSelect from './components/allocationSelect'
import saveDialog from './components/saveDialog'
import search from './components/search'
import { getOptionsValueByKey } from '@/filters/index'
import operateLog from './components/operateLog'
import addUserModal from './components/addUserModal'
import {
  receptionAdd,
  receptionSet,
  receptionPage,
  receptionUpdateStatus,
  receptionStaffRemove,
  receptionStaffWarehouseAdd,
  receptionStaffDefault,
  receptionStaffAdd,
  updateTaskMaxClueNum
} from '@/api/privateArea/toolbox'
export default {
  name: 'ReceptionSetting',
  components: {
    dynamicTable,
    search,
    allocationSelect,
    saveDialog,
    operateLog,
    addUserModal
  },
  props: {
    type: {
      default: 'add',
      type: String
    },
    taskStatus: {
      default: '1',
      type: String
    },
    dataType: {
      default: 1,
      type: Number
    },
    taskObjective:{
      default: 1,
      type: Number
    },
    updateTaskId: {
      type: String,
      default: ''
    },
    modelType: {
      default: 1,
      type: Number
    }
  },
  data() {
    return {
      form: {
        assignment: 1,
        receptionStaffs: []
      },
      initForm: {},
      tableData: [],
      columns: getColumns.call(this),
      assessUsers: [],
      userName: '',
      taskId: '',
      receptionUserList: [],
      multipleSelection: [],
      rules: {
        assessUsers: [
          {
            required: true,
            message: '请选择兜底员工',
            trigger: 'change',
            type: 'array'
          }
        ],
        reception: [
          {
            required: true,
            message: '请选择接待员工',
            trigger: 'change',
            type: 'array'
          }
        ]
      },
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
      ]
    }
  },
  computed: {
    disabled() {
      return this.type === 'edit' && this.taskStatus === '4'
    }
  },
  watch: {
    updateTaskId() {
      if (this.updateTaskId) this.taskId = this.updateTaskId
      console.log(this.updateTaskId, this.taskId, 'this.updateTaskId')
    },
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
    handleNextStep() {
      if (!this.validate()) {
        return
      }
      this.$emit('nextStep', this.form)
      this.$emit('taskIdChange', this.taskId)
    },
    handleSelect(id) {
      this.setData({ id })
    },
    setData(form) {
      this.initForm = form
      if (!this.taskId) {
        this.taskId = form.id
      }
      this.onRefresh()
      this.getUserDefault()
    },
    validate() {
      if (!this.assessUsers.length) {
        this.$message.error('请选择兜底员工')
        return
      }
      if (!this.tableData.length) {
        this.$message.error('请选择接待员工')
        return
      }
      return true
    },
    handleShowLog() {
      this.$refs.operateLog.open(this.taskId)
    },
    onhandleBackStep() {
      this.$emit('backStep')
    },
    onRefresh(params = {}) {
      this.$refs.table.onRefresh(params)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async handleMaxClueNumBlur(row) {
      const { id, maxClueNum, receptionStatus, sysUserId } = row
      const { code, data } = await updateTaskMaxClueNum([
        {
          id,
          maxClueNum,
          receptionStatus,
          sysUserId,
          isDefault: false
        }
      ])
      if (code === 1) {
        this.$message.success(data)
        this.onRefresh()
      }
    },
    async save(name) {
      const { code } = await receptionStaffWarehouseAdd({
        assignment: this.form.assignment,
        name,
        taskId: this.taskId
      })
      if (code === 1) {
        this.$message.success('保存成功')
      }
    },
    handleSave() {
      if (!this.validate()) {
        return
      }
      this.$refs.saveDialog.open()
    },
    async handleChangeStatus(row) {
      const { code } = await receptionUpdateStatus({
        id: row.id,
        sysUserId: row.sysUserId,
        receptionStatus: row.receptionStatus === 1 ? 2 : 1,
        isDefault: false
      })
      if (code === 1) {
        this.$message.success('修改成功')
        this.onRefresh()
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
          isDefault: false
        }
      })
      const { code } = await receptionStaffRemove(params)
      if (code === 1) {
        this.$message.success('移除成功')
        this.onRefresh()
      }
    },
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
                  isDefault: false
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
    async delAssessUsers() {
      if (this.type === 'edit') {
        return this.$message.warning('必须存在一位兜底人员!')
      }
      const row = this.assessUsers[0]
      const { code } = await receptionStaffRemove([
        {
          id: row.id,
          sysUserId: row.userId,
          taskId: this.taskId,
          isDefault: false
        }
      ])
      if (code === 1) {
        this.assessUsers = []
        this.userName = ''
      }
    },
    getList(params) {
      if (this.taskId) {
        return receptionPage({
          ...params,
          taskId: this.taskId,
          isDefault: false
        })
      }
      return {
        data: {
          items: [],
          total: 0
        }
      }
    },
    handleShowAllocation() {
      this.$refs.allocationSelect.open(this.taskId)
    },
    async receptionAdd(params) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        let resCode
        let successNum
        if (this.type === 'add') {
          const { data, code } = await receptionAdd(params)
          this.taskId = data.tempTaskId
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
          resolve()
        }
      })
    },
    addAssessUser() {
      this.$refs.addUserModal.open(this.initForm)
    },
    handleAddUserModal(data) {
      const receptionUserList = data?.assessUsers?.map(i => {
        return {
          isDefault: false,
          sysUserId: i.userId,
          receptionStatus: 1,
          maxClueNum: data.maxClueNum,
          dataType: this.dataType,
          taskId: this.taskId,
          modelType: this.modelType,
          taskObjective:this.taskObjective
        }
      })
      console.log(222222222,receptionUserList)
      this.receptionAdd(receptionUserList)
    },
    async getUserDefault() {
      if (!this.taskId) return
      const { data } = await receptionStaffDefault(this.taskId)
      if (!data) return
      this.assessUsers = [
        {
          ...data,
          userName: data?.followUserName,
          userId: data?.id,
          nickName: data?.followUserName
        }
      ]
      this.userName = `${data.deptName}-${data.followUserName}`
    },
    setSelectUser() {
      this.$AddressBook({
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
            id: this.taskId,
            dataType:this.dataType,
            taskObjective:this.taskObjective,
          }
          const { code, data } = await receptionSet(params)
          if (code === 1) {
            if (data.tempTaskId && this.type === 'add') {
              this.taskId = data.tempTaskId
            }
            this.$message.success('兜底人员修改成功')
            this.onRefresh()
            this.getUserDefault()
          }
        }
      })
    },
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [1],
        checkUser: this.assessUsers,
        success: async res => {
          res.user.forEach(v => {
            v.userName = v.nickName
          })
          const params = [
            {
              isDefault: true,
              sysUserId: res.user[0]?.userId,
              receptionStatus: 1,
              taskId: this.taskId,
              dataType: this.dataType,
              modelType: this.modelType,
              taskObjective:this.taskObjective
            }
          ]
          if (this.assessUsers.length) {
            await this.delAssessUsers(params)
          }
          await this.receptionAdd(params)
          this.getUserDefault()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.reception-container.container ::v-deep {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .reception-table {
    height: calc(100vh - 478px);
    min-height: 300px;
  }
  .reception-form {
    height: 175px;
  }
  .el-radio {
    margin-right: 8px;
  }
  .filter-container {
    padding: 0px;
  }
  .tips {
    font-weight: 400;
    color: #999999;
    font-size: 12px;
  }
  .reception-replace-btn {
    background: #fff;
    color: #0c6fff;
    border: 1px solid #0c6fff;
    margin-left: 20px;
  }
  .reception-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    border-radius: 6px;
    border: 1px solid #eff2f6;
  }
  .reception-footer {
    margin-top: 30px;
    height: 60px;
    border-top: 1px solid #e7e7e7;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .reception-footer__btn {
      background: #fff;
      color: #0c6fff;
      border: 1px solid #0c6fff;
    }
  }
}
</style>
