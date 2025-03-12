<template>
  <el-dialog title="修改" width="400px" :visible.sync="visible">
    <el-form :model="form">
      <el-form-item label="IP姓名">
        <el-input v-model="form.teacherName" style="width:250px" />
      </el-form-item>
      <el-form-item>
        <span class="text-color">
          注：一旦修改，将影响该IP所有的数据，请谨慎操作
        </span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="submit">确定</el-button>
      <el-button size="small" @click="visible = false">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { teacherUpdateName } from '@/api/tearchCenter/index'
export default {
  data() {
    return {
      visible: false,
      form: {
        teacherName: '',
        teacherId: ''
      }
    }
  },
  methods: {
    open(row) {
      this.visible = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    async submit() {
      const params = {
        teacherId: this.form.teacherId,
        teacherName: this.form.teacherName
      }
      await teacherUpdateName(params)
      this.visible = false
      this.$emit('success')
    }
  }
}
</script>

<style>
.text-color{
    color: red;
}
</style>
