<template>
  <div v-if="formRevenue.employeeDeptId && (formRevenue.offlineFlag === 0 || formRevenue.offlineFlag === '0')" class="wrapper-online-revenue-yj">
    <div class="on-off-search-data">
      <div class="on-off-revenue-performance">
        <span :class="revenType === 1?'active':''" @click="changeRevenType(1)">营收</span>
        <span :class="revenType === 2?'active':''" @click="changeRevenType(2)">业绩</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  data() {
    return {
      revenType: 1,
      formRevenue: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  provide() {
  },
  mounted() {
    const setBusinessOtherData = JSON.parse(sessionStorage.getItem('setBusinessOtherData') || '{}')
    const nowUserOrgId = localStorage.getItem('userDeptId')
    if (this.userInfo.userId === setBusinessOtherData.userId && setBusinessOtherData.userOrgId === nowUserOrgId) {
      if (setBusinessOtherData.chooseType) {
        this.revenType = setBusinessOtherData.chooseType
      } else {
        this.revenType = 1
      }
    }
  },
  created() {
  },
  methods: {
    huidiao() {
      this.changeRevenType(this.revenType)
    },
    init(item) {
      this.formRevenue = item
    },
    changeRevenTypeWithoutNothing(type) {
      this.revenType = type
    },
    changeRevenType(type) {
      this.revenType = type
      const item = {
        flag: 'chooseType',
        value: type
      }
      this.$emit('changeFormData', item)
    }
  }
}
</script>

  <style lang="scss" scoped>
  .wrapper-online-revenue-yj{
    float: left;
    width: 200px;
    margin-left: 50px;
  }

  .on-off-revenue-performance {
      width: 100%;
      height: 30px;
      position: relative;
      span {
        width: 80px;
        height: 30px;
        line-height: 30px;
        color: #000000;
        text-align: center;
        font-family: "Microsoft YaHei";
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        margin-right: 10px;
        display: inline-block;
        border-radius: 5px;
        background: #E7F1FE;
        cursor: pointer;
      }
      span.active {
          color: #0C6FFF;
          background: #E7F1FE;
      }
    }
  </style>
