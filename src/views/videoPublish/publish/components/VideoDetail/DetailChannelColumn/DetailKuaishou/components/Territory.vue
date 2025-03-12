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
      <div v-if="value0!=''&&value1 == ''" class="errTips">二级分类不能为空</div>
    </div>
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
      obj1: null,
      obj2: null,
      options: [],
      options1: []
    }
  },
  methods: {
    async initData() {
      this.options = []
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
          // this.$store.dispatch('settings/insertApiStat', { 'apiUrl': 'get-categoryInfo', platformAccountId: this.publishChannelData.activeData.account.platformAccountId, 'remark': '获取视频或图文发布分类' })
          this.options = dataBody
          this.value0 = this.publishChannelData.activeData?.fieldList[0] || ''
          if (this.value0) {
            const arr = dataBody && dataBody.filter((item) => item.id === this.value0) || []
            this.options1 = arr[0]?.subItems
          } else {
            this.options1 = dataBody[0].subItems
          }
          console.log(this.publishChannelData.activeData, '9999')
          this.value1 = this.publishChannelData.activeData.fieldList[1] || ''
        })
      }
    },
    changeLv1(e) {
      this.options.map((ele, index) => {
        if (ele.id === e) {
          this.obj1 = ele
          this.options1 = this.options[index].subItems
        }
      })
      this.value1 = ''
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'classifyList', [this.obj1, this.obj2])
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'fieldList', [this.value0, this.value1])
    },
    changeLv2(e) {
      this.options1.map((ele, index) => {
        if (ele.id === e) {
          this.obj2 = ele
        }
      })
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'classifyList', [this.obj1, this.obj2])
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'fieldList', [this.value0, this.value1])
      this.recordAccount()
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
  font-size: 16px;
  margin-top: 12px;
  font-weight: 500;
}
</style>
