<template>
  <div class="head-editor">
    <div id="head-editor-left" class="left" @click="leftClick">
      <!-- 停顿 -->
      <div
        v-if="thirdType !== 5"
        @click="
          e => {
            fnClick(e, 1)
          }
        "
      >
        <el-tooltip class="item" effect="dark" placement="top">
          <template slot="content">
            <div style="margin-bottom: 3px">快捷键：</div>
            <div>停顿-短：alt+1</div>
            <div>停顿-中：alt+2</div>
            <div>停顿-长：alt+3</div>
          </template>
          <div class="fn-item fn-item-hover">
            <img
              class="icon-img-h"
              src="@/assets/image/aigc/digitalVideoManage/pause-nh.png"
            />
            <span>停顿</span>
          </div>
        </el-tooltip>
      </div>
      <!-- 静音 -->
      <div
        v-if="thirdType !== 3 && thirdType !== 5"
        class="fn-item fn-item-hover"
        @click="
          e => {
            fnClick(e, 2)
          }
        "
      >
        <img
          class="icon-img-h"
          src="@/assets/image/aigc/digitalVideoManage/mute-nh.png"
        />
        <span>静音</span>
      </div>

      <!-- 多音字 -->
      <div
        class="fn-item"
        @click="
          e => {
            fnClick(e, 3)
          }
        "
      >
        <img
          v-if="!isChineseSingle"
          class="icon-img"
          src="@/assets/image/aigc/digitalVideoManage/dyz-n.png"
        />
        <img
          v-else
          :class="[isChineseSingle ? 'icon-img-t' : 'icon-img-h']"
          src="@/assets/image/aigc/digitalVideoManage/dyz-nh.png"
        />
        <span :class="{ 'special-span': isChineseSingle }">多音字</span>
      </div>

      <!-- 数字 -->
      <div
        class="fn-item"
        @click="
          e => {
            fnClick(e, 4)
          }
        "
      >
        <img
          v-if="!isNumber"
          class="icon-img"
          src="@/assets/image/aigc/digitalVideoManage/sz-n.png"
        />
        <img
          :class="[isNumber ? 'icon-img-t' : 'icon-img-h']"
          src="@/assets/image/aigc/digitalVideoManage/sz-nh.png"
        />
        <span :class="{ 'special-span': isNumber }">数字</span>
      </div>

      <!-- 语速 -->
      <div
        v-if="thirdType === 2 && thirdType !== 5"
        class="fn-item"
        @click="
          e => {
            fnClick(e, 5)
          }
        "
      >
        <img
          v-if="!ys"
          class="icon-img"
          src="@/assets/image/aigc/digitalVideoManage/ys-icon.png"
        />
        <img
          :class="[ys ? 'icon-img-t' : 'icon-img-h']"
          src="@/assets/image/aigc/digitalVideoManage/ys-icon-s.png"
        />
        <span :class="{ 'ys-span': ys }">语速</span>
      </div>

      <!-- 语调 -->
      <div
        v-if="thirdType === 2 && thirdType !== 5"
        class="fn-item"
        @click="
          e => {
            fnClick(e, 6)
          }
        "
      >
        <img
          v-if="!yd"
          class="icon-img"
          src="@/assets/image/aigc/digitalVideoManage/yd-icon.png"
        />
        <img
          :class="[yd ? 'icon-img-t' : 'icon-img-h']"
          src="@/assets/image/aigc/digitalVideoManage/yd-icon-s.png"
        />
        <span :class="{ 'yd-span': yd }">语调</span>
      </div>

      <!-- 音量 -->
      <div
        v-if="thirdType === 2"
        class="fn-item"
        @click="
          e => {
            fnClick(e, 7)
          }
        "
      >
        <img
          v-if="!yl"
          class="icon-img"
          src="@/assets/image/aigc/digitalVideoManage/yl-icon.png"
        />
        <img
          :class="[yl ? 'icon-img-t' : 'icon-img-h']"
          src="@/assets/image/aigc/digitalVideoManage/yl-icon-s.png"
        />
        <span :class="{ 'yl-span': yl }">音量</span>
      </div>
      <el-tooltip class="item" effect="dark" placement="top">
        <template v-if="thirdType === 5" slot="content">
          <strong>多音字</strong>：选中单个文字，可指定文字拼音读法。<br />
          <strong>数字</strong>：选中数字，设置数字不同读法。至此回电话、数值和序列三种不同的形式。<br />
          <strong>语速</strong>：局部语速调整，可改变朗读速度。部分形象支持。<br />
          <strong>撤销</strong>：ctrl+z<br />
          <strong>重做</strong>：ctrl+shift+z
        </template>
        <template v-if="thirdType !== 5" slot="content">
          <strong>停顿</strong>
          <br />系统会根据语意，以及设定的等级综合做停顿处理。<br />
          <strong>静音</strong>：光标定位到指定文字后，用于在文本中插入指定时长的静音，最多10秒。部分形象支持。<br />
          <strong>多音字</strong>：选中单个文字，可指定文字拼音读法。<br />
          <strong>数字</strong>：选中数字，设置数字不同读法。至此回电话、数值和序列三种不同的形式。<br />
          <strong>语速</strong>：局部语速调整，可改变朗读速度。部分形象支持。<br />
          <strong>语调</strong>：局部语调调整，可改变声音音调。部分形象支持。<br />
          <strong>音量</strong>：局部音量调整，可改变声音大小。部分形象支持。<br />
          <br />
          <strong>快捷键操作：</strong><br />
          <strong>停顿-短</strong>：alt+1<br />
          <strong>停顿-中</strong>：alt+2<br />
          <strong>停顿-长</strong>：alt+3<br />
          <strong>撤销</strong>：ctrl+z<br />
          <strong>重做</strong>：ctrl+shift+z
        </template>
        <img
          class="doubt"
          src="@/assets/image/aigc/digitalVideoManage/szro.png"
          alt=""
        />
      </el-tooltip>
    </div>
    <div class="right">
      <div
        :class="{ 'ai-item': true, 'ai-item-h': isAI }"
        @click="isAI = !isAI"
      >
        <img
          class="ai-icon"
          src="@/assets/image/aigc/digitalVideoManage/ai-icon.png"
        />
        <img
          class="ai-icon-h"
          src="@/assets/image/aigc/digitalVideoManage/ai-icon-gif.gif"
        />
        <span>AI助手</span>
      </div>
      <paperworkAI
        v-if="isAI"
        class="paperworkAI"
        @handleAIClick="handleAIClick"
      />
    </div>
    <!-- 编辑器扩展功能 -->
    <!-- :teacher-id="teacherId"  -->
    <editorExtend
      ref="editorExtendRef"
      class="editorExtendDialog"
      @prview="e => $emit('prview', e)"
      @emitChange="e => changeEmit(e)"
    />
  </div>
