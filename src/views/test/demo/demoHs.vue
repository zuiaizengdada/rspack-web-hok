<template>
  <!-- 上传弹框 -->
  <div class="upload">
    <el-upload
      ref="upload"
      class="uploadView m-r-16 m-b-16"
      drag
      multiple
      action="#"
      accept=".mp4,.avi,.mov,.flv,.rmvb"
      :http-request="upload"
      :show-file-list="false"
    >
      <i class="el-icon-plus" />
      <div class="uploadViewText">点击/拖拽上传</div>
    </el-upload>

    <div v-if="fileList.length === 0" class="tips" v-html="tips" />

    <template v-for="(item, index) in fileList">
      <uploadItem
        :key="index"
        class="m-r-16 m-b-16"
        :status="item.status"
        :url="item.url"
        :auth-progress="item.authProgress"
        @handleClickPause="handleClickPause(item)"
        @del="delFile(item)"
        @again="alignUpload(item)"
        @handleClickReload="handleClickReload(item)"
      />
    </template>
  </div>
</template>

<script>
import uploadItem from './uploadItem.vue'
import * as hsUploadApi from './hsUploadApi'
import eventBus from '@/utils/eventBus'
export default {
  components: {
    uploadItem
  },
  data() {
    return {
      tips: '最少上传1个文件',
      // 文件上传状态status
      //   parsing-wait: 等待解析
      //   parsing: 解析中
      //   wait: 等待中
      //   uploading: 文件上传中
      //   fail: 文件上传失败
      //   success: 文件上传成功
      //   pause: 暂停中
      fileList: []
    }
  },
  computed: {
    // 正在解析的数据
    parsingArr() {
      return this.fileList.filter(v => v.status === 'parsing')
    },
    // 正在上传（上传中）的数据
    uploadArr() {
      return this.fileList.filter(v => v.status === 'uploading')
    },
    // 等待解析中的数据
    parsingWaitArr() {
      return this.fileList.filter(v => v.status === 'parsing-wait')
    },
    // 等待上传的数据
    uploadWaitArr() {
      return this.fileList.filter(v => v.status === 'wait')
    },
    // 暂停中的数据
    pauseArr() {
      return this.fileList.filter(v => v.status === 'pause')
    },
    // 上传失败的数据
    errorArr() {
      return this.fileList.filter(v => v.status === 'fail')
    },
    // 上传成功的数据
    successArr() {
      return this.fileList.filter(v => v.status === 'success')
    }
  },
  created() {
    hsUploadApi.initUpload()
  },
  mounted() {
    // eventBus.$on('successTaks', (arr) => {
    //   console.log('监听成功得回调')
    //   this.uploadTask()
    // })
    // eventBus.$on('failTaks', (arr) => {
    //   console.log('监听失败的回调', arr)
    //   this.uploadTask()
    // })
  },
  methods: {
    // 点击上传视频
    async upload(e) {
      this.$refs.upload.clearFiles()
      console.log('上传文件', e)
      if (!e) {
        return
      }
      const selectFile = e.file
      const obj = {
        id: this.getUuiD(20),
        file: selectFile, // 文件对象
        name: `${this.$getUuiD(10)}.${this.$getFileType(selectFile.name).suffix}`, // 文件名
        status: 'parsing-wait', // 状态
        md5: '',
        authProgress: 0, // 进度
        poster: '', // 封面
        uploader: null,
        errorReason: '',
        params: {
          originId: '1603654716080832512'
        },
        fileKey: '',
        url: '' // 地址
      }
      this.fileList.push(obj)
      // this.canUpload(obj)
      this.uploadTask()
    },
    // 点击重新上传
    alignUpload(item) {
      item.status = 'wait'
      this.uploadTask()
    },
    // 获取是否还有正在上传的文件
    getUploadFile() {
      const index = this.fileList.findIndex((v) => v.status === 1)
      return index > -1
    },
    // 点击删除
    delFile(item, index) {
      console.log(item, index)
      if (item.abortCheckpoint) {
        item.client && item.client.abortMultipartUpload(item.abortCheckpoint.name, item.abortCheckpoint.uploadId)
      }
      this.fileList.splice(index, 1)
    },
    // 解析队列判断
    canParsing(obj) {
      console.log('解析队列判断', this.parsingArr.length)
      if (this.parsingArr.length < 3) {
        if (this.parsingArr.findIndex(v => v.id === obj.id) > -1) return
        hsUploadApi.doIncremental(obj).then(res => {
          console.log(res, 'md5值>>>>')
          // obj.status = 'wait'
          this.uploadTask()
          // this.canUpload(obj)
        }).catch((err) => {
          obj.status = 'fail'
          obj.errorReason = err
          eventBus.$emit('failTaks', [{ ...obj }])
          this.uploadTask()
        })
      }
    },
    // 上传队列判断
    canUpload(obj) {
      console.log(obj)
      if (obj.status !== 'wait' && obj.status !== 'uploading') {
        return
      }
      console.log('上传队列判断', this.uploadArr.length)
      if (this.uploadArr.length < 3) {
        obj.status = 'uploading'
        hsUploadApi.startUpload(obj, (infor) => this.completeFn(infor, obj), (infor) => this.errorFn(infor, obj), (infor) => this.progressFn(infor, obj))
      } else {
        obj.status = 'wait'
      }
    },
    // 更新任务队列
    uploadTask() {
      console.log('更新任务队列开始')
      if (this.parsingArr.length < 3) {
        // 更新解析队列
        if (this.parsingWaitArr.length > 0) {
          const index = this.fileList.findIndex(v => v.id === this.parsingWaitArr[0].id)
          if (index > -1) {
            this.canParsing(this.fileList[index])
          }
        }
      }
      if (this.uploadArr.length < 3) {
        // 更新上传队列
        if (this.uploadWaitArr.length > 0) {
          const index = this.fileList.findIndex(v => v.id === this.uploadWaitArr[0].id)
          index > -1 && this.canUpload(this.fileList[index])
          console.log('更新上传队列')
        }
      }
      this.fileList.map(v => {
        console.log(v, 'v')
        v.ranking = { 'parsing': 1, 'uploading': 2, 'pause': 3, 'parsing-wait': 4, 'wait': 5, 'fail': 6, 'success': 7, 'del': 8 }[v.status]
      })
      this.bubbleSort(this.fileList)
      this.$forceUpdate()
      console.log('更新任务队列结束', this.fileList)
      if (this.uploadWaitArr.length > 0 && this.uploadArr.length < 3) {
        this.uploadTask()
      }
    },
    // 冒泡排序
    bubbleSort(arr) {
      // 控制比较轮数
      for (let i = 0; i < arr.length - 1; i++) {
        // 控制每轮比较
        for (let j = 0; j < arr.length - i - 1; j++) {
          // 前面的数大于后面的数交换位置
          if (arr[j].ranking > arr[j + 1].ranking) {
            const temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
          }
        }
      }
      return arr
    },
    // 清除已完成
    clearSuccessList() {
      this.fileList = this.fileList.filter(v => {
        return v.status !== 'success'
      })
    },
    // 点击暂停上传
    handleClickPause(res) {
      hsUploadApi.Pause(res)
      this.uploadTask()
    },
    // 点击继续上传
    handleClickReload(res) {
      hsUploadApi.Reload(res)
      this.uploadTask()
    },
    // 成功回调
    completeFn(infor, obj) {
      obj.progress = 100
      obj.status = 'success'
      eventBus.$emit('successTaks', [{ ...obj }])
    },
    // 失败的回调
    errorFn(infor, obj) {
      obj.status = 'fail'
      console.log('火山上传错误', infor)
      obj.errorReason = '火山上传失败'
      eventBus.$emit('failTaks', [{ ...obj }])
    },
    // 上传中的回调
    progressFn(infor, obj) {
      obj.authProgress = infor.percent
    },
    getUuiD(randomLength) {
      return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36) + Math.floor(Math.random() * 10) + 1
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
            height: 90px;
        }
    }
}
.upload {
    display: flex;
    flex-wrap: wrap;
    .uploadView {
        width: 160px;
        height: 90px;
        background: #FBFCFE;
        border-radius: 4px;
        // border: 1px solid #E1E6ED;
        .uploadViewText {
            margin-top: 12px;
            font-size: 12px;
            font-family: MicrosoftYaHei;
            color: #0C6FFF;
            line-height: 20px;
        }
    }
    .tips {
        margin-top: 5px;
        margin-left: 8px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #999999;
        line-height: 20px;
    }
}
.el-icon-plus {
        font-weight: 700;
    font-size: 14px;
    color: #333333;
}
</style>
