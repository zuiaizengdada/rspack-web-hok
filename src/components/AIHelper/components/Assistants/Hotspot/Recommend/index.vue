<template>
  <!-- 热点列表 -->
  <div class="recommend">
    <div class="flex flex-between flex-middle">
      <div class="switch-custom">
        <div
          :class="{ 'switch-item': true, 'switch-item-checked': index === 0 }"
          @click="changeIndex(0)"
        >
          <img src="@/assets/image/aigc/douying.png" alt=""> 抖音
        </div>
        <div
          :class="{ 'switch-item': true, 'switch-item-checked': index === 1 }"
          @click="changeIndex(1)"
        >
          <img src="@/assets/image/aigc/zhihu.png" alt=""> 知乎
        </div>
        <!-- <div
        :class="{ 'switch-item': true, 'switch-item-checked': index === 2 }"
        @click="changeIndex(2)"
      >
        今日头条
      </div> -->
      </div>
      <div class="time">
        更新时间：<span>{{ time || '-' }}</span>
      </div>
    </div>
    <div class="tabs">
      <div v-if="index === 0" class="channel-types">
        <div
          v-for="(item, i) in hotCategoryList"
          :key="i"
          :class="{
            'channel-item': true,
            'channel-item-select ': item.checked
          }"
          @click="channelClick(item, i)"
        >
          {{ item.name }}
        </div>
      </div>
      <div v-if="index === 1" class="channel-types">
        <div
          :class="{
            'channel-item': true,
            'channel-item-select ': true
          }"
          @click="channelClick(item, i)"
        >
          热榜
        </div>
      </div>
    </div>
    <div class="content">
      <div
        ref="listRef"
        v-loading="loading"
        element-loading-spinner="el-icon-loading"
        class="list"
      >
        <div v-if="list.length < 1"><el-empty :image-size="200" /></div>
        <div v-for="(item, i) in list" :key="i" class="item">
          <div class="left">
            <div class="title" @click="openUrl(item.linkUrl)">
              <img v-if="i == 0" src="@/assets/image/aigc/hotone.png" alt="">
              <img v-if="i == 1" src="@/assets/image/aigc/hottowo.png" alt="">
              <img
                v-if="i == 2"
                src="@/assets/image/aigc/hotthree.png"
                alt=""
              >
              <div v-if="i > 2" class="sort-icon">{{ i + 1 }}</div>
              {{ item.title }}
            </div>
            <div class="desc">
              <img v-if="i < 3" src="@/assets/image/aigc/hotpwtop.png" alt="">
              <div style="padding-top: 6px">
                热度：<span>{{ item.metrics }}</span>
              </div>
            </div>
          </div>
          <div class="operate">
            <div class="btn-custom" @click="extractClick(item)">
              生成选题
              <img
                class="img-right"
                src="@/assets/image/aigc/right-icon.png"
                alt=""
              >
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="pagination">
        <el-pagination
          :current-page="pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="jumper, prev, pager, next, sizes, total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div> -->
    </div>
  </div>
</template>

