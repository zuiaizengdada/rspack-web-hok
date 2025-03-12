<template>
  <div class="template-container w-full">
    <slot name="detailSlot01" class="mb-20" />
    <detail-account class="" @add="addAccount" @active="activeAccount" />
    <detail-default v-if="visibleDefaultDetail" />
    <div v-else class="template-content overflowOuto1 pt-20">
      <slot name="detailSlot02" class="mb-20" />
      <detail-title v-if="['bilibili','xiaohongshu'].includes(type)" class="mb-20" :max="maxTitleLength" :type="type" />
      <slot name="detailSlot03" class="mb-20" />
      <detail-cover class="mb-20" />
      <slot name="detailSlot04" class="mb-20" />
      <detail-intro class="mb-20" :max="maxIntroLength" />
      <detail-topic :type="type" />
      <detail-friends v-if="type!=='bilibili'" class="mb-20" />
      <slot name="detailSlot05" class="mb-20" />
      <detail-address v-if="type!=='bilibili' && type!=='tiktok'" class="mb-20" />
      <slot name="detailSlot06" class="mb-20" />
      <detail-open-scope v-if="type!=='bilibili' && type!=='wechart'" class="mb-20" :type="type" />
      <slot name="detailSlot07" class="mb-20" />
      <detail-publish-timed :type="type" />
      <slot name="detailSlot08" class="mb-20" style="border: 1px solid red;" />
    </div>
  </div>
</template>
<script>
import DetailAccount from './DetailAccount/index.vue'
import DetailCover from './DetailCover.vue'
import DetailIntro from './DetailIntro/index.vue'
import DetailAddress from './DetailAddress.vue'
import DetailTitle from './DetailTitle.vue'
import DetailOpenScope from './DetailOpenScope.vue'
import DetailPublishTimed from './DetailPublishTimed.vue'
import DetailDefault from './DetailDefault/index.vue'
import DetailTopic from './DetailTopic.vue'
import DetailFriends from './DetailFriends.vue'

export default {
  components: {
    DetailAccount,
    DetailCover,
    DetailIntro,
    DetailAddress,
    DetailTitle,
    DetailOpenScope,
    DetailPublishTimed,
    DetailDefault,
    DetailTopic,
    DetailFriends
  },
  inject: ['publishChannelData', 'channel'],
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visibleDefaultDetail: true,
      maxTitleLength: 20,
      maxIntroLength: 200
    }
  },
  computed: {
    getPublishChannelDataList() {
      return this.publishChannelData.list
    },
    getChannelId() {
      return this.channel.id
    }
  },
  watch: {
    getPublishChannelDataList(val) {
      this.initAccount()
    },
    'channel.id': {
      handler(val) {
        const list = this.publishChannelData.list

        if (list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].account.platformId === val) {
              this.visibleDefaultDetail = false
              break
            }
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    if (this.type === 'bilibili') {
      this.maxTitleLength = 80
      this.maxIntroLength = 250
    }
    if (this.type === 'wechart') {
      this.maxIntroLength = 1000
    }
    if (this.type === 'kuaishou') {
      this.maxIntroLength = 500
    }
    if (this.type === 'xiaohongshu') {
      this.maxIntroLength = 1000
    }
  },
  methods: {
    initAccount() {
      const arr = this.publishChannelData.list.filter(
        ele => Number(ele.account.platformId) === Number(this.channel.id)
      )
      if (arr.length > 0) {
        this.visibleDefaultDetail = false
      } else {
        this.visibleDefaultDetail = true
      }
    },
    addAccount(list) {
      console.log(list, '触发了添加的时间')
      this.$emit('add', list)
      this.visibleDefaultDetail = false
    },
    activeAccount(id) {
      const arr = this.publishChannelData.list.filter(
        ele => Number(ele.account.platformId) === Number(this.channel.id)
      )
      if (arr.length > 0) {
        this.$emit('active', id)
        this.visibleDefaultDetail = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.template-container{
  height: 100%;
  padding: 20px 20px 0 20px;
  display: flex;
  flex-direction: column;
}
.mb-20{
  margin-bottom:20px;
}
.pt-20{
  padding-top: 20px;
}
.template-content{
  padding-bottom: 100px;
}
</style>
