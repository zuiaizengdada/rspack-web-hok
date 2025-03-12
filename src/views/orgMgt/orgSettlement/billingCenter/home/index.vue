<template>
  <div class="billing-center-home hoc-main-height">
    <HokTabs :active.sync="active" :nav-tabs="navTabs">
      <template v-slot:feesLabel>
        <el-tooltip class="item" effect="dark" placement="top">
          <div slot="content" class="red-desc">
            账单相关规则说明：<br />
            1.账期，指该账单中的业务实际发生所属年月份；<br />
            2.机构业务实时发生费用，即系统计费项，每天约凌晨2点会自动上报账单中心，状态为“待制单”；<br />
            3.出账时间：每月5号，定为月度出账数据定版时间，所属账期为上个自然月业务发生数据；同时，系统更新状态“待制单”变为“待确认”，平台财务进行账单信息核对和数据确认，经财务【确认账单】后，机构方可线下付款；
            <br />
            4.账单状态流转：待制单-待确认-待支付-已结算；
          </div>
          <div class="flex">费用总览 <i class="el-icon-question" /></div>
        </el-tooltip>
      </template>
    </HokTabs>
    <template v-if="active === 'fees'"> <BillingFees /> </template>
    <template v-if="active === 'settlement'">
      <BillingSettlement />
    </template>
  </div>
</template>

<script>
import HokTabs from '@/components/baseCpns/tabs/index.vue'
import BillingFees from './cpns/fees/index.vue'
import BillingSettlement from './cpns/billingsettlement/index.vue'

import TipsImg from '@/assets/image/icon/icon_question.png'
export default {
  name: 'BillingCenterHome',
  components: { HokTabs, BillingFees, BillingSettlement },
  data() {
    return {
      navTabs: [{ label: '费用总览', value: 'fees' }],
      active: 'fees',
      TipsImg
    }
  },
  created() {
    console.log('this.$route.name---', this.$route.name)
    if (this.$route.name === 'FeesBillingCenterHome') {
      // 非平台结构
      this.active = 'fees'
      this.navTabs = [{ label: '费用总览', value: 'fees' }]
    } else {
      this.active = this.$route.query.active || 'fees'
      this.navTabs = [
        { label: '费用总览', value: 'fees', slot: 'feesLabel' },
        { label: '账单结算', value: 'settlement' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.billing-center-home {
  min-width: 1100px;
  width: 100%;
  background: #fff;
  padding: 0;
  border-radius: 5px;
  .table-cnt {
    height: calc(100% - 60px);
  }
  .flex {
    display: flex;
    align-items: center;
    margin-left: 4px;
  }
}
</style>
