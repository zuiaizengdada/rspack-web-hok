<template>
  <div v-loading="loading" class="page_wrap">
    <div class="content">
      <div class="coupon-data-row flex justify-between">
        <div class="data-row-btn">
          <span
            v-permission="['web:couponManager:Preliminary', permsList]"
            :class="auditStatus === 1 ? 'active' : ''"
            @click="changeAuditStatus(1)"
          >初审优惠券</span>
          <span
            v-permission="['web:couponManager:Reexamine', permsList]"
            :class="auditStatus === 2 ? 'active' : ''"
            @click="changeAuditStatus(2)"
          >复审优惠券</span>
          <span
            v-permission="['web:couponManager:Reexamine', permsList]"
            :class="auditStatus === 3 ? 'active' : ''"
            @click="changeAuditStatus(3)"
          >审核驳回</span>
          <span
            v-permission="['web:couponManager:Reexamine', permsList]"
            :class="auditStatus === 5 ? 'active' : ''"
            @click="changeAuditStatus(5)"
          >审核通过</span>
        </div>
        <div>
          <el-button type="primary" size="small" @click="openExaminneMangeDialg">审核人员管理</el-button>
        </div>
      </div>
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
        <div slot="couponName" slot-scope="scope">
          <div>
            <p class="goods-title-cls">{{ scope.row.couponName }}</p>
            <p
              class="goods-blue-cls"
              style="cursor: pointer; width: 100%; float: left"
            >
              <span
                style="float: left"
                @click="toDetail(scope.row)"
              >ID:{{ scope.row.couponNo }}</span>
              <img
                v-clipboard:copy="scope.row.couponNo"
                v-clipboard:success="clipboardSuccess"
                title="复制订单号"
                style="
                  float: left;
                  margin-top: 4px;
                  width: 14px;
                  height: 14px;
                  font-style: normal;
                  margin-left: 10px;
                "
                src="@/assets/image/coupon/icn_copy.png"
              />
            </p>
            <em
              v-if="scope.row.couponType === 1"
              class="goods-em-cls"
            >商品优惠券</em>
            <em
              v-if="scope.row.couponType === 2"
              class="goods-em-cls"
            >店铺优惠券</em>
            <em
              v-if="scope.row.couponType === 3"
              class="goods-em-cls"
            >直播优惠券</em>
          </div>
        </div>
        <div slot="couponContent" slot-scope="scope">
          <p class="coupon-youhui">{{ scope.row.couponContent }}</p>
          <span
            v-if="scope.row.discountMethod === 1"
            class="coupon-yh-em"
          >指定商品满减券</span>
          <span
            v-if="scope.row.discountMethod === 2"
            class="coupon-yh-em"
          >指定商品直减券</span>
          <span
            v-if="scope.row.discountMethod === 3"
            class="coupon-yh-em"
          >指定商品折扣券</span>
        </div>
        <div slot="couponType" slot-scope="scope">
          <p v-if="scope.row.couponType===1">商品券</p>
          <p v-else-if="scope.row.couponType===3">直播专享券</p>
        </div>
        <div slot="auditStatus" slot-scope="scope">
          <div v-if="scope.row.auditStatus === 1" class="audit-div-cls">
            <img src="@/assets/image/coupon/icn_chushen.png" />
            <p>待初审</p>
          </div>
          <div
            v-if="scope.row.auditStatus === 2"
            class="audit-div-cls audit-bohui-cls"
          >
            <img src="@/assets/image/coupon/icn_bohui.png" />
            <p>审核驳回</p>
          </div>
          <div
            v-if="scope.row.auditStatus === 3"
            class="audit-div-cls audit-fushen-cls"
          >
            <img src="@/assets/image/coupon/icn_fushen.png" />
            <p>待复审</p>
          </div>
          <div
            v-if="scope.row.auditStatus === 4"
            class="audit-div-cls audit-bohui-cls"
          >
            <img src="@/assets/image/coupon/icn_bohui.png" />
            <p>审核驳回</p>
          </div>
          <div
            v-if="scope.row.auditStatus === 5"
            class="audit-div-cls audit-tongguo-cls"
          >
            <img src="@/assets/image/coupon/icn_check.png" />
            <p>审核通过</p>
          </div>
        </div>

        <div slot="action" slot-scope="scope">
          <el-button
            type="text"
            @click="toDetail(scope.row)"
          >查看详情</el-button>
        </div>
      </MPageLayout>
      <examinneMangeDialg ref="examinneMangeDialgRef" />
    </div>
  </div>
</template>

