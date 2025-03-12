<template>
  <!-- 新建标签弹框层 -->
  <AppDialog
    v-model="visible"
    title="客服详情"
    width="600px"
    height="auto"
    :loading="loading"
  >
    <div class="choose_resource  overflowOuto">
      <el-form ref="form" :model="form" label-width="82px">
        <el-form-item label="手机号码:" prop="phone">
          <span>{{ form.userPhone }}</span>
        </el-form-item>
        <el-form-item label="完善备注:" prop="reason">
          {{ form.remark }}
        </el-form-item>

        <el-form-item label="上传图片:" prop="imageUrl">
          <uploadShow :url="form.file" style="width: 160px; height: 90px" />
        </el-form-item>

        <el-form-item label="操作人:" prop="reason">
          {{ form.createUserName }}
        </el-form-item>

        <el-form-item label="操作时间:" prop="reason">
          {{ form.createTime }}
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import uploadShow from './uploadShow.vue'
import { getCompleteDetail } from '@/api/deliver/advertising'
export default {
  components: {
    AppDialog,
    uploadShow
  },
  data() {
    return {
      loading: false,
      form: {
        createTime: '',
        createUserName: '',
        file: '',
        remark: '',
        userPhone: '',
        visitorOrderId: ''
      },
      visible: false
    }
  },
  methods: {
    open(row) {
      this.form = {
        createTime: '',
        createUserName: '',
        file: '',
        remark: '',
        userPhone: '',
        visitorOrderId: ''
      }
      this.fileList = []
      this.$refs.form && this.$refs.form.resetFields()
      this.loading = true
      this.visible = true
      const { completeId } = JSON.parse(JSON.stringify(row))
      getCompleteDetail(completeId).then(res => {
        this.form = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
    .el-upload {
        .el-upload-dragger {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #FBFCFE;
            width: 160px;
            height: 90px;
        }
    }
    .el-form-item {
      margin-bottom: 16px;
    }
    .el-form-item__label {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 24px;
      font-weight: 400;
    }
    .el-form-item__content {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 24px;
    }
}
.choose_resource {
  max-height: 400px;
  padding: 20px;
}
.uploadView, .uploadItem {
    width: 160px;
    height: 90px;
    background: #FBFCFE;
    border-radius: 4px;
    // border: 1px solid #E1E6ED;
    .uploadViewText {
        margin-top: 12px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #0C6FFF;
        line-height: 20px;
    }
}
.tips {
    margin-top: 5px;
    margin-left: 8px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
}
.el-icon-plus {
    font-weight: 700;
    font-size: 14px;
    color: #333333;
}
</style>
