<template>
  <div class="page_wrap">
    <!-- 弹框层 -->
    <AppDialog
      v-model="data.visible"
      :title="data.title"
      width="400"
      height="490"
      :btn-footer="false"
      @success="addModal.visible = false"
    >
      <div class="dialog-list">
        <!-- 商品分组管理列表 -->
        <div class="fl">
          <span class="header-title">IP姓名</span>
          <tearchInput v-model="input_val" @clear="clearSearchFn" @select="searchFn" />
          <!-- <tearchInput
            ref="teacherSelect"
            :value="select_val"
            :default-tearch-id="select_teacherId"
            @selected="onTeacherSelect"
          /> -->
        </div>
        <el-table
          ref="tab"
          :data="config.tableData"
          border
          height="380"
          max-height="380px"
          max-width="480px"
          @selection-change="handleListSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="IP名称" prop="teacherName">
            <template slot-scope="{ row }">
              {{ row.teacherName }}
            </template>
          </el-table-column>
          <el-table-column label="文件名称" prop="documentName">
            <template slot-scope="{ row }">
              {{ row.documentName }}
            </template>
          </el-table-column>
          <el-table-column label="文件后缀名" prop="documentSuffix">
            <template slot-scope="{ row }">
              {{ row.documentSuffix }}
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination
            :current-page="config.currentPage"
            :page-sizes="config.pageSizes"
            :page-size="config.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="config.total"
            @size-change="handleListSizeChange"
            @current-change="handleListCurrentChange"
          />
        </div>
        <div slot="footer" class="footer">
          <el-button
            :disabled="slection.length ? false : true"
            :loading="data.loading"
            type="primary"
            @click="submitForm"
          >选择引用</el-button>
        </div>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import tearchInput from '@/components/Modal/shop/components/tearchInput.vue'
import { documentMaterialPage } from '@/api/courseDoc/index'
import { string } from 'clipboard'
export default {
  name: 'GoodsGrouping',
  components: {
    AppDialog,
    tearchInput
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    selectedData: {
      type: Array,
      default: () => []
    },
    materialType: string
  },
  data() {
    return {
      loading: false,
      input_val: '',
      pageName: '',
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'shelveFlag'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'teacherName', label: 'IP名称', type: 'text' },
          { prop: 'documentName', label: '文件名称', type: 'text', width: '120' },
          { prop: 'documentSuffix', label: '文件后缀', type: 'text', width: '160' }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      // 弹框属性
      modal: {
        title: '新增标签',
        type: 1, // 1: 新增; 2查看; 3编辑;
        visible: false
      },
      multipleSelection: [],
      allChangeType: false,
      permsList: this.$route.meta.permsList || [],
      slection: []
    }
  },
  watch: {},
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const materialType = this.materialType
      const params = {
        materialType,
        teacherName: this.input_val,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      documentMaterialPage(params)
        .then((res) => {
          console.log(res, '列表数据')
          this.loading = false
          this.config.total = res.data.total
          this.config.tableData = res.data.items
          // const rows = []
          // for (let m = 0; m < this.selectedData.length; m++) {
          //   for (let n = 0; n < this.config.tableData.length; n++) {
          //     console.log(this.config.tableData.length)
          //     if (this.selectedData[m].id === this.config.tableData[n].id) {
          //       // console.log('this.selectedData groupingId', this.selectedData[m].id)
          //       // console.log('this.config.tableData groupingId', this.config.tableData[n].id)
          //       rows.push(this.config.tableData[n])
          //     }
          //   }
          // }
          // console.log('rows', rows)
          // this.$nextTick(() => {
          //   rows.forEach((row) => {
          //     this.$refs.tab.toggleRowSelection(row, true)
          //   })
          // })
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleListSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleListCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    handleListSelectionChange(val) {
      // this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.slection = val
      // this.getList()5
    },
    submitForm() {
      console.log('this.slection', this.slection)
      if (this.slection.length) {
        this.$emit('selectDataFn', this.slection)
        this.slection = []
        this.$refs.tab.clearSelection()
        this.data.visible = false
      }
    },
    searchFn(e) {
      console.log(e)
      this.input_val = e.value
      console.log('input_val', this.input_val)
      this.config.currentPage = 1
      this.getList()
    },
    clearSearchFn() {
      this.input_val = ''
      this.config.currentPage = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>

.dialog-list {
  height: 490px;
  padding: 20px;
  .header-title {
    text-align: center;
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: inline-block;
    font-weight: 700;
    padding-right: 20px;
  }
  .pagination-box {
    display: flex;
    justify-content: flex-end;
    padding-top: 10px;
  }
  .footer {
    margin-top: 30px;
  }
}
</style>