<script>
import { getCouponAuditPage } from '@/api/marketingTools/coupon.js'
import clipboard from '@/directive/clipboard/index.js'
import examinneMangeDialg from './examinneMangeDialog.vue'
export default {
  name: 'OrderListData',
  components: {
    examinneMangeDialg
  },
  directives: {
    clipboard
  },
  props: {},
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      loading: false,
      auditStatus: 1,
      orderTimeArray: [],
      searchForStart: {
        orderNo: '',
        orderChannel: 1, // 渠道来源
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页条数
        orderEndTime: '', // 订单结束时间
        shopId: '', // 店铺ID
        orderStartTime: '', // 订单开始时间
        thirdShopName: '', // 第三方店铺名称
        expertId: '', // 达人ID
        expertName: '', // 达人昵称
        operateUserId: '' // 员工
      },
      slotArr: [
        'footer',
        'action',
        'couponContent',
        'couponName',
        'auditStatus',
        'couponType'
      ],
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          {
            prop: 'couponName',
            label: '优惠券信息',
            width: 300,
            type: 'slot',
            visible: true,
            disable: true
          },
          {
            prop: 'couponContent',
            label: '优惠券内容',
            type: 'slot',
            visible: true,
            disable: true
          },
          {
            prop: 'couponType',
            label: '优惠券类型',
            type: 'slot',
            visible: true,
            disable: true
          },
          {
            prop: 'createdByName',
            label: '创建人',
            align: 'center',
            type: 'text',
            visible: true,
            disable: true
          },
          {
            prop: 'auditStatus',
            label: '审核状态',
            type: 'slot',
            visible: true
          },
          { prop: 'action', label: '操作', type: 'slot', visible: true }
        ],
        pageSizes: [10, 20, 30, 40, 50, 100],
        pageSize: 10,
        pageIndex: 1,
        total: 0
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  activated() {},
  methods: {
    openExaminneMangeDialg() {
      this.$refs.examinneMangeDialgRef.openDialog()
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    changeAuditStatus(type) {
      this.auditStatus = type
      this.searchForStart.pageIndex = 1
      this.loadData(this.searchForStart)
    },
    toDetail(row) {
      const forSearch = JSON.stringify(this.searchForStart)
      this.$router.push({
        name: 'CouponDataDetail',
        query: {
          couponNo: row.couponNo,
          fromTab: 'couponExamine',
          dataType: this.auditStatus,
          search: forSearch,
          prevPath: this.$route.path
        }
      })
    },
    loadData(search) {
      this.searchForStart = { ...search }
      let auditStautsArray = []
      if (this.auditStatus === 3) {
        auditStautsArray = [2, 4]
      } else if (this.auditStatus === 2) {
        auditStautsArray = [3]
      } else {
        auditStautsArray = [this.auditStatus]
      }
      const params = {
        pageIndex: this.searchForStart.pageIndex,
        pageSize: this.searchForStart.pageSize,
        couponType: this.searchForStart.couponType,
        auditStatus: auditStautsArray,
        createdBy: this.searchForStart.createdBy,
        claimStartTime: this.searchForStart.claimStartTime,
        claimEndTime: this.searchForStart.claimEndTime,
        couponName:
          this.searchForStart.orderLabel === 'couponName'
            ? this.searchForStart.orderValue
            : '',
        couponNo:
          this.searchForStart.orderLabel === 'couponId'
            ? this.searchForStart.orderValue
            : ''
      }
      getCouponAuditPage(params).then(res => {
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
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  padding-top: 20px;
  border-top: 1px solid #e7e7e7;
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
      padding: 0 !important;
      min-height: 0 !important;
      margin-top: 20px;
    }
    ::v-deep .tablePage .my-table {
      width: 100%;
      margin: 0 !important;
    }
    ::v-deep .tablePage .page_content {
      width: 100%;
      padding: 0 !important;
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

.coupon-data-row {
  width: 100%;
  height: 40px;
  .data-row-btn {
    float: left;
    padding: 3px;
    height: 36px;
    background: #f3f3f3;
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
      color: #0c6fff;
    }
  }
  .data-row-tool {
    float: right;
  }
}
.audit-div-cls {
  padding: 3px 10px;
  border-radius: 12px;
  background: #fff2e6;
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
    color: #ff7d00;
    font-size: 12px;
  }
}
.audit-bohui-cls {
  background: #feecec;
  p {
    color: #f53f3f;
  }
}
.audit-fushen-cls {
  background: #fff2cc;
  p {
    color: #ffc619;
  }
}
.audit-tongguo-cls {
  background: #e6f7ea;
  p {
    color: #00b42a;
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
  color: #0c6fff;
}
.goods-em-cls {
  font-style: normal;
  font-size: 12px;
  color: #ff7d00;
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
