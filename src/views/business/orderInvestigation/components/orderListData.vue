<template>
  <div v-loading="loading" class="page_wrap">
    <div class="content">
      <MPageLayout
        ref="MPageLayout"
        :slot-arr="slotArr"
        :current-page="config.pageIndex"
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
        <div slot="complementStatus" slot-scope="scope">
          <p v-if="scope.row.complementStatus === 1" class="red-cls">待人工补偿</p>
          <p v-if="scope.row.complementStatus === 2" class="success-cls">人工补偿成功</p>
          <p v-if="scope.row.complementStatus === 3" class="success-cls">系统补偿成功</p>
          <p v-if="scope.row.complementStatus === 4" class="sys-cls">系统补偿中</p>
        </div>
        <div slot="complementType" slot-scope="scope">
          <p v-if="scope.row.complementType === 0">无</p>
          <p v-if="scope.row.complementType === 1">系统</p>
          <p v-if="scope.row.complementType === 2">人工</p>
        </div>
        <div slot="postReceiver" slot-scope="scope">
          <p>{{ scope.row.postReceiver?scope.row.postReceiver:'无' }}</p>
        </div>
        <div slot="postTel" slot-scope="scope">
          <p>{{ scope.row.postTel?scope.row.postTel:'无' }}</p>
        </div>
        <div slot="updateBy" slot-scope="scope">
          <p>{{ scope.row.updateBy?scope.row.updateBy:'无' }}</p>
        </div>
        <div slot="updateTime" slot-scope="scope">
          <p>{{ scope.row.updateTime?scope.row.updateTime:'无' }}</p>
        </div>

        <div slot="action" slot-scope="scope">
          <el-button v-if="scope.row.complementStatus === 1 || scope.row.complementStatus === 4" type="text" @click="toComplete(scope.row)">补齐订单</el-button>
        </div>
      </MPageLayout>
    </div>
  </div>
</template>

<script>
import {
  getOrderInvestigationPage
} from '@/api/business/financial'
import { mapGetters } from 'vuex'
export default {
  name: 'OrderListData',
  components: {

  },
  props: {

  },
  data() {
    return {
      row: {},
      loading: false,
      orderTimeArray: [],
      search: {
        orderNo: '',
        channelSource: 1, // 渠道来源
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页条数
        endTime: '', // 订单结束时间
        shopId: '', // 店铺ID
        createTime: '', // 订单开始时间
        thirdShopName: '', // 第三方店铺名称
        expertId: '', // 达人ID
        expertName: '', // 达人昵称
        operateUserId: '' // 员工
      },
      slotArr: ['action', 'footer', 'complementStatus', 'complementType', 'postReceiver', 'postTel', 'updateBy', 'updateTime'],
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          { prop: 'channelSourceName', label: '渠道', type: 'text', visible: true, disable: true },
          { prop: 'shopName', label: '店铺名', width: 160, type: 'text', visible: true, disable: true },
          { prop: 'orderNo', label: '第三方订单号', width: 180, align: 'center', type: 'text', visible: true, disable: true },
          { prop: 'orderSourceName', label: '订单类型', type: 'text', visible: true },
          { prop: 'orderStatusName', label: '订单状态', type: 'text', visible: true },
          { prop: 'thirdOrderStatusName', label: '第三方订单状态', width: 160, type: 'text', visible: true },
          { prop: 'orderCreateTime', label: '创建时间', width: 160, type: 'text', visible: true },
          { prop: 'goodsName', label: '第三方商品名称', width: 160, type: 'text', visible: true },
          { prop: 'productId', label: '第三方商品ID', width: 160, type: 'text', visible: true },
          { prop: 'goodsAmount', label: '商品金额', width: 160, type: 'text', visible: true },
          { prop: 'payTime', label: '支付时间', width: 160, type: 'text', visible: true },
          { prop: 'payableAmount', label: '应付金额', width: 100, align: 'center', type: 'text', visible: true },
          { prop: 'transactionId', label: '交易流水号', width: 160, align: 'center', type: 'text', visible: true },
          { prop: 'payerTotal', label: '实付金额', type: 'text', visible: true },
          { prop: 'thirdAfterSaleName', label: '售后状态', type: 'text', visible: true },
          { prop: 'refundTime', label: '退款时间', width: 160, type: 'text', visible: true },
          { prop: 'refundAmount', label: '退款金额', type: 'text', visible: true },
          { prop: 'expertId', label: '达人ID', type: 'text', visible: true },
          { prop: 'expertName', label: '达人昵称', type: 'text', visible: true },
          { prop: 'liveRoomId', label: '直播间id', type: 'text', visible: true },
          // { prop: 'carrXXX_id', label: 'carrXXX_id', type: 'text', visible: true },
          { prop: 'operateUserName', label: '运营人员', type: 'text', visible: true },
          { prop: 'operateDeptName', label: '部门', type: 'text', visible: true },
          // { prop: 'refundAmount', label: '商品关联老师', type: 'text', visible: true },
          { prop: 'orderClassificationName', label: '付费/免费', width: 100, type: 'text' }
        ],
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        pageIndex: 1,
        total: 0
      }

    }
  },
  computed: {
    ...mapGetters(['goodsType_obj', 'channelSourceType'])
  },
  watch: {
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
  },
  activated() {
  },
  methods: {
    toComplete(row) {
      this.row = row
      this.$refs.completeModal.show(row)
    },
    returnChannelName(value) {
      let str = ''
      this.channelSourceType.some(item => {
        if (item.value === value) {
          str = item.label
        }
      })
      return str
    },
    formLastLoadData() {
      this.loadData(this.search)
    },
    loadData(search) {
      this.search = search
      console.log('%%%%%%%%%%%%%%%%%:', search)
      getOrderInvestigationPage(search).then(res => {
        console.log('rrrrrrrrrr:', res)
        if (res.code === 1) {
          this.config.pageIndex = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.tableData = res.data.items
          this.config.total = res.data.total
        }
      })
    },
    handleCurrentChange(val) {
      this.search.pageIndex = val
      this.loadData(this.search)
    },
    handleSizeChange(val) {
      this.search.pageSize = val
      this.loadData(this.search)
    }
  }
}
</script>

    <style scoped lang="scss">
      .page_wrap {
        height: 100%;
        // background-color: #fff;
        ::v-deep .el-table::before {
          height: 0px;
        }
        ::v-deep .customer-table .el-table__fixed-right::before,
        .el-table__fixed::before {
          width: 0;
        }
        .content {
          height: 100%;
          min-height: 580px;
          ::v-deep .tablePage .page_content {
            min-height: 500px;
            padding: 0;
          }
          ::v-deep .el-table--scrollable-y .el-table__body-wrapper {
            min-height: 460px;
          }
          ::v-deep .el-table__body-wrapper .is-scrolling-left {
            min-height: 460px;
          }
        }
      }

      .red-cls {
        color: #F53F3F;
      }
      .success-cls {
        color: #67c23a;
      }
      .sys-cls {
        color: #0C6FFF;
      }
    </style>

