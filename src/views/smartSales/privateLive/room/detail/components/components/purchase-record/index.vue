<template>
  <!-- 购买记录  -->
  <div>
    <HokSearchForm
      :form-opts="formOpts"
      :ref-obj.sync="formOpts.ref"
      class="pd20"
    >
      <template #type1>
        <div class="flex pl-2">
          <el-select
            v-model="formOpts.formData.type1"
            placeholder="请选择"
            style="width: 115px; border-right: 1px solid #dcdee1"
            @change="searchFn()"
          >
            <el-option label="手机号" value="studentPhone" />
            <el-option label="学员昵称" value="studentName" />
            <el-option label="邮箱" value="email" />
          </el-select>
          <el-input
            v-model="formOpts.formData.type1Val"
            style="padding-left: 8px"
            placeholder="请输入"
          />
        </div>
      </template>
      <template #teacherId>
        <el-select
          v-model="formOpts.formData.teacherId"
          size="small"
          filterable
          placeholder="请选择邀请人"
          clearable
          @change="searchFn()"
          @clear="searchFn()"
        >
          <el-option
            v-for="item in userArray"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
      </template>
      <template #orderStatus>
        <div class="flex pl-2">
          <el-select
            v-model="formOpts.formData.orderStatus"
            placeholder="请选择"
            @change="searchFn()"
          >
            <el-option
              v-for="item in orderStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </template>
    </HokSearchForm>
    <ZBTable
      ref="zbTableRef"
      :columns="columns"
      :get-list="getList"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    >
      <template v-slot:studentName="{ scope }">
        <div v-if="scope.row.studentName" class="studentInfo">
          <AppAvatar
            :name="scope.row.studentName"
            :avatar="scope.row.studentAvatarUrl"
            width="36"
            :no-name="true"
          />
          <textShowMore
            :line-clamp="1"
            :text="filtersTextPhone(scope.row.studentName)"
            class="m-l-5"
            style="max-width: 70px"
          />
          <el-tooltip
            class="item"
            effect="dark"
            content="点击复制"
            placement="top-start"
          >
            <i
              v-clipboard:copy="filtersTextPhone(scope.row.studentName)"
              v-clipboard:success="clipboardSuccess"
              style="height: 23px; line-height: 25px"
              class="el-icon-document-copy a_link m-l-10"
            />
          </el-tooltip>
        </div>
      </template>
      <template v-slot:orderStatus="{ scope }">
        <div class="orderStatus">
          <MyStatus
            v-if="scope.row.orderStatus"
            :status="orderStatusObj[scope.row.orderStatus].type"
          >
            <span>{{ orderStatusObj[scope.row.orderStatus].name }}</span>
          </MyStatus>
        </div>
      </template>
      <template v-slot:studentPhone="{ scope }">
        <watchPhoneNumber
          :phone-area-code="scope.row.phoneAreaCode"
          :default-value="scope.row.studentPhone"
          :params="scope.row"
          :user-id="scope.row.studentId"
          :onhandle-click="operationLogsWrite"
        />
      </template>
      <template v-slot:email="{ scope }">
        <watchPhoneNumber
          :default-value="scope.row.email"
          :params="scope.row"
          :user-id="scope.row.studentId"
          :get-api="operationLogsWriteEmail"
        />
      </template>
    </ZBTable>
  </div>
</template>

