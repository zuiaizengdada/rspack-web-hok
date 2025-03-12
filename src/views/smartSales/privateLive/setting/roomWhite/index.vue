<template>
  <div class="page_wrap">
    <div class="m-b-20 fl">
      <el-button
        size="small"
        type="primary"
        @click="onhandleAdd"
        v-permission="['btn:roomWhite:add', permsList]"
      >
        <i class="el-icon-plus" />新增白名单
      </el-button>
    </div>
    <ZBTable
      ref="zbTableRef"
      :columns="columns"
      :get-list="getList"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    >
      <template v-slot:status="{ scope }">
        <AppStatus :status="['success', 'error'][scope.row.status]">
          <span>
            {{ ['在职', '离职'][scope.row.status] }}
          </span>
        </AppStatus>
      </template>
      <template v-slot:operate="{ scope }">
        <el-button
          v-permission="['btn:roomWhite:delete', permsList]"
          type="text"
          style="margin-left: 0px"
          class="c_F53F3F"
          @click="onhandleDel(scope.row)"
        >
          删除
        </el-button>
      </template>
    </ZBTable>
    <addDialog :config="addConfig" @success="clsoeAddDialog" />
  </div>
</template>

<script>
import addDialog from './addDialog.vue'
import { getWhiteListPage, editWhiteList } from '@/api/liveRoom/setting.js'
import AppStatus from '@/components/AppStatus'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { columns } from './columns'
export default {
  components: {
    ZBTable,
    addDialog,
    AppStatus
  },
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      columns,
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      addConfig: {
        visible: false,
        row: {}
      }
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.searchFn(false, false)
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.searchFn()
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      if (isClear) {
        this.tableConfig.pageSize = 10
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        ...this.tableConfig
      }
      return new Promise((resolve, reject) => {
        getWhiteListPage(params)
          .then(res => {
            res.data.items.map((v, i) => {
              v.sort =
                (this.$refs.zbTableRef.currentPage - 1) *
                  this.tableConfig.pageSize +
                i +
                1
            })
            resolve(res)
          })
          .catch(() => {
            reject()
          })
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
      this.searchFn()
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
          editWhiteList(data)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              row.loading = false
              this.searchFn()
            })
            .catch(() => {
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
  padding: 0 20px 20px 20px;
}
</style>
