<template>
  <div class="audit-cnt">
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="gray">
        <span @click="goBack">合作协议审核</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>合作协议审批设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="table-cnt">
      <div class="mb20 flex flex-between flex-middle">
        <!-- <div>合作协议审批设置</div> -->
        <div class="flex flex-middle txt">
          {{ types[loginType] }}通知：
          <el-switch :value="notice" @change="changeNotice" />
        </div>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="open('add')"
        >
          添加审批人
        </el-button>
      </div>
      <el-table
        class="audit-table"
        :data="tableData"
        :loading="loading"
        :header-cell-style="{ background: '#f5f5f5' }"
      >
        <el-table-column prop="approverUserName" label="审批人员名称" />
        <el-table-column prop="approverDeptName" label="所在部门" />
        <el-table-column prop="approveDepts" label="审批部门范围">
          <template slot-scope="scope">
            {{ scope.row.approveDepts | filterArrJoin('deptName') }}
          </template>
        </el-table-column>
        <el-table-column prop="noticePersonnel" label="抄送人员">
          <template slot-scope="scope">
            {{ scope.row.noticePersonnel | filterArrJoin('userName') }}
          </template>
        </el-table-column>
        <el-table-column prop="noticeCrowd" label="抄送群">
          <template slot-scope="scope">
            {{ scope.row.noticeCrowd | filterArrJoin('name') }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="open('edit', scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              class="red"
              size="small"
              @click="del(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddModal ref="addModalRef" @refresh="getTableInfo" />
  </div>
</template>

<script>
import {
  approvalDelApi,
  getSwitchApi,
  getListApi,
  setSwitchApi
} from '@/api/coOpProtocol'
import { getSendMsgTypeConfigApi } from '@/api/deliver/baseSeeting'
import { getItem } from '@/utils/localStorage'
import AddModal from './cpns/addModal'

export default {
  name: 'CoOpProtocolAuditPage',
  components: { AddModal },
  filters: {
    filterArrJoin(arr, key) {
      if (!arr) return '--'
      return arr
        .map(item => {
          return item[key]
        })
        .join('、')
    }
  },
  data() {
    return {
      // MPageLayout 配置
      loading: false,
      tableData: [],
      // add modal 配置项
      visible: false,
      modalTitle: '添加审批人',
      modalForm: {},

      notice: false,
      loginType: 'feishu',
      types: {
        feishu: '飞书',
        wecom: '企微'
      }
    }
  },
  created() {
    this.getSwitch()
    this.getTableInfo()
    this.getSendMsgTypeConfig()
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
    getSwitch() {
      getSwitchApi().then(res => {
        if (res.success) {
          this.notice = res.data
        }
      })
    },
    async getTableInfo() {
      this.loading = true
      try {
        const { data } = await getListApi()
        this.tableData = data
      } catch (error) {
        console.log('error----getListApi', error)
      }
      this.loading = false
    },
    changeNotice(val) {
      const title = val ? '开启消息提醒' : '关闭消息提醒'
      const tips = val ? '确认开启消息提醒吗？' : '确认关闭消息提醒吗？'
      this.$confirm(tips, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          setSwitchApi({ switchStatus: val }).then(res => {
            this.notice = val
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          })
        })
        .catch(() => {})
    },
    open(type, row) {
      if (type === 'add') {
        this.$refs.addModalRef.open('add', {
          loginType: this.loginType
        })
      } else {
        this.$refs.addModalRef.open('edit', {
          ...row,
          loginType: this.loginType
        })
      }
    },
    async del(row) {
      this.$confirm(
        `确定删除审批人【${row.approverUserName}】吗？`,
        '删除审批人提醒',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        approvalDelApi({ id: row.id })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTableInfo()
          })
          .catch(() => {})
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.red {
  color: #ff2020;
}
.mb20 {
  margin-bottom: 20px;
}
.txt {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

@import '~@/styles/variables.scss';
.audit-cnt {
  min-width: 1100px;
  width: 100%;
  background: #fff;
  border-radius: 5px;
  .header-left {
    div {
      color: #000000;
      font-size: 14px;
      font-weight: 400;
      padding-right: 32px;
    }
  }
  .breadcrumb {
    height: 48px;
    border-bottom: 1px solid #dfe4ed;
    padding: 0 20px;
    ::v-deep .el-breadcrumb__inner {
      font-size: 15px;
      font-weight: 500;
      line-height: 48px;
      color: #000;
    }
    .gray {
      ::v-deep .el-breadcrumb__inner {
        color: #777777;
        cursor: pointer;
      }
    }
  }
  .table-cnt {
    height: calc(100% - 48px);
    padding: 20px;
    ::v-deep .el-table {
      th.el-table__cell > .cell {
        font-weight: 600;
      }
      .cell {
        font-weight: 500;
        font-size: 14px;
        color: #333;
      }
      .el-button + .el-button {
        margin-left: 20px;
      }
    }
    .audit-table {
      width: 100%;
    }
  }
}
</style>
