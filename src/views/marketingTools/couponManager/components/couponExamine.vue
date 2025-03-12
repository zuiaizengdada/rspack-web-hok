<template>
  <div class="order-list">
    <HokSearchForm :form-opts="formOpts" :ref-obj.sync="formOpts.ref">
      <template #orderLabel>
        <div class="flex pl-2">
          <el-select
            v-model="formOpts.formData.orderLabel"
            placeholder="请选择"
            style="width: 150px; border-right: 1px solid #dcdee1"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="formOpts.formData.orderValue"
            style="padding-left: 8px"
            placeholder="请输入"
          />
        </div>
      </template>
      <template #createdBy>
        <el-select
          v-model="formOpts.formData.createdBy"
          filterable
          placeholder="请选择"
          clearable
          @change="searchFn()"
        >
          <el-option
            v-for="item in userArray"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
      </template>
    </HokSearchForm>
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
        <el-button
          type="primary"
          size="small"
          @click="openExaminneMangeDialg"
        >审核人员管理</el-button>
      </div>
    </div>
    <ZBTable
      ref="zbTableRef"
      :columns="columns"
      :get-list="getList"
      height="450px"
      @handleSizeChangeEmit="handleSizeChangeEmit"
      @handleCurrentChangeEmit="handleCurrentChangeEmit"
    >
      <template v-slot:couponName="{ scope }">
        <div>
          <p class="goods-title-cls">{{ scope.row.couponName }}</p>
          <p
            class="goods-blue-cls"
            style="cursor: pointer; width: 100%; float: left"
          >
            <span style="float: left" @click="toDetail(scope.row)">
              ID:{{ scope.row.couponNo }}
            </span>
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
              src="../../../../assets/image/coupon/icn_copy.png"
            />
          </p>
          <em v-if="scope.row.couponType === 1" class="goods-em-cls">
            商品优惠券
          </em>
          <em v-if="scope.row.couponType === 2" class="goods-em-cls">
            店铺优惠券
          </em>
          <em v-if="scope.row.couponType === 3" class="goods-em-cls">
            直播优惠券
          </em>
        </div>
      </template>
      <template v-slot:couponContent="{ scope }">
        <p class="coupon-youhui">{{ scope.row.couponContent }}</p>
        <span v-if="scope.row.discountMethod === 1" class="coupon-yh-em">
          指定商品满减券
        </span>
        <span v-if="scope.row.discountMethod === 2" class="coupon-yh-em">
          指定商品直减券
        </span>
        <span v-if="scope.row.discountMethod === 3" class="coupon-yh-em">
          指定商品折扣券
        </span>
      </template>
      <template v-slot:couponType="{ scope }">
        <p v-if="scope.row.couponType === 1">商品券</p>
        <p v-else-if="scope.row.couponType === 3">直播专享券</p>
      </template>
      <template v-slot:issueCount="{ scope }">
        <p>{{ scope.row.claimedCount }} / {{ scope.row.issueCount }}</p>
      </template>
      <template v-slot:claimStartTime="{ scope }">
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
      </template>
      <template v-slot:auditStatus="{ scope }">
        <div v-if="scope.row.auditStatus === 1" class="audit-div-cls">
          <img src="../../../../assets/image/coupon/icn_chushen.png" />
          <p>待初审</p>
        </div>
        <div
          v-if="scope.row.auditStatus === 2"
          class="audit-div-cls audit-bohui-cls"
        >
          <img src="../../../../assets/image/coupon/icn_bohui.png" />
          <p>审核驳回</p>
        </div>
        <div
          v-if="scope.row.auditStatus === 3"
          class="audit-div-cls audit-fushen-cls"
        >
          <img src="../../../../assets/image/coupon/icn_fushen.png" />
          <p>待复审</p>
        </div>
        <div
          v-if="scope.row.auditStatus === 4"
          class="audit-div-cls audit-bohui-cls"
        >
          <img src="../../../../assets/image/coupon/icn_bohui.png" />
          <p>审核驳回</p>
        </div>
        <div
          v-if="scope.row.auditStatus === 5"
          class="audit-div-cls audit-tongguo-cls"
        >
          <img src="../../../../assets/image/coupon/icn_check.png" />
          <p>审核通过</p>
        </div>
      </template>
      <template v-slot:useStatus="{ scope }">
        <div v-if="scope.row.auditStatus === 5">
          <p v-if="scope.row.useStatus === 1" class="use-status-cls stay-start">
            <em />待开始
          </p>
          <p v-if="scope.row.useStatus === 2" class="use-status-cls going-now">
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
      </template>
      <template v-slot:operate="{ scope }">
        <el-button type="text" @click="toDetail(scope.row)">
          查看详情
        </el-button>
      </template>
    </ZBTable>
    <examinneMangeDialg ref="examinneMangeDialgRef" />
  </div>
