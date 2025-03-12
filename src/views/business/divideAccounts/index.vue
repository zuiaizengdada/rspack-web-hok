<template>
  <div class="divide-accounts">
    <el-tabs v-model="activeName">
      <el-tab-pane label="待结算订单" name="first">
        <staySettlementOrder />
      </el-tab-pane>
      <el-tab-pane label="结算订单" name="second">
        <settlementOrder />
      </el-tab-pane>
      <el-tab-pane label="已结算汇总" name="third">
        <alreadySettlementSummary />
      </el-tab-pane>
      <el-tab-pane label="资金账户" name="fourth">
        <marginAccount />
      </el-tab-pane>
      <el-tab-pane label="抖音结算账户" name="five">
        <settlementAccountDY />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import staySettlementOrder from './components/staySettlementOrder'
import settlementOrder from './components/settlementOrder'
import alreadySettlementSummary from './components/alreadySettlementSummary'
import marginAccount from './components/marginAccount'
import settlementAccountDY from './components/settlementAccountDY'

export default {
  name: 'DivideAccounts',
  components: {
    staySettlementOrder,
    settlementOrder,
    alreadySettlementSummary,
    marginAccount,
    settlementAccountDY
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.divide-accounts {
  position: relative;
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
}
</style>
