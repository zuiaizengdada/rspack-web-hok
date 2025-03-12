<template>
  <MCard class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
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
        <div class="m-t-20 p-b-20 searchTop">
          <el-form
            ref="form"
            :model="search"
            label-width="auto"
            size="small"
            :inline="true"
          >
            <el-form-item label="模板名称" class="m-r-0">
              <el-input
                v-model="search.scriptName"
                clearable
                placeholder="请输入"
                class="w-200"
                @keyup.enter.native="searchFn"
                @clear="searchFn"
              />
            </el-form-item>
            <el-form-item label="视频名称" class="m-r-0 m-l-10">
              <AppSelect
                :get-api-fn="getVideoList"
                search-key="videoName"
                :popover-width="245"
                :value="search.videoId"
                :label="search.videoName"
                :props="{
                  label: 'videoName',
                  value: 'videoId'
                }"
                @selected="selectedVideo"
              />
            </el-form-item>
            <el-form-item label="创建人" class="m-r-0">
              <el-select
                v-model="search.createUserId"
                class="w-200"
                filterable
                placeholder="请选择创建人"
                clearable
                @change="searchFn"
              >
                <el-option
                  v-for="item in userArray"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item class="m-r-0">
              <el-button
                type="primary"
                class="m-l-20"
                @click="searchFn"
              >查询</el-button>
              <el-button @click="onClear">重置</el-button>
            </el-form-item>
          </el-form>
          <!-- <el-button
            size="small"
            type="primary"
            @click="onhandleAdd"
          ><i class="el-icon-plus" />新增模板</el-button> -->
        </div>
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          @click="onhandleScriptPreview(row)"
        >预览</el-button>
        <el-button
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          :disabled="userInfo.userId !== row.createUserId"
          @click="onhandleConfiguration(row)"
        >配置</el-button>
        <el-button
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          @click="onhandleCopy(row)"
        >复制</el-button>
        <!-- <el-button
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          :disabled="userInfo.userId !== row.createUserId"
          @click="onhandleEdit(row)"
        >编辑</el-button>
        <el-button
          type="text"
          style="margin-right: 10px; margin-left: 0px"
          class="c_F53F3F"
          :disabled="userInfo.userId !== row.createUserId"
          @click="onhandleDel(row)"
        >删除</el-button> -->
      </template>
      <template slot="status" slot-scope="{ row }">
        <div class="statusView">
          <AppStatus :status="{ 1: 'success', 2: 'error' }[row.status]">
            <span>{{ { 1: '启用', 2: '禁用' }[row.status] }}</span>
          </AppStatus>
          <el-switch
            v-model="row.status"
            v-loading="row.editLoading"
            :disabled="
              !(enterLiveRoom || !(userInfo.userId !== row.createUserId))
            "
            element-loading-spinner="el-icon-loading"
            :active-value="1"
            :inactive-value="2"
            @change="onhandleStatusChange(row)"
          />
        </div>
      </template>
    </MPageLayout>
    <addDialog :config="addConfig" @success="clsoeAddDialog" />
  </MCard>
</template>

