<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    append-to-body
    custom-class="dialog-body"
    :show-close="false"
    :close-on-click-modal="false"
    :press-escape="false"
    top="10vh"
    width="900px"
    height="420px"
  >
    <div slot="title" class="ss-material-box-header">
      <div>{{ title }}</div>
      <!-- <i class="el-icon-close close" @click="close()" /> -->
    </div>
    <div :style="{width: '900px', height: '420px'}">
      <div class="choose_resource">
        <div class="window-search">
          <span class="m-r-10">上传到: </span>
          <AppTreeSelect v-model="form.name" :data="treeSelectData" @change="(e) => form.id = e" />
        </div>
        <div class="window-list">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            :accept="accept"
            action="#"
            multiple
            :limit="limit"
            :http-request="fileChange"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-exceed="onExceed"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__text m-t-10">{{ tips }}</div>
          </el-upload>

          <div class="audioBox">
            <el-table :data="fileList" style="width: 100%">
              <el-table-column prop="materialName" label="文件名" width="180">
                <template slot-scope="scope">
                  <div>
                    <div v-if="type === 1" class="fl fl_ai_c">
                      <div v-if="scope.row.materialUrl" class="videoImg">
                        <ImagePreviewer class="img-previewer" :src="scope.row.materialUrl" alt="" />
                      </div>
                      <span class="m-l-10 text_hidden" :title="scope.row.file.name">{{ scope.row.file.name }}</span>
                    </div>
                    <span v-else class="m-l-10 text_hidden" :title="scope.row.file.name">{{ scope.row.file.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="percent" label="进度">
                <template slot-scope="scope">
                  <el-progress :percentage="scope.row.authProgress" />
                </template>
              </el-table-column>
              <el-table-column prop="percent" label="状态" width="180">
                <template slot-scope="scope">
                  <span>{{ statusText[scope.row.status] }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.status === 8" type="text" style="color: red" @click="del(scope.row, scope.$index)">删除</el-button>
                  <el-button v-if="scope.row.status === 1" type="text" style="color: #E6A23C" @click="cancelRequest(scope.row, scope.$index)">取消上传</el-button>
                  <!-- <el-button v-if="scope.row.status === 3" type="text" style="color: #E6A23C" @click="resumeUpload(scope.row, scope.$index)">恢复上传</el-button> -->
                  <el-button v-if="scope.row.status === 4" type="text" style="color: #E6A23C" @click="againUpload(scope.row, scope.$index)">重新上传</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="ss-material-box-bottom">
      <el-button @click="clearSuccess">清除成功记录</el-button>
      <el-button @click="allAglinUp">重新上传</el-button>
      <!-- <el-button type="primary" :disabled="sureLoading" @click="successFn()">确定</el-button> -->
      <el-button @click="close()">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import AppTreeSelect from '@/components/AppTreeSelect'
// import { getOssToken, refreshVideo } from '@/api/file'
import { uploadImg, uploadFile } from '@/api/file'
import { material } from '@/api/course'
import axios from 'axios'
export default {
  components: {
    AppTreeSelect
  },
  props: {
    beforeUpload: {
      type: Function,
      default: () => {
        return () => {}
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择'
    },
    treeSelectData: {
      type: Array,
      default: () => {
        return []
      }
    },
    accept: {
      type: String,
      default: '*'
    },
    success: {
      type: Function,
      default: () => {
        return () => {}
      }
    },
    // 上传类型: 1: 图片 2: 文件
    type: {
      type: Number,
      default: 1
    },
    // 当前分组的id
    form: {
      type: Object,
      default: () => {
        return {
          name: '',
          id: ''
        }
      }
    },
    tips: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 100
    },
    api: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      startUpload: false,
      search: '',
      fileList: [],
      statusText: {
        0: '等待上传',
        1: '上传中',
        2: '上传成功',
        3: '暂停上传',
        4: '上传失败',
        5: '解析中',
        6: '文件处理',
        7: '已删除',
        8: '添加成功',
        9: '上传失败',
        10: '解析失败'
      },
      CancelToken: axios.CancelToken,
      sureLoading: false
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.init()
        }
      },
      deep: true,
      immediate: true
    },
    fileList: {
      handler(val) {
        console.log(val, 'val')
        // const arr = val.filter(v => v.status === 1 || v.status === 5 || v.status === 0) // 还在上传或者解析的数组
        // this.sureLoading = arr.length > 0

        const uploadArr = val.filter(v => v.status === 1) // 上传中的数组
        if (uploadArr.length < 1) {
          const index = val.findIndex(v => v.status === 0)
          if (index > -1) {
            this.uploadStart(this.fileList[index])
          }
        }
        // const waitArr = val.filter(v => v.status === 6) // 等待上传的数组
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init() {
      this.fileList = []
      this.startUpload = false
      this.$refs.upload && this.$refs.upload.clearFiles()
    },
    successFn() {
      if (!this.form.id) {
        return this.$message.error('请先选择分组')
      }
      console.log(this.fileList)
      const arr = this.fileList.filter(v => v.status === 2)
      const res = []
      arr.map(v => {
        res.push({
          dirId: this.form.id,
          materialDes: v.materialDes,
          materialFrameUrl: v.materialFrameUrl,
          materialName: v.file.name,
          materialSize: v.file.size,
          materialType: this.type === 1 ? 0 : 4, // type1为图片2为文件
          materialUrl: v.materialUrl
        })
      })
      this.success && this.success(res, this.form)
      this.visible = false
    },
    fileChange(e) {
      console.log(e)
      const _this = this
      const selectFile = e.file
      if (!this.form.id) {
        return this.$message.error('请先选择分组')
      }
      if (!selectFile) {
        alert('请先选择需要上传的文件!')
        return
      }
      this.fileList.push({
        ...this.config,
        file: selectFile,
        materialType: this.type === 1 ? 0 : 4,
        status: 5,
        dirId: this.form.id
      })
      const index = this.fileList.length - 1
      const self = this.fileList[index]
      if (_this.type === 1) {
        // 图片上传
        const formData = new FormData()
        formData.append('file', selectFile)
        var reader = new FileReader()
        reader.readAsDataURL(selectFile)
        reader.onload = function(theFile) {
          var image = new Image()
          image.src = theFile.target.result
          console.log('解析的图片url', image.src)
          image.onload = function() {
            console.log('解析完成')
            self.status = 0
            self.materialDes = `${this.width || 0}*${this.height || 0}`
            self.source = _this.CancelToken.source()
            self.authProgress = 0
            self.materialName = selectFile.name
            self.materialSize = selectFile.size
            self.formData = formData
          }
        }
      } else if (_this.type === 2) {
        // 文件上传
        const formData = new FormData()
        formData.append('file', selectFile)
        var fileExtension = selectFile.name.split('.').pop().toLowerCase()
        self.formData = formData
        self.materialDes = fileExtension
        self.source = _this.CancelToken.source()
        self.status = 0
        // return _this.uploadStart(self)
      }
    },
    close() {
      this.visible = false
      this.success(this.form)
      // this.success && this.success()
    //   this.$emit('input', false)
    },
    // 取消上传
    cancelRequest(row) {
      row.source.cancel('cancel')
      row.status = 4
    },
    // 暂停上传
    pauseUpload(row, index) {
      if (row.uploader !== null) {
        row.uploader.stopUpload()
        row.resumeDisabled = false
        row.pauseDisabled = true
      }
    },
    // 恢复上传
    resumeUpload(row, index) {
      if (row.uploader !== null) {
        row.uploader.resumeFile()
        row.resumeDisabled = true
        row.pauseDisabled = false
      }
    },
    // 删除
    del(row, index) {
      row.source.cancel('cancel')
      this.fileList.splice(index, 1)
    },
    // 重新上传
    againUpload(row, index) {
      row.status = 1
      row.authProgress = 0
      row.source = this.CancelToken.source()
      const that = this
      console.log(row, 'row')
      if (that.type === 1) {
        // 图片上传
        console.log('图片上传')
        uploadImg(row.formData,
          (progressEvent) => {
            const authProgress = (progressEvent.loaded / progressEvent.total * 100) | 0
            // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
            if (authProgress === 100) {
              row.authProgress = 99
            } else {
              row.authProgress = authProgress
            }
          },
          row.source.token
        ).then(res => {
          row.status = 2
          row.materialUrl = res.data.url
          row.authProgress = 100
          this.uploadStart(row)
        }).catch(() => {
          row.status = 4
        })
      } else {
        // 文件上传
        console.log('文件上传')
        uploadFile(row.formData,
          (progressEvent) => {
            const authProgress = (progressEvent.loaded / progressEvent.total * 100) | 0
            // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
            if (authProgress === 100) {
              self.authProgress = 99
            } else {
              self.authProgress = authProgress
            }
          },
          self.source.token
        ).then(res => {
          self.status = 2
          self.materialUrl = res.data.url
          self.authProgress = 100
          this.uploadStart(row)
        }).catch(() => {
          self.status = 4
        })
      }
      // return uploadFile(row.formData,
      //   (progressEvent) => {
      //     const percent = (progressEvent.loaded / progressEvent.total * 100) | 0
      //     // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
      //     if (percent === 100) {
      //       this.fileList[index].percent = 99
      //     } else {
      //       this.fileList[index].percent = percent
      //     }
      //   },
      //   this.fileList[index].source.token
      // ).then(res => {
      //   if (res.data) {
      //     this.fileList[index].percent = 100
      //     that.fileList[index].materialUrl = res.data.url
      //     that.fileList[index].statue = '已完成'
      //   }
      // }).catch(() => {
      //   that.fileList[index].statue = '失败'
      //   // this.removeImg(index)
      // })
    },
    // 上传
    // eslint-disable-next-line vue/no-dupe-keys
    uploadStart(self) {
      self.status = 1
      if (this.type === 1) {
        return uploadImg(self.formData,
          (progressEvent) => {
            const authProgress = (progressEvent.loaded / progressEvent.total * 100) | 0
            // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
            if (authProgress === 100) {
              self.authProgress = 99
            } else {
              self.authProgress = authProgress
            }
          },
          self.source.token
        ).then(res => {
          console.log(res, '添加分组成功')
          self.status = 2
          self.materialUrl = res.data.url
          self.authProgress = 100
          const list = [{
            dirId: self.dirId,
            materialDes: self.materialDes,
            materialFrameUrl: self.materialFrameUrl,
            materialName: self.file.name,
            materialSize: self.file.size,
            materialType: this.type === 1 ? 0 : 4, // type1为图片2为文件
            materialUrl: self.materialUrl
          }]
          console.log('1231234121')
          this.sureSend(list, self)
          return res
        }).catch(() => {
          self.status = 4
        })
      } else {
        return uploadFile(self.formData,
          (progressEvent) => {
            const percent = (progressEvent.loaded / progressEvent.total * 100) | 0
            // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
            if (percent === 100) {
              self.percent = 99
            } else {
              self.percent = percent
            }
          },
          self.source.token
        ).then(res => {
          console.log(res, '添加分组成功')
          if (res.data) {
            self.status = 2
            self.materialUrl = res.data.url
            self.authProgress = 100
          }
          const list = [{
            dirId: self.dirId,
            materialDes: self.materialDes,
            materialFrameUrl: self.materialFrameUrl,
            materialName: self.file.name,
            materialSize: self.file.size,
            materialType: this.type === 1 ? 0 : 4, // type1为图片2为文件
            materialUrl: self.materialUrl
          }]
          this.sureSend(list, self)
          console.log('123123')
          return res
        }).catch(() => {
          self.status = 4
        })
      }
    },

    // 文件上传成功之后，将文件上传到我们的服务器
    sureSend(list, self) {
      console.log('12312341211231231')
      if (this.api) {
        this.api({
          'image': list[0].materialUrl,
          'name': list[0].materialName,
          'teacherId': list[0].dirId
        }).then(res => {
          self.status = 8
        }).catch(() => {
          self.status = 9
          this.loading = false
        })
      } else {
        this.loading = true
        const param = {
          list: list
        }
        material(param).then(res => {
          console.log(res, 'res')
          self.status = 8
        // this.$notify({
        //   title: '上传成功',
        //   type: 'success',
        //   message: `文件【${list[0].materialName}】上传成功`
        // })
        // this.getList()
        }).catch(() => {
          self.status = 9
          this.loading = false
        })
      }
    },
    aglinSureUp(row, index) {
      this.loading = true
      const list = [{
        dirId: row.dirId,
        materialDes: row.materialDes,
        materialFrameUrl: row.materialFrameUrl,
        materialName: row.file.name,
        materialSize: row.file.size,
        materialType: row.materialType,
        materialUrl: process.env.VUE_APP_UPLOAD_URL + row.uploadInfo.object,
        videoId: row.uploadInfo.videoId
      }]
      const param = {
        list: list
      }
      material(param).then(res => {
        console.log(res, 'res')
        self.status = 8
        this.$notify({
          title: '上传成功',
          type: 'success',
          message: `文件${list[0].materialName}上传成功`
        })
        // this.getList()
      }).catch(() => {
        self.status = 9
        this.loading = false
      })
    },
    clearSuccess() {
      console.log('清除成功记录')
      this.fileList = this.fileList.filter(v => v.status !== 8)
      // this.$set(this, 'fileList', arr)
    },
    allAglinUp() {
      console.log('重新上传', this.fileList)
      this.fileList.map((v, i) => {
        if (v.status !== 8 && v.status !== 10 && v.status !== 0 && v.status !== 2) {
          this.againUpload(v, i)
        }
      })
      console.log('重新上传', this.fileList)
      // const arr = this.fileList.filter(v => v.status !== 10)
      // this.fileList = this.fileList.concat(arr)
    },
    onExceed() {
      this.$message.error('文件上传个数超过限制')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
    .dialog-body {
        position: relative;
        width: 900px;
        flex: none;
        display: flex;
        flex-direction: column;
        vertical-align: middle;
        text-align: initial;
        background: #fff;
        border-radius: 2px;
        overflow: hidden;
        .el-dialog__header {
            padding: 0;
            padding-bottom: 0;
        }
        .el-dialog__body {
            padding: 0;
        }
        .ss-material-box-header {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        height: 52px;
        padding: 15px 20px;
        background: #fafbfc;
        border-radius: 2px 2px 0 0;
        border-bottom: 1px solid #f2f2f2;
        color: #353535;
        font-size: 16px;
        font-weight: 500;
        }
        .close {
        color: #b2b2b2;
        margin-left: auto;
        cursor: pointer;
        &:hover {
            color: #409eff;
        }
        }
        .ss-material-box-bottom {
            padding: 20px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-top: auto;
            width: 100%;
            height: 66px;
            background-color: #fafbfc;
            border-radius: 2px 2px 0 0;
        }
    }
}

  .choose_resource {
    .window-search {
      position: relative;
      height: 36px;
      line-height: 36px;
      margin: 20px 20px 10px 20px;
      display: flex;
    }
    .window-list{
      width: 100%;
      height: 376px;
      overflow-y: scroll;
      padding: 0 20px;
      position: relative;

      &::-webkit-scrollbar {
          width: 8px;
          height: 10px;
          background-color: rgba(0,0,0,0);
      }

      &::-webkit-scrollbar-thumb {
          border-radius: 6px;
          background-color: rgba(0,0,0,.2);
          transition: all .4s ease;
          -moz-transition: all .4s ease;
          -webkit-transition: all .4s ease;
          -o-transition: all .4s ease;
      }
      &::-webkit-scrollbar-track {
          background-color: rgba(0,0,0,.1);
      }
      .upload-demo {
        width: 100%;
        ::v-deep  .el-upload {
            width: 100%;
            .el-upload-dragger {
            width: 100%;
            }
        }
    }
    }
  }
  .videoImg {
      width: 80px;
      height: 60px;
      min-width: 80px;
      max-width: 80px;
      object-fit: contain;
      cursor: pointer;
      > .img-previewer {
          width: 100%;
          height: 100%;
      }
    }
</style>
