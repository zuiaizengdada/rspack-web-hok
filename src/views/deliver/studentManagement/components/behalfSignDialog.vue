<template>
  <!-- 代签弹框 -->
  <AppDialog
    v-model="config.visible"
    :footer-text="['代签', '取消']"
    :title="title"
    width="694px"
    height="384px"
    :loading="loading"
    :before-close="(done) => beforeClose(done)"
    @success="sure"
  >
    <div v-loading="loading" class="behalfSignDialog overflowOuto">
      <div class="alertTips">您正在代客户签到,为避免后续出现法律纠纷,代客户签到必须上传与客户沟通的聊天截图或者录制的视频或语音作为交付的凭证。</div>
      <div class="formView">
        <div class="formViewLabel">上传凭证</div>
        <div class="formViewValue">
          <MyUpload ref="MyUpload" />
        </div>
      </div>
      <div class="formView alignItemCenter">
        <div class="formViewLabel">签到场次</div>
        <div class="formViewValue">
          <el-select v-model="form.sessionId" placeholder="请选择" size="small">
            <el-option v-for="item in options" :key="item.id" :label="item.startTime" :value="item.id" />
          </el-select>
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import MyUpload from './upload.vue'
import { helpSign, batchHelpSign, getUnsignList } from '@/api/deliver/studentManagement'
export default {
  components: {
    AppDialog,
    MyUpload
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          deliveryInfoId: '',
          scheduleId: '',
          deliveryInfoIds: []
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      options: [],
      title: '签到',
      apiFn: helpSign,
      form: {
        sessionId: ''
      }
    }
  },
  watch: {
    'config.visible'(val) {
      if (val) {
        this.$refs.MyUpload && this.$refs.MyUpload.setFileList([])
        this.options = []
        this.form.sessionId = ''
        this.getOption()
      } else {
        this.options = []
        this.form.sessionId = ''
        this.$refs.MyUpload && this.$refs.MyUpload.setFileList([])
      }
    },
    'config.isBatch'(val) {
      if (val) {
        this.title = '批量签到'
        this.apiFn = batchHelpSign
      } else {
        this.title = '代签'
        this.apiFn = helpSign
      }
    }
  },
  mounted() {},
  methods: {
    beforeClose(done) {
      if (this.$refs.MyUpload.getUploadFile()) {
        return this.$confirm('当前还有文件正在上传, 是否确认关闭弹框?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
        })
      }
      done()
    },
    sure() {
      if (!this.form.sessionId) {
        return this.$message.error('请选择签到场次')
      }
      if (this.$refs.MyUpload.getUploadFile()) {
        return this.$confirm('当前还有文件正在上传, 是否确认提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.send()
        })
      } else {
        this.send()
      }
    },
    send() {
      const fileList = this.$refs.MyUpload.getFileList()
      const certificateFileList = fileList.reduce((pre, next) => {
        next.status === 3 && pre.push(next.url)
        return pre
      }, [])
      if (certificateFileList.length === 0) {
        return this.$message.error('请至少上传1个文件')
      }
      this.loading = true
      const data = {
        certificateFileList,
        deliveryInfoId: this.config.deliveryInfoId,
        sessionId: this.form.sessionId
      }
      if (this.config.isBatch) {
        data.deliveryInfoId = undefined
        data.deliveryInfoIds = this.config.deliveryInfoIds
        this.apiFn = batchHelpSign
      } else {
        this.apiFn = helpSign
      }
      this.apiFn(data).then(res => {
        if (res.data && this.config.isBatch) {
          this.$notify.success({ title: '提示', message: `代签成功${res.data.success}，失败${res.data.fail}` })
        } else {
          this.$notify.success({ title: '提示', message: '操作成功' })
        }
        this.loading = false
        this.$emit('success')
      }).catch(() => {
        this.loading = false
      })
    },
    getOption() {
      this.loading = true
      getUnsignList(this.config.deliveryInfoId).then(res => {
        if (res.data) {
          this.options = res.data
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.behalfSignDialog {
  height: 384px;
  padding: 20px;
  box-sizing: border-box;
  .alertTips {
    background: #FFF2E6;
    border-radius: 4px;
    padding: 10px 16px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #FF7D00;
    line-height: 22px;
    margin-bottom: 27px;
  }
  .formView {
    display: flex;
    margin-bottom: 4px;
    .formViewLabel {
      width: 56px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 22px;
      margin-right: 8px;
    }
    .formViewValue {
      flex: 1 0 0;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #999999;
      line-height: 20px;
    }
  }
}
.alignItemCenter {
  align-items: center;
}
</style>
