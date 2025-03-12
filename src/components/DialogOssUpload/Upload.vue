<template>
  <el-upload
    drag
    multiple
    action="#"
    :http-request="uploadFile"
    :show-file-list="false"
    class="w-full upload-container"
    :accept="accept"
    :limit="limit"
    v-bind="$attrs"
    :on-exceed="handleExceed"
    :file-list="[]"
    v-on="$listeners"
  >
    <i class="el-icon-upload" style="font-size: 80px" />
    <div class="el-upload__text">
      <p class="primary">{{ upload.txt }}</p>
      <div class="el-upload__tip px-10">
        <p>{{ upload.limitTxt }}</p>
        <p>{{ upload.acceptTxt }}</p>
      </div>
    </div>
  </el-upload>
</template>
<script>
export default {
  props: {
    uploadInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    uploadingNum: {
      type: Number,
      default: 3
    },
    limit: {
      type: Number,
      default: 10
    },
    accept: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    upload() {
      return {
        ...{
          txt: '点击/拖拽上传文件',
          limitTxt: `最多同时拖入${this.limit}个文件，同时上传${this.uploadingNum}个文件，单个文件大小不能超过60G`,
          acceptTxt:
            '文件仅限jpg,png,jpeg,mp3,mov,mp4,txt,doc,docx,pdf,xls,xlsx,ppt,pptx,zip,rar,prproj,psd,avi,mpeg,rmvb'
        },
        ...this.uploadInfo
      }
    }
  },
  methods: {
    uploadFile(file) {
      // 格式限制
      const acceptArray = this.accept.split(',')
      const limitType = acceptArray.some((item) => {
        const s = item.replace('.', '')
        return file.file.type.includes(s)
      })

      if (!limitType) {
        this.$message.error(this.upload.acceptTxt)
        return false
      }
      this.$emit('upload', file.file)
    },
    handleExceed(files) {
      this.$message.error(`最多能选择 ${this.limit} 个文件，您本次选择了 ${files.length} 个文件`)
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-container ::v-deep .el-upload-dragger,
.upload-container ::v-deep .el-upload {
  width: 100%;
  background: #FBFCFE;
}
.upload-container ::v-deep .el-upload-dragger {
  height: auto;
}
.upload-container ::v-deep .el-upload-dragger .el-icon-upload {
  margin: 32px 0 16px;
}
.upload-container ::v-deep .el-upload__text {
  margin-bottom: 26px;
}
.el-upload__text .primary {
  font-size: 16px;
  margin-bottom: 8px;
}
.el-upload__tip {
  font-size: 12px;
  color: #999;
  line-height: 20px;
}
</style>
