<template>
  <div>
    <div class="extendLink m-t-12">
      声明原创
    </div>
    <div class="extendLink-input">
      <el-checkbox v-model="checked" @change="changeLink">
        <div class="ck-details">
          <span class="ck-details-con">
            视频为原创
          </span>
          <span>
            平台鼓励原创，原创内容可能被优先推荐。详见<a style="color:rgb(0, 0, 255)" target="_blank" href="https://support.weixin.qq.com/cgi-bin/mmsupportacctnodeweb-bin/pages/GzdzwPjCFZDCZkmI">《微信视频号原创声明使用条款》</a>
          </span>
        </div>
      </el-checkbox>
    </div>
  </div>
</template>

<script>
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'

export default {
  name: 'ExtendedLink',
  mixins: [mixinsAllOperations],
  data() {
    return {
      checked: true
    }
  },
  methods: {
    initData() {
      this.checked = this.publishChannelData.activeData.isOriginal || false
    },
    changeLink() {
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'isOriginal', this.checked)
    }
  }
}
</script>

<style lang="scss" scoped>
.extendLink{
  font-size: 16px;
  font-weight: 400;
  color: #333333;
}
.extendLink-input{
  margin-top: 12px;
}
.ck-details{
  :nth-child(2){
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
  }
}
.ck-details-con{
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
}
</style>
