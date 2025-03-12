<template>
  <div class="content">
    <div class="content_header">
      <!-- <div class="header_left">
        <el-button type="primary" @click="selectGoods()">添加推荐</el-button>
      </div> -->
      <div class="header_right">
        <el-date-picker
          v-model="time"
          unlink-panels
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
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
        <el-table-column prop="userName" label="学员" width="180">
          <template slot-scope="{ row }">
            <div class="nickName pointer" @click="openCommentDetail(row)">
              <!-- <AppAvatar :avatar="row.headImg" :name="row.name || row.realName || row.uid || row.phone" width="45" :no-name="true" /> -->
              <el-avatar shape="circle" :size="45" fit="contain" :src="row.headImg" />
              <div class="m-l-10 ">
                <div style="color: #1472ff;">{{ row.userName }} </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="评价内容">
          <template slot-scope="{ row }">
            <el-tooltip class="item" effect="dark" :content="row.comment" placement="top-start">
              <div class="text_hidden">
                {{ row.comment }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="sortNum" label="排序" width="180" /> -->
        <el-table-column prop="status" label="推荐" width="180">
          <template slot-scope="{ row }">
            <div
              v-loading.body="loading"
              element-loading-spinner="el-icon-loading"
              element-loading-text="处理中"
            >
              <el-switch v-model="row.status" :active-value="1" :inactive-value="2" @change="commentComment(row, 'status', row.status)" />
              <span class="m-l-10">{{ {2: '常规', 1: '推荐'}[row.status] }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="approvalStatus" label="审核" width="120">
          <template slot-scope="{ row }">
            <AppStatus :status="['warning', 'success', 'error'][row.approvalStatus]">
              <span @click="openCommentDetail(row)">
                {{ {0:'未审核', 1:'审核通过', 2:'审核不通过'}[row.approvalStatus] }}
              </span>
            </AppStatus>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="180">
          <template slot-scope="{ row }">
            <el-button v-if="row.approvalStatus === 2" slot="reference" v-permission="['system:comment:remove', permsList]" class="m-l-10" type="text" @click="delApprove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row>
        <el-col :span="12">
          <el-button v-permission="['system:comment:remove', permsList]" class="m-t-20 m-r-10">删除</el-button>
          <el-dropdown>
            <el-button v-permission="['system:comment:edit', permsList]">
              推荐<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="_goodsCommentBatch(1)">推荐</el-dropdown-item>
              <el-dropdown-item @click.native="_goodsCommentBatch(2)">取消推荐</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown class="m-l-10">
            <el-button v-permission="['system:comment:edit', permsList]">
              审核<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="_commentApproveBatch(1)">通过</el-dropdown-item>
              <el-dropdown-item @click.native="_commentApproveBatch(2)">不通过</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button class="m-t-20">推荐</el-button> -->
          <!-- <el-button class="m-t-20">取消推荐</el-button> -->
        </el-col>
        <el-col :span="12">
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

    <!-- 新建标签弹框层 -->
    <AppDialog
      v-model="modal.visible"
      :title="modal.title"
      width="500px"
      height="auto"
      :btn-footer="false"
      @success="modal.visible = false"
    >
      <div v-loading="modal.loading" class="choose_resource m-t-20 p-10">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="审核状态" prop="approvalStatus">
            <AppStatus :status="['warning', 'success', 'error'][form.approvalStatus]">
              <span>
                {{ {0:'未审核', 1:'审核通过', 2:'审核不通过'}[form.approvalStatus] }}
              </span>
            </AppStatus>
          </el-form-item>
          <el-form-item label="课程内容" prop="rating">
            <el-rate
              v-model="form.rating"
              style="margin-top: 8px"
              disabled
              show-score
              text-color="#ff9900"
            />
          </el-form-item>
          <el-form-item label="评价内容" prop="comment">
            <span>{{ form.comment }}</span>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="p-20">
        <el-button v-if="form.approvalStatus === 0 || form.approvalStatus ===2" type="primary" @click="editApprove(form, 'approvalStatus', 1)">审核通过</el-button>
        <el-button v-if="form.approvalStatus === 0 || form.approvalStatus ===1" class="m-r-10" @click="editApprove(form, 'approvalStatus', 2)">审核不通过</el-button>
        <el-button class="m-r-10" @click="modal.visible = false">关闭</el-button>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import { goodsCommentPage, getCommentDetail, commentApproveBatch, commentDeleteBatch, goodsCommentBatch } from '@/api/course'
import { DateFormat } from '@/utils'
// import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import AppDialog from '@/components/AppDialog'
import AppStatus from '@/components/AppStatus'
export default {
  components: {
    // AppAvatar,
    AppDialog,
    AppStatus
  },
  data() {
    return {
      loading: false,
      recommendFlag: '',
      current: 1,
      size: 10,
      userName: '',
      time: '',
      tableData: [],
      total: 0,
      multipleSelection: [],
      sortChange: '',
      modal: {
        visible: false,
        title: '详情',
        loading: false
      },
      form: {
        approvalStatus: 0,
        comment: '',
        createTime: '',
        headImg: '',
        id: 0,
        likeNum: 0,
        rating: 0,
        userId: '',
        userName: ''
      },
      visible: false,
      permsList: this.$route.meta.permsList || []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      this.loading = true
      let startTime = ''
      let endTime = ''
      if (this.time) {
        startTime = DateFormat(this.time[0], 'yyyy-MM-dd')
        endTime = DateFormat(this.time[1], 'yyyy-MM-dd')
      }
      const params = {
        goodsId: this.$route.params.id,
        current: this.current,
        size: this.size,
        userName: this.userName,
        startTime,
        endTime
      }
      goodsCommentPage(params).then(res => {
        console.log(res, '获取列表详情数据')
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
    // 单独的审核
    editApprove(row, key, res) {
      const data = {
        ids: [row.id],
        [key]: res
      }
      this.modal.loading = true
      commentApproveBatch(data).then(res => {
        this.modal.visible = false
        this.getList()
      }).catch(() => {
        this.getList()
        this.loading = false
      })
    },
    // 单独的推荐
    commentComment(row, key, res) {
      const data = {
        ids: [row.id],
        [key]: res
      }
      this.modal.loading = true
      goodsCommentBatch(data).then(res => {
        this.modal.visible = false
        this.getList()
      }).catch(() => {
        this.getList()
        this.loading = false
      })
    },
    // 打开评价详情弹框
    openCommentDetail(row) {
      this.modal.visible = true
      this.modal.loading = true
      getCommentDetail(row.id).then(res => {
        console.log(res, '详情数据')
        this.form = {
          approvalStatus: res.data.approvalStatus,
          comment: res.data.comment || '',
          createTime: res.data.createTime || '',
          headImg: res.data.headImg || '',
          id: res.data.id || '',
          likeNum: res.data.likeNum || '',
          rating: res.data.rating || '',
          userId: res.data.userId || '',
          userName: res.data.userName || ''
        }
        this.modal.loading = false
      }).catch(() => {
        this.modal.loading = false
      })
    },
    // 单独的删除
    delApprove(row) {
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          const data = {
            ids: [row.id]
          }
          this.modal.loading = true
          commentDeleteBatch(data).then(res => {
            this.modal.visible = false
            this.getList()
          }).catch(() => {
            this.getList()
            this.loading = false
          })
        }
      })
    },
    // 批量删除
    _delApproveBatch() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请先选择')
      }
      const ids = []
      this.multipleSelection.map(v => {
        ids.push(v.id)
      })
      this.$delModal({
        tips: `确定删除这${this.multipleSelection.length}条?`,
        success: () => {
          const data = {
            ids
          }
          this.modal.loading = true
          commentDeleteBatch(data).then(res => {
            this.modal.visible = false
            this.getList()
          }).catch(() => {
            this.getList()
            this.loading = false
          })
        }
      })
    },
    // 批量推荐
    _goodsCommentBatch(status) {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请先选择')
      }
      const ids = []
      this.multipleSelection.map(v => {
        ids.push(v.id)
      })
      const data = {
        ids,
        status
      }
      this.loading = true
      goodsCommentBatch(data).then(res => {
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
        this.getList()
      }).catch(() => {
        this.loading = false
      })
    },
    // 批量审核
    _commentApproveBatch(approvalStatus) {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请先选择')
      }
      const ids = []
      this.multipleSelection.map(v => {
        ids.push(v.id)
      })
      const data = {
        ids,
        approvalStatus
      }
      this.loading = true
      commentApproveBatch(data).then(res => {
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
        this.getList()
      }).catch(() => {
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
       .header_left {
        }
        .header_right {

        }
   }
   .content_table {

       .pagination {
           margin-top: 20px;
           text-align: right;
       }
   }
}
.nickName {
    display: flex;
    align-items: center;
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
.choose_resource {
  min-height: 200px;
  max-height: 500px;
  overflow: auto;
}
</style>
