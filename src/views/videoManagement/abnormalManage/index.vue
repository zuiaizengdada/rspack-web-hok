<template>
  <div class="page_wrap1">
    <div class="details-container">
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        class="form-breadcrumb"
      >
        <el-breadcrumb-item
          :to="{ path: '/videoManagement/accountManage' }"
        >账号管理</el-breadcrumb-item>
        <el-breadcrumb-item>异常账号管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <filter-top
      :all-columns-selected-indeterminate="allColumnsSelectedIndeterminate"
      :dept-tree-array="deptTreeArray"
      :user-array="userArray"
      :role-object="roleObject"
      :account-form="accountForm"
      :tearch-array="tearchArray"
      :platform-array="platformArray"
      :config="config"
      :all-columns-selected="allColumnsSelected"
      @clear="clear"
      @handleChangeTeacher="handleChangeTeacher"
      @tearchFilter="tearchFilter"
      @getListForSearch="getListForSearch"
      @loadUserNoPage="loadUserNoPage"
    />
    <!-- 内容区(异常账号管理) -->
    <MPageLayout
      ref="MPageLayout"
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
      @sort-change="sortChange"
    >
      <div slot="name" slot-scope="{ row }" class="plat-form-line">
        <img :src="row.avatar" />
        <span>{{ row.name }}</span>
      </div>
      <div slot="platformId" slot-scope="{ row }" class="plat-form-line">
        <img :src="row.platformImg" />
        <span>{{ row.platformName }}</span>
      </div>
      <div
        slot="exceptionAccountType"
        slot-scope="{ row }"
        class="accountStatus"
      >
        <span v-if="row.accountExceptionStatus === 1" class="accountStatus1">
          <img :src="logoff_icon" alt="" />
          <span>注销</span>
        </span>
        <span
          v-else-if="row.accountExceptionStatus === 2"
          class="accountStatus2"
        >
          <img :src="transferAccount_icon" alt="" />
          <span>移交IP</span>
        </span>
      </div>
      <div slot="action" slot-scope="{ row }">
        <!-- v-permission="['web:teachFileList:detail', permsList]" -->
        <el-button
          v-permission="['web:abnormalManage:accountDetail', permsList]"
          type="text"
          @click="gotoAccountDataDetail(row)"
        >详情</el-button>
        <el-button
          v-permission="['web:abnormalManage:accountReset', permsList]"
          type="text"
          @click="restoreAccount(row, 6)"
        >恢复</el-button>
        <el-button
          v-permission="['web:abnormalManage:accountRecord', permsList]"
          type="text"
          @click="showLogging(row)"
        >日志记录</el-button>
      </div>
    </MPageLayout>
    <transferAccount
      ref="transferAccount"
      :type="optType"
      :account-info="accountInfo"
      @refresh="getListForSearch"
    />
    <logging ref="logging" :account-info="accountInfo" />
  </div>
</template>

