<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="530px"
    :before-close="dialogBeforeClose"
    :append-to-body="appendToBody"
  >
    <template #title>
      <div class="title-box">
        <img src="@/assets/image/aigc/digitalVideoManage/jingao.png" alt="" />
        <span>余额不足</span>
      </div>
    </template>
    <div class="msg-box">
      <span>{{ msg }}</span>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="submit">立即充值</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </div>
    <RechargeDialog
      v-model="rechargeDialogVisible"
      @handleSubmit="handleRechargeDialogSubmit"
    />
    <RechargeSubmitDialog
      v-model="rechargeSubmitDialogVisible"
      :is-detail="isDetail"
      :info="rowData"
    />
  </el-dialog>
</template>
<script>
import RechargeDialog from '@/views/digitalPerson/components/rechargeDialog/index.vue'
import RechargeSubmitDialog from '@/views/digitalPerson/components/rechargeSubmitDialog/index.vue'
export default {
  name: 'ExportData',
  components: {
    RechargeDialog,
    RechargeSubmitDialog
  },
  model: {
    prop: 'visible',
    event: 'update:visible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    msg: {
      type: String,
      default: ''
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rechargeDialogVisible: false,
      rechargeSubmitDialogVisible: false,
      isDetail: false,
      rowData: {}
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    }
  },
  methods: {
    handleRechargeDialogSubmit(val) {
      this.isDetail = false
      this.rowData = { ...val }
      this.rechargeSubmitDialogVisible = true
      this.rechargeDialogVisible = false
    },
    dialogBeforeClose() {
      this.$emit('update:visible', false)
    },
    submit() {
      this.rechargeDialogVisible = true
      this.dialogBeforeClose()
    }
  }
}
</script>
<style lang="scss" scoped>
.title-box {
  display: flex;
  align-items: center;
  color: #f53f3f;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  img {
    width: 22px;
    height: 22px;
    margin-right: 10px;
  }
}
.msg-box {
  margin: 0 10px;
  color: #000000;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 1px;
}
::v-deep {
  .el-dialog__header {
    .el-dialog__title {
      font-size: 16px;
      color: #000;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }
  .el-dialog__body {
    padding: 20px;
  }
  .el-form-item__label {
    font-weight: 600;
    color: #000;
    padding-left: 0 !important;
    padding-bottom: 0 !important;
    padding-right: 20px !important;
  }
}
</style>
