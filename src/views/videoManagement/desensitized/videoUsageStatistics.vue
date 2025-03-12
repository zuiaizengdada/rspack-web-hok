<template>
  <div class="videoStatistics-wrapper">
    <div class="bread-row">
      <span>视频管理</span>
      <i> > </i>
      <p>视频使用统计</p>
    </div>
    <!--表格渲染-->
    <MPageLayout
      ref="MPageLayout"
      border
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
      <div slot="headerLeft">
        <div class="fl">
          <el-form :inline="true" :model="videoForm" size="small" class="demo-form-inline">
            <el-form-item label="IP">
              <teacherInput v-model="videoForm.teacherId" type="tearch" @clear="searchFn()" @select="searchFn" @keyup.enter.native="searchFn" />
            </el-form-item>
            <el-form-item label="员工姓名">
              <teacherInput v-model="videoForm.staffId" type="user" @clear="searchFn()" @select="searchFn" @keyup.enter.native="searchFn" />
            </el-form-item>
            <el-form-item label="选择部门">
              <el-cascader v-model="videoForm.deptArray" :options="deptTreeArray" :props="{ checkStrictly: true }" />
            </el-form-item>
            <el-form-item label="视频组标题">
              <teacherInput v-model="videoForm.videoGroupName" type="user" @clear="searchFn()" @select="searchFn" @keyup.enter.native="searchFn" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getList">查询</el-button>
              <el-button>重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="headerRight">
        <el-popover
          placement="bottom-end"
          width="150"
          trigger="click"
        >
          <el-button slot="reference" type="text" size="small"><i class="el-icon-s-operation" />自定义表头</el-button>

          <el-checkbox v-model="allColumnsSelected" :disabled="allColumnsSelected" :indeterminate="allColumnsSelectedIndeterminate" @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <el-checkbox
            v-for="item in config.tableColumns"
            :key="item.label"
            v-model="item.visible"
            v-dragging="{ item: item, list: config.tableColumns, group: 'item' }"
            :disabled="item.disable"
            @change="handleCheckedTableColumnsChange(item)"
          >
            {{ item.label }}
          </el-checkbox>
        </el-popover>
      </div>
      <div slot="footer" />
    </MPageLayout>
  </div>
</template>

