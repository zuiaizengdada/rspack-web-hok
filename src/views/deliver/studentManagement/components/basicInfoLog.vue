<template>
  <div class="basic-container">
    <el-descriptions title="学员信息" :column="2">
      <el-descriptions-item label="学员姓名">{{
        detailForm.userName
      }}</el-descriptions-item>
      <el-descriptions-item label="手机号">
        <tablePhoneItem
          :key="1"
          v-model="detailForm.userCopyPhone"
          :phone-area-code="detailForm.phoneAreaCode"
          :row-data="{ uid: userId }"
          type="user"
        />
      </el-descriptions-item>
      <el-descriptions-item label="邮箱号">
        <tableEmailItem
          :key="1"
          v-model="detailForm.newEmail"
          type="user"
          :row-data="{ userId: userId }"
        />
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="商品信息" :column="2">
      <el-descriptions-item label="课程IP">{{
        detailForm.lecturerName | filterLecturer
      }}</el-descriptions-item>
      <el-descriptions-item label="课程名称">
        {{ detailForm.goodsName }}
      </el-descriptions-item>
      <el-descriptions-item label="课程金额">
        {{ detailForm.goodsTotalFee | filtersMoneyByZero }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="订单信息" :column="2">
      <el-descriptions-item label="订单号">{{
        detailForm.orderNo
      }}</el-descriptions-item>
      <el-descriptions-item label="渠道来源">
        {{ detailForm.channelSourceName }}
      </el-descriptions-item>
      <el-descriptions-item label="订单类型">
        {{ detailForm.orderTypeName }}
      </el-descriptions-item>
      <el-descriptions-item label="订单余额">
        {{ detailForm.balanceFee | filtersMoneyByZero }}
      </el-descriptions-item>
      <el-descriptions-item label="优惠金额">
        {{ detailForm.discountsFee | filtersMoneyByZero }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="交付信息" :column="2">
      <el-descriptions-item label="交付单号">{{
        detailForm.deliveryNo
      }}</el-descriptions-item>
      <!--      <el-descriptions-item label="累计时长">-->
      <!--        {{ detailForm.duration | filterTime }}-->
      <!--      </el-descriptions-item>-->
      <el-descriptions-item label="交付状态">
        {{ detailForm.deliveryStatusName }}
      </el-descriptions-item>
      <el-descriptions-item label="生效时间">
        {{ detailForm.effectiveTime }}
      </el-descriptions-item>
      <el-descriptions-item label="失效时间">
        {{ detailForm.failureTime }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="其他" :column="2">
      <el-descriptions-item label="招生部门">{{
        detailForm.enrollmentDept
      }}</el-descriptions-item>
      <el-descriptions-item label="招生老师">
        {{ detailForm.enrollmentUserName }}
      </el-descriptions-item>
      <el-descriptions-item label="备注" :span="2">
        {{ detailForm.remark }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import tableEmailItem from '@/components/AppTemplate/tableEmailItem'
export default {
  components: {
    tablePhoneItem,
    tableEmailItem
  },
  filters: {
    filterLecturer(val) {
      if (!val || val.length === 0) {
        return '--'
      } else {
        return val.join(',')
      }
    }
  },
  props: {
    userId: {
      type: [String, Number],
      default: ''
    },
    detailForm: {
      default: () => {},
      type: Object
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-container ::v-deep {
  .el-descriptions__title {
    margin-top: 12px;
    display: flex;
    align-items: center;
    &::before {
      content: '';
      display: inline-block;
      margin-right: 5px;
      width: 4px;
      height: 20px;
      background: #0c6fff;
      border-radius: 6px;
    }
  }
  .el-descriptions__header {
    margin-bottom: 15px;
  }
}
</style>
