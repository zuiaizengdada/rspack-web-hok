<template>
  <MCard class="page_wrap">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane
        v-if="isShowTabPane('aigc:approve:pendingApproval')"
        :label="'待审批(' + config.total + ')'"
        name="first"
        style="height: 100%"
      >
        <MPageLayout
          v-if="activeName === 'first'"
          ref="MPageLayout"
          type="tablePage"
          class="page_content"
          :slot-arr="slotArr"
          :current-page="config.currentPage"
          :page-sizes="config.pageSizes"
          :page-size="config.pageSize"
          :total="config.total"
          :table-data="config.tableData"
          :table-columns="config.tableColumns"
          :loading="loading"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <template slot="search">
            <filterTop
              :search="search"
              :status="4"
              @onSearch="onSearchFn"
              @onClear="onClear"
            />
          </template>
          <template slot="action" slot-scope="scope">
            <el-button
              v-if="isShowTabPane('aigc:approve:examine')"
              type="text"
              @click="examine(scope.row)"
            >
              审批
            </el-button>
            <el-button type="text" @click="openDetail(scope.row)">
              文案详情
            </el-button>
          </template>
        </MPageLayout>
      </el-tab-pane>
      <el-tab-pane
        v-if="isShowTabPane('aigc:approve:pass')"
        :label="'审核通过(' + config2.total + ')'"
        name="second"
      >
        <MPageLayout
          v-if="activeName === 'second'"
          ref="MPageLayout"
          type="tablePage"
          class="page_content"
          :slot-arr="slotArr"
          :current-page="config2.currentPage"
          :page-sizes="config2.pageSizes"
          :page-size="config2.pageSize"
          :total="config2.total"
          :table-data="config2.tableData"
          :table-columns="config2.tableColumns"
          :loading="loading"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <template slot="search">
            <filterTop
              :search="search"
              :status="5"
              @onSearch="onSearchFn"
              @onClear="onClear"
            />
          </template>
          <template slot="action" slot-scope="scope">
            <!-- <el-button
              type="text"
              @click="videoPreview(scope.row)"
            >
              预览
            </el-button> -->
            <el-button type="text" @click="openDetail(scope.row)">
              文案详情
            </el-button>
          </template>
        </MPageLayout>
      </el-tab-pane>

      <el-tab-pane
        v-if="isShowTabPane('aigc:approve:reject')"
        :label="'审核驳回(' + config3.total + ')'"
        name="third"
      >
        <MPageLayout
          v-if="activeName === 'third'"
          ref="MPageLayout"
          type="tablePage"
          class="page_content"
          :slot-arr="slotArr"
          :current-page="config3.currentPage"
          :page-sizes="config3.pageSizes"
          :page-size="config3.pageSize"
          :total="config3.total"
          :table-data="config3.tableData"
          :table-columns="config3.tableColumns"
          :loading="loading"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <template slot="search">
            <filterTop
              :search="search"
              :status="6"
              @onSearch="onSearchFn"
              @onClear="onClear"
            />
          </template>
          <template slot="action" slot-scope="scope">
            <!-- <el-button
              type="text"
              @click="videoPreview(scope.row)"
            >
              预览
            </el-button> -->
            <el-button type="text" @click="openDetail(scope.row)">
              文案详情
            </el-button>
          </template>
        </MPageLayout>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="预览视频"
      :visible.sync="dialogVisible"
      :before-close="closeVideo"
      width="870px"
      class="video-detail"
      :close-on-click-modal="false"
    >
      <div style="height: 500px">
        <div class="vdc-right">
          <div
            v-show="dialogVisible"
            id="shareVideoDetailPlay"
            class="video_play"
          />
          <div class="zimu_ls">
            <span>{{ nowWzData }}</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeVideo">取 消</el-button>
      </span>
    </el-dialog>
    <copyDetails
      v-if="copyDetailsVisible"
      :id="rowId"
      v-model="copyDetailsVisible"
      :content="content"
      @close="copyDetailsVisible = false"
    />
  </MCard>
