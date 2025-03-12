
export const subtitleSearchMixin = {
  inject: ['video', 'updateVideoSeekTime', 'updateActiveSubtitleItemIndex'],
  computed: {
    getList() {
      return this.video.subtitleList
    },
    // 当前播放进度对应的字幕索引值
    getActiveIndex() {
      return this.video.activeSubtitleItemIndex
    }
  },
  watch: {
    getList: {
      handler(val) {
        this.subtitleList = val
      },
      deep: true
    },
    getActiveIndex: {
      handler(val) {
        // this.activeIndex = val
        // this.scrollSubtitleList()
        // this.dynamicRenderSubtitleList()
      }
    }
  },
  data() {
    return {
      subtitleList: [], // 字幕原始列表
      activeIndex: -1, // 当前选中的字幕索引值
      searchTotal: 0,
      currentSearchIndex: 0, // 搜索结果的关键字切换的索引值
      clientY: 0,
      searchResultSubtitleList: [], // 搜索结果列表
      name: '' // 搜索关键字
    }
  },
  mounted() {
    this.subtitleList = this.video.subtitleList
    this.activeIndex = this.video.activeSubtitleItemIndex
  },
  methods: {
    subtitleSearch(name, isUp) {
      this.name = name
      this.searchTotal = 0
      this.searchResultSubtitleList = []
      if (!this.name) {
        this.subtitleSearchClear()
        return
      } else {
        // 搜索总数
        this.subtitleList.forEach(item => {
          const reg = new RegExp(this.name, 'g')
          const arr = item.content.match(reg)
          if (arr) {
            arr.forEach((_item, _index) => {
              // _item.sIndex = item.index + _index
              this.searchResultSubtitleList.push(item)

              this.searchTotal++
            })
          }
        })
      }

      if (this.searchTotal > 0) {
      // 搜索结果，上一个事件
        if (isUp) {
          this.currentSearchIndex--
          // 第一个时，循环到最后一个
          if (this.currentSearchIndex === 0) {
            this.currentSearchIndex = this.searchTotal
          }
        } else {
          // 下一个事件，下到最后一个时，循环到第一个
          if (this.currentSearchIndex === this.searchTotal) {
            this.currentSearchIndex = 0
          }
          this.currentSearchIndex++
        }
        const searchResultItem = this.searchResultSubtitleList[this.currentSearchIndex - 1]
        this.activeIndex = searchResultItem.index
        this.renderSearchSubtitleList()
      } else {
        this.subtitleSearchClear()
      }
    },

    keywordSearchSelect() {
      const doms = document.querySelectorAll('#textSelect')
      if (doms.length) {
        doms.forEach((item, index) => {
          doms[index].classList.remove('textActive')
        })
        const n = this.currentSearchIndex - 1
        doms[n].classList.add('textActive')
        // doms[n].click()
      }
    },
    // 清空搜索样式
    subtitleSearchClear() {
      const doms = document.querySelectorAll('#textSelect')
      doms.forEach((item, index) => {
        doms[index].removeAttribute('class')
        doms[index].removeAttribute('id')
      })
      this.searchTotal = 0
      this.currentSearchIndex = 0
      this.searchResultSubtitleList = []
      this.searchResultRenderIndex = 0
      this.activeIndex = -1
    },
    subtitleSearchChange() {
      this.subtitleSearchClear()
    },
    handleClickItem(data, $event) {
      // const time = (Number(data.startTime)) / 1000
      // this.updateVideoSeekTime(time, $event, '字幕跳帧播放。。。。')
      // this.updateActiveSubtitleItemIndex(data.index)
      // this.clientY = $event.clientY
    },
    handleMouseDown(event, item, index) {
      console.log('downindex:', index)
      this.downMouseObject.layerX = event.layerX
      this.downMouseObject.layerY = event.layerY
      this.downFlag = true
      console.log('downmmmmm:')
      console.log(event)
      console.log(item)
    },
    handleMouseUpBlock(event, item, index) {
      if (this.downFlag) {
        this.downFlag = false
        this.upMouseObject.layerX = event.layerX
        this.upMouseObject.layerY = event.layerY
        if (window.getSelection().toString() !== '') {
          this.hightLightFlag = true
          this.$nextTick(() => {
            this.$refs.hightLightActionRef.style.left = (event.layerX > 300 ? event.layerX - 100 : event.layerX - 70) + 'px'
            this.$refs.hightLightActionRef.style.top = (event.layerY - 65) + 'px'
          })

          console.log('upindex:', index)
          console.log('upppppppp:')
          console.log(event)
          console.log(item)
          console.log(window.getSelection().toString())
        } else {
          this.hightLightFlag = false
        }
      }
    },
    handleMouseUp(event, item, index) {
      this.upMouseObject.layerX = event.layerX
      this.upMouseObject.layerY = event.layerY
      this.downFlag = false
      if (window.getSelection().toString() !== '') {
        this.hightLightFlag = true
        this.$nextTick(() => {
          this.$refs.hightLightActionRef.style.left = (event.layerX > 300 ? event.layerX - 100 : event.layerX - 70) + 'px'
          this.$refs.hightLightActionRef.style.top = (event.layerY - 65) + 'px'
        })

        console.log('upindex:', index)
        console.log('upppppppp:')
        console.log(event)
        console.log(item)
        console.log(window.getSelection().toString())
      } else {
        this.hightLightFlag = false
      }
    }
  }
}
