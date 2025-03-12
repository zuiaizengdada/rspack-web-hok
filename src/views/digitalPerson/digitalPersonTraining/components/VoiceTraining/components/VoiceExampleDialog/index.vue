<template>
  <el-dialog
    :visible.sync="config.visible"
    title="声音训练"
    width="1136px"
    top="10vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div v-loading="loading" class="image-example-wrapper">
      <el-row style="margin-bottom: 20px">
        <el-button
          v-if="
            config.row.trainingStatus === 4 && config.row.purchaseStatus === 0
          "
          :disabled="list.length === 10"
          size="small"
          type="primary"
          @click="openAdd"
        >
          新增声音训练
        </el-button>
        <el-link
          v-if="
            config.row.trainingStatus === 4 && config.row.purchaseStatus === 0
          "
          type="info"
          :underline="false"
          style="margin-left: 10px; font-size: 12px"
        >
          单个声音最多生成10个示例
        </el-link>
      </el-row>
      <div class="image-example-list">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="image-example-col"
        >
          <div class="cover-row">
            <div
              v-if="item.audioUrl"
              :class="[
                'training-result-row',
                item.activeType === 'training' ? 'active' : ''
              ]"
              @click="handleRowClick(item, 'training')"
            >
              <div class="training-result-title">训练结果</div>
              <span
                v-if="item.status === 1"
                style="color: #ff8432"
              >生成中</span>
              <img
                v-else
                :src="
                  item.activeType === 'training'
                    ? require('@/assets/image/play_select.png')
                    : require('@/assets/image/play_noSelect.png')
                "
                alt=""
              />
            </div>
            <div
              v-if="item.voiceAudioUrl"
              :class="[
                'source-audio-row',
                item.activeType === 'source' ? 'active' : ''
              ]"
              @click="handleRowClick(item, 'source')"
            >
              <div class="source-audio-title">源音频</div>
              <img
                :src="
                  item.activeType === 'source'
                    ? require('@/assets/image/play_select.png')
                    : require('@/assets/image/play_noSelect.png')
                "
                alt=""
              />
            </div>
          </div>
          <div class="info-col">
            <div class="r-col">
              <div>
                <span>状态：</span>
                <span :style="{ color: colors[item.status] }">
                  {{
                    item.status === 1
                      ? '生成中'
                      : item.status === 2
                        ? '生成失败'
                        : item.status === 3
                          ? '已生成'
                          : '草稿'
                  }}
                </span>
              </div>
              <el-button
                v-if="
                  config.row.trainingStatus === 4 &&
                    config.row.purchaseStatus === 0 &&
                    item.status === 4
                "
                v-permission="['digitalPerson:VoiceTraining:edit', permsList]"
                plain
                type="primary"
                style="
                  width: 38px;
                  height: 17px;
                  padding: 1px 0 0;
                  font-size: 12px;
                  margin-left: 4px;
                "
                @click="openEdit(item)"
              >
                编辑
              </el-button>
            </div>
            <div class="time-col">
              <span>{{ moment(item.createTime).format('YYYY-MM-DD') }}</span>
            </div>
            <div class="r-col">
              <span>创建人：{{ item.createUserName || '-' }}</span>
            </div>
            <div class="r-col">
              <span>最后操作人：{{ item.operatorName || '-' }}</span>
            </div>
          </div>
        </div>
        <el-row
          v-if="list.length < 1"
          type="flex"
          justify="center"
          style="width: 100%"
        >
          <el-empty description="暂无数据" />
        </el-row>
      </div>
    </div>
    <addExample v-model="isShowDialog" :row="info" @success="getList()" />
    <VoicePreviewDialog v-if="previewConfig.visible" :config="previewConfig" />
  </el-dialog>
</template>

<script>
import moment from 'moment'
import { decryptAES } from '@/utils/crypto'
import { getVoiceTrainingExampleList } from '@/api/aiVideoManage/training'
import addExample from '../addExample/index.vue'
const keyVideo = 'hnhokdatacenter0'
import VoicePreviewDialog from '../VoicePreviewDialog/index.vue'

