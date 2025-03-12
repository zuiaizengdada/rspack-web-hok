<template>
  <AppDialog
    v-model="modal.visible"
    :title="modal.title"
    width="500px"
    height="300px"
    @success="successFn"
  >
    <div class="choose_resource m-t-20 p-10">
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="提示词标题" prop="title">
          <el-input v-model.trim="form.title" class="w-370" maxlength="30" show-word-limit />
        </el-form-item>
        <el-form-item label="提示词内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            placeholder="请输入提示词"
            :autosize="{ minRows: 10, maxRows: 10 }"
            maxlength="1000"
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
  guziPromptAddApi,
  guziPromptPutApi
} from '@/api/guzi/prompt.js'
export default {
  components: { AppDialog },
  data() {
    return {
      // 弹框属性
      modal: {
        title: '新增提示词',
        visible: false
      },
      rules: {
        title: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'blur' }
        ]
      },
      form: {
        title: '',
        content: 0
      },
      promptId: '' // 有id 代表编辑 无id代表新增
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
          title: data.title,
          content: data.content
        }
        if (data.id) { this.promptId = data.id }
      } else {
        this.$refs.form.resetFields()
        this.promptId = ''
        this.modal.visible = false
      }
    },
    async successFn() {
      await this.$refs.form.validate()
      let res = null
      if (this.promptId) {
        // 编辑
        res = await guziPromptPutApi({ ...this.form, id: this.promptId })
      } else {
        // 新增
        res = await guziPromptAddApi(this.form)
      }
      if (res.success) {
        this.$message({
          message: this.promptId ? '修改成功' : '操作成功',
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
