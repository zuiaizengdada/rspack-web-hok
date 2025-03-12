<template>
  <scrollPane style="height: 410px">
    <template v-for="(item) in visionTask">
      <listItem
        ref="listItem"
        :key="item.id"
        :info="item"
        :progress="item.progress"
        @handleClickAgain="handleClickAgain(item)"
        @fairing="onhandleFairing(item)"
        @handleClickPause="handleClickPause(item)"
        @handleClickReload="handleClickReload(item)"
      />
    </template>

    <div v-if="!visionTask.length" class="task-no-data">
      <div class="task-no-data-icon-box">
        <svg-icon icon-class="t_nodata" class="task-no-data-icon" />
      </div>
      <div>暂无内容</div>
    </div>
    <div v-if="fairingStatus" @click.stop />
  </scrollPane>
</template>

<script>
import scrollPane from './scrollPane.vue'
import listItem from './listItem.vue'
import * as hsUploadApi from './hsUploadApi.js'
import * as ossUpload from './ossUpload.js'
import router from '@/router'
import eventBus from '@/utils/eventBus'
import { getExistsSuccess } from '@/api/task/index'
export default {
  components: {
    scrollPane,
    listItem
  },
  data() {
    return {
      debounceTimer: false,
      visionTask: [],
      fairingStatus: false

      // parsingArr: [],
      // uploadArr: [],
      // parsingWaitArr: [],
      // uploadWaitArr: [],
      // pauseArr: [],
      // errorArr: [],
      // successArr: []
    }
  },
  computed: {
    // // 正在解析的数据
    // parsingArr() {
    //   return this.visionTask.filter(v => v.status === 'parsing')
    // },
    // // 正在上传（上传中）的数据
    // uploadArr() {
    //   return this.visionTask.filter(v => v.status === 'uploading')
    // },
    // // 等待解析中的数据
    // parsingWaitArr() {
    //   return this.visionTask.filter(v => v.status === 'parsing-wait')
    // },
    // // 等待上传的数据
    // uploadWaitArr() {
    //   return this.visionTask.filter(v => v.status === 'wait')
    // },
    // // 暂停中的数据
    // pauseArr() {
    //   return this.visionTask.filter(v => v.status === 'pause')
    // },
    // // 上传失败的数据
    // errorArr() {
    //   return this.visionTask.filter(v => v.status === 'fail')
    // },
    // // 上传成功的数据
    // successArr() {
    //   return this.visionTask.filter(v => v.status === 'success')
    // }
  },
  mounted() {
    eventBus.$on('successTaks', (arr) => {
      console.log('监听成功的回调')
      this.uploadTask()
    })
    eventBus.$on('failTaks', (arr) => {
      console.log('监听失败的回调', arr)
      this.uploadTask()
      if (Object.prototype.toString.call(arr) !== '[object Array]') {
        return
      }
      if (arr.length > 0 && (arr[0].task === '1' || arr[0].task === '2')) {
        let type
        if (arr[0].origin === '原视频') {
          type = 1
        } else if (arr[0].origin === '半成品视频') {
          type = 3
        } else if (arr[0].origin === '成品视频') {
          type = 4
        }
        const data = {
          reason: arr[0].errorReason,
          type,
          videoName: arr[0]?.file?.name || ''
        }
        hsUploadApi.uploadFailSendNotice(data)
      }
    })
    eventBus.$on('sendTaskMessage', (arr) => {
      console.log(arr, '添加文件')
      arr.map(v => {
        const { file, origin = '', originId = '', multiCameraGroupId = '', optional, type } = v
        let task = ''
        let status = 'awit'
        let params
        if (origin === '原视频') {
          task = '1'
          status = 'parsing-wait'
          params = {
            originId,
            multiCameraGroupId
          }
        } else if (origin === '成品视频' || origin === '半成品视频') {
          task = '2'
          status = 'parsing-wait'
          params = {
            originId,
            optional,
            type
          }
        }
        // 过滤file文件name的空格
        const fileName = file.name.replace(/\s/g, '')
        const newFile = new File([file], fileName)
        const obj = {
          task,
          file: origin === '原视频' ? newFile : file,
          origin,
          errorReason: '',
          progress: 0,
          status,
          creatTime: new Date().getTime(),
          icon: 't_video', // 展示图标
          ranking: {
            'parsing': 1,
            'uploading': 2,
            'pause': 3,
            'parsing-wait': 4,
            'wait': 5,
            'fail': 6,
            'success': 7,
            'del': 8
          }[status],
          params
        }
        console.log(obj, '上传之前的对象')
        if (obj.task === '1' || obj.task === '2') {
          getExistsSuccess({ videoGroupId: v.originId }).then((res) => {
            if (res.data < 100) {
              this.addFile(obj)
            } else {
              obj.status = 'fail'
              obj.errorReason = '视频组容量已达上限'
              this.addFile(obj)
            }
          })
        } else {
          this.addFile(obj)
        }
      })
    })
  },
  methods: {
    // 初始化
    init() {
      hsUploadApi.initUpload()
    },
    // 滚动到底触发
    rollEnd() {
      console.log('到底')
    },
    getUuiD(randomLength) {
      return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36) + Math.floor(Math.random() * 10) + 1
    },
    /**
     * 点击重新上传按钮
     */
    handleClickAgain(res) {
      res.loading = true
      if (res.file.prototype !== File.prototype || !res.file) {
        res.loading = false
        this.$message.error('找不到文件请重新上传')
        res.originUrl && router.push({ name: res.originUrl })
        this.visible = false
        return
      }
      this.taskFn(res.task).againUpload(res)
      res.loading = false
    },
    // 添加文件
    addFile(obj) {
      if (!obj.task) {
        this.visionTask.push({
          ...obj,
          id: this.getUuiD(22),
          md5: '',
          filename: obj?.file?.name,
          size: obj?.file?.size,
          callbackArgs: [],
          fileKey: '',
          originId: obj?.params?.originId,
          multiCameraGroupId: obj?.params?.multiCameraGroupId,
          type: obj.type,
          uploader: null
        })
        return this.$emit('numberChange', this.visionTask.length)
      }

      if (obj.task === '1' || obj.task === '2') {
        if (obj.errorReason && obj.errorReason.length > 0) {
          const data = {
            reason: obj.errorReason,
            type: obj.params.type,
            videoName: obj?.file?.name || ''
          }
          hsUploadApi.uploadFailSendNotice(data)

          const params = {
            ...obj,
            id: this.getUuiD(22),
            md5: '',
            filename: obj?.file?.name,
            size: obj?.file?.size,
            type: obj.type
          }
          this.visionTask.push(params)
          return this.$emit('numberChange', this.visionTask.length)
        }

        // 解析等待
        if (obj.status === 'parsing-wait') {
          const params = {
            ...obj,
            creatTime: new Date().getTime(),
            id: this.getUuiD(22),
            md5: '',
            filename: obj?.file?.name,
            size: obj?.file?.size,
            callbackArgs: [],
            fileKey: '',
            originId: obj?.params?.originId,
            multiCameraGroupId: obj?.params?.multiCameraGroupId,
            type: obj.type,
            uploader: null
          }
          this.visionTask.push(params)
          // this.canParsing(params)
        }
      } else if (obj.task === '3') {
        const params = {
          ...obj,
          creatTime: new Date().getTime(),
          id: this.getUuiD(22),
          filename: obj?.file?.name,
          size: obj?.file?.size,
          uploader: null
        }
        ossUpload.addFile(params).then(res => {
          this.visionTask.push(res)
          // this.canUpload(res)
        })
      }
      this.$emit('numberChange', this.visionTask.length)
      this.uploadTask()
    },
    // 解析队列判断
    canParsing(obj) {
      const arrStatus = {
        'parsing': 0,
        'uploading': 0,
        'parsing-wait': 0,
        'wait': 0,
        'pause': 0,
        'fail': 0,
        'success': 0
      }
      this.visionTask.map(v => {
        arrStatus[v.status]++
      })
      if (arrStatus.parsing < 3) {
        if (obj.status === 'parsing') return
        hsUploadApi.doIncremental(obj).then(res => {
          this.uploadTask()
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
      console.log('上传队列obj', obj)
      if (obj.status !== 'wait' && obj.status !== 'uploading') {
        return
      }
      const arrStatus = {
        'parsing': 0,
        'uploading': 0,
        'parsing-wait': 0,
        'wait': 0,
        'pause': 0,
        'fail': 0,
        'success': 0
      }
      this.visionTask.map(v => {
        arrStatus[v.status]++
      })
      if (arrStatus.uploading < 3) {
        obj.status = 'uploading'
        obj.creatTime = new Date().getTime()
        this.taskFn(obj.task).startUpload(obj, (infor) => this.completeFn(infor, obj), (infor) => this.errorFn(infor, obj), (infor) => this.progressFn(infor, obj))
      } else {
        obj.status = 'wait'
      }
    },
    // 点击删除按钮
    onhandleFairing(res) {
      res.loading = true
      res.status = 'del'
      const index = this.visionTask.findIndex(v => v.id === res.id)
      this.taskFn(res.task).Del(res)
      index > -1 && (this.visionTask.splice(index, 1))
      res.loading = false
      return this.$emit('numberChange', this.visionTask.length)
    },
    // 更新任务队列
    uploadTask() {
      const arrStatus = {
        'parsing': 0,
        'uploading': 0,
        'parsing-wait': 0,
        'wait': 0,
        'pause': 0,
        'fail': 0,
        'success': 0
      }
      this.visionTask.map(v => {
        arrStatus[v.status]++
      })

      if (arrStatus.parsing < 3) {
        // 更新解析队列
        if (arrStatus['parsing-wait'] > 0) {
          const index = this.visionTask.findIndex(v => v.status === 'parsing-wait')
          if (index > -1) {
            (this.visionTask[index].task === '1' || this.visionTask[index].task === '2') && (this.canParsing(this.visionTask[index]))
          }
        }
      }
      if (arrStatus.uploading < 3) {
        // 更新上传队列
        if (arrStatus.wait > 0) {
          const index = this.visionTask.findIndex(v => v.status === 'wait')
          index > -1 && this.canUpload(this.visionTask[index])
        }
      }
      // console.log('开始更新任务队列', this.visionTask)
      this.visionTask.map(v => {
        v.ranking = {
          'parsing': 1,
          'uploading': 2,
          'pause': 3,
          'parsing-wait': 4,
          'wait': 5,
          'fail': 6,
          'success': 7,
          'del': 8
        }[v.status]
      })
      // this.bubbleSort()
      this.visionTask.sort((a, b) => {
        if (a.ranking === b.ranking) {
          return a.creatTime - b.creatTime
        }
        return a.ranking - b.ranking
      })
      this.$forceUpdate()
      if ((arrStatus.wait > 0 && arrStatus.uploading < 3) || (arrStatus['parsing-wait'] > 0 && arrStatus['parsing'] < 3)) {
        this.uploadTask()
      }
      // console.log('更新任务队列结束', this.visionTask)
      this.$emit('numberChange', this.visionTask.length)
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
    // 成功回调
    completeFn(infor, obj) {
      console.log(infor, JSON.parse(infor.res.body).Result.Data.SourceInfo, '成功的回调')
      // const videoInfo = JSON.parse(infor.res.body).Result.Data.SourceInfo
      // const isHDV = (videoInfo?.Width === 1920 && videoInfo?.Height === 1080) || (videoInfo?.Width === 1080 && videoInfo?.Height === 1920)
      // if ((videoInfo.Format === 'mxf' || videoInfo.Format === 'MXF') && !isHDV) {
      //   this.errorFn(infor, obj)
      //   return
      // }
      // obj.errorReason = '分辨率应为1920*1080'
      obj.progress = 100
      obj.status = 'success'
      eventBus.$emit('successTaks', [{ ...obj }])
      this.uploadTask()
    },
    // 失败的回调
    errorFn(infor, obj) {
      // console.log('失败的回调')
      obj.status = 'fail'
      console.log('火山上传错误', infor)
      if (infor.extra) {
        obj.errorReason = `${infor.extra.errorCode}:${infor.extra.message}`
      } else {
        obj.errorReason = `火山上传失败(uploadId${infor.uploadId})`
      }
      // 只有上传mxf文件且不是1080P的原视频才会触发回调
      if (infor.type === 'success') {
        obj.errorReason = `MXF格式文件分辨率应为1920*1080`
      }
      let type
      if (obj.origin === '原视频') {
        type = 1
      } else if (obj.origin === '半成品视频') {
        type = 3
      } else if (obj.origin === '成品视频') {
        type = 4
      }
      const data = {
        reason: obj.errorReason,
        type,
        videoName: obj?.file?.name || ''
      }
      hsUploadApi.uploadFailSendNotice(data)
      // 传对象给failTaks不会触发回调，避免多发一次请求
      eventBus.$emit('failTaks', obj)
    },
    // 上传中的回调
    progressFn(infor, obj) {
      // console.log(obj.file.name, infor.percent)
      // const index = this.visionTask.findIndex(v => v.id === obj.id)
      // index > -1 && (this.visionTask[index].progress = infor.percent)
      obj.progress = obj.progress > infor.percent ? obj.progress : infor.percent
    },
    // 清除已完成
    clearSuccessList() {
      this.visionTask = this.visionTask.filter(v => {
        return v.status !== 'success'
      })
      return this.$emit('numberChange', this.visionTask.length)
    },
    // 根据task返回调用的js
    taskFn(task = '1') {
      if (task === '1' || task === '2') {
        return hsUploadApi
      } else if (task === '3') {
        return ossUpload
      } else {
        return null
      }
    },
    // 点击暂停上传
    handleClickPause(res) {
      this.taskFn(res.task) && this.taskFn(res.task).Pause(res)
      this.uploadTask()
    },
    // 点击继续上传
    handleClickReload(res) {
      this.taskFn(res.task).Reload(res)
      this.uploadTask()
    }
    // 获取各种状态的数据
  }
}
</script>

<style lang='scss' scoped>
.task-no-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: normal;
  font-size: 18px;
  font-family: MicrosoftYaHei;
  margin-top: 76px;
  color: #919293;
  .task-no-data-icon-box {
      height: 148px;
      overflow: hidden;
      .task-no-data-icon {
          font-size: 175px
      }
  }
}
</style>
