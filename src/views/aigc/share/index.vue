<template>
  <div v-if="aiDetail.templateId" class="pageWrap">
    <div v-if="source.ifClose" class="close_btn" @click="onhandleBack">
      <i class="el-icon-close" />
    </div>
    <div class="page_content">
      <div class="ai_avatar">
        <div class="ailist_view_img">
          <img
            v-if="aiDetail.templateId === '1'"
            src="@/assets/image/aigc/my_icon.png"
            alt=""
          />
          <template v-else>
            <img v-if="!!aiDetail.icon" :src="aiDetail.icon" alt="" />
            <div
              v-else
              class="title-span"
              :style="{ background: aiDetail.backgroundColor }"
            >
              <span :style="{ color: aiDetail.textColor }">{{
                aiDetail.title.split('')[0]
              }}</span>
            </div>
          </template>
        </div>
      </div>

      <div class="ai_title">
        {{ aiDetail.templateId === '1' ? '智云' : aiDetail.title }}
      </div>

      <div class="ai_describe">
        {{
          aiDetail.templateId === '1'
            ? '全能AI小助手，解决你的所有问题'
            : aiDetail.description
        }}
      </div>

      <div class="ailist_detail_footer">
        <div class="ailist_detail_footer_des">
          <div>
            <img src="@/assets/image/aigc/aiCreater.png" /><span>{{
              aiDetail.createdNickName
            }}</span>
          </div>
          <div>
            <img src="@/assets/image/aigc/aiHot.png" /><span>{{
              aiDetail.useCounter
            }}</span>
          </div>
        </div>
      </div>

      <el-button
        v-if="!source.ifClose && !loading"
        type="primary"
        :loading="useloading"
        class="userBtn"
        @click="onhandleUse"
        >立即使用</el-button
      >
      <div v-if="!loading && source.ifClose" class="errTips">
        {{ source.ifError[source.errorStatus] }}
      </div>
    </div>
  </div>
</template>

