<template>
  <el-dialog
    width="415px"
    title="提示"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <div class="container">
      确认{{ row.status === 1 ? '禁用' : '开启' }}{{ row.sealName }}吗？
    </div>
    <template slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" :loading="loading">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading"
        >确 定</el-button
      >
    </template>
  </el-dialog>
</template>
<script>
import { enableOrDisableAjax } from '../../../../api/badge'
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
      loading: false
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    submit() {
      const status = this.row.status === 1 ? 2 : 1
      const params = {
        id: this.row.id,
        status
      }
      this.loading = true
      enableOrDisableAjax(params)
        .then(res => {
          if (res.code === 1) {
            this.$emit('success')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    closeDialog() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  border-radius: 10px;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e7e7e7;
}
.tips-block {
  width: 100%;
  padding: 20px;
  background: #f7f8f9;
  border-radius: 8px;
  margin-bottom: 20px;
  i {
    float: left;
    font-size: 22px;
    margin-right: 15px;
    margin-top: 3px;
    color: #f18649;
  }
  span {
    width: 425px;
    display: inline-block;
    color: #f18649;
    .title {
      font-size: 16px;
      margin-bottom: 8px;
    }
  }
}

.sealPreview-container {
  img {
    width: 534px;
    height: 488px;
  }
}
</style>
