<template>
  <div class="msgSelect">
    <el-radio-group v-model="radio" class="radioGroup" @change="onTypeChange">
      <el-radio v-for="(item) in msgTypeOption" :key="item.value" class="radioGroupItem" :label="item.value">{{ item.label }}</el-radio>
    </el-radio-group>

    <div class="msgContent m-t-10">
      <template v-if="radio === 1 || radio === 11">
        <el-input v-model="content" type="textarea" :rows="3" placeholder="请输入内容" maxlength="100" show-word-limit disabled />
      </template>
      <template v-else-if="radio === 3">
        <el-input v-model.trim="content" type="textarea" :rows="3" placeholder="请输入内容" maxlength="200" show-word-limit />
      </template>
      <template v-else-if="radio === 2">
        <el-image fit="contain" src="https://oss.hokkj.cn/live/rose.png" style="width: 100px;height: 100px">
          <div slot="error" class="image-slot">
            <i class="el-icon-loading" />
          </div>
        </el-image>
      </template>
      <template v-else-if="radio === 5">
        <div class="emoji-box">
          <div v-for="(item, index) in emojiList" :key="index" class="emojiView" :class="{emojiActive: content === item.name}" @click="pickEmoji(index)">
            <img
              :src="item.value"
              :alt="item.name"
              class="emoji-img"
              :title="item.name"
            >
          </div>
        </div>
      </template>
      <template v-else-if="radio === 4">
        <upload
          ref="MUpload"
          width="160"
          height="120"
          accept=".jpg,.jpeg,.png"
          :before-upload="beforeUpload"
          :max-length="1"
          oss-teacher-folder="hok_liveRoom"
          @onClick="delImage"
          @change="fileChange"
        />
      </template>
      <template v-else-if="radio === 8">
        <div class="shoping_comment_content">
          <div class="shoping">
            <img src="~@/assets/image/liveRoom/shopCar.png" class="shopingIcon">
            <div class="shopingText">
              <img src="~@/assets/image/live/zhengzaigoumai.png" style="width: 66px;height: 14px;">
              <!-- 正在购买中 -->
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="radio === 9">
        <div class="shoping_comment_content">
          <div class="shoping shoped">
            <img src="~@/assets/image/liveRoom/shopCar.png" class="shopingIcon">
            <div class="shopingText">
              <img src="~@/assets/image/live/yigoumai.png" style="width: 50px;height: 15px;">
              <!-- 已购买 -->
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="radio === 10">
        <div class="shoping_comment_content">
          <div class="shoping yilingquyouhuiquan">
            <img src="~@/assets/image/live/hot.png" class="shopingIcon" style="width: 18px;height: 18px">
            <div class="shopingText">
              <img src="~@/assets/image/live/yilingquyouhuiquan.png" style="width: 99px;height: 15px;">
              <!-- 已领取优惠券 -->
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { msgTypeOption } from '../../../columns'
import { emojiList } from '../../../liveRoom/components/p2/Emoji/emoji.js'
import upload from '@/components/AppUploadView/upload.vue'
import { getOptionsValueByKey } from '@/filters/index'
export default {
  components: {
    upload
  },
  props: {
    type: {
      type: Number,
      default: 1
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      emojiList,
      msgTypeOption
      // content: ''
      // radio: '',
      // content: ''
    }
  },
  computed: {
    radio: {
      get() {
        return this.type
      },
      set(val) {
        this.$emit('update:type', val)
      }
    },
    content: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          if (this.type === 4) {
            this.$nextTick(() => {
              this.$refs.MUpload && this.$refs.MUpload.setFileList([{
                status: 3,
                url: val,
                file: null,
                name: '',
                authProgress: 0,
                ossTeacherFolder: '',
                poster: '', // 封面
                alignUploadShow: false, // 重新上传mask控制
                abortCheckpoint: null, // 中断点
                client: null
              }])
            })
          }
        } else {
          // this.$refs.MUpload && this.$refs.MUpload.setFileList([])
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    pickEmoji(idx) {
      // console.log(this.emojiList[idx])
      this.content = this.emojiList[idx].name
      // return this.$emit('selectEmoji', this.emojiList[idx])
    },
    beforeUpload(file) {
      const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg或png格式图片!`)
      }
      return isIMAGE
    },
    fileChange(res) {
      console.log(res, '上传文件改变触发')
      if (res.length > 0) {
        this.content = res[0].url
      }
    },
    delImage(res) {
      this.$refs.MUpload && this.$refs.MUpload.setFileList([])
      this.content = ''
    },
    onTypeChange() {
      this.content = getOptionsValueByKey('value', 'default', this.radio, msgTypeOption)
      this.$emit('onChange', this.radio)
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
      height: 120px;
    }
  }
}
.msgSelect {
  .emoji-box {
    padding: 10px 0 0 10px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    display: flex;
    flex-wrap: wrap;
    .emojiView {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      margin-bottom: 10px;
      border-radius: 4px;
      cursor: pointer;
      .emoji-img {
        width: 20px;
        height: 20px;
      }
    }
    .emojiActive {
      background: #0C6FFF;
    }
  }
  .radioGroup {
    margin-top: 8px;
    .radioGroupItem {
      // min-width: 50px;
      margin-bottom: 10px;
    }
  }
}
.image-slot {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  .el-icon-loading {
    font-size: 24px;
    padding: 5px 10px;
  }
}
.shoping_comment_content {
  width: 238px;
  border-radius: 19px 0 0 19px;
  // background: linear-gradient(90deg, #FCDCB4 0%, #F4F5F7 100%);
  // background: linear-gradient(90deg, #FB810E 0%, #fff 100%);
  text-align: left;
  display: flex;
  overflow: hidden;
  line-height: 22px;
  box-sizing: border-box;
  position: relative;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
  .shoping {
    background: linear-gradient(270deg, rgba(255,165,134,0.1) 0%, #FFA747 34%, rgba(255,99,18,0.96) 100%);
    width: 100%;
    height: 36px;
    display: flex;
    align-items: center;
    padding-left: 6px;
    padding-right: 12px;
    .shopingIcon {
      width: 26px;
      height: 26px;
      // background: #FDB765;
      border-radius: 50%;
      margin-right: 6px;
    }
    .shopingText {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 17px;
    }
  }

  .shoped {
    width: 100%;
    background: linear-gradient(270deg, rgba(255,165,134,0.1) 0%, #FFA586 32%, rgba(255,52,52,0.96) 100%);
  }
  .yilingquyouhuiquan {
    padding-left: 12px;
    border-radius: 15px;
    border: 1px solid transparent;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image: linear-gradient(
        270deg,
        rgba(255, 255, 255, 0) 0%,
        #fff6f0 100%
      ),
      linear-gradient(270deg, rgba(255, 255, 255, 0), rgba(255, 214, 200, 1));
    border-radius: 16px 0px 0px 16px;
  }
}
::v-deep {
  .el-radio {
    margin-right: 18px;
  }
}
</style>
