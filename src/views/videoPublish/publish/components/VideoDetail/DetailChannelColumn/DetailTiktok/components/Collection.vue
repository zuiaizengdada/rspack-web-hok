<template>
  <div class="collectionContent">
    <div class="collectionName">
      添加到合集
    </div>
    <div class="collectionSelect">
      <el-select v-model="value" placeholder="请选择" style="width: 100%;height: 32px" popper-class="selectList" :popper-append-to-body="false" @change="selectCpllection">
        <el-option
          :key="0"
          :label="'不选择合集'"
          :value="'不选择合集'"
        />
        <el-option
          v-for="item in collection"
          :key="item.id"
          :label="item.name"
          :value="item.id"
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
    <p v-if="activeAccountFail" class="error-tips">账号已失效，重新登录后可获取</p>
  </div>
</template>
<script>

import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
import { isUseNewClient, isNewClient } from '@/utils'
export default {
  mixins: [mixinsAllOperations],
  data() {
    return {
      collection: [],
      value: ''
    }
  },
  methods: {
    isNewClient,
    // 选中的合集
    selectCpllection(e) {
      const list = this.collection.filter((item) => {
        return (item.id) === e
      })
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'collectionList', list)
    },
    async initData() {
      // 判断是否连接上我们自己的客户端
      this.collection = []
      this.value = ''
      if (this.publishChannelData?.activeData?.account?.platformAccountId) {
        const params = {
          platformId: this.channel.id,
          platformAccountCookie: this.publishChannelData.activeData.account.cookie,
          platformAccountToken: this.merchantToken,
          newVersion: this.allChannelSwitch[this.channel.id],
          platformAccountId: this.publishChannelData.activeData.account.platformAccountId,
          mediaTypeEnum: 'MiniVideo'// Video
        }
        isUseNewClient(this.channel.id, 'get-collections', this.publishChannelData.activeData.account.platformAccountId, '抖音获取合集').emit('get-collections', JSON.stringify(params), response => {
          const result = JSON.parse(response)
          console.log(result, '合集参数')
          // 兼容yixiaoerId || hokId 统一用id及name
          const arr = []
          result.dataBody.forEach(item => {
            if (isNewClient(this.channel.id)) {
              arr.push({
                id: item.hokId,
                name: item.hokName,
                child: item.child
              })
            } else {
              arr.push({
                id: item.yixiaoerId,
                name: item.yixiaoerName,
                child: item.child
              })
            }
          })
          this.collection = arr
        })
        this.value = this.publishChannelData.activeData?.collectionList[0]?.id || this.publishChannelData.activeData?.collectionList[0]?.yixiaoerId || ''
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
