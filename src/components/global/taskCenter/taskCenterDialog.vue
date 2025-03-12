<template>
  <transition name="dialog-fade">
    <headerTitle v-show="visible" ref="headerTitle" :z-index="zIndex" :class="{'video-edit':isVideoEdit}" @click.native="visible = false" @onClickClear="onClickClear" @change="tabChange">
      <fileTransfer v-show="row === 1" ref="fileTransfer" slot="tabOne" slot-scope="{ row }" @numberChange="(res) => numberChange(1, res)" />
      <videoGeneration v-show="row === 2" ref="videoGeneration" slot="tabTwo" slot-scope="{ row }" @numberChange="(res) => numberChange(2, res)" />
      <projectGeneration v-show="row === 3" ref="projectGeneration" slot="tabThree" slot-scope="{ row }" @numberChange="(res) => numberChange(3, res)" />
      <listDataExport v-show="row === 4" ref="listDataExport" slot="tabFour" slot-scope="{ row }" @numberChange="(res) => numberChange(4, res)" />
    </headerTitle>
  </transition>
</template>

<script>
import fileTransfer from './fileTransfer.vue'
import videoGeneration from './videoGeneration.vue'
import projectGeneration from './projectGeneration.vue'
import headerTitle from './headerTitle.vue'
import listDataExport from './listDataExport.vue'
import eventBus from '@/utils/eventBus'
import { PopupManager } from 'element-ui/src/utils/popup'
export default {
  name: 'TaskCenterDialog',
  components: {
    fileTransfer,
    videoGeneration,
    projectGeneration,
    headerTitle,
    listDataExport
  },
  data() {
    return {
      // 弹框显隐
      visible: false,
      isVideoEdit: false,
      zIndex: 2001
    }
  },
  watch: {
    'visible'(val) {
      if (val) {
        this.zIndex = PopupManager.nextZIndex() + 2
        console.log(this.zIndex)
        this.clearSessionStorageTimer()
        this.$refs.fileTransfer && this.$refs.fileTransfer.init()
        this.$refs.videoGeneration && this.$refs.videoGeneration.getList()
        this.$refs.projectGeneration && this.$refs.projectGeneration.getList()
        this.$refs.listDataExport && this.$refs.listDataExport.getList()
      } else {
        this.$refs.videoGeneration && this.$refs.videoGeneration.clearClipTimeout()
        this.$refs.projectGeneration && this.$refs.projectGeneration.clearClipTimeout()
        this.$refs.listDataExport && this.$refs.listDataExport.clearClipTimeout()
      }
    }
  },
  mounted() {
    eventBus.$on('visibleTaks', (msg) => {
      this.visible = msg
    })
  },
  methods: {
    clearSessionStorageTimer() {
      console.log('调用')
      const clearTimer = sessionStorage.getItem('clearTimer')
      if (clearTimer) {
        const timeFnEnd = this.timeFn(clearTimer)
        if (timeFnEnd < 3) {
          this.clearlocalStorageTimerFun()
        }
      } else {
        this.clearlocalStorageTimerFun()
      }
    },
    clearlocalStorageTimerFun() { // 清除存储
      const that = this
      const clearEndTime = Date.now()// 获取当前时间
      sessionStorage.setItem('clearTimer', clearEndTime)
      // 取localStorage中的所有的键(Key)
      for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).length > 20) {
          const str = localStorage.getItem(localStorage.key(i))
          if (str.indexOf('{') !== -1 && str.indexOf('}') !== -1) {
            const file_obj = JSON.parse(str)

            if (file_obj.stageEndTime !== undefined) {
              const timeFnEnd = that.timeFn(file_obj.stageEndTime)
              if (timeFnEnd === 1) {
                console.log(`%c 检测结果删除成功： %c 本地服务 %c`,
                  'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
                  'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
                  'background:transparent', localStorage.key(i))
                that.visionTask.map(v => {
                  v.filename === file_obj.fileName ? console.log('存在不做处理') : localStorage.removeItem(localStorage.key(i))
                })
              } else {
                console.log(`%c 检测结果不删除： %c 本地服务 %c`,
                  'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
                  'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
                  'background:transparent', localStorage.key(i))
                // console.log('不需要删除缓存校验结果：', timeFnEnd)
              }
            }
          }
        }
      }
    },
    timeFn(dateBegin) {
      const sTime = dateBegin // 开始时间
      const eTime = new Date()// 获取当前时间
      // 作为除数的数字
      // const divNumSecond = 1000
      // const divNumMinute = 1000 * 60
      const divNumHour = 1000 * 3600
      const divNumDay = 1000 * 3600 * 24

      const day = parseInt((eTime - sTime) / parseInt(divNumDay))
      const hour = parseInt(((eTime - sTime) % parseInt(divNumDay)) / parseInt(divNumHour))
      // const minute = parseInt((parseInt(((eTime - sTime) % parseInt(divNumDay)) % parseInt(divNumHour))) / parseInt(divNumMinute))
      // const second = ((parseInt(((eTime - sTime) % parseInt(divNumDay)) % parseInt(divNumHour))) % parseInt(divNumMinute)) / parseInt(divNumSecond)
      // let str = day + '天' + hour + '小时' + minute + '分' + second + '秒'
      let str = ''
      if (day > 0) {
        str = 1
      } else if (day === 0 && hour > 0) {
        str = 2
      } else {
        str = 3
      }
      return str
    },
    /**
    * 添加任务
    * @param {object}obj 文件
    * @param {object}obj.file 文件
    * @param {string}obj.task 上传类型 1 原视频上传 2 半成品/成品视频上传 3 oss上传
    * @param {string}obj.origin 文件来源
    * @param {string}obj.originUrl 上传文件页面pathName
    * @param {object}obj.params 额外传参
    * @param {string}obj.icon 图标
    * @param {string}obj.errorReason 错误原因
    * @param {object}obj.ossConfig oss上传配置项 oss上传必填
    * @param {string}ossConfig.ossTeacherFolder oss上传文件夹
    * @param {string}ossConfig.parallel 设置并发上传的分片数量
    * @param {string}ossConfig.partSize 设置分片大小。
    * @returns
    */
    addTask(obj) {
      if (Object.prototype.toString.call(obj).substring(8, 14) !== 'Object') {
        throw new Error('传入数据类型错误')
      }
      const {
        file = {},
        task = '',
        origin = '',
        originUrl = '',
        params = {},
        icon = 't_video',
        errorReason = '',
        ossConfig = {}
      } = obj
      let status = ''
      if (errorReason.length > 0) {
        status = 'fail'
      } else if (task && (task === '1' || task === '2')) {
        status = 'parsing-wait'
      } else {
        status = 'wait'
      }
      this.$refs.fileTransfer.addFile({
        icon: icon || 't_video', // 展示图标
        status,
        task,
        origin: origin, // 文件来源
        originUrl: originUrl, // 来源地址
        file,
        params,
        progress: 0,
        errorReason,
        ossConfig: {
          ossTeacherFolder: ossConfig.ossTeacherFolder,
          parallel: ossConfig.parallel || 4,
          partSize: ossConfig.partSize || 1024 * 1024,
          checkpoint: null
        }
      })
    },
    // 条数改变触发
    numberChange(index, res = 0) {
      if (this.$refs.headerTitle) {
        this.$refs.headerTitle.numberChange(index, res)
      }
    },
    // 点击清除已完成任务按钮
    onClickClear() {
      console.log(this.$refs.headerTitle.menuKey)
      if (this.$refs.headerTitle.menuKey === 1) {
        // 清除文件传输已完成任务
        this.$refs.fileTransfer && this.$refs.fileTransfer.clearSuccessList()
      } else if (this.$refs.headerTitle.menuKey === 2) {
        // 清除视频生成已完成任务
        this.$refs.videoGeneration && this.$refs.videoGeneration.delAllSuccessClip()
      } else if (this.$refs.headerTitle.menuKey === 3) {
        this.$refs.projectGeneration && this.$refs.projectGeneration.delAllSuccessClip()
      } else if (this.$refs.headerTitle.menuKey === 4) {
        this.$refs.listDataExport && this.$refs.listDataExport.delAllSuccessClip()
      }
    },
    // tab栏切换
    tabChange(res) {
      console.log(res)
      if (res.id === 2) {
        this.$refs.videoGeneration && this.$refs.videoGeneration.init()
        this.$refs.projectGeneration && this.$refs.projectGeneration.clearClipTimeout()
      } else if (res.id === 1) {
        this.$refs.videoGeneration && this.$refs.videoGeneration.clearClipTimeout()
      } else if (res.id === 3) {
        this.$refs.projectGeneration && this.$refs.projectGeneration.init()
        this.$refs.videoGeneration && this.$refs.videoGeneration.clearClipTimeout()
      } else if (res.id === 4) {
        this.$refs.listDataExport && this.$refs.listDataExport.init()
        this.$refs.videoGeneration && this.$refs.videoGeneration.clearClipTimeout()
        this.$refs.projectGeneration && this.$refs.projectGeneration.clearClipTimeout()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
// 进入动画
.dialog-fade-enter-active {
  animation: dialog-fade-in 0.4s;
}
// 离开动画
.dialog-fade-leave-active {
  animation: dialog-fade-out 0.15s;
}
@keyframes dialog-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}
</style>
