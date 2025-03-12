<!-- 标准问题配置 -->
<template>
  <div class="wrapper">
    <!-- 定位路由上一级 -->
    <div class="location">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/sessionTemplate">会话模板</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>标准问题配置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="standardIssueConfig">
      <div class="standardIssueConfig-header">
        <el-form ref="form" inline label-width="80px" :model="searchForm">
          <el-row type="flex">
            <el-col :span="20">
              <el-form-item label="问题名称" prop="keyword">
                <el-input
                  v-model="searchForm.keyword"
                  placeholder="输入问题名称"
                  clearable
                  size="small"
                  @clear="searchStandardIssueConfig"
                  @keyup.enter.native="searchStandardIssueConfig"
                />
              </el-form-item>
              <el-form-item label="问题类型" prop="questionType">
                <el-select
                  v-model="searchForm.questionType"
                  placeholder="请选择问题类型"
                  clearable
                  size="small"
                  @clear="searchStandardIssueConfig"
                  @change="searchStandardIssueConfig"
                >
                  <el-option
                    v-for="item in questionTypeList"
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
                  @click="searchStandardIssueConfig"
                >
                  查询
                </el-button>
                <el-button size="small" @click="searchStandardIssueConfigReset">
                  重置
                </el-button>
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
              <el-button
                type="primary"
                size="small"
                @click="addStandardIssueConfig"
              >
                新增
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="standardIssueConfig-content">
        <el-table
          v-loading="loading"
          :header-cell-style="{ background: '#f5f5f5' }"
          :data="secondList"
          border
          stripe
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          />
          <el-table-column prop="title" label="问题标题" width="150" />
          <el-table-column prop="questionType" label="问题类型">
            <template slot-scope="scope">
              {{ scope.row.questionType === 0 ? '预置问题' : '自定义问题' }}
            </template>
          </el-table-column>
          <el-table-column prop="placeholders" label="组装名称">
            <template slot-scope="scope">
              <p
                v-for="item in scope.row.placeholders"
                :key="item.placeholderId"
              >
                {{ item.anotherName ? item.anotherName : item.placeholderName }}
              </p>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="问题描述" />
          <el-table-column prop="createNickName" label="创建人" width="100" />
          <el-table-column prop="createTime" label="添加时间" width="100" />
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="editStandardIssueConfig(scope.row)"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="standardIssueConfig-footer">
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
import { aiProblemConfigPage } from '@/api/aigc/standardIssueConfig'
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
      },
      questionTypeList: [
        {
          label: '预置问题',
          value: 0
        },
        {
          label: '自定义问题',
          value: 1
        }
      ]
    }
  },
  created() {
    this.getStandardIssueConfigList()
  },
  methods: {
    close() {
      this.row = {
        name: undefined,
        describe: undefined,
        type: undefined,
        postId: undefined
      }
      this.visible = false
      this.getStandardIssueConfigList()
    },
    // 业务场景列表
    async getStandardIssueConfigList() {
      const params = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        title: this.searchForm.keyword,
        questionType: this.searchForm.questionType
      }
      this.loading = true
      const data = await aiProblemConfigPage(params)
      this.secondList = data.data.items
      this.total = data.data.total
      this.loading = false
    },
    // 搜索业务场景模板
    searchStandardIssueConfig() {
      this.currentPage = 1
      this.getStandardIssueConfigList()
    },
    searchStandardIssueConfigReset() {
      this.$refs.form.resetFields()
      this.searchStandardIssueConfig()
    },
    // 每页显示条数改变
    handleSizeChange(val) {
      this.pageSize = val
      this.getStandardIssueConfigList()
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.getStandardIssueConfigList()
    },
    // 新增业务场景模板
    addStandardIssueConfig() {
      this.row = {
        name: undefined,
        describe: undefined,
        type: undefined,
        postId: undefined
      }
      this.visible = true
    },
    // 编辑业务场景模板
    editStandardIssueConfig(record) {
      this.row = record
      this.visible = true
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
  .standardIssueConfig-prompt {
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
  .standardIssueConfig {
    .standardIssueConfig-header {
      margin-bottom: 20px;
      border-bottom: 1px solid #ebeef5;
    }
    .standardIssueConfig-content {
      width: 100%;
      .el-table {
        width: 100%;
      }
    }
    .standardIssueConfig-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}
</style>
