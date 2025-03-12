<template>
  <div v-loading="loading" class="page_wrap">
    <div class="content">
      <div class="coupon-data-row">
        <div class="data-row-btn">
          <span
            v-permission="['web:couponManager:MyCoupon', permsList]"
            :class="couponType === 0 ? 'active' : ''"
            @click="changeCouponType(0)"
          >我创建的</span>
          <span
            v-permission="['web:couponManager:MyManager', permsList]"
            :class="couponType === 1 ? 'active' : ''"
            @click="changeCouponType(1)"
          >我管理的</span>
        </div>
      </div>
      <MPageLayout
        ref="MPageLayout"
        :slot-arr="slotArr"
        :header-cell-style="{
          background: '#EFF2F6',
          padding: '9px 0',
          color: '#333',
          'font-weight': 700,
          'letter-spacing': '1px'
        }"
        :class="{ 'zb-table': true, 'el-table-null': !config.tableData.length }"
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
          <p v-if="scope.row.couponType === 1">商品券</p>
          <p v-else-if="scope.row.couponType === 3">直播专享券</p>
        </div>
        <div slot="issueCount" slot-scope="scope">
          <p>{{ scope.row.claimedCount }} / {{ scope.row.issueCount }}</p>
        </div>
        <div slot="claimStartTime" slot-scope="scope">
          <p class="time-line-p">
            <em>领</em>{{ scope.row.claimStartTime }} -
            {{ scope.row.claimEndTime }}
          </p>
          <p v-if="scope.row.expireDays" class="time-line-p">
            <em class="line-em-inp">用</em>领取后
            {{ scope.row.expireDays }} 天有效
          </p>
          <p v-else class="time-line-p">
            <em class="line-em-inp">用</em>{{ scope.row.useStartTime }} -
            {{ scope.row.useEndTime }}
          </p>
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
        <div slot="useStatus" slot-scope="scope">
          <div v-if="scope.row.auditStatus === 5">
            <p
              v-if="scope.row.useStatus === 1"
              class="use-status-cls stay-start"
            >
              <em />待开始
            </p>
            <p
              v-if="scope.row.useStatus === 2"
              class="use-status-cls going-now"
            >
              <em />生效中
            </p>
            <p v-if="scope.row.useStatus === 3" class="use-status-cls">
              <em />已过期
            </p>
            <p v-if="scope.row.useStatus === 4" class="use-status-cls zuofei">
              <em />已作废
            </p>
          </div>
          <p v-else>无</p>
        </div>
        <div slot="action" slot-scope="scope">
          <el-button type="text" @click="toDetail(scope.row)">详情</el-button>
          <el-button type="text" @click="toCopy(scope.row)">复制</el-button>
          <el-button
            v-if="
              couponType === 0 &&
                (scope.row.auditStatus === 4 || scope.row.auditStatus === 2)
            "
            type="text"
            @click="toEdit(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="
              scope.row.auditStatus === 5 &&
                scope.row.useStatus !== 3 &&
                scope.row.useStatus !== 4
            "
            type="text"
            style="color: #f53f3f"
            @click="toCancel(scope.row)"
          >作废</el-button>
        </div>
      </MPageLayout>
    </div>
    <el-dialog title="确认作废" :visible.sync="cancelDialog" width="30%">
      <span>请确认是否作废【{{ nowCancelObj.couponName }}】该优惠券</span>
      <p class="tips-red-cls">
        注意：作废操作将影响到优惠券的领取和展示，请确认
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          @click="sureToCancel"
        >确 定</el-button>
        <el-button size="small" @click="cancelDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import clipboard from '@/directive/clipboard/index.js'