<script>
import {
  getPurchaseRecordPage,
  purchaseRecordExport
} from '@/api/liveRoom/index.js'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { columns, formConfig, orderStatusObj } from './columns'
import { userNoPage } from '@/api/addressBookApi'
import { filtersTextPhone } from '@/utils/index'
import { liveOperationType } from '../../../../columns'
import MyStatus from '@/views/live/liveRoom/components/p3/liveRoomSeeting/MyStatus.vue'
import moment from 'moment'
import { filtersMoneyByZero, getOptionsValue } from '@/filters'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { mapGetters } from 'vuex'
import textShowMore from '@/components/textShowMore/index2.vue'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
export default {
  directives: {
    clipboard
  },
  components: {
    ZBTable,
    HokSearchForm,
    MyStatus,
    watchPhoneNumber,
    textShowMore,
    AppAvatar
  },
  data() {
    return {
      orderStatusObj,
      columns,
      formOpts: {
        ...formConfig,
        operatorList: []
      },
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      permsList: this.$route.meta.permsList || [],
      userArray: [],
      importLoading: false,
      bindClickKeys: ['time', 'existInviteTeacher'],
      orderStatusList: [
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
      ]
    }
  },
  computed: {
    ...mapGetters(['paymentType_options'])
  },
  created() {
    // 绑定change事件
    this.formOpts.fieldList.forEach(item => {
      if (this.bindClickKeys.includes(item.prop)) {
        item.eventHandler.change = () => {
          this.searchFn()
        }
      }
    })
    this.loadUserNoPage()
    this.setOperatorList()
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    filtersTextPhone,
    setOperatorList() {
      const arr = [
        {
          label: '查询',
          bind: { plain: true },
          fn: () => {
            this.searchFn()
          }
        },
        {
          label: '重置',
          type: 'plain',
          fn: () => {
            this.searchFn(true)
          }
        }
      ]
      if (
        this.permsList &&
        this.permsList.includes('btn:liveDetail:purchaseRecordExport')
      ) {
        arr.push({
          label: '导出数据',
          type: 'plain',
          bind: {
            loading: this.importLoading
          },
          fn: () => {
            this.onhandleImport()
          },
          className: ['right']
        })
      }

      this.$set(this.formOpts, 'operatorList', arr)
    },
    filterTime(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm')
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.$route.params.id,
        userId: params.studentId,
        id: params.id,
        queryType: 1,
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
    },
    handleCurrentChangeEmit(val) {
      this.tableConfig.pageIndex = val
      this.searchFn(false, false)
    },
    handleSizeChangeEmit(val) {
      this.tableConfig.pageSize = val
      this.searchFn()
    },
    searchFn(isClear, isResetPageIndex = true) {
      if (isResetPageIndex) {
        this.tableConfig.pageIndex = 1
      }
      if (isClear) {
        this.formOpts.formData = {
          type1: 'studentPhone',
          time: '',
          orderStatus: '',
          teacherId: '',
          existInviteTeacher: true
        }
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      const params = {
        liveRoomId: this.$route.params.id,
        ...this.tableConfig,
        ...this.formOpts.formData,
        [this.formOpts.formData.type1]: this.formOpts.formData.type1Val,
        orderStartTime:
          this.formOpts.formData.time && this.formOpts.formData.time[0]
            ? this.formOpts.formData.time[0] + ':00'
            : '',
        orderEndTime:
          this.formOpts.formData.time && this.formOpts.formData.time[1]
            ? this.formOpts.formData.time[1] + ':59'
            : ''
      }
      delete params.type1
      delete params.time
      delete params.type1Val
      return new Promise((resolve, reject) => {
        getPurchaseRecordPage(params)
          .then(res => {
            res.data.items.forEach(item => {
              item.goodsPrice = filtersMoneyByZero(item.goodsPrice)
              item.discountsFee = filtersMoneyByZero(item.discountsFee)
              item.payMoney = filtersMoneyByZero(item.payMoney)
              item.orderTime = this.filterTime(item.orderTime)
              item.payTime = this.filterTime(item.payTime)
              item.paymentType = getOptionsValue(
                item.paymentType,
                this.paymentType_options
              )
            })
            resolve(res)
          })
          .catch(() => {
            reject()
          })
      })
    },
    // 点击导出记录
    onhandleImport() {
      this.importLoading = true
      const data = {
        liveRoomId: this.$route.params.id,
        ...this.tableConfig,
        ...this.formOpts.formData,
        [this.formOpts.formData.type1]: this.formOpts.formData.type1Val,
        orderStartTime:
          this.formOpts.formData.time && this.formOpts.formData.time[0]
            ? this.formOpts.formData.time[0] + ':00'
            : '',
        orderEndTime:
          this.formOpts.formData.time && this.formOpts.formData.time[1]
            ? this.formOpts.formData.time[1] + ':59'
            : ''
      }
      delete data.type1
      delete data.type1Val
      delete data.time
      purchaseRecordExport(data)
        .then(res => {
          console.log(res)
          const url = res.data + '?t=' + new Date().getTime()
          window.open(url)
          this.importLoading = false
        })
        .catch(() => {
          this.importLoading = false
        })
    },
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
        })
        .catch(() => {})
    },
    orderStatusChange(e) {
      console.log(e)
    }
  }
}
</script>
<style lang="scss" scoped>
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
