<template>
  <AppDialog
    v-model="visible"
    title="购买记录"
    width="1300px"
    :loading="loading"
    height="auto"
    :top="top"
    :drag="drag"
    :modal="true"
  >
    <div class="purchaseRecord">
      <div>
        <el-checkbox
          v-model="search.existInviteTeacher"
          class="m-b-10"
          @change="searchFn"
        >
          仅查看邀约学员
        </el-checkbox>
      </div>
      <div class="search">
        <selectTelEmail
          v-model="search.userInfo"
          class="m-r-10"
          size="small"
          width="170px"
          @onChange="searchFn"
        />
        <label class="searchLabel">
          下单时间
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
        <label class="searchLabel">
          订单状态
          <el-select
            v-model="search.orderStatus"
            size="small"
            clearable
            placeholder="请选择"
            class="input-with-select select-width-200"
            @change="searchFn"
            @clear="searchFn"
          >
            <el-option
              v-for="item in orderStatusOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </label>
        <label class="searchLabel m-l-10">
          邀请人
          <el-select
            v-model="search.teacherId"
            size="small"
            class="w-200"
            filterable
            placeholder="请选择创建人"
            clearable
            @change="searchFn"
          >
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </label>
        <el-button class="m-l-10" type="primary" size="small" @click="searchFn">
          查询
        </el-button>
      </div>
      <div class="table-head">
        <el-popover placement="bottom-end" width="150" trigger="click">
          <el-button slot="reference" type="text" size="small">
            自定义表头
          </el-button>

          <el-checkbox
            v-model="allcolumnsSelected"
            :indeterminate="allcolumnsSelectedIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <!-- v-dragging="{
              item: item,
              list: columns,
              group: 'item'
            }" -->
          <el-checkbox
            v-for="item in columns"
            :key="item.label"
            v-model="item.visible"
            :disabled="item.disable"
            @change="handleCheckedTablecolumnsChange(item)"
          >
            {{ item.label }}
          </el-checkbox>
        </el-popover>
      </div>
      <div class="myTable">
        <el-table
          ref="purchaseRecordRef"
          height="566"
          :data="list"
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <template v-for="col in columns">
            <el-table-column
              v-if="col.visible"
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              v-bind="col.bind"
            >
              <template slot-scope="{ row }">
                <!--
                v-if="!['teacherName', 'goodsName'].includes(col.prop)" -->
                <template v-if="col.prop === 'studentName'">
                  <div class="studentInfo">
                    <AppAvatar
                      :name="row.studentName"
                      :avatar="row.studentAvatarUrl"
                      width="36"
                      :no-name="true"
                    />
                    <textShowMore
                      :line-clamp="1"
                      :text="filtersTextPhone(row.studentName)"
                      class="m-l-5"
                      style="max-width: 95px"
                    />
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="点击复制"
                      placement="top-start"
                    >
                      <i
                        v-clipboard:copy="filtersTextPhone(row.studentName)"
                        v-clipboard:success="clipboardSuccess"
                        style="height: 23px; line-height: 25px"
                        class="el-icon-document-copy a_link m-l-10"
                      />
                    </el-tooltip>
                  </div>
                </template>
                <template v-else-if="col.prop === 'studentPhone'">
                  <watchPhoneNumber
                    :phone-area-code="row.phoneAreaCode"
                    :default-value="row.studentPhone"
                    :params="row"
                    :user-id="row.studentId"
                    :get-api="operationLogsWrite"
                  />
                </template>
                <template v-else-if="col.prop === 'email'">
                  <watchPhoneNumber
                    :default-value="row.email"
                    :params="row"
                    :user-id="row.studentId"
                    :get-api="operationLogsWriteEmail"
                  />
                </template>
                <template
                  v-else-if="
                    ['goodsPrice', 'discountsFee', 'payMoney'].includes(
                      col.prop
                    )
                  "
                >
                  ￥{{ row[col.prop] | filtersMoneyByZero }}
                </template>
                <template
                  v-else-if="['orderTime', 'payTime'].includes(col.prop)"
                >
                  {{ row[col.prop] | filterTime }}
                </template>
                <template v-else-if="col.prop === 'orderStatus'">
                  <div class="orderStatus">
                    <MyStatus
                      v-if="row.orderStatus"
                      :status="orderStatus[row.orderStatus].type"
                    >
                      <span>{{ orderStatus[row.orderStatus].name }}</span>
                    </MyStatus>
                  </div>
                </template>
                <template v-else-if="col.prop === 'paymentType'">
                  {{ row.paymentType | getOptionsValue(paymentType_options) }}
                </template>
                <template v-else>
                  {{ row[col.prop] || '--' }}
                </template>
              </template>
            </el-table-column>
          </template>
          <!-- <el-table-column prop="transactionId" label="支付流水号" width="180" /> -->
        </el-table>
        <div class="pagination">
          <el-pagination
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
    </div>
    <div slot="footer" class="ss-material-box-bottom">
      <el-button type="primary" size="small" @click="visible = false">
        关闭
      </el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { orderRemindRead, getPurchaseRecordPage } from '@/api/liveRoom/index.js'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import MyStatus from '@/views/live/liveRoomV2/components/MyStatus.vue'
