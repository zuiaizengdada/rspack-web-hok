<template>
  <!-- 学员详情弹框 -->
  <el-drawer
    :size="748"
    :visible.sync="visibleDialog"
    v-bind="$attrs"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    v-on="$listeners"
  >
    <div v-if="visible" v-loading="loading" class="drawerBody">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">详情</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div class="drawerContent overflowOuto">
        <el-descriptions :column="4" size="medium" class="detailForm">
          <template v-for="(item) in detail">
            <template v-if="item.show">
              <el-descriptions-item :key="item.key" :span="item.span" :label="item.label" label-class-name="my-label" content-class-name="my-content">
                <template v-if="item.key === 'userPhone'">
                  <watchPhoneNumber :user-id="detailFrom.userId" :default-value="item.value" />
                  <span v-if="!item.value" v-permission="['web:advertising:editPhone', permsList]" class="ImproveMobile" @click="openEditPhone(row)">完善手机号码</span>
                </template>
                <template v-else-if="item.key === 'campaignName'">
                  <div v-if="detailFrom.completeId === '0'" class="detailFormValue">
                    客户
                  </div>
                  <span v-else style="color: #409eff;cursor: pointer;" @click="openCustomerServiceDetail(detailFrom)">{{ detailFrom.completeUserName }}</span>
                </template>
                <template v-else-if="item.key === 'visitUrl'">
                  <textShowMore ref="textShowMore" :text="item.value" :line-clamp="3" />
                </template>
                <template v-else-if="item.key === 'refundFlag'">
                  <AppStatus :status="{1: 'error', 2: 'success'}[item.value]">
                    <span>{{ refundFlagStatus[item.value] }}</span>
                  </AppStatus>
                </template>
                <template v-else>
                  <AppIconClipboard v-if="item.copy && item.value" :src="item.render ? item.render(item.value) : item.value">
                    {{ item.render ? item.render(item.value) : item.value }}
                  </AppIconClipboard>
                  <div v-else class="detailFormValue">
                    {{ item.render ? item.render(item.value) : item.value }}
                  </div>
                </template>
              </el-descriptions-item>
            </template>
          </template>
        </el-descriptions>
      </div>
    </div>
    <editPhoneModal ref="openPhoneModal" @success="getDetail()" />
    <customerServiceDetail ref="openCustomerServiceDetail" />
  </el-drawer>
</template>

