<template>
  <!-- 海报弹框 -->
  <el-dialog
    custom-class="dialog-body"
    :visible.sync="config.visible"
    width="375px"
    append-to-body
    :show-close="false"
  >
    <span slot="title" />
    <div :id="idDOM" v-loading="loading" class="dialog-body-content">
      <div
        id="poster_preview"
        class="poster_preview"
        :class="{ noBg: !(form &&form.bgImg) }"
      >
        <!-- 图层一：背景图片 -->
        <div
          v-if="form && form.bgImg"
          class="fix_layer"
          :style="{ 'background-image': `url(${form.bgImg})` }"
        />
        <!-- 图层二：直播间名称 -->
        <VueDragResize
          v-if="form && form.liveRoomName.style.opacity === 1"
          :is-active="isActive"
          :is-draggable="isActive"
          :is-resizable="isActive"
          :minw="50"
          :minh="30"
          :x="form.liveRoomName.Drag.x"
          :y="form.liveRoomName.Drag.y"
          :w="form.liveRoomName.Drag.w"
          :h="form.liveRoomName.Drag.h"
          :aspect-ratio="false"
          :parent-w="375"
          :parent-h="667"
          :parent-limitation="false"
          :prevent-active-behavior="false"
        >
          <span
            class="poster_layout"
            :style="{
              ...form.liveRoomName.style,
              'font-size': form.liveRoomName.style.fontSize + 'px'
            }"
          >{{ liveRoomName }}</span>
        </VueDragResize>
        <!-- 图层三：直播时间 -->
        <VueDragResize
          v-if="form && form.liveTime.style.opacity === 1"
          :is-active="isActive"
          :is-draggable="isActive"
          :is-resizable="isActive"
          :minw="50"
          :minh="30"
          :x="form.liveTime.Drag.x"
          :y="form.liveTime.Drag.y"
          :w="form.liveTime.Drag.w"
          :h="form.liveTime.Drag.h"
          :aspect-ratio="false"
          :parent-w="375"
          :parent-h="667"
          :parent-limitation="true"
          :prevent-active-behavior="false"
        >
          <span
            class="poster_layout"
            :style="{
              ...form.liveTime.style,
              'font-size': form.liveTime.style.fontSize + 'px'
            }"
          >开播时间：
            <!-- {{ liveRoomInfo.startTime? moment(liveRoomInfo.startTime).format('MM-DD HH:mm'): '' }} -->
            {{ moment(starTime).format('MM-DD HH:mm') }}
          </span>
        </VueDragResize>
        <!-- 图层四：邀请人 -->
        <VueDragResize
          v-if="form && form.userInfo.style.opacity === 1"
          :is-active="isActive"
          :is-draggable="isActive"
          :is-resizable="isActive"
          :minw="50"
          :minh="30"
          :x="form.userInfo.Drag.x"
          :y="form.userInfo.Drag.y"
          :w="form.userInfo.Drag.w"
          :h="form.userInfo.Drag.h"
          :aspect-ratio="false"
          :parent-w="375"
          :parent-h="667"
          :parent-limitation="true"
          :prevent-active-behavior="false"
        >
          <span
            class="poster_layout"
            :style="{
              ...form.userInfo.style,
              'font-size': form.userInfo.style.fontSize + 'px'
            }"
          >
            邀请人：
            <template v-if="isSystem === 0 || !form.userInfo.userName">
              {{ nickName }}
            </template>
            <template v-else>
              {{ form.userInfo.userName }}
            </template>
          </span>
        </VueDragResize>
        <!-- 图层五: 二维码 -->
        <VueDragResize
          v-if="form && form.qr.style.opacity === 1"
          :is-active="isActive"
          :is-draggable="isActive"
          :is-resizable="isActive"
          :minw="80"
          :minh="80"
          :x="form.qr.Drag.x"
          :y="form.qr.Drag.y"
          :w="form.qr.Drag.w"
          :h="form.qr.Drag.h"
          :aspect-ratio="true"
          :parent-w="375"
          :parent-h="667"
          :parent-limitation="true"
          :prevent-active-behavior="false"
        >
          <span class="liveLinkCode" :style="{ ...form.qr.style }">
            <AppQrcode v-if="src" :src="src" :size="750" :margin="0" />
          </span>
        </VueDragResize>
      </div>
    </div>
    <div class="ss-material-box-bottom">
      <el-button size="small" @click="config.visible = false">取消</el-button>
      <el-button
        size="small"
        type="primary"
        @click="downPoster"
      >保存海报</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDefaultPoster } from '@/api/liveRoom/liveRoom.js'
