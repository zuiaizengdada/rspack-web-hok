<template>
  <div>
    <slot name="kuaishouTit" class="mb-20" />
    <div class="relative">
      <el-radio-group v-model="radio" @change="changeSelfControl">
        <el-radio :label="1">自制</el-radio>
        <el-radio :label="0">转载</el-radio>
      </el-radio-group>
      <el-input v-if="radio == 0" v-model="value" maxlength="200" show-word-limit class="m-t-8" placeholder="转载视频请注明来源（例：转自http://www.xxx.com），注明来源会更快地通过审核哦" @change="handlerChange" />
      <p v-if="visibleErrorTips" class="tips-error absolute">请输入正确的转载地址</p>
    </div>

  </div>
</template>

<script>
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'

export default {
  name: 'Realization',
  mixins: [mixinsAllOperations],
  data() {
    return {
      radio: 1,
      value: '',
      visibleErrorTips: false
    }
  },
  methods: {
    initData() {
      console.log(this.publishChannelData.activeData, 'this.publishChannelData.activeData.isSelfControl')
      this.radio = Number(this.publishChannelData.activeData.isSelfControl) || 1
      this.value = this.publishChannelData.activeData.isSelfUrl
    },
    // 声明是否自制
    changeSelfControl() {
      this.visibleErrorTips = false
      this.value = ''
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'isSelfControl', Boolean(this.radio))
    },
    handlerChange() {
      const isValidatorUrl = this.validatorUrl(this.value)
      if (isValidatorUrl) {
        this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'isSelfUrl', this.value)
        this.visibleErrorTips = false
      } else {
        this.visibleErrorTips = true
      }
    },
    validatorUrl(url) {
      const regUrl = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/[\]@!\$&'\*\+,;=.]+$/
      return regUrl.test(url)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-select-dropdown__item{
    height: 100px !important;
    line-height: 100px !important;
  }
.selectList{
  height: 48px !important;
  line-height: 48px !important;
}
.collectionSelect{
  margin-top: 12px;
}
.opt_box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  line-height: 100px;
  .goodsName,.goodsPrice{
    height: 50px;
    max-width: 420px;
    line-height: 50px;
  }
  .goodsName{
    width: 439px;
    font-size: 14px;
    font-weight: 400;
    //color: #333333;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .goodsPrice{
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #F53F3F;
  }
  img{
    width: 80px;
    height: 80px;
    border-radius: 4px;
    border: 1px solid #EDEEEE;
    margin-right: 10px;
  }
}

.tips-error{
  bottom:-20px;
  left:0;
  font-size:14px;
  color:#F53F3F;
}

</style>
