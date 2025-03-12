<template>
  <div v-loading="loading" class="page_wrap">
    <el-button type="primary" @click="insertAllocation">新增</el-button>
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
        <div slot="action" slot-scope="scope">
          <el-button type="text" @click="updateData(scope.row)">修改</el-button>
        </div>
      </MPageLayout>
      <insertOrUpdate ref="insertOrUpdate" :insert-or-edit="insertOrEdit" @success="submitSuccess" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDistributeRulePage } from '@/api/system/dataConfiguration.js'
import insertOrUpdate from '@/views/system/dataConfiguration/components/insertOrUpdate'
export default {
  name: 'BrushingOrdersData',
  components: {
    insertOrUpdate
  },
  directives: {
  },
  props: {

  },
  data() {
    return {
      insertOrEdit: false,
      permsList: this.$route.meta.permsList || [],
      loading: false,
      auditStatus: 1,
      orderTimeArray: [],
      searchForStart: {
        orderNo: '',
        pageIndex: 1, // 当前页
        pageSize: 10 // 每页条数
      },
      slotArr: ['footer', 'action', 'orderChannel'],
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          { prop: 'channelName', label: '渠道', type: 'text', visible: true, disable: true },
          { prop: 'shopName', label: '店铺名称', type: 'text', visible: true, disable: true },
          { prop: 'shopId', label: '店铺ID', align: 'center', type: 'text', visible: true, disable: true },
          { prop: 'expertName', label: '默认归属达人昵称', type: 'text', visible: true },
          { prop: 'expertId', label: '默认归属达人ID', type: 'text', visible: true },
          { prop: 'operateName', label: '默认归属人员', type: 'text', visible: true },
          { prop: 'action', label: '操作', type: 'slot', visible: true }
        ],
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        pageIndex: 1,
        total: 0
      }

    }
  },
  computed: {
    ...mapGetters(['channelSourceType'])
  },
  watch: {
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
  },
  activated() {
  },
  methods: {
    insertAllocation() {
      this.$refs.insertOrUpdate.form = {
        id: '',
        expertChannel: '',
        shopId: '',
        expertId: ''
      }
      this.insertOrEdit = false
      this.$refs.insertOrUpdate.visibleFlag = true
    },
    submitSuccess() {
      this.$refs.insertOrUpdate.visibleFlag = false
      this.loadData(this.searchForStart)
    },
    updateData(row) {
      this.insertOrEdit = true
      this.$refs.insertOrUpdate.form = {
        id: row.id,
        expertChannel: row.channelCode,
        shopId: row.shopId,
        expertId: row.expertId,
        operateName: row.operateName
      }
      this.$refs.insertOrUpdate.visibleFlag = true
      this.$refs.insertOrUpdate.getShopListByChannel()
      this.$refs.insertOrUpdate.getDarenData()
    },
    loadData(search) {
      // this.searchForStart = { ...search }
      this.searchForStart = { ...search }
      console.log('this.searchForStart::', this.searchForStart)
      const params = {
        pageIndex: this.searchForStart.pageIndex,
        pageSize: this.searchForStart.pageSize,
        shopId: ''
      }
      getDistributeRulePage(params).then(res => {
        console.log('sseeesss:::::::>', res)
        if (res.code === 1) {
          this.config.pageIndex = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.tableData = res.data.items
          this.config.total = res.data.total
        }
      })
    },
    handleCurrentChange(val) {
      this.searchForStart.pageIndex = val
      this.loadData(this.searchForStart)
    },
    handleSizeChange(val) {
      this.searchForStart.pageSize = val
      this.loadData(this.searchForStart)
    }
  }
}
</script>

    <style scoped lang="scss">
      .page_wrap {
        height: 100%;
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
          ::v-deep .tablePage .page_header {
            padding: 0!important;
            min-height: 0!important;
            margin-top: 20px;
          }
          ::v-deep .tablePage .my-table {
            width: 100%;
            margin: 0!important;
          }
          ::v-deep .tablePage .page_content{
            width: 100%;
            padding: 0!important;
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

      .coupon-data-row {
        width: 100%;
        height: 40px;
        .data-row-btn {
            float: left;
            padding: 3px;
            height: 36px;
            background: #F3F3F3;
            border-radius: 4px;
            span {
                width: 90px;
                text-align: center;
                height: 30px;
                line-height: 30px;
                color: #333;
                display: inline-block;
                cursor: pointer;
                font-size: 14px;
            }
            span.active {
                background: #fff;
                color: #0C6FFF;
            }
        }
        .data-row-tool {
            float: right;
        }
    }
    .audit-div-cls {
  padding: 3px 10px;
  border-radius: 12px;
  background: #FFF2E6;
  display: inline-block;
  img {
    float: left;
    width: 16px;
    height: 16px;
    margin-top: 4px;
    margin-right: 5px;
  }
  p {
    float: left;
    color: #FF7D00;
    font-size: 12px;
  }
  }
  .audit-bohui-cls {
  background: #FEECEC;
  p {
    color: #F53F3F;
  }
  }
  .audit-fushen-cls {
  background: #FFF2CC;
  p {
    color: #FFC619;
  }
  }
  .audit-tongguo-cls {
  background: #E6F7EA;
  p {
    color: #00B42A;
  }
  }
  .goods-title-cls {
  color: #161616;
  font-size: 16px;
  margin-bottom: 5px;
  white-space: pre-line; /*允许换行*/
  overflow: hidden;
  text-overflow: ellipsis; /*省略号*/
  display: -webkit-box;
  -webkit-box-orient: vertical; /*行向垂直排列*/
  -webkit-line-clamp: 2; /*限制2行*/
  }
  .goods-blue-cls {
  font-size: 12px;
  color: #0C6FFF;
  }
  .goods-em-cls {
  font-style: normal;
  font-size: 12px;
  color: #FF7D00;
  }
  .coupon-youhui {
  color: #161616;
  font-size: 14px;
  }
  .coupon-yh-em {
  font-size: 12px;
  color: #999;
  }
    </style>

