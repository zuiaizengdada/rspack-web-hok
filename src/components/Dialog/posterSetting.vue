<template>
  <AppDialog v-model="visible" title="海报设置" width="1400px" :loading="loading" height="auto" :top="top" @success="onhandleSave">
    <div class="posterSetting_tips">样式支持拖动可支持排列</div>
    <div class="posterSetting">
      <MLoading :visible="loading" :style="{'background-color': 'hsla(0, 0%, 100%, .9)'}" />
      <div class="posterSetting_left">
        <div class="posterSetting_bg">
          <div id="poster_preview" class="poster_preview" :class="{noBg: !form.bgImg}">
            <!-- 图层一：背景图片 -->
            <div v-if="form.bgImg" class="fix_layer" :style="{'background-image': `url(${form.bgImg})`}" />
            <!-- 图层二：直播间名称 -->
            <VueDragResize
              v-if="form.liveRoomName.style.opacity === 1"
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
              <span class="poster_layout" :style="{...form.liveRoomName.style, 'font-size': form.liveRoomName.style.fontSize + 'px'}">您的直播间名称</span>
            </VueDragResize>
            <!-- 图层三：直播时间 -->
            <VueDragResize
              v-if="form.liveTime.style.opacity === 1"
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
              <span class="poster_layout" :style="{...form.liveTime.style, 'font-size': form.liveTime.style.fontSize + 'px'}">开播时间：
                <!-- {{ liveRoomInfo.startTime? moment(liveRoomInfo.startTime).format('MM-DD HH:mm'): '' }} -->
                MM-DD 00:00
              </span>
            </VueDragResize>
            <!-- 图层四：邀请人 -->
            <VueDragResize
              v-if="form.userInfo.style.opacity === 1"
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
              <span class="poster_layout" :style="{...form.userInfo.style, 'font-size': form.userInfo.style.fontSize + 'px'}">邀请人：{{ form.userInfo.userName }}</span>
            </VueDragResize>
            <!-- 图层五: 二维码 -->
            <VueDragResize
              v-if="form.qr.style.opacity === 1"
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
      </div>
      <div class="posterSetting_right">
        <el-form ref="ruleForm" size="small" :model="form" :rules="rules" label-position="top" label-width="80px" class="demo-ruleForm">
          <el-form-item prop="name" label="样式名称">
            <el-input v-model.trim="form.name" maxlength="10" show-word-limit />
          </el-form-item>
          <el-form-item prop="bgImg" label="背景图片">
            <AppUploadViewCropper
              key="MUploadImg"
              ref="MUploadImg"
              upload-text="上传图片"
              :width="80"
              :height="104"
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
            <posterSettingPanel v-model="form.liveRoomName.style">
              <el-radio-group v-model="form.liveRoomName.style.opacity">
                <el-radio :label="1">展示</el-radio>
                <el-radio :label="0">不展示</el-radio>
              </el-radio-group>
            </posterSettingPanel>
          </el-form-item>
          <el-form-item prop="liveTime" label="直播时间">
            <posterSettingPanel v-model="form.liveTime.style">
              <el-radio-group v-model="form.liveTime.style.opacity">
                <el-radio :label="1">展示</el-radio>
                <el-radio :label="0">不展示</el-radio>
              </el-radio-group>
            </posterSettingPanel>
          </el-form-item>
          <el-form-item prop="userInfo" label="邀请人">
            <posterSettingPanel v-model="form.userInfo.style" :setting="{showName: true, showFontWeight: false}">
              <el-radio-group v-model="form.userInfo.style.opacity" style="width: 462px">
                <el-radio :label="1">展示</el-radio>
                <el-radio :label="0">不展示</el-radio>
              </el-radio-group>
              <el-input slot="userName" v-model="form.userInfo.userName" style="width: 462px" />
            </posterSettingPanel>
          </el-form-item>
          <el-form-item prop="qr" label="二维码样式">
            <el-radio-group v-model="form.qr.style.opacity">
              <el-radio :label="1">展示</el-radio>
              <el-radio :label="0">不展示</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div slot="footer" class="dialogFooter">
      <el-button size="small" :loading="subLoading" @click="onhandleBack">返回</el-button>
      <el-button size="small" type="primary" :loading="subLoading" @click="onSave">保存</el-button>
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
import { posterSetupAdd } from '@/api/liveRoom/liveRoom.js'
import domtoimage from 'dom-to-image'
import { imgBase64 } from '@/api/course'
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
      subLoading: false,
      success: () => {},
      src: ''// 海报地址
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.form.userInfo.userName = this.userInfo.nickName
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 933) / 2 + 'px'
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
    },
    onhandleBack() {
      this.visible = false
    },
    // 点击保存
    onSave() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.form)
          this.onSubmit()
        } else {
          return false
        }
      })
    },
    onSubmit() {
      this.subLoading = true
      // 生成封面图
      const _this = this
      const node = document.getElementById('poster_preview')
      domtoimage.toPng(node)
        .then(async function (blob) {
          console.log(blob, 'blob')
          imgBase64({ base64Data: blob }).then(res => {
            console.log(res, 'res1111111111', res.data.url)
            const data = {
              posterName: _this.form.name,
              coverUrl: res.data.url, // 封面
              isDefault: 0, // 是否默认 0-默认，1-非默认
              posterSetup: JSON.stringify(_this.form) // 海报JSON字符串
            }
            posterSetupAdd(data).then((res) => {
              _this.success && _this.success()
              _this.subLoading = false
              _this.visible = false
            }).catch(() => {
              _this.subLoading = false
            })
          })
        })
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
  .el-upload {
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #FBFCFE;
      width: 80px;
      height: 106px;
    }
  }
  .el-form-item--small .el-form-item__label {
    line-height: 14px;
    font-size: 14px;
    font-style: normal;
    font-weight: bolder;
    color: #000;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 16px;
  }
  .el-radio__label {
    color: #333;
  }
}
.posterSetting_tips {
  color: #000000;
  font-family: "Microsoft YaHei";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  margin-top: 20px;
  margin-left: 20px;
}
.posterSetting {
  display: flex;
  padding: 20px 0 0 20px;
  position: relative;
  .posterSetting_left {
    margin-right: 20px;
    width: 870px;
    height: 704px;
    flex-shrink: 0;
    background: #F7F7F7;
    display: flex;
    align-items: center;
    justify-content: center;
    .posterSetting_bg {
      width: 375px;
      height: 667px;
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
      .noBg {
        background-image: url(~@/assets/image/poster.png);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }
    }
  }
  .posterSetting_right {
    flex: 1 0 0;
    height: 704px;
    overflow: auto;
    padding-right: 20px;
  }
}
.liveLinkCode {
  display: inline-block;
  border: none;
  max-width: 750px!important;
  min-width: 80px!important;
}
.dialogFooter {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
