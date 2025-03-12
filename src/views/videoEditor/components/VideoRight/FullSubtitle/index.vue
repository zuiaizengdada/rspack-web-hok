<template>
  <div class="full-subtitle-container">
    <subtitle-search ref="search" :index="currentSearchIndex" :total="searchTotal" @search="subtitleSearch" @clear="subtitleSearchClear" @change="subtitleSearchChange">
      <el-select slot="searchRight" v-model="currentOption" class="search-select" size="mini" @change="filterSubtitleList">
        <el-option v-for="item in sectionOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select slot="searchFontsize" v-model="currentFontSize" class="search-select" size="mini" @change="filterFontSize">
        <el-option v-for="item in sectionFontsize" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </subtitle-search>
    <div id="videoEditRightSubtitle" class="subtitle-content">
      <div v-for="(item,index) in dynaRenderList" :key="index" :index="index" class="subtitle-item">
        <p class="time-title">{{ getFormatSSS(Number(item[0].startTime)) }}</p>
        <p class="subtitle-list" :style="{fontSize:currentFontSize+'px'}">
          <span v-for="(_item) in item" :key="_item.startTime" :index="_item.index" :class="[activeIndex===_item.index?'active':'','item'+_item.index]" class="fulltitle-item videoEditSubtitleItemContent" @click="handleClickItem(_item,$event)" v-html="_item.html||_item.content" />
        </p>
      </div>
      <!-- @mousedown="handleMouseDown($event, _item,index)" @mouseup.stop="handleMouseUp($event,_item,index)" @mouseup="handleMouseUpBlock($event,item,index)"
      <div v-if="hightLightFlag" class="hightlig-block" @click="hightLightFlag = false">
        <div ref="hightLightActionRef" class="hight-action-block">
          <span>
            <em class="lightheight-em">高亮</em>
            <img src="../../../icons/gaoliang_hover.png">
          </span>
          <span>
            <em>取消高亮</em>
            <img src="../../../icons/gaoliang.png">
          </span>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
