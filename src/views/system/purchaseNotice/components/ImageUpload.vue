<template>
  <div class="flex flex-middle">
    <div class="image-upload-container">
      <el-upload
        v-if="fileList.length < limit"
        action="#"
        list-type="picture-card"
        :limit="limit"
        :accept="accept"
        drag
        :before-upload="beforeUpload"
        :http-request="upload"
        :show-file-list="false"
      >
        <div class="image_poster">
          <i class="el-icon-plus" />
          <span>上传</span>
        </div>
      </el-upload>
      <draggable
        :list="fileList"
        tag="div"
        draggable=".draggle"
        class="upload-items"
        v-bind="{
          animation: 500,
          handle: '.draggle'
        }"
        :move="handleMove"
      >
        <div v-for="(item, index) in fileList" :key="index" class="draggle">
          <ImagePreviewer
            class="el-upload-list__item-thumbnail"
            :src="item.coverUrl"
            fit="contain"
          />
          <div class="upload-delete">
            <img
              src="@/assets/image/icon_close.png"
              alt=""
              @click="handleClose(index)"
            />
          </div>
        </div>
      </draggable>
    </div>
    <div>
      <div class="text">上传1张格式为jpg,jpeg,png,</div>
      <div class="text">大小不超50k的图片</div>
    </div>
    <div class="tips m-t-20">
      <div v-for="item in tips" :key="item">{{ item }}</div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { uploadImg } from '@/api/file'
export default {
  name: 'ImageUpload',
  components: {
    draggable
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    limit: {
      type: Number,
      default: 1
    },
    accept: {
      type: String,
      default: '.jpg,.png,.jpeg'
    },
    isLt: {
      type: Number,
      default: 5
    },
    value: {
      type: Array,
      default: () => []
    },
    tips: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      show: false,
      loading: false
    }
  },
  computed: {
    fileList: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
  methods: {
    beforeUpload(file, fileList) {
      console.log(file)
      const isImage = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
      const isLt = this.confineUpload(file)
      if (!isImage) {
        this.$message.error('上传图片只能是 jpg、png、jpeg 格式!')
        return false
      }
      if (!isLt) {
        this.$message.error(`上传图片大小不能超过50KB!`)
        return false
      }
      return
    },
    async upload(e) {
      if (!e) {
        return
      }
      const selectFile = e.file
      const img = new Image()
      img.onload = () => {
        this.uploadImage(selectFile)
      }
      img.src = URL.createObjectURL(selectFile)
    },
    handleGetImgUrl() {
      this.$SelectMaterialMultiple({
        visible: true,
        types: [0],
        type: 'imageView',
        imageList: this.fileList,
        max: this.limit,
        maxSize: this.isLt * 1024 * 1024,
        success: res => {
          this.fileList = res.imageList.map(i => {
            return this.getImages(i)
          })
        }
      })
    },
    getImages(item) {
      const coverUrl = item.materialUrl
      return {
        coverUrl
      }
    },
    async uploadImage(selectFile) {
      const formData = new FormData()
      formData.append('file', selectFile)
      const { data } = await uploadImg(formData)
      this.fileList.push({
        coverUrl: data.url
      })
    },
    // 限制上传格式大小
    confineUpload(file) {
      const isLtG = file.size / 1024 / 1024 < this.isLt
      return isLtG
    },
    handleMove() {
      return true
    },
    handleClose(index) {
      this.fileList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.image-upload-container ::v-deep {
  display: flex;
  flex-wrap: wrap;
  .upload-items {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    max-width: 830px;
  }
  .el-upload-dragger {
    height: 60px !important;
    width: 60px !important;
    border: 0px;
  }
  .el-upload--picture-card {
    border: 0px;
    height: 60px !important;
    width: 60px !important;
  }
  .draggle {
    width: 60px;
    height: 60px;
    margin: 0 0 10px 10px;
    display: flex;
    cursor: move;
    position: relative;
    .upload-delete {
      position: absolute;
      top: -8px;
      right: -6px;
      height: 16px;
      width: 16px;
      cursor: pointer;
    }
  }
}
.el-upload--picture-card i {
  color: #0c6fff;
  font-size: 14px;
}
.image_poster {
  background: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 100%;
  color: #0c6fff;
  i {
    font-weight: 600;
  }
  > span {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 20px;
  }
}
.text {
  height: 20px;
  margin-left: 10px;
  color: #999999;
  line-height: 20px;
}
.tips {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
</style>
