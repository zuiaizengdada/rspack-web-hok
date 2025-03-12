<template>
  <div class="content">
    <div class="content_header">
      <!-- <div class="header_left">
        <el-button type="primary" @click="selectGoods()">添加推荐</el-button>
      </div> -->
      <div class="header_right">
        <el-select v-model="recommendFlag" class="w-200" clearable @change="getList">
          <el-option label="全部" value="" />
          <el-option label="推荐" :value="0" />
          <el-option label="常规" :value="1" />
        </el-select>
        <el-input v-model.trim="userName" class="w-200 m-l-10 m-r-10" clearable placeholder="请输入学员昵称" />
        <el-button :loading="loading" type="primary" @click="handerSearch">搜索</el-button>
      </div>
    </div>

    <div class="content_table">
      <el-table
        v-loading="loading"
        border
        :data="tableData"
        style="width: 100%"
        class="m-t-20"
        :header-cell-style="{background: '#f5f5f5'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column prop="userName" label="学员" width="180" />
        <el-table-column prop="answer" label="练习内容">
          <template slot-scope="{ row }">
            <el-tooltip class="item" effect="dark" :content="row.answer" placement="top-start">
              <div class="text_hidden">
                {{ row.answer }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="sortNum" label="排序" width="180" />
        <el-table-column prop="recommendFlag" label="推荐" width="180">
          <template slot-scope="{ row }">
            <div
              v-loading.body="loading"
              element-loading-spinner="el-icon-loading"
              element-loading-text="处理中"
            >
              <el-switch v-model="row.recommendFlag" :active-value="1" :inactive-value="0" @change="editUserPractice(row, 'recommendFlag', row.recommendFlag)" />
              <span class="m-l-10">{{ {0: '常规', 1: '推荐'}[row.recommendFlag] }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="排序" width="180">
          <template slot-scope="{ row }">
            <el-popover
              v-model="row.visible"
              placement="bottom"
              width="240"
            >
              <p>
                排列至第
                <el-input v-model.trim="sortChange" class="w-80" />
                位
              </p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" @click="showSort(row)">取消</el-button>
                <el-button type="primary" @click="sort(row)">确定</el-button>
              </div>
              <el-button slot="reference" type="text">排序</el-button>
            </el-popover>

            <el-button slot="reference" class="m-l-10" type="text" @click="editUserPractice(row, 'delFlag', 1)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row>
        <!-- <el-col :span="12">
          <el-button class="m-t-20">删除</el-button>
          <el-button class="m-t-20">推荐</el-button>
          <el-button class="m-t-20">取消推荐</el-button>
        </el-col> -->
        <el-col>
          <el-pagination
            class="pagination"
            :current-page="current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getUserPractice, editUserPractice } from '@/api/course'
export default {
  data() {
    return {
      loading: false,
      recommendFlag: '',
      current: 1,
      size: 10,
      userName: '',
      tableData: [],
      total: 0,
      multipleSelection: [],
      sortChange: '',
      id: ''
    }
  },
  created() {
    this.id = this.$route.params.id
    this.init()
  },
  methods: {
    showSort(row) {
      row.visible = false
    },
    sort(row) {
      row.visible = false
      this.loaidng = true
      this.editUserPractice(row, 'sortNum', this.sortChange)
    },
    init() {
      this.getList()
    },
    getList() {
      this.loading = true
      this.sortChange = ''
      const params = {
        goodsId: this.id,
        current: this.current,
        size: this.size,
        recommendFlag: this.recommendFlag,
        userName: this.userName,
        delFlag: 0
      }
      getUserPractice(params).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getList()
    },
    handerSearch() {
      this.current = 1
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 编辑练习题 // 删除: delFlag: 1;
    editUserPractice(row, key, res) {
      const data = {
        id: row.userAnswerId,
        answer: row.answer,
        delFlag: 0,
        practiceId: row.practiceId,
        recommendFlag: row.recommendFlag,
        [key]: res
      }
      this.loading = true
      editUserPractice(data).then(res => {
        this.getList()
      }).catch(() => {
        this.getList()
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
   .content_header {
       display: flex;
       justify-content: space-between;
   }
   .content_table {

       .pagination {
           margin-top: 20px;
           text-align: right;
       }
   }
}
.goods-info-wrapper {
  width: 100%;
  height: 60px;
  text-align: left;
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  .goods-info-detail {
    line-height: 1.5;
    width: calc(100% - 82px);
    height: 100%;
    flex: 1;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .titleOptions {
      display: flex;
      width: 100%;
      // align-items: center;
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      word-wrap: break-word;
      font-size: 14px;
      color: #353535;
      cursor: pointer;
    }
  }
}
</style>
