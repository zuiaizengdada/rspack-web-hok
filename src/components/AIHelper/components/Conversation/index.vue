<template>
  <div class="conversation-container">
    <div class="conversation-container-header">
      <div class="boxTitle">
        <img src="@/assets/image/aigc/new_icon.png" alt="" />
        <span>我的AI管家</span>
      </div>

      <div class="searchBoxView">
        <div class="searchBox">
          <div v-show="!searchText && inputTextBol" class="searchText">
            <img src="@/assets/image/aigc/sousuo_icon.png" alt="" />
            <span>搜索</span>
          </div>

          <input
            v-model="searchText"
            :disabled="!getIsAIEnd()"
            type="text"
            @input="handleChange"
            @blur="inputTextBol = true"
            @focus="inputTextBol = false"
          />
        </div>
      </div>
    </div>
    <div class="conversation-container-content">
      <el-scrollbar
        ref="scrollContainer"
        :vertical="false"
        class="conversation-container-content-scroll"
      >
        <!-- <div class="conversation-container-content"> -->
        <div
          v-for="(item, index) in newgetTypeAIList"
          :id="item.id"
          :key="index"
          :class="{
            'content-item': true,
            'content-top': item.type === 'AI',
            'content-item-topSort': item.isTopping,
            'content-item-select': item.checked && !isAICenter
          }"
          @click="change(index)"
        >
          <div v-if="item.isDeleted === 1" class="content-item-isDeleted" />
          <img
            v-if="item.type === 'AI'"
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

          <div style="width: 130px">
            <div class="title">
              <textShowMore :line-clamp="1" :text="item.name" />
            </div>
            <div class="describe text_hidden_1">
              <!-- <textShowMore :line-clamp="1" :text="item.describe" /> -->
              {{ item.describe }}
            </div>
          </div>

          <!-- 助手操作点击。。。 -->
          <div
            id="btnTextWarp"
            class="btnText"
            @mouseover="handlehover(item)"
            @mouseleave="mouseleave"
          >
            <div v-if="index !== 0 && !searchText" class="actionBtns">
              <img
                v-show="showactive.active === item.id || active === item.id"
                id="imgaction"
                src="@/assets/image/aigc/action.png"
                alt=""
                @click.stop="handleAction(item, $event)"
              />
            </div>
          </div>
          <!-- 助手操作展开列表 -->
          <div
            v-if="showactive.active === item.id"
            :class="btnTextWarpName"
            class="actionBtnsTextWarp"
          >
            <div
              v-if="!item.isTopping"
              class="actionBtnsText"
              @click.stop="handleTop(item)"
            >
              <img src="@/assets/image/aigc/top.png" alt="" />
              <span>置顶</span>
            </div>
            <div
              v-if="!!item.isTopping"
              class="actionBtnsText"
              @click.stop="cancelTop(item)"
            >
              <img src="@/assets/image/aigc/notop.png" alt="" />
              <span>取消置顶</span>
            </div>
            <div class="actionBtnsText" @click.stop="handleDel(item)">
              <img src="@/assets/image/aigc/delAi.png" alt="" />
              <span style="color: #f53f3f">移除助手</span>
            </div>
          </div>

          <!-- <div v-if="item.type === 'AI'" class="boedertop" /> -->
        </div>
        <!-- 数据为空展示 -->
        <div v-if="newgetTypeAIList.length < 1" class="examineNull">
          <el-empty :image-size="100" description="暂无数据" />
        </div>
        <div class="conversation-container-footer">
          <div
            class="conversation-container-footer-box"
            :class="{ active: isAICenter }"
            @click="onhandleClickAICenter"
          >
            <img src="@/assets/image/aigc/aiCenter.png" />
            <div>助手中心</div>
          </div>
          <div class="line-bottom" />
        </div>
        <!-- </div> -->
      </el-scrollbar>
    </div>
    <videoGuide v-if="isShowVideoGuide" @ok="nextGuide(2)" />
    <modelChangeGuide v-if="isShowModelChangeGuide" @ok="nextGuide(1)" />
    <imageGenerateGuide v-if="isShowImageGenerateGuide" @ok="nextGuide(3)" />
  </div>
