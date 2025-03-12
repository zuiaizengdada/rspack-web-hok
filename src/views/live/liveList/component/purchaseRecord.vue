<template>
  <!-- 购买记录 -->
  <div v-loading="loading">
    <div class="search">
      <!-- <label class="searchLabel">手机号
        <el-input v-model.trim="search.phone" style="width: 150px" class="m-r-10 m-l-10" size="small" clearable @keyup.enter.native="searchFn" @input="delNumber" @clear="searchFn" />
      </label> -->
      <selectTelEmail v-model="search.userInfo" class="m-r-10" size="small" @onChange="searchFn" />
      <label class="searchLabel">下单时间
        <el-date-picker
          v-model="search.time"
          class="m-r-10 m-l-10"
          size="small"
          type="datetimerange"
          style="width: 300px"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </label>
      <label class="searchLabel">订单状态
        <el-select v-model="search.orderStatus" size="small" clearable placeholder="请选择" style="width: 150px" class="input-with-select select-width-200" @change="searchFn" @clear="searchFn">
          <el-option v-for="item in orderStatusOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </label>
      <label class="searchLabel m-l-10">邀请人
        <el-select v-model="search.teacherId" size="small" style="width: 150px" filterable placeholder="请选择邀请人" clearable @change="searchFn" @clear="searchFn">
          <el-option
            v-for="item in userArray"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
      </label>
      <label class="searchLabel m-l-10">
        <el-checkbox v-model="search.existInviteTeacher" class="m-b-10" @change="searchFn">仅查看邀约学员</el-checkbox>
      </label>
      <el-button class="m-l-20" type="primary" size="small" :loading="loading" @click="searchFn">查询</el-button>

      <el-button v-permission="['web:liveDetail:purchaseRecordExport', permsList]" class="fr btn_primary" type="primary" size="small" :loading="importLoading" @click="onhandleImport">导出记录</el-button>
    </div>
    <el-table class="m-t-20" :data="list" :header-cell-style="{ background: '#f5f5f5' }">
      <el-table-column prop="studentName" label="学员昵称" :show-overflow-tooltip="true">
        <template slot-scope="{ row }">
          <div class="studentInfo">
            <AppAvatar :name="row.studentName" :avatar="row.studentAvatarUrl" width="36" :no-name="true" />
            <textShowMore :line-clamp="1" :text="filtersTextPhone(row.studentName)" class="m-l-5" style="max-width: 70px" />
            <el-tooltip class="item" effect="dark" content="点击复制" placement="top-start">
              <i v-clipboard:copy="filtersTextPhone(row.studentName)" v-clipboard:success="clipboardSuccess" style="height: 23px;line-height: 25px;" class="el-icon-document-copy a_link m-l-10" />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="studentAvatarUrl" label="学员头像" width="50">
        <template slot-scope="{ row }">
          <AppAvatar :name="row.studentName" :avatar="row.studentAvatarUrl" width="36" :no-name="true" />
        </template>
      </el-table-column> -->
      <el-table-column prop="studentPhone" label="手机号码" width="120">
        <template slot-scope="{ row }">
          <watchPhoneNumber :phone-area-code="row.phoneAreaCode" :default-value="row.studentPhone" :params="row" :user-id="row.studentId" :get-api="operationLogsWrite" />
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="120">
        <template slot-scope="{ row }">
          <watchPhoneNumber :default-value="row.email" :params="row" :user-id="row.studentId" :get-api="operationLogsWriteEmail" />
        </template>
      </el-table-column>
      <el-table-column prop="teacherName" label="邀请人" align="center" />
      <el-table-column prop="goodsName" label="购买课程" :show-overflow-tooltip="true" />
      <el-table-column prop="goodsPrice" label="商品总价" align="center">
        <template slot-scope="{ row }">
          ￥{{ row.goodsPrice | filtersMoneyByZero }}
        </template>
      </el-table-column>
      <el-table-column prop="payMoney" label="优惠金额" align="center">
        <template slot-scope="{ row }">
          ￥{{ row.discountsFee | filtersMoneyByZero }}
        </template>
      </el-table-column>
      <el-table-column prop="payMoney" label="实付金额" align="center">
        <template slot-scope="{ row }">
          ￥{{ row.payMoney | filtersMoneyByZero }}
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="下单单号" />
      <el-table-column prop="orderTime" label="下单时间" align="center" width="140">
        <template slot-scope="{ row }">
          {{ row.orderTime | filterTime }}
        </template>
      </el-table-column>
      <el-table-column prop="orderStatus" label="订单状态" align="center" width="120">
        <template slot-scope="{ row }">
          <div class="orderStatus">
            <MyStatus v-if="row.orderStatus" :status="orderStatus[row.orderStatus].type">
              <span>{{ orderStatus[row.orderStatus].name }}</span>
            </MyStatus>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="payTime" label="支付时间" align="center" width="140">
        <template slot-scope="{ row }">
          {{ row.payTime | filterTime }}
        </template>
      </el-table-column>
      <el-table-column prop="paymentType" label="支付方式">
        <template slot-scope="{ row }">
          {{ row.paymentType | getOptionsValue(paymentType_options) }}
        </template>
      </el-table-column>
      <el-table-column prop="transactionId" label="流水号" />
    </el-table>
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
</template>

