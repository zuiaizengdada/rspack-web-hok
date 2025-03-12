<template>
  <!-- 选中图片之后可以删除，裁剪图片组件 -->
  <div
    v-loading="loading"
    class="AppMyImage"
    :class="mClass"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
    element-loading-text="上传中"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <ImagePreviewer style="width: 100%;height: 100%" :src="src" :fit="fit" />

    <div v-show="show && !loading" class="mask">
      <div class="mask_box">
        <div v-if="!noDel" class="mask_box_header"><i class="el-icon-delete" @click="close()" /></div>
        <div v-else class="mask_box_header" />
        <div v-if="!noCropper" class="mask_box_footer" @click="cropper()">裁剪</div>
      </div>
    </div>
  </div>
</template>

<script>
import { blobToBase64 } from '@/utils'
import { imgBase64 } from '@/api/course'
export default {
  props: {
    fit: {
      type: String,
      default: 'contain'
    },
    src: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => {
        return {
          width: 300,
          fixed: true,
          option: {
            fixed: true,
            fixedNumber: [1, 1],
            fixedBox: false
          }
        }
      }
    },
    noDel: {
      type: Boolean,
      default: false
    },
    mClass: {
      type: String,
      default: ''
    },
    noCropper: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      loading: false
    }
  },
  methods: {
    // 鼠标移出
    mouseleave() {
      this.show = false
    },
    // 鼠标移入
    mouseenter() {
      this.show = true
    },
    close() {
      this.$emit('close')
    },
    cropper() {
      const that = this
      this.$AppImageCropper({
        visible: true,
        url: this.src,
        title: '裁剪图片',
        width: 300,
        fixed: this.options.fixed,
        option: this.options.option,
        success: (data) => {
          that.loading = true
          // 图片上传
          blobToBase64(data).then(res => {
            return imgBase64({ base64Data: res })
          }).then(res => {
            console.log(res)
            if (res.data && res.data.url) {
              that.$emit('success', res.data.url)
            }
            that.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.AppMyImage {
    width: 100px;
    height: 100px;
    position: relative;
    border: 1px dashed #e0e0e0;
    background: #f5f5f5;
    border-radius: 4px;
    .cropper-mask {
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        color: #fff;
        background: transparent;
        border-radius: 4px;
        overflow: hidden;
        .croper-btn {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.7);
            cursor: pointer;
        }
    }
    .mask {
      position: absolute;
      left: 0;
      bottom: 0;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      color: #fff;
      background: rgba(63, 59, 64, 0.58);
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      .mask_box {
        // position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .mask_box_header {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: red;
          cursor: pointer;
        }
        .mask_box_footer {
            // position: absolute;
            // left: 0;
            // bottom: 0;
            width: 100%;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.7);
            cursor: pointer;
        }
      }
      .myIcon {
        // color: #999;
        // position: absolute;
        // top: -8px;
        // right: -8px;
        cursor: pointer;
        &:hover {
          color: red;
        }
    }
    }
}
.el-icon-delete {
  font-size: 24px;
}
</style>
