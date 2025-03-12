<template>
  <div v-if="getDialogVisible" class="custom-dialog">
    <div class="nullBox" />
    <div class="warp">
      <div
        ref="dialogBodyRef"
        :class="{
          'custom-dialog-body': true,
          'full-screen': isFullScreen(),
          'slide-screen': !isFullScreen()
        }"
        :style="{ 'padding-bottom': isFullScreen() ? '0' : '0' }"
      >
        <div class="custom-dialog-head">
          <div class="head-info">
            <div
              class="head-img"
              :style="{
                background: !!getInfo.icon ? '' : getInfo.backgroundColor,
                color: !!getInfo.icon ? '' : getInfo.textColor
              }"
            >
              <img v-if="getInfo.icon" :src="getInfo.icon" alt="">
              <span v-else> {{ getInfo.headerTitle }}</span>
            </div>
            <div>
              <div class="head-title">
                {{ getInfo.title }}
                <!-- <div class="head-tag">内容创作</div> -->
              </div>
              <div class="head-describe">
                {{ getInfo.describe }}
              </div>
            </div>
          </div>
          <div style="height: 100%; padding-top: 18px" @mousedown="handleKeyup">
            <i class="el-icon-close close" @click="$emit('close')" />
          </div>
        </div>
        <div
          :class="{
            'custom-dialog-content': true,
            'custom-dialog-content-full': isFullScreen(),
            'custom-dialog-content-slide': !isFullScreen()
          }"
          @mousedown="handleKeyup"
        >
          <component
            :is="item.name"
            v-for="(item, i) in componentList"
            :key="i + 'custom-component'"
            v-model="item.value"
            :type="item.type"
            v-bind="item.props"
            :rows="1"
          />
        </div>
        <div class="bottom-btn" @mousedown="handleKeyup">
          <el-button
            class="btn-send"
            :style="{ width: isFullScreen() ? '95.2%' : '86.8%' }"
            @click="send"
          >发送</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
export default {
  inject: [
    'isFullScreen',
    'getTypeAIList',
    'setIsAIEnd',
    'setChatMessage',
    'getChatMessageList'
  ],
  name: 'CustomDialog',
  model: {
    prop: 'dialogVisible',
    event: 'change'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    /**
     * @param {Array} list
     * @param {String} list.type
     * @param {Object} list.props
     * @param {Array} list.class
     * @param {Object} list.info
     */
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      componentList: []
    }
  },
  computed: {
    getDialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('change', val)
      }
    },
    getInfo() {
      return this.list[0].info
    }
  },
  watch: {
    getDialogVisible(val) {
      if (val) {
        this.componentList = [...this.list]
        this.$nextTick(() => {
          this.$refs.dialogBodyRef.classList.add('custom-dialog-body-popup')
        })
      }
    }
  },
  methods: {
    handleKeyup(e) {
      e.stopPropagation()
    },
    send() {
      const info = this.getTypeAIList.find(item => item.checked)
      const regex = /\【.*?\】/g
      const matches = info.content.match(regex)
      const list = []
      this.componentList.map((m, i) => {
        const key = matches[i].replace(/[\【]/, '').replace(/[\】]/, '')
        list.push({
          replace_key: key,
          replace_value: m.value.trim().length === 0 ? '' : m.value
        })
      })
      const params = JSON.stringify({ template_id: info.id, replaces: list })

      eventBus.$emit('templateSend', params)
      this.$emit('change', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-dialog {
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1002;
  overscroll-behavior: contain;
  display: flex;
  overflow-y: hidden;
  .nullBox {
    width: 279px;
    height: 100%;
  }
  .warp {
    flex: 1;
    height: 100%;
    margin: auto;
    display: flex;
    flex-direction: row;
    justify-content: center; /* 水平居中 */
    align-items: flex-end;
  }
  .custom-dialog-body-popup {
    transform: translateY(0) !important;
    transition: all 0.3s ease-out !important;
  }
  .custom-dialog-body-popup-hide {
    transform: translateY(100%) !important;
    transition: all 0.3s ease-out !important;
  }
  .custom-dialog-body {
    width: 100%;
    transform: translateY(100%);
    .custom-dialog-head {
      user-select: none;
      width: 100%;
      height: 94px;
      background: #ffffff;
      box-shadow: 3px 0px 8px 0px rgba(236, 236, 236, 0.5);
      border-radius: 10px 10px 0px 0px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 31px;
      padding-right: 20px;
      .head-info {
        width: 100%;
        display: flex;
        align-items: center;
        .head-img {
          min-width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: #333333;
          margin-right: 16px;
          img {
            width: 48px;
            height: 100%;
            border-radius: 50%;
            display: inline-block;
          }
        }
        .head-title {
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          margin-bottom: 5px;
          .head-tag {
            display: inline-block;
            padding: 2px 8px;
            background: #01b5d8;
            border-radius: 4px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            margin-left: 8px;
          }
        }
        .head-describe {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
          // 文本超出省略
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .close {
        font-size: 24px;
        color: #67686b;
        cursor: pointer;
      }
    }

    .custom-dialog-content {
      padding: 20px 30px 0 30px;
      background-color: #edeef2;
      height: auto;

      overflow-y: auto;
      overscroll-behavior: contain;
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        // display: none;
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: #879bf5;
        transition: all 0.4s ease;
      }

      &::-webkit-scrollbar-track {
        background: #fff;
      }

      .custom-input {
        margin-top: 20px;
        width: 100%;
      }
    }
    .custom-dialog-content-full {
      max-height: calc(100vh - 94px - 104px - 20px);
    }
    .custom-dialog-content-slide {
      max-height: calc(100vh - 94px - 104px);
    }
    .bottom-btn {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #edeef2;
      padding: 45px 0 60px 0;
    }
    .btn-send {
      height: 48px;
      background: #3a7fff;
      border-radius: 24px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }
  }

  .slide-screen {
    width: 432px;
    // margin-left: calc(100vw - 432px);
  }
  .full-screen {
    // width: calc(100vw - 256px - 384px - 80px);
    width: 100%;
    max-width: 1183px;
  }
}
::v-deep .el-textarea__inner {
  color: #333;
  padding-bottom: 5px;
  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
    // display: none;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #d0d0d0;
    transition: all 0.4s ease;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
  }
}
::v-deep {
  .el-textarea .el-input__count {
    line-height: 0 !important;
  }
}
</style>