<script>
import { searchVideoUseNumsData } from '@/api/product/videoManager'
import { deptTree } from '@/api/addressBookApi'
import teacherInput from '@/views/teacherCenter/components/tearchInput'
export default {
  components: {
    teacherInput
  },
  data() {
    return {
      deptTreeArray: [],
      videoForm: {
        videoGroupName: '',
        teacherId: '',
        staffId: '',
        dept: '',
        deptArray: []
      },
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer'],
      config: {
        tableData: [
          {
            videoName: '张琦私董会0718',
            uploader: '何某某',
            createTime: '2022-07-12 12:23:22',
            permissionStatus: '不开放',
            downloads: '15',
            videoLength: '20M',
            videoTimes: '5分钟',
            subtitle: '已完成',
            caseWordsType: '处理完成',
            teacher: '张琦'
          }
        ],
        tableColumns: [
          { prop: 'videoName', label: '视频名称', width: 180, type: 'text', visible: true, disable: false },
          { prop: 'teacher', label: 'IP', type: 'text', visible: true, disable: false },
          { prop: 'uploader', label: '创建者', type: 'text', visible: true, disable: false },
          { prop: 'permissionStatus', label: '员工姓名', type: 'text', visible: true, disable: false },
          { prop: 'caseWordsType', label: '部门', type: 'text', visible: true, disable: false },
          { prop: 'downloads', label: '成品数', type: 'text', visible: true, disable: false },
          { prop: 'downloads', label: '使用平均数', type: 'text', visible: true, disable: false }
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
        console.log('vvvvvvvvvvvvvvvvvvvvalllllll:', val)
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
      console.log(JSON.stringify(this.config.tableColumns))
      localStorage.setItem('videousagestatustics_tabledata', JSON.stringify(this.config.tableColumns))
    })
  },
  created() {
    const tableColumns = localStorage.getItem('videousagestatustics_tabledata')
    console.log('tablecolumns: ', tableColumns)
    if (tableColumns) {
      this.config.tableColumns = JSON.parse(tableColumns)
    }
    console.log('!!!!@@@@@:', this.config.tableColumns)
    this.loadTreeData()
  },
  methods: {
    async loadTreeData() {
      const res = await deptTree()
      console.log('rrrrrrrrreeeeeeeeeesssssssssssssssssss:', res)
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
      console.log('!!!!!!!!@@@@@@@@@@@@@@@@@$$$$$$$$$%%%%%%%%%%%:', this.deptTreeArray)
    },
    deleteMyVideo(row) {
      console.log(row)
      this.$confirm('删除后，后续将无法查看和跟踪发布详情，确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    gotoDownload(row) {
      console.log(row)
    },
    gotoSetOpen(row) {
      console.log(row)
    },
    gotoSetEdit(row) {
      console.log(row)
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem('videousagestatustics_tabledata', JSON.stringify(this.config.tableColumns))
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem('videousagestatustics_tabledata', JSON.stringify(this.config.tableColumns))
    },
    // 点击重置按钮
    clear() {
      const tableColumns = [
        { prop: 'videoName', label: '视频名称', width: 180, type: 'text', visible: true, disable: false },
        { prop: 'uploader', label: '上传者', type: 'text', visible: true, disable: false },
        { prop: 'createTime', label: '上传时间', type: 'text', visible: true, disable: false },
        { prop: 'permissionStatus', label: '开放权限', type: 'text', visible: true, disable: false },
        { prop: 'downloads', label: '下载次数', type: 'text', visible: true, disable: false },
        { prop: 'videoLength', label: '视频大小', type: 'text', visible: true, disable: false },
        { prop: 'videoTimes', label: '视频时长', type: 'text', visible: true, disable: false },
        { prop: 'subtitle', label: '字幕生成', type: 'text', visible: true, disable: false },
        { prop: 'caseWordsType', label: '敏感词检测', type: 'text', visible: true, disable: false },
        { prop: 'teacher', label: '录制IP', type: 'text', visible: true, disable: false },
        { prop: 'action', label: '操作', width: 200, type: 'slot', visible: true, disable: true, fixed: 'right' }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem('videousagestatustics_tabledata', JSON.stringify(tableColumns))
    },
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 获取列表数据
    async getList() {
      // this.loading = true
      searchVideoUseNumsData().then(res => {

      })
    },
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    },
    handleSizeChange(val) {
      this.roleUserModel.size = val
      this.getRoleUserList()
    },
    handleCurrentChange(val) {
      this.roleUserModel.current = val
      this.getRoleUserList()
    },
    handleListSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleListCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    }
  }
}
</script>

<style lang='scss' scoped>
.videoStatistics-wrapper {
  width: 100%;
  float: left;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  ::v-deep .my-table {
    margin: 0;
    height: 630px;
  }
  ::v-deep .page_header {
    padding: 10px 0;
  }
  ::v-deep .el-form-item--small.el-form-item {
    margin-bottom: 0;
    margin-top: 10px;
  }
  .fl {
    padding-top: 0px;
    padding-bottom: 10px;
  }
  .datePicker {
    flex: 1 0 0;
  }
  .bread-row {
    width: 100%;
    padding-bottom: 15px;
    border-bottom: 1px solid #EFF2F6;
    span {
      color: #777;
      font-size: 16px;
      cursor: pointer;
    }
    i {
      color: #777;
      font-size: 16px;
      font-style: normal;
      cursor: pointer;
    }
    p {
      font-size: 16px;
      font-weight: bold;
      display: inline-block;
    }
  }
}
</style>
