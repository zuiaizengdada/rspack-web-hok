<template>
  <AppDialog
    v-model="visible"
    title="请选择账号"
    width="434px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="switchAccount">
      <div class="accountList">
        <div
          v-for="(item, index) in accountList"
          :key="index"
          :class="{ active: selectUserId === item.userId }"
          class="accountItem"
          @click="handleChangeAccount(item)"
        >
          <AppAvatar
            :avatar="item.userImg"
            :name="item.nikeName"
            :width="48"
            class="m-r-10"
            :no-name="true"
          />
          <div class="accountName">
            <div class="accountNameContent">
              <span class="nikeName">{{ item.nikeName }}</span>
              <span v-if="userId === item.userId" class="ifCurrentAccunt"
                >当前登录账号</span
              >
            </div>
            <div style="color: #999999">{{ item.phone }}</div>
          </div>

          <img
            v-if="selectUserId === item.userId && item.status !== 1"
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
          :disabled="!selectUserId"
          style="width: 380px; height: 40px; margin: 0 30px 0 24px"
          @click.native.prevent="handleIntoSystem"
          >进入系统</el-button
        >
      </div>
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { getUserAccountList, loginSelectOrganization } from '@/api/login.js'
import { getItem } from '@/utils/localStorage'
import { getToken } from '@/utils/auth'
export default {
  components: {
    AppDialog,
    AppAvatar
  },
  data() {
    return {
      loading: false,
      visible: true,
      top: '114px',
      userId: '',
      accountList: [],
      selectUserId: '',
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
      const orgInfo = getItem('orgInfo')
      this.loading = true
      const params = {
        userId: this.userId,
        tenantId: orgInfo.organizationId
      }
      getUserAccountList(params)
        .then(res => {
          console.log(res, 'res')
          this.accountList = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleChangeAccount(item) {
      this.selectUserId = item.userId
      // item.status !== 1 && (this.accountanizationId = item.accountanizationId)
    },
    // 点击进入系统
    async handleIntoSystem() {
      if (this.selectUserId === this.userId) {
        this.visible = false
        return
      }
      const orgInfo = getItem('orgInfo')
      try {
        this.loading = true
        // const { data } = await getUserByOrganizationAccount({
        //   userId: this.selectUserId,
        //   organizationId: orgInfo.organizationId,
        //   isCheckLogin: true,
        //   loginSource: 1
        // })
        const { data } = await loginSelectOrganization({
          userId: this.selectUserId,
          organizationId: orgInfo.organizationId,
          token: getToken(),
          isCheckLogin: true,
          loginSource: 1
        })
        if (!data?.token) {
          this.loading = false
          return
        }
        await this.$store.dispatch('user/login', data)
        this.$store.dispatch('user/getDeptId')
        window.location = window.origin
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    gotoSystem() {}
  }
}
</script>

<style lang="scss" scoped>
.switchAccount {
  padding: 21px 0;
  .accountList {
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
    .accountItem {
      display: flex;
      width: 380px;
      height: 80px;
      border-radius: 4px;
      border: 1px solid #cbcfd3;
      padding: 18px 16px;
      align-items: center;
      margin-bottom: 20px;
      margin-left: 24px;
      margin-right: 30px;
      position: relative;
      cursor: pointer;
      .accountName {
        flex: 1 0 0;
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #44474d;
        line-height: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .accountNameContent {
          width: 290px;
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          .nikeName {
            max-width: 186px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            margin-right: 10px;
          }
          .ifCurrentAccunt {
            background-color: #f0f9eb;
            border-color: #e1f3d8;
            color: #67c23a;
            border: 1px solid #d9ecff;
            border-radius: 4px;
            display: inline-block;
            height: 28px;
            padding: 0 10px;
            line-height: 28px;
            font-size: 12px;
          }
        }
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
