<template>
  <div class="Emojs" v-bind="$attrs" v-on="$listeners">
    <div title="表情" @click="onClick">
      <svg-icon icon-class="biaoqing" class-name="svgicon" style="stroke:currentColor" />
    </div>
    <div v-if="value" class="model">
      <emojsList @selectEmoji="selectEmoji" />
    </div>
  </div>
</template>

<script>
import emojsList from './emojiList.vue'
export default {
  components: {
    emojsList
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['value'],
  data() {
    return {
    }
  },
  mounted() {
    this.closeShow()
  },
  methods: {
    selectEmoji(res) {
      this.$emit('selectEmoji', res)
      this.$emit('input', !this.value)
    },
    onClick(e) {
      this.$emit('input', !this.value)
      e.stopPropagation()
      return false
    },
    closeShow() {
      document.addEventListener('click', (e) => {
        const thisClassName = e.target.className
        if (thisClassName !== 'emojiScroll el-scrollbar') {
          this.$emit('input', false)
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.Emojs {
  display: inline-block;
  width: 24px;
  height: 24px;
  position: relative;
  .svgicon {
    width: 24px;
    height: 24px;
    cursor: pointer;
    color: #333333;
  }
  .model {
    position: absolute;
    top: -17px;
    left: 0;
    width: 351px;
    height: 154px;
    transform: translateY(-100%);
    background: #fff;
    user-select:none;
    background: #FFFFFF;
    box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.1);
    border-radius: 8px;
  }
}
</style>
