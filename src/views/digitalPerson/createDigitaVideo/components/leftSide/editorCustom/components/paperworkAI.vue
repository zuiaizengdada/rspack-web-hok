<template>
  <div>
    <div class="dialog-row">
      <img
        class="arrow-up"
        src="@/assets/image/aigc/digitalVideoManage/xfjt.png"
        alt=""
      />
      <div
        v-for="(item, index) in list"
        :key="index"
        class="dialog-item"
        @click="handleClick(item)"
      >
        <img class="text-icon" :src="item.icon" alt="" />
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          id: '1',
          label: '文案生成',
          icon: require('@/assets/image/aigc/digitalVideoManage/wwsc.png')
        },
        {
          id: '2',
          label: '文案优化',
          icon: require('@/assets/image/aigc/digitalVideoManage/wwyh.png')
        },
        {
          id: '3',
          label: '文案扩展',
          icon: require('@/assets/image/aigc/digitalVideoManage/wwkz.png')
        },
        {
          id: '4',
          label: '文案精简',
          icon: require('@/assets/image/aigc/digitalVideoManage/wwjx.png')
        },
        {
          id: '5',
          label: '语意纠错',
          icon: require('@/assets/image/aigc/digitalVideoManage/yyjc.png')
        }
      ]
    }
  },
  methods: {
    handleClick(item) {
      if (item.id === '1') {
        this.$uweb &&
          this.$uweb.setAction('Event_Create_AI_Video_Polyphonic_Character')
      } else if (item.id === '2') {
        this.$uweb &&
          this.$uweb.setAction(
            'Event_Create_AI_Video_Audio_CopywritingOptimization'
          )
      } else if (item.id === '3') {
        this.$uweb &&
          this.$uweb.setAction('Event_Create_AI_Video_Audio_ExpandWritten')
      } else if (item.id === '4') {
        this.$uweb && this.$uweb.setAction('Event_Create_AI_Video_Audio_Reduce')
      }
      this.$emit('handleAIClick', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-row {
  width: 194px;
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
  position: relative;
  border-radius: 8px;
  position: relative;
  padding: 4px 0;
  .arrow-up {
    position: absolute;
    width: 28px;
    height: 23px;
    transform: translateX(-50%);
    left: 8vw;
    top: -17px;
  }
  // &::after {
  //   content: '';
  //   position: absolute;
  //   width: 0;
  //   height: 0;
  //   border-right-width: 10px;
  //   border-bottom-width: 13px;
  //   border-left-width: 10px;
  //   border-style: solid;
  //   border-color: transparent;
  //   border-bottom-color: #ffffff;
  //   top: -14px;
  //   right: 10%;
  //   transform: translateX(-50%);
  // }

  .dialog-item {
    padding: 7px 10px;
    display: flex;
    align-items: center;
    user-select: none;
    cursor: pointer;
    &:hover {
      background: #f5f5f5;
    }
    .text-icon {
      width: 20px;
      height: 20px;
      margin-right: 6px;
    }
    span {
      font-size: 14px;
      color: #333333;
    }
  }
}
</style>
