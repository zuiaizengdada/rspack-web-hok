<template>
  <div v-if="addAccountFlag" class="add_account_page">
    <el-dialog
      width="695px"
      :visible.sync="addAccountFlag"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <p class="p-title">请选择添加账号的平台</p>
      </div>
      <div class="plat_array_content flex ">
        <div v-for="item in platArray" :key="item.platformId" class="plat_content flex-1 flex flex-column flex-middle" @click="platToLogin(item)">
          <img :src="item.platformIcon" />
          <p>{{ item.platformName }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getPlatformLogin, checkAccount } from '@/api/videoManagement/accountManage'
import { mapGetters } from 'vuex'
import { isUseNewClient } from '@/utils'
export default {
  name: 'AddAccount',
  props: {
    platArray: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    }
  },
  data() {
    return {
      addAccountFlag: false,
      socket: ''
    }
  },
  computed: {
    ...mapGetters(['allChannelSwitch', 'isNewSocketVideoPublish'])
  },
  methods: {
    show() {
      this.addAccountFlag = true
    },
    handleClose() {
      this.addAccountFlag = false
    },
    platToLogin(item) {
      getPlatformLogin().then(res => {
        if (res.success) {
          let loginResponse = ''
          const merchantToken = res.data.merchantToken// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbl9pZCI6IjNhMDlhMzNiLTk1YjQtNTE3YS05NjQwLWYxNmRjNDczMmQxNyIsIm5iZiI6MTY3Nzc1NDU2NywiZXhwIjoxNjc3ODQwOTY3LCJpYXQiOjE2Nzc3NTQ1NjcsImlzcyI6IkdhZWEiLCJhdWQiOiJHYWVhIn0.mEaVIFA76YJQeEMSBoZZQfM7S3eUx6jOkRefcXBl0jY'
          // 登录账号
          const params = {
            accountId: res.data.accountId,
            merchantId: res.data.merchantId,
            platformId: item.platformId,
            merchantToken,
            cookie: null,
            newVersion: this.allChannelSwitch[item.platformId],
            authorizationModel: true
          }
          try {
            isUseNewClient(item.platformId, 'account-login', '', '登录自媒体账号').emit('account-login', JSON.stringify(params), (response) => {
              loginResponse = JSON.parse(response)
              // this.$store.dispatch('settings/insertApiStat', { 'apiUrl': 'account-login', 'remark': '登录自媒体账号' })
              console.log(loginResponse, '错误信息')
              if (loginResponse.code === 200) {
                loginResponse.data.addOrEdit = 'add'
                loginResponse.data.platformName = item.platformName
                const paramsFirst = {
                  authorId: loginResponse.data.authorId
                }
                checkAccount(paramsFirst).then(res => {
                  if (res.success) {
                    this.$emit('loginSuccess', loginResponse.data)
                  }
                })
              }
            })
          } catch (err) {
            console.log(err)
          }
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.add_account_page {
    width: 100%;
    height: 100%;
    position: absolute;
    ::v-deep .el-dialog {
        border-radius: 10px;
    }
    ::v-deep .el-dialog__header {
        border-bottom: 1px solid #e7e7e7;
    }
    .p-title {
        font-size: 16px;
        font-weight: bold;
    }
    .plat_array_content {
        width: 100%;
        height: 280px;
        .plat_content {
            // float: left;
            // margin-right: 54px;
            width: 64px;
            height: 64px;
            cursor: pointer;
            img {
                width: 64px;
                height: 64px;
            }
            p {
                font-size: 16px;
                line-height: 30px;
                height: 30px;
                width: 100%;
                text-align: center;
                color: #333;
                float: left;
                margin-top: 5px;
            }
        }
    }
}
</style>

