<template>
  <AppDialog
    v-model="config.visible"
    title="新增用户"
    width="490px"
    :loading="loading"
    height="auto"
  >
    <div class="addDialog overflowOuto">
      <el-form ref="form" v-loading="loading" label-position="top" :model="form" label-width="auto" size="small" :rules="rules" @submit.native.prevent>
        <el-form-item label="用户昵称" prop="userName">
          <el-input ref="userInput" v-model.trim="form.userName" clearable maxlength="20" show-word-limit placeholder="请输入" @keyup.enter.native="sure(true)" />
        </el-form-item>
        <el-form-item label="用户身份" prop="userIdentity">
          <el-radio-group v-model="form.userIdentity">
            <el-radio :label="1">学员</el-radio>
            <el-radio :label="2">助教</el-radio>
            <el-radio :label="3">讲师</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户头像" prop="avatar">
          <div slot="label">
            用户头像
            <span class="userAvatar">限大小20M,JPG,PNG,JPEG格式</span>
          </div>
          <upload
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
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="addDialogFooter">
      <el-button class="btn_primary" size="small" @click="sure(true)">保存并新增下一个</el-button>
      <el-button type="primary" size="small" @click="sure(false)">确定</el-button>
      <el-button size="small" @click="onhandleCancel">取消</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import upload from '@/components/AppUploadView/upload.vue'
import { getFileType } from '@/utils/index'
import { addRobot } from '@/api/liveRoom/robot'
import { getLiveOssCConfig } from '@/api/liveRoom/index'
export default {
  components: {
    AppDialog,
    upload
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false
        }
      }
    }
  },
  data() {
    var validateuserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入用户昵称'))
      } else if (/^.*(\d{11}).*$/.test(value)) {
        return callback(new Error('用户昵称不能包含手机号码'))
      } else {
        return callback()
      }
    }
    return {
      getLiveOssCConfig,
      form: {
        userName: '',
        avatar: '',
        userIdentity: 1
      },
      rules: {
        userName: [
          { required: true, validator: validateuserName, trigger: 'change' }
        ],
        userIdentity: [
          { required: true, message: '请选择用户身份', trigger: 'change' }
        ],
        avatar: [
          { required: true, message: '请上传用户头像', trigger: 'change' }
        ]
      },
      loading: false
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        this.init()
      }
    }
  },
  mounted() {},
  methods: {
    init() {
      this.$refs.form && this.$refs.form.resetFields()
      this.form = {
        userName: '',
        userIdentity: 1,
        avatar: ''
      }
      this.$refs.MUpload && this.$refs.MUpload.setFileList([])
    },
    sure(type) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form)
          this.onhandleAdd(type)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    beforeUpload(file) {
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(type)
      // const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      } else if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 20MB!')
      }
      return isIMAGE && isLt20M
    },
    fileChange(res) {
      console.log(res, '上传文件改变触发')
      if (res.length > 0) {
        this.form.avatar = res[0].url
        this.$refs.form && this.$refs.form.validateField('avatar')
      }
    },
    onClick(res) {
      this.$refs.MUpload && this.$refs.MUpload.setFileList([])
      this.form.avatar = ''
    },
    onhandleCancel() {
      this.config.visible = false
    },
    onhandleAdd(type) {
      this.loading = true
      const data = {
        robotHeadPic: this.form.avatar,
        userIdentity: this.form.userIdentity,
        robotNickName: this.form.userName
      }
      addRobot(data).then(res => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.loading = false
        this.$refs.userInput && this.$refs.userInput.focus()
        this.$emit('success', type)
        type && this.init()
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
      width: 100px;
      height: 100px;
    }
  }
}
.addDialog {
  padding: 18px 20px;
}
.addDialogFooter {
 display: flex;
 align-items: center;
 justify-content: flex-end;
 padding: 16px 20px;
}
.userAvatar {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  margin-left: 8px;
}
::v-deep {
  .el-form-item__label {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    display: flex;
  }
}
</style>
