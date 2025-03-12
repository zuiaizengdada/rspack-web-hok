<template lang="">
  <div>
    <el-upload class="upload-demo" drag accept="video/mp4" :http-request="upload" action="#" multiple :limit="50">
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处, 或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>
<script>
import eventBus from '@/utils/eventBus'
export default {
  components: {
  },
  data() {
    return {

    }
  },
  mounted() {
    // eventBus.$on('successTaks', (msg) => {
    //   console.log('调用方成功回调s', msg)
    //   this.$notify({
    //     title: '上传成功',
    //     type: 'success',
    //     message: msg.filename
    //   })
    // })
    // eventBus.$on('failTaks', (msg) => {
    //   console.log('失败回调:', msg)
    //   this.$notify({
    //     title: '上传失败',
    //     type: 'warning',
    //     message: msg.filename
    //   })
    // })
  },
  destroyed() {
    eventBus.$off('successTaks')
    eventBus.$off('failTaks')
  },
  methods: {
    upload(e) {
      console.log('当前任务栏的数量', e.file.name)
      //   特别说明
      // 文件上传前按需求处理好，按指定格式生成任务
      const task = [{
        file: e.file, // 文件 必传
        type: 'file_video', // 上传文件 区分file_video或file_all（文件上传）和clip（剪辑） 必传
        origin: '原视频', // 任务标识 原视频、成品视频、半成品视频    必传
        originId: '1573979372832468996', // 标识id，视频组 必传
        optional: {
          'bhcsh12': 11,
          'bh2': 145
        } // 可选参数，可以在请求当前接口时按需传入。
      }]
      this.sendTaskMessage(task)
    },
    sendTaskMessage(task) { //
      eventBus.$emit('sendTaskMessage', task) // 任务推送
      eventBus.$emit('visibleTaks', true) // 打开任务中心
    }
  }
}
</script>
  <style lang="scss" scoped>

  </style>

