<template>
  <div v-if="videouploadFlag" class="upload-detail">
    <el-dialog
      width="518px"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="beforeClose"
    >
      <div slot="title">
        <p class="p-title">上传视频</p>
      </div>
      <div class="video-detail-cont">
        <el-form :model="uploadFrom" :rules="rules">
          <el-form-item label="视频类型" prop="type" label-width="100px">
            <el-radio-group v-model="uploadFrom.videoType">
              <el-radio :label="1">录制</el-radio>
              <el-radio :label="2">数字人</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="请选择IP"
            :label-width="formLabelWidth"
            prop="teacherId"
            style="margin-bottom: 14px;"
          >
            <filterSelectSingle ref="filterSelectSingle" class="w-365" :placeholder-str="'请选择IP'" @handleChange="changeHanldeTeacher" />
            <div class="tagList">
              <div
                v-for="item in recentlyTeacher"
                :key="item.teacherId"
                class="teacherTags text_hidden_1"
                :title="item.teacherName"
                :style="
                  item.teacherId === uploadFrom.teacherId
                    ? 'background:#DAE9FF;color:#0C6FFF'
                    : ''
                "
                @click="selectTeacher(item.teacherId)"
              >
                <span class="">
                  {{ item.teacherName }}
                </span>
                <svg-icon style="" :icon-class="item.teacherId === uploadFrom.teacherId ? 'blue_close_icon':'black_close_icon'" @click.stop="delRecentlyTeacher(item)" />
                <!-- <i class="el-icon-close "  /> -->
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div class="upload-cls">
          <el-upload
            ref="upload"
            class="upload-demo video-item"
            drag
            multiple
            :http-request="uploadVideo"
            :show-file-list="false"
            accept="video/mp4"
            :before-upload="viladUploadVideo"
            action="#"
          >
            <img class="img-cls" src="@/assets/image/video/icn_upload.png" />
            <div class="el-upload__text" style="color: #0c6fff">
              点击/拖拽上传视频
            </div>
            <div class="el-upload__tip">
              <span>视频格式：mp4，单个视频不超过20G</span>
            </div>
          </el-upload>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import filterSelectSingle from '@/components/filterSelectSingle/index.vue'

