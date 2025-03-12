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
        <div class="m-t-20 m-b-20">
          <el-button
            size="small"
            type="primary"
            @click="handleEdit('ADD')"
          ><i class="el-icon-plus" /> 新增</el-button>
        </div>
      </template>
      <template #action="{ row }">
        <el-button type="text" @click="handleEdit('EDIT', row)">
          编辑</el-button>
        <el-button
          type="text"
          style="color: #f53f3f"
          @click="handleRemove(row)"
        >删除</el-button>
      </template>
    </MPageLayout>
    <addFollowUpStatus :config="configData" @success="handleOk" />
  </el-drawer>
</template>

<script>
import { getFollowTypePage, deleteFollowType } from '@/api/privateArea/clue'
import addFollowUpStatus from './addFollowUpStatus'
export default {
  components: {
    addFollowUpStatus
  },
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      slotArr: ['action', 'search', 'footer'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'followTypeName', label: '跟进状态名称', type: 'text' },
          { prop: 'userName', label: '操作人', type: 'text' },
          { prop: 'updateTime', label: '操作时间', type: 'text' },
          { width: '150px', prop: 'action', label: '操作', type: 'slot' }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      configData: {
        visible: false,
        type: 'ADD',
        data: ''
      },
      search: {
        name: ''
      },
      loading: false
    }
  },
  watch: {
    drawer: {
      handler: function () {
        if (this.drawer) this.handleCurrentChange(1)
      }
    }
  },
  methods: {
    handleOk() {
      this.configData = {
        ...this.configData,
        visible: false
      }
      if (this.configData.type === 'ADD') {
        this.handleCurrentChange(1)
      } else {
        this.getList()
      }
    },
    handleEdit(type, data) {
      this.configData = {
        visible: true,
        type,
        data: { ...data } || {}
      }
    },
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
      getFollowTypePage(data)
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
          this.deleteFollowType(row)
        }
      })
    },
    async deleteFollowType(row) {
      const { code } = await deleteFollowType(row.id)
      if (code === 1) this.searchFn()
    },
    // 筛选触发
    searchFn() {
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
</style>
