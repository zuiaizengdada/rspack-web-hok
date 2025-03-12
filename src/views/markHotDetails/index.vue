<!-- 协议管理 -->
<template>
  <div class="page-content">
    <div class="page_wrap1">
      <div class="details-container">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="form-breadcrumb">
          <el-breadcrumb-item :to="{ path: '/materialBoard' }">素材看板</el-breadcrumb-item>
          <el-breadcrumb-item>爆款标记明细</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <filter-top
        :dept-tree-array="deptTreeArray"
        :search-form="searchForm"
        :user-array="userArray"
        @exportTable="exportTable"
        @visibleChangeD="visibleChange"
        @clear="clear"
        @getListForSearch="getListForSearch"
      />
      <!-- 内容区(协议管理) -->
      <MPageLayout
        ref="MPageLayout"
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
        @handleSelectionChange="handleSelectionChange"
        @sort-change="sortChange"
      >
        <div slot="action" slot-scope="{row}">
          <el-button type="text" @click="viewTags(row)">查看标记</el-button>
        </div>
      </MPageLayout>
    </div>
  </div>
</template>
<script>
import { userNoPage } from '@/api/addressBookApi'
import { markHotDetailsColumns } from './columns'
import { getLoginInfo } from '@/api/videoManagement/accountManage'
import { qryHotMarkList, exportHotMarkList } from '@/api/materialBoard'
import { mapGetters } from 'vuex'
import { deptTree } from '@/api/addressBookApi'
import { getDeptId } from '@/api/business'