export default {
  name: 'VoiceExampleDialog',
  components: { addExample, VoicePreviewDialog },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          type: 1,
          row: {},
          visible: false
        }
      }
    },
    permsList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      moment,
      isAddDialogVisible: false,
      loading: false,
      list: [],
      info: {},
      colors: {
        1: '#FF8432',
        2: 'red',
        3: '#00B42A',
        4: '#979797'
      },
      currentAudio: null,
      currentPlayingId: null,
      isShowDialog: false,
      previewConfig: {
        visible: false,
        row: {}
      }
    }
  },
  watch: {
    'previewConfig.visible': {
      handler(newVal) {
        if (!newVal && this.currentAudio) {
          this.currentAudio.pause()
          this.currentAudio.currentTime = 0
          this.currentAudio = null
          this.list.forEach(item => {
            this.$set(item, 'activeType', '')
          })
        }
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    decryptAES,
    openVideo(url) {
      if (url) {
        this.$Videoplayer({
          src: this.decryptAES(url, keyVideo),
          videoName: '视频预览'
        })
      }
    },
    getList() {
      this.loading = true
      getVoiceTrainingExampleList({ id: this.config.row.id })
        .then(res => {
          this.loading = false
          this.list = res.data.map(item => ({
            ...item,
            activeType: ''
          }))
        })
        .catch(() => {
          this.loading = false
        })
    },
    openEdit(record) {
      this.info = {
        ...record,
        trainingId: this.config.row.id
      }
      this.isShowDialog = true
    },
    handlePlayAudio(item) {
      if (!item.voiceAudioUrl) {
        return this.$message.warning('当前声音训练未生成音频')
      }

      if (this.currentPlayingId === item.id) {
        this.currentAudio.pause()
        this.currentPlayingId = null
        return
      }

      if (this.currentAudio) {
        this.currentAudio.pause()
      }

      this.currentAudio = new Audio(item.voiceAudioUrl)
      this.currentAudio.addEventListener('ended', () => {
        this.currentPlayingId = null
      })
      this.currentAudio.play()
      this.currentPlayingId = item.id
    },
    beforeDestroy() {
      if (this.currentAudio) {
        this.currentAudio.pause()
        this.currentAudio = null
      }
    },
    openAdd() {
      this.info = { ...this.config.row, trainingId: this.config.row.id }
      delete this.info.id
      const draftInfo = this.list.find(f => f.status === 4)
      if (draftInfo) {
        this.info = {
          ...draftInfo,
          trainingId: this.config.row.id
        }
      }
      this.isShowDialog = true
    },
    openPreview(item) {
      this.previewConfig.visible = true
      this.previewConfig.row = item
    },
    handleRowClick(item, type) {
      if (this.currentAudio) {
        this.currentAudio.pause()
        this.currentAudio.currentTime = 0
        this.currentAudio = null
      }

      this.list.forEach(i => {
        this.$set(i, 'activeType', '')
      })

      if (!item.audioUrl && type === 'source') {
        this.$set(item, 'activeType', 'source')
      } else {
        if (item.activeType === type) {
          this.$set(item, 'activeType', '')
        } else {
          this.$set(item, 'activeType', type)
        }
      }
      this.openPreview(item)
    }
  }
}
</script>
<style lang="scss" scoped>
.image-example-wrapper {
  position: relative;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #e5e5e5;
    transition: all 0.4s ease;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
  .image-example-list {
    display: flex;
    flex-wrap: wrap;
    gap: 26px;
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
    .image-example-col {
      width: 192px;
      height: 216px;
      flex-shrink: 0;
      border-radius: 4px;
      border: 1px solid #e7e7e7;
      background: #fbfbfb;
      .cover-row {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;

        .training-result-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #e7e7e7;
          border-radius: 7px;
          padding: 10px;
          cursor: pointer;

          .training-result-title {
            font-size: 12px;
            color: #010101;
          }

          img {
            width: 24px;
            height: 24px;
          }
        }

        .source-audio-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #e7e7e7;
          border-radius: 7px;
          padding: 10px;
          cursor: pointer;

          .source-audio-title {
            font-size: 12px;
            color: #010101;
          }

          img {
            width: 24px;
            height: 24px;
          }
        }

        .active {
          border: none;
          background: #eff5ff;
        }
      }
      .info-col {
        width: 100%;
        padding: 0 12px 5px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        .r-col {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #000000;
          font-family: 'Microsoft YaHei';
          font-size: 12px;
        }
        .time-col {
          color: #999999;
          font-family: 'Microsoft YaHei';
          font-size: 12px;
        }
      }
    }
  }
}
::v-deep {
  .el-dialog__header {
    padding-bottom: 20px;
    border-bottom: 1px solid #e7e7e7;
    .el-dialog__title {
      font-size: 16px;
      color: #000;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }
  .el-dialog__body {
    padding: 20px 36px;
  }
}
</style>
