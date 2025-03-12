<template>
  <div>
    <!-- 回放设置 -->
    <playbackSetting :detail="detail" :disabled-fn="disabledFn" />
    <!-- 回放记录 -->
    <div v-if="detail.liveModel !== 'AI_LIVE'">
      <el-table
        v-loading="loading"
        :data="list"
        :header-cell-style="{ background: '#f5f5f5' }"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" reserve-selection :selectable="selectable" />
        <el-table-column prop="cloudId" label="录播ID" width="170" />
        <el-table-column
          prop="cloudName"
          label="录制文件名称"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="recordingType" label="录制类型">
          <template slot-scope="{ row }">
            <span> {{ $getdictName('RECORDINGTYPE', row.recordingType) }}</span>
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
          <template slot-scope="{ row }">
            {{ row.codeRate === '0' ? '——' : row.codeRate || '——' }}
          </template>
        </el-table-column>
        <el-table-column prop="frameRate" label="帧率" align="center">
          <template slot-scope="{ row }">
            {{ row.frameRate || '——' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="250px">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              :loading="row.downLoading"
              @click="onhandleDown(row)"
            >下载</el-button>
            <el-button type="text" @click="onhandlePlay(row)">预览</el-button>
            <!-- <el-button v-if="row.transcodeStatus === 2" icon="el-icon-refresh-left" type="text">重新转码</el-button> -->
            <el-button v-if="row.transcodeStatus === 2" type="text" style="color: #F53F3F" @click="delPlaybackRecord(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="m-t-20" style="display: flex;align-items: center;justify-content: space-between;">
        <div class="playbackFun">
          <el-button v-if="list.length > 0" type="primary" @click="onhandleVideoProject">视频处理</el-button>
        </div>
        <el-pagination
          class="pagination"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <playbackRecordAI v-else :detail="detail" @handleDown="operationLogsWrite" />
    <el-dialog
      title="提示"
      :visible.sync="videoMergeConfig.visible"
      width="420px"
      center
    >
      <span>确定合并视频？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleVideoMergeCancel">取 消</el-button>
        <el-button
          type="primary"
          @click="handleVideoMergeSumbit"
        >确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPlaybackRecordPage, getDownLoadUrl, delPlaybackRecord } from '@/api/liveRoom/index.js'
import moment from 'moment'
import { videoprojectprojectProjectGenerate } from '@/api/liveRoom/index'
import AppVideo from '@/components/AppVideo'
import playbackSetting from './playbackSetting'
// import { Decrypt } from '../../utils/secrt.js'
import playbackRecordAI from './playbackRecordAI'
import { liveOperationType } from '@/views/live/columns.js'
import { getFileType } from '@/utils/index.js'

export default {
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
  components: {
    playbackSetting,
    playbackRecordAI
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    enterLiveRoom: {
      type: Boolean,
      default: false
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
  computed: {
    disabledFn() {
      if (this.detail.status !== 9) {
        return true
      }
      if (this.detail.liveModel === 'PERSON_LIVE' && this.list.length > 0 && this.list[0].transcodeStatus !== 1) {
        return true
      }
      return false
    }
  },
  watch: {
    detail: {
      handler() {
        ['DIGITAL_PERSON_LIVE', 'PERSON_LIVE'].includes(this.detail.liveModel) && this.getList()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // this.getList()
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
      const params = {
        liveRoomId: this.$route.params.id,
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      getPlaybackRecordPage(params)
        .then(res => {
          res.data.items.map((v, index) => {
            v.sort = (this.currentPage - 1) * this.pageSize + index
            v.downLoading = false
          })
          this.list = res.data.items
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    onhandleDown(row) {
      row.downLoading = true
      if (row.id) {
        const data = {
          livePlaybackRecordId: row.id
        }
        this.operationLogsWrite(row)
        getDownLoadUrl(data)
          .then(res => {
            const downloadUrl =
              res.data +
              (res.data.indexOf('?') > -1 ? '&' : '?') +
              `download_name=${encodeURI(row.cloudName + '.' + getFileType(res.data).suffix)}`
            window.open(downloadUrl)
            row.downLoading = false
          })
          .catch(() => {
            row.downLoading = false
          })
      } else {
        row.downLoading = false
      }
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
      // 播放视频
      AppVideo.play({
        url: row.cloudUrl,
        playbackRate: [1, 1.25, 1.5, 1.75, 2],
        controls: {
          autoHide: false
        }
      })
    },
    // 下载埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.$route.params.id,
        operationType: liveOperationType.type104,
        otherInfo: params.cloudId
      }
      this.$store.dispatch('im/operationLogsWrite', data)
    },
    // 删除回放记录
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
    },
    // 点击视频处理
    onhandleVideoProject() {
      console.log('点击视频处理', this.multipleSelection)
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请选择先视频')
      }
      if (this.multipleSelection.length > 20) {
        return this.$message.error('所选视频数量超过上限（限20个）')
      }
      const videoIds = this.multipleSelection.sort((a, b) => {
        return a.sort - b.sort
      }).reduce((pre, next) => {
        pre.push(next.videoId)
        return pre
      }, [])
      this.videoProjectLoading = true
      const data = {
        videoIds: videoIds,
        projectName: this.detail.name + moment().format('YYYYMMDDHHmmss')
      }
      videoprojectprojectProjectGenerate(data).then(res => {
        const { href } = this.$router.resolve({
          path: `/videoEditorLive?projectId=${res.data}`
        })
        window.open(href, '_blank')
        this.videoProjectLoading = false
      }).catch(() => {
        this.videoProjectLoading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.pagination {
  margin-top: 10px;
  text-align: right;
}
.playbackFun {
  float: left;
  margin-top: 10px;
}
.actionBtn {
  margin-left: 30px;
}
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
