<template>
  <el-dialog v-if="visible" class="dialog-container" title="导入" width="600px" :visible.sync="visible">
    <el-upload
      ref="upload"
      class="upload-container"
      drag
      action="#"
      accept=".xlsx, .xlsm, .xls"
      :http-request="fileRequest"
      :on-change="handleChangeFile"
      :auto-upload="false"
      :limit="1"
      multiple
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip">支持扩展名：.xlsx</div>
    </el-upload>
    <el-button type="text" @click="downloadFile">下载模板</el-button>
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
import { participleDownload, participleImport } from '@/api/product/setting'
import { getDeptData } from '@/utils/getApiData'
import { getDict } from '@/utils/index'
export default {
  data() {
    return {
      action: process.env.VUE_APP_BASE_API + '/participle/import',
      visible: false,
      deptOptions: [],
      channelSourceList: [],
      form: {
        channelSource: '',
        deptId: '',
        deptName: ''
      },
      errorMsg: false,
      link: '',
      rules: {
        deptId: [{ required: true, message: '请选择来源部门', trigger: 'change' }],
        channelSource: [{ required: true, message: '请选择来源渠道', trigger: 'change' }]
      }
    }
  },
  methods: {
    async open() {
      this.visible = true
      this.reset()
      const dept = await getDeptData()
      const channelSource = await getDict('sys_source_channel')
      this.channelSourceList = channelSource.map((i) => {
        return {
          value: i.dictCode,
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
    handleChangeFile(file, fileList) {
      if (file.name.indexOf('.xlsx') > 0 || file.name.indexOf('.xls') > 0) {
        console.log('success')
      } else {
        fileList.splice(0, 1)
        this.$message.error('只能上传execl格式的文件！')
      }
    },
    handleChange(data) {
      if (!data) return
      this.getTreeLabelById(this.deptOptions, data)
    },
    async downloadFile() {
      const { code, data } = await participleDownload()
      if (code === 1) {
        window.open(data)
      }
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
      const { success, data } = await participleImport(formData)
      if (success && data.indexOf('条') > 0) {
        this.visible = false
        this.$emit('searchd')
        this.$notify.success(data)
      } else if (data.indexOf('.xlsx') > 0 || data.indexOf('.xls') > 0) {
        this.$notify.info('部分上传成功！失败分词文件已下载，请检查！')
        this.link = data
        this.visible = false
        this.$emit('searchd')
        window.open(this.link, '_blank')
        return
      }
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
