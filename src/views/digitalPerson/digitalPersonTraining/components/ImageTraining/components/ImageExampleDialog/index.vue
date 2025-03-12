<template>
  <!-- 形象示例 -->
  <el-dialog
    title="形象示例"
    :visible.sync="getDialogVisible"
    width="1260px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="dialogBeforeClose"
  >
    <div v-loading="loading" class="image-example-wrapper">
      <el-row>
        <el-button
          v-if="row.trainingStatus === 4 && row.purchaseStatus === 0"
          :disabled="list.length >= 10"
          size="small"
          type="primary"
          @click="openAdd"
        >
          生成示例
        </el-button>
        <el-link
          v-if="row.trainingStatus === 4 && row.purchaseStatus === 0"
          type="info"
          :underline="false"
        >
          生成示例也会消耗生成视频时长，请按需生成！单个形象最多生成10个示例，
          生成示例效果可以就可以采购，采购后所有可使用数字人的人员都可以使用此形象在数字人菜单中
          生成视频。
        </el-link>
      </el-row>
      <div class="image-example-list">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="image-example-col"
          :style="{
            'margin-right': (index + 1) % 4 === 0 ? '0' : '18px'
          }"
        >
          <div class="cover-row">
            <!-- <video
              v-if="item.videoUrl"
              :src="item.videoUrl"
              controls
              controlslist="nodownload"
              preload="auto"
            /> -->
            <div
              class="cover-img"
              :style="{
                'background-image': 'url(' + row.photoUrl + ')'
              }"
              @click="openVideo(item.videoUrl)"
            >
              <img
                v-if="item.videoUrl"
                src="@/assets/image/aigc/digitalVideoManage/play_icon.png"
                alt=""
              />
            </div>
          </div>
          <div class="info-col">
            <div class="flex flex-between" style="margin-bottom: 10px">
              <div class="r-col">
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
              <div class="time-col">
                <span>{{ moment(item.createTime).format('YYYY-MM-DD') }}</span>
                <el-button
                  v-if="
                    row.trainingStatus === 4 &&
                      row.purchaseStatus === 0 &&
                      item.status === 4
                  "
                  plain
                  type="primary"
                  style="
                    width: 38px;
                    height: 24px;
                    padding: initial;
                    margin-left: 4px;
                  "
                  @click="openEdit(item)"
                >
                  编辑
                </el-button>
              </div>
            </div>
            <div class="flex flex-between">
              <div class="r-col">
                <span>创建人：{{ item.createUserName || '-' }}</span>
              </div>
              <div class="r-col">
                <span>最后操作人：{{ item.operatorName || '-' }}</span>
              </div>
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
    <div slot="footer" />
    <add
      ref="add"
      v-model="isAddDialogVisible"
      :row="info"
      @success="getList"
    />
  </el-dialog>
</template>

<script>
import add from './add.vue'
import { getTrainingExampleList } from '@/api/aiVideoManage'
import moment from 'moment'
import { decryptAES } from '@/utils/crypto'
const keyVideo = 'hnhokdatacenter0'
export default {
  name: 'ImageExampleDialog',
  components: {
    add
  },
  model: {
    prop: 'dialogVisible',
    event: 'change'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
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
      }
    }
  },
  computed: {
    getDialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
  watch: {
    getDialogVisible(val) {
      if (val) {
        this.getList()
      }
    }
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
      getTrainingExampleList({ id: this.row.id })
        .then(res => {
          this.loading = false
          this.list = res.data && res.data.length ? [...res.data] : []
        })
        .catch(() => {
          this.loading = false
        })
    },
    openEdit(record) {
      this.info = {
        ...record,
        characterId: this.row.characterId,
        videoUrl: record.characterVideoUrl,
        id: record.id
      }
      this.isAddDialogVisible = true
    },
    openAdd() {
      if (this.list.length >= 10) {
        this.$message.warning('单个形象最多生成10个示例')
        return
      }
      this.info = { ...this.row, trainingId: this.row.id }
      delete this.info.id
      const draftInfo = this.list.find(f => f.status === 4)
      if (draftInfo) {
        this.info = {
          ...draftInfo,
          characterId: this.row.characterId,
          videoUrl: draftInfo.characterVideoUrl,
          id: draftInfo.id,
          trainingId: this.row.id
        }
      }
      this.isAddDialogVisible = true
    },
    dialogBeforeClose() {
      this.$emit('change', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.image-example-wrapper {
  position: relative;
  max-height: 600px;
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
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .image-example-col {
      width: 280px;
      margin-top: 20px;
      .cover-row {
        width: 100%;
        height: 159px;
        border-radius: 4px;
        background-color: #e5e5e5;
        cursor: pointer;
        video {
          border-radius: 4px;
          width: 100%;
          height: 100%;
        }
        .cover-img {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
          img {
            width: 26px;
            height: 26px;
          }
        }
      }
      .info-col {
        width: 100%;
        padding: 14px 12px;
        border-radius: 0 0 4px 4px;
        border: 1px solid #e7e7e7;
        .r-col {
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
