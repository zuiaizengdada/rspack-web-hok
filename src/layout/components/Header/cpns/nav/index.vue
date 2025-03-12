<template>
  <div class="navbar">
    <hamburger
      v-if="device === 'mobile'"
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <!-- 提示修改 -->
    <!-- <div v-if="isChrome" class="left_tips">
      <account-sync-tips />
      <fuxiTips @openDownloadModal="openDownloadModal" />
      <DownloadModal ref="DownloadModal" />
    </div>
    <div v-else /> -->
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <div v-if="getAuthorityShowAI" class="ai-icon" @click="openAIPage">
          <img
            class="ai-icon-img"
            src="@/assets/image/aigc/digitalVideoManage/ai-icon-head.png"
          />
          <span>AI管家</span>
        </div>
        <TrainVideo />
        <!-- <cloudDesktop
          ref="cloudDesktop" 
          @openDetails="openDetails"
        /> --> 
        <!-- <cloudDeskDetails v-if="hasCloudDesktop" ref="cloudDeskDetails" /> -->

        <task v-if="showTask" id="header-task" class="right-menu-item" />

        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->
        <download-header class="right-menu-item" />
        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
        <!-- <el-popover
          placement="bottom-end"
          width="352"
          trigger="hover"
          popper-class="popover-container"
        >
          <div slot="reference" class="popover-img right-menu-item">
            <img src="@/assets/image/app_icon.png" alt="">
            <span>APP</span>
          </div>
          <div class="popover-header">
            <div class="driver" />
            <span>扫码下载App</span>
            <div class="driver" />
          </div>
          <div class="popover-content">
            <div class="popover-content__item">
              <AppQrcode :size="120" class="qrcode" :margin="0" :src="iosUrl" />
              <span>IOS下载</span>
            </div>
            <div class="driver" />
            <div class="popover-content__item">
              <AppQrcode :size="120" class="qrcode" :margin="0" :src="androidUrl" />
              <span>Android下载</span>
            </div>
          </div>
        </el-popover> -->
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <!-- @mouseenter="getOrghasFeishu" -->
        <div class="avatar-wrapper">
          <AppAvatar
            :name="userInfo.nickName || userInfo.userName"
            width="35"
            :avatar="userInfo.avatar"
            :no-name="true"
          />
          <!-- <el-tooltip
            popper-class="z-i-1002"
            :manual="true"
            effect="dark"
            content="检测到您的账号未绑定飞书，请前往绑定"
            placement="bottom-end"
          >
            <AppAvatar
              :name="userInfo.nickName || userInfo.userName"
              width="40"
              :avatar="userInfo.avatar"
              :no-name="true"
            />
          </el-tooltip> -->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link> -->
          <router-link to="/">
            <el-dropdown-item>
              <svg-icon icon-class="navbar_home" class-name="m-r-10 w_16" />
              <span class="dropdownItemText">首页</span>
            </el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a> -->
          <el-dropdown-item @click.native="showUserInfo()">
            <svg-icon icon-class="navbar_userinfo" class-name="m-r-10 w_16" />
            <span class="dropdownItemText">个人信息</span>
          </el-dropdown-item>
          <el-dropdown-item
            @click.native="toUserDetails()"
            v-if="getAuthEmployeeInfoDetail"
          >
            <svg-icon icon-class="navbar_userinfo" class-name="m-r-10 w_16" />
            <span class="dropdownItemText">员工信息</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="updatePassword()">
            <svg-icon icon-class="navbar_password" class-name="m-r-10 w_16" />
            <span class="dropdownItemText">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="onhandleSwitchAccount()">
            <svg-icon icon-class="navbar_org" class-name="m-r-10 w_16" />
            <span class="dropdownItemText">切换账号</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="onhandleSwitchOrg()">
            <svg-icon icon-class="navbar_org" class-name="m-r-10 w_16" />
            <span class="dropdownItemText">切换机构</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="bindingClick()">
            <svg-icon icon-class="navbar_bd" class-name="m-r-10 w_16" />
            <span class="dropdownItemText">解绑/绑定</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">
              <svg-icon icon-class="navbar_logout" class-name="m-r-10 w_16" />
              <span class="dropdownItemText">退出登录</span>
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <PasswordModal :config="config" />
    <homeUserInfo :config="userInfoConfig" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import AppQrcode from '@/components/AppQrcode'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
