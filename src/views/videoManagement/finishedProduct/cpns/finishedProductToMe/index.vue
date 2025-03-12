<template>
  <div class="finished-product-tome hoc-main-height">
    <MPageLayout
      ref="desensitizationMpageRef"
      type="tablePage"
      class="desensitization-table"
      :slot-arr="config.slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      table-index-width="62px"
      :row-class-name="tableRowClassName"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="search">
        <form-search ref="tableSearch" @search="handleSearch" />
      </template>
      <template slot="startDate" slot-scope="scope">
        <span class="txt">
          {{ scope.row.startDate }}
        </span>
      </template>
      <template slot="teacherName" slot-scope="scope">
        <span class="txt">
          {{ scope.row.teacherName || '--' }}
        </span>
      </template>
      <template slot="size" slot-scope="scope">
        <p>{{ scope.row.size | filterSize }}</p>
      </template>
      <template slot="action" slot-scope="scope">
        <div>
          <el-button type="text" @click="toShowDetail(scope.row)">
            详情
          </el-button>
          <el-button type="text" @click="toPublishVideo(scope.row)">
            一键发布
          </el-button>
        </div>
      </template>
    </MPageLayout>
    <finishedVideoDetailVue
      ref="finsiedShowDetail"
      :detail="showDetailObject"
      detail-type="finishedProductToMe"
      @reloadData="getTableInfo"
    />
    <DownloadModal ref="DownloadModal" />
  </div>
</template>

<script>
import {
  getDeliveryToMePageListApi,
  queryWeMediaVideoInfo
} from '@/api/videoManagement/vedioSetting'
import { getHasAccountAndList } from '@/api/videoManagement/accountManage'
import { MeTableJson } from '../data'
import { mapGetters } from 'vuex'

import formSearch from './cpns/formSearch.vue'
import finishedVideoDetailVue from '../finishedProductMy/cpns/finishedVideoDetail.vue'
import DownloadModal from '@/components/DownloadModal/index.vue'
export default {
  name: 'CoOpProtocolAudit',
  components: {
    formSearch,
    finishedVideoDetailVue,
    DownloadModal
  },
  data() {
    return {
      showDetailObject: {},
      reqHistory: {},
      tabs: [
        { label: '待审核', name: 'finish' },
        { label: '审核通过', name: 'finished' },
        { label: '审核驳回', name: 'unfinish' }
      ],

      // MPageLayout 配置
      loading: false,
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        tableColumns: MeTableJson.columns,
        slotArr: MeTableJson.slotArr
      }
    }
  },
  computed: {
    ...mapGetters(['isNewSocketVideoPublish'])
  },
  created() {
    this.getTableInfo(true)
  },
  methods: {
    async getTableInfo(flag) {
      this.loading = true
      try {
        const req = this.$refs?.tableSearch?.searchInfo() || {}
        const { data } = await getDeliveryToMePageListApi({
          ...req,
          pageSize: this.config.pageSize,
          pageIndex: this.config.currentPage
        })
        this.$set(this.config, 'tableData', data.items || [])
        this.$set(this.config, 'total', data.total)
        this.reqHistory = req
        this.$nextTick(() => {
          this.$refs.desensitizationMpageRef.doLayout()
        })
      } catch (error) {
        console.log('error------getTableInfo', error)
      }
      this.loading = false
    },
    // MPageLayout
    tableRowClassName({ row, rowIndex }) {
      if (row.assetId === this.currentIndex) {
        return 'highlight-row'
      }
      return ''
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getTableInfo()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getTableInfo()
    },
    handleSearch() {
      this.config.currentPage = 1
      this.getTableInfo()
    },
    // MPageLayout --end
    toShowDetail(row) {
      this.showDetailObject = row
      this.$refs.finsiedShowDetail.show(row)
      this.$refs.finsiedShowDetail.loadZm(row)
    },
    async toPublishVideo(row) {
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'publishByOneClick'
      )
      if (!res) {
        const isSocket = this.isNewSocketVideoPublish
        this.$uweb && this.$uweb.setAction('Event_videoManage_publishVideo')
        if (isSocket) {
          getHasAccountAndList().then(async res => {
            if (res.success) {
              if (res.data.length <= 0) {
                this.$message.error('暂无账号，请先添加账号')
                return
              } else {
                // 检测是否是否需要同步数据且今天已经同步过了
                const syncRes = await this.$store.dispatch(
                  'videoManage/syncCheck',
                  {}
                )
                if (syncRes) {
                  if (row.sensitiveWordStatus === '3') {
                    let mgcStr = ''
                    row.sensitives.some(item => {
                      mgcStr += item + '，'
                    })
                    mgcStr = mgcStr.substring(0, mgcStr.length - 1)
                    const strMgc =
                      '成品视频包含敏感词：{' +
                      mgcStr +
                      '}，可能会触及发布平台风控规则，是否继续发布？'
                    this.$confirm(strMgc, '敏感词提醒', {
                      confirmButtonText: '继续',
                      cancelButtonText: '取消',
                      type: 'warning'
                    })
                      .then(async () => {
                        console.log(row, 222222222)
                        await this.queryWeMediaVideoInfoFn(row)
                      })
                      .catch(() => {
                        this.$message({
                          type: 'info',
                          message: '已取消'
                        })
                      })
                  } else {
                    await this.queryWeMediaVideoInfoFn(row)
                  }
                }
              }
            }
          })
        } else {
          this.$refs.DownloadModal.show()
        }
      }
    },
    async queryWeMediaVideoInfoFn(row) {
      const res = await queryWeMediaVideoInfo({
        finishVideoId: row.originalFinishVideoId,
        orgId: row.supplierOrgId
      })
      const { width } = res.data
      if (width) {
        this.$router.push({
          path: `/videoManagement/videoPublish?finishVideoId=${row.originalFinishVideoId}&orgId=${row.supplierOrgId}`,
          query: {
            prevPath: this.$route.path
          }
        })
      } else {
        this.$message.error('视频正在处理中，请稍等...')
      }
    },
    goPage(name, query = {}) {
      this.$router.push({
        name: name,
        query
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.red {
  color: #ff2020;
}
.pl6 {
  padding-left: 6px;
}
.txt {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}
.finished-product-tome {
  @include responsive-height(82px);
  min-width: 1100px;
  width: 100%;
  background: #fff;
  padding: 0;
  border-radius: 10px;
  /* .table-cnt {
    height: calc(100% - 60px);
  } */
}
::v-deep .el-table .cell {
  font-weight: 500;
  font-size: 14px;
  color: #333;
}
</style>
