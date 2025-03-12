<template>
  <div class="wrapper">
    <!-- 定位路由上一级 -->
    <div class="location">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/businessAdmin/organization/employee">员工管理</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>岗位管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 岗位管理 -->
    <div class="post">
      <div class="post-header">
        <div class="post-header-left">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入岗位名称"
            size="small"
            clearable
            @clear="search"
            @keyup.enter.native="search"
          />

          <el-button
            size="small"
            type="primary"
            style="margin-left: 10px"
            @click="search"
          >
            查询
          </el-button>
          <el-button size="small" @click="clear">重置</el-button>
        </div>
        <div class="post-header-right">
          <el-button type="primary" size="small" @click="addPost">
            新增岗位
          </el-button>
        </div>
      </div>
      <div class="post-body">
        <el-table
          v-loading="loading"
          :header-cell-style="{ background: '#f5f5f5' }"
          :data="tableData"
          border
          stripe
          element-loading-text="拼命加载中"
        >
          <el-table-column prop="name" label="岗位名称" />
          <el-table-column prop="work" label="岗位职责">
            <template slot-scope="scope" width="200">
              <div class="post-work">{{ scope.row.work }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="count"
            label="员工数量"
            align="center"
            width="80"
          >
            <template slot-scope="scope">
              <div class="post-count" @click="openPersonnel(scope.row)">
                {{ scope.row.count }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createName" label="创建人" />
          <el-table-column prop="createTime" label="添加时间" />
          <el-table-column prop="updateTime" label="更新时间" />
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editPost(scope.row)">
                编辑
              </el-button>
              <el-button
                style="color: red"
                type="text"
                size="small"
                @click="delPost(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="post-footer">
        <el-pagination
          :current-page="pageInfo.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfo.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 新增或编辑岗位 -->
    <createOrEditDialog
      v-if="visibel"
      v-model="visibel"
      :row="row"
      @close="close"
    />
    <!-- 人员列表 -->
    <personnelDialog
      v-if="visibelPersonnel"
      v-model="visibelPersonnel"
      :post-info="row"
      @remove="removeEvent"
      @close="closePersonnel"
    />
    <!-- 人员移除 -->
    <remove v-model="visibleRemove" :info="removeInfo" @close="closeRemove" />
  </div>
</template>
<script>
import createOrEditDialog from './component/createOrEditDialog.vue'
import personnelDialog from './component/personnelDialog/index.vue'
import remove from './component/personnelDialog/remove.vue'

export default {
  components: {
    createOrEditDialog,
    personnelDialog,
    remove
  },
  data() {
    return {
      loading: false,
      visibel: false,
      visibelPersonnel: false,
      searchForm: {
        name: ''
      },
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [
        {
          id: 1,
          name: '岗位1',
          work: '1、每天直播6小时以上\n2、提升直播账号数据\n3、直播数据登记\n4、直播复盘及违规申诉',
          count: 1,
          createName: '张三',
          createTime: '2020-01-01 00:00:00',
          updateTime: '2020-01-01 00:00:00'
        },
        {
          id: 2,
          name: '岗位2',
          work: '1、直播前准备直播间设备、账号登录\n2、直播中上下架链接、评论区回复、直播间配合主播带氛围\n3、直播后登记数据、复盘数据、违规申诉\n4、策划直播玩法提升直播间人气及gmv',
          count: 2,
          createName: '李四',
          createTime: '2020-01-01 00:00:00',
          updateTime: '2020-01-01 00:00:00'
        }
      ],
      row: { id: undefined, name: undefined },
      visibleRemove: false,
      removeInfo: {
        postId: undefined, // 原岗位id
        postName: undefined, // 原岗位名称
        staffNames: undefined, // 原岗位人员名称或多个人员名称
        staffIds: undefined // 原岗位人员id集合
      }
    }
  },
  methods: {
    // 移除回调
    removeEvent(record) {
      this.visibelPersonnel = false
      this.removeInfo = { ...record }
      this.visibleRemove = true
    },
    closeRemove() {
      this.visibleRemove = false
    },
    openPersonnel(record) {
      this.row = { ...record }
      this.visibelPersonnel = true
    },
    // 关闭人员列表弹窗
    closePersonnel() {
      this.visibelPersonnel = false
    },
    // 重置
    clear() {
      this.searchForm.name = ''
      this.search()
    },
    // 关闭新增或编辑弹窗
    close() {
      this.visibel = false
    },
    // 查询
    search() {
      this.pageInfo.pageNum = 1
      this.getPostList()
    },
    // 新增
    addPost() {
      this.row = {}
      this.visibel = true
    },
    // 编辑
    editPost(record) {
      this.row = { ...record }
      this.visibel = true
    },
    // 删除
    delPost(row) {
      this.$confirm(`确认删除【${row.name}】岗位吗？`, '提示', {
        type: 'warning'
      })
        .then(() => {
          //   this.$http
          //     .post('/post/delete', {
          //       id: row.id
          //     })
          //     .then(res => {
          //       if (res.code === 200) {
          //         this.$message.success('删除成功')
          //         this.getPostList()
          //       } else {
          //         this.$message.error(res.msg)
          //       }
          //     })
        })
        .catch(() => {})
    },
    // 获取岗位列表
    getPostList() {
      //   this.loading = true
      //   this.$http
      //     .post('/post/list', {
      //       pageNum: this.pageInfo.pageNum,
      //       pageSize: this.pageInfo.pageSize,
      //       name: this.searchForm.name
      //     })
      //     .then(res => {
      //       this.loading = false
      //       if (res.code === 200) {
      //         this.tableData = res.data.list
      //         this.pageInfo.total = res.data.total
      //       } else {
      //         this.$message.error(res.msg)
      //       }
      //     })
    },
    // 分页
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getPostList()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNum = val
      this.getPostList()
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 20px;
  background-color: #fff;
  height: calc(100vh - 150px);
  min-width: 1200px;
  .location {
    margin-bottom: 20px;
  }
  // 岗位管理
  .post {
    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #ebeef5;
      .post-header-left {
        display: flex;
        align-items: center;
      }
      .post-header-right {
        display: flex;
        align-items: center;
      }
    }
    .post-body {
      .el-table {
        width: 100%;
        .el-table__header-wrapper {
          .el-table__header {
            .cell {
              font-size: 14px;
              font-weight: bold;
            }
          }
        }
        .el-table__body {
          .cell {
            font-size: 14px;
          }
        }
      }
      .post-work {
        white-space: pre-wrap;
        max-height: 120px;
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
      .post-count {
        color: #409eff;
        cursor: pointer;
      }
    }
    .post-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
  }
}
</style>
