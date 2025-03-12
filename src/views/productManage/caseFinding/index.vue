<template>
  <div class="case-finding-container">
    <search-filter ref="search" class="search-filter" @change="searchChangePlatform" @search="caseFindingSearch" />
    <div class="search-content">
      <h4>查询结果</h4>
      <div ref="scroll" class="search-item-list pb-4 flex-wrap justify-between" :class="componentItemType">
        <component
          :is="componentItemType"
          v-for="item in componentItemType === 'NewsItem' ? caseNewsList : caseVideoList"
          :key="item.id"
          :data="item"
          class="item-content"
        />
      </div>
      <div v-show="loading" class="flex justify-center py-4">
        <svg-icon icon-class="loading" class="loadingSvg" />
      </div>
      <div v-show="[...caseNewsList, ...caseVideoList].length < 1 &&!loading" class="no-result flex justify-center py-10">
        <el-image :src="noResultPng" />
      </div>
      <div
        v-show="[...caseNewsList, ...caseVideoList].length > 1 && noMoreData"
        class="flex justify-center py-4"
        style="color: #777"
      >
        已经到底啦，没有更多了
      </div>
    </div>
  </div>
</template>
<script>
import NewsItem from './components/NewsItem.vue'
import VideoItem from './components/VideoItem.vue'
import SearchFilter from './components/SearchFilter'
import { mixinIndex } from './mixins/index'
import { statisticsFindCase } from '@/api/product/case'
import noResultPng from '@/assets/image/zanwusousuoneirong.png'

export default {
  components: {
    NewsItem,
    VideoItem,
    SearchFilter
  },
  mixins: [mixinIndex],
  data() {
    return {
      loading: false,
      caseNewsList: [],
      caseVideoList: [],
      componentItemType: 'NewsItem',
      noResultPng,
      pageScrollHeight: 0,
      params: {},
      noMoreData: false,
      pn: 1
    }
  },

  mounted() {
    this.$nextTick(() => {
      window.addEventListener('scroll', this.handleScroll)
    })
  },
  methods: {
    searchChangePlatform(type) {
      this.componentItemType = type === 1 ? 'NewsItem' : 'VideoItem'
    },
    async caseFindingSearch(data, pn = 1) {
      if (pn < 2) {
        this.pageScrollHeight = 0
        this.baiduPn = 1
      }
      this.pn = pn
      this.params = data
      this.loading = true
      console.log(data, '查询参数。。。。')
      // 1表示资讯类搜索，2表示视频类搜索
      if (data.platformType === 'news') {
        this.caseNewsList = await this.newsListSearch({ ...data })
        this.componentItemType = 'NewsItem'
      } else {
        this.caseVideoList = await this.videoListSearch({ ...data })
        this.componentItemType = 'VideoItem'
      }
      this.loading = false
      const params = JSON.parse(JSON.stringify(data))
      // params.platfromValue = params.platfromValue.join()
      // params.platfromVideoValue = params.platfromVideoValue.join()
      statisticsFindCase(params)
    },
    handleScroll() {
      // const serachHeight = this.$refs.search.clientHeight + 150
      const scrollTop = document.documentElement.scrollTop + 550
      if (!this.loading && scrollTop > document.body.clientHeight) {
        // 滚动条滚动时，距离顶部的距离
        const clientHeight = this.$refs.scroll?.clientHeight // document.documentElement.clientHeight // 可视区的高度
        const isLoadMore = scrollTop > clientHeight && scrollTop > this.pageScrollHeight && !this.noMoreData
        if (isLoadMore) {
          this.pageScrollHeight = scrollTop
          this.pn++
          this.caseFindingSearch(this.params, this.pn)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.case-finding-container {
  background: #fff;
  border-radius: 10px 10px 0px 0px;
  padding: 18px;
  .search-filter {
    border-bottom: 1px solid #e7e7e7;
    margin-bottom: 20px;
  }
  .search-content {
    h4 {
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #333333;
      margin-bottom: 20px;
    }
  }
  .VideoItem {
    display: flex;
  }
  .loadingSvg {
    font-size: 28px;
    animation: mymove 1s infinite;
  }
}
@keyframes mymove {
  100% {
    transform: rotate(360deg);
  }
}
</style>
