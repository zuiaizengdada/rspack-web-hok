<template>
  <el-dialog :title="title" :visible.sync="visible" width="500px" :close-on-click-modal="false">
    <el-input
      v-model="text"
      type="text"
      :placeholder="placeholder"
      :maxlength="maxlength"
      show-word-limit
    />
    <div class="select_footer">
      <div class="footer_btn">
        <el-button size="small" @click="cancel()">取 消</el-button>
        <el-button type="primary" size="small" @click="sure()">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'AppEditName',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxlength: {
      type: Number,
      default: 10
    },
    success: {
      type: Function,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      text: ''
    }
  },
  methods: {
    sure() {
      this.visible = false
      this.success && this.success(this.text)
      this.text = ''
    },
    cancel() {
      this.text = ''
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.select_footer {
      margin-top: 10px;
      display: flex;
      > div {
          flex: 1;
      }
      .footer_btn {
          display: flex;
          justify-content: flex-end;
      }
  }
</style>
