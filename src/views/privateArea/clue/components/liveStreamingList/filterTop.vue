<template>
  <!-- 顶部搜索栏 -->
  <div class="filterTop">
    <el-form ref="form" :model="search" label-width="auto" size="small">
      <el-row :gutter="20">
        <el-col :span="11">
          <el-form-item label="开播时间">
            <el-date-picker
              v-model="search.liveRoom"
              style="width: 100%"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="录制视频">
            <el-input v-model="search.recordVideoName" :clearable="true" placeholder="请输入视频名称" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button
            size="small"
            type="primary"
            @click="handleClickSearch"
          >查询</el-button>
          <el-button size="small" @click="clear">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// import AppSelect from '@/components/AppSelect/index'
import { getVideoList } from '@/api/liveRoom/script'
import moment from 'moment'
export default {
  // components: {
  //   AppSelect
  // },
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          liveRoom: ['', ''],
          recordVideoName: ''
        }
      }
    }
  },
  data: () => {
    return {
      getVideoList,
      currentTime: ''
    }
  },
  computed: {
    pickerOptions() {
      return {
        disabledDate: time => {
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            const minTime = moment(this.currentTime)
              .subtract(1, 'years')
              .valueOf()
            const maxTime = moment(this.currentTime).add(1, 'years').valueOf()
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      }
    }
  },
  methods: {
    selectedVideo(res) {
      this.form.recordingTeacherId = res.teacherId
      this.form.recordingTeacherName = res.teacherName
      this.form.videoId = res.videoId
      this.form.videoName = res.videoName
      this.form.scriptId = ''
      this.form.scriptName = ''
      this.$refs.form && this.$refs.form.validateField('videoId')
    },
    handleClickSearch() {
      this.$emit('handleOk')
    },
    clear() {
      this.$emit('handleClear')
    }
  }
}
</script>

<style lang="scss" scoped>
.searchInput::v-deep {
  .tearchInput {
    width: 180px !important;
  }
}
</style>
