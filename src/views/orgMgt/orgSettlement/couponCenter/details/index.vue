<template>
  <div v-loading="loading" class="coupon-center-add">
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="gray">
        <span @click="goBack">优惠券</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>优惠券详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hok-main">
      <div class="title mb25">基础信息</div>
      <GreyTable :columns="jcxxColumns" :info="couponInfo" />
      <div class="title mt25 mb25">机构选择</div>
      <GreyTable :columns="yhszColumns" :info="couponInfo" />
      <div class="title mt25 mb25">优惠设置</div>
      <GreyTable :columns="yhjgColumns" :info="couponInfo" />
      <div class="title mt25 mb25">优惠说明</div>
      <GreyTable :columns="yhsmColumns" :info="couponInfo" />
      <div class="title mt25 mb25">审核记录</div>
      <GreyTable :columns="shjlColumns" :info="shjlList" />
    </div>
    <template v-if="isAudit && couponInfo[0] && couponInfo[0].auditStatus === 1">
      <div class="btns">
        <el-button
          type="primary"
          class="btn"
          size="small"
          @click="handleAudit('pass')"
        >
          审核通过
        </el-button>
        <el-button class="btn" size="small" @click="handleReject">
          审核驳回
        </el-button>
      </div>
      <RejectDialog ref="rejectDialogRef" @success="goBack" />
    </template>
  </div>
</template>

<script>
import {
  discountMethodsApi,
  getCouponInfoDetailApi,
  auditRejectionApi,
  auditPassedApi,
  qryAuditRecordsApi
} from '@/api/orgSettlement/couponCenter.js'
import { listOrganizationByParamApi } from '@/api/orgSettlement/billingCenter.js'

import GreyTable from './cpns/greyTable.vue'
import RejectDialog from './cpns/rejectDialog.vue'
export default {
  name: 'CouponCenterDetails',
  components: {
    GreyTable,
    RejectDialog
  },
  data() {
    return {
      loading: false,
      options: [],
      isAudit: false, // 是否是审核
      couponInfo: [],
      shjlList: [],
      jcxxColumns: [
        { prop: 'couponName', type: 'text', label: '优惠券名称' },
        { prop: 'couponNo', type: 'text', label: '优惠券ID' },
        { prop: 'createdByName', type: 'text', label: '创建人' },
        { prop: 'createdAt', type: 'text', label: '创建时间' },
        { prop: 'useStartTime', type: 'text', label: '适用年月' }
      ],
      yhszColumns: [
        { prop: 'discountMethod', type: 'text', label: '优惠方式' },
        { prop: 'discountContent', type: 'text', label: '直减面额' }
      ],
      yhjgColumns: [{ prop: 'tenantIds', type: 'text', label: '机构名称' }],
      yhsmColumns: [{ prop: 'remark', type: 'text', label: '优惠说明' }],
      shjlColumns: [
        { prop: 'auditType', type: 'text', label: '审核流程' },
        { prop: 'auditNickName', type: 'text', label: '操作人' },
        { prop: 'auditStatusName', type: 'text', label: '审核状态' },
        { prop: 'remark', type: 'text', label: '驳回原因' },
        { prop: 'auditTime', type: 'text', label: '变更时间' }
      ]
    }
  },
  created() {
    if (this.$route.query?.couponNo) {
      this.init(this.$route.query.couponNo)
      const prevPath = this.$route.query?.prevPath || ''
      this.isAudit = prevPath.includes('?active=audit')
    } else {
      this.$message.error('当前数据无优惠券编号')
      this.goBack()
    }
  },
  methods: {
    //
    async init(couponNo) {
      this.loading = true
      try {
        // 详情获取
        const { data } = await getCouponInfoDetailApi({ couponNo })
        const arr = data.useStartTime.split('-')
        arr.length -= 1
        data.useStartTime = arr.join('-')
        if (data.discountContent) {
          data.discountContent = Number(data.discountContent) / 100 + '元'
        }
        this.couponInfo = data ? [data] : []
        this.getDiscountMethods(data)
        // 审核记录

        const { data: AuditData } = await qryAuditRecordsApi({ couponNo })
        const AuditStatus = { 1: '待审核', 2: '审核驳回', 3: '已通过' }
        if (Array.isArray(AuditData)) {
          this.shjlList = AuditData.map(item => {
            item.auditStatusName = AuditStatus[item.auditStatus]
            return item
          })
        } else {
          this.shjlList = []
        }
      } catch (error) {
        console.log('grantCouponApi-------error', error)
      }
      this.loading = false
    },
    // 获取优惠券种类 / 优惠方式
    getDiscountMethods(info) {
      if (!info.discountMethod || !this.couponInfo[0]) return
      discountMethodsApi().then(res => {
        const cur = res.data.find(f => f.code === info.discountMethod)
        this.$set(this.couponInfo[0], 'discountMethod', cur?.message)
        this.$set(
          this.couponInfo[0],
          'discountContent',
          info.discountContent
        )
      })
      listOrganizationByParamApi({ isDeleted: 0, isInPlatform: false }).then(
        res => {
          const cur = res.data.find(
            f => f.organizationId === Number(info.tenantIds[0])
          )
          this.$set(this.couponInfo[0], 'tenantIds', cur?.name)
        }
      )
    },
    // 提交
    async handleAudit(type) {
      this.loading = true
      try {
        const apis = {
          pass: { api: auditPassedApi, message: '已审核通过' },
          reject: { api: auditRejectionApi, message: '已审核驳回' }
        }
        const res = await apis[type].api({
          couponNo: this.couponInfo[0].couponNo
        })
        debugger
        if (res.success) {
          this.$message.success(apis[type].message)
          this.goBack()
        } else {
          this.$message.error(res.message)
        }
      } catch (error) {
        console.log('handleAudit-------------error', error)
      }
      this.loading = false
    },
    // 拒绝审核
    handleReject() {
      this.$refs.rejectDialogRef.openDialog(this.couponInfo[0])
    },
    goBack() {
      const prevPath = this.$route.query?.prevPath
      if (prevPath) {
        this.$router.replace({
          path: prevPath
        })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.coupon-center-add {
  min-width: 1100px;
  width: 100%;
  background: #fff;
  padding: 0;
  border-radius: 5px;
  position: relative;
  .breadcrumb {
    height: 48px;
    border-bottom: 1px solid #dfe4ed;
    padding: 0 20px;
    ::v-deep .el-breadcrumb__inner {
      font-size: 15px;
      font-weight: 500;
      line-height: 48px;
      color: #000;
    }
    .gray {
      ::v-deep .el-breadcrumb__inner {
        color: #777777;
        cursor: pointer;
      }
    }
  }
  .hok-main {
    @include responsive-height(68px);
    overflow-y: auto;
    padding: 25px 20px 92px 20px;
    .mb25 {
      margin-bottom: 25px;
    }
    .mt25 {
      margin-top: 25px;
    }
    .title {
      color: #000000;
      text-align: center;
      font-family: 'Microsoft YaHei';
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 18px;
      padding-left: 11px;
      text-align: left;
      position: relative;

      &::before {
        content: '';
        height: 100%;
        width: 2px;
        background: #0c6fff;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .btns {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    padding: 20px 0;
    box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, 5%);
    border-radius: 0 0 5px 5px;
    background: #fff;
    z-index: 1;
  }
}
::v-deep .data-table {
  .cell {
    text-align: center;
    color: #777777;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
  }
  thead th {
    background-color: #e7e7e7;
    .cell {
      text-align: center;
      color: #333333;
      text-align: center;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 14px;
    }
  }
}
</style>