import { userNoPage } from '@/api/addressBookApi'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
import moment from 'moment'
import textShowMore from '@/components/textShowMore/index2.vue'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { liveOperationType } from '@/views/live/columns.js'
import { filtersTextPhone } from '@/utils/index'
import { mapGetters } from 'vuex'
import selectTelEmail from '@/views/live/component/selectTelEmail'
import { setItem, getItem } from '@/utils/localStorage'

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
    MyStatus,
    AppDialog,
    textShowMore,
    watchPhoneNumber,
    selectTelEmail
  },
  data() {
    return {
      // 自定义表头
      allcolumnsSelected: true,
      allcolumnsSelectedIndeterminate: false,
      drag: false,
      loading: false,
      visible: false,
      liveRoomId: '',
      top: '114px',
      list: [],
      currentPage: 1,
      pageSize: 10,
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
      total: 0,
      userArray: [],
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
      columns: [
        {
          label: '学员昵称',
          prop: 'studentName',
          bind: { minWidth: '180' },
          visible: true,
          number: 0
        },
        {
          label: '手机号码',
          prop: 'studentPhone',
          bind: { minWidth: '120' },
          visible: true,
          number: 1
        },
        {
          label: '邮箱',
          prop: 'email',
          bind: { minWidth: '120' },
          visible: true,
          number: 2
        },
        {
          label: '邀请人',
          prop: 'teacherName',
          bind: { 'show-overflow-tooltip': true },
          visible: true,
          number: 3
        },
        {
          label: '购买课程',
          prop: 'goodsName',
          bind: { 'show-overflow-tooltip': true },
          visible: true,
          number: 4
        },
        {
          label: '商品总价',
          prop: 'goodsPrice',
          bind: { align: 'center' },
          visible: true,
          number: 5
        },
        {
          label: '优惠金额',
          prop: 'discountsFee',
          bind: { align: 'center' },
          visible: true,
          number: 6
        },
        {
          label: '实付金额',
          prop: 'payMoney',
          bind: { align: 'center' },
          visible: true,
          number: 7
        },
        {
          label: '下单单号',
          prop: 'orderNo',
          visible: true,
          number: 8
        },
        {
          label: '下单时间',
          prop: 'orderTime',
          bind: { minWidth: '140', align: 'center' },
          visible: true,
          number: 9
        },
        {
          label: '订单状态',
          prop: 'orderStatus',
          bind: { minWidth: '120', align: 'center' },
          visible: true,
          number: 10
        },
        {
          label: '支付时间',
          prop: 'payTime',
          bind: { minWidth: '140', align: 'center' },
          visible: true,
          number: 11
        },
        {
          label: '支付方式',
          prop: 'paymentType',
          visible: true,
          number: 12
        },
        {
          label: '流水号',
          prop: 'transactionId',
          visible: true,
          number: 13
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['paymentType_options'])
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            if (this.openData) {
              this.search = { ...this.search, ...this.openData }
            }
            this.loadUserNoPage()
            this.searchFn()
          })
        }
      },
      deep: true,
      immediate: true
    },
    columns: {
      handler(val) {
        const arr = val.filter(v => v.visible)
        if (arr.length === this.columns.length) {
          this.allcolumnsSelected = true
          this.allcolumnsSelectedIndeterminate = false
        } else {
          this.allcolumnsSelected = false
          this.allcolumnsSelectedIndeterminate = true
        }
        this.$refs.purchaseRecordRef && this.$refs.purchaseRecordRef.doLayout()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 804) / 2 + 'px'
    const columns = JSON.parse(getItem('purchaseRecord_tablecolumns_dialog'))
    if (columns) this.columns = columns
  },
  methods: {
    filtersTextPhone(str) {
      return filtersTextPhone(str)
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    // 限制只能输入英文和数字
    delNumber(e) {
      this.search.phone = e.replace(/[^0-9]/g, '')
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
      this.orderRemindRead()
      this.loading = true
      const params = {
        liveRoomId: this.liveRoomId,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        // studentPhone: this.search.phone,
        studentPhone: this.search.userInfo.value.tel,
        email: this.search.userInfo.value.Email,
        orderStartTime:
          this.search.time && this.search.time.length > 0
            ? this.search.time[0] + ':00'
            : '',
        orderEndTime:
          this.search.time && this.search.time.length > 0
            ? this.search.time[1] + ':59'
            : '',
        orderStatus: this.search.orderStatus,
        teacherId: this.search.teacherId,
        existInviteTeacher: this.search.existInviteTeacher
        // orderStatus: this.search.orderStatus
      }
      getPurchaseRecordPage(params)
        .then(res => {
          console.log(res)
          this.list = res.data.items
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    // 直播间小红点已读
    orderRemindRead() {
      const data = {
        liveRoomId: this.liveRoomId
      }
      orderRemindRead(data)
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const data = {
        liveRoomId: this.liveRoomId,
        userId: params.studentId,
        phoneNum: params.studentPhone,
        operationType: liveOperationType.type5
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    operationLogsWriteEmail(params) {
      const data = {
        liveRoomId: this.liveRoomId,
        userId: params.studentId,
        queryType: 2,
        email: params.email,
        operationType: liveOperationType.type5
      }
      return this.$store.dispatch('im/operationLogsWrite', data)
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.columns.map(v => {
        v.visible = val
      })
      setItem(
        'purchaseRecord_tablecolumns_dialog',
        JSON.stringify(this.columns)
      )
    },
    // 表头操作
    handleCheckedTablecolumnsChange(item) {
      const arr = this.columns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      this.$nextTick(() => {
        this.$refs.purchaseRecordRef && this.$refs.purchaseRecordRef.doLayout()
      })
      setItem(
        'purchaseRecord_tablecolumns_dialog',
        JSON.stringify(this.columns)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.purchaseRecord {
  padding: 20px 20px 0;
  .myTable {
    width: 100%;
    height: 614px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #cbcfd3;
    overflow: hidden;
  }
  .pagination {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: right;
  }
}
.studentInfo {
  display: flex;
  align-items: center;
}
::v-deep {
  .ss-material-box-header-title {
    position: relative;
    width: 100%;
  }
}
.m-l-5 {
  margin-left: 5px;
}
.orderStatus {
  display: inline-block;
}
.search {
  margin-bottom: 5px;
  .searchLabel {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
}
.table-head {
  display: flex;
  justify-content: flex-end;
}
::v-deep {
  .textShowMore {
    width: auto;
  }
}
</style>