</template>
<script>
import videoGuide from '../guides/videoGuide.vue'
import modelChangeGuide from '../guides/modelChangeGuide.vue'
import imageGenerateGuide from '../guides/imageGenerateGuide.vue'
// import { setUserTop } from '@/api/aigc/standardIssueConfig'
import textShowMore from '@/components/textShowMore/index2.vue'
import { mapGetters, mapState } from 'vuex'
import {
  removeAssistant,
  topAssistant,
  assistantCancelTop
} from '@/api/aigc/index'
import { PopupManager } from 'element-ui/src/utils/popup'
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
    'setIsAIEnd',
    'removeChatMessageItem',
    'setIndexChatCustomKeyMessage',
    'initPage',
    'closeWS',
    'setTypeAIList',
    'getEnableModels'
  ],
  components: {
    videoGuide,
    modelChangeGuide,
    imageGenerateGuide,
    textShowMore
  },
  data() {
    return {
      zIndex: 6000,
      showBtn: true,
      inputTextBol: true,
      isShowVideoGuide: false,
      isShowModelChangeGuide: false,
      isShowImageGenerateGuide: false,
      searchText: '',
      newTypeAIList: [],
      active: '',
      showactive: {
        active: ''
      },
      btnTextWarpName: ''
    }
  },
  created() {
    // const status = localStorage.getItem('AIGuideStatus')
    // if (status === '1') {
    //   this.isShowVideoGuide = true
    // } else if (status === '2') {
    //   this.isShowImageGenerateGuide = true
    // } else if (!status) {
    //   this.isShowModelChangeGuide = true
    // }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState({
      isAICenter: state => state.ai.isAICenter
    }),
    newgetTypeAIList() {
      if (this.searchText) return this.newTypeAIList
      return this.getTypeAIList
    },
    viewerZIndex() {
      const nextZIndex = PopupManager.nextZIndex()
      return this.zIndex > nextZIndex ? this.zIndex : nextZIndex + 1000
    }
  },
  watch: {
    getTypeAIList: {
      handler(list) {
        if (list.length) {
          console.log(list, 'list')
          const items = list.find(item => item.checked)
          console.log(items, 'items')
          this.scrollToTop(items.id)
          this.$store.dispatch('ai/setAICenter', false)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    document.body.addEventListener('click', this.closeModel, true)
  },
  methods: {
    getTop(top) {
      const windHeight = document.body.clientHeight
      const markHeight = 82
      console.log(windHeight, markHeight, top)
      if (Number(markHeight + top) >= windHeight) {
        return 'btnTextWarp-top'
      } else {
        return 'btnTextWarp-bottom'
      }
    },
    handleAction(item, event) {
      this.btnTextWarpName = this.getTop(event.pageY)
      if (this.showactive.active === item.id) {
        this.showeactive = {}
      } else {
        this.showactive = { active: item.id }
      }
    },
    closeModel(e) {
      if (e.target.id !== 'imgaction') {
        this.showactive = ''
      }
      if (e.target.id !== 'btnTextWarp' && e.target.id !== 'btnTextWarp') {
        this.active = ''
      }
    },
    mouseleave() {
      this.active = ''
      // this.showactive = ''
    },
    handlehover(item) {
      if (item.id === this.active.id) {
        this.active = ''
      } else {
        this.active = item.id
      }
    },
    scrollToTop(itemId) {
      this.$nextTick(() => {
        setTimeout(() => {
          const element = document.getElementById(itemId)
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
          }
        }, 500)
      })
    },
    handleChange() {
      this.newTypeAIList = this.getTypeAIList.filter(
        item => ~item.name.indexOf(this.searchText)
      )
    },
    async cancelTop(data) {
      const { userTemplateId } = data
      const prame = {
        id: userTemplateId
      }
      const { code } = await assistantCancelTop(prame)
      if (code === 1) {
        this.searchText = ''
        this.setTypeAIList()
        this.showBtn = false
        this.$message.success({
          message: '已取消置顶',
          customClass: 'amap-sug-result'
        })
      }
    },
    async handleTop(data) {
      // const { id, topSort } = data
      // const prame = {
      //   isTop: !topSort,
      //   templateId: id
      // }
      // const { code } = await setUserTop(prame)
      // if (code === 1) {
      //   this.searchText = ''
      //   this.setTypeAIList()
      //   this.showBtn = false
      //   if (!topSort) return this.$message.success('置顶成功')
      //   this.$message.success('已取消置顶')
      // }
      const { userTemplateId } = data
      const prame = {
        id: userTemplateId
      }
      const { code } = await topAssistant(prame)
      if (code === 1) {
        this.searchText = ''
        this.setTypeAIList()
        this.showBtn = false
        this.$message.success({
          message: '置顶成功',
          customClass: 'amap-sug-result'
        })
      }
    },
    nextGuide(index) {
      if (index === 1) {
        this.isShowModelChangeGuide = false
        localStorage.setItem('AIGuideStatus', '1')
        this.isShowVideoGuide = true
      } else if (index === 2) {
        this.isShowVideoGuide = false
        localStorage.setItem('AIGuideStatus', '2')
        this.isShowImageGenerateGuide = true
      } else if (index === 3) {
        localStorage.setItem('AIGuideStatus', '3')
        this.isShowImageGenerateGuide = false
      }
    },
    async change(index) {
      const list = this.searchText ? this.newTypeAIList : this.getTypeAIList
      // 第三方链接直接跳转
      if (list[index]?.classify === 2) {
        window.open(list[index].content)
        return
      }

      this.closeWS()
      if (!this.getIsAIEnd()) {
        this.stopAIOut()
      }
      this.$store.commit('ai/SET_ATCENTER', false)
      this.$uweb && this.$uweb.setAction('Event_sidebar_click_my_ai')
      this.$uweb && this.$uweb.setAction('Event_my_ai_click')
      this.setDisabledInput(false)
      if (list[index].checked) {
        return
      }

      // 存储当前选中的助手
      this.$store.dispatch('ai/setScene', list[index])

      this.clearChatMessage()

      this.clearChatMessage()
      this.setChatMessage({
        type: 'welcome',
        test: '',
        hasNew: true
      })

      list[index].checked = true
      this.newTypeAIList?.forEach(item => {
        item.checked = item?.id === list[index].id
      })
      this.getTypeAIList.forEach(item => {
        item.checked = item?.id === list[index].id
      })

      this.getEnableModels()

      if (this.getTypeAIList[index].id === '20') {
        this.$emit('setWordExtractIndex', index)
      }

      if (this.getTypeAIList[index].id !== '20') {
        this.getHistory(undefined, list[index]).then(_ => {
          this.$emit('change')
        })
      }
    },
    stopAIOut() {
      if (
        this.getChatMessageList[this.getChatMessageList.length - 1].text
          .length < 1
      ) {
        this.removeChatMessageItem(this.getChatMessageList.length - 1, 1)
      } else {
        this.setIndexChatCustomKeyMessage(
          'tmpIsOk',
          this.getChatMessageList.length - 1,
          true
        )
        this.setIndexChatCustomKeyMessage(
          'isHistory',
          this.getChatMessageList.length - 1,
          true
        )
      }

      this.setIsAIEnd(true)
      this.setDisabledInput(false)
      this.closeWS()
    },
    // 点击助手中心
    onhandleClickAICenter() {
      if (!this.getIsAIEnd()) {
        this.stopAIOut()
      }
      this.$store.dispatch('ai/setAICenter', true)
      this.$parent.isShow = false
      // this.setDisabledInput(false)
      // 存储当前选中的助手
      // this.$store.dispatch('ai/setScene', undefined)
    },
    // 点击移除助手
    handleDel(item) {
      console.log(item, 'item')
      this.$delModal({
        tips: `确定移除该助手吗？`,
        success: () => {
          const data = {
            id: item.userTemplateId
          }
          removeAssistant(data).then(res => {
            this.setTypeAIList()
            if (item.checked) {
              this.change(0)
            }
          })
        }
      })
    },
    // 通过id打开对应助手
    changeAiById(id) {
      console.log(id, 'id通过id打开对应助手')
      const index = this.newgetTypeAIList.findIndex(v => v.id === id)
      console.log(index, '通过id打开对应助手')
      if (index > -1) {
        this.change(index)
      } else {
        this.change(0)
      }
      // this.$store.dispatch('ai/setAICenter', false)
    }
  }
}
</script>
<style scoped lang="scss">
.conversation-container {
  width: 100%;
  height: 100%;

  .title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2; /* 指定最大行数 */
  }
  .conversation-container-header {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    > .boxTitle {
      margin-bottom: 82px;
      width: 100%;
      display: flex;
      height: 50px;
      align-items: center;
      justify-content: flex-start;
      padding-left: 36px;
      border-bottom: 1px solid #f0f0f0;
      > img {
        width: 48px;
        height: 48px;
        margin-right: 10px;
      }
      > span {
        font-size: 16px;
        font-family: HiraginoSansGB, HiraginoSansGB;
        font-weight: bold;
        color: #3a7fff;
        line-height: 24px;
      }
    }
    .searchBoxView {
      width: 100%;
      border-right: 1px solid #f0f0f0;
    }
    .searchBox {
      width: 240px;
      height: 32px;
      // margin-top: 24px;
      // margin-bottom: 12px;
      margin: 20px auto 20px;
      background: #ffffff;
      border-radius: 6px;
      border: 1px solid #c2d9ff;
      backdrop-filter: blur(10px);
      display: flex;
      position: relative;
      justify-content: center;
      .searchText {
        display: flex;
        align-items: center;
        > img {
          width: 16px;
          height: 16px;
        }
        > span {
          margin-left: 2px;
          font-size: 14px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 20px;
        }
      }
      > input {
        font-size: 12px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba($color: #000000, $alpha: 0);
        text-indent: 10px;
      }
    }
  }
  .conversation-container-content {
    width: 100%;
    height: calc(100% - 204px);
    border-right: 1px solid #f0f0f0;
    // 隐藏滚动条
    -ms-overflow-style: none;
    position: relative;
    scrollbar-width: none;
    .conversation-container-content-scroll {
      width: 100%;
      height: calc(100% - 20px);
      // padding: 0 20px;
      padding: 0 20px 0px;
    }
    &::-webkit-scrollbar {
      display: none;
    }
    overflow-y: auto;
    .boedertop {
      border-top: 1px dashed #d3d7d8;
      position: absolute;
      width: 235px;
      top: 72px;
      left: 1px;
    }
    .content-item {
      width: 240px;
      height: 72px;
      background: #ffffff;
      border-radius: 6px;
      // border: 1px solid #c2d9ff;
      position: relative;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      position: relative;
      img {
        width: 44px;
        height: 44px;
        margin-right: 10px;
        border-radius: 50%;
      }
      span {
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #313233;
      }
      .title-span {
        margin-right: 10px;
        width: 44px;
        min-width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }
      .btnText {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        position: absolute;
        cursor: pointer;
        right: 0;
        min-height: 60px;
        width: 100px;
        height: 100%;
        justify-content: center;
        // width: 40px;
        top: 0;
        z-index: 2;
        .actionBtns {
          // height: 52px;
          display: block;
          // padding: 0 0 20px 20px;
          // margin-top: 20px;
          > img {
            width: 36px;
            height: 36px;
          }
        }
      }
      &:hover {
        cursor: default;
        // border: 1px solid #a3c6ff;
        background: #f0f6ff;
        .title {
          color: #3a7fff;
          ::v-deep {
            .showMore {
              color: #3a7fff;
              font-weight: bolder;
            }
          }
        }
      }
    }
    .content-top {
      // background: #F7F7F7;
      // margin-bottom: 25px !important;
      background: #f7f7f7;
    }
    .actionBtnsTextWarp {
      width: 146px;
      box-shadow: 0px 2px 4px 0px rgba(194, 194, 194, 0.5);
      border: 1px solid #d3d7d8;
      position: absolute;
      height: auto;
      border-radius: 6px;
      z-index: 9999;
      right: 0;
      top: 50px;
      overflow: hidden;
    }
    .btnTextWarp-top {
      top: -65px;
    }
    .btnTextWarp-bottom {
      top: 50px;
    }
    .actionBtnsText {
      align-items: center;
      display: flex;
      background: #ffffff;
      width: 146px;
      height: 40px;
      box-shadow: 0px 2px 4px 0px rgba(194, 194, 194, 0.5);
      cursor: pointer;
      // border-radius: 6px;
      // border: 1px solid #d3d7d8;
      // position: absolute;
      // z-index: 9999;
      // right: 0;
      // top: 50px;
      // &:active {
      //   opacity: 0;
      //   display: none;
      // }
      > img {
        width: 20px;
        height: 20px;
        margin-left: 9px;
      }
      > span {
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #313233;
        line-height: 20px;
      }
      &:hover {
        background: #f1f1f1;
        color: #313233;
      }
    }
    .content-item-select {
      background: #c8dafe !important;
      .title {
        // font-size: 14px;
        // font-weight: 500;
        // font-size: 14px;
        // font-weight: 500;
        // color: #3A7FFF!important;
        // line-height: 20px;
      }
      .describe {
        // font-size: 14px;
        // font-family: PingFangSC, PingFang SC;
        // font-weight: 400;
        color: #595959;
      }
    }
    .content-item-topSort {
      // background: #ededed;
      background: #f7f7f7;
    }
    .content-item-isDeleted {
      position: absolute;
      right: 0;
      // top: 11px;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 43px;
      background-image: url(../../../../assets/image/aigc/aiStop.png);
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
  .conversation-container-footer {
    position: fixed;
    top: 50px;
    left: 20px;
    width: 260px;
    z-index: 3;
    padding-bottom: 20px;
    // border-bottom: 1px dotted #D3D7D8;
    padding-top: 20px;
    border-right: 1px solid #f0f0f0;
    .conversation-container-footer-box {
      width: 240px;
      height: 42px;
      background: #3a7fff;
      border-radius: 6px;
      // margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      line-height: 22px;
      cursor: pointer;
      > img {
        height: 28px;
        margin-right: 8px;
      }
      &:hover {
        background: #2866d8;
      }
    }
    .line-bottom {
      position: absolute;
      bottom: -1px;
      left: 0;
      // background: #D3D7D8;
      height: 1px;
      width: 240px;
      border-bottom: 1px dotted #d3d7d8;
    }
    > .active {
      background: #2866d8;
    }
  }
  .examineNull {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .title {
    ::v-deep {
      .showMore {
        font-size: 16px;
        font-weight: bolder;
        color: #333333;
      }
    }
  }
  .describe {
    font-size: 14px;
    color: #595959;
    ::v-deep {
      .showMore {
        font-size: 14px;
        color: #595959;
      }
    }
  }
}
::v-deep {
  .el-scrollbar__wrap {
    margin-right: -37px !important;
  }
  .el-scrollbar__view {
    min-height: 100%;
  }
}
</style>
