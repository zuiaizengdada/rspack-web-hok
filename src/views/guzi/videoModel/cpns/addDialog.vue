<template>
  <AppDialog
    v-model="modal.visible"
    :title="modal.title"
    :loading="loading"
    width="700px"
    height="auto"
    @success="successFn"
  >
    <div class="choose_resource m-t-20 p-10">
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="模版标题" prop="templateName">
          <el-input v-model.trim="form.templateName" class="w-370" maxlength="30" show-word-limit />
        </el-form-item>
        <el-form-item label="模版类型" prop="templateType">
          <el-radio-group v-model="form.templateType" :disabled="!!promptId">
            <el-radio label="AE">AE</el-radio>
            <el-radio label="MEISHE">美摄</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属标签" prop="tagName">
          <el-radio-group v-model="form.tagName">
            <el-radio v-for="(item,index) in tagOption" :key="index" :label="item">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入描述"
            :autosize="{ minRows: 3, maxRows: 3 }"
            maxlength="200"
            class="w-370"
            show-word-limit
          />
        </el-form-item>
        <el-form-item v-if="!promptId" label="模版ZIP包" prop="file">
          <el-upload
            class="upload-demo"
            action="#"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :before-upload="beforeUpload"
            :file-list="fileList"
            accept=".zip"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传zip格式压缩包</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  updateTemplate,
  addTemplate,
  guziGetTagList
} from '@/api/guzi/videoModel.js'
export default {
  components: { AppDialog },
  data() {
    return {
      // 弹框属性
      modal: {
        title: '上传模版',
        visible: false
      },
      rules: {
        templateName: [
          { required: true, message: '请输入模版名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入模版描述', trigger: 'blur' },
          { min: 1, max: 1000, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ],
        tagName: [
          { required: true, message: '请选择标签', trigger: 'change' }
        ],
        templateType: [
          { required: true, message: '请选择模版类型', trigger: 'change' }
        ],
        file: [
          { required: true, message: '请选择上传文件', trigger: 'change' }
        ]
      },
      form: {
        templateName: '',
        tagName: '',
        description: '',
        templateType: '',
        file: ''
      },
      tagOption: [],
      fileList: [],
      loading: false,
      promptId: '' // 有id 代表编辑 无id代表新增
    }
  },
  mounted() {
    this.loadTagsList()
  },
  methods: {
    loadTagsList() {
      guziGetTagList().then(res => {
        if (res.code === 1) {
          this.tagOption = res.data
        }
      })
    },
    handleRemove(file, fileList) {
      this.form.file = ''
      this.fileList = []
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    beforeUpload(files) {
      this.form.file = files
      this.fileList.push({ name: files.name })
      console.log(1111, files)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    dialogFn(flag, data) {
      if (flag) {
        this.modal.visible = true
        this.$nextTick(() => {
          this.form = { ...data }
          if (data.id) {
            this.promptId = data.id
          } else {
            this.promptId = ''
          }
          this.$refs.form.resetFields()
        })
      } else {
        this.$refs.form.resetFields()
        this.promptId = ''
        this.fileList = []
        this.modal.visible = false
      }
    },
    async successFn() {
      await this.$refs.form.validate()
      this.loading = true
      let res = null

      const formData = new FormData()
      formData.append('file', this.form.file)
      if (this.promptId) {
        // 编辑
        res = await updateTemplate({ ...this.form, id: this.promptId }).finally(() => {
          this.loading = false
        })
      } else {
        // 新增
        const formData = new FormData()
        formData.append('file', this.form.file)
        formData.append('templateName', this.form.templateName)
        formData.append('description', this.form.description)
        formData.append('tagName', this.form.tagName)
        formData.append('templateType', this.form.templateType)
        formData.append('userId', this.$store.getters.userInfo.userId)
        res = await addTemplate(formData).finally(() => {
          this.loading = false
        })
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
