<!-- 业务场景模板 -->
<template>
  <div class="second">
    <div class="second-header">
      <el-row type="flex" align="bottom">
        <el-col :span="20" style="margin-bottom: 16px">
          <div class="flex flex-middle">
            <span class="label">助手名称</span>
            <el-input
              v-model="searchForm.keyword"
              placeholder="输入助手名称"
              clearable
              style="width: 200px"
              size="small"
              @clear="searchSecond"
              @keyup.enter.native="searchSecond"
            />
            <el-button type="primary" size="small" @click="searchSecond">
              查询
            </el-button>
            <el-button size="small" @click="searchSecondReset">重置</el-button>
          </div>
        </el-col>
        <el-col
          :span="4"
          style="display: flex; align-items: center; justify-content: flex-end"
        />
      </el-row>
    </div>
    <div class="second-content">
      <el-table
        v-loading="loading"
        :header-cell-style="{ background: '#f5f5f5' }"
        :data="secondList"
        height="535px"
        stripe
      >
        <el-table-column prop="functionName" label="功能板块" width="120" />
        <el-table-column prop="title" label="助手名称" width="150" />
        <el-table-column prop="description" label="功能描述" width="150" />
        <el-table-column prop="sysParam" label="系统参数" width="150" />
        <el-table-column prop="prompt" label="Prompt">
          <template slot-scope="scope">
            <div class="second-prompt">{{ scope.row.prompt }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editSecond(scope.row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="second-footer">
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
    <createOrEditDialog
      v-if="visible"
      v-model="visible"
      :row="row"
      @close="close"
      @submit="successEdit"
    />
  </div>
</template>

<script>
import {
  aiBusinessScenePage,
  aiBusinessSceneEdit
} from '@/api/aigc/standardIssueConfig'
import createOrEditDialog from './component/createOrEditDialog.vue'
export default {
  name: 'Second',
  components: {
    createOrEditDialog
  },
  data() {
    return {
      visible: false,
      secondList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 搜索表单
      searchForm: {
        keyword: ''
      },
      loading: false,
      row: {
        name: undefined,
        describe: undefined,
        type: undefined,
        postId: undefined
      }
    }
  },
  created() {
    this.getSecondList()
  },
  methods: {
    // 跳转
    goType() {
      this.$router.push({ path: '/aigc/cueWordType' })
    },
    close() {
      this.row = {
        name: undefined,
        describe: undefined,
        type: undefined,
        postId: undefined
      }
      this.visible = false
    },
    // 业务场景列表
    async getSecondList() {
      this.loading = true
      const data = await aiBusinessScenePage({
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        title: this.searchForm.keyword || undefined
      })
      this.secondList = data.data.items
      this.total = data.data.total
      this.loading = false
    },
    searchSecondReset() {
      this.$refs.form.resetFields()
      this.getSecondList()
    },
    // 搜索业务场景模板
    searchSecond() {
      this.currentPage = 1
      this.getSecondList()
    },
    // 每页显示条数改变
    handleSizeChange(val) {
      this.pageSize = val
      this.getSecondList()
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSecondList()
    },
    // 编辑业务场景模板
    editSecond(record) {
      this.row = record
      console.log(this.row, 222)
      this.visible = true
    },
    async successEdit(data) {
      await aiBusinessSceneEdit(data)
      this.$message.success('编辑成功')
      this.visible = false
      this.getSecondList()
    }
  }
}
</script>
<style lang="scss" scoped>
.second {
  height: 100%;
  background-color: #fff;
  .second-header {
    margin-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
    .label {
      float: left;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      padding: 0 12px 0 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      font-weight: 700;
    }
  }
  .second-content {
    width: 100%;
    .el-table {
      width: 100%;
    }
  }
  .second-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  .second-prompt {
    white-space: pre-wrap;
    max-height: 150px;
    overflow-y: auto;
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
  .el-button {
    margin-left: 10px;
  }
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
