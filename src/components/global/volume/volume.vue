<template>
  <el-popover v-model="show" width="30" popper-class="volumePopper" effect="dark" placement="top" :visible-arrow="false" trigger="click">
    <div>
      <div class="volumeText">
        {{ volume }}
      </div>
      <el-slider :value="volume" vertical height="83px" :min="0" :max="100" :show-tooltip="false" @input="onChange" />
    </div>
    <div slot="reference" class="volume">
      <slot v-if="volume === 0" name="jingyin">
        <svg-icon icon-class="jingyin" class-name="volume-icon" />
      </slot>
      <slot v-else name="yinlaing">
        <svg-icon icon-class="yinlaing" class-name="volume-icon" />
      </slot>
    </div>
  </el-popover>
</template>

<script>
export default {
  components: {},
  props: {
    value: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    volume: {
      get() {
        return Number(this.value)
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    // window.addEventListener('click', (e) => {
    //   console.log(e)
    //   if (this.show) {
    //     this.show = false
    //   }
    // })
  },
  methods: {
    onChange(val) {
      this.volume = val
      this.$emit('input', val)
      this.$emit('change', val)
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep{
  .el-slider.is-vertical .el-slider__runway {
    margin: 0 8px;
  }
}
.volume {
  width: 24px;
  height: 24px;
  position: relative;
  color: #606266;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.volumeText {
  text-align: center;
  height: 20px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #FFFFFF;
  line-height: 20px;
  margin-bottom: 4px;
}
.volume-icon {
  font-size: 24px;
}
</style>
<style lang='scss'>
  .volumePopper {
    width: 32px;
    min-width: 32px;
    padding: 8px 4px 12px!important;
    background: rgba(0,0,0,0.8);
    border-radius: 4px;
    border: none;
    .el-slider__runway {
      margin: 0 10px!important;
      width: 4px!important;
      .el-slider__bar {
        width: 4px!important;
      }
    }
    .el-slider.is-vertical .el-slider__button-wrapper {
      left: -16px;
    }
  }
</style>
