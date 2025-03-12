<template>
  <div class="page_wrap1">
    <div v-for="(item, index) in remindList" :key="index" class="optList">
      <div class="title">{{ item.title }}</div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="item.switchFlag"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="setMediaSwitch(item.optKey)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            :loading="item.loading"
            :shop-notice-flag="item.switchFlag"
            btn-text="添加提醒人员"
            :data="item.data"
            @del="val => del(item.optKey, val,index)"
            @add="val => add(item.optKey, val,index)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="item.data"
            :biz-id="item.mediaBizId"
            :shop-notice-flag="item.switchFlag"
            :set-type="item.mediaSetType"
            :shop-feishu-group-list="item.mediaFeishuDelivered"
            :login-type="loginType"
            @getComplement="getComplement"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getItem } from '@/utils/localStorage'
import addGroup from '@/views/basicSettings/components/addGroup'
import addUser from '@/views/basicSettings/components/addUser.vue'
import {
  getSendMsgTypeConfigApi,
  getMediaRemind,
  getMediaAccount,
  getHotVideoData,
  setMediaRemind,
  setMediaAccount,
  setHotVideo
} from '@/api/deliver/baseSeeting'
const indexMapping = {
  0: { method: getMediaRemind, param: 0, setMethod: setMediaRemind },
  1: { method: getMediaAccount, param: 1, setMethod: setMediaAccount },
  3: { method: getHotVideoData, param: 2, setMethod: setHotVideo }
}
export default {
  components: {
    addGroup,
    addUser
  },
  data() {
    return {
      loginType: 'feishu',
      types: {
        feishu: '飞书',
        wecom: '企微'
      },
      remindList: [
        {
          title: '自媒体账号数据同步提醒设置',
          optKey: 'mediaDelivered',
          switchFlag: false,
          loading: false,
          data: [],
          mediaSetType: 5,
          mediaFeishuDelivered: [],
          mediaBizId: ''
        },
        {
          title: '自媒体账号操作提醒设置',
          optKey: 'mediaAccountDelivered',
          switchFlag: false,
          loading: false,
          data: [],
          mediaSetType: 9,
          mediaFeishuDelivered: [],
          mediaBizId: ''
        },
        {
          title: '自媒体爆款视频通知',
          optKey: 'hotVideoDelivered',
          switchFlag: false,
          loading: false,
          data: [],
          mediaSetType: 10,
          mediaFeishuDelivered: [],
          mediaBizId: ''
        }
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getSendMsgTypeConfig()
      this.getMediaRemindList()
      this.getMediaAccountList()
      this.getHotVideoList()
    },
    add(key, row, index) {
      console.log(row, '新增的row')
      // 改变对应 remindList 的loading状态
      const sysUserIds = row.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      this.remindList[index].loading = true
      this.addMediaSetArray(sysUserIds, index, indexMapping[index].setMethod)
    },
    del(key, index1, index) {
      console.log(this.remindList[index].data, '第几个')
      if (this.remindList[index].data.length === 1) {
        return this.$message.error('最后一个提醒人员不可删除')
      }
      // 删除this.remindList[index].data第index1个
      this.remindList[index].data.splice(index1, 1)
      this.addMediaSetArray('', index, indexMapping[index].setMethod)
    },
    async setMediaSwitch(key) {
      const index = this.remindList.findIndex(item => item.optKey === key)
      this.addMediaSetArray('', index, indexMapping[index].setMethod)
    },
    // 自媒体提醒设置
    async addMediaSetArray(sysUserIds, index, setDataFun) {
      this.remindList[index].loading = true
      const paramsArr = []
      this.remindList[index].mediaFeishuDelivered.some(item => {
        const obj = {
          chatId: item.chat_id,
          name: item.name
        }
        paramsArr.push(obj)
      })
      const ids = this.remindList[index].data.reduce((pre, next) => {
        pre.push(next.userId)
        return pre
      }, [])
      const params = {
        status: this.remindList[index].switchFlag ? 1 : 2,
        bizId: this.remindList[index].mediaBizId,
        noticeCrowd: paramsArr,
        noticePersonnel: sysUserIds || ids
      }
      const res = await setDataFun(params)
      if (res.code === 1) {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.remindList[index].loading = false
        // 根据index刷新对应的列表
        if (Object.prototype.hasOwnProperty.call(indexMapping, index)) {
          await this.getRemindList(indexMapping[index].method, indexMapping[index].param)
        }
      }
    },
    // 获取信息来源是企微还是飞书
    async getSendMsgTypeConfig() {
      try {
        const orgInfo = getItem('orgInfo')
        const { data } = await getSendMsgTypeConfigApi({
          tenantId: orgInfo.organizationId
        })
        if (data) {
          this.loginType = data === 1 ? 'feishu' : 'wecom'
          console.log('this----------------', this.loginType)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getRemindList(getDataFunc, index) {
      const res = await getDataFunc()
      if (res.code === 1) {
        res.data[0].userInfo?.some(item => {
          item.nickName = item.userName
        })
        res.data[0].noticeCrowd?.some(obj => {
          obj.chat_id = obj.chatId
        })
        this.remindList[index].switchFlag = res.data[0].status === 1
        this.remindList[index].data = res.data[0].userInfo
          ? res.data[0].userInfo
          : []
        this.remindList[index].mediaBizId = res.data[0].bizId
        this.remindList[index].mediaFeishuDelivered =
          res.data[0].noticeCrowd || []
      }
      console.log(this.remindList, '设置完成之后的this.remindList')
    },

    async getMediaRemindList() {
      await this.getRemindList(getMediaRemind, 0)
    },

    async getMediaAccountList() {
      await this.getRemindList(getMediaAccount, 1)
    },

    async getHotVideoList() {
      await this.getRemindList(getHotVideoData, 2)
    },
    //
    async getComplement(type) {
      // 根据type 匹配remindList对应的index
      const index = this.remindList.findIndex(item => item.mediaSetType === type)
      // 根据index刷新对应的列表 indexMapping.hasOwnProperty(index)
      if (Object.prototype.hasOwnProperty.call(indexMapping, index)) {
        await this.getRemindList(indexMapping[index].method, indexMapping[index].param)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap1 ::v-deep {
  height: calc(100vh - 100px);
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  padding-top: 15px;
  .title {
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
.optList {
  padding: 16px;
  box-sizing: border-box;
}
.shop-notice {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  box-sizing: border-box;
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
