<template>
  <AppDialog
    v-model="visible"
    title="更换视频"
    width="580px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <!-- 更换视频 -->
    <div v-loading="loading" class="CouponStyle">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="视频名称" prop="videoId">
          <!-- 视频课件 -->
          <AppSelect
            :get-api-fn="getVideoList"
            search-key="videoName"
            :popover-width="245"
            :disabled="ifLtr5min()"
            :value="form.videoId"
            :label="form.videoName"
            :props="videoObj"
            @selected="selectedVideo"
          />
        </el-form-item>
        <el-form-item v-if="form.videoId" label="备课内容">
          <AppSelect
            :get-api-fn="getScriptList"
            search-key="coursewareName"
            :disabled="ifLtr5min()"
            :popover-width="245"
            :value="form.scriptId"
            :label="form.scriptName"
            :props="scriptObj"
            @selected="selectScript"
          >
            <div slot-scope="{ row }" class="liveRoomScript">
              <div class="text_hidden_ellipsis">{{ row.coursewareName }}</div>
              <div
                class="text_hidden_ellipsis"
                style="font-size: 12px; margin-top: 6px"
              >
                创建人: {{ row.createUserName }}
              </div>
            </div>
          </AppSelect>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppSelect from '@/components/AppSelect/index'
import { getVideoList } from '@/api/liveRoom/script'
import { getCoursewareList } from '@/api/liveRoom/courseware.js'
import moment from 'moment'
export default {
  components: {
    AppDialog,
    AppSelect
  },
  data() {
    return {
      top: '114px',
      loading: false,
      liveRoomId: '',
      visible: false,
      form: { scriptId: undefined, videoId: undefined },
      success: () => {},
      videoObj: {
        label: 'videoName',
        value: 'videoId'
      },
      scriptObj: {
        label: 'coursewareName',
        value: 'coursewareId'
      },
      rules: {
        videoId: [{ required: true, message: '请选择视频', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible: {
      handler(val) {
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    getScriptList(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        teacherId: '',
        status: 1,
        videoId: this.form.videoId,
        coursewareName: params.coursewareName
      }
      return getCoursewareList(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    selectScript(res) {
      this.form.scriptId = res.coursewareId
      this.form.scriptName = res.coursewareName
    },
    selectedVideo(res) {
      console.log(res)
      this.form.videoId = res.videoId
      this.form.videoName = res.videoName
      this.form.scriptId = ''
      this.form.scriptName = ''
      this.$refs.form && this.$refs.form.validateField('videoId')
    },
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
    // 判断是否直播前5分钟
    ifLtr5min() {
      if (this.form.status !== 0 || this.form.liveModel !== 'AI_LIVE') {
        return false
      } else {
        return moment(this.originForm.startTime).diff(moment(), 'minutes') < 5
      }
    },
    sure() {
      this.success({ ...this.form })
    }
  }
}
</script>

<style lang='scss' scoped>
.CouponStyle {
  padding: 20px;
}
::v-deep {
  .el-form-item__label {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 600;
    color: #000000;
  }
  .el-form-item__content {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
  }
}
</style>