</template>

<script>
import paperworkAI from './paperworkAI'
import editorExtend from './editorExtend'
import { covertUsingGET } from '@/api/aiVideoManage'
export default {
  components: { paperworkAI, editorExtend },
  props: {
    // teacherId: {
    //   type: String,
    //   default: undefined
    // }
  },
  data() {
    return {
      isNumber: false,
      isChineseSingle: false,
      isAI: false,
      words: {},
      text: '',
      isFocus: false,
      homographText: '',
      thirdType: 1,
      partShow: [],
      ys: false,
      yd: false,
      yl: false
    }
  },
  watch: {
    homographText: {
      async handler(val, oldVal) {
        if (val !== oldVal && !!val) {
          await this.covertUsing(val)
        }
      },
      deep: true
    },
    partShow: {
      handler(val) {},
      deep: true,
      immediate: true
    }
  },
  created() {
    document.addEventListener('click', this.globleClick)
  },
  destroyed() {
    document.removeEventListener('click', this.globleClick)
  },
  methods: {
    leftClick(e) {
      e.stopPropagation()
    },
    setDefaultSpeechSpeedOrVolumeValue({ speed, volume }) {
      this.$refs.editorExtendRef.defaultSpeechSpeedValue = speed
      this.$refs.editorExtendRef.defaultVolumeValue = volume
    },
    async covertUsing(val) {
      const res = await covertUsingGET({ content: val })
      // eslint-disable-next-line eqeqeq
      if (res.code == 1) {
        this.words = {
          pinyinArray: res.data.pinyinArray,
          yinbiaoArray: res.data.yinbiaoArray,
          text: val
        }
      }
    },
    changeEmit(e) {
      this.isChineseSingle = false
      this.isNumber = false
      this.partShow = []
      this.ys = false
      this.yd = false
      this.yl = false
      this.$emit('emitChange', e)
    },
    setIsNestedSub(val, partShow) {
      this.ys = val || partShow.filter(item => item === 5).length > 0
      this.yd = val || partShow.filter(item => item === 6).length > 0
      this.yl = val || partShow.filter(item => item === 7).length > 0
    },
    setNumber(isOk, record) {
      this.text = isOk ? record : ''
      this.isNumber = isOk
    },
    async setChineseSingle(isOk, record) {
      this.homographText = isOk ? record : ''
      this.isChineseSingle = isOk
    },
    fnClick(e, id) {
      e.stopPropagation()
      if (
        id < 3 ||
        (id === 3 && this.isChineseSingle) ||
        (id === 4 && this.isNumber) ||
        (id === 5 && this.ys) ||
        (id === 6 && this.yd) ||
        (id === 7 && this.yl)
      ) {
        this.$refs.editorExtendRef.setIndex(id, {
          isNumber: this.isNumber,
          isChineseSingle: this.isChineseSingle,
          words: this.isChineseSingle ? this.words : undefined,
          text: this.text
        })
      }
    },
    globleClick(e) {
      // 判断是否点击的是AI助手
      if (this.isAI) {
        const isContain = document
          .getElementsByClassName('ai-item')[0]
          .contains(e.target)
        const isContain2 = document
          .getElementsByClassName('paperworkAI')[0]
          .contains(e.target)
        if (!isContain && !isContain2) {
          this.isAI = false
        }
      }
      if (
        !document.getElementById('editorExtend').contains(e.target) &&
        !document.getElementById('head-editor-left').contains(e.target)
      ) {
        // this.isNumber = false
        // this.isChineseSingle = false
        this.$refs.editorExtendRef.setIndex(0)
      }
    },
    handleAIClick(item) {
      this.isAI = false
      this.$emit('handleAIClick', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.head-editor {
  width: 100%;
  height: 48px;
  background: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  position: relative;
  border-radius: 4px 4px 0px 0px;
  border: 1px solid #e1e6ed;
  .left {
    display: flex;
    align-items: center;
    position: relative;
    .fn-item {
      display: flex;
      align-items: center;
      margin-right: 20px;
      user-select: none;
      cursor: pointer;
      .icon-img-t,
      .icon-img,
      .icon-img-h {
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }
      .icon-img-h {
        display: none;
      }
      span {
        font-size: 14px;
        color: #999999;
        line-height: 0;
      }
      .special-span {
        color: #ff9800 !important;
      }
      .ys-span {
        color: #21a8c2 !important;
      }
      .yd-span {
        color: #00c6a1 !important;
      }
      .yl-span {
        color: #00d2ff !important;
      }
    }
    .fn-item-hover {
      .icon-img-h {
        display: block;
      }
      span {
        color: #0c6fff;
      }
    }
    .doubt {
      width: 18px;
      height: 18px;
    }
  }
  .right {
    position: relative;
    .ai-item-h {
      span {
        color: #1778ff;
      }
      .ai-icon {
        display: none;
      }
      .ai-icon-h {
        display: block;
      }
    }
    .ai-item {
      display: flex;
      align-items: center;
      user-select: none;
      cursor: pointer;
      &:hover {
        @extend .ai-item-h;
      }
      .ai-icon-h,
      .ai-icon {
        display: block;
        width: 38px;
        height: 38px;
        margin-right: 3px;
      }
      .ai-icon-h {
        display: none;
      }
      span {
        font-size: 14px;
        font-weight: 400;
        color: #161616;
      }
    }
    .paperworkAI {
      position: absolute;
      z-index: 999;
      top: 64px;
      right: -5px;
    }
  }
  .editorExtendDialog {
    position: absolute;
    z-index: 1000;
  }
}
</style>
