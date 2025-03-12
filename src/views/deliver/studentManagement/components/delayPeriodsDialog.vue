<template>
  <AppDialog
    v-model="visible"
    :footer-text="['确定', '取消']"
    title="延期"
    width="620px"
    height="500px"
    top="60px"
    :loading="loading"
    @success="onSubmit"
    @close="handleClose"
  >
    <el-scrollbar style="height: 500px">
      <div class="dialog-container">
        <div class="dialog-title">延期原因</div>
        <div class="dialog-content">
          <el-input
            v-model="form.deliveryReason"
            maxlength="200"
            show-word-limit
            size="small"
            :rows="4"
            type="textarea"
            clearable
          />
        </div>
        <div class="dialog-title mt-20">延期时长</div>
        <div class="dialog-content">
          <m-select
            v-model="form.type"
            :clearable="false"
            :request="getDeliveryDict"
            :param="{ value: 'type', label: 'label' }"
            placeholder="请选择"
            style="margin-bottom: 12px; width: 270px"
            @change="handleDelayMonths"
          />
          <div class="tips-content">
            <div v-show="delayInfo.curFailureTime">将从{{ delayInfo.curFailureTime }} 延期到 {{ delayInfo.delayFailureTime }}</div>
            <div>
              当前课程还能延期 {{ delayInfo.surplusSum }} 次（不含本次）
            </div>
          </div>
        </div>
        <div class="m-20">
          <span style="margin-right: 10px">
            上传凭证(聊天记录、审批记录等)</span>
          <span
            class="tips"
          >最多上传6张，格式为jpg,png,jpeg，单图片大小2M以下</span>
        </div>
        <div class="dialog-content">
          <Upload2OSS
            ref="uploadImg"
            v-model="form.imgUrl"
            :limit="6"
            :max-m="2"
            class="order-upload"
            tips=""
            @change="handleChange"
          />
        </div>
      </div>
    </el-scrollbar>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import Upload2OSS from '@/components/AppTemplate/Upload2OSS'
import {
  betchDelayFailureTime,
  getDeliveryDict,
  getDeliverDelayInfo
} from '@/api/deliver/studentManagement'
export default {
  name: 'DelayPeriodsDialog',
  components: {
    AppDialog,
    Upload2OSS
  },
  data() {
    return {
      form: {},
      row: {},
      loading: false,
      visible: false,
      delayInfo: {},
      failureTime: '',
      options: ['1个月', '2个月']
    }
  },
  methods: {
    handleClose() {
      this.$nextTick(() => {
        this.$refs.uploadImg.setFileList([])
      })
      this.form = {}
    },
    handleDelayMonths() {
      this.getDeliverDelayInfo()
    },
    getDeliveryDict() {
      return getDeliveryDict({
        key: 'ReplacementEnrollmentTypeExtensionDictType'
      })
    },
    open(row) {
      this.visible = true
      this.row = row
      this.getDeliverDelayInfo()
      // if(!row.effectiveTime)
    },
    async getDeliverDelayInfo() {
      const { code, data } = await getDeliverDelayInfo({
        deliveryNo: this.row.deliveryNo,
        type: this.form.type || ''
      })
      if (code === 1) this.delayInfo = data
    },
    handleChange(fildList) {
      this.form.imgUrl = fildList?.map(item => item.url) || []
    },
    async onSubmit() {
      if (!this.form.deliveryReason) return this.$message.warning('请填写延期原因！')
      if (!this.form.type) return this.$message.warning('请选择延期时长！')
      if (!this.form?.imgUrl?.length) return this.$message.warning('请上传凭证！')
      const { code, msg } = await betchDelayFailureTime({
        ...this.form,
        deliveryNo: this.row.deliveryNo
      })
      if (code === 1) {
        this.visible = false
        this.handleClose()
        this.$emit('success')
        this.$message.success('延期成功')
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
    font-weight: bold;
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
