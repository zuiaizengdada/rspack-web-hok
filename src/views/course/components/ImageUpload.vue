<template>
  <div>
    <div class="image-upload-container">
      <!-- <el-upload
        v-if="fileList.length < limit"
        action="#"
        list-type="picture-card"
        :limit="limit"
        :disabled="true"
        :accept="accept"
        drag
        :before-upload="beforeUpload"
        :http-request="upload"
        :show-file-list="false"
        @click="handleGetImgUrl"
      >
        <i class="el-icon-plus" />
      </el-upload> -->
      <div
        v-if="fileList.length < limit"
        class="image_poster"
        style="width: 150px;height: 150px"
        @click="handleGetImgUrl"
      >
        <i class="el-icon-plus" />
        <span>点击上传图片</span>
      </div>
      <draggable
        :list="fileList"
        tag="div"
        draggable=".draggle"
        class="upload-items"
        v-bind="{
          animation:500 ,
          handle:'.draggle',
        }"
        :move="handleMove"
      >
        <div v-for="(item, index) in fileList" :key="index" class="draggle">
          <ImagePreviewer
            class="el-upload-list__item-thumbnail"
            :src="item.materialUrl || item.coverUrl"
            fit="contain"
            :preview-src-list="[item.materialUrl || item.coverUrl]"
          />
          <div
            class="upload-delete"
          >
            <img src="@/assets/image/icon_close.png" alt="" @click="handleClose(index)" />
          </div>
        </div>
      </draggable>
    </div>
    <div class="tips m-t-20">
      <div v-for="item in tips" :key="item">{{ item }}</div>
    </div>
  </div>

</template>

<script>
import draggable from 'vuedraggable'
import { materialUpload } from '@/api/shop'
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
      const confine = this.confineUpload(file)
      if (!confine) return
    },
    async upload(e) {
      if (!e) {
        return
      }
      const selectFile = e.file
      const img = new Image()
      img.onload = () => {
        if (img.width !== img.height) {
          this.$message.error('必须上传1:1尺寸图片')
          return
        }
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
        success: (res) => {
          this.fileList = res.imageList.map(i => {
            return this.getImages(i)
          })
        }
      })
    },
    getImages(item) {
      const coverUrl = item.materialUrl || item.coverUrl
      const query = '?x-oss-process=image/format,webp&x-oss-process=image/resize,m_lfit,h_'
      return {
        coverUrl,
        materialUrl: item.materialUrl,
        materialId: item.materialId,
        big: coverUrl + query + '800',
        centre: coverUrl + query + '375',
        small: coverUrl + query + '170'
      }
    },
    async uploadImage(selectFile) {
      const formData = new FormData()
      formData.append('file', selectFile)
      const { data } = await materialUpload(formData)
      this.fileList.push({
        coverUrl: data.coverUrl,
        big: data.big + '?x-oss-process=image/format,webp',
        centre: data.centre + '?x-oss-process=image/format,webp',
        small: data.small + '?x-oss-process=image/format,webp'
      })
    },
    // 限制上传格式大小
    confineUpload(file) {
      const isLtG = file.size / 1024 / 1024 < this.isLt
      if (!isLtG) {
        this.$message.error(`上传图片大小不能超过 ${this.isLt}MB!`)
      }
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
.image-upload-container ::v-deep{
    display: flex;
    flex-wrap: wrap;
    min-height: 148px;
    .upload-items{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      max-width: 830px;
    }
    .el-upload-dragger{
      height: 148px !important;
      width: 148px !important;
    }
    .el-upload--picture-card{
      border: 0px;
    }
    .draggle{
      width: 148px;
      height: 148px;
      margin: 0 0 10px 10px;
      display: flex;
      cursor: move;
      position: relative;
      .upload-delete{
        position: absolute;
        top: -8px;
        right: -6px;
        height: 16px;
        width: 16px;
        cursor: pointer;
      }
    }
}
.image_poster {
  background: #F5F7FA;
  border-radius: 4px;
  border: 1px solid #DCDCDC;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  > span {
    margin-top: 13px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    line-height: 20px;
  }
  &:hover {
    border: 1px dashed #1472ff;;
  }
}
.tips {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
</style>
