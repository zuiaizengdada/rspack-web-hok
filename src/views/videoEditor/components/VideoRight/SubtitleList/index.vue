<template>
  <div ref="box" class="subtitle-container">
    <subtitle-search ref="search" :index="currentSearchIndex" :total="searchTotal" @search="subtitleSearch" @clear="subtitleSearchClear" @change="subtitleSearchChange" />
    <div class="list-content">
      <subtitle-item v-for="(item) in renderList" :key="item.index" :index="item.index" :data="item" class="subtitle-item " :class="[activeIndex===item.index?'active':'','item'+item.index]" @click.native="handleClickItem(item,$event)" />
    </div>
  </div>
</template>
<script>
import SubtitleItem from './SubtitleItem.vue'
import SubtitleSearch from '../components/SubtitleSearch.vue'
import { subtitleSearchMixin } from '../components/subtitleSearchMixin'
export default {
  components: {
    SubtitleItem,
    SubtitleSearch
  },
  mixins: [subtitleSearchMixin],
  data() {
    return {
      renderList: [],
      scrollTopLastPx: 0
    }
  },
  mounted() {
    this.renderList = this.subtitleList
    setTimeout(() => {
      this.scrollSubtitleList()
    }, 100)
    // 取消动态加载字幕
    // if (this.activeIndex > 50) {
    //   this.dynamicRenderSubtitleList()
    // }
    // this.scrollListener()
  },
  methods: {
    // 字幕滚动区域监听
    scrollListener() {
      const dom = document.querySelector('.subtitle-container .list-content')
      dom.addEventListener('scroll', () => {
        const scrollTop = dom.scrollTop
        if (scrollTop - this.scrollTopLastPx > 10) {
          this.dynamicScrollRenderList()
        }
        this.scrollTopLastPx = scrollTop
      })
    },
    dynamicScrollRenderList() {
      const maxLength = this.subtitleList.length
      const renderListLastItem = this.renderList[this.renderList.length - 1]
      const lastItemIndex = renderListLastItem.index
      if (this.renderList.length < maxLength) {
        this.renderList.push(this.subtitleList[lastItemIndex + 1])
      }
    },
    dynamicRenderSubtitleList() {
      const renderListLastItem = this.renderList[this.renderList.length - 1]
      const lastItemIndex = renderListLastItem.index
      console.log(lastItemIndex, 1111)
      if (this.activeIndex > lastItemIndex) {
        this.renderList = this.subtitleList.slice(this.activeIndex - 20, this.activeIndex + 30)
        setTimeout(() => {
          this.scrollSubtitleList()
        }, 100)
      } else {
        this.scrollSubtitleList()
      }
    },
    scrollSubtitleList() {
      if (this.activeIndex > -1) {
        const dom = document.querySelector('.subtitle-container .list-content')
        const itemDom = document.querySelector('.subtitle-item.item' + this.activeIndex)
        console.log(this.activeIndex, itemDom, 2222)
        const itemTop = itemDom.offsetTop
        const top = itemTop > dom.clientHeight ? itemTop - 240 : 0
        dom.scrollTo(0, top)
      }
    },
    renderSearchSubtitleList() {
      const maxLength = this.subtitleList.length
      if (this.renderList.length !== maxLength) {
        this.renderList = JSON.parse(JSON.stringify(this.subtitleList))
      }
      this.renderSearchResultStyle()
    },
    // 渲染搜索结果高亮样式
    renderSearchResultStyle() {
      const lis = document.querySelectorAll('.videoEditSubtitleItemContent')
      lis.forEach((item, index) => {
        const reg = new RegExp(this.name, 'g')
        const arr = item.innerText.match(reg)
        if (arr) {
          lis[index].innerHTML = item.innerText.replaceAll(this.name, `<span id="textSelect">${this.name}</span>`)
        }
      })

      // 需要增加延时，等待数据结构的复制和dom渲染完后，在dom中取值
      setTimeout(() => {
        // 当前搜索高亮索引选中
        this.keywordSearchSelect()
        // 滚动条同步到索引位置
        this.scrollSubtitleList()
      }, 150)
    }
  }
}
</script>
<style>
#textSelect{
  background: #595014;
  color:#E8D639;
  border-radius: 2px;
}
.textActive{
  background: #1778FF!important;
  color:#fff!important;
}
</style>
<style lang="scss" scoped>
  .subtitle-container {
    height: 100%;
    .list-content{
      overflow: auto;
      height: calc(100% - 90px);
      .subtitle-item{
        padding: 10px 24px 0 24px;
        cursor: pointer;
        &:hover,&.active {
          background: #333333;
        }
      }
    }
  }
</style>
