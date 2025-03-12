  <!-- 签到结果 -->
<template>
  <AppDialog
    v-model="visible"
    title="签到结果"
    width="862px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div class="signRecord">
      <div class="filterHeader">
        <!-- <span class="formLabel">学员昵称</span> -->
        <!-- <el-input v-model.trim="search.userName" size="small" placeholder="请输入学员昵称" class="w-200 m-r-10" clearable @keyup.enter.native="searchFn" @clear="searchFn" /> -->
        <!-- <span class="formLabel">手机号码</span> -->
        <!-- <el-input v-model.trim="search.phone" size="small" placeholder="请输入手机号码" class="w-200 m-r-10" clearable @keyup.enter.native="searchFn" @clear="searchFn" /> -->
        <selectTelEmail v-model="search.userInfo" class="m-r-10" size="small" @onChange="searchFn" />
        <span class="formLabel">签到状态</span>
        <el-select v-model="search.signStatus" placeholder="请选择" clearable size="small" class="w-150 m-r-20" @change="searchFn">
          <el-option label="未签到" :value="false" />
          <el-option label="已签到" :value="true" />
        </el-select>
        <el-button size="small" type="primary" @click="searchFn">查询</el-button>
        <el-button size="small" style="margin-left: 16px" @click="clearFn">重置</el-button>
      </div>
      <div class="myTable m-t-20">
        <el-table v-loading="loading" height="328" :header-cell-style="{ background: '#F3F3F3' }" border :data="list">
          <el-table-column prop="nickname" label="学员">
            <template slot-scope="{ row }">
              <div class="studentInfo">
                <AppAvatar :name="row.nickname" :avatar="row.avatar" width="36" :no-name="true" />
                <textShowMore :line-clamp="1" :text="filtersTextPhone(row.nickname)" class="m-l-10" style="max-width: 70px" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号码">
            <template slot-scope="{ row }">
              <watchPhoneNumber :phone-area-code="row.phoneAreaCode" :default-value="row.phone" :params="row" :user-id="row.userId" :get-api="operationLogsWrite" />
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱">
            <template slot-scope="{ row }">
              <watchPhoneNumber :default-value="row.email" :params="row" :user-id="row.userId" :get-api="operationLogsWriteEmail" />
            </template>
          </el-table-column>
          <el-table-column prop="signTime" label="签到时间">
            <template slot-scope="{ row }">
              {{ row.isSign ? row.signTime : '——' }}
            </template>
          </el-table-column>
          <el-table-column prop="isSign" label="签到状态">
            <template slot-scope="{ row }">
              {{ row.isSign ? '已签到' : '未签到' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
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

    <template slot="footer">
      <div class="ss-material-box-bottom">
        <el-button size="small" :loading="loading" @click="visible = false">取消</el-button>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { liveOperationType } from '@/views/live/columns.js'
import { liveRoomSignResult } from '@/api/liveRoom/index.js'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import textShowMore from '@/components/textShowMore/index2.vue'
import { filtersTextPhone } from '@/utils/index'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import selectTelEmail from '@/views/live/component/selectTelEmail'
export default {
  components: {
    AppAvatar,
    AppDialog,
    textShowMore,
    watchPhoneNumber,
    selectTelEmail
  },
  data() {
    return {
      filtersTextPhone,
      top: '114px',
      search: {
        userName: '',
        phone: '',
        userInfo: {
          label: 'tel',
          value: { tel: '', Email: '' }
        },
        signStatus: ''
      },
      liveRoomId: '',
      liveRoomSignId: '',
      loading: false,
      visible: false,
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.$nextTick(() => {
          this.searchFn()
        })
      },
      deep: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 644) / 2 + 'px'
  },
  methods: {
    sure() {},
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
        liveRoomId: this.liveRoomId,
        isSign: this.search.signStatus,
        nickname: this.search.userName,
        // phone: this.search.phone,
        phone: this.search.userInfo.value.tel,
        email: this.search.userInfo.value.Email,
        liveRoomSignId: this.liveRoomSignId
      }
      liveRoomSignResult(data).then(res => {
        this.list = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    open({ liveRoomId, liveRoomSignId }) {
      this.visible = true
      this.liveRoomId = liveRoomId
      this.liveRoomSignId = liveRoomSignId
      this.clearFn()
    },
    clearFn() {
      this.search = {
        userName: '',
        phone: '',
        userInfo: {
          label: 'tel',
          value: { tel: '', Email: '' }
        },
        signStatus: ''
      }
      this.searchFn()
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.liveRoomId,
        userId: params.userId,
        phoneNum: params.phone,
        operationType: liveOperationType.type9
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    // 邮箱
    operationLogsWriteEmail(params) {
      const data = {
        liveRoomId: this.liveRoomId,
        userId: params.userId,
        phoneNum: params.phone,
        queryType: 2,
        email: params.email,
        operationType: liveOperationType.type9
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    }
  }
}
</script>

<style lang='scss' scoped>
.signRecord {
  // height: 570px;
  padding: 20px 20px 0 20px;
  .filterHeader {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    display: flex;
    align-items: center;
    .formLabel {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 32px;
      margin-right: 8px;
      white-space: nowrap;
    }
  }
  .myTable {
    width: 100%;
    // height: 502px;
    background: #FFFFFF;
    border-radius: 6px;
    border: 1px solid #CBCFD3;
    overflow: hidden;
  }
  .pagination {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: right;
  }
}
.lotteryUserInfo {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  font-weight: 500;
  color: #0c6fff;
  font-size: 16px;
  cursor: pointer;
}
::v-deep {
  .ss-material-box-header-title {
    position: relative;
    width: 100%;
  }
  .ss-material-box-bottom {
    box-shadow: 0px -2px 4px 0px rgba(0,0,0,0.05);
  }
}
.studentInfo {
  display: flex;
  align-items: center;
}
</style>

