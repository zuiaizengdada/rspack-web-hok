<template>
  <!-- 首页右上角个人信息 -->
  <AppDialog
    v-if="config.visible"
    v-model="config.visible"
    :title="title"
    width="730px"
    height="458px"
    @success="successFn"
  >
    <div class="container">
      <AppAvatar
        class="header-avatar"
        :name="userInfo.nickName || userInfo.userName"
        width="80"
        :avatar="userInfo.avatar"
        :no-name="true"
      />
      <div class="header-info">
        <div>
          <span class="header-laber">员工姓名：</span><span> {{ data.nickName }}</span>
        </div>
        <div>
          <span class="header-laber">手机号码：</span><span>{{ data.phoneNumber }}</span>
        </div>
        <div>
          <span class="header-laber">所在部门：</span><span>{{ data.deptName }}</span>
        </div>
        <div class="text_hidden_3">
          <span class="header-laber">角色组：</span><span>{{ data.roleNames }}</span>
        </div>
      </div>
      <el-divider />
      <div>
        第三方账号绑定：<el-button
          v-if="data.thirdAccounts.length < 2"
          type="primary"
          size="small"
          icon="el-icon-plus"
          class="m-l-10"
          @click="addThirdAccounts"
        >新增</el-button>
      </div>
      <div class="thirdAccounts-container">
        <div
          v-for="(item, index) in data.thirdAccounts"
          :key="index"
          class="thirdAccountsList"
        >
          <div class="thirdAccountsListHeader">
            <span>第三方平台：{{
              getOptionsValueByKey(
                'type',
                'name',
                item.type,
                thirdAccountsTypeOption
              )
            }}
            </span>
            <div v-if="item.status!=='add'">
              <span
                v-if="item.type === 2"
                class="Unbinding border-right"
                @click="handleChangeBind(item, index)"
              >换绑</span>
              <span
                class="Unbinding"
                @click="delThirdAccounts(item, index)"
              >解绑</span>
            </div>
          </div>
          <div v-if="item.type === 2" class="thirdAccountsListContent">
            <el-image :src="item.weChat.bizWechatAvatar" class="imgAvater">
              <template slot="error">
                <img
                  src="~@/assets/image/imgloadError.png"
                  alt=""
                  style="width: 58px; height: 58px"
                />
              </template>
            </el-image>
            <div class="userInfo">
              <span>{{ item.weChat.bizWechatName }}</span>
              <span>{{ item.weChat.bizWechatAlias }}</span>
            </div>
          </div>
          <div v-else-if="item.type === 1" class="thirdAccountsListContent">
            <span>ERP员工编号: {{ item.erpCode }}</span>
          </div>
        </div>
      </div>
    </div>
    <replaceBind ref="replaceBind" @success="init" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { userPage, editUser } from '@/api/addressBookApi'
