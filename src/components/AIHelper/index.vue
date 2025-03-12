<template>
  <div
    v-if="getAuthorityShowAI"
    :class="{
      'ai-helper-container': true,
      'ai-mask': visibleSlideBar || visibleFullScreen
    }"
  >
    <AiIcon
      v-if="showAI && showAIIcon && !ifClose"
      @mousedown.native="mousedownIcon"
      @mouseup.native="mouseupIcon"
    />
    <!-- <div
      v-if="showAI"
      id="aiSideId"
      ref="aiSideRef"
      :class="{
        'express-entrance': true,
        flex: true,
        'items-center': true,
        'cursor-pointer': true,
        'express-entrance-hover': !isMoveAIIcon && !isShowInletAI,
        hideAfter: isMoveAIIcon
      }"
      title="快捷键：CTRL+M"
      @click="handleClickEnterAiHelper"
      @mousedown="mousedownIcon"
    >
      <div class="entrance-item">
        <img class="icon" src="@/assets/image/aigc/icon.png" alt="">
        <img class="hovericon" src="@/assets/image/aigc/hovericon.png" alt="">
        <i class="el-icon-error hover-close" @click="closeAI" />
      </div>
    </div> -->
    <slide-bar v-if="visibleSlideBar" />
    <full-screen v-if="visibleFullScreen" ref="fullScreen" />
    <inletAI
      v-if="isShowInletAI && getAuthorityShowAI"
      @ok="isShowInletAI = false"
    />
    <copy-content-detection-dialog v-if="getAuthorityShowAI" />
  </div>
</template>
<script>
import hotkeys from 'hotkeys-js'
import SlideBar from './SlideBar/index.vue'
import FullScreen from './FullScreen/index.vue'

