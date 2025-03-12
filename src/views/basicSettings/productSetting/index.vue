<template>
  <MCard class="myCard overflowOuto">
    <div class="reminderSettingsTitle">产品状态提醒设置</div>
    <div class="reminderSettingsView">
      <div class="title">产品制作中通知{{ types[loginType] }}提醒设置</div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="remindThirdShopFlag"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="remindAdd(1, remindThirdShopFlag,remindThirdShopList,remindCrowdVosList)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            btn-text="添加提醒人员"
            :loading="remindThirdShopLoading"
            :data="remindThirdShopList"
            @del="val => del(1, val)"
            @add="val => add(1, val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="remindThirdShopList"
            :shop-notice-flag="remindThirdShopFlag"
            :shop-feishu-group-list="remindCrowdVosList"
            :set-type="1"
            :login-type="loginType"
            @getComplement="getComplement"
            @deleteGroup="deleteGroup"
          />
        </div>
      </div>
      <div class="title">产品待分配通知{{ types[loginType] }}提醒设置</div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="remindThirdShopFlag2"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="remindAdd(2, remindThirdShopFlag2,remindThirdShopList2,remindCrowdVosList2)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            btn-text="添加提醒人员"
            :loading="remindThirdShopLoading2"
            :data="remindThirdShopList2"
            @del="val => del(2, val)"
            @add="val => add(2, val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="remindThirdShopList2"
            :shop-notice-flag="remindThirdShopFlag2"
            :shop-feishu-group-list="remindCrowdVosList2"
            :set-type="2"
            :login-type="loginType"
            @getComplement="getComplement"
            @deleteGroup="deleteGroup"
          />
        </div>
      </div>
      <div class="title">产品待上架通知{{ types[loginType] }}提醒设置</div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="remindThirdShopFlag3"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="remindAdd(3, remindThirdShopFlag3,remindThirdShopList3,remindCrowdVosList3)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            btn-text="添加提醒人员"
            :loading="remindThirdShopLoading3"
            :data="remindThirdShopList3"
            @del="val => del(3, val)"
            @add="val => add(3, val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="remindThirdShopList3"
            :shop-notice-flag="remindThirdShopFlag3"
            :shop-feishu-group-list="remindCrowdVosList3"
            :set-type="3"
            :login-type="loginType"
            @getComplement="getComplement"
            @deleteGroup="deleteGroup"
          />
        </div>
      </div>
      <div class="title">产品已上架通知{{ types[loginType] }}提醒设置</div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="remindThirdShopFlag4"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="remindAdd(4, remindThirdShopFlag4,remindThirdShopList4,remindCrowdVosList4)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            btn-text="添加提醒人员"
            :loading="remindThirdShopLoading4"
            :data="remindThirdShopList4"
            @del="val => del(4, val)"
            @add="val => add(4, val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="remindThirdShopList4"
            :shop-notice-flag="remindThirdShopFlag4"
            :shop-feishu-group-list="remindCrowdVosList4"
            :set-type="4"
            :login-type="loginType"
            @getComplement="getComplement"
            @deleteGroup="deleteGroup"
          />
        </div>
      </div>
      <div class="title">产品已宣发通知{{ types[loginType] }}提醒设置</div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="remindThirdShopFlag5"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="remindAdd(5, remindThirdShopFlag5,remindThirdShopList5,remindCrowdVosList5)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            btn-text="添加提醒人员"
            :loading="remindThirdShopLoading5"
            :data="remindThirdShopList5"
            @del="val => del(5, val)"
            @add="val => add(5, val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="remindThirdShopList5"
            :shop-notice-flag="remindThirdShopFlag5"
            :shop-feishu-group-list="remindCrowdVosList5"
            :set-type="5"
            :login-type="loginType"
            @getComplement="getComplement"
            @deleteGroup="deleteGroup"
          />
        </div>
      </div>
      <div class="title">产品更新通知{{ types[loginType] }}提醒设置</div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="remindThirdShopFlag6"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="remindAdd(6, remindThirdShopFlag6,remindThirdShopList6,remindCrowdVosList6)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            btn-text="添加提醒人员"
            :loading="remindThirdShopLoading6"
            :data="remindThirdShopList6"
            @del="val => del(6, val)"
            @add="val => add(6, val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="remindThirdShopList6"
            :shop-notice-flag="remindThirdShopFlag6"
            :shop-feishu-group-list="remindCrowdVosList6"
            :set-type="6"
            :login-type="loginType"
            @getComplement="getComplement"
            @deleteGroup="deleteGroup"
          />
        </div>
      </div>
      <div class="title">产品已下架通知{{ types[loginType] }}提醒设置</div>
      <div class="m-t-8 m-b-32 shop-notice">
        <div class="shop-line">
          <span class="shop-line-label">通知开关</span>
          <el-switch
            v-model="remindThirdShopFlag7"
            active-color="#13ce66"
            inactive-color="#9c9c9c"
            @change="remindAdd(7, remindThirdShopFlag7,remindThirdShopList7,remindCrowdVosList7)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知人员</span>
          <addUser
            btn-text="添加提醒人员"
            :loading="remindThirdShopLoading7"
            :data="remindThirdShopList7"
            @del="val => del(7, val)"
            @add="val => add(7, val)"
          />
        </div>
        <div class="shop-line">
          <span class="shop-line-label">通知{{ types[loginType] }}群</span>
          <addGroup
            :dianpu-delivered="remindThirdShopList7"
            :shop-notice-flag="remindThirdShopFlag7"
            :shop-feishu-group-list="remindCrowdVosList7"
            :set-type="7"
            :login-type="loginType"
            @getComplement="getComplement"
            @deleteGroup="deleteGroup"
          />
        </div>
      </div>
    </div>
  </MCard>
