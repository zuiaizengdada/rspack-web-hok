<template>
  <div class="page_wrap">
    <div class="page_wrap_header">
      <el-form
        slot="headerRight"
        class="header-form"
        :inline="true"
        size="small"
      >
        <el-form-item label="终端">
          <el-select v-model="form.terminal" clearable placeholder="请选择终端" @change="handerSearch">
            <el-option
              v-for="item in terminalList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            @click="handerSearch"
          >搜索</el-button>
          <el-button
            size="small"
            @click="reset"
          >重置</el-button>
          <el-button
            v-permission="['web:purchase:add', permsList]"
            type="primary"
            size="small"
            @click="handerAdd"
          >新增</el-button>
          <!-- <el-button   @click="$message('暂不支持')">导出</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="page_table">
      <dynamicTable
        ref="table"
        v-model="tableData"
        :columns="columns"
        :get-list-api="getList"
      >
        <template slot="action" slot-scope="{ row }">
          <el-button v-permission="['web:purchase:edit', permsList]" type="text" @click="edit(row)">编辑</el-button>
        </template>
      </dynamicTable>
    </div>
    <modal ref="modal" @success="handerSearch" />
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { goodsType, terminalList } from '@/utils/enum'
import { purchasePage } from '@/api/system/index'
import modal from './components/modal'
const terminalObj = {
  1: '抖音小程序安卓',
  2: '抖音小程序苹果',
  3: '微信小程序安卓',
  4: '安卓APP',
  5: '苹果APP',
  6: 'H5'
}
export default {
  components: {
    dynamicTable,
    modal
  },
  data() {
    return {
      tableData: [],
      terminalList,
      columns: [
        {
          prop: 'terminal',
          label: '终端',
          type: 'text',
          slotFn: row => terminalObj[row.terminal]
        },
        {
          prop: 'goodsType',
          label: '课程类型',
          type: 'text',
          slotFn: row => goodsType[row.goodsType]
        },
        { prop: 'createAt', label: '创建时间', type: 'text' },
        { prop: 'userName', label: '操作人', type: 'text' },
        { prop: 'action', label: '操作', type: 'slot', width: 80 }
      ],
      permsList: this.$route.meta.permsList || [],
      form: {
        terminal: ''
      }
    }
  },
  methods: {
    handerSearch() {
      this.$refs.table.config.pageIndex = 1
      this.$refs.table.onRefresh()
    },
    handerAdd() {
      this.$refs.modal.open()
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    reset() {
      this.form.terminal = ''
    },
    async getList(params) {
      return purchasePage({
        ...params,
        terminal: this.form.terminal || undefined
      }).then(res => {
        res.data.items = res.data.records
        return res
      })
    },
    edit(row) {
      this.$refs.modal.open(row, 'edit')
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap ::v-deep {
  height: calc(100vh - 220px);
  background: #fff;
  border-radius: 5px;
  min-width: 1200px;
  overflow: auto;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12),
    0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
  .filter-container {
    padding: 0px;
  }
  .goods-info-wrapper {
    width: 100%;
    height: 60px;
    text-align: left;
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .goods-info-detail {
      line-height: 1.5;
      width: calc(100% - 82px);
      height: 100%;
      flex: 1;
      display: -webkit-flex;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .titleOptions {
        width: 100%;
        // align-items: center;
        max-width: 90%;
        max-height: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        font-size: 14px;
        color: #353535;
        cursor: pointer;
      }
    }
  }
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
    .header-form {
      display: flex;
      align-items: center;
      height: 50px;
      .el-form-item {
        margin-bottom: 0px;
      }
    }
  }
  .page_table {
    height: calc(100% - 50px);
    padding: 6px 20px;
  }
}
::v-deep {
  .page_header {
    padding: 0 !important;
    min-height: 0 !important;
  }
  .my-table {
    margin: 0 !important;
  }
  .tablePage .page_footer {
    box-shadow: none;
  }
}
</style>
