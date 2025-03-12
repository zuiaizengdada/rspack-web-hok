<template>
  <div class="cd-wrap">
    <div class="header-box">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="文件名称">
          <el-input v-model="search.documentName" placeholder="请输入文件名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button class="header-search" type="primary" size="small" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tab-box">
      <el-skeleton v-if="tabLoad" :rows="10" animated />
      <el-table
        v-else
        ref="fileTable"
        :header-cell-style="{
          background: '#f5f5f5',
          color: '#606266',
          fontSize: '14px',
          fontFamily: 'MicrosoftYaHei'
        }"
        style="width: 100%"
        max-height="600"
        :data="config.tableData"
        @selection-change="handleListSelectionChange"
      >
        <template v-for="item in config.tableColumns">
          <el-table-column v-if="item.type === 'selection'" :key="item.label" type="selection" width="55" />
          <el-table-column
            v-else-if="item.type === 'slot'"
            :key="item.label + 1"
            fixed="right"
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <el-button v-permission="['system:material:recycleBin:reduction', permsList]" class="tab-box-btn" type="text" size="small" @click.native.prevent="handleReduction(scope.row.id)">
                还原
              </el-button>
              <el-button v-permission="['system:material:recycleBin:del', permsList]" class="tab-box-btn" type="text" size="small" @click.native.prevent="handleDel(scope.row.id)"> 彻底删除 </el-button>
            </template>
          </el-table-column>
          <el-table-column v-else :key="item.label + 3" :prop="item.prop" :label="item.label" width="" />
        </template>
      </el-table>
    </div>
    <div class="foot-box">
      <div class="foot-l">
        <el-link
          v-permission="['system:material:recycleBin:delAll', permsList]"
          type="primary"
          :underline="false"
          :disabled="multipleSelection.length ? false : true"
          class="btn-link"
          @click="handleDelArray"
        >批量删除</el-link>
        <el-link
          v-permission="['system:material:recycleBin:reductionAll', permsList]"
          type="primary"
          :underline="false"
          :disabled="multipleSelection.length ? false : true"
          class="btn-link"
          @click="handleReductionArray"
        >批量还原</el-link>
      </div>
      <div class="foot-r">
        <el-pagination
          :current-page="config.currentPage"
          :page-sizes="config.pageSizes"
          :page-size="config.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="config.total"
          @size-change="handleListSizeChange"
          @current-change="handleListCurrentChange"
        />
      </div>
    </div>
    <AppDialog
      v-model="treeDialog.visible"
      :title="treeDialog.title"
      width="150"
      height="280"
      max-height="280"
      @success="treeDialog.visible = false"
    >
      <div class="tree-info-box">
        <cd-tree ref="tree" :config="configTreeDialog" @getScrollBottom="getScrollBottom" @getFileList="getFileList" />
      </div>
      <div slot="footer" class="footer">
        <el-button
          :loading="treeDialog.loading"
          :disabled="selectCatalog.catalogLevel > 2 ? false : true"
          type="primary"
          @click="submitSelectTree"
        >{{ treeDialog.btnText }}</el-button>
        <el-button :loading="treeDialog.loading" @click="treeDialog.visible = false">取消</el-button>
      </div>
      <div slot="footer" class="footer" />
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import CdTree from '../tree.vue'
import {
  recyclePage,
  recycleQueryDocId,
  recycleReduction,
  recycleReductions,
  recycleDel,
  recycleDels
} from '@/api/courseDoc/index'
import { parseTime } from '@/utils/index'
export default {
  name: 'CourseDoc',
  components: {
    AppDialog,
    CdTree
  },
  data() {
    return {
      permsList: this.$route?.meta?.permsList || [],
      loading: false,
      visibleDialogOssUpload: false,
      activeIndex: '1',
      search: {
        goodsType: '',
        contentName: ''
      },
      config: {
        tableData: [],
        tableColumns: [
          { prop: '', label: '', type: 'selection', visible: true },
          { prop: 'pathName', label: '原文件夹', type: 'text', visible: true },
          { prop: 'documentName', label: '名称', type: 'text', visible: true },
          { prop: 'documentSuffix', label: '文件后缀', type: 'text', visible: true },
          { prop: 'documentSize', label: '大小', type: 'text', visible: true },
          { prop: 'updateBy', label: '删除人', type: 'text', visible: true },
          {
            prop: 'createTime',
            label: '删除时间',
            type: 'text',
            visible: true,
            render: (row) => {
              return row.createTime ? parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}') : '——'
            }
          },
          { prop: 'action', label: '操作', type: 'slot', visible: true }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      configTree: {
        height: 700,
        size: 30
      },
      leftLoading: true,
      tabLoad: true,
      leftMore: false,
      leftData: [],
      uploadInfo: {},
      multipleSelection: [],
      treeDialog: {
        visible: false,
        title: '移动文件',
        loading: false,
        btnText: ''
      },
      configTreeDialog: {
        height: 500,
        edit: false,
        size: 20,
        nameHide: false
      },
      catalogId: '',
      idsArray: '',
      selectCatalog: {
        level: 0
      }
    }
  },
  created() {
    this.getList()
    this.getLeftList()
  },
  mounted() {},
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    // 获取列表数据
    getList() {
      this.tabLoad = true
      console.log('search', this.search)
      const params = {
        documentName: this.search.documentName, // 课程名称
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      recyclePage(params)
        .then((res) => {
          res.data.items.map((v, i) => {
            v.documentSize = this.getFileSize(v.documentSize)
            v.createTime = v.createTime ? parseTime(new Date(v.createTime).getTime(), '{y}-{m}-{d} {h}:{i}') : '——'
          })
          this.tabLoad = false
          this.config.tableData = res.data.items
          this.config.total = res.data.total
        })
        .catch(() => {
          this.tabLoad = false
        })
    },
    getFileSize(size) {
      //  if (size < 0.1 * 1024) {
      //   // 小于0.1KB，则转化成B
      //   size = size.toFixed(2) + 'B'
      // }
      if (size < 0.1 * 1024 * 1024) {
        // 小于0.1MB，则转化成KB
        size = (size / 1024).toFixed(2) + 'KB'
      } else if (size < 1 * 1024 * 1024 * 1024) {
        // 小于1GB，则转化成MB
        size = (size / (1024 * 1024)).toFixed(2) + 'MB'
      } else {
        // 其他转化成GB
        size = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
      }
      // 转成字符串
      const sizeStr = size + ''
      // 获取小数点处的索引
      const index = sizeStr.indexOf('.')
      // 获取小数点后两位的值
      const dou = sizeStr.substr(index + 1, 2)

      // 判断后两位是否为00，如果是则删除00
      if (dou === '00') return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
      console.log(size)
      return size
    },
    // 获取树状列表数据
    getLeftList() {
      this.leftLoading = true
      setTimeout(() => {
        this.leftLoading = false
      }, 2000)
    },
    handleMenuSelect(key, keyPath) {
      console.log(key, keyPath)
      this.activeIndex = key
    },
    onSearch() {
      this.config.pageSize = 10
      this.config.currentPage = 1
      this.getList()
    },
    handleCommand(command) {
      // 列表 操作更多
      this.$message('click on item ' + command)
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
    handleListSelectionChange(val) {
      // this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
      // this.getList()
    },
    ossBeforeUpload(file) {
      console.log(file, 11111111)
    },
    ossUploadSuccess(data) {
      console.log(data)
    },
    onClickUploadFile() {
      this.visibleDialogOssUpload = !this.visibleDialogOssUpload
    },
    getScrollBottom(e) {
      console.log(e)
      // this.loadShow = e
    },
    reductionApi(id, catalogId) {
      const formdata = new FormData()
      formdata.append('id', id)
      catalogId ? formdata.append('catalogId', catalogId) : ''
      recycleReduction(formdata)
        .then((res) => {
          this.$message({
            type: 'success',
            message: '还原成功!'
          })
          this.getList()
        })
        .catch(() => {})
    },
    handleReduction(id) {
      // 还原
      const params = { ids: id }
      recycleQueryDocId(params)
        .then((res) => {
          const data = res.data
          if (data) {
            this.$confirm('此操作将还原该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.reductionApi(id)
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消还原'
                })
              })
          } else {
            this.treeDialog.visible = true
            this.treeDialog.title = '还原文件'
            this.treeDialog.btnText = '确定还原'
            this.idsArray = [id] // 选中还原数组
          }
        })
        .catch(() => {
          // 打开文件夹
        })
    },
    handleDel(id) {
      // 删除
      const formdata = new FormData()
      formdata.append('id', id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          recycleDel(formdata).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleDelArray() {
      // 批量删除
      const ids = []
      this.multipleSelection.map((v, i) => {
        ids.push(v.id)
      })
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = ids
          recycleDels(params)
            .then((res) => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.clearSelect()
            })
            .catch(() => {})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    reductionArrayApi(params) {
      recycleReductions(params)
        .then((res) => {
          this.$message({
            type: 'success',
            message: '还原成功!'
          })
          this.idsArray = ''
          this.treeDialog.visible = false
          this.clearSelect()
        })
        .catch(() => {})
    },
    handleReductionArray() {
      // 批量还原
      const idsArr = []
      let ids = ''
      this.multipleSelection.map((v, i) => {
        idsArr.push(v.id)
        i === 0 ? (ids = v.id) : (ids = ids + ',' + v.id)
      })
      const params = { ids }
      console.log('params', params)
      recycleQueryDocId(params)
        .then((res) => {
          const data = res.data
          if (data) {
            this.$confirm('此操作将还原该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.reductionArrayApi({ ids: idsArr, catalogId: '' })
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消还原'
                })
              })
          } else {
            this.treeDialog.visible = true
            this.treeDialog.title = '还原文件'
            this.treeDialog.btnText = '确定还原'
            this.idsArray = idsArr // 选中还原数组
          }
        })
        .catch(() => {
          // 打开文件夹
        })
    },
    // 重置列表
    clearSelect() {
      this.$refs.fileTable.clearSelection()
      this.multipleSelection = []
      this.getList()
    },
    getFileList(e) {
      console.log(e)
      this.selectCatalog = e
    },
    submitSelectTree() {
      const nodeData = this.$refs.tree.nodeData
      const ids = this.idsArray
      const catalogId = nodeData.id
      console.log('catalogId', catalogId)
      this.reductionArrayApi({ ids, catalogId })
    }
  }
}
</script>

