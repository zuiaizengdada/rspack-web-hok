<template>
  <div class="message-wrapper" :style="{'z-index': zIndex}" v-on="$listeners">
    <div class="message-box">
      <div class="message-main" @click.stop>
        <div class="header-box">
          <div class="header-l">任务中心</div>
          <div class="header-r" @click.stop="onClickClear">
            <svg-icon icon-class="t_clear" />
            <span>清除已完成任务</span>
          </div>
        </div>

        <ul class="menu-box">
          <li
            v-for="item in configMenu"
            :key="item.id"
            class="menu-box-child"
            :class="[menuKey === item.id ? 'menu-box-child-active' : '']"
            @click.stop="onClickMenu(item)"
          >
            {{ item.title }}
            <span v-if="item.num">({{ item.num }})</span>
          </li>
        </ul>
        <div class="task-info">
          <slot name="tabOne" :row="menuKey" />
          <slot name="tabTwo" :row="menuKey" />
          <slot name="tabThree" :row="menuKey" />
          <slot name="tabFour" :row="menuKey" />

          <!-- <SrcrollPane style="height: 410px" @load="rollEnd">
                <fileTransfer v-show="menuKey === 1"></fileTransfer>
                <videoGeneration v-show="menuKey === 2"></videoGeneration>
            </SrcrollPane> -->
        </div>
        <i class="arrow-icon" />
      </div>
      <div v-if="fairingStatus" class="fairing-box" @click.stop />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    zIndex: {
      type: Number,
      default: 2001
    },
    isVideoEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 弹框禁止点击的隔离层
      fairingStatus: false,
      menuKey: 1,
      // tab栏
      configMenu: [
        { id: 1, title: '文件传输', num: 0, show: true, active: true },
        { id: 2, title: '视频生成', num: 0, show: true, active: false },
        { id: 3, title: '工程生成', num: 0, show: true, active: false },
        { id: 4, title: '数据导出', num: 0, show: true, active: false }
      ]
    }
  },
  watch: {
    configMenu: {
      handler(val) {
        if (this.configMenu[0].num) {
          window.onbeforeunload = function (e) {
            var message = 'some word'
            e = e || window.event
            if (e) {
              e.returnValue = message
            }
            return '浏览器关闭!'
          }
        } else {
          window.onbeforeunload = null
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    // 点击清除已完成任务
    onClickClear() {
      this.$emit('onClickClear')
    },
    // 切换列表
    onClickMenu(item) {
      this.menuKey = item.id
      this.$emit('change', item)
    },
    numberChange(index, number = 0) {
      this.configMenu[index - 1].num = number
    }
  }
}
</script>

<style lang='scss' scoped>
.message-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 2001;
    cursor: default;
    .message-box {
        position: relative;
        .message-main {
            position: absolute;
            top: 58px;
            right: 217px;
            z-index: 2001;
            width: 540px;
            height: 529px;
            background: #FFFFFF;
            box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
            border-radius: 4px;
            padding: 22px 0;
            .arrow-icon{
                position: absolute;
                content: " ";
                top: -12px;
                right: 35px;
                display: block;
                width: 0;
                height: 0;
                border: 6px solid #FFFFFF;;
                border-color: transparent transparent #FFFFFF;;
            }
            .header-box {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0;
                margin: 0;
                line-height: normal;
                padding:0 22px;
                .header-l {
                    font-size: 16px;
                    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                    font-weight: bold;
                    color: #333333;
                }
                .header-r {
                    font-size: 14px;
                    font-family: MicrosoftYaHei;
                    cursor: pointer;
                    span {
                        display: inline-block;
                        margin-left: 4px;
                    }
                }
            }
            .menu-box {
                display: flex;
                margin-top: 20px;
                padding: 0 22px;
                border-bottom: 1px solid #EFF2F6;
                .menu-box-child {
                    font-size: 16px;
                    font-family: MicrosoftYaHei;
                    color: #777777;
                    margin-right: 32px;
                    line-height: normal;
                    padding-bottom: 9px;
                    cursor: pointer;
                }
                .menu-box-child-active {
                    color: #0C6FFF;
                    border-bottom: 2px solid #0C6FFF;
                }
            }
            .task-info {
                // padding: 0 22px;
                .task-child-clip {
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid #EFF2F6;
                    display: flex;
                    line-height: normal;
                    margin-top: 16px;
                    width: 100%;
                    .task-child-clip-l {
                        margin-right: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 52px;
                        min-width: 52px;
                        height: 52px;
                        background: #ECF5FE;
                        border-radius: 4px;
                        position: relative;
                        .task-child-clip-l-icon {
                            font-size: 38px;
                        }
                        .task-child-clip-l-stop {
                            position: absolute;
                            left: 0;
                            right: 0;
                            top: 0;
                            bottom: 0;
                            font-size: 38px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: rgba(71,160,251,0.4);
                            border-radius: 4px;
                            backdrop-filter: blur(1px);
                        }
                    }
                    .task-child-clip-r {
                        flex: 1;
                        width: 0;
                        .task-child-clip-r-title {
                            font-size: 14px;
                            font-family: MicrosoftYaHei;
                            color: #333333;
                            display:-webkit-box;
                            text-overflow:ellipsis;
                            overflow:hidden;
                            -webkit-line-clamp: 1;
                            -webkit-box-orient:vertical;
                        }
                        .task-child-clip-r-progress {
                            margin-top: 8px;
                        }
                        .task-child-clip-r-status {
                            margin-top: 8px;
                            font-size: 14px;
                            font-family: MicrosoftYaHei;
                            color: #777777;
                            display: flex;
                            justify-content: space-between;
                            .task-child-clip-r-status-del {
                                font-size: 14px;
                                font-family: MicrosoftYaHei;
                                color: #F53F3F;
                                cursor: pointer;
                            }
                        }
                    }
                }
                .task-no-data {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    line-height: normal;
                    font-size: 18px;
                    font-family: MicrosoftYaHei;
                    margin-top: 76px;
                    color: #919293;
                    .task-no-data-icon-box {
                        height: 148px;
                        overflow: hidden;
                        .task-no-data-icon {
                            font-size: 175px
                        }
                    }

                }
            }
        }
        .fairing-box {
            position: absolute;
            top: 48px;
            right: 190px;
            z-index: 2001;
            width: 478px;
            height: 529px;
            background: #c71515;
            opacity: 0;
            box-shadow: 0px 4px 12px 0px rgba(22,22,22,0.25);
            border-radius: 12px;
            padding: 22px 0;
        }
    }
}

</style>

<style>
  .video-edit.message-wrapper .message-box .message-main .arrow-icon{
  right:200px
}
</style>
