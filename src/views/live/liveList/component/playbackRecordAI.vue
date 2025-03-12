<template>
  <div>
    <el-table
      v-loading="loading"
      :data="list"
      :header-cell-style="{ background: '#f5f5f5' }"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="50" reserve-selection :selectable="selectable" /> -->
      <el-table-column prop="cloudId" label="录播ID" width="170" />
      <el-table-column
        prop="cloudName"
        label="录制文件名称"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="recordingType" label="录制类型">
        <template slot-scope="{ row }">
          <span> {{ $getdictName('VIDEO_SOURCE', row.recordingType) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="recordingTime" label="录制时间">
        <template slot-scope="{ row }">
          {{ row.recordingTime | filterTime }}
        </template>
      </el-table-column>
      <el-table-column prop="transcodeStatus" label="直播转码状态" width="120px">
        <template slot-scope="{ row }">
          <!-- 转码状态 -->
          <div class="liveType" :class="`liveType${row.transcodeStatus}`">
            <div v-if="[0,1,2].includes(row.transcodeStatus)" style="display: flex;align-items: center;">
              <svg-icon class-name="liveTypeicon" :icon-class="{0: 'audit_wait', 1: 'audit_success', 2: 'audit_fail'}[row.transcodeStatus]" />
              {{ {0: '转码中', 1: '转码成功', 2: '转码失败'}[row.transcodeStatus] }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="recordingDuration"
        label="录制时长"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ row.recordingDuration | filtersDuration }}
        </template>
      </el-table-column>
      <el-table-column
        prop="videoClarity"
        label="视频清晰度"
        align="center"
      />
      <el-table-column prop="codeRate" label="码率" align="center">
        <template>
          ——
        </template>
      </el-table-column>
      <el-table-column prop="frameRate" label="帧率" align="center">
        <template>
          ——
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="250px">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            @click="onhandleDown(row)"
          >下载</el-button>
          <el-button type="text" class="actionBtn" @click="onhandlePlay(row)">浏览视频</el-button>
          <!-- <el-button v-if="row.transcodeStatus === 2" icon="el-icon-refresh-left" type="text">重新转码</el-button> -->
          <el-button v-if="row.transcodeStatus === 2" type="text" style="color: #F53F3F" @click="delPlaybackRecord(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="playbackFun m-t-20">
      <el-button type="primary" @click="onhandleVideoProject">视频处理</el-button>
    </div> -->
  </div>
</template>

<script>
import { getPlaybackRecordDigAjax, delPlaybackRecord } from '@/api/liveRoom/index.js'
import moment from 'moment'
import AppVideo from '@/components/AppVideo'
import { Decrypt } from '../../utils/secrt.js'
// import AppTag from '@/components/AppTag'
import { videoprojectprojectProjectGenerate } from '@/api/liveRoom/index'
export default {
  components: {
    // AppTag
  },
  filters: {
    filterTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm')
    },
    filtersDuration(val) {
      if (!val) {
        return ''
      }
      const result = parseInt(val)
      const h =
        Math.floor(result / 3600) < 10
          ? '0' + Math.floor(result / 3600)
          : Math.floor(result / 3600)
      const m =
        Math.floor((result / 60) % 60) < 10
          ? '0' + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60)
      return h + '时' + m + '分'
    }
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      multipleSelection: [],
      videoMergeConfig: {
        visible: false
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    selectable(row, index) {
      return row.transcodeStatus === 1
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const { videoId } = this.detail?.liveRoomIntelligentInfo
      if (!videoId) return
      const params = {
        videoId
      }
      getPlaybackRecordDigAjax(params)
        .then(res => {
          this.list = [res.data]
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    onhandleDown(row) {
      if (!row.cloudUrl) {
        return this.$message.error('回放合成中，请稍后再试')
      }
      this.$emit('handleDown', row)
      const videoUrl = Decrypt(row.cloudUrl)
      const downloadUrl =
              videoUrl +
              (videoUrl.indexOf('?') > -1 ? '&' : '?') +
              `download_name=${encodeURI(row.cloudName + '.mp4')}`
      window.open(downloadUrl)
    },
    // 批量选择
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 视频合并
    handleVideoMerge() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请至少选择一项')
      }
      this.videoMergeConfig.visible = true
    },
    // 视频合并取消
    handleVideoMergeCancel() {
      this.videoMergeConfig.visible = false
    },
    // 视频合并确定
    handleVideoMergeSumbit() {
      this.videoMergeConfig.visible = false
    },
    // 预览
    onhandlePlay(row) {
      if (!row.cloudUrl) {
        return this.$message.error('回放合成中，请稍后再试')
      }
      const videoUrl = Decrypt(row.cloudUrl)
      // 播放视频
      AppVideo.play({
        url: videoUrl,
        videoName: row.cloudName,
        playbackRate: [1, 1.25, 1.5, 1.75, 2]
      })
    },
    // 点击视频处理
    onhandleVideoProject() {
      console.log('点击视频处理')
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请选择先视频')
      }
      this.videoProjectLoading = true
      const data = {
        videoIds: [this.multipleSelection],
        projectName: this.detail.name
      }
      videoprojectprojectProjectGenerate(data).then(res => {
        const { href } = this.$router.resolve({
          path: `/videoEditorLive?projectId=${res.data}&projectVideoId=${this.multipleSelection[0]}`
        })
        window.open(href, '_blank')
        this.videoProjectLoading = false
      }).catch(() => {
        this.videoProjectLoading = false
      })
    },
    delPlaybackRecord(row) {
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          const data = {
            id: row.id
          }
          delPlaybackRecord(data).then(res => {
            this.$message.success('操作成功')
          })
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.liveType {
  display: inline-block;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  padding: 0 8px;
  border-radius: 13px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  height: 24px;
  line-height: 24px;
  .liveTypeicon {
    width: 14px;
    height: 14px;
    font-size: 14px;
    margin-right: 4px;
  }
}
.liveType0 {
  background: #FFF2E6;
  color: #FF7D00;
}
.liveType1 {
  background: #E6F7EA;
  color: #00B42A;
}
.liveType2 {
  background: #FEECEC;
  color: #F53F3F;
}
</style>
