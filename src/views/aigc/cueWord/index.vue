<!-- 提示词管理 -->
<template>
  <div class="wrapper">
    <div class="cue-word">
      <div class="cue-word-header">
        <el-form ref="form" size="small" inline :model="searchForm">
          <el-row type="flex" align="bottom">
            <el-col :span="20">
              <el-form-item label="关键字" prop="keyword">
                <el-input
                  v-model="searchForm.keyword"
                  placeholder="输入关键字"
                  clearable
                  @clear="searchCueWord"
                  @keyup.enter.native="searchCueWord"
                />
              </el-form-item>
              <el-form-item label="提示词分类" prop="type">
                <el-select
                  v-model="searchForm.type"
                  placeholder="选择提示词分类"
                  clearable
                  @clear="searchCueWord"
                  @change="searchCueWord"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" size="small" @click="searchCueWord">
                  查询
                </el-button>
                <el-button size="small" @click="searchCueWordReset"
                  >重置</el-button
                >
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
                <el-button size="small" type="primary" @click="goType">
                  提示词分类管理
                </el-button>
                <el-button size="small" type="primary" @click="addCueWord">
                  + 新增提示词
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="cue-word-content">
        <el-table
          v-loading="loading"
          :header-cell-style="{ background: '#f5f5f5' }"
          :data="cueWordList"
          border
          stripe
        >
          <el-table-column prop="title" label="提示词名称" width="150" />
          <el-table-column prop="title" label="描述" width="150" />
          <el-table-column prop="content" label="提示词内容">
            <template slot-scope="scope">
              <div v-html="scope.row.content" />
            </template>
          </el-table-column>
          <el-table-column prop="typeName" label="分类" width="150" />
          <el-table-column prop="clickNum" label="点击次数" width="150" />
          <!-- <el-table-column prop="assistantNames" label="助手" width="150">
            <template slot-scope="scope">
              {{ scope.row.assistantNames }}
            </template>
          </el-table-column> -->
          <el-table-column prop="createNickName" label="创建人" width="120" />
          <el-table-column prop="createTime" label="创建时间" width="120" />
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="editCueWord(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                style="color: #f53f3f"
                @click="deleteCueWord(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column></el-table
        >
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
import { aiPromptWordPage, aiPromptWordDelete } from '@/api/aigc/cueWord'
import { aiPromptWordTypePage } from '@/api/aigc/cueWordType'
import createOrEditDialog from './component/createOrEditDialog.vue'
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
      searchForm: {
        keyword: '',
        type: '',
        isRecom: ''
      },
      typeList: [],
      loading: false,
      row: {
        id: undefined,
        name: undefined,
        describe: undefined,
        type: undefined
      }
    }
  },
  created() {
    this.getCueWordList()
    this.getWordTypeList()
    // const aa = [
    //   {
    //     id: '1',
    //     name: '提示词名称',
    //     describe: '描[述]描[述]描[述]描[述]描[述]',
    //     type: '0',
    //     post: '0',
    //     recommendFlag: '是否推荐',
    //     createName: '创建人',
    //     createTime: '创建时间',
    //     updateTime: '更新时间'
    //   },
    //   {
    //     id: '2',
    //     name: '提示词名称',
    //     describe: '描述',
    //     type: '1',
    //     post: '1',
    //     recommendFlag: '是否推荐',
    //     createName: '创建人',
    //     createTime: '创建时间',
    //     updateTime: '更新时间'
    //   }
    // ]
    // this.cueWordList = aa.map(m => ({
    //   ...m,
    //   describe: m.describe
    //     .replace(/\[/g, '<span style="color: red">')
    //     .replace(/\]/g, '</span>')
    // }))
  },
  methods: {
    // 跳转
    goType() {
      this.$router.push({ path: '/aigc/cueWordType' })
    },
    async getWordTypeList() {
      // 获取提示词分类列表
      const data = await aiPromptWordTypePage({ pageIndex: 1, pageSize: 100 })
      this.typeList = data.data.items
    },
    changeRecommend(record) {},
    close() {
      this.row = {
        id: undefined,
        name: undefined,
        describe: undefined,
        type: undefined
      }
      this.visible = false
      this.getCueWordList()
    },
    // 获取提示词列表
    async getCueWordList() {
      const params = {
        content: this.searchForm.keyword || undefined,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        typeId: this.searchForm.type || undefined
      }
      this.loading = true
      const data = await aiPromptWordPage(params)
      this.cueWordList = data.data.items.map(m => ({
        ...m,
        content: m.content
          .replace(/\[/g, '[<span style="color: #0C6FFF">')
          .replace(/\]/g, '</span>]'),
        assistantNames: m.sessionTemplates?.map(m => m.title).join(',') || '-'
      }))
      this.total = data.data.total
      this.loading = false
    },
    searchCueWordReset() {
      this.$refs.form.resetFields()
      this.currentPage = 1
      this.pageSize = 10
      this.getCueWordList()
    },
    // 搜索提示词
    searchCueWord() {
      this.currentPage = 1
      this.getCueWordList()
    },
    // 每页显示条数改变
    handleSizeChange(val) {
      this.pageSize = val
      this.getCueWordList()
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCueWordList()
    },
    // 添加提示词
    addCueWord() {
      this.visible = true
    },
    // 编辑提示词
    editCueWord(record) {
      this.row = {
        ...record,
        content: record.content
          .replace(/<span style="color: #0C6FFF">/g, '')
          .replace(/<\/span>/g, '')
      }
      this.visible = true
    },
    // 删除提示词
    deleteCueWord(record) {
      this.$confirm(`是否删除【${record.title}】提示词?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await aiPromptWordDelete({ id: record.id })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getCueWordList()
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 20px;
  background-color: #fff;
  min-width: 1200px;
  .el-button {
    margin-left: 10px;
  }
  .cue-word {
    .cue-word-header {
      margin-bottom: 20px;
      border-bottom: 1px solid #ebeef5;
    }
    .cue-word-content {
      /* width: 100%; */
      .el-table {
        /* width: 100%; */
      }
    }
    .cue-word-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}
</style>
