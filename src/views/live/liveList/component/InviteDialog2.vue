<template>
  <!-- 生成链接弹框 -->
  <AppDialog
    v-model="config.visible"
    title="生成链接"
    width="690px"
    :loading="loading"
    height="auto"
  >
    <div v-loading="loading" class="InviteDialog overflowOuto">
      <el-form
        ref="ruleForm"
        :model="form"
        size="small"
        label-width="94px"
        class="demo-ruleForm"
      >
        <!-- type="border-card" -->
        <el-tabs v-model="activeName">
          <el-tab-pane
            v-if="havBtnOld('web:liveRoom:linkH5')"
            label="H5网页"
            name="1"
          >
            <div slot="label" class="tabsHeader">
              <template>H5网页</template>
            </div>
            <el-form-item label="直播模式" prop="mode">{{
              form.liveModel | getOptionsValue(liveModeOption)
            }}</el-form-item>
            <el-form-item label="直播名称" prop="mode">{{
              form.name
            }}</el-form-item>
            <el-form-item label="开播时间" prop="mode">{{
              moment(form.startTime).format('YYYY-MM-DD HH:mm:ss')
            }}</el-form-item>
            <el-form-item label="邀请人" prop="mode">{{
              userInfo.nickName
            }}</el-form-item>
            <template v-if="!ifLink">
              <el-form-item label="域名地址" prop="domainUrl">
                <el-select v-model="form.domainUrl" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in urlList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <i v-if="refreshLoading" class="el-icon-loading m-l-10" />
                <el-tooltip
                  v-else
                  class="item"
                  effect="dark"
                  content="获取最新的域名地址"
                  placement="top"
                >
                  <i
                    class="el-icon-refresh-right m-l-10 pointer"
                    style="color: #0c6fff"
                    @click="getLiveRoomOrgConfig"
                  />
                </el-tooltip>
              </el-form-item>
            </template>
            <el-form-item v-if="ifLink" label="生成链接" prop="link">
              <el-input
                v-model="form.link"
                style="width: calc(100% - 30px)"
                disabled
              />
              <el-tooltip
                class="item"
                effect="dark"
                content="点击复制"
                placement="top-start"
              >
                <i
                  style="height: 23px; line-height: 25px"
                  class="el-icon-document-copy a_link m-l-10"
                  @click="copyText(form.link)"
                />
              </el-tooltip>
            </el-form-item>
            <el-form-item
              v-if="showShortLinkInviteUrl"
              label="短链接"
              prop="shortLinkInviteUrl"
            >
              <el-input
                v-model="form.shortLinkInviteUrl"
                style="width: calc(100% - 30px)"
                disabled
              />
              <!-- <i class="el-icon-loading m-l-10" /> -->
              <el-tooltip
                class="item"
                effect="dark"
                content="点击复制"
                placement="top-start"
              >
                <i
                  style="height: 23px; line-height: 25px"
                  class="el-icon-document-copy a_link m-l-10"
                  @click="copyText(form.shortLinkInviteUrl)"
                />
              </el-tooltip>
            </el-form-item>
            <!-- // 如果点的老的就用长链接 -->
            <template v-if="oldLinkeClick">
              <el-form-item v-if="form.link" label="H5二维码">
                <span class="liveLinkCode">
                  <AppQrcode :src="form.link" :size="200" :margin="10" />
                </span>
              </el-form-item>
            </template>
            <template v-else>
              <!-- // 如果点的新的就要短链接 -->
              <el-form-item v-if="ifLink" label="H5二维码">
                <span class="liveLinkCode">
                  <AppQrcode
                    :src="form.shortLinkInviteUrl"
                    :size="200"
                    :margin="10"
                  />
                </span>
              </el-form-item>
            </template>
          </el-tab-pane>

          <el-tab-pane
            v-if="havBtnOld('web:liveRoom:linkWechat')"
            label="微信小程序"
            name="2"
          >
            <div slot="label" class="tabsHeader">
              <template>微信小程序</template>
            </div>
            <el-form-item label="直播模式" prop="mode">{{
              form.liveModel | getOptionsValue(liveModeOption)
            }}</el-form-item>
            <el-form-item label="直播名称" prop="mode">{{
              form.name
            }}</el-form-item>
            <el-form-item label="开播时间" prop="mode">{{
              moment(form.startTime).format('YYYY-MM-DD HH:mm:ss')
            }}</el-form-item>
            <el-form-item label="邀请人" prop="mode">{{
              userInfo.nickName
            }}</el-form-item>
            <template v-if="!ifLink">
              <el-form-item label="域名地址" prop="domainUrl">
                <el-select v-model="form.domainUrl" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in urlList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <i v-if="refreshLoading" class="el-icon-loading m-l-10" />
                <el-tooltip
                  v-else
                  class="item"
                  effect="dark"
                  content="获取最新的域名地址"
                  placement="top"
                >
                  <i
                    class="el-icon-refresh-right m-l-10 pointer"
                    style="color: #0c6fff"
                    @click="getLiveRoomOrgConfig"
                  />
                </el-tooltip>
              </el-form-item>
            </template>
            <el-form-item v-if="ifLink" label="小程序链接" prop="miniAppUrl">
              <el-input
                v-model="form.miniAppUrl"
                style="width: calc(100% - 30px)"
                disabled
              />
              <el-tooltip
                class="item"
                effect="dark"
                content="点击复制"
                placement="top-start"
              >
                <i
                  style="height: 23px; line-height: 25px"
                  class="el-icon-document-copy a_link m-l-10"
                  @click="copyText(form.miniAppUrl)"
                />
              </el-tooltip>
            </el-form-item>
            <el-form-item v-if="ifLink && form.miniAppUrl" label="二维码">
              <span class="liveLinkCode">
                <AppQrcode :src="form.miniAppUrl" :size="200" :margin="10" />
              </span>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane
            v-if="havBtnOld('web:liveRoom:linkApp')"
            label="获客APP"
            name="3"
          >
            <div slot="label" class="tabsHeader">
              <template>获客APP</template>
            </div>
            <el-form-item label="直播模式" prop="mode">{{
              form.liveModel | getOptionsValue(liveModeOption)
            }}</el-form-item>
            <el-form-item label="直播名称" prop="mode">{{
              form.name
            }}</el-form-item>
            <el-form-item label="开播时间" prop="mode">{{
              moment(form.startTime).format('YYYY-MM-DD HH:mm:ss')
            }}</el-form-item>
            <el-form-item label="邀请人" prop="mode">{{
              userInfo.nickName
            }}</el-form-item>
            <template v-if="!ifLink">
              <el-form-item label="域名地址" prop="domainUrl">
                <el-select v-model="form.domainUrl" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in urlList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <i v-if="refreshLoading" class="el-icon-loading m-l-10" />
                <el-tooltip
                  v-else
                  class="item"
                  effect="dark"
                  content="获取最新的域名地址"
                  placement="top"
                >
                  <i
                    class="el-icon-refresh-right m-l-10 pointer"
                    style="color: #0c6fff"
                    @click="getLiveRoomOrgConfig"
                  />
                </el-tooltip>
              </el-form-item>
            </template>
            <el-form-item v-if="ifLink" label="APP链接" prop="hokAppUrl">
              <el-input
                v-model="form.hokAppUrl"
                style="width: calc(100% - 30px)"
                disabled
              />
              <el-tooltip
                class="item"
                effect="dark"
                content="点击复制"
                placement="top-start"
              >
                <i
                  style="height: 23px; line-height: 25px"
                  class="el-icon-document-copy a_link m-l-10"
                  @click="copyText(form.hokAppUrl)"
                />
              </el-tooltip>
            </el-form-item>
            <el-form-item v-if="ifLink && form.hokAppUrl" label="二维码">
              <span class="liveLinkCode">
                <AppQrcode :src="form.hokAppUrl" :size="200" :margin="10" />
              </span>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane
            v-if="havBtnOld('web:liveRoom:linkDou')"
            label="抖音小程序"
            name="4"
          >
            <div slot="label" class="tabsHeader">
              <template>抖音小程序</template>
            </div>
            <el-form-item label="直播模式" prop="mode">{{
              form.liveModel | getOptionsValue(liveModeOption)
            }}</el-form-item>
            <el-form-item label="直播名称" prop="mode">{{
              form.name
            }}</el-form-item>
            <el-form-item label="开播时间" prop="mode">{{
              moment(form.startTime).format('YYYY-MM-DD HH:mm:ss')
            }}</el-form-item>
            <el-form-item label="邀请人" prop="mode">{{
              userInfo.nickName
            }}</el-form-item>
            <template v-if="!ifLink">
              <el-form-item label="域名地址" prop="domainUrl">
                <el-select v-model="form.domainUrl" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in urlList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <i v-if="refreshLoading" class="el-icon-loading m-l-10" />
                <el-tooltip
                  v-else
                  class="item"
                  effect="dark"
                  content="获取最新的域名地址"
                  placement="top"
                >
                  <i
                    class="el-icon-refresh-right m-l-10 pointer"
                    style="color: #0c6fff"
                    @click="getLiveRoomOrgConfig"
                  />
                </el-tooltip>
              </el-form-item>
            </template>
            <el-form-item v-if="ifLink" label="小程序链接" prop="dyMiniAppUrl">
              <el-input
                v-model="form.dyMiniAppUrl"
                style="width: calc(100% - 30px)"
                disabled
              />
              <el-tooltip
                class="item"
                effect="dark"
                content="点击复制"
                placement="top-start"
              >
                <i
                  style="height: 23px; line-height: 25px"
                  class="el-icon-document-copy a_link m-l-10"
                  @click="copyText(form.dyMiniAppUrl)"
                />
              </el-tooltip>
            </el-form-item>
            <el-form-item v-if="ifLink && form.dyMiniAppUrl" label="二维码">
              <span class="liveLinkCode">
                <AppQrcode :src="form.dyMiniAppUrl" :size="200" :margin="10" />
              </span>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <div slot="footer" class="ss-material-box-bottom">
      <div>
        <el-button v-if="ifLink" size="small" @click="onhandlePosterSetting">
          海报设置
        </el-button>
        <el-button size="small" @click="onClickShareLink">分享设置</el-button>
      </div>

      <div>
        <el-button
          v-if="showShortLinkInviteUrl"
          type="primary"
          size="small"
          class="m-l-20"
          :loading="loading"
          @click="copyUrl"
        >
          复制链接
        </el-button>
        <el-button
          v-if="ifLink"
          size="small"
          :loading="loading"
          @click="onhandleCreatePosters"
        >
          生成海报
        </el-button>
        <template v-else>
          <el-button
            v-if="havBtnOld('web:liveRoom:inviteNew')"
            size="small"
            type="primary"
            :loading="loading"
            @click="generateLink"
          >
            生成链接
          </el-button>
        </template>
        <el-button
          v-if="havBtnOld('web:liveRoom:inviteOld')"
          size="small"
          type="primary"
          :loading="loading"
          @click="generateLinkOld"
        >
          链接旧
        </el-button>

        <el-tooltip
          v-if="activeName === '1'"
          class="item"
          effect="dark"
          content="刷新会更新长、短链接，请谨慎使用！"
          placement="top-start"
        >
          <el-button
            class="ml-10"
            size="small"
            type="primary"
            :loading="shortLinkLoading"
            @click="shortLinkBtn"
          >
            刷新链接
          </el-button>
        </el-tooltip>

        <el-button size="small" @click="$emit('close')">取消</el-button>
      </div>
    </div>
    <posterDialog
      :config="posterConfig"
      :src="posterConfig.src"
      :nick-name="userInfo.nickName"
      :star-time="form.startTime"
      :live-room-name="form.name"
    />
    <shareDialog :config="shareConfig" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppQrcode from '@/components/AppQrcode'
