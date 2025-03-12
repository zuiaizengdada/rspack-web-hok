<!-- 猜你想要 -->
<template>
  <div v-loading="loading" class="sell-wrapper" @mousedown="allowTextSelection">
    <template v-if="!isFullScreen()">
      <div class="sell-header-slideBar">
        <div class="sell-title-slideBar">
          <img
            src="@/assets/image/aigc/zhi.png"
            class="sell-title-icon"
            alt=""
          >
          <span>猜你想要</span>
        </div>
        <div class="sell-close-slideBar">
          <img
            src="@/assets/image/aigc/close.png"
            class="sell-close-slideBar-icon"
            alt=""
            @click="close"
          >
        </div>
      </div>
      <div class="sell-select-slideBar">
        <el-input
          v-model="searhcQuery.cueWord"
          placeholder="请输入关键词"
          class="input-search"
          clearable
          @keyup.enter.native="enterSearch"
          @change="changeCueWord"
        >
          <template slot="prefix">
            <img
              src="@/assets/image/aigc/search.png"
              class="input-search-icon"
              alt=""
              @click="changeCueWord"
            >
          </template>
        </el-input>
      </div>
    </template>
    <template v-else>
      <div class="sell-header-full-screen">
        <div class="tools-btns">
          <el-popover
            placement="bottom"
            title="猜你想要"
            trigger="hover"
            popper-class="custom-chat-tools-popover"
          >
            <div slot="reference" class="btn-tool btn-tool-select">猜</div>
          </el-popover>
          <div class="divider" />
          <el-popover
            placement="bottom"
            title="我的收藏"
            trigger="hover"
            popper-class="custom-chat-tools-popover"
          >
            <div slot="reference" class="btn-tool" @click="trigger">藏</div>
          </el-popover>
        </div>

        <p class="icons flex">
          <img
            src="@/assets/image/aigc/slidebar.png"
            alt=""
            @click="closeFullScreen"
          >
          <img src="@/assets/image/aigc/close.png" alt="" @click="closeALL">
        </p>
      </div>
      <div class="full-search">
        <div class="flex">
          <img
            src="@/assets/image/aigc/zhi.png"
            class="sell-title-icon"
            alt=""
          >
          <span>猜你想要</span>
        </div>
        <el-input
          v-model="searhcQuery.cueWord"
          placeholder="请输入关键词"
          class="input-search input-search-full"
          clearable
          @keyup.enter.native="enterSearch"
          @change="changeCueWord"
        >
          <template slot="prefix">
            <img
              src="@/assets/image/aigc/search.png"
              class="input-search-icon"
              alt=""
              @click="changeCueWord"
            >
          </template>
        </el-input>
      </div>
    </template>
    <div
      v-infinite-scroll="loadmore"
      :infinite-scroll-disabled="disabledInfiniteScroll"
      :class="{
        'sell-content': true,
        'sell-content-full-screen': isFullScreen()
      }"
    >
      <div v-for="(item, index) in list" :key="index" class="sell-collert-item">
        <div class="sell-collert-top">
          <div class="sell-collert-item-title">
            <span class="item-title-s1">{{ item.title }}</span>
            <el-divider direction="vertical" class="item-title-divider" />
            <span class="item-title-s1">{{ item.typeTitle }}</span>
          </div>
          <span class="edit-span">点击可编辑发送</span>
        </div>
        <div class="sell-collert-item-content" @click="selectItem(item)">
          <span v-html="item.text" />
        </div>
      </div>
      <el-empty
        v-if="list.length < 1"
        :image-size="100"
        description="暂无数据"
      />
    </div>
  </div>
