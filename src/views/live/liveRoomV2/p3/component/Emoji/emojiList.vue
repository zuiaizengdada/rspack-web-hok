<template>
  <el-scrollbar ref="emojiScroll" class="emojiScroll">
    <div class="emojiContent">
      <img
        v-for="(item, index) in emojiList1"
        :key="index"
        :src="currentIndex === index ? emojiList[index].value : item.value"
        :alt="item.name"
        class="emoji-box"
        :title="item.name"
        @click="pickEmoji(index)"
        @mouseenter="handleMouseEnter(index)"
        @mouseleave="handleMouseLeave(index)"
      />
    </div>
  </el-scrollbar>
</template>
<script>
import { emojiList, emojiList1 } from './emoji'
export default {
  data() {
    return {
      emojiList,
      emojiList1,
      currentIndex: ''
    }
  },
  created() {},
  methods: {
    pickEmoji(idx) {
      return this.$emit('selectEmoji', this.emojiList[idx])
    },
    handleMouseEnter(index) {
      this.currentIndex = index
    },
    handleMouseLeave(index) {
      this.currentIndex = ''
    }
  }
}
</script>
<style lang="scss" scoped>
  .emojiScroll{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    ::-webkit-scrollbar { display: none; }
    .emojiContent {
      // padding: 20px 0px 0 20px;
    }
  }
  .emoji-box {
    width: 30px;
    display: inline-block;
    font-size: 22px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    padding: 10px;
    transform: scale(1);
    box-sizing: content-box;
    // &:hover {
    //   border-radius: 5px;
    //   transform: scale(1.4);
    // }
  }
</style>
