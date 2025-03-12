<template>
  <MCard class="myCard overflowOuto">
    <!-- <div class="reminderSettingsTitle">提醒设置</div> -->
    <div class="reminderSettingsView">
      <div class="title">抖音小程序审核通知</div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="tikTokFlag"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="val => handleTikTokSwitch(val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            btn-text="添加提醒人员"
            :loading="tikTokLoading"
            :shop-notice-flag="tikTokFlag"
            :data="tikTokList"
            @del="val => delTikTokList(val)"
            @add="val => addTikTokList(val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知企微群</span>
          <addGroup
            :shop-notice-flag="tikTokFlag"
            :shop-feishu-group-list="remindCrowdVosList"
            :set-type="19"
            :login-type="loginType"
            @setRemindInfo="handleSetRemindInfo"
          />
        </div>
      </div>
    </div>
  </MCard>
</template>

<script>
import addUser from './components/addUser'
import addGroup from '@/views/basicSettings/components/addGroup'
import {
  getRemindInfo,
  setRemindInfo
} from '@/api/deliver/baseSeeting'
export default {
  components: {
    addUser,
    addGroup
  },
  data() {
    return {
      loginType: 'wecom',
      tikTokList: [],
      tikTokFlag: false,
      remindCrowdVosList: [],
      groupList: [],
      loading: false,
      tikTokLoading: false
    }
  },
  mounted() {
    this.getRemindInfo()
  },
  methods: {
    async setRemindInfo(data) {
      const res = await setRemindInfo({ ...data })
      this.$notify.success({ title: '提示', message: '操作成功' })
      if (res.code === 1) this.getRemindInfo()
      this.tikTokLoading = false
    },
    handleTikTokSwitch(val) {
      const groupReqs = this.remindCrowdVosList?.map(i => {
        return {
          groupName: i.name,
          chatId: i.chat_id
        }
      })
      const obj = {
        isRemind: val ? 1 : 0,
        sysUserIds: this.tikTokList?.map(item => item.userId),
        type: 1,
        groupReqs
      }
      this.setRemindInfo(obj)
    },
    // C端运营提醒设置
    async getRemindInfo() {
      const res = await getRemindInfo({ type: 1 })
      this.tikTokList = res?.data?.sysUserList
      this.tikTokList?.some(item => {
        item.userId = item.sysUserId
        item.nickName = item.sysUserName
      }) ?? []
      this.remindCrowdVosList = res?.data?.groupReqs?.map(i => {
        return {
          chat_id: i.chatId,
          name: i.groupName
        }
      }) ?? []
      this.tikTokFlag = !!res?.data.isRemind
    },
    async delTikTokList(index) {
      if (this.tikTokList?.length === 1) {
        return this.$message.error('最后一个提醒人员不可删除')
      }
      const users = JSON.parse(JSON.stringify(this.tikTokList))
      users.splice(index, 1)
      this.tikTokLoading = true
      const groupReqs = this.remindCrowdVosList?.map(i => {
        return {
          groupName: i.name,
          chatId: i.chat_id
        }
      })
      const obj = {
        isRemind: this.tikTokFlag ? 1 : 0,
        sysUserIds: users.map(item => item.userId),
        type: 1,
        notifyType: 1,
        groupReqs
      }
      this.setRemindInfo(obj)
    },
    async addTikTokList(data) {
      const groupReqs = this.remindCrowdVosList?.map(i => {
        return {
          groupName: i.name,
          chatId: i.chat_id
        }
      })
      const obj = {
        isRemind: this.tikTokFlag ? 1 : 0,
        sysUserIds: data.map(item => item.userId),
        type: 1,
        notifyType: 1,
        groupReqs
      }
      this.tikTokLoading = true
      this.setRemindInfo(obj)
    },
    handleSetRemindInfo(groupReqs) {
      const params = {
        groupReqs: groupReqs?.map(i => {
          return {
            groupName: i.name,
            chatId: i.chatId
          }
        }) ?? [],
        sysUserIds: this.tikTokList?.map(item => item.userId),
        isRemind: this.tikTokFlag ? 1 : 0,
        notifyType: 2,
        type: 1
      }
      this.setRemindInfo(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.crmTitle {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  line-height: 1.2;
  padding-left: 4px;
  border-left: 3px solid #0c6fff;
  margin-bottom: 20px;
}
.reminderSettingsTitle {
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 24px;
  padding-bottom: 20px;
  margin: 0 20px;
  border-bottom: 1px solid #e7e7e7;
}
.reminderSettingsView {
  padding: 20px;
  > .title {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
    > span {
      font-size: 14px;
      font-weight: 400;
      color: #777777;
      line-height: 24px;
    }
  }
}
.m-b-32 {
  margin-bottom: 32px;
}

.shop-notice {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  width: 100%;
  display: inline-block;
  .shop-line {
    float: left;
    width: 100%;
    margin-bottom: 10px;
    ::v-deep .assessBox {
      padding: 0;
      border: none;
    }

    .shop-line-text-box {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      .inputNumber {
        width: 130px;
      }
      > div:nth-of-type(2) {
        padding-left: 100px;
        font-size: 12px;
        font-weight: 400;
        color: #777777;
        line-height: 22px;
        margin-top: 10px;
        margin-bottom: 22px;
      }
    }
    .shop-line-label {
      float: left;
      font-size: 12px;
      width: 100px;
      line-height: 28px;
      color: #333;
    }
  }
  .boxText {
    font-size: 14px;
  }
}
</style>
