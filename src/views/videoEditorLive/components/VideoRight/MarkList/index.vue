<template>
  <div class="mark-list-container">
    <mark-search class="mark-search" @search="getMarkList" />
    <div v-if="list.length" class="content">
      <mark-item
        v-for="(item,index) in list"
        :key="item.markId"
        :data="item"
        class="mark-item-content"
        :class="activeIndex===index?'active':''"
        @click.native="handleClickItem(item,index)"
      />
    </div>
    <p v-else class="no-result flex justify-center pt-6">暂无内容标记</p>
  </div>
</template>
<script>
import MarkItem from './MarkItem.vue'
import MarkSearch from './MarkSearch.vue'
import { markList } from '../../../api'
import { getColor } from '../../../utils'
export default {
  components: {
    MarkItem,
    MarkSearch
  },
  inject: ['video', 'updateVideoSeekTime', 'updateActiveMarkItemIndex'],
  data() {
    return {
      list: [],
      activeIndex: -1
    }
  },
  computed: {
    getVideoMarkList() {
      return this.video.markList
    },
    getActiveIndex() {
      return this.video.activeMarkItemIndex
    }
  },
  watch: {
    getVideoMarkList: {
      handler(val) {
        this.list = val
      },
      deep: true
    },
    getActiveIndex: {
      handler(val) {
        this.activeIndex = val
        this.domScrollTo()
      }
    }
  },
  mounted() {
    if (Object.keys(this.video.detail).length) {
      // this.getMarkList({})
    }
    this.activeIndex = this.video.activeMarkItemIndex
    this.$nextTick(() => {
      this.domScrollTo()
    })
  },
  methods: {
    handleClickItem(data, index) {
      this.updateVideoSeekTime(data.startTime, '标记跳帧播放。。。。')
      this.updateActiveMarkItemIndex(index)
    },
    domScrollTo() {
      if (this.activeIndex > 0) {
        const dom = document.querySelector('.mark-list-container')
        const itemDom = document.querySelectorAll('.mark-item-content')[this.activeIndex]
        const itemTop = itemDom.offsetTop
        const top = itemTop > dom.clientHeight ? itemTop - 114 : 0
        dom.scrollTo(0, top)
      }
    },
    async getMarkList(data) {
      data.videoId = this.video.detail.id
      const res = await markList(data)
      res.data.forEach(item => {
        item.color = getColor(item.color)
      })
      this.list = res.data
    }

  }

}
</script>
<style lang="scss" scoped>
  .mark-list-container {
    overflow: auto;
    height: calc(100% - 50px);
    .no-result {
      color: #a6a6a6;
      font-size: 12px;
    }
    .mark-item-content{
      height: 90px;
      padding: 10px 24px;
      cursor: pointer;

      &:hover,
      &.active {
        background: #333333;
      }
    }
    .mark-search{
       margin:10px 0;
    }
  }
</style>
