<template>
  <div class="uploadItem">
    <div class="image_poster">
      <div v-if="status === 1">
        <div>上传中({{ authProgress }}%)</div>
        <el-progress :show-text="false" :percentage="authProgress" />
      </div>
      <div
        v-else-if="status === 2"
        class="image_poster"
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
      <div v-else class="image_poster">
        <uploadShow :url="url" style="width: 100%; height: 100%" />
      </div>
    </div>
    <i class="del el-icon-error" @click="handleDel" />
  </div>
</template>

<script>
import uploadShow from './uploadShow.vue'
export default {
  components: {
    uploadShow
  },
  props: {
    // 0: 未开始上传 1: 文件上传中 2: 文件上传失败 3: 文件上传成功
    status: {
      type: Number,
      default: 1
    },
    authProgress: {
      type: Number,
      default: 0
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      alignUploadShow: false
    }
  },
  mounted() {},
  methods: {
    handleDel() {
      this.$delModal({
        tips: `是否确定操作?`,
        success: () => {
          this.$emit('del')
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.uploadItem {
  position: relative;
  .image_poster {
    width: 160px;
    height: 120px;
    background: #ffffff;
    border-radius: 4px;
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
