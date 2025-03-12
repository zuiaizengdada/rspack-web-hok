<template>
  <div class="shareSettings">
    <div class="shareForm">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-form">
        <el-form-item label="分享标题" prop="title">
          <el-input v-model="form.title" :disabled="!isEdit" maxlength="40" show-word-limit />
        </el-form-item>
        <el-form-item label="分享描述" prop="shareDesc">
          <el-input v-model="form.shareDesc" :disabled="!isEdit" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="分享图标" prop="img">
          <template>
            <upload
              key="MUpload"
              ref="MUpload"
              :disabled="!isEdit"
              :width="120"
              :height="120"
              accept=".jpg,.jpeg,.png"
              :before-upload="beforeUpload"
              :max-length="1"
              :get-oss-c-onfig-api="getLiveOssCConfig"
              oss-teacher-folder="hok_liveRoom"
              @change="fileChange"
            />
            <div class="formTips" style="margin-left: 0px">建议比例1:1，小于2M，适用于H5分享微信好友及微信朋友圈。</div>
          </template>
        </el-form-item>
        <el-form-item>
          <el-button v-if="!isEdit" :loading="loading" size="small" type="primary" @click="onhandleEdit">编辑</el-button>
          <el-button v-else :loading="loading" size="small" type="primary" @click="onhandleSave">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="shareFormRight">
      <div class="stylePreview">
        样式预览
        <div class="stylePreview_view">
          <div class="wxBox">
            <div class="box">
              <div class="cardBox">
                <img :src="logo" class="imglogo" />
                <div class="reply-items__content">
                  <div class="share_title">{{ form.title }}</div>
                  <div class="share_content">
                    <div class="share_Desc">{{ form.shareDesc }}</div>
                    <div class="share_Img">
                      <img :src="form.img" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getItem } from '@/utils/localStorage'
import upload from './upload.vue'
import { getLiveOssCConfig, getH5shareSetting, saveH5shareSetting } from '@/api/liveRoom/index'
import { getFileType } from '@/utils/index'
export default {
  components: {
    upload
  },
  data() {
    return {
      logo: '',
      logoUrls: [],
      loading: false,
      getLiveOssCConfig,
      isEdit: false,
      form: {
        title: '',
        shareDesc: '',
        img: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入分享主标题', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请上传分享图标', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    const data = getItem('orgInfo')
    this.logoUrls = data?.mediaDtoList || []
    console.log(this.logoUrls, 'this.logoUrls')
    if (this.logoUrls.length) {
      const cur = this.logoUrls.find(
        item => item.scope === '1' && item.terminal === 1
      )
      this.logo = cur?.url
    }
    this.init()
  },
  methods: {
    init() {
      this.getDetail()
    },
    getDetail() {
      this.loading = true
      const data = {
        liveRoomId: this.$route.params.id
      }
      getH5shareSetting(data).then(res => {
        this.form = {
          title: res.data.title || '',
          shareDesc: res.data.shareDesc || '',
          img: res.data.img || '',
          liveRoomId: this.$route.params.id
        }
        if (res.data.img) {
          const obj = {
            url: res.data.img,
            status: 3
          }
          this.$refs.MUpload && this.$refs.MUpload.setFileList([obj])
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onhandleEdit() {
      this.isEdit = true
    },
    onhandleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.onSave()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onSave() {
      this.loading = true
      const data = {
        ...this.form,
        liveRoomId: this.$route.params.id
      }
      saveH5shareSetting(data).then(res => {
        this.isEdit = false
        this.getDetail()
      }).catch(() => {
        this.loading = false
      })
    },
    beforeUpload(file) {
      // const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      } else if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2M!')
      }
      return isIMAGE && isLt2M
    },
    fileChange(res) {
      console.log(res, '上传文件改变触发')
      if (res.length > 0) {
        this.form.img = res[0].url
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.shareSettings {
  display: flex;
  .shareFormRight {
    flex: 1 0 0;
    .stylePreview {
      display: inline-block;
      // width: 300px;
      box-shadow: 0 2px 4px 0 #00000026;
      padding: 13px;
      font-size: 16px;
      font-weight: bold;
      .stylePreview_view {
        width: 100%;
        margin-top: 10px;
        border-radius: 4px;
        .wxBox {
          width: 343.09px;
          height: 313.74px;
          background: url('../../../../assets/image/live/liveShareBg.png') no-repeat 100% 100%;
          background-size: 100% 100%;
          border-top: 1px solid;
          border-color: rgba(0, 0, 0, 0);
          .reply-items__content {
            width: 305px;
            .reply-items__title {
              color: #333333;
              font-size: 12px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .reply-items__dafault {
              color: #333333;
              font-size: 12px;
              line-height: 1.2;
              white-space: pre-wrap;
            }
            .reply-items__desc {
              overflow: hidden;
              width: 245px;
              font-size: 12px;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              color: #777777;
              margin-right: 10px;
            }
            img {
              width: 48px;
              height: 48px;
              border-radius: 2px;
            }
            .cardThree {
              width: 163px;
            }
            .reply-items__img {
              width: 40px;
              height: 40px;
              border-radius: 2px;
            }
          }
          > .box {
            margin: 0 12px;
            height: 266px;
            // padding: 0 8px;
            padding-bottom: 10px;
            margin-top: 76px;
            overflow-y: scroll;
            > .cardBox {
              display: flex;
              margin-bottom: 20px;
              > .reply-items__content {
                max-width: calc(100% - 61px);
                margin-right: 4px;
                background: #fff;
                padding: 6px;
                line-height: 1.2;
                word-wrap: break-word;
                .share_title {
                  color: #000000;
                  font-size: 16px;
                  font-weight: bolder;
                  font-family: "微软雅黑";
                  font-size: 14px;
                }
                .share_content {
                  margin-top: 6.58px;
                  display: flex;
                  .share_Desc {
                    margin-right: 10px;
                    flex: 1 0 0;
                    color: #999999;
                    font-size: 14px;
                    font-weight: 400;
                    font-family: "微软雅黑";
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    line-clamp: 3;
                    -webkit-box-orient: vertical;
                  }
                  .share_Img {
                    max-width: 45px;
                    min-width: 45px;
                    width: 45px;
                    height: 45px;
                    // background: #f2f2f2;
                    > img {
                      width: 100%;
                      height: 100%;
                    }
                  }
                }
              }
            }
            .imglogo {
              width: 43px;
              height: 43px;
              margin-right: 10px;
            }
          }
          .bg {
            background-color: #ffffff !important;
          }
          .contentBox {
            white-space: pre;
          }
        }
      }
    }
  }
  .shareForm {
    width: 686px;
    margin-right: 92px;
    .formTips {
      margin-top: 8px;
      font-size: 12px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 17px;
    }
  }
}
::-webkit-scrollbar {
  display: none;
}
.xuxiCard {
  width: 305px !important;
  height: 56px;
}
</style>
