<template>
  <AppDialog
    v-model="config.visible"
    title="编辑"
    width="568px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <div class="addDialog overflowOuto">
      <el-form ref="form" v-loading="loading" :model="form" label-width="auto" size="small" :rules="rules">
        <el-form-item label="员工姓名" prop="teacherName">
          {{ form.teacherName }}
        </el-form-item>
        <el-form-item label="直播间名称" prop="liveRoomAlias">
          <el-input v-model="form.liveRoomAlias" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="员工头像" prop="headImgUrl">
          <upload
            v-if="!form.headImgUrl"
            ref="MUpload"
            width="100"
            height="100"
            accept=".jpg,.jpeg,.png"
            :before-upload="beforeUpload"
            :max-length="1"
            oss-teacher-folder="hok_liveRoom"
            :get-oss-c-onfig-api="getLiveOssCConfig"
            @onClick="onClick"
            @change="fileChange"
          />
          <AppMyImage
            v-else
            :src="form.headImgUrl"
            style="width: 100px; height: 100px"
            :options="{
              width: 567,
              fixed: true,
              option: {
                fixed: true,
                fixedNumber: [1, 1],
                fixedBox: false
              }
            }"
            @close="delImage"
            @success="changeImage"
          />
          <div>只允许JPG或PNG图片，大小限2M。</div>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import upload from '@/components/AppUploadView/upload.vue'
import { getFileType } from '@/utils/index'
import { editliveRoomTutor } from '@/api/liveRoom/setting.js'
import AppMyImage from '@/components/AppMyImage'
import { getLiveOssCConfig } from '@/api/liveRoom/index'
export default {
  components: {
    AppDialog,
    upload,
    AppMyImage
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          row: {}
        }
      }
    }
  },
  data() {
    return {
      getLiveOssCConfig,
      form: {
        id: '',
        teacherId: '',
        teacherName: '',
        liveRoomAlias: '',
        headImgUrl: ''
      },
      rules: {},
      loading: false
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.init()
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init() {
      this.$refs.form && this.$refs.form.resetFields()
      this.form = { ...this.config.row }
      if (this.$refs.MUpload && this.form.headImgUrl) {
        this.$refs.MUpload.setFileList([{
          status: 3,
          url: this.form.headImgUrl
        }])
      }
    },
    beforeUpload(file) {
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      } else if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!')
      }
      return isIMAGE && isLt2M
    },
    fileChange(res) {
      console.log(res, '上传文件改变触发')
      if (res.length > 0) {
        this.form.headImgUrl = res[0].url
        this.$refs.form && this.$refs.form.validateField('headImgUrl')
      }
    },
    onClick(res) {
      this.$refs.MUpload && this.$refs.MUpload.setFileList([])
      this.form.headImgUrl = ''
    },
    onhandleCancel() {
      this.config.visible = false
    },
    onhandleEdit() {
      this.loading = true
      const data = {
        id: this.form.id,
        headImgUrl: this.form.headImgUrl,
        liveRoomAlias: this.form.liveRoomAlias,
        teacherId: this.form.teacherId,
        teacherTel: this.form.teacherTel
      }
      editliveRoomTutor(data).then(res => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.loading = false
        this.$emit('success')
      }).catch(() => {
        this.loading = false
      })
    },
    delImage() {
      this.form.headImgUrl = ''
    },
    changeImage(res) {
      this.form.headImgUrl = res
    },
    sure() {
      console.log('111')
      this.onhandleEdit()
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
      width: 100px;
      height: 100px;
    }
  }
}
::v-deep {
  .el-form-item__label {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
}
.addDialog {
  height: 300px;
  padding: 20px;
}
.userAvatar {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  margin-left: 8px;
}
.cropImage {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
::v-deep {
  .el-form-item__label {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    // line-height: 22px;
  }
}
</style>