import SubtitleSearch from '../components/SubtitleSearch.vue'
import { subtitleSearchMixin } from '../components/subtitleSearchMixin'
import { sectionOptions, sectionFontsize } from './constant'
import { getFormatSSS } from '../../../utils'
import _ from 'lodash'
export default {
  inject: ['video'],
  components: {
    SubtitleSearch
  },
  mixins: [subtitleSearchMixin],
  data() {
    return {
      sectionOptions, // 段落常量
      sectionFontsize, // 字体常量
      currentOption: 20, // 当前设置的段落数量
      currentFontSize: 14, // 当前设置的字体大小
      renderList: [], // 渲染队列
      dynaRenderList: [], // 动态渲染队列
      downMouseObject: {},
      upMouseObject: {},
      hightLightFlag: false,
      downFlag: false
    }
  },
  mounted() {
    this.initLocalDataSet()
    // 组装分段
    this.filterSubtitleList(this.currentOption)
    // this.scrollListener()
  },
  methods: {
    // 初始化本地设置信息
    initLocalDataSet() {
      const localLayoutMoveDataString = localStorage.getItem('localLayoutMoveDataList')
      const localLayoutMoveDataList = JSON.parse(localLayoutMoveDataString)
      if (localLayoutMoveDataList) {
        const userId = this.$store.state.user.userInfo.userId
        const data = _.find(localLayoutMoveDataList, { userId })
        const { currentFontSize, currentOption } = data
        this.currentFontSize = currentFontSize
        this.currentOption = currentOption
      }
    },
    // 字幕滚动区域监听
    scrollListener() {
      const $dom = document.querySelector('#videoEditRightSubtitle')
      $dom.addEventListener('scroll', () => {
        const scrollTop = $dom.scrollTop
        if (scrollTop - this.scrollTopLastPx > 10) {
          this.dynamicScrollRenderList()
        }
        this.scrollTopLastPx = scrollTop
      })
    },
    // 滚动动态渲染
    dynamicScrollRenderList() {
      const dynaRenderListLength = this.dynaRenderList.length
      const renderListLength = this.renderList.length
      if (dynaRenderListLength < renderListLength) {
        this.dynaRenderList.push(this.renderList[dynaRenderListLength - 1])
      }
    },
    // 动态渲染列表,以选中字幕的索引为中心，取前10个和后20个 组装成新的动态渲染队列
    dynamicRenderSubtitleList() {
      this.renderList.forEach((item, index) => {
        item.forEach((_item, _index) => {
          if (this.activeIndex === _item.index) {
            const start = index - 10 < 0 ? 0 : index - 10
            const _list = this.renderList.slice(start, index + 20)
            this.dynaRenderList = _list
          }
        })
      })
      setTimeout(() => {
        this.scrollSubtitleList()
      }, 100)
    },

    renderSearchSubtitleList() {
      this.dynaRenderList = this.renderList
      this.renderSearchResultStyle()
    },
    // 渲染搜索结果高亮样式
    renderSearchResultStyle() {
      const lis = document.querySelectorAll('.videoEditSubtitleItemContent')
      lis.forEach((item, index) => {
        const reg = new RegExp(this.name, 'g')
        const arr = item.innerText.match(reg)
        if (arr) {
          arr.forEach(() => {
            lis[index].innerHTML = item.innerText.replaceAll(this.name, `<span id="textSelect">${this.name}</span>`)
          })
        }
      })
      // 需要增加延时，等待数据结构的复制和dom渲染完后，在dom中取值
      setTimeout(() => {
        // 当前搜索高亮索引选中
        this.keywordSearchSelect()
        // 滚动条同步到索引位置
        this.scrollSubtitleList()
      }, 150)
    },
    // 滚动条同步到当前选中的字幕索引值位置
    scrollSubtitleList() {
      if (this.activeIndex > -1) {
        const $dom = document.querySelector('.subtitle-content')
        const activeIndexDom = document.querySelector('#videoEditRightSubtitle .item' + this.activeIndex)
        const offsetTop = activeIndexDom.offsetTop
        let top
        if (this.clientY > 0) {
          top = offsetTop - this.clientY + 60
        } else {
          top = offsetTop - 120
        }
        const scrollTop = offsetTop > activeIndexDom.clientHeight ? top : 0
        $dom.scrollTo(0, scrollTop)
        this.clientY = 0
      }
    },

    // 如果有名称搜索，在分段渲染后，自动点击搜索名称
    nameSearchAutoClick() {
      const subList = JSON.parse(JSON.stringify(this.subtitleList))
      if (this.name) {
        const reg = new RegExp(this.name, 'g')
        subList.forEach(item => {
          if (item.content.match(reg)) {
            item.content = `<span id="textSelect">${this.name}</span>`
          }
        })
        setTimeout(() => {
          this.keywordSearchSelect()
          this.scrollSubtitleList()
        }, 50)
      }
    },
    // 段落信息和字体信息以用户id为维度，本地存储
    saveLocalDataByUserId(data) {
      const userId = this.$store.state.user.userInfo.userId
      const localLayoutMoveDataString = localStorage.getItem('localLayoutMoveDataList')
      const localLayoutMoveDataList = JSON.parse(localLayoutMoveDataString)
      if (localLayoutMoveDataList) {
        localLayoutMoveDataList.forEach((item, index) => {
          if (userId === item.userId) {
            localLayoutMoveDataList[index] = { ...item, ...data }
          }
        })
      }
      localStorage.setItem('localLayoutMoveDataList', JSON.stringify(localLayoutMoveDataList))
    },

    // 生成分段渲染的队列
    filterSubtitleList(val) {
      this.renderList = []
      const subList = JSON.parse(JSON.stringify(this.subtitleList))
      if (val > 0) {
        for (let i = 0; i < subList.length; i += val) {
          this.renderList.push(subList.slice(i, i + val))
        }
      } else {
        this.renderList.push(subList)
        // this.dynaRenderList = this.renderList
      }
      this.dynaRenderList = this.renderList
      setTimeout(() => {
        this.scrollSubtitleList()
      }, 100)

      // if (this.activeIndex === -1) {
      //   this.dynaRenderList = this.renderList.slice(0, 30)
      // }
      // this.dynamicRenderSubtitleList()
      // 如果有搜索关键字，需要自动选中当前关键字
      if (this.name) {
        this.renderSearchResultStyle()
        this.nameSearchAutoClick()
      }
      this.saveLocalDataByUserId({ currentOption: val })
    },
    filterFontSize() {
      this.saveLocalDataByUserId({ currentFontSize: this.currentFontSize })
    },
    getFormatSSS
  }
}
</script>
<style lang="scss" scoped>
.full-subtitle-container{
  height: 100%;
  overflow: hidden;
  .subtitle-content{
    padding:5px 18px 5px 18px;
    font-size:12px;
    color:#A6A6A6;
    line-height: 24px;
    overflow-y: scroll;
    height: calc(100% - 90px);
    .subtitle-item{
      padding-bottom:8px;
      border-bottom: 1px solid #4D4D4D;
      &:last-child{
        border-bottom: none;;
      }
      .time-title{
        user-select: none;
        color:#73AEFF;
        padding:8px 0;
        font-size:12px;
        line-height: 20px;
      }
      .subtitle-list{
        user-select: text;
        span{
          cursor: pointer;
          margin-right:8px;
          &.active{
            color:#1778FF;
          }
        }
      }
    }

  }
  .search-select{
    width: 80px;
    border:1px solid #4D4D4D;
    border-radius: 4px;
    margin-left: 10px;
  }
}
::v-deep .el-input--mini .el-input__icon{
  line-height: 24px;
}

.hightlig-block {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  .hight-action-block {
    position: absolute;
    left: 0;
    top: 0;
    width: 160px;
    height: 50px;
    span {
      float: left;
      margin-right: 10px;
      width: 65px;
      height: 50px;
      background: #fff;
      border-radius: 10px;
      text-align: center;
      cursor: pointer;
      em {
        float: left;
        width: 65px;
        height: 20px;
        font-style: normal;
        text-align: center;
      }
      em.lightheight-em {
        color: #6CE4B3;
      }
      img {
        float: left;
        width: 20px;
        height: 20px;
        margin-top: 3px;
        margin-left: 20px;
      }
    }
  }
}
.videoEditSubtitleItemContent {
}
</style>