</template>

<script>
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { columns, formConfig } from './columnsExmine'
import clipboard from '@/directive/clipboard/index.js'
import { userNoPage } from '@/api/addressBookApi'
import { getCouponAuditPage } from '@/api/marketingTools/coupon.js'
import examinneMangeDialg from './examinneMangeDialog.vue'
export default {
  name: 'CouponExamine',
  directives: {
    clipboard
  },
  components: {
    HokSearchForm,
    ZBTable,
    examinneMangeDialg
  },
  data() {
    return {
      orderTimeArray: [],
      columns,
      permsList: this.$route.meta.permsList || [],
      auditStatus: 1,
      userArray: [],
      formOpts: {
        ...formConfig,
        operatorList: [
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
      },
      tableConfig: {
        pageIndex: 1,
        pageSize: 10
      },
      bindClickKeys: ['couponType'],
      options: [
        { label: '优惠券名称', value: 'couponName' },
        { label: '优惠券ID', value: 'couponNo' }
      ]
    }
  },
  created() {
    this.loadUserNoPage()
    // 绑定change事件
    this.formOpts.fieldList.forEach(item => {
      if (this.bindClickKeys.includes(item.prop)) {
        item.eventHandler.change = () => {
          this.searchFn()
        }
      }
    })
    if (
      this.$route.query.search &&
      this.$route.query.fromTab === 'couponExamine'
    ) {
      const searchFromDetail = JSON.parse(this.$route.query.search)
      this.formOpts.formData = searchFromDetail
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    changeAuditStatus(type) {
      this.auditStatus = type
      this.tableConfig.pageIndex = 1
      this.searchFn()
    },
    openExaminneMangeDialg() {
      this.$refs.examinneMangeDialgRef.openDialog()
    },
    toDetail(row) {
      const forSearch = JSON.stringify(this.formOpts.formData)
      this.$router.push({
        name: 'CouponDataDetail',
        query: {
          couponNo: row.couponNo,
          fromTab: 'couponExamine',
          dataType: this.auditStatus,
          search: forSearch
        }
      })
    },
    loadUserNoPage() {
      const params = {
        deptId: '',
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
        })
        .catch(() => {})
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
        this.tableConfig.pageSize = 10
        this.formOpts.formData = {
          orderLabel: 'couponName',
          orderValue: undefined,
          couponType: undefined,
          useStatus: undefined,
          discountMethod: undefined,
          time1: undefined
        }
      }
      this.$refs.zbTableRef.init(isResetPageIndex)
    },
    getList() {
      let auditStautsArray = []
      if (this.auditStatus === 3) {
        auditStautsArray = [2, 4]
      } else if (this.auditStatus === 2) {
        auditStautsArray = [3]
      } else {
        auditStautsArray = [this.auditStatus]
      }
      const params = {
        ...this.tableConfig,
        ...this.formOpts.formData,
        auditStatus: auditStautsArray
      }
      return getCouponAuditPage(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.order-list {
  width: 100%;
  height: 100%;
  margin-top: 20px;
  padding-bottom: 20px;
}
.coupon-data-row {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
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
.audit-bohui-cls {
  display: flex;
  align-items: center;
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
</style>