import { existsSuccessCount } from '@/api/videoManagement/origin'
export default {
  components: { filterSelectSingle },
  props: {
    tearcharray: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    },
    recentlyTeacher: {
      type: Array,
      default: () => {
        return []
      }
    },
    videotype: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      stringVideoMd5: '',
      videouploadFlag: false,
      dialogVisible: true,
      uploadFrom: {
        teacherId: '',
        videoType: 1
      },
      formLabelWidth: '100px',
      rules: {
        // teacherId: [{ required: true, message: '请选择IP', trigger: 'blur' }],
        type: [{ required: true, message: '请选择视频类型', trigger: 'blur' }]
      },
      videoGroupId: new Date().getTime()
    }
  },
  mounted() {
    eventBus.$on('successTaks', msg => {
      setTimeout(() => {
        this.uploadFrom.teacherId = ''
        this.$emit('searchList')
      }, 1500)
    })
    eventBus.$on('failTaks', msg => {})
  },
  destroyed() {
    eventBus.$off('successTaks')
    eventBus.$off('failTaks')
  },
  methods: {
    show() {
      this.videouploadFlag = true
    },
    // 删除常用
    delRecentlyTeacher(data) {
      this.$emit('delRecentlyTeacher', data)
    },
    selectTeacher(id) {
      this.uploadFrom.teacherId = id
      this.$refs.filterSelectSingle.defaultSelect(id)
    },
    beforeClose() {
      this.uploadFrom.teacherId = ''
      this.videouploadFlag = false
    },
    uploadVideo(e) {
      console.log(e, 3333)
      let originString = ''
      if (this.videotype === 3) {
        originString = '半成品视频'
      } else if (this.videotype === 4) {
        originString = '成品视频'
      }
      eventBus.$emit('sendTaskMessage', [
        {
          file: e.file, // 文件 必传
          type: 'file_video', // 上传文件 区分file_video或file_all（文件上传）和clip（剪辑） 必传
          origin: originString, // 任务标识 原视频、成品视频、半成品视频    必传
          originId: new Date().getTime(), // 半成品和成品视频固定传入teacherId
          optional: {
            teacherId: this.uploadFrom.teacherId,
            type: this.videotype,
            userId: this.$store.getters.userInfo.userId,
            videoType: this.uploadFrom.videoType
          } // 可选参数，可以在请求当前接口时按需传入。 // 标识id，视频组 必传
        }
      ]) // 任务推送
      eventBus.$emit('visibleTaks', true) // 打开任务中心
      this.$refs.upload?.clearFiles()
      /* const file = e.file
      const sliceLength = 10
      const chunkSize = Math.ceil(file.size / sliceLength)
      const fileReader = new FileReader()
      const spark = new SparkMD5()
      let index = 0
      const loadFile = () => {
        const slice = file.slice(index, index + chunkSize)
        fileReader.readAsBinaryString(slice)
      }
      loadFile()
      fileReader.onload = e => {
        spark.appendBinary(e.target.result)
        if (index < file.size) {
          index += chunkSize
          loadFile()
        } else {
          const param = {
            md5: spark.end(),
            teacherId: this.uploadFrom.teacherId,
            type: this.videotype
          }
          console.log('MMMMMMMMMMMMMMMMMMMMMMMM:DDDSSSSSSSSSSSSSSSSSSSSSS:D)', param)
          existsHash(param).then(res => {
            console.log('dddddddddddddd:     @@@@@@: ', res)
            if (res.data) {
              this.$message.error('同一个老师请勿上传同一个视频！')
              return false
            } else {
              this.$message.success('上传中...')
              this.videouploadFlag = false
              let originString = ''
              if (this.videotype === 3) {
                originString = '半成品视频'
              } else if (this.videotype === 4) {
                originString = '成品视频'
              }
              eventBus.$emit('sendTaskMessage', [{
                file: file, // 文件 必传
                type: 'file_video', // 上传文件 区分file_video或file_all（文件上传）和clip（剪辑） 必传
                origin: originString, // 任务标识 原视频、成品视频、半成品视频    必传
                originId: new Date().getTime(), // 半成品和成品视频固定传入teacherId
                optional: {
                  teacherId: this.uploadFrom.teacherId,
                  type: this.videotype,
                  userId: this.$store.getters.userInfo.userId
                } // 可选参数，可以在请求当前接口时按需传入。 // 标识id，视频组 必传
              }]) // 任务推送
              eventBus.$emit('visibleTaks', true) // 打开任务中心
              this.$refs.upload.clearFiles()
            }
          })
        }
      }*/
    },
    chooseData() {
      this.$nextTick(() => {
        this.$refs.chooseTeacher.blur()
      })
    },
    changeHanldeTeacher(val) {
      this.uploadFrom.teacherId = val
    },
    tipChooseTeacher() {
      this.$message.error('请先选择IP！')
    },
    viladUploadVideo(file) {
      console.log('.........................................', file)

      let originString = ''
      let type = 3
      if (this.videotype === 3) {
        originString = '半成品视频'
        type = 3
      } else if (this.videotype === 4) {
        originString = '成品视频'
        type = 4
      }
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        const _URL = window.URL || window.webkitURL
        const videoElement = document.createElement('video')
        const isMp4 = file.type === 'video/mp4'

        // const reg = /\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\u300a|\u300b|\u3010|\u3011|\u007e/
        const { data } =
          (await existsSuccessCount({ videoGroupId: this.videoGroupId })) || 0
        // if (this.uploadFrom.teacherId === '') {
        //   this.$message.error('请先选择IP！')
        //   reject()
        //   return
        // }
        if (data === 50) {
          this.$message.error('当前视频组最多能上传50个视频内容')
          this.$taskCenter.addTask({
            task: '2',
            file,
            origin: originString,
            errorReason: '当前视频组最多能上传50个视频内容',
            params: { type }
          })
          reject()
        } else if (!isMp4) {
          this.$message.error('请上传MP4格式的视频文件')
          this.$taskCenter.addTask({
            task: '2',
            file,
            origin: originString,
            errorReason: '请上传MP4格式的视频文件',
            params: { type }
          })
          reject()
        } else {
          // else if (!isHDV) {
          //   this.$message.error('请上传1080P的视频文件')
          //   this.$taskCenter.addTask({ task: '2', file, origin: originString, errorReason: '请上传1080P的视频文件', params: { type } })
          //   reject()
          // }
          videoElement.addEventListener('loadedmetadata', _event => {
            console.log(
              _event,
              videoElement.videoWidth,
              videoElement.videoHeight,
              '视频信息。。。。'
            )
            // const isHDV = (videoElement.videoWidth === 1920 && videoElement.videoHeight === 1080) || (videoElement.videoWidth === 1080 && videoElement.videoHeight === 1920)
            const isLt20G = file.size / 1024 / 1024 / 1024 < 20
            if (!isLt20G) {
              this.$message.error('请上传小于20G的视频文件')
              this.$taskCenter.addTask({
                task: '2',
                file,
                origin: originString,
                errorReason: '请上传小于20G的视频文件',
                params: { type }
              })
              reject()
            } else {
              this.$message.success('上传中...')
              this.videouploadFlag = false
            }
            resolve()
          })
          videoElement.addEventListener('error', (e) => {
            this.$message.error('视频加载失败,请检查视频文件是否正常')
            console.log(e, '视频加载失败。。。。')
          })
          videoElement.src = _URL.createObjectURL(file)
        }
      }).then(
        () => {
          return file
        },
        () => {
          return Promise.reject()
        }
      )
    }
    // async uploadExceed(files) {
    //   const { data } = await existsSuccessCount({ videoGroupId: this.videoGroupId }) || 0
    //   console.log(data, '超出个数。。。')
    //   if (data + files.length > 4) {
    //     this.$message.error('当前视频组最多能上传50个视频内容')
    //   } else {
    //     this.$message.success('上传中...')
    //     this.videouploadFlag = false
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.tagList {
  margin-top: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.teacherTags {
  // width: 78px;
  margin-right: 16px;
  padding: 0px 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  height: 28px;
  line-height: 28px;
  margin-bottom: 8px;
  text-align: center;
  // position: relative;
  cursor: pointer;
  // .delTeacher{
  //   position: absolute;
  //   right: -6px;
  //   top: -6px;
  // }
}
.upload-detail {
  ::v-deep .el-dialog {
    border-radius: 10px;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #e7e7e7;
  }
  .p-title {
    font-size: 16px;
    font-weight: bold;
  }
  .w-365 {
    width: 365px;
  }
  .upload-cls {
    width: 478px;
    height: 255px;
    padding: 0 10px;
    position: relative;
    ::v-deep .el-upload-dragger {
      width: 456px;
      height: 250px;
      background: #fbfcfe;
      text-align: center;
    }
    .img-cls {
      display: inline-block;
      margin-top: 60px;
    }
    .el-upload__text {
      margin-top: 16px;
      margin-bottom: 10px;
      font-size: 16px;
      color: #0c6fff;
    }
    .el-upload__tip {
      color: #999;
      font-size: 12px;
    }
    .upload-cls-child {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: pointer;
      border: 1px solid green;
    }
  }
}
</style>
