<template>
  <!-- 解除锁单弹框 -->
  <AppDialog
    v-model="config.visible"
    :footer-text="['确定解除锁单', '取消']"
    title="解除锁单"
    width="518px"
    height="424px"
    @success="sure"
  >
    <div v-if="config.visible" class="unlockOrderDialog overflowOuto">
      <div class="alertText">{{ tips }}</div>
      <div class="reason">解除锁单原因</div>
      <el-input
        v-model="reason"
        type="textarea"
        :rows="4"
        maxlength="200"
        show-word-limit
        placeholder="请输入解除原因"
      />
      <div class="lockOrderTitle m-t-20">
        上传图片（必填）：请上传锁单的证据，如聊天记录，审批记录等
      </div>
      <upload
        ref="upload"
        v-model="fileList"
        :limit="6"
        :max-m="2"
        tips="仅支持jpg、png、jpeg格式图片"
        @change="handleChange"
      />
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { unlockDelivery, unlockPackageDelivery } from '@/api/deliver/studentManagement'
import upload from '@/components/AppTemplate/Upload2OSS'
export default {
  components: {
    AppDialog,
    upload
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          deliveryInfoId: ''
        }
      }
    },
    isPackage: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      reason: '',
      fileList: []
    }
  },
  computed: {
    tips() {
      if (this.$props.isPackage) {
        return '确认客户退款挽单成功，避免公司造成损失！'
      }
      if (this.type === 'live') {
        return '是否确定对此单进行解除锁单操作? 解除锁单后可以继续进行交付动作。!'
      }
      return '是否确定对此单进行解除锁单操作? 解除锁单后可以继续进行签到交付动作。'
    }
  },
  watch: {
    'config.visible'(val) {
      if (!val) {
        this.init()
      }
    }
  },
  mounted() {},
  methods: {
    init() {
      this.reason = ''
      this.loading = false
      this.$nextTick(() => {
        this.$refs.upload && (this.$refs.upload.fileList = [])
      })
    },
    handleChange(fileList) {
      this.fileList = fileList
    },
    // 点击锁单
    sure() {
      if (!this.reason) {
        this.$message.error('解除锁单原因不能为空')
        return
      }
      if (!this.fileList.length) {
        this.$message.error('上传图片不能为空')
        return
      }
      this.$delModal({
        tips: this.tips,
        success: () => {
          this.loading = true
          const data = {
            deliveryInfoId: this.config.deliveryInfoId,
            reason: this.reason,
            images: this.fileList.map(i => i.resourceUrl.url)
          }
          if (this.isPackage) {
            delete data.deliveryInfoId
            data.id = this.config.deliveryInfoId
            data.urls = data.images
            data.remark = data.reason
          }
          const api = this.isPackage ? unlockPackageDelivery : unlockDelivery
          api(data).then(res => {
            this.loading = false
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.unlockOrderDialog {
  height: 424px;
  padding: 16px;
  box-sizing: border-box;
  .alertText {
    padding: 10px 16px;
    background: #FFF2E6;
    border-radius: 4px;
    width: 100%;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #FF7D00;
    line-height: 22px;
  }
  .reason {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
    margin-top: 16px;
    margin-bottom: 8px;
  }
  .lockOrderTitle {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
    margin-bottom: 8px;
  }
}
</style>
