<template>
  <div class="Page_wrap_carousel">
    <el-button v-show="renderLeftBtn()" class="carousel__arrow carousel__arrow--left" @click="onhandlePrevious"><i class="el-icon-arrow-left" /></el-button>
    <div ref="carousel" class="carousel">
      <div ref="wrapScroll" v-resize="onResize" class="carouselContent">
        <div v-for="(item, index) in list" :key="index" ref="carouselList" :class="{pointer: [0, 1, 2].includes(item.status)}" class="carouselList" :style="{left: getLeft(item, index) }" @click="onhandleClick(item)">
          <div class="carouselListView" :class="{ifStart: item.status === 1, ifStop: item.status === 2}">
            <div class="liveRoom-imgContainer">
              <img :src="item.imgUrl" class="liveRoom-img">
              <div class="liveType" :class="`liveType${item.status}`">
                <svg-icon class-name="liveTypeicon" :icon-class="{0: 'livenostart', 1: 'liveIng', 2: 'liveSuspend', 3: 'liveError',9: 'audit_info'}[item.status]" />{{ item.status | getOptionsValue(liveStateOption) }}
              </div>
            </div>
            <div class="liveRoom-main">
              <div class="liveRoom text_hidden">{{ item.name }}</div>
              <div>
                <div class="liveTime">
                  <span v-if="[0, 1, 2].includes(item.teacherRole)" class="liveRole" :class="`liveRole${item.teacherRole}`">{{ {1: '助教', 0: '主讲'}[item.teacherRole] }}</span>
                  <span class="liveTimeText">直播时间：{{ item.startTime | renderTime }}</span>
                </div>
                <div class="status">

                  <el-button type="text" icon="el-icon-link" class="liveRoom-linkBtn" @click.stop="onhandleInvite(item)">生成邀课链接</el-button>
                  <div class="gotoLiveRoom">进入直播间 ></div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
    <el-button v-show="renderRightBtn()" class="carousel__arrow carousel__arrow--right" @click="onhandleNext"><i class="el-icon-arrow-right" /></el-button>
    <InviteDialog :config="inviteConfig" @close="closeInviteDialog" />
  </div>
</template>

<script>
import InviteDialog from '../liveList/component/InviteDialog.vue'
import { liveStateOption } from '../columns'
import moment from 'moment'
export default {
  filters: {
    renderTime(val) {
      if (!val) { return '' }
      return moment(val).format('HH:mm')
    }
  },
  components: {
    InviteDialog
  },
  directives: {
    // 自定义指令监听元素宽度变化
    resize: {
      bind(el, binding) {
        let width = ''
        let height = ''
        function isResize() {
          // 获取当前元素的所有的计算样式
          const style = document.defaultView.getComputedStyle(el)
          if (width !== style.width || height !== style.height) {
            binding.value()
          }
          width = style.width
          height = style.height
        }
        el._vueSetInterval = setInterval(isResize, 300)
      },
      unbind(el) {
        clearInterval(el._vueSetInterval)
      }
    }
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      liveStateOption,
      currentPage: 0,
      moveWidth: 0,
      inviteConfig: {
        visible: false,
        row: {}
      }
    }
  },
  mounted() {
    this.moveWidth = this.$refs.carousel.offsetWidth
  },
  methods: {
    onhandlePrevious() {
      this.currentPage -= 1
    },
    onhandleNext() {
      this.currentPage += 1
    },
    getLeft(item, index) {
      const step = this.moveWidth / 2
      const left = step * index - step * (this.currentPage)
      return left + 'px'
    },
    onResize() {
      this.moveWidth = this.$refs.carousel.offsetWidth
    },
    renderLeftBtn() {
      return !(this.list.length <= 2 || this.currentPage === 0)
    },
    renderRightBtn() {
      return !(this.list.length <= 2 || this.currentPage >= (this.list.length - 2))
    },
    // 点击卡片触发
    onhandleClick(item) {
      console.log(item)
      const { href } = this.$router.resolve({
        path: `/liveRoom/${item.id}`
      })
      window.open(href, '_blank')
    },
    closeInviteDialog() {
      this.inviteConfig.visible = false
    },
    // 邀课链接
    onhandleInvite(item) {
      this.inviteConfig = {
        visible: true,
        row: item
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.Page_wrap_carousel {
  padding: 30px 68px 30px 88px;
  position: relative;
  .carousel__arrow {
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    height: 48px;
    width: 48px;
    // cursor: pointer;
    transition: .3s;
    // border-radius: 50%;
    position: absolute;
    top: 50%;
    z-index: 10;
    transform: translateY(-50%);
    text-align: center;
    font-size: 38px;
    color: #0091FF;
    font-weight: bold;
  }
  .carousel__arrow--left {
    left: 16px;
  }
  .carousel__arrow--right {
    right: 16px;
  }
  .carousel {
    height: 138px;
    .carouselContent {
      width: 100%;
      height: 100%;
      // display: flex;
      overflow-x: scroll;
      overflow-y: hidden;
      position: relative;
      &::-webkit-scrollbar {
        display: none;
      }
      .carouselList {
        padding-right: 20px;
        width: 50%;
        position: absolute;
        left: 0;
        transition: all .4s;
        .carouselListView {
          height: 138px;
          background: #FAFAFA;
          // cursor: pointer;
          border-radius: 10px;
          padding: 9px 10px;
          display: flex;
          .liveRoom {
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            color: #333333;
            line-height: 22px;
          }
          .liveTime {
            display: flex;
            align-items: center;
            .liveRole {
              width: 60px;
              height: 24px;
              background: rgba(0, 197, 255, .1);
              border-radius: 4px;
              margin-right: 10px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #0091FF;
              line-height: 24px;
              text-align: center;
            }
            .liveRole0 {
              background: #DBF7FF;
              color: #0091FF;
            }
            .liveRole1  {
              background: #E5F7E9;
              color: #00B42A;
            }
            .liveTimeText {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #666666;
              line-height: 20px;
            }
          }
          .status {
            margin-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .liveRoom-linkBtn {
              padding: 0;
              color: #0C6FFF;
               &:hover {
                color: #5cb6ff;
              }
            }
            .gotoLiveRoom {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #0C6FFF;
              line-height: 17px;
              cursor: pointer;
              &:hover {
                color: #5cb6ff;
              }
            }
          }
        }
        .ifStart {
          cursor: pointer;
          background: #F6F9FF;
        }
        .ifStop {
          cursor: pointer;
          background: #FFFAF6;
        }
      }

      .liveRoom-imgContainer {
        position: relative;
        min-width: 160px;
        .liveRoom-img {
          width: 160px;
          height: 120px;
          border-radius: 4px;
        }
      }
      .liveRoom-main {
        width: 100%;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }
}
.liveType {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0;
  // display: inline-block;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // padding: 0 8px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  height: 28px;
  line-height: 28px;
  width: 100%;
  justify-content: center;
  .liveTypeicon,.liveTypeicon {
    width: 16px;
    height: 16px;
    font-size: 16px;
    margin-right: 4px;
  }
}
.liveType0 {
  background: #ECEFF599;
  color: #717F99;
}
.liveType1 {
  background: #E7F0FF99;
  color: #0C6FFF;
}
.liveType2 {
  background: #FFF2E699;
  color: #FF7D00 ;
}
.liveType3 {
  background: #FEECEC99;
  color: #F53F3F;
}
.liveType9 {
  background: #F5F5F599;
  color: #999999;
}
</style>
