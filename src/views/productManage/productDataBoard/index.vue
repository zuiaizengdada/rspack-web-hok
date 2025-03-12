<template>
  <div class="wrapper">
    <div class="live-content">
      <data-overview />
    </div>
    <!-- <div class="live-content secord-content">
      <caseBoardVue />
    </div> -->
    <div class="tearchfor">
      <tearch-data-vue />
    </div>
  </div>
</template>

<script>
import dataOverview from './components/dataOverview.vue'
import tearchDataVue from './components/tearchData.vue'
// import caseBoardVue from './components/caseBoard.vue'
export default {
  components: {
    tearchDataVue,
    // caseBoardVue,
    'data-overview': dataOverview
  },
  data() {
    return {
    }
  },
  mounted() {
    // this.chooseDate('week')
    // this.chooseAnLiDate('week')
  },
  created() {},
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
}
.live-content {
  min-width: 1200px;
  border-radius: 10px;
  padding: 20px;
  background: #fff;
}
.secord-content {
  margin-top: 20px;
}
::v-deep .el-range__icon {
  display: none;
}

.tearchfor {
  margin-top: 20px;
  min-width: 1200px;
  border-radius: 10px;
  padding: 20px;
  background: #fff;
}
</style>
