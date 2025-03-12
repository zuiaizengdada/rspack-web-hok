<template>
  <div class="aiShop">
    <div class="filterTop">
      <el-input
        v-model="search.keyWord"
        size="medium"
        placeholder="请输入要查找的助手名称"
        style="width: 378px; height: 40px"
        @input="onsearch"
      >
        <i slot="prefix" class="el-input__icon el-icon-search" />
      </el-input>
      <div class="clearBtn" @click="onhandleClear">重置</div>
    </div>
    <div class="aishop-tab">
      <el-tabs v-model="categorys.cur" @tab-click="onsearch">
        <template v-for="item in categorys.list">
          <el-tab-pane
            :key="item.categoryId"
            :label="item.name"
            :name="String(item.categoryId)"
          />
        </template>
      </el-tabs>
    </div>
    <div class="aiShop-content">
      <div
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
        class="aiShop-list"
        :infinite-scroll-distance="50"
      >
        <div class="ailist-body">
          <div
            v-for="(item, index) in aiList"
            :key="index"
            class="ailist_view"
            @mouseover="item.showBtnUser = true"
            @mouseleave="item.showBtnUser = false"
            @click="onhandleUse(item)"
          >
            <div class="ailist_view_img">
              <img
                v-if="item.id === '1'"
                src="@/assets/image/aigc/my_icon.png"
                alt=""
              />
              <template v-else>
                <img v-if="!!item.icon" :src="item.icon" alt="" />
                <div
                  v-else
                  class="title-span"
                  :style="{ background: item.backgroundColor }"
                >
                  <span :style="{ color: item.textColor }">{{
                    item.title.split('')[0]
                  }}</span>
                </div>
              </template>
            </div>
            <div class="ailist_detail">
              <div class="ailist_detail_title">
                <textShowMore :line-clamp="1" :text="item.title" />
              </div>
              <div class="ailist_detail_describe">
                <textShowMore
                  :line-clamp="2"
                  :text="
                    item.templateId === '1'
                      ? '全能AI小助手，解决你的所有问题'
                      : item.description
                  "
                />
              </div>
              <div class="ailist_detail_footer">
                <div class="ailist_detail_footer_des">
                  <div>
                    <img src="@/assets/image/aigc/aiCreater.png" /><span>{{
                      item.createdNickName
                    }}</span>
                  </div>
                  <div>
                    <img src="@/assets/image/aigc/aiHot.png" /><span>{{
                      item.useCounter
                    }}</span>
                  </div>
                </div>
                <!-- 使用按钮 -->
                <!-- <div
                  v-show="item.id !== '1' && !item.hasUsed && item.showBtnUser"
                  class="userAIBtn"
                  @click="onhandleUse(item)"
                >
                  使用
                </div> -->
              </div>
              <!-- 使用中标记 -->
              <div v-if="item.hasUsed || item.id === '1'" class="aiUseingTips">
                使用中
              </div>
            </div>
          </div>
        </div>

        <div v-if="aiList.length === 0 && noMore && !loading" class="noData">
          <img src="@/assets/image/aiIcon.gif" alt="" />
          <div class="noDataText">未搜索到相关结果</div>
          <!-- <div class="add_btn" @click="$emit('onAdd')"><i class="el-icon-plus" /><span style="margin-left: 8px">创建AI助手</span></div> -->
        </div>
      </div>
      <div v-if="loading" class="aiShop-loading">
        <img src="@/assets/image/aigc/loading.gif" />
      </div>
    </div>
  </div>
</template>

