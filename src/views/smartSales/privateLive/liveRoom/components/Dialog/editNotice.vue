<template>
  <AppDialog
    v-model="visible"
    title="编辑公告"
    width="606px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="editNotice overflowOuto">
      <el-form ref="form" :model="form" label-width="auto">
        <el-form-item label="公告内容" prop="name">
          <el-input v-model.trim="form.value" type="textarea" :autosize="{ minRows: 7, maxRows: 7 }" maxlength="200" show-word-limit placeholder="请输入公告内容" />
        </el-form-item>
        <el-form-item label="上传图片" prop="name">
          <uploadView
            key="MUpload"
            ref="MUpload"
            :width="182"
            :height="120"
            accept=".jpg,.jpeg,.png"
            upload-text="上传图片"
            :before-upload="beforeUploadImg"
            :max-length="1"
            :get-oss-c-onfig-api="getLiveOssCConfig"
            oss-teacher-folder="hok_liveRoom"
            @onClick="onImgClick"
            @change="(res) => fileChange(res)"
          />
          <div class="tips">只支持PNG或JPG图片，限一张，大小限5M以内</div>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { editGroupInfo } from '@/api/liveRoom/im.js'
import uploadView from '@/components/AppUploadView/upload'
import { getFileType } from '@/utils/index'
import { getLiveOssCConfig } from '@/api/liveRoom/index'
import { mapState } from 'vuex'
export default {
  components: {
    AppDialog,
    uploadView
  },
  data() {
    return {
      getLiveOssCConfig,
      visible: false,
      loading: false,
      top: '114px',
      liveRoomId: '',
      form: {
        value: '',
        url: ''
      },
      success: () => {}
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  watch: {
    visible: {
      handler(val) {
        this.$nextTick(() => {
          if (val) {
            console.log(this.form, 'form')
            this.form.url && this.$refs.MUpload.setFileList([{ status: 3, url: this.form.url }])
          } else {
            // this.form.url = ''
            this.$refs.MUpload && this.$refs.MUpload.setFileList([])
          }
        })
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 516) / 2 + 'px'
    console.log(this.top)
  },
  methods: {
    sure() {
      console.log('1231', this.liveRoomDetail)
      this.loading = true
      const params = {
        liveRoomId: this.liveRoomId,
        groupId: this.liveRoomDetail.groupId,
        notice: this.form.value,
        noticeUrl: this.form.url
      }
      editGroupInfo(params).then(res => {
        console.log(res, 'res')
        this.loading = false
        this.success && this.success()
        this.$store.commit('im/SET_liveRoomDetailByKey', { data: this.form.value, key: 'announcement' })
        this.$store.commit('im/SET_liveRoomDetailByKey', { data: this.form.url, key: 'announcementUrl' })
      }).catch(() => {
        this.loading = false
      })
    },
    // 清空
    onImgClick() {
      this.form.url = ''
      this.$refs.MUpload && this.$refs.MUpload.setFileList([])
    },
    // 文件选中
    fileChange(res) {
      if (res.length > 0) {
        this.form.url = res[0].url
      }
    },
    beforeUploadImg(file) {
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(type)
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      } else if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5M!')
      }
      return isIMAGE && isLt5M
    }
  }
}
</script>

<style lang='scss' scoped>
.editNotice {
  height: 388px;
  padding: 20px;
}
::v-deep {
  .el-upload {
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #FBFCFE;
      width: 182px;
      height: 120px;
    }
  }
}
.tips {
  margin-top: 6px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 17px;
}
</style>
