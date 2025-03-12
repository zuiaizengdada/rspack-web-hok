<template>
  <!-- 备注弹框 -->
  <AppDialog
    v-model="config.visible"
    :footer-text="['保存', '取消']"
    title="编辑备注"
    width="518px"
    height="auto"
    :loading="loading"
    @success="sure"
  >
    <div class="remakeDialog overflowOuto">
      <div class="tips">备注</div>
      <el-input
        v-model="myRemark"
        maxlength="200"
        show-word-limit
        type="textarea"
        :autosize="{ minRows: 6 }"
        placeholder="请输入"
      />
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { setUpdateRemark, editDeliveryRemark, setPackageRemark, setLiveUpdateRemark } from '@/api/deliver/studentManagement'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          deliveryInfoId: '',
          remark: '',
          visible: false,
          type: 'online'
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      myRemark: ''
    }
  },
  watch: {
    'config.visible'(val) {
      val && (this.myRemark = this.config.remark)
    }
  },
  mounted() {},
  methods: {
    // 点击保存
    sure() {
      this.loading = true
      const params = {
        id: this.config.id,
        deliveryInfoId: this.config.deliveryInfoId,
        remark: this.myRemark,
        remarks: this.myRemark
      }
      console.log(this.config.type)
      let api = null
      switch (this.config.type) {
        case 'online':
          api = setUpdateRemark
          break
        case 'package':
          api = setPackageRemark
          break
        case 'offline':
          api = editDeliveryRemark
          break
        case 'live':
          api = setLiveUpdateRemark
          break
      }
      api(params).then(res => {
        this.loading = false
        this.$notify.success({ title: '提示', message: '提交成功' })
        this.$emit('success', this.myRemark)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.remakeDialog {
  min-height: 224px;
  max-height: 604px;
  padding: 16px;
  box-sizing: border-box;
  >.tips {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
    margin-bottom: 8px;
  }
}
</style>
