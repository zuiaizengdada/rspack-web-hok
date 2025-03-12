<template>
  <div class="project">
    <div class="project_title">
      已自动脱敏视频({{ data.length }})
    </div>
    <!-- 多机位处理 -->
    <div class="flex flex-middle  camera-stand" style="width: 100%;">
      <div v-for="(item,index) in cameraList" :key="index" class="flex" @click="handleCommand(index)">
        <span v-if="index<3" plain :class="{'camera-list':true,'flex-middle':true, 'flex-center':true,'active':index === active}">
          {{ item.caremaName }} ({{ item.num }})
          <el-tooltip
            v-if="item.type!==2"
            class="item"
            effect="dark"
            placement="bottom"
          >
            <div slot="content" class="content-cls">
              <p>多机位视频组脱敏规则说明：</p>
              <p>1、主机位完成脱敏和爆款标记后，副机位视频内容对齐的部分将实时同步脱敏和爆款标记。</p>
              <p>2、可手动单独修改副机位视频的脱敏和爆款标记。不影响主机位的视频和其他副机位的视频。</p>
              <p>3、可一键生成所有脱敏视频。也可以单独生成脱敏视频。</p>
              <p>4、副机位视频可进行手动操作修改与主机位的对齐部分，以便同步脱敏和爆款标记。</p>
            </div>
            <img :src="wenhaoImg" style="margin-left: 4px; cursor: pointer;width: 14px;height: 14px;" />
          </el-tooltip>
        </span>
      </div>
      <el-dropdown v-if="cameraList.length>3" @command="handleCommand">
        <span :class="{'camera-list':true, 'flex-middle':true, 'flex-center':true,'active':active >=3}">
          {{ active >=3?`${moreData.caremaName}(${moreData.num})`:'更多' }}<i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <div v-for="(item,index) in cameraList" :key="index">
            <el-dropdown-item v-if="index>=3" :command="index">
              {{ item.caremaName }}({{ item.num }})
            </el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="project_list">
      <!-- 单机位 -->
      <div class="overflowScorll">
        <div v-for="(item, index) in videoList" :key="item.id" class="project_list_view">
          <div
            class="project_list_view_img"
            @mouseenter="() => mouseenter(item)"
            @mouseleave="() =>mouseLeave(item)"
          >
            <el-image
              :src="item.posterUri"
              class="img"
              fit="contain"
            >
              <img slot="error" src="@/assets/image/noPoster.png" alt="" style="width: 100%; height: 100%;object-fit: contain;" />
            </el-image>
            <template v-if="item.isDesensitization === 1">
              <div class="mask" :style="{ borderColor: item.editShow ? '#fff' : statusArr[0].borderColor}">
                <el-tooltip v-if="item.desensitizedStatus === 3" class="item" effect="dark" content="点击可设置为无效素材" placement="bottom">
                  <svg-icon class-name="invalid_icon" icon-class="invalid_icon" @click="setInvalid(item)" />
                </el-tooltip>
                <div v-if="item.type!==2" :style="{color: statusArr[0].color, background: statusArr[0].background}" class="status">
                  <svg-icon :icon-class="statusArr[0].icon" class="svgIcon" />
                  {{ statusArr[0].title }}
                </div>
              </div>
            </template>
            <template v-else-if="item.desensitizedStatus !== 3 && item.type!==2">
              <div class="mask" :style="{ borderColor: item.editShow ? '#fff' : statusArr[item.desensitizedStatus].borderColor}">
                <div :style="{color: statusArr[item.desensitizedStatus].color, background: statusArr[item.desensitizedStatus].background}" class="status">
                  <svg-icon :icon-class="statusArr[item.desensitizedStatus].icon" class="svgIcon" />
                  {{ statusArr[item.desensitizedStatus].title }}
                </div>
              </div>
            </template>
            <transition name="slide">
              <div v-if="item.isInvalidShow" class="alignUploadShow">
                <div class="isInvalid flex flex-column flex-center flex-middle" @click="settingInvalid(item)">
                  <span>无效素材</span>
                  <span>点击可取消</span>
                </div>
              </div>
              <div v-if="item.editShow" class="alignUploadShow">
                <el-button :loading="loading" class="btn_primary" size="small" @click="desensitization(item, index)">{{ item.type!==2 ?'脱敏' : '查看' }}</el-button>
              </div>
            </transition>
          </div>
          <div v-if="!item.showInput" class="project_list_view_title" :title="item.name" @dblclick="showInput(item)">{{ item.name }}</div>
          <el-input v-else ref="saveTagInput" v-model="item.name" autofocus @focus="getInputFocus($event)" @blur="changeTitle($event,item,1)" @keyup.enter.native="changeTitle($event,item,2)" />
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
import wenhaoImg from '@/assets/image/account/icn_wenhao.svg'

