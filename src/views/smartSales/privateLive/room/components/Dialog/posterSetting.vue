<template>
  <AppDialog v-model="visible" title="海报设置" width="840px" :loading="loading" height="auto" :top="top" @success="onhandleSave">
    <div class="posterSetting">

      <MLoading :visible="loading" :style="{'background-color': 'hsla(0, 0%, 100%, .9)'}" />
      <div class="posterSetting_left">
        <div class="poster_preview">
          <!-- 图层一：背景图片 -->
          <div v-if="form.bgImg" class="fix_layer" :style="{'background-image': `url(${form.bgImg})`}" />
          <!-- 图层二：直播间名称 -->
          <VueDragResize
            :is-active="form.liveRoomName.Drag.active"
            :is-draggable="true"
            :minw="50"
            :minh="30"
            :x="form.liveRoomName.Drag.x"
            :y="form.liveRoomName.Drag.y"
            :w="form.liveRoomName.Drag.w"
            :h="form.liveRoomName.Drag.h"
            :aspect-ratio="false"
            :parent-w="375"
            :parent-h="667"
            :parent-limitation="true"
            :prevent-active-behavior="false"
            @clicked="onActivated('liveRoomName')"
            @deactivated="onDeactivated"
            @dragstop="(res) => onDragstop('liveRoomName', res)"
            @resizestop="(res) => onResizstop('liveRoomName', res)"
          >
            <span class="poster_layout" :style="{...form.liveRoomName.style, 'font-size': form.liveRoomName.style.fontSize + 'px'}">{{ liveRoomInfo.name }}</span>
          </VueDragResize>
          <!-- 图层三：直播时间 -->
          <VueDragResize
            :is-active="form.liveTime.Drag.active"
            :is-draggable="true"
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
            @clicked="onActivated('liveTime')"
            @deactivated="onDeactivated"
            @dragstop="(res) => onDragstop('liveTime', res)"
            @resizestop="(res) => onResizstop('liveTime', res)"
          >
            <span class="poster_layout" :style="{...form.liveTime.style, 'font-size': form.liveTime.style.fontSize + 'px'}">开播时间：{{ liveRoomInfo.startTime? moment(liveRoomInfo.startTime).format('MM-DD HH:mm'): '' }}</span>
          </VueDragResize>
          <!-- 图层四：邀请人 -->
          <VueDragResize
            :is-active="form.userInfo.Drag.active"
            :is-draggable="true"
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
            @clicked="onActivated('userInfo')"
            @deactivated="onDeactivated"
            @dragstop="(res) => onDragstop('userInfo', res)"
            @resizestop="(res) => onResizstop('userInfo', res)"
          >
            <span class="poster_layout" :style="{...form.userInfo.style, 'font-size': form.userInfo.style.fontSize + 'px'}">邀请人：{{ userInfo.nickName }}</span>
          </VueDragResize>
          <!-- 图层五: 二维码 -->
          <VueDragResize
            :is-active="form.qr.Drag.active"
            :is-draggable="true"
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
            @clicked="onActivated('qr')"
            @deactivated="onDeactivated"
            @dragstop="(res) => onDragstop('qr', res)"
            @resizestop="(res) => onResizstop('qr', res)"
          >
            <span class="liveLinkCode" :style="{...form.qr.style}">
              <AppQrcode :src="src" :size="750" :margin="0" />
            </span>
          </VueDragResize>
        </div>
      </div>
      <div class="posterSetting_right">
        <el-form ref="ruleForm" size="small" :model="form" :rules="rules" label-position="left" label-width="80px" class="demo-ruleForm">
          <el-form-item prop="name" label="样式名称">
            <el-input v-model.trim="form.name" maxlength="10" show-word-limit />
          </el-form-item>
          <el-form-item prop="bgImg" label="背景图片">
            <AppUploadViewCropper
              key="MUploadImg"
              ref="MUploadImg"
              upload-text="上传图片"
              :width="160"
              :height="120"
              accept=".jpg,.jpeg,.png"
              :max-length="1"
              :cropper-option="{ // 裁剪设置
                fixed: true, // 是否开启截图框宽高固定比例
                infoTrue: false, // 为展示真实输出图片宽高 false 展示看到的截图框宽高	false	true | false
                centerBox: false, // 截图框是否被限制在图片里面	false	true | false
                canMoveBox: true, // 截图框能否拖动	true	true | false
                fixedNumber: [375, 667], // 截图框的宽高比例 [宽度, 高度]
                original: false,
                autoCropWidth: 375,
              }"
              @onClick="onImgClick"
              @change="onSelectImg"
            />
          </el-form-item>
          <el-form-item prop="liveRoomName" label="直播间名称">
            <el-radio-group v-model="form.liveRoomName.style.opacity">
              <el-radio-button :label="1">展示</el-radio-button>
              <el-radio-button :label="0">不展示</el-radio-button>
            </el-radio-group>
            <posterSettingPanel v-if="form.liveRoomName.style.opacity === 1" v-model="form.liveRoomName.style" />
          </el-form-item>
          <el-form-item prop="liveTime" label="直播时间">
            <el-radio-group v-model="form.liveTime.style.opacity">
              <el-radio-button :label="1">展示</el-radio-button>
              <el-radio-button :label="0">不展示</el-radio-button>
            </el-radio-group>
            <posterSettingPanel v-if="form.liveTime.style.opacity === 1" v-model="form.liveTime.style" />
          </el-form-item>
          <el-form-item prop="userInfo" label="邀请人">
            <el-radio-group v-model="form.userInfo.style.opacity">
              <el-radio-button :label="1">展示</el-radio-button>
              <el-radio-button :label="0">不展示</el-radio-button>
            </el-radio-group>
            <posterSettingPanel v-if="form.userInfo.style.opacity === 1" v-model="form.userInfo.style" />
          </el-form-item>
          <el-form-item prop="qr" label="二维码样式">
            <el-radio-group v-model="form.qr.style.opacity">
              <el-radio-button :label="1">展示</el-radio-button>
              <el-radio-button :label="0">不展示</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import moment from 'moment'
