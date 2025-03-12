<template>
  <AppDialog
    v-model="visible"
    title="请选择机构"
    width="434px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="switchOrg">
      <div class="orgList">
        <div
          v-for="(item, index) in orgList"
          :key="index"
          class="orgItem"
          :class="{
            active: organizationId === item.organizationId && item.status !== 1,
            disabled: item.status === 1
          }"
          @click="handleChangeOrg(item)"
        >
          <div class="orgLogo">
            <img v-if="item.organizationUrl" :src="item.organizationUrl" />
          </div>
          <div class="orgName">{{ item.name }}</div>

          <img
            v-if="organizationId === item.organizationId && item.status !== 1"
            src="~@/assets/image/login/check.png"
            alt=""
            class="checkIcon"
          />
        </div>
      </div>
      <div class="m-t-20">
        <el-button
          type="primary"
          class="logoBtn"
          :loading="loading"
          :disabled="!organizationId"
          style="width: 380px; height: 40px; margin: 0 30px 0 24px"
          @click.native.prevent="handleIntoSystem"
        >
          进入系统
        </el-button>
      </div>
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { loginSelectOrganization } from '@/api/login'
import { getUserOrganizationListUsing } from '@/api/login.js'
import { setItem, getItem } from '@/utils/localStorage'
import { getToken } from '@/utils/auth'

import { userSysShortcutMenus } from '@/api/home'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      visible: true,
      top: '114px',
      userId: '',
      orgList: [
        // { mediaDtoList: [{ url: 'https://oss.hokkj.cn/org/logo/org_huoke1.png', scope: '1', terminal: 1 }], name: '获客文化', organizationId: 1000, status: 0 },
        // { mediaDtoList: [{ url: 'https://oss.hokkj.cn/org/logo/org_qianyan1.png\n', scope: '1', terminal: 1 }], name: '前沿流量', organizationId: 1001, status: 0 },
        // { mediaDtoList: null, name: '全域', organizationId: 1006, status: 0 }
      ],
      organizationId: '',
      success: () => {}
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.$nextTick(() => {
          val && this.getList()
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.top = Math.abs(document.body.clientHeight - 541) / 2 + 'px'
  },
  methods: {
    sure() {},
    // 根据userId获取可以切换的机构
    getList() {
      this.loading = true
      const params = {
        userId: this.userId
      }
      getUserOrganizationListUsing(params)
        .then(res => {
          this.orgList = res.data.map(i => {
            let obj = null
            if (i.mediaDtoList) {
              obj = i.mediaDtoList.find(
                item => item.scope === '1' && item.terminal === 1
              )
            }
            return {
              ...i,
              organizationUrl: obj ? obj.url : ''
            }
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleChangeOrg(item) {
      item.status !== 1 && (this.organizationId = item.organizationId)
    },
    // 点击进入系统
    async handleIntoSystem() {
      const orginfo = getItem('orgInfo')
      if (orginfo.organizationId === this.organizationId) {
        this.visible = false
        return
      }
      this.loading = true
      const obj = this.orgList.find(
        i => i.organizationId === this.organizationId
      )
      try {
        const { data } = await loginSelectOrganization({
          organizationId: this.organizationId,
          token: getToken(),
          isCheckLogin: true,
          loginSource: 1
        })
        if (!data?.token) {
          this.loading = false
          this.isLogin = true
          return
        }
        if (this.feishuOrgName !== obj.organizationRequestName) {
          obj.organizationRequestName  = location.origin.match('localhost')? location.origin:obj.organizationRequestName
          setItem('logoList', obj.mediaDtoList)
          setItem('orgInfo', obj)
          this.visible = false
          window.location = `${obj.organizationRequestName}/#/desktopToWeb?organizationId=${obj.organizationId}&userId=${data.userId}&path=addLiveRoom&token=${data.token}`
          return
        }
        await this.$store.dispatch('user/login', data)
        const userMenu = await userSysShortcutMenus()
        const userMenuId = this.$store.getters.permission_pathList.find(
          i => i.id === userMenu.data[0].menuId
        )
        this.$store.commit(
          'user/SET_USERMENUID',
          userMenuId ? userMenuId.id : 0
        )
        setItem('logoList', obj.mediaDtoList)
        setItem('orgInfo', obj)
        // location.reload()
        this.visible = false
        // window.location = window.origin
      } catch (e) {
        this.loading = false
        this.isLogin = true
        this.visible = false
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.switchOrg {
  padding: 21px 0;
  .orgList {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 240px;
    &::-webkit-scrollbar {
      width: 4px;
      height: 6px;
      // display: none;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.2);
      transition: all 0.4s ease;
    }
    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.1);
    }
    .orgItem {
      display: flex;
      width: 380px;
      height: 60px;
      border-radius: 4px;
      border: 1px solid #cbcfd3;
      padding: 18px 16px;
      align-items: center;
      margin-bottom: 20px;
      margin-left: 24px;
      margin-right: 30px;
      position: relative;
      cursor: pointer;
      .orgLogo {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
        > img {
          width: 100%;
          height: 100%;
        }
      }
      .orgName {
        flex: 1 0 0;
        margin-left: 10px;
        font-size: 16px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #44474d;
        line-height: 28px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .checkIcon {
        width: 22px;
        height: 19px;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    .active {
      background: #e7f0ff;
      border: 1px solid #0c6fff;
    }
    .disabled {
      background: #efefef;
      cursor: not-allowed;
      color: #999999;
    }
  }
}
</style>