import filterTop from './components/filterTop.vue'
export default {
  components: {
    filterTop
  },
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      slotArr: [
        'action',
        'footer'
      ],
      loading: false,
      userArray: [],
      more: '',
      multipleSelection: [],
      platformArray: [],
      tearchArray: [],
      deptTreeArray: [],
      searchForm: {
        deptIdChain: [],
        userId: '',
        timeArray: []
      },
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: markHotDetailsColumns,
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters(['userDeptId'])
  },
  created() {
    const arr = this.$route.query?.deptIdChain && this.$route.query?.deptIdChain.split('-').map(i => Number(i))
    // 不要数组第0个
    arr && arr.shift()
    this.searchForm.deptIdChain = this.$route.query.deptIdChain
      ? arr
      : []
    this.searchForm.userId = this.$route.query.createUserId || ''
    this.searchForm.timeArray = [this.$route.query.startDate || '', this.$route.query.endDate || '']
    this.getList()
    this.loadUserLoginInfo()
  },
  methods: {
    visibleChange(val, data) {
      this.searchForm.deptIdChain = data.deptIdChain
      this.loadUserNoPage()
      this.getListForSearch(data)
    },
    loadUserNoPage() {
      console.log(this.searchForm.deptIdChain, '部门')
      const params = {
        nickName: '',
        deptId: this.searchForm.deptIdChain.length && String(this.searchForm.deptIdChain[this.searchForm.deptIdChain.length - 1]) || ''
      }
      userNoPage(params)
        .then(res => {
          // 过滤离职人员
          res.data = res.data.filter(i => i.status === 0)
          this.userArray = res.data
        })
        .catch(() => {})
    },
    async exportTable() {
      const params = {
        deptIdChain: `0-${this.searchForm.deptIdChain.join('-')}`,
        userId: this.searchForm.userId,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        startDate: this.searchForm.timeArray[0],
        endDate: this.searchForm.timeArray[1]
      }
      const res = await exportHotMarkList(params)
      if (res.success) {
        this.$message.success('导出成功')
        window.open(res.data)
      }
    },
    viewTags(row) {
      console.log(row)
      const toTaskLog = this.$router.resolve({
        path: `/showSemiVideoDetail/${row.projectId}?videoType=2&videoGroupName=${row.projectName}&videoId=${row.desensitizedVideoId}&fromType=3`
      })
      window.open(toTaskLog.href, '_blank')
    },
    setListItemDisable(list) {
      list.forEach(element => {
        element.disabled = false
        if (element.children && element.children.length > 0) {
          this.setListItemDisable(element.children)
        }
      })
    },
    findParents(treeData, id) {
      if (treeData.length === 0) return
      for (let i = 0; i < treeData.length; i++) {
        if (treeData[i].id === id) {
          treeData[i].disabled = false
          if (treeData[i].children) {
            this.setListItemDisable(treeData[i].children)
          }
          return []
        } else {
          if (treeData[i].children) {
            const res = this.findParents(treeData[i].children, id)
            if (res !== undefined) {
              return res.concat(treeData[i].id)
            }
          }
        }
      }
    },
    encapsulateData(array) {
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        array[i].disabled = true
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
      return array
    },
    async loadUserLoginInfo() {
      const res = await deptTree()
      const tree = this.encapsulateData(res.data)
      this.deptTreeArray = tree
      const resDeprt = await getDeptId() || Number(localStorage.getItem('userDeptId')) || this.userDeptId
      const deptId = resDeprt.data
      const list = this.findParents(tree, deptId)
      const list2 = list.reverse()
      list2.push(deptId)
      console.log(this.deptTreeArray, 'this.deptTreeArray')
      getLoginInfo().then(res => {
        if (res.success) {
          this.roleObject = res.data
          this.loadUserNoPage()
        }
      })
    },
    // 页码改变触发
    handleSizeChange(val) {
      this.config.currentPage = 1
      this.config.pageSize = val
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    getListForSearch(data) {
      this.config.currentPage = 1
      this.searchForm = { ...this.searchForm, ...data }
      this.getList()
    },
    // 批量选择
    handleSelectionChange(row) {
      this.multipleSelection = row
      console.log(this.multipleSelection, 'this.multipleSelection')
      const sameScheduleIds = row.filter(
        i => row[0].id === i.id && i.id !== '0'
      ).length
      console.log(sameScheduleIds)
      this.canShowDownJob = sameScheduleIds === row.length
    },
    sortChange() {
      this.getList()
    },
    clear() {
      this.config.currentPage = 1
      const arr = this.$route.query.deptIdChain.split('-').map(i => Number(i))
      // 不要数组第0个
      arr.shift()
      this.searchForm.deptIdChain = this.$route.query.deptIdChain
        ? arr
        : []
      this.searchForm.userId = this.$route.query.createUserId || ''
      this.searchForm.timeArray = [this.$route.query.startDate || '', this.$route.query.endDate || '']
      this.getList()
    },
    // 获取列表
    async getList() {
      this.loading = true
      console.log(this.searchForm, 'this.searchForm')
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        deptIdChain: `0-${this.searchForm.deptIdChain.join('-')}`,
        userId: this.searchForm.userId,
        startDate: this.searchForm.timeArray[0],
        endDate: this.searchForm.timeArray[1]
      }
      const res = await qryHotMarkList(params)
      this.config.tableData = res.data.items
      this.config.total = res.data.total
      this.loading = false
    }
  }
}
</script>
  <style lang="scss" scoped>
  .page-content {
    height: 100%;
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    ::v-deep .el-tabs {
      height: 100%;
    }
    ::v-deep .el-tabs__item {
      font-size: 16px;
    }
    ::v-deep .el-tabs__content {
      height: calc(100% - 40px);
    }
    ::v-deep .el-tabs__header {
      margin: 0;
    }
    ::v-deep .el-tab-pane {
      height: 100%;
    }
  }
  .details-container ::v-deep {
    .form-breadcrumb {
      padding-bottom: 15px;
      border-bottom: 1px solid #EFF2F6;
    }
    .tool-block {
      padding: 20px 0;
      .plus-btn {
        margin-right: 5px;
        font-weight: bold;
      }
    }
}
  .page_wrap1 ::v-deep {
    height: calc(100vh - 165px);
    background: #fff;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    // padding-top: 15px;
    .tablePage {
      height: 600px;
    }
    .el-table::before {
      background-color: transparent;
    }
    .my-table {
      margin: 0 !important;
    }
  }
  </style>

