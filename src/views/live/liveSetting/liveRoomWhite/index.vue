<template>
  <div class="page_wrap">
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
        <div class="m-t-10 m-b-10 fl">
          <el-button size="small" type="primary" @click="onhandleAdd"><i class="el-icon-plus" />新增白名单</el-button>
        </div>
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button type="text" style="margin-right: 10px; margin-left: 0px;" class="c_F53F3F" @click="onhandleDel(row)">删除</el-button>
      </template>
      <template slot="status" slot-scope="{ row }">
        <AppStatus :status="['success', 'error'][row.status]">
          <span>
            {{ ['在职', '离职'][row.status] }}
          </span>
        </AppStatus>
      </template>
    </MPageLayout>
    <addDialog :config="addConfig" @success="clsoeAddDialog" />
  </div>
</template>

<script>
import moment from 'moment'
import addDialog from './addDialog.vue'
import { getWhiteListPage, editWhiteList } from '@/api/liveRoom/setting.js'
import AppStatus from '@/components/AppStatus'
export default {
  components: {
    addDialog,
    AppStatus
  },
  data() {
    return {
      slotArr: ['action', 'search', 'footer', 'status'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'sort', label: '序号', type: 'text', 'width': '80px' },
          { prop: 'staffName', label: '员工姓名', type: 'text', 'min-width': '200px' },
          { prop: 'mobile', label: '手机号码', type: 'text', 'min-width': '200px' },
          { prop: 'status', label: '状态', type: 'slot', 'min-width': '200px' },
          { prop: 'createUserName', label: '创建人', type: 'text', 'min-width': '200px' },
          { prop: 'createTime', label: '创建时间', type: 'text', 'min-width': '200px', render: (row) => { return moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') } },
          { prop: 'action', label: '操作', type: 'slot', width: '120px', fixed: 'right' }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      addConfig: {
        visible: false,
        row: {}
      }
    }
  },
  created() {
    this.config.currentPage = 1
    this.getList()
  },
  methods: {
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
      if (this.loading) {
        return
      }
      this.loading = true
      const data = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      getWhiteListPage(data).then(res => {
        console.log(res)
        res.data.items.map((v, i) => {
          v.sort = (this.config.currentPage - 1) * this.config.pageSize + i + 1
        })
        this.config.tableData = res.data.items
        this.config.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击新增
    onhandleAdd() {
      this.addConfig = {
        visible: true,
        row: {}
      }
    },
    clsoeAddDialog() {
      this.addConfig.visible = false
      this.getList()
    },
    onhandleDel(row) {
      this.$delModal({
        tips: '确认从白名单中移出该员工？',
        success: () => {
          row.loading = true
          const data = {
            id: row.id,
            whiteList: false,
            sysUserIds: [row.sysUserId],
            materialId: row.materialId
          }
          editWhiteList(data).then(res => {
            this.$notify.success({ title: '提示', message: '操作成功' })
            row.loading = false
            this.getList()
          }).catch(() => {
            row.loading = false
          })
        }
      })
    }

  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  // height: calc(100vh - 169px)!important;
  // min-width: 1200px;
}
.pagination {
  margin-top: 10px;
  text-align: right;
}
</style>