<script>
import { hotNewsPage, hotCategoryList } from '@/api/aigc'
export default {
  inject: ['extractChange'],
  data() {
    return {
      index: 0,
      pageIndex: 1,
      pageSize: 50,
      total: 0,
      list: [],
      loading: false,
      channel: {
        0: 'douyin',
        1: 'zhihu'
      },
      hotCategoryList: [],
      time: ''
    }
  },
  computed: {
    getChannelName() {
      return this.hotCategoryList.find(item => item.checked).name
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async getHotCategoryList() {
      const ls = await hotCategoryList()
      this.hotCategoryList = ls.data.map((item, i) => ({
        name: item.category,
        checked: i === 0
      }))
    },
    channelClick(record, ii) {
      this.hotCategoryList.forEach((item, i) => {
        item.checked = i === ii
      })
      this.getList()
    },
    async getList() {
      this.loading = true
      hotNewsPage({
        // pageIndex: this.pageIndex,
        // pageSize: this.pageSize,
        category: this.index === 0 ? this.getChannelName : '热榜',
        channel: this.channel[this.index]
      })
        .then(res => {
          this.loading = false
          console.log(res, 'cccccccccc')
          this.list = [...res.data]
          this.time = this.list[0].crawlTime
          // 滚动条回到顶部
          this.$nextTick(() => {
            this.$refs.listRef.scrollTo({
              top: 0,
              behavior: 'smooth'
            })
          })
        })
        .catch(() => {
          this.loading = false
          this.list = []
        })
    },
    async initData() {
      // this.pageIndex = 1
      // this.pageSize = 50
      await this.getHotCategoryList()
      this.getList()
    },
    openUrl(url) {
      window.open(url)
    },
    extractClick(record) {
      this.extractChange({ ...record })
    },
    changeIndex(index) {
      this.index = index
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  position: relative;
  padding-left: 24px;
  background-color: #fff;
  .switch-custom {
    display: flex;
    width: 254px;
    height: 48px;
    background: #f8fbff;
    border: 1px solid #e6e9f0;
    border-radius: 4px;
    padding: 1px;
    margin: 10px 0 22px 0;
    cursor: pointer;
    user-select: none;
    .switch-item {
      width: 125px;
      height: 44px;
      font-size: 16px;
      font-weight: 400;
      color: #000;
      display: flex;
      align-items: center;
      border-radius: 2px;
      padding-left: 22px;
      img {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
    }
    .switch-item-checked {
      background: #eeeeee;
      border-radius: 2px;
      color: #0c6fff;
      font-weight: 500;
      transition: all 0.2s ease-in-out;
    }
  }
  .time {
    font-size: 14px;
    color: #838383;
    padding-right: 24px;
    user-select: none;
    span {
      color: #000;
    }
  }
  .tabs {
    width: 100%;
    position: relative;
    padding-bottom: 18px;
    border-bottom: 0.5px solid rgb(229 231 235);
  }
  .channel-types {
    display: flex;
    align-items: center;
    .channel-item {
      width: 84px;
      color: #000;
      font-weight: 500;
      font-size: 15px;
      margin-right: 16px;
      // background-color: #fff;
      text-align: center;
      padding: 2px 0;
      border-radius: 4px;
      user-select: none;
      cursor: pointer;
    }
    .channel-item-select {
      color: #ffffff;
      background: #3a7fff;
    }
  }
  .content {
    height: calc(100vh - 300px);
    // background: #ffffff;
    border-radius: 8px;
    .list {
      width: 100%;
      // padding: 20px;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      padding-right: 24px;
      // padding-top: 8px;
      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: #e5e5e5;
        transition: all 0.4s ease;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 0.5px solid rgb(229 231 235);
        padding-top: 20px;
        padding-bottom: 20px;
        .left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-right: 20px;
          .title {
            font-size: 16px;
            color: #333;
            font-weight: 500;
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            user-select: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            .sort-icon {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: #e6e9f0;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 8px;
              font-weight: 500;
              font-size: 12px;
              color: #3d3d3d;
              margin-left: 3px;
            }
            img {
              width: 24px;
              height: 24px;
              margin-right: 8px;
            }
            &:hover {
              color: #3a7fff;
            }
          }
          .desc {
            font-size: 14px;
            color: #777777;
            user-select: none;
            img {
              width: 24px;
              height: 24px;
              margin-right: 8px;
            }
            span {
              color: #333333;
            }
            display: flex;
            align-items: center;
          }
        }
        .operate {
          display: flex;
          align-items: center;
          .btn-custom {
            display: flex;
            align-items: center;
            width: 112px;
            height: 32px;
            border-radius: 4px;
            border: 1px solid #0c6fff;
            font-weight: 500;
            font-size: 14px;
            color: #0c6fff;
            user-select: none;
            padding-left: 18px;
            cursor: pointer;
            .img-right {
              width: 24px;
              height: 24px;
              margin-left: 10px;
            }
          }
          .obtn {
            width: 116px;
            height: 32px;
            text-align: center;
            line-height: 0;
            padding: 10px 0;
          }
        }
      }
    }

    .pagination {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      padding: 22px 20px;
    }
  }
}
::v-deep .pagination {
  .el-pagination {
    padding-right: 0;
    .el-pagination__total {
      margin-right: 0;
    }
  }
}
::v-deep {
  .el-tabs__item {
    font-size: 17px !important;
    color: #333;
  }
}
</style>
<style>
.el-select-dropdown {
  z-index: 6999 !important;
}
</style>