import { getCouponByPage, couponDiscard } from '@/api/marketingTools/coupon.js'
export default {
  name: 'OrderListData',
  components: {},
  directives: {
    clipboard
  },
  props: {},
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      cancelDialog: false,
      nowCancelObj: {},
      row: {},
      couponType: 0,
      loading: false,
      orderTimeArray: [],
      searchForStart: {
        orderLabel: 'couponName',
        orderValue: '',
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页条数
        couponName: '', // 优惠券名称
        claimEndTime: '',
        claimStartTime: '',
        couponNo: '', // 优惠券ID
        couponType: '',
        dataType: 0,
        discountMethod: '',
        useStatus: ''
      },
      slotArr: [
        'action',
        'footer',
        'couponName',
        'couponContent',
        'couponType',
        'issueCount',
        'auditStatus',
        'useStatus',
        'claimStartTime'
      ],
      config: {
        tableData: [], // 'show-overflow-tooltip': true,
        tableColumns: [
          {
            prop: 'couponName',
            label: '优惠券信息',
            width: 240,
            type: 'slot',
            visible: true,
            disable: true
          },
          {
            prop: 'couponContent',
            label: '优惠内容',
            width: 160,
            type: 'slot',
            visible: true,
            disable: true
          },
          {
            prop: 'couponType',
            label: '优惠券类型',
            type: 'slot',
            width: 160,
            align: 'center',
            visible: true,
            disable: true
          },
          {
            prop: 'createdByName',
            label: '创建人',
            type: 'text',
            align: 'center',
            visible: true,
            disable: true
          },
          {
            prop: 'issueCount',
            label: '领取量/发放量',
            width: 160,
            align: 'center',
            type: 'slot',
            visible: true
          },
          {
            prop: 'auditStatus',
            label: '审核状态',
            width: 180,
            align: 'center',
            type: 'slot',
            visible: true
          },
          {
            prop: 'useStatus',
            label: '状态',
            width: 80,
            type: 'slot',
            align: 'center',
            visible: true
          },
          {
            prop: 'claimStartTime',
            label: '领取/使用时间',
            width: 350,
            type: 'slot',
            visible: true
          },
          {
            prop: 'writeOffCount',
            label: '已使用',
            align: 'center',
            type: 'text',
            visible: true
          },
          { prop: 'action', label: '操作', width: 180, type: 'slot' }
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
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    toDetail(row) {
      this.$router.push({
        name: 'CouponDataDetail',
        query: {
          couponNo: row.couponNo,
          fromTab: 'couponManager',
          dataType: this.couponType,
          search: this.paramsString,
          prevPath: this.$route.name
        }
      })
    },
    toCopy(row) {
      const paramsString = JSON.stringify(this.searchForStart)
      this.$router.push({
        name: 'AddCouponIndex',
        query: {
          couponNo: row.couponNo,
          fromTab: 'couponManager',
          search: paramsString,
          isCopy: 1,
          prevPath: this.$route.path
        }
      })
    },
    toEdit(row) {
      this.$router.push({
        name: 'AddCouponIndex',
        query: { couponNo: row.couponNo, fromTab: 'couponManager' }
      })
    },
    toCancel(row) {
      this.nowCancelObj = row
      this.cancelDialog = true
    },
    sureToCancel() {
      const params = {
        id: this.nowCancelObj.id
      }
      couponDiscard(params).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功！')
          this.cancelDialog = false
          this.loadData(this.searchForStart)
        }
      })
    },
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
    changeCouponType(type) {
      this.couponType = type
      this.searchForStart.pageIndex = 1
      this.loadData(this.searchForStart)
    },
    loadData(search) {
      this.searchForStart = { ...search }
      const params = {
        pageIndex: this.searchForStart.pageIndex,
        pageSize: this.searchForStart.pageSize,
        useStatus: this.searchForStart.useStatus,
        couponType: this.searchForStart.couponType,
        dataType: this.couponType,
        discountMethod: this.searchForStart.discountMethod,
        claimStartTime: this.searchForStart.claimStartTime,
        claimEndTime: this.searchForStart.claimEndTime,
        couponName:
          this.searchForStart.orderLabel === 'couponName'
            ? this.searchForStart.orderValue
            : '',
        couponNo:
          this.searchForStart.orderLabel === 'couponNo'
            ? this.searchForStart.orderValue
            : ''
      }
      getCouponByPage(params).then(res => {
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

.time-line-p {
  margin-bottom: 5px;
  em {
    display: inline-block;
    font-style: normal;
    color: #fff;
    font-size: 14px;
    text-align: center;
    width: 20px;
    height: 20px;
    line-height: 20px;
    background: #bbd5fb;
    border-radius: 3px;
    margin-right: 8px;
  }
  .line-em-inp {
    background: #fcbd80;
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

.use-status-cls {
  color: #161616;
  font-size: 14px;
  em {
    float: left;
    margin-top: 8px;
    margin-right: 5px;
    width: 8px;
    height: 8px;
    border-radius: 100%;
    background: #cbcfd3;
  }
}
.stay-start {
  em {
    background: #ff7d00;
  }
}
.zoufei {
  em {
    background: #999999;
  }
}
.going-now {
  em {
    background: #00b42a;
  }
}

.tips-red-cls {
  color: #f53f3f;
  width: 100%;
  text-align: center;
  margin-top: 10px;
}
::v-deep .zb-table {
  width: 100%;
  border-left: 1px solid #eff2f6;
  border-right: 1px solid #eff2f6;
  border-radius: 6px;
  .el-table-null {
    border-bottom: 1px solid #eff2f6;
  }
  .el-table th.el-table__cell.is-leaf {
    border-bottom: none;
  }
  .el-table td.el-table__cell {
    border-bottom-color: #eff2f6;
  }
  .el-table::before {
    width: 0 !important;
    height: 0 !important;
  }
  .el-table__header-wrapper {
    .el-table__header {
      th {
        border-bottom: none;
        .cell {
          color: #000;
          font-family: 'Microsoft YaHei';
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
        }
      }
    }
  }
  .el-table__body {
    .el-table__row {
      .el-table__cell {
        .cell {
          color: #333;
        }
      }
    }
  }
}
::v-deep .my-table {
  margin: 0 !important;
  height: auto !important;
}
</style>

