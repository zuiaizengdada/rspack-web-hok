<template>
  <div class="track-mark-container relative">
    <el-tooltip
      v-for="(item, index) in markList"
      :key="item.markId"
    >
      <div slot="content" class="mark-content">
        <p>{{ item.name }}</p>
        <p>{{ getFormatHMS(item.startTime*1000) }}</p>
        <p>持续时间: {{ item.duration }}</p>
        <p>{{ item.notes }}</p>
      </div>
      <div
        class="mark-item absolute"
        :index="activeIndex"
        :class="{'active':activeIndex === index,'move':activeIndex === index&&isMoveLine}"
        :style="{ background: item.color, left: item.left + 'px',width: item.width + 'px'}"
        @dblclick.stop="handleDbClickItem(index)"
        @click.stop="handleClickItem(item,index)"
        @mousedown.stop="mousedownMarkItem(item,index)"
      >
        <span class="line left" :class="{show:(isMoveLine&&!isMoveLineRight)}" @mousedown.stop="mousedownFun(index,false)">
          <i class="hidden" :style="{top:-lineOffsetHeight-32+'px'}">{{ getFormatSSS(currentTime*1000) }}</i>
          <em :style="{borderColor:item.color,height:lineOffsetHeight+'px',top:-lineOffsetHeight+'px'}" />
        </span>
        <p>
          <span class="name">{{ item.name }}</span>
          <span v-if="item.notes" class="notes">{{ item.notes }}</span>
        </p>
        <span class="line right" :class="{show:(isMoveLine&&isMoveLineRight)}" @mousedown.stop="mousedownFun(index,true)">
          <i class="hidden" :style="{top:-lineOffsetHeight-32+'px'}">{{ getFormatSSS(currentTime*1000) }}</i>
          <em :style="{borderColor:item.color,height:lineOffsetHeight+'px',top:-lineOffsetHeight+'px'}" />
        </span>
      </div>
    </el-tooltip>
  </div>
</template>
<script>

import hotkeys from 'hotkeys-js'
import { deleteMark, updateMark, markList } from '../../../api'
import { getFormatSSS, getFormatHMS, getColorValue, getColor } from '../../../utils'
import { mixinMoveMarkLine } from './mixinMoveMarkLine'
import { mixinMoveMarkItem } from './mixinMoveMarkItem'
import { getVideoFrameImage } from './utils'