<script>
import filterTop from './components/filterTop.vue'
import {
  getPlatform,
  getAbnormalAccountList,
  getLoginInfo
} from '@/api/videoManagement/accountManage'
import logoff_icon from '@/assets/svg/videoManga/logoff_icon.svg'
import transferAccount_icon from '@/assets/svg/videoManga/transferAccount_icon.svg'
import { userNoPage } from '@/api/addressBookApi'
import { loadUserData, changeTeacher, tearchFilter } from '@/utils/videoMange'
import { filtersMoneyByW } from '@/filters/index'
import transferAccount from '../accountManage/components/transferAccount.vue'
import logging from '../accountManage/components/logging.vue'
export default {
  components: {
    filterTop,
    transferAccount,
    logging
  },
  data() {
    return {
      transferAccount_icon,
      logoff_icon,
      roleObject: {},
      permsList: this.$route.meta.permsList || [],
      slotArr: [
        'action',
        'footer',
        'exceptionAccountType',
        'platformId',
        'name'
      ],
      loading: false,
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          {
            prop: 'name',
            width: 200,
            label: '账号',
            type: 'slot',
            visible: true,
            disable: true
          },
          {
            prop: 'platformId',
            width: 120,
            label: '平台',
            type: 'slot',
            visible: true,
            disable: true
          },
          {
            prop: 'exceptionAccountType',
            width: 120,
            label: '账号状态',
            type: 'slot',
            visible: true
          },
          {
            prop: 'fans',
            width: 100,
            label: '粉丝数',
            type: 'text',
            visible: true,
            render: row => {
              return filtersMoneyByW(row.fans)
            }
          },
          { prop: 'teacherName', label: 'IP老师', type: 'text', visible: true },
          {
            prop: 'operatorName',
            label: '运营者',
            type: 'text',
            visible: true
          },
          { prop: 'deptName', label: '部门', type: 'text', visible: true },
          {
            prop: 'platformAccountId',
            label: '账号ID',
            type: 'text',
            visible: true
          },
          { prop: 'authorId', label: '账号UID', type: 'text', visible: true },
          { prop: 'phone', label: '电话号码', type: 'text', visible: true },
          {
            prop: 'action',
            label: '操作',
            width: 190,
            type: 'slot',
            visible: true,
            disable: true
          }
        ],
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 30,
        currentPage: 1,
        total: 0
      },
      accountForm: {
        deptArray: [],
        operatorId: '',
        teacherId: '',
        exceptionAccountType: null,
        groupId: '',
        accountName: '',
        platformId: null,
        sortType: 0,
        phone: ''
      },
      allColumnsSelectedIndeterminate: false,
      deptTreeArray: [],
      tearchArray: [],
      userArray: [],
      platformArray: [],
      optType: 1,
      accountInfo: {}
    }
  },
  watch: {
    'config.tableColumns': {
      handler(val) {
        const arr = val.filter(v => v.visible)
        if (arr.length === this.config.tableColumns.length) {
          this.allColumnsSelected = true
          this.allColumnsSelectedIndeterminate = false
        } else {
          this.allColumnsSelected = false
          this.allColumnsSelectedIndeterminate = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.userInfo = this.$store.getters.userInfo
    const tableColumns = localStorage.getItem('abnormalManage_tabledata')
    if (tableColumns) {
      this.config.tableColumns = JSON.parse(tableColumns)
    }
    this.loadUserLoginInfo()
    this.loadTeacherData()
    this.loadPlatformData()
  },
  mounted() {
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', res => {
      localStorage.setItem(
        'abnormalManage_tabledata',
        JSON.stringify(this.config.tableColumns)
      )
    })
  },
  methods: {
    // 页码改变触发
    handleSizeChange(val) {
      this.config.currentPage = 1
      this.config.pageSize = val
      this.getList()
    },
    // 查看日志
    showLogging(row) {
      this.accountInfo = row
      this.$nextTick(() => {
        this.$refs.logging.show()
      })
    },
    // 恢复
    restoreAccount(row, type) {
      this.$uweb && this.$uweb.setAction('Event_AccountMange_logoffRestore')
      this.accountInfo = row
      this.optType = type
      this.$nextTick(() => {
        this.$refs.transferAccount.show()
      })
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    gotoAccountDataDetail(data) {
      const path = this.$route.path
      this.$router.push({
        path: `/videoManagement/myAccountDetail?fromType=all&accountId=${data.platformAccountId}`,
        query: {
          path,
          name: '异常账号管理'
        }
      })
    },
    getListForSearch(data) {
      this.config.currentPage = 1
      this.accountForm = { ...this.accountForm, ...data }
      this.getList()
    },
    async loadUserLoginInfo() {
      const res = await getLoginInfo()
      if (res.success) {
        this.roleObject = res.data
        if (this.roleObject.role === 1) {
          this.encapsulateData(this.roleObject.deptInfo)
          this.deptTreeArray = this.roleObject.deptInfo
          // this.accountForm.operatorId = this.userInfo.userId
          // this.accountForm.deptArray.push(Number(res.data.deptId))
          this.loadUserNoPage()
          this.getList()
        } else {
          this.getList()
        }
      }
    },
    clear() {
      this.accountForm = {
        deptArray: [],
        operatorId: '',
        teacherId: '',
        exceptionAccountType: '',
        groupId: '',
        platformId: null,
        accountName: '',
        phone: '',
        sortType: 0
      }
      this.getListForSearch()
    },
    async loadTeacherData() {
      const { tearchArray, tearchList } = await loadUserData('abnormalManage', 1)
      console.log(tearchArray, tearchList, '我的数据数据')
      this.tearchArray = tearchArray
      this.tearchList = tearchList
      this.tearchFilter('')
    },
    async handleChangeTeacher() {
      if (this.accountForm.teacherId) {
        const res = await changeTeacher(this.tearchList, this.tearchArray, 'abnormalManage', this.accountForm.teacherId)
        console.log(res, '我的数据数据')
        this.tearchArray = res
      }
      this.getListForSearch()
    },
    async tearchFilter(query) {
      setTimeout(async() => {
        const res = await tearchFilter(query, this.tearchList, this.accountForm.teacherId)
        this.tearchArray[0].isHidden = query.length > 0
        this.tearchArray[1].options = res
      }, 300)
    },
    async loadPlatformData() {
      const res = await getPlatform()
      this.platformArray = res.data
    },
    async loadUserNoPage() {
      const params = {
        deptId: this.accountForm.deptArray[
          this.accountForm.deptArray.length - 1
        ]
          ? this.accountForm.deptArray[this.accountForm.deptArray.length - 1]
          : '',
        nickName: ''
      }
      const res = await userNoPage(params)
      this.userArray = res.data
    },
    async getList() {
      const params = {
        deptId: this.accountForm.deptArray[
          this.accountForm.deptArray.length - 1
        ]
          ? this.accountForm.deptArray[this.accountForm.deptArray.length - 1]
          : '',
        groupId: this.accountForm.groupId,
        exceptionAccountType: this.accountForm.exceptionAccountType,
        operatorId: this.accountForm.operatorId,
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        platformId: this.accountForm.platformId
          ? this.accountForm.platformId
          : null,
        teacherId: this.accountForm.teacherId,
        sortType: this.accountForm.sortType,
        accountName: this.accountForm.accountName,
        phone: this.accountForm.phone
      }
      const res = await getAbnormalAccountList(params)
      if (res.success) {
        this.config.tableData = res.data.items
        this.config.tableData.some(item => {
          item.platformImg = this.getImgSrc(item.platformId)
        })
        this.config.currentPage = res.data.pageIndex
        this.config.pageSize = res.data.pageSize
        this.config.total = res.data.total
      }
    },
    getImgSrc(id) {
      let img = ''
      this.platformArray.some(item => {
        if (item.platformId === id) {
          img = item.platformIcon
          return
        }
      })
      return img
    },
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    },
    sortChange(val) {
      if (val.order === 'descending') {
        this.accountForm.sortType = 1
      }
      if (val.order === 'ascending') {
        this.accountForm.sortType = 2
      }
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.accountStatus {
  display: flex;
  .accountStatus1,
  .accountStatus2 {
    display: flex;
    align-items: center;
    height: 24px;
    box-sizing: border-box;
    border-radius: 12px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    img {
      margin-left: 10px;
      margin-right: 4px;
      width: 14px;
      height: 14px;
    }
  }
  .accountStatus1 {
    color: #717f99;
    width: 62px;
    background: #eef2f9;
  }
  .accountStatus2 {
    color: #860cff;
    width: 88px;
    background: #fbf5ff;
  }
}
.page_wrap1 ::v-deep {
  @include responsive-height(20px);
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  padding-top: 15px;
  .tablePage {
    height: 600px;
  }
  .el-table::before {
    background-color: transparent;
  }
}
.details-container ::v-deep {
  padding: 0 20px;
  // padding-bottom: 0px;
  .form-breadcrumb {
    padding-bottom: 15px;
    border-bottom: 1px solid #eff2f6;
  }
  .tool-block {
    padding: 20px 0;
    .plus-btn {
      margin-right: 5px;
      font-weight: bold;
    }
  }
}

.photoUrl {
  width: 70px;
  height: 80px;
  border-radius: 4px;
  background: rgb(250, 250, 250);
}
.experience {
  width: 135px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #333;
}
.search_for_button {
  margin-left: 10px;
  ::v-deep .el-button--primary.is-plain {
    border: 1px solid #0c6fff;
    color: #0c6fff;
    background: none !important;
  }
  .add_account {
    margin-right: 5px;
    font-weight: bold;
  }
}

.login-success {
  color: #00b42a;
}
.login-error {
  em {
    font-style: normal;
    color: #f53f3f;
    text-align: center;
    width: 100%;
    float: left;
  }
  ::v-deep .el-button {
    width: 80px;
  }
}
.plat-form-line {
  img {
    float: left;
    width: 36px;
    height: 36px;
    border-radius: 100%;
  }
  span {
    line-height: 36px;
    margin-left: 8px;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
  }
}
.del-cls {
  color: #f53f3f;
}
.item-tips {
  float: left;
}
</style>
