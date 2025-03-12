<template>
  <el-dialog
    :title="title"
    :visible="visible"
    width="400px"
    :before-close="handleClose"
  >
    <div>
      <div>
        人工发送单天单线索最多2条，不符合条件的线索自动忽略不处理，只处理可以正常执行的线索！
      </div>
      <div style="font-weight: bold;margin:5px 0;">模板内容</div>
      <el-radio-group v-model="smsSort">
        <el-radio :label="1">线索所在任务中第一条短信模板</el-radio>
        <el-radio :label="2" style="margin-top:5px;">线索所在任务中最后一条短信模板</el-radio>
      </el-radio-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleOk">确认群发</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    multipleSelection: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    smsSort: ''
  }),
  computed: {
    title() {
      return `已选择线索${this.multipleSelection?.length}条`
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleOk() {
      if (!this.smsSort) return this.$message.warning('请选择模板内容')
      this.$emit('update:visible', false)
      this.$emit('handleOk', this.smsSort)
    }
  }
}
</script>
