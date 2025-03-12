<template>
  <!-- 上传弹框 -->
  <div class="upload">
    <el-upload
      v-show="fileList.length < limit"
      ref="upload"
      class="uploadView m-r-16"
      action="#"
      :limit="limit"
      accept=".jpg,.png,.jpeg"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :http-request="upload"
      :show-file-list="false"
    >
      <slot>
        <div class="image-content-btn">
          <i class="el-icon-plus" style="font-weight: 600;" />
          <span>{{ `选择图片(${fileList.length}/8)` }}</span>
        </div>
      </slot>
    </el-upload>
    <el-form v-if="!hideItem && fileList.length" size="small" label-position="right" :model="{fileList}">
      <div class="image-content">
        <el-scrollbar :extrusion="true" :class="{'h-500':fileList.length >= 5}">
          <draggable
            :list="fileList"
            tag="div"
            draggable=".upload-item"
            v-bind="{
              animation:500 ,
              handle:'.icon_draggable',
            }"
            :move="handleMove"
          >
            <uploadItem
              v-for="(item, index) in fileList"
              :key="index"
              :index="index"
              :item.sync="fileList[index]"
              class="upload-item"
              :class="{'m-b-12':index !== fileList.length-1}"
              :status="item.status"
              :auth-progress="item.authProgress"
              :catalogue-list="catalogueList"
              @del="delFile(item, index)"
              @again="alignUpload(item, index)"
            />
          </draggable>
        </el-scrollbar>
      </div>
    </el-form>

  </div>
</template>

<script>
import { getFileType } from '@/utils/index'
import uploadItem from './uploadItem'
import { uploadImg, getOssConfig } from '@/api/file'
import axios from 'axios'
import draggable from 'vuedraggable'
import { getCatalogueList } from '@/api/shop'

export default {
  components: {
    uploadItem,
    draggable
  },
  props: {
    limit: {
      type: Number,
      default: 8
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    enum: {
      type: String,
      default: ''
    },
    hideItem: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ossConfig: {
        region: '',
        accessKeyId: '',
        accessKeySecret: '',
        secure: false,
        bucket: '',
        ossBucketUrl: '',
        ossEndPoint: ''
      },
      catalogueList: [],
      cancelToken: axios.CancelToken
    }
  },
  computed: {
    // 文件上传状态status 0: 未开始上传 1: 文件上传中 2: 文件上传失败 3: 文件上传成功
    // 文件类型fileType: audio[音频mp3/wav/aac/3pg/mar/wma] video[视频3pg/mp4/mov] img[图片jpg/png/jpeg/bmp]
    fileList: {
      set(val) {
        const fileList = val?.map(i => {
          return {
            url: i.url,
            jumpType: i.jumpType,
            value: i.value
          }
        })
        this.$emit('update:dataSource', fileList)
      },
      get() {
        return this.dataSource
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getCatalogueList()
      this.getOssConfig()
    },
    async getCatalogueList() {
      const { data } = await getCatalogueList()
      this.catalogueList = data
    },
    getOssConfig() {
      this.loading = true
      getOssConfig()
        .then((res) => {
          this.ossConfig = {
            region: 'oss-accelerate',
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            secure: true,
            bucket: res.data.ossBucket,
            ossBucketUrl: res.data.ossBucketUrl,
            ossEndPoint: res.data.ossEndPoint
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('获取oss配置失败')
          this.loading = false
        })
    },
    handleMove() {
      return true
    },
    handleExceed() {
      this.$message.error('文件数量超出限制')
    },
    beforeUpload(file) {
      const fileType = getFileType(file.name)
      if (fileType.fileType === 'img') {
        const isLt5M = file.size / 1024 / 1024 < 1
        !isLt5M && this.$message.error('上传图片大小不能超过1MB!')
        return isLt5M
      }
    },
    // 点击上传视频
    async upload(e) {
      this.$refs.upload.clearFiles()
      if (!e) {
        return
      }
      const selectFile = e.file
      if (!this.beforeUpload(selectFile)) {
        return
      }
      const formData = new FormData()
      formData.append('file', selectFile)
      this.fileList.push({
        file: selectFile,
        status: 1,
        source: this.cancelToken.source(),
        authProgress: 0,
        value: ''
      })
      const index = this.fileList.length - 1
      const self = this.fileList[index]
      var reader = new FileReader()
      reader.readAsDataURL(selectFile)
      reader.onload = (theFile) => {
        var image = new Image()
        image.src = theFile.target.result
        image.onload = async() => {
          try {
            const res = await uploadImg(formData,
              (progressEvent) => {
                const authProgress = (progressEvent.loaded / progressEvent.total * 100) | 0
                // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
                if (authProgress === 100) {
                  self.authProgress = 99
                } else {
                  self.authProgress = authProgress
                }
              },
              self.source.token)
            const url = res.data.url
            if (url) {
              this.$set(this.fileList, index, {
                ...this.fileList[index],
                status: 3,
                url,
                resourceUrl: res.data,
                authProgress: 100
              })
            } else {
              this.$set(this.fileList, index, {
                ...this.fileList[index],
                status: 2,
                authProgress: 100
              })
            }
            this.$emit('change', this.fileList)
          } catch (e) {
            this.$set(this.fileList, index, {
              ...this.fileList[index],
              status: 2,
              authProgress: 100
            })
          }
        }
      }
    },
    // 点击重新上传
    async alignUpload(item, index) {
      const self = this.fileList[index]
      this.fileList.splice(index, 1)
      await this.upload(self)
    },
    // 获取是否还有正在上传的文件
    getUploadFile() {
      const index = this.fileList.findIndex((v) => v.status === 1)
      return index > -1
    },
    // 点击删除
    delFile(item, index) {
      this.fileList.splice(index, 1)
    },
    // 设置fileList
    setFileList(arr) {
      this.fileList = arr
    },
    getFileList() {
      return this.fileList
    }
  }
}
</script>

<style lang='scss' scoped>
.image-content-btn{
  height: 40px;
  width: 490px;
  background: #F5F9FF;
  border-radius: 4px;
  border: 1px dashed #66A4FF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0C6FFF;
  font-size: 14px;
}
.m-b-12{
  margin-bottom: 12px;
}
.el-icon-plus {
  font-weight: 700;
  font-size: 14px;
  margin-right: 10px;
}
.image-content{
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
}
</style>
