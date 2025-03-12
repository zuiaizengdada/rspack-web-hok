<template>
  <el-drawer
    title="跟进状态设置"
    :visible.sync="drawer"
    size="900px"
    :before-close="handleClose"
  >
    <MPageLayout
      ref="MPageLayout"
      class="listWarp"
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
        <div class="list-box flex">
          <div class="addUser">
            <div class="list-title">邀请人：</div>
            <div v-if="assessUsers.length">
              <el-tag
                v-for="(item, index) in assessUsers"
                :key="item.userId"
                class="tagItem"
                closable
                @close="delAssessUsers(index)"
              >{{ item.userName }}</el-tag>
            </div>
            <el-button
              type="primary"
              size="mini"
              class="setUserBtn"
              @click="selectUser"
            >选择人员</el-button>
          </div>
          <div class="m-t-20 m-b-20">
            <el-button size="small" type="primary">生成我的邀课链接</el-button>
          </div>
        </div>
      </template>
      <template #action="{ row }">
        <el-button
          type="text"
          style="color: #f53f3f"
          @click="handleRemove(row)"
        >删除</el-button>
      </template>
    </MPageLayout>
  </el-drawer>
</template>

<script>
const linkStatus = { 1: '正常', 2: '失效' }
import { gethkPage, setlsHKDefault } from '@/api/privateArea/toolbox'
export default {
  components: {},
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      slotArr: ['action', 'search', 'footer'],
      assessUsers: [],
      userName: '',
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'linkName', label: '链接名称', type: 'text' },
          { prop: 'url', label: '链接地址', type: 'text' },
          { prop: 'createTime', label: '创建时间', type: 'text' },
          { prop: 'updateTime', label: '更新时间', type: 'text' },
          {
            prop: 'isDefault',
            label: '是否兜底',
            type: 'text',
            render: row => {
              return { 0: '否', 1: '是' }[row.isDefault]
            }
          },
          {
            prop: 'linkStatus',
            label: '状态',
            type: 'text',
            width: 100,
            slotFn: row => linkStatus[row.linkStatus]
          },
          { width: '150px', prop: 'action', label: '操作', type: 'slot' }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        name: ''
      },
      loading: false
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    handleClose() {
      this.$emit('update:drawer', false)
    },
    clear() {
      this.search.name = ''
      this.searchFn()
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        linkName: this.search.name
      }
      gethkPage(data)
        .then(res => {
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleRemove(row) {
      this.$delModal({
        tips: `是否确定操作?`,
        success: () => {
          this.updateStatus(row)
        }
      })
    },
    // 筛选触发
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 分页改变触发
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.searchFn()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.searchFn()
    },
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.assessUsers,
        success: async res => {
          res.user.forEach(v => {
            v.userName = v.nickName
          })
          this.assessUsers = res.user
        }
      })
    },
    delAssessUsers(index) {
      this.assessUsers.splice(index, 1)
    },
    // 点击设为兜底
    onhandleEdit(row) {
      console.log(row, '点击设为兜底')
      this.loading = true
      const data = {
        userId: row.userId
      }
      setlsHKDefault(data)
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getList()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  height: calc(100vh - 169px);
  padding: 0 20px;
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 0px 0px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
.listWarp {
  padding: 0 20px;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.addUser {
  display: flex;
  align-items: center;
}
.tagItem {
  margin-right: 10px;
}
</style>
