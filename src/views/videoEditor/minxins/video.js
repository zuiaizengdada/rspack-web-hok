import _ from 'lodash'
import { formatPrTime } from '../utils'
import { ZOOMLIST } from './constants'
import { calculateDisplaySize } from '../components/VideoBottom/TrackVideoFrame/utils.js'
export const videoMixin = {
  data() {
    return {
      video: {
        data: {}, // 播放器信息
        status: 'pause', // 视频播放状态
        currentTime: '', // 当前播放时间
        seekTime: -100, // 播放器跳帧时间
        activeSliderInfo: 1, // 刻度表缩放值
        detail: {}, // 视频信息
        markList: [], // 标记内容列表
        subtitleList: [], // 字幕列表
        actionList: [], // 操作历史动作缓存列表
        actionNextList: [], // 重置操作历史动作缓存列表
        cutLineActiveList: [], // 裁剪块选中列表
        cutLineList: [], // 裁剪点列表
        speed: 1, //  播放器播放速度
        activeMarkItemIndex: -1, // 选中标记内容索引
        activeSubtitleItemIndex: -1, // 选中字幕索引
        activeRightNavIndex: 0, // 右侧布局导航选中索引
        isMoveMark: false, // 标记是否移动
        isMoveSeeker: false, // 是否在拖动进度条
        layoutMoveData: [], // 布局本地缓存列表
        isActiveAbsorb: true, // 是否开启预览轴
        isActiveAssistLine: false, // 是否开启吸附
        assitTrackTime: '', // 预览轴接触对应时间
        currentZoomEachSectionTime: 0, // 当前刻度表缩放比例对应的每节刻度表代表的时间
        currentZommEachSectionWidth: 0, // 当前刻度表缩放比例对应的每节刻度表所代表的的像素
        isVideoScreenPortait: false, // 是否为1080竖屏
        zoomSectionWidth: [], // 刻度表代表的像素集合
        trueWidth: 160, // 真实宽度
        keyBoardArr: [] // 快捷键更新列表
      },
      autoVideoSaveTimer: null
    }
  },
  provide() {
    return {
      video: this.video,
      updateVideoInfo: (data) => this.updateVideoData(data),
      updateVideoDetail: (data) => this.updateVideoDetail(data),
      updateVideoStatus: (type) => this.updateVideoStatus(type),
      updateVideoCurrentTime: (time) => this.updateVideoCurrentTime(time),
      updateVideoSeekTime: (time, source) => this.updateVideoSeekTime(time, source),
      updateActiveSliderInfo: (num) => this.updateActiveSliderInfo(num),
      updateMarkList: (list) => this.updateMarkList(list),
      updateActionList: (list) => this.updateActionList(list),
      updateActionNextList: (list) => this.updateActionNextList(list),
      updateVideoSpeed: (num) => this.updateVideoSpeed(num),
      updateAutoVideoSave: () => this.updateAutoVideoSave(),
      updateActiveMarkItemIndex: (index) => this.updateActiveMarkItemIndex(index),
      updateActiveSubtitleItemIndex: (index) => this.updateActiveSubtitleItemIndex(index),
      updateCutLineActiveList: (list) => this.updateCutLineActiveList(list),
      updateActiveRightNavIndex: (index) => this.updateActiveRightNavIndex(index),
      updateVisibleMoveMark: (isMove) => this.updateVisibleMoveMark(isMove),
      updateLayoutMoveSave: (data) => this.updateLayoutMoveSave(data),
      updateActiveAbsorb: (isActive) => { this.updateActiveAbsorb(isActive) },
      updateActiveAssistLine: (isActive) => { this.updateActiveAssistLine(isActive) },
      updateAssitTrackTime: (time) => { this.updateAssitTrackTime(time) },
      updeateCutLineList: (list) => { this.updeateCutLineList(list) },
      updateActiveMoveSeeker: (isMove) => { this.updateActiveMoveSeeker(isMove) },
      getMarkList: () => { this.getMarkListApi() },
      updateActiveKeyBoard: (arr) => { this.updateActiveKeyBoard(arr) }
    }
  },
  methods: {
    updateVideoData(data) {
      this.video.data = data
    },
    updateVideoDetail(data) {
      this.resetVideoData()
      // 根据视频的分辨率计算出实际的宽度
      const width = calculateDisplaySize(data.width, data.height).width
      this.video.trueWidth = width
      const num = this.video.activeSliderInfo
      this.video.detail = data
      this.video.isVideoScreenPortait = data.width !== 1920
      this.video.currentZoomEachSectionTime = ZOOMLIST[num]
      console.log('当前刻度表缩放比例对应的每节刻度表代表的时间：', this.video.currentZoomEachSectionTime)
      this.video.currentZommEachSectionWidth = this.video.trueWidth / this.video.currentZoomEachSectionTime
      ZOOMLIST.forEach((item, index) => {
        if (index > 0) {
          this.video.zoomSectionWidth.push(width / item)
        }
      })
    },
    resetVideoData() {
      this.video.status = 'pause'
      this.video.currentTime = ''
      this.video.seekTime = 0
      this.video.actionList = []
      this.video.actionNextList = []
      this.video.cutLineActiveList = []
      this.video.cutLineList = []
      this.video.speed = 1
      this.video.activeMarkItemIndex = -1
      this.video.activeSubtitleItemIndex = -1
      this.video.activeRightNavIndex = 0
      this.video.isMoveMark = false
      this.video.isMoveSeeker = false
      this.video.assitTrackTime = ''
      this.video.zoomSectionWidth = []
    },
    updateVideoStatus(type) {
      this.video.status = type
    },
    formartTime(time) {
      return Number(time.toFixed(3))
    },
    updateVideoCurrentTime(t) {
      const time = this.formartTime(t)
      this.video.currentTime = time
      this.updateActiveIndex()
    },

    updateVideoSeekTime(t, source) {
      console.log('跳帧播放来源：', t, source)
      const time = this.formartTime(t)
      this.video.seekTime = time
      this.video.currentTime = time
      this.updateActiveIndex()
    },
    updateActiveSliderInfo(num) {
      this.video.activeSliderInfo = num
      const zoomSectionTime = ZOOMLIST[num]
      const zoomSectionWidth = this.video.trueWidth
      this.video.currentZoomEachSectionTime = zoomSectionTime
      this.video.currentZommEachSectionWidth = zoomSectionWidth / zoomSectionTime
    },
    updateMarkList(list) {
      this.video.markList = list
    },
    getMarkList() {
      this.getMarkListApi()
    },
    updateActionList(list) {
      this.video.actionList = list
    },
    updateActionNextList(list) {
      this.video.actionNextList = list
    },
    updateVideoSpeed(num) {
      this.video.speed = num
    },
    updateActiveMarkItemIndex(index) {
      this.video.activeMarkItemIndex = index
    },
    updateActiveSubtitleItemIndex(index) {
      this.video.activeSubtitleItemIndex = index
    },
    updateCutLineActiveList(list) {
      this.video.detail.cutLineActiveList = list
    },
    updateActiveRightNavIndex(index) {
      this.video.activeRightNavIndex = index
    },
    updateVisibleMoveMark(isMove) {
      this.video.isMoveMark = isMove
    },
    updateActiveAbsorb(isActive) {
      this.video.isActiveAbsorb = isActive
    },
    updateActiveAssistLine(isActive) {
      this.video.isActiveAssistLine = isActive
    },
    updateAssitTrackTime(time) {
      this.video.assitTrackTime = time
      // this.updateActiveIndex()
    },
    updeateCutLineList(list) {
      this.video.cutLineList = list
    },
    updateActiveMoveSeeker(isMove) {
      this.video.isMoveSeeker = isMove
    },
    updateActiveIndex() {
      const time = Number(this.video.currentTime)
      const markList = this.video.markList
      const subtitleList = this.video.subtitleList
      let activeIndex = -1
      this.video.activeSubtitleItemIndex = -1
      subtitleList.forEach((item, index) => {
        const sTime = formatPrTime(item.startTime)
        const eTime = formatPrTime(item.endTime)
        if (time >= sTime && time <= eTime) {
          this.video.activeSubtitleItemIndex = index
        }
      })

      markList.forEach((item, index) => {
        const sTime = Number(item.startTime.toFixed(3))
        const eTime = Number(item.endTime.toFixed(3))
        // 由于时间换算和缩放换算，计算会有误差，表示2个像素误差内
        if (time >= sTime && time <= eTime) {
          activeIndex = index
        }
      })
      this.video.activeMarkItemIndex = activeIndex
    },
    updateLayoutMoveSave(data) {
      // 跟进用户id进行布局拖拽保存
      const userId = this.$store.state.user.userInfo.userId
      const localLayoutMoveDataString = localStorage.getItem('localLayoutMoveDataList')
      let localLayoutMoveDataList = []
      if (localLayoutMoveDataString) {
        localLayoutMoveDataList = JSON.parse(localLayoutMoveDataString)
        const index = _.findIndex(localLayoutMoveDataList, { userId: userId })
        if (index > -1) {
          localLayoutMoveDataList[index] = { ...localLayoutMoveDataList[index], ...data }
        } else {
          localLayoutMoveDataList.push({ userId, ...data })
        }
      } else {
        localLayoutMoveDataList.push({ userId, ...data })
      }
      this.video.layoutMoveData = data
      localStorage.setItem('localLayoutMoveDataList', JSON.stringify(localLayoutMoveDataList))
    },
    updateActiveKeyBoard(arr) {
      this.video.keyBoardArr = arr
    }
  }
}
