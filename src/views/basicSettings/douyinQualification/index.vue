<template>
  <div class="page_wrap">
    <MCard>
      <div class="page_wrap_header">
        <div class="header_wrap">
          <div>抖音资质管理</div>
          <el-button
            size="small"
            type="primary"
            @click="openAddModel"
          >上传资质</el-button>
        </div>
      </div>
      <div class="page_table">
        <dynamicTable
          ref="table"
          v-model="tableData"
          :columns="columns"
          :get-list-api="getList"
        >
          <template slot="action" slot-scope="{ row }">
            <el-button
              type="text"
              @click="handleClickView(row)"
            >查看</el-button>
            <el-button
              type="text"
              @click="handleClickEdit(row)"
            >编辑</el-button>
            <el-button
              v-if="row.douQualificationInfoVos && row.douQualificationInfoVos[0].status === 3"
              type="text"
              style="color: #F53F3F"
              @click="handleClickDel(row)"
            >删除</el-button>
            <el-button
              v-if="!row.name && row.douQualificationInfoVos && row.douQualificationInfoVos[0].status === 2"
              type="text"
              @click="handleClickAddQual(row)"
            >补充资质</el-button>
            <el-button
              v-if="row.douQualificationInfoVos && row.douQualificationInfoVos[0].status === 2 && row.auditStatus !== 1 "
              type="text"
              @click="handleClickViewQual(row)"
            >查看补充资质</el-button>
            <el-button
              v-if="row.douQualificationInfoVos && row.douQualificationInfoVos[0].status === 2 && row.auditStatus !== 1 "
              type="text"
              @click="handleClickEditQual(row)"
            >修改补充资质</el-button>
          </template>
          <template slot="status" slot-scope="{ row }">
            <span
              class="status"
              :style="{
                backgroundColor: row.douQualificationInfoVos && row.douQualificationInfoVos[0] && auditStatus[row.douQualificationInfoVos[0].status].color,
                color: row.douQualificationInfoVos && row.douQualificationInfoVos[0] && auditStatus[row.douQualificationInfoVos[0].status].textColor,
              }"
            >
              {{ row.douQualificationInfoVos && row.douQualificationInfoVos[0] ? auditStatus[row.douQualificationInfoVos[0].status].text:'——' }}
            </span>
          </template>
          <template slot="auditStatus" slot-scope="{ row }">
            <span
              class="status"
              :style="{
                backgroundColor: row.name && auditStatus[row.auditStatus].color,
                color: row.name && auditStatus[row.auditStatus].textColor,
              }"
            >
              {{ row.auditStatus && row.name ? auditStatus[row.auditStatus].text:'——' }}
            </span>
          </template>
        </dynamicTable>
      </div>
    </MCard>
    <modal ref="modal" @success="successFn" />
    <MDialog ref="dialog" />
    <qualDialog ref="qualDialog" />
    <qualModal ref="qualModal" @success="successFn" />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import modal from './components/modal'
import MDialog from './components/dialog'
import qualDialog from './components/qualDialog'
import qualModal from './components/qualModal'
import { getColumns } from './column'
import { getQualificationinfoPage, qualificationinfoDel } from '@/api/system/institution'
export default {
  components: {
    modal,
    MDialog,
    dynamicTable,
    qualModal,
    qualDialog
  },
  data() {
    return {
      tableData: [],
      columns: getColumns.call(this),
      loading: false,
      auditStatus: {
        1: {
          text: '审核中',
          color: '#FFF2E6',
          textColor: '#FF7D00'
        },
        2: {
          text: '审核通过',
          color: '#E6F7EA',
          textColor: '#00B42A'
        },
        3: {
          text: '审核不通过',
          color: '#FEECEC',
          textColor: '#F53F3F'
        }
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  // activated() {
  //   this.init()
  // },
  methods: {
    init() {
      this.$refs.table.config.pageIndex = 1
      this.$refs.table.onRefresh()
    },
    async getList(params) {
      return getQualificationinfoPage({
        ...params,
        current: params.pageIndex,
        size: params.pageSize,
        pageIndex: undefined,
        pageSize: undefined
      }).then(res => {
        res.data.items = res.data.records
        return res
      })
    },
    // 点击新增收款渠道按钮
    openAddModel() {
      this.$refs.modal.open({}, 'add')
    },
    handleClickView(row) {
      this.$refs.dialog.open(row)
    },
    handleClickAddQual(row) {
      this.$refs.qualModal.open(row, 'add')
    },
    handleClickViewQual(row) {
      this.$refs.qualDialog.open(row)
    },
    // 点击编辑按钮
    handleClickEdit(row) {
      this.$refs.modal.open(row, 'edit')
    },
    handleClickEditQual(row) {
      this.$refs.qualModal.open(row, 'edit')
    },
    // 点击删除按钮
    handleClickDel(row) {
      this.$delModal({
        tips: `确定要删除该条资质吗？`,
        success: () => {
          this.loading = true
          qualificationinfoDel(row.id).then(res => {
            this.loading = false
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.init()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },

    // 新增或者编辑的回调
    successFn() {
      this.init()
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  height: calc(100vh - 190px);
  background: #fff;
  border-radius: 5px;
  overflow: auto;
  .page_wrap_header {
    padding-left: 20px;
    padding-right: 20px;
    font-weight: bold;
    .header_wrap {
      padding-bottom: 20px;
      padding-left: 16px;
      padding-right: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      border-bottom: 1px solid #e7e7e7;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 24px;
    }
  }
  .page_table {
    height: calc(100% - 34px);
    padding: 16px 20px;
  }
}
.status{
  border-radius: 12px;
  padding: 5px 10px;
  font-size: 12px;
}
::v-deep {
    .page_header{
        padding: 0!important;
        min-height: 0!important;
    }
     .my-table{
        margin:0!important
    }
    .tablePage .page_footer{
        box-shadow: none;
    }
}
</style>
