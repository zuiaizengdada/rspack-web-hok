<template>
  <div class="pageWrap">
    <div class="titleHeader">
      <MTitle style="width: 100%">
        <span>观看数据</span>
        <el-tooltip class="item" :content="'统计范围为开播时间到直播结束。'" placement="top">
          <img src="@/assets/image/product/icon.png" class="iconText" />
        </el-tooltip>
      </MTitle>
    </div>
    <div class="pageContent">
      <viewData :loading="watchData.loading" class="pageContentView" title="累计观看人数" :data="watchData.viewPeopleNum" />
      <viewData :loading="watchData.loading" class="pageContentView" title="人均观看时长" :data="watchData.avgViewPeopleTime | renderLiveDuration" />
      <viewData :loading="watchData.loading" class="pageContentView" title="最高在线人数" :data="watchData.maxOnlineNum" />
      <viewData :loading="watchData.loading" class="pageContentView" title="累计点赞数" :data="watchData.upvoteNum" />
    </div>
  </div>
</template>

<script>
import viewData from './viewData.vue'
import { dataBoardviewData } from '@/api/liveRoom/kanban.js'
export default {
  filters: {
    renderLiveDuration(val) {
      if (!val || typeof val !== 'number') {
        return '0秒'
      } else {
        const result = parseInt(val / 1000)
        const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
        const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
        const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
        if (h === '00') {
          return m + '分' + s + '秒'
        } else {
          return h + '时' + m + '分'
        }
      }
    }
  },
  components: {
    viewData
  },
  data() {
    return {
      watchData: {
        loading: false,
        avgViewPeopleTime: 0, // 人均观看时长
        maxOnlineNum: 0, // 最高在线人数
        viewPeopleNum: 0, // 观看人数
        upvoteNum: 0 // 累计点赞人数
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.watchData.loading = true
      const data = {
        liveRoomId: this.$route.params.id
      }
      dataBoardviewData(data).then(res => {
        this.watchData = {
          ...res.data,
          loading: false
        }
        this.watchData.loading = false
      }).catch(() => {
        this.watchData.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.pageWrap {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  .titleHeader {
    padding-left: 20px;
    height: 62px;
    background: #F9FBFF;
    display: flex;
    align-items: center;
    .iconText {
      width: 16px;
      height: 16px;
      margin-left: 4px;
    }
  }
  .pageContent {
    padding: 16px 30px 34px;
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    .pageContentView {
      min-width: calc(25% - 20px);
    }
    .pageContentView + .pageContentView {
      margin-left: 20px;
    }
  }
}
::v-deep {
  .MTitle{
    .title {
      display: flex;
      align-items: center;
    }
  }
}
</style>
