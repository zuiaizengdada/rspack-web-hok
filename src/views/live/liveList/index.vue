<template>
  <!-- 直播列表 -->
  <MCard class="page_wrap">
    <filterTop
      :search="search"
      @onhandleAdd="onhandleAdd"
      @onSearch="searchFn"
      @onClear="onClear"
    />
    <el-table
      ref="MPageLayout"
      v-loading="loading"
      type="tablePage"
      tooltip-effect="dark"
      height="100%"
      class="element-table-list"
      style="width: 100%"
      :header-cell-style="{ background: '#f5f5f5' }"
      :data="config.tableData"
      :table-columns="config.tableColumns"
      @handleSelectionChange="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        :selectable="selectable"
      />
      <el-table-column label="直播间ID" prop="code" min-width="113px" />
      <el-table-column
        label="直播间名称"
        prop="name"
        min-width="190px"
        show-overflow-tooltip
      />
      <el-table-column label="出场顺序" prop="appearSequence" min-width="113px" />
      <el-table-column label="直播标签" prop="type" min-width="113px" align="center">
        <template slot-scope="{ row }">
          {{ {1:'正式', 2:'测试'}[row.type] }}
        </template>
      </el-table-column>
      <el-table-column label="直播类型" prop="feesType" min-width="113px" align="center">
        <template slot-scope="{ row }">
          {{ {1:'免费', 2:'付费'}[row.feesType] }}
        </template>
      </el-table-column>
      <el-table-column label="直播模式" prop="liveModel" min-width="152px">
        <template slot-scope="{ row }">
          <div class="liveMode" :class="`liveMode${row.liveModel}`">
            <div style="display: flex; align-items: center">
              <svg-icon
                class-name="liveModeicon"
                :icon-class="
                  getOptionsValueByKey(
                    'value',
                    'icon',
                    row.liveModel,
                    liveModeOption
                  )
                "
              />{{ row.liveModel | getOptionsValue(liveModeOption) }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="讲师" prop="teacherInfoDtoList" min-width="120px">
        <template slot-scope="{ row }">
          <!-- {{ renderTearch(row) }} -->
          <textShowMore :line-clamp="1" :text="renderTearch(row)" />
        </template>
      </el-table-column>
      <el-table-column label="开播时间" prop="startTime" min-width="152px">
        <template slot-scope="{ row }">
          {{ moment(row.startTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column
        label="直播时长(分)"
        prop="liveDuration"
        min-width="108px"
        align="center"
      >
        <template slot-scope="{ row }">
          {{ renderLiveDuration(row.liveDuration) }}
        </template>
      </el-table-column>
      <el-table-column
        label="已付订单笔数"
        prop="doneOrderCount"
        min-width="138px"
        align="center"
      >
        <template slot="header">
          <MTips
            text="已付订单笔数"
            tips="该字段数据5分钟更新一次"
            align="center"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="已付GMV"
        prop="gmv"
        min-width="108px"
        align="center"
      >
        <template slot="header">
          <MTips text="已付GMV" tips="该字段数据5分钟更新一次" align="center" />
        </template>
        <template slot-scope="{ row }">
          {{ row.gmv | filtersMoneyByZero }}
        </template>
      </el-table-column>
      <el-table-column label="直播状态" prop="status" min-width="114px">
        <template slot-scope="{ row }">
          <div class="liveType" :class="`liveType${row.status}`">
            <div style="display: flex; align-items: center">
              <svg-icon
                class-name="liveTypeicon"
                :icon-class="
                  {
                    0: 'livenostart',
                    1: 'liveIng',
                    2: 'liveSuspend',
                    3: 'liveError',
                    9: 'audit_info'
                  }[row.status]
                "
              />{{ row.status | getOptionsValue(liveStateOption) }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createUserName" min-width="114px" />
      <el-table-column label="创建时间" prop="createTime" min-width="172px">
        <template slot-scope="{ row }">
          {{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        prop="action"
        min-width="240px"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <template v-if="canshowTools(row)">
            <el-button
              type="text"
              style="margin-right: 10px; margin-left: 0px"
              @click="onhandleDetail(row)"
            >
              详情
            </el-button>
            <el-button
              v-if="row.status !== 9"
              type="text"
              style="margin-right: 10px; margin-left: 0px"
              @click="onhandleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="canShowGotoLiveRoom(row)"
              type="text"
              style="margin-right: 10px; margin-left: 0px"
              @click="onhandleInvite(row)"
            >
              邀课链接
            </el-button>
            <el-tooltip
              :disabled="canShowGotoLiveRoom(row)"
              effect="dark"
              content="您不是该场直播助教，无权限访问。"
              placement="top-start"
            >
              <el-button
                type="text"
                style="margin-right: 10px; margin-left: 0px"
                @click="onhandleGotoLiveRoom(row)"
              >
                进入直播
              </el-button>
            </el-tooltip>
            <el-button
              v-if="row.status === 3"
              v-permission="['web:liveRoomlist:restart', permsList]"
              :loading="row.batchRestartLoading"
              type="text"
              style="margin-right: 10px; margin-left: 0px"
              @click="onhandleRestart(row)"
            >
              重启任务
            </el-button>
            <el-button
              v-if="row.type === 1 ? row.status === 0 && row.createUserId === userInfo.userId : row.createUserId === userInfo.userId"
              type="text"
              style="margin-right: 10px; margin-left: 0px; color: #f53f3f"
              @click="onhandleDel(row)"
            >
              删除
            </el-button>
            <el-button
              v-if="row.status === 9"
              :loading="row.exportLoading"
              type="text"
              style="margin-right: 10px; margin-left: 0px"
              @click="onhandleExport(row)"
            >
              导出模板
            </el-button>
            <el-button
              v-if="havDataStatistics"
              type="text"
              style="margin-right: 10px; margin-left: 0px"
              @click="gotoKanbanData(row)"
            >
              数据
            </el-button>
            <el-button
              type="text"
              style="margin-right: 10px; margin-left: 0px"
              @click="onhandleVideo(row)"
            >
              视频处理
            </el-button>
          </template>
          <el-button
            v-permission="['web:liveRoomlist:copyLive', permsList]"
            type="text"
            style="margin-right: 10px; margin-left: 0px"
            @click="onhandleCopyLive(row)"
          >
            复制直播间
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page_footer">
      <div>
        <el-button
          v-permission="['web:liveRoomlist:restart', permsList]"
          :loading="batchRestartLoading"
          size="small"
          type="text"
          @click="onhandleBatchRestart"
        >
          批量重启
        </el-button>
      </div>
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

    <!-- 弹框层 -->
    <addDialog :config="addConfig" @success="closeAddDialog" />
    <InviteDialog :config="inviteConfig" @close="closeInviteDialog" />
  </MCard>
</template>

<script>
import addDialog from './component/addDialog.vue'
import InviteDialog from './component/InviteDialog.vue'
import filterTop from './component/filterTop'
import {
  getColumns,
  liveStateOption,
  liveModeOption,
  renderTearch,
  renderLiveDuration
} from '../columns.js'
import { getOptionsValueByKey } from '@/filters/index'
import textShowMore from '@/components/textShowMore/index2'
import {
  getLiveRoomList,
  delLiveRoom,
  exportScript,
  canEnterLiveRoom,
  restartTask,
  videoprojectprojectProjectGenerate
} from '@/api/liveRoom/index'
import { mapGetters, mapState } from 'vuex'
import moment from 'moment'
import Dialog from '../Dialog'
export default {
  components: {
    filterTop,
    addDialog,
    InviteDialog,
    textShowMore
  },
  data() {
    return {
      liveStateOption,
      liveModeOption,
      slotArr: [
        'action',
        'search',
        'footer',
        'status',
        'liveModel',
        'doneOrderCount',
        'gmv'
      ],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      // 查询条件
      search: {
        type: '',
        feesType: '',
        liveRoomCode: '',
        liveRoomName: '',
        realityTeacherUserId: '',
        createUserId: '',
        liveModel: '',
        status: '',
        teacherId: '',
        teacherName: '',
        time: {
          value: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
          label: 0
        }
      },
      addConfig: {
        visible: false,
        type: 1
      },
      inviteConfig: {
        visible: false,
        row: {}
      },
      havDataStatistics: false,
      multipleSelection: [],
      enterLiveRoom: false,
      batchRestartLoading: false,
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission_routes']),
    ...mapState({
      ifAddLiveRoom: state => state.im.ifAddLiveRoom
    })
  },
  mounted() {
    this.havDataStatistics = this.havDataStatisticsFn()
    console.log(this.havDataStatistics, 'this.havDataStatistics11')
    if (this.ifAddLiveRoom) {
      this.onhandleAdd()
      this.$store.commit('im/SET_ifAddLiveRoom', false)
    }
    this.canEnterLiveRoom().then(() => {
      this.searchFn()
    })
  },
  methods: {
    moment,
    renderLiveDuration,
    renderTearch,
    // 点击复制直播间
    onhandleCopyLive(row) {
      console.log(row, '复制直播间')
      Dialog.open({
        type: 'CopyLiveRoom',
        visible: true,
        createUserName: this.userInfo.userName,
        createUserId: this.userInfo.userId,
        liveRoomId: row.id,
        success: res => {
          console.log(res, '复制直播间res')
          if (res && res.data.messageList && res.data.messageList.length > 0) {
            this.$message({
              showClose: true,
              type: 'warning',
              duration: 0,
              dangerouslyUseHTMLString: true,
              message: `<div style="font-size: 14px;color: #ff4949;line-height: 23px;">
                ${res.data.messageList.join('</br>')}
              </div>`
            })
          }
          Dialog.close()
          this.searchFn()
        }
      })
    },
    // 判断能否展示列表操作栏
    canshowTools(row) {
      // 是否白名单
      if (this.enterLiveRoom) {
        return true
      }
      // 是否创建人
      if (row.createUserId === this.userInfo.userId) {
        return true
      }
      // 是否是该场直播的讲师和助教
      const obj = row.teacherInfoDtoList.find(
        v => v.teacherId === this.userInfo.userId
      )
      return Boolean(obj)
    },
    // 判断是否有数据权限
    havDataStatisticsFn() {
      const obj = this.permission_routes?.find(v => v.path === '/live')
      if (obj && obj.children && obj.children.length > 0) {
        const o = obj.children.find(v => v.path === 'liveRoom')
        console.log(o, 'o')
        if (o && o.children && o.children.length > 0) {
          const p = o.children.find(v => v.path === '/live/liveDetail/:id')
          console.log(p, 'p')
          if (p && p.meta && p.meta.permsList && p.meta.permsList.length > 0) {
            return p.meta.permsList.includes('web:liveDetail:dataStatistics')
          }
        }
      }
      return false
    },
    canEnterLiveRoom() {
      return canEnterLiveRoom().then(res => {
        this.enterLiveRoom = res.data
      })
    },
    getOptionsValueByKey,
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        type: this.search.type,
        feesType: this.search.feesType,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        liveRoomCode: this.search.liveRoomCode,
        createUserId: this.search.createUserId,
        liveModel: this.search.liveModel,
        liveRoomName: this.search.liveRoomName,
        realityTeacherUserId: this.search.realityTeacherUserId,
        status: this.search.status,
        timeType: this.search.time.label,
        videoTeacherName: this.search.teacherName,
        videoTeacherId: this.search.teacherId,
        startTime:
          this.search.time.value && this.search.time.value[0]
            ? this.search.time.value[0] + ' 00:00:00'
            : '',
        endTime:
          this.search.time.value && this.search.time.value[1]
            ? this.search.time.value[1] + ' 23:59:59'
            : ''
      }
      this.config.tableData = []
      getLiveRoomList(params)
        .then(res => {
          res.data.items.map(v => {
            v.exportLoading = false
            v.batchRestartLoading = false
          })
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          setTimeout(() => {
            this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
            this.loading = false
          }, 200)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击打开新增直播间
    async onhandleAdd() {
      const res = await this.$store.dispatch('user/viewingFlag', 'newLiveRoom')
      if (!res) {
        this.addConfig = {
          visible: true,
          type: 1
        }
      }
    },
    // 关闭弹框并刷新列表
    closeAddDialog() {
      this.addConfig.visible = false
      this.getList()
    },
    // 查询
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 点击详情
    onhandleDetail(row) {
      console.log('点击前往详情页面')
      this.$router.push(`/live/liveDetail/${row.id}`)
    },
    // 点击编辑
    onhandleEdit(row) {
      this.addConfig = {
        visible: true,
        type: 2,
        row: row
      }
    },
    closeInviteDialog() {
      this.inviteConfig.visible = false
    },
    onhandleInvite(row) {
      this.inviteConfig = {
        visible: true,
        row: row
      }
    },
    // 点击进入直播间
    async onhandleGotoLiveRoom(row) {
      if (!this.canShowGotoLiveRoom(row)) {
        return this.$message.error('你暂无权限访问。')
      }
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'newEnterLiveRoom'
      )
      if (res) return
      // this.$router.push(`/liveRoom/${row.id}`)
      const { href } = this.$router.resolve({
        path: `/liveRoom/${row.id}`
      })
      window.open(href, '_blank')
    },
    // 点击删除
    onhandleDel(row) {
      this.$delModal({
        tips: `是否删除直播间，删除后，学员端将无法看到直播间！`,
        success: () => {
          this.loading = true
          const params = {
            liveRoomId: row.id,
            disabled: true
          }
          delLiveRoom(params)
            .then(res => {
              this.searchFn()
            })
            .catch(() => {
              this.loading = false
            })
        },
        fail: () => {}
      })
    },
    // 点击导出脚本
    onhandleExport(row) {
      row.exportLoading = true
      const params = {
        liveRoomId: row.id
      }
      exportScript(params)
        .then(res => {
          console.log(res)
          var newWin = window.open('loading page', '_self')
          newWin.location.href = res.data // 成功 重定向到目标页面
          row.exportLoading = false
        })
        .catch(() => {
          row.exportLoading = false
        })
    },
    // 点击重置
    onClear() {
      this.search = {
        type: '',
        feesType: '',
        liveRoomCode: '',
        liveRoomName: '',
        realityTeacherUserId: '',
        createUserId: '',
        liveModel: '',
        status: '',
        teacherId: '',
        teacherName: '',
        time: {
          value: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
          label: 0
        }
      }
      this.searchFn()
    },
    canShowGotoLiveRoom(row) {
      if (this.enterLiveRoom) {
        return true
      }
      if (!row.teacherInfoDtoList || row.teacherInfoDtoList.length === 0) {
        return false
      }
      const obj = row.teacherInfoDtoList.find(
        v => v.teacherId === this.userInfo.userId
      )
      return Boolean(obj)
    },
    // 批量选择
    handleSelectionChange(row) {
      this.multipleSelection = row
    },
    selectable(row, index) {
      // return true
      return row.status === 3
    },
    // 点击批量重启按钮
    onhandleBatchRestart() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请至少选择一项')
      }
      console.log(this.multipleSelection)
      const liveRoomIds = this.multipleSelection.reduce((pre, next) => {
        pre.push(next.id)
        return pre
      }, [])
      this.batchRestartLoading = true
      const data = {
        liveRoomIds
      }
      restartTask(data)
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.batchRestartLoading = false
        })
        .catch(() => {
          this.batchRestartLoading = false
        })
    },
    // 单独重启
    onhandleRestart(row) {
      row.batchRestartLoading = true
      const data = {
        liveRoomIds: [row.id]
      }
      restartTask(data)
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          row.batchRestartLoading = false
        })
        .catch(() => {
          row.batchRestartLoading = false
        })
    },
    // 点击跳往数据
    gotoKanbanData(row) {
      // this.$router.push(`/liveRoom/${row.id}`)
      const { href } = this.$router.resolve({
        path: `/live/liveDetail/${row.id}?type=dataStatistics`
      })
      window.open(href, '_blank')
    },
    // 点击跳转视频处理
    onhandleVideo(row) {
      if (row.liveModel === 'PERSON_LIVE') {
        // 真人直播跳转回放详情
        this.$router.push(`/live/liveDetail/${row.id}?type=playbackRecord`)
      } else if (row.liveModel === 'AI_LIVE') {
        // 数字直播跳转视频剪辑
        this.onhandleVideoEdit(row)
      }
    },
    onhandleVideoEdit(row) {
      const data = {
        videoIds: [row.videoId],
        projectName: row.videoName
          ? row.videoName
          : row.name + moment().format('YYYYMMDDHHmmss')
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  height: calc(100vh - 210px);
  min-width: 1000px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
}
.page_footer {
  padding: 0 20px;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
// ::v-deep .tablePage .page_footer{
//   justify-content: space-between;
//   box-shadow: none;
//   padding:6px 0px 20px;
//   height:auto;
// }
// ::v-deep .page_header{
//   padding: 0!important;
// }
// ::v-deep .my-table{
//   margin:0!important
// }
.liveType,
.liveMode {
  display: inline-block;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  padding: 0 8px;
  border-radius: 13px;
  font-size: 10px;
  font-family: MicrosoftYaHei;
  height: 24px;
  line-height: 24px;
  .liveTypeicon,
  .liveModeicon {
    width: 13px;
    height: 13px;
    font-size: 13px;
    margin-right: 4px;
  }
}
.liveType0 {
  background: #eef2f9;
  color: #717f99;
}
.liveType1 {
  background: #e7f0ff;
  color: #1778ff;
}
.liveType2 {
  background: #fff2e6;
  color: #ff7d00;
}
.liveType3 {
  background: #feecec;
  color: #f53f3f;
}
.liveType9 {
  background: #f5f5f5;
  color: #999999;
}
.liveModePERSON_LIVE {
  background: #e7f0ff;
  color: #0c6fff;
}
.liveModeAI_LIVE {
  background: #e6f7ea;
  color: #00b42a;
}
.liveModeDIGITAL_PERSON_LIVE {
  background: #e7f9ff;
  color: #0099ff;
}
::v-deep {
  .tips {
    .tipsText {
      font-weight: 700;
      color: rgb(119, 119, 119);
      line-height: 23px;
      font-size: 14px;
      // line-height: 12px;
    }
    .iconText {
      margin-left: 2px;
      width: 14px;
      height: 14px;
    }
  }
}
</style>
