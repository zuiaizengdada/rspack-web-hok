<template>
  <el-drawer
    :visible.sync="getDialogVisible"
    size="820px"
    append-to-body
    title="确认赠送"
    :wrapper-closable="false"
    destroy-on-close
    :before-close="dialogBeforeClose"
  >
    <div class="row-box">
      <div class="row-item">
        <div class="row-item-title">机构名称：</div>
        <div class="row-item-content">{{ rowData.orgName }}</div>
      </div>
      <div class="row-item">
        <div class="row-item-title">套餐包含内容</div>
      </div>
      <div class="list-box">
        <div v-if="detail.trainingTimes" class="list-item-content">
          声音训练{{ detail.trainingTimes }}次
        </div>
        <div v-if="detail.purchaseTimes" class="list-item-content">
          形象训练采购{{ detail.purchaseTimes }}次
        </div>
        <div v-if="detail.trainingDuration" class="list-item-content">
          形象训练声音时长{{ detail.trainingDuration }}分钟
        </div>
        <div v-if="detail.videoDuration" class="list-item-content">
          视频生成时长{{ detail.videoDuration }}分钟
        </div>
      </div>

      <div class="row-item">
        <div class="row-item-title">
          <span style="color: #ff0000">*</span>确认备注：</div>
      </div>
      <el-input
        v-model="remark"
        type="textarea"
        :rows="4"
        style="margin-top: 16px"
        maxlength="100"
        show-word-limit
        placeholder="请输入"
      />

      <div class="row-item">
        <div class="row-item-title">
          <span style="color: #ff0000">*</span>赠送凭证</div>
      </div>
      <div class="upload-box">
        <el-upload
          v-if="giftVouchers.length < 6"
          class="avatar-uploader"
          action="#"
          :http-request="fileChange"
          :show-file-list="false"
          accept="image/jpg,image/jpeg,image/png"
          :before-upload="beforeAvatarUpload"
        >
          <div>
            <i class="el-icon-plus avatar-uploader-icon" />
            <div class="el-icon-plus-tips">点击上传图片</div>
          </div>
        </el-upload>
        <div
          v-for="(item, index) in giftVouchers"
          :key="index"
          class="upload-item"
        >
          <ImagePreviewer
            style="width: 100%; height: 100%"
            :src="item"
            fit="contain"
            :preview-src-list="[item]"
          />
        </div>
      </div>

      <div class="upload-tips">
        最多上传6张，上传大小限制5M，图片格式：jpg,jpeg,png
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" @click="handleSave">确认赠送</el-button>
      <el-button @click="dialogBeforeClose">取消</el-button>
    </div>
  </el-drawer>
</template>
<script>
import { uploadImg } from '@/api/file'
import {
  confirmGive,
  getOrderDetail
} from '@/api/aiVideoManage/setMealModule'
export default {
  model: {
    prop: 'dialogVisible',
    event: 'change'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    rowData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      detail: {},
      remark: '',
      giftVouchers: []
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
    getDialogVisible: {
      handler(val) {
        if (val) {
          this.getDetail()
        }
      },
      deep: true
    }
  },
  methods: {
    getDetail() {
      getOrderDetail({ orderNo: this.rowData.orderNo  }).then(res => {
        this.detail = res.data
      })
    },
    fileChange(e) {
      this.loading = true
      const fileData = new File([e.file], e.file.name, {
        type: 'text/plain'
      })
      const formData = new FormData()
      formData.append('file', fileData)
      uploadImg(formData)
        .then(res => {
          this.loading = false
          this.giftVouchers.push(res.data.url)
        })
        .catch(() => {
          this.loading = false
        })
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg'
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isJPG) {
        this.$message.error(
          '上传图片只能是 最多上传6张，上传大小限制5M，图片格式：jpg,jpeg,png 格式!'
        )
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return isJPG && isLt5M
    },
    handleSave() {
      if (!this.remark) {
        this.$message.error('请输入备注')
        return
      }
      if (!this.giftVouchers.length) {
        this.$message.error('请上传凭证')
        return
      }
      const params = {
        orderNo: this.rowData.orderNo,
        remark: this.remark,
        vouchers: this.giftVouchers
      }
      confirmGive(params).then(res => {
        this.$message.success('赠送成功')
        this.$emit('success')
        this.dialogBeforeClose()
      })
    },
    dialogBeforeClose() {
      this.$emit('change', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.row-box {
  position: relative;
  .row-item {
    display: flex;
    align-items: center;
    margin-top: 20px;
    .row-item-title {
      color: #777777;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
    }
    .row-item-content {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
    }
  }

  .list-box {
    width: 100%;
    border: 1px solid #f0f3f7;
    border-bottom: none;
    margin-top: 16px;
    .list-item-content {
      padding: 12px 10px;
      border-bottom: 1px solid #f0f3f7;
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
    }
  }
}
.upload-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 16px;
  .upload-item {
    width: 100px;
    height: 100px;
    background: #f5f7fa;
    border-radius: 6px;
    margin-left: 10px;
    margin-bottom: 10px;
    position: relative;
    &:hover {
      .delete-icon {
        display: flex;
      }
    }
    .delete-icon {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 26px;
      border-radius: 0 0 6px 6px;
      background: #00000099;
      display: none;
      justify-content: center;
      align-items: center;
      i {
        cursor: pointer;
      }
    }
  }
  .upload-tips {
    color: #000000;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }
}
.avatar-uploader-icon {
  font-size: 14px;
  color: #000000;
  text-align: center;
  margin-top: 28px;
}
.el-icon-plus-tips {
  width: 100%;
  text-align: center;
  color: #000000;
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-style: normal;
}

.tips {
  color: #777777;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  margin-left: 8px;
}
.footer {
  position: absolute;
  height: 68px;
  bottom: 0;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep {
  .avatar-uploader .el-upload {
    width: 100px;
    height: 100px;
    border: 1px dashed #dcdee1;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: #fafafa;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .el-drawer__header {
    padding-bottom: 20px !important;
    margin-bottom: 0 !important;
    border-bottom: 1px solid #eff2f6;
    span {
      font-size: 16px;
      color: #000;
      font-weight: 600;
      font-family: 'Microsoft YaHei';
      letter-spacing: 1px;
    }
  }
  .el-drawer__body {
    padding: 20px 23px 68px 23px;
  }
  .add-form-dialog {
    .el-form-item__label {
      font-weight: 600;
      color: #000;
      font-family: 'Microsoft YaHei';
      padding-left: 0 !important;
      padding-right: 20px !important;
    }
  }

  .text-left {
    .el-input {
      input {
        text-align: left;
      }
    }
  }
  .custom-label {
    .el-form-item__label {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
    }
  }
}
</style>
