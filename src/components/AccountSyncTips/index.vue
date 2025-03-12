<template>
  <div
    v-show="isShow&& !isDev"
    class="accountSyncTips"
  >
    <svg-icon icon-class="icon_error" class-name="icon-error" />
    <div class="el-message__content content">
      <div>
        <span>您有{{ accountNum }}个账号今日数据未同步，请尽快同步</span>
      </div>
      <span class="a_span" @click="handleOpenView">去同步</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AccountSyncTips',
  data() {
    return {
      permsList: [],
      isShow: false,
      isDev: process.env.NODE_ENV === 'development'
    }
  },
  mounted() {
    setTimeout(() => {
      this.init()
    }, 2000)
  },
  computed: {
    ...mapGetters(['accountNum'])
  },
  watch: {
    accountNum: {
      handler(val) {
        this.init()
      },
      deep: true
    }
  },
  methods: {
    init() {
      if (this.accountNum > 0) {
        this.isShow = true
      } else {
        this.isShow = false
      }
    },
    handleOpenView() {
      this.$router.push({
        path: '/videoManagement/accountManage'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-error {
  font-size: 20px;
  margin-right: 10px;
}
.accountSyncTips {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 36px;
  box-sizing: border-box;
  background-color: #ffeded;
  border-color: #ffdbdb;
  height: 50px;
  position: absolute;
  top: 0;
}
.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  .a_span {
    font-weight: 500;
    color: #0c6fff;
    font-size: 16px;
    cursor: pointer;
  }
  .close {
    font-size: 14px;
    color: #777777;
    font-weight: 500;
    cursor: pointer;
  }
}
</style>
