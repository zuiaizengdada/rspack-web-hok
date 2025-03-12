<template>
  <div :id="info.id" @click="globleConfigClick">
    <div class="slider-item">
      <img class="icon-h" :src="getIcon" alt="" />
      <span class="title">{{ getTitle }}</span>
      <span class="label">{{ info.startText }}</span>
      <el-slider
        v-model="getValue"
        tooltip-class="tooltip-class"
        :min="info.min"
        :max="info.max"
        class="slider"
      />

      <span class="label">{{ info.endText }}</span>

      <el-link
        type="primary"
        :underline="false"
        style="margin-left: 12px"
        @click="$emit('changeValue', 100)"
      >
        恢复默认
      </el-link>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'changeValue'
  },
  props: {
    value: {
      type: Number,
      default: 100
    },
    info: {
      type: Object,
      default: () => {
        return {
          startText: '',
          endText: '',
          min: 50,
          max: 200
        }
      }
    }
  },
  computed: {
    getTitle() {
      return this.info.id === 'speed' ? '朗读速度：' : '朗读音量：'
    },
    getIcon() {
      return this.info.id === 'speed'
        ? require('@/assets/image/aigc/digitalVideoManage/speed-icon-h.png')
        : require('@/assets/image/aigc/digitalVideoManage/volume-icon-h.png')
    },
    getValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('changeValue', val)
      }
    }
  },
  methods: {
    globleConfigClick(e) {
      e.preventDefault()
      e.stopPropagation()
    }
  }
}
</script>
<style lang="scss" scoped>
.slider-item {
  display: flex;
  align-items: center;
  width: 100%;
  user-select: none;
  .slider {
    width: 43%;
    margin: 0 12px;
  }
  .label {
    font-size: 14px;
    color: #333333;
  }
  .title {
    font-size: 16px;
    color: #333333;
    margin-right: 6px;
  }
  .icon-h {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }
}
::v-deep .slider {
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