import eventBus from '@/utils/eventBus'
import {
  generatRandomKey,
  encryptRequestBody,
  encryptSymmetricKey
} from '@/utils/crypto'
import AiIcon from '@/components/AIHelper/components/AiIcon/index.vue'
import inletAI from '@/components/AIHelper/components/guides/inletAI.vue'
import { mapGetters, mapState } from 'vuex'
import {
  getHistory,
  getEnableModels,
  conversationNew,
  wsOnErrorEvent
} from '@/api/aigc'
import { qryShortcutKey } from '@/views/videoEditor/api/keyboard'
import CopyContentDetectionDialog from '@/components/CopyContentDetectionDialog/index.vue'
// import { aiSessionTemplatePage } from '@/api/aigc/standardIssueConfig'
import { getMyAssistantUsedList } from '@/api/aigc/index.js'
import { PopupManager } from 'element-ui/src/utils/popup'
import { EnableModels } from '@/api/aigc/chatExtract'
export default {
  // 为组件注入父级方法/实例/属性
  provide() {
    return {
      /**
       * 全屏
       */
      activeFullScreen: this.activeFullScreen,
      /**
       * 打开小屏
       */
      openSlideBar: this.openSlideBar,
      /**
       * 关闭全屏
       */
      closeFullScreen: this.closeFullScreen,
      /**
       * 关闭小屏
       */
      closeSlideBar: this.closeSlideBar,
      /**
       * 关闭所有
       */
      closeALL: this.closeALL,
      /**
       * 是否全屏
       */
      isFullScreen: this.getIsFullScreen,
      /**
       * 获取聊天消息
       */
      getChatMessageList: this.getChatMessageList,
      /**
       * 新增聊天消息
       */
      setChatMessage: this.setChatMessage,
      /**
       * 清空聊天消息
       */
      clearChatMessage: this.clearChatMessage,
      /**
       * 获取聊天助手
       */
      getTypeAIList: this.getTypeAIList,
      /**
       *  ws实例
       */
      getWS: this.getWS,
      /**
       * 创建WebSocket
       */
      createWS: this.createWS,
      /**
       * 设置禁用输入框
       */
      setDisabledInput: this.setDisabledInput,
      /**
       * 获取禁用输入框值
       */
      getDisabledInput: this.getDisabledInput,
      /**
       * 获取显示重启会话按钮
       */
      getIsRestart: this.getIsRestart,
      /**
       * 设置显示重启会话按钮
       */
      setIsRestart: this.setIsRestart,

      /**
       *  修改聊天消息对象 -自定义修改字段
       */
      setIndexChatCustomKeyMessage: this.setIndexChatCustomKeyMessage,
      /**
       * 删除聊天消息对象
       */
      removeChatMessageItem: this.removeChatMessageItem,
      /**
       * 重置聊天消息对象-TmpIsOk属性
       */
      resetChatMessageListTmpIsOk: this.resetChatMessageListTmpIsOk,
      /**
       * 获取历史记录
       */
      getHistory: this.getHistory,
      /**
       * 刷新列表
       */
      setTypeAIList: this.setTypeAIList,
      /**
       * 获取ai回答结束标识
       */
      getIsAIEnd: this.getIsAIEnd,
      /**
       * 设置ai回答结束标识
       */
      setIsAIEnd: this.setIsAIEnd,
      /**
       * 关闭ws
       */
      closeWS: this.closeWS,
      setTmpMessage: this.setTmpMessage,
      /**
       * 设置模型类型
       */
      setModelType: this.setModelType,
      /**
       * 获取模型类型
       */
      getModelType: this.getModelType,
      /**
       * 获取模型列表
       */
      getModelList: this.getModelList,
      /**
       * 获取自定义列表
       */
      openCustomComponent: this.openCustomComponent,
      /**
       * 重置AI
       */
      resetSessionAI: this.resetSessionAI,
      initPage: this.init,
      /**
       * 使用对应的ui，用于助手中心
       */
      useAssistant: this.useAssistant,
      /**
       * 心跳监听
       */
      ws_heartCheck: this.ws_heartCheck,
      getEnableModels: this.getEnableModels,
      setHints: this.setHints
    }
  },
  components: {
    SlideBar,
    FullScreen,
    inletAI,
    AiIcon,
    CopyContentDetectionDialog
  },
  data() {
    return {
      zIndex: 6000,
      showAI: true,
      visibleSlideBar: false,
      visibleFullScreen: false,
      ws: null,
      typeAIList: [],
      permsList: this.$route?.meta?.permsList || [],
      /**
       * 聊天消息列表
       * @type {Array}
       * @property {String} type 消息类型
       * type: 'welcome' /'ai' /'user'/'customTmp'
       * @property {String} text 消息内容
       * @property {String} status  消息状态  PENDING: 发送中 DONE: 发送完成
       */
      chatMessageList: [],
      disabledInput: false,
      isRestart: false,
      pageIndex: 1,
      // 热键冲突设置
      hotkeysConflictSettings: [],
      // 不需要显示助手的路由
      notRouters: ['/login', '/auth-redirect', '/loginByPassword', '/404'],
      // 有助手但是没有图标的路由
      notIconRouter: ['/ai/share'],
      isAIEnd: true,
      // 临时消息存储
      tmpMessage: null,
      intervalAI: undefined,
      // 拼接时字符串下标 拼接完成后清空
      joinIndex: 0,
      modelType: undefined,
      modelList: [],
      isMoveAIIcon: false,
      oldY: 0,
      oldX: 0,
      isShowInletAI: false,
      aiZhiyun: {
        backgroundColor: '#CFF3FF',
        content: '无',
        count: 1,
        createdNickName: null,
        createTime: '2023-11-21 11:40:33',
        description: '全能AI小助手，解决你的所有问题！',
        icon: 'https://oss.hokkj.cn/hok_product/video/img_v3_0263_d6185f8b-c4cf-4a35-87d3-da0fbcf117dg.png',
        templateId: '1',
        isEnabled: true,
        isPrivate: false,
        issueList: null,
        jobNameList: null,
        sort: 0,
        textColor: '#00ADFF',
        title: '智云',
        topSort: null,
        topTime: null,
        type: 1,
        useCounter: ''
      },
      ws_heartCheck: {
        timeout: 30000, // 30秒一次心跳
        timeoutObj: null, // 执行心跳的定时器
        serverTimeoutObj: null, // 服务器超时定时器
        reset: function () {
          // 重置方法
          console.log('清空心跳定时器')
          clearTimeout(this.timeoutObj)
          clearTimeout(this.serverTimeoutObj)
          return this
        },
        start: function (ws) {
          // 启动方法
          // var self = this
          this.timeoutObj = setTimeout(function () {
            // 这里发送一个心跳信息，后端收到后，返回一个消息，在onmessage拿到返回的心跳（信息）就说明连接正常
            ws.send(
              JSON.stringify({
                user: 'check',
                scene_id: -1,
                llm_type: -1,
                qa_mode: 'check',
                chat_template: null
              })
            )
            console.log('发送心跳包')
            // 如果超过一定时间还没重置，说明后端主动断开了
            // self.serverTimeoutObj = setTimeout(function() {
            // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            // ws.close()
            // }, self.timeout)
          }, this.timeout)
        }
      },
      // 切换模型 语料库
      Hints: {},
      thinkList: '',
      textList: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permission_routes']),
    ...mapState({
      roles: state => state.permission.addRouters,
      ifClose: state => state.ai.ifClose
    }),
    getTypeAIList() {
      return this.typeAIList
    },
    getChatMessageList() {
      return this.chatMessageList
    },
    getAuthorityShowAI() {
      // return true
      // WEBPERMISSION
      const info = this.permission_routes?.find(v => v.path === 'component')
      let isPermission = false
      if (info) {
        isPermission = info.meta
          ? info.meta.permsList.filter(f => f === 'system:ai:assistant')
            .length > 0
          : false
      }
      return (
        this.notRouters.indexOf(this.$route.path) === -1 &&
        !!this.$store.getters.token &&
        isPermission
      )
    },
    getIsShowDouyinBZhangGuide() {
      return this.getTypeAIList.find(
        item => item.checked && item.assistantType === 'VideoExtract'
      )
    },
    showAIIcon() {
      return this.notIconRouter.indexOf(this.$route.path) === -1
    },
    viewerZIndex() {
      const nextZIndex = PopupManager.nextZIndex()
      return this.zIndex > nextZIndex ? this.zIndex : nextZIndex + 1000
    }
  },
  watch: {
    '$route.path': {
      handler(val) {
        if (
          this.notRouters.indexOf(val) === -1 &&
          !!this.$store.getters.token
        ) {
          this.getEnableModels()
          if (this.hotkeysConflictSettings.length < 1) {
            this.initHotkeys()
          }
        }
      },
      deep: true
    },
    visibleFullScreen(val) {
      if (val) {
        this.getEnableModels()
      }
    }
  },
  created() {
    eventBus.$on('externalSend', this.externalSend)
    eventBus.$on('aiOpen', this.aiOpen)
    eventBus.$on('aiVideoExtractOpen', this.aiVideoExtractOpen)
    eventBus.$on('useAi', this.useAi)
    // 监听浏览器后退事件
    window.addEventListener('popstate', this.onPopState)
  },
  destroyed() {
    eventBus.$off('externalSend', this.externalSend)
    eventBus.$off('aiOpen', this.aiOpen)
    eventBus.$off('aiVideoExtractOpen', this.aiVideoExtractOpen)
    eventBus.$off('useAi', this.useAi)
  },
  mounted() {
    if (this.$store.getters.token) this.setHints()
  },
  methods: {
    async setHints() {
      const flag = localStorage.getItem('custom') === 'true'
      const { code, data } = flag
        ? await EnableModels()
        : await getEnableModels()

      const llmDict = {}
      if (code === 1) {
        data.forEach(item => {
          // 提取llmType和modelDescribe
          const llmType = item.llmType
          const modelDescribe = item.modelDescribe

          // 将llmType作为键，modelDescribe作为值存储到字典中
          llmDict[llmType] = modelDescribe
        })

        this.Hints = llmDict
      }
    },
    // 浏览器返回控制
    onPopState() {
      if (this.visibleFullScreen) {
        const url = `${window.location.origin}/#${this.$route.fullPath}`
        window.history.pushState(null, null, url)
        this.visibleFullScreen = false
      }
    },
    async resetSessionAI() {
      const ais = this.chatMessageList
      const lastMsgInfo = ais[ais.length - 1]
      lastMsgInfo.isHistory = true

      if (lastMsgInfo?.hasNew) return
      if (lastMsgInfo?.id && !lastMsgInfo?.hasNew) {
        ais[ais.findIndex(f => f.id === lastMsgInfo.id)].hasNew = true
        await conversationNew(lastMsgInfo.id)
      }

      this.setChatMessage({
        type: 'G',
        isNewChat: true,
        text: '全新的开始',
        isHistory: true,
        hasNew: true
      })
      this.setChatMessage({
        type: 'ai',
        text: `上下文已经清除，请开始你的全新对话吧！`,
        isHistory: true,
        hasNew: true
      })
    },
    // 判断文本是否包含网址且替换成a标签
    // isUrl(val) {
    //   let str = val
    //   const regex =
    //     /([^\u4e00-\u9fa5():：,!@#$%^&*?.\s-]([^\u4e00-\u9fa5()：,!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}(\/\S*)?/gi
    //   console.log('11111', regex)
    //   str = str.replace(regex, val => {
    //     const list = val.split(':')
    //     let url = val
    //     // let residue = ''
    //     if (val.includes(':')) {
    //       if (list[0] !== 'http' && list[0] !== 'https') {
    //         url = list[1]
    //         // residue = list[0] + ':'
    //       }
    //     }
    //     if (url.indexOf(')') !== -1) {
    //       url = url.substr(0, url.length - 1)
    //     }

    //     // return `${residue}<a style="color:#3A7FFF" target="_blank"  href="${url}">${url})</a>`
    //     return `<a style="color:#3A7FFF" target="_blank"  href="${url}">${url})</a>`
    //   })
    //   return str
    // },
    setAllHistoryList() {
      this.chatMessageList.forEach((item, index) => {
        if (
          (item.type === 'ai' || item.type === 'customTmp') &&
          index < this.chatMessageList.length - 1
        ) {
          item.isHistory = true
        }
      })
    },
    openCustomComponent(text) {
      const info = this.getTypeAIList.find(item => item.checked)
      const str = info.content
      const list = []
      const ignoreList = ['ImageGeneration', 'VideoExtract']
      if (
        str &&
        str.length > 0 &&
        (ignoreList.filter(f => f === info.assistantType).length < 1 || text)
      ) {
        const regex = /\【.*?\】/g
        const matches = str.match(regex)
        const count = matches ? matches.length : 0
        if (count > 0) {
          matches.forEach((item, index) => {
            list.push({
              name: 'el-input',
              value: text && index === 0 ? text : '',
              type: 'textarea',
              props: {
                maxlength: this.getIsShowDouyinBZhangGuide ? undefined : 2000,
                'show-word-limit': true,
                resize: 'none',
                class: ['custom-input'],
                autosize: { minRows: 1, maxRows: 6 },
                placeholder: item.replace(/\【/g, '').replace(/\】/g, '')
              },
              info: { ...info, headerTitle: info.title.split('')[0] }
            })
          })
        }
      }
      return list
    },
    aiVideoExtractOpen(text) {
      if (!this.isAIEnd) return
      this.$store.dispatch('ai/setAiShowType', 0)
      this.visibleFullScreen = true
      this.init('20')
      this.$nextTick(() => {
        setTimeout(() => {
          eventBus.$emit('WordExtractSend', { value: text })
        }, 1000)
      })
    },
    // 0-大屏 1-小屏
    aiOpen(type) {
      console.log(type)
      if (type === 0) {
        this.$store.dispatch('ai/setAiShowType', 0)
        this.visibleFullScreen = true
      }
      if (type === 1) {
        this.$store.dispatch('ai/setAiShowType', 1)
        this.visibleSlideBar = true
      }
      this.init()
    },
    mouseupIcon(e) {
      console.log('111')
      if (this.oldX === e.clientX && this.oldY === e.clientY) {
        this.handleClickEnterAiHelper()
      }
      setTimeout(() => {
        this.isMoveAIIcon = false
      })
      document.body.setAttribute('style', 'cursor: default;')
      // document.getElementById('aiSideId').style.right = undefined
      // document.removeEventListener('mousemove', this.setStyleAI)
      // document.removeEventListener('mouseup', this.mouseupIcon)
    },
    mousedownIcon(e) {
      this.oldY = e.clientY
      this.oldX = e.clientX
      // document.getElementById('aiSideId').style.top = this.oldY
      // document.addEventListener('mousemove', this.setStyleAI)
      // document.addEventListener('mouseup', this.mouseupIcon)
    },
    // setStyleAI(e) {
    //   if (Math.abs(e.clientY - this.oldY) < 1) return
    //   this.isMoveAIIcon = true
    //   document.getElementById('aiSideId').style.bottom = 'initial'
    //   document.body.setAttribute('style', 'cursor: move;')
    //   document.getElementById('aiSideId').style.top =
    //     e.clientY < 50
    //       ? '55px'
    //       : e.clientY > document.body.clientHeight - 40
    //         ? document.body.clientHeight - 40 + 'px'
    //         : e.clientY + 'px'
    // },
    getEnableModels() {
      const getLocalModelType = localStorage.getItem(
        'modelTypeAIv1.2.3' + this.$store.getters.userInfo.userId
      )
      const getLocalModelTypeCustom = localStorage.getItem(
        'modelTypeAIv1.2.3_custom' + this.$store.getters.userInfo.userId
      )

      setTimeout(() => {
        if (localStorage.getItem('custom') === 'true') {
          EnableModels().then(res => {
            this.modelList =
              res.data.map((m, i) => ({
                ...m,
                isSelect: getLocalModelTypeCustom
                  ? m.llmType === Number(getLocalModelTypeCustom)
                  : i === 0
              })) || []

            this.modelType = this.modelList.find(f => f.isSelect).llmType
          })
        } else {
          getEnableModels().then(res => {
            this.modelList =
              res.data.map((m, i) => ({
                ...m,
                isSelect: getLocalModelType
                  ? m.llmType === Number(getLocalModelType)
                  : i === 0
              })) || []

            this.modelType = this.modelList.find(f => f.isSelect).llmType
          })
        }
      }, 200)
    },
    getModelList() {
      return this.modelList
    },
    getModelType() {
      return this.modelType
    },
    async setModelType(type, index) {
      console.log(type)
      if (
        this.modelList.find(f => f.isSelect).llmType ===
        this.modelList[index].llmType
      ) {
        return
      }
      const pointObj = {
        2: () => {
          this.$uweb && this.$uweb.setAction('Event_model_change_GPT4')
        },
        3: () => {
          this.$uweb && this.$uweb.setAction('Event_model_change_xinhuo')
        },
        4: () => {
          this.$uweb && this.$uweb.setAction('Event_model_change_Claude2')
        },
        9: () => {
          this.$uweb && this.$uweb.setAction('Event_Model_Toogle_WenXin')
        },
        10: () => {
          this.$uweb && this.$uweb.setAction('Event_Model_Toogle_KIMI')
        }
      }
      pointObj[type] && pointObj[type]()

      if (localStorage.getItem('custom') === 'true') {
        localStorage.setItem(
          'modelTypeAIv1.2.3_custom' + this.$store.getters.userInfo.userId,
          type
        )
      } else {
        localStorage.setItem(
          'modelTypeAIv1.2.3' + this.$store.getters.userInfo.userId,
          type
        )
      }

      this.modelList.forEach((m, i) => {
        if (i === index) {
          m.isSelect = true
        } else {
          m.isSelect = false
        }
      })
      const ais = this.chatMessageList
      const lastMsgInfo = ais[ais.length - 1]
      lastMsgInfo.isHistory = true

      // if (lastMsgInfo?.hasNew) return
      if (lastMsgInfo?.id && !lastMsgInfo?.hasNew) {
        ais[ais.findIndex(f => f.id === lastMsgInfo.id)].hasNew = true
        await conversationNew(lastMsgInfo.id)
      }
      this.modelType = type
      this.setChatMessage({
        type: 'G',
        text: '模型切换: ' + this.modelList[index].displayName,
        isHistory: true,
        hasNew: true
      })
      this.setChatMessage({
        type: 'ai',
        // text: `已切换到大模型${this.modelList[index].displayName}，请开始你的全新对话吧！`,
        text: this.Hints[this.modelList[index].llmType],
        isHistory: true,
        hasNew: true
      })
    },
    async externalSend(record) {
      if (!this.visibleSlideBar) {
        await this.init()
        this.$nextTick(() => {
          this.openSlideBar()
        })
      }
      setTimeout(() => {
        eventBus.$emit('aiSend', { ...record })
      }, 1000)
    },
    openSlideBar() {
      this.$store.dispatch('ai/setAiShowType', 1)
      this.visibleSlideBar = true
    },
    setIsAIEnd(val) {
      if (!this.globalInterval) {
        clearInterval(this.globalInterval)
        this.globalInterval = null
      }
      // 修改ai回答过的数据为历史数据状态
      this.chatMessageList.forEach((item, index) => {
        if (
          (item.type === 'ai' || item.type === 'customTmp') &&
          index < this.chatMessageList.length - 1
        ) {
          item.isHistory = true
          // item.isShowCollect = false
        }
      })
      this.tmpMessage = null
      this.isAIEnd = val
    },
    getIsAIEnd() {
      return this.isAIEnd
    },
    async init(id = undefined) {
      this.clearChatMessage()

      this.typeAIList.length = 0
      // 在数组第一位插入我的AI助手
      // this.typeAIList.push({
      //   name: '我的AI助手',
      //   type: 'AI',
      //   icon: undefined,
      //   checked: true
      // })

      // 获取以前选中的助手
      const isScene = this.$store?.getters['ai/isScene']
      console.log(isScene, 'isScene')
      await this.getTemplatePage(id || isScene?.id)
      this.getHistory(undefined, isScene).then(res => {
        if (!res) {
          this.chatMessageList.push({
            type: 'welcome',
            hasNew: true
          })
        }
      })
    },
    setTypeAIList() {
      const isScene = this.$store?.getters['ai/isScene']
      return this.getTemplatePage(isScene?.id)
    },
    getHistory(isAddPageIndex, record, conversationId) {
      return new Promise((resolve, reject) => {
        if (isAddPageIndex) {
          this.$uweb?.setAction('Event_History_More')
          this.pageIndex++
        } else {
          this.pageIndex = 1
        }
        const tmp = this.getTypeAIList.find(item => item.checked) || record
        this.$store.dispatch('ai/setScene', tmp)

        getHistory({
          sceneId: tmp?.id,
          pageIndex: this.pageIndex,
          pageSize: 50,
          sort: 'desc',
          conversationId
        }).then(res => {
          if (res.code === 1) {
            const list = res.data
            if (list.length === 0) {
              if (!isAddPageIndex && conversationId) {
                this.clearChatMessage()
                this.chatMessageList.push({
                  type: 'welcome',
                  hasNew: true
                })
              }

              if (this.pageIndex > 1) {
                this.pageIndex--
              }
              resolve(false)
            } else {
              this.clearChatMessage()
              list.forEach((item, i) => {
                if (item.fileName) {
                  this.chatMessageList.unshift(
                    {
                      type: 'user',
                      text: item.userMsg,
                      messageType: item.fileName === '录音总结' ? '' : 'file',
                      fileExtension: item.format,
                      fileName: item.fileName,
                      fileSize: item.fileSize,
                      fileUrl: item.fileUrl,
                      format: item.format,
                      isHistory: true
                    },
                    {
                      type: 'ai',
                      text: item.assistant,
                      isHistory: true,
                      source: item.source,
                      isCollect: item.isStarred,
                      isLike: item.isLiked,
                      isNoLike: item.isDisliked,
                      tmpIsOk: true,
                      hasNew: item.hasNew,
                      isSendSelectedTopic: !this.isJsonArray(item.assistant),
                      id: item.conversationId
                    }
                  )
                } else {
                  this.chatMessageList.unshift(
                    {
                      type: 'user',
                      text: item.user,
                      isHistory: true
                    },
                    {
                      type: 'ai',
                      text: item.assistant,
                      isHistory: true,
                      source: item.source,
                      isCollect: item.isStarred,
                      isLike: item.isLiked,
                      isNoLike: item.isDisliked,
                      tmpIsOk: true,
                      hasNew: item.hasNew,
                      isSendSelectedTopic: !this.isJsonArray(item.assistant),
                      id: item.conversationId
                    }
                  )
                }

                if (i === list.length - 1) {
                  resolve(true)
                }
              })
            }
          }
        })
      })
    },
    isJsonArray(text) {
      try {
        const obj = JSON.parse(text)
        return Array.isArray(obj)
      } catch (e) {
        return false
      }
    },
    resetChatMessageListTmpIsOk() {
      for (const item of this.chatMessageList) {
        if (item.tmpIsOk) {
          item.tmpIsOk = false
        }
      }
    },
    setIsRestart(val) {
      this.isRestart = val
    },
    getIsRestart() {
      return this.isRestart
    },
    getDisabledInput() {
      return this.disabledInput
    },
    setDisabledInput(val) {
      this.disabledInput = val
    },
    setTmpMessage(record) {
      if (record.type === 'thinking') {
        this.thinkList += record.reply
        console.log(this.thinkList, 'this.22222')
      }
      if (!this.tmpMessage) {
        this.joinIndex = 0
        this.tmpMessage = { ...record, isEnd: true }
        // this.joinStr()
        setTimeout(() => {
          this.joinStr()
        }, 2000)
      } else {
        // 后端可能会返回两次结束标识数据 预防一下
        if (this.tmpMessage.status === 'DONE') {
          return
        }
        this.tmpMessage.applyType = record.applyType

        this.tmpMessage.reply += record.reply
        this.tmpMessage.status = record.status
      }
    },
    // 拼接字符串
    joinStr() {
      const iTime = this.getIsShowDouyinBZhangGuide ? 5 : 20
      this.intervalAI = setInterval(() => {
        const record = { ...this.tmpMessage }
        if (!record.reply || record.reply === '') {
          return
        }
        const textList = record.reply.split('')
        const textList2 = this.thinkList.split('')
        if (this.isAIEnd) {
          clearInterval(this.intervalAI)
          this.intervalAI = undefined
          return
        }

        if (this.joinIndex <= record.reply.length - 1) {
          this.setIndexChatMessage({
            ...record,
            reply: textList[this.joinIndex],
            replyThink: textList2[this.joinIndex] ? textList2[this.joinIndex] : ''
          })
          this.joinIndex++
        }
        if (
          this.joinIndex === record.reply.length &&
          record.status === 'DONE'
        ) {
          this.chatMessageList[this.chatMessageList.length - 1].source =
            record.source
          this.chatMessageList[this.chatMessageList.length - 1].tmpIsOk = true
          const str = this.chatMessageList[this.chatMessageList.length - 1].text
          this.chatMessageList[this.chatMessageList.length - 1].text = str
          this.setIsAIEnd(true)
          this.setDisabledInput(false)
          clearInterval(this.intervalAI)
          this.intervalAI = undefined
          this.thinkList = []
        }
      }, iTime)
    },
    getWS() {
      return this.ws
    },
    // 创建websocket
    createWS() {
      return new Promise((resolve, reject) => {
        try {
          const orgInfo = JSON.parse(localStorage.getItem('orgInfo'))
          // 备选机构Id
          const orgInfoStore = JSON.parse(localStorage.getItem('store'))
          // 生成随机密钥
          const { randomKey, symmetricKey } = generatRandomKey()
          // 加密对称密钥
          const secretKey = encryptSymmetricKey(symmetricKey)
          // 加密握手码
          const handshakeCode = encryptRequestBody(
            (orgInfo?.organizationId ||
              orgInfoStore?.institution?.orgInfo.tenantId) +
              ',' +
              this.userInfo.userId,
            randomKey
          )
          const url = process.env.VUE_APP_BASE_AI_URL

          this.ws = new WebSocket(
            `${url}/cloud/hok-ai/ws/chat/?time=${new Date().getTime()}`,
            [encodeURIComponent(secretKey), encodeURIComponent(handshakeCode)]
          )
          // 是否连接成功
          this.ws.onopen = () => {
            console.log('WebSocket success')
            this.ws_heartCheck.reset().start(this.ws)
            resolve(this.ws)
          }
          // 异常
          this.ws.onerror = event => {
            console.log(
              '%cws异常报错开始>>>>>>>>>>>>>',
              'background: red;padding:5px'
            )
            console.log(event)
            console.log(
              '<<<<<<<<<<<<<<<<<<%cws异常报错结束',
              'background: red;padding:5px'
            )
            const orgInfo = JSON.parse(localStorage.getItem('orgInfo'))
            const data = {
              eventStr: JSON.stringify(event, [
                'message',
                'arguments',
                'type',
                'name'
              ]),
              tenantId: orgInfo.organizationId,
              userId: this.userInfo.userId
            }
            // 上报错误日志
            wsOnErrorEvent(data)

            this.setIsAIEnd(true)
            if (this.chatMessageList.length > 0) {
              const info = this.chatMessageList[this.chatMessageList.length - 1]
              if (
                info.type === 'ai' &&
                !info.isHistory &&
                info.status === 'PENDING'
              ) {
                this.chatMessageList[this.chatMessageList.length - 1].text =
                  'AI连接异常，请重新提问！'
                this.chatMessageList[this.chatMessageList.length - 1].status =
                  'close'
                this.disabledInput = false
              }
            }
            this.closeWS()
            reject()
          }
          // 关闭
          this.ws.onclose = () => {
            this.closeWS()
            console.log('WebSocket close: 关闭连接/断开连接')
          }
        } catch (err) {
          reject()
          console.log(err, 'err')
        }
      })
    },
    closeWS() {
      this.ws_heartCheck.reset()
      this.ws && this.ws.close()
    },
    getColor() {
      return this.colors[Math.floor(Math.random() * this.colors.length)]
    },

    sortByDateDescending(arr) {
      return arr.sort((a, b) => {
        const dateA = new Date(a.topTime)
        const dateB = new Date(b.topTime)
        return dateB - dateA // 降序排序
      })
    },
    // 获取模板列表
    getTemplatePage(id) {
      return getMyAssistantUsedList({
        pageIndex: 1,
        pageSize: 1000000
        // isDeleted: 1
      }).then(res => {
        res.data.items.unshift(this.aiZhiyun)
        console.log(res, 'res+++++++++++++++')
        if (res.code === 1 && res.data.items.length > 0) {
          res.data.items.map(v => {
            v.id = v.templateId
            v.describe = v.description
            v.createNickName = v.createdNickName
            v.useCount = v.useCounter
            v.isDeleted =
              v.isDeleted ||
              (v.isPrivate && v.createdUserId !== this.userInfo.userId)
                ? 1
                : 0
          })
          const obj = {
            10: 'VideoExtract',
            11: 'ImageGeneration',
            14: 'Hotspot',
            20: 'WordExtract',
            21: 'EMOVideo'
          }
          this.typeAIList.length = 0
          const list = res.data.items.slice(1)
          const newlist = this.sortByDateDescending(list) || []
          // 判断
          const copyList = [res.data.items[0], ...newlist]
          this.typeAIList.push(
            ...copyList.map(item => ({
              ...item,
              name: item.title,
              icon: item.icon,
              type: item.id === '1' ? 'AI' : item.id,
              checked: id ? id === item.id : item.id === '1',
              assistantType: obj[Number(item.id)]
                ? obj[Number(item.id)]
                : 'systems'
            }))
          )
        }
      })
    },

    clearChatMessage() {
      this.chatMessageList.length = 0
      this.setIsRestart(false)
    },
    // 通过下标删除聊天消息对象
    removeChatMessageItem(index, number) {
      this.chatMessageList.splice(index, number)
    },
    // 通过下标修改聊天消息对象 -自定义修改字段
    setIndexChatCustomKeyMessage(key, index, data) {
      this.chatMessageList[index][key] = data
    },
    // 通过下标修改聊天消息对象 -专用于ai回答写入
    setIndexChatMessage(data) {
      // console.log(data, 'data00000000')
      const index = this.chatMessageList.length - 1

      // this.chatMessageList[index].text += data.reply
      this.chatMessageList[index].status = data.status
      this.chatMessageList[index].id = data.conversation_id
      this.chatMessageList[index].thinkingTxt += data.replyThink
      if (data.applyType === 'thinking') {
        this.chatMessageList[index].text = ''
      } else {
        if (data.conversation_id.length > 10) {
          console.log(this.thinkList.length, '888888')
          console.log(this.chatMessageList[index].thinkingTxt.length, '99999999999')
          this.chatMessageList[index].text += data.reply
        }
      }

      // this.chatMessageList[index].applyType = data.applyType
    },
    // 新增聊天消息
    setChatMessage(data) {
      this.chatMessageList.push(data)
    },
    getIsFullScreen() {
      return this.visibleFullScreen
    },
    async initHotkeys() {
      const res = await qryShortcutKey()
      this.hotkeysConflictSettings.push({
        key: res.data['videoExport'],
        routePath: '/videoEditor',
        // 是否优先
        isFirst: true
      })
      hotkeys('ctrl+m', e => {
        e.preventDefault()
        if (this.visibleSlideBar) return
        // 打印当前路由
        const isData = this.hotkeysConflictSettings.find(
          f => f.routePath === this.$route.path && f.key === 'Ctrl+M'
        )
        if (isData && isData.isFirst) return

        this.$uweb && this.$uweb.setAction('Event_sidebar_shortcut_keys_open')
        this.init()
        this.$store.dispatch('ai/setAiShowType', 1)
        this.visibleSlideBar = true
      })
      hotkeys('ctrl+shift+m', e => {
        e.preventDefault()
        if (this.visibleFullScreen) return
        // 打印当前路由
        const isData = this.hotkeysConflictSettings.find(
          f => f.routePath === this.$route.path && f.key === 'Ctrl+SHIFT+M'
        )
        if (isData && isData.isFirst) return
        this.$uweb &&
          this.$uweb.setAction('Event_full_screen_shortcut_keys_open')
        this.init()
        this.$store.dispatch('ai/setAiShowType', 0)
        this.visibleFullScreen = true
      })
    },

    async handleClickEnterAiHelper() {
      if (this.isMoveAIIcon) return
      this.$uweb && this.$uweb.setAction('Event_mouse_click_open_sidebar')
      await this.$store.dispatch('user/viewingFlag', 'aigcAssistant')
      document.body.parentNode.style.overflowY = 'hidden'
      const aiShowType = this.$store?.getters['ai/aiShowType']
      this.aiOpen(aiShowType)
    },
    activeFullScreen() {
      this.$uweb && this.$uweb.setAction('Event_sidebar_click_full_screen_btn')
      this.disabledInput = false
      this.$store.dispatch('ai/setAiShowType', 0)
      this.visibleFullScreen = true
      document.body.parentNode.style.overflowY = 'hidden'
    },
    closeFullScreen() {
      this.$store.dispatch('ai/setAiShowType', 1)
      this.disabledInput = false
      this.visibleSlideBar = true
      this.visibleFullScreen = false
    },
    closeSlideBar() {
      this.setIsAIEnd(true)
      this.setIsRestart(false)
      this.disabledInput = false
      this.visibleSlideBar = false
      document.body.parentNode.style.overflowY = 'auto'
    },
    closeALL() {
      this.$uweb && this.$uweb.setAction('Event_close_btn')
      if (this.ws) {
        this.ws.close()
      }
      this.setIsAIEnd(true)
      this.setIsRestart(false)
      this.disabledInput = false
      this.visibleFullScreen = false
      this.visibleSlideBar = false
      document.body.parentNode.style.overflowY = 'auto'
    },
    closeAI(e) {
      e.stopPropagation()
      this.setIsAIEnd(true)
      this.setIsRestart(false)
      this.showAI = false
    },
    // 使用AI(其他页面用)
    useAi(id = '1') {
      if (!this.isAIEnd) return
      this.$store.dispatch('ai/setAICenter', false)
      this.$store.dispatch('ai/setAiShowType', 0)
      this.visibleFullScreen = true
      this.init(id)
    },
    // 使用AI(助手中心用)
    useAssistant(id = '1') {
      if (!this.isAIEnd) return
      if (this.$refs.fullScreen) {
        this.$refs.fullScreen.useAssistant(id)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ai-helper-container {
  .express-entrance {
    position: fixed;
    bottom: 140px;
    box-shadow: 0 5px 25px #0000000a, 0 3.2px 12px #00000014;
    background-color: #fff;
    width: 130px;
    height: 37px;
    box-shadow: 0px 3px 6px 0px rgba(6, 62, 155, 0.2);
    right: -100px;
    z-index: 6000;

    .entrance-item {
      position: relative;
      width: 100%;
      height: 100%;
      .icon,
      .hovericon {
        width: 44px;
        height: 44px;
        position: absolute;
        left: -12px;
        top: -3px;
        -webkit-user-drag: none; /* Safari */
        -khtml-user-drag: none; /* Konqueror */
        -moz-user-drag: none; /* Firefox */
        -o-user-drag: none; /* Opera */
        user-drag: none;
      }
      .hovericon {
        display: none;
      }
      .hover-close {
        display: none;
        position: absolute;
        top: -16px;
        left: -8%;
        color: rgba(0, 0, 0, 0.5);
        font-size: 20px;
      }
    }
  }
  .express-entrance-hover {
    &:hover {
      right: 0;
      transition: all 0.5s;
      background: linear-gradient(163deg, #3a86ff 0%, #3a86ff 2%, #3975ff 100%);
      .entrance-item {
        user-select: none;
        .icon {
          display: none;
        }
        .hovericon {
          display: block;
        }

        .hover-close {
          display: block;
        }

        &:after {
          content: '伏羲云AI助手';
          position: absolute;
          left: 40px;
          top: 7.5px;
          font-size: 14px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #fff;
        }
      }
    }
  }
  .hideAfter {
    cursor: move;
    background: linear-gradient(
      163deg,
      #3a86ff 0%,
      #3a86ff 2%,
      #3975ff 100%
    ) !important;
    right: 0px !important;
    .entrance-item {
      user-select: none;
      .icon {
        display: none;
      }
      .hovericon {
        display: block;
      }

      &:after {
        content: '伏羲云AI助手';
        position: absolute;
        left: 40px;
        top: 7.5px;
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #fff;
      }
    }
  }
}
.slideBar-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 432px;
  height: 100%;
  background: #f9f9f9;
  border-left: 1px solid #eee;
  box-shadow: -6px 0px 31px 0px rgba(0, 0, 0, 0.2);
  z-index: 6000;
}
.ai-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 6000;
}
</style>
