<template>
  <AppDialog
    v-model="visible"
    :footer-text="['确定', '取消']"
    title="关闭交付"
    width="620px"
    height="400px"
    top="60px"
    :loading="loading"
    @success="onSubmit"
    @close="handleClose"
  >
    <el-scrollbar style="height: 400px">
      <div class="dialog-container">
        <div class="dialog-title">
          关闭交付原因
          <span
            class="tips-content"
          >关闭交付后学员课程不能再观看，请谨慎操作！</span>
        </div>
        <div class="dialog-content">
          <el-input
            v-model="form.remark"
            maxlength="200"
            placeholder="请填写具体原因"
            show-word-limit
            size="small"
            :rows="4"
            type="textarea"
            clearable
          />
        </div>
        <div class="m-20">
          <span class="dialog-title" style="margin-right: 10px">
            上传凭证(聊天记录、审批记录等)</span>
          <span
            class="tips"
          >最多上传6张，格式为jpg,png,jpeg，单图片大小2M以下</span>
        </div>
        <div class="dialog-content">
          <Upload2OSS
            ref="uploadImg"
            v-model="form.url"
            :limit="6"
            :max-m="2"
            class="order-upload"
            tips=""
            @change="handleImg"
          />
        </div>
      </div>
    </el-scrollbar>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import Upload2OSS from '@/components/AppTemplate/Upload2OSS'
import { closeDeliveryDelivery, closePackageDeliveryDelivery, closeDeliverLive } from '@/api/deliver/studentManagement'
export default {
  name: 'CloseDeliverDialog',
  components: {
    AppDialog,
    Upload2OSS
  },
  props: {
    isPackage: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {},
      row: {},
      loading: false,
      visible: false
    }
  },
  methods: {
    open(row) {
      this.row = row
      this.visible = true
    },
    handleImg(fildList) {
      this.form.url = fildList?.map(item => item.url) || []
    },
    handleClose() {
      this.form = {}
      this.$nextTick(() => {
        this.$refs.uploadImg.setFileList([])
      })
    },
    async onSubmit() {
      if (!this.form.remark) return this.$message.warning('请输入关闭交付原因')
      if (!this.form?.url) return this.$message.warning('请上传凭证')
      let api = null
      if (this.$props.type === 'live') {
        api = closeDeliverLive
      } else {
        api = this.$props.isPackage
          ? closePackageDeliveryDelivery
          : closeDeliveryDelivery
      }
      const req = {
        ...this.form,
        id: this.row.id || this.row.deliveryInfoId 
      }
      const { code, msg } = await api(req)
      if (code === 1) {
        this.visible = false
        this.handleClose()
        this.$emit('success')
        this.$message.success('关闭交付成功')
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container ::v-deep {
  padding: 20px;
  .dialog-title {
    font-size: 14px;
    color: #333333;
    margin-bottom: 12px;
    &::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .mt-20 {
    margin-top: 20px;
  }
  .form-title {
    width: 50px;
  }
  .btn {
    margin: 16px 50px 16px;
  }
  .tips {
    font-size: 12px;
    color: #777777;
    font-weight: 400;
  }
  .image-container {
    height: 90px;
    margin-bottom: 16px;
  }
  .order-upload {
    .el-upload-dragger,
    .image_poster,
    .uploadView {
      height: 90px;
      width: 120px;
    }
  }
  .m-20 {
    margin: 20px 0;
  }
  .tips-content {
    font-size: 14px;
    color: #f53f3f;
  }
}
</style>
