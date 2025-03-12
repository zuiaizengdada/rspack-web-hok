<template>
  <!-- 获客助手链接 -->
  <div class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :slot-arr="slotArr"
      style="height: calc(100vh - 220px)"
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
            @click="handleAddModel"
          ><i class="el-icon-plus" /> 新增模板</el-button>
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

    <!-- 新增弹框 -->
    <el-dialog title="短信设置" :visible.sync="dialogVisible" width="30%">
      <el-form
        ref="validateForm"
        :model="formData"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="短信模板ID"
          prop="smsTemplateId"
          :rules="[{ required: true, message: '短信模板ID不能为空' }]"
        >
          <el-input
            v-model="formData.smsTemplateId"
            :maxlength="19"
            oninput="value=value.replace(/[^\d]/g,'')"
            placeholder="请输入短信模板ID"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="succeedLoading"
          @click="handleAdd"
        >确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSmsPage, addSms, deleteSms } from '@/api/privateArea/toolbox'
export default {
  components: {},
  data() {
    return {
      slotArr: ['action', 'search', 'footer'],
      dialogVisible: false,
      succeedLoading: false,
      formData: {
        smsTemplateId: ''
      },
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'smsId', label: '模板ID', type: 'text' },
          { prop: 'title', label: '模板标题', type: 'text' },
          { prop: 'content', label: '模板内容', type: 'text' },
          { prop: 'smsTypeName', label: '模板类型', type: 'text' },
          {
            prop: 'createUserName',
            label: '创建人',
            type: 'text',
            width: 100
          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'text',
            width: 200
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
    clear() {
      this.search.name = ''
      this.searchFn()
    },
    handleAddModel() {
      this.dialogVisible = true
      this.formData.smsTemplateId = ''
    },
    // 新增
    async handleAdd() {
      this.$refs.validateForm.validate(async valid => {
        if (valid) {
          this.succeedLoading = true
          try {
            const { code } = await addSms({
              smsTemplateId: this.formData.smsTemplateId
            })
            if (code === 1) {
              this.dialogVisible = false
              this.$message.success('新增短信模板成功')
              this.handleCurrentChange(1)
            }
            this.succeedLoading = false
          } catch {
            this.succeedLoading = false
          }
        }
      })
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        linkName: this.search.name
      }
      getSmsPage(data)
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
          this.deleteSms(row)
        }
      })
    },
    async deleteSms(row) {
      const { code } = await deleteSms(row.id)
      if (code === 1) {
        this.$message.success('该模板已删除')
        this.getList()
      }
    },
    // 筛选触发
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 分页改变触发
    handleSizeChange(val) {
      this.config.pageSize = val
      this.searchFn()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(76px);
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
</style>
