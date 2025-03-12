<template>
  <AppDialog
    v-model="visible"
    title="绑定/解除账号"
    width="434px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="switchOrg">
      <div class="orgList">
        <template v-if="orgListFlag">
          <div v-for="(item, index) in orgList" :key="index" class="orgItem">
            <div class="name">{{ item.type === 1 ? '飞书' : '企微' }}</div>
            <div class="name grow">{{ item.name || '--' }}</div>
            <div class="name grow phone">{{ item.mobile || '--' }}</div>
            <el-button
              class="block-btn"
              size="mini"
              :type="item.status ? 'danger' : 'primary'"
              @click="bingClick(item)"
            >
              {{ item.status ? '解除绑定' : '绑定' }}
            </el-button>
            <img
              v-if="organizationId === item.organizationId && item.status !== 1"
              src="~@/assets/image/login/check.png"
              alt=""
              class="checkIcon"
            />
          </div>
        </template>
        <template v-else>
          <el-empty :image-size="100" description="未有待绑定/解除的账号" />
        </template>
      </div>
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import { mapGetters } from 'vuex'
import AppDialog from '@/components/AppDialog'
import Dialog from '@/components/Dialog/index.js'

import { getItem } from '@/utils/localStorage'
import {
  getUserInfoByUserId as getUserInfoByUserIdApi,
  unBindUser,
  getOrganizationIdByAppId,
  orgToWecomAppIdApi,
  wechatUserInfoApi,
  unBindWechatUser,
  getBindUserInfoApi
} from '@/api/user/member'
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
      orgListFlag: true, // false 确认没机构数据 true可能有机构数据
      orgList: [],
      organizationId: '',
      feishuInfo: {
        avatar_big: '',
        avatar_middle: '',
        mobile: '',
        name: '',
        open_id: ''
      },
      wecomInfo: {},
      success: () => {}
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    visible: {
      handler(val) {
        this.$nextTick(() => {
          val && this.getBindUserInfo()
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
    async getBindUserInfo() {
      this.loading = true
      this.orgListFlag = true
      try {
        const orgInfo = getItem('orgInfo')
        const { data } = await getBindUserInfoApi({
          tenantId: orgInfo.organizationId,
          userId: this.userInfo.userId
        })
        this.orgList = data
        if (this.orgList.length === 0) this.orgListFlag = false
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    },
    // 获取当前机构id 去查询是否绑定飞书
    async getOrghasFeishu() {
      const orgInfo = getItem('orgInfo')
      const params = {
        tenantId: orgInfo.organizationId
      }
      const res = await getOrganizationIdByAppId(params)
      if (res.data.appId) {
        // this.$set(this.orgList[0], 'userName', res.data.name)
        await this.getUserInfoByUserId()
      }
    },
    // 查询飞书是否绑定
    async getUserInfoByUserId() {
      const orgInfo = getItem('orgInfo')
      const data = {
        tenantId: orgInfo.organizationId,
        userId: this.userInfo.userId,
        isCheckLogin: false
      }
      try {
        await getUserInfoByUserIdApi(data)
        this.getBindUserInfo()
      } catch (error) {
        this.$message.error(error.msg || '系统错误')
      }
    },

    // 查询机构绑定企微id
    async getWecomJg() {
      const orgInfo = getItem('orgInfo')
      const params = {
        tenantId: orgInfo.organizationId
      }
      const res = await orgToWecomAppIdApi(params)
      if (res.data.appId) {
        // this.$set(this.orgList[1], 'userName', res.data.name)
        await this.getOrghasWecom()
      }
    },
    // 查询企微是否绑定
    async getOrghasWecom() {
      const orgInfo = getItem('orgInfo')
      const data = {
        tenantId: orgInfo.organizationId,
        userId: this.userInfo.userId,
        isCheckLogin: false
      }
      try {
        await wechatUserInfoApi(data)
        this.getBindUserInfo()
      } catch (error) {
        this.$message.error(error.msg || '系统错误')
      }
      // /wechatUserInfoApi
    },

    // 重新绑定 飞书或企微
    addOrg(type) {
      Dialog.close()
      const keyToDialog = ['', 'FeisuApply', 'WecomApply']
      Dialog.open({
        type: keyToDialog[type],
        visible: true,
        userId: this.userInfo.userId,
        success: res => {
          Dialog.close()
          if (res) {
            this.$message.success('绑定成功')
            Dialog.open({
              type: 'Binding',
              visible: true,
              userId: this.userInfo.userId
            })
          }
        }
      })
    },
    // 飞书/企微解绑
    async unBindUserClick(type) {
      this.$delModal({
        visible: true,
        tips: '确定解除绑定?',
        success: async () => {
          const orgInfo = getItem('orgInfo')
          const data = {
            tenantId: orgInfo.organizationId,
            userId: this.userInfo.userId
          }
          try {
            console.log('type------', type)
            if (type === 1) {
              await unBindUser(data)
              this.getBindUserInfo()
            } else if (type === 2) {
              await unBindWechatUser(data)
              this.getBindUserInfo()
            }
            this.$message.success('操作成功')
          } catch (error) {
            console.log(error)
          }
        }
      })
    },

    bingClick(item) {
      item.status ? this.unBindUserClick(item.type) : this.addOrg(item.type)
    }
  }
}
</script>

<style lang="scss" scoped>
.block-btn {
  display: block;
  width: 80px;
}
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
      .name {
        flex: 1;
        margin-right: 10px;
        font-size: 16px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #44474d;
        line-height: 28px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        &.grow {
          flex-grow: 2;
        }
        &.phone {
          min-width: 120px;
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
