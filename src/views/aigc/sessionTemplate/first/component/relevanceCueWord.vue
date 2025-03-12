<template>
  <el-drawer
    title="我是标题"
    :visible.sync="drawerVisible"
    :before-close="handleClose"
    class="relevanceCueWord"
    :size="'50%'"
  >
    <div slot="title" class="title-row">
      <div>
        提示词 <span>{{ row.title }}</span>
      </div>
      <el-button type="primary" size="small" plain @click="openCueWord">
        关联提示词
      </el-button>
    </div>
    <div class="cue-word-content">
      <el-table
        v-loading="loading"
        :header-cell-style="{ background: '#f5f5f5' }"
        :data="relatedList"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55" />
        <el-table-column prop="title" label="提示词名称" width="150" />
        <el-table-column prop="content" label="提示词描述" />
        <el-table-column prop="typeName" label="分类" width="150" />
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="color: red"
              @click="deleteCueWord(scope.row)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="cue-word-footer">
      <el-button type="danger " size="small" @click="openBatchMsg">
        批量移除
      </el-button>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <cueWordListDialog
      v-model="visibleCurWordListDialog"
      :row="row"
      @submit="submitCurWordList"
      @close="visibleCurWordListDialog = false"
    />
    <!-- 批量删除提示 -->
    <el-dialog
      title=""
      :visible.sync="batchDialogVisible"
      append-to-body
      width="400px"
      :show-close="false"
      custom-class="batch-dialog"
    >
      <div slot="title" style="font-size: 20px">
        <i
          class="el-icon-info"
          style="color: #f1cd28; margin-right: 8px"
        />批量移除确认
      </div>
      <p>助手名称：{{ row.title }}</p>
      <p>
        移除提示词：{{
          multipleSelection
            .map(m => {
              return m.title
            })
            .join(',')
        }}
      </p>
      <p>确认是否移除？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchDeleteCueWord">确 定</el-button>
      </div>
    </el-dialog>
  </el-drawer>
</template>

<script>
import cueWordListDialog from './cueWordListDialog.vue'
import {
  relatedPage,
  relatedDelete,
  relatedBatchDelete
} from '@/api/aigc/relevanceCueWord'
export default {
  name: 'RelevanceCueWord',
  components: { cueWordListDialog },
  props: {
    drawerVisible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      relatedList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [],
      visibleCurWordListDialog: false,
      batchDialogVisible: false
    }
  },
  watch: {
    drawerVisible(val) {
      if (val) {
        this.currentPage = 1
        this.pageSize = 10
        this.getRelatedPaget()
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    submitCurWordList() {
      this.$emit('refresh')
      this.getRelatedPaget()
      this.visibleCurWordListDialog = false
    },
    openCueWord() {
      this.visibleCurWordListDialog = true
    },
    // 获取关联提示词列表
    getRelatedPaget() {
      const params = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        sessionTemplateId: this.row.id
      }
      this.loading = true
      relatedPage(params)
        .then(res => {
          this.loading = false
          this.relatedList = res.data.items
          this.total = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    openBatchMsg() {
      if (this.multipleSelection.length < 1) {
        return this.$message({
          type: 'warning',
          message: '请选择要移除的提示词'
        })
      }
      this.batchDialogVisible = true
    },
    // 批量移除提示词
    batchDeleteCueWord() {
      relatedBatchDelete({
        cueWordIds: this.multipleSelection.map(m => m.cueWordId),
        sessionTemplateId: this.row.id
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getRelatedPaget()
          this.$emit('refresh')
        })
        .finally(() => {
          this.batchDialogVisible = false
        })
    },
    // 移除提示词
    deleteCueWord(record) {
      this.$confirm(`是否移除【${record.title}】提示词?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          relatedDelete({
            cueWordId: record.cueWordId,
            sessionTemplateId: this.row.id
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$emit('refresh')
            this.getRelatedPaget()
          })
        })
        .catch(() => {})
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.getRelatedPaget()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getRelatedPaget()
    }
  }
}
</script>

<style lang="scss" scoped>
.relevanceCueWord {
  height: 100%;
  .title-row {
    padding: 18px 24px 18px 20px;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    span {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #919191;
      margin-left: 1px;
    }
  }
  .cue-word-content {
    width: 100%;
    .el-table {
      width: 100%;
      height: calc(100vh - 180px);
    }
  }
  .cue-word-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
}
::v-deep {
  .el-drawer__header {
    padding: 0 20px 0 0;
    border-bottom: 1px solid #d3d7d8;
    margin-bottom: 20px;
  }
  .el-drawer__body {
    width: 100%;
    padding: 0 24px;
  }
}

::v-deep .batch-dialog {
  margin-top: 20vh !important;
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>
