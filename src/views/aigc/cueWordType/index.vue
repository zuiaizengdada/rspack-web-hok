<!-- 提示词分类 -->
<template>
  <div class="wrapper">
    <!-- 定位路由上一级 -->
    <div class="location">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/cueWord">提示词管理</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>提示词分类管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cue-word-type">
      <div class="cue-word-type-header">
        <el-form ref="form" inline label-width="80px" :model="searchForm" size="small">
          <el-row>
            <el-col :span="20">
              <el-form-item label="分类名称" prop="name">
                <el-input
                  v-model="searchForm.name"
                  placeholder="输入分类名称"
                  clearable
                  @clear="searchCueWordReset"
                  @keyup.enter.native="searchCueWordType"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="searchCueWordType"
                >
                  查询
                </el-button>
                <el-button
                  @click="searchCueWordReset"
                >重置</el-button>
              </el-form-item>
            </el-col>
            <el-col
              :span="4"
              style="
                display: flex;
                align-items: center;
                justify-content: flex-end;
              "
            >
              <el-form-item>
                <el-button type="primary" @click="addCueWordType">
                  + 新增分类
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="cue-word-type-content">
        <el-table
          v-loading="loading"
          :header-cell-style="{ background: '#f5f5f5' }"
          :data="cueWordList"
          border
          stripe
        >
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="title" label="分类名称" />
          <el-table-column prop="createNickName" label="创建人" />
          <el-table-column prop="createTime" label="添加时间" />
          <!-- <el-table-column prop="updateTime" label="更新时间" /> -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="editCueWordType(scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                style="color: red"
                @click="deleteCueWordType(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column></el-table>
      </div>
      <div class="cue-word-type-footer">
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
    </div>
    <createOrEditDialog
      v-if="visible"
      v-model="visible"
      :row="row"
      @close="close"
    />
  </div>
</template>

<script>
import createOrEditDialog from './component/createOrEditDialog.vue'
import { aiPromptWordTypePage, aiPromptWordTypeDelete } from '@/api/aigc/cueWordType'
export default {
  name: 'CueWord',
  components: {
    createOrEditDialog
  },
  data() {
    return {
      visible: false,
      cueWordList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 搜索表单
      searchForm: { name: undefined },
      loading: false,
      row: {
        id: undefined,
        name: undefined
      }
    }
  },
  created() {
    this.getCueWordListType()
  },
  methods: {
    close() {
      this.row = {
        id: undefined,
        name: undefined
      }
      this.visible = false
      this.getCueWordListType()
    },
    // 获取分类列表
    async getCueWordListType() {
      this.loading = true
      try {
        const data = await aiPromptWordTypePage({ pageIndex: this.currentPage, pageSize: this.pageSize, content: this.searchForm.name })
        this.cueWordList = data.data.items
        this.total = data.data.total
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    },
    // 搜索分类
    searchCueWordType() {
      this.currentPage = 1
      this.getCueWordListType()
    },
    searchCueWordReset() {
      this.$refs.form.resetFields()
      this.currentPage = 1
      this.pageSize = 10
      this.getCueWordListType()
    },
    // 每页显示条数改变
    handleSizeChange(val) {
      this.pageSize = val
      this.getCueWordListType()
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCueWordListType()
    },
    // 添加分类
    addCueWordType() {
      this.visible = true
    },
    // 编辑分类
    editCueWordType(record) {
      this.row = record
      this.visible = true
    },
    // 删除分类
    deleteCueWordType(record) {
      console.log(record)
      this.$confirm(`是否删除【${record.title}】分类?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await aiPromptWordTypeDelete({ id: record.id })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getCueWordListType()
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  height: 100%;
  padding: 20px;
  background-color: #fff;
  .location {
    margin-bottom: 20px;
  }
  .el-button {
    margin-left: 10px;
  }
  .cue-word-type {
    .cue-word-type-header {
      border-bottom: 1px solid #ebeef5;
      margin-bottom: 20px;
    }
    .cue-word-type-content {
      width: 100%;
      .el-table {
        width: 100%;
      }
    }
    .cue-word-type-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}
</style>
