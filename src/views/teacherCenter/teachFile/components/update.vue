<template>
  <el-dialog v-if="visible" class="dialog-container" :close-on-click-modal="false" title="一键导入" width="600px" :visible.sync="visible">
    <el-form ref="form" :inline="true" :model="form" :rules="rules">
      <!-- <el-form-item label="所属领域" prop="domain">
        <el-select v-model="form.domain" style="width: 180px" placeholder="请选择所属领域">
          <el-option
            v-for="item in domainOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->
    </el-form>
    <el-upload
      ref="upload"
      class="upload-container"
      drag
      action="#"
      :http-request="fileRequest"
      :auto-upload="false"
      multiple
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip">支持扩展名：.xlsx</div>
    </el-upload>
    <el-button type="text" @click="downloadFile">文件模板下载</el-button>
    <div v-if="errorMsg" class="error-msg">
      上传失败！点击下载
      <el-link type="danger" @click="openLink">错误文件</el-link>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">提 交</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { teacherDownload, teacherDraftImport } from '@/api/tearchCenter/index'
import { getDomainData } from '@/utils/getApiData'
export default {
  data() {
    return {
      action: process.env.VUE_APP_BASE_API + '/teacher/import',
      visible: false,
      domainOptions: [],
      channelSourceList: [],
      form: {
        domain: ''
      },
      errorMsg: false,
      link: '',
      rules: {
        domain: [{ required: true, message: '请选择所属领域', trigger: 'change' }]
      }
    }
  },
  methods: {
    async open() {
      this.visible = true
      this.reset()
      const data = await getDomainData()
      this.domainOptions = data
    },
    reset() {
      this.form = {
        domain: ''
      }
      this.errorMsg = false
      this.link = ''
    },
    async downloadFile() {
      const { code, data } = await teacherDownload()
      if (code === 1) {
        window.open(data)
      }
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.upload.submit()
        }
      })
    },
    async fileRequest(e) {
      const selectFile = e.file
      if (!selectFile) {
        alert('请先选择需要上传的文件!')
        return
      }
      const formData = new FormData()
      formData.append('file', selectFile)
      const params = {
        // domain: this.form.domain
      }
      const { data } = await teacherDraftImport({ data: formData, params })
      this.$notify.success('上传成功')
      if (data) {
        this.errorMsg = true
        this.link = data
        return
      }
      this.errorMsg = false
      this.visible = false
    },
    openLink() {
      window.open(this.link)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container ::v-deep {
  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .upload-container {
    .el-upload-dragger {
      width: 100%;
    }
  }
  .error-msg {
    display: flex;
    color: #ff4949;
    .el-link {
      margin-left: 15px;
    }
  }
  .el-link.is-underline:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 0;
    bottom: 0;
    border-bottom: 1px solid #ff4949;
  }
}
</style>