import { mapGetters } from 'vuex'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { getOptionsValueByKey } from '@/filters/index'
import { getUserBindList, unbindCheckAjax } from '@/api/user/member'
import Dialog from '@/components/Dialog/index.js'
import replaceBind from '@/components/Dialog/replaceBind'
export default {
  components: {
    AppDialog,
    AppAvatar,
    replaceBind
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false
        }
      }
    }
  },
  data() {
    return {
      title: '个人信息',
      data: {
        thirdAccounts: [],
        roleNames: ''
      },
      thirdAccountsTypeOption: [],
      ishow: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          this.init()
        }
      },
      deep: true
    }
  },

  methods: {
    getOptionsValueByKey,
    getUserBindList() {
      getUserBindList().then(res => {
        this.thirdAccountsTypeOption = res.data
      })
    },
    init() {
      this.getUserInfo()
      this.getUserBindList()
    },
    // 获取个人信息
    async getUserInfo() {
      const { data } = await userPage({ phone: this.userInfo.phoneNumber })
      const infoData = data.records[0]
      const roleNamesArray = []
      const roleIds = []
      let roleNames = ''
      infoData.roleVoList.map(v => {
        roleIds.push(v.roleId)
        roleNamesArray.push(v.roleName)
      })
      roleNames = roleNamesArray.join('、')
      const thirdAccounts = []
      if (infoData.erpId) {
        thirdAccounts.push({ type: 1, erpCode: infoData.erpId })
      }
      if (infoData.bizWechatName) {
        thirdAccounts.push({
          type: 2,
          wechatPhone: infoData.phoneNumber,
          weChat: {
            bizWechatAvatar: infoData.bizWechatAvatar || '',
            bizWechatName: infoData.bizWechatName || '',
            bizWechatAlias: infoData.bizWechatAlias || '',
            bizWechatId: infoData.bizWechatId || ''
          }
        })
      }

      this.data = { ...infoData, thirdAccounts, roleNames, roleIds }
    },
    // 点击新增第三方账号绑定
    addThirdAccounts() {
      Dialog.open({
        type: 'ThirdAccountsBind',
        phone: this.data.phoneNumber || '',
        handleDisabledFn: res => {
          const index = this.data.thirdAccounts.findIndex(v => v.type === res)
          return index !== -1
        },
        success: res => {
          this.data.thirdAccounts.push(res)
        }
      })
    },
    // 点击解绑第三方账号
    delThirdAccounts(item, index) {
      const tips = {
        1: '是否确认解绑？解绑后对应绑定的博商ERP将失效！',
        2: '是否确认解绑？解绑后对应绑定的企业微信将失效！'
      }
      this.$delModal({
        tips: tips[item.type],
        success: () => {
          if (item.type === 2) {
            unbindCheckAjax(this.data.userId).then(res => {
              if (res.code === 1) {
                this.data.thirdAccounts.splice(index, 1)
              }
            })
          } else {
            this.data.thirdAccounts.splice(index, 1)
          }
        }
      })
    },
    handleChangeBind(item) {
      this.$refs.replaceBind.open(
        item.weChat
      )
    },
    // 提交
    successFn() {
      const data = this.data
      data.thirdAccounts.map(v => {
        if (v.type === 1) {
          // 博商erp
          data.erpCode = v.erpCode
        } else if (v.type === 2) {
          // 企业微信
          data.wechatPhone = v.wechatPhone
          data.bizWechatId = v.bizWechatId
        }
      })
      const params = {
        deptId: data.deptId,
        roleIds: data.roleIds,
        status: data.status,
        userId: data.userId,
        userName: data.userName,
        nickName: data.nickName,
        employeeType: data.employeeType,
        erpCode: data.erpCode,
        wechatPhone: data.wechatPhone,
        bizWechatId: data.bizWechatId
      }
      editUser(params).then(res => {
        if (res.code === 1) {
          this.config.visible = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 24px 20px 0 20px;
  .header-avatar {
    flex-direction: row !important;
    justify-content: space-evenly !important;
  }
  .header-info {
    display: flex;
    flex-wrap: wrap;
    margin-top: 24px;
    color: #333;
    > *:nth-child(1),
    *:nth-child(3) {
      flex: 0 0 55%;
    }
    > *:nth-child(2),
    *:nth-child(4) {
      flex: 0 0 45%;
    }
    > *:nth-child(3),
    *:nth-child(4) {
      margin-top: 20px;
    }
  }
  .thirdAccounts-container {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }
  .header-laber {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
  }
  .thirdAccountsList {
    width: 336px;
    padding: 20px;
    background: #f2f9ff;
    border-radius: 8px;
    .thirdAccountsListHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .Unbinding {
        cursor: pointer;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #f53f3f;
        line-height: 22px;
      }
      .border-right {
        color: #409eff;
        border-right: 1px solid #ccc;
        margin-right: 5px;
        padding-right: 5px;
      }
    }
    .thirdAccountsListContent {
      margin-top: 16px;
      display: flex;
      .imgAvater {
        width: 58px;
        height: 58px;
        margin-right: 4px;
        overflow: hidden;
      }
      .userInfo {
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        > span:nth-child(1) {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          color: #333333;
          line-height: 20px;
        }
        > span:nth-child(2) {
          margin-top: 8px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 17px;
        }
      }
    }
  }
}
</style>
