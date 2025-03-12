<template>
  <div class="page-wrap">
    <!-- 成品视频 -->
    <!--表格渲染-->
    <MPageLayout
      ref="MPageLayout"
      v-loading="loading"
      type="tablePage"
      :slot-arr="slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleListSizeChange"
      @current-change="handleListCurrentChange"
    >
      <el-form
        slot="search"
        style="padding-right: 0px"
        :inline="true"
        :model="videoForm"
        size="small"
        class="demo-form-inline"
      >
        <el-form-item label="视频名称">
          <el-input
            v-model="videoForm.videoName"
            placeholder="请输入视频名称"
          />
        </el-form-item>
        <el-form-item label="IP">
          <el-select
            v-model="videoForm.teacherId"
            clearable
            filterable
            remote
            :remote-method="tearchFilter"
            placeholder="请选择IP"
            @blur="() => tearchFilter('')"
            @change="handleChangeTeacher"
          >
            <el-option-group
              v-for="group in filteredGroups(tearchArray)"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span class="flex flex-between"><span>{{ item.label }} </span><span style="color: #f53f3f;">{{ item.cooperateStatus === 1?'已签合同':'' }}</span></span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="字幕关键字">
          <el-input
            v-model="videoForm.keyWords"
            placeholder="请输入字幕关键字"
          />
        </el-form-item>
        <el-form-item label="上传时间">
          <el-date-picker
            v-model="videoForm.timeArray"
            class="m-l-10 datePicker"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select v-model="videoForm.status">
            <el-option
              v-for="item in publishStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="视频类型">
          <el-select v-model="videoForm.videoType" @change="getList">
            <el-option label="全部" value="0" />
            <el-option label="录制" value="1" />
            <el-option label="数字人" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="分发对象" prop="cpOrgId">
          <el-select
            v-model="videoForm.cpOrgId"
            clearable
            placeholder="请选择分发对象"
          >
            <el-option
              v-for="item in cpOrgList"
              :key="item.orgId"
              :label="item.orgName"
              :value="item.orgId"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-checkbox v-model="videoForm.me" @change="getList">我创建的</el-checkbox>
        </el-form-item> -->
        <el-form-item>
          <el-button
            :loading="searchIng"
            type="primary"
            size="small"
            @click="onSearch"
          >
            查询
          </el-button>
          <el-button size="small" @click="clearbtn">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right; margin-right: 0px">
          <div class="flex justify-between mb-4 inner-cls">
            <div class="buttons" />
            <div class="tools flex justify-start items-center">
              <el-button
                type="primary"
                style="
                  background: none;
                  border: 1px solid #0c6fff;
                  color: #0c6fff;
                "
                plain
                size="small"
                class="mr-4"
                @click="toUploadVideo"
              >
                上传视频
              </el-button>
              <el-popover placement="bottom-end" width="180" trigger="click">
                <p
                  slot="reference"
                  style="float: right; color: #0c6fff; font-size: 14px"
                  type="text"
                  class="cursor-pointer flex items-center"
                  size="small"
                >
                  <img
                    :src="iconShezhi"
                    class="mr-1"
                    style="margin-top: 2px"
                  />自定义表头
                </p>

                <el-checkbox
                  v-model="allColumnsSelected"
                  :disabled="allColumnsSelected"
                  :indeterminate="allColumnsSelectedIndeterminate"
                  @change="handleCheckAllChange"
                >
                  全选
                </el-checkbox>
                <el-checkbox
                  v-for="item in config.tableColumns"
                  :key="item.label"
                  v-model="item.visible"
                  v-dragging="{
                    item: item,
                    list: config.tableColumns,
                    group: 'item'
                  }"
                  :label="item.label"
                  :disabled="item.disable"
                  @change="handleCheckedTableColumnsChange(item)"
                >
                  {{ item.label }}
                </el-checkbox>
              </el-popover>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="name-header">
        <span>视频名称</span>
        <el-tooltip
          class="item"
          effect="dark"
          :content="describe"
          placement="top"
        >
          <i class="el-icon-warning-outline" />
        </el-tooltip>
      </div>
      <template slot="videoType" slot-scope="scope">
        <span>{{ scope.row.videoType === 1 ? '录制' : '数字人' }}</span>
      </template>
      <div slot="name" slot-scope="scope" class="finishedName">
        <div v-if="!scope.row.updateFlag" class="show-block">
          <span>
            <el-tooltip
              class="item"
              effect="light"
              :content="scope.row.name"
              placement="bottom"
            >
              <p class="p-title">{{ scope.row.name }}</p>
            </el-tooltip>
          </span>
          <el-tooltip
            v-if="scope.row.deliveryStatus"
            placement="right-start"
            :open-delay="200"
          >
            <div slot="content">
              <div
                v-for="(deliveryItem, index) in scope.row.deliveryList"
                :key="deliveryItem.orgId"
              >
                {{ index + 1 }}、{{ deliveryItem.deliveryTime }}
                {{ deliveryItem.orgName }}
              </div>
            </div>
            <span class="tag-yff" @mouseover="getDelivery(scope.row)">
              已分发
            </span>
          </el-tooltip>
          <span v-if="scope.row.videoLabel === 1" class="commerce">带货</span>

          <i
            v-if="scope.row.canDel"
            class="el-icon-edit"
            @click="editName(scope.row)"
          />
        </div>
        <div v-else class="show-edit">
          <el-input v-model="scope.row.name" maxlength="200" size="mini" />
          <el-button
            size="mini"
            type="primary"
            plain
            @click="saveVideo(scope.row)"
          >
            保存
          </el-button>
        </div>
      </div>
      <div slot="size" slot-scope="scope">
        <p>{{ scope.row.size | filterSize }}</p>
      </div>
      <div slot="duration" slot-scope="scope">
        <p>{{ getPlayDuration(scope.row.duration * 1000) }}</p>
      </div>
      <div slot="subtitleStatus" slot-scope="scope">
        <StatusShow
          :subtitlestatus="scope.row.subtitleStatus"
          :videotype="4"
          :semi-video-id="scope.row.finishVideoId"
          @reloadData="getList"
        />
      </div>
      <div slot="sensitiveWordStatus" slot-scope="scope">
        <mgcStatusShow
          :sensitivewordstatus="scope.row.sensitiveWordStatus"
          :videotype="4"
          :refvideoid="scope.row.finishVideoId"
          @reloadData="getList"
        />
      </div>
      <div slot="status" slot-scope="scope" class="videoStatus">
        <span :class="scope.row.status === 1 ? 'success-span' : 'error-span'">
          <i
            :class="
              scope.row.status === 1 ? 'el-icon-success' : 'el-icon-error'
            "
          />
          {{ scope.row.status === 1 ? '已发布' : '未发布' }}
        </span>
      </div>
      <!-- 操作 -->
      <div slot="action" slot-scope="scope">
        <el-button type="text" @click="toShowDetail(scope.row)">详情</el-button>
        <el-button type="text" @click="toPublishVideo(scope.row)">
          一键发布
        </el-button>
        <el-button
          v-permission="['web:finishedProduct:distribute', permsList]"
          type="text"
          @click="releaseClick(scope.row)"
        >
          分发
        </el-button>
        <el-button
          v-if="scope.row.canDel"
          class="del-cls"
          type="text"
          @click="deleteMyVideo(scope.row)"
        >
          删除
        </el-button>
      </div>
      <!-- <div slot="footer" class="tips-item">
        <i class="el-icon-warning m-l-10" style="color: #e6a23c" />
        云桌面自动同步到伏羲云系统:视频文件大小不超过1.5G,时长不超过4小时
      </div> --> 
    </MPageLayout>
    <uploadBlock
      ref="uploadDetail"
      :recently-teacher="recentlyTeacher"
      :tearcharray="tearchList"
      :videotype="4"
      @searchList="getList"
      @delRecentlyTeacher="delRecentlyTeacher"
    />
    <finishedVideoDetailVue
      ref="finsiedShowDetail"
      :detail="showDetailObject"
      @reloadData="getList"
    />
    <DownloadModal ref="DownloadModal" />
    <DisDialog ref="disDialogRef" @success="getList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { DateFormat, getPlayDuration } from '@/utils/index'
