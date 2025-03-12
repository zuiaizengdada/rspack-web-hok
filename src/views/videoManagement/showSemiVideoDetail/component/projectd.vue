<template>
  <div class="project">
    <div class="project_title">
      已自动脱敏视频({{ data.length }})
    </div>
    <div class="project_list">
      <div class="overflowScorll">
        <div v-for="(item, index) in data" :key="index" class="project_list_view" @click="desensitization(item)">
          <div
            class="project_list_view_img"
            @mouseenter="() => mouseenter(item)"
            @mouseleave="item.editShow = false"
          >
            <el-image
              :src="item.posterUri"
              class="img"
              fit="contain"
            >
              <img slot="error" src="@/assets/image/noPoster.png" alt="" style="width: 100%; height: 100%;object-fit: contain;" />
            </el-image>
            <template>
              <div v-if="item.currentFlag" class="mask" :style="{ borderColor: true ? '#fff' : statusArr[2].borderColor}">
                <div :style="{color: statusArr[2].color, background: statusArr[2].background}" class="status">
                  <i class="el-icon-view" />
                  <span>
                    查看中
                  </span>
                </div>
              </div>
            </template>
            <template>
              <div v-if="item.editShow && !item.currentFlag" class="mask" :style="{ borderColor: true ? '#fff' : statusArr[2].borderColor}">
                <div class="status editshow">
                  <span>
                    查看
                  </span>
                </div>
              </div>
            </template>

          </div>
          <div class="project_list_view_title flex" :title="item.name">
            <el-tooltip class="item" effect="dark" :content="`时间：${item.videoCreateTime}`" placement="top-start">
              <span v-if="item.version>0" class="video-version">V{{ item.version }}</span>
            </el-tooltip>
            <span class="flex" style="overflow: hidden;">
              <span class="text_hidden_ellipsis">
                {{ item.name }}
              </span>
              <span v-if="item.videoGroupType === 2" class="caremaName">{{ item.caremaName }}</span>
            </span>
          </div>
        </div>

        <div v-if="data.length === 0" class="noData">
          <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
          <div class="m-t-10 noDataText">暂无视频内容</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 手动脱敏状态 0-未脱敏 1-脱敏中 2-已脱敏 3-生成中
      statusArr: [
        { title: '脱敏中', color: '#FF7D00', background: '#FFF2E6', icon: 'desensitization', borderColor: '#FF7D00' },
        { title: '生成中', color: '#0C6FFF', background: '#E7F0FF', icon: 'daochuzhong', borderColor: '#85B7FF' },
        { title: '已脱敏', color: '#00B42A', background: '#E6F7EA', icon: 'desensitized', borderColor: '#80D994' },
        { title: '', color: '#', background: '', icon: '', borderColor: '#fff' }
      ]
    }
  },
  mounted() {
  },
  methods: {
    mouseenter(item) {
      if (item.isDesensitization !== 1) {
        item.editShow = true
      }
    },
    desensitization(item, index) {
      item.editShow = false
      this.$emit('changePlayUrl', item)
    }
  }
}
</script>

<style lang='scss' scoped>
.project {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  .caremaName{
    padding: 0 4px;
    box-sizing: border-box;
    // width: 44px;
    height: 18px;
    line-height: 18px;
    border-radius: 4px;
    background: #fff2e6;
    color: #333333;
    font-size: 12px;
    font-weight: 400;
    margin-left: 8px;
  }
  .video-version{
    background: #00B8D2;
    border-radius: 2px;
    padding: 0 4px;
    font-size: 12px;
    font-weight: 400;
    color: #FFFFFF;
    margin-right: 4px;
  }
  .project_title {
    height: 34px;
    color: #fff;
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
    line-height: 24px;
    margin-top: 10px;
    margin-left: 10px;
  }
  .project_list {
    flex: 1 0 0;
    overflow: auto;
    padding-left: 2px;
    padding-right: 2px;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 6px;
      height: 10px;
      // display: none;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.2);
      transition: all 0.4s ease;
    }
    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.1);
    }
    .overflowScorll {
      display: flex;
      flex-wrap: wrap;
      .project_list_view {
        display: flex;
        flex-wrap: wrap;
        width: 33.33%;
        padding-left: 8px;
        padding-right: 8px;
        height: 131px;
        cursor: pointer;
        .project_list_view_img {
          background: #EEEEEE;
          height: 85px;
          width: 100%;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          > .img {
            height: 100%;
            width:  100%;
          }
          .mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.4);
            backdrop-filter: blur(2px);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #333333;
            line-height: 22px;
            border-radius: 4px;
            overflow: hidden;
            border: 2px solid #fff;
            z-index: 5;
            > .status {
              padding-left: 10px;
              padding-right: 10px;
              border-radius: 12px;
              height: 24px;
            }
            > .editshow {
              border: 1px solid #0C6FFF;
              color: #0C6FFF;
              background: #fff;
              height: 32px;
              padding: 0 20px;
              line-height: 32px;
              border-radius: 4px;
            }
          }
          .alignUploadShow {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10;
            border-radius: 4px;
            overflow: hidden;
            background: rgba(255,255,255,0.4);
            // backdrop-filter: blur(2px);
          }
        }
        .project_list_view_title {
          height: 22px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #333333;
          line-height: 22px;
          // text-overflow: -o-ellipsis-lastline;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // // white-space: nowrap;
          // display: -webkit-box;
          // -webkit-line-clamp: 1;
          // line-clamp: 1;
          // -webkit-box-orient: vertical;
          /*1. 先强制一行内显示文本*/
      white-space: nowrap;
  /*2. 超出的部分隐藏*/
      overflow: hidden;
  /*3. 文字用省略号替代超出的部分*/
      text-overflow: ellipsis;
        }
      }
      .noData {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        > img {
          width: 243px;
          height: 120.7px;
        }
        .noDataText {
          margin-top: 10px;
          text-align: center;
          font-size: 18px;
          font-family: MicrosoftYaHei;
          color: #919293;
          line-height: 26px;
        }
      }
    }
  }
}
.slide-enter-active {
  animation-name: slideInUp;
  animation-duration: .2s;
  animation-fill-mode: both;
}
.slide-leave-active {
  animation-name: slideOutDown;
  animation-duration: .2s;
  animation-fill-mode: both;
}
@keyframes slideInUp {
  0% {
    // transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translateZ(0);
  }
}
@keyframes slideOutDown {
  0% {
    transform: translateZ(0);
  }

  to {
    visibility: hidden;
    transform: translate3d(100%, 0, 0);
  }
}
.delay-leave-active {
  -webkit-animation-delay: .2s;
  -moz-animation-delay: .2s;
  -o-animation-delay: .2s;
  animation-delay: .2s;
}
</style>
