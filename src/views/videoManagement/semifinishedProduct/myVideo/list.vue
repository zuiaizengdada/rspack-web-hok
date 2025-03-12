<template>
  <div class="myvideo-content page-wrap">
    <div class="search-top">
      <el-form :inline="true" :model="videoForm" size="small" class="demo-form-inline">
        <el-form-item label="关键字">
          <el-input v-model="videoForm.videoName" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="IP">
          <FilterTearch ref="filterTearch" :placeholder-str="'请选择IP'" :local-storage-str="'semifinishedTearch'" @handleChange="handleChangeTeacher" />
        </el-form-item>
        <!-- <el-form-item label="上传者">
          <el-select v-model="videoForm.uploaderId" filterable placeholder="请选择员工" clearable @change="getList">
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="选择日期">
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
        <div class="flex justify-between mb-4 inner-cls">
          <div class="buttons">
            <el-button :loading="searchIng" type="primary" size="small" @click="searchFn">查询</el-button>
            <el-button size="small" @click="clearSearch">重置</el-button>
          </div>
          <div class="tools flex justify-start items-center">
            <el-button type="primary" style="background: none; border: 1px solid #0C6FFF; color: #0C6FFF;" plain size="small" class="mr-4" @click="toUploadVideo">上传视频</el-button>
            <el-popover
              placement="bottom-end"
              width="180"
              trigger="click"
            >
              <p slot="reference" style="color:#0C6FFF;font-size:14px;" type="text" class="cursor-pointer flex items-center" size="small"><img :src="iconShezhi" class="mr-1" style="margin-top:2px;" />自定义表头</p>

              <el-checkbox v-model="allColumnsSelected" :disabled="allColumnsSelected" :indeterminate="allColumnsSelectedIndeterminate" @change="handleCheckAllChange">
                全选
              </el-checkbox>
              <el-checkbox
                v-for="item in config.tableColumns"
                :key="item.label"
                v-model="item.visible"
                v-dragging="{ item: item, list: config.tableColumns, group: 'item' }"
                :label="item.label"
                :disabled="item.disable"
                @change="handleCheckedTableColumnsChange(item)"
              >
                {{ item.label }}
              </el-checkbox>
            </el-popover>
          </div>
        </div>

      </el-form>
    </div>
    <div class="tips-block">
      <!-- <p><el-tooltip class="item" effect="light" content="系统默认保护周期为7天，保护周期内设置的开放权限有效，否则无效。" placement="bottom"><i ref="lllsss" style="color: #999;" class="el-icon-lsdd" /></el-tooltip></p> -->
    </div>
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
      @size-change="handleListSizeChange"
      @current-change="handleListCurrentChange"
    >
      <div slot="name" slot-scope="scope">
        <div v-if="!scope.row.updateFlag" class="show-block">
          <span>
            <p class="p-title">{{ scope.row.name }}</p>
            <i class="el-icon-edit" @click="editName(scope.row)" />
          </span>
        </div>
        <div v-else class="show-edit">
          <el-input v-model="scope.row.name" maxlength="20" size="mini" />
          <el-button size="mini" type="primary" plain @click="saveVideo(scope.row)">保存</el-button>
        </div>
      </div>
      <div slot="shareStatusName" slot-scope="scope">
        <el-tooltip class="item" effect="light" :content="scope.row.shareStatusName" placement="bottom">
          <p class="scope-p-cls">{{ scope.row.shareStatusName }}</p>
        </el-tooltip>
      </div>
      <div slot="size" slot-scope="scope">
        <p>{{ scope.row.size | filterSize }}</p>
      </div>
      <div slot="duration" slot-scope="scope">
        <p>{{ getPlayDuration(scope.row.duration*1000) }}</p>
      </div>
      <div slot="subtitleStatus" slot-scope="scope">
        <StatusShow :subtitlestatus="scope.row.subtitleStatus" :videotype="3" :semi-video-id="scope.row.semiVideoId" @reloadData="getList" />
      </div>
      <div slot="sensitiveWordStatus" slot-scope="scope">
        <mgcStatusShow :sensitivewordstatus="scope.row.sensitiveWordStatus" :videotype="3" :refvideoid="scope.row.semiVideoId" @reloadData="getList" />
      </div>
      <div slot="action" slot-scope="scope">
        <el-button type="text" @click="toShowDetail(scope.row)">详情</el-button>
        <el-button type="text" @click="gotoSetOpen(scope.row)">开放设置</el-button>
        <el-button class="del-cls" type="text" @click="deleteMyVideo(scope.row)">删除</el-button>
      </div>
      <!-- <div slot="footer" class="tips-item">
        <i class="el-icon-warning m-l-10" style="color: #E6A23C;" />
        云桌面自动同步到伏羲云系统：视频文件大小不超过1.5G,时长不超过4小时
      </div> --> 
    </MPageLayout>
    <div class="dialog-cls">
      <setPermissionsVue ref="setPermiss" @closeDialog="closeDialogFn" @getList="getList" />
    </div>
    <videoDetail ref="showDetail" :detail="showDetailObject" @reloadData="getList" />
    <uploadBlock ref="uploadDetail" :tearcharray="tearchList" :videotype="3" @searchList="getList" />
  </div>
