<template>
  <div class="origin-container">
    <MPageLayout
      ref="MPageLayout"
      :slot-arr="slotArr"
      type="tablePage"
      :current-page="currentPage"
      :page-size="config.pageSize"
      :total="total"
      :table-data="tableData"
      :table-columns="tableColumns"
      class="hk-table"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <list-form
        slot="search"
        ref="searchForm"
        :columns="tableColumns"
        :loading="loading"
        @search="getVideoList"
        @change="tableHeaderChange"
      />
      <div slot="videoNameList" slot-scope="{ row }">
        <div class="video-show-block">
          <div
            v-for="(item, index) in computedVideoNameList(row.videoList)"
            :key="index"
          >
            <div class="left-title">
              <div v-if="item.isEmptyMirror === 1" class="emptyScene">空镜</div>
              <el-tooltip :content="item.videoName" placement="bottom" effect="light">
                <span class="block truncate hover-p" @click="showVideoDetail(item,row)">{{ item.videoName }}</span>
              </el-tooltip>
            </div>
            <div class="img-title">
              <showImgCom :statusd="item" />
            </div>
          </div>
        </div>
        <a
          v-if="row.videoList && row.videoList.length > 3"
          href="javascript:void(0)"
          style="color: #0c6fff"
          class="cursor-pointer"
          @click="handleClickMoreVideoName(row)"
        >
          更多({{ row.videoList && row.videoList.length - 3 }})...
        </a>
      </div>
      <div slot="shareTotal" slot-scope="{ row }">
        <p style="text-align: center; padding-right: 25px">
          {{ row.shareTotal ? row.shareTotal : 0 }}/{{
            row.desensitizedVideoTotal ? row.desensitizedVideoTotal : 0
          }}/{{ row.total ? row.total : 0 }}
        </p>
      </div>
      <div slot="createTime" slot-scope="{ row }">
        <p>{{ DateFormat(new Date(row.createTime), 'yyyy-MM-dd hh:mm:ss') }}</p>
      </div>
      <div slot="action" slot-scope="{ row }" class="flex justify-start">
        <div v-if="visibleEditBtn(row, 'edit')">
          <el-button
            v-show="visibleEditBtn(row, 'detail')"
            type="text"
            @click="handleClickActionButtonToDetail(row)"
          >
            详情
          </el-button>
          <el-button
            v-if="row.transferStatus === 1"
            type="text"
            @click="toZhuanzuQueren(row)"
          >
            转组确认
          </el-button>
          <el-button
            v-show="visibleEditBtn(row, 'edit')"
            v-if="filterList(row.videoList)"
            type="text"
            @click="toDesensitizationVideo(row)"
          >
            脱敏
          </el-button>
          <el-dropdown
            v-show="visibleEditBtn(row, 'edit')"
            style="padding-top: 6px"
          >
            <span class="m-l-10" style="color: #0c6fff; cursor: pointer">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <p @click="handleClickActionButton(row, actionButtons[2])">
                  编辑
                </p>
              </el-dropdown-item>
              <el-dropdown-item>
                <p
                  type="text"
                  @click="handleClickActionButton(row, actionButtons[1])"
                >
                  上传
                </p>
              </el-dropdown-item>
              <el-dropdown-item>
                <p
                  v-show="visibleEditBtn(row, 'detail')"
                  type="text"
                  @click="toShowVideoUseStas(row)"
                >
                  统计
                </p>
              </el-dropdown-item>
              <el-dropdown-item>
                <p
                  v-permission="['web:desensiti:transmit', permsList]"
                  type="text"
                  @click="transmitVideo(row)"
                >
                  转交
                </p>
              </el-dropdown-item>
              <el-dropdown-item>
                <p
                  v-permission="['web:desensiti:log', permsList]"
                  type="text"
                  @click="videoLogging(row)"
                >
                  日志记录
                </p>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="row.pushFlag === 0"
              >
                <p
                  type="text"
                  @click="cancelTips(row)"
                >
                  取消提醒
                </p>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-else>
          <el-button
            v-show="visibleEditBtn(row, 'detail')"
            type="text"
            @click="handleClickActionButtonToDetail(row)"
          >
            详情
          </el-button>
          <!-- <el-button v-show="visibleEditBtn(row,'detail')" type="text" @click="toShowVideoUseStas(row)">统计</el-button>
          <el-button type="text" @click="handleClickActionButton(row,{ type: 'upload', name: '上传视频', link: '/videoManagement/originalVideoUpload/' })">上传</el-button> -->
          <el-dropdown
            v-show="visibleEditBtn(row, 'detail')"
            style="padding-top: 6px"
          >
            <span class="m-l-10" style="color: #0c6fff; cursor: pointer">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <p
                  type="text"
                  @click="handleClickActionButton(row, actionButtons[1])"
                >
                  上传
                </p>
              </el-dropdown-item>
              <el-dropdown-item>
                <p
                  v-show="visibleEditBtn(row, 'detail')"
                  type="text"
                  @click="toShowVideoUseStas(row)"
                >
                  统计
                </p>
              </el-dropdown-item>
              <el-dropdown-item>
                <p
                  v-permission="['web:desensiti:transmit', permsList]"
                  type="text"
                  @click="transmitVideo(row)"
                >
                  转交
                </p>
              </el-dropdown-item>
              <el-dropdown-item>
                <p
                  v-permission="['web:desensiti:log', permsList]"
                  type="text"
                  @click="videoLogging(row)"
                >
                  日志记录
                </p>
              </el-dropdown-item>
              <el-dropdown-item>
                <p
                  v-if="visibleGodetails(row)"
                  type="text"
                  @click="toDesensitizeDetails(row)"
                >
                  查看脱敏详情
                </p>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </MPageLayout>
    <drawer-more-video
      :visible.sync="visibleDrawAllVideoName"
      :list="videoNameList"
    />
    <DrawerMoreUseStats
      :visible.sync="visibleDrawUseStats"
      :obj="nowClickRow"
    />
    <transferAccount
      ref="transferAccount"
      :account-info="accountInfo"
      @refresh="getListForSearch"
    />
    <logging ref="logging" :account-info="accountInfo" />
  </div>
