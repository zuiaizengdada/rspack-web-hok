<template>
  <div>
    <AppDialog
      v-if="config.visible"
      v-model="config.visible"
      title="编辑"
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
          :model="form"
          label-width="auto"
          size="small"
          :rules="rules"
        >
          <el-form-item label="" prop="projectName">
            <el-input
              v-model="form.projectName"
              placeholder=""
              type="textarea"
              style="width: 400px"
              maxlength="50"
              :autosize="{ minRows: 2, maxRows: 6 }"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { videoDownloadUrlEdit } from '@/api/videoManagement/project'
const defaultForm = {
  projectName: ''
}
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
      form: { ...defaultForm },
      rules: {
        projectName: [
          { required: true, message: '文件名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        // 是否编辑
        if (val) {
          Object.assign(this.form, {
            ...this.config.data
          })
        } else {
          this.form = { ...defaultForm }
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    handleOk() {
      this.$emit('handleOk')
    },
    init() {
      this.form = {}
    },
    handleClose() {
      this.$emit('handleOk')
    },
    // 确认框
    async sure() {
      await this.$refs.form.validate()
      this.submitLoading = true
      const params = {
        id: this.form.id,
        projectName: this.form.projectName
      }
      await videoDownloadUrlEdit(params).finally(() => {
        this.submitLoading = false
      })
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