<script>
import { getAssistantBySharing, useAssistant } from '@/api/aigc/index.js'
import eventBus from '@/utils/eventBus'
import { getOrganizationIdByAppId } from '@/api/user/member'
import { getItem } from '@/utils/localStorage'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth' // get token from cookie
export default {
  components: {},
  data() {
    return {
      loading: false,
      aiDetail: {
        backgroundColor: '',
        content: '',
        count: 0,
        createNickName: '',
        createTime: '',
        description: '',
        icon: '',
        id: '',
        templateId: '',
        textColor: '',
        isDeleted: 0,
        issueList: [],
        jobNameList: [],
        sort: 0,
        title: '',
        topSort: '',
        topTime: '',
        type: 1,
        useCounter: 0,
        showBtnUser: false
      },
      useloading: false,
      // 来源数据
      source: {
        ifClose: false, // 是否显示关闭按钮
        errorStatus: 1,
        ifError: {
          1: '不属于【XXX机构用户】，无法使用该助手',
          2: '没有【xxx机构】AI助手权限，请联系人力资源开通资源',
          3: '助手已删除或已取消公开状态，无法继续使用',
          4: '当前不支持手机端，请前往PC电脑端查看'
        } // 错误提示词
      },
      orgName: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission_routes'])
  },
  created() {
    this.getDetail()
  },
  mounted() {},
  methods: {
    // 获取当前机构信息
    getOrgInfo() {
      const orgInfo = getItem('orgInfo')
      if (!orgInfo || !orgInfo.organizationId) {
        return
      }
      const params = {
        tenantId: orgInfo.organizationId
      }
      return getOrganizationIdByAppId(params)
        .then(res => {
          this.orgName = res.data.name
        })
        .catch(() => {})
    },
    getOrgInfoById(id) {
      const params = {
        tenantId: id
      }
      return getOrganizationIdByAppId(params).then(res => {
        this.orgName = res.data.name
      })
    },
    onhandleBack() {
      this.$router.replace({ path: '/' })
    },
    getDetail() {
      const isMobile = this.$_isMobile()
      const orgInfo = getItem('orgInfo')
      console.log(orgInfo, 'orgInfo')
      this.loading = true
      const data = {
        sharingCode: this.$route.query.i
      }
      getAssistantBySharing(data).then(res => {
        this.aiDetail = {
          ...res.data,
          id: res.data.templateId,
          describe: res.data.description,
          createNickName: res.data.createdNickName,
          useCount: res.data.useCounter,
          hasUsed: res.data.templateId === 1 ? true : res.data.hasUsed,
          isDeleted:
            res.data.isDeleted ||
            (res.data.isPrivate &&
              res.data.createdUserId !== this.userInfo.userId)
              ? 1
              : 0
        }
        const hasToken = getToken()
        console.log(this.device, 'this.device')
        if (isMobile) {
          this.source = {
            ifClose: true, // 是否显示关闭按钮
            errorStatus: 4,
            ifError: {
              1: '不属于【XXX机构用户】，无法使用该助手',
              2: '没有【xxx机构】AI助手权限，请联系人力资源开通资源',
              3: '助手已删除或已取消公开状态，无法继续使用',
              4: '当前不支持手机端，请前往PC电脑端查看'
            } // 错误提示词
          }
          this.loading = false
        } else if (!hasToken) {
          this.source.ifClose = false
          this.loading = false
        } else if (res.data.tenantId === '0') {
          this.source.ifClose = false
          this.loading = false
          if (
            this.$route.query &&
            this.$route.query.redirect &&
            ['login'].includes(this.$route.query.from)
          ) {
            return this.onhandleUse()
          }
          return
        } else if (
          String(res.data.tenantId) !== String(orgInfo.organizationId)
        ) {
          this.getOrgInfoById(res.data.tenantId).then(() => {
            this.source = {
              ifClose: true, // 是否显示关闭按钮
              errorStatus: 1,
              ifError: {
                1: `不属于【${this.orgName}】用户，无法使用该助手`,
                2: `没有【${this.orgName}】AI助手权限，请联系人力资源开通资源`,
                3: '助手已删除或已取消公开状态，无法继续使用'
              } // 错误提示词
            }
            this.loading = false
          })
        } else if (!this.getAuthorityShowAI()) {
          this.getOrgInfo().then(() => {
            this.source = {
              ifClose: true, // 是否显示关闭按钮
              errorStatus: 2,
              ifError: {
                1: '不属于【XXX机构用户】，无法使用该助手',
                2: `没有【${this.orgName}】AI助手权限，请联系人力资源开通资源`,
                3: '助手已删除或已取消公开状态，无法继续使用'
              } // 错误提示词
            }
            this.loading = false
          })
        } else if (!res.data.isEnabled || res.data.isPrivate) {
          this.source = {
            ifClose: true, // 是否显示关闭按钮
            errorStatus: 3,
            ifError: {
              1: '不属于【XXX机构用户】，无法使用该助手',
              2: `没有【${this.orgName}】AI助手权限，请联系人力资源开通资源`,
              3: '助手已删除或已取消公开状态，无法继续使用'
            } // 错误提示词
          }
          this.loading = false
        } else if (
          this.$route.query &&
          this.$route.query.redirect &&
          ['login'].includes(this.$route.query.from)
        ) {
          return this.onhandleUse()
        } else {
          this.source.ifClose = false
          this.loading = false
        }
      })
    },
    // 点击立即使用
    onhandleUse() {
      this.useloading = true
      const data = {
        templateId: this.aiDetail.templateId
      }
      useAssistant(data)
        .then(res => {
          eventBus.$emit('useAi', this.aiDetail.templateId)
          this.useloading = false
        })
        .catch(err => {
          if (err.code === 2002 || err.code === 2001 || err.code === 2003) {
            this.$router.push({
              path: '/login',
              query: { ...this.$route.query, redirect: 'aiShare' }
            })
          } else if (err.code === 4000) {
            eventBus.$emit('useAi', this.aiDetail.templateId)
          } else {
            this.$message.error(err.message || err.msg)
          }
          this.useloading = false
        })
    },
    getAuthorityShowAI() {
      const info = this.permission_routes?.find(v => v.path === 'component')
      let isPermission = false
      if (info) {
        isPermission = info.meta
          ? info.meta.permsList.filter(f => f === 'system:ai:assistant')
              .length > 0
          : false
      }
      return isPermission
    },
    $_isMobile() {
      // const rect = body.getBoundingClientRect()
      // return rect.width - 1 < WIDTH
      var userAgentInfo = navigator.userAgent
      var Agents = [
        'Android',
        'iPhone',
        'SymbianOS',
        'Windows Phone',
        'iPad',
        'iPod'
      ]
      var flag = true
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false
          break
        }
      }
      return !flag
    }
  }
}
</script>

<style lang="scss" scoped>
.pageWrap {
  width: 100vw;
  height: 100vh;
  background: #fff;
  .close_btn {
    position: absolute;
    top: 19px;
    right: 29px;
    font-size: 14px;
    font-weight: bolder;
    cursor: pointer;
    > i {
      font-weight: bolder;
    }
  }
  .page_content {
    width: 371px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    overflow: auto;
    .ai_avatar {
      .ailist_view_img {
        width: 100px;
        > img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
        span {
          font-size: 30px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #313233;
        }
        > .title-span {
          width: 100px;
          min-width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .ai_title {
      font-size: 16px;
      font-family: PingFangSC, PingFang SC;
      font-weight: bolder;
      color: #313233;
      line-height: 22px;
      margin-top: 30px;
      margin-bottom: 30px;
      text-align: center;
    }
    .ai_describe {
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
      word-break: break-all;
      overflow-wrap: break-word;
      white-space: pre-wrap;
    }
    .ailist_detail_footer {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 20px;
      .ailist_detail_footer_des {
        font-size: 12px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #999;
        line-height: 12px;
        display: flex;
        align-items: center;
        > div {
          display: flex;
          align-items: center;
          margin: 0 11px;
          > img {
            width: 24px;
            height: 24px;
            margin-right: 8px;
          }
        }
      }
    }
    .userBtn {
      width: 100%;
      margin-top: 32px;
      height: 40px;
    }
    .errTips {
      margin-top: 34px;
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #f53f3f;
      line-height: 22px;
    }
  }
}
</style>
