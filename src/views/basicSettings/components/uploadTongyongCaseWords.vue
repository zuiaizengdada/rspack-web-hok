<template>
  <el-dialog v-if="visible" class="dialog-container" :close-on-click-modal="false" title="一键导入" width="600px" :visible.sync="visible" append-to-body>
    <el-upload
      ref="upload"
      width="30%"
      class="upload-container"
      accept=".xlsx, .xlsm, .xls"
      drag
      action="#"
      :http-request="fileRequest"
      :auto-upload="false"
      :on-exceed="uploadCc"
      :limit="1"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip ">支持扩展名：.xlsx</div>
      <p class="pt-3" style="font-size:12px;color:#">一次最多导入1000个敏感词</p>
    </el-upload>
    <el-button type="text" @click="downloadFile">下载敏感词导入模板</el-button>
    <div v-if="errorMsg" class="error-msg">
      {{ successNum }}条上传成功，{{ errorNum }}条上传失败！点击下载
      <el-link type="danger" @click="openLink">错误文件</el-link>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">提 交</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDeptData } from '@/utils/getApiData'
import { getDict } from '@/utils/index'
export default {
  props: {
    getApi: {
      type: Function,
      default: () => {}
    },
    downTemplate: {
      type: String,
      default: 'https://oss.hokkj.cn/hok_product/GeneralSensitiveWordTemplate.xls'
    }
  },
  data() {
    return {
      successNum: 0,
      errorNum: 0,
      action: process.env.VUE_APP_BASE_API + '/cloud/product/common/sensitive/import',
      visible: false,
      deptOptions: [],
      channelSourceList: [],
      form: {
        channelSource: '',
        deptId: '',
        deptName: ''
      },
      errorMsg: false,
      link: ''
    }
  },
  methods: {
    uploadCc() {
      this.$message.error('一次只能上传一个文件！')
    },
    async open() {
      this.visible = true
      this.reset()
      const dept = await getDeptData()
      const channelSource = await getDict('sys_source_channel')
      this.channelSourceList = channelSource.map((i) => {
        return {
          value: i.dictLabel,
          label: i.dictLabel
        }
      })
      this.deptOptions = dept
    },
    reset() {
      this.form = {
        channelSource: '',
        deptId: '',
        deptName: ''
      }
      this.errorMsg = false
      this.link = ''
    },
    handleChange(data) {
      if (!data) return
      this.getTreeLabelById(this.deptOptions, data)
    },
    downloadFile() {
      window.open(this.downTemplate)
    },
    onSubmit() {
      this.$refs.upload.submit()
    },
    getTreeLabelById(data, id) {
      data.forEach((i) => {
        if (i.value === id) {
          this.form.deptName = i.label
        }
        if (i.children && i.children.length) {
          this.getTreeLabelById(i.children, id)
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
      // const { data } = await caseWordsTongyongImport({ data: formData })
      const { data } = await this.getApi(formData)
      if (data && data.errorNum !== 0) {
        this.errorMsg = true
        this.link = data.errorFileUrl
        this.successNum = data.sucessNum
        this.errorNum = data.errorNum
        return
      }
      this.errorMsg = false
      this.visible = false
      this.$notify.success('上传成功')
      this.$emit('loadDataUploadSuccess')
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
    border-radius: 10px;
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

