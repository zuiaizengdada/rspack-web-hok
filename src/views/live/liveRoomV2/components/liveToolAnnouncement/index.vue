<template>
  <!-- 直播间公告 -->
  <div class="page_wrap">
    <div v-loading="loading" class="editNotice">
      <el-scrollbar
        ref="P5ScrollContainer"
        :vertical="false"
        class="editNotice_scroll"
      >
        <div class="form">
          <el-form
            ref="form"
            :model="form"
            label-width="auto"
            label-position="top"
          >
            <el-form-item label="公告内容" prop="name">
              <el-input
                v-model.trim="form.value"
                type="textarea"
                :autosize="{ minRows: 6, maxRows: 6 }"
                maxlength="200"
                show-word-limit
                placeholder="请输入公告内容"
              />
            </el-form-item>
            <el-form-item label="上传图片" prop="name">
              <uploadView
                key="MUpload"
                ref="MUpload"
                :width="136"
                :height="95"
                accept=".jpg,.jpeg,.png"
                upload-text="上传图片"
                :before-upload="beforeUploadImg"
                :max-length="1"
                :get-oss-c-onfig-api="getLiveOssCConfig"
                oss-teacher-folder="hok_liveRoom"
                class="live-upload"
                @onClick="onImgClick"
                @change="res => fileChange(res)"
              />
              <div class="tips">只支持PNG或JPG图片，限一张，大小限5M以内</div>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </div>
    <div class="footerBtn">
      <el-button class="footerBtnSure" :loading="loading" @click="sure">
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
import uploadView from '@/components/AppUploadView/upload'
import { getFileType } from '@/utils/index'
import { getLiveOssCConfig } from '@/api/liveRoom/index'
import { editGroupInfo } from '@/api/liveRoom/im.js'
import { mapState } from 'vuex'
export default {
  components: {
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
    'liveRoomDetail.announcement': {
      handler(val) {
        this.form.value = val
      },
      deep: true,
      immediate: true
    },
    'liveRoomDetail.announcementUrl': {
      handler(val) {
        console.log(val, '公告图片改变触发')
        this.form.url = val
        if (val) {
          console.log(this.form, 'form')
          this.form.url &&
            this.$refs.MUpload.setFileList([{ status: 3, url: this.form.url }])
        } else {
          this.$refs.MUpload && this.$refs.MUpload.setFileList([])
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    console.log('111111')
  },
  methods: {
    sure() {
      console.log('1231', this.liveRoomDetail)
      this.loading = true
      const params = {
        liveRoomId: this.$route.params.id,
        groupId: this.liveRoomDetail.groupId,
        notice: this.form.value,
        noticeUrl: this.form.url
      }
      editGroupInfo(params)
        .then(res => {
          console.log(res, 'res')
          this.loading = false
          this.success && this.success()
          this.$store.commit('im/SET_liveRoomDetailByKey', {
            data: this.form.value,
            key: 'announcement'
          })
          this.$store.commit('im/SET_liveRoomDetailByKey', {
            data: this.form.url,
            key: 'announcementUrl'
          })
        })
        .catch(() => {
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
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(
        type
      )
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

<style lang="scss" scoped>
.page_wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .editNotice {
    height: 100%;
    flex: 1 0 0;
    overflow: hidden;
    .editNotice_scroll {
      height: 100%;
    }
  }
  .form {
    padding: 10px 15px 5px 15px;
  }
  .footerBtn {
    width: 100%;
    height: 52px;
    min-height: 52px;
    max-height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #dcdee1;
    background: #fff;
    .footerBtnSure {
      width: 70px;
      height: 32px;
      flex-shrink: 0;
      border-radius: 5px;
      background: #0c6fff;
      color: #fff;
      line-height: 32px;
      padding: 0;
    }
  }
}
::v-deep {
  .form {
    .el-form-item {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
      .el-form-item__label {
        color: #000000;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 14px;
      }
      .el-textarea__inner {
        padding: 6px 10px;
        color: #000;
      }
    }
  }
  .el-upload {
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f2f2f2;
      width: 136px;
      height: 95px;
      border-radius: 5px;
      border: 1px solid #f2f2f2;
      .el-icon-plus {
        font-size: 12px;
        color: #c2c6ce;
      }
      .uploadViewText {
        color: #c2c6ce;
        font-family: 'Microsoft YaHei';
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px;
      }
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
