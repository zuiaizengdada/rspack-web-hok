<template>
  <div class="mark-list-container flex">
    <el-tooltip
      v-for="(item) in markList"
      :key="item.markId"
    >
      <div slot="content" class="mark-content">
        <p>{{ item.name }}</p>
        <p>{{ getFormatSSS(item.startTime*1000) }}</p>
        <p>持续时间: {{ item.duration }}</p>
        <p>{{ item.notes }}</p>
      </div>
      <p :style="{background:getColor(item.color),width:markWidth+'px'}" class="mark-name truncate">{{ item.name }}</p>
    </el-tooltip>
  </div>
</template>
<script>
import { getFormatSSS, getColor } from '../../utils'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      markWidth: 0,
      markList: []
    }
  },
  mounted() {
    this.initMarkNameWidth()
    this.getMarkDuration()
  },
  methods: {
    // 根据标记个数动态计算单个标记所需要的宽度
    initMarkNameWidth() {
      // 最多只展示三个标记
      this.markList = this.list.length > 3 ? this.list.slice(0, 3) : this.list
      if (this.markList.length === 1) {
        this.markWidth = 200
      } else if (this.markList.length === 2) {
        this.markWidth = 100
      } else if (this.markList.length === 3) {
        this.markWidth = 60
      }
    },
    // 重新获取标记时长，数据兼容处理，标记结束时间减去标记开始时间等于时长，转移成时间格式
    getMarkDuration() {
      this.list.forEach(item => {
        item.duration = getFormatSSS(item.endTime * 1000 - item.startTime * 1000)
      })
    },
    getFormatSSS,
    getColor
  }
}
</script>
<style lang="scss" scoped>
 .mark-content{
    p{
      margin-bottom:4px;
    }
  }
.mark-list-container{
  width: 200px;;
  .mark-name{
    border-radius: 2px;
    font-size:12px;
    line-height: 20px;
    height: 20px;
    padding:0 8px;
    margin-right:8px;
    color:#333333;
     &:last-child{
      margin-right:0;
    }
  }
}
</style>
