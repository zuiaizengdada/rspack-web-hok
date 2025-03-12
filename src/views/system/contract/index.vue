<template>
  <div class="contract-container">
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      :get-list-api="getList"
    >
      <template #headerBtn>
        <el-button
          v-permission="['web:contract:add', permsList]"
          size="small"
          type="primary"
          :loading="loading"
          @click="openAddModel"
        >新增</el-button>
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button
          v-permission="['web:contract:edit', permsList]"
          type="text"
          @click="handleClickEdit(row)"
        >编辑</el-button>
        <el-button
          v-permission="['web:contract:disable', permsList]"
          type="text"
          @click="handleClickDisable(row)"
        >{{ row.showStatus !== 0? '禁用':'启用' }}</el-button>
        <el-button
          v-permission="['web:contract:del', permsList]"
          type="text"
          style="color: #F53F3F"
          @click="handleClickDel(row)"
        >删除</el-button>
      </template>
      <template slot="showStatus" slot-scope="{ row }">
        <AppStatus :status="['error','success'][row.showStatus]">
          <span>
            {{ ['禁用','启用'][row.showStatus] }}
          </span>
        </AppStatus>
      </template>
    </dynamicTable>
    <modal ref="modal" @success="successFn" />
  </div>
</template>

<script>
import AppStatus from '@/components/AppStatus'
import dynamicTable from '@/components/DynamicTable/table'
import modal from './components/modal.vue'
import { getColumns } from './column'
import { companyPage, companyDel, companyDisable } from '@/api/system/company'
export default {
  components: {
    AppStatus,
    modal,
    dynamicTable
  },
  data() {
    return {
      tableData: [],
      columns: getColumns(),
      loading: false,
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
    getList(params) {
      return companyPage(params)
    },
    // 点击新增收款渠道按钮
    openAddModel() {
      this.$refs.modal.open({}, 1)
    },
    // 点击编辑按钮
    handleClickEdit(row) {
      this.$refs.modal.open(row, 2)
    },
    // 点击禁用按钮
    handleClickDisable(row) {
      const text = row.showStatus !== 0 ? '禁用' : '启用'
      this.$delModal({
        tips: `是否${text}该合同主体`,
        success: () => {
          this.loading = true
          const data = {
            id: row.subjectId,
            status: row.showStatus === 0 ? 1 : 0
          }
          companyDisable(data)
            .then(res => {
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.init()
            }).catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击删除按钮
    handleClickDel(row) {
      this.$delModal({
        tips: `确定删除该合同主体？`,
        success: () => {
          this.loading = true
          const data = {
            id: row.subjectId
          }
          companyDel(data).then(res => {
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
@import '~@/styles/variables.scss';
.contract-container ::v-deep{
  @include responsive-height(62px);
  background: #fff;
  border-radius: 15px;
  .filter-container{
    padding: 10px 20px 0 20px;
  }
  .del-btn{
    color: #F53F3F;
  }
}
</style>
