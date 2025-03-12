<template>
  <el-dialog
    width="886px"
    :title="`编辑${form.name}在职信息`"
    :visible.sync="visible"
    inline
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <el-form
      ref="formModal"
      :model="form"
      :rules="rules"
      label-position="top"
      size="small"
      :inline="true"
    >
      <el-form-item
        label="入职公司"
        label-width="100px"
        prop="companyId"
        class="form-item"
        v-if="form.employeeType === 0"
      >
        <el-select
          v-model="form.companyId"
          clearable
          filterable
          placeholder="请选择入职公司"
          style="width: 100%"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="入职部门"
        class="form-item"
        label-width="100px"
        prop="entryDepartmentName"
        v-if="form.employeeType === 0"
      >
        <el-cascader
          ref="cascader1"
          v-model="form.deptId"
          style="width: 100%"
          :options="deptTreeArray"
          :props="{ emitPath: false, checkStrictly: true }"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="岗位"
        label-width="100px"
        prop="positionId"
        class="form-item"
        v-if="form.employeeType === 0"
      >
        <el-select
          v-model="form.positionId"
          clearable
          filterable
          placeholder="请选择岗位"
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
      <el-form-item
        label="预计入职时间"
        class="form-item"
        label-width="100px"
        prop="expectedEntryTime"
        v-if="form.employeeType === 0"
      >
        <el-date-picker
          v-model="form.expectedEntryTime"
          value-format="timestamp"
          type="date"
          placeholder="选择日期时间"
          style="width: 100% !important"
        />
      </el-form-item>
      <el-form-item
        label="手机号"
        label-width="100px"
        prop="phone"
        class="form-item"
      >
        <el-input v-model="form.phone" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item
        label="邮箱"
        label-width="100px"
        prop="email"
        class="form-item"
      >
        <el-input v-model="form.email" clearable placeholder="请输入" />
      </el-form-item>
      <div class="p_r_20">
        <el-form-item
          label="现居住地址"
          label-width="100px"
          prop="address"
          class="w_100"
        >
          <el-input
            v-model="form.address"
            clearable
            type="textarea"
            :maxlength="100"
            show-word-limit
            :autosize="{ minRows: 6, maxRows: 6 }"
            placeholder="请输入"
          />
        </el-form-item>
      </div>
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
import { jobNoPageList } from '@/views/system/positionManagement/api/job'
import {
  editBaseInfoAjax,
  getCompanyListAjax
} from '@/api/businessAdmin/talentFile'
import { deptTree } from '@/api/addressBookApi'

export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {},
      rules: {
        phone: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            pattern: /^[0-9]{11}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱号',
            trigger: 'blur'
          }
        ],
        address: [
          {
            required: true,
            message: '请输入居住地址',
            trigger: 'blur'
          }
        ]
      },
      postList: [],
      jobList: [],
      deptTreeArray: [],
      companyList: [],
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
    this.form = {
      ...this.info,
      deptId: parseInt(this.info.departmentId),
      positionId: parseInt(this.info.positionId)
    }
    this.getCompanyPageList()
    this.getJobList()
    this.loadTreeData()
  },
  methods: {
    async loadTreeData() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
    },
    submit() {
      this.$refs.formModal.validate(valid => {
        if (valid) {
          const params = {
            address: this.form.address,
            companyId: this.form.companyId,
            deptId: this.form.deptId,
            email: this.form.email,
            expectedEntryTime: this.form.expectedEntryTime,
            personnelBaseInfoId: this.form.personnelBaseInfoId,
            phone: this.form.phone,
            positionId: this.form.positionId
          }
          this.loading = true
          editBaseInfoAjax(params)
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
    async getCompanyPageList() {
      getCompanyListAjax().then(res => {
        if (res.code === 1) {
          this.companyList = res.data.filter(item => item.status === 0)
        }
      })
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
    getJobList() {
      jobNoPageList().then(res => {
        if (res.code === 1) {
          this.jobList = res.data
        }
      })
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
::v-deep .el-dialog__body {
  padding: 20px 0 0 20px;
}
.form-item {
  width: 267px;
}
.w_100 {
  width: 100%;
}
.p_r_20 {
  padding-right: 20px;
}
</style>
