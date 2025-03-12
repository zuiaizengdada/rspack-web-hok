<template>
  <div class="uploadView">
    <el-upload
      action="#"
      accept="image/png,image/jpg,image/jpeg,.pdf"
      :http-request="upload"
      :show-file-list="false"
      :multiple="multiple"
      drag
      :file-list="fileList"
      :limit="limit"
      style="margin-right: 20px"
      :on-exceed="onExceed"
      :before-upload="beforeAvatarUpload"
    >
      <div class="upload_image_poster">
        <i class="el-icon-plus addimag_icon" />
        <span>点击上传附件</span>
      </div>
    </el-upload>
    <template v-for="(item, index) in fileList">
      <div
        v-if="(fileList.length >= maxShowLength - 1 && showMore) || index < maxShowLength - 1"
        :key="`image_${index}`"
        class="image_poster_box"
      >
        <template v-if="index < maxShowLength">
          <div v-if="item.status === 1" class="image_poster">
            <div>
              <div>上传中...</div>
              <el-progress :show-text="false" :percentage="item.authProgress" />
            </div>
          </div>
          <div
            v-else-if="item.status === 2"
            class="image_poster"
            @mouseenter="item.alignUploadShow = true"
            @mouseleave="item.alignUploadShow = false"
          >
            <i class="el-icon-error" style="color: #f53f3f; font-size: 24px" />
            <div class="addimag_icon_error">上传失败</div>
            <!-- 重新上传按钮 -->
            <transition name="slide">
              <div v-if="item.alignUploadShow" class="alignUploadShow" @click="alignUpload(item, index)">
                <svg-icon icon-class="alignUploadShow" class="alignUploadIcon" />
                <div>重新上传</div>
              </div>
            </transition>
          </div>
          <div v-else-if="item.status === 3" class="image_poster">
            <imgShow :url="item.photoUrl" style="width: 100%; height: 100%" />
          </div>
          <i v-if="item.status === 3 || item.status === 2" class="del el-icon-error" @click="delFile(item, index)" />
        </template>
        <template v-if="index >= maxShowLength && showMore">
          <div v-if="item.status === 1" class="image_poster">
            <div>
              <div>图片上传中...</div>
              <el-progress :show-text="false" :percentage="item.authProgress" />
            </div>
          </div>
          <div
            v-else-if="item.status === 2"
            class="image_poster"
            @mouseenter="item.alignUploadShow = true"
            @mouseleave="item.alignUploadShow = false"
          >
            <i class="el-icon-error" style="color: #f53f3f; font-size: 24px" />
            <div class="addimag_icon_error">上传失败</div>
            <!-- 重新上传按钮 -->
            <transition name="slide">
              <div v-if="item.alignUploadShow" class="alignUploadShow" @click="alignUpload(item, index)">
                <svg-icon icon-class="alignUploadShow" class="alignUploadIcon" />
                <div>重新上传</div>
              </div>
            </transition>
          </div>
          <div v-else-if="item.status === 3" class="image_poster">
            <imgShow :url="item.photoUrl" style="width: 100%; height: 100%" />
          </div>
          <i v-if="item.status === 3" class="del el-icon-error" @click="delFile(item, index)" />
        </template>
      </div>
    </template>
    <div v-if="fileList.length > maxShowLength && !showMore" class="image_poster_box">
      <div class="iconview" @click="showMore = true">
        <svg-icon icon-class="gengduo" />
        <span class="iconText">查看更多</span>
      </div>
    </div>
    <div v-if="fileList.length > maxShowLength && showMore" class="image_poster_box">
      <div class="iconview" @click="showMore = false">
        <svg-icon icon-class="shouqi" />
        <span class="iconText">点击收起</span>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadImg, uploadFile } from '@/api/file'
