<template>
  <!-- 新增规则弹框 -->
  <AppDialog
    v-model="visible"
    title="驳回原因"
    width="710px"
    :loading="loading"
    height="auto"
    @success="rejectFn"
    @close="closeDialog"
  >
    <div class="dialog">
      <el-input
        v-model="reqInfo.remark"
        :autosize="{ minRows: 3, maxRows: 4 }"
        type="textarea"
        maxlength="200"
        show-word-limit
      />
    </div>
    <div slot="footer" class="ss-material-box-bottom">
      <el-button size="small" type="danger" @click="rejectFn"> 驳回 </el-button>
      <el-button size="small" @click="closeDialog"> 取消 </el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { auditRejectionApi } from '@/api/orgSettlement/couponCenter.js'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      visible: false,
      loading: false,
      reqInfo: {
        couponNo: '',
        remark: ''
      },
      isDel: false,
      delFn: null // 删除接口
    }
  },
  watch: {},
  methods: {
    async rejectFn() {
      if (!this.reqInfo.remark) {
        this.$message.error('请输入驳回原因')
        return
      }
      this.loading = true
      try {
        const { success } = await auditRejectionApi(this.reqInfo)
        if (success) {
          this.$message.success('已驳回')
          this.closeDialog()
          this.$emit('success')
        }
      } catch (error) {
        this.$message.error(error.message)
      }
      this.loading = false
    },

    // 打开弹窗
    async openDialog(row) {
      this.visible = true
      this.reqInfo.couponNo = row.couponNo
    },
    // 关闭弹窗
    closeDialog() {
      this.visible = false
      this.loading = false
    },
    viewFile(url) {
      window.open(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  max-height: 600px;
  height: auto;
  padding: 20px;
  width: 100%;
  overflow-y: auto;
  .mb25 {
    margin-bottom: 25px;
  }
  .w515 {
    width: 515px;
  }
  .title {
    color: #000000;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 18px;
    padding-left: 11px;
    text-align: left;
    position: relative;

    &::before {
      content: '';
      height: 100%;
      width: 2px;
      background: #0c6fff;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .cell-group {
    width: 100%;
    height: auto;
    border: 1px solid #e7e7e7;
    border-radius: 8px;
    .cell-item {
      display: flex;
      height: auto;
      &:not(:first-child) {
        border-top: 1px solid #e7e7e7;
      }
      .cell-label {
        color: #333333;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        background: #f3f3f3;
        flex-shrink: 0;
        width: 200px;
        text-align: center;
        border-right: 1px solid #e7e7e7;
        padding: 10px 0;
      }
      .cell-value {
        color: #000000;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        padding: 10px 27px;
        flex: 1;
        .blue-txt {
          color: #0c6fff;
          font-weight: 400;
          cursor: pointer;
        }
      }
    }
  }

  ::v-deep .el-form-item__label {
    color: #000000;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }
}
</style>
