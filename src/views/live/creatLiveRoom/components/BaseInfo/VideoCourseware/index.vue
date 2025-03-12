<template>
  <div>
    <AppSelect
      :get-api-fn="getVideoList"
      search-key="videoName"
      :popover-width="245"

      :value="videoId"
      :label="videoName"
      :props="propsVideoCourse"
      @selected="selectedVideo"
      @clear="handleClear"
    />
  </div>
</template>
<script>
import AppSelect from './AppSelect.vue'
import { getVideoList } from '@/api/liveRoom/script'
export default {
  components: {
    AppSelect
  },

  data() {
    return {
      videoId: '',
      videoName: '',
      propsVideoCourse: {
        label: 'videoName',
        value: 'videoId'
      }
    }
  },
  methods: {

    getVideoList(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        teacherId: '',
        videoName: params.videoName,
        covertStatus: 2, // 1-转码中 2-转码成功 3-转码失败
        status: 1 // 1:启用 2禁用
      }
      return getVideoList(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    selectedVideo(res) {
      console.log(res, 'rrrrrrrrr')
      if (res.videoId) {
        this.videoId = res.videoId
        this.videoName = res.videoName
        this.$emit('select', res)
      }

      // this.form.recordingTeacherId = res.teacherId
      // this.form.recordingTeacherName = res.teacherName

      // this.form.scriptId = ''
      // this.form.scriptName = ''
      // this.$refs.form && this.$refs.form.validateField('videoId')
      // if (res.width > res.height) {
      //   // 横屏直播
      //   this.$message('系统检测到您选择了横屏视频，已为您切换成横屏展示')
      //   this.form.displayMode = 1
      // } else if (res.width < res.height) {
      //   // 竖屏直播
      //   this.$message('系统检测到您选择了竖屏视频，已为您切换成竖屏展示')
      //   this.form.displayMode = 2
      // }
    },
    handleClear() {
      this.$emit('clear')
    }
  }
}
</script>
