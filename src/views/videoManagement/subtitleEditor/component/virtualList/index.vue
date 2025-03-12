<template>
  <div id="subtitle" ref="list" :style="{height}" class="infinite-list-container" @scroll="scrollEvent($event)">
    <div ref="phantom" class="infinite-list-phantom" style="border: 1px solid red;" />
    <div ref="content" class="infinite-list">
      <div v-for="(item) in visibleData" :id="item._index" ref="items" :key="item._index" :class="{currentMyPlayer: current === Number(item._index.split('_')[1]),'infinite-checked':item.item.checked === 1,'isSame':item.item.isSame}" class="infinite-list-item" @mouseup.stop="handleMouseSelect($event, item)" @mousedown="mouseDownFunction($event, item)" @mouseover="handleMuseOver($event,item)">
        <slot ref="slot" :item="item.item" :index="Number(item._index.split('_')[1])" />
      </div>
    </div>
    <!-- <div v-if="isCheckedNow" class="comment-position-abs"> -->
    <div v-if="isCheckedNow && type!==2" id="isCheckedBlock" ref="isCheckedBlock" class="comment-block-btnlist" subtitle-v-step="2">
      <div class="group-list flex flex-column">
        <template v-if="showMute && isCheckedNow">
          <!-- <span class="mySpan" @click="partSetDesensitization(2)">脱敏</span> -->
          <span class="mySpan hotMark flex" @mouseenter="()=>{(showDesFlag = true,showTagFlag=false)}" @mouseleave="()=>{(showDesFlag = false)}" @click.stop>
            <span style="width: 100%;" class="flex flex-middle flex-between"><span>脱敏</span> <i
              class="el-icon-arrow-right el-icon--right"
            /></span>
            <div v-if="showDesFlag" class="myHotMarkList overflowOuto flex flex-column" :style="selectTop?'top:-138px':''">
              <span v-for="(item,index) in sensitiveMark" :key="index" class="mySpan2 flex flex-middle" @click.stop="partSetDesensitization(2,item)">
                <span class="myHotTag" :style="`background:${getPrColor(item.color)}`" />
                <span style="flex:1" class="word_break">{{ item.name }}</span>
              </span>
            </div>
          </span>
          <span class="mySpan" @click="partSetDesensitization(1)">消音</span>
          <span v-if="showCancelDesensitization" class="mySpan" @click="setDesensitization(false,item)">取消</span>
          <span class="mySpan" @click="partCopy">复制</span>
        </template>
        <template v-if="!showMute && isCheckedNow">
          <span v-if="showDesensitization && !showMute" class="mySpan hotMark flex" @mouseenter="()=>{(showDesFlag = true,showTagFlag=false)}" @mouseleave="()=>{(showDesFlag = false)}" @click.stop>
            <span style="width: 100%;" class="flex flex-middle flex-between"><span>脱敏</span> <i
              class="el-icon-arrow-right el-icon--right"
            /></span>
            <div v-if="showDesFlag" class="myHotMarkList overflowOuto flex flex-column" :style="selectTop?'top:-138px':''">
              <span v-for="(item,index) in sensitiveMark" :key="index" class="mySpan2 flex flex-middle" @click.stop="setDesensitization(true,item)">
                <span class="myHotTag" :style="`background:${getPrColor(item.color)}`" />
                <span style="flex:1" class="word_break">{{ item.name }}</span>
              </span>
            </div>
          </span>
          <span v-if="showCancelDesensitization && !showMute" class="mySpan" @click="setDesensitization(false)">取消</span>
          <span v-if="!isOld" class="mySpan" @click.stop="partSetDesensitization(1)">消音</span>
          <span v-if="!showMute" class="mySpan hotMark flex">
            <span style="width: 100%;" class="flex flex-middle flex-between" @click.stop="handleClickHot"><span>爆款标记</span> <i
              class="el-icon-arrow-right el-icon--right"
            /></span>
            <div v-if="showTagFlag" class="myHotMarkList overflowOuto flex flex-column" :style="selectTop?'top:-138px':''">
              <span v-for="(item,index) in tagList" :key="index" class="mySpan2 flex flex-middle" @click.stop="showHotsMark(item)">
                <span class="myHotTag" :style="`background:${getPrColor(item.color)}`" />
                <span style="flex:1" class="word_break">{{ item.name }}</span>
              </span>
            </div>
          </span>
          <span v-clipboard:copy="allContentStr" v-clipboard:success="clipboardSuccess" class="mySpan" @click.stop>复制字幕</span>
        </template>
      </div>
    </div>
    <div v-if="isHotsMark" ref="isCheckedBlock" v-loading="commentLoading" class="comment-block" subtitle-v-step="3" @click.stop>
      <el-input
        v-model="commentData"
        v-loading="hotMarkInfo.timer"
        type="textarea"
        :rows="3"
        show-word-limit
        placeholder="请输入标记内容或唤醒AI帮写"
      />
      <div class="action-block flex flex-between">
        <div><img class="pointer" src="@/assets/image/aiIcon.gif" alt="" @click="aiHotMaskFn" /></div>
        <div>
          <el-button type="" size="mini" @click="cancelComment">取消</el-button>
          <el-button type="primary" size="mini" @click="addComment">确认</el-button>
        </div>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import { addHotMark, renewStatus, hotMarkApi, batchAddHotMark, getHotMarkGenerateResultApi } from '@/api/videoManagement/subtitleEditor'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
