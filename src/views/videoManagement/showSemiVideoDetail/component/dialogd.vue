<template>
  <!-- 生成视频弹框 -->
  <AppDialog
    v-model="config.visible"
    title="生成视频"
    width="694px"
    height="270px"
    top="10vh"
    :loading="config.loading"
    :footer-text="footerText"
    @close="$emit('close')"
    @success="success()"
  >
    <div v-loading="config.loading" class="ele-tabs-wrap">
      <div class="ele-tabs-wrap-title">{{ config.title }}</div>
      <div class="ele-tabs-wrap-form">
        <div class="ele-tabs-wrap-form-flex">
          <div>时长：</div>
          <div>{{ config.sumTime | getTime }}</div>
        </div>
        <div class="ele-tabs-wrap-form-flex">
          <div>最近修改：</div>
          <div>{{ config.updateTime | filterDate }}</div>
        </div>
        <div class="ele-tabs-wrap-form-flex">
          <div>生成格式：</div>
          <div>mp4</div>
        </div>
        <div class="ele-tabs-wrap-form-flex">
          <div>清晰度：</div>
          <div>1080P</div>
        </div>
        <div class="ele-tabs-wrap-form-flex flex-last">
          <div>生成位置：</div>
          <div>脱敏管理/脱敏视频/详情/已完成手动脱敏</div>
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog
  },
  filters: {
    // 毫秒转时:分:秒:毫秒
    getTime(value) {
      const h = String(Math.floor(value / 3600000))
      const m = String(Math.floor((value / 60000) % 60))
      const s = String(Math.floor((value / 1000) % 60))
      return `${h > 0 ? h + '小时' : ''}${m}分${s}秒`
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          title: '',
          sumTime: 0,
          loading: false,
          updateTime: ''
        }
      }
    },
    success: {
      type: Function,
      default: () => {}
    }
    // visible: {
    //   type: Boolean,
    //   default: false
    // },
    // title: {
    //   type: String,
    //   default: '选择'
    // }
  },
  data() {
    return {
      footerText: ['生成视频', '取 消']
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.ele-tabs-wrap {
  padding: 20px;
  .ele-tabs-wrap-title {
    font-size: 18px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
    line-height: 26px;
    margin-bottom: 30px;
  }
  .ele-tabs-wrap-form {
    display: flex;
    flex-wrap: wrap;
    .ele-tabs-wrap-form-flex {
      flex: 50% 0 0;
      display: flex;
      align-items: center;
      margin-bottom: 32px;
      > div:first-child {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #777777;
        line-height: 24px;
      }
      > div:last-child {
        margin-left: 8px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 22px;
      }
    }
    .flex-last {
      flex: 100% 0 0;
    }
  }
}
</style>
