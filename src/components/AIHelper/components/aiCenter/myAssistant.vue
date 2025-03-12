<template>
  <div class="myAssistant">
    <div class="myAssistant-content">
      <div
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"
        class="myAssistant-list"
        :infinite-scroll-distance="50"
      >
        <div
          v-for="(item, index) in aiList"
          :key="item.id"
          class="ailist_view"
          @mouseover="item.showBtnUser = true"
          @mouseleave="item.showBtnUser = false"
          @click="onhandleUse(item)"
        >
          <div class="ailist_view_img">
            <img
              v-if="item.type === 1"
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
            <!-- 是否公开/私密 -->
            <div :class="item.isPrivate ? 'private' : 'publice'">
              {{ item.isPrivate ? '私密' : '公开' }}
            </div>
          </div>
          <div class="ailist_detail">
            <div class="ailist_detail_title">
              <div class="ailist_detail_title_value">
                <textShowMore :line-clamp="1" :text="item.title" />
              </div>
              <div class="aiHot">
                <img src="@/assets/image/aigc/aiHot.png" /><span>{{
                  item.useCount
                }}</span>
              </div>
            </div>
            <div class="ailist_detail_describe">
              <textShowMore :line-clamp="2" :text="item.describe" />
            </div>
            <!-- 使用中标记 -->
            <div v-if="item.hasUsed" class="aiUseingTips">使用中</div>
            <!-- 助手初始化中标记 -->
            <div v-if="item.status === 'INIT'" class="aiInit">
              助手初始化中<loadingView />
            </div>
            <!-- 使用按钮 -->
            <!-- <div
              v-show="!item.hasUsed && item.showBtnUser"
              class="use_btn"
              @click="onhandleUse(item)"
            >
              使用
            </div> -->
          </div>
          <div class="ailist_btn">
            <div class="ai_btn" @click.stop="onhandleRights(item)">
              权限管理
            </div>
            <div class="ai_btn" @click.stop="$emit('editAi', item)">编辑</div>
            <div
              class="ai_btn ai_btn_del"
              @click.stop="onhandleDel(item, index)"
            >
              删除
            </div>
          </div>
        </div>

        <div v-if="aiList.length === 0 && noMore && !loading" class="noData">
          <img src="@/assets/image/aiIcon.gif" alt="" />
          <div class="noDataText">暂无我的助手</div>
          <div class="add_btn" @click="$emit('onAdd')">
            <i class="el-icon-plus" />
            <span style="margin-left: 8px"> 创建AI助手 </span>
          </div>
        </div>
      </div>
      <div v-if="loading" class="myAssistant-loading">
        <img src="@/assets/image/aigc/loading.gif" />
      </div>
    </div>

    <rightsDialog :config="rightsDialog" />
  </div>
</template>

