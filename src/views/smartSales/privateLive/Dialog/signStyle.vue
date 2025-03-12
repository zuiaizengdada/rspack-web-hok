<template>
  <AppDialog
    v-model="visible"
    title="样式选择"
    width="606px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <!-- 添加优惠券弹框 -->
    <div v-loading="loading" class="SignStyle">
      <el-radio-group v-model="radio">
        <div class="signStyleView">
          <div v-for="(item) in list" :key="item.value" class="signStyleViewItem" :class="{checkRadio: item.value === radio}" @click="radio = item.value">
            <img :src="item.icon" class="CouponStyleImg" />
            <el-radio :label="item.value" class="CouponStyleRadio">{{ item.text }}</el-radio>
          </div>
        </div>
        <div class="line" />
        <div class="signStyleCustom" :class="{checkRadio: radio === 4}" @click="radio = 4">
          <div class="signStyleCustomView">
            <div v-if="!imgUrl" class="signStyleCustomImg">
              <img class="signStyleCustomImgUrl" src="~@/assets/image/live/noPhoto.png" />
              <div class="des">未上传图片</div>
            </div>
            <div v-else class="signStyleCustomBoxImg">
              <img class="signStyleCustomBoxImgSettingimg" :src="imgUrl" />
              <img class="signStyleCustomBoxImgBg" src="~@/assets/image/live/signStyle4.png" />
            </div>
            <el-radio :label="4" class="CouponStyleRadio">自定义样式</el-radio>
          </div>
        </div>
        <div class="uploadView">
          <!-- <div class="btnView">
            <el-button type="primary" size="small" icon="el-icon-plus">上传背景</el-button>
            <el-button v-if="imgUrl" size="small">删除</el-button>
          </div>
          <div class="msgTips">建议尺寸：532*438，jpg、png格式，大小1M以内</div> -->
          <!-- <el-upload ref="upload" :disabled="radio !== 4" class="upload-demo btnView" action="" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
            <el-button slot="trigger" size="small" :disabled="radio !== 4" type="primary" icon="el-icon-plus">上传背景</el-button>
            <el-button style="margin-left: 10px;" :disabled="radio !== 4" size="small">删除</el-button>
            <div slot="tip" class="el-upload__tip msgTips">建议尺寸：532*438，jpg、png格式，大小1M以内</div>
          </el-upload> -->
          <template>
            <upload
              key="MUploadVideo"
              ref="MUploadVideo"
              type="btn"
              :width="160"
              :height="120"
              accept="image/jpeg,image/png,image/jpg"
              :before-upload="beforeUpload"
              :max-length="1"
              upload-text="上传背景"
              oss-teacher-folder="hok_liveRoom"
              :disabled="radio !== 4"
              :custom-style="{
                height: '88px',
                'margin-left': '18px',
                display: 'flex',
                'align-items': 'self-end',
              }"
              :get-oss-c-onfig-api="getLiveOssCConfig"
              @onClick="onImgClick"
              @change="fileChange"
            />
          </template>
          <div class="msgTips">建议尺寸：532*438，jpg、png格式，大小1M以内</div>
        </div>
      </el-radio-group>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import signStyle1 from '@/assets/image/live/signStyle1.png'
