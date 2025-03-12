 <!-- 日志记录 -->
<template>
  <el-drawer
    :size="860"
    :visible.sync="loggingFlag"
    v-bind="$attrs"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    v-on="$listeners"
  >
    <div v-if="loggingFlag" v-loading="loading" class="drawerBody">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">日志记录</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <!-- 内容区 -->
      <div class="logging_content">
        <!-- 账号信息 -->
        <div class="account_info">
          <el-row :gutter="24" class="mb-10">
            <el-col :span="8"><span class="title1">账号：</span>{{ accountInfo.name }}</el-col>
            <el-col :span="8"><span class="title1">平台：</span>{{ accountInfo.platformName }}</el-col>
            <el-col :span="8"><span class="title1">IP：</span>{{ accountInfo.teacherName || '--' }}</el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8"><span class="title1">粉丝数：</span>{{ filtersMoneyByW(accountInfo.fans) }}</el-col>
            <el-col :span="8"><span class="title1">运营者：</span>{{ accountInfo.operatorName }}</el-col>
            <el-col :span="8"><span class="title1">所属部门：</span>{{ accountInfo.deptName }}</el-col>
          </el-row>
        </div>
        <!-- 表格 -->
        <el-table :data="data" :header-cell-style="{ background: '#f5f5f5' }" class="mt-30">
          <el-table-column prop="assignDate" label="操作类型" width="80px" align="center">
            <template slot-scope="scope">
              {{ typeMap[scope.row.type] }}
            </template>
          </el-table-column>
          <el-table-column prop="content" label="操作内容" align="center" />
          <el-table-column prop="reason" label="原因" align="left" />
          <el-table-column prop="name" label="操作者" width="80px" align="center" />
          <el-table-column prop="time" label="操作时间" align="center" show-overflow-tooltip />
          <el-table-column prop="remarks" label="备注" align="center" show-overflow-tooltip />
        </el-table>
        <div class="pagination">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { filtersMoneyByW } from '@/filters/index'
import { getLogList } from '@/api/videoManagement/accountManage'

export default {
  props: {
    accountInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loggingFlag: false,
      loading: false,
      data: [],
      typeMap: {
        1: '停更',
        2: '恢复更新',
        3: '转号',
        4: '变更运营',
        5: '移交IP',
        6: '注销',
        7: '恢复账号'
      },
      currentPage: 1,
      total: 0,
      pageSize: 10
    }
  },
  methods: {
    filtersMoneyByW,
    show() {
      this.loggingFlag = true
      this.getLogging()
    },
    close() {
      this.loggingFlag = false
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getLogging()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getLogging()
    },
    async getLogging() {
      this.loading = true
      const res = await getLogList({
        platformAccountId: this.accountInfo.platformAccountId,
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      })
      if (res.code === 1) {
        this.data = res.data.items
        this.total = res.data.total
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.drawerBody {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    background: #FFFFFF;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #f2f2f2;
    color: #353535;
    font-size: 16px;
    font-weight: bold;
    .ss-material-box-header-title {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .close {
    color: #b2b2b2;
    margin-left: auto;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .logging_content{
    padding: 20px;
    box-sizing: border-box;
        .mt-30{
            margin-top: 30px;
        }
    }
  .account_info{
    width: 100%;
    padding: 16px;
    background: #F5F9FF;
    border-radius: 8px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    .mb-10{
        margin-bottom: 10px;
    }
    .title1{
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #777777;
    }
  }
}
.pagination {
  height: 62px;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  // position: absolute;
  //   bottom: 0;
  //   right: 20px;
}
</style>

