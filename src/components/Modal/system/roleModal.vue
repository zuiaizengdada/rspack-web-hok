<!-- 角色权限列表弹框 -->
<template>
  <div v-loading="loading" :class="`group${type == 2 ? 'Dialog' : 'Drawer'}`">
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      size="small"
      class="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="终端/系统">
        <span>商家后台</span>
      </el-form-item>
      <el-form-item label="角色Id" prop="roleId">
        <span>{{ form.roleId }}</span>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" />
      </el-form-item>
      <el-form-item label="权限字符串" prop="roleKey">
        <el-input v-model="form.roleKey" />
      </el-form-item>
      <el-form-item label="显示顺序" prop="roleSort">
        <el-input-number v-model="form.roleSort" :min="0" />
      </el-form-item>
      <el-form-item label="角色权限" prop="roleName">
        <el-tree
          ref="editRoleTree"
          :data="treeData"
          node-key="id"
          show-checkbox
          :default-checked-keys="form.menuIds"
          @check="handleCheckChange"
        />
      </el-form-item>
      <el-form-item label="角色状态" prop="status">
        <el-switch
          v-model="form.status"
          :active-value="0"
          :inactive-value="1"
        />
      </el-form-item>
    </el-form>
    <div class="demo-drawer__footer">
      <el-button size="small" :loading="loading" @click="$emit('close')"
        >取 消</el-button
      >
      <el-button :disabled="data && data.roleName === '管理员'" :loading="loading" type="primary" size="small" @click="send()"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
import { editRole, getRoleMenuTree } from '@/api/system/role'
export default {
  props: {
    type: {
      type: Number,
      default: 1
    },
    visible: {
      type: Boolean,
      default: false
    },

    data: {
      type: Object,
      default: () => {
        return {
          menuIds: [],
          roleId: '',
          roleKey: '',
          roleName: '',
          roleSort: 0,
          status: ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      form: {
        menuIds: [],
        roleId: '',
        roleKey: '',
        roleName: '',
        roleSort: 0,
        status: ''
      },
      treeData: [],
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '请输入权限字符串', trigger: 'blur' }
        ],
        status: [{ required: true, message: '请选择角色状态', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          console.log(this)
          this.getRoleMenuTree(this.data.roleId)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleCheckChange(
      checkedNodes,
      checkedKeys,
      halfCheckedNodes,
      halfCheckedKeys
    ) {
      console.log(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys)
      console.log('checkedKeys.checkedKeys----------', checkedKeys.checkedKeys)
      this.form.menuIds = checkedKeys.checkedKeys
    },
    send() {
      console.log('点击确定')
      this.$refs.form.validate(valid => {
        if (valid) {
          this.editRole()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editRole() {
      this.loading = true
      const data = {
        ...this.form,
        menuIds: this.$refs.editRoleTree
          .getCheckedKeys()
          .concat(this.$refs.editRoleTree.getHalfCheckedKeys())
      }
      editRole(data)
        .then(res => {
          this.loading = false
          this.$emit('success')
        })
        .catch(() => {
          this.loading = false
        })
    },
    getRoleMenuTree(roleId) {
      this.loading = true
      const myForm = JSON.parse(JSON.stringify(this.data))
      getRoleMenuTree(roleId)
        .then(res => {
          this.treeData = res.data.menus
          this.form = {
            menuIds: res.data.checkedKeys,
            roleId: myForm.roleId,
            roleKey: myForm.roleKey,
            roleName: myForm.roleName,
            roleSort: myForm.roleSort,
            status: myForm.status
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
    //
    // handleCheckChange(data, checked, indeterminate) {
    //   console.log(data, checked, indeterminate)
    //   if (checked) {
    //     // 添加
    //     this.form.menuIds.push(data.id)
    //   } else {
    //     // 移除
    //     const index = this.form.menuIds.findIndex(v => v.id === data.id)
    //     this.form.menuIds.splice(index, 1)
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;
  .form {
    // flex: 1;
    height: calc(100vh - 77px - 50px);
    width: 100%;
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .demo-drawer__footer {
    width: 100%;
    height: 50px;
    padding-top: 10px;
    padding-left: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 10px;
  }
  .form_avatar {
    display: flex;
    align-items: center;
    .form_btn {
      height: 30px;
      margin-left: 10px;
    }
  }
  .form_textarea {
    width: 600px;
    margin-right: 10px;
  }
}
.image_poster {
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #dcdcdc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  > span {
    margin-top: 13px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    line-height: 20px;
  }
  &:hover {
    border: 1px dashed #1472ff;
  }
}
.tips {
  // margin-top: 20px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
</style>
