<template>
  <div v-loading="loading" class="page_wrap" :element-loading-text="`已加载${loadingProgress}%`">
    <div class="page_wrap_title">学员互动</div>
    <div class="searchTop">
      <el-input v-model.trim="search.name" size="small" placeholder="请输入您要搜索的关键字" style="width: 250px;" suffix-icon="el-icon-search" clearable @keyup.enter.native="onSearch" @clear="onSearchClear" />
      <el-button :loading="searchLoading" size="small" style="margin-left: 15px" type="primary" @click="onSearch">搜索</el-button>
      <el-button v-if="ifSearch" :disabled="searchCurrentIndex === 0" size="small" class="m-l-10" @click="onHandlePre">上一个</el-button>
      <el-button v-if="ifSearch" :disabled="searchCurrentIndex === searchList.length - 1" size="small" class="m-l-10" @click="onHandleNext">下一个</el-button>
    </div>
    <div class="page_wrap_content">
      <DynamicScroller key="studentInteraction" ref="studentInteraction" :items="interactDetail" :min-item-size="70" class="detailContentDynamicScroller">
        <template v-slot="{item, index, active}">
          <DynamicScrollerItem :item="item" :active="active" :data-index="index">
            <list :key="index" :current-search-id="currentSearchId" :item="item" :current-id="currentId" :play-time="playTime" @onHandleClick="onHandleClick" />
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
  </div>
</template>

