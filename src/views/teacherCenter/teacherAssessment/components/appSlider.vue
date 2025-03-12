<template>
  <div class="my-slider">
    <div class="my-slider__tooltip" :style="style">
      <el-button
        class="my-slider__tooltip-wrapper"
        size="mini"
        type="primary"
      >
        {{ slider }}
      </el-button>
    </div>
    <el-slider
      v-model="slider"
      :format-tooltip="(value) => value"
      :show-tooltip="false"
      :min="min"
      :max="max"
      :step="step"
      @input="input"
    />
  </div>
</template>

<script>
export default {
  name: 'MySlider',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Number,
      default: 100
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    step: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      slider: this.value
    }
  },
  computed: {
    style() {
      const length = this.max - this.min
      const progress = this.slider - this.min
      const left = progress / length * 100
      return {
        paddingLeft: `${left}%`
      }
    }
  },
  watch: {
    value(newValue) {
      this.slider = newValue
    }
  },
  methods: {
    input(value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.my-slider {
  .my-slider__tooltip {
    text-align: left;
    .my-slider__tooltip-wrapper {
      height: 32px;
      transform: translateX(-50%);
      top: -50%;
    }
  }
}
</style>
