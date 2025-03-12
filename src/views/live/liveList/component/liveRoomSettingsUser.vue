<template>
  <div class="pageWrap">
    <div class="filterHeader">
      <!-- <span class="formLabel">手机号</span> -->
      <!-- <el-input v-model.trim="search.phone" class="w-200 m-l-10 m-r-10" size="small" clearable @keyup.enter.native="searchFn" @clear="searchFn" /> -->
      <selectTelEmail v-model="search.userInfo" class="m-r-10" size="small" @onChange="searchFn" />
      <span class="formLabel">操作人</span>
      <el-select v-model="search.operatorUserId" placeholder="请选择" size="small" class="w-200 m-l-10" clearable filterable @clear="searchFn" @change="searchFn">
        <el-option
          v-for="item in userArray"
          :key="item.userId"
          :label="item.nickName"
          :value="item.userId"
        />
      </el-select>
      <el-button size="small" class="m-l-10" type="primary" style="margin-left: 27px" @click="searchFn">查询</el-button>

      <div class="fr">
        <el-button size="small" class="m-l-10" type="primary" style="margin-left: 27px" @click="onhandleAdd">新增</el-button>
        <el-button size="small" class="m-l-10 btn_primary" style="margin-left: 27px" @click="onhandleClueImport">线索导入</el-button>
        <el-button size="small" class="m-l-10 btn_primary" type="primary" @click="onhandleImport">Excel导入</el-button>
        <el-button size="small" class="m-l-10 btn_primary" @click="onhandleCopyLiveRoomUser">复制直播间人员</el-button>
      </div>
    </div>
    <el-table class="myTable m-t-20" max-height="502" :header-cell-style="{ background: '#f5f5f5' }" border :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="phone" label="手机号码">
        <template slot-scope="{ row }">
          <watchPhoneNumber :phone-area-code="row.phoneAreaCode" :default-value="row.phone" :params="row" :user-id="row.id" :get-api="operationLogsWrite" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户姓名">
        <template slot-scope="{ row }">
          {{ row.name | filtersName }}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
        <template slot-scope="{ row }">
          <watchPhoneNumber :default-value="row.email" :params="row" :user-id="row.id" :get-api="operationLogsWriteAjax" />
        </template>
      </el-table-column>
      <el-table-column prop="createUserName" label="操作人" />
      <el-table-column prop="createTime" label="操作时间">
        <template slot-scope="{ row }">
          {{ moment(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button style="color: #ff2c35; font-size: 14px" type="text" @click="onhandleDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-button size="small" type="danger" plain @click="onhandleBatchDel">批量删除</el-button>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :pager-count="5"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { filtersTextPhone } from '@/utils/index'
import { getUserLimitPage, delUserLimitPage, getUserLimitPhone, getUserLimitEmail } from '@/api/liveRoom/detail.js'
// import { operationLogsWriteAjax } from '@/api/liveRoom/index.js'
// import { liveOperationType } from '@/views/live/columns.js'
import Dialog from '@/views/live/Dialog/index.js'
// import { sysUserWrite } from '@/api/liveRoom/setting.js'
// import { getItem } from '@/utils/localStorage'
import { mapGetters } from 'vuex'
import { userNoPage } from '@/api/addressBookApi'
import selectTelEmail from '@/views/live/component/selectTelEmail'
import moment from 'moment'
export default {
  components: {
    watchPhoneNumber,
    selectTelEmail
  },
  filters: {
    filtersName(name) {
      if (!name) {
        return ''
      }
      return filtersTextPhone(name)
    }
  },
  data() {
    return {
      moment,
      loading: false,
      visible: true,
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [],
      search: {
        phone: '',
        userInfo: {
          label: 'tel',
          value: { tel: '', Email: '' }
        },
        operatorUserId: ''
      },
      userArray: []
      // enterLiveRoom: false
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'smsAreaList', 'mailSuffixesList'])
  },
  mounted() {
    this.loadUserNoPage()
    this.searchFn()
  },
  methods: {
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then((res) => {
          this.userArray = res.data
        })
        .catch(() => {
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        liveRoomId: this.$route.params.id,
        // phone: this.search.phone,
        phone: this.search.userInfo.value.tel,
        email: this.search.userInfo.value.Email,
        operatorUserId: this.search.operatorUserId,
        name: ''
      }
      getUserLimitPage(data).then(res => {
        if (this.currentPage !== 1 && res.data.items.length === 0) {
          this.currentPage--
          this.getList()
        } else {
          this.list = res.data.items
          this.total = res.data.total
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    // 新增人员
    onhandleAdd() {
      Dialog.open({
        visible: true,
        liveRoomId: this.$route.params.id,
        smsAreaList: this.smsAreaList,
        mailSuffixesList: this.mailSuffixesList,
        type: 'LiveRoomSettingsAddUser',
        success: () => {
          this.getList()
        }
      })
    },
    // 删除人员（单选）
    onhandleDel(row) {
      this.$delModal({
        tips: `是否确定删除?`,
        success: () => {
          this.loading = true
          const data = {
            ids: [row.id]
          }
          delUserLimitPage(data).then(res => {
            this.$message.success('操作成功')
            this.getList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 导入
    onhandleImport() {
      Dialog.open({
        visible: true,
        type: 'ExportLiveRoomSettings',
        liveRoomId: this.$route.params.id,
        success: () => {
          this.getList()
        }
      })
    },
    // 手机号埋点
    operationLogsWrite(params) {
      console.log(params)
      const data = {
        id: params.id
      }
      return getUserLimitPhone(data)
    },
    // 获取邮箱
    operationLogsWriteAjax(params) {
      const data = {
        id: params.id
      }
      return getUserLimitEmail(data)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onhandleBatchDel() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请至少选择一项')
      }
      const ids = this.multipleSelection.reduce((pre, next) => {
        pre.push(next.id)
        return pre
      }, [])
      this.$delModal({
        tips: `是否确定删除?`,
        success: () => {
          const data = {
            ids: ids
          }
          delUserLimitPage(data).then(res => {
            this.$message.success('操作成功')
            this.getList()
          })
        }
      })
    },
    onhandleClueImport() {
      Dialog.open({
        visible: true,
        liveRoomId: this.$route.params.id,
        type: 'ExportClue',
        success: () => {
          this.getList()
        }
      })
    },
    onhandleCopyLiveRoomUser() {
      Dialog.open({
        visible: true,
        liveRoomId: this.$route.params.id,
        type: 'CopyLiveRoomUser',
        success: () => {
          this.getList()
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.pageWrap {
    // height: 622px;
    padding: 20px 10px 0;
    border-radius: 6px;
    border: 1px solid #e6ebf5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    // border: 1px solid rgba(229, 231, 235, var(--tw-border-opacity));
}
.pagination {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
