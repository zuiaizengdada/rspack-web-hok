<template>
  <AppDialog
    v-model="visible"
    title="学员备注"
    width="602px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="editRemarks overflowOuto">
      <div class="tipsError">注：修改备注将同步到企业微信中该学员。</div>
      <el-input v-model.trim="value" :maxlength="20" type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" placeholder="请输入学员备注" />
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      visible: true,
      value: '',
      top: '114px',
      success: () => {}
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 284) / 2 + 'px'
  },
  methods: {
    sure() {
      this.visible = false
      this.success && this.success(this.value)
    }
  }
}
</script>

<style lang='scss' scoped>
.editRemarks {
  height: 169px;
  padding: 10px 20px 20px;
}
.tipsError {
  margin-bottom: 10px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #F53F3F;
  line-height: 22px;
}
</style>
