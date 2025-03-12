<template>
  <!-- 优惠券设置 -->
  <div class="couponSettings">
    <div class="headerTop">
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="onhandleOpenAdd">添加优惠券</el-button>
        <el-button type="primary" @click="onhandleCouponStyleSetting">优惠券样式设置</el-button>
      </div>
      <el-button class="btn_primary" @click="anhandleRecord">领取记录</el-button>
    </div>
    <div class="m-t-20">
      <el-table v-loading="loading" :data="list" :header-cell-style="{ background: '#f5f5f5' }">
        <el-table-column prop="couponNo" label="优惠券ID" width="180" />
        <el-table-column prop="couponName" label="优惠券名称" />
        <el-table-column prop="discountMethod" label="券类型" width="80">
          <template slot-scope="{ row }">
            {{ row.discountMethod | getOptionsValue(couponDiscountMethodType) }}
          </template>
        </el-table-column>
        <el-table-column prop="issueCount" label="发放数量" align="center" />
        <el-table-column prop="useStartTime" label="券有效期" min-width="180">
          <template slot-scope="{ row }">
            <template v-if="row.expireDays && row.expireDays > 0">
              有效期：领取后{{ row.expireDays }}天
            </template>
            <template v-else>
              <div>起：{{ row.useStartTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div>
              <div>至：{{ row.useEndTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="claimStartTime" label="领取时间" min-width="180">
          <template slot-scope="{ row }">
            <div>起：{{ row.claimStartTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div>
            <div>至：{{ row.claimEndTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="couponContent" label="优惠内容">
          <template slot-scope="{ row }">
            {{ row | filtersName }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="status" label="券状态">
          <template slot-scope="{ row }">
            {{ row.status | getOptionsValue(couponUseStatusType) }}
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="80" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" class="c_red" @click="onhandleDel(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Dialog from '@/views/live/Dialog/index.js'
import { couponDiscountMethodType, couponUseStatusType } from '@/views/live/columns.js'
import { liveRoomCouponList, liveRoomcoupondelete } from '@/api/liveRoom/index.js'
import { getOptionsValueByKey } from '@/filters/index'
import { filtersMoneyByZeroNoSplit } from '@/filters'
export default {
  filters: {
    filtersName(row) {
      if (row.discountMethod === 1) {
        // 满减
        return `满${filtersMoneyByZeroNoSplit(row.satisfiedAmount)}元减${filtersMoneyByZeroNoSplit(row.subtractAmount)}元`
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
  components: {},
  data() {
    return {
      couponDiscountMethodType,
      couponUseStatusType,
      loading: false,
      list: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
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
          liveRoomcoupondelete(data).then(() => {
            this.getList()
            row.delLoading = false
          }).catch(() => {
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
        defaultCheck: this.list,
        liveRoomId: this.$route.params.id,
        success: () => {
          Dialog.close()
          this.getList()
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
      this.loading = true
      const data = {
        liveRoomId: this.$route.params.id
      }
      liveRoomCouponList(data).then(res => {
        res.data.map(v => {
          v.delLoading = false
        })
        this.list = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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

<style lang='scss' scoped>
.couponSettings {
  .headerTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