<script>
import addDialog from './addDialog.vue'
import {
  getScriptList,
  editScriptStatus,
  delScript,
  scriptCopy,
  getVideoList
} from '@/api/liveRoom/script'
import { canEnterLiveRoom } from '@/api/liveRoom/index'
import AppStatus from '@/components/AppStatus/index.vue'
import moment from 'moment'
import AppSelect from '@/components/AppSelect/index'
import { userNoPage } from '@/api/addressBookApi'
import { mapGetters, mapState } from 'vuex'
export default {
  components: {
    AppSelect,
    addDialog,
    AppStatus
  },
  data() {
    return {
      slotArr: ['action', 'search', 'footer', 'status'],
      config: {
        tableData: [],
        tableColumns: [
          {
            prop: 'scriptId',
            label: '模板ID',
            type: 'text',
            'min-width': '200px'
          },
          {
            prop: 'scriptName',
            label: '模板名称',
            type: 'text',
            'min-width': '200px'
          },
          {
            prop: 'refType',
            label: '关联类型',
            type: 'text',
            'min-width': '100px',
            render: row => {
              return { 1: '关联视频', 2: '关联剧本' }[row.refType]
            }
          },
          {
            prop: 'refId',
            label: '关联视频',
            type: 'text',
            'min-width': '200px'
          },
          {
            prop: 'refName',
            label: '关联视频',
            type: 'text',
            'min-width': '200px'
          },
          {
            prop: 'remark',
            label: '备注',
            type: 'text',
            'min-width': '200px',
            'show-overflow-tooltip': true
          },
          {
            prop: 'status',
            label: '模板状态',
            type: 'slot',
            'min-width': '200px'
          },
          {
            prop: 'deptName',
            label: '创建人所属部门',
            type: 'text',
            'min-width': '200px'
          },
          {
            prop: 'createUserName',
            label: '创建人',
            type: 'text',
            'min-width': '200px'
          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'text',
            'min-width': '200px',
            render: row => {
              return moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            prop: 'action',
            label: '操作',
            type: 'slot',
            width: '300px',
            fixed: 'right'
          }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 20,
        currentPage: 1,
        total: 0
      },
      search: {
        createUserId: '', // 创建人
        scriptName: '', // 脚本名称
        videoId: '', // 视频id
        videoName: '' // 视频名称
      },
      loading: false,
      addConfig: {
        visible: false,
        type: 1, // 1新增 2编辑
        row: {}
      },
      enterLiveRoom: false, // 是否白名单
      userArray: []
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState({
      linkQuery: state => state.liveScript.linkQuery
    })
  },
  created() {
    this.canEnterLiveRoom()
    this.loadUserNoPage()
    // if (this.linkQuery && this.linkQuery.scriptName) {
    if (this.$route.query && this.$route.query.scriptName) {
      this.search.scriptName = this.$route.query.scriptName
      // this.$store.commit('liveScript/set_linkQuery', { key: 'scriptName', value: '' })
    }
  },
  mounted() {
    console.log(this.$store, '123')
    this.searchFn()
  },
  methods: {
    canEnterLiveRoom() {
      return canEnterLiveRoom().then(res => {
        this.enterLiveRoom = res.data
      })
    },
    onClear() {
      this.search = {
        createUserId: '', // 创建人
        scriptName: '', // 脚本名称
        videoId: '', // 视频id
        videoName: '' // 视频名称
      }
      this.searchFn()
    },
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
        })
        .catch(() => {})
    },
    selectedVideo(res) {
      this.search.videoId = res.videoId
      this.search.videoName = res.videoName
      this.searchFn()
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
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        createUserId: this.search.createUserId,
        scriptName: this.search.scriptName,
        videoId: this.search.videoId
      }
      getScriptList(data)
        .then(res => {
          console.log(res, '获取脚本列表数据')
          res.data.items.map(v => {
            v.editLoading = false
          })
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.$nextTick(() => {
            this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 点击删除
    onhandleDel(row) {
      this.$delModal({
        tips: '确定删除该脚本?',
        success: () => {
          console.log('删除')
          this.loading = true
          const data = {
            scriptId: row.scriptId
          }
          delScript(data)
            .then(() => {
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击编辑
    onhandleEdit(row) {
      this.addConfig = {
        visible: true,
        type: 2,
        row: row
      }
    },
    // 点击脚本配置
    async onhandleConfiguration(row) {
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'newLiveScriptSetting'
      )
      if (res) return
      this.$store.dispatch('liveScript/init')
      // console.log(row, '脚本配置')
      // this.$router.push({ path: `/live/scriptConfiguration/${row.scriptId}` })
      const { href } = this.$router.resolve({
        path: `/live/scriptConfiguration/${row.scriptId}`
      })
      window.open(href, '_blank')
    },
    // 点击脚本复制
    onhandleCopy(row) {
      this.$delModal({
        tips: '确定复制该脚本?',
        success: () => {
          console.log('删除')
          this.loading = true
          const data = {
            scriptId: row.scriptId
          }
          scriptCopy(data)
            .then(res => {
              this.loading = false
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击新增按钮
    async onhandleAdd() {
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'newLiveScript'
      )
      if (res) return
      this.addConfig = {
        visible: true,
        type: 1,
        row: {}
      }
    },
    onhandleStatusChange(row) {
      console.log(status)
      row.editLoading = true
      const data = {
        scriptId: row.scriptId,
        status: row.status // 1启用，2禁用
      }
      editScriptStatus(data)
        .then(res => {
          row.editLoading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
        })
        .catch(() => {
          row.editLoading = false
          this.getList()
        })
    },
    clsoeAddDialog() {
      this.addConfig.visible = false
      this.getList()
    },
    // 点击预览
    onhandleScriptPreview(row) {
      const { href } = this.$router.resolve({
        path: `/live/scriptPreview/${row.scriptId}`
      })
      window.open(href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  min-width: 1000px;
  padding: 0 20px;
  .searchTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 6px 0px 20px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
.statusView {
  display: flex;
  align-items: center;
  ::v-deep {
    .AppStatus {
      margin-right: 8px;
      width: 40px;
    }
    .el-loading-spinner {
      top: 100%;
    }
  }
}
.m-r-0 {
  margin-right: 0px !important;
  margin-bottom: 0px !important;
}
</style>
