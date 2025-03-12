<template>
  <div class="pageWrap">
    <div class="filterHeader">
      <!-- <span class="formLabel">手机号</span>
      <el-input v-model.trim="search.phone" class="w-200 m-l-10" size="small" clearable @keyup.enter.native="searchFn" @clear="searchFn" /> -->
      <selectTelEmail
        v-model="search.userInfo"
        class="m-r-10"
        size="small"
        @onChange="searchFn"
      />
      <el-button
        size="small"
        class="m-l-10"
        type="primary"
        style="margin-left: 27px"
        @click="searchFn"
      >查询</el-button>

      <div class="fr">
        <el-button
          size="small"
          class="m-l-10"
          type="primary"
          style="margin-left: 27px"
          @click="onhandleAdd"
        >新增</el-button>
        <el-button
          size="small"
          class="m-l-10 btn_primary"
          type="primary"
          style="margin-left: 27px"
          @click="onhandleImport"
        >批量导入</el-button>
      </div>
    </div>
    <el-table
      class="playback-setting-user m-t-20"
      max-height="502"
      :header-cell-style="{
        background: '#EFF2F6',
        padding: '9px 0',
        color: '#333',
        'font-weight': 700,
        'letter-spacing': '1px'
      }"
      :class="{ 'el-table-null': !list.length }"
      :data="list"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="mobile" label="手机号码">
        <template slot-scope="{ row }">
          <watchPhoneNumber
            :phone-area-code="row.phoneAreaCode"
            :default-value="row.mobile"
            :params="row"
            :user-id="row.id"
            :get-api="operationLogsWrite"
          />
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="邮箱">
        <template slot-scope="{ row }">
          <watchPhoneNumber
            :default-value="row.email"
            :params="row"
            :user-id="row.id"
            :get-api="operationLogsWriteEmail"
          />
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
          <el-button
            style="color: #ff2c35; font-size: 14px"
            type="text"
            @click="onhandleDel(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-button
        size="small"
        type="danger"
        plain
        @click="onhandleBatchDel"
      >批量删除</el-button>
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
import {
  playbackWhiteList,
  playbackWhiteListDel,
  canEnterLiveRoom
} from '@/api/liveRoom/index.js'
import { liveOperationType } from '../../../../columns.js'
import Dialog from '@/views/live/Dialog/index.js'
import { sysUserWrite } from '@/api/liveRoom/setting.js'
import { getItem } from '@/utils/localStorage'
import { mapGetters } from 'vuex'
import selectTelEmail from '@/views/live/component/selectTelEmail'
import moment from 'moment'
export default {
  components: {
    watchPhoneNumber,
    selectTelEmail
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
        }
      },
      enterLiveRoom: false
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'smsAreaList', 'mailSuffixesList'])
  },
  mounted() {
    this.canEnterLiveRoom()
    this.searchFn()
  },
  methods: {
    canEnterLiveRoom() {
      return canEnterLiveRoom().then(res => {
        this.enterLiveRoom = res.data
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
        // studentPhone: this.search.phone
        studentPhone: this.search.userInfo.value.tel,
        email: this.search.userInfo.value.Email
      }
      playbackWhiteList(data)
        .then(res => {
          if (this.currentPage !== 1 && res.data.items.length === 0) {
            this.currentPage--
            this.getList()
          } else {
            this.list = res.data.items
            this.total = res.data.total
            this.loading = false
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    // 新增人员
    onhandleAdd() {
      console.log('新增人员', this.smsAreaList, this.mailSuffixesList)
      Dialog.open({
        visible: true,
        liveRoomId: this.$route.params.id,
        smsAreaList: this.smsAreaList,
        mailSuffixesList: this.mailSuffixesList,
        type: 'PlaybackAddUser',
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
          playbackWhiteListDel(data)
            .then(res => {
              this.$message.success('操作成功')
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 导入
    onhandleImport() {
      Dialog.open({
        visible: true,
        type: 'ExportPlaybackUser',
        liveRoomId: this.$route.params.id,
        success: () => {
          this.getList()
        }
      })
    },
    // 手机号埋点
    operationLogsWrite(params) {
      console.log(params)
      const orginfo = getItem('orgInfo')
      const data = {
        liveRoomPlaybackSetWhiteListId: params.id,
        phoneNum: params.mobile,
        tenantId: orginfo.organizationId,
        operationSysUserId: this.userInfo.userId,
        operationType: liveOperationType.type12
      }
      return sysUserWrite(data)
    },
    operationLogsWriteEmail(params) {
      const orginfo = getItem('orgInfo')
      const data = {
        liveRoomPlaybackSetWhiteListId: params.id,
        phoneNum: params.email,
        queryType: 2,
        tenantId: orginfo.organizationId,
        operationSysUserId: this.userInfo.userId,
        operationType: liveOperationType.type12
      }
      return sysUserWrite(data)
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
          playbackWhiteListDel(data).then(res => {
            this.$message.success('操作成功')
            this.getList()
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.pageWrap {
  padding: 20px 10px 0;
  border-radius: 6px;
  border: 1px solid #eff2f6;
  // background: rgba(231, 240, 255, 0.4);
}
.pagination {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
::v-deep {
  .input-with-select {
    width: 108px !important;
  }
}
::v-deep .playback-setting-user {
  border-left: 1px solid #eff2f6;
  border-right: 1px solid #eff2f6;
  border-radius: 6px;
  .el-table-null {
    border-bottom: 1px solid #eff2f6;
  }
  .el-table th.el-table__cell.is-leaf {
    border-bottom: none;
  }
  .el-table td.el-table__cell {
    border-bottom-color: #eff2f6;
  }
  .el-table::before {
    width: 0 !important;
    height: 0 !important;
  }
  .el-table__header-wrapper {
    .el-table__header {
      th {
        border-bottom: none;
        .cell {
          color: #000;
          font-family: 'Microsoft YaHei';
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
        }
      }
    }
  }
  .el-table__body {
    .el-table__row {
      .el-table__cell {
        .cell {
          color: #333;
        }
      }
    }
  }
}
</style>
