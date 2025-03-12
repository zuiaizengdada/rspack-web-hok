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
        <div slot="channelSource" slot-scope="scope">
          <p>{{ returnChannelName(scope.row.channelSource) }}</p>
        </div>
        <div slot="status" slot-scope="scope">
          <p v-if="scope.row.status === 0" class="success-cls">未入库</p>
          <p v-if="scope.row.status === 1" class="red-cls">已入库</p>
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
          <p>{{ scope.row.phoneAreaCode?'(+'+scope.row.phoneAreaCode+')':'' }} {{ scope.row.postTel?scope.row.postTel:'无' }}</p>
        </div>
        <div slot="updateBy" slot-scope="scope">
          <p>{{ scope.row.updateBy?scope.row.updateBy:'无' }}</p>
        </div>
        <div slot="updateTime" slot-scope="scope">
          <p>{{ scope.row.updateTime?scope.row.updateTime:'无' }}</p>
        </div>
      </MPageLayout>
    </div>
  </div>
</template>

<script>
import {
  orderUnAssociateList
} from '@/api/business'
import { mapGetters } from 'vuex'
export default {
  name: 'OrderList',
  components: {
  },
  props: {

  },
  data() {
    return {
      row: {},
      loading: false,
      search: {
        orderId: '',
        channelSource: '', // 渠道来源
        current: 1, // 当前页
        size: 10, // 每页条数
        status: '',
        orderEndTime: '', // 订单结束时间
        orderStartTime: '', // 订单开始时间
        shopId: '', // 店铺ID
        thirdShopName: '' // 第三方店铺名称
      },
      slotArr: ['footer', 'channelSource', 'postTel', 'status'],
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          { prop: 'channelSource', label: '渠道', type: 'slot', visible: true, disable: true },
          { prop: 'shopName', label: '店铺名', type: 'text', visible: true, disable: true },
          { prop: 'orderId', label: '订单号', width: 160, align: 'center', type: 'text', visible: true, disable: true },
          { prop: 'status', label: '入库状态', width: 120, align: 'center', type: 'slot', visible: true },
          { prop: 'orderTime', label: '订单生成时间', width: 160, type: 'text', visible: true },
          { prop: 'productName', label: '第三方商品名', width: 200, align: 'center', type: 'text', visible: true },
          { prop: 'productId', label: '第三方商品ID', width: 160, type: 'text', visible: true },
          { prop: 'postReceiver', label: '买家姓名', type: 'text', visible: true },
          { prop: 'postTel', label: '手机号', width: 180, type: 'slot', visible: true },
          { prop: 'email', label: '邮箱号码', type: 'text', visible: true }
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
      // delete search.orderTimeArray
      // delete search.operateTimeArray
      console.log('%%%%%%%%%%%%%%%%%:', search)
      orderUnAssociateList(search).then(res => {
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
    color: #F53F3F;
  }
  .success-cls {
    color: #67c23a;
  }
  .sys-cls {
    color: #0C6FFF;
  }
</style>