import {
  loadUserData,
  changeTeacher,
  tearchFilter,
  filteredGroups
} from '@/utils/videoMange'
import { MyTableJson } from '../data.js'

import {
  getFinishedVedioList,
  deleteFinishedVideo,
  editFinishedVideo,
  queryWeMediaVideoInfo,
  getCpOrgListApi,
  getDeliveryCpOrgListApi
} from '@/api/videoManagement/vedioSetting'
import { qryRecentlyTeacher, delRecentlyTeacher } from '@/api/tearchCenter/index'
import { getHasAccountAndList } from '@/api/videoManagement/accountManage'

import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
import StatusShow from '@/views/videoManagement/semifinishedProduct/myVideo/components/statusShow'
import mgcStatusShow from '@/views/videoManagement/semifinishedProduct/myVideo/components/mgcStatusShow'
import DownloadModal from '@/components/DownloadModal/index.vue'
import finishedVideoDetailVue from './cpns/finishedVideoDetail.vue'
import uploadBlock from './cpns/uploadBlock'
import DisDialog from '@/views/videoManagement/desensitized/desensitizationVideo/components/disDialog.vue'

export default {
  components: {
    uploadBlock,
    StatusShow,
    mgcStatusShow,
    finishedVideoDetailVue,
    DownloadModal,
    DisDialog
  },
  data() {
    return {
      filteredGroups,
      showDetailObject: {},
      tearchArray: [],
      iconShezhi,
      tearchList: [],
      videoForm: {
        videoName: '',
        teacherId: '',
        keyWords: '',
        timeArray: [],
        startTime: '',
        endTime: '',
        me: true,
        status: '',
        videoType: '0',
        cpOrgId: ''
      },
      cpOrgList: [],
      describe:
        '在任意一个平台设置过带货链接则标记为带货，带货标记从2023年10月23日开始统计',
      searchIng: false,
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: MyTableJson.slotArr,
      config: {
        tableData: [],
        tableColumns: MyTableJson.columns,
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      menus: [],
      search: '',
      recentlyTeacher: [],
      multipleSelection: [],
      permsList: this.$route.meta.permsList || [],
      publishStatusOptions: [
        { label: '全部', value: '' },
        { label: '已发布', value: 1 },
        { label: '未发布', value: 2 }
      ]
    }
  },
  computed: {
    ...mapGetters(['isNewSocketVideoPublish'])
  },
  watch: {
    'config.tableColumns': {
      handler(val) {
        const arr = val.filter(v => v.visible)
        if (arr.length === this.config.tableColumns.length) {
          this.allColumnsSelected = true
          this.allColumnsSelectedIndeterminate = false
        } else {
          this.allColumnsSelected = false
          this.allColumnsSelectedIndeterminate = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', res => {
      localStorage.setItem(
        'finishedVideoList_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    })
  },
  created() {
    const tableColumns = localStorage.getItem('finishedVideoList_tableColumns')
    if (tableColumns) {
      this.config.tableColumns = JSON.parse(tableColumns)
    }
    this.loadTeacherData()
    this.getRecentlyTeacher()
    this.getList()
    this.init()
  },
  methods: {
    async init() {
      try {
        // 1/成品 2/视频
        const { data } = await getCpOrgListApi({ type: 1 })
        this.cpOrgList = data || []
      } catch (error) {
        console.log('error-----finishedProductMy', error)
      }
    },
    async getRecentlyTeacher() {
      const res = await qryRecentlyTeacher({})
      this.recentlyTeacher = res.data
      console.log(res, '常用老师')
    },
    async delRecentlyTeacher(data) {
      await delRecentlyTeacher({ teacherId: data.teacherId })
      this.$message.success('删除成功')
      this.getRecentlyTeacher()
    },
    onSearch() {
      this.config.currentPage = 1
      this.getList()
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      this.$nextTick(() => {
        this.$refs.MPageLayout.doLayout()
      })
      localStorage.setItem(
        'finishedVideoList_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem(
        'finishedVideoList_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 点击重置按钮
    clear() {
      // const tableColumns = MyTableJson.columns
      this.config.tableColumns = MyTableJson.columns
      localStorage.setItem(
        'finishedVideoList_tableColumns',
        JSON.stringify(MyTableJson.columns)
      )
    },
    clearbtn() {
      this.videoForm = {
        videoName: '',
        teacherId: '',
        keyWords: '',
        timeArray: [],
        startTime: '',
        endTime: '',
        me: true
      }
      this.onSearch()
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        teacherId: this.videoForm.teacherId,
        startTime:
          this.videoForm.timeArray && this.videoForm.timeArray[0]
            ? DateFormat(new Date(this.videoForm.timeArray[0]), 'yyyy-MM-dd')
            : '',
        endTime:
          this.videoForm.timeArray && this.videoForm.timeArray[1]
            ? DateFormat(new Date(this.videoForm.timeArray[1]), 'yyyy-MM-dd')
            : '',
        uploaderId: this.videoForm.uploaderId,
        videoName: this.videoForm.videoName,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        me: this.videoForm.me,
        keyWords: this.videoForm.keyWords,
        status: this.videoForm.status,
        cpOrgId: this.videoForm.cpOrgId,
        videoType:
          this.videoForm.videoType === '0'
            ? undefined
            : this.videoForm.videoType
      }
      getFinishedVedioList(params).then(res => {
        if (res.success) {
          this.loading = false
          this.config.tableData = res.data.items.map((m, index) => ({
            ...m,
            deliveryList: [], // 已分发列表
            index
          }))
          this.config.total = res.data.total
          this.config.currentPage = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.$nextTick(() => {
            this.$refs.MPageLayout.doLayout()
          })
        }
      })
    },
    editName(row) {
      console.log(row)
      this.config.tableData.some(item => {
        item.updateFlag = false
      })
      row.updateFlag = true
      this.$forceUpdate()
    },
    saveVideo(row) {
      const params = {
        name: row.name,
        finishVideoId: row.finishVideoId
      }
      editFinishedVideo(params).then(res => {
        if (res.success) {
          this.$message.success('修改成功！')
          this.getList()
        }
      })
    },
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    async toUploadVideo() {
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'finishedVideoManagement'
      )
      if (!res) {
        this.$uweb && this.$uweb.setAction('Event_videoManage_videoUpload')
        this.$refs.uploadDetail.show()
      }
    },
    handleListSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleListCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    deleteMyVideo(row) {
      console.log(row)
      this.$uweb &&
        this.$uweb.setAction('Event_videoManage_publishVideo_delete')
      this.$confirm(
        '删除后，后续将无法查看和跟踪发布详情，确认删除吗？',
        '删除提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }
      )
        .then(() => {
          deleteFinishedVideo(row.finishVideoId).then(res => {
            console.log(res)
            if (res.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async loadTeacherData() {
      const { tearchArray, tearchList } = await loadUserData(
        'finishedProductUse',
        1
      )
      this.tearchArray = tearchArray
      this.tearchList = tearchList
      this.tearchFilter('')
    },
    async handleChangeTeacher() {
      if (this.videoForm.teacherId) {
        const res = await changeTeacher(
          this.tearchList,
          this.tearchArray,
          'finishedProductUse',
          this.videoForm.teacherId
        )
        this.tearchArray = res
      }
      this.getList()
    },
    async tearchFilter(query) {
      setTimeout(async () => {
        const res = await tearchFilter(query, this.tearchList)
        this.tearchArray[0].isHidden = query.length > 0
        this.tearchArray[1].options = res
      }, 300)
    },
    toShowDetail(row) {
      this.showDetailObject = row
      this.$refs.finsiedShowDetail.show(row)
      this.$refs.finsiedShowDetail.loadZm(row)
    },
    getPlayDuration,
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
                        const res = await queryWeMediaVideoInfo({
                          finishVideoId: row.finishVideoId
                        })
                        const { width } = res.data
                        if (width) {
                          this.$router.push({
                            path:
                              '/videoManagement/videoPublish?finishVideoId=' +
                              row.finishVideoId,
                            query: {
                              prevPath: this.$route.path
                            }
                          })
                        } else {
                          this.$message.error('视频正在处理中，请稍等。。。。')
                        }
                      })
                      .catch(() => {
                        this.$message({
                          type: 'info',
                          message: '已取消'
                        })
                      })
                  } else {
                    const res = await queryWeMediaVideoInfo({
                      finishVideoId: row.finishVideoId
                    })
                    const { width } = res.data
                    if (width) {
                      this.$router.push({
                        path:
                          '/videoManagement/videoPublish?finishVideoId=' +
                          row.finishVideoId,
                        query: {
                          prevPath: this.$route.path
                        }
                      })
                    } else {
                      this.$message.error('视频正在处理中，请稍等...')
                    }
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
    getDelivery(row) {
      if (row.deliveryList.length > 0) return
      getDeliveryCpOrgListApi({
        bizId: row.finishVideoId,
        type: 2 // 成品视频
      }).then(res => {
        if (res.data) {
          this.$set(this.config.tableData[row.index], 'deliveryList', res.data)
        }
      })
    },

    // 分发
    releaseClick(row) {
      this.$refs.disDialogRef.dialogOperation('open', {
        texts: [
          {
            size: row.size,
            duration: row.duration,
            videoName: row.name,
            teacherName: row.teacherName,
            teacherId: row.teacherId
          }
        ],
        reqInfo: {
          finishVideoIdList: [row.finishVideoId]
        },
        title: '成品视频分发',
        type: 'cp'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page-wrap {
  @include responsive-height(82px);
  background: #fff;
  border-radius: 10px;
  padding-top: 10px;
  ::v-deep .tablePage .page_header {
    padding: 0px 20px;
  }
  ::v-deep .el-message-box__status.el-icon-warning {
    color: #f53f3f !important;
  }
  .tips-item {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
  }
  .item {
    margin-left: 5px;
  }
  .finishedName {
    display: flex;
    align-items: center;
    .commerce {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      padding: 0 4px;
      background: #52d3b6;
      border-radius: 4px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      text-align: center;
      margin-left: 8px;
    }
  }
  .tag-yff {
    display: inline-block;
    padding: 0 8px;
    line-height: 20px;
    height: 20px;
    border-radius: 4px;
    opacity: 1;
    background: #00b42a;
    color: #ffffff;
    font-size: 12px;
    font-weight: 400;
    text-align: center;
    margin-left: 8px;
    cursor: pointer;
  }
}
.videoStatus {
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;
  span {
    border-radius: 10px;
    padding: 0 10px;
  }
  .success-span {
    color: #00b42a;
    background: #e6f7ea;
  }
  .error-span {
    color: #717f99;
    background: #eef2f9;
  }
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #333;
}

.del-cls {
  color: #f53f3f;
}

.show-block {
  .p-title {
    max-width: 340px;
    overflow: hidden;
    float: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
  }
  i {
    color: #0c6fff;
    cursor: pointer;
    margin-left: 10px;
    float: left;
    margin-top: 5px;
  }
}
.show-edit {
  width: 320px;
  ::v-deep .el-input--mini {
    width: 240px;
    float: left;
  }
  ::v-deep .el-input__inner {
    width: 240px;
    padding: 0 5px;
    float: left;
  }
  ::v-deep .el-button--primary.is-plain {
    float: left;
    margin-left: 10px;
  }
}
</style>