import signStyle2 from '@/assets/image/live/signStyle2.png'
import signStyle3 from '@/assets/image/live/signStyle3.png'
import upload from '@/components/AppUploadView/upload'
import { getFileType } from '@/utils/index'
import { getLiveOssCConfig } from '@/api/liveRoom/index.js'
import { getLiveRoomInfo, setSignStyle } from '@/api/liveRoom/index.js'
export default {
  components: {
    AppDialog,
    upload
  },
  props: {
    successFn: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      getLiveOssCConfig,
      top: '114px',
      loading: false,
      visible: false,
      list: [
        { icon: signStyle1, text: '样式一（黄）', value: 1 },
        { icon: signStyle2, text: '样式二（红）', value: 2 },
        { icon: signStyle3, text: '样式三（蓝）', value: 3 }
        // { icon: '', text: '自定义样式', value: 4 }
      ],
      imgUrl: '',
      radio: 1
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.$nextTick(() => {
          val && this.getDetail()
        })
      },
      deep: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 740) / 2 + 'px'
  },
  methods: {
    sure() {
      if (this.radio === 4 && !this.imgUrl) {
        return this.$message.error('请上传图片')
      }
      this.loading = true
      const data = {
        signStyle: this.radio,
        signStyleUrl: this.imgUrl,
        liveRoomId: this.liveRoomId
      }
      setSignStyle(data).then(res => {
        this.loading = false
        this.$message.success('操作成功')
        this.success && this.success()
      }).catch(() => {
        this.loading = false
      })
    },
    beforeUpload(file) {
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(type)
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      } else if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 1M!')
      }
      return isIMAGE && isLt1M
    },
    fileChange(res) {
      if (res.length > 0) {
        this.imgUrl = res[0].url
      }
    },
    onImgClick() {
      this.imgUrl = ''
      this.$refs.MUploadVideo && this.$refs.MUploadVideo.setFileList([])
    },
    getDetail() {
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId
      }
      getLiveRoomInfo(data).then(res => {
        this.radio = res.data.signStyle || 1
        this.imgUrl = res.data.signStyleUrl || ''
        if (this.imgUrl) {
          this.$refs.MUploadImg && this.$refs.MUploadImg.setFileList([
            { status: 3, url: this.imgUrl }
          ])
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.addCoupon {
  height: 622px;
  padding: 0 7.5px;
}
.signStyleView {
  width: 606px;
  display: flex;
  align-items: center;
  justify-content: center;
  .signStyleViewItem {
      width: 182px;
      height: 208px;
      flex-shrink: 0;
      border-radius: 4px;
      border: 1px solid #DCDFE6;
      background: #FFF;
      padding: 8px 8px 0;
      display: flex;
      flex-direction: column;
      margin: 14px 7.5px 12px;
      align-items: center;
      .CouponStyleImg {
        width: 166px;
        height: 160px;
      }
      .CouponStyleRadio {
        margin-top: 12px;
        font-weight: 600;
      }
  }
}
.line {
  width: 100%;
  height: 1px;
  background: #E7E7E7;
  margin-bottom: 14px;
}
.signStyleCustom {
  width: 182px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  background: #FFF;
  margin: 0 15px;
  float: left;
  padding: 8px 8px 0;
  .signStyleCustomView {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .signStyleCustomImg {
      width: 167px;
      height: 159px;
      flex-shrink: 0;
      border-radius: 4px;
      // margin-top: 8px;
      background: #F5F5F5;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      > .signStyleCustomImgUrl {
        width: 44px;
        height: 38px;
        margin-bottom: 12px;
      }
      > .des {
        color: #999999;
        text-align: center;
        font-family: "PingFang SC";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px;
      }
    }
    .CouponStyleRadio {
      margin-top: 10px;
      font-weight: 600;
    }
    .signStyleCustomBoxImg {
      height: 160px;
      position: relative;
      width: 100%;
      background: #F5F5F5;
      border-radius: 4px;
      overflow: hidden;
      .signStyleCustomBoxImgBg {
        position: absolute;
        bottom: 0;
        width: 100%;
        left: 0;
        right: 0;
        z-index: 2;
      }
      .signStyleCustomBoxImgSettingimg {
        position: absolute;
        top: 0;
        width: 94%;
        left: 0;
        right: 0;
        z-index: 1;
        margin: auto;
      }
    }
  }
}
.uploadView {
  width: 378px;
  height: 200px;
  float: left;
  .btnView {
    margin-top: 55px;
    margin-left: 18px;
  }
  .msgTips {
    margin-left: 18px;
    margin-top: 25px;
    color: #999999;
    font-family: "PingFang SC";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 10px;
  }
}

.checkRadio {
  border: 1px solid #0091FF!important;
}
</style>
