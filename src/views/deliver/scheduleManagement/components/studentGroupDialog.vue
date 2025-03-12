<template>
  <el-dialog
    title="班期助教"
    width="800px"
    class="dialog-container"
    :visible.sync="visible"
  >
    <div v-loading="loading" class="AssistantDialog overflowOuto">
      <MPageLayout
        ref="MPageLayout"
        :key="tableKey"
        type="tablePage"
        class="drop-table"
        row-key="id"
        :slot-arr="slotArr"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :total="total"
        :table-data="tableData"
        :table-columns="tableColumns"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template slot="search">
          <el-form
            ref="ruleForm"
            label-width="70px"
            :inline="true"
            :model="search"
            size="small"
            @submit.native.prevent=""
          >
            <el-form-item label="助教名称">
              <el-input
                v-model="search.assistantName"
                style="width: 200px"
                placeholder="请输入"
                clearable
                @clear="searchFn"
                @change="searchFn"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                size="small"
                type="primary"
                @click="searchFn"
              >查询</el-button>
              <el-button size="small" @click="clear">重置</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template #groupNo="{row}">
          <div class="flex flex-middle">
            <div>
              <el-input-number
                ref="groupNo"
                v-model="row.groupNo"
                style="width:80px;magin-right:10px"
                size="small"
                :controls="false"
                :precision="0"
                :min="1"
                :max="500"
                @blur="handleChangeNum(row)"
              />组
            </div>
          </div>
        </template>
      </MPageLayout>
    </div>
  </el-dialog>
</template>

<script>
import { assistantGroupPage, assistantGroupEditGroup } from '@/api/deliver/assistant'
export default {
  data() {
    return {
      loading: false,
      slotArr: ['search', 'groupNo'],
      tableData: [],
      visible: false,
      tableColumns: [
        { prop: 'assistantName', label: '助教姓名', type: 'text' },
        { prop: 'groupNo', label: '分组', type: 'slot' }
        // {
        //   prop: 'studentNum',
        //   label: '分组学员数',
        //   type: 'text'
        // },
        // {
        //   prop: 'deliveryNum',
        //   label: '未交付人数',
        //   type: 'text'
        // },
        // {
        //   prop: 'deliveredCount',
        //   label: '入班率',
        //   type: 'text'
        // }
      ],
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      search: {
        assistantName: ''
      },
      current: {
        scheduleId: ''
      },
      tableKey: 0
    }
  },
  methods: {
    open(row) {
      this.current.scheduleId = row.id
      console.log(row)
      this.search = {
        assistantName: ''
      }
      this.visible = true
      this.searchFn()
    },
    handleEditPrice(row) {
      row.editPrice = true
      row.groupNoCopy = row.groupNo
      this.$nextTick(() => {
        this.$refs.groupNo.focus()
      })
    },
    async handleChangeNum(row) {
      if (row.groupNoCopy === row.groupNo) {
        row.editPrice = false
        return
      }
      const { code } = await assistantGroupEditGroup({
        id: row.id,
        groupNo: row.groupNo,
        scheduleId: this.current.scheduleId
      })
      if (code === 1) {
        // eslint-disable-next-line require-atomic-updates
        row.editPrice = false
        this.$message.success('修改成功')
        this.getList()
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        scheduleId: this.current.scheduleId,
        assistantName: this.search.assistantName
      }
      return assistantGroupPage(params)
        .then(res => {
          this.tableData = []
          this.loading = false
          this.tableKey++
          this.tableData = res.data.records.map(i => {
            return {
              ...i,
              editPrice: false
            }
          })
          this.total = +res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    // 点击重置
    clear() {
      this.search = {
        scheduleId: ''
      }
      this.searchFn()
    }
  }
}
</script>

<style lang='scss' scoped>
.dialog-container ::v-deep{
  .table-edit_icon{
    width:16px;
    height:16px;
    margin-left:5px;
    cursor: pointer;
  }
  .el-form{
    margin-top: 10px;
  }
  .el-dialog__body{
    padding: 0px 20px 30px;
  }
  .el-form-item--small.el-form-item{
    margin-bottom: 10px;
  }
  .my-table {
    margin: 0;
  }
  .tablePage .page_footer {
    padding: 0;
    box-shadow: none;
  }
  .page_content{
    border-radius: 8px;
  }
  .tablePage {
    height: 500px;
    flex: 1;
  }
  .tablePage .page_content {
    margin-bottom: 0;
  }
  .tablePage .page_header {
    padding: 10px 0 0;
  }
  .tablePage .page_content {
    padding-bottom: 0px !important;
  }
  .tablePage .page_footer {
    padding: 17px 0 !important;
  }
}

</style>
