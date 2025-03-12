<template>
  <el-form ref="form" :model="form" label-width="120px" :rules="rules">
    <el-form-item label="岗位名称" prop="jobName">
      <el-input
        v-model="form.jobName"
        placeholder="请输入岗位名称"
        :maxlength="30"
        show-word-limit
      />
    </el-form-item>
    <el-form-item label="伏羲云默认角色" prop="roleList">
      <el-select
        v-model="form.roleList"
        multiple
        placeholder="请选择伏羲云默认角色"
        filterable
      >
        <el-option
          v-for="item in roleOptions"
          :key="item.roleId"
          :label="item.roleName"
          :value="item.roleId"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="岗位描述" prop="jobDesc">
      <el-input
        v-model="form.jobDesc"
        :maxlength="100"
        type="textarea"
        placeholder="请输入岗位描述"
        :autosize="{ minRows: 3, maxRows: 5 }"
      />
    </el-form-item>
  </el-form>
</template>
<script>
import { getRoleOptions } from '@/api/role'
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        jobName: '', // 岗位名称
        roleList: [], // 伏羲云默认角色
        jobDesc: '' // 岗位描述
      },
      rules: {
        jobName: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ],
        roleList: [
          { required: true, message: '请选择伏羲云默认角色', trigger: 'change' }
        ],
        jobDesc: [
          { required: true, message: '请输入岗位描述', trigger: 'blur' }
        ]
      },
      roleOptions: []
    }
  },
  mounted() {
    this.queryRoleOptions()
    if (this.data !== undefined) {
      const { jobName, roleList, jobDesc } = this.data
      const arr = []
      roleList.forEach(item => {
        arr.push(item.roleId)
      })
      this.form.jobName = jobName
      this.form.jobDesc = jobDesc
      this.form.roleList = arr
    }

    // this.form = this.data
  },
  methods: {
    async queryRoleOptions() {
      const res = await getRoleOptions()
      console.log(res)
      this.roleOptions = res.data
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve()
          } else {
            reject(new Error('error'))
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-select,
::v-deep .el-input,
::v-deep .el-textarea {
  width: 280px;
}
</style>
