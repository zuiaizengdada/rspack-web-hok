<template>
  <div class="container reception-container">
    <div v-loading="loading" class="flex-1" style="overflow: auto">
      <div class="reception-item">
        <div class="reception-title">接待员工</div>
        <el-form
          ref="ruleForm"
          :model="form"
          :rules="rules"
          class="reception-form"
          label-width="100px"
        >
          <el-form-item
            v-if="modelType === 2"
            label="选择部门："
            prop="assessDept"
          >
            <el-button
              v-if="!form.assessDept.length"
              style="margin-bottom: 10px"
              :disabled="disabled"
              type="primary"
              size="mini"
              @click="selectDept(1)"
            ><i class="el-icon-plus el-icon--left" />新增部门</el-button>
            <div v-else>
              <el-tag
                v-for="item in form.assessDept"
                :key="item.deptId"
                :closable="type === 'add'"
                @close="delAssessDept(item.id)"
              >{{ item.deptName }}</el-tag>
              <el-button
                v-if="[0, '0'].includes(deptId)"
                type="primary"
                plain
                size="mini"
                class="reception-replace-btn"
                @click="selectDept(1, 'edit')"
              >更换部门</el-button>
            </div>
          </el-form-item>
          <el-form-item
            v-if="form.assessDept.length || modelType === 1"
            label="分配模式："
            prop="staffAssignType"
          >
            <div class="flex flex-between flex-middle" style="height: 40px">
              <el-radio-group
                v-model="form.staffAssignType"
                :disabled="type === 'detail'"
                @change="deptUpdate"
              >
                <el-radio :label="1">轮询分配(最大线索数等比例)</el-radio>
                <el-radio :label="3">轮询分配(按人员平均)</el-radio>
                <el-radio :label="2">依次分配(按顺序和人员阶梯)</el-radio>
              </el-radio-group>
              <div v-if="type !== 'add'" style="margin-right: 20px">
                员工设置可分配线索数：{{ normalMaxClueNum }}
              </div>
            </div>
            <teamTable
              ref="receptionTable"
              :type="type"
              :task-id="taskId"
              :is-default="false"
              :dept-id="form.assessDept[0] && form.assessDept[0].deptId"
              :disabled="disabled"
              @change="handleChangeTaskId"
              @refresh="getMaxNum"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="reception-item">
        <div class="reception-title">任务兜底</div>
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="reception-form"
          label-width="100px"
        >
          <el-form-item
            v-if="form.deptAssessDept.length > 1 && modelType === 2"
            label="分配模式："
            prop="deptAssignType"
          >
            <el-radio-group
              v-model="form.deptAssignType"
              :disabled="type === 'detail'"
              @change="deptUpdate"
            >
              <el-radio :label="1">团队间轮询分</el-radio>
              <el-radio :label="2">团队间依次分</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="modelType === 2"
            label="选择部门："
            prop="deptAssessDept"
          >
            <el-button
              style="margin-bottom: 10px"
              :disabled="disabled"
              type="primary"
              size="mini"
              @click="selectDept(2)"
            ><i class="el-icon-plus el-icon--left" />新增部门</el-button>
            <div v-if="form.deptAssessDept.length" class="reception-box">
              <el-tabs
                v-model="activeTabs"
                class="tabSign"
                type="border-card"
                :closable="type !== 'detail'"
                @tab-remove="delAssessDept"
                @tab-click="handleChangeTabs"
              >
                <el-tab-pane
                  v-for="(item, index) in form.deptAssessDept"
                  :key="index"
                  class="move-item"
                  :label="item && item.deptName"
                  :name="item && item.id"
                />
              </el-tabs>
              <div style="padding: 15px">
                <el-form-item label="分配模式：" required>
                  <div class="flex flex-between flex-middle" style="height: 40px">
                    <el-radio-group
                      v-model="form.itemAssessDept"
                      :disabled="type === 'detail'"
                      @change="deptUpdate"
                    >
                      <el-radio :label="1">轮询分配(最大线索数等比例)</el-radio>
                      <el-radio :label="3">轮询分配(按人员平均)</el-radio>
                      <el-radio :label="2">依次分配(按顺序和人员阶梯)</el-radio>
                    </el-radio-group>
                    <div v-if="type !== 'add'" style="margin-right: 20px">
                      兜底设置可分配线索数：{{ defaultMaxClueNum }}
                    </div>
                  </div>
                </el-form-item>
                <teamTable
                  ref="teamTable"
                  :type="type"
                  :model-type="modelType"
                  :disabled="disabled"
                  :is-default="true"
                  :task-id="taskId"
                  :dept-id="current.deptId"
                  @change="handleChangeTaskId"
                  @refresh="getMaxNum"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item v-else label="分配模式：">
            <div class="flex flex-between flex-middle" style="height: 40px">
              <el-radio-group
                v-model="form.defaultStaffAssignType"
                :disabled="type === 'detail'"
                @change="deptUpdate"
              >
                <el-radio :label="1">轮询分配(最大线索数等比例)</el-radio>
                <el-radio :label="3">轮询分配(按人员平均)</el-radio>
                <el-radio :label="2">依次分配(按顺序和人员阶梯)</el-radio>
              </el-radio-group>
              <div v-if="type !== 'add'" style="margin-right: 20px">
                兜底设置可分配线索数：{{ defaultMaxClueNum }}
              </div>
            </div>
            <teamTable
              ref="teamTable"
              :type="type"
              :model-type="modelType"
              :disabled="disabled"
              :is-default="true"
              :task-id="taskId"
              :dept-id="current.deptId"
              @change="handleChangeTaskId"
              @refresh="getMaxNum"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-if="type === 'add'" class="reception-footer">
      <el-button size="small" @click="onhandleBackStep">上一步</el-button>
      <el-button
        type="primary"
        size="small"
        @click="handleNextStep"
      >下一步</el-button>
    </div>
  </div>
