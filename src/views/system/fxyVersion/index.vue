<!-- 协议管理 -->
<template>
  <div class="page-content">
    <div class="page_wrap1">
      <div class="page_wrap_header">
        <div class="header_wrap">
          <div>伏羲云版本管理</div>
          <div>
            <el-button
              size="small"
              type="primary"
              :loading="loading"
              style="margin-left: 48px;"
              @click="openAddModel('add')"
            ><i class="el-icon-plus" /> 添加版本</el-button>
          </div>
        </div>
      </div>
      <!-- 内容区(协议管理) -->
      <MPageLayout
        ref="MPageLayout"
        :slot-arr="slotArr"
        :hide-pagination="true"
        :current-page="config.currentPage"
        :page-sizes="config.pageSizes"
        :page-size="config.pageSize"
        :total="config.total"
        :table-data="config.tableData"
        :table-columns="config.tableColumns"
        :loading="loading"
        layout="total, sizes, prev, pager, next, jumper"
      >
        <!-- <div slot="content" slot-scope="{ row }">
          <span v-html="row.content" />
        </div> -->
        <template slot="action" slot-scope="{ row }">
          <el-button
            type="text"
            @click="openAddModel('edit',row)"
          >编辑</el-button>
        </template>
      </MPageLayout>
    </div>
    <add-approval ref="modal" @success="getList" />
  </div>
</template>
<script>
import AddApproval from './components/addApproval.vue'
import { getFxyVersionList } from '@/api/system/fxyVersion'
export default {
  components: { AddApproval },
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      value1: false,
      slotArr: [
        'action'
      ],
      loading: false,
      setUpId: '',
      pageInfo: { type: 1, name: '账号审批', path: '/videoManagement/accountApproval' },
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          {
            prop: 'version',
            label: '版本号',
            type: 'text',
            width: 200,
            visible: true,
            disable: true
          },
          {
            prop: 'deptName',
            label: '抖音',
            type: 'text',
            render: (row) => {
              return row.dyIsOpen === 1 ? '新API' : '老API'
            },
            visible: true
          },
          {
            prop: 'examineDeptName',
            label: '快手',
            type: 'text',
            render: (row) => {
              return row.ksIsOpen === 1 ? '新API' : '老API'
            },
            visible: true
          },
          {
            prop: 'remindUserName',
            label: '小红书',
            type: 'text',
            render: (row) => {
              return row.xhsIsOpen === 1 ? '新API' : '老API'
            },
            visible: true
          },
          {
            prop: 'remindUserName',
            label: '视频号',
            type: 'text',
            render: (row) => {
              return row.sphIsOpen === 1 ? '新API' : '老API'
            },
            visible: true
          },
          {
            prop: 'remindUserName',
            label: 'B站',
            type: 'text',
            render: (row) => {
              return row.bzIsOpen === 1 ? '新API' : '老API'
            },
            visible: true
          },
          {
            prop: 'createUserName',
            label: '创建人',
            type: 'text',
            visible: true
          },
          {
            prop: 'createTime',
            label: '版本创建时间',
            type: 'text',
            visible: true
          },

          { prop: 'action', label: '操作', type: 'slot' }
        ],
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    openAddModel(type, row = {}) {
      this.$refs.modal.open(type, row, this.setUpId)
    },
    handleClickEdit() {

    },
    sortChange() {
      this.getList()
    },
    // 获取列表
    async getList() {
      this.loading = true
      const res = await getFxyVersionList({})
      console.log(res, '账号审批设置')
      this.config.tableData = res.data
      this.config.total = res.data.total
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.page-content {
  height: 100%;
  background: #fff;
  border-radius: 10px;
  padding:0 20px;
  .page_wrap_header {
    font-weight: bold;
    .header_wrap {
      padding: 16px 0;
      display: flex;
      align-items: center;
      justify-content:space-between;
      box-sizing: border-box;
      border-bottom: 1px solid #e7e7e7;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #333333;
      // line-height: 24px;
    }
  }
  ::v-deep .el-tabs {
    height: 100%;
  }
  ::v-deep .el-tabs__item {
    font-size: 16px;
  }
  ::v-deep .el-tabs__content {
    height: calc(100% - 40px);
  }
  ::v-deep .el-tabs__header {
    margin: 0;
  }
  ::v-deep .el-tab-pane {
    height: 100%;
  }
}
.form-breadcrumb {
  padding-bottom: 20px;
  border-bottom: 1px solid #EFF2F6;
}
.status_box {
  display: flex;
  align-items: center;
  width: 86px;
  height: 24px;
  border-radius: 12px;
  font-size: 12px;
}
.status_box1 {
  width: 74px;
  background: #fff2e6;
  color: #ff7d00;
}

.status_box2 {
  background: #e6f7ea;
  color: #00b42a;
}
.status_box3 {
  background: #feecec;
  color: #f53f3f;
}
.page_wrap1 ::v-deep {
  height: calc(100vh - 165px);
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  // padding-top: 15px;
  .tablePage {
    height: 600px;
  }
  .el-table::before {
    background-color: transparent;
  }
  .my-table {
    margin: 0 !important;
  }
}
</style>
