<template>
  <div class="fragment-container video-custom-scroll">
    <div class="check-title">
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        class="head"
        @change="handleChangeAll"
      >{{ videoName }}</el-checkbox>
    </div>
    <div class="check-list ">
      <el-checkbox-group v-model="checkList" @change="handleCheckedItem">
        <div
          v-for="(item, index) in frameList"
          :key="item.label"
          class="flex justify-between items-center check-item"
          :class="{active:index===activePlayingIndex,preview:index===previewPlayIndex}"
        >
          <el-checkbox
            :label="item.label"
          >片段 {{ index + 1 }}  <em class="label-time">{{ item.label }}</em></el-checkbox>
          <mark-list :list="item.markList" />
          <span class="right">
            <em @click="handleClickPreview(item,index)">预览</em>
            <i class="el-icon-arrow-right" />
          </span>
        </div>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
import MarkList from './MarkList.vue'
import { getFormatSSS, formatPrTime, getDurationMS } from '../../utils'
export default {
  components: {
    MarkList
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: ''
    },
    duration: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      frameList: [],
      checkList: [],
      checkAll: false,
      isIndeterminate: false,
      videoName: '',
      activePlayingIndex: -1,
      previewPlayIndex: -1
    }
  },
  watch: {
    list: {
      handler(val) {
        this.initFrameList(val)
      },
      deep: true
    },
    name(val) {
      this.videoName = val
    }
  },
  mounted() {
    const duration = this.$route.query.duration
    const list = []
    list.push({
      label: '0 - ' + getFormatSSS(duration * 1000),
      start: 0,
      end: Number(duration) * 1000
    })
    this.frameList = list
  },
  methods: {
    initFrameList(list) {
      const activeList = this.$route.query.list.split(',')
      this.frameList = list
      activeList.forEach(item => {
        if (item) {
          this.checkList.push(list[item].label)
        }
      })
      setTimeout(() => { this.emitCheckedItem() }, 1000)
    },
    handleChangeAll(val) {
      if (val) {
        const labelList = []
        this.frameList.forEach(item => {
          labelList.push(item.label)
        })
        this.checkList = labelList
      } else {
        this.checkList = []
      }

      this.isIndeterminate = false
      this.emitCheckedItem()
    },
    handleCheckedItem(val) {
      const checkedCount = val.length
      // 如果选中的个数等于总个事表示全部选中
      this.checkAll = checkedCount === this.frameList.length
      // 全选样式判断
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.frameList.length
      const list = []
      val.forEach((item) => {
        const duration = this.getDurationTime(item)
        let index
        let start
        let end
        this.frameList.forEach((_item, _index) => {
          if (item === _item.label) {
            index = _index
            start = _item.start
            end = _item.end
          }
        })
        list.push({ index, item, start, end, duration })
      })
      this.$emit('check', list)
    },
    emitCheckedItem() {
      const list = []
      this.checkList.forEach((item) => {
        const duration = this.getDurationTime(item)
        const arr = item.replaceAll(' ', '').split('-')
        const start = formatPrTime(arr[0]) * 1000
        const end = formatPrTime(arr[1]) * 1000
        let index
        this.frameList.forEach((_item, _index) => {
          if (item === _item.label) {
            index = _index
          }
        })
        list.push({ index, item: item, start, end, duration })
      })
      this.$emit('check', list)
    },
    // 视频预览
    handleClickPreview(data, index) {
      this.previewPlayIndex = index
      data.previewPlayIndex = index
      data.duration = getDurationMS((data.end - data.start))
      this.$emit('preview', data)
    },
    getDurationTime(str) {
      const list = str.replaceAll(' ', '').split('-')
      const t1 = formatPrTime(list[0])
      const t2 = formatPrTime(list[1])
      return getDurationMS((t2 - t1) * 1000)
    },
    updateActiveItem(index) {
      this.activePlayingIndex = index
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep .el-checkbox {
    color: #d9d9d9;
  }
  .fragment-container {
    .check-title{
      margin-left:20px;
    }
    .check-list{
      margin-top:20px;
      padding: 16px 10px;
      border-radius: 8px;
      border: 1px solid #4d4d4d;
      width: 536px;
      overflow: auto;
      height: 410px;
      .check-item{
         margin-bottom:20px;
         height: 28px;
         padding:0 10px;
         font-size:14px;
         .right{
          width:30px;
          text-align:center;
          em{
            cursor: pointer;
            font-style: normal;
            color:#1778FF;
          }
          i{
            font-size:16px;
            margin-top:2px;
            display: none;
          }
         }
        &.preview{
          .right{
            em{
              display: none;
            }
            i{
              display: block;
            }
          }
        }
        &.active,&:hover,&.preview{
          background:#444 ;
          border-radius: 4px;
        }
        &.active{
          i{
            display: block;
          }
        }
      }
    }
    .label-time{
      margin-left:10px;
      font-style: normal;
    }
  }
</style>
