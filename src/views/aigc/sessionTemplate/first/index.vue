<!-- 会话管理 -->
<template>
  <div class="first">
    <div class="first-header">
      <el-form
        ref="form"
        inline
        label-width="80px"
        size="small"
        :model="searchForm"
      >
        <el-row type="flex" align="bottom">
          <el-col :span="20">
            <el-form-item label="助手名称" prop="keyword">
              <el-input
                v-model="searchForm.keyword"
                placeholder="输入助手名称"
                clearable
                @clear="searchFirst"
                @keyup.enter.native="searchFirst"
              />
            </el-form-item>

            <el-form-item label="助手状态">
              <el-select
                v-model="searchForm.isDeleted"
                placeholder="助手状态"
                clearable
                @change="searchFirst"
                @clear="searchFirst"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="searchFirst">
                查询
              </el-button>
              <el-button size="small" @click="searchFirstReset">重置</el-button>
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
              <el-button size="small" type="default" @click="goReport">
                举报管理
              </el-button> </el-form-item
            ><el-form-item>
              <el-button size="small" type="primary" @click="addFirst">
                + 新建助手
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="first-content">
      <el-table
        v-loading="loading"
        :header-cell-style="{ background: '#f5f5f5' }"
        :data="firstList"
        height="540px"
        stripe
      >
        <el-table-column prop="title" label="助手名称" width="120" />
        <el-table-column prop="icon" label="图标" width="80">
          <template slot-scope="scope">
            <img v-if="scope.row.icon" class="img-icon" :src="scope.row.icon" />
            <div
              v-else
              class="img-icon"
              :style="{
                color: scope.row.textColor,
                backgroundColor: scope.row.backgroundColor
              }"
            >
              {{ scope.row.headerTitle }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="describe" label="功能描述" width="180" />
        <el-table-column prop="content" label="Prompt">
          <template slot-scope="scope">
            <div class="first-prompt">{{ scope.row.content }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="useCount" width="80" label="使用次数" />
        <el-table-column prop="isEnabled" label="助手状态" width="100">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.isEnabled == 1"
              type="danger"
              color="#E6F7EA"
              class="tag-custom"
            >
              <i
                class="el-icon-success"
                style="color: #00b42a; font-size: 14px; margin-right: 7px"
              />

              <span style="color: #00b42a">启用</span>
            </el-tag>
            <el-tag v-else type="danger" color="#FEECEC" class="tag-custom">
              <i
                class="el-icon-error"
                style="color: #f53f3f; font-size: 14px; margin-right: 7px"
              />

              <span style="color: #f53f3f">禁用</span>
            </el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="cueWord"
          label="提示词"
          width="100"
          align="center"
        >
          <template slot-scope="scope">
            <el-link
              style="color: #0c6fff"
              type="primary"
              @click="openCueWord(scope.row)"
            >
              {{ scope.row.count || 0 }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.sort }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="createNickName" label="创建人" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="100" />
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="isShowEdit(scope.row.id)"
              type="text"
              size="small"
              @click="editFirst(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.type === 2"
              type="text"
              style="color: #f53f3f"
              size="small"
              @click="deleteFirst(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="firstList.length" class="first-footer">
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
      @success="success"
      @close="close"
    />
    <relevanceCueWord
      :row="row"
      :drawer-visible="drawerVisible"
      @refresh="getFirstList"
      @close="drawerVisible = false"
    />
  </div>
</template>

<script>
import {
  aiSessionTemplatePage,
  aiSessionTemplateDelete
} from '@/api/aigc/standardIssueConfig'
import createOrEditDialog from './component/createOrEditDialog.vue'
import relevanceCueWord from './component/relevanceCueWord.vue'
export default {
  name: 'First',
  components: {
    createOrEditDialog,
    relevanceCueWord
  },
  data() {
    return {
      visible: false,
      firstList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      permsList: this.$route?.meta?.permsList || [],
      // 搜索表单
      searchForm: {
        keyword: '',
        postId: '',
        isDeleted: undefined
      },
      // 岗位
      postList: [],
      loading: false,
      row: {},
      statusList: [
        {
          label: '禁用',
          value: 0
        },
        {
          label: '启用',
          value: 1
        }
      ],
      drawerVisible: false
    }
  },
  created() {
    this.getFirstList()
    this.firstList = this.firstList.map(m => ({
      ...m
    }))
  },
  methods: {
    isShowEdit(id) {
      if (id === '1' || id === '10' || id === '11') {
        return this.permsList.includes('aigc:sessionTemplate:edit')
      } else {
        return true
      }
    },
    openCueWord(record) {
      this.row = record
      this.drawerVisible = true
    },
    // 跳转
    goType() {
      this.$router.push({ path: '/aigc/standardIssueConfig' })
    },
    success() {
      this.row = {}
      this.visible = false
      this.getFirstList()
    },
    close() {
      this.row = {}
      this.visible = false
      // this.getFirstList()
    },
    //  会话模板列表
    async getFirstList() {
      const params = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        title: this.searchForm.keyword || undefined,
        isEnabled:
          typeof this.searchForm.isDeleted === 'undefined'
            ? null
            : this.searchForm.isDeleted
      }
      console.log(params, 'params', this.searchForm.isEnabled)
      this.loading = true
      const data = await aiSessionTemplatePage(params)
      this.firstList = data.data.items.map(m => ({
        ...m,
        headerTitle: m.title.substring(0, 1)
      }))
      this.total = data.data.total
      this.loading = false
    },
    searchFirstReset() {
      this.searchForm.isDeleted = undefined
      this.$refs.form.resetFields()
      this.searchFirst()
    },
    // 搜索会话模板
    searchFirst() {
      this.currentPage = 1
      this.getFirstList()
    },
    // 每页显示条数改变
    handleSizeChange(val) {
      this.pageSize = val
      this.getFirstList()
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.getFirstList()
    },
    // 添加会话模板
    addFirst() {
      this.row = {}
      this.visible = true
    },
    // 跳转举报页面
    goReport() {
      this.$router.push({
        path: '/sessionTemplate/userReport'
      })
    },
    // 编辑会话模板
    editFirst(record) {
      this.row = { ...record }
      this.visible = true
    },
    // 删除会话模板
    deleteFirst(record) {
      this.$confirm(`确认删除助手【${record.title}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await aiSessionTemplateDelete({ id: record.id })
          this.$message.success('删除成功')
          this.searchFirst()
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.first {
  background-color: #fff;
  .first-header {
    margin-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
  }
  .first-content {
    width: 100%;
    .el-table {
      width: 100%;
    }
  }
  .first-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  .first-prompt {
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
  .img-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #999;
  }
}
::v-deep {
  .tag-custom {
    width: 74px;
    border: none !important;
    border-radius: 12px;
    color: #00b42a;
    display: flex;
    align-items: center;
    justify-content: center;
  }
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
