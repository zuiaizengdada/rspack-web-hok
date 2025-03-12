<template>
  <div class="wrapper-online-choose-channel">
    <div class="choose-channel-block">
      <span :class="channelType === 999?'active':''" @click="changeChannel(999)">全部</span>
      <span v-for="item in channelTypeArray" :key="item.code" :class="channelType === item.code?'active':''" @click="changeChannel(item.code)">{{ item.desc }}</span>
    </div>
  </div>
</template>

<script>
import { getRevenueGoodsType } from '@/api/business/onlineAndOffline'
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  data() {
    return {
      channelType: 999,
      channelTypeArray: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  provide() {
  },
  mounted() {
    this.loadData()
    const setBusinessOtherData = JSON.parse(sessionStorage.getItem('setBusinessOtherData') || '{}')
    const nowUserOrgId = localStorage.getItem('userDeptId')
    if (this.userInfo.userId === setBusinessOtherData.userId && setBusinessOtherData.userOrgId === nowUserOrgId) {
      if (setBusinessOtherData.productCategory) {
        this.channelType = setBusinessOtherData.productCategory
      } else {
        this.channelType = 999
      }
    }
  },
  created() {
  },
  methods: {
    loadData() {
      getRevenueGoodsType().then(res => {
        if (res.code === 1 && res.data) {
          this.channelTypeArray = res.data
        }
      })
    },
    changeChannel(type) {
      this.channelType = type
      const item = {
        flag: 'channelFlag',
        value: type
      }
      this.$emit('changeFormData', item)
    },
    changeChannelWithOutNothing(type) {
      this.channelType = type
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper-online-choose-channel {
    width: 100%;
    margin-top: 20px;
    display: inline-block;
    .choose-channel-block {
        width: 405px;
        height: 28px;
        background: #F7F7F7;
        span {
            margin-top: 1px;
            margin-left: 1px;
            width: 80px;
            height: 26px;
            color: #666666;
            text-align: center;
            font-family: "Microsoft YaHei";
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 26px;
            cursor: pointer;
            display: inline-block;
        }
        span.active {
            font-weight: 600;
            color: #000;
            background: #fff;
        }
    }
}
</style>
