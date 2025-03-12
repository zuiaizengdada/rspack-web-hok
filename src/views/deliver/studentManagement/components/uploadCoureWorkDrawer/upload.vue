<template>
  <el-upload
    drag
    action="#"
    :http-request="uploadFile"
    multiple
    :show-file-list="false"
    class="w-full upload-container"
    :accept="accept"
    :limit="limit"
    v-bind="$attrs"
    :on-exceed="handleExceed"
    :file-list="[]"
    v-on="$listeners"
  >
    <i class="el-icon-plus" />
    <div class="el-upload__text">
      <p class="primary">{{ upload.txt }}</p>
      <div class="el-upload__tip px-10">
        <p>{{ upload.limitTxt }}</p>
        <!-- <p>{{ upload.acceptTxt }}</p> -->
      </div>
    </div>
  </el-upload>
</template>
<script>
import SparkMD5 from 'spark-md5'
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
      default: 10
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
    return {
      contentType: ['application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel'
      ],
      fileMd5List: []
    }
  },
  computed: {
    upload() {
      return {
        ...{
          txt: '点击/拖拽上传作业',
          limitTxt: `作业只能上传pdf,doc,docx,ppt,pptx,xls,xlsx格式，单文件不能超过10M，最多支持${this.uploadingNum}个文件同时上传`,
          acceptTxt: '作业仅限pdf,doc,docx,ppt,pptx,xls,xlsx'
        },
        ...this.uploadInfo

      }
    }
  },
  methods: {
    async uploadFile(file) {
      console.log(file)
      // 格式限制
      const acceptArray = this.contentType
      const limitType = acceptArray.some((item) => {
        return file.file.type.includes(item)
      })
      if (!limitType) {
        this.$message.error(this.upload.acceptTxt)
        return false
      }
      // 限制上传文件大小 500M
      const isLt10M = file.file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传作业大小不能超过 10MB!')
        return false
      }
      const isSameFile = await this.isSameFile(file.file)
      if (isSameFile) {
        this.$message.error('同一个文件不能上传多次!')
        return false
      }
      this.$emit('upload', file.file)
    },
    handleExceed(files) {
      this.$message.error(`最多能选择${this.limit}个文件，您本次选择了 ${files.length} 个文件`)
    },
    // 判断是否有相同的文件
    isSameFile(file) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        const Spark = new SparkMD5.ArrayBuffer()
        fileReader.readAsArrayBuffer(file)
        fileReader.onload = (e) => {
          Spark.append(e.target.result)
          var md5 = Spark.end()
          if (this.fileMd5List.some(item => item === md5)) {
            return resolve(true)
          } else {
            this.fileMd5List.push(md5)
            return resolve(false)
          }
        }
      })
    },
    // 删除已上传的文件md5
    detFileMd5List() {
      this.fileMd5List = []
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 140px;
}
.upload-container ::v-deep .el-upload-dragger .el-icon-upload {
  margin: 32px 0 16px;
}
.upload-container ::v-deep .el-upload__text {
  margin-top: 10px;

}
.el-upload__text .primary {
  font-size: 12px;
}
.el-upload__tip {
  font-size: 12px;
  color: #999;
  line-height: 20px;
}
</style>
