<template>
  <div class="page_wrap">
    <div class="page_top">
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        class="form-breadcrumb"
      >
        <el-breadcrumb-item :to="{ name: 'Approve', params: { isShow: true } }">
          数字人审核
        </el-breadcrumb-item>
        <el-breadcrumb-item>数字人审批设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page_content">
      <el-row
        type="flex"
        justify="space-between"
        align="middle"
        style="padding-top: 25px"
      >
        <div>
          <span class="title">数字人审批设置</span>
          <span class="tips">
            设置数字人视频生成后的审批人员，确保生成的数字人视频符合要求
          </span>
        </div>
        <el-switch
          :value="value1"
          :inactive-text="`${types[loginType]}通知`"
          @change="changeFS"
        />
      </el-row>
      <el-divider />
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="small"
        style="margin-bottom: 10px"
        @click="add"
      >
        新增审批人
      </el-button>
      <el-table
        :data="tableData"
        style="width: 100%"
        :loading="loading"
        :header-cell-style="{ background: '#f5f5f5' }"
      >
        <el-table-column prop="approverUserName" label="审批人员名称" />
        <el-table-column prop="approverDeptName" label="所在部门" />
        <el-table-column prop="approveDepts" label="审批部门范围">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.approveDepts" :key="index">
              {{ item.deptName }}
              <span v-if="index !== scope.row.approveDepts.length - 1">,</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="approveTeachers" label="IP范围">
          <template slot-scope="scope">
            <span
              v-for="(item, index) in scope.row.approveTeachers"
              :key="item.teacherId"
            >
              {{ item.teacherName }}
              <span
                v-if="index !== scope.row.approveTeachers.length - 1"
              >,</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="noticePersonnel" label="抄送人员">
          <template slot-scope="scope">
            <span
              v-for="(item, index) in scope.row.noticePersonnel"
              :key="index"
            >
              {{ item.userName }}
              <span v-if="index !== scope.row.noticePersonnel.length - 1">
                ,
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="noticeCrowd" label="抄送群">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.noticeCrowd" :key="index">
              {{ item.name }}
              <span v-if="index !== scope.row.noticeCrowd.length - 1"> , </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope)">
              编辑
            </el-button>
            <el-button type="text" size="small" @click="del(scope)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <createdOrEditDialog
      ref="createdOrEditDialog"
      :login-type="loginType"
      @refresh="getList"
    />
  </div>
</template>
<script>
import createdOrEditDialog from './components/createdOrEditDialog'

import { getSendMsgTypeConfigApi } from '@/api/deliver/baseSeeting'
import { getItem } from '@/utils/localStorage'
import {
  getApproveSettinglist,
  deleteApprover,
  getNotifyFeishuSwitch,
  setNotifyFeishuSwitch
} from '@/api/aiVideoManage'
export default {
  name: 'ExamineSeting',
  components: {
    createdOrEditDialog
  },
  data() {
    return {
      value1: false,
      tableData: [],
      loading: false,
      loginType: 'feishu',
      types: {
        feishu: '飞书',
        wecom: '企微'
      }
    }
  },
  created() {
    this.getList()
    this.getSendMsgTypeConfig()
    this.getNotifyFeishuSwitch()
  },
  methods: {
    // 获取信息来源是企微还是飞书
    async getSendMsgTypeConfig() {
      try {
        const orgInfo = getItem('orgInfo')
        const { data } = await getSendMsgTypeConfigApi({
          tenantId: orgInfo.organizationId
        })
        if (data) {
          this.loginType = data === 1 ? 'feishu' : 'wecom'
        }
      } catch (error) {
        console.log(error)
      }
    },
    getNotifyFeishuSwitch() {
      getNotifyFeishuSwitch().then(res => {
        this.value1 = res.data
      })
    },
    getList() {
      this.loading = true
      getApproveSettinglist()
        .then(res => {
          this.loading = false
          this.tableData = res.data
        })
        .catch(() => {
          this.loading = false
        })
    },
    changeFS(val) {
      const title = val ? '开启消息提醒' : '关闭消息提醒'
      const tips = val ? '确认开启消息提醒吗？' : '确认关闭消息提醒吗？'
      this.$confirm(tips, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setNotifyFeishuSwitch({ switchStatus: !this.value1 }).then(res => {
            this.value1 = !this.value1
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
        })
        .catch(() => {})
    },
    add() {
      this.$refs.createdOrEditDialog.open('add')
    },
    edit(scope) {
      this.$refs.createdOrEditDialog.open('edit', scope.row)
    },
    del(scope) {
      this.$confirm(
        `确定删除审批人【${scope.row.approverUserName}】吗？`,
        '删除审批人提醒',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteApprover({ id: scope.row.id })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
          .catch(() => {})
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page_wrap {
  min-width: 1200px;
  padding: 20px;
  background-color: #fff;
  .page_content {
    .title {
      font-size: 20px;
      font-weight: bold;
      color: #333333;
      margin-right: 20px;
    }
    .tips {
      font-size: 14px;
      color: #999999;
    }
  }
}
</style>
