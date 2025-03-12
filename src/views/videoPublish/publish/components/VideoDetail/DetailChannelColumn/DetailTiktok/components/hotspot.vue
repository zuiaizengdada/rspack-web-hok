<template>
  <div class="collectionContent">
    <div class="collectionName">
      申请关联热点
    </div>
    <div class="collectionSelect">
      <el-select v-model="value" filterable clearable placeholder="点击输入热点词" style="width: 100%;height: 32px" popper-class="selectList" remote :remote-method="remoteSearchFriend" :popper-append-to-body="false" @change="selectCpllection">
        <el-option
          v-for="item in collection"
          :key="item.sentence_id"
          :label="item.name"
          :value="item.sentence_id"
        >
          <div class="opt_box">
            <div class="fl fl_ai_c">
              <span>{{ item.name }}</span>
            </div>
            <!--            <span>共{{ item.child.length }}个作品</span>-->
          </div>
        </el-option>
      </el-select>
    </div>
    <p class="error-tips">您可以添加1个关联热点</p>
  </div>
</template>
<script>

import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
import { isUseNewClient } from '@/utils'
export default {
  mixins: [mixinsAllOperations],
  data() {
    return {
      collection: [],
      value: ''
    }
  },
  methods: {
    // 选中的合集
    selectCpllection(e) {
      const list = this.collection.filter((item) => {
        return (item.sentence_id) === e
      })
      console.log(list, '选中')
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'hotSentence', list[0] || [])
    },
    filterData(list) {
      // 过滤相同group_id数据
      const arr = []
      list.forEach(item => {
        if (arr.every((item1) => {
          return item1.group_id !== item.group_id
        })) {
          arr.push(item)
        }
      })
      return arr
    },
    remoteSearchFriend(val) {
      const params = {
        platformId: this.channel.id,
        platformAccountCookie: this.publishChannelData.activeData.account.cookie,
        platformAccountToken: this.merchantToken,
        platformAccountId: this.publishChannelData.activeData.account.platformAccountId,
        newVersion: this.allChannelSwitch[this.channel.id],
        mediaTypeEnum: 'Video', // Video Article MiniVideo
        dataType: 3, // 1好友 2话题 3热点
        keyWord: val
      }
      console.log(this.publishChannelData.activeData, '数据')
      isUseNewClient(this.channel.id, 'get-mediaTopicInfo', this.publishChannelData.activeData.account.platformAccountId, '获取好友/话题/热点').emit('get-mediaTopicInfo', JSON.stringify(params), response => {
        const result = JSON.parse(response)
        console.log(result, '抖音热点')
        this.collection = this.filterData(result.dataBody)
      })
    },
    async initData() {
      this.collection = []
      this.value = ''
      console.log(this.publishChannelData.activeData?.hotSentence?.name, '热点')
      if (this.publishChannelData?.activeData?.account?.platformAccountId) {
        const params = {
          platformId: this.channel.id,
          platformAccountCookie: this.publishChannelData.activeData.account.cookie,
          platformAccountToken: this.merchantToken,
          platformAccountId: this.publishChannelData.activeData.account.platformAccountId,
          newVersion: this.allChannelSwitch[this.channel.id],
          mediaTypeEnum: 'Video', // Video Article MiniVideo
          dataType: 3, // 1好友 2话题 3热点
          keyWord: this.publishChannelData.activeData?.hotSentence?.name || null
        }
        console.log(this.publishChannelData.activeData, '热点数据')
        isUseNewClient(this.channel.id, 'get-mediaTopicInfo', this.publishChannelData.activeData.account.platformAccountId, '获取好友/话题/热点').emit('get-mediaTopicInfo', JSON.stringify(params), response => {
          const result = JSON.parse(response)
          console.log(result, '抖音热点')
          this.collection = this.filterData(result.dataBody)
        })
        this.value = this.publishChannelData.activeData?.hotSentence?.sentence_id || ''
      }
    }
  }
}
</script>
  <style lang="scss" scoped>
  ::v-deep .el-select-dropdown__item{
    height: 48px !important;
    line-height: 48px !important;
  }
  .collectionName{
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 24px;
    margin-top: 20px;
  }
  .collectionSelect{
    margin-top: 12px;
  }
  .opt_box{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    line-height: 48px;
    img{
      width: 36px;
      height: 36px;
      border-radius: 4px;
      border: 1px solid #EDEEEE;
      margin-right: 10px;
    }
  }

  .error-tips{
    // color:#0C6FFF;
    font-size:14px;
    line-height: 24px;
    padding-top:12px;
    span{
      // color:#0C6FFF;
      padding:0 2px;
      cursor: pointer;
    }
  }

  </style>

