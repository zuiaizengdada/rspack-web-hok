<template>
  <el-dialog
    title="关联提示词"
    :visible.sync="getVisible"
    width="750px"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :loading="loading"
    append-to-body
  >
    <div class="cue-word-content">
      <el-table
        v-loading="loading"
        :header-cell-style="{ background: '#f5f5f5' }"
        :data="cueWordList"
        stripe
        max-height="460px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="title" label="提示词名称" width="150" />
        <el-table-column prop="content" label="提示词描述" />
        <el-table-column prop="typeName" label="分类" width="150" />
        <el-table-column prop="createTime" label="创建时间" width="120" />

        <el-table-column type="selection" width="55" align="center" />
      </el-table>
    </div>
    <div class="cue-word-footer">
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
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { unrelatedPage, relatedCueWordAdd } from '@/api/aigc/relevanceCueWord'
export default {
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    visible: {
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
      form: {
        name: undefined,
        describe: '',
        type: undefined,
        typeId: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入提示词名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        describe: [
          { required: true, message: '请输入提示词描述', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择提示词分类', trigger: 'blur' }]
      },
      cueWordList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: []
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:change', val)
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.currentPage = 1
        this.pageSize = 10
        this.getCueWordList()
      }
    }
  },
  methods: {
    // 获取提示词列表
    getCueWordList() {
      const params = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        sessionTemplateId: this.row.id
      }
      unrelatedPage(params)
        .then(res => {
          this.loading = false
          this.cueWordList = res.data.items
          this.total = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getCueWordList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCueWordList()
    },

    handleClose() {
      this.$emit('close')
    },
    submit() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择提示词'
        })
        return
      }
      // 执行api
      relatedCueWordAdd({
        cueWordIds: this.multipleSelection.map(m => m.cueWordId),
        sessionTemplateId: this.row.id
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '关联成功'
          })
          this.$emit('submit')
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.cue-word-content {
  width: 100%;
  height: 460px;

  .el-table {
    width: 100%;
    height: 460px;
  }
}
.cue-word-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
::v-deep {
  .el-table__body-wrapper {
    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
      // display: none;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background: #d0d0d0;
      transition: all 0.4s ease;
    }

    &::-webkit-scrollbar-track {
      background: #fff;
    }
  }
}
</style>
