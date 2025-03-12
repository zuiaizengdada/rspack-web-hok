<!-- 知识库管理 -->
<template>
  <div class="wrapper">
    <div class="title-row">
      <div>知识库管理</div>
    </div>
    <div class="switch-custom">
      <div :class="{ 'switch-item': true, 'switch-item-checked': true }">
        QA库
      </div>
    </div>
    <!-- 筛选条件 -->
    <div class="search-row">
      <el-form ref="form" size="small" inline :model="searchForm">
        <el-row type="flex" align="bottom">
          <el-col :span="24">
            <el-form-item label="标题搜索" prop="keyword">
              <el-input
                v-model="searchForm.keyword"
                placeholder="标题搜索"
                clearable
                @clear="changeSearch"
                @keyup.enter.native="changeSearch"
              />
            </el-form-item>
            <el-form-item label="评审专家" prop="contentReviewerId">
              <el-select
                v-model="searchForm.contentReviewerId"
                placeholder="选择评审专家"
                clearable
                @clear="changeSearch"
                @change="changeSearch"
              >
                <el-option
                  v-for="item in expertList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="评审时间" prop="time">
              <el-date-picker
                v-model="searchForm.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @clear="changeSearch"
                @change="changeSearch"
              />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select
                v-model="searchForm.status"
                placeholder="选择状态"
                clearable
                @clear="changeSearch"
                @change="changeSearch"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="small" @click="search">
                查询
              </el-button>
              <el-button size="small" @click="searchReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="table-row">
      <el-table
        v-loading="loading"
        :data="tableData"
        :tooltip-effect="'light'"
        height="600px"
        :header-cell-style="{ background: '#f5f5f5' }"
        class="table-wrapper"
      >
        <el-table-column prop="question" label="标题" width="280" />
        <el-table-column prop="answer" label="内容">
          <template slot-scope="scope">
            <div class="answer-d">{{ scope.row.answer }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="contentReviewer" label="评审专家" width="100" />
        <el-table-column prop="status" label="状态" width="140">
          <div
            slot-scope="scope"
            :class="{
              'status-flex': true,
              [getStatusClass(scope.row.status)]: true
            }"
          >
            <img
              v-if="scope.row.status === 0"
              src="@/assets/image/aigc/success.png"
              alt=""
            />
            <img
              v-if="scope.row.status === 1"
              src="@/assets/image/aigc/wait.png"
              alt=""
            />
            <span>{{ getStatus(scope.row.status) }}</span>
          </div>
        </el-table-column>
        <el-table-column
          prop="contentReviewTime"
          label="评审时间"
          width="180"
        />
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openReview(scope.row)">
              详情
            </el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              size="small"
              @click="edit(scope.row)"
            >
              修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-page">
      <el-pagination
        :current-page="searchForm.pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="searchForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <created
      v-model="visibleCreated"
      :row="row"
      @success="search"
      @close="visibleCreated = false"
    />
    <review v-model="visibleReview" :row="row" @close="visibleReview = false" />
  </div>
</template>
<script>
import { knowledgePage, contentReviewer } from '@/api/aigc/knowledgeManagement'
import created from './component/created.vue'
import review from './component/review.vue'
import moment from 'moment'
export default {
  components: { created, review },
  data() {
    return {
      searchForm: {
        pageIndex: 1,
        pageSize: 10,
        keyword: undefined,
        time: undefined,
        status: undefined,
        contentReviewerId: undefined
      },
      typeList: [],
      tableData: [],
      loading: false,
      total: 0,
      visibleCreated: false,
      visibleReview: false,
      row: {},
      expertList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  created() {
    this.typeList = [
      { label: '已入库', value: 0 },
      { label: '修改中', value: 1 }
    ]
    this.getContentReviewer()
    this.search()
  },
  methods: {
    getContentReviewer() {
      contentReviewer().then(res => {
        if (res.code === 1) {
          this.expertList = res.data.items.map(m => ({
            label: m.contentReviewerName,
            value: m.contentReviewerId
          }))
        }
      })
    },
    edit(record) {
      this.row = { ...record }
      this.visibleCreated = true
    },
    openReview(record) {
      this.row = { ...record }
      this.visibleReview = true
    },
    handleCurrentChange(val) {
      this.searchForm.pageIndex = val
      this.search()
    },
    handleSizeChange(val) {
      this.searchForm.pageIndex = 1
      this.searchForm.pageSize = val
      this.search()
    },
    getStatusClass(val) {
      switch (val) {
        case 1:
          return 'status-wait'
        case 0:
          return 'status-success'
      }
    },
    getStatus(val) {
      switch (val) {
        case 1:
          return '修改中'
        case 0:
          return '已入库'
      }
    },
    changeSearch() {
      this.searchForm.pageIndex = 1
      this.search()
    },
    search() {
      this.loading = true
      const params = {
        ...this.searchForm
      }
      if (params.time) {
        params.contentReviewTimeStart = moment(this.searchForm.time[0]).format(
          'YYYY-MM-DD 00:00:00'
        )
        params.contentReviewTimeEnd = moment(this.searchForm.time[1]).format(
          'YYYY-MM-DD 23:59:59'
        )
        delete params.time
      }
      knowledgePage(params)
        .then(res => {
          this.loading = false
          if (res.code === 1) {
            this.tableData = res.data.items
            this.total = res.data.total
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    searchReset() {
      this.searchForm = {
        pageIndex: 1,
        pageSize: 10,
        keyword: undefined,
        time: undefined,
        status: undefined,
        contentReviewerId: undefined
      }
      this.search()
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  height: 100%;
  .title-row {
    user-select: none;
    padding: 15px 23px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
    border-bottom: 1px solid #d3d7d8;
    span {
      color: #000;
    }
  }
  .search-row {
    padding: 20px 23px 0 23px;
    .el-form-item {
      margin-right: 20px;
    }
  }

  .table-row {
    display: block;
    padding: 0 23px 0 23px;
    width: 100%;
  }
  .table-page {
    display: flex;
    justify-content: flex-end;
    position: relative;
    padding-right: 8px;
    margin: 20px 0;
  }
  .status-flex {
    width: fit-content;
    height: 24px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    border-radius: 12px;
    white-space: nowrap;
    img {
      border-radius: 12px;
      width: 14px;
      height: 14px;
      margin-right: 4px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
  .status-wait {
    background: #fff2e6;
    color: #ff7d00;
  }
  .status-success {
    background: #e6f7ea;
    color: #00b42a;
  }
  .status-repeat {
    background: #fff0f0;
    color: #f53f3f;
  }
}

.answer-d {
  width: 94%;
  white-space: pre-line;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.switch-custom {
  display: flex;
  width: fit-content;
  height: 36px;
  background: #f3f3f3;
  border-radius: 4px;
  padding: 2px;
  margin: 15px 4px 0 20px;
  cursor: pointer;
  user-select: none;
  .switch-item {
    width: 88px;
    height: 32px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .switch-item-checked {
    background: #ffffff;
    border-radius: 2px;
    // color: #0c6fff;
    transition: all 0.2s ease-in-out;
  }
}

::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
}
</style>
