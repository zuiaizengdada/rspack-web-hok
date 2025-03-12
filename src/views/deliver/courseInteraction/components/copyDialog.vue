<template>
  <div>
    <AppDialog
      v-if="config.visible"
      v-model="config.visible"
      title="请选择同步数据"
      width="440px"
      :loading="submitLoading"
      height="100px"
      @success="sure"
      @close="handleClose"
    >
      <div class="addDialog overflowOuto">
        <el-form
          ref="form"
          class="m-t-20"
          label-width="auto"
          size="small"
        >
          <el-form-item label="">
            <el-checkbox v-model="checked">同步打卡任务（{{ config.data.taskCount }}）</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { taskCopy } from '@/api/deliver/punch.js'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: true,
          data: {}
        }
      }
    }
  },
  data() {
    return {
      submitLoading: false,
      checked: false
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        // 是否编辑
        this.checked = false
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    init() {
      this.form = {}
    },
    handleClose() {
      this.$message.success('操作成功')
      this.$emit('success')
    },
    // 确认框
    async sure() {
      await this.$refs.form.validate()
      this.submitLoading = true
      if (this.checked) {
        await taskCopy({ ...this.config.data }).finally(() => {
          this.submitLoading = false
        })
      }
      this.$message.success('操作成功')
      this.$emit('success')
    }
  }
}
</script>
  <style lang="scss" scoped>
  ::v-deep {
    .el-form-item__label {
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }
    .el_input_p20 {
      > input {
        padding-right: 45px;
      }
    }
  }
  .addDialog {
    padding: 10px 20px;
    padding-bottom: 0;
  }
  </style>
