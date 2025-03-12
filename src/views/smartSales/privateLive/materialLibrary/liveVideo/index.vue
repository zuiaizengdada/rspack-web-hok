<template>
  <MCard class="page_wrap">
    <!-- <columns-customer /> -->
    <filterTop
      :nav-type="navType"
      :search.sync="search"
      @onUpload="onUpload"
      @onSearch="searchFn"
      @onClear="onClear"
      @onnavTypeChange="onnavTypeChange"
    />
    <el-table
      v-show="navType === 1"
      ref="MPageLayout"
      v-loading="loading"
      type="tablePage"
      tooltip-effect="dark"
      height="100%"
      class="element-table-list"
      style="width: 100%"
      :header-cell-style="{ background: '#f5f5f5' }"
      :data="config.tableData"
    >
      <el-table-column label="视频课件ID" prop="videoId" width="150px" />
      <el-table-column
        label="视频名称"
        prop="videoName"
        width="150px"
        show-overflow-tooltip
      />
      <el-table-column
        label="关联讲师"
        prop="teacherName"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <span> {{ row.teacherName || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="视频来源" prop="videoSource" width="120px">
        <template slot-scope="{ row }">
          <span> {{ $getdictName('VIDEO_SOURCE', row.videoSource) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="视频分辨率" prop="code" width="100px">
        <template slot-scope="{ row }">
          <template v-if="row.width && row.height">
            {{ `${row.width}*${row.height}` }}
          </template>
          <!-- <template v-else>
            --
          </template> -->
        </template>
      </el-table-column>
      <el-table-column label="视频时长" prop="duration" width="150px">
        <template slot-scope="{ row }">
          <span v-if="typeof row.duration === 'number'">{{
            secondIsLiveDuration(row.duration)
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="视频格式" prop="format" width="80px" />

      <el-table-column label="初剪导出状态" prop="exportStatus" width="130px">
        <template slot-scope="{ row }">
          <div
            v-if="row.videoSource === 2 && [1, 2, 3].includes(row.exportStatus)"
          >
            <svg-icon
              class-name="size-icon"
              :icon-class="
                { 1: 'audit_wait', 2: 'audit_success', 3: 'audit_fail' }[
                  row.exportStatus
                ]
              "
            />
            {{
              { 1: '导出中', 2: '导出成功', 3: '导出失败' }[row.exportStatus]
            }}
          </div>
          <template v-else>——</template>
        </template>
      </el-table-column>
      <el-table-column
        label="媒体处理状态"
        prop="mediaProcessTaskStatus"
        width="130px"
      >
        <template slot-scope="{ row }">
          <div v-if="[0, 1, 2].includes(row.exportStatus)">
            <svg-icon
              class-name="size-icon"
              :icon-class="
                { 0: 'audit_wait', 1: 'audit_success', 2: 'audit_fail' }[
                  row.mediaProcessTaskStatus
                ]
              "
            />
            {{
              { 0: '处理中', 1: '处理成功', 2: '处理失败' }[
                row.mediaProcessTaskStatus
              ]
            }}
          </div>
        </template>
      </el-table-column>

      <el-table-column label="视频转码状态" prop="covertStatus" width="120px">
        <template slot-scope="{ row }">
          <span v-if="row.covertStatus === 1" style="color: #ff7d00">
            <el-progress
              :percentage="row.progress"
              style="width: 100px"
              color="#ff7d00"
              text-color="#ff7d00"
            />
          </span>
          <AppTag v-if="row.covertStatus === 2" bg-color="#E6F7EA">
            <template slot="icon">
              <i class="el-icon-success" style="color: #00b42a" />
            </template>
            <template slot="text">
              <span style="color: #00b42a">{{
                $getdictName('CORERT_STATUS', row.covertStatus)
              }}</span>
            </template>
          </AppTag>
          <AppTag v-if="row.covertStatus === 3" bg-color="#FEECEC">
            <template slot="icon">
              <i class="el-icon-error" style="color: #f53f3f" />
            </template>
            <template slot="text">
              <span style="color: #f53f3f">{{
                $getdictName('CORERT_STATUS', row.covertStatus)
              }}</span>
            </template>
          </AppTag>
        </template>
      </el-table-column>
      <el-table-column
        label="使用状态"
        prop="status"
        show-overflow-tooltip
        width="100"
      >
        <template slot="header">
          <MTips
            text="使用状态"
            tips="启用状态，直播间才可使用，禁用状态，不可使用"
          />
        </template>
        <template slot-scope="{ row }">
          <div class="statusBox">
            <p
              :style="`background:${row.status == 1 ? '#00B42A' : '#F53F3F'}`"
            />
            <span> {{ $getdictName('VIDEO_TYPE_SOURCE', row.status) }}</span>
            <el-switch
              v-model="row.status"
              :disabled="
                !(
                  enterLiveRoom ||
                  !(
                    userInfo.userId !== row.createUserId ||
                    row.covertStatus !== 2
                  )
                )
              "
              active-color="#0C6FFF"
              :active-value="1"
              :inactive-value="2"
              @change="handleStatus(row)"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="上传者部门"
        prop="deptName"
        width="200px"
        show-overflow-tooltip
      />
      <el-table-column
        label="上传人"
        prop="createUserName"
        width="120px"
        show-overflow-tooltip
      />
      <el-table-column label="上传时间" prop="createTime" width="160px" />
      <el-table-column
        label="关联脚本数"
        prop="connectScriptCount"
        width="100px"
      />
      <el-table-column
        label="被引用次数"
        prop="connectLiveCount"
        width="100px"
      />
      <el-table-column label="操作" prop="action" width="240px" fixed="right">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            :disabled="
              userInfo.userId !== row.createUserId ||
              (row.videoSource === 2 &&
                row.exportStatus !== 2 &&
                row.mediaProcessTaskStatus !== 1)
            "
            v-permission="['btn:newLiveVideo:official:emit', permsList]"
            @click="onhandleEdit(row)"
            >编辑</el-button
          >
          <el-button
            type="text"
            :disabled="
              row.videoSource === 2 &&
              row.exportStatus !== 2 &&
              row.mediaProcessTaskStatus !== 1
            "
            v-permission="['btn:newLiveVideo:official:details', permsList]"
            @click="onhandleDetail(row)"
            >详情</el-button
          >
          <el-button
            type="text"
            :disabled="
              row.videoSource === 2 &&
              row.exportStatus !== 2 &&
              row.mediaProcessTaskStatus !== 1
            "
            v-permission="['btn:newLiveVideo:official:videoDispose', permsList]"
            @click="onhandleVideoEdit(row)"
            >视频处理</el-button
          >
          <el-button
            type="text"
            @click="onhandleClickToCurriculum(row)"
            v-permission="[
              'btn:newLiveVideo:official:prepareLessons',
              permsList
            ]"
            >备课</el-button
          >
          <el-button
            v-permission="['btn:newLiveVideo:official:delete', permsList]"
            :style="{
              color:
                userInfo.userId !== row.createUserId
                  ? 'rgb(192, 196, 204)'
                  : '#F53F3F'
            }"
            type="text"
            :disabled="userInfo.userId !== row.createUserId"
            @click="onhandleDel(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-show="navType === 2"
      ref="MPageLayout2"
      v-loading="loading"
      type="tablePage"
      tooltip-effect="dark"
      height="100%"
      class="element-table-list"
      style="width: 100%"
      :header-cell-style="{ background: '#f5f5f5' }"
      :data="config.tableData"
    >
      <el-table-column label="视频ID" prop="projectId" />
      <el-table-column label="视频名称" prop="projectName" />
      <el-table-column label="格式" prop="format" />
      <el-table-column label="操作人" prop="userName" />
      <el-table-column label="操作时间" prop="updateTime" />
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            v-permission="['btn:newLiveVideo:draft:videoDispose', permsList]"
            :disabled="userInfo.userId !== row.createUserId"
            @click="onhandleVideoProject(row)"
            >视频处理</el-button
          >
          <el-button
            :style="{
              color:
                userInfo.userId !== row.createUserId
                  ? 'rgb(192, 196, 204)'
                  : '#F53F3F'
            }"
            :disabled="userInfo.userId !== row.createUserId"
            type="text"
            v-permission="['btn:newLiveVideo:draft:delete', permsList]"
            @click="onhandleDraftsDel(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="page_footer">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="config.currentPage"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :total="config.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增编辑框 -->
    <addDialog :config="addConfig" @handleOk="handleOk" />
    <!-- 详情框 -->
    <detailsDialog :config.sync="detailsConfig" />
  </MCard>
</template>

<script>
import filterTop from './filterTop.vue'
import { getColumns } from './columns'
import { getliveVideoList, videoDelete, setVideoStatus } from '@/api/liveVideo'
import {
  getProjectDrafts,
  videoprojectprojectProjectGenerate,
  deleteProjectDraft,
  canEnterLiveRoom
} from '@/api/liveRoom/index'
import { secondIsLiveDuration } from '@/utils'
import AppTag from '@/components/AppTag'
// 详情框
import detailsDialog from './components/detailsDialog.vue'
// 新增编辑框
import addDialog from './components/addDialog.vue'
import { mapGetters, mapState } from 'vuex'
import moment from 'moment'
// import ColumnsCustomer from './ColumnsCustomer.vue'
export default {
  components: {
    filterTop,
    AppTag,
    addDialog,
    detailsDialog
    // ColumnsCustomer
  },
  filters: {
    statusFilter(value) {
      if (value === 1) return 1
      return 0
    }
  },
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      secondIsLiveDuration,
      slotArr: [
        'action',
        'search',
        'footer',
        'videoSource',
        'duration',
        'covertStatus',
        'status',
        'teacherName'
      ],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        videoId: '',
        videoName: '',
        videoSource: '',
        teacherId: '',
        labelText: '',
        createUserId: ''
      },
      loading: false,
      addConfig: {
        visible: false,
        id: '',
        dialogType: 'ADD'
      },
      detailsConfig: {
        visible: false,
        id: 12
      },
      enterLiveRoom: false, // 是否白名单
      navType: 1 // 1：正式，2：草稿
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState({
      linkQuery: state => state.liveScript.linkQuery
    }),
    authorityPage() {
      const permsList = this.permsList
      const bol = permsList.every(
        item =>
          item !== 'web:newLiveVideo:official' &&
          item !== 'web:liveDataKanbanNew:draft'
      )
      return !bol
    }
  },
  created() {
    this.canEnterLiveRoom()
    console.log(this.linkQuery, 'this.linkQuery ')
    if (this.$route.query && this.$route.query.videoId) {
      this.search.videoId = this.$route.query.videoId
      this.search.videoName = this.$route.query.videoName
      // this.$store.commit('liveScript/set_linkQuery', { key: 'videoId', value: '' })
      // this.$store.commit('liveScript/set_linkQuery', { key: 'videoName', value: '' })
    }
  },
  methods: {
    canEnterLiveRoom() {
      return canEnterLiveRoom().then(res => {
        this.enterLiveRoom = res.data
      })
    },
    onhandleVideoEdit(row) {
      if (row.loading) {
        return
      }
      if (row.mediaProcessTaskStatus !== 1) {
        this.$message.error(
          row.mediaProcessTaskStatus === 0
            ? '请等待媒体任务处理完成!'
            : '媒体任务处理失败，请联系管理员!'
        )
        return
      }
      row.loading = true
      const data = {
        videoIds: [row.videoId],
        projectName: row.videoName
      }
      videoprojectprojectProjectGenerate(data)
        .then(res => {
          const { href } = this.$router.resolve({
            path: `/videoEditorLive?projectId=${res.data}`
          })
          window.open(href, '_blank')
          row.loading = false
        })
        .catch(() => {
          row.loading = false
        })
    },
    onnavTypeChange(val) {
      this.navType = val
      this.config.tableData = []
      this.config.currentPage = 1
      this.config.total = 0
      this.searchFn()
    },
    // 获取草稿数据列表
    getProjectDrafts() {
      this.loading = true
      const page = {
        pageIndex: this.config.currentPage,
        projectId: this.search.videoId,
        projectName: this.search.videoName,
        pageSize: this.config.pageSize
      }
      getProjectDrafts(page)
        .then(res => {
          res.data.items.map(v => {
            v.loading = false
            v.updateTime = moment(v.updateTime).format('YYYY-MM-DD HH:mm:ss')
          })
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          setTimeout(() => {
            this.$refs.MPageLayout2 && this.$refs.MPageLayout2.doLayout()
            this.loading = false
          }, 200)
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleOk(type) {
      if (type === 'EDIT') {
        this.addConfig.visible = false
        this.navType === 1 ? this.getList() : this.getProjectDrafts()
        return
      }
      this.initData(1)
    },
    searchFn() {
      this.config.currentPage = 1
      this.navType === 1 ? this.getList() : this.getProjectDrafts()
    },

    handleStatus(row) {
      setVideoStatus({
        videoId: row.videoId,
        status: row.status
      })
        .then(res => {
          this.$message({
            message: `${row.status === 1 ? '已启用' : '已禁用'}`,
            type: row.status === 1 ? 'success' : 'warning'
          })
        })
        .catch(() => {
          this.getList()
        })
    },

    // 初始化列表
    initData(currentPage) {
      this.addConfig.visible = false
      this.search = {
        videoId: '',
        videoName: '',
        videoSource: '',
        teacherId: '',
        labelText: '',
        createUserId: ''
      }
      this.config.currentPage = currentPage || 1
      this.searchFn()
    },
    // 获取数据
    async getList() {
      this.loading = true
      const page = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      try {
        const res = await getliveVideoList({ ...this.search, ...page })
        if (res.code === 1) {
          res.data.items.map(v => {
            v.loading = false
            return
          })
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          setTimeout(() => {
            this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
          }, 200)
        }
        this.loading = false
      } catch {
        this.loading = false
      }
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.navType === 1 ? this.getList() : this.getProjectDrafts()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.navType === 1 ? this.getList() : this.getProjectDrafts()
    },
    // 点击上传视频按钮
    onUpload() {
      this.addConfig = {
        visible: true,
        dialogType: 'ADD'
      }
      // const isuploading = this.$route?.query?.isuploading
      // if (isuploading) {
      //   this.addConfig = {
      //     visible: true,
      //     dialogType: 'ADD'
      //   }
      //   return
      // }
      // const path = this.$route.path
      // const routerUrl = this.$router.resolve({
      //   path: path,
      //   query: {
      //     isuploading: true
      //   }
      // })
      // window.open(routerUrl.href, '_blank')
    },
    // 点击重置按钮
    onClear() {
      this.initData()
    },
    // 点击编辑
    onhandleEdit(row) {
      this.addConfig = {
        visible: true,
        data: { id: row.videoId },
        dialogType: 'EDIT'
      }
    },
    // 点击删除
    async onhandleDel(row) {
      this.$confirm('此操作将永久删除该视频, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await videoDelete({ videoId: row.videoId })
        if (res.code === 1) {
          this.navType === 1 ? this.getList() : this.getProjectDrafts()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      })
    },
    // 点击详情
    onhandleDetail(row) {
      this.detailsConfig = {
        visible: true,
        data: { id: row.videoId }
      }
    },

    // 草稿列表-点击视频处理
    onhandleVideoProject(row) {
      const { href } = this.$router.resolve({
        path: `/videoEditorLive?projectId=${row.projectId}`
      })
      window.open(href, '_blank')
    },
    // 草稿列表-点击删除按钮
    onhandleDraftsDel(row) {
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          row.loading = true
          const data = {
            projectId: row.projectId
          }
          deleteProjectDraft(data)
            .then(res => {
              row.loading = false
              this.searchFn()
            })
            .catch(() => {
              row.loading = false
            })
        }
      })
    },
    onhandleClickToCurriculum(data) {
      const url =
        '/privateLive/liveNewScript?videoId=' +
        data.videoId +
        '&videoName=' +
        data.videoName
      this.$router.push(url)
      console.log(data, '备课对象。。。')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(66px);
  min-width: 1000px;
  padding: 20px 20px 0 20px !important;
  display: flex;
  flex-direction: column;
}
.page_footer {
  padding: 0 20px;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.statusBox {
  display: flex;
  align-items: center;
  > span {
    margin: 0 3px;
  }
  > p {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
}
// ::v-deep .tablePage .page_footer {
//   justify-content: space-between;
//   box-shadow: none;
//   padding: 6px 0px 20px;
//   height: auto;
// }
// ::v-deep .page_header {
//   padding: 0 !important;
// }
// ::v-deep .my-table {
//   margin: 0 !important;
// }
</style>
