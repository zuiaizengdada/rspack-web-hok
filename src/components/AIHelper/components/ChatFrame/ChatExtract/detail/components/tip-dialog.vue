<template>
  <div class="tip-dialog">
    <!-- 模板头部 -->
    <div class="tip-dialog-header">
      <div class="tip-dialog-header-tabs">
        <div
          v-for="(item, index) in tabItems"
          :key="index"
          :class="['tabs-item', currentTabIndex === index ? 'active' : '']"
          @click="handleTabItemClick(index)"
        >
          {{ item }}
        </div>
      </div>

      <div class="tip-dialog-options">
        <div
          v-if="loadType === 'custom'"
          class="create-template-btn"
          @click="handleCreateClick"
        >
          创建模板
        </div>
        <i class="el-icon-close close-icon" @click="$emit('close')" />
      </div>
    </div>
    <!-- 模板内容 -->
    <div class="template-content">
      <!-- 类型tag -->
      <div v-if="currentTabIndex === 0" class="type-tags">
        <div
          v-for="(item, index) in tagItems"
          :key="index"
          class="tag"
          :class="{ active: index === currentTagIndex }"
          @click="handleTagClick(index)"
        >
          {{ item.classifyName }}
        </div>
      </div>

      <!-- content -->
      <div
        v-if="templateList.length"
        ref="templateListRef"
        v-infinite-scroll="load"
        class="type-template-content"
        :style="{
          height:
            currentTabIndex === 0
              ? 'calc(100% - 48.16px - 20px - 30px)'
              : 'calc(100% - 48.16px)'
        }"
      >
        <div
          v-for="(item, index) in templateList"
          :key="index"
          class="type-template-content-item"
          @click="handleTemplateClick(item)"
          @mouseenter="templateMouseEnter(item, index)"
          @mouseleave="item.isShowOption = item.unfold"
        >
          <!-- 标题 -->
          <span class="template-title">{{ item.templateTitle }}</span>
          <!-- 内容 -->
          <p
            ref="contentRef"
            class="template-content-text"
            :class="{
              unfold: !item.unfold
            }"
          >
            {{ item.content }}
          </p>
          <!-- 操作 -->
          <div
            v-if="item.isShowOption && loadType === 'custom'"
            class="template-operation"
          >
            <div v-if="item.isShowZhanKai" class="icon">
              <svg-icon
                class="zhankai-icon"
                icon-class="zhankai"
                @click="handleZhanKaiClick(item, index)"
              />
              <div class="tip" style="left: -9px">
                {{ item.unfold ? '折叠' : '展开' }}
              </div>
            </div>
            <div v-if="!item.isCollection" class="icon">
              <svg-icon
                class="edit-icon"
                icon-class="_edit"
                @click="handleEditClick(item, 'user')"
              />
              <div class="tip" style="left: -9px">编辑</div>
            </div>

            <div v-if="!item.isCollection" class="icon">
              <svg-icon
                class="delete-icon"
                icon-class="_delete"
                @click="handleDeleteClick(item)"
              />
              <div class="tip" style="left: -9px">删除</div>
            </div>
          </div>
          <div
            v-if="item.isShowOption && loadType === 'system'"
            class="template-operation"
          >
            <div class="icon">
              <svg-icon
                v-if="item.isLiked"
                icon-class="dianzan-active"
                @click="handleDianZanClick(item)"
              />
              <svg-icon
                v-else
                class="dianzan-icon"
                icon-class="dianzan"
                @click="handleDianZanClick(item)"
              />
              <div class="tip" style="left: -9px">点赞</div>
            </div>

            <div class="icon">
              <svg-icon
                v-if="item.isCollection"
                icon-class="shoucang-active"
                @click="handleShouCangClick(item)"
              />
              <svg-icon
                v-else
                class="shoucang-icon"
                icon-class="shoucang"
                @click="handleShouCangClick(item)"
              />
              <div class="tip" style="left: -9px">收藏</div>
            </div>

            <div v-if="item.isShowZhanKai" class="icon">
              <svg-icon
                class="zhankai-icon"
                icon-class="zhankai"
                @click="handleZhanKaiClick(item, index)"
              />
              <div class="tip" style="left: -9px">
                {{ item.unfold ? '折叠' : '展开' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 是否加载完毕 -->
        <div v-if="loading" class="loading-box">
          <svg-icon class="loading-icon" icon-class="_loading" />
        </div>
      </div>

      <template v-if="!templateList.length && !loading">
        <div class="empty">
          <img src="@/assets/image/aiIcon.gif" />
          <span>暂未创建{{ loadType === 'system' ? '系统默认' : '我的' }}模板</span>
        </div>
      </template>
    </div>

    <!-- 创建/编辑模板弹框 -->
    <CreateUpdateDialog
      ref="createUpdateDialogRef"
      :dialog-show.sync="showCreateOrUpdateDialog"
      @updata:dialogShow="showCreateOrUpdateDialog = $event"
      @update="getTemplateList(pageParams)"
    />

    <div v-if="showCreateOrUpdateDialog" class="mask" />
  </div>
</template>

<script>
import { tabItems } from '../config'
import CreateUpdateDialog from './create-update-dialog.vue'
import {
  queryTemplateList,
  queryTemplateCategoryList,
  templateLike,
  templateCollection
} from '@/api/aigc/callWord'

export default {
  components: { CreateUpdateDialog },
  data() {
    return {
      // tabItems
      tabItems: [],
      // tagItems
      tagItems: [],
      // 当前tab点击下标
      currentTabIndex: 0,
      // 当前tag点击下标
      currentTagIndex: -1,
      // 是否展示创建/编辑模板弹框
      showCreateOrUpdateDialog: false,
      // 分页查询参数
      pageParams: {
        // 	是否是系统模版
        isSystem: true,
        // 页数
        pageIndex: 1,
        // 每页大小
        pageSize: 20
      },
      // 是否加载
      loading: false,
      // 下拉加载类型
      loadType: 'system',
      // 是否还有更多,
      isNoMore: false,
      // 模板展示列表
      templateList: []
    }
  },
  async mounted() {
    this.initConfig()

    await this.getTemplateCategoryList()
    this.pageParams.templateClassifyId = this.tagItems[0].id

    if (this.currentTagIndex === -1 && this.tagItems.length > 0) {
      // 如果没有激活的标签且存在标签数组，则默认激活第一个标签
      this.currentTagIndex = 0
    }

    await this.getTemplateList()
  },
  methods: {
    // 初始化设置
    initConfig() {
      // 设置tabs
      this.tabItems = tabItems
    },
    // 重置pageParams
    resetPageParams(type, index) {
      let pageParams

      if (type === 'system') {
        this.$uweb?.setAction('Event_ChatExtrac_ClickSystemTemp')
        pageParams = {
          // 提示词分类id
          templateClassifyId: this.tagItems[index]
            ? this.tagItems[index].id
            : '',
          // 页数
          pageIndex: 1,
          // 每页大小
          pageSize: 20,
          // 	是否是系统模版
          isSystem: true
        }
      } else {
        this.$uweb?.setAction('Event_ChatExtrac_ClickCustomTemp')
        pageParams = {
          // 页数
          pageIndex: 1,
          // 每页大小
          pageSize: 20,
          // 	是否是系统模版
          isSystem: false,
          // 租户Id
          tenantId: JSON.parse(localStorage.getItem('orgInfo')).organizationId,
          // 用户id
          userId: JSON.parse(localStorage.getItem('UserInfo')).userId
        }
      }

      return pageParams
    },
    // tabItem点击
    async handleTabItemClick(index) {
      if (index === 1) {
        this.$uweb && this.$uweb.setAction('Event_Temp_My')
      }
      this.currentTabIndex = index
      this.currentTagIndex = 0
      this.loadType = this.currentTabIndex === 0 ? 'system' : 'custom'

      const pageParams = this.resetPageParams(
        this.loadType,
        this.currentTagIndex
      )

      await this.getTemplateList(pageParams)
    },
    // tag点击
    async handleTagClick(index) {
      this.currentTagIndex = index
      const pageParams = this.resetPageParams(this.loadType, index)

      await this.getTemplateList(pageParams)
    },
    // 新增模板弹框点击
    handleCreateClick() {
      this.$uweb?.setAction('Event_ChatExtrac_CreateCustomTemp')
      this.showCreateOrUpdateDialog = true
    },
    // 编辑模板弹框点击
    handleEditClick(item, type) {
      // 阻止事件冒泡到父组件
      event.stopPropagation()

      this.showCreateOrUpdateDialog = true
      this.$refs.createUpdateDialogRef.getCustomTemplateDetail(item.id, type)
    },
    // 删除模板弹框点击
    handleDeleteClick(item) {
      // 阻止事件冒泡到父组件
      event.stopPropagation()

      this.$emit('delete', item)
    },

    // 获取模板列表
    async getTemplateList(pageParams) {
      this.loading = true

      if (pageParams) {
        this.templateList = []
      }

      this.pageParams = pageParams ?? this.pageParams

      const {
        code,
        data: { hasNext, items }
      } = await queryTemplateList(this.pageParams)

      if (code === 1) {
        this.templateList = [...this.templateList, ...items].map(item => ({
          ...item,
          unfold: false,
          isShowOption: false,
          isShowZhanKai: false
        }))

        this.isNoMore = !hasNext
      }

      this.loading = false
    },
    async getTemplateCategoryList() {
      const params = {
        pageIndex: 1,
        pageSize: 999
      }
      const { code, data } = await queryTemplateCategoryList(params)

      if (code === 1) {
        this.tagItems = data.items
      }
    },
    // 监听模板点击
    handleTemplateClick(item) {
      this.$emit('tempClick', item)
    },
    // 下拉加载
    async load() {
      if (!this.isNoMore) {
        this.pageParams = {
          ...this.pageParams,
          pageIndex: ++this.pageParams.pageIndex
        }

        this.getTemplateList()
      }
    },
    // 点赞
    async handleDianZanClick(item) {
      this.$uweb?.setAction('Event_Temp_Upvote')
      event.stopPropagation()
      const data = {
        id: item.id
      }
      const { code } = await templateLike(data)

      if (code === 1) {
        item.isLiked = !item.isLiked

        this.$message.success({
          message: item.isLiked ? '点赞成功' : '取消点赞成功',
          customClass: 'amap-sug-result'
        })
      }
    },
    // 收藏
    async handleShouCangClick(item) {
      this.$uweb?.setAction('Event_Temp_Collect')
      event.stopPropagation()
      const data = {
        id: item.id
      }

      const { code } = await templateCollection(data)
      if (code === 1) {
        item.isCollection = !item.isCollection

        this.$message.success({
          message: item.isCollection
            ? '已收藏至我的模版'
            : '该提示词模版取消收藏',
          customClass: 'amap-sug-result'
        })
      }
    },
    templateMouseEnter(item, index) {
      item.isShowOption = true
      this.$nextTick(() => {
        const contentDiv = this.$refs.contentRef[index]
        if (contentDiv && contentDiv instanceof HTMLElement) {
          item.isShowZhanKai = this.checkMorethanLine(contentDiv, 2)
        } else {
          console.warn('contentDiv 不是有效的 HTMLElement', contentDiv)
        }
      })
    },
    // 判断是否超过指定行数
    checkMorethanLine(ref, row) {
      const contentDiv = ref
      const style = window.getComputedStyle(contentDiv, null)
      const height = parseInt(style.height, 10)
      const lineHeight = parseInt(style.lineHeight, 10)

      return height / lineHeight >= row
    },
    // 展开
    handleZhanKaiClick(item, index) {
      this.$uweb?.setAction('Event_Temp_Unfold')
      // 阻止事件冒泡到父组件
      event.stopPropagation()
      item.unfold = !item.unfold

      if (item.unfold) {
        item.isShowOption = true
      } else {
        this.$refs.contentRef[index].scrollTop = 0
        item.isShowOption = false
      }
    }
  }
}
</script>

<style lang="scss">
.custom-zyq-prpper {
  z-index: 99999 !important;
}
</style>

<style scoped lang="scss">
.tip-dialog {
  position: absolute;
  bottom: 40px;
  left: 110px;
  width: 80%;
  height: 365px;
  border-radius: 7.53px;
  background: #ffffff;
  box-shadow: 0 2px 8px 0 #00000014;
  overflow: hidden;
  z-index: 1000;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48.16px;
    padding: 13px 24px;
    background: linear-gradient(234.6deg, #f0f6ff 0%, #d7e6ff 100%);

    &-tabs {
      display: flex;
      align-items: center;
      gap: 30px;
      height: 100%;
      border-radius: 0 6px 6px 0;

      .tabs-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 400;
        color: #333333;
        cursor: pointer;

        &::after {
          content: '';
          position: absolute;
          bottom: -11px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 4px;
          background-color: #5696ff; /* 横线颜色 */
          transition: width 0.3s; /* 添加过渡效果 */
        }
      }
      .active {
        font-weight: 600;

        &::after {
          width: 50%;
        }
      }
    }
  }

  &-options {
    display: flex;
    align-items: center;
    gap: 19px;

    .create-template-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 400;
      color: #5696ff;
      width: 90px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid #d3d7d8;
      background: #ffffff;
      cursor: pointer;
    }

    .close-icon {
      font-size: 24px;
      cursor: pointer;
    }
  }

  .template-content {
    position: relative;
    height: 100%;
    padding: 20px 10px;

    .type-tags {
      overflow-x: auto;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      padding: 0 10px 20px;
      position: relative;
      box-shadow: 0px 10px 10px -7px rgba(0, 0, 0, 0.1);

      .tag {
        padding: 6px 12px;
        display: block;
        width: 80px;
        min-width: 80px;
        text-align: center;
        border-radius: 8px;
        background: #ffffff;
        cursor: pointer;

        &:hover {
          background-color: #e6efff;
        }

        &.active {
          background-color: #5696ff;
          color: #ffffff;
        }
      }
    }

    .type-template-content {
      overflow-y: auto;
      padding: 0 10px;

      &-item {
        display: flex;
        flex-direction: column;
        padding: 16px 14px;
        border-radius: 6px;
        border: 1px solid #d3d7d8;
        background: #fafcff;
        box-shadow: 0 2px 4px 0 #0000000d;
        font-size: 14px;
        gap: 6px;
        cursor: pointer;

        &:not(:last-child) {
          margin-bottom: 20px;
        }

        &:hover {
          border: 1px solid #5696ff;
          background: #ebf3ff;
        }

        .template-title {
          color: #000000;
          font-weight: 600;
        }

        .template-content-text {
          width: 100%;
          color: #808080;
          max-height: 245px;
          overflow-y: auto;
        }
        // 展开
        .unfold {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .template-operation {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;

          .icon {
            position: relative;
            width: 16px;
            height: 16px;

            .edit-icon,
            .delete-icon,
            .dianzan-icon,
            .shoucang-icon,
            .zhankai-icon {
              color: #808080;

              &:hover {
                color: #5696ff;
              }
            }

            &:hover {
              .tip {
                display: block;
              }
            }

            .tip {
              position: absolute;
              display: none;
              padding: 4px 8px;
              height: 25px;
              background: #f7f7f7;
              box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.1);
              border-radius: 4px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #67686b;
              top: -32px;
              left: -7px;
              white-space: nowrap;
            }
          }
        }
      }

      .loading-box,
      .no-more-box {
        width: 100%;
        text-align: center;

        span {
          color: #9f9f9f;
          font-size: 14px;
        }

        .loading-icon {
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }
    }

    .empty {
      width: 100%;
      height: calc(100% - 48.16px - 20px - 30px - 33px);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      img {
        width: 100px;
        height: 100px;
      }

      span {
        color: #9f9f9f;
        font-size: 12px;
      }
    }
  }

  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1020;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
