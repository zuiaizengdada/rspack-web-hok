<template>
  <el-dialog
    title="分享"
    :visible.sync="dialogVisible"
    width="680px"
    :before-close="dialogBeforeClose"
  >
    <div>
      <el-form ref="form" class="export-form" :model="form" label-width="70px">
        <el-form-item label="短链">
          <div class="h5-link-box">
            <el-input v-model="form.h5Link" disabled class="h5-link-input" />
            <el-button type="primary" class="copy-btn" @click="copyFn">
              复制
            </el-button>
            <el-button type="primary" class="copy-btn" @click="getCode(true)">
              刷新
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="二维码">
          <AppQrcode :src="form.h5Link" :size="200" :margin="10" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { buildShareUrl } from '@/api/marketingTools/coupon.js'
import AppQrcode from '@/components/AppQrcode'
export default {
  name: 'ExportData',
  components: {
    AppQrcode
  },
  model: {
    prop: 'visible',
    event: 'update:visible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        h5Link: ''
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    }
  },
  watch: {
    row: {
      handler(val) {
        this.getCode(false)
      }
    }
  },
  methods: {
    getCode(refresh) {
      buildShareUrl({ couponNo: this.row.couponNo, refresh: refresh }).then(
        res => {
          this.form.h5Link = res.data
        }
      )
    },
    copyFn() {
      // 复制到剪切板
      navigator.clipboard.writeText(this.form.h5Link)
      this.$message.success('复制成功')
    },
    dialogBeforeClose() {
      this.$emit('update:visible', false)
    },
    submit() {}
  }
}
</script>
  <style lang="scss" scoped>
.qr-code-box {
  padding-top: 10px;
  img {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    border: 1px solid #dcdee1;
    background: #fff;
  }
}
.h5-link-box {
  display: flex;
  align-items: center;
  .h5-link-input {
    width: 90%;
    margin-right: 16px;
  }
  .copy-btn {
    width: 68px;
  }
}
::v-deep {
  .el-dialog__header {
    padding-bottom: 20px;
    border-bottom: 1px solid #e7e7e7;
    .el-dialog__title {
      font-size: 16px;
      color: #000;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }
  .el-dialog__body {
    padding: 20px;
  }
  .el-form-item__label {
    font-weight: 600;
    color: #000;
    padding-left: 0 !important;
    padding-bottom: 0 !important;
    padding-right: 20px !important;
  }
}
</style>