<script>
import { getPurchaseRecordPage, purchaseRecordExport } from '@/api/liveRoom/index.js'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import MyStatus from '../../liveRoom/components/p3/liveRoomSeeting/MyStatus.vue'
import { userNoPage } from '@/api/addressBookApi'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
import moment from 'moment'
import textShowMore from '@/components/textShowMore/index2.vue'
import { liveOperationType } from '@/views/live/columns.js'
import { filtersTextPhone } from '@/utils/index'
import selectTelEmail from '@/views/live/component/selectTelEmail'
import { mapGetters } from 'vuex'

export default {
  directives: {
    clipboard
  },
  filters: {
    filterTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  components: {
    AppAvatar,
    watchPhoneNumber,
    MyStatus,
    textShowMore,
    selectTelEmail
  },
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      search: {
        phone: '',
        userInfo: {
          label: 'tel',
          value: { tel: '', Email: '' }
        },
        time: [],
        orderStatus: '',
        teacherId: '',
        existInviteTeacher: true
      },
      orderStatus: {
        1: {
          type: 'error',
          name: '未支付'
        },
        2: {
          type: 'success',
          name: '支付成功'
        },
        3: {
          type: 'error',
          name: '超时已关闭'
        },
        4: {
          type: 'error',
          name: '用户已取消'
        },
        5: {
          type: 'warning',
          name: '退款中'
        },
        6: {
          type: 'warning',
          name: '部分退款'
        },
        7: {
          type: 'success',
          name: '全部退款'
        },
        8: {
          type: 'success',
          name: '交易结束'
        },
        9: {
          type: 'warning',
          name: '没有向第三方发起支付请求'
        },
        10: {
          type: 'error',
          name: '退款金额异常'
        },
        11: {
          type: 'success',
          name: '部分付款'
        },
        12: {
          type: 'error',
          name: '转课关闭'
        }
      },
      orderStatusOption: [
        { label: '全部', value: '' },
        { label: '未支付', value: 1 },
        { label: '支付成功', value: 2 },
        { label: '超时已关闭', value: 3 },
        { label: '用户已取消', value: 4 },
        { label: '退款中', value: 5 },
        { label: '部分退款', value: 6 },
        { label: '全部退款', value: 7 },
        { label: '交易结束', value: 8 },
        { label: '没有向第三方发起支付请求', value: 9 },
        { label: '退款金额异常', value: 10 },
        { label: '部分付款', value: 11 },
        { label: '转课关闭', value: 12 }
      ],
      permsList: this.$route.meta.permsList || [],
      loading: false,
      importLoading: false,
      userArray: []
    }
  },
  computed: {
    ...mapGetters(['paymentType_options'])
  },
  mounted() {
    this.searchFn()
    this.loadUserNoPage()
  },
  methods: {
    filtersTextPhone(str) {
      return filtersTextPhone(str)
    },
    // 点击导出记录
    onhandleImport() {
      this.importLoading = true
      const data = {
        liveRoomId: this.$route.params.id,
        // studentPhone: this.search.phone,
        studentPhone: this.search.userInfo.value.tel,
        email: this.search.userInfo.value.Email,
        orderStartTime: this.search.time && this.search.time.length > 0 ? (this.search.time[0] + ':00') : '',
        orderEndTime: this.search.time && this.search.time.length > 0 ? (this.search.time[1] + ':59') : '',
        orderStatus: this.search.orderStatus,
        teacherId: this.search.teacherId,
        existInviteTeacher: this.search.existInviteTeacher
      }
      purchaseRecordExport(data).then(res => {
        console.log(res)
        const url = res.data + '?t=' + new Date().getTime()
        window.open(url)
        this.importLoading = false
      }).catch(() => {
        this.importLoading = false
      })
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
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
    // 限制只能输入英文和数字
    delNumber(e) {
      this.search.phone = e.replace(/[^0-9]/g, '')
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
        liveRoomId: this.$route.params.id,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        // studentPhone: this.search.phone,
        studentPhone: this.search.userInfo.value.tel,
        email: this.search.userInfo.value.Email,
        orderStartTime: this.search.time && this.search.time.length > 0 ? (this.search.time[0] + ':00') : '',
        orderEndTime: this.search.time && this.search.time.length > 0 ? (this.search.time[1] + ':59') : '',
        orderStatus: this.search.orderStatus,
        teacherId: this.search.teacherId,
        existInviteTeacher: this.search.existInviteTeacher
      }
      getPurchaseRecordPage(params).then(res => {
        console.log(res)
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
    // 手机号埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.studentId,
        phoneNum: params.studentPhone,
        operationType: liveOperationType.type5
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    operationLogsWriteEmail(params) {
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.studentId,
        queryType: 2,
        email: params.email,
        operationType: liveOperationType.type5
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    }
  }
}
</script>

<style lang='scss' scoped>
.pagination {
  margin-top: 10px;
  text-align: right;
}
.orderStatus {
  display: inline-block;
  // padding: 0 8px;
  // border-radius: 13px;
  // font-size: 10px;
  // font-family: MicrosoftYaHei;
  // height: 24px;
  // line-height: 24px;
}
.search {
  .searchLabel {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
}
.w-250 {
  width: 250px;
}
.studentInfo {
  display: flex;
  align-items: center;
}
::v-deep {
  .textShowMore {
    width: auto;
  }
}
.m-l-5 {
  margin-left: 5px;
}
</style>
