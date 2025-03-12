<!-- 驳回 -->
<template>
  <el-dialog
    title="被驳回原因"
    :visible.sync="visible"
    width="795px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form ref="post" :model="post" :rules="rules" label-width="80px">
      <el-form-item label="原因" class="form-item" prop="rejectReason">
        <!-- 文本域 -->
        <el-input
          v-model="post.rejectReason"
          type="textarea"
          :rows="5"
          resize="none"
          placeholder="
            请输入原因
          "
          show-word-limit
          maxlength="200"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose" :loading="loading">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { entryInfoAuditAjax } from '@/api/businessAdmin/talentFile'
export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      post: {},
      rules: {
        rejectReason: [
          {
            required: true,
            message: '请输入原因',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 200,
            message: '限制最多输入200个字符',
            trigger: 'blur'
          }
        ]
      },
      loading: false
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('getVisible', val)
      }
    }
  },
  created() {},
  methods: {
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$refs.post.validate(valid => {
        if (valid) {
          console.log(this.row)
          const params = {
            entryRegisterAuditStatus: 3,
            personnelBaseInfoId: this.row.personnelBaseInfoId,
            rejectReason: this.post.rejectReason
          }
          this.loading = true
          entryInfoAuditAjax(params)
            .then(res => {
              if (res.code === 1) {
                this.$emit('success')
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
.el-textarea__inner::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.el-textarea__inner::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}
.el-textarea__inner::-webkit-scrollbar-track {
  background-color: transparent;
}

.innerbox {
  max-height: 150px;
  overflow: auto;
}

// 滚动条整体样式
.innerbox::-webkit-scrollbar {
  width: 6px;
}
// 滚动条内嵌滑块
.innerbox::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
// 滚动条边角
.innerbox::-webkit-scrollbar-corner {
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
