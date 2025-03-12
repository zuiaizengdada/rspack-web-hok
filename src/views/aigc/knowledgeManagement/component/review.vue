<!-- 详情 -->
<template>
  <el-dialog title="详情" :visible.sync="getDialogVisible">
    <div class="title">标题</div>
    <div class="content">{{ info.question }}</div>
    <div class="title">内容</div>
    <div class="content-row">
      <span class="content"> {{ info.answer }} </span>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'ReviewDialog',
  model: {
    prop: 'dialogVisible',
    event: 'change'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      info: {}
    }
  },
  computed: {
    getDialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val && this.row.id) {
          this.info = {
            ... this.row
          }
        }
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  .el-dialog__title {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #000;
  }
  border-bottom: 1px solid #e7e7e7;
}
::v-deep .el-dialog__body {
  padding-top: 0;
}
.title {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  margin: 16px 0;
}
.content-row {
  width: 100%;
  height: 369px;
  padding: 25px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
}
.content {
  display: block;
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  white-space: pre-line;
  word-wrap: break-word;
  overflow-y: auto;
  // 禁止滚动条外部滚动
  overscroll-behavior: contain;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    // display: none;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #d8d8d8;
    transition: all 0.4s ease;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
  }
}
::v-deep .el-dialog__headerbtn {
  i {
    font-size: 20px;
  }
}
</style>