</template>

<script>
import { getPlayDuration } from '@/utils/index'
import { userNoPage } from '@/api/addressBookApi'
import videoDetail from './components/videoDetail.vue'
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
import setPermissionsVue from './components/setPermissions.vue'
import { DateFormat } from '@/utils/index'
import { getSemiVideoPage, deleteVideo, editSemiVideo } from '@/api/videoManagement/vedioSetting'
import StatusShow from '@/views/videoManagement/semifinishedProduct/myVideo/components/statusShow'
import mgcStatusShow from '@/views/videoManagement/semifinishedProduct/myVideo/components/mgcStatusShow'
import uploadBlock from '@/views/videoManagement/semifinishedProduct/myVideo/components/uploadBlock'
import FilterTearch from '@/components/FilterTearch'
export default {
  components: {
    setPermissionsVue,
    FilterTearch,
    videoDetail,
    StatusShow,
    mgcStatusShow,
    uploadBlock
  },
  data() {
    return {
      setRow: {},
      tearchArray: [],
      tearchList: [],
      userArray: [],
      showDetailObject: {},
      iconShezhi,
      searchIng: false,
      setPermissionsFlag: false,
      videoForm: {
        teacherId: '',
        videoName: '',
        timeArray: [],
        uploadStartTime: '',
        uploadEndTime: ''
      },
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: ['headerRight', 'headerLeft', 'name', 'shareStatusName', 'subtitleStatus', 'size', 'duration', 'sensitiveWordStatus', 'action', 'footer'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'name', label: '视频名称', width: 230, type: 'slot', visible: true, disable: true },
          { prop: 'shareStatusName', label: '开放权限', width: 180, type: 'text', visible: true, disable: true },
          { prop: 'uploadUserName', label: '上传者', type: 'text', visible: true, disable: true },
          { prop: 'uploadTime', label: '上传时间', width: 180, type: 'text', visible: true, disable: false },
          { prop: 'downloadNum', label: '下载次数', type: 'text', visible: true, disable: false },
          { prop: 'size', label: '视频大小', type: 'slot', visible: true, disable: false },
          { prop: 'duration', label: '视频时长', type: 'slot', visible: true, disable: false },
          // { prop: 'subtitleStatus', label: '字幕处理', width: 120, type: 'slot', visible: true, disable: false },
          // { prop: 'sensitiveWordStatus', label: '敏感词检测', width: 120, type: 'slot', visible: true, disable: false },
          { prop: 'teacherName', label: 'IP', width: 120, type: 'text', visible: true, disable: false,
            render: row => {
              return row.teacherName || '--'
            }
          },
          { prop: 'action', label: '操作', width: 230, type: 'slot', visible: true, disable: true, fixed: 'right' }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      menus: [],
      search: '',
      multipleSelection: [],
      permsList: this.$route.meta.permsList || []
    }
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
    this.$dragging.$on('dragged', (res) => {
      localStorage.setItem('semifinish_myvideo', JSON.stringify(this.config.tableColumns))
    })

    const selectWrap = document.querySelector('.el-table__body-wrapper')
    const that = this
    selectWrap.addEventListener('scroll', function() {
      const scrollLeft = selectWrap.scrollLeft
      const sleft = 300 - scrollLeft
      that.$refs.lllsss.style.left = sleft + 'px'
    })
  },
  created() {
    const tableColumns = localStorage.getItem('semifinish_myvideo')
    if (tableColumns) {
      this.config.tableColumns = JSON.parse(tableColumns)
    }
    this.loadUserNoPage()
    this.getList()
  },
  methods: {
    saveVideo(row) {
      const params = {
        name: row.name,
        semiVideoId: row.semiVideoId
      }
      editSemiVideo(params).then(res => {
        if (res.success) {
          this.$message.success('修改成功！')
          this.getList()
        }
      })
    },
    getPlayDuration,
    editName(row) {
      this.config.tableData.some(item => {
        this.$delete(item, 'updateFlag')
        this.$set(item, 'updateFlag', false)
      })
      this.$delete(row, 'updateFlag')
      this.$set(row, 'updateFlag', true)
      console.log(this.config.tableData)
    },
    deleteMyVideo(row) {
      this.$confirm('删除后，后续将无法查看和跟踪发布详情，确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteVideo(row.semiVideoId).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    clearSearch() {
      this.$refs.filterTearch.reset()
      this.videoForm = {
        teacherId: '',
        videoName: '',
        timeArray: [],
        uploadStartTime: '',
        uploadEndTime: ''
      }
      this.getList()
    },
    toShowDetail(row) {
      this.showDetailObject = row
      row.longTime = new Date().getTime()
      this.$refs.showDetail.show(row)
      this.$refs.showDetail.loadZm()
    },
    toUploadVideo() {
      this.$refs.uploadDetail.show()
    },
    gotoSetOpen(row) {
      // if (!row.shareEditFlag) {
      //   return false
      // }
      this.setPermissionsFlag = true
      this.setRow = row
      this.$refs.setPermiss.show(row)
    },
    closeDialogFn() {
      this.setPermissionsFlag = false
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
      localStorage.setItem('semifinish_myvideo', JSON.stringify(this.config.tableColumns))
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      this.$nextTick(() => {
        this.$refs.MPageLayout.doLayout()
      })

      localStorage.setItem('semifinish_myvideo', JSON.stringify(this.config.tableColumns))
    },
    // 点击重置按钮
    clear() {
      const tableColumns = [
        { prop: 'name', label: '视频名称', width: 230, type: 'slot', visible: true, disable: true },
        { prop: 'shareStatusName', label: '开放权限', width: 180, type: 'text', visible: true, disable: true },
        { prop: 'uploadUserName', label: '上传者', type: 'text', visible: true, disable: true },
        { prop: 'uploadTime', label: '上传时间', width: 180, type: 'text', visible: true, disable: false },
        { prop: 'downloadNum', label: '下载次数', type: 'text', visible: true, disable: false },
        { prop: 'size', label: '视频大小', type: 'slot', visible: true, disable: false },
        { prop: 'duration', label: '视频时长', type: 'text', visible: true, disable: false },
        { prop: 'subtitleStatus', label: '字幕处理', width: 120, type: 'slot', visible: true, disable: false },
        { prop: 'sensitiveWordStatus', label: '敏感词检测', width: 120, type: 'slot', visible: true, disable: false },
        { prop: 'teacherName', label: '录制IP', width: 120, type: 'text', visible: true, disable: false },
        { prop: 'action', label: '操作', width: 230, type: 'slot', visible: true, disable: true, fixed: 'right' }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem('semifinish_myvideo', JSON.stringify(tableColumns))
    },
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 获取列表数据
    getList() {
      this.loading = true
      console.log('sssssssss: ', this.videoForm)
      const params = {
        teacherId: this.videoForm.teacherId,
        uploadStartTime: this.videoForm.timeArray && this.videoForm.timeArray[0] ? DateFormat(new Date(this.videoForm.timeArray[0]), 'yyyy-MM-dd') : '',
        uploadEndTime: this.videoForm.timeArray && this.videoForm.timeArray[1] ? DateFormat(new Date(this.videoForm.timeArray[1]), 'yyyy-MM-dd') : '',
        uploaderId: this.videoForm.uploaderId,
        videoName: this.videoForm.videoName,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      getSemiVideoPage(params).then(res => {
        if (res.success) {
          this.loading = false
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.config.currentPage = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.tableData.some(item => {
            item.updateFlag = false
          })
          this.$nextTick(() => {
            this.$refs.MPageLayout.doLayout()
          })
        }
      })
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
    loadUserNoPage() {
      const params = {
        deptId: '',
        nickName: ''
      }
      userNoPage(params)
        .then((res) => {
          this.userArray = res.data
        })
        .catch(() => {
        })
    },
    handleChangeTeacher(val) {
      this.videoForm.teacherId = val
      this.searchFn()
    }
  }
}
</script>

<style lang='scss' scoped>
.myvideo-content {
  width: 100%;
  height: 100%;
  ::v-deep .PageLayout {
    margin-top: -40px;
  }
  @media screen and (max-width: 1550px) {
    ::v-deep .PageLayout {
      max-height: 610px;
    }
  }
  @media screen and (min-width: 1550px) {
    ::v-deep .PageLayout {
      max-height: 650px;
    }
  }
  ::v-deep .el-table__fixed {
    height:auto !important; // 让固定列的高自适应，且设置!important覆盖ele-ui的默认样式
    bottom:17px; // 固定列默认设置了定位，    position: absolute;top: 0;left: 0;只需要再设置一下bottom的值，让固定列和父元素的底部出现距离即可
  }

  ::v-deep .el-table__fixed {
    height: 100% !important; //设置高优先，以覆盖内联样式
  }
  ::v-deep .el-table__fixed-right {
    height: calc(100% + 15px) !important; //设置高优先，以覆盖内联样式
    border: none !important;
  }
  ::v-deep .el-table__fixed::before, .el-table__fixed-right::before {
    background-color: none!important;
  }

  ::v-deep .my-table .el-table::before, .el-table--group::after, .el-table--border::after {
    background-color: #fff;
  }
  ::v-deep .my-table {
    margin: 0;
    height: calc(100% - 10px);
  }
  ::v-deep .page_header {
    padding: 0;
    height: 0;
    min-height: 0;
  }
  ::v-deep .el-form-item--small.el-form-item {
    margin-bottom: 0;
    margin-top: 10px;
  }
  .tips-item{
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #999;
  }
  .fl {
    padding-top: 0px;
    padding-bottom: 10px;
  }
  .datePicker {
    flex: 1 0 0;
  }
  .dialog-cls {
    ::v-deep .el-dialog {
      border-radius: 10px;
    }
    ::v-deep .el-dialog__header {
      border-bottom: 1px solid #e7e7e7;
    }
  }
}
.el-icon-lsdd {
  cursor: pointer;
  width: 14px;
  height: 14px;
  margin-top: 1px;
  background-image: url(../../../../assets/image/video/icn_wenhao.png);
  background-size: 100%;
}
.tips-block {
  width: 100%;
  height: 40px;
  z-index: 3;
  position: relative;
  i {
    position: absolute;
    top: 15px;
    left: 300px;
  }
}
.search-top {
  margin-top: 20px;
}
.inner-cls {
  margin-top: 15px;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label{
  color:#333;
}
.del-cls {
  color: #F53F3F;
}

.show-block {
  .p-title {
    max-width: 180px;
    overflow: hidden;
    float: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow:ellipsis;
  }
  i {
    color: #0C6FFF;
    cursor: pointer;
    margin-left: 10px;
    float: left;
    margin-top: 5px;
  }
}
.show-edit {
  width: 220px;
  ::v-deep .el-input--mini {
    width: 150px;
    float: left;
  }
  ::v-deep .el-input__inner {
    width: 150px;
    padding: 0 5px;
    float: left;
  }
  ::v-deep .el-button--primary.is-plain {
    float: left;
    margin-left: 10px;
  }
}
.scope-p-cls {
  cursor: pointer;
  width: 100%;
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap;
}

.zhihui-cls {
  color: #9c9c9c;
}

</style>
<style lang='scss'>
.el-table__fixed::before, .el-table__fixed-right::before {
  background-color: none!important;
  height: 0px!important;
}
</style>