</template>

<script>
import addUser from '@/views/basicSettings/components/addUser.vue'
import addGroup from '@/views/basicSettings/components/addGroupProduct'
import {
  getProductSettingData,
  setProductSettingData
} from '@/api/deliver/baseSeeting'

// import { getItem } from '@/utils/localStorage'
export default {
  components: {
    addUser,
    addGroup
  },
  data() {
    return {
      remindCrowdVosList: [],
      remindThirdShopList: [],
      remindThirdShopLoading: false,
      remindThirdShopFlag: false,
      remindCrowdVosList2: [],
      remindThirdShopList2: [],
      remindThirdShopLoading2: false,
      remindThirdShopFlag2: false,
      remindCrowdVosList3: [],
      remindThirdShopList3: [],
      remindThirdShopLoading3: false,
      remindThirdShopFlag3: false,
      remindCrowdVosList4: [],
      remindThirdShopList4: [],
      remindThirdShopLoading4: false,
      remindThirdShopFlag4: false,
      remindCrowdVosList5: [],
      remindThirdShopList5: [],
      remindThirdShopLoading5: false,
      remindThirdShopFlag5: false,
      remindCrowdVosList6: [],
      remindThirdShopList6: [],
      remindThirdShopLoading6: false,
      remindThirdShopFlag6: false,
      remindCrowdVosList7: [],
      remindThirdShopList7: [],
      remindThirdShopLoading7: false,
      remindThirdShopFlag7: false,
      loginType: 'wecom',
      types: {
        feishu: '飞书',
        wecom: '企微'
      }
    }
  },
  mounted() {
    this.getProductData()
  },
  methods: {
    getProductData() {
      getProductSettingData().then(res => {
        if (res.code === 1) {
          res.data.some(item => {
            if (item.bizScene === 1) {
              this.remindThirdShopList = []
              item?.userInfo.some(obj => {
                obj.nickName = obj.userName
                this.remindThirdShopList.push(obj)
              })
              this.remindCrowdVosList = item.noticeCrowd ? item.noticeCrowd : []
              this.remindCrowdVosList?.some(item => {
                item.chat_id = item.chatId
              })
              this.remindThirdShopFlag = item.status === 1
            }
            if (item.bizScene === 2) {
              this.remindThirdShopList2 = []
              item?.userInfo.some(obj => {
                obj.nickName = obj.userName
                this.remindThirdShopList2.push(obj)
              })
              this.remindCrowdVosList2 = item.noticeCrowd ? item.noticeCrowd : []
              this.remindCrowdVosList2?.some(item => {
                item.chat_id = item.chatId
              })
              this.remindThirdShopFlag2 = item.status === 1
            }
            if (item.bizScene === 3) {
              this.remindThirdShopList3 = []
              item?.userInfo.some(obj => {
                obj.nickName = obj.userName
                this.remindThirdShopList3.push(obj)
              })
              this.remindCrowdVosList3 = item.noticeCrowd ? item.noticeCrowd : []
              this.remindCrowdVosList3?.some(item => {
                item.chat_id = item.chatId
              })
              this.remindThirdShopFlag3 = item.status === 1
            }
            if (item.bizScene === 4) {
              this.remindThirdShopList4 = []
              item?.userInfo.some(obj => {
                obj.nickName = obj.userName
                this.remindThirdShopList4.push(obj)
              })
              this.remindCrowdVosList4 = item.noticeCrowd ? item.noticeCrowd : []
              this.remindCrowdVosList4?.some(item => {
                item.chat_id = item.chatId
              })
              this.remindThirdShopFlag4 = item.status === 1
            }
            if (item.bizScene === 5) {
              this.remindThirdShopList5 = []
              item?.userInfo.some(obj => {
                obj.nickName = obj.userName
                this.remindThirdShopList5.push(obj)
              })
              this.remindCrowdVosList5 = item.noticeCrowd ? item.noticeCrowd : []
              this.remindCrowdVosList5?.some(item => {
                item.chat_id = item.chatId
              })
              this.remindThirdShopFlag5 = item.status === 1
            }
            if (item.bizScene === 6) {
              this.remindThirdShopList6 = []
              item?.userInfo.some(obj => {
                obj.nickName = obj.userName
                this.remindThirdShopList6.push(obj)
              })
              this.remindCrowdVosList6 = item.noticeCrowd ? item.noticeCrowd : []
              this.remindCrowdVosList6?.some(item => {
                item.chat_id = item.chatId
              })
              this.remindThirdShopFlag6 = item.status === 1
            }
            if (item.bizScene === 7) {
              this.remindThirdShopList7 = []
              item?.userInfo.some(obj => {
                obj.nickName = obj.userName
                this.remindThirdShopList7.push(obj)
              })
              this.remindCrowdVosList7 = item.noticeCrowd ? item.noticeCrowd : []
              this.remindCrowdVosList7?.some(item => {
                item.chat_id = item.chatId
              })
              this.remindThirdShopFlag7 = item.status === 1
            }
          })
        }
      })
    },
    updateProductData(type, flag, userArray, groupArray) {
      const noticePersonnel = []
        userArray?.some(item => {
          noticePersonnel.push(item.userId)
        })
        groupArray?.some(obj => {
          obj.chatId = obj.chat_id
          delete (obj.chat_id)
        })
        const params = {
          bizScene: type,
          noticeCrowd: groupArray,
          noticePersonnel: noticePersonnel,
          status: flag ? 1 : 2
        }
        setProductSettingData(params).then(res => {
          console.log(res)
          if (res.code === 1) {
            this.$message.success('修改成功！')
            this.getProductData()
          }
        })
    },
    remindAdd(type, flag, userArray, groupArray) {
      this.updateProductData(type, flag, userArray, groupArray)
    },
    del(key, index) {
      console.log(key)
      if (key === 1) {
        this.remindThirdShopList.splice(index)
        this.updateProductData(key, this.remindThirdShopFlag, this.remindThirdShopList, this.remindCrowdVosList)
      }
      if (key === 2) {
        this.remindThirdShopList2.splice(index)
        this.updateProductData(key, this.remindThirdShopFlag2, this.remindThirdShopList2, this.remindCrowdVosList2)
      }
      if (key === 3) {
        this.remindThirdShopList3.splice(index)
        this.updateProductData(key, this.remindThirdShopFlag3, this.remindThirdShopList3, this.remindCrowdVosList3)
      }
      if (key === 4) {
        this.remindThirdShopList4.splice(index)
        this.updateProductData(key, this.remindThirdShopFlag4, this.remindThirdShopList4, this.remindCrowdVosList4)
      }
      if (key === 5) {
        this.remindThirdShopList5.splice(index)
        this.updateProductData(key, this.remindThirdShopFlag5, this.remindThirdShopList5, this.remindCrowdVosList5)
      }
      if (key === 6) {
        this.remindThirdShopList6.splice(index)
        this.updateProductData(key, this.remindThirdShopFlag6, this.remindThirdShopList6, this.remindCrowdVosList6)
      }
      if (key === 7) {
        this.remindThirdShopList5.splice(index)
        this.updateProductData(key, this.remindThirdShopFlag7, this.remindThirdShopList7, this.remindCrowdVosList7)
      }
    },
    add(key, row) {
      if (key === 1) {
        this.remindThirdShopList = row?.map(item => ({
          nickName: item.userName,
          userId: item.userId
        }))
        this.updateProductData(key, this.remindThirdShopFlag, this.remindThirdShopList, this.remindCrowdVosList)
      }
      if (key === 2) {
        this.remindThirdShopList2 = row?.map(item => ({
          nickName: item.userName,
          userId: item.userId
        }))
        this.updateProductData(key, this.remindThirdShopFlag2, this.remindThirdShopList2, this.remindCrowdVosList2)
      }
      if (key === 3) {
        this.remindThirdShopList3 = row?.map(item => ({
          nickName: item.userName,
          userId: item.userId
        }))
        this.updateProductData(key, this.remindThirdShopFlag3, this.remindThirdShopList3, this.remindCrowdVosList3)
      }
      if (key === 4) {
        this.remindThirdShopList4 = row?.map(item => ({
          nickName: item.userName,
          userId: item.userId
        }))
        this.updateProductData(key, this.remindThirdShopFlag4, this.remindThirdShopList4, this.remindCrowdVosList4)
      }
      if (key === 5) {
        this.remindThirdShopList5 = row?.map(item => ({
          nickName: item.userName,
          userId: item.userId
        }))
        this.updateProductData(key, this.remindThirdShopFlag5, this.remindThirdShopList5, this.remindCrowdVosList5)
      }
      if (key === 6) {
        this.remindThirdShopList6 = row?.map(item => ({
          nickName: item.userName,
          userId: item.userId
        }))
        this.updateProductData(key, this.remindThirdShopFlag6, this.remindThirdShopList6, this.remindCrowdVosList6)
      }
      if (key === 7) {
        this.remindThirdShopList7 = row?.map(item => ({
          nickName: item.userName,
          userId: item.userId
        }))
        this.updateProductData(key, this.remindThirdShopFlag7, this.remindThirdShopList7, this.remindCrowdVosList7)
      }
    },
    deleteGroup(setType, index) {
      if (setType === 1) {
        this.remindCrowdVosList.splice(index)
        this.updateProductData(setType, this.remindThirdShopFlag, this.remindThirdShopList, this.remindCrowdVosList)
      }
      if (setType === 2) {
        this.remindCrowdVosList2.splice(index)
        this.updateProductData(setType, this.remindThirdShopFlag2, this.remindThirdShopList2, this.remindCrowdVosList2)
      }
      if (setType === 3) {
        this.remindCrowdVosList3.splice(index)
        this.updateProductData(setType, this.remindThirdShopFlag3, this.remindThirdShopList3, this.remindCrowdVosList3)
      }
      if (setType === 4) {
        this.remindCrowdVosList4.splice(index)
        this.updateProductData(setType, this.remindThirdShopFlag4, this.remindThirdShopList4, this.remindCrowdVosList4)
      }
      if (setType === 5) {
        this.remindCrowdVosList5.splice(index)
        this.updateProductData(setType, this.remindThirdShopFlag5, this.remindThirdShopList5, this.remindCrowdVosList5)
      }
      if (setType === 6) {
        this.remindCrowdVosList6.splice(index)
        this.updateProductData(setType, this.remindThirdShopFlag6, this.remindThirdShopList6, this.remindCrowdVosList6)
      }
      if (setType === 7) {
        this.remindCrowdVosList7.splice(index)
        this.updateProductData(setType, this.remindThirdShopFlag7, this.remindThirdShopList7, this.remindCrowdVosList7)
      }
    },
    // 查询店铺漏单设置信息
    getComplement(obj, setType) {
      if (setType === 1) {
        let hasSame = false
        this.remindCrowdVosList?.some(item => {
          if (item.chatId === obj.chat_id) {
            hasSame = true
          }
        })
        if (hasSame) {
          this.$message.error('请勿重复添加同一个群！')
          return
        } else {
          this.remindCrowdVosList.push(obj)
        }
        this.updateProductData(setType, this.remindThirdShopFlag, this.remindThirdShopList, this.remindCrowdVosList)
      }
      if (setType === 2) {
        let hasSame = false
        this.remindCrowdVosList2?.some(item => {
          if (item.chatId === obj.chat_id) {
            hasSame = true
          }
        })
        if (hasSame) {
          this.$message.error('请勿重复添加同一个群！')
          return
        } else {
          this.remindCrowdVosList2.push(obj)
        }
        this.updateProductData(setType, this.remindThirdShopFlag2, this.remindThirdShopList2, this.remindCrowdVosList2)
      }
      if (setType === 3) {
        let hasSame = false
        this.remindCrowdVosList3?.some(item => {
          if (item.chatId === obj.chat_id) {
            hasSame = true
          }
        })
        if (hasSame) {
          this.$message.error('请勿重复添加同一个群！')
          return
        } else {
          this.remindCrowdVosList3.push(obj)
        }
        this.updateProductData(setType, this.remindThirdShopFlag3, this.remindThirdShopList3, this.remindCrowdVosList3)
      }
      if (setType === 4) {
        let hasSame = false
        this.remindCrowdVosList4?.some(item => {
          if (item.chatId === obj.chat_id) {
            hasSame = true
          }
        })
        if (hasSame) {
          this.$message.error('请勿重复添加同一个群！')
          return
        } else {
          this.remindCrowdVosList4.push(obj)
        }
        this.updateProductData(setType, this.remindThirdShopFlag4, this.remindThirdShopList4, this.remindCrowdVosList4)
      }
      if (setType === 5) {
        let hasSame = false
        this.remindCrowdVosList5?.some(item => {
          if (item.chatId === obj.chat_id) {
            hasSame = true
          }
        })
        if (hasSame) {
          this.$message.error('请勿重复添加同一个群！')
          return
        } else {
          this.remindCrowdVosList5.push(obj)
        }
        this.updateProductData(setType, this.remindThirdShopFlag5, this.remindThirdShopList5, this.remindCrowdVosList5)
      }
      if (setType === 6) {
        let hasSame = false
        this.remindCrowdVosList6?.some(item => {
          if (item.chatId === obj.chat_id) {
            hasSame = true
          }
        })
        if (hasSame) {
          this.$message.error('请勿重复添加同一个群！')
          return
        } else {
          this.remindCrowdVosList6.push(obj)
        }
        this.updateProductData(setType, this.remindThirdShopFlag6, this.remindThirdShopList6, this.remindCrowdVosList6)
      }
      if (setType === 7) {
        let hasSame = false
        this.remindCrowdVosList7?.some(item => {
          if (item.chatId === obj.chat_id) {
            hasSame = true
          }
        })
        if (hasSame) {
          this.$message.error('请勿重复添加同一个群！')
          return
        } else {
          this.remindCrowdVosList7.push(obj)
        }
        this.updateProductData(setType, this.remindThirdShopFlag7, this.remindThirdShopList7, this.remindCrowdVosList7)
      }
    }
  }
}
</script>

  <style lang="scss" scoped>
  .myCard {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
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
