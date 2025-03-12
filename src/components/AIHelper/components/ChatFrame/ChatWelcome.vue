<template>
  <div
    :style="{
      'margin-right': isFullScreen() ? '32px' : '32px',
      'margin-left': isFullScreen() ? '32px' : '32px'
    }"
  >
    <div class="chat-welcome-container">
      <span class="bg" />
      <div class="content">
        <h4 v-if="customWelcome" v-html="welcomeContent" />
        <h4 v-else>
          {{ userInfo.nickName }}，你好！<br />
          欢迎使用AI助手：{{ getInfo.name }}
        </h4>
        <!--  <p>
          随时随地为您提供帮助，她始终如一，贴心周到。相信一定能让生活和工作变得更加高效与便捷。
        </p>
       <p>
          无论面临何种挑战或疑问，AI助手都能理解您的问题并提供可操作性方案。她能分析您的文字或语音讯息，
          精准理解您的意图与需求，并作出最恰当的回应。
        </p> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ChatWelcome',
  inject: {
    getTypeAIList: {
      default: () => []
    },
    isFullScreen: {
      default: () => false
    },
    customWelcome: {
      default: false
    },
    welcomeContent: {
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['userInfo']),
    getInfo() {
      return this.getTypeAIList?.find(item => item.checked)
    }
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.chat-welcome-container {
  padding: 24px;
  position: relative;
  background: linear-gradient(140deg, #5b5dec 0%, #38b1cc 100%);
  border-radius: 10px;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f5f8ff;
    filter: blur(4px);
  }
  .content {
    position: relative;
    z-index: 2;
    h4 {
      font-weight: 600;
      color: #313233;
      font-size: 18px;
      line-height: 25px;
    }
    p {
      font-size: 14px;
      color: #67686b;
      line-height: 20px;
    }
  }
}
</style>