export default {
  components: {},
  props: {
    data: {
      type: Array,
      default: () => []
    },
    cameraList: {
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
      list: [],
      active: -1,
      wenhaoImg,
      moreData: [],
      // 手动脱敏状态 0-未脱敏 1-脱敏中 2-已脱敏 3-生成中
      statusArr: [
        { title: '脱敏中', color: '#FFFFFF', background: '#FF7D00', icon: 'time', borderColor: '#FF7D00' },
        { title: '生成中', color: '#FFFFFF', background: '#0C6FFF', icon: 'daochuzhong_icon', borderColor: '#0C6FFF' },
        { title: '已脱敏', color: '#FFFFFF', background: '#00B42A', icon: 'check-circle-filled', borderColor: '#00B42A' },
        { title: '', color: '#', background: '', icon: '', borderColor: '#fff' }
      ]
    }
  },
  computed: {
    videoList: {
      get() {
        if (this.cameraList.length) {
          const active = this.active
          const multiCameraGroupId = active > 0 ? this.cameraList[active].multiCameraGroupId : this.cameraList[0].multiCameraGroupId
          return this.data.filter(item => item.multiCameraGroupId === multiCameraGroupId)
        } else {
          return this.data
        }
      },
      set(val) {
        this.$emit('changeVideoList', val)
      }
    }
  },
  watch: {
    data: {
      handler(val) {
        // 多机位视频组
        if (this.cameraList.length) {
          // 当前选中的this.active 为val里面item.isDesensitization
          const index = val.findIndex(item => item.isDesensitization === 1)
          const multiCameraGroupId = val[index].multiCameraGroupId
          const active = this.cameraList.findIndex(item => item.multiCameraGroupId === multiCameraGroupId)
          this.moreData = this.cameraList[active]
          this.active = active
        }
      },
      immediate: true
    }
  },
  mounted() {
    // setTimeout(() => {
    //   if (this.cameraList.length && this.active !== 0 && this.active !== '') {
    //     const str = '当前选中脱敏项不是主机位，是否选择脱敏主机位视频'
    //     this.$confirm(str, '提示', {
    //       confirmButtonText: '脱敏主机位',
    //       cancelButtonText: '继续脱敏当前副机位',
    //       type: 'warning'
    //     }).then(() => {
    //       this.active = 0
    //       this.handleCommand(this.active)
    //       this.desensitization(this.videoList[0], 0)
    //     }).catch(() => {

    //     })
    //   }
    // }, 1000)
  },
  methods: {
    mouseenter(item) {
      if (item.isDesensitization !== 1) {
        console.log('鼠标进入了')
        if (item.isInvalid === 1) {
          item.isInvalidShow = true
        } else {
          item.editShow = true
        }
      }
    },
    handleCommand(item) {
      console.log(item, this.cameraList, 'item')
      this.active = item
      this.moreData = this.cameraList[item]
      this.desensitization(this.videoList[0], 0)
      console.log(this.moreList)
    },
    setInvalid(item) {
      this.$emit('setInvalid', item)
    },
    // 鼠标离开
    mouseLeave(item) {
      if (item.isInvalid === 1) {
        item.isInvalidShow = false
      } else {
        item.editShow = false
      }
    },
    // 设置无效素材
    settingInvalid(item) {
      this.$emit('setCancelInvalid', item)
    },
    desensitization(item, index) {
      item.editShow = false
      this.$emit('changePlayUrl', item)
    },
    showInput(item) {
      this.$emit('showInput', item)
      this.$nextTick(() => {
        this.$refs.saveTagInput[0].focus()
        this.$refs.saveTagInput[0].select()
      })
    },
    getInputFocus(e) {
      e.target.select()
    },
    changeTitle(e, item, type) {
      console.log(e, '$event')
      this.$emit('changeTitle', item, type)
    }
  }
}
</script>

<style lang='scss' scoped>
  .content-cls{
    width: 344px;
    p{
      line-height: 20px;
    }
  }
.project {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  .camera-stand{
    padding: 0 8px;
    box-sizing: border-box;
    margin-bottom: 8px;
  }
  .camera-list{
    width: 118px;
    border-radius: 4px;
    border: 1px solid #e1e6ed;
    background: #ffffff;
    color: #777777;
    font-size: 14px;
    padding: 4px 8px;
    box-sizing: border-box;
    margin-right: 4px;
    flex-shrink: 0;
    margin-bottom: 4px;
    display: flex;
    text-align: center;
    cursor: pointer;
  }
  .active{
    color: #0c6fff;
    border: 1px solid #0c6fff;
  }
  .isInvalid{
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #0C6FFF;
    padding: 4px 10px;
    box-sizing: border-box;
    font-size: 12px;
    font-weight: 400;
    color: #0C6FFF;
    cursor: pointer;
  }
  .project_title {
    // height: 34px;
    color: #fff;
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
    line-height: 24px;
    margin-top: 10px;
    margin-left: 10px;
    margin-bottom: 8px;
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
              font-size: 12px;
              padding-left: 10px;
              padding-right: 10px;
              border-radius: 12px;
              padding-top: 5px;
              padding-bottom: 5px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              line-height: 1;
              .svgIcon {
                font-size: 14ox;
                margin-right: 4px;
              }
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
.invalid_icon{
  position: absolute;
  font-size: 18px;
  bottom: 6px;
  right: 6px;
  cursor: pointer;
}
.delay-leave-active {
  -webkit-animation-delay: .2s;
  -moz-animation-delay: .2s;
  -o-animation-delay: .2s;
  animation-delay: .2s;
}
</style>
