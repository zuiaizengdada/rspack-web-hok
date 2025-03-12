<template>
  <div class="detail-channel-container">
    <p
      v-for="(item, index) in channelList"
      :key="item.platformId"
      class="w-full cursor-pointer relative channel-item flex items-center justify-center"
      :class="{ active: activeChannelNavIndex === index }"
      @click="handleClickChannelItem(index)"
    >
      <el-image :src="item.platformIcon" class="channel-icon" />
      <i v-show="item.accountNums > 0" class="num absolute">{{
        item.accountNums
      }}</i>
      <img
        v-if="item.contentError || item.accountError"
        :src="warn"
        class="status"
      />
    </p>
  </div>
</template>
<script>
import { qryAccountPlatform } from '../../../api/index'
import warn from '@/assets/svg/videoManga/warn_icon.svg'
export default {
  data() {
    return {
      channelList: [],
      activeChannelNavIndex: -1,
      warn
    }
  },
  inject: [
    'updateCurrentChannelId',
    'updateChannelIconList',
    'publishChannelData',
    'channel',
    'updateInitErrorList'
  ],
  computed: {
    getAccountList() {
      return this.publishChannelData.list
    },
    getErrList() {
      return this.channel.isUpdateIndex
    }
  },
  watch: {
    getAccountList(val) {
      this.resetNums()
    },
    'channel.errList': {
      handler() {
        const list = this.channel.errList
        this.setError(list)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getPlatformList()
  },
  methods: {
    // 更改错误的状态
    setError(val) {
      console.log(val, '错误的状态')
      this.channelList.forEach(ele => {
        val.forEach(item => {
          if (item.platformId === ele.platformId) {
            ele.accountError = item.accountError
            ele.contentError = item.contentError
          }
        })
      })
      this.$forceUpdate()
    },
    handleClickChannelItem(index) {
      this.activeChannelNavIndex = index
      const id = this.channelList[index].platformId
      this.updateCurrentChannelId(id)
      this.$emit('switch', this.channelList[index])
    },
    // 重置账号数量
    resetNums() {
      this.channelList.forEach(ele => {
        ele.accountNums = 0
      })
      this.getAccountList.forEach(item => {
        this.channelList.forEach(ele => {
          if (item.account.platformId === ele.platformId) {
            // ele.accountNums = ele.accountNums + 1
            this.$set(ele, 'accountNums', ele.accountNums + 1)
            this.$forceUpdate()
          }
        })
      })
      console.log(this.channelList, '重置完之后的账号')
    },
    async getPlatformList() {
      const res = await qryAccountPlatform()
      console.log('渠道', res.data)
      this.channelList = res.data
      const initErrorList = []
      this.channelList.forEach(ele => {
        ele.accountNums = 0
        // 账号错误
        ele.accountError = false
        // 内容错误
        ele.contentError = false
        initErrorList.push({
          accountError: false,
          contentError: false,
          platformId: ele.platformId
        })
      })
      this.updateInitErrorList(initErrorList)
      this.updateChannelIconList(res.data)
      this.resetNums()
      this.$nextTick(() => {
        const $channelItem = document.querySelectorAll(
          '.detail-channel-container .channel-item'
        )
        $channelItem[0].click()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-channel-container {
  width: 80px;
  background: #f0f9ff;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: -20px;
    z-index: 10;
    border-left: 20px solid #eee;
    height: 100%;
  }
  .channel-icon {
    width: 48px;
    height: 48px;
  }
  .channel-item {
    height: 80px;
    &.active {
      background: #fff;
      &::before {
        content: '';
        width: 6px;
        height: 80px;
        background: #0c6fff;
        border-radius: 10px 0px 0px 6px;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
    .num {
      top: 10px;
      right: 4px;
      width: 18px;
      height: 18px;
      background: #ffffff;
      border: 1px solid #0c6fff;
      border-radius: 50%;
      text-align: center;
      line-height: 16px;
      font-size: 12px;
      color: #0c6fff;
      font-style: normal;
    }
    .status {
      position: absolute;
      bottom: 10px;
      right: 0;
    }
  }
}
</style>
