<template>
    <div class="generalSetting-wrapper">
      <div class="reminderSettingsView">
            <div class="title">退款通知</div>
            <div class="m-t-8 m-b-32 shop-notice">
              <div class="shop-line">
                <span class="shop-line-label">通知开关</span>
                <el-switch
                  v-model="remindThirdShopFlag"
                  active-color="#13ce66"
                  inactive-color="#9c9c9c"
                  :disabled="
                    !remindThirdShopList.length && !remindCrowdVosList.length
                  "
                  @change="remindAdd(1, remindThirdShopList)"
                />
              </div>
              <div class="shop-line">
                <span class="shop-line-label">通知人员</span>
                <addUser
                  btn-text="添加提醒人员"
                  :loading="remindThirdShopLoading"
                  :data="remindThirdShopList"
                  @del="val => del('remindThirdShopList', val)"
                  @add="val => add('remindThirdShopList', val)"
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
                />
              </div>
            </div>
          </div>
    </div>
  </template>
  
  <script>
  import addUser from './components/addUser'
  import addGroup from '@/views/basicSettings/components/addGroup'
  import { getItem } from '@/utils/localStorage'
  import {
    getSendMsgTypeConfigApi,
    setFeishuremind,
    getApplyForRefund
  } from '@/api/deliver/baseSeeting'
  export default {
    components: {
      addUser,
      addGroup
    },
    data() {
      return {
        activeName: 'first',
        loginType: 'feishu',
        types: {
          feishu: '飞书',
          wecom: '企微'
        },
        remindThirdShopList: [],
        remindThirdShopFlag: false,
        remindCrowdVosList: [],
        remindThirdShopLoading: false,
        ruleFormOld: {},
        ruleForm: {
          status: false,
          erpType: 1,
          name: '',
          appKey: '',
          appSecret: ''
        },
        rules: {
          name: [{ required: true, message: '请输入店铺昵称', trigger: 'blur' }],
          appKey: [{ required: true, message: '请输入账号', trigger: 'blur' }],
          appSecret: [{ required: true, message: '请输入密钥', trigger: 'blur' }]
        },
        loading: false
      }
    },
    mounted() {
      this.getSendMsgTypeConfig()
      this.getApplyForRefund()
    },
    methods: {
      async getSendMsgTypeConfig() {
        try {
          const orgInfo = getItem('orgInfo')
          const { data } = await getSendMsgTypeConfigApi({
            tenantId: orgInfo.organizationId
          })
          if (data) {
            this.loginType = data === 1 ? 'feishu' : 'wecom'
          }
        } catch (error) {
          console.log(error)
        }
      },
      getComplement(setType) {
        console.log(setType, 'setType')
        if (setType === 1) {
          this.getApplyForRefund()
        }
      },
      del(key, index) {
        console.log(key, index)
        if (this[key].length === 1) {
          return this.$message.error('最后一个提醒人员不可删除')
        }
        const users = JSON.parse(JSON.stringify(this[key]))
        const type = {
          remindThirdShopList: 1 // 学员在第三方店铺申请退款/企微提醒
        }
        users.splice(index, 1)
        this.remindAdd(type[key], users)
      },
      add(key, row) {
        const type = {
          remindThirdShopList: 1 // 学员在第三方店铺申请退款/企微提醒
        }
        this[key] && (this[key] = row)
        this.remindAdd(type[key], row)
      },
      changeLoading(type) {
        if (type === 1) {
          this.remindThirdShopLoading = !this.remindThirdShopLoading
        }
      },
      // 新增
      remindAdd(type, row) {
        this.changeLoading(type)
        const sysUserIds = row.reduce((pre, next) => {
          pre.push(next.userId)
          return pre
        }, [])
        if (type === 1) {
          const remindCrowdVos = this.remindCrowdVosList.map(item => ({
            crowdId: item.chat_id,
            crowdName: item.name
          }))
          const data = {
            sysUserIds,
            type,
            remindCrowdVos,
            onOff: this.remindThirdShopFlag ? 1 : 0
          }
          setFeishuremind(data)
            .then(res => {
              this.changeLoading(type)
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.getListByType(type)
            })
            .catch(() => {
              this.changeLoading(type)
            })
          return
        }
      },
      getListByType(type) {
        if (type === 1) {
          this.getApplyForRefund()
        }
      },
      getApplyForRefund() {
        this.remindThirdShopLoading = true
        getApplyForRefund()
          .then(res => {
            if (res?.data?.sysUserIds?.length) {
              this.remindThirdShopList = res?.data?.sysUserIds?.map(item => ({
                nickName: item.sysUserName,
                userId: item.sysUserId
              }))
            }
            if (res?.data?.remindCrowdVos?.length) {
              this.remindCrowdVosList = res?.data?.remindCrowdVos?.map(item => ({
                name: item.crowdName,
                chat_id: item.crowdId
              }))
            } else {
              this.remindCrowdVosList = []
            }
            this.remindThirdShopFlag = !!res?.data?.onOff
            this.remindThirdShopLoading = false
          })
          .catch(() => {
            this.remindThirdShopLoading = false
          })
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .generalSetting-wrapper {
    position: relative;
    background-color: #fff;
    padding: 20px;
  }
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
  .info {
    display: flex;
    align-items: center;
    border-radius: 4px;
    background: #e7f0ff;
    padding: 9px;
    font-size: 14px;
    margin-bottom: 12px;
    width: 56%;
  }
  </style>
  