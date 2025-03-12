<template>
  <div class="mark-search-container flex items-center justify-between">
    <el-input v-model="name" prefix-icon="el-icon-search" placeholder="请输入标签名称" size="mini" class="input-name" @keyup.enter.native="markSearch" />
    <div class="mark-colors flex">
      <span v-for="(item,index) in colors" :key="item.label" :style="{background:item.label}" class="flex items-center justify-center" :class="{white:index===5}" @click="handleClickColorItem(index)">
        <i v-if="activeIndex===index" class="el-icon-check" />
      </span>
    </div>
  </div>
</template>

<script>
import { markColors, getColorValue } from '../../../utils'
export default {
  data() {
    return {
      name: null,
      activeIndex: -1,
      colors: markColors
    }
  },
  methods: {
    markSearch() {
      let color = null
      if (this.activeIndex > -1) {
        color = getColorValue(this.colors[this.activeIndex].label)
      }
      this.$emit('search', { name: this.name, color })
    },
    handleClickColorItem(index) {
      this.activeIndex = this.activeIndex === index ? -1 : index
      this.markSearch()
    }
  }
}
</script>
<style lang="scss" scoped>
.mark-search-container{
    padding:0 20px;
    .input-name{
        width:136px;
        margin-right:20px;
    }
    .mark-colors{
        span{
            width: 16px;
            height: 16px;
            margin-right:8px;
            border-radius: 2px;
            cursor: pointer;
            i{
                color:#fff;
                font-size:14px;
            }
            &.white{
                i{
                    color:#000
                }
            }

        }
    }
}
   ::v-deep .el-input--mini .el-input__inner{
        border:1px solid #4D4D4D;
        border-radius: 2px;
        background: none;
        color: #737373;
        height: 24px;
        line-height: 24px;
        padding-left:28px;
    }
    ::v-deep .el-input--mini .el-input__icon{
        line-height: 24px;
        width: 0;
        color:#737373;
        font-size:14px;
        margin-left:4px;
    }
    ::v-deep .el-input__inner::placeholder{
        color:#737373;
        font-size:12px;
    }
</style>
