<template>
  <AppDialog
    v-model="modal.visible"
    title="反馈处理"
    width="600px"
    height="300px"
    @success="successFn"
  >
    <div class="choose_resource m-t-20 p-10">
      <el-form ref="form" :model="form" label-width="130px" :rules="rules">
        <el-form-item label="是否处理" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="2">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理结果描述" prop="handleContent">
          <el-input
            v-model="form.handleContent"
            type="textarea"
            placeholder="请输入反馈内容的处理描述"
            :autosize="{ minRows: 5, maxRows: 5 }"
            maxlength="240"
            class="w-370"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  feedbackUpdate
} from '@/api/guzi/feedback.js'
export default {
  components: { AppDialog },
  data() {
    return {
      // 弹框属性
      modal: {
        visible: false
      },
      rules: {
        status: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        handleContent: [
          { required: true, message: '请输入反馈内容的处理描述', trigger: 'blur' },
          { min: 1, max: 240, message: '长度在 1 到 240 个字符', trigger: 'blur' }
        ]
      },
      form: {
        status: 2,
        handleContent: ''
      },
      id: ''
    }
  },
  computed: {
    userId() {
      return this.$store.getters.userInfo.userId
    },
    userName() {
      return this.$store.getters.userInfo.userName
    }
  },
  mounted() {
    this.modal.visible = this.visible
  },
  methods: {
    dialogFn(flag, data) {
      if (flag) {
        this.modal.visible = true
        this.form = {
          status: data.status,
          handleContent: data.handleContent

        }
        if (data.id) { this.id = data.id }
      } else {
        this.$refs.form.resetFields()
        this.modal.visible = false
      }
    },
    async successFn() {
      await this.$refs.form.validate()
      const res = await feedbackUpdate({ ...this.form, id: this.id, handlerId: this.userId, handlerName: this.userName })
      if (res.success) {
        this.$message({
          message: '处理成功',
          type: 'success',
          duration: 1500
        })
        this.dialogFn(false)
        this.$emit('callback')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.w-370{
  width: 370px;
}
</style>
