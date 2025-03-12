<template>
  <el-dialog
    title=""
    :visible.sync="dialogVisible"
    width="505px"
    :before-close="
      () => {
        $emit('close')
      }
    "
  >
    <div class="title">
      <i class="el-icon-warning" style="color: red" />
      <span>{{ title }}</span>
    </div>
    <div class="message">{{ message }}</div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" type="danger" :loading="loading" @click="submit">
        确定
      </el-button>
      <el-button size="small" @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  model: {
    prop: 'visible',
    event: 'getVisible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('getVisible', val)
      }
    }
  },
  methods: {
    submit() {
      this.$emit('submit')
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__header {
  padding: 12px 20px;
  border-bottom: none;

  .el-dialog__title {
    font-size: 16px;
  }
  .el-dialog__headerbtn {
    top: 15px;
    i {
      font-size: 20px;
      color: #000;
    }
  }
}
::v-deep {
  .el-dialog__body {
    padding-top: 17px !important;
    padding-bottom: 0 !important;
  }
}
.title {
  display: flex;
  align-items: center;
  i {
    margin-right: 10px;
    font-size: 24px;
  }
  font-size: 16px;
  color: #333333;
}
.message {
  margin-top: 12px;
  font-size: 16px;
  color: #000;
  padding-left: 34px;
}
</style>