<script>
import textShowMore from '@/components/textShowMore/index2.vue'
import {
  getAssistantCenter,
  useAssistant,
  assistantcategoryListApi
} from '@/api/aigc/index.js'
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  inject: [
    'getTypeAIList',
    'setChatMessage',
    'clearChatMessage',
    'getWS',
    'createWS',
    'getChatMessageList',
    'getHistory',
    'setDisabledInput',
    'getIsAIEnd',
    'setTypeAIList',
    'initPage',
    'useAssistant'
  ],
  components: {
    textShowMore
  },
  data() {
    return {
      search: {
        keyWord: ''
      },
      loading: false,
      aiList: [],
      currentPage: 1,
      pageSize: 30,
      noMore: false,
      cancelToken: axios.CancelToken,
      source: null,
      categorys: {
        cur: null,
        list: []
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    disabled() {
      return this.loading || this.noMore
    }
  },
  mounted() {
    this.getassistantcategoryList()
  },
  methods: {
    //  获取助手分类
    async getassistantcategoryList() {
      try {
        const { data, success } = await assistantcategoryListApi({
          pageSize: 100
        })
        if (success) {
          this.categorys.list = data.items || []
          this.categorys.cur = data?.items[0]
            ? String(data.items[0]?.categoryId)
            : null
          this.onsearch()
        }
      } catch (error) {
        console.log(error)
      }
    },
    onhandleClear() {
      this.search.keyWord = ''
      this.onsearch()
    },
    load(isFirst) {
      // 取消上一次发出的请求
      if (this.source) {
        this.source.cancel('cancel')
        this.source = null
        this.noMore = true
      }
      console.log('触发加载')
      console.log(this.disabled)
      this.loading = true
      const data = {
        pageIndex: isFirst === true ? 1 : this.currentPage,
        pageSize: this.pageSize,
        title: this.search.keyWord,
        categoryId: this.categorys.cur,
        source: 'web' // 来源于web 区分移动端
      }
      this.source = this.cancelToken.source()
      getAssistantCenter(data, this.source.token)
        .then(res => {
          const arr = []
          res.data.items.map(v => {
            arr.push({
              ...v,
              isDeleted:
                v.isDeleted ||
                (v.isPrivate && v.createdUserId !== this.userInfo.userId)
                  ? 1
                  : 0,
              id: v.templateId,
              loading: false,
              showBtnUser: false,
              useCount: v.useCounter,
              describe: v.description
            })
          })
          this.currentPage++
          this.aiList = isFirst === true ? arr : this.aiList.concat(arr)
          this.noMore = res.data.total === this.aiList.length
          this.loading = false
        })
        .catch(() => {
          this.noMore = true
          this.loading = false
        })
    },
    onsearch() {
      this.noMore = true
      this.load(true)
    },
    onhandleUse(item) {
      console.log(item, 'item')
      // classify   0:提示词|1:自研|2:外部链接
      if (item.classify === 2) {
        // 第三方链接ai 直接跳转
        window.open(item.content)
      }
      // 目前代码含义不清
      if (item.templateId === '1') {
        return this.$emit('openAi', item.id)
      }
      if (item.hasUsed) {
        return this.useAssistant(item.id)
      }
      if (item.loading) {
        return
      }
      // 访问助手，添加访问纪录 useAssistant
      // 更新左侧栏 this.initPage(item.id)
      item.loading = true
      const data = {
        templateId: item.id
      }
      useAssistant(data)
        .then(res => {
          item.hasUsed = true
          item.loading = false
          // 为外部链接助手 助手侧边栏无需重新定位
          if (item.classify !== 2) this.$store.dispatch('ai/setScene', item)
          this.initPage(item.classify !== 2 ? item.id : undefined)
        })
        .catch(() => {
          item.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.aiShop {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .filterTop {
    margin-top: 24px;
    ::v-deep {
      .el-input__inner {
        height: 40px;
        line-height: 40px;
      }
      .el-input__icon {
        line-height: 40px;
      }
    }
  }
  .aishop-tab {
    ::v-deep .el-tabs__header {
      margin: 20px 0;
      .el-tabs__nav-wrap::after,
      .el-tabs__active-bar {
        height: 0;
      }
      .el-tabs__nav-prev,
      .el-tabs__nav-next {
        height: 28px;
        line-height: 28px;
        &.is-disabled {
          color: #0c6fff;
        }
      }
      .el-tabs__item {
        height: 28px;
        color: #000000;
        font-size: 16px;
        line-height: 18px;
        font-weight: 400;
        font-family: '微软雅黑';
        padding: 5px 12px;
        border-radius: 6px;
        &.is-active {
          color: #fff;
          background: #5696ff;
        }
      }
    }
  }
  .aiShop-content {
    padding-bottom: 28px;
    flex: 1 0 0;
    display: flex;
    flex-direction: column;

    .aiShop-list {
      flex: 1 0 0;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: #d8d8d8;
        transition: all 0.4s ease;
      }
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
      .ailist-body {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
      }
      .ailist_view {
        width: calc(33.33% - 8px - 3px);
        height: 112px;
        background: #ffffff;
        box-shadow: 0px 2px 4px 0px rgba(219, 219, 219, 0.5);
        border-radius: 6px;
        margin: 0 12px 24px 0;
        display: flex;
        padding: 14px 11px 0 14px;
        position: relative;
        &:nth-child(3n) {
          margin-right: 0;
        }
        .ailist_view_img {
          width: 58px;
          > img {
            width: 58px;
            height: 58px;
            border-radius: 50%;
          }
          span {
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #313233;
          }
          > .title-span {
            width: 58px;
            min-width: 58px;
            height: 58px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .ailist_detail {
          padding-left: 14px;
          flex: 1 0 0;
          .ailist_detail_title {
            margin-bottom: 4px;
            ::v-deep {
              .showMore {
                font-size: 16px;
                font-weight: bold;
                color: #333333;
              }
            }
          }
          .ailist_detail_describe {
            min-height: 34px;
            margin-bottom: 5px;
            ::v-deep {
              .showMore {
                font-size: 14px;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                color: #333;
                line-height: 17px;
              }
            }
          }
          .ailist_detail_footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 20px;
            .ailist_detail_footer_des {
              font-size: 12px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #999999;
              line-height: 16px;
              display: flex;
              align-items: center;
              > div {
                display: flex;
                align-items: center;
                margin-right: 23px;
                > img {
                  width: 16px;
                  height: 16px;
                  margin-right: 8px;
                }
              }
            }
            .userAIBtn {
              width: 48px;
              height: 20px;
              background: #5696ff;
              border-radius: 4px;
              font-size: 12px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #ffffff;
              line-height: 20px;
              text-align: center;
              cursor: pointer;
            }
          }
        }
        .aiUseingTips {
          position: absolute;
          right: 0;
          top: 0;
          width: 48px;
          height: 20px;
          background: #c2d9fe;
          border-radius: 0px 4px 0px 4px;
          font-size: 12px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #50668b;
          text-align: center;
        }
        &:hover {
          border: 1px solid #5696ff;
        }
      }
    }
    .aiShop-loading {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 80px;
      line-height: 56px;
      font-size: 24px;
      text-align: center;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      > img {
        width: 24px;
        height: 24px;
      }
    }
  }
  .clearBtn {
    width: 80px;
    display: inline-block;
    height: 40px;
    background: #5696ff;
    border-radius: 6px;
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: bold;
    color: #ffffff;
    line-height: 40px;
    cursor: pointer;
    text-align: center;
    margin-left: 20px;
  }
}
.noData {
  margin: 206px auto 0;
  width: 134px;
  display: flex;
  align-items: center;
  flex-direction: column;
  > img {
    width: 120px;
    height: 120px;
  }
  .noDataText {
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: #9f9f9f;
    line-height: 20px;
    text-align: center;
  }
  .add_btn {
    margin-top: 24px;
    width: 134px;
    height: 40px;
    background: #5696ff;
    border-radius: 6px;
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 40px;
    cursor: pointer;
    text-align: center;
  }
}
</style>
