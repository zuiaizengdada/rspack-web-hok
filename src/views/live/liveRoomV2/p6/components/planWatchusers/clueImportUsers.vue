<template>
  <!-- 关联任务线索 -->
  <div class="clueImportUsers">
    <HokSearchForm :form-opts="formOpts" :ref-obj.sync="formOpts.ref" class="pd20" @change="change">
      <template #userInfo>
        <div class="flex pl-2">
          <el-select v-model="formOpts.formData.userInfo.label" class="two-min-select w102" placeholder="请选择" @change="userInfoTypeChange">
            <el-option v-for="item in formOpts.formData.userInfo.options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <template v-if="formOpts.formData.userInfo.label === 'phone'">
            <el-input v-model="formOpts.formData.userInfo.value.phone" class="pl10" placeholder="请输入手机号" clearable />
          </template>
          <template v-else-if="formOpts.formData.userInfo.label === 'userName'">
            <el-input v-model="formOpts.formData.userInfo.value.userName" class="pl10" placeholder="请输入学员昵称" clearable @keyup.enter.native="searchFn" />
          </template>
          <template v-if="formOpts.formData.userInfo.label === 'email'">
            <el-input v-model="formOpts.formData.userInfo.value.email" class="pl10" placeholder="请输入邮箱" clearable @keyup.enter.native="searchFn" />
          </template>
        </div>
      </template>
    </HokSearchForm>
    <div class="clueImportUsersContent">
      <div class="myTable custom-table">
        <el-table v-loading="loading" height="100%" :data="list" :header-cell-style="{ background: '#EFF2F6', color: '#000' }" :cell-style="{ color: '#333' }">
          <el-table-column prop="userName" label="学员昵称" align="center">
            <template slot-scope="{ row }">
              {{ filtersTextPhone(row.userName) }}
            </template>
          </el-table-column>
          <el-table-column prop="couponUserPhone" label="手机号码" align="center">
            <template slot-scope="{ row }">
              <watchPhoneNumber :phone-area-code="row.phoneAreaCode" :default-value="row.phone" :params="row" :user-id="row.userId" :onhandle-click="operationLogsWrite" />
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" align="center">
            <template slot-scope="{ row }">
              <watchPhoneNumber :default-value="row.email" :params="row" :user-id="row.userId" :onhandle-click="operationLogsWriteEmail" />
            </template>
          </el-table-column>
          <el-table-column prop="isAttendance" label="是否到课" align="center">
            <template slot-scope="{ row }">
              {{ row.isAttendance ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column prop="active" label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button v-if="row.phone" type="text" :loading="row.callLoading" @click="onhandleCall(row)">
                外呼
              </el-button>
              <el-button type="text" style="color: #f53f3f" @click="del(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="pagination"
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
</template>

<script>
import { getLiveRoomUserInfoByName } from '@/api/liveRoom/index.js'
import { clueImportUsersOpts } from '../../data'
import { filtersTextPhone } from '@/utils/index'
import { deepClone } from '@/utils/FormGenerator/index'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import { sysUserWrite } from '@/api/liveRoom/setting.js'
import { getItem } from '@/utils/localStorage'
import Dialog from '@/views/live/liveRoomV2/Dialog/index.js'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import {
  planWatchUserQuery,
  deleteImportUser
} from '@/api/liveRoom/index'
import { mapState } from 'vuex'
export default {
  components: {
    HokSearchForm,
    watchPhoneNumber
  },
  props: {
    userArray: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      formOpts: {
        ...deepClone(clueImportUsersOpts(this.searchFn).form),
        operatorList: [
          { label: '搜索', fn: this.searchFn },
          { label: '重置', type: 'plain', fn: this.clearFn }
        ]
      },
      list: [],
      currentPage: 1,
      pageSize: 10,
      liveRoomId: this.$route.params.id,
      total: 0
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    filtersTextPhone(str) {
      return filtersTextPhone(str)
    },
    selectedStudentUserId(e) {
      this.formOpts.formData.userInfo.value.studentUserId = e.userId
      this.formOpts.formData.userInfo.value.nickName = e.nickName
      this.searchFn()
    },
    getLiveRoomUserInfoByName(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        nickName: params.nickName
      }
      return getLiveRoomUserInfoByName(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    clearFn() {
      this.formOpts.formData = { ...deepClone(clueImportUsersOpts(this.searchFn).form.formData),
        isAttendance: 2 }
      this.searchFn()
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
      const params = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        liveRoomId: this.liveRoomId,
        phone: this.formOpts.formData.userInfo.value.phone,
        email: this.formOpts.formData.userInfo.value.email,
        userName: this.formOpts.formData.userInfo.value.userName,
        // userId: this.formOpts.formData.userInfo.value.userId,
        isAttendance: this.formOpts.formData.isAttendance === '' ? 2 : this.formOpts.formData.isAttendance,
        userSource: 2
      }
      return planWatchUserQuery(params).then(res => {
        res.data.items.map(v => { v.callLoading = false })
        this.list = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    change() {
      this.searchFn()
    },
    userInfoTypeChange() {
      this.formOpts.formData.userInfo.value = {
        phone: '',
        studentUserId: '',
        email: ''
      }
    },
    del(row) {
      this.$delModal({
        tips: `是否删除该用户！`,
        success: () => {
          deleteImportUser({
            id: row.id,
            liveRoomId: this.$route.params.id
          }).then(() => {
            this.searchFn()
          })
        },
        fail: () => {}
      })
    },
    // 手机号埋点
    operationLogsWrite(params) {
      console.log(params)
      const orginfo = getItem('orgInfo')
      const data = {
        userId: params.teacherId,
        phoneNum: params.teacherTel,
        tenantId: orginfo.organizationId,
        id: params.id,
        queryType: 1,
        operationType: 105
      }
      return sysUserWrite(data)
    },
    operationLogsWriteEmail(params) {
      console.log(params)
      const orginfo = getItem('orgInfo')
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.studentId,
        tenantId: orginfo.organizationId,
        queryType: 2,
        email: params.email,
        id: params.id,
        operationType: 105
      }
      return sysUserWrite(data)
    },
    onhandleCall(res) {
      console.log(res, 'res')
      res.callLoading = true
      this.operationLogsWrite(res).then((phoneRes) => {
        Dialog.open({
          type: 'Outbound',
          visible: true,
          phoneAreaCode: res.phoneAreaCode,
          phone: phoneRes.data,
          userName: res.userName,
          liveRoomDetail: this.liveRoomDetail,
          fail: () => {
            res.callLoading = false
          },
          // 通过结束 res 1：等待中 2: 呼叫中 3: 通话中 4: 已结束
          success: (res) => {
          },
          // 用户主动挂断通话
          hangUp: () => {
            res.callLoading = false
          },
          // 用户主动取消通话
          cancelCall: () => {
            res.callLoading = false
          }
        })
      }).catch(() => {
        res.callLoading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.clueImportUsers {
  height: 100%;
}

.clueImportUsers {
  padding: 20px 0 0;
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  .two-min-select {
    flex-shrink: 0;
    box-sizing: border-box;
    border-right: 1px solid #dcdee1;
    &.w102 {
      width: 102px !important;
    }
  }
  .clueImportUsersContent {
    flex: 1 0 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding-top: 10px;
    .myTable {
      flex: 1 0 0;
      overflow: hidden;
      border-radius: 10px;
      border: 1px solid #F2F2F2;
    }
    .pagination {
      height: 68px;
      min-height: 68px;
      max-height: 68px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
::v-deep {
  .tearchInput {
    width: 100%!important;
  }
  .hok-search-form {
    margin-bottom: 0;
  }
  .el-table::before {
    height: 0px;
  }
}

::v-deep {
  /**改变边框颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table--border, .custom-table.el-table--group {
      border: 1px solid #EFF2F6!important;
  }
  /**改变表格内竖线颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table--border  td, .custom-table.el-table--border th, .custom-table.el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
      border-right: 1px solid #EFF2F6!important;
  }
  /**改变合并单元格横线颜色===》.custom-table指定上面的类id */
  .custom-table .el-table--border th.el-table__cell {
      border-bottom: 1px solid #EFF2F6;
  }
  /**改变表格内常规行线颜色===》.custom-table指定上面的类id*/
  .custom-table .el-table  td, .custom-table.el-table th.is-leaf  {
      border-bottom: 1px solid #EFF2F6!important;
  }
  .custom-table .el-table th.el-table__cell.is-leaf, .el-table td.el-table__cell {
    border-bottom: 1px solid #EFF2F6!important;
  }
}
.pl10 {
  padding-left: 10px;
}
</style>
