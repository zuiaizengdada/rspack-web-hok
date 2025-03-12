<template>
  <el-drawer
    :visible.sync="getDialogVisible"
    size="820px"
    append-to-body
    title="赠送"
    :wrapper-closable="false"
    destroy-on-close
    :before-close="dialogBeforeClose"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="auto"
      size="small"
      class="add-form-dialog"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="机构名称" prop="orgId">
        <el-select v-model="form.orgId" filterable placeholder="请选择">
          <el-option
            v-for="item in orgList"
            :key="item.organizationId"
            :label="item.name"
            :value="item.organizationId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="赠送内容" required>
        <el-row>
          <el-col :span="12">
            <el-form-item label="声音训练" class="custom-label">
              <el-input-number
                v-model="form.trainingTimes"
                :min="0"
                :max="99"
                style="width: 300px"
                class="text-left"
                :controls="false"
                label="声音训练"
              />
              <span class="dw-tips">次</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="形象采购" class="custom-label">
              <el-input-number
                v-model="form.purchaseTimes"
                :min="0"
                :max="99"
                style="width: 300px"
                class="text-left"
                :controls="false"
                label="形象采购"
              />
              <span class="dw-tips">次</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="形象训练声音时长" class="custom-label">
              <el-input-number
                v-model="form.trainingDuration"
                :min="0"
                :max="99"
                style="width: 300px"
                class="text-left"
                :controls="false"
                label="形象训练声音时长"
              />
              <span class="dw-tips">分钟</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视频时长" class="custom-label">
              <el-input-number
                v-model="form.videoDuration"
                :min="0"
                :max="999"
                style="width: 300px"
                class="text-left"
                :controls="false"
                label="视频时长"
              />
              <span class="dw-tips">分钟</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="赠送凭证" prop="vouchers">
        <div class="upload-box">
          <el-upload
            v-if="form.vouchers.length < 6"
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
            v-for="(item, index) in form.vouchers"
            :key="index"
            class="upload-item"
          >
            <ImagePreviewer
              style="width: 100%; height: 100%"
              :src="item"
              fit="contain"
              :preview-src-list="[item]"
            />
            <div class="delete-icon">
              <div @click="deleteItem(index)">
                <i
                  class="el-icon-delete"
                  style="color: #fff; font-size: 14px"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="upload-tips">
          最多上传6张，上传大小限制5M，图片格式：jpg,jpeg,png
        </div>
      </el-form-item>
      <div class="add-tips">
        <img src="@/assets/image/aigc/digitalVideoManage/jingao.png" alt="" />
        提示：新增赠送后，还需财务审核确认才能赠送成功
      </div>
    </el-form>
    <div class="footer">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="dialogBeforeClose">取消</el-button>
    </div>
  </el-drawer>
</template>
<script>
import { uploadImg } from '@/api/file'
import {
  addGive,
  getOrganizationByName
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
    }
  },
  data() {
    const validateContent = (rule, value, callback) => {
      if (
        !this.form.purchaseTimes &&
        !this.form.trainingDuration &&
        !this.form.trainingTimes &&
        !this.form.videoDuration
      ) {
        return callback(new Error('赠送内容至少1项，且1项内容值大于0'))
      }
      callback()
    }
    return {
      loading: false,
      form: {
        orgId: undefined,
        purchaseTimes: 0,
        trainingDuration: 0,
        trainingTimes: 0,
        videoDuration: 0,
        vouchers: []
      },
      rules: {
        orgId: [{ required: true, message: '请选择机构', trigger: 'change' }],
        content: [{ validator: validateContent, trigger: 'change' }],
        vouchers: [
          { required: true, message: '请输入赠送凭证', trigger: 'change' }
        ]
      },
      orgList: []
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
          this.form = {
            orgId: undefined,
            purchaseTimes: 0,
            trainingDuration: 0,
            trainingTimes: 0,
            videoDuration: 0,
            vouchers: []
          }
          this.getOrganizationByName()
        }
      },
      deep: true
    }
  },
  methods: {
    getOrganizationByName() {
      getOrganizationByName({ searchKey: '' })
        .then(res => {
          const { data } = res
          this.orgList = data
        })
        .catch(() => {})
    },
    deleteItem(index) {
      this.form.vouchers.splice(index, 1)
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
          this.form.vouchers.push(res.data.url)
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
      this.$refs.form.validate(valid => {
        if (valid) {
          addGive(this.form).then(res => {
            this.$message.success('新增成功')
            this.dialogBeforeClose()
          })
        }
      })
    },
    dialogBeforeClose() {
      this.$emit('change', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.add-tips {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 13px;
  border-radius: 8px;
  background: #fff4f4;
  color: #f1330d;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
}
.upload-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
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
.dw-tips {
  color: #000000;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  margin-left: 15px;
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