import AppQrcode from '@/components/AppQrcode'
import VueDragResize from '@/assets/js/vue-drag-resize'
import domtoimage from 'dom-to-image'
import FileSaver from 'file-saver'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  components: {
    AppQrcode,
    VueDragResize
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false
        }
      }
    },
    src: {
      type: String,
      default: ''
    },
    nickName: {
      type: String,
      default: ''
    },
    starTime: {
      type: String,
      default: ''
    },
    liveRoomName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      form: {
        name: '',
        bgImg: '',
        liveRoomName: {
          value: '',
          style: {
            opacity: 1,
            fontSize: 20,
            color: '#494D69',
            fontWeight: 'bold'
          },
          Drag: {
            active: false,
            w: 230,
            h: 30,
            x: 73,
            y: 249
          }
        },
        liveTime: {
          value: '',
          style: {
            opacity: 1,
            fontSize: 16,
            color: '#494D69',
            fontWeight: '400'
          },
          Drag: {
            active: false,
            w: 220,
            h: 30,
            x: 82,
            y: 305
          }
        },
        userInfo: {
          value: '',
          userName: '',
          style: {
            opacity: 1,
            'font-size': 16,
            color: '#494D69',
            fontWeight: 'blod'
          },
          Drag: {
            active: false,
            w: 117,
            h: 30,
            x: 122,
            y: 343
          }
        },
        qr: {
          value: '',
          style: {
            opacity: 1,
            width: '100%',
            height: '100%'
          },
          Drag: {
            active: false,
            w: 145,
            h: 145,
            x: 116,
            y: 391
          }
        }
      },
      isActive: false,
      isQrActive: true,
      isSystem: 0, // 0: 系统样式1非系统样式,
      idDOM: 'posterDialog' + new Date().getTime()
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    'config.visible': {
      handler(val) {
        val && this.getPosterSettingDetail()
      },
      immediate: true
    }
  },
  mounted() {
    this.getPosterSettingDetail()
  },
  methods: {
    moment,
    downPoster() {
      const _this = this
      const node = document.getElementById(this.idDOM)
      domtoimage.toPng(node).then(async function (blob) {
        if (window.saveAs) {
          window.saveAs(blob, `${_this.liveRoomName}.png`)
        } else {
          FileSaver.saveAs(blob, `${_this.liveRoomName}.png`)
        }
      })
    },
    getPosterSettingDetail() {
      this.loading = true
      getDefaultPoster()
        .then(res => {
          console.log(res)
          console.log(this.liveRoomName, this.nickName, this.starTime, this.src)
          this.form = JSON.parse(res.data.posterSetup)
          this.isSystem = res.data.isSystem
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.ss-material-box-bottom {
  display: flex;
  padding-right: 20px;
  padding-left: 20px;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
  width: 100%;
  height: 66px;
  // background-color: #fafbfc;
  border-radius: 2px 2px 0 0;
}
::v-deep {
  .dialog-body {
    position: relative;
    width: 900px;
    flex: none;
    display: flex;
    flex-direction: column;
    vertical-align: middle;
    text-align: initial;
    background: #fff;
    border-radius: 2px;
    overflow: hidden;
    border-radius: 10px;
    .el-dialog__header {
      padding: 0;
      padding-bottom: 0;
    }
    .el-dialog__body {
      padding: 0;
    }
    .ss-material-box-header {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 52px;
      padding: 15px 20px;
      // background: #fafbfc;
      background: #ffffff;
      border-radius: 2px 2px 0 0;
      border-bottom: 1px solid #f2f2f2;
      color: #353535;
      font-size: 16px;
      // font-weight: 500;
      font-weight: bold;
      .ss-material-box-header-title {
        // max-width: 300px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }
    .close {
      color: #b2b2b2;
      margin-left: auto;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    .ss-material-box-bottom {
      display: flex;
      padding-right: 20px;
      padding-left: 20px;
      justify-content: flex-end;
      align-items: center;
      margin-top: auto;
      width: 100%;
      height: 66px;
      // background-color: #fafbfc;
      border-radius: 2px 2px 0 0;
    }
  }
  .vdr.active:before {
    outline: none;
  }
}
.dialog-body-content {
  width: 375px;
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 667px;
  position: relative;
  .poster_preview {
    .fix_layer {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .poster_layout {
      display: inline-block;
      width: 100%;
      text-align: center;
    }
    .liveLinkCode {
      display: inline-block;
      border: none;
      max-width: 750px !important;
      min-width: 80px !important;
    }
  }
}
</style>
