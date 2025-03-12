<template>
  <div class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :slot-arr="slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="search">
        <div class="filterHeader">
          <span class="formLabel">员工姓名</span>
          <el-select v-model="search.userId" size="small" class="w-200 m-r-10" filterable placeholder="请选择" clearable @change="searchFn">
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
          <span class="formLabel">手机号码</span>
          <el-input v-model.trim="search.phone" size="small" placeholder="请输入" style="width: 200px" class="m-r-10" clearable @input="delNumber" @keyup.enter.native="searchFn" @clear="searchFn" />
          <el-button size="small" type="primary" @click="searchFn">查询</el-button>
        </div>
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button type="text" @click="onhandleEdit(row)">编辑</el-button>
      </template>
      <template slot="headImgUrl" slot-scope="{ row }">
        <AppAvatar :avatar="row.headImgUrl" :name="row.liveRoomAlias || row.teacherName" width="30" :no-name="true" />
      </template>
      <template slot="teacherTel" slot-scope="{ row }">
        <watchPhoneNumber :default-value="row.teacherTel" :params="row" :user-id="row.teacherId" :get-api="operationLogsWrite" />
      </template>
      <sensitive-org-setting />
    </MPageLayout>
    <addDialog :config="addConfig" @success="addConfigSuccess" />

  </div>
</template>

<script>
import { liveOperationType } from '@/views/live/columns.js'
import { userNoPage } from '@/api/addressBookApi'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { liveRoomTutorPage, sysUserWrite } from '@/api/liveRoom/setting.js'
import { getItem } from '@/utils/localStorage'
import { mapGetters } from 'vuex'
import addDialog from './addDialog.vue'
import sensitiveOrgSetting from '../sensitiveOrgSetting/index.vue'
export default {
  components: {
    watchPhoneNumber,
    AppAvatar,
    addDialog,
    sensitiveOrgSetting
  },
  data() {
    return {
      slotArr: ['action', 'search', 'footer', 'status', 'headImgUrl', 'teacherTel'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'headImgUrl', label: '头像', type: 'slot', 'min-width': '80px' },
          { prop: 'teacherName', label: '员工姓名', type: 'text', 'min-width': '120px' },
          { prop: 'liveRoomAlias', label: '直播间名称', type: 'text', 'min-width': '120px' },
          { prop: 'teacherTel', label: '手机号码', type: 'slot', 'min-width': '120px' },
          { prop: 'action', label: '操作', type: 'slot', 'width': '120px', fixed: 'right' }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      search: {
        userName: '',
        userId: '',
        phone: ''
      },
      userArray: [],
      addConfig: {
        visible: false
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    this.loadUserNoPage()
    this.config.currentPage = 1
    this.searchFn()
  },
  methods: {
    // 限制只能输入英文和数字
    delNumber(e) {
      this.search.phone = e.replace(/[^0-9]/g, '')
    },
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params).then((res) => {
        this.userArray = res.data
      })
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    getList() {
      if (this.loading) {
        return
      }
      this.loading = true
      const data = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        teacherId: this.search.userId,
        teacherTel: this.search.phone
      }
      liveRoomTutorPage(data).then(res => {
        this.config.tableData = res.data.items
        this.config.total = res.data.total
        this.loading = false
        this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击编辑
    onhandleEdit(row) {
      this.addConfig = {
        visible: true,
        row: JSON.parse(JSON.stringify(row))
      }
    },
    addConfigSuccess() {
      this.addConfig = {
        visible: false,
        row: {}
      }
      this.getList()
    },
    handleClickSearch() {},
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const orginfo = getItem('orgInfo')
      const data = {
        userId: params.teacherId,
        phoneNum: params.teacherTel,
        tenantId: orginfo.organizationId,
        operationSysUserId: this.userInfo.userId,
        operationType: liveOperationType.type10
      }
      return sysUserWrite(data)
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  height: calc(100vh - 169px)!important;
  // min-width: 1430px;
  .filterHeader {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    .formLabel {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      margin-right: 8px;
    }
  }
}
.pagination {
  margin-top: 10px;
  text-align: right;
}
</style>
