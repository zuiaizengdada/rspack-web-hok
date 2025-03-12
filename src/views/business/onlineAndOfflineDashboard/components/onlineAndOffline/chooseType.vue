<template>
  <div v-if="codeArray && codeArray.length === 2" class="wrapper-online-choose-type">
    <span v-for="item in codeArray" :key="item.code" :class="active === item.code?'active':''" @click="changeType(item.code)">{{ item.code === 0?'线上业绩':'线下业绩' }}</span>
  </div>
</template>

<script>
import { getOfflineFlag } from '@/api/business/onlineAndOffline'
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  data() {
    return {
      active: 0,
      codeArray: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  provide() {
  },
  mounted() {
  },
  created() {
    // this.loadData()
    const setBusinessOtherData = JSON.parse(sessionStorage.getItem('setBusinessOtherData') || '{}')
    const nowUserOrgId = localStorage.getItem('userDeptId')
    if (this.userInfo.userId === setBusinessOtherData.userId && setBusinessOtherData.userOrgId === nowUserOrgId) {
      if (setBusinessOtherData.offlineFlag) {
        this.active = setBusinessOtherData.offlineFlag
      } else {
        this.active = 0
      }
    }
  },
  methods: {
    changeTypeWithoutNothing(type) {
      this.active = type
    },
    changeType(type) {
      this.active = type
      const item = {
        value: type,
        flag: 'offlineFlag'
      }
      this.$emit('changeFormData', item)
    },
    changeFormTheTypeChoose(type) {
      const item = {
        value: type,
        flag: 'offlineFlag'
      }
      this.$emit('changeFormDataCom', item)
    },
    loadData(item) {
      const params = {
      }
      if (item.employeeSecondDeptId) {
        params.employeeSecondDeptId = this.formChooseType.employeeSecondDeptId
        params.timeType = item?.time?.active
        params.startTime = item.time.time[0]
        params.endTime = item.time.time[1]
      }
      this.formChooseType = item
      // this.codeArray = []
      getOfflineFlag(params).then(res => {
        if (res.code === 1 && res.data) {
          if (res.data && res.data.length === 1) {
            this.codeArray = res.data
            // this.changeType(res.data[0].code)
            // this.changeFormTheTypeChoose(res.data[0].code)
          } else {
            this.codeArray = res.data
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper-online-choose-type {
    width: 100%;
    height: 44px;
    margin-top: 20px;
    border-bottom: 1px solid #F0F3F7;
    display: inline-block;
    span {
        width: 270px;
        height: 44px;
        line-height: 44px;
        color: #000000;
        text-align: center;
        font-family: "Microsoft YaHei";
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        margin-right: 10px;
        display: inline-block;
        background: #F7F7F7;
        cursor: pointer;
    }
    span.active {
        color: #0C6FFF;
        background: #E7F1FE;
    }
}
</style>