</template>

<script>
import teamTable from './components/teamTable'
import sortable from 'sortablejs'
import { receptionStaffWarehouseAdd } from '@/api/privateArea/toolbox'
import {
  saleTaskDeptDoAdd,
  saleTaskDeptDoQuery,
  saleTaskDeptDoDel,
  saleTaskDeptDoUpdate,
  saleTaskDeptDoCheck,
  saleTaskDeptDoDeptIdUpdate,
  saleTaskMaxNum
} from '@/api/privateArea/revealTask'
export default {
  name: 'TeamReceptionSetting',
  components: {
    teamTable
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
    modelType: {
      default: 1,
      type: Number
    }
  },
  data() {
    return {
      form: {
        staffAssignType: 1,
        assessDept: [],
        deptAssignType: 1,
        itemAssessDept: 1,
        deptAssessDept: [],
        defaultStaffAssignType: 1
      },
      deptAssessDeptCopy: [],
      initForm: {},
      taskId: '',
      activeTabs: '',
      rules: {
        assessDept: [
          {
            required: true,
            message: '请选择接待员工部门',
            trigger: 'change',
            type: 'array'
          }
        ],
        staffAssignType: [
          {
            required: true,
            message: '请选择接待员工分配模式',
            trigger: 'change'
          }
        ],
        deptAssignType: [
          {
            required: true,
            message: '请选择任务兜底分配模式',
            trigger: 'change'
          }
        ]
      },
      current: {},
      loading: false,
      normalMaxClueNum: 0,
      defaultMaxClueNum: 0
    }
  },
  computed: {
    disabled() {
      return (
        (this.type === 'edit' && this.taskStatus === '4') ||
        this.type === 'detail'
      )
    },
    deptId() {
      const assessDept = this.form.assessDept[0] ?? {}
      return assessDept.deptId
    }
  },
  watch: {
    'form.staffAssignType': {
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.$refs.receptionTable.columns[6].visible = val === 2
        })
      }
    },
    'form.itemAssessDept': {
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.$refs.teamTable.columns[6].visible = val === 2
        })
      }
    },
    'form.defaultStaffAssignType': {
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.$refs.teamTable.columns[6].visible = val === 2
        })
      }
    }
  },
  methods: {
    async handleNextStep() {
      if (!this.validate()) {
        return
      }
      const { code } = await saleTaskDeptDoCheck(this.taskId)
      if (code !== 1) return
      this.deptUpdate()
      this.$emit('nextStep', this.form)
      this.$emit('taskIdChange', this.taskId)
    },
    rowDrop() {
      const el = document.querySelector('.tabSign .el-tabs__nav')
      if (!el) return
      const _this = this
      sortable.create(el, {
        animation: 300,
        dragClass: 'drag-item',
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.form.deptAssessDept.splice(oldIndex, 1)[0]
          _this.form.deptAssessDept.splice(newIndex, 0, currRow)
          const newArray = _this.form.deptAssessDept.slice(0)
          _this.form.deptAssessDept = [
            _this.$nextTick(() => {
              _this.form.deptAssessDept = newArray
              const deptAssessDept = JSON.stringify(_this.form.deptAssessDept)
              const deptAssessDeptCopy = JSON.stringify(
                _this.deptAssessDeptCopy
              )
              if (deptAssessDept !== deptAssessDeptCopy) {
                _this.deptUpdate()
              }
            })
          ]
        }
      })
    },
    handleMove() {
      return true
    },
    async deptUpdate() {
      if (this.modelType === 1) {
        if (this.type === 'edit') {
          this.$emit('save', { ...this.initForm, ...this.form })
        }
        return
      }
      const deptList = []
      const assessDept = this.form.assessDept[0] ?? {}
      if (assessDept?.id) {
        deptList.push({
          staffAssignType: this.form.staffAssignType,
          deptId: assessDept?.deptId,
          deptType: assessDept?.deptType,
          id: assessDept?.id,
          sort: 1,
          taskId: this.taskId
        })
      }
      this.form.deptAssessDept.forEach((i, index) => {
        const obj = {
          staffAssignType: i.staffAssignType,
          deptId: i.deptId,
          deptType: 2,
          id: i?.id,
          sort: index + 1,
          deptAssignType: this.form.deptAssignType,
          taskId: this.taskId
        }
        if (i?.id === this.activeTabs) {
          obj.staffAssignType = this.form.itemAssessDept
        }
        deptList.push(obj)
      })
      const { code } = await saleTaskDeptDoUpdate({ requests: deptList })
      this.$message.success('操作成功')
      if (code === 1) {
        this.saleTaskDeptDoQuery()
      }
    },

    selectDept(deptType, type = 'add') {
      const staffAssignType = deptType === 1 ? this.form.staffAssignType : 1
      const checkDept =
        deptType === 1
          ? this.form.assessDept.map(i => {
            return {
              name: i.deptName,
              deptId: i.deptId
            }
          })
          : []
      this.$AddressBook2({
        visible: true,
        multiple: false,
        type: [0],
        checkDept,
        success: res => {
          if (type === 'edit' && deptType === 1) {
            this.deptDeptIdUpdate({
              deptId: res.dept[0]?.deptId,
              id: this.form.assessDept[0]?.id ?? ''
            })
            return
          }
          this.deptAdd({
            staffAssignType,
            deptId: res.dept[0]?.deptId,
            deptType,
            taskId: this.taskId
          })
        }
      })
    },
    async deptDeptIdUpdate(params) {
      const { code } = await saleTaskDeptDoDeptIdUpdate(params)
      if (code === 1) {
        this.saleTaskDeptDoQuery()
      }
    },
    async saleTaskDeptDoQuery() {
      if (!this.taskId) return
      const modelType = this.initForm.modelType || this.modelType
      if (modelType === 1) {
        this.form = {
          staffAssignType: this.initForm.staffAssignType ?? 1,
          assessDept: [],
          deptAssignType: 1,
          itemAssessDept: 1,
          deptAssessDept: [],
          defaultStaffAssignType: this.initForm.defaultStaffAssignType ?? 1
        }
      } else {
        this.loading = true
        const { data } = await saleTaskDeptDoQuery(this.taskId)
        this.loading = false
        if (!data) return
        this.form.assessDept = data?.filter(i => i.deptType === 1) ?? []
        this.form.deptAssessDept = data?.filter(i => i.deptType === 2) ?? []
        this.deptAssessDeptCopy = JSON.parse(
          JSON.stringify(this.form.deptAssessDept)
        )
        if (this.form.deptAssessDept.length > 1) {
          this.form.deptAssignType =
            this.form.deptAssessDept[0].deptAssignType || 1
        }
        const assessDept = this.form.assessDept[0] ?? {}
        this.form.staffAssignType = assessDept.staffAssignType ?? 1
      }
      if (this.type !== 'add') {
        this.getMaxNum()
      }
      this.$nextTick(() => {
        this.$refs.receptionTable?.onRefresh()
        this.$refs.teamTable?.onRefresh()
        this.rowDrop()
      })
      if (this.form.deptAssessDept.length === 1 || !this.activeTabs) {
        this.getCurrentDeptData(this.form.deptAssessDept[0])
      }
    },
    getCurrentDeptData(item) {
      if (!item?.id) return
      this.activeTabs = item.id ?? ''
      this.form.itemAssessDept = item.staffAssignType
      this.current = item
      this.$nextTick(() => {
        this.$refs.teamTable.onRefresh()
      })
    },
    handleChangeTaskId(taskId) {
      this.taskId = taskId
    },
    async deptAdd(params) {
      const { code, data } = await saleTaskDeptDoAdd(params)
      if (data) {
        this.taskId = data
      }
      if (code === 1) {
        this.saleTaskDeptDoQuery()
      }
    },
    delAssessDept(data) {
      this.$delModal({
        tips: '确定删除该部门？',
        success: async () => {
          console.log('删除')
          const { code } = await saleTaskDeptDoDel(data)
          if (code === 1) {
            this.saleTaskDeptDoQuery()
          }
        }
      })
    },
    setData(form) {
      this.initForm = form
      if (!this.taskId) {
        this.taskId = form.id
      }
      this.saleTaskDeptDoQuery()
    },
    async getMaxNum() {
      if (!this.taskId) return
      const { data } = await saleTaskMaxNum(this.taskId)
      this.normalMaxClueNum = data.normalMaxClueNum
      this.defaultMaxClueNum = data.defaultMaxClueNum
    },
    validate() {
      const receptionTable = this.$refs?.receptionTable?.tableData ?? []
      if (!receptionTable.length) {
        this.$message.error('请选择接待员工')
        return
      }
      return true
    },
    onhandleBackStep() {
      this.$emit('backStep')
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
    handleChangeTabs() {
      this.form.deptAssessDept.forEach(i => {
        if (i.id === this.activeTabs) {
          this.getCurrentDeptData(i)
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
  .reception-item {
    margin-bottom: 30px;
    .reception-title {
      font-size: 14px;
      font-weight: 700;
      color: #000000;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      &::before {
        width: 2px;
        height: 15px;
        content: '';
        border-radius: 10px;
        background: #065cff;
        display: inline-block;
        margin: 0 8px 0 12px;
      }
    }
  }
  .reception-box {
    border: 1px solid #eff2f6;
    margin-bottom: 15px;
    border-radius: 6px;
  }
  .el-tabs {
    border: 0px;
    .el-tabs__header {
      background: #e4eefe;
      border-bottom: 0px;
      .el-tabs__nav-wrap {
        padding: 5px 20px 0;
        height: 40px;
        .el-tabs__item {
          border: 0px;
          border-radius: 12px 12px 0 0;
          color: #000;
          height: 36px;
          cursor: move;
        }
        .el-tabs__item.is-active {
          position: relative;
          // &::before {
          //   content: '';
          //   position: absolute;
          //   top: 100%;
          //   left: 0;
          //   width: 0;
          //   height: 0;
          //   border-left: 50px solid transparent;
          //   border-right: 50px solid transparent;
          //   border-bottom: 100px solid red;
          // }
        }
      }
    }
    .el-tabs__content {
      padding: 0px;
    }
  }
  .el-tabs__item:focus.is-active.is-focus:not(:active) {
    box-shadow: 0px;
  }
  .page_footer {
    padding: 0 0 10px 0;
  }
  .el-tabs--border-card {
    box-shadow: none;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
  .reception-table {
    height: calc(100vh - 478px);
    min-height: 300px;
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