export default {
  mixins: [mixinMoveMarkLine, mixinMoveMarkItem],
  data() {
    return {
      markList: [], // 标记列表
      activeIndex: -1, // 当前点击的标记索引
      currentTime: '',
      lineOffsetHeight: 0, // 辅助线高度,
      isInit: false
    }
  },
  inject: ['video', 'updateVideoSeekTime', 'updateMarkList', 'updateActiveMarkItemIndex', 'updateActiveRightNavIndex', 'updateVisibleMoveMark'],
  computed: {
    getActiveSliderInfo() {
      return this.video.activeSliderInfo
    },
    getVideoMarkList() {
      return this.video.markList
    },
    getActiveIndex() {
      return this.video.activeMarkItemIndex
    },
    getLayoutMoveData() {
      return this.video.layoutMoveData
    }

  },
  watch: {
    getActiveSliderInfo() {
      this.initList()
    },
    getVideoMarkList() {
      this.initList()
    },
    getActiveIndex(val) {
      this.activeIndex = val
    },
    getLayoutMoveData() {
      this.getLineOffsetTop()
    }
  },
  mounted() {
    // 快捷键，上传当前索引值的标记
    hotkeys('delete', (e) => {
      e.preventDefault()
      this.deleteMarkItem()
    })
    this.$nextTick(() => {
      this.getLineOffsetTop()
    })
  },
  methods: {
    loadMaskData() {
      this.markList.some(item => {
        if (item.pictureUrl === null) {
          this.$nextTick(async () => {
            const url = await getVideoFrameImage(item.startTime * 1000)
            // eslint-disable-next-line require-atomic-updates
            item.pictureUrl = url
            this.updateMarkItem(item)
          })
        }
      })
    },
    // 初始化标记列表
    initList() {
      const list = JSON.parse(JSON.stringify(this.video.markList))
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
      list.forEach(item => {
        const durationTime = item.endTime - item.startTime
        const width = durationTime * currentZoomSectionWidth + 1 // 根据标记的起始点，和当前的速度，算出标记的宽度和起点坐标
        item.left = item.startTime * currentZoomSectionWidth - 2
        item.width = width < 28 ? 28 : width
        item.duration = getFormatSSS(durationTime * 1000)
        item.videoId = this.video.detail.id
      })
      this.markList = list
      if (this.markList.length > 0) {
        const that = this
        setTimeout(function() {
          that.loadMaskData()
        }, 1000)
      }
    },
    // 双击编辑标记
    handleDbClickItem(index) {
      this.$emit('edit', index)
    },
    // 单击标记跳转播放进度
    handleClickItem(item) {
      // 视频管理2.1.1 需求，不需要跳转
      // if (this.activeMoveLineIndex < 0) {
      //   if (!this.isMoveItem) {
      //     this.updateVideoSeekTime(item.startTime, '标记内容点击跳帧播放。。。')
      //   }
      // }
    },
    async updateMarkItem(data) {
      const params = JSON.parse(JSON.stringify(data))
      params.color = getColorValue(params.color)
      await updateMark(params)
      this.getMarkList()
    },
    async deleteMarkItem() {
      if (this.activeIndex > -1) {
        const markId = this.markList[this.activeIndex].markId
        await deleteMark({ markId })
        this.updateActiveMarkItemIndex(-1)
        this.updateActiveRightNavIndex(0)
        this.$message.success('删除成功')
        this.getMarkList()
      }
    },
    async getMarkList() {
      const videoId = this.video.detail.id
      const { data } = await markList({ videoId })
      data.forEach(item => {
        item.color = getColor(item.color)
      })
      this.updateMarkList(data)
    },
    getLineOffsetTop() {
      const $trackMarkContainer = document.querySelector('.track-mark-container')
      const $trackMarkContainerOffseTop = $trackMarkContainer.offsetTop - 34
      this.lineOffsetHeight = $trackMarkContainerOffseTop
    },
    getFormatHMS,
    getFormatSSS
  }
}
</script>
<style lang="scss" scoped>
  .mark-item {
    top: 0;
    font-size: 12px;
    color: #333;
    background: #333333;
    border-radius: 2px;
    line-height: 20px;
    padding: 0 8px;
    border: 1px solid #fff;
    user-select:none;
    box-sizing: border-box;
    // &:hover{
    //   cursor: grab;
    // }
    p{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      //   padding:2px 8px;
      .notes{
          color:#444;
          margin-left:4px;
      }
    }
    &.active{
       z-index: 5;
      span{
        z-index: 100;
        &.line{
            position: absolute;
            top:0;
            width:4px;
            height: 100%;
            background:#fff;
            cursor: ew-resize;
            em{
              display: none;
              position: absolute;
              width:1px;
              border-left:1px dashed;
              border-color:#fff;
              z-index: 20;
            }
            i{
              display: none;
              position: absolute;
              width: 88px;
              height: 28px;
              background: #2F2F2F;
              box-shadow: 0px 4px 6px 0px rgba(0,0,0,0.3);
              border-radius: 4px;
              font-size: 12px;
              color: #D9D9D9;
              line-height: 28px;
              text-align: center;
              font-style: normal;
            }

        }
        &.show{
          em{
            display: block;
          }
          i{
            display: block;
          }
        }
        &.left{
          left:-4px;
          border-radius: 10px 0 0 10px;
          em{
            left:4px;
          }
          i{
            left:0;
          }
        }
        &.right{
          right:-4px;
          border-radius: 0 10px 10px 0;
          em{
            right:4px;
          }
          i{
            left:-88px;
          }
        }
      }
      p{
        position: relative;
        z-index: 100;
      }
    }
  }
  .mark-content{
    p{
      margin-bottom:2px;
      font-size: 12px;
      line-height: 20px;;
      color:#D9D9D9;

      &:last-child{
        margin-bottom:0;
      }
    }
  }
</style>
