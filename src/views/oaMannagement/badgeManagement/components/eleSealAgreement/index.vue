<template>
  <MCard class="resume-list">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      row-key="id"
      reserve-selection
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
        <filterTop
          :search="search"
          style="margin-bottom: 5px"
          @onSearch="onSearchFn"
          @onClear="onClear"
        />
      </template>
      <template slot="sealType" slot-scope="{ row }">
        {{ row.sealType | getOptionsValue(sealTypeOption) }}
      </template>
      <template slot="status" slot-scope="{ row }">
        <el-switch
          :value="row.status"
          :active-value="1"
          :inactive-value="2"
          @change="setEnableOrDisable($event, row)"
        />
      </template>
      <div slot="headerRight" style="margin-bottom: 5px">
        <el-button size="mini" type="default" @click="add" class="addBtn"
          >+ 新增</el-button
        >
      </div>
      <template slot="action" slot-scope="{ row }">
        <div>
          <el-button type="text" @click="gotoDownload(row)">下载</el-button>
          <el-button type="text" @click="edit(row)">修改</el-button>
          <el-button type="text" @click="sealPreview(row)">预览</el-button>
          <el-button style="color: #f53f3f" type="text" @click="onDel(row)"
            >删除</el-button
          >
        </div>
      </template>
    </MPageLayout>

    <addDialog
      :row="row"
      v-if="editDialogVisiable"
      :visible.sync="editDialogVisiable"
      @close="editDialogVisiable = false"
      @success="submitEditDialog"
    />
    <sealPreviewDialog
      :row="row"
      :title="row.sealName"
      :url="row.sealUrl"
      v-if="sealPreviewDialogVisable"
      :visible.sync="sealPreviewDialogVisable"
      @close="sealPreviewDialogVisable = false"
    />

    <badgeStatusDialog
      :row="row"
      v-if="badgeStatusDialogVisable"
      :visible.sync="badgeStatusDialogVisable"
      @close="badgeStatusDialogVisable = false"
      @success="successBadgeStatusDialog"
    ></badgeStatusDialog>
  </MCard>
</template>

<script>
import filterTop from './components/filterTop.vue'
import { getColumns } from './components/columns'
import addDialog from './components/addDialog.vue'
import sealPreviewDialog from './components/sealPreviewDialog.vue'
import badgeStatusDialog from './components/badgeStatusDialog'
import { downLink } from '@/utils/index'
import {
  electronicSealPageListAjax,
  electronicSealDeleteAjax,
  electronicSealInfoAjax
} from '../../../api/badge'
import { sealTypeOption } from '../../options'