<script>
import editPhoneModal from './editPhoneModal.vue'
import textShowMore from '@/components/textShowMore'
import customerServiceDetail from './customerServiceDetail.vue'
import watchPhoneNumber from '../../components/watchPhoneNumber.vue'
import { filtersMoneyByZero } from '@/filters/index'
import { refundFlagStatus } from './columns.js'
import { visitorOrderDetail, getBindPhoneCode } from '@/api/deliver/advertising'
import AppIconClipboard from '@/components/AppIconClipboard'
import AppStatus from '@/components/AppStatus'
export default {
  components: {
    editPhoneModal,
    customerServiceDetail,
    textShowMore,
    watchPhoneNumber,
    AppIconClipboard,
    AppStatus
  },
  filters: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      refundFlagStatus,
      loading: false,
      detail: [
        { label: '报名编号', value: '', show: true, span: 2, key: 'visitorOrderCode' },
        { label: '渠道', value: '', show: true, span: 2, key: 'channelSourceName' },
        { label: '邀请码', value: '', show: true, span: 2, key: 'promoterCode', copy: true },
        { label: '邀请人', value: '', show: true, span: 2, key: 'promoterUserName' },
        { label: '推广账号', value: '', show: true, span: 4, key: 'accountId', copy: true },
        { label: '推广计划', value: '', show: true, span: 4, key: 'campaignId', copy: true },
        { label: '推广创意', value: '', show: true, span: 4, key: 'creativityId', copy: true },
        { label: '支付流水号', value: '', show: true, span: 4, key: 'transactionId', copy: true },
        { label: '支付金额', value: '', show: true, span: 2, key: 'payerTotal', render: (row) => { return '￥' + filtersMoneyByZero(row) } },
        { label: '支付时间', value: '', show: true, span: 2, key: 'payTime' },
        { label: '课程名称', value: '', show: true, span: 2, key: 'goodsName' },
        { label: '课程ID', value: '', show: true, span: 2, key: 'goodsId' },
        { label: '是否退款', value: '', show: true, span: 2, key: 'refundFlag', render: (row) => { return { 1: '未退款', 2: '已退款' }[row] } },
        { label: '退款日期', value: '', show: true, span: 2, key: 'refundTime' },
        { label: '退款金额', value: '', show: true, span: 4, key: 'refundFee', render: (row) => { return '￥' + filtersMoneyByZero(row) } },
        { label: '手机号码', value: '', show: true, span: 2, key: 'userPhone' },
        { label: '完善人员', value: '', show: true, span: 2, key: 'campaignName' },
        { label: '是否上报', value: '', show: true, span: 4, key: 'reportFlag', render: (row) => { return { 1: '否', 2: '是' }[row] } },
        { label: '是否同步订单', value: '', show: true, span: 2, key: 'syncOrderFlag', render: (row) => { return { 1: '否', 2: '是' }[row] } },
        { label: '获课订单ID', value: '', show: true, span: 2, key: 'orderNo', copy: true },
        { label: '用户访问地址', value: '', show: true, span: 4, key: 'visitUrl' }
      ],
      detailFrom: {},
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getDetail()
      } else {
        this.detail.map(v => {
          v.value = ''
        })
      }
    }
  },
  mounted() {
  },
  methods: {
    // 点击关闭
    close() {
      this.$emit('update:visible', false)
    },
    // 获取学员详情数据
    getDetail() {
      this.loading = true
      visitorOrderDetail(this.row.visitorOrderId).then(res => {
        this.detailFrom = res.data
        this.detail.map(v => {
          res.data[v.key] && (v.value = res.data[v.key])
          if (v.key === 'campaignName') {
            v.show = Boolean(res.data.userPhone)
            return
          }
          if (v.key === 'userPhone' && !res.data.userPhone) {
            v.span = 4
            return
          } else if (v.key === 'userPhone' && res.data.userPhone) {
            v.span = 2
          }
        })
        this.$nextTick(() => {
          this.$refs?.textShowMore[0] && this.$refs.textShowMore[0].refresh()
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击打开完善手机号弹框
    openEditPhone(row) {
      this.$refs.openPhoneModal && this.$refs.openPhoneModal.open(row)
    },
    // 点击打开客服弹框
    openCustomerServiceDetail(row) {
      this.$refs.openCustomerServiceDetail && this.$refs.openCustomerServiceDetail.open(row)
    },
    // 点击获取用户手机号
    getPhone(row) {
      console.log(row)
      return getBindPhoneCode(row)
    }
  }
}
</script>

<style lang='scss' scoped>
.drawerBody {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    background: #FFFFFF;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #f2f2f2;
    color: #353535;
    font-size: 16px;
    font-weight: bold;
    .ss-material-box-header-title {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .close {
    color: #b2b2b2;
    margin-left: auto;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .drawerContent {
    padding: 20px;
    flex: 1 0 0;
    .detailForm {
      padding: 20px;
      background: #F2F9FF;
      border-radius: 8px;
      display: flex;
      flex-wrap: wrap;

    }
    .tabView {
      padding: 0 20px;
    }
  }
}
.btn_close {
  transform: rotate(180deg);
}
::v-deep {
  .el-descriptions__body {
    background-color: transparent;
    .my-label {
      width: 112px;
      text-align: right;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 24px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
    }
    .my-content {
      padding-top: 1px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 24px;
      display: flex;
      flex-wrap: wrap;
    }
    .el-descriptions-item__label:not(.is-bordered-label) {
      margin-right: 8px;
    }
  }
  .el-descriptions--medium:not(.is-bordered) .el-descriptions-item__cell {
    padding-bottom: 16px;
  }
}
.detailFormValue {
  flex: 1 0 0;
  display: flex;
  .text {
    font-size: 14px;
    &::before{
      content: '';
      float: right;
      width: 0;
      height: 100%;
      margin-bottom: -19px;
    }
  }
  .jyfwbtn {
    float: right;
    clear: both;
    cursor: pointer;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #0C6FFF;
    line-height: 16px;
  }
  .showMore {
    /* 设置多行文本溢出省略 */
    display: -webkit-box;
    /* 默认最多显示3行 */
    -webkit-line-clamp: 3;
    overflow: hidden;
    -webkit-box-orient: vertical;
    font-size: 14px;
    &::before{
      content: '';
      float: right;
      width: 0;
      height: 100%;
      margin-bottom: -19px;
    }
  }
}
.ImproveMobile {
  width: 88px;
  height: 24px;
  background: #0C6FFF;
  border-radius: 2px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #FFFFFF;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
}
::v-deep {
  .el-icon-document-copy {
    margin-left: 4px!important;
  }
}
</style>