</template>
<script>
import filterTop from './components/filterTop.vue'
import { getColumns, getColumns2, getColumns3 } from './components/columns'
import { videoApproveList } from '@/api/aiVideoManage'
import { decryptAES } from '@/utils/crypto'
import copyDetails from '../digitalVideoManage/components/copyDetails.vue'
// const keyVideo = 'hnhokdatacenter0'
export default {
  components: {
    filterTop,
    copyDetails
  },
  data() {
    return {
      decryptAES,
      activeName: '',
      permsList: this.$route?.meta?.permsList || [],
      slotArr: ['action', 'search', 'footer'],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      config2: {
        tableData: [],
        tableColumns: getColumns2.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      config3: {
        tableData: [],
        tableColumns: getColumns3.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      nowWzData: '',
      search: {
        teacherId: '',
        videoName: '',
        plainText: '',
        time: { value: '' }
      },
      dialogVisible: false,
      loading: false,
      copyDetailsVisible: false,
      rowId: '',
      content: '',
      isHead: false
    }
  },
  watch: {
    '$route.params.isShow': {
      handler(val) {
        if (val) {
          this.onSearchFn()
        }
      },
      deep: true
    }
  },
  created() {
    const isTab = this.isShowTabPane('aigc:approve:pendingApproval')
    const isTab2 = this.isShowTabPane('aigc:approve:pass')
    const isTab3 = this.isShowTabPane('aigc:approve:reject')
    this.activeName = isTab
      ? 'first'
      : isTab2
        ? 'second'
        : isTab3
          ? 'third'
          : 'first'
    this.$nextTick(() => {
      if (this.isShowTabPane('aigc:approve:pendingApproval')) {
        this.getList(4)
      }
      if (this.isShowTabPane('aigc:approve:pass')) {
        this.getList(5)
      }
      if (this.isShowTabPane('aigc:approve:reject')) {
        this.getList(6)
      }
    })
  },
  methods: {
    tabClick() {
      this.onClear()
    },
    isShowTabPane(value) {
      return this.permsList.includes(value)
    },
    examine(record) {
      this.$router.push({
        path: '/digitalPerson/examineInfo',
        query: { videoId: record.videoId }
      })
    },
    openDetail(record) {
      this.rowId = record.videoId
      this.content = record.plainText
      this.copyDetailsVisible = true
    },
    // 获取列表
    getList(status) {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        teacherId: this.search.teacherId,
        videoName: this.search.videoName,
        materialType: this.search.materialType,
        createUserId: this.search.userId || undefined,
        approverId: this.search.approverId || undefined,
        status,
        startTime: this.search.time.value
          ? this.search.time.value[0]
          : undefined,
        endTime: this.search.time.value ? this.search.time.value[1] : undefined,
        plainText: this.search.plainText
      }
      videoApproveList(params)
        .then(res => {
          this.loading = false
          if (res.code === 1) {
            if (status === 4) {
              this.config.tableData = res.data.items
              this.config.total = res.data.total
            }
            if (status === 5) {
              this.config2.tableData = res.data.items
              this.config2.total = res.data.total
            }
            if (status === 6) {
              this.config3.tableData = res.data.items
              this.config3.total = res.data.total
            }
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    onSearchFn() {
      this.config.currentPage = 1
      this.getList(
        this.activeName === 'first' ? 4 : this.activeName === 'second' ? 5 : 6
      )
    },
    onClear() {
      this.search = {
        teacherId: '',
        videoName: '',
        time: { value: '' }
      }
      this.onSearchFn()
    },
    closeVideo() {
      this.destroy()
      this.player = null
      this.playerSdk = null
      this.dialogVisible = false
      this.player_create_finish = false
    },
    videoPreview(row) {
      this.dialogVisible = true
      // this.play(this.decryptAES(row.videoUrl, keyVideo))
    },
    play(option) {
      const _this = this
      console.log(this.playerSdk, '视频播放器')
      this.destroy()
        .then(res => {
          setTimeout(() => {
            try {
              // eslint-disable-next-line no-undef
              const playerSdk = new VePlayer({
                id: 'shareVideoDetailPlay',
                width: 788,
                height: 430,
                lang: 'zh',
                autoplayMuted: false,
                url: option,
                controls: {
                  autoHide: false
                },
                autoplay: false,
                sdkErrorPlugin: {
                  errorImg: false
                },
                playbackRate: [0.5, 1, 1.25, 1.5, 2, 3],
                ignores: ['sdkUnmutePlugin', 'DanmuPlugin']
              })
              // 需要在播放器创建完成后再去监听timeupdate事件
              playerSdk.on('player_create_finish', () => {
                console.log('播放器创建完成')
                _this.player_create_finish = true
                _this.player = playerSdk.getPlayerInstance()
                playerSdk.on('timeupdate', player => {
                  this.zimuArr.some(item => {
                    if (
                      player.currentTime >= item.startTime / 1000 &&
                      player.currentTime <= item.endTime / 1000
                    ) {
                      this.nowWzData = item.content
                    }
                  })
                  _this.$emit('timeupdate', player.currentTime)
                })
                playerSdk.on('canplay', player => {
                  // _this.$emit('canplay')
                  _this.playerStatus = 'canplay'
                })
                playerSdk.on('play', () => {
                  _this.playerStatus = 'play'
                })
                playerSdk.on('pause', () => {
                  // console.log('视频播放暂停')
                  _this.playerStatus = 'pause'
                })
                playerSdk.on('ended', () => {
                  // console.log('视频播放结束')
                  _this.playerStatus = 'ended'
                })
                playerSdk.on('playing', () => {
                  // console.log('（暂停、卡顿后）恢复播放')
                  _this.playerStatus = 'play'
                })
                playerSdk.on('error', error => {
                  // _this.$message.error('视频播放错误')
                  console.log('视频播放错误', error)
                  _this.playerStatus = 'error'
                })
              })
              _this.playerSdk = playerSdk
            } catch (err) {
              console.log(err)
            }
          }, 100)
        })
        .catch(err => {
          console.log(err, 'err')
        })
    },
    playVideo() {
      if (
        this.playerSdk?.player?.state === 6 ||
        this.playerSdk?.player?.state === 7
      ) {
        this.playerSdk?.player?.paused
          ? this.player && this.player.pause()
          : this.player && this.player.play()
      }
    },
    // 销毁当前播放器
    destroy() {
      if (!this.playerSdk) {
        return Promise.resolve()
      } else {
        return this.playerSdk.destroy()
      }
    },
    // 分页改变触发
    handleSizeChange(row) {
      this.config.pageSize = row
      this.config.currentPage = 1
      this.getList(
        this.activeName === 'first' ? 4 : this.activeName === 'second' ? 5 : 6
      )
    },
    handleCurrentChange(row) {
      this.config.currentPage = row
      this.getList(
        this.activeName === 'first' ? 4 : this.activeName === 'second' ? 5 : 6
      )
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  min-width: 1200px;
  padding: 20px;
  .page_content {
    @include responsive-height(110px);
  }
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 0px 0px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
.vdc-right {
  //position: relative;
  width: 794px;
  height: 500px;
  float: left;
  margin-left: 19px;
  border-radius: 10px;
  background-image: url('../../../assets/image/video/jx_bg.png');
  background-size: 100% 100%;
  overflow: hidden;
  .video_play {
    margin-top: 35px;
    width: 790px;
    margin-left: 1px;
    height: 443px;
  }
}
</style>