export default {
  components: {
    filterTop,
    sealPreviewDialog,
    addDialog,
    badgeStatusDialog
  },
  data() {
    return {
      slotArr: [
        'action',
        'search',
        'footer',
        'sealType',
        'headerRight',
        'status'
      ],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      row: {},
      info: {},
      search: {
        sealName: ''
      },
      loading: false,
      giveupDialogVisiable: false,
      editDialogVisiable: false,
      multipleSelection: [],
      QRCodeDialogVisible: false,
      waitingPersonAudtDialogVisible: false,
      onDutyDialogVisible: false,
      selectList: [],
      sealPreviewDialogVisable: false,
      badgeStatusDialogVisable: false,
      sealTypeOption
    }
  },
  mounted() {
    this.$uweb?.setAction('Event_oa_staffManagement_page')
    this.onSearchFn()
  },
  activated() {
    this.onSearchFn()
  },
  methods: {
    submitEditDialog() {
      this.$uweb?.setAction('Event_oa_staffManagement_add')
      this.editDialogVisiable = false
      this.onSearchFn()
    },
    add() {
      this.row = {}
      this.editDialogVisiable = true
    },
    async edit(row) {
      row.editLoading = true
      const params = {
        id: row.id
      }
      electronicSealInfoAjax(params)
        .then(res => {
          if (res.code === 1) {
            this.row = { ...res.data, ifEdit: true }
            this.editDialogVisiable = true
          }
        })
        .finally(() => {
          row.editLoading = false
        })
    },
    // 分页改变触发
    handleSizeChange(row) {
      this.config.pageSize = row
      this.config.currentPage = 1
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(row) {
      this.config.currentPage = row
      this.getList()
    },
    // 点击查询按钮
    onSearchFn() {
      this.config.currentPage = 1
      this.getList()
      this.$emit('submit')
      this.$refs.MPageLayout.$refs.pageLayout.$refs.mTable.clearSelection()
    },
    // 点击重置按钮
    onClear() {
      this.search = {
        sealName: ''
      }
      this.onSearchFn()
    },
    // 获取列表数据
    async getList() {
      this.loading = true

      const params = {
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage,
        ...this.search
      }

      electronicSealPageListAjax(params)
        .then(res => {
          if (res.code === 1) {
            // res.data.items?.map(v => {
            //   v.editLoading = false
            // })
            res.data.items?.forEach((v, index) => {
              v.editLoading = false
              v.index =
                (this.config.currentPage - 1) * this.config.pageSize + index + 1
            })
            this.config.tableData = res.data.items || []
            this.config.total = res.data.total
            // 刷新表格 防止对不齐
            this.$nextTick(() => {
              this.$refs.MPageLayout?.doLayout()
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    //审批登记表
    handleWaitingPersonAudt() {
      this.waitingPersonAudtDialogVisible = true
    },
    //已登记
    handleOnDuty() {
      this.onDutyDialogVisible = true
    },
    // 下载
    gotoDownload(row) {
      downLink(row.sealUrl, row.sealName)
    },
    //预览
    sealPreview(row) {
      this.row = { ...row }
      console.log(this.row, '7777777')
      this.sealPreviewDialogVisable = true
    },
    //删除
    onDel(row) {
      this.$delModal({
        tips: `请确认删除"${row.sealName}"印章？`,
        success: () => {
          this.loading = true
          const params = {
            id: row.id
          }
          electronicSealDeleteAjax(params)
            .then(res => {
              if (res.code == 1) {
                this.loading = false
                this.onSearchFn()
              }
            })
            .catch(() => {
              this.loading = false
            })
        },
        fail: () => {}
      })
    },
    //开启禁用
    setEnableOrDisable(e, row) {
      console.log(e, row, '333333')
      if (e === true) {
        //开启
        this.row = { ...row }
        this.badgeStatusDialogVisable = true
      } else {
        //禁用
        this.row = { ...row }
        this.badgeStatusDialogVisable = true
      }
    },
    successBadgeStatusDialog() {
      this.badgeStatusDialogVisable = false
      this.onSearchFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  padding: 0 !important;
}

.resume-list {
  min-width: 1200px;
}

.assetsTable ::v-deep .el-table__cell {
  padding: 10px 6px;
}
::v-deep .tablePage .page_header .page_header_action {
  justify-content: flex-end;
}
::v-deep .highlight-row {
  background-color: #e8f0fc;
}

.userStatus {
  display: flex;
  align-items: center;
  > p {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  .userStatus1 {
    background-color: #00b42a;
  }
  .userStatus2,
  .userStatus6 {
    background-color: #ff9733;
  }
  .userStatus3,
  .userStatus5,
  .userStatus4 {
    background-color: #ed1b24;
  }
  .userStatus7 {
    background-color: #dde1e6;
  }
}
::v-deep .page_header {
  padding: 10px 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
  .el-table {
    &::after {
      background-color: #e7e7e7;
    }
  }
}
::v-deep {
  .el-table__header {
    tr {
      // 第一个th
      th:first-child {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      }
      // 倒数第二个
      th {
        &:nth-last-child(2) {
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;
        }
      }
    }
    .el-table__cell {
      font-size: 14px;
      font-family: normal;
      color: #777777;
      border-bottom: none !important;
    }
  }
  .el-table__body {
    td {
      border-bottom: 1px solid #e7e7e7;
    }
  }
}
.mask-img {
  display: none;
  width: 100%;
  height: 20px;
  background: rgba(51, 51, 51, 0.4);
  position: absolute;
  bottom: 0;
  align-items: center;
  justify-content: center;
  user-select: none;
  .mask-img-item {
    font-size: 12px;
    color: #ffffff;
    cursor: pointer;
  }
}
.vertical-img {
  position: relative;
  width: 45px;
  height: 80px;
  background: #d8d8d8;
  border-radius: 4px;
  background-color: #d8d8d8;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% auto;
  &:hover {
    .mask-img {
      display: flex;
    }
  }
}
.horizontal-img {
  position: relative;
  width: 80px;
  height: 45px;
  border-radius: 4px;
  background-color: #d8d8d8;
  background-repeat: no-repeat;
  background-size: 100% auto;
  &:hover {
    .mask-img {
      display: flex;
    }
  }
}

.pointer {
  color: #2c82ff;
  margin-left: 5px;
}
.addBtn {
  border-color: #0c6fff;
  color: #0c6fff;
  font-size: 14px;
  font-weight: 400;
  font-family: '微软雅黑';
  width: 70px;
  height: 32px;
}
</style>
