<template>
  <div>
    <AppDialog
      v-if="config.visible"
      v-model="config.visible"
      title="新增标签"
      width="440px"
      :loading="submitLoading"
      height="auto"
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
          <el-form-item label="标签名称" prop="tagName">
            <el-input
              v-model="form.tagName"
              placeholder=""
              maxlength="15"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="排序值">
            <el-input-number v-model="form.sort" style="width: 100%" :min="1" :max="999" @change="handleChange" />
            <div class="tips">
              排序值越小，标签越靠前
            </div>
          </el-form-item>
        </el-form>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { insertTag } from '@/api/course'
const defaultForm = {
  sort: '',
  tagName: ''
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
        tagName: [
          { required: true, message: '标签名称不能为空', trigger: 'blur' }
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
        tagName: this.form.tagName,
        sort: this.form.sort
      }
      await insertTag(params).finally(() => {
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
.tips{
    color: #999999;
    font-family: "Microsoft YaHei";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 12px;
    margin-top: 10px;
}
</style>
