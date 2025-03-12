<!-- 岗位管理新增编辑 -->
<template>
  <el-dialog
    :title="!row.handleStatus ? '去处理' : '处理记录'"
    :visible.sync="visible"
    width="30%"
    :before-close="handleClose"
    :close-on-click-modal="!row.handleStatus ? false : true"
  >
    <el-form ref="post" :model="post" :rules="rules">
      <el-form-item class="form-item" prop="handleDesc">
        <!-- 文本域 -->
        <el-input
          v-if="!row.handleStatus"
          v-model="post.handleDesc"
          type="textarea"
          :rows="8"
          resize="none"
          placeholder="
            请描述下你是如何处理举报，最终结果如何？
          "
          show-word-limit
          maxlength="500"
        />

        <div class="innerbox">
          {{ row.handleDesc }}
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="!row.handleStatus" @click="handleClose">取 消</el-button>
      <el-button
        v-if="!row.handleStatus"
        type="primary"
        @click="submit"
      >确 定</el-button>
      <el-button
        v-if="row.handleStatus"
        type="primary"
        @click="handleClose"
      >关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
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
      post: { handleDesc: '' },
      rules: {
        handleDesc: [
          {
            required: true,
            message: '请输入处理',
            trigger: 'blur'
          }
        ]
      }
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
  created() {
    if (this.row.id) {
      this.post = { ...this.row }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    submit() {
      console.log(this.row)
      this.$refs.post.validate(valid => {
        if (valid) {
          this.$emit('submit', {
            ...this.post,
            aiUserReportsId: this.row.userAccount
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
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