import { getSelectedText, getSelectedTextPosition } from '@/utils/index'
export default {
  name: 'VirtualList',
  directives: {
    clipboard
  },
  props: {
    // 所有列表数据
    listData: {
      type: Array,
      default: () => []
    },
    // 爆款标签类型列表
    tagList: {
      type: Array,
      default: () => []
    },
    // 脱敏标记列表
    sensitiveMark: {
      type: Array,
      default: () => []
    },
    multipleSelection: {
      type: Array,
      default: () => []
    },
    isOld: {
      type: Boolean,
      default: false
    },
    // 是否脱敏的列表
    isDesensitized: {
      type: Array,
      default: () => []
    },
    // 预估高度
    estimatedItemSize: {
      type: Number,
      required: true
    },
    // 缓冲区比例
    bufferScale: {
      type: Number,
      default: 1
    },
    id: {
      type: String,
      default: ''
    },
    // 容器高度 100px or 50vh
    height: {
      type: String,
      default: '100%'
    },
    // 当前选中的第几个
    current: {
      type: [String, Number],
      default: 0
    },
    // 单机位多机位
    type: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      // 比较内容弹窗 loading
      commentLoading: false,

      // 可视区域高度
      screenHeight: 0,
      // 起始索引
      start: 0,
      // 结束索引
      end: 0,
      // 偏移量
      startOffset: 0,
      showDesensitization: false, // 脱敏按钮
      showCancelDesensitization: false, // 取消脱敏按钮
      hotsType: 1, // 1点击展示的热点 2拖拽展示的热点  数据埋点需要用到
      timer: null,
      ifScroll: false, // 给滚动加个锁
      endTop: 0,
      startTop: 0,
      step: 0,
      showMute: true,
      isAllSelect: false,
      selectPosition: null,
      selectList: [],
      sortedArr: [],
      downScrollObj: {
        screenX: 0,
        screenY: 0,
        index: 0,
        startNum: 0,
        endNum: 0,
        oldItem: {},
        newItem: {},
        upToDown: true
      },
      wordsRenew: {
        dataType: 1, // 1逐字，2整行
        desensitizeIndex: '', // '1,20'表示从第一个字到第二十个文字
        desensitizeType: 1, // 1自动脱敏，2手动脱敏
        editingType: 1, // 1消音，2剪辑
        id: 0, // 字幕id
        videoId: 0, // 视频id
        isDesensitized: 0// 是否脱敏 0-否 1-是
      },
      allContentStr: '',
      optList: [],
      commentData: '',
      isCheckedNow: false,
      selectTop: false,
      isMouseSelect: false,
      hotMarkTypeId: '',
      copyText: '',
      showTagFlag: false,
      showDesFlag: false,
      isHotsMark: false,
      //  爆款标记 ai总结
      hotMarkInfo: {
        timer: null,
        status: 0
      },
      container: null,
      isClicked: false
    }
  },
  computed: {
    _listData() {
      return this.listData.map((item, index) => {
        return {
          _index: `_${index}`,
          item
        }
      })
    },
    visibleCount() {
      return Math.ceil(this.screenHeight / this.estimatedItemSize)
    },
    aboveCount() {
      return Math.min(this.start, this.bufferScale * this.visibleCount)
    },
    belowCount() {
      return Math.min(this.listData.length - this.end, this.bufferScale * this.visibleCount)
    },
    visibleData() {
      const start = this.start - this.aboveCount
      const end = this.end + this.belowCount
      return this._listData.slice(start, end)
    }
  },
  watch: {
    listData: {
      handler() {
        this.initPositions()
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    window.vm = this
  },
  mounted() {
    // 添加全局点击事件监听器
    document.addEventListener('click', this.handleGlobalClick)
    this.screenHeight = this.$el.clientHeight
    this.start = 0
    this.end = this.start + this.visibleCount
  },
  beforeDestroy() {
    // 移除全局点击事件监听器
    document.removeEventListener('click', this.handleGlobalClick)
    this.hotMarkInfo.timer = null
  },
  updated() {
    this.$nextTick(function () {
      if (!this.$refs.items || !this.$refs.items.length) {
        return
      }
      // 获取真实元素大小，修改对应的尺寸缓存
      this.updateItemsSize()
      // 更新列表总高度
      const height = this.positions[this.positions.length - 1].bottom
      this.$refs.phantom.style.height = height + 'px'
      // 更新真实偏移量
      this.setStartOffset()
    })
  },
  methods: {
    handleGlobalClick(e) {
      console.log(e, '全局点击事件')
      if (!e) {
        return
      }
      const isM = document.getElementById('isCheckedBlock')?.contains(e.target)
      this.isCheckedNow = isM
      this.showTagFlag = this.isCheckedNow
      // this.showDesFlag = this.isCheckedNow
      if (document.getElementById('isCheckedBlock') !== null) {
        console.log('触发了这里')
        this.cancelComment()
      }
    },
    handleClickHot() {
      setTimeout(() => {
        this.showTagFlag = !this.showTagFlag
        this.showDesFlag = false
      }, 0)
    },
    // 消音
    setMute() {
      this.isCheckedNow = false
      this.showTagFlag = false
      this.showDesFlag = false
      this.clearVisibleCheckedArray()
    },
    async partSetDesensitization(type, data) {
      const arr = this.selectList.map((item) => {
        return {
          dataType: (this.isAllSelect || this.selectList.length > 1) ? 2 : 1,
          desensitizeIndex: (this.selectList.length > 1 || this.isAllSelect) ? '' : `${this.selectPosition.start},${this.selectPosition.end}`,
          desensitizeType: 2,
          editingType: type,
          id: item.id,
          sensitiveMarkTypeId: data?.id || '',
          videoId: this.id,
          isDesensitized: 1
        }
      })
      const res = await renewStatus(arr)
      if (res.code === 1) {
        this.$message({
          message: `${type === 1 ? '消音' : '脱敏'}成功！`,
          type: 'success',
          duration: 1500
        })
        this.isCheckedNow = false
        this.showTagFlag = false
        this.showDesFlag = false
        this.selectPosition = null
        this.clearVisibleCheckedArray()
        this.$emit('changeCheckFlag', this.isCheckedNow)
        this.$emit('loadZmData')
      }
    },
    partCopy() {
      if (this.copyText) {
        var input = document.createElement('input')
        input.value = this.copyText
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
      this.isCheckedNow = false
      this.showTagFlag = false
      this.showDesFlag = false
      this.clearVisibleCheckedArray()
    },
    // 复制字幕
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
      this.isCheckedNow = false
      this.showMute = true
      this.showTagFlag = false
      this.showDesFlag = false
      this.clearVisibleCheckedArray()
    },
    // 展示之前的爆款标记弹窗
    showHotsMark(item) {
      console.log('添加爆款标记', item)
      this.isCheckedNow = false
      this.showMute = true
      this.showTagFlag = false
      this.showDesFlag = false
      this.hotMarkTypeId = item.id
      this.isHotsMark = true
    },
    initPositions() {
      this.positions = this.listData.map((d, index) => ({
        index,
        height: this.estimatedItemSize,
        top: index * this.estimatedItemSize,
        bottom: (index + 1) * this.estimatedItemSize
      })
      )
    },
    mouseDownFunction(e, item) {
      console.log('鼠标按下', this.isCheckedNow)
      if (this.isCheckedNow) {
        return
      }
      // 松开后默认可以选中
      document.querySelectorAll('.disableSelection').forEach((item) => {
        item.style.userSelect = 'auto'
      })
      document.querySelectorAll('.new_text_value').forEach((item) => {
        item.style.userSelect = 'auto'
        item.style.zIndex = '1000'
      })
      document.querySelectorAll('.text_value_render').forEach((item) => {
        item.style.userSelect = 'auto'
        item.style.pointerEvents = 'none'
      })
      this.showMute = true
      if (this.multipleSelection?.length > 0) {
        this.downScrollObj.screenX = e.screenX
        this.downScrollObj.screenY = e.screenY
        return
      }
      this.downScrollObj.screenX = e.screenX
      this.downScrollObj.screenY = e.screenY
      this.downScrollObj.index = parseInt(item._index.replace('_', ''))
      this.downScrollObj.oldItem = item
      this.isClicked = true
      const sNumbers = parseInt(item._index.replace('_', ''))
      console.log(sNumbers)
      this.$nextTick(() => {
        this.$set(this.listData[sNumbers], 'checked', 1)
      })
      this.$forceUpdate()
    },
    handleMuseOver(e, item) {
      if (this.isCheckedNow) {
        return
      }
      if (this.multipleSelection?.length > 0) {
        return
      }
      if (this.isClicked) {
        this.downScrollObj.newItem = item
        this.selectTop = false
        this.clearVisibleCheckedArray()
        const sNumbers = parseInt(item._index.replace('_', ''))
        let start = 0
        let end = 0
        if (sNumbers < this.downScrollObj.index) {
          start = sNumbers
          end = this.downScrollObj.index
          this.downScrollObj.upToDown = false
        } else {
          start = this.downScrollObj.index
          end = sNumbers
          this.downScrollObj.upToDown = true
        }
        this.downScrollObj.startNum = start
        this.downScrollObj.endNum = end
        // 如果选中超过了两行把class：disableSelection的元素禁用选中
        if (start < end) {
          for (let i = start; i <= end; i++) {
            this.$nextTick(() => {
              this.$set(this.listData[i], 'checked', 1)
            })
          }
          document.querySelectorAll('.disableSelection,.text_value_render,.new_text_value').forEach((item) => {
            // item.className.match(/new_text_value/) && (item.style.zIndex = '3')
            item.style.userSelect = 'none'
          })
          this.showMute = false
          // clearSelectedText()
        } else {
          document.querySelectorAll('.text_value_render').forEach((item) => {
            // item.className.match(/new_text_value/) && (item.style.zIndex = '1000')
            item.style.userSelect = 'none'
          })
          document.querySelectorAll('.disableSelection,.new_text_value').forEach((item) => {
            // item.className.match(/new_text_value/) && (item.style.zIndex = '1000')
            item.style.userSelect = 'auto'
          })
        }
        this.$forceUpdate()

        if (e.clientY <= 179) {
          this.$refs.list.scrollTop = this.$refs.list.scrollTop - 50 > 0 ? this.$refs.list.scrollTop - 50 : 0
        }
        if (e.clientY >= 750) {
          this.selectTop = true
        }
        if (e.clientY >= 850) {
          this.$refs.list.scrollTop = this.$refs.list.scrollTop + 50 > this.positions[this.positions.length - 1].bottom ? this.positions[this.positions.length - 1].bottom : this.$refs.list.scrollTop + 50
        }
      }
    },
    handleMouseSelect(e, item) {
      console.log(item, '鼠标选中')
      e.stopPropagation()
      if (this.isCheckedNow || this.isHotsMark) {
        return
      }
      document.querySelectorAll('.new_text_value').forEach((item) => {
        item.className.match(/new_text_value/) && (item.style.zIndex = '3')
      })
      document.querySelectorAll('.text_value_render').forEach((item) => {
        // item.style.userSelect = 'auto'
        item.style.pointerEvents = 'auto'
      })
      this.isClicked = false
      this.commentData = ''
      this.downScrollObj.newItem = item
      const xNums = Math.abs(e.screenX - this.downScrollObj.screenX)
      const yNums = Math.abs(e.screenY - this.downScrollObj.screenY)
      console.log(xNums, yNums, '鼠标松开')
      if (xNums >= 12 || yNums > 50) {
        this.$emit('toStopVideo')
        if (this.multipleSelection?.length > 0) {
          this.$message.error('您已选中了字幕，请点击上方爆款标记按钮执行爆款标记操作！')
          return
        }
        this.clearVisibleCheckedArray()
        const { start, end } = this.calculateSelectionRange(item)
        console.log(start, end, 'start, end')
        const selectList = this.updateSelectedData(start, end)
        this.updateStatus(selectList, e)
      } else {
        this.clearVisibleCheckedArray()
        console.log('到了这里', this.isClicked, this.isCheckedNow)
      }
    },

    calculateSelectionRange(item) {
      const sNumbers = parseInt(item._index.replace('_', ''))
      let start = 0
      let end = 0
      if (sNumbers < this.downScrollObj.index) {
        start = sNumbers
        end = this.downScrollObj.index
        this.downScrollObj.upToDown = false
      } else {
        start = this.downScrollObj.index
        end = sNumbers
        this.downScrollObj.upToDown = true
      }
      this.downScrollObj.startNum = start
      this.downScrollObj.endNum = end
      return { start, end }
    },

    updateSelectedData(start, end) {
      const selectList = []
      // 选中了两行以上
      if (start < end) {
        for (let i = start; i <= end; i++) {
          selectList.push(this.listData[i])
          this.$nextTick(() => {
            this.$set(this.listData[i], 'checked', 1)
          })
        }
      } else {
        for (let i = start; i <= end; i++) {
          selectList.push(this.listData[i])
        }
      }
      this.allContentStr = selectList.map(item => item.originalContent).join('')
      return selectList
    },
    // start 文本的开始位置 防止重复文本 end 文本最后选中的位置  可能end>start
    getTextPosition(start, end, selectText) {
      const selectStart = start > end ? end : start
      const selectEnd = selectStart + selectText.length - 1
      return {
        start: selectStart,
        end: selectEnd
      }
    },
    updateStatus(selectList, e) {
      console.log(e.target, '获取选中的节点')
      const arr = selectList.filter(item => item.desensitizeType !== 1)
      if (!arr.length) return
      this.optList = arr
      // 如果只选中了一行还需要判断是不是整行都选中了
      if (arr.length === 1) {
        this.isAllSelect = arr[0].originalContent === getSelectedText() || getSelectedText() === ''
        if (this.isAllSelect || !getSelectedText()) {
          this.showMute = false
        } else {
          this.showMute = true
        }
        this.copyText = getSelectedText()
        console.log(getSelectedTextPosition().start, getSelectedTextPosition().end, '选中文字')
        this.selectPosition = this.getTextPosition(getSelectedTextPosition().start, getSelectedTextPosition().end, getSelectedText())
      } else {
        this.isAllSelect = false
      }
      if (arr.length) {
        // arr里面的id是不是全部在isDesensitized里面
        const isAllDesensitized = arr.every(item => { return this.isDesensitized.includes(item.id) })
        const isSomeDesensitized = arr.some(item => { return this.isDesensitized.includes(item.id) })
        if (isSomeDesensitized) {
          this.showCancelDesensitization = true
          this.showDesensitization = true
          if (isAllDesensitized) {
            this.showDesensitization = false
          }
        } else {
          this.showCancelDesensitization = false
          this.showDesensitization = true
        }
      } else {
        this.showCancelDesensitization = false
        this.showDesensitization = false
      }
      this.selectList = selectList
      this.$forceUpdate()
      setTimeout(() => {
        this.isCheckedNow = true
        this.$emit('changeCheckFlag', this.isCheckedNow)
        const w = window.innerWidth
        this.$nextTick(() => {
          this.updateCheckedBlockPosition(e, w)
        })
      })
    },

    updateCheckedBlockPosition(e, w) {
      if (e.clientY > 780) {
        this.$refs.isCheckedBlock.style.top = (e.clientY - 200) + 'px'
      } else {
        this.$refs.isCheckedBlock.style.top = (e.clientY + 20) + 'px'
      }
      if (e.clientX + 500 > w || e.clientX < 500) {
        this.$refs.isCheckedBlock.style.left = ((w - 500) / 2 + 320) + 'px'
      } else {
        this.$refs.isCheckedBlock.style.left = (e.clientX) + 'px'
      }
    },
    // 设置脱敏及取消脱敏
    setDesensitization(flag, item) {
      this.isCheckedNow = false
      this.showMute = true
      this.showTagFlag = false
      this.showDesFlag = false
      console.log(this.optList, item, '设置脱敏')
      this.$emit('changeCheckFlag', this.isCheckedNow)
      this.$emit('setDesensitization', flag, this.optList, item)
      this.$emit('loadZmData')
    },
    compare(property) {
      return function(a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2
      }
    },
    showComment(arr) {
      this.isHotsMark = true
      this.hotsType = 2
      const sortedArr = [...arr].sort(this.compare('_index'))
      const start = sortedArr[0]._index
      const end = sortedArr[sortedArr.length - 1]._index
      this.sortedArr = sortedArr
      sortedArr.forEach(item => {
        this.$set(this.listData[item._index], 'checked', 1)
      })

      this.$forceUpdate()

      this.$nextTick(() => {
        this.updateBlockPosition()
        this.updateDownScrollObj(start, end)
      })
    },

    updateBlockPosition() {
      this.$refs.isCheckedBlock.style.top = '400px'
      this.$refs.isCheckedBlock.style.left = '900px'
    },

    updateDownScrollObj(start, end) {
      this.downScrollObj.index = start
      this.downScrollObj.oldItem.item = this.listData[start]
      this.downScrollObj.newItem.item = this.listData[end]
      this.downScrollObj.upToDown = true
      this.downScrollObj.startNum = start
      this.downScrollObj.endNum = end
    },
    cancelComment() {
      this.isHotsMark = false
      this.hotMarkInfo.timer = null
      this.hotsType = 1
      this.$emit('changeCheckFlag', this.isCheckedNow)
      this.clearVisibleCheckedArray()
    },
    clearVisibleCheckedArray() {
      this.listData.some(item => {
        this.$set(item, 'checked', 0)
      })
    },
    // 添加爆款标记
    addComment() {
      console.log('sssssssss:', this.downScrollObj)
      if (this.commentData === '') {
        this.$message.error('请输入标记描述！')
        return
      }
      if (this.commentData.indexOf('“') >= 0 || this.commentData.indexOf('"') >= 0 || this.commentData.indexOf('\\') >= 0) {
        this.$message.error('标记名称不能包含“”、""、\\')
        return
      }
      const groupArr = []
      if (this.hotsType === 1) {
        this.$uweb && this.$uweb.setAction('Event_Onlinedesensiti_hots')
        this.addHotMark()
      } else {
        this.$uweb && this.$uweb.setAction('Event_Onlinedesensiti_dragHots')
        // 把this.sortedArr里面选中的数据分组，_index不相邻的分为另外一组
        this.sortedArr.forEach((item, index) => {
          if (index === 0) {
            groupArr.push([item])
          } else {
            const lastArr = groupArr[groupArr.length - 1]
            if (lastArr[lastArr.length - 1]._index + 1 === item._index) {
              lastArr.push(item)
            } else {
              groupArr.push([item])
            }
          }
        })
        // 如果只有两个数组且每个里面只有一条数据，则不需要批量打爆款
        if (groupArr.length === 2 && groupArr[0].length === 1 && groupArr[1].length === 1) {
          this.addHotMark()
        } else {
          const batchArr = this.getAddHotMarkParams(groupArr)
          this.batchAddHotMark(batchArr)
        }
      }
    },
    // 批量打爆款
    async batchAddHotMark(arr) {
      this.commentLoading = true
      try {
        const res = await batchAddHotMark(arr)
        if (res.success) {
          this.$message.success('爆款标记添加成功！')
          this.cancelComment()
          this.$emit('loadZmData')
          this.$emit('clearXuanzhong')
        }
      } catch (error) {
        console.log('batchAddHotMark-----error', error)
      }
      this.commentLoading = false
    },
    // 新增爆款
    async addHotMark() {
      let startTime = ''
      let endTime = ''
      let id = ''
      if (this.downScrollObj.upToDown) {
        startTime = this.downScrollObj.oldItem.item.startTime
        endTime = this.downScrollObj.newItem.item.endTime
        id = this.downScrollObj.oldItem.item.id
      } else {
        startTime = this.downScrollObj.newItem.item.startTime
        endTime = this.downScrollObj.oldItem.item.endTime
        id = this.downScrollObj.newItem.item.id
      }
      let contentStr = ''
      const subtitleIdList = []
      for (let i = this.downScrollObj.startNum; i <= this.downScrollObj.endNum; i++) {
        contentStr += this.listData[i].originalContent
        subtitleIdList.push(this.listData[i].id)
      }
      console.log('MMMMMMMMMMDDDDDDDDDDDDDDDDIIIIIIIIIIDDDDDDDD:', id, this.id)
      const params = {
        content: contentStr,
        endTime: endTime / 1000,
        originalVideoId: this.id,
        remarks: this.commentData,
        hotMarkTypeId: this.hotMarkTypeId,
        startTime: startTime / 1000,
        subtitleIdList: subtitleIdList
      }
      this.commentLoading = true
      try {
        const { success } = await addHotMark(params)
        if (success) {
          this.$message.success('爆款标记添加成功！')
          this.cancelComment()
          this.$emit('loadZmData')
          this.$emit('clearXuanzhong')
        }
      } catch (error) {
        console.log('addHotMark--------error', error)
      }
      this.commentLoading = false
    },
    getAddHotMarkParams(groupArr) {
      const params = []
      groupArr.forEach(item => {
        let startTime = ''
        let endTime = ''
        if (this.downScrollObj.upToDown) {
          startTime = item[0].item.startTime
          endTime = item[item.length - 1].item.endTime
        } else {
          startTime = item[item.length - 1].item.startTime
          endTime = item[0].item.endTime
        }
        let contentStr = ''
        const subtitleIdList = []
        item.forEach(subItem => {
          contentStr += subItem.item.originalContent
          if (subItem.item.checked) {
            subtitleIdList.push(subItem.item.id)
          }
        })
        params.push({
          content: contentStr,
          endTime: endTime / 1000,
          originalVideoId: this.id,
          remarks: this.commentData,
          hotMarkTypeId: this.hotMarkTypeId,
          startTime: startTime / 1000,
          subtitleIdList: subtitleIdList
        })
      })
      return params
    },
    // 获取列表起始索引
    getStartIndex(scrollTop = 0) {
      // 二分法查找
      return this.binarySearch(this.positions, scrollTop)
    },
    binarySearch(list, value) {
      let start = 0
      let end = list.length - 1
      let tempIndex = null

      while (start <= end) {
        const midIndex = parseInt((start + end) / 2)
        const midValue = list[midIndex].bottom
        if (midValue === value) {
          return midIndex + 1
        } else if (midValue < value) {
          start = midIndex + 1
        } else if (midValue > value) {
          if (tempIndex === null || tempIndex > midIndex) {
            tempIndex = midIndex
          }
          end = end - 1
        }
      }
      return tempIndex
    },
    // 获取列表项的当前尺寸
    updateItemsSize() {
      const nodes = this.$refs.items
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect()
        const height = rect.height
        const index = +node.id.slice(1)
        const oldHeight = this.positions[index].height
        const dValue = oldHeight - height
        // 存在差值
        if (dValue) {
          this.positions[index].bottom = this.positions[index].bottom - dValue
          this.positions[index].height = height
          for (let k = index + 1; k < this.positions.length; k++) {
            this.positions[k].top = this.positions[k - 1].bottom
            this.positions[k].bottom = this.positions[k].bottom - dValue
          }
        }
      })
    },
    // 获取当前的偏移量
    setStartOffset() {
      let startOffset
      if (this.start >= 1) {
        const size = this.positions[this.start].top - (this.positions[this.start - this.aboveCount] ? this.positions[this.start - this.aboveCount].top : 0)
        startOffset = this.positions[this.start - 1].bottom - size
      } else {
        startOffset = 0
      }
      this.startOffset = startOffset
      this.$refs.content.style.transform = `translate3d(0,${startOffset}px,0)`
    },
    // 滚动事件
    scrollEvent() {
      // 当前滚动位置
      const scrollTop = this.$refs.list.scrollTop
      // 此时的开始索引
      this.start = this.getStartIndex(scrollTop)
      // 此时的结束索引
      this.end = this.start + this.visibleCount
      // 此时的偏移量
      this.setStartOffset()

      if (!this.ifScroll) {
        this.$emit('scrollEvent')
      }
    },
    // 滚动
    scrollTo(index, fn) {
      const el = document.getElementById('subtitle')
      const el2 = document.getElementById(`_${index}`)
      const i = this.visibleData.findIndex(v => v._index === `_${index}`)
      if (!el) {
        return
      }
      if (i < 0 || !this.isInViewPort(el2)) {
        if (this.ifScroll) {
          return
        }
        if (this.timer) {
          this.ifScroll = false
          clearInterval(this.timer)
          this.timer = null
        }
        this.ifScroll = true
        this.endTop = this.positions[index].top - 80
        this.startTop = el.scrollTop
        const time = 10 // 时间(毫秒)
        this.step = (this.endTop - this.startTop) / time // 步进
        const scrollTopDefault = el.scrollTop
        if (this.startTop < this.endTop) {
          clearInterval(this.timer)
          this.timer = setInterval(() => {
            this.startTop = this.startTop + this.step
            el.scrollTop = this.startTop
            if (this.startTop >= this.endTop) {
              el.scrollTop = this.endTop
              this.ifScroll = false
              clearInterval(this.timer)
              if (!this.isInViewPort(el2)) {
                this.scrollTo(index, fn)
              } else {
                this.timer = null
                fn && fn()
              }
            }
            if (el.scrollTop === scrollTopDefault) {
              clearInterval(this.timer)
            }
          }, 10)
        } else {
          clearInterval(this.timer)
          this.timer = setInterval(() => {
            this.startTop = this.startTop + this.step
            el.scrollTop = this.startTop
            if (this.startTop <= this.endTop) {
              el.scrollTop = this.endTop
              this.ifScroll = false
              clearInterval(this.timer)
              if (!this.isInViewPort(el2)) {
                this.scrollTo(index, fn)
              } else {
                this.timer = null
                fn && fn()
              }
            }
          }, 10)
        }
      } else {
        fn && fn()
      }
    },
    // 判断视图是否在可视区域
    isInViewPort(el) {
      if (!el) {
        return false
      }
      const viewHeight = window.innerHeight || document.documentElement.clientHeight
      const { top, bottom } = el.getBoundingClientRect()
      return top >= 147 && bottom <= viewHeight
    },
    clearTime() {
      if (this.timer) {
        this.ifScroll = false
        clearInterval(this.timer)
        this.timer = null
      }
    },
    async aiHotMaskFn() {
      try {
        if (this.hotMarkInfo.timer) return
        this.hotMarkInfo.timer = true
        const { startNum, endNum } = this.downScrollObj
        let hokMarkContent = ''
        for (let i = startNum; i <= endNum; i++) {
          hokMarkContent += this.listData[i].originalContent
        }
        const { data: generationId } = await hotMarkApi({ hokMarkContent })
        await this.getHotMarkGenerateResult(generationId)
      } catch (error) {
        console.log('hokMarkContent--------error', error)
        this.hotMarkInfo.timer = null
      }
    },
    async getHotMarkGenerateResult(generationId) {
      // 弹窗关闭 取消请求
      if (!this.hotMarkInfo.timer) return
      try {
        const { data } = await getHotMarkGenerateResultApi({ generationId })
        const status = data.status // 生成中 GENERATING 生成成功 SUCCESS 生成失败 FAILED
        this.hotMarkInfo.status = status
        if (status === 'GENERATING') {
          setTimeout(() => {
            this.getHotMarkGenerateResult(generationId)
          }, 100)
          return
        }
        if (status === 'SUCCESS') {
          this.commentData = data.result
          this.hotMarkInfo.timer = null
        } else if (status === 'FAILED') {
          this.hotMarkInfo.timer = null
          this.hotMarkInfo.status = 0
          this.$message({
            message: '生成失败',
            type: 'error',
            duration: 1000
          })
        }
        this.hotMarkInfo.timer = null
      } catch (error) {
        console.log('getHotMarkGenerateResultApi-------error', error)
        this.hotMarkInfo.timer = null
      }
    },
    // 指引 所需元素显示方法
    stepCheckedNow(flag) {
      setTimeout(() => {
        this.isCheckedNow = flag
        this.showMute = false
        this.$emit('changeCheckFlag', this.isCheckedNow)
        if (flag) {
          this.$nextTick(() => {
            this.$refs.isCheckedBlock.style.top = flag ? '176px' : undefined
            this.$refs.isCheckedBlock.style.left = flag ? '741px' : undefined
          })
        }
      })
    },
    // 指引 所需元素显示方法
    stepHotsMark(flag) {
      console.log('stepHotsMark------', flag)
      if (!flag) {
        this.cancelComment()
        return
      }
      setTimeout(() => {
        this.isCheckedNow = false
        this.isHotsMark = flag
        this.showMute = false
        this.$emit('changeCheckFlag', this.isCheckedNow)
        this.$nextTick(() => {
          this.$refs.isCheckedBlock.style.top = flag ? '176px' : undefined
          this.$refs.isCheckedBlock.style.left = flag ? '742px' : undefined
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.currentMyPlayer{
  box-shadow: 0px 2px 4px 0px rgba(169,169,169,0.5);
}
.isSame{
  background: #FFFCF7;
}
.pointer{
  cursor: pointer;
}
.hotMark{
  position: relative;
  .myHotTag{
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .myHotMarkList{
    width: 166px;
    max-height: 180px;
    box-sizing: border-box;
    position: absolute;
    right: -166px;
    top: 0px;
    border-radius: 4px;
    background: #FFFFFF;
    box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.2);
    .mySpan2{
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      padding: 10px;
      box-sizing: border-box;
      cursor: pointer;
    }
  }
}
.infinite-list-container {
  overflow: auto;
  position: relative;
  // -webkit-overflow-scrolling: touch;
  // &::-webkit-scrollbar {
  //   width: 10px;
  //   height: 10px;
  //   // display: none;
  //   background-color: transparent;
  // }
  // &::-webkit-scrollbar-thumb {
  //   border-radius: 6px;
  //   background-color: rgba(0, 0, 0, 0.2);
  //   transition: all 0.4s ease;
  // }
  // &::-webkit-scrollbar-track {
  //   background-color: rgba(0, 0, 0, 0.1);
  // }
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
}

.infinite-list-item {
  box-sizing: border-box;
  /* padding-left: 10px; */
  /* padding-right: 10px; */
  /* border-bottom: 1px solid #999; */
  /* height:200px; */
}

.infinite-checked {
  .text {
    .text_value_render {
      background-color: #FFF2E6!important;
    }

  }
}

.comment-block {
  position: fixed;
  width: 370px;
  height: 135px;
  border-radius: 8px;
  padding: 10px;
  padding-left: 0px;
  background: #FFFFFF;
  box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.1), 0px 8px 10px 1px rgba(0,0,0,0.06), 0px 3px 14px 2px rgba(0,0,0,0.05);
  border-radius: 8px;
  border: 1px solid #E4E7ED;
  ::v-deep .el-textarea textarea {
    border: none;
  }
}
.comment-block-btnlist{
  position: fixed;

}
.group-list{
  border-radius: 4px;
  background: #FFFFFF;
  box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.2);
  .mySpan{
    width: 166px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    padding: 10px;
    box-sizing: border-box;
    cursor: pointer;
  }
  span:hover{
    background: #F5F5F5;
  }
}
.action-block {
  width: 100%;
  padding-top: 5px;
  img{
    height: 32px;
    width: 32px;
    box-sizing: content-box
    ;
    padding-left: 10px;
  }
}

.comment-position-abs {
  position: absolute;
  width: 100%;
  height: 100%;

  z-index: 33;
}
</style>
