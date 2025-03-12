<template>
  <div v-loading="loading" class="page_wrap">
    <div class="content">
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
      >
        <div slot="complementStatus" slot-scope="scope">
          <p v-if="scope.row.complementStatus === 1" class="red-cls">
            待人工补偿
          </p>
          <p v-if="scope.row.complementStatus === 2" class="success-cls">
            人工补偿成功
          </p>
          <p v-if="scope.row.complementStatus === 3" class="success-cls">
            系统补偿成功
          </p>
          <p v-if="scope.row.complementStatus === 4" class="sys-cls">
            系统补偿中
          </p>
        </div>
        <div slot="complementType" slot-scope="scope">
          <p v-if="scope.row.complementType === 0">无</p>
          <p v-if="scope.row.complementType === 1">系统</p>
          <p v-if="scope.row.complementType === 2">人工</p>
        </div>
        <div slot="postReceiver" slot-scope="scope">
          <p>{{ scope.row.postReceiver ? scope.row.postReceiver : '无' }}</p>
        </div>
        <div slot="postTel" slot-scope="scope">
          <p>
            {{
              scope.row.phone
                ? scope.row.phoneAreaCode
                  ? '(+' + scope.row.phoneAreaCode + ')' + scope.row.phone
                  : ''
                : '无'
            }}
          </p>
        </div>
        <div slot="email" slot-scope="scope">
          <p>{{ scope.row.email ? scope.row.email : '无' }}</p>
        </div>
        <div slot="updateBy" slot-scope="scope">
          <p>{{ scope.row.updateBy ? scope.row.updateBy : '无' }}</p>
        </div>
        <div slot="updateTime" slot-scope="scope">
          <p>{{ scope.row.updateTime ? scope.row.updateTime : '无' }}</p>
        </div>

        <div slot="action" slot-scope="scope">
          <el-button
            v-if="
              scope.row.complementStatus === 1 ||
                scope.row.complementStatus === 4
            "
            type="text"
            @click="toComplete(scope.row)"
          >补齐订单</el-button>
        </div>
      </MPageLayout>
    </div>
    <CompleteModal ref="completeModal" @formLastLoadData="formLastLoadData" />
  </div>
</template>

<script>
import { getComplementOrderPage } from '@/api/business'
import { mapGetters } from 'vuex'
import CompleteModal from './completeModal.vue'
export default {
  name: 'OrderList',
  components: {
    CompleteModal
  },
  props: {},
  data() {
    return {
      row: {},
      loading: false,
      search: {
        orderTimeArray: [],
        operateTimeArray: [],
        orderId: '',
        channelSource: '', // 渠道来源
        current: 1, // 当前页
        size: 10, // 每页条数
        complementStatus: [1, 4],
        complementType: '', // 补齐类型
        endTime: '', // 操作结束时间
        orderEndTime: '', // 订单结束时间
        orderStartTime: '', // 订单开始时间
        shopId: '', // 店铺ID
        startTime: '', // 操作开始时间
        thirdShopName: '', // 第三方店铺名称
        updateBy: '' // 操作人
      },
      slotArr: [
        'action',
        'footer',
        'complementStatus',
        'complementType',
        'postReceiver',
        'postTel',
        'email',
        'updateBy',
        'updateTime'
      ],
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          {
            prop: 'channelSourceName',
            label: '渠道',
            type: 'text',
            visible: true,
            disable: true
          },
          {
            prop: 'shopName',
            label: '店铺名',
            type: 'text',
            visible: true,
            disable: true
          },
          {
            prop: 'orderId',
            label: '订单号',
            width: 160,
            align: 'center',
            type: 'text',
            visible: true,
            disable: true
          },
          {
            prop: 'trasactionId',
            label: '交易单号',
            width: 160,
            align: 'center',
            type: 'text',
            visible: true,
            disable: true
          },
          {
            prop: 'virtualPhone',
            label: '虚拟号码',
            width: 160,
            align: 'center',
            type: 'text',
            visible: true,
            disable: true
          },
          {
            prop: 'goodsName',
            label: '第三方商品名',
            width: 180,
            align: 'center',
            type: 'text',
            visible: true,
            disable: true
          },
          {
            prop: 'complementStatus',
            label: '补齐',
            width: 120,
            align: 'center',
            type: 'slot',
            visible: true
          },
          {
            prop: 'orderTime',
            label: '订单生成时间',
            width: 160,
            type: 'text',
            visible: true
          },
          {
            prop: 'errorMsg',
            label: '错误原因',
            width: 220,
            align: 'center',
            type: 'text',
            visible: true
          },
          {
            prop: 'postReceiver',
            label: '买家姓名',
            type: 'slot',
            visible: true
          },
          {
            prop: 'postTel',
            label: '手机号',
            width: 160,
            type: 'slot',
            visible: true
          },
          {
            prop: 'email',
            label: '邮箱号',
            width: 160,
            type: 'slot',
            visible: true
          },
          { prop: 'updateBy', label: '操作人', type: 'slot', visible: true },
          {
            prop: 'complementType',
            label: '补齐类型',
            type: 'slot',
            visible: true
          },
          {
            prop: 'updateTime',
            label: '操作时间',
            width: 160,
            type: 'slot',
            visible: true
          },
          {
            prop: 'action',
            label: '操作',
            width: 100,
            type: 'slot',
            fixed: 'right'
          }
        ],
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters(['goodsType_obj', 'channelSourceType'])
  },
  watch: {},
  created() {
    this.$store.dispatch('option/getChannelsourceType')
  },
  activated() {},
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
      this.config.currentPage = search.current
      // delete search.orderTimeArray
      // delete search.operateTimeArray
      console.log('%%%%%%%%%%%%%%%%%:', search)
      getComplementOrderPage(search).then(res => {
        console.log('rrrrrrrrrr:', res)
        if (res.code === 1) {
          this.config.current = res.data.current
          this.config.pageSize = res.data.size
          this.config.tableData = res.data.records
          this.config.total = res.data.total
          this.config.tableData.some(item => {
            item.channelSourceName = this.returnChannelName(item.channelSource)
          })
        }
      })
    },
    handleCurrentChange(val) {
      this.search.current = val
      this.loadData(this.search)
    },
    handleSizeChange(val) {
      this.search.size = val
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
  color: #f53f3f;
}
.success-cls {
  color: #67c23a;
}
.sys-cls {
  color: #0c6fff;
}
</style>
