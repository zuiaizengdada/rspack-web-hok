<template>
  <MCard class="">
    <div class="title">通知</div>
    <div class="content">
      <div class="contentTitle">申请退款提醒设置</div>
      <div class="shop-notice">
        <div class="shop-line">
          <div class="shop-line-label">通知开关</div>
          <el-switch
            v-model="prewsFlag"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="handleSwitch(7)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :shop-notice-flag="prewsFlag"
            :shop-feishu-group-list="prewsCrowdVosList"
            :set-type="7"
            :login-type="loginType"
            @getComplement="getComplement"
          />
        </div>
      </div>
    </div>
  </MCard>
</template>

<script>
import addGroup from '@/views/basicSettings/components/addGroup'
import { setMediaRemind } from '@/api/deliver/baseSeeting'
import { getSendMsgTypeConfigApi } from '@/api/deliver/baseSeeting'
import { getItem } from '@/utils/localStorage'
export default {
  components: {
    addGroup
  },
  data: () => ({
    loginType: 'feishu',
    types: {
      feishu: '飞书',
      wecom: '企微'
    },
    prewsFlag: false,
    setMediaRemind,
    prewsList: [],
    prewsCrowdVosList: []
  }),
  created() {},
  methods: {
    // 获取信息来源是企微还是飞书
    async getSendMsgTypeConfig() {
      try {
        const orgInfo = getItem('orgInfo')
        const { data } = await getSendMsgTypeConfigApi({
          tenantId: orgInfo.organizationId
        })
        if (data) {
          this.loginType = data === 1 ? 'feishu' : 'wecom'
          console.log('this.loginType-------', this.loginType)
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleSwitch() {
      console.log(111111111111)
    },
    getComplement(value) {
      console.log(2, value)
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  color: #333333;
  margin: 0 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e7e7e7;
}
.content {
  margin: 20px;
}
.contentTitle {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 22px;
}
.shop-notice {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 20px;
  padding-bottom: 0;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  width: 100%;
  display: inline-block;
  margin-top: 10px;
  > div {
    padding-bottom: 20px;
  }
}
.shop-line {
  display: flex;
  align-items: center;
  .shop-line-label {
    width: 100px;
    font-size: 12px;
  }
}
</style>
