<template>
  <div class="subtitleDesensitization">
    <div class="title">
      字幕脱敏
    </div>
    <div class="search">
      <!-- <el-checkbox v-model="checked" :indeterminate="isIndeterminate" :disabled="data.length === 0" @change="handleCheckAllChange">全选</el-checkbox>
      <div class="tips">已选：{{ checkNumber }}条</div>
      <el-button :loading="loading" class="btn_primary" style="margin-left: 32px" size="mini" :disabled="!(checked || isIndeterminate)" @click="batchDesensitization(1)">批量脱敏</el-button>
      <el-button :loading="loading" size="mini" :disabled="!(checked || isIndeterminate)" @click="batchDesensitization(0)">批量取消脱敏</el-button> -->
      <div class="inputSearch">
        <span class="positonSearchText">定位</span>
        <positonSearch
          v-model="positionSearch.type"
          class="m-r-23"
          :loading="loading"
          :current.sync="positionSearch.current"
          :total="positionSearch.total"
          @clickNext="positonSearchClickNext"
          @change="positonSearchChange"
        />
        <span class="positonSearchText">关键词</span>
        <searchInput
          ref="searchInput"
          v-model.trim="search.keyWord"
          :loading="loading"
          :current.sync="search.current"
          :total="search.total"
          @keyup.enter.native="submit"
          @clear="clear"
          @change="searchCurrentChange"
        />
      </div>
    </div>

    <div v-if="data.length === 0" id="subtitle" class="subtitle">
      <div class="noData">
        <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
        <div class="m-t-10 noDataText">暂无字幕内容</div>
      </div>
    </div>
    <VirtualList v-else ref="Virtual" v-slot="{item, index}" :list-data="data" :estimated-item-size="50" @scrollEvent="scrollEvent">
      <div class="subtitleListLi" :class="{currentPlayer: current === Number(index),isSensitiveId:sensitiveId === item.id}">
        <span class="time">
          <!-- <el-checkbox :value="multipleSelection.includes(item.id)" @change="(val) => handleCheckChange(val, item, index)"> -->
          <span class="m-l-8 a_link">
            {{ item.startTime | getTime }}-{{ item.endTime | getTime }}
          </span>
          <!-- </el-checkbox> -->
        </span>
        <div class="text" :class="item.isHot === 1?'has-hot-line':''" @click="changeTime(item, index)">
          <span class="text_value" v-html="filtersText(item.originalContent, item)" />
          <!-- <span class="text_value_render" :class="{desensitization: item.isDesensitized === 1}" v-html="filtersText2(item)" /> -->
          <span class="text_value_render" :class="{desensitization: (isDesensitized.includes(item.id)&&item.completedDesensitizationType!==1)}" v-html="filtersText2(item)" />
          <span v-if="item.hotMarkNum" class="text_hot_bj">
            <span v-for="(ele) in item.list" :key="ele.id" class="myHotMark" :style="`background:${getPrColor(filterMarkTypeId(ele.markTypeId).color) || '000'}`" @click.stop="toShowTheCommentData($event,ele)">
              {{ filterMarkTypeId(ele.markTypeId).name }}
            </span>
          </span>
        </div>
        <!-- <span class="action">
          <el-button v-if="isDesensitized.includes(item.id)" :loading="loading" size="small" @click="desensitizationFn(item, 0)">取消</el-button>
          <el-button v-else :loading="loading" size="small" class="btn_primary" @click="desensitizationFn(item, 1)">脱敏</el-button>
        </span> -->
      </div>
    </VirtualList>
    <div v-if="showCommentDataFlag" class="comment-block-d" @click="cancelTheCommentData">
      <div ref="commentDataContent" class="comment-data" @click.stop="function(){ return }">
        <div class="comment-data-line">
          <span class="com-top">
            <em />
            <el-tooltip class="item" effect="dark" placement="top" popper-class="myTool_comment">
              <div slot="content" class="myDataContent">
                <div class="flex flex-between flex-middle myCommentTit">
                  <span style="font-size: 16px;">标记文案</span>
                  <span v-clipboard:copy="nowShowCommentData.content" v-clipboard:success="clipboardSuccess" class="m-l-14 a_link">
                    <i class="el-icon-document-copy a_link " />
                    <span class="copyDescribe">复制</span>
                  </span>
                </div>
                <div class="overflowOuto2 commentDetails">
                  <template v-if="commentDataDetails.length">
                    <div v-for="(item) in commentDataDetails" :key="index+item.videoHotMarkId">
                      {{ item.content }}
                    </div>
                  </template>
                  <template v-else>
                    <div class="noData">
                      {{ nowShowCommentData.content }}
                    </div>
                  </template>
                </div>
              </div>
              <p>{{ nowShowCommentData.content }}</p>
            </el-tooltip>
          </span>
          <div class="com-data-cen">
            <div class="c-d-c-data">
              <span class="c-d-c-span">
                <em>{{ nowShowCommentData.name }}</em>
                <i>{{ nowShowCommentData.createTime }}</i>
              </span>
              <p class="c-d-c-p">{{ nowShowCommentData.remarks }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  productOriginalVideoSubtitleRenewStatus, queryMarkSubtitle
} from '@/api/videoManagement/subtitleEditor'
import VirtualList from './virtualList'
import positonSearch from './positonSearch'
import searchInput from './searchInput'
import { hotMarkTypeList } from '@/api/product/tagManage'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
export default {
  directives: {
    clipboard
  },
  filters: {
    // 毫秒转时:分:秒:毫秒
    getTime(value) {
      const h =
    Math.floor(value / 3600000) >= 10
      ? String(Math.floor(value / 3600000))
      : '0' + Math.floor(value / 3600000)
      const m =
    Math.floor((value / 60000) % 60) >= 10
      ? String(Math.floor((value / 60000) % 60))
      : '0' + Math.floor((value / 60000) % 60)
      const s =
    Math.floor((value / 1000) % 60) >= 10
      ? String(Math.floor((value / 1000) % 60))
      : '0' + Math.floor((value / 1000) % 60)
      return h + ':' + m + ':' + s
    }
  },
  components: {
    VirtualList,
    positonSearch,
    searchInput
  },
  props: {
    currentTime: {
      type: Number,
      default: 0
    },
    data: {
      type: Array,
      default: () => []
    },
    videoId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      showCommentDataFlag: false,
      tagList: [],
      search: {
        keyWord: '',
        current: 0,
        total: 0,
        arr: []
      },
      // 定位筛选
      positionSearch: {
        type: '', // 1: 脱敏字幕 2：敏感词
        current: 0,
        total: 0,
        arr: []
      },
      // 全选标识
      checked: false,
      isIndeterminate: false,
      checkNumber: 0,

      // 当前高亮选项
      current: '',
      z_current: false,
      z_current_index: '',

      // 当前多选的选项的id集合
      multipleSelection: [],
      // 当前脱敏的数据集合
      isDesensitized: [],
      commentDataDetails: [],
      searchKeyword: '',
      sensitiveId: '', // 审批列表进来原文
      loading: false,
      ifScroll: false, // 给滚动加个锁
      endTop: 0,
      startTop: 0,
      step: 0
    }
  },
  watch: {
    currentTime: {
      handler(val) {
        console.log('currentTime', val)
        const time = (val * 1000).toFixed(3)
        if (this.data.length > 0) {
          const index = this.data.findIndex((v, i) => {
            if (i === 0) {
              return this.data.length < 2 ? (time < v.endTime) : (time < this.data[i + 1].startTime)
            } else if (i === this.data.length - 1) {
              return time >= v.startTime
            } else {
              return (time >= v.startTime && time < this.data[i + 1].startTime)
            }
          })
          // console.log('index', index)
          if (index > -1) {
            this.current = index
            if (this.z_current) {
              if (index !== this.z_current_index) {
                this.current = this.z_current_index
                this.z_current = false
              }
            }
            this.scrollTo(index)
          }
        }
      },
      deep: true,
      immediate: true
    },
    'search.current': {
      handler(val, oldVal) {
        this.$nextTick(() => {
          document.getElementById(`search_${oldVal}`) && (document.getElementById(`search_${oldVal}`).style.backgroundColor = '#FFFF05')
          if (document.getElementById(`search_${val}`)) {
            (document.getElementById(`search_${val}`).style.backgroundColor = '#FF9632')
          } else {
            const timer = setInterval(() => {
              if (document.getElementById(`search_${val}`) || val === 0) {
                clearInterval(timer)
              }
              document.getElementById(`search_${val}`) && (document.getElementById(`search_${val}`).style.backgroundColor = '#FF9632')
            }, 100)
          }
          // document.getElementById(`search_${val}`) && (document.getElementById(`search_${val}`).style.backgroundColor = '#FF9632')
        })
      }
    },
    data: {
      handler() {
        this.initIsDesensitized()
      },
      immediate: true,
      deep: true
    },
    'positionSearch.type': {
      handler(val) {
        console.log(val)
        this.positionSearch.current = 0
        this.positionSearch.total = 0
        this.positionSearch.arr = []
        if (val === '') {
          return console.log('清空')
        } else if (val === '1') {
          this.positonDesensitizedSubtitles()
          return console.log('定位脱敏字幕')
        } else if (val === '2') {
          this.positonSensitiveWords()
          return console.log('定位敏感词')
        } else if (val === '3') {
          this.isHotSubtitles()
          return console.log('定位爆款标记')
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getHotMarkTypeList()
  },
  mounted() {},
  methods: {
    async getHotMarkTypeList() {
      const res = await hotMarkTypeList()
      console.log(res, 'res标签类型')
      this.tagList = res.data
    },
    filterMarkTypeId(id) {
      const defArr = this.tagList.filter(item => item.id === '0')
      // 通过传入的id匹配tagList里面的数据
      const arr = this.tagList.filter(item => item.id === id)
      return arr[0] || defArr[0]
    },
    changeScrollTop() {
      // this.$refs.Virtual.scrollTop = 0
      const el = document.getElementById('subtitle')
      el.scrollTop = 0
    },
    changePositonSearch(type) {
      this.$nextTick(() => {
        this.positionSearch.type = String(type)
      })
    },
    // 定位爆款标记
    isHotSubtitles() {
      // isHotArray
      this.loading = true
      console.log(this.isHotArray)
      let sum = 0
      this.positionSearch.arr = []
      this.data.forEach((v, index) => {
        console.log('v:', v)
        if (v.isHot === 1 && v.list?.length > 0) {
          for (var i = 0; i < v.list.length; i++) {
            sum++
            this.positionSearch.arr.push({
              sum: sum,
              startTime: v.startTime,
              index: index
            })
          }
        }
      })
      this.positionSearch.total = sum
      if (sum > 0) {
        this.positionSearch.current = 1
        this.gotoTargetByPositon(1)
      }
      this.loading = false
    },
    // 搜索框回车
    submit() {
      if (this.searchKeyword === this.search.keyWord) {
        return this.$refs.searchInput.clickNext()
      }
      this.loading = true
      this.search.current = 0
      this.searchKeyword = this.search.keyWord
      if (this.search.keyWord) {
        let sum = 0
        this.search.arr = []
        this.data.forEach((element, index) => {
          if (element.originalContent) {
            const str = element.originalContent.replace(new RegExp(this.search.keyWord, 'g'), (m, i) => {
              sum++
              this.search.arr.push({
                sum: sum,
                startTime: element.startTime,
                index: index
              })
              return `<span style="background-color:#FFFF05" id="search_${sum}" data-info="${index}">${this.search.keyWord}</span>`
            })
            element.search_content = str
          }
        })
        this.search.total = sum
        if (sum > 0) {
          this.search.current = 1
          this.gotoTarget(1)
        }
        this.loading = false
      } else {
        this.search.arr = []
        this.search.total = 0
        this.search.current = 0
        this.loading = false
      }
    },
    // 第一层渲染层展示文字背景色
    filtersText(text, item) {
      if (this.searchKeyword === '') {
        return text
      } else {
        if (this.search.current > 0 && item.search_content) {
          return item.search_content
        }
        return text
      }
    },
    // 第二层渲染层展示文字主色与文字标记
    filtersText2(item) {
      if (item.content) {
        return item.content
      }
      return item.originalContent
    },
    // 判断当前播放时间是否在区域内
    renderCurrent(item, index) {
      console.log(item, index)
      const time = this.currentTime * 1000
      if (index === 0) {
        return this.data.length < 2 ? (time < item.endTime) : (time < this.data[index + 1].startTime)
      } else if (index === this.data.length - 1) {
        return time >= item.startTime
      } else {
        return (time >= item.startTime && time < this.data[index + 1].startTime)
      }
    },
    // 点击字幕
    changeTime(item, index) {
      console.log(item, 'item')
      this.current = index
      this.z_current = true
      this.z_current_index = index
      this.$emit('changTime', item.startTime / 1000)
    },
    async toShowTheCommentData(e, item) {
      console.log(item, '当前点击的标签')
      // this.nowShowCommentData = item.list
      const res = await queryMarkSubtitle({ videoHotMarkId: item.markId })
      console.log(res, 'res')
      // 去掉res.data里面的span标签
      res.data.forEach(item => {
        item.content = item.content.replace(/<[^>]+>/g, '')
      })
      this.commentDataDetails = res.data
      this.nowShowCommentData = item
      this.showCommentDataFlag = true
      this.$nextTick(() => {
        const w = window.innerWidth
        const wLength = w - 505
        if (e.clientY > 650) {
          this.$refs.commentDataContent.style.top = (e.clientY - 260) + 'px'
        } else {
          this.$refs.commentDataContent.style.top = (e.clientY + 30) + 'px'
        }
        if ((e.clientX - 505) < (wLength / 2)) {
          this.$refs.commentDataContent.style.left = (e.clientX + 30) + 'px'
        } else {
          this.$refs.commentDataContent.style.left = (e.clientX - 320) + 'px'
        }
      })
    },
    cancelTheCommentData() {
      this.showCommentDataFlag = false
    },
    // 字幕滚动(动画版本)
    scrollView(item) {
      const el = document.getElementById('subtitle')
      const el2 = document.getElementById(`subtitle${item.id}`)
      if (!el || !el2) {
        return
      }
      const setTop = el2.offsetTop - el.scrollTop - 152
      if (setTop > 600 || setTop < 0) {
        if (this.ifScroll) {
          return
        }
        if (this.timer) {
          this.ifScroll = false
          clearInterval(this.timer)
          this.timer = null
        }
        this.ifScroll = true
        this.endTop = el2.offsetTop - 200
        this.startTop = el.scrollTop
        const time = 10 // 时间(毫秒)
        this.step = (this.endTop - this.startTop) / time // 步进
        if (this.startTop < this.endTop) {
          this.timer = setInterval(() => {
            this.startTop = this.startTop + this.step
            el.scrollTop = this.startTop
            if (this.startTop >= this.endTop) {
              el.scrollTop = this.endTop
              this.ifScroll = false
              clearInterval(this.timer)
              this.timer = null
            }
          }, 10)
        } else {
          this.timer = setInterval(() => {
            this.startTop = this.startTop + this.step
            el.scrollTop = this.startTop
            if (this.startTop <= this.endTop) {
              el.scrollTop = this.endTop
              this.ifScroll = false
              clearInterval(this.timer)
              this.timer = null
            }
          }, 10)
        }
      }
    },
    // 跳转到指定的查询条件处
    gotoTarget(index) {
      this.z_current = true
      this.z_current_index = this.search.arr[index - 1].index
      this.$emit('changTime', this.search.arr[index - 1].startTime / 1000)
    },
    // 点击清空筛选项
    clear() {
      this.$emit('changTime', 0)
      this.submit()
    },
    // 筛选栏上一个下一个触发
    searchCurrentChange() {
      this.gotoTarget(this.search.current)
    },
    // 点击全选
    handleCheckAllChange(val) {
      this.isIndeterminate = false
      const multipleSelection = []
      if (val) {
        this.data.forEach(v => {
          multipleSelection.push(v.id)
        })
      }
      this.multipleSelection = multipleSelection
      this.checkNumber = val ? this.data.length : 0
    },
    // 字幕选择状态改变触发
    handleCheckChange(val, item, index) {
      console.log(val, item, index)
      const i = this.multipleSelection.findIndex(v => v === item.id)
      if (i < 0) {
        this.multipleSelection.push(item.id)
      } else {
        this.multipleSelection.splice(i, 1)
      }
      // const arr = this.data.filter(v => v.checked)
      if (this.multipleSelection.length === 0) {
        this.checked = false
        this.isIndeterminate = false
        this.checkNumber = this.multipleSelection.length
        return
      }
      this.checkNumber = this.multipleSelection.length
      this.checked = this.multipleSelection.length === this.data.length
      this.isIndeterminate = this.multipleSelection.length !== this.data.length
    },
    // 批量脱敏
    batchDesensitization(val) {
      this.loading = true
      const arr = []
      this.multipleSelection.forEach(v => {
        arr.push({
          videoId: this.videoId,
          id: v,
          isDesensitized: val
        })
      })
      productOriginalVideoSubtitleRenewStatus(arr).then(res => {
        this.multipleSelection.forEach((item) => {
          const i = this.isDesensitized.findIndex(v => v === item)
          console.log(i)
          if (i > -1) {
            val === 0 && this.isDesensitized.splice(i, 1)
          } else {
            val === 1 && this.isDesensitized.push(item)
          }
        })
        this.loading = false
        this.multipleSelection = []
        this.checked = false
        this.isIndeterminate = false
        this.checkNumber = 0
        this.$emit('changeUpdateTime', res.timestamp)
        console.log(val, this.isDesensitized)
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击脱敏/取消
    desensitizationFn(item, status) {
      this.loading = true
      const data = [
        {
          videoId: this.videoId,
          id: item.id,
          isDesensitized: status
        }
      ]
      productOriginalVideoSubtitleRenewStatus(data).then(res => {
        this.loading = false
        if (status === 1) {
          this.isDesensitized.push(item.id)
        } else {
          const i = this.isDesensitized.findIndex(v => v === item.id)
          i > -1 && (this.isDesensitized.splice(i, 1))
        }
        this.$emit('changeUpdateTime', res.timestamp)
      }).catch(() => {
        this.loading = false
      })
    },

    // 初始化字幕列表
    init() {
      this.search = {
        keyWord: '',
        current: 0,
        total: 0,
        arr: []
      }
      this.positionSearch = {
        type: '', // 1: 脱敏字幕 2：敏感词
        current: 0,
        total: 0,
        arr: []
      }
      this.multipleSelection = []
      this.current = ''
      this.checked = false
      this.isIndeterminate = false
      this.checkNumber = 0
      this.searchKeyword = ''
      this.loading = false
    },
    // 滚动到指定位置
    scrollTo(index, fn = () => {}) {
      this.$refs.Virtual && this.$refs.Virtual.clearTime()
      this.$refs.Virtual && this.$refs.Virtual.scrollTo(index, fn)
    },
    // 初始化脱敏列表数据
    initIsDesensitized() {
      this.isDesensitized = []
      console.log('this.data:::::::::', this.data)
      this.data.map(v => {
        v.isDesensitized === 1 && this.isDesensitized.push(v.id)
      })
      // 路由是否有sensitiveId
      setTimeout(() => {
        if (this.$route.query.sensitiveId) {
          this.sensitiveId = this.$route.query.sensitiveId
          console.log('chufale')
          const index = this.data.findIndex((v, i) => {
            return v.id === this.$route.query.sensitiveId
          })
          this.z_current = true
          this.z_current_index = index
          this.$emit('changTime', this.data[index - 1].startTime / 1000)
        // this.gotoTargetByPositon(index)
        }
      }, 100)
    },
    // 计算生成视频时长
    getCreatTime(muteTime) {
      console.log('计算生成视频时长isDesensitized', this.isDesensitized)
      const sum = this.data.reduce((prev, cur, index, arr) => {
        if (!this.isDesensitized.includes(cur.id)) {
          return prev + (cur.endTime - cur.startTime)
        }
        return prev
      }, muteTime)
      return sum
    },
    // 滚动触发
    scrollEvent() {
      if (this.search.current && this.search.current > 0) {
        // console.log(this.search.current, '滚动触发')
        document.getElementById(`search_${this.search.current}`) && (document.getElementById(`search_${this.search.current}`).style.backgroundColor = '#FF9632')
        // return
      }
    },
    // 定位筛选类型改变触发
    positonSearchChange() {
      // this.gotoTarget(this.search.current)
    },
    // 定位筛选上一个下一个点击触发
    positonSearchClickNext() {
      this.gotoTargetByPositon(this.positionSearch.current)
    },
    // 定位脱敏字幕
    positonDesensitizedSubtitles() {
      this.loading = true
      console.log(this.isDesensitized)
      let sum = 0
      this.positionSearch.arr = []
      this.data.forEach((v, index) => {
        if (this.isDesensitized.includes(v.id)) {
          sum++
          this.positionSearch.arr.push({
            sum: sum,
            startTime: v.startTime,
            index: index
          })
        }
      })
      this.positionSearch.total = sum
      if (sum > 0) {
        this.positionSearch.current = 1
        this.gotoTargetByPositon(1)
      }
      this.loading = false
    },
    // 跳转到指定的查询条件处【定位用】
    gotoTargetByPositon(index) {
      this.z_current = true
      this.z_current_index = this.positionSearch.arr[index - 1].index
      this.$emit('changTime', this.positionSearch.arr[index - 1].startTime / 1000)
    },
    // 定位敏感词
    positonSensitiveWords() {
      this.loading = true
      let sum = 0
      this.positionSearch.arr = []
      this.data.forEach((v, index) => {
        if (v.content.includes('color: red') || v.content.includes('color: #F53F3F')) {
          console.log(index)
          sum++
          this.positionSearch.arr.push({
            sum: sum,
            startTime: v.startTime,
            index: index
          })
        }
      })
      this.positionSearch.total = sum
      if (sum > 0) {
        this.positionSearch.current = 1
        this.gotoTargetByPositon(1)
      }
      this.loading = false
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>
<style>
  .myTool_comment{
    padding: 0;
  }
</style>
<style lang='scss' scoped>
.myDataContent{
  min-width: 280px;
  max-width: 400px;
  max-height: 300px;
  font-size: 14px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 25px;
  padding-bottom: 4px;
  .myCommentTit{
    padding: 8px;
    border-bottom: 1px solid #E7E7E7;
  }
}
.commentDetails{
  max-height: 230px;
  padding:8px 8px 0px 8px;
}
.copyDescribe{
    margin-left: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #0C6FFF;
  }
.subtitleDesensitization {
    position: relative;
    min-width: 1200px;
    height: 100%;
    background-color: #fff;
    border-left: 1px solid #CBCFD3;
    display: flex;
    flex-direction: column;
    .title {
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: 700;
      color: #333333;
      line-height: 24px;
      padding-left: 10px;
      margin-top: 10px;
    }
    .search {
        color: #333333;
        height: 50px;
        line-height: 40px;
        margin-left: 10px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #E7E7E7;
        font-size: 14px;
        .tips {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #777777;
          line-height: 22px;
          margin-left: 16px;
        }
        .inputSearch {
          flex: 1 0 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .positonSearchText {
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #333333;
            line-height: 22px;
            margin-right: 8px;
          }
          .m-r-23 {
            margin-right: 23px;
          }
        }
    }
    .subtitle {
        flex: 1 0 0;
        // padding-left: 10px;
        // padding-right: 10px;
        color: #333333;
        overflow: auto;
        &::-webkit-scrollbar {
          width: 6px;
          height: 10px;
          // display: none;
          background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 6px;
          background-color: rgba(0, 0, 0, 0.2);
          transition: all 0.4s ease;
        }
        &::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.1);
        }
        .subtitleList {
          padding-left: 10px;
          padding-right: 10px;
          .subtitleListLi {
            padding: 8px 0;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #E7E7E7;
            .time {
              width: 157px;
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #6DA8FF;
              line-height: 22px;
              display: flex;
              align-items: center;
            }
            .text {
                margin-left: 8px;
                margin-right: 79px;
                box-sizing: border-box;
                flex: 1 0 0;
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #333333;
                line-height: 22px;
                display: flex;
                align-items: center;
                position: relative;
                cursor: pointer;
                .text_value {
                  max-width: 97%;
                  height: 100%;
                  color: #333;
                  font-size: 14px;
                  font-family: MicrosoftYaHei;
                  line-height: 22px;
                  color: rgba(255, 255, 255, 0);
                  // opacity: 0;
                  // background: red;
                }
                // 嵌套第二层渲染层
                .text_value_render {
                  position: absolute;
                  max-width: 97%;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  color: #333333;
                  background-color: rgba(255, 255, 255, 0);
                  font-size: 14px;
                  font-family: MicrosoftYaHei;
                  line-height: 22px;
                  z-index: 3;
                }
                // 脱敏的样式
                .desensitization {
                  text-decoration:line-through;
                  color: #999999;
                }
            }
            .action {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
        .currentPlayer {
          background-color: #E8F1FF;
        }
        .isSensitiveId{
          background-color: #FFEBD6;
        }
        .noData {
          width: 405px;
          height: 202px;
          margin: 273px auto 0;
          > img {
            width: 100%;
            height: 100%;
          }
          .noDataText {
            font-size: 18px;
            font-family: MicrosoftYaHei;
            color: #919293;
            line-height: 26px;
            text-align: center;
          }
        }
    }
}
.m-l-4 {
  margin-left: 4px;
}
.m-l-8 {
  margin-left: 8px;
}
.subtitleListLi {
  padding: 8px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #E7E7E7;
  margin-right: 10px;
  margin-left: 10px;
  .time {
    width: 157px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #6DA8FF;
    line-height: 22px;
    display: flex;
    align-items: center;
  }
  .text {
    // margin-top: ;
      margin-left: 8px;
      margin-right: 79px;
      box-sizing: border-box;
      flex: 1 0 0;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 22px;
      display: flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      .text_value {
        max-width: 97%;
        height: 100%;
        color: #333;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        line-height: 22px;
        color: rgba(255, 255, 255, 0);
        // opacity: 0;
        // background: red;
      }
      // 嵌套第二层渲染层
      .text_value_render {
        position: absolute;
        max-width: 97%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        color: #333333;
        background-color: rgba(255, 255, 255, 0);
        font-size: 14px;
        font-family: MicrosoftYaHei;
        line-height: 22px;
        z-index: 3;
      }
      // 脱敏的样式
      .desensitization {
        text-decoration:line-through;
        color: #999999;
      }
  }
  .action {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.currentPlayer {
  background-color: #E8F1FF;
}
.isSensitiveId{
  background-color: #FFEBD6;
}
.text_hot_bj {
  float: left;
  margin-left: 10px;
  text-align: center;
  z-index: 33;
  user-select: none;
  .myHotMark{
    border-radius: 2px;
    padding: 2px 4px;
    box-sizing: border-box;
    font-size: 12px;
    font-weight: 400;
    color: #FFFFFF;
    margin-right: 4px;
  }
  em {
    font-size: 8px;
    line-height: 24px;
    color: #FF4747;
    font-weight: 500;
    font-style: normal;
  }
}

.comment-block-d {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 3;
  display: block;
  .comment-data {
    position: fixed;
    width: 320px;
    padding: 10px;
    height: 232px;
    overflow-y: auto;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.1), 0px 8px 10px 1px rgba(0,0,0,0.06), 0px 3px 14px 2px rgba(0,0,0,0.05);
    border: 1px solid #E4E7ED;
    .comment-data-line {
      display: inline-block;
      padding-bottom: 5px;
      margin-bottom: 5px;
      border-bottom: 1px solid #E7E7E7;
      .com-top {
        width: 100%;
        height: 16px;
        display: inline-block;
        cursor: pointer;
        em {
          float: left;
          width: 2px;
          height: 16px;
          background: #0C6FFF;
          border-radius: 1px;
          margin-right: 5px;
        }
        p {
          float: left;
          width: 268px;
          height: 16px;
          line-height: 16px;
          font-size: 12px;
          color: #777;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .com-data-cen {
        width: 100%;
        padding-top: 2px;
        display: inline-block;
        img {
          width: 28px;
          height: 28px;
          float: left;
        }
        .c-d-c-data {
          float: left;
          width: 243px;
          margin-top: -3px;
          .c-d-c-span {
            height: 16px;
            width: 100%;
            display: inline-block;
            line-height: 16px;
            em {
              font-style: normal;
              font-size: 12px;
              color: #333;
            }
            i {
              margin-left: 10px;
              font-style: normal;
              font-size: 12px;
              color: #999;
            }
            b{
              float: right;
              color: #F53F3F;
              font-size: 12px;
              cursor: pointer;
              font-weight: 500;
            }
          }
          .c-d-c-p {
            margin-top: 3px;
            width: 100%;
            line-height: 18px;
            color: #333;
            font-size: 12px;
          }
        }
      }
    }
  }
}
.has-hot-line {
  .text_value {
    background-color: #FEECEC;
  }
}
</style>