import posterDialog from './posterDialog.vue'
import shareDialog from './shareSettingsDialog.vue'
import { liveModeOption } from '../../columns'
import { buildInviteUrlAjax } from '@/api/liveRoom/register'
import { copy } from '@/utils'
import Dialog from '@/views/live/Dialog'
import {
  // getLiveRoomOrgConfig,
  // buildInviteUrlNew,
  buildInviteUrlNewV2,
  getAllMainConfigByLiveRoomId
} from '@/api/liveRoom/setting.js'

import { mapGetters } from 'vuex'
import moment from 'moment'
import { getItem } from '@/utils/localStorage'
export default {
  components: {
    AppDialog,
    AppQrcode,
    posterDialog,
    shareDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          row: {}
        }
      }
    }
  },
  data() {
    return {
      shortLinkLoading: false, // 短链刷新loading
      liveModeOption,
      loading: false,
      refreshLoading: false,
      form: {
        liveModel: '',
        name: '',
        startTime: '',
        link: '', // h5链接（旧）
        shortLinkInviteUrl: '', // 短链接
        domainUrl: '', // 主域名
        dyMiniAppUrl: '', // 抖音小程序url
        hokAppUrl: '', // 获客APP
        miniAppUrl: '' // 微信小程序
      },
      posterConfig: {
        visible: false,
        src: ''
      },
      shareConfig: {
        visible: false
      },
      orgInfo: {},
      ifLink: false,
      oldLinkeClick: false,
      showShortLinkInviteUrl: false,
      urlList: [],
      activeName: '1',
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission_routes'])
  },
  watch: {
    'config.visible': {
      handler(val) {
        this.ifLink = false
        this.showShortLinkInviteUrl = false
        if (val) {
          this.init()
        } else {
          this.form = {
            liveModel: '',
            name: '',
            startTime: '',
            link: '', // h5链接（旧）
            shortLinkInviteUrl: '', // 短链接
            domainUrl: '', // 主域名
            dyMiniAppUrl: '', // 抖音小程序url
            hokAppUrl: '', // 获客APP
            miniAppUrl: '' // 微信小程序
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.initActiveName()
  },
  methods: {
    initActiveName() {
      const index = [
        'web:liveRoom:linkH5',
        'web:liveRoom:linkWechat',
        'web:liveRoom:linkApp',
        'web:liveRoom:linkDou'
      ].findIndex(value => this.permsList.includes(value))
      if (index !== -1) {
        this.activeName = String(index + 1)
      }
    },
    copyUrl() {
      switch (this.activeName) {
        case '1':
          this.copyText(this.form.shortLinkInviteUrl)
          break
        case '2':
          this.copyText(this.form.miniAppUrl)
          break
        case '3':
          this.copyText(this.form.hokAppUrl)
          break
        case '4':
          this.copyText(this.form.dyMiniAppUrl)
          break
      }
    },
    moment,
    // 点击生成海报
    onhandleCreatePosters() {
      switch (this.activeName) {
        case '1':
          this.posterConfig.src = this.form.shortLinkInviteUrl
          break
        case '2':
          this.posterConfig.src = this.form.miniAppUrl
          break
        case '3':
          this.posterConfig.src = this.form.hokAppUrl
          break
        case '4':
          this.posterConfig.src = this.form.dyMiniAppUrl
          break
      }
      this.posterConfig.visible = true
    },
    copyText(text) {
      copy(text)
      this.clipboardSuccess()
    },
    // 点击生成链接(旧)
    generateLinkOld() {
      this.oldLinkeClick = false
      this.loading = true
      const liveRoomId = this.config.row.id
      buildInviteUrlAjax({ liveRoomId })
        .then(res => {
          if (res.code === 1) {
            if (typeof res.data === 'string') {
              this.form.link = res.data
              this.ifLink = true
            } else {
              this.form.link = res.data.inviteUrl || ''
              this.form.shortLinkInviteUrl = res.data.shortLinkInviteUrl || ''
              this.ifLink = true
            }
            this.oldLinkeClick = true
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
      // this.form.link = process.env.VUE_APP_H5_URL + `live/wxLogin?tId=${this.userInfo.userId}&rId=${this.config.row.id}`
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    },
    // 生成链接（新）
    generateLink() {
      this.loading = true
      const liveRoomId = this.config.row.id
      const data = {
        liveRoomId: liveRoomId,
        domainUrl: this.form.domainUrl
      }
      buildInviteUrlNewV2(data)
        .then(res => {
          if (res.code === 1) {
            if (typeof res.data === 'string') {
              this.form.link = res.data
              this.ifLink = true
            } else {
              this.form.link = res.data.inviteUrl || ''
              this.form.shortLinkInviteUrl = res.data.shortLinkInviteUrl || ''
              this.form.miniAppUrl = res.data.miniAppUrl || ''
              this.form.dyMiniAppUrl = res.data.dyMiniAppUrl || ''
              this.form.hokAppUrl = res.data.hokAppUrl || ''
              this.form.miniAppUrl = res.data.miniAppUrl || ''
              this.ifLink = true
              this.showShortLinkInviteUrl = true
            }
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取域名详情
    getLiveRoomOrgConfig() {
      this.refreshLoading = true
      const data = {
        liveRoomId: this.config.row.id
      }
      return getAllMainConfigByLiveRoomId(data)
        .then(res => {
          let domainUrl = ''
          const obj = res.data.find(v => v.level === 1)
          if (!obj) {
            domainUrl = ''
          } else {
            domainUrl = obj.domainUrl
          }
          const arr = []
          res.data.map(v => {
            if (v.level === 2) {
              arr.push({
                value: `https://${v.domainUrl}.${domainUrl}`,
                label: `https://${v.domainUrl}.${domainUrl}`
              })
            }
          })
          this.urlList = arr
          if (this.urlList.length > 0) {
            this.form.domainUrl = this.urlList[0].value
          }
          this.refreshLoading = false
        })
        .catch(() => {
          this.refreshLoading = false
        })
    },
    // 判断是否有生成邀课链接-旧的权限
    // 判断是否有数据权限
    havBtnOld(key) {
      const obj = this.permission_routes?.find(v => v.path === '/privateLive')
      if (obj && obj.children && obj.children.length > 0) {
        const o = obj.children.find(v => v.path === 'liveNewRoom')
        // console.log(o, 'o')
        if (o && o.children && o.children.length > 0) {
          const p = o.children.find(v => v.path === 'newRoom')
          // console.log(p, 'p')
          if (p && p.meta && p.meta.permsList && p.meta.permsList.length > 0) {
            return p.meta.permsList.includes(key)
          }
        }
      }
      return false
    },
    // 点击海报设置
    onhandlePosterSetting() {
      switch (this.activeName) {
        case '1':
          this.posterConfig.src = this.form.shortLinkInviteUrl
          break
        case '2':
          this.posterConfig.src = this.form.miniAppUrl
          break
        case '3':
          this.posterConfig.src = this.form.hokAppUrl
          break
        case '4':
          this.posterConfig.src = this.form.dyMiniAppUrl
          break
      }
      console.log(this.form, this.posterConfig.src)
      Dialog.open({
        type: 'PosterList',
        visible: true,
        liveRoomInfo: this.form,
        userInfo: this.userInfo,
        src: this.form.link,
        success: res => {
          Dialog.close()
          Dialog.open({
            type: 'PosterSetting',
            visible: true,
            liveRoomInfo: this.form,
            userInfo: this.userInfo,
            src: this.form.link,
            success: () => {}
          })
        }
      })
    },
    onClickShareLink() {
      this.shareConfig.liveRoomId = this.config.row.id
      this.shareConfig.visible = true
    },
    init() {
      // 进入页面，手动触发获取链接
      this.loading = true
      this.ifLink = false
      this.showShortLinkInviteUrl = false
      this.form = {
        ...JSON.parse(JSON.stringify(this.config.row)),
        shortLinkInviteUrl: '',
        domainUrl: ''
      }
      this.orgInfo = getItem('orgInfo')
      this.getLiveRoomOrgConfig()
        .then(() => {
          this.generateLink()
        })
        .catch(() => {
          this.loading = false
        })
    },
    async shortLinkBtn() {
      if (this.shortLinkLoading) return
      this.shortLinkLoading = true

      try {
        const liveRoomId = this.config.row.id
        const data = {
          liveRoomId: liveRoomId,
          domainUrl: this.form.domainUrl,
          refresh: true
        }
        const res = await buildInviteUrlNewV2(data)
        if (res.code === 1 && typeof res.data !== 'string') {
          this.form.shortLinkInviteUrl = res.data.shortLinkInviteUrl || ''
          this.form.link = res.data.inviteUrl || ''
        }
        this.loading = false
      } catch (error) {
        console.log('error', error)
      }
      this.shortLinkLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.InviteDialog {
  max-height: 635px;
  padding: 19px 20px;
}
.m-l-32 {
  margin-left: 32px;
}
.ml-10 {
  margin-left: 10px;
}
.w-56 {
  width: 56px;
}
::v-deep {
  .el-form-item__label {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 600;
    color: #000000;
  }
  .el-form-item__content {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
  }
}
.ss-material-box-bottom {
  display: flex;
  padding-right: 20px;
  padding-left: 20px;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
  width: 100%;
  height: 66px;
  // background-color: #fafbfc;
  border-radius: 2px 2px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.liveLinkCode {
  display: inline-block;
  border: 10px solid #f2dfc7;
}

::v-deep {
  .el-tabs {
    // height: 100%;
    display: flex;
    flex-direction: column;
  }
  .el-tabs__content {
    padding: 0;
    height: 100%;
  }
  .el-tab-pane {
    height: 100%;
  }
  .app-avatar {
    display: inline-block;
    transform: translateY(-2px);
  }
  .el-tabs__header {
    margin: 0;
    padding: 0;
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #f2f2f2;
  }
  .el-tabs__item {
    padding: 0 5px;
  }
  .tabsHeader {
    width: 100%;
    border-radius: 5px;
    background: #f7f7f7;
    height: 34px;
    float: left;
    width: 116px;
    text-align: center;
    line-height: 34px;
    color: #000000;
    text-align: center;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-style: normal;
    font-weight: bolder;
    line-height: 34px;
    .tips {
      .tipsText {
        line-height: 34px;
        color: #000000;
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: bolder;
        line-height: 34px;
      }
    }
    &:hover {
      background: #deebff;
    }
  }
  .el-tabs__active-bar {
    opacity: 0;
  }
  .el-tabs__nav {
    height: 44px;
  }
  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    line-height: 34px;
  }
  .is-active {
    .tabsHeader {
      color: #fff;
      background: #0c6fff;
    }
  }
  .el-tabs__nav-wrap::after {
    height: 0px;
  }
}
</style>
