<template>
  <!-- 班期详情弹框 -->
  <el-drawer
    :size="847"
    :visible.sync="visibleDialog"
    v-bind="$attrs"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    v-on="$listeners"
  >
    <div v-if="visibleDialog" class="drawerBody">
      <div class="p-20 border-b border-#EFF2F6" style="height: 60px">
        <p class="font-bold text-16">分享详情</p>
      </div>
      <div class="flex flex-col gap-2 p-20 drawerContent overflowOuto">
        <div class="flex items-center w-full">
          <div class="mr-2 w-100px">长链接</div>
          <div class="flex flex-1 items-center">
            <el-input v-model="qrcodeUrl" size="small" :disabled="true" />
            <i
              class="ml-2 el-icon-document-copy"
              style="color: #065cff"
              @click="handleCopy(qrcodeUrl)"
            />
            <!-- <i class="ml-2 el-icon-refresh-left" style="color: #065cff" /> -->
          </div>
        </div>
        <div class="flex items-center w-full">
          <div class="mr-2 w-100px">短链接</div>
          <div class="flex flex-1 items-center">
            <el-input v-model="encryptUrl" size="small" :disabled="true" />
            <i
              class="ml-2 el-icon-document-copy"
              style="color: #065cff"
              @click="handleCopy(encryptUrl)"
            />
            <i
              class="ml-2 el-icon-refresh-left"
              style="color: #065cff"
              @click="getShortUrl(true)"
            />
          </div>
        </div>
        <div class="flex items-center w-full">
          <div class="flex items-start mr-2 h-full w-100px">二维码</div>
          <div class="flex flex-col">
            <AppQrcode
              ref="qrCode"
              :src="encryptUrl"
              style="width: 225px; height: 225px"
              class="border border-#EFF2F6 mb-2"
            />
            <el-button
              type="primary"
              :loading="downLoading"
              @click="downDeliverUrl"
            >下载二维码</el-button>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
// import { mapGetters } from 'vuex'
import { copy } from '@/utils/index'
import { getShortUrl } from '@/api/course'
import AppQrcode from '@/components/AppQrcode'

export default {
  components: {
    AppQrcode
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    scheduleId: {
      type: [Number, String],
      default: ''
    },
    goodsId: {
      type: [Number, String],
      default: ''
    },
    current: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      downLoading: false,
      activeName: 'scheduleDetails',
      encryptUrl: '',
      tabs: [
        { label: '班期详情', value: 'scheduleDetails', isShow: false },
        { label: '课程目录', value: 'classList', isShow: false },
        { label: '学员列表', value: 'studentList', isShow: false },
        { label: '学员出入班记录', value: 'studentRecord', isShow: false },
        { label: '操作记录', value: 'actionRecord', isShow: false }
      ],
      permsList: []
    }
  },
  computed: {
    qrcodeUrl() {
      return `${
        process.env.VUE_APP_H5_URL
      }pages/subpage/middle/index?scheduleId=${this.current.id}&shopId=${
        this.current.tenantId
      }&enrollmentTeacherId=${
        JSON.parse(localStorage.getItem('UserInfo')).userId
      }`
    },
    // ...mapGetters(['permission_routes']),
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    visibleDialog(val) {
      val && this.init()
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    handleCopy(val) {
      if (!val) return
      copy(val)
      this.$message.success('复制成功')
    },
    async downDeliverUrl() {
      this.downLoading = true
      const title = `班期二维码.jpg`
      const iconUrl = this.$refs.qrCode.$el.src
      const a = document.createElement('a')
      const event = new MouseEvent('click')
      a.download = title
      a.href = iconUrl
      a.dispatchEvent(event)
      this.downLoading = false
    },
    async init() {
      this.getShortUrl()
    },
    async getShortUrl(refresh = false) {
      this.encryptUrl = ''
      const res = await getShortUrl({
        originalUrl: this.qrcodeUrl,
        refresh
      })
      if (res.code === 1) {
        this.encryptUrl = res.data
      }
    },
    // 点击关闭
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-icon-document-copy {
  cursor: pointer;
}
.el-icon-refresh-left {
  cursor: pointer;
}
.drawerBody {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .ss-material-box-header {
    box-sizing: border-box;
    height: 52px;
    display: flex;
    align-items: flex-end;
    position: relative;
    .mytabs {
      padding-left: 20px;
      border-bottom: 1px solid #dfe4ed;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 24px;
      display: flex;
      .mytabsView {
        margin-right: 21px;
        padding-bottom: 8px;
        cursor: pointer;
      }
      .active {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #0c6fff;
        line-height: 24px;
        border-bottom: 2px solid #0c6fff;
      }
    }
    .close {
      position: absolute;
      right: 20px;
      top: 22px;
    }
  }
  .close {
    color: #b2b2b2;
    margin-left: auto;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .drawerContent {
    flex: 1 0 0;
  }
  .ss-material-box-footer {
    padding-right: 18px;
    border-top: 1px solid #e7e7e7;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
::v-deep {
  .el-tabs__header {
    margin: 0;
  }
}
</style>
