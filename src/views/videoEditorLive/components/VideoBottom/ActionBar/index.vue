<template>
  <div class="action-bar-container flex items-center justify-between">
    <div class="bar-left flex">
      <div class="icon-list flex">
        <el-tooltip v-for="item in iconList" v-show="!item.display" :key="item.src">
          <div slot="content" class="item-content">
            <p>{{ item.title }}</p>
            <span>{{ item.keybord }}</span>
          </div>
          <img
            :src="item.src"
            alt=""
            :class="{ disable: item.disable }"
            class="cursor-pointer icon"
            @click="handleClickIcon(item)"
          />
        </el-tooltip>
      </div>
      <video-time />
    </div>
    <div class="bar-right flex items-center">
      <!-- <div class="icon-list flex">
        <el-tooltip v-for="item in rightIconList" v-show="item.show" :key="item.src">
          <div slot="content" class="item-content">
            <p>{{ item.title }}</p>
            <span>快捷键 : {{ item.keybord }}</span>
          </div>
          <img
            :src="item.src"
            alt=""
            :class="{ disable: item.disable }"
            class="cursor-pointer icon"
            @click="handleClickRightIcon(item)"
          >
        </el-tooltip>
      </div> -->
      <time-splider />
    </div>
  </div>
</template>
<script>
import hotkeys from 'hotkeys-js'
import TimeSplider from './TimeSplider.vue'
import VideoTime from './VideoTime.vue'
import { iconList, rightIconList, rightIconListActive } from './constants'
import { qryShortcutKey } from '../../../api/keyboard'
import videoExport from '@/views/videoEditor/components/videoExport/index.js'
export default {
  components: {
    TimeSplider,
    VideoTime
  },
  data() {
    return {
      iconList,
      rightIconList: JSON.parse(JSON.stringify(rightIconList))
    }
  },
  inject: ['video', 'updateVideoSeekTime', 'updateActiveAssistLine', 'updateActiveAbsorb', 'updateActiveKeyBoard'],
  computed: {
    getVideoActionList() {
      return this.video.actionList
    },
    getVideoActionNextList() {
      return this.video.actionNextList
    },
    getVideoActiveKeyboardArr() {
      return this.video.keyBoardArr
    },
    getCurrentSelectCutItemList() {
      return this.video.currentSelectCutItemList
    }
  },
  watch: {
    getVideoActionList(val) {
      this.iconList[0].disable = val.length < 1
    },
    getVideoActionNextList(val) {
      this.iconList[1].disable = val.length < 1
    },
    getVideoActiveKeyboardArr(arr) {
      console.log(arr, '快捷键更换2。。。。')
      if (arr.length) {
        this.unbindHotkeys(arr)
        this.initHotKeys()
        // this.updateActiveKeyBoard([])
      }
    },
    getCurrentSelectCutItemList(list) {
      if (list.length > 0) {
        this.iconList[4].disable = false
      } else {
        this.iconList[4].disable = true
      }
      if (list.length === 1) {
        this.iconList[5].disable = false
      } else {
        this.iconList[5].disable = true
      }
    }
  },
  mounted() {
    this.initHotKeys()
    const { title, isActive, src } = rightIconListActive[0]
    this.rightIconList[0].title = title
    this.rightIconList[0].isActive = isActive
    this.rightIconList[0].src = src
  },
  methods: {
    unbindHotkeys(arr) {
      if (arr.length) {
        arr.forEach(item => {
          hotkeys.unbind(item)
        })
      }
    },
    async initHotKeys() {
      const keys = document.querySelectorAll('.bar-left .icon-list img')
      const rightKeys = document.querySelectorAll('.bar-right .icon-list img')
      const zoomKeys = document.querySelectorAll('.time-splider .cursor-pointer')
      const { data } = await qryShortcutKey()
      const { adsorbent, contentMark, preview, trackLarge, trackSmall, videoCut } = data
      // hotkeys.unbind()
      // 打开标记
      if (contentMark) {
        hotkeys(contentMark, (e) => {
          e.preventDefault()
          // !videoExport.getVisible() && keys[2].click()
        })
      }
      // 切割
      if (videoCut) {
        hotkeys(videoCut, (e) => {
          e.preventDefault()
          const palyStatus = this.video.status
          if (palyStatus === 'pause' || !videoExport.getVisible()) {
            keys[3].click()
          }
        })
      }
      // 缩小
      if (trackSmall) {
        hotkeys(trackSmall, (e) => {
          e.preventDefault()
          !videoExport.getVisible() && zoomKeys[0].click()
        })
      }
      // 放大
      if (trackLarge) {
        const zoomOut = trackLarge === '+' ? '=' : trackLarge
        hotkeys(zoomOut, function (e) {
          e.preventDefault()
          !videoExport.getVisible() && zoomKeys[1].click()
        })
      }
      // 预览轴
      if (preview) {
        hotkeys(preview, (e) => {
          e.preventDefault()
          !videoExport.getVisible() && rightKeys[1].click()
        })
      }
      // 起始位置
      // hotkeys('home', (e) => {
      //   e.preventDefault()
      //   !videoExport.getVisible() && this.updateVideoSeekTime(0, '起始位置')
      // })
      // // 结尾位置
      // hotkeys('end', (e) => {
      //   e.preventDefault()
      //   !videoExport.getVisible() && this.updateVideoSeekTime(this.video.data.duration, '结束位置')
      // })
      // 撤销
      hotkeys('ctrl+z', (e) => {
        e.preventDefault()
        !videoExport.getVisible() && keys[0].click()
      })
      // 撤回
      hotkeys('ctrl+shift+z', (e) => {
        e.preventDefault()
        !videoExport.getVisible() && keys[1].click()
      })

      // 自动吸附
      if (adsorbent) {
        hotkeys(adsorbent, (e) => {
          e.preventDefault()
          !videoExport.getVisible() && rightKeys[0].click()
        })
      }

      hotkeys('alt', (e) => {
        !videoExport.getVisible() && e.preventDefault()
      })
      // 快速导出
      // if (exportVideo) {
      //   hotkeys(exportVideo, { keyup: true }, (e) => {
      //     e.preventDefault()
      //     const btn = document.querySelector('#liveVideoExport')
      //     btn.click()
      //   })
      // }
    },

    handleClickIcon(item) {
      if (item.type === 'mark') {
        const btn = document.querySelector('#pause')
        btn.click()
        this.$emit('open')
      }
      if (item.type === 'cut') {
        this.$emit('cut')
      }
      if (item.type === 'next' && !item.disable) {
        this.$emit('next')
      }
      if (item.type === 'prev' && !item.disable) {
        this.$emit('prev')
      }
    },
    // todo 待优化
    handleClickRightIcon(item) {
      if (item.type === 'autoAbsorb') {
        const rightIconListItem = item.isActive ? rightIconList[0] : rightIconListActive[0]
        const { title, src, isActive } = rightIconListItem
        this.rightIconList[0].title = title
        this.rightIconList[0].src = src
        this.rightIconList[0].isActive = isActive
        this.updateActiveAbsorb(isActive)
      } else {
        const rightIconListItem = item.isActive ? rightIconList[1] : rightIconListActive[1]
        const { title, src, isActive } = rightIconListItem
        this.rightIconList[1].title = title
        this.rightIconList[1].src = src
        this.rightIconList[1].isActive = isActive
        this.updateActiveAssistLine(isActive)
      }
    }

  }
}
</script>
<style lang="scss" scoped>
  .item-content {
    font-size: 14px;
    color: #d9d9d9;
    line-height: 22px;
    span {
      color: #999999;
      margin-top: 4px;
    }
  }
  .action-bar-container {
    height: 44px;
    border-bottom: 1px solid #000;
    position: relative;
    .icon-list {
      .icon {
        width: 24px;
        height: 24px;
        margin-left: 24px;
        &.disable {
          opacity: 0.4;
          cursor: default;
        }
      }
    }

  }

</style>