import imgShow from './imgShow.vue'
import axios from 'axios'
export default {
  components: {
    imgShow
  },
  props: {
    maxShowLength: {
      type: Number,
      default: 5
    },
    // eslint-disable-next-line vue/require-default-prop
    limit: {
      type: Number
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 文件上传状态status 0: 未开始上传 1: 文件上传中 2: 文件上传失败 3: 文件上传成功
      // 文件类型fileType: 0[jpg] 1[png] 2[pdf]
      fileList: [],
      CancelToken: axios.CancelToken,
      showMore: false
    }
  },
  mounted() {},
  methods: {
    // 点击上传图片
    upload(e) {
      console.log(e, '上传文件')
      const _this = this
      if (!e) {
        return
      }
      const selectFile = e.file
      var fileExtension = e.file.name.split('.').pop().toLowerCase()
      const formData = new FormData()
      formData.append('file', selectFile)
      const obj = {
        file: selectFile,
        name: `${this.$getUuiD(10)}.${this.$getFileType(selectFile.name).suffix}`,
        status: 1,
        authProgress: 0,
        photoUrl: '',
        fileType: '',
        source: this.CancelToken.source(),
        alignUploadShow: false
      }
      this.fileList.push(obj)
      this.$emit('change', this.fileList)
      const index = this.fileList.length - 1
      const self = this.fileList[index]
      if (['png', 'jpg'].includes(fileExtension)) {
        // 图片上传
        uploadImg(
          formData,
          (progressEvent) => {
            const authProgress = ((progressEvent.loaded / progressEvent.total) * 100) | 0
            // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
            if (authProgress === 100) {
              self.authProgress = 99
            } else {
              self.authProgress = authProgress
            }
          },
          self.source.token
        )
          .then((res) => {
            self.authProgress = 100
            self.status = 3
            self.photoUrl = res.data.url
            this.$emit('change', _this.fileList)
          })
          .catch(() => {
            console.log('失败')
            self.status = 2
          })
      } else {
        // 文件上传
        uploadFile(
          formData,
          (progressEvent) => {
            const authProgress = ((progressEvent.loaded / progressEvent.total) * 100) | 0
            // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
            if (authProgress === 100) {
              self.authProgress = 99
            } else {
              self.authProgress = authProgress
            }
          },
          self.source.token
        )
          .then((res) => {
            self.authProgress = 100
            self.status = 3
            self.photoUrl = res.data.url
            const fileList = []
            _this.fileList.map((v) => {
              v.status === 3 && fileList.push(v)
            })
            this.$emit('change', fileList)
          })
          .catch(() => {
            console.log('失败')
            self.status = 2
          })
      }
    },
    // 点击重新上传
    alignUpload(item, index) {
      const _this = this
      const self = this.fileList[index]
      const formData = new FormData()
      self.authProgress = 0
      self.status = 1
      formData.append('file', self.file)
      var fileExtension = self.file.name.split('.').pop().toLowerCase()
      if (['png', 'jpg'].includes(fileExtension)) {
        uploadImg(
          formData,
          (progressEvent) => {
            const authProgress = ((progressEvent.loaded / progressEvent.total) * 100) | 0
            // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
            if (authProgress === 100) {
              self.authProgress = 99
            } else {
              self.authProgress = authProgress
            }
          },
          self.source.token
        )
          .then((res) => {
            self.authProgress = 100
            self.status = 3
            self.photoUrl = res.data.url
            this.$emit('change', _this.fileList)
          })
          .catch(() => {
            console.log('失败')
            self.status = 2
          })
      } else {
        // 文件上传
        uploadFile(
          formData,
          (progressEvent) => {
            const authProgress = ((progressEvent.loaded / progressEvent.total) * 100) | 0
            // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
            if (authProgress === 100) {
              self.authProgress = 99
            } else {
              self.authProgress = authProgress
            }
          },
          self.source.token
        )
          .then((res) => {
            self.authProgress = 100
            self.status = 3
            self.photoUrl = res.data.url
            this.$emit('change', _this.fileList)
          })
          .catch(() => {
            console.log('失败')
            self.status = 2
          })
      }
    },
    beforeAvatarUpload(file) {
      var fileExtension = file.name.split('.').pop().toLowerCase()
      if (['png', 'jpg'].includes(fileExtension)) {
        const isLt5M = file.size / 1024 / 1024 < 10
        if (!isLt5M) {
          this.$message.error('png,jpg大小限10M以内')
        }
        return isLt5M
      } else if (['pdf'].includes(fileExtension)) {
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) {
          this.$message.error('PDF文件50M以内')
        }
        return isLt50M
      } else {
        this.$message.error('请选择png,jpg,pdf类型的文件')
        return false
      }
    },
    // 删除
    delFile(item, index) {
      this.fileList.splice(index, 1)
      this.$emit('change', this.fileList)
    },
    setFileList(fileList) {
      this.fileList = fileList
      console.log(this.fileList, 'fileList')
    },
    onExceed() {
      this.$message.error('文件上传个数超过限制')
    },
    // 获取是否还有正在上传的文件
    getUploadFile() {
      const index = this.fileList.findIndex((v) => v.status === 1)
      return index > -1
    }
  }
}
</script>

<style lang="scss" scoped>
.uploadView {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.upload_image_poster {
  position: relative;
  width: 120px;
  height: 90px;
  // background: #FFFFFF;
  background: #fbfcfe;
  border-radius: 4px;
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
  margin-right: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  overflow: hidden;
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
.image_poster_box {
  position: relative;
  width: 120px;
  height: 90px;
  margin-right: 20px;
  margin-bottom: 20px;
  .del {
    position: absolute;
    right: -6px;
    top: -6px;
    color: #686664;
    cursor: pointer;
  }
  .iconview {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #fafafa;
    font-size: 24px;
    cursor: pointer;
    .iconText {
      margin-top: 8px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #0c6fff;
      line-height: 20px;
    }
  }
  .image_poster {
    position: relative;
    width: 120px;
    height: 90px;
    background: #ffffff;
    border-radius: 4px;
    background: #fafafa;
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
    margin-right: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    overflow: hidden;
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
::v-deep {
  .el-upload-dragger {
    width: 120px;
    height: 90px;
  }
}
</style>
