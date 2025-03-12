<!-- 新增面试 -->
<template>
  <el-dialog
    :visible.sync="visible"
    width="956px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <InterviewRegistrationForm :personnel-info-id="post.personnelBaseInfoId" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import InterviewRegistrationForm from '../../../interviewRegistrationForm.vue'
export default {
  components: { InterviewRegistrationForm },
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
      post: {}
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
    this.post = { ...this.row }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$emit('submit', {
        ...this.post
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 0 20px;
  h1 {
    font-size: 20px;
    color: #333;
    font-weight: 700;
  }

  .title {
    font-size: 16px;
    margin-bottom: 16px;
  }
}
.del {
  background-color: #f53f3f;
  color: #ffffff;
}
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
