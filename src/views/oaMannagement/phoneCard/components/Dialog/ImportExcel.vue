<template>
  <base-dialog
    v-bind="$attrs"
    title="导入数据"
    :append-to-body="true"
    :visible-footer="true"
    width="600px"
    v-on="$listeners"
    @cancel="handleClickCancel"
  >
    <div slot="content" class="import-container">
      <el-upload
        drag
        style="width: 100%"
        action="#"
        accept=".xlsx, .csv, .xls"
        :before-upload="beforeUpload"
        :http-request="upload"
        :file-list="fileList"
        :limit="1"
      >
        <template>
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em><br />支持扩展名:.xlsx
          </div>
        </template>
      </el-upload>
      <p style="margin: 10px 0">
        <a
          href="https://oss.hokkj.cn/edata-oa/export/%E7%94%B5%E8%AF%9D%E5%8D%A1%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx"
          style="color: #0c6fff"
          >下载模板</a
        >
      </p>
      <div v-if="tips" class="msg">
        <div class="file-d">
          <img src="@/assets/image/aigc/file-i.png" alt="" />
          <span>{{ tips.fileName }}</span>
        </div>
        <div class="msg-content">
          <span style="margin-right: 6px; color: #00b42a">
            {{ tips.successNum }}条导入成功
          </span>
          <span style="margin-right: 6px; color: #ff4949">
            {{ tips.errorNum }}条导入失败！
          </span>
          <el-link v-if="tips.errorUrl" type="danger" @click="openLink"
            >点击下载：错误文件</el-link
          >
        </div>
      </div>
      <div class="flex justify-center">
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          @click="handleClickSubmit"
          >提交</el-button
        >
        <el-button size="small" @click="handleClickCancel">取消</el-button>
      </div>
    </div>
  </base-dialog>
</template>
<script>
import { getFileType } from '@/utils/index'
import BaseDialog from '@/components/BaseDialog.vue'
import { cardImport } from '../../../api/card.js'
import axios from 'axios'
export default {
  components: {
    BaseDialog
  },
  data() {
    return {
      CancelToken: axios.CancelToken,
      source: null,
      tips: undefined,
      fileList: [],
      loading: false
    }
  },
  watch: {
    '$attrs.visible'(newVal) {
      if (newVal === true) {
        this.init()
      }
    }
  },
  methods: {
    handleClickSubmit() {
      if (!this.fileList.length || this.fileList.length < 1) {
        return this.$message.error('请选择文件')
      }
      this.$uweb?.setAction('Event_oa_phoneCard_import')
      this.source = this.CancelToken.source()
      const formData = new FormData()
      formData.append('file', this.fileList[0])
      this.loading = true
      cardImport(formData, this.source.token)
        .then(res => {
          if (res.code === 1) {
            this.tips = {
              errorUrl: res.data.errorUrl || '',
              successNum: res.data.successNum || 0,
              errorNum: res.data.errorNum || 0,
              fileName: this.fileList[0].name
            }
            this.fileList = []
            if (!res.data.errorUrl) {
              this.$message.success('导入成功！')
            }
            this.$emit('success')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleClickCancel() {
      if (this.source) {
        // 取消上一次发出的请求
        this.source.cancel('cancel')
      }
      this.$emit('update:visible', false)
    },
    beforeUpload(file) {
      console.log(file, 'file')
      const fileType = getFileType(file.name)
      console.log(fileType)
      if (['xlsx', 'csv', 'xls'].includes(fileType.suffix)) {
        const isLt10M = file.size / 1024 / 1024 < 10
        !isLt10M && this.$message.error('上传文件不能超过 10M!')
        return isLt10M
      } else {
        this.$message.error(`不支持${fileType.suffix}格式的文件上传`)
        return false
      }
    },
    upload(e) {
      this.fileList = [e.file]
      this.tips = undefined
    },
    openLink() {
      window.open(this.tips.errorUrl)
    },
    init() {
      this.fileList = []
      this.source = null
      this.loading = false
      this.tips = undefined
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-upload-dragger,
::v-deep .el-upload {
  width: 100%;
}
.msg {
  margin-bottom: 10px;
  .file-d {
    display: flex;
    align-items: center;
    img {
      width: 18px;
      height: 18px;
      margin-right: 7px;
    }
  }
  .msg-content {
    display: flex;
    align-items: center;
  }
}
</style>