import AppDialog from '@/components/AppDialog'
import posterSettingPanel from '@/views/live/component/posterSettingPanel'
import AppUploadViewCropper from '@/components/AppUploadViewCropper/upload'
import AppQrcode from '@/components/AppQrcode'
import VueDragResize from '@/assets/js/vue-drag-resize'
export default {
  components: {
    AppDialog,
    AppUploadViewCropper,
    posterSettingPanel,
    AppQrcode,
    VueDragResize
  },
  data() {
    return {
      loading: false,
      visible: false,
      top: '10vh',
      isActive: true,
      form: {
        name: '',
        bgImg: '',
        liveRoomName: {
          value: '',
          style: {
            opacity: 1,
            fontSize: 16,
            color: '#000',
            fontWeight: 'bold'
          },
          Drag: {
            active: false,
            w: 375,
            h: 30,
            x: 0,
            y: 24
          }
        },
        liveTime: {
          value: '',
          style: {
            opacity: 1,
            fontSize: 16,
            color: '#000',
            fontWeight: 'bold'
          },
          Drag: {
            active: false,
            w: 375,
            h: 30,
            x: 0,
            y: 78
          }
        },
        userInfo: {
          value: '',
          style: {
            opacity: 1,
            'font-size': 16,
            color: '#000',
            fontWeight: 'blod'
          },
          Drag: {
            active: false,
            w: 117,
            h: 30,
            x: 9,
            y: 600
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
            w: 80,
            h: 80,
            x: 279,
            y: 569
          }
        }
      },
      rules: {
        name: [
          { required: true, message: '请输入样式名称', trigger: 'blur' }
        ],
        bgImg: [
          { required: true, message: '请选择背景图片', trigger: 'change' }
        ]
      },
      liveRoomInfo: {
        name: '',
        startTime: ''
      },
      userInfo: {
        nickName: ''
      },
      src: ''// 海报地址
    }
  },
  watch: {},
  mounted() {
    this.top = Math.abs(window.innerHeight - 825) / 2 + 'px'
  },
  methods: {
    onActivated(key) {
      console.log(key, '点击')
      this.form.liveRoomName.Drag.active = false
      this.form.liveTime.Drag.active = false
      this.form.userInfo.Drag.active = false
      this.form.qr.Drag.active = false
      this.form[key].Drag.active = true
      return
    },
    moment,
    onhandleSave() {
      console.log(this.form)
    },
    onSelectImg(res) {
      if (res.length > 0) {
        this.form.bgImg = res[0].url
      } else {
        this.form.bgImg = ''
      }
    },
    onImgClick(res) {
      console.log(res)
    },
    onDeactivated() {
      console.log('点击组件外')
      this.form.liveRoomName.Drag.active = false
      this.form.liveTime.Drag.active = false
      this.form.userInfo.Drag.active = false
      this.form.qr.Drag.active = false
    },
    onDragstop(key, res) {
      console.log(res, 'resonDragstop')
      const { width, height, left, top } = res
      this.form[key].Drag.y = top
      this.form[key].Drag.x = left
      this.form[key].Drag.w = width
      this.form[key].Drag.h = height
    },
    dragging(e, e1) {
      console.log('拖拽中', e, e1)
    },
    onResizstop(key, res) {
      console.log(res, 'resonResizstop')
      const { width, height, left, top } = res
      this.form[key].Drag.y = top
      this.form[key].Drag.x = left
      this.form[key].Drag.w = width
      this.form[key].Drag.h = height
    }
  }
}
</script>

<style lang='scss' scoped>
.posterSetting {
  display: flex;
  padding: 20px 0 20px 20px;
  position: relative;
  .posterSetting_left {
    width: 377px;
    margin-right: 20px;
    .poster_preview {
      width: 375px;
      height: 667px;
      border: 1px solid #eee;
      position: relative;
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
    }
  }
  .posterSetting_right {
    flex: 1 0 0;
    height: 667px;
    // overflow: auto;
    padding-right: 20px;
  }
}
.liveLinkCode {
  display: inline-block;
  border: none;
  max-width: 750px!important;
  min-width: 80px!important;
}
</style>
