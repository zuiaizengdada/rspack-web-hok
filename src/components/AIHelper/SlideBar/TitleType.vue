<template>
  <div ref="el" class="title flex items-center" @click.stop="handlePopoverShow">
    <img
      v-if="getTitleInfo.type === 'AI'"
      class="title-icon"
      src="@/assets/image/aigc/icon.png"
      alt=""
    />
    <template v-else>
      <img
        v-if="!!getTitleInfo.icon"
        class="title-icon"
        :src="getTitleInfo.icon"
        alt=""
      />
      <div
        v-else
        class="title-span"
        :style="{
          background: getTitleInfo.backgroundColor
        }"
      >
        <span
          :style="{
            color: getTitleInfo.textColor
          }"
        >{{ getTitleInfo.headTitle }}</span>
      </div>
    </template>

    <span>{{ getTitleInfo.name }}</span>
    <img class="title-icon2" src="@/assets/image/aigc/sort.png" alt="" />
    <div v-if="popoverShow" id="popoverId" class="popover">
      <div class="title-list">
        <template v-for="(item, ii) in getTypeAIList">
          <div
            v-if="!ignoreList.includes(item.id)"
            :key="ii"
            class="title-item"
            @click.stop="change(ii)"
          >
            <div
              :class="{
                'title-item-content': true,
                'title-item-select': item.checked
              }"
            >
              <img
                v-if="item.type === 'AI'"
                src="@/assets/image/aigc/icon.png"
                alt=""
              />
              <template v-else>
                <img
                  v-if="!!item.icon"
                  class="title-icon"
                  :src="item.icon"
                  alt=""
                />
                <div
                  v-else
                  class="title-span"
                  :style="{
                    background: item.backgroundColor
                  }"
                >
                  <span
                    :style="{
                      color: item.textColor
                    }"
                  >{{ item.title.split('')[0] }}</span>
                </div>
              </template>
              <span> {{ item.name }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  inject: [
    'getTypeAIList',
    'setChatMessage',
    'clearChatMessage',
    'getWS',
    'createWS',
    'getChatMessageList',
    'getHistory',
    'getDisabledInput',
    'setDisabledInput',
    'getIsAIEnd'
  ],
  data() {
    return {
      popoverShow: false,
      // 忽略显示
      ignoreList: ['14']
    }
  },
  computed: {
    getTitleInfo() {
      const info = this.getTypeAIList?.find(item => item.checked) || {}
      info.headTitle = info?.title ? info?.title?.split('')[0] : ''
      return info
    }
  },
  methods: {
    handlePopoverShow(event) {
      event.stopPropagation()
      this.popoverShow = !this.popoverShow
    },
    async change(index) {
      this.popoverShow = false
      if (!this.getIsAIEnd()) return
      this.$uweb && this.$uweb.setAction('Event_sidebar_click_my_ai')
      this.$uweb && this.$uweb.setAction('Event_my_ai_click')
      this.setDisabledInput(false)
      if (this.getTypeAIList[index].checked) {
        return
      }
      this.clearChatMessage()

      // 存储当前选中的助手
      this.$store.dispatch('ai/setScene', this.getTypeAIList[index])
      this.getHistory(undefined, this.getTypeAIList[index]).then(res => {
        if (!res) {
          this.clearChatMessage()
          this.setChatMessage({
            type: 'welcome',
            test: '',
            hasNew: true
          })
        }
        this.getTypeAIList[index].checked = true
        this.getTypeAIList.forEach((item, ii) => {
          if (ii !== index) {
            item.checked = false
          }
        })
        this.$emit('change')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  // width: 80%;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  // &:hover {
  //   cursor: default;
  //   // background: #e0e4e6;
  //   // border-radius: 6px;
  //   .popover {
  //     display: block;
  //   }
  // }
  .title-icon {
    width: 36px;
    height: 36px;
    background: #ffffff;
    border-radius: 50% !important;
    border: 1px solid #c2d9ff;
    margin-right: 8px;
  }
  .title-span {
    margin-right: 8px;
    min-width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  span {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #313233;
    // 文本溢出隐藏
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .title-icon2 {
    width: 10px;
    height: 14px;
    margin-left: 32px;
  }
  .popover {
    position: absolute;
    z-index: 1003;
    top: 40px;
    left: -30px;
    padding-top: 10%;
    display: block;
    cursor: pointer;
    width: 208px;
    .title-list {
      width: 208px;
      box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      max-height: 600px;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 2px;
      }
      &::-webkit-scrollbar-track {
        background: null;
      }
      &::-webkit-scrollbar-thumb {
        background: #c2d9ff;
      }
      .title-item {
        width: 100%;
        height: 60px;
        .title-item-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          padding: 12px 16px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #313233;
          background: #f7f7f7;
          span {
            // 文本溢出隐藏
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          img {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            margin-right: 8px;
          }

          &:hover {
            background: #f0f6ff;
            color: #3a7fff;
          }
        }
      }
      .title-item-select {
        background: #c2d9ff !important;
        border: 1px solid #a3c6ff;
      }
    }
  }
}
</style>
