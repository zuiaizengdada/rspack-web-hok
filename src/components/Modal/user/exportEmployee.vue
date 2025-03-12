<!-- 导入员工弹框 -->
<template>
  <div v-loading="loading" :class="`group${type == 2 ? 'Dialog' : 'Drawer'}`">
    <div class="form">
      <el-upload
        ref="upload"
        class="upload-demo"
        :action="action"
        accept="xlsx"
        :headers="{
          'Authorization': getToken
        }"
        :on-success="onSuccess"
        :show-file-list="false"
        :file-list="fileList"
        :on-error="fileError"
        :before-upload="beforeAvatarUpload"
      >
        <el-button :loading="downBtnLoading" @click="downLoadStudent">下载模板</el-button>
        <el-button slot="trigger" size="small" type="primary" class="m-r-20">导入</el-button>
      </el-upload>

      <div class="tips m-t-10">只能上传xls,cvs,xlsx格式文件,大小不能超过10M,过多数据请分批上传</div>
      <div v-for="(item, index) in fileList" :key="index">
        <div v-if="item.code === 1" class="errorFileTips">
          <!-- {{ item.name }} -->
          <span>{{ item.name }}</span>
          <i class="el-icon-upload-success el-icon-circle-check" />
        </div>
        <div v-else class="errorFileTips" @click="onFileClicke(item)">
          <span>{{ item.response.data.msg }}</span>
          <i v-if="item.response.data.errorList.length === 0" class="el-icon-upload-success el-icon-circle-check" style="color: #67c23a;" />
          <i v-else class="el-icon-circle-close" style="color: red" />
        </div>
      </div>
    </div>

    <div class="demo-drawer__footer">
      <el-button size="small" @click="$emit('close')">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { downLoadUser } from '@/api/system/menu'
export default {
  name: 'ExportEmployee',
  props: {
    type: {
      type: Number,
      default: 1
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      downBtnLoading: false,
      getToken: getToken(),
      fileList: [],
      action: process.env.VUE_APP_BASE_API + '/system/user/import'
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue && this.type === 1) {
          // this.form = {
          //   catalogueName: '', // 分组名称
          //   catalogueSort: '', // 显示顺序
          //   catalogueUrl: '' // 目录图标路径
          // }
        } else if (!newValue) {
          // this.form = this.data
          console.log('关闭弹框')
          this.$refs.upload.abort()
          this.$refs.upload && this.$refs.upload.clearFiles()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 下载模板
    downLoadStudent() {
      this.downBtnLoading = true
      downLoadUser().then(res => {
        this.downBtnLoading = false
        window.location = res.data
      }).catch(() => {
        this.downBtnLoading = false
      })
    },

    beforeAvatarUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isLt10M
    },
    onSuccess(response, file, fileList) {
      this.fileList = fileList
      // if (response.code !== 1) {
      //   this.$message.error(response.msg || '错误')
      // } else {
      //   this.$message.success(response.data.msg)
      //   // window.location = response.data.errorUrl
      // }
    },
    onFileClicke(file) {
      console.log(file)
      window.location = file.response.data.errorUrl
    },
    fileError(err, file, fileList) {
      console.log(err, file, fileList)
      this.$message.error(`【${file.name}】上传失败!`)
    }
  }
}
</script>

<style lang="scss" scoped>
.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;
  .form {
    // flex: 1;
    height: calc(100vh - 77px - 50px);
    width: 100%;
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .demo-drawer__footer {
    width: 100%;
    height: 50px;
    padding-top: 10px;
    padding-left: 10px;
    -webkit-box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }
  .form_avatar {
    display: flex;
    align-items: center;
    .form_btn {
      height: 30px;
      margin-left: 10px;
    }
  }
  .form_textarea {
    width: 600px;
    margin-right: 10px;
  }
}
.image_poster {
  background: #F5F7FA;
  border-radius: 4px;
  border: 1px solid #DCDCDC;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  > span {
    margin-top: 13px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    line-height: 20px;
  }
  &:hover {
    border: 1px dashed #1472ff;;
  }
}
.tips {
  // margin-top: 20px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
.errorFileTips {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 10px;
  transition: all .5s cubic-bezier(.55,0,.1,1);
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  margin-top: 5px;
  position: relative;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: #f5f7fa;
  cursor: pointer;
  &:hover {
    background-color: #CEE2FF !important;
  }
}
</style>