</template>

<script>
const ISPAGESEARCH = true
import ListForm from './components/ListForm.vue'
import { videoGroupDataList } from '@/api/videoManagement/origin'
import { originColumns } from './columns'
import DrawerMoreVideo from './components/DrawerMoreVideo.vue'
import DrawerMoreUseStats from '@/views/videoManagement/desensitized/originalVideo/components/DrawerMoreUseStats'
import showImgCom from '@/views/videoManagement/desensitized/desensitizationVideo/components/showImgCom.vue'
import transferAccount from './components/transferAccount'
import logging from './components/logging'
import { mapGetters } from 'vuex'
import { DateFormat } from '@/utils/index'
import AppVideo from '@/components/AppVideo'
import { setInvalidVideo } from '@/api/videoManagement/subtitleEditor'
import { toDesensitized, reprocessVideo, getUpdatePushFlag, transferVideoGroupConfirm } from '@/api/product/videoManager'

export default {
  components: {
    ListForm,
    DrawerMoreVideo,
    DrawerMoreUseStats,
    transferAccount,
    logging,
    showImgCom
  },
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      nowClickRow: {},
      accountInfo: {},
      showDetailInfo: null,
      visibleDrawUseStats: false,
      loading: false,
      slotArr: [
        'action',
        'videoNameList',
        'createTime',
        'shareTotal',
        'search',
        'headerRight'
      ],
      config: {
        pageSize: 10,
        pageIndex: 1
      },
      currentPage: 1,
      total: 0,
      tableColumns: originColumns,
      visibleDrawAllVideoName: false,
      tableData: [],
      videoNameList: [],
      actionButtons: [
        {
          type: 'detail',
          name: '详情',
          link: '/videoManagement/originalVideoDetail/'
        },
        {
          type: 'upload',
          name: '上传视频',
          link: '/videoManagement/originalVideoUpload/'
        },
        {
          type: 'edit',
          name: '编辑',
          link: '/videoManagement/originalVideoEdit/'
        }
      ],
      userId: ''
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    $route() {
      this.getVideoList()
    }
  },
  mounted() {
    const list = JSON.parse(localStorage.getItem('originInfoColumns'))
    this.tableColumns = list || originColumns
    this.userId = this.userInfo.userId
  },
  methods: {
    DateFormat,
    getListForSearch() {
      this.getVideoList()
    },
    // 转交视频组
    transmitVideo(row) {
      this.accountInfo = row
      console.log(this.accountInfo, 'accountInfo')
      this.$nextTick(() => {
        this.$refs.transferAccount.show()
      })
    },
    visibleGodetails(row) {
      console.log(row.videoList, '是否有按钮')
      // manualDesensitizedStatus
      // 如果全部是空镜素材且分享状态为1的时候返回true
      return row?.videoList?.some(
        item => item.manualDesensitizedStatus === 2 && item.isEmptyMirror !== 1
      )
    },
    // 查看脱敏详情
    toDesensitizeDetails(row) {
      console.log(row, 'row')
      const videoGroupId = row.videoGroupId
      const videoGroupName = row.name
      const toTaskLog = this.$router.resolve({
        path: `/showSemiVideoDetail/${videoGroupId}?videoType=2&isVideoList=true&videoGroupName=${videoGroupName}`
      })
      window.open(toTaskLog.href, '_blank')
    },
    filterList(list) {
      if (!list) {
        return true
      }
      // 如果所有的都是isEmptyMirror=1，或者isInvalid =1
      const res = list.every(item => item.isEmptyMirror === 1)
      return !res
    },
    // 日志记录
    videoLogging(row) {
      this.accountInfo = row
      this.$nextTick(() => {
        this.$refs.logging.show()
      })
    },
    cancelTips(row) {
      this.$confirm('此操作关闭本视频组的企微提醒！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          pushFlag: 1,
          videoGroupId: row.videoGroupId
        }
        getUpdatePushFlag(params).then(res => {
          if (res.code === 1) {
            this.$message.success('取消提醒成功！')
            this.getVideoList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    toShowVideoUseStas(row) {
      this.nowClickRow = row
      this.visibleDrawUseStats = true
    },
    showVideoDetail(item, row) {
      console.log(item, '脱敏状态')
      console.log(row, this.userId, '当前点击的')
      this.showDetailInfo = row
      const that = this
      // videoplayer.play({
      //   visible: true,
      //   url: item.videoUrl,
      //   videoName: item.name,
      //   videoId: item.partId,
      //   // autoplayMuted: true,
      //   autoplay: false
      // })
      AppVideo.play({
        visible: true,
        url: item.url,
        videoName: item.videoName,
        videoId: item.id,
        idForVideo: item.videoid,
        videoType: 0,
        closeOnPressEscape: true,
        videoInfo: { ...item,
          statusList: [{ name: '自动脱敏中', class: 'orange', icon: 'el-icon-warning' }, { name: '已自动脱敏', class: 'green', icon: 'el-icon-success' }, { name: '自动脱敏失败', class: 'red', icon: 'el-icon-error' }],
          isMe: that.userId === row.createUserId,
          cancelInvalid: (res) => {
            that.cancelInvalid(res)
          },
          handleClickReload: (res) => {
            that.handleClickReload(res)
          },
          toDesensitizationVideo: (res) => {
            that.toDesensitizationVideo1(res)
          },
          reForChuli: (res) => {
            that.reForChuli(res)
          }
        },
        isShowBtnList: true,
        autoplay: false
      })
    },
    // 取消无效素材
    async cancelInvalid(data) {
      await setInvalidVideo({ originalVideoId: data.videoid, type: 2 })
      AppVideo.close()
      this.getVideoList()
    },
    async handleClickReload(data) {
      await toDesensitized({ originalVideoId: data.videoid })
      // AppVideo.close()
      this.getVideoList()
    },
    async reForChuli(data) {
      await reprocessVideo({ desensitizedId: data.videoid })
      AppVideo.close()
      this.getVideoList()
    },
    toDesensitizationVideo1(data) {
      AppVideo.close()
      this.$router.push(`/subtitleEditor/${this.showDetailInfo.videoGroupId}?videoGroupName=${this.showDetailInfo.title}&toZimuOriginalVideoId=${data.videoid}`)
    },
    async getVideoList(isPageSearch) {
      this.config.pageIndex = isPageSearch ? this.config.pageIndex : 1
      const params = Object.assign({}, this.$refs.searchForm.form)
      console.log(params, 'paramsdata')
      params.startTime = (params.timeArray?.length && params.timeArray !== null) ? params?.timeArray[0] : ''
      params.endTime = (params.timeArray?.length && params.timeArray !== null) ? params?.timeArray[1] : ''
      delete params.timeArray
      try {
        this.loading = true
        const { data } = await videoGroupDataList({ ...params, ...this.config })
        const { items, total, pageIndex } = data
        this.tableData = items
        this.total = total
        this.loading = false
        this.currentPage = pageIndex
        this.$nextTick(() => {
          this.$refs.MPageLayout.doLayout()
        })
      } catch (err) {
        console.log(err)
      }
    },

    handleClickActionButton(row, item) {
      const { videoGroupId } = row
      const url = item.link + videoGroupId
      this.$router.push(url)
    },
    toZhuanzuQueren(row) {
      const str = '你的【' + row.title + '】视频组，正在被【' + row.transferUserName + '】转给【' + row.newCreateUserName + '】,请确认是否转出！'
      this.$confirm(str, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          videoGroupId: row.videoGroupId
        }
        transferVideoGroupConfirm(params).then(res => {
          if (res.code === 1) {
            this.$message.success('确认成功！')
            this.getVideoList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    handleClickActionButtonToDetail(row) {
      this.$router.push({
        path: `/videoManagement/desensitizationVideoDetail?videoGroupId=${row.videoGroupId}`
      })
    },
    handleClickMoreVideoName(row) {
      this.visibleDrawAllVideoName = true
      const list = []
      row.videoList.forEach(item => {
        list.push({
          name: item.videoName
        })
      })
      this.videoNameList = row.videoList
    },
    computedVideoNameList(list) {
      if (list) {
        return list.length > 3 ? list.slice(0, 3) : list
      }
    },
    async toDesensitizationVideo(row) {
      if (!row.videoList || row.videoList.length === 0) {
        this.$message.error('请先上传视频')
        return
      }
      if (
        row.videoList.every(
          item => item.isEmptyMirror === 1 || item.isInvalid === 1
        )
      ) {
        this.$message({
          type: 'error',
          message: '该视频组全部为无效素材，可点击‘详情’取消无效素材后继续脱敏'
        })
        return
      }
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'desensitization'
      )
      if (!res) {
        const videoGroupId = row.videoGroupId
        const videoGroupName = row.name
        this.$router.push(
          `/subtitleEditor/${videoGroupId}?videoGroupName=${videoGroupName}`
        )
      }
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.getVideoList(ISPAGESEARCH)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.config.pageIndex = val
      this.getVideoList(ISPAGESEARCH)
    },
    tableHeaderChange(list) {
      this.tableColumns = list
      this.$nextTick(() => {
        this.$refs.MPageLayout.doLayout()
      })
    },
    visibleEditBtn(item, type) {
      if (type === 'edit') {
        if (this.userId === item.createUserId) {
          return true
        } else {
          return false
        }
      }
      if (type === 'detail') {
        return true
      }
      // return type === 'edit' ? this.userId === item.createUserId : true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.origin-container {
  @include responsive-height(20px);
}
.form-filter {
  border-bottom: 1px solid #e7e7e7;
  margin-bottom: 20px;
}
::v-deep .my-table .el-table::before,
.el-table--group::after,
.el-table--border::after {
  background-color: #fff;
}
::v-deep .el-table__fixed-right {
  background-color: #fff;
  border: none !important;
}
::v-deep .tablePage .page_footer {
  justify-content: flex-end;
  box-shadow: none;
  padding: 6px 0px 4px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}

.left-title {
  float: left;
  width: 180px;
  height: 30px;
  display: flex;
  align-items: center;
  .emptyScene {
    width: 40px;
    height: 18px;
    background: #52d3b6;
    border-radius: 4px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 17px;
    text-align: center;
    margin-right: 5px;
  }
  .img-title {
    width: 180px;
  }
}

.img-title {
  float: left;
  width: 110px;
  height: 30px;
}

.video-show-block {
  float: left;
}

.hover-p {
  cursor: pointer;
  width: 100%;
}

.hover-p:hover {
  color: #0c6fff;
}
</style>
