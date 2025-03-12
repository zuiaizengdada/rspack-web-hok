<template>
  <!-- 优惠券设置  -->
  <div>
    <el-row type="flex" justify="space-between" style="margin: 20px 0">
      <div>
        <el-button
          type="primary"
          size="small"
          @click="onhandleOpenAdd"
        >
          添加优惠券
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="onhandleCouponStyleSetting"
        >
          优惠券样式设置
        </el-button>
      </div>
      <el-button
        class="btn_primary"
        size="small"
        plain
        @click="anhandleRecord"
      >
        领取记录
      </el-button>
    </el-row>

    <ZBTable
      ref="zbTableRef"
      :columns="columns"
      :get-list="getList"
      is-left-bottom-slot
      :is-pages="false"
    >
      <template v-slot:discountMethod="{ scope }">
        {{
          scope.row.discountMethod | getOptionsValue(couponDiscountMethodType)
        }}
      </template>
      <template v-slot:useStartTime="{ scope }">
        <template v-if="scope.row.expireDays && scope.row.expireDays > 0">
          有效期：领取后{{ scope.row.expireDays }}天
        </template>
        <template v-else>
          <div>
            起：{{
              scope.row.useStartTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')
            }}
          </div>
          <div>
            至：{{
              scope.row.useEndTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')
            }}
          </div>
        </template>
      </template>
      <template v-slot:claimStartTime="{ scope }">
        <div>
          起：{{
            scope.row.claimStartTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')
          }}
        </div>
        <div>
          至：{{
            scope.row.claimEndTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')
          }}
        </div>
      </template>
      <template v-slot:couponContent="{ scope }">
        {{ scope.row | filtersName }}
      </template>

      <template v-slot:operate="{ scope }">
        <el-button type="text" class="c_red" @click="onhandleDel(scope.row)">
          删除
        </el-button>
      </template>
    </ZBTable>
  </div>
</template>

<script>
import ZBTable from '@/views/smartSales/privateLive/room/components/table'
import { columns } from './columns'

import Dialog from '@/views/smartSales/privateLive/room/components/Dialog/index.js'
import {
  couponDiscountMethodType,
  couponUseStatusType
} from '@/views/smartSales/privateLive/room/columns.js'
import {
  liveRoomCouponList,
  liveRoomcoupondelete
} from '@/api/liveRoom/index.js'
import { getOptionsValueByKey } from '@/filters/index'
import { filtersMoneyByZeroNoSplit } from '@/filters'
export default {
  filters: {
    filtersName(row) {
      if (row.discountMethod === 1) {
        // 满减
        return `满${filtersMoneyByZeroNoSplit(
          row.satisfiedAmount
        )}元减${filtersMoneyByZeroNoSplit(row.subtractAmount)}元`
      } else if (row.discountMethod === 2) {
        // 直减
        return `直减${filtersMoneyByZeroNoSplit(row.directReductionAmount)}元`
      } else if (row.discountMethod === 3) {
        // 折扣
        return `${row.sale}折`
      }
      return ''
    }
  },
  components: { ZBTable },
  data() {
    return {
      columns,
      couponDiscountMethodType,
      couponUseStatusType
    }
  },
  mounted() {
    this.updateTable()
  },
  methods: {
    updateTable() {
      this.$refs.zbTableRef.init()
    },
    getOptionsValueByKey,
    // 点击删除按钮
    onhandleDel(row) {
      this.$delModal({
        tips: `
          <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">确认删除?</div>
          <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">删除优惠券，用户端已经领取的不受影响。是否确认删除？</div>
        `,
        success: () => {
          row.delLoading = true
          console.log(row)
          const data = {
            liveCouponId: row.liveCouponId,
            liveRoomId: this.$route.params.id
          }
          liveRoomcoupondelete(data)
            .then(() => {
              this.updateTable()
              row.delLoading = false
            })
            .catch(() => {
              row.delLoading = false
            })
        }
      })
    },
    // 点击添加优惠券按钮
    onhandleOpenAdd() {
      Dialog.open({
        type: 'AddCoupon',
        visible: true,
        defaultCheck: this.$refs.zbTableRef?.tableData || [],
        liveRoomId: this.$route.params.id,
        success: () => {
          Dialog.close()
          this.updateTable()
        }
      })
    },
    // 点击领取记录按钮
    anhandleRecord() {
      Dialog.open({
        type: 'CouponRecord',
        visible: true,
        liveRoomId: this.$route.params.id
      })
    },
    // 获取优惠券列表
    getList() {
      const data = {
        liveRoomId: this.$route.params.id
      }
      return liveRoomCouponList(data)
    },
    // 优惠券样式设置
    onhandleCouponStyleSetting() {
      Dialog.open({
        type: 'CouponStyle',
        visible: true,
        liveRoomId: this.$route.params.id,
        success: () => {
          Dialog.close()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tips {
  color: #999;
  font-size: 12px;
  font-weight: 400;
}
::v-deep .picker-s {
  width: 245px !important;
  height: 32px;
  margin-left: 40px;
  margin-right: 16px;
  border-radius: 4px;
  border: 1px solid #cbcfd3;
}
</style>
