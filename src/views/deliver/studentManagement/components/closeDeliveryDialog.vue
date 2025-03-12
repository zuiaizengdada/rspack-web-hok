<template>
  <!-- 关闭交付弹框 -->
  <AppDialog
    v-model="config.visible"
    :footer-text="['保存', '取消']"
    title="关闭交付"
    width="518px"
    height="224px"
    :loading="loading"
    @success="sure"
  >
    <div v-if="config.visible" class="closeDeliveryDialog overflowOuto">
      <div class="title">
        <span style="color: #F53F3F">*</span>
        关闭交付原因
      </div>
      <el-input
        v-model="remake"
        type="textarea"
        :rows="4"
        placeholder="请输入"
        maxlength="200"
        show-word-limit
      />
      <div class="tips">关闭交付后学员不能再打卡签到，视频课不能再观看，请谨慎操作。</div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { closeDelivery } from '@/api/deliver/studentManagement'
export default {
  components: {
    AppDialog
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
    }
  },
  data() {
    return {
      loading: false,
      remake: ''
    }
  },
  watch: {
    'config.visible'(val) {
      if (!val) {
        this.remake = ''
      }
    }
  },
  mounted() {},
  methods: {
    sure() {
      if (this.remake === '') {
        return this.$message.error('请输入关闭交付原因!')
      }
      this.$delModal({
        tips: '关闭交付后学员不能再打卡签到，视频课不能再观看，请谨慎操作。',
        success: () => {
          this.loading = true
          const data = {
            deliveryInfoId: this.config.deliveryInfoId,
            reason: this.remake
          }
          closeDelivery(data).then(res => {
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
.closeDeliveryDialog {
  height: 224px;
  padding: 16px;
  box-sizing: border-box;
  >.title {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
    margin-bottom: 8px;
  }
  >.tips {
    margin-top: 8px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
  }
}
</style>