<style lang="scss" scoped>
.cd-wrap {
  background: #ffffff;
  border-radius: 0 0 8px 8px;
  position: relative;
  padding: 20px;
  background: #ffffff;
  overflow: hidden;
  padding: 20px;
  height: 784px;
  .header-box {
    display: flex;
    justify-content: space-between;
    .header-search {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #FFFFFF;
      background-color: #0091FF;
      border: none;
    }
  }
  .upload-btn {
    width: 96px;
    height: 32px !important;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #161616;
  }
  .tab-box {
    width: 100%;
    height: 640px;
    max-height: 640px;
    .tab-box-btn {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #0C6FFF;
    }
  }
  .foot-box {
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 20px;
    display: flex;
    justify-content: space-between;
    .foot-l {
      a {
        margin-right: 10px;
      }
    }
    .foot-r {
    }
    // element
    .el-dropdown-link {
      cursor: pointer;
      color: #409eff;
      font-size: 12px;
      margin-left: 15px;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
    v-deep .el-table th > .cell {
      font-weight: bold !important;
      color: #333 !important;
      // background-color: #409EFF !important;
    }
    .btn-link {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      // color: #0C6FFF;
    }
  }
}
.tree-info-box {
  padding: 20px;
}
.footer {
  margin: 20px;
}
::v-deep .el-table th > .cell {
  font-weight: bold;
  color: #777777;
  font-size: 15px;
}
::v-deep .el-table td {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
}
</style>
