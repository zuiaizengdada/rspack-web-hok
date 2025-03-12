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
    width="700px"
    height="600px"
  >
    <div slot="title" class="ss-material-box-header">
      <div>{{ title }}</div>
    </div>
    <div :style="{}" class="OSSUpload">
      <el-upload
        ref="upload"
        class="upload-demo"
        accept="video/mp4,video/ogg,video/flv,video/avi,video/wmv,video/rmvb,video/mov"
        :http-request="fileChange"
        drag
        action="#"
        :show-file-list="false"
        :headers="{
          'Authorization': getToken
        }"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传mp4、avi、wmv、mov、flv、rmvb、3gp、m4v、mkv、webm文件，且不超过200M</div>
      </el-upload>

      <div class="audioBox">
        <el-table :data="fileList" style="width: 100%">
          <el-table-column prop="name" label="文件名" width="180" />
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
              <el-button v-if="scope.row.status === 0" type="text" style="color: red" @click="del(scope.row, scope.$index)">删除</el-button>
              <el-button v-if="scope.row.status === 1" type="text" style="color: #E6A23C" @click="cancelRequest(scope.row, scope.$index)">取消上传</el-button>
              <!-- <el-button v-if="scope.row.status === 3" type="text" style="color: #E6A23C" @click="resumeUpload(scope.row, scope.$index)">恢复上传</el-button> -->
              <el-button v-if="scope.row.status === 4" type="text" style="color: #E6A23C" @click="againUpload(scope.row, scope.$index)">重新上传</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="ss-material-box-bottom">
      <el-button @click="sure">确定</el-button>
      <el-button @click="close()">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
import { uploadvideo } from '@/api/file'
import axios from 'axios'
export default {
  components: {
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
    success: {
      type: Function,
      default: () => {
        return () => {}
      }
    }
  },
  data() {
    return {
      fileList: [],
      getToken: getToken(),
      CancelToken: axios.CancelToken,
      statusText: {
        0: '上传中',
        1: '上传失败',
        2: '上传成功'
      }
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.fileList = []
          this.init()
        } else {
          this.fileList.map(v => {
            if (v.source) {
              v.source
            }
          })
          this.fileList = []
          this.$refs.upload && this.$refs.upload.abort()
          this.$refs.upload && this.$refs.upload.clearFiles()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init() {

    },
    close() {
      this.visible = false
    },
    sure() {
      console.log(this.fileList)
      const arr = this.fileList.filter(v => v.status === 2)
      // this.$emit('success', arr)
      this.success && this.success(arr)
      this.visible = false
    },
    fileChange(e) {
      const selectFile = e.file
      const formData = new FormData()
      formData.append('file', selectFile)
      this.fileList.push({
        file: selectFile,
        name: `${this.$getUuiD(10)}.${this.$getFileType(selectFile.name).suffix}`,
        status: 0,
        authProgress: 0,
        source: this.CancelToken.source()
      })
      const index = this.fileList.length - 1
      const self = this.fileList[index]
      uploadvideo(formData,
        (progressEvent) => {
          const authProgress = (progressEvent.loaded / progressEvent.total * 100) | 0
          // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          if (authProgress === 100) {
            self.authProgress = 99
          } else {
            self.authProgress = authProgress
          }
        }, self.source.token).then(res => {
        // console.log(res, 'res')
        self.authProgress = 100
        self.status = 2
        self.url = res.data.url
      }).catch(() => {
        console.log('失败')
        self.status = 1
      })
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
    }
    }
  }
::v-deep  .el-upload {
  width: 100%;
  .el-upload-dragger {
    width: 100%;
  }
}
.OSSUpload {
  padding: 20px;
  width: 700px;
  height: 400px;
  overflow: auto;
  // text-align: center;
  .upload-demo {
    width: 100%;
  }
}
</style>
