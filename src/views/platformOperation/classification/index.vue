<template>
  <!-- 渠道商 -->
  <div class="page_wrap">
    <filterTop
      :loading="loading"
      :search="search"
      @handleSearch="searchFn"
      @handleClear="handleClear"
      @handleAdd="handleAdd"
    />
    <el-table
      ref="table"
      :data="config.tableData"
      class="table_wrap"
      style="width: 100%"
      :header-cell-style="{ background: '#f5f5f5' }"
      @expand-change="expandChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="sub-table">
            <el-table
              v-loading="props.row.loading"
              :data="props.row.rowTableData"
              style="width: 100%"
              :show-header="false"
            >
              <el-table-column label="" width="150px" />
              <el-table-column label="分类编码" prop="catalogueId">
                <template slot-scope="{ row }">
                  {{ row.catalogueId }}
                </template>
              </el-table-column>
              <el-table-column label="分类名称" prop="catalogueName">
                <template slot-scope="{ row }">
                  {{ row.catalogueName }}
                </template>
              </el-table-column>
              <el-table-column label="排序" prop="catalogueSort" width="100px">
                <template slot-scope="{ row }">
                  {{ row.catalogueSort }}
                </template>
              </el-table-column>
              <el-table-column label="创建时间" prop="createTime">
                <template slot-scope="{ row }">
                  {{ row.createTime }}
                </template>
              </el-table-column>
              <el-table-column label="创建人" prop="createBy" width="180px">
                <template slot-scope="{ row }">
                  {{ row.createBy }}
                </template>
              </el-table-column>
              <!-- <el-table-column label="内容管理" prop="createTime">
                <template slot-scope="{ row }">
                  {{ row.createTime }}
                </template>
              </el-table-column> -->
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <el-button
                    type="text"
                    @click="
                      handleEditSub(row, props.row.id, props.row.catalogueName)
                    "
                  >编辑</el-button>
                  <el-button
                    type="text"
                    class="c_red"
                    @click="handleRemove(row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类图标" prop="catalogueName" width="100px">
        <template slot-scope="{ row }">
          <el-image
            v-if="row.catalogueUrl"
            class="catalogue-icon"
            :src="row.catalogueUrl"
            :preview-src-list="[row.catalogueUrl]"
          />
        </template>
      </el-table-column>

      <el-table-column label="分类编码" prop="catalogueId">
        <template slot-scope="{ row }">
          {{ row.catalogueId }}
        </template>
      </el-table-column>
      <el-table-column label="分类名称" prop="catalogueName">
        <template slot-scope="{ row }">
          {{ row.catalogueName }}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="catalogueSort" width="100px">
        <template slot-scope="{ row }">
          {{ row.catalogueSort }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime">
        <template slot-scope="{ row }">
          {{ row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createBy" width="180px">
        <template slot-scope="{ row }">
          {{ row.createBy }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="内容管理" prop="createTime">
        <template slot-scope="{ row }">
          {{ row.createTime }}
        </template>
      </el-table-column> -->
      <el-table-column label="操作" prop="action">
        <template slot-scope="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" @click="handleAddSub(row)">新增下级</el-button>
          <el-button
            type="text"
            class="c_red"
            @click="handleRemove(row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page_footer">
      <el-pagination
        :current-page="config.currentPage"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="config.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <addDialog
      v-if="addConfig.visible"
      :config="addConfig"
      @success="closeAddDialog"
    />
  </div>
</template>

<script>
import filterTop from './components/filterTop.vue'
import addDialog from './components/addDialog.vue'
// import AppStatus from '@/components/AppStatus'
import {
  cataloguePage,
  catalogueDelete,
  subcataloguePage
} from '@/api/platform/classification.js'
export default {
  components: {
    filterTop,
    addDialog
    // AppStatus
  },
  data() {
    return {
      search: {
        catalogueName: ''
      },
      loading: false,
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'catalogueName', label: '分类图标', type: 'text' },
          { prop: 'catalogueId', label: '分类编码', type: 'text' },
          { prop: 'catalogueName', label: '分类名称', type: 'text' },
          { prop: 'catalogueSort', label: '排序', type: 'text' },
          { prop: 'createTime', label: '创建时间', type: 'text' },
          { prop: 'createBy', label: '创建人', type: 'text' },
          { prop: 'action', label: '操作', type: 'slot' }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      addConfig: {
        visible: false,
        row: {},
        type: 0
      },
      headerCellStyle: {
        background: '#E9EFF7',
        fontSize: '12px',
        fontFamily: 'PingFangSC-Medium, PingFang SC',
        fontWeight: 'bolder',
        color: '#2C3242',
        lineHeight: '17px',
        borderLeft: '1px solid #fff'
      },
      cellStyle: {
        fontSize: '12px',
        fontFamily: 'PingFangSC-Regular, PingFang SC',
        fontWeight: '400',
        color: '#2C3242'
      }
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        current: this.config.currentPage,
        size: this.config.pageSize,
        catalogueName: this.search.catalogueName
      }
      cataloguePage(params)
        .then(res => {
          this.config.tableData = res.data.records.map(i => ({
            ...i,
            rowTableData: []
          }))
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 筛选触发
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 编辑
    handleEdit(row) {
      this.addConfig = {
        visible: true,
        row: JSON.parse(JSON.stringify(row)),
        type: 1
      }
    },
    // 新增按钮点击触发
    handleAdd() {
      this.addConfig = {
        visible: true,
        row: {},
        type: 0
      }
    },
    handleEditSub(row, parentId, parentName) {
      this.addConfig = {
        visible: true,
        row: JSON.parse(JSON.stringify({ ...row, parentName, parentId })),
        type: 1
      }
    },

    handleAddSub({ catalogueName, id }) {
      this.addConfig = {
        visible: true,
        row: JSON.parse(
          JSON.stringify({ parentName: catalogueName, parentId: id })
        ),
        type: 3
      }
    },
    handleRemove(id) {
      this.$delModal({
        tips: `是否确定删除?`,
        success: async () => {
          await catalogueDelete(id)
          this.$message.success('删除成功')
          this.searchFn()
        }
      })
    },
    handleClear() {
      this.search = {
        status: '',
        name: ''
      }
      this.searchFn()
    },
    // 点击关闭弹框并刷新列表数据
    closeAddDialog() {
      this.addConfig.visible = false
      this.searchFn()
    },

    async expandChange(row) {
      row.loading = true
      const res = await subcataloguePage({ id: row.id }).finally(() => {
        row.loading = false
      })
      row.rowTableData = res.data
    },

    // 分页改变
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  padding: 20px;
  border-radius: 5px;
  background: #fff;
  width: 100%;
  height: calc(100vh - 190px);
  display: flex;
  flex-direction: column;
}
.page_footer {
  padding: 0 20px;
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.table-row {
  display: flex;
  width: 100%;
  height: 80px;
  line-height: 80px;
}
.catalogue-icon {
  width: 40px;
  height: 40px;
}
.table-cell {
  width: 18%;
  &:first-of-type {
    width: 84px;
  }
}
.sub-table ::v-deep {
  .el-table td.el-table__cell {
    border-bottom: none;
  }
}
::v-deep .el-table {
  overflow-y: auto;
  &::before {
    height: 0;
    background-color: transparent;
  }
}
</style>
