<template>
  <el-dialog v-if="visible" class="dialog-container" :close-on-click-modal="false" :title="title" width="600px" :visible.sync="visible" append-to-body :before-close="closeDialog">
    <el-upload
      ref="upload"
      class="upload-container"
      accept=".xlsx, .xlsm, .xls"
      drag
      action="#"
      :http-request="fileRequest"
      :auto-upload="false"
      :on-exceed="uploadCc"
      :on-change="changeFile"
      :before-remove="beforeMoveFile"
      :limit="1"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip ">支持扩展名：.xlsx</div>
      <!-- <p class="pt-3" style="font-size:12px;color:#">一次最多导入1000个敏感词</p> -->
    </el-upload>
    <el-button type="text" @click="downloadFile">下载模板</el-button>
    <span class="error-msg">
      {{ successNum }}
      <el-link v-if="errorMsg" type="danger" @click="openLink">错误文件</el-link>
    </span>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="isUploading" @click="onSubmit">提 交</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getImportTaskResult, getSwipeDownload, getLanuchExeclDownload, getRefundExeclDownload, uploadSwipeImport, uploadLaunchImport, uploadRefundImport } from '@/api/system/dataConfiguration'
export default {
  props: {
    couponType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      title: '刷单订单导入',
      successNum: '',
      errorNum: 0,
      action: process.env.VUE_APP_BASE_API + '/cloud/product/teacher/sensitive/import',
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
      isUploading: false
    }
  },
  watch: {
    couponType: {
      handler() {
        if (this.couponType === 0) {
          this.title = '刷单订单导入'
        } else if (this.couponType === 1) {
          this.title = '投放花费数据导入'
        } else if (this.couponType === 2) {
          this.title = '线下退款数据导入'
        }
      }
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    uploadCc() {
      this.$message.error('一次只能上传一个文件！')
    },
    closeDialog() {
      this.errorMsg = false
      this.visible = false
      this.isUploading = false
      this.successNum = ''
    },
    beforeMoveFile() {
      this.errorMsg = false
      this.isUploading = false
      this.successNum = ''
    },
    changeFile() {
      this.errorMsg = false
    },
    async open() {
      this.visible = true
      this.isUploading = false
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
      if (this.couponType === 0) {
        getSwipeDownload().then(res => {
          window.open(res.data)
        })
      } else if (this.couponType === 1) {
        getLanuchExeclDownload().then(res => {
          window.open(res.data)
        })
      } else if (this.couponType === 2) {
        getRefundExeclDownload().then(res => {
          window.open(res.data)
        })
      }
    },
    onSubmit() {
      if (this.isUploading) {
        this.$message.error('文件上传中,请稍后...')
        return
      }
      if (this.errorMsg) {
        this.$message.error('文件导入有误，请更新文件后再上传')
        return
      }
      this.$nextTick(() => {
        if (this.$refs.upload.uploadFiles.length > 0) {
          this.$refs.upload.submit()
        } else {
          this.$message.error('请选择需要导入的数据文件！')
        }
      })
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
    askImportIsSuccess(taskId) {
      const param = {
        taskId: taskId
      }
      getImportTaskResult(param).then(res => {
        if (res.data && res.data.status === 1) {
          setTimeout(this.askImportIsSuccess(taskId), 2000)
        } else if (res.data && res.data.status === 0) {
          this.$message.error(res.data.msg)
          this.isUploading = false
          this.errorMsg = true
        } else if (res.data && res.data.status === 2 && res.data.failCount !== 0) {
          this.errorMsg = true
          this.link = res.data.errorUrl
          this.successNum = res.data.msg
          this.isUploading = false
        } else {
          this.errorMsg = false
          this.visible = false
          this.isUploading = false
          this.$notify.success('上传成功')
          this.$emit('loadDataUploadSuccess')
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
      var data = {}
      if (this.couponType === 0) {
        data = await uploadSwipeImport(formData)
      } else if (this.couponType === 1) {
        data = await uploadLaunchImport(formData)
      } else if (this.couponType === 2) {
        data = await uploadRefundImport(formData)
      }
      this.isUploading = true
      if (data && data.code === 1 && data.data.status === 1) {
        this.askImportIsSuccess(data.data.taskId)
      } else if (data && data.code === 1 && data.data.status === 2) {
        this.errorMsg = true
        this.link = data.data.errorUrl
        this.successNum = data.data.msg
        this.isUploading = false
      } else if (data.data && data.data.status === 0) {
        this.$message.error(data.data.msg)
        this.isUploading = false
        this.errorMsg = true
      } else if (data.data === null) {
        this.isUploading = false
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

