<template>
  <el-dialog width="550px" title="批量设置角色" :visible.sync="setRoleModalFlag" :close-on-click-modal="false">
    <div class="tips-block">
      <i class="el-icon-warning" />
      <span>
        <p class="title">注意</p>
        <p>批量设置员工角色，原角色将会被覆盖，新角色将赋予对应功能权限，请谨慎操作！</p>
      </span>
    </div>
    <el-form ref="formModal" :model="form" :rules="rules">
      <el-form-item label="请选择角色" :label-width="formLabelWidth" prop="roleIds">
        <el-select
          v-model="form.roleIds"
          class="select-role"
          clearable
          filterable
          placeholder="请选择"
          multiple
        >
          <el-option
            v-for="item in roleData"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="setRoleModalFlag = false">取 消</el-button>
      <el-button type="primary" @click="submitForSetRole">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getRoleOptions } from '@/api/role'
export default {
  data() {
    return {
      setRoleModalFlag: false,
      formLabelWidth: '100px',
      roleData: [],
      form: {
        roleIds: []
      },
      rules: {
        roleIds: [
          { required: true, message: '请选择所需要设置的角色', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.loadRoleData()
  },
  methods: {
    loadRoleData() {
      getRoleOptions().then(res => {
        if (res.code === 1) {
          this.$nextTick(() => {
            this.roleData = res.data
          })
        }
      })
    },
    submitForSetRole() {
      console.log(this.form)
      this.$emit('submitRoleSet', this.form)
    },
    show() {
      if (this.$refs.formModal) {
        this.$refs.formModal.resetFields()
      }
      this.setRoleModalFlag = true
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
    background: #F7F8F9;
    border-radius: 4px;
    margin-bottom: 20px;
    i {
        float: left;
        font-size: 22px;
        margin-right: 15px;
        margin-top: 3px;
        color: #F18649;
    }
    span {
        width: 425px;
        display: inline-block;
        .title {
            font-size: 16px;
            margin-bottom: 8px;
        }
    }
}
.select-role {
    width: 412px;
}
</style>

