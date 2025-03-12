<template>
  <div>
    <slot name="kuaishouTit" class="mb-20" />
    <div>
      <el-select v-model="value0" placeholder="请选择" class="territory-select" @change="changeLv1">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.nameValue"
          :value="item.id"
        />
      </el-select>
      <el-select v-if="value0!=''" v-model="value1" placeholder="请选择" class="territory-select m-l-10" @change="changeLv2">
        <el-option
          v-for="item in options1"
          :key="item.id"
          :label="item.nameValue"
          :value="item.id"
        />
      </el-select>
      <div v-if="value0===''||value1===''" class="errTips">请选择分类</div>
    </div>
    <p v-if="activeAccountFail" class="error-tips">账号已失效，重新登录后可获取</p>
  </div>
</template>

<script>
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
import { isUseNewClient } from '@/utils'

export default {
  name: 'Territory',
  mixins: [mixinsAllOperations],
  data() {
    return {
      value0: '',
      value1: '',
      options: [],
      options1: []
    }
  },
  inject: ['updataErrList'],
  methods: {
    async initData() {
      this.options = []
      this.options1 = []
      if (this.publishChannelData?.activeData?.account?.platformAccountId) {
        const params = {
          platformId: this.channel.id,
          platformAccountCookie: this.publishChannelData.activeData.account.cookie,
          platformAccountToken: this.merchantToken,
          newVersion: this.allChannelSwitch[this.channel.id],
          platformAccountId: this.publishChannelData.activeData.account.platformAccountId,
          mediaTypeEnum: 'MiniVideo'// Video
        }
        isUseNewClient(this.channel.id, 'get-categoryInfo', this.publishChannelData.activeData.account.platformAccountId, '获取视频或图文发布分类').emit('get-categoryInfo', JSON.stringify(params), response => {
          const { dataBody } = JSON.parse(response)
          console.log(dataBody, '监听分类数据返回。。。。。')
          this.options = dataBody
          this.value0 = this.publishChannelData.activeData?.classifyList?.length > 0 ? this.publishChannelData.activeData?.classifyList[0] : ''
          if (this.value0) {
            const arr = dataBody && dataBody.filter((item) => item.id === this.value0) || []
            this.options1 = arr[0]?.subItems
          } else {
            this.options1 = dataBody && dataBody.length > 1 ? dataBody[0].subItems : []
          }
          this.value1 = this.publishChannelData.activeData?.classifyList?.length > 0 ? this.publishChannelData?.activeData?.classifyList[1] : ''
          this.optionValid()
        })
        isUseNewClient(this.channel.id, 'get-account-privillege', this.publishChannelData.activeData.account.platformAccountId, '获取账号高权益').emit('get-account-privillege', JSON.stringify(params), response => {
          const result = JSON.parse(response)
          console.log('账号权益', result)
        })
      }
    },
    changeLv1(e) {
      this.options.map((ele, index) => {
        if (ele.id === e) {
          this.options1 = this.options[index].subItems
        }
      })
      this.value1 = ''
      this.optionValid()
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'classifyList', [this.value0, this.value1])
    },
    changeLv2() {
      this.optionValid()
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'classifyList', [this.value0, this.value1])
      this.recordAccount()
      console.log(this.publishChannelData.list)
    },
    optionValid() {
      const activeData = this.publishChannelData.activeData
      const isValid = this.value1 === '' || this.value0 === ''

      this.updataErrList(
        { platformId: activeData.account.platformId, isValidTerritory: isValid, contentError: isValid }, 'b站分类校验'
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.territory-select{
  width: 200px;
  height: 32px;
}
.errTips{
  color: #F53F3F;
  font-size: 12px;
  margin-top: 12px;
  font-weight: 500;
}

.error-tips{
  color:#f53f3f;
  font-size:14px;
  line-height: 24px;
  padding-top:4px;
  span{
    color:#0C6FFF;
    padding:0 2px;
    cursor: pointer;
  }
}
</style>