<script>
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import list from './list.vue'
// import { chatRecordPage } from '@/api/liveRoom/index.js'
import { getLiveChatRecordPage } from '@/api/liveRoom/kanban.js'
export default {
  components: {
    list,
    DynamicScroller,
    DynamicScrollerItem
  },
  props: {
    playTime: {
      type: Number,
      default: 0
    },
    startTime: {
      type: [String, Number],
      default: ''
    }
  },
  inject: ['getLiveRoomDetail', 'getPlayerStatus'],
  data() {
    return {
      search: {
        name: ''
      },
      interactDetail: [],
      pageIndex: 1,
      pageSize: 300,
      ifNoMore: false,
      loadingProgress: 0,
      keyId: 0,
      currentId: '', // 当前活跃的id
      loading: false,
      searchLoading: false,
      ifActive: true,
      searchList: [], // 搜索查询的结果数组
      searchCurrentIndex: -1,
      currentSearchId: '',
      ifSearch: false
    }
  },
  computed: {},
  watch: {
    loadingProgress: {
      handler(val) {
        this.elementLoadingText = `正在加载：${val}%`
      }
    },
    playTime: {
      handler(val) {
        this.scrollTo(val)
      }
    }
  },
  mounted() {
  },
  methods: {
    init() {
      console.log(this.getLiveRoomDetail(), 'liveRoomDetail再这里')
      this.interactDetail = []
      this.getDetailList()
    },
    onSearchClear() {
      this.searchList = []
      this.searchCurrentIndex = -1
      this.currentSearchId = ''
      this.currentId = ''
      this.ifSearch = false
    },
    onSearch() {
      this.ifSearch = false
      if (this.searchLoading) {
        return
      }
      if (!this.search.name) {
        return this.onSearchClear()
      }
      this.searchLoading = true
      this.searchList = []
      this.searchCurrentIndex = -1
      this.currentSearchId = ''
      this.currentId = ''

      const searchList = []
      this.interactDetail.map(v => {
        if (v.msgBody.length > 0 && v.msgBody[0].msgType === 'TIMTextElem') {
          if (v.msgBody[0].textMsgContent.text.includes(this.search.name)) {
            searchList.push(v)
          }
        }
      })
      this.searchList = searchList
      if (this.searchList.length > 0) {
        this.ifSearch = true
        this.searchLoading = false
        this.onHandleNext()
      } else {
        this.ifSearch = false
        this.searchLoading = false
        this.$message.warning('未检索到数据，请重新输入')
      }
    },
    // 点击上一页
    onHandlePre() {
      if (this.searchLoading) return
      this.searchLoading = true
      this.searchCurrentIndex--
      const currentId = this.searchList[this.searchCurrentIndex].id
      const index = this.interactDetail.findIndex(v => { return v.id === currentId })
      if (index > -1 && this.$refs.studentInteraction) {
        this.$emit('onClickSearch', this.searchList[this.searchCurrentIndex])
        this.currentId = currentId
        this.currentSearchId = currentId
        this.$refs.studentInteraction.scrollToItem(index)
      }
      this.searchLoading = false
    },
    // 点击下一页
    onHandleNext() {
      if (this.searchLoading) return
      this.searchLoading = true
      this.searchCurrentIndex++
      const currentId = this.searchList[this.searchCurrentIndex].id
      const index = this.interactDetail.findIndex(v => { return v.id === currentId })
      if (index > -1 && this.$refs.studentInteraction) {
        this.$emit('onClickSearch', this.searchList[this.searchCurrentIndex])
        this.currentId = currentId
        this.currentSearchId = currentId
        this.$refs.studentInteraction.scrollToItem(index)
      }
      this.searchLoading = false
    },
    getDetailList() {
      const data = {
        liveRoomId: this.$route.params.id,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      this.loading = true
      getLiveChatRecordPage(data).then(res => {
        // const liveRoomDetail = this.getLiveRoomDetail()
        res.data.items.map(v => {
          this.keyId++
          v.id = this.keyId
          // v.time = moment(v.msgTime).diff(this.startTime) > 0 ? moment(v.msgTime).diff(this.startTime) : 0
        })
        const arr = this.interactDetail.concat(res.data.items)
        if (res.data.total && res.data.total > 0) {
          this.loadingProgress = Math.floor(arr.length / res.data.total * 100)
        }
        this.interactDetail = arr
        this.pageIndex++
        if (this.pageIndex <= res.data.totalPages) {
          return this.getDetailList()
        } else {
          console.log('加载完全', this.interactDetail)
          this.loading = false
          this.ifNoMore = true
          this.loadingProgress = 100
        }
      }).catch((err) => {
        console.log(err, 'err')
        this.loading = false
        this.ifNoMore = true
      })
    },
    // 点击触发
    onHandleClick(item) {
      this.currentId = item.id
      this.$emit('onClick', item)

      const index = this.interactDetail.findIndex(v => { return v.id === this.currentId })
      if (index > -1 && this.$refs.studentInteraction) {
        this.$emit('onClickSearch', this.interactDetail[index])
        this.$refs.studentInteraction.scrollToItem(index)
      }
    },
    // 滚动到指定时间的位置;
    scrollTo(time) {
      console.log(time, 'time')
      setTimeout(() => {
        const ifPlay = this.getPlayerStatus()
        console.log(ifPlay, '当前的视频状态ifPlay')
        if (ifPlay === 'play') {
          const index = this.interactDetail.findIndex(v => { return this.getTime(v.time) === this.getTime(time * 1000) })
          if (index > -1 && this.$refs.studentInteraction) {
            this.currentId = ''
            this.$refs.studentInteraction.scrollToItem(index)
          }
          return
        }
      }, 200)
    },
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
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  .page_wrap_title {
      padding-top: 12px;
      padding-left: 15px;
      color: #333;
      font-size: 18px;
      font-weight: bolder;
      text-align: left;
      font-family: "微软雅黑";
  }
  .searchTop {
      padding: 15px;
      border-bottom: 1px solid #eff2f6;
  }
  .page_wrap_content {
    flex: 1 0 0;
    padding: 0 0 0 15px;
    background: #fff;
    position: relative;
    overflow: auto;

    .detailContentDynamicScroller {
      height: 100%;
    }
  }
}
.detailContentDynamicScroller {
  &::-webkit-scrollbar-track {
    background-color: #fff;
  }
}
</style>
