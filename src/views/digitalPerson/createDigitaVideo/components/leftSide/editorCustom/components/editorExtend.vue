<template>
  <div
    id="editorExtend"
    class="wrapper-pause-mute"
    :style="getStyles"
    @click="editorExtendClick"
  >
    <!--停顿选项 -->
    <div v-if="index === 1" class="pause-content">
      <img
        class="arrow-up"
        :style="getStyles.arrowUp"
        src="@/assets/image/aigc/digitalVideoManage/xfjt.png"
        alt=""
      />
      <div @click="emitInfo('短', 'weak')">短</div>
      <div @click="emitInfo('中', 'medium')">中</div>
      <div @click="emitInfo('长', 'strong')">长</div>
    </div>
    <!-- 静音选项 -->
    <div v-if="index === 2" class="mute-content">
      <img
        class="arrow-up"
        :style="getStyles.arrowUp"
        src="@/assets/image/aigc/digitalVideoManage/xfjt.png"
        alt=""
      />
      <el-slider
        v-model="muteValue"
        tooltip-class="tooltip-class"
        :min="0.1"
        :step="0.1"
        :max="10"
        class="sliderMute"
      />
      <div class="label-flex">
        <span v-for="item in [0, 2, 4, 6, 8, 10]" :key="item">{{ item }}</span>
      </div>
      <div class="footer" style="justify-content: flex-end">
        <div class="btns">
          <el-button size="small" @click="index = 0"> 取消 </el-button>
          <el-button
            type="primary"
            size="small"
            @click="emitInfo(muteValue, muteValue)"
          >
            确定
          </el-button>
        </div>
      </div>
    </div>
    <!-- 多音字选项 -->
    <div v-if="index === 3 && isChineseSingle" class="dyz-content">
      <img
        class="arrow-up"
        :style="getStyles.arrowUp"
        src="@/assets/image/aigc/digitalVideoManage/xfjt.png"
        alt=""
      />
      <div
        v-for="(item, i) in words.yinbiaoArray"
        :key="i"
        @click="selectDyz(i)"
      >
        {{ item }}
      </div>
    </div>
    <!-- 数字选项 -->
    <div v-if="index === 4 && isNumber" class="number-content">
      <img
        class="arrow-up"
        :style="getStyles.arrowUp"
        src="@/assets/image/aigc/digitalVideoManage/xfjt.png"
        alt=""
      />
      <div @click="emitInfo('电话', text, transformPhone(text, 1))">
        电话（读法：{{ transformPhone(text, 1) }}）
      </div>
      <div @click="emitInfo('数值', text, transformValue(text))">
        数值（读法：{{ transformValue(text) }}）
      </div>
      <div @click="emitInfo('序列', text, transformPhone(text, 2))">
        序列（读法：{{ transformPhone(text, 2) }}）
      </div>
    </div>
    <!-- 语速选项 -->
    <div v-if="index === 5" class="speechSpeed-content">
      <img
        class="arrow-up"
        :style="getStyles.arrowUp"
        src="@/assets/image/aigc/digitalVideoManage/xfjt.png"
        alt=""
      />
      <el-slider
        v-model="speechSpeedValue"
        tooltip-class="tooltip-class"
        :min="50"
        :step="10"
        :max="200"
        :show-tooltip="index === 5"
        class="sliderMute"
      />
      <div class="label-flex" style="padding: 0 20px">
        <span> 慢 </span>
        <span> 快 </span>
      </div>
      <div class="footer" style="justify-content: space-between">
        <el-link
          type="primary"
          :underline="false"
          @click="speechSpeedValue = defaultSpeechSpeedValue"
        >
          恢复默认
        </el-link>
        <div class="btns">
          <el-button
            size="small"
            @click="previewVideo({ id: 5, value: speechSpeedValue / 100 })"
          >
            预览
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="emitInfo('语速' + speechSpeedValue, speechSpeedValue / 100)"
          >
            确定
          </el-button>
        </div>
      </div>
    </div>
    <!-- 语调选项 -->
    <div v-if="index === 6" class="intonation-content">
      <img
        class="arrow-up"
        :style="getStyles.arrowUp"
        src="@/assets/image/aigc/digitalVideoManage/xfjt.png"
        alt=""
      />
      <el-slider
        v-model="intonationValue"
        tooltip-class="tooltip-class"
        :min="50"
        :step="10"
        :max="200"
        :show-tooltip="index === 6"
        class="sliderMute"
      />
      <div class="label-flex" style="padding: 0 20px">
        <span> 低 </span>
        <span> 高 </span>
      </div>
      <div class="footer" style="justify-content: space-between">
        <el-link
          type="primary"
          :underline="false"
          @click="intonationValue = 100"
        >
          恢复默认
        </el-link>
        <div class="btns">
          <el-button
            size="small"
            @click="previewVideo({ id: 6, value: intonationValue / 100 })"
          >
            预览
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="emitInfo('语调' + intonationValue, intonationValue / 100)"
          >
            确定
          </el-button>
        </div>
      </div>
    </div>
    <!-- 音量选项 -->
    <div v-if="index === 7" class="volume-content">
      <img
        class="arrow-up"
        :style="getStyles.arrowUp"
        src="@/assets/image/aigc/digitalVideoManage/xfjt.png"
        alt=""
      />
      <el-slider
        v-model="volumeValue"
        tooltip-class="tooltip-class"
        :min="50"
        :step="10"
        :max="200"
        :show-tooltip="index === 7"
        class="sliderMute"
      />
      <div class="label-flex" style="padding: 0 20px">
        <span> 小 </span>
        <span> 大 </span>
      </div>
      <div class="footer" style="justify-content: space-between">
        <el-link
          type="primary"
          :underline="false"
          @click="volumeValue = defaultVolumeValue"
        >
          恢复默认
        </el-link>
        <div class="btns">
          <el-button
            size="small"
            @click="previewVideo({ id: 7, value: volumeValue / 100 })"
          >
            预览
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="emitInfo('音量' + volumeValue, volumeValue / 100)"
          >
            确定
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    teacherId: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      index: 0,
      // 静音
      muteValue: 0.1,
      // 语速
      speechSpeedValue: 100,
      // 语调
      intonationValue: 100,
      // 音量
      volumeValue: 100,
      text: '',
      words: undefined,
      isNumber: false,
      isChineseSingle: false,
      defaultSpeechSpeedValue: 100,
      defaultVolumeValue: 100
    }
  },
  computed: {
    getStyles() {
      const style = {
        1: {
          width: '118px',
          top: '4rem',
          arrowUp: { left: '27.5%', top: '-40%' }
        },
        2: {
          width: '386px',
          top: '4rem',
          left: '6rem',
          arrowUp: { top: '-1rem', left: '2rem' }
        },
        3: {
          width: '194px',
          top: '4rem',
          left: '10.8rem',
          arrowUp: { top: '-1rem', left: '2rem' }
        },
        4: {
          top: '4rem',
          left: '16.4rem',
          arrowUp: { top: '-1rem', left: '2rem' }
        },
        5: {
          width: '386px',
          top: '4rem',
          left: '19.8rem',
          arrowUp: { top: '-1rem', left: '2rem' }
        },
        6: {
          width: '386px',
          top: '4rem',
          left: '24.5rem',
          arrowUp: { top: '-1rem', left: '2rem' }
        },
        7: {
          width: '386px',
          top: '4rem',
          left: '29.2rem',
          arrowUp: { top: '-1rem', left: '2rem' }
        }
      }[this.index]
      return style
    }
  },
  watch: {
    teacherId: {
      handler(val) {
        if (val) {
          const config = JSON.parse(
            localStorage.getItem('configEditorCustomDigitalPersonList')
          )
          if (config) {
            const ls = Object.keys(config)
            const key = ls.find(
              f => f === this.$store.state.user.userInfo.userId + this.teacherId
            )
            if (config[key]) {
              this.defaultSpeechSpeedValue = config[key].speed
              this.defaultVolumeValue = config[key].volume
              this.speechSpeedValue = config[key].speed
              this.volumeValue = config[key].volume
            }
          }
        }
      },
      deep: true,
      immediate: true
    },
    index(val) {
      if (val === 0) {
        this.muteValue = 0.1
      }
    }
  },
  methods: {
    editorExtendClick(e) {
      e.preventDefault()
      e.stopPropagation()
    },
    setIndex(id, info) {
      const nId = Number(id)
      if (nId === 0) {
        this.text = ''
        this.isNumber = false
        this.words = {}
        this.isChineseSingle = false
      }
      if (nId === 3) {
        this.words = { ...info.words }
        this.isChineseSingle = true
      }
      if (nId === 4) {
        this.text = info.text
        this.isNumber = true
      } else {
        this.speechSpeedValue = this.defaultSpeechSpeedValue
        this.volumeValue = this.defaultVolumeValue
        this.intonationValue = 100
      }
      this.index = nId
    },
    previewVideo(record) {
      this.$emit('prview', { ...record })
    },
    isShowFn(key) {
      return this.fnList.filter(f => Number(f) === key).length > 0
    },
    // // 转化为数值
    transformValue(val) {
      var arr1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
      var arr2 = [
        '',
        '十',
        '百',
        '千',
        '万',
        '十',
        '百',
        '千',
        '亿',
        '十',
        '百',
        '千',
        '万',
        '十',
        '百',
        '千',
        '亿'
      ]
      if (!val || isNaN(val)) return '零'
      if (val > 99999999999999999) return '数值过大'
      var english = val.toString().split('')
      var result = ''
      for (var i = 0; i < english.length; i++) {
        var des_i = english.length - 1 - i // 倒序排列设值
        result = arr2[i] + result
        var arr1_index = english[des_i]
        result = arr1[arr1_index] + result
      }
      result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十') // 将【零千、零百】换成【零】 【十零】换成【十】
      result = result.replace(/零+/g, '零') // 合并中间多个零为一个零
      result = result.replace(/零亿/g, '亿').replace(/零万/g, '万') // 将【零亿】换成【亿】【零万】换成【万】
      result = result.replace(/亿万/g, '亿') // 将【亿万】换成【亿】
      result = result.replace(/零+$/, '') // 移除末尾的零
      // 将【一十】换成【十】
      result = result.replace(/^一十/g, '十')
      return result
    },
    // 转化手机号/序列 type-1手机号 -2 序列
    transformPhone(val, type) {
      const value = val + ''
      if (value.length < 1) return ''
      let res = ''
      const arr = [
        '零',
        type === 1 ? '幺' : '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九'
      ]
      value.split('').forEach(r => {
        res += arr[Number(r)]
      })
      return res
    },
    selectDyz(index) {
      this.$emit('emitChange', {
        type: this.index + '',
        name: this.words.yinbiaoArray[index],
        value: this.words.pinyinArray[index],
        text: this.words.text
      })
      this.index = 0
    },
    emitInfo(pauseName, pauseValue, customText = undefined) {
      this.$emit('emitChange', {
        type: this.index + '',
        name: pauseName,
        value: pauseValue,
        text: this.text,
        customText: customText
      })
      this.index = 0
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper-pause-mute {
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
  user-select: none;
  .item-pub {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    padding: 7px 10px;
    &:hover {
      background-color: #f5f5f5;
    }
    img {
      width: 20px;
      height: 20px;
      margin-right: 6px;
    }
    span {
      font-size: 14px;
      color: #333333;
    }
  }
  .item-pause,
  .item-select,
  .item-mute {
    @extend .item-pub;
  }
  .dyz-content {
    user-select: none;
    padding: 4px 0;
    div {
      cursor: pointer;
      width: 100%;
      height: 36px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333333;
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
  .number-content {
    user-select: none;
    padding: 4px 0;
    div {
      padding: 15px 10px;
      cursor: pointer;
      min-width: 26px;
      height: 26px;
      font-size: 14px;
      display: flex;
      align-items: center;
      color: #333333;
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
  .arrow-up {
    position: absolute;
    width: 28px;
    height: 23px;
    transform: translateX(-50%);
  }
  .pause-content {
    padding: 10px;
    display: flex;
    align-items: center;
    user-select: none;
    div {
      cursor: pointer;
      min-width: 26px;
      height: 26px;
      font-size: 14px;
      color: #333333;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      &:hover {
        background-color: #f5f5f5;
      }
    }
    // 锁定最后一个div
    div:last-child {
      margin-right: 0 !important;
    }
  }
  .volume-content,
  .intonation-content,
  .speechSpeed-content,
  .mute-content {
    height: 138px;
    position: relative;
    .sliderMute {
      padding: 0 20px;
      padding-top: 45px;
    }
    .label-flex {
      display: flex;
      justify-content: space-between;
      margin-top: 4px;
      padding: 0 14px;
      span {
        font-size: 14px;
        font-weight: 400;
        color: #999999;
      }
    }
    .footer {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      margin-top: 13px;
      padding: 0 20px;
      .btns {
        button {
          width: 96px;
          height: 32px;
        }
      }
    }
  }
}
::v-deep .sliderMute {
  .el-slider__runway {
    height: 8px;
    margin: 0;
    .el-slider__bar {
      background-color: #0c6fff;
      height: 8px;
    }
    .el-slider__button-wrapper {
      top: -14px;
      .el-tooltip {
        width: 15px;
        height: 15px;
        border: solid 3px #fff;
        background-color: #0c6fff;
      }
    }
  }
}
</style>
<style lang="scss">
.tooltip-class {
  color: #ffffff;
  background: #666666 !important;
  padding: 7px;
  .popper__arrow {
    border-color: #fff !important;
    &::after {
      border-color: #666666 transparent !important;
    }
  }
}
</style>