</template>
<script>
import { getCueWordPage, sumClickNum } from '@/api/aigc'
import _ from 'lodash'
export default {
  inject: [
    'closeFullScreen',
    'closeALL',
    'isFullScreen',
    'setDisabledInput',
    'getTypeAIList',
    'getDisabledInput'
  ],
  data() {
    return {
      searhcQuery: {
        pageIndex: 0,
        pageSize: 10,
        cueWord: ''
      },
      total: 0,
      list: [],
      loading: false,
      disabledInfiniteScroll: false
    }
  },
  created() {
    this.searhcQuery.pageIndex = 0
  },
  methods: {
    allowTextSelection(event) {
      // 取消事件冒泡，确保文本选择事件能够正常触发
      event.stopPropagation()
    },
    resetSearch() {
      this.disabledInfiniteScroll = true
      this.list = []
      this.total = 0
      this.searhcQuery.pageIndex = 1
      this.getCueWordList()
    },
    enterSearch() {
      this.$uweb && this.$uweb.setAction('Event_search_enter')
      this.total = 0
      this.searhcQuery.pageIndex = 1
      this.getCueWordList()
    },
    loadmore() {
      this.searhcQuery.pageIndex++
      this.getCueWordList()
    },
    changeCueWord() {
      this.total = 0
      this.searhcQuery.pageIndex = 1
      this.getCueWordList()
    },
    getCueWordList: _.debounce(function () {
      const that = this
      const aiInfo = that.getTypeAIList?.find(item => item.checked)
      that.loading = true
      getCueWordPage({
        ...that.searhcQuery,
        sessionTemplateId: aiInfo
          ? aiInfo.type === 'AI'
            ? null
            : aiInfo.id
          : null
      })
        .then(res => {
          that.loading = false

          if (res.code === 1) {
            that.total = res.data.total
            if (that.searhcQuery.pageIndex === 1) {
              that.list = res.data.items.map(m => ({
                ...m,
                text: m.content
                  .replace(/\[/g, '[<span style="background-color: #FFE7DC">')
                  .replace(/\]/g, '</span>]')
              }))
            } else {
              that.list.push(
                ...res.data.items.map(m => ({
                  ...m,
                  text: m.content
                    .replace(/\[/g, '[<span style="background-color: #FFE7DC">')
                    .replace(/\]/g, '</span>]')
                }))
              )
            }
            that.disabledInfiniteScroll = that.total === that.list.length
          }
        })
        .catch(() => {
          that.loading = false
        })
    }, 500),
    trigger() {
      this.$uweb && this.$uweb.setAction('Event_click_collect_btn_list')
      this.$emit('trigger')
    },
    close() {
      this.$emit('close')
    },
    async selectItem(record) {
      if (this.getDisabledInput()) return
      await sumClickNum({ cueWordId: record.cueWordId })
      this.setDisabledInput(true)
      this.$emit('selectItem', record)
    }
  }
}
</script>
<style lang="scss">
.custom-chat-tools-popover {
  min-width: 64px;
  width: 64px;
  padding: 4px 8px;
  text-align: initial;
  margin-top: 10px !important;
  z-index: 7001 !important;
  .el-popover__title {
    line-height: initial;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #67686b;
    margin-bottom: 0;
    white-space: nowrap;
  }
  .popper__arrow {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.sell-wrapper {
  width: 100%;
  height: 100%;
  transition: all 0.3s;
  .sell-header-slideBar {
    width: 100%;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border-radius: 10px 10px 0px 0px;
    padding: 0 25px 0 30px;

    .sell-title-slideBar {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      span {
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #3a7fff;
      }
    }
    .sell-close-slideBar {
      cursor: pointer;
      .sell-close-slideBar-icon {
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }
    }
  }
  .sell-title-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  .sell-header-full-screen {
    width: 100%;
    height: 73px;
    background: #ffffff;
    border-radius: 0px 10px 0px 0px;
    padding: 21px 23px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tools-btns {
      display: flex;
      align-items: center;
      .btn-tool {
        // 禁止选择
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        display: inline-block;
        width: 30px;
        height: 30px;
        background: #e0e4e6;
        border-radius: 4px;
        padding: 5px 8px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #313233;
        &:hover {
          cursor: default;
          background: #dbe9ff;
          color: #3a7fff;
        }
      }
      .btn-tool-select {
        background: #3a7fff !important;
        color: #fff !important;
      }
      .divider {
        display: inline-block;
        width: 1px;
        height: 24px;
        background: #efefef;
        margin: 0 13px 0 13px;
      }
    }
    .icons {
      font-size: 20px;
      img {
        margin-left: 10px;
        width: 24px;
        height: 24px;
      }
      &:hover {
        img {
          cursor: pointer;
        }
      }
    }
  }
  .sell-select-slideBar {
    width: 88%;
    margin: 24px;
  }
  .input-search-icon {
    width: 20px;
    height: 20px;
  }
  .full-search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 16px 16px 8px 24px;
  }
  .sell-content {
    // 禁止滚动穿透
    overscroll-behavior: contain;
    // 禁止复制
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
      // display: none;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background: #879bf5;
      transition: all 0.4s ease;
    }

    &::-webkit-scrollbar-track {
      background: #fff;
    }
    height: calc(100% - 72px - 26px - 24px - 50px);
    overflow-y: auto;
    padding-bottom: 15px;
    .sell-collert-item {
      margin: 16px 24px;
      background: #ffffff;
      border-radius: 8px;
      position: relative;
      &:hover {
        box-shadow: 0px 3px 6px 0px rgba(77, 135, 230, 0.25);
        .sell-collert-top {
          background-color: rgba(76, 135, 230, 0.05);
          .edit-span {
            display: block;
          }
        }
      }
      .sell-collert-top {
        display: flex;
        align-items: center;
        .edit-span {
          font-size: 12px;
          color: #a3c6ff;
          display: none;
          padding-left: 6px;
        }
      }
      .sell-collert-item-title {
        width: fit-content;
        padding: 4px 8px;
        display: flex;
        align-items: center;
        max-width: 60%;

        background: linear-gradient(
          134deg,
          #fceefb 0%,
          #c8d3fe 55%,
          #e3feff 100%
        );
        border-radius: 8px 0px 8px 0px;

        .item-title-divider {
          background: #b3bfff;
          height: 18px;
        }
        .item-title-s1 {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #15243d;
          // 文本溢出隐藏
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .item-title-s2 {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #3a7fff;
        }
      }
      .sell-collert-item-content {
        padding: 16px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #313233;

        white-space: pre-line;
        word-break: break-all;
      }
      &:hover {
        .hover-edit {
          display: block;
        }
      }
      .hover-edit {
        display: none;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgb(0, 0, 0, 0.68);
        border-radius: 8px;
        z-index: 99;
        .hover-edit-i {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          &:hover {
            img {
              cursor: pointer;
            }
            span {
              cursor: pointer;
            }
          }
          img {
            width: 24px;
            height: 24px;
            margin-right: 8px;
          }
          span {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
          }
        }
      }
    }
    .more {
      width: 100%;
      text-align: center;
      padding-bottom: 58px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #67686b;
      span {
        margin-right: 8px;
      }
    }
  }
  .sell-content-full-screen {
    height: calc(100% - 133px);
    .sell-collert-item {
      margin: 16px;
    }
  }
}
.input-search-full {
  width: 229px;
}
::v-deep .input-search {
  .el-input__inner {
    border-radius: 25px;
    border: 1px solid #a3c6ff;
  }
  .el-input__prefix {
    left: 8px;
    top: 8px;
  }
}
</style>
