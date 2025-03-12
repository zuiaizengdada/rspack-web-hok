<template>
  <div class="uploadItem">
    <div class="image_poster" :style="{width: width + 'px', height: height + 'px'}">
      <div v-if="status === 1">
        <div>上传中({{ authProgress }}%)</div>
      </div>
      <div
        v-else-if="status === 2"
        class="image_poster"
        :style="{width: width + 'px', height: height + 'px'}"
        @mouseenter="alignUploadShow = true"
        @mouseleave="alignUploadShow = false"
      >
        <i class="el-icon-error" style="color: #f53f3f; font-size: 24px" />
        <div class="addimag_icon_error">上传失败</div>
        <!-- 重新上传按钮 -->
        <transition name="slide">
          <div v-if="alignUploadShow" class="alignUploadShow">
            <svg-icon icon-class="alignUploadShow" class="alignUploadIcon" />
            <div class="pointer" @click="$emit('again')">重新上传</div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    // 0: 未开始上传 1: 文件上传中 2: 文件上传失败 3: 文件上传成功 4解析中 5.解析失败
    status: {
      type: Number,
      default: 1
    },
    errTips: {
      type: String,
      default: ''
    },
    authProgress: {
      type: Number,
      default: 0
    },
    url: {
      type: String,
      default: ''
    },
    beforeUpload: {
      type: Function,
      default: () => {}
    },
    accept: {
      type: String,
      default: '*'
    },
    width: {
      type: [Number, String],
      default: ''
    },
    height: {
      type: [Number, String],
      default: ''
    },
    uploadShowArr: {
      type: Array,
      default: () => {
        return ['重新上传', '删除']
      }
    }
  },
  data() {
    return {
      alignUploadShow: false
    }
  },
  mounted() {},
  methods: {
    upload(e) {
      this.$refs.upload && this.$refs.upload.clearFiles()
      this.$emit('upload', e)
    }
  }
}
</script>

<style lang='scss' scoped>
.uploadItem {
  position: relative;
  .image_poster {
    width: 100px;
    height: 100px;
    background: #ffffff;
    border-radius: 50%;
    background: #fafafa;
    text-align: center;
    // border: 1px dashed #DCDCDC;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0c6fff;
    line-height: 20px;
    overflow: hidden;
    position: relative;
    .addimag_icon {
      font-size: 18px;
      margin-bottom: 13px;
    }
    &:hover {
      border-color: #0c6fff;
    }
    .addimag_icon_error {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #f53f3f;
      line-height: 22px;
    }
    .alignUploadShow {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 2;
      background: #fbfcfe;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .alignUploadIcon {
        font-size: 24px;
      }
    }
  }
  .del {
    position: absolute;
    right: -6px;
    top: -6px;
    color: #686664;
    cursor: pointer;
    font-size: 16px;
    z-index: 2;
  }
}
.slide-enter-active {
  animation-name: slideInUp;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
.slide-leave-active {
  animation-name: slideOutDown;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
@keyframes slideInUp {
  0% {
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translateZ(0);
  }
}
@keyframes slideOutDown {
  0% {
    transform: translateZ(0);
  }

  to {
    visibility: hidden;
    transform: translate3d(100%, 0, 0);
  }
}
.delay-leave-active {
  -webkit-animation-delay: 0.2s;
  -moz-animation-delay: 0.2s;
  -o-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
</style>
