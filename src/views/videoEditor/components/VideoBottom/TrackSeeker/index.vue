<template>
  <div ref="seeker" class="seeker-container">
    <div class="head" />
    <div class="tail" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      timer: null // 定时器,
    }
  },
  inject: ['video', 'updateVideoCurrentTime', 'updateVideoSeekTime', 'updateActiveMoveSeeker'],
  computed: {
    getVideoStatus () {
      return this.video.status
    },
    getVideoDetail () {
      return this.video.detail
    },
    getActiveSliderInfo () {
      return this.video.activeSliderInfo
    },
    getSeekTime () {
      return this.video.seekTime
    },
    getVideoSpeed () {
      return this.video.speed
    }

  },
  watch: {
    // 根据播放的状态，切换进度条
    getVideoStatus(val) {
      if (val === 'playing') {
        this.scrollTrackSeeker()
      } else {
        this.pausedTrackSeeker()
      }
    },
    // 刻度表缩放，进度条重置
    getActiveSliderInfo() {
      this.moveTimeSeeker()
      const status = this.video.status
      if (status === 'playing') {
        this.scrollTrackSeeker()
      }
    },
    // 跳帧播放，同步进度条
    getSeekTime: {
      handler(val) {
        this.moveTimeSeeker(val)
      },
      deep: true

    },
    // 播放速率变化，进度条重置
    getVideoSpeed() {
      const status = this.video.status
      if (status === 'playing') {
        this.scrollTrackSeeker()
      }
    },
    getVideoDetail() {
      this.pausedTrackSeeker()
      // this.updateVideoSeekTime(0, '获取详情跳帧。。。')
      this.$refs.seeker.style.transform = `translateX(0px)`
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMove()
    })
  },
  methods: {
    // 初始化，监听鼠标事件
    initMove() {
      let isMove = false // 是否鼠标操作中
      let isMoveComplete = false // 拖动是否完成
      const $tracksBox = document.querySelector('.tracks-box') // 编辑台容器
      const $seekerContainer = document.querySelector('.seeker-container')
      const $contentRight = document.querySelector('.track-wrapper .content-right')
      const isMoveMark = this.video.isMoveMark
      // 鼠标键按下，表示鼠标操作中
      $seekerContainer.addEventListener('mousedown', () => {
        if (!isMoveMark) {
          isMove = true
          isMoveComplete = true
          this.updateActiveMoveSeeker(true)
        }
      })
      // 鼠标移动中
      $tracksBox.addEventListener('mousemove', (e) => {
        if (isMove) {
          console.log('trackSeekerMousemove......')
          console.log(this.video.currentZommEachSectionWidth, 'this.video.currentZommEachSectionWidth')
          const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
          const durationTime = this.video.detail.duration
          const scrollLeft = $tracksBox.scrollLeft
          const clientX = e.clientX
          let moveX = scrollLeft + clientX - 72
          let time = moveX / currentZoomSectionWidth
          const isActiveAbsorb = this.video.isActiveAbsorb
          // 是否开启吸附
          if (isActiveAbsorb) {
            const cutLineList = this.video.cutLineList
            // 当进度条接触到裁剪点左右4个像素时，自动吸附
            for (let i = 1; i < cutLineList.length; i++) {
              const px = Math.abs(cutLineList[i] - moveX)
              if (px < 6) {
                moveX = scrollLeft + cutLineList[i]
                time = moveX / currentZoomSectionWidth
                break
              }
            }
          }
          if (time > durationTime) return false
          this.$refs.seeker.style.transform = `translateX(${moveX}px)`
          this.updateVideoSeekTime(time, '进度条拖放跳帧。。。')
          this.pausedTrackSeeker()
          console.log(moveX, '鼠标移动中。。。')
        }
      })
      $contentRight.addEventListener('mouseup', (e) => {
        isMove = false
        this.updateActiveMoveSeeker(false)
        setTimeout(() => {
          isMoveComplete = false
        }, 200)
      })
      $contentRight.addEventListener('click', (e) => {
        // 不在拖动时，执行点击事件
        const isMoveMark = this.video.isMoveMark
        if (isMoveComplete) return false
        if (isMoveMark) return false
        const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
        const durationTime = this.video.detail.duration
        const maxDurationWidth = durationTime * currentZoomSectionWidth
        const scrollLeft = $tracksBox.scrollLeft
        let moveX = scrollLeft + Math.round((e.clientX - 72) / 10) * 10
        moveX = moveX > maxDurationWidth ? maxDurationWidth : moveX
        console.log(moveX, '移动距离。。')
        this.$refs.seeker.style.transform = `translateX(${moveX}px)`
        const time = (scrollLeft + e.clientX - 72) / currentZoomSectionWidth
        const seekTime = time > durationTime ? durationTime : time
        this.updateVideoSeekTime(seekTime, '进度条拖放跳帧。。。')

        this.pausedTrackSeeker()
      })
    },

    scrollTrackSeeker() {
      this.pausedTrackSeeker()
      const $seeker = document.querySelector('.tracks-box .seeker') // 进度条
      const $tracksBox = document.querySelector('.track-content .tracks-box') // 滚动容器
      const documentWidth = document.documentElement.clientWidth // 当前窗口宽度
      const scrollLeft = $tracksBox.scrollLeft // 当前滚动条滚动的距离
      const currentZoomSectionWidth = this.video.currentZommEachSectionWidth // 当前缩放比例下 1秒钟所代表的像素
      const videoSpeed = this.video.speed // 当前播放器播放速度
      const seekPx = Number((this.video.currentTime * currentZoomSectionWidth).toFixed(3)) // 当前时间所代表的像素
      let i = 1
      let j = 0
      // 定时器，模拟播放器播放，每50ms 执行一次
      this.timer = window.setInterval(() => {
        i++
        const msI = (currentZoomSectionWidth / (100 / videoSpeed)) * i * 5 // 每50ms 下一次 前进的像素
        const seekerLeft = $seeker.getBoundingClientRect().left // 进度条相对于屏幕的像素
        const moveX = seekPx + msI // 每50ms 前进的像素
        const moveTime = moveX / currentZoomSectionWidth // 每50ms 的前进的时间
        this.$refs.seeker.style.transform = `translateX(${moveX}px)`
        // 当滚动条的距离大于一半的屏幕宽度时，需要自动滚动滚动条
        if (seekerLeft > documentWidth * 0.5) {
          if (i > 0) {
            j++
            const msJ = (currentZoomSectionWidth / (100 / videoSpeed)) * j * 5
            $tracksBox.scrollTo(Number((scrollLeft + msJ).toFixed(3)), 0)
          }
        }
        this.updateVideoCurrentTime(moveTime)
      }, 50)
    },
    pausedTrackSeeker() {
      window.clearInterval(this.timer)
      this.timer = null
    },
    moveTimeSeeker(time) {
      this.$nextTick(() => {
        const currentZoomSectionWidth = this.video.currentZommEachSectionWidth
        const seeker = document.querySelector('.seeker-container.seeker')
        const moveSeeker = document.querySelector('.video-bottom-container .tracks-box')
        const pauseTime = time || this.video.currentTime
        const speekPx = pauseTime * currentZoomSectionWidth
        const documentWidth = document.documentElement.clientWidth
        const scrollLeft = moveSeeker.scrollLeft
        this.$refs.seeker.style.transform = `translateX(${speekPx}px)`
        const seekerLeft = seeker.getBoundingClientRect().left
        // 快进时 滚动条大于窗口宽度80% 或者 倒退时出现滚动条并且小于滚动条20%时,偏移滚动条位置
        if (seekerLeft > documentWidth * 0.9) {
          if (seekerLeft > documentWidth) {
            moveSeeker.scrollTo(speekPx - 100, 0)
          } else {
            moveSeeker.scrollTo(scrollLeft + currentZoomSectionWidth, 0)
          }
        } else if (seekerLeft > 0 && seekerLeft < documentWidth * 0.1) {
          moveSeeker.scrollTo(scrollLeft - currentZoomSectionWidth, 0)
        } else if (seekerLeft < 0) {
          moveSeeker.scrollTo(speekPx - 100, 0)
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
  .seeker-container {
    .head {
      width: 6px;
      height: 12px;
      background: #1778ff;
      position: absolute;
      top: 0;
      left: 0;
      &:after {
        content: '';
        position: absolute;
        height: 0;
        width: 0;
        bottom: -2px;
        left: 0;
        border-top: 2px solid #1778ff;
        border-bottom: 0px solid transparent;
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
      }
    }
    .tail {
      position: absolute;
      width: 1px;
      top: 0;
      left: 3px;
      bottom: 0;
      background-color: #1778ff;
      z-index: 2;
    }
  }
</style>