<script>
import textShowMore from '@/components/textShowMore/index2.vue'
import rightsDialog from './rightsDialog.vue'
import {
  getMyAssistantList,
  deletedAssistantCenter,
  useAssistant
} from '@/api/aigc/index.js'
import loadingView from './loading.vue'
import { mapGetters } from 'vuex'
import axios from 'axios'
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
    'useAssistant'
  ],
  components: {
    textShowMore,
    loadingView,
    rightsDialog
  },
  data() {
    return {
      aiList: [],
      rightsDialog: {
        visible: false,
        row: {},
        success: () => {}
      },
      loading: false,
      currentPage: 1,
      pageSize: 30,
      noMore: false,
      cancelToken: axios.CancelToken,
      source: null
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    disabled() {
      return this.loading || this.noMore
    }
  },
  mounted() {},
  methods: {
    // 点击权限管理
    onhandleRights(item) {
      // const _this = this
      this.rightsDialog = {
        visible: true,
        row: JSON.parse(JSON.stringify(item)),
        success: res => {
          console.log(res, 'res')
          // _this.setTypeAIList()
          item.isPrivate = res
          this.rightsDialog.visible = false
        }
      }
    },
    // 点击删除按钮
    onhandleDel(item, index) {
      if (item.loading) {
        return
      }
      this.$delModal({
        tips: item.isPrivate
          ? '助手删除后，将无法恢复，确认删除吗？'
          : '该助手已公开，删除后将会导致已使用的用户无法继续使用，确认删除吗？',
        success: () => {
          console.log('删除')
          item.loading = true
          const data = {
            templateId: item.id
          }
          deletedAssistantCenter(data)
            .then(res => {
              this.currentPage = 1
              this.aiList.splice(index, 1)
              item.loading = false
              // this.setTypeAIList()
            })
            .catch(() => {
              item.loading = false
            })
        }
      })
    },
    load() {
      if (this.source) {
        // 取消上一次发出的请求
        this.source.cancel('cancel')
        this.source = null
        this.noMore = true
      }
      this.loading = true
      const data = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      getMyAssistantList(data)
        .then(res => {
          console.log(res, 'res')
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
              showBtnUser: false,
              loading: false,
              useCount: v.useCounter,
              describe: v.description
            })
          })
          console.log(arr, 'arr')
          this.aiList = this.aiList.concat(arr)
          this.noMore = res.data.total === this.aiList.length
          this.loading = false
        })
        .catch(() => {
          this.noMore = true
          this.loading = false
        })
    },
    onhandleUse(item) {
      if (item.hasUsed) {
        return this.useAssistant(item.id)
      }
      if (item.loading) {
        return
      }
      item.loading = true
      console.log(item)
      const data = {
        templateId: item.id
      }
      useAssistant(data)
        .then(res => {
          item.hasUsed = true
          item.loading = false
          this.setTypeAIList().then(() => {
            this.$nextTick(() => {
              this.$emit('openAi', item.id)
            })
          })
        })
        .catch(() => {
          item.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.myAssistant {
  height: 100%;
  display: flex;
  flex-direction: column;
  .myAssistant-content {
    margin-top: 24px;
    padding-bottom: 28px;
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
    .myAssistant-list {
      flex: 1 0 0;
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      margin-left: -12px;
      margin-right: -12px;
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
      .ailist_view {
        width: 580px;
        width: calc(50% - 22px - 3px);
        height: 112px;
        background: #ffffff;
        box-shadow: 0px 2px 4px 0px rgba(219, 219, 219, 0.5);
        border-radius: 6px;
        margin: 0 11px 24px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        position: relative;
        border: 1px solid transparent;
        .ailist_view_img {
          width: 72px;
          position: relative;
          > img {
            width: 72px;
            height: 72px;
            border-radius: 50%;
          }
          span {
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #313233;
          }
          > .title-span {
            width: 72px;
            min-width: 72px;
            height: 72px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          > .private {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #fdd9d5;
            border: 1px solid #c94335;
            font-size: 12px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #ff5a4b;
            line-height: 30px;
            text-align: center;
          }
          .publice {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 30px;
            height: 30px;
            background: #fdedd1;
            border-radius: 50%;
            border: 1px solid #ff5d07;
            font-size: 12px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #ff5d07;
            line-height: 30px;
            text-align: center;
          }
        }
        .ailist_detail {
          padding-left: 18px;
          flex: 1 0 0;
          .ailist_detail_title {
            margin-bottom: 4px;
            max-width: 235px;
            display: flex;
            ::v-deep {
              .showMore {
                font-size: 16px;
                font-weight: bold;
                color: #333333;
              }
            }
            .aiHot {
              display: flex;
              align-items: center;
              margin-right: 23px;
              font-size: 12px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #999999;
              line-height: 16px;
              > img {
                width: 16px;
                height: 16px;
                margin-left: 11px;
                margin-right: 8px;
              }
            }
          }
          .ailist_detail_describe {
            max-width: 235px;
            min-height: 34px;
            margin-bottom: 5px;
            ::v-deep {
              .showMore {
                font-size: 14px;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                color: #999999;
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
              color: #595959;
              line-height: 12px;
              display: flex;
              align-items: center;
              > div {
                display: flex;
                align-items: center;
                margin-right: 23px;
                > img {
                  width: 12px;
                  height: 12px;
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
          z-index: 5;
        }
        .ailist_btn {
          display: flex;
          align-items: center;
          .ai_btn {
            height: 20px;
            border-radius: 4px;
            line-height: 20px;
            padding: 0 12px;
            border: 1px solid #e5e5e5;
            font-size: 12px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #595959;
            line-height: 18px;
            cursor: pointer;
          }
          .ai_btn + .ai_btn {
            margin-left: 10px;
          }
          .ai_btn_del {
            color: #ff0000;
          }
        }
        .use_btn {
          position: absolute;
          bottom: 15px;
          right: 20px;
          z-index: 2;
          height: 20px;
          line-height: 20px;
          background: #5696ff;
          border-radius: 4px;
          font-size: 12px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          padding: 0 12px;
          cursor: pointer;
        }
        .aiInit {
          z-index: 2;
          position: absolute;
          right: 20px;
          bottom: 10px;
          font-size: 12px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #ff7d00;
          line-height: 17px;
          display: flex;
          align-items: center;
        }
        &:hover {
          border: 1px solid #5696ff;
        }
      }
    }
    .myAssistant-loading {
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
