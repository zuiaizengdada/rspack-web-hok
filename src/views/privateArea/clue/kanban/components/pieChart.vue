<template>
  <div class="pieCartBox">
    <pieChartCard v-for="(item,index) in selectRatio" :key="index" :data-ratio="item" />
  </div>
</template>

<script>
import pieChartCard from './pieChartCard'
export default {
  components: { pieChartCard },
  props: {
    selectRatio: {
      type: Array,
      default: () => [{
        label: '来源渠道占比',
        text: '按线索转化率',
        data: []
      }, {
        label: '直播成交占比',
        text: '按成交金额',
        data: []
      }]
    }
  },
  data: () => ({}),
  created() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.pieCartBox{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    >div{
        margin-left: 20px;
        flex:1;
    }
    >div:nth-of-type(1){
        margin-left: 0;
    }
}
</style>