// import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'
import Task from '@/components/HeaderTask'
import DownloadHeader from '@/components/HeaderDownload'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import PasswordModal from '@/components/Modal/login/passwordModal.vue'
import homeUserInfo from '@/components/Modal/user/homeUserInfo.vue'
// import cloudDesktop from '@/components/cloudDesktop'
// import cloudDeskDetails from '@/layout/components/cloudDeskDetails'
import { getItem } from '@/utils/localStorage'
import TrainVideo from '@/components/TrainVideo/index.vue'
// import fuxiTips from '@/components/fuxiTips/index'
// import accountSyncTips from '@/components/AccountSyncTips/index'
// import DownloadModal from '@/components/DownloadModal/index.vue'
import { getBrowser2UserAgent } from '@/utils/index'
import eventBus from '@/utils/eventBus'
import Dialog from '@/components/Dialog/index.js'
import { getCurrentPersonnelBaseInfoIdAjax } from '@/api/businessAdmin/talentFile'

import { logoutForUser } from '@/api/login.js'
// import {
//   getUserInfoByUserId,
//   getOrganizationIdByAppId
// } from '@/api/user/member'
export default {
  components: {
    // Breadcrumb,
    Hamburger,
    // ErrorLog,
    AppAvatar,
    // cloudDeskDetails, 
    // SizeSelect,
    // Search,
    Task,
    DownloadHeader,
    PasswordModal,
    // cloudDesktop,
    TrainVideo,
    homeUserInfo
  },
  data() {
    return {
      config: {
        visible: false
      },
      showTask: true,
      isChrome: true,
      androidUrl: process.env.VUE_APP_ANDROID_DOWNLOAD_URL,
      iosUrl: process.env.VUE_APP_IOS_DOWNLOAD_URL,
      userInfoConfig: {
        visible: false
      },
      feishuAccount: {
        // 飞书账号信息
        loading: false,
        feishuAccount: false, // 当前机构是否开启了飞书扫码的配置
        ifBindUser: false, // 是否绑定了飞书账号
        userInfo: {
          avatar_big: '',
          avatar_middle: '',
          mobile: '',
          name: '',
          open_id: ''
        } // 绑定的飞书账号信息
      },
      showTips: false,
      // 不需要显示助手的路由
      notRouters: ['/login', '/auth-redirect', '/loginByPassword', '/404'],
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters([
      'device',
      'sidebar',
      'avatar',
      'userInfo',
      'device',
      'permission_routes',
      'hasCloudDesktop'
    ]),
    getAuthorityShowAI() {
      const info = this.permission_routes?.find(v => v.path === 'component')
      let isPermission = false
      if (info) {
        isPermission = info.meta
          ? info.meta.permsList.filter(f => f === 'system:ai:assistant')
              .length > 0
          : false
      }
      return (
        this.notRouters.indexOf(this.$route.path) === -1 &&
        !!this.$store.getters.token &&
        isPermission
      )
    },
    //员工信息先只获客展示
    getAuthEmployeeInfoDetail() {
      const info = this.permission_routes?.find(v => v.path === 'component')
      let isPermission = false
      if (info) {
        isPermission = info.meta
          ? info.meta.permsList.filter(
              f => f === 'system:user:employeeInfoDetail'
            ).length > 0
          : false
      }
      return !!this.$store.getters.token && isPermission
    }
  },
  mounted() {
    const data = getItem('orgInfo')
    if (data.organizationId === 1000) {
      this.showTask = true
    }
  },
  destroyed() {},
  created() {
    const browserType = getBrowser2UserAgent()
    this.isChrome = browserType === 'isChrome'
    this.permissList()
    // this.getOrghasFeishu()
  },
  methods: {
    openAIPage() {
      const aiShowType = this.$store?.getters['ai/aiShowType'] || 0
      eventBus.$emit('aiOpen', aiShowType)
    },
    openDownloadModal() {
      this.$refs.DownloadModal.show()
    },
    // 打来云桌面详情弹窗
    openDetails(data) {
      console.log('打来云桌面详情弹窗', data)
      this.$refs.cloudDesktop.closePopover()
      this.$refs.cloudDeskDetails.show(data.userEcsId)
      // this.$router.push('/cloudDesktop')
    },
    updatePassword() {
      this.config.visible = true
    },
    // 显示个人信息
    showUserInfo() {
      this.userInfoConfig.visible = true
    },
    //员工详情
    toUserDetails() {
      if (!this.userInfo.personnelBaseInfoId) {
        return this.$message.error('人员基础信息id不存在')
      }
      const personnelBaseInfoId = this.userInfo.personnelBaseInfoId
      this.$router.push({
        path: '/businessAdmin/talentFile/employeeInfoDetail',
        query: {
          personnelInfoId: personnelBaseInfoId,
          candidateId: personnelBaseInfoId,
          currentComponent: 'WaitingEntryList',
          currentBackUrl: '/home'
        }
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      localStorage.removeItem('system_router')
      localStorage.removeItem('myProjectChooseObj')
      localStorage.removeItem('materialChooseObj')
      localStorage.removeItem('shareChooseObj')
      localStorage.removeItem('materialTreeOpenCodeArr')
      localStorage.removeItem('myProjectTreeOpenCodeArr')
      localStorage.removeItem('shareTreeOpenCodeArr')
      const res = await logoutForUser()
      console.log(res.code) 
      this.$store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
      // await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 获取用户基础权限数组

    permissList() {
      const obj = this.permission_routes?.find(v => v.path === 'component')
      if (obj && obj?.meta?.permsList.length > 0) {
        const hasCloudDesktop = obj.meta.permsList.includes(
          'web:cloudDesktop:btn'
        )
        this.$store.commit('user/SET_HasCloudDesktop', hasCloudDesktop)
      }
    },
    // 点击切换机构按钮
    onhandleSwitchOrg() {
      console.log(this.userInfo.userId)
      Dialog.open({
        type: 'SwitchOrg',
        visible: true,
        userId: this.userInfo.userId,
        success: res => {}
      })
    },
    // 点击切换账号
    onhandleSwitchAccount() {
      Dialog.open({
        type: 'SwitchAccount',
        visible: true,
        userId: this.userInfo.userId,
        success: res => {}
      })
    },
    // getUserInfoByUserId() {
    //   this.feishuAccount.loading = true
    //   const orgInfo = getItem('orgInfo')
    //   const data = {
    //     tenantId: orgInfo.organizationId,
    //     userId: this.userInfo.userId,
    //     isCheckLogin: false
    //   }
    //   getUserInfoByUserId(data)
    //     .then(res => {
    //       if (res.data) {
    //         this.feishuAccount.userInfo = res.data
    //         this.feishuAccount.ifBindUser = true
    //         this.feishuAccount.loading = false
    //         this.showTips = false
    //       } else {
    //         this.feishuAccount.ifBindUser = false
    //         this.feishuAccount.loading = false
    //         this.showTips = true
    //         setTimeout(() => {
    //           this.showTips = false
    //         }, 10000)
    //       }
    //     })
    //     .catch(() => {
    //       this.feishuAccount.loading = false
    //     })
    // },
    // // 获取当前机构是否开通了飞书扫码登录
    // getOrghasFeishu() {
    //   const orgInfo = getItem('orgInfo')
    //   const params = {
    //     tenantId: orgInfo.organizationId
    //   }
    //   getOrganizationIdByAppId(params).then(res => {
    //     if (res.data.appId) {
    //       this.feishuAccount.feishuAccount = true
    //       this.getUserInfoByUserId()
    //     }
    //   })
    // },
    // 解除/绑定 点击
    bindingClick() {
      Dialog.open({
        type: 'Binding',
        visible: true,
        userId: this.userInfo.userId
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 68px;
  widows: auto;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .left_tips {
    position: relative;
    height: 68px;
    color: #ff4949;
    flex: 1;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 68px;

    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 16px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .popover-img {
      display: inline-flex;
      align-items: center;
      img {
        height: 20px;
        width: 20px;
        margin-right: 6px;
      }
      span {
        color: #333333;
        font-size: 14px;
      }
    }
    .avatar-container {
      margin-right: 4px;
      display: inline-flex;
      align-items: center;

      .avatar-wrapper {
        position: relative;
        margin-top: -3px; // 微调

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -16px;
          top: calc(50% - 6px);
          font-size: 12px;
        }
      }
    }
  }
  .ai-icon {
    display: inline-block;
    vertical-align: top;
    padding: 0 16px;
    min-width: 40px;
    height: 100%;
    user-select: none;
    cursor: pointer;
    // .ai-icon-gi
    .ai-icon-img {
      width: 36px;
      min-height: 36px;
      display: inline-block;
      margin-right: 8px;
      /* padding-bottom: 4px; */
    }
    span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }
    // .ai-icon-img {
    //   display: none;
    // }
    // &:hover {
    //   .ai-icon-img {
    //     display: block;
    //   }
    //   .ai-icon-gif {
    //     display: none;
    //   }
    // }
  }
}
.el-popover.popover-container {
  .popover-header {
    color: #0c6fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    .driver {
      height: 2px;
      width: 16px;
      margin: 0 4px;
      background: #0c6fff;
    }
  }
  .popover-content {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin: 16px 0 13px 0;
    .qrcode {
      margin: 0 23px 8px;
    }
    .popover-content__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .driver {
      width: 1px;
      height: 90px;
      background: #e7e7e7;
    }
  }
}
.w_16 {
  width: 16px;
  height: 16px;
  font-size: 16px;
}
.dropdownItemText {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  line-height: 22px;
  white-space: nowrap;
}
::v-deep {
  // .el-dropdown-menu--medium {
  .el-dropdown-menu__item {
    padding: 0 9px;
  }
  .el-dropdown-menu__item:before {
    margin: 0 -9px !important;
  }
  // }
  // .el-dropdown-menu--medium  {
  //   .el-dropdown-menu__item.el-dropdown-menu__item--divided{
  //   }
  // }
}
</style>
