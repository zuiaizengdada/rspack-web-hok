<template>
  <div class="account-group-pages">
    <div class="details-container">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="form-breadcrumb">
        <el-breadcrumb-item :to="{ path: '/videoManagement/accountManage' }">账号管理</el-breadcrumb-item>
        <el-breadcrumb-item>账号分组管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="tool-block">
        <el-button type="primary" size="small" @click="toAddGroup"><i class="el-icon-plus plus-btn" />创建分组</el-button>
      </div>
    </div>
    <div class="table-block">
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
        <div slot="list" slot-scope="scope">
          <div v-for="item in scope.row.list" :key="item.accountId" class="group-list-item">
            <div class="account-block-img">
              <img class="img-logo" :src="item.avatar" />
              <img class="pt-logo" :src="item.ptAvator" />
            </div>

            <span>{{ item.name }}</span>
          </div>
        </div>
        <div slot="action" slot-scope="scope">
          <el-button type="text" @click="toEditDetail(scope.row)">编辑</el-button>
          <el-button class="del-cls" type="text" @click="deleteGroup(scope.row)">删除</el-button>
        </div>
        <div slot="footer" />
      </MPageLayout>
    </div>
    <addGroup ref="addgroup" @loadGroupList="loadGroupList" />
  </div>
</template>

<script>
import addGroup from './components/addGroup.vue'
import { getAccountGroupList, deleteGroup, getPlatform } from '@/api/videoManagement/accountManage'
export default {
  components: {
    addGroup
  },
  data() {
    return {
      loading: false,
      platformArray: [],
      slotArr: ['action', 'footer', 'list'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'groupName', label: '分组名', width: 180, type: 'text', visible: true, disable: true },
          { prop: 'userName', label: '创建人', width: 120, type: 'text', visible: true, disable: true },
          { prop: 'count', label: '账号数', width: 80, type: 'text', visible: true, disable: true },
          { prop: 'list', label: '账号详情', type: 'slot', visible: true, disable: false },
          { prop: 'action', label: '操作', width: 120, type: 'slot', visible: true, disable: true }
        ],
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
  },
  created() {
    this.loadPlatformData()
    this.loadGroupList()
  },
  methods: {
    toEditDetail(row) {
      console.log('ss', row)
      const list = row.list
      list?.some(item => {
        for (var i = 0; i < this.platformArray.length; i++) {
          if (item.platformId === this.platformArray[i].platformId) {
            item.ptAvator = this.platformArray[i].platformIcon
          }
        }
      })
      const obj = {
        type: 'edit',
        list: list,
        name: row.groupName,
        groupId: row.groupId
      }
      this.$refs.addgroup.editShow(obj)
    },
    toAddGroup() {
      this.$refs.addgroup.show()
    },
    deleteGroup(item) {
      this.$confirm('确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        const params = {
          groupId: item.groupId
        }
        deleteGroup(params).then(res => {
          console.log(res)
          if (res.success) {
            this.$message.success('删除成功！')
            this.loadGroupList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    loadPlatformData() {
      getPlatform().then(res => {
        if (res.success) {
          this.platformArray = res.data
        }
      })
    },
    loadGroupList() {
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        type: 1
      }
      getAccountGroupList(params).then(res => {
        if (res.success) {
          this.config.tableData = res.data.items
          this.config.currentPage = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.total = res.data.total
          this.config.tableData.some(item => {
            item.list?.some(obj => {
              for (let i = 0; i < this.platformArray.length; i++) {
                if (obj.platformId === this.platformArray[i].platformId) {
                  obj.ptAvator = this.platformArray[i].platformIcon
                }
              }
            })
          })
        }
      })
    },
    handleListSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.loadGroupList()
    },
    handleListCurrentChange(val) {
      this.config.currentPage = val
      this.loadGroupList()
    }
  }
}
</script>

<style lang="scss" scoped>
.details-container ::v-deep {
    padding: 20px;
    padding-bottom: 0px;
    .form-breadcrumb {
      padding-bottom: 20px;
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
.account-group-pages {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 10px;
  ::v-deep .PageLayout {
    min-height: 680px;
    .el-table__body-wrapper {
      height: 600px!important;
    }
  }
  .table-block {
    width: 100%;
    display: block;
    ::v-deep .page_footer {
      width: calc(100% - 32px);
      margin-left: 16px;
    }
    ::v-deep .page_header {
      margin-top: -20px;
      padding-top: 0px!important;
    }
  }
}
.del-cls {
  color: #F53F3F;
}
.group-list-item {
  float: left;
  margin-right: 10px;
  width: 136px;
  height: 48px;
  padding: 6px 10px;
  background: #FAFAFA;
  border-radius: 4px;
  margin-bottom: 8px;
  .account-block-img {
    float: left;
    width: 36px;
    height: 36px;
    margin-right: 5px;
    position: relative;
    .img-logo {
      width: 35px;
      height: 35px;
    border-radius: 100%;
  }
    .pt-logo {
      position: absolute;
      width: 16px;
      height: 16px;
      bottom: 0;
      right: -1px;
      border-radius: 100%;
    }
  }
  span {
    float: left;
    width: 70px;
    font-size: 12px;
    color: #333;
    line-height: 36px;
    height: 36px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

</style>

