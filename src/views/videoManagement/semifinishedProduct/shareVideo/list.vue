<template>
  <div class="myvideo-content page-wrap">
    <div class="search-top">
      <el-form :inline="true" :model="videoForm" size="small" class="demo-form-inline">
        <el-form-item label="视频名称">
          <el-input v-model="videoForm.videoName" placeholder="请输入视频名称" />
        </el-form-item>
        <el-form-item label="IP">
          <FilterTearch :placeholder-str="'请选择IP'" :local-storage-str="'semifinishedShareTearch'" @handleChange="handleChangeTeacher" />
        </el-form-item>
        <el-form-item label="共享者">
          <el-select v-model="videoForm.uploaderId" filterable placeholder="请选择员工" clearable @change="getList">
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            >
              <span style="float: left">{{ item.nickName }}</span>
              <span v-if="item.status === 1" style="float: right; color: #f53f3f; font-size: 13px">已离职</span>
            </el-option>
          </el-select>
        </el-form-item>
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
    <!--表格渲染-->
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
        <p style="overflow: hidden;">{{ scope.row.name }}</p>
      </div>
      <div slot="size" slot-scope="scope">
        <p>{{ scope.row.size | filterSize }}</p>
      </div>
      <div slot="duration" slot-scope="scope">
        <p>{{ getPlayDuration(scope.row.duration*1000) }}</p>
      </div>
      <!-- 操作 -->
      <div slot="action" slot-scope="scope">
        <el-button type="text" @click="showDetail(scope.row)">详情</el-button>
      </div>
      <!-- <div slot="footer" class="tips-item">
        <i class="el-icon-warning m-l-10" style="color: #E6A23C;" />
        云桌面自动同步到伏羲云系统：视频文件大小不超过1.5G,时长不超过4小时
      </div> --> 
    </MPageLayout>
    <shareVideoDetail ref="shareVideoRef" :detail="showDetailObject" />
  </div>
</template>

<script>
import { getPlayDuration } from '@/utils/index'
import shareVideoDetail from '@/views/videoManagement/semifinishedProduct/shareVideo/components/shareVideoDetail'
import { userNoPage } from '@/api/addressBookApi'
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
import { getShareVideoPage } from '@/api/videoManagement/vedioSetting'
import { DateFormat } from '@/utils/index'
import FilterTearch from '@/components/FilterTearch'

export default {
  components: {
    shareVideoDetail,
    FilterTearch
  },
  data() {
    return {
      showDetailObject: {},
      searchIng: false,
      tearchArray: [],
      userArray: [],
      iconShezhi,
      videoForm: {
        teacherId: '',
        uploaderId: '',
        videoName: '',
        timeArray: [],
        uploadStartTime: '',
        uploadEndTime: ''
      },
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: ['name', 'size', 'duration', 'action', 'footer'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'name', label: '视频名称', width: 220, type: 'slot', visible: true },
          { prop: 'uploadUserName', label: '共享者', type: 'text', visible: true },
          { prop: 'shareTime', label: '共享时间', width: 180, type: 'text', visible: true },
          { prop: 'size', label: '视频大小', type: 'slot', visible: true },
          { prop: 'duration', label: '视频时长', type: 'slot', visible: true },
          { prop: 'teacherName', label: 'IP', width: 180, type: 'text', visible: true,
            render: row => {
              return row.teacherName || '--'
            }
          },
          { prop: 'action', label: '操作', width: 200, type: 'slot', visible: true, disable: true, fixed: 'right' }
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
      console.log(res)
      localStorage.setItem('shareVideo_tableColumns', JSON.stringify(this.config.tableColumns))
    })
  },
  created() {
    this.videoForm.videoName = this.$route.query?.semiVideoName || ''
    const tableColumns = localStorage.getItem('shareVideo_tableColumns')
    if (tableColumns) {
      this.config.tableColumns = JSON.parse(tableColumns)
    }
    this.loadUserNoPage()
    this.getList()
  },
  methods: {
    clearSearch() {
      this.videoForm = {
        teacherId: '',
        uploaderId: '',
        videoName: '',
        timeArray: [],
        uploadStartTime: '',
        uploadEndTime: ''
      }
      this.getList()
    },
    showDetail(row) {
      this.showDetailObject = row
      row.longTime = new Date().getTime()
      this.$refs.shareVideoRef.show(row)
      this.$refs.shareVideoRef.loadZm(row)
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem('shareVideo_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem('shareVideo_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 点击重置按钮
    clear() {
      const tableColumns = [
        { prop: 'name', label: '视频名称', width: 180, type: 'text', visible: true },
        { prop: 'uploadUserName', label: '共享者', type: 'text', visible: true },
        { prop: 'shareTime', label: '共享时间', width: 180, type: 'text', visible: true },
        { prop: 'size', label: '视频大小', type: 'slot', visible: true },
        { prop: 'duration', label: '视频时长', type: 'slot', visible: true },
        { prop: 'teacherName', label: '录制IP', width: 180, type: 'text', visible: true },
        { prop: 'action', label: '操作', width: 200, type: 'slot', visible: true, disable: true, fixed: 'right' }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem('shareVideo_tableColumns', JSON.stringify(tableColumns))
    },
    handleChangeTeacher(val) {
      this.videoForm.teacherId = val
      this.searchFn()
    },
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        teacherId: this.videoForm.teacherId,
        uploadStartTime: this.videoForm.timeArray && this.videoForm.timeArray[0] ? DateFormat(new Date(this.videoForm.timeArray[0]), 'yyyy-MM-dd') : '',
        uploadEndTime: this.videoForm.timeArray && this.videoForm.timeArray[1] ? DateFormat(new Date(this.videoForm.timeArray[1]), 'yyyy-MM-dd') : '',
        sharerUserId: this.videoForm.uploaderId,
        videoName: this.videoForm.videoName,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      getShareVideoPage(params).then(res => {
        console.log('sharelist: ', res)
        if (res.success) {
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.config.currentPage = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.loading = false
          this.$refs.MPageLayout.doLayout()
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
    getPlayDuration
  }
}
</script>

<style lang='scss' scoped>
.myvideo-content {
  width: 100%;
  height: 100%;
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

  ::v-deep .my-table {
    margin: 0;
    height: calc(100% - 10px);
  }

  ::v-deep .my-table .el-table::before, .el-table--group::after, .el-table--border::after {
    background-color: #fff;
  }
  ::v-deep .el-table__fixed {
    height: 100% !important; //设置高优先，以覆盖内联样式
  }
  ::v-deep .el-table__fixed-right {
    height: calc(100% + 15px) !important; //设置高优先，以覆盖内联样式
    border: none !important;
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

</style>
<style lang='scss'>
.el-table__fixed::before, .el-table__fixed-right::before {
  background-color: none!important;
  height: 0px!important;
}
</style>
