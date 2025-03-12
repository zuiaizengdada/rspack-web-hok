<template>
  <div v-loading="pageLoading" class="aiDetail">
    <div class="aiDetailHeader">
      <img src="@/assets/image/aigc/close.png" alt="" @click="$emit('close')" />
      <img
        v-if="!form.isPrivate && !form.isDeleted"
        src="@/assets/image/aigc/aiShare.png"
        @click="onhandleShare"
      />
    </div>
    <div class="ailist_view_img">
      <img
        v-if="isScene.type === 'AI'"
        src="@/assets/image/aigc/my_icon.png"
        alt=""
      />
      <template v-else>
        <img v-if="!!form.icon" :src="form.icon" alt="" />
        <div
          v-else
          class="title-span"
          :style="{ background: form.backgroundColor }"
        >
          <span :style="{ color: form.textColor }">{{
            form.title.split('')[0]
          }}</span>
        </div>
      </template>
    </div>
    <div class="aiDetail_title">
      {{ form.templateId === '1' ? '智云' : form.title }}
    </div>
    <div class="aiDetail_describe">
      {{
        form.templateId === '1'
          ? '全能AI小助手，解决你的所有问题'
          : form.description
      }}
    </div>
    <div class="ailist_detail_footer">
      <div class="ailist_detail_footer_des">
        <div>
          <img src="@/assets/image/aigc/aiCreater.png" /><span>{{
            form.createdNickName
          }}</span>
        </div>
        <div>
          <img src="@/assets/image/aigc/aiHot.png" /><span>{{
            form.useCounter
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getItem } from '@/utils/localStorage'
import { getAssistantDetails } from '@/api/aigc/index.js'
import { copy } from '@/utils'
export default {
  components: {},
  data() {
    return {
      pageLoading: false,
      form: {
        backgroundColor: '',
        createdAt: '',
        createdNickName: '',
        isEnabled: '',
        shareCode: '',
        content: '',
        description: '',
        icon: '',
        isPrivate: '',
        isDeleted: '',
        fileList: '',
        templateId: '',
        title: ''
      }
    }
  },
  computed: {
    ...mapState({
      isAICenter: state => state.ai.isAICenter,
      isScene: state => state.ai.isScene
    })
  },
  watch: {
    'isScene.templateId': {
      handler(val) {
        val && this.getDetail()
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 点击分享按钮
    onhandleShare() {
      const orginfo = getItem('orgInfo')
      const text = `大家好！我想和你们分享一个我最近发现的超棒助手：${this.form.title}，由${this.form.createdNickName}精心制作，能助你一臂之力，让学习和工作更高效！点击链接体验${this.form.title}的魔法：${window.location.origin}/#/ai/share?oid=${orginfo.organizationId}&i=${this.form.shareCode}`
      copy(text)
      this.$message.success({
        message: '已复制链接，分享给好友吧！',
        customClass: 'whiteMessage amap-sug-result',
        center: true
      })
    },
    getDetail(templateId) {
      this.pageLoading = true
      const data = {
        templateId: this.isScene.templateId
      }
      getAssistantDetails(data)
        .then(res => {
          if (res.data) {
            this.form = res.data
          }
          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.aiDetail {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #ffffff;
  z-index: 1000;

  .aiDetailHeader {
    position: absolute;
    top: 20px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    > i,
    img {
      width: 24px;
      height: 24px;
      font-size: 24px;
      cursor: pointer;
    }
  }
  .ailist_view_img {
    padding-top: 102px;
    width: 100px;
    margin: 0 auto;
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
  .aiDetail_title {
    margin-top: 30px;
    font-size: 16px;
    font-family: PingFangSC, PingFang SC;
    font-weight: bold;
    color: #313233;
    line-height: 22px;
    text-align: center;
  }
  .aiDetail_describe {
    margin: 30px auto 20px;
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-break: break-all;
    text-align: center;
  }
  .ailist_detail_footer {
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
}
</style>
