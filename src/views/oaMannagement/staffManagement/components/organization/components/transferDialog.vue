<template>
  <el-dialog
    width="576px"
    title="调动"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="调动人员" style="margin-bottom: 10px">
        {{ row.name }}
      </el-form-item>
      <el-form-item label="原部门" style="margin-bottom: 10px">
        {{ row.deptChainName }}
      </el-form-item>
      <el-form-item label="原部门主负责人" style="margin-bottom: 10px">
        {{ row.leaderName }}
      </el-form-item>
      <el-form-item label="原岗位" style="margin-bottom: 16px">
        {{ row.positionName }}
      </el-form-item>
      <el-form-item label="调动类型" prop="transferType" required>
        <el-select
          v-model="form.transferType"
          clearable
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="item in transferTypeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="新部门" prop="departmentId" required>
        <el-cascader
          ref="cascader1"
          @change="departmentIdChange"
          v-model="form.departmentId"
          style="width: 100%"
          :options="deptTreeArray"
          :props="{ emitPath: false, checkStrictly: true }"
          clearable
        />
      </el-form-item>
      <el-form-item label="新部门主负责人">
        <el-input :value="form.newLeaderName" disabled />
      </el-form-item>
      <el-form-item label="新岗位" prop="positionIds" required>
        <el-select
          v-model="form.positionIds"
          clearable
          multiple
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="item in jobList"
            :key="item.jobId"
            :label="item.jobName"
            :value="item.jobId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark" style="margin-bottom: 0">
        <el-input
          v-model="form.remark"
          clearable
          type="textarea"
          :maxlength="100"
          show-word-limit
          :autosize="{ minRows: 6, maxRows: 6 }"
          placeholder="请输入原因"
        />
      </el-form-item>
    </el-form>
    <template slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" :loading="loading">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading"
        >确 定</el-button
      >
    </template>
  </el-dialog>
</template>
<script>
import { employeeTransferAjax } from '../../../../api/staff.js'
import { jobNoPageList } from '@/views/system/positionManagement/api/job'
import { transferTypeOption } from '../../../options'
import { deptTree } from '@/api/addressBookApi'
export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      form: {
        newLeaderName: '',
        positionIds: []
      },
      rules: {
        transferType: [
          {
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        positionIds: [
          {
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        departmentId: [
          {
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ]
      },
      postList: [],
      jobList: [],
      transferTypeOption,
      deptTreeArray: [],
      loading: false
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  created() {
    this.getJobList()
    this.loadTreeData()
  },
  methods: {
    async loadTreeData() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
    },
    departmentIdChange() {
      console.log(this.$refs['cascader1'].getCheckedNodes()[0], 555)
      this.form.newLeaderName =
        this.$refs['cascader1'].getCheckedNodes()[0].data.leaderName
    },
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            ...this.form,
            employeeId: this.row.employeeId
          }
          this.loading = true
          employeeTransferAjax(params)
            .then(res => {
              if (res.code === 1) {
                this.$emit('success')
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    closeDialog() {
      this.$emit('close')
    },
    async getJobList() {
      const res = await jobNoPageList()

      this.jobList = res.data
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  border-radius: 10px;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e7e7e7;
}
.tips-block {
  width: 100%;
  padding: 20px;
  background: #f7f8f9;
  border-radius: 8px;
  margin-bottom: 20px;
  i {
    float: left;
    font-size: 22px;
    margin-right: 15px;
    margin-top: 3px;
    color: #f18649;
  }
  span {
    width: 425px;
    display: inline-block;
    color: #f18649;
    .title {
      font-size: 16px;
      margin-bottom: 8px;
    }
  }
}
</style>
