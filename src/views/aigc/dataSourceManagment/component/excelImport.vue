<template>
  <el-dialog
    v-if="getVisible"
    class="dialog-container"
    :close-on-click-modal="false"
    title="数据导入"
    width="600px"
    :visible.sync="getVisible"
  >
    <el-upload
      ref="upload"
      class="upload-container"
      drag
      action="#"
      :limit="1"
      :file-list="fileList"
      :http-request="fileRequest"
      :on-exceed="handleExceed"
      :disabled="!!tips"
    >
      <template v-if="!tips">
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip">支持扩展名：.xlsx</div>
      </template>
      <div v-else class="msg">
        <div class="file-d">
          <img src="@/assets/image/aigc/file-i.png" alt="">
          <span>{{ tips.fileName }}</span>
        </div>
        <div style="width: 100%">
          <span style="margin-right: 6px; color: #00b42a">
            {{ tips.successNum }}条导入成功
          </span>
          <span style="margin-right: 6px; color: #ed1b24">
            {{ tips.failNum || 0 }}条导入失败！
          </span>
          <span style="margin-right: 6px; color: #1778ff" @click="openLink">
            点击下载：错误文件
          </span>
        </div>
      </div>
    </el-upload>

    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="downloadFile">下载导入模板</el-button>
      <div>
        <el-button
          v-if="!tips"
          :loading="saveLoading"
          type="primary"
          @click="onSubmit"
        >
          提交审核
        </el-button>
        <el-button @click="$emit('close')">{{
          !!tips ? '关 闭' : '取 消'
        }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  aiQADataImportQA,
  getImportQaTemplate
} from '@/api/aigc/dataSourceManagment'
export default {
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tips: undefined,
      fileList: [],
      saveLoading: false
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (!val) {
          this.fileList = []
        }
      }
    }
  },
  methods: {
    handleExceed(files) {
      this.fileList = [...files]
    },
    async downloadFile() {
      const { code, data } = await getImportQaTemplate()
      if (code === 1) {
        window.open(data)
      }
    },
    onSubmit() {
      if (!this.fileList.length || this.fileList.length < 1) {
        this.$message.warning('请上传文件')
        return
      }
      this.saveLoading = true
      const formData = new FormData()
      formData.append('file', this.fileList[0])

      aiQADataImportQA(formData)
        .then(res => {
          this.saveLoading = false
          if (res.code === 1) {
            if (!res.data) {
              this.$message.error('请下载导入模板填写数据后上传')
              return
            }
            this.tips = {
              ...res.data,
              successNum: res.data.successNum || 0,
              fileName: this.fileList[0].name
            }
            this.fileList = []
            this.$notify.success('上传成功')
            this.$emit('success')
          }
        })
        .catch(() => {
          this.saveLoading = false
        })
    },
    fileRequest(e) {
      if (
        e.file.type !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        this.$message.error('请上传xlsx格式的文件')
        return
      }
      this.fileList = [e.file]
    },
    openLink() {
      window.open(this.tips.url)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container ::v-deep {
  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .upload-container {
    .el-upload-dragger {
      width: 100%;
    }
  }
  .msg {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .file-d {
      width: 100%;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      img {
        width: 28px;
        height: 28px;
        margin-right: 4px;
      }
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
::v-deep .el-dialog__headerbtn {
  i {
    font-size: 20px;
  }
}
</style>
