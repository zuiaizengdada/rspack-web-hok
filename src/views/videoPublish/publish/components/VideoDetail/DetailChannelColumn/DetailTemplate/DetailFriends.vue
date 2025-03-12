<template>
  <div class="w-full">
    <template-title title="@好友" />
    <div class="friends-cls">
      <el-select v-model="value0" :multiple-limit="10" multiple placeholder="请选择" remote filterable :remote-method="remoteSearchFriend" :loading="loading" class="territory-select" @change="changeLv1">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
          <p class="account-info flex items-center">
            <el-image :src="item.image" class="image" />
            <span>{{ item.name }}</span>
            <span>{{ item.id }}</span>
          </p>
        </el-option>
      </el-select>
    </div>
    <div class="m-t-16" style="margin-bottom:14px;">
      <span class="addTags cursor-pointer">
        @好友 {{ value0.length }}/10
      </span>
    </div>
    <p v-if="activeAccountFail" class="error-tips">账号已失效，重新登录后可获取</p>
  </div>
</template>

<script>
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
import iconShezhi from '@/assets/image/video/mornetouxiang.png'
import TemplateTitle from './TemplateTitle.vue'
import { isUseNewClient } from '@/utils'
export default {
  name: 'DetailFriends',
  components: {
    TemplateTitle
  },
  mixins: [mixinsAllOperations],
  inject: ['publishChannelData'],
  data() {
    return {
      iconShezhi,
      value0: [],
      options: [],
      wechartFriend: [],
      options1: {},
      loading: false,
      checkFriends: []
    }
  },
  watch: {
    'channel.accountData': {
      handler(val) {
        this.initData()
      },
      deep: true
    }
  },
  methods: {
    async initData() {
      this.options = []
      this.checkFriends = []
      this.value0 = []
      if (this.publishChannelData?.activeData?.account?.platformAccountId) {
        const friendList = this.publishChannelData.activeData?.friends
        this.checkFriends = friendList
        this.options = friendList
        console.log(friendList, '好友列表')
        if (friendList && friendList.length > 0) {
          friendList.forEach(item => {
            this.value0.push(item.id)
          })
        }
      }
    },
    changeLv1(list) {
      console.log('触发到了change', list)
      // 删除了所有好友之后重置数据
      if (!list.length) {
        this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'friends', [])
        this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'wechartFriend', [])
        return
      }
      const checkWechartFriends = []
      list.forEach(item => {
        this.options.forEach(_item => {
          if (String(_item.id) === String(item)) {
            // 需要处理删除好友的时候 匹配item跟this.checkFriends里面没有id的情况
            const isAdd = this.checkFriends.find(i => {
              return i.id === item
            })

            if (!isAdd) {
              this.checkFriends.push(_item)
            }
            // 如果this.checkFriends里面匹配不到list里面的id，就把匹配不到的数据删除
            this.checkFriends = this.checkFriends.filter(i => {
              return list.includes(i.id)
            })
          }
          if (!_item.image) {
            _item.image = this.iconShezhi
          }
        })
        if (this.channel.id === 32) {
          this.checkFriends.forEach(_item => {
            if (String(_item.value) === String(item)) {
              checkWechartFriends.push(_item)
            }
          })
        }
      })
      console.log(this.checkFriends, checkWechartFriends, '选中好友数据。。。。')
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'friends', this.checkFriends)
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'wechartFriend', checkWechartFriends)
    },
    remoteSearchFriend(val) {
      this.loading = true
      const params = {
        platformId: this.channel.id,
        platformAccountCookie: this.publishChannelData.activeData.account.cookie,
        platformAccountToken: this.merchantToken,
        platformAccountId: this.publishChannelData.activeData.account.platformAccountId,
        newVersion: this.allChannelSwitch[this.channel.id],
        mediaTypeEnum: 'Video', // Video Article MiniVideo
        dataType: 1, // 1好友 2话题 3热点
        keyWord: val
      }
      console.log(params, '查好友的入参')
      isUseNewClient(this.channel.id, 'get-mediaTopicInfo', this.publishChannelData.activeData.account.platformAccountId, '获取好友/话题/热点').emit('get-mediaTopicInfo', JSON.stringify(params), response => {
        const { dataBody } = JSON.parse(response)
        console.log(dataBody, '好友列表')
        // 视频号
        if (this.channel.id === 32) {
          let arr = []
          arr = dataBody.reduce((pre, next) => {
            pre.push({ name: next.nickName, value: next.username, id: next.username, image: next.headImgUrl })
            return pre
          }, [])
          this.options = arr
        } else if (this.channel.id === 24) {
          let arr = []
          arr = dataBody.reduce((pre, next) => {
            pre.push({ name: next.name, value: next.id, id: next.id, image: next.headUrl })
            return pre
          }, [])
          this.options = arr
        } else {
          this.options = dataBody
        }
        this.options.forEach(_item => {
          if (!_item.image) {
            _item.image = this.iconShezhi
          }
        })
        console.log(dataBody, '好友列表')
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.account-info{
  .image{
    width:20px;
    height:20px;
    border-radius: 50%;
  }
  span{
    font-size:12px;
    margin-left:10px;
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
.addTags{
  padding: 3px 10px;
  background: #F1F5FC;
  border-radius: 4px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #777777;
}
.tagDetails{
  margin-right: 8px;
  margin-bottom: 8px;
}

.friends-cls {
  ::v-deep .el-select {
    width: 100%;
  }
}
</style>
