<template>
  <!-- 文本展开收起组件 -->
  <div class="textShowMore">
    <div ref="showMore" :class="{showMore: !show, text: show}" :style="{'-webkit-line-clamp': lineClamp }">
      <span v-if="ifMore" class="jyfwbtn" @click="show = !show">
        {{ show ? '收起' : '展开' }}
        <i class="el-icon-arrow-up" :class="{ btn_close: !show }" />
      </span>
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    text: {
      type: String,
      default: ''
    },
    lineClamp: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      show: false,
      ifMore: false
    }
  },
  watch: {
    text: {
      handler(val) {
        // console.log(val)
        this.$nextTick(() => {
          this.ifMore = this.$refs.showMore.scrollHeight > this.$refs.showMore.offsetHeight
          // console.log(this.ifMore, 'this.ifMore')
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    refresh() {
      this.$nextTick(() => {
        this.ifMore = this.$refs.showMore.scrollHeight > this.$refs.showMore.offsetHeight
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.textShowMore {
    display: flex;
    width: 100%;
    word-break: break-all;
    white-space: pre-wrap;
    .text {
        font-size: 14px;
        &::before{
        content: '';
        float: right;
        width: 0;
        height: 100%;
        margin-bottom: -19px;
        }
    }
    .jyfwbtn {
        float: right;
        clear: both;
        cursor: pointer;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #0C6FFF;
        line-height: 14px;
    }
    .showMore {
        /* 设置多行文本溢出省略 */
        display: -webkit-box;
        /* 默认最多显示3行 */
        overflow: hidden;
        -webkit-box-orient: vertical;
        font-size: 14px;
        &::before{
        content: '';
        float: right;
        width: 0;
        height: 100%;
        margin-bottom: -19px;
        }
    }
}
.btn_close {
  transform: rotate(180deg);
}
</style>
