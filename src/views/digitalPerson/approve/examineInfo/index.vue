<template>
  <div class="page_wrap" @click="globalClick">
    <div class="page_top">
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        class="form-breadcrumb"
      >
        <el-breadcrumb-item :to="{ name: 'Approve', params: { isShow: true } }">
          <span style="color: #777777">数字人审核</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数字人详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-divider />
    <div v-loading="loading" class="page_content">
      <div class="flex-content">
        <!-- 视频效果 -->
        <!-- <div style="margin-right: 20px; width: 37%">
          <div class="title">预览效果</div>
          <div id="shareVideoDetailPlay" class="video_play" />
          <div class="info-row">
            <el-row :gutter="20" class="info-el-row">
              <el-col :span="12">
                <span class="label-info">所属讲师：</span>
                <span class="content-info">{{ info.teacherName }}</span>
              </el-col>
              <el-col :span="12">
                <span class="label-info">形象名称：</span>
                <el-tooltip
                  effect="dark"
                  :content="info.characterName"
                  placement="bottom-start"
                >
                  <span class="content-info">{{ info.characterName }}</span>
                </el-tooltip>
              </el-col>
              <el-col :span="12">
                <span class="label-info">视频名称：</span>
                <el-tooltip
                  effect="dark"
                  :content="info.name"
                  placement="bottom-start"
                >
                  <span class="content-info">{{ info.name }}</span>
                </el-tooltip>
              </el-col>
              <el-col :span="12">
                <span class="label-info">申请者：</span>
                <span class="content-info">{{ info.creatUserName }}</span>
              </el-col>
              <el-col :span="12">
                <span class="label-info">素材类型：</span>
                <span class="content-info">{{
                  materialTypes[info.materialType]
                }}</span>
              </el-col>
              <el-col :span="12">
                <span class="label-info">审批状态：</span>
                <span
                  :class="{ 'content-info': true }"
                  :style="{
                    color:
                      info.status === 4
                        ? '#ff7d00'
                        : info.status === 5
                          ? '#00B300'
                          : info.status === 6
                            ? '#F53F3F'
                            : ''
                  }"
                >{{
                  info.status === 4
                    ? '待审批'
                    : info.status === 5
                      ? '审核通过'
                      : '审核驳回'
                }}</span>
              </el-col>
              <el-col :span="12">
                <span class="label-info">申请时间：</span>
                <span class="content-info">{{
                  info.lastSubmitApproveTime
                }}</span>
              </el-col>
            </el-row>
          </div>
        </div> -->

        <!-- 文案 -->
        <div
          style="position: relative; width: 80%"
          @mousedown="mousedown"
          @mouseup="mouseup"
          @mousemove="mousemove"
        >
          <div class="title flex flex-middle">
            视频文案

            <div class="standard-text">
              审核标准
              <div class="dialog-standard">
                <div class="header-standard">审核标准</div>
                <div class="content-standard">
                  <div>
                    1.不要过度制造焦虑的内容，文末需要往经济发展希望方向回落
                  </div>
                  <div>
                    2.IP之间窜用文案，需要结合IP人设定位做一定的措辞优化，不允许一模一样
                  </div>
                  <div>
                    3.即使是爆款内容，如果IP老师未涉及的内容方向允于驳回
                  </div>
                  <div>
                    4.在带货话术部分需要注意容易引起歧义的文案，给出修改建议驳回重写
                  </div>
                  <div>
                    5.注重数据反馈，出现大量跟风文案，一定要先去前端搜索查看相关数据，以此判断是否继续批过
                  </div>
                  <div>
                    6.涉及到行业数据、名人事件的一定要谨慎对待，以刘润为例，千万不要乱肯定乱下定论误导舆论！
                  </div>
                </div>
              </div>
            </div>
            <div class="info-head-row">
              <div class="info-head-item" style="width: 20%">
                <div class="info-head-title">所属IP：</div>
                <div class="info-head-value">
                  {{ info.teacherName || '--' }}
                </div>
              </div>
              <div
                class="info-head-item"
                style="width: 32%; padding-right: 15px"
              >
                <div class="info-head-title">视频名称：</div>
                <div class="info-head-value">{{ info.name }}</div>
              </div>
              <div class="info-head-item" style="width: 22%">
                <div class="info-head-title">申请者：</div>
                <div class="info-head-value">{{ info.creatUserName }}</div>
              </div>
              <div class="info-head-item" style="width: 25%">
                <div class="info-head-title">申请时间：</div>
                <div class="info-head-value">
                  {{ info.lastSubmitApproveTime }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex" style="width: 100%; height: 100%">
            <!-- 视频封面 -->
            <div v-if="info.coverUrl" class="video-cover">
              <el-image
                :class="{
                  'vertical-screen': info.resolutionType === 1,
                  'landscape-screen': info.resolutionType === 0
                }"
                :src="info.coverUrl"
                lazy
              />
            </div>
            <textEditor
              id="textEditorId"
              ref="textEditorRef"
              :style="{ width: info.coverUrl ? '75%' : '100%' }"
              :class="{
                'text-editor': true,
                'text-editor-isheader':
                  isShowTextEditorHeader || !!info.appealReason
              }"
              @countChange="val => (count = val)"
            >
              <div
                v-show="isShowTextEditorHeader || !!info.appealReason"
                slot="header"
                :class="{
                  'textEditor-header': true,
                  'textEditor-header-zero-padding': !!info.appealReason
                }"
              >
                <template v-if="isShowTextEditorHeader">
                  <div class="left-header-te">
                    <div class="icon-show-dv" @click="changeShow">
                      <img
                        v-if="isShowChangeText"
                        class="icon-show-img"
                        src="@/assets/image/aigc/digitalVideoManage/showText.png"
                        alt=""
                      />
                      <img
                        v-else
                        class="icon-show-click-img"
                        src="@/assets/image/aigc/digitalVideoManage/hideText.png"
                        alt=""
                      />
                      <span>{{
                        isShowChangeText ? '显示原文' : '显示改动点'
                      }}</span>
                    </div>
                    <template v-if="isShowChangeText">
                      <el-divider direction="vertical" />
                      <div class="del-demo">
                        删除
                        <div class="horizontal-line" />
                      </div>
                      <el-divider direction="vertical" />
                      <div class="add-demo">新增</div>
                      <el-divider direction="vertical" />
                      <div class="update-demo">修改</div></template>
                  </div>
                  <div class="right-header-te">
                    <div v-if="isShowChangeText" class="tips">
                      当前不支持批注，请切换显示原文后操作
                    </div>
                  </div>
                </template>
                <template v-if="!!info.appealReason">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="info.appealReason"
                    placement="top"
                  >
                    <div class="appeal-reason">
                      <img
                        src="@/assets/image/aigc/digitalVideoManage/tips.png"
                        alt=""
                      />

                      <div class="reason-row">
                        申诉理由：{{ info.appealReason }}
                      </div>
                    </div>
                  </el-tooltip>
                </template>
              </div>
              <div v-if="!isShowChangeText" slot="count" class="count-row">
                <div class="sensitive">
                  <span v-if="sensitiveList.length > 0">
                    敏感词：{{ sensitiveList.join(',') }}</span>
                </div>
                <span> 字数：{{ count }}</span>
              </div>
              <div
                v-if="!isShowChangeText"
                id="suspensionDialog"
                slot="suspension"
                class="suspension-dv"
                @click.stop="addSuspension"
              >
                <span>批注</span>
              </div>
            </textEditor>
          </div>
        </div>
        <!-- 批注 -->
        <div class="annotations-row">
          <div class="annotations-title">
            <span>批注（{{ getSuspensionCount }}）</span>
          </div>
          <div v-loading="isAnnotationsLoading" class="annotations-list">
            <div v-for="(item, index) in annotationsList" :key="index">
              <div class="divider-custom-item">
                <div class="divider-custom-dv" />
                <span class="span-t">
                  {{ item.key }}（{{ item.list.length }}）
                </span>
                <div class="divider-custom-dv" />
              </div>
              <el-empty
                v-if="index === 0 && item.list.length < 1"
                :image-size="80"
                description="暂无批注"
              />
              <div
                v-for="(itemChild, indexChild) in item.list"
                :key="indexChild"
                v-loading="itemChild.loading"
                :class="{
                  'annotations-item': true,
                  'annotations-item-select': itemChild.isSelect
                }"
                @click="
                  itemTextAnnotationsClick(
                    itemChild.styleId,
                    itemChild.status,
                    index !== 0
                  )
                "
              >
                <!-- 用户标注标题 -->
                <div class="as-item-title">
                  <div class="as-sgang" />
                  <el-tooltip effect="dark" placement="top">
                    <div class="title-dv">{{ itemChild.title }}</div>
                    <div slot="content" style="max-width: 15.5vw">
                      {{ itemChild.title }}
                    </div>
                  </el-tooltip>
                </div>
                <!-- 输入状态 -->
                <template v-if="itemChild.status === 1">
                  <el-input
                    :id="itemChild.styleId + 'input'"
                    v-model="itemChild.inputContent"
                    maxlength="200"
                    type="textarea"
                    class="as-input"
                    resize="none"
                    placeholder="请输入"
                  />
                </template>
                <!-- 文本状态 -->
                <template v-if="itemChild.status === 2">
                  <div class="as-text">
                    <span>{{ itemChild.inputContent }}</span>
                  </div>
                </template>
                <!-- 底部功能 -->
                <div class="as-bottom">
                  <template v-if="itemChild.status === 1">
                    <div class="as-input-count">
                      {{ itemChild.inputContent.length }}/200
                    </div>
                    <div class="as-btn">
                      <el-button
                        class="btn-p btn-close-p"
                        @click.stop="
                          closeAnnotations(
                            itemChild.styleId,
                            itemChild.title,
                            itemChild.id
                          )
                        "
                      >
                        取消
                      </el-button>
                      <el-button
                        class="btn-p btn-send-p"
                        type="primary"
                        @click.stop="
                          saveAnnotations(itemChild.styleId, itemChild.id)
                        "
                      >
                        发送
                      </el-button>
                    </div>
                  </template>
                  <template
                    v-if="
                      itemChild.status === 2 && index === 0 && !isShowChangeText
                    "
                  >
                    <div class="as-input-time">
                      {{ getTime(itemChild.time) }}
                    </div>
                    <div class="as-btn">
                      <!-- 修改 -->
                      <el-popover
                        placement="bottom"
                        title="修改"
                        trigger="hover"
                        popper-class="custom-annotations-popover"
                      >
                        <div
                          slot="reference"
                          class="icon-edit-dv"
                          @click="updateAnnotationsStatus(itemChild.id)"
                        >
                          <img
                            class="icon-edit-img"
                            src="@/assets/image/aigc/digitalVideoManage/edit.png"
                            alt=""
                          />
                          <img
                            class="icon-edit-hover-img"
                            src="@/assets/image/aigc/digitalVideoManage/edit-hover.png"
                            alt=""
                          />
                        </div>
                      </el-popover>

                      <!-- 删除 -->
                      <el-popover
                        placement="bottom"
                        title="删除"
                        trigger="hover"
                        popper-class="custom-annotations-popover"
                      >
                        <div
                          slot="reference"
                          class="icon-edit-dv"
                          @click="
                            deleteAnnotations(
                              itemChild.styleId,
                              itemChild.id,
                              itemChild.title
                            )
                          "
                        >
                          <img
                            class="icon-edit-img"
                            src="@/assets/image/aigc/digitalVideoManage/del-pz.png"
                            alt=""
                          />
                          <img
                            class="icon-edit-hover-img"
                            src="@/assets/image/aigc/digitalVideoManage/del-hover-pz.png"
                            alt=""
                          />
                        </div>
                      </el-popover>
                    </div>
                  </template>
                </div>
              </div>
              <div
                v-if="
                  index !== 0 &&
                    item.approveOpinion &&
                    item.approveOpinion.length > 0
                "
                :class="{
                  'annotations-item': true
                }"
              >
                <div class="as-item-title">
                  <div class="as-sgang" />
                  <div class="title-dv">驳回原因</div>
                </div>
                <!-- 文本状态 -->
                <template>
                  <div class="as-text">
                    <span>{{ item.approveOpinion }}</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 审批通过弹窗 -->
      <el-dialog
        :visible.sync="passVisable"
        width="500px"
        :close-on-click-modal="false"
        :before-close="
          () => {
            passVisable = false
          }
        "
      >
        <span slot="title" class="flex" style="align-items: center">
          确认操作
        </span>
        <div>
          <div class="flex flex-top">
            <i
              class="el-icon-warning"
              style="color: #ffb325; font-size: 22px; margin-right: 6px"
            />
            <div>
              <div v-if="annotationsList[0].list.length > 0">
                {{ sensitiveList.length > 0 ? '1、' : '' }}当前有批注内容
              </div>
              <div v-if="sensitiveList.length > 0">
                {{
                  annotationsList[0].list.length > 0 ? '2、' : ''
                }}文案中包含敏感词：{<span style="color: #f53f3f">
                  {{ sensitiveList.join('、') }}
                </span>
                }
              </div>
              <div
                :style="{
                  'margin-top':
                    annotationsList[0].list.length < 1 &&
                    sensitiveList.length < 1
                      ? '0'
                      : '20px',
                  'font-size': '16px',
                  color: '#000'
                }"
              >
                确认审批通过吗？
              </div>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="
              () => {
                loading = false
                btnLoading = false
                passVisable = false
              }
            "
          >
            取 消
          </el-button>
          <el-button type="primary" @click="approveOrReject(true)">
            确认并审批下一条
          </el-button>
        </div>
      </el-dialog>
      <!-- 驳回弹窗 -->
      <el-dialog
        :visible.sync="rejectVisable"
        width="500px"
        custom-class="rejectDialog"
        :before-close="
          () => {
            rejectVisable = false
          }
        "
      >
        <span slot="title" class="flex" style="align-items: center">
          确认驳回操作
        </span>
        <el-form
          ref="form"
          :model="form"
          :rules="annotationsList[0].list.length > 0 ? {} : rules"
          :label-width="annotationsList[0].list.length > 0 ? '40px' : '50px'"
        >
          <div
            v-if="annotationsList[0].list.length > 0"
            class="annotations-reject-list"
          >
            <div v-for="(item, index) in getDisplayAnnotations" :key="index">
              <div class="title-rl">
                <div>{{ index + 1 }}：</div>
                <div>{{ item.inputContent }}</div>
              </div>
              <div class="content-rl">
                <div class="i-t-rl">{{ index + 1 }}：</div>
                <div>原文:{{ item.title }}</div>
              </div>
            </div>
          </div>
          <el-form-item label="原因" prop="opinion">
            <el-input
              v-model="form.opinion"
              type="textarea"
              :rows="4"
              resize="none"
              :maxlength="500"
              show-word-limit
              placeholder="请输入驳回原因"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            @click="
              () => {
                loading = false
                rejectVisable = false
              }
            "
          >
            取 消
          </el-button>
          <el-button type="danger" @click="submitForm('form')">
            驳回
          </el-button>
        </div>
      </el-dialog>
    </div>

    <el-row type="flex" justify="end" style="width: 100%; margin-top: 1vw">
      <el-button
        :loading="btnLoading"
        class="btn-pass"
        type="text"
        size="small"
        @click="submitValidate(true)"
      >
        审批通过
      </el-button>
      <el-button
        :loading="btnLoading"
        class="btn-reject"
        type="text"
        size="small"
        @click="operate(false)"
      >
        审批驳回
      </el-button>
    </el-row>
    <noviceGuidance v-if="isShowNoviceGuidance" @ok="ok" />
    <BalanceNotTipsDialog
      v-model="balanceNotTipsDialog"
      :msg="balanceNotTipsDialogMsg"
    />
  </div>
</template>
<script>
import { status as statusList } from '../components/columns'
import {
  getVideoDetail,
  approveOrReject,
  getAnnotionsDeltas,
  addAnnotions,
  editAnnotion,
  deleteAnnotion
} from '@/api/aiVideoManage'
import { decryptAES } from '@/utils/crypto'
import { materialTypes } from '@/views/digitalPerson/digitalVideoManage/components/columns'
import textEditor from '@/views/digitalPerson/createDigitaVideo/components/leftSide/editorCustom/components/textEditor/index.vue'
import { sensitiveChecking } from '@/api/aigc'
import noviceGuidance from './noviceGuidance'
import moment from 'moment'
// const keyVideo = 'hnhokdatacenter0'
import BalanceNotTipsDialog from '@/views/digitalPerson/digitalPersonTraining/components/balanceNotTipsDialog/index.vue'
import { checkPackageOrderBalance } from '@/api/aiVideoManage/setMealModule'
export default {
  name: 'ExamineInfo',
  components: {
    textEditor,
    noviceGuidance,
    BalanceNotTipsDialog
  },
  data() {
    return {
      materialTypes,
      decryptAES,
      statusList,
      value1: false,
      info: {},
      form: {
        opinion: ''
      },
      rules: {
        opinion: [
          { required: true, message: '请输入驳回原因', trigger: 'change' }
        ]
      },
      rejectVisable: false,
      sensitiveList: [],
      loading: false,
      btnLoading: false,
      count: 0,
      isShowNoviceGuidance: false,
      selectText: '',
      selectX: undefined,
      selectY: undefined,
      originalY: undefined,
      /**
       *
          key: string,
          批注集合
          list: [
            {
              title: string,
              inputContent:string,
              // 1-新增，2-修改
              status: 1,
              isSelect: false,
              time: new Date(),
              loading:false,
              offset: 0
            }
          ]
       */
      annotationsList: [
        {
          key: '当前的批注',
          list: []
        }
      ],
      isAnnotationsLoading: false,
      highlightId: undefined,
      isShowChangeText: false,
      passVisable: false,
      // 当前文本
      textGlobal: '',
      // 之前文本
      textPreGlobal: '',
      videoId: undefined,
      isShowTextEditorHeader: false,
      balanceNotTipsDialog: false,
      balanceNotTipsDialogMsg: ''
    }
  },
  computed: {
    getSuspensionCount() {
      let count = 0
      this.annotationsList.forEach(item => {
        count += item.list.length
      })
      return count
    },
    getDisplayAnnotations() {
      return this.annotationsList[0].list.filter(item => item.status === 2)
    }
  },
  watch: {
    $route: {
      handler(val) {
        if (val.query) {
          this.init()
        }
      },
      deep: true
    }
  },
  created() {
    const isReadNoviceGuidance = localStorage.getItem(
      'readExamineInfoNoviceGuidanceV1-3-3' +
        this.$store.state.user.userInfo.userId
    )
    if (!isReadNoviceGuidance) {
      this.isShowNoviceGuidance = true
    }
    this.init()
  },
  mounted() {
    document
      .getElementById('editor-text')
      .addEventListener('scroll', this.scrollEditor)
    this.$nextTick(() => {
      const ted = document.getElementById('editor-text')
      ted.setAttribute('contenteditable', false)

      // this.$refs.textEditorRef.$el.children[0].style.userSelect = 'none'
    })
  },
  methods: {
    changeShow() {
      this.isShowChangeText = !this.isShowChangeText
      const textTmp = this.isShowChangeText
        ? this.textPreGlobal
        : this.textGlobal
      this.$refs.textEditorRef.setValue(textTmp)
      !this.isShowChangeText && this.sensitiveChecking()
    },
    // 时间规则：1小时以内显示：xx分钟前。1小时外显示具体日期时间：MM-DD hh:mm:ss
    getTime(time) {
      const nowTime = new Date().getTime()
      const timeDifference = nowTime - moment(time)
      const hour = timeDifference / 1000 / 60 / 60
      const minute = Math.floor(timeDifference / 1000 / 60)
      const second = Math.floor(timeDifference / 1000)
      if (hour >= 1) {
        return moment(time).format('MM-DD HH:mm:ss')
      } else if (minute > 0) {
        return `${minute}分钟前`
      } else if (second > 0) {
        return `${second}秒前`
      } else {
        return '刚刚'
      }
    },
    // 清除选择高亮
    clearHighlight() {
      const meList = this.annotationsList[0]
      meList.list.forEach(item => {
        if (this.highlightId === item.styleId) {
          this.itemAnnotationsClick(this.highlightId, item.status, false)
        }
      })
      const el = document.getElementById(this.highlightId)
      el && (el.style.backgroundColor = 'initial')

      this.highlightId = undefined
    },
    // 设置选中列表项高亮/取消高亮
    itemAnnotationsClick(styleId, status, isSelect) {
      if (status === 1) return
      const meList = this.annotationsList[0]
      meList.list.forEach(item => {
        item.isSelect = false
        const el = document.getElementById(item.styleId)
        el && (el.style.backgroundColor = 'initial')
        if (styleId === item.styleId) {
          this.highlightId = item.styleId
          el && (el.style.backgroundColor = '#FAEBDD')
          item.isSelect = isSelect
        }
      })
    },
    // 设置选中文本高亮
    itemTextAnnotationsClick(styleId, status, isClick) {
      if (status === 1 || isClick || this.isShowChangeText) return
      this.itemAnnotationsClick(styleId, status, true)
    },
    // 取消批注
    closeAnnotations(styleId, title, id) {
      const meList = this.annotationsList[0]
      if (id) {
        meList.list[meList.list.findIndex(f => f.id === id)].status = 2
      } else {
        // 清除新增但未保存的批注
        const el = document.getElementById(styleId)
        el.removeAttribute('id')
        el.removeAttribute('style')
        el.outerHTML = title
        meList.list = meList.list.filter(f => f.styleId !== styleId)
      }
      this.updateSensitive()
    },
    // 删除批注
    deleteAnnotations(styleId, id, title) {
      const meList = this.annotationsList[0]
      this.isAnnotationsLoading = true
      const el = document.getElementById(styleId)
      if (el) {
        el.removeAttribute('id')
        el.removeAttribute('style')
        el.outerHTML = title
      }
      meList.list.splice(
        meList.list.findIndex(f => f.styleId === styleId),
        1
      )
      this.$nextTick(() => {
        const ft = this.$refs.textEditorRef.getHtml()
        // .replace(/<span tags="sensitive" style="color:red">/g, '')
        // .replace(/<\/span>/g, '')
        deleteAnnotion({
          id,
          fullText: ft
        })
          .then(() => {
            this.updateSensitive()
            this.isAnnotationsLoading = false
          })
          .catch(() => {
            this.isAnnotationsLoading = false
          })
      })
    },
    updateAnnotationsStatus(id) {
      const meList = this.annotationsList[0]
      meList.list.forEach(item => {
        if (item.id === id) {
          item.status = 1
        }
      })
    },
    // 修改批注
    updateAnnotations(styleId) {
      const meList = this.annotationsList[0]
      meList.list.forEach(item => {
        if (item.styleId === styleId) {
          this.itemAnnotationsClick(styleId, item.status, true)
          this.isAnnotationsLoading = true
          editAnnotion({
            content: item.inputContent,
            id: item.id,
            styleId: item.styleId,
            text: item.title
          })
            .then(() => {
              this.isAnnotationsLoading = false
              item.status = 2
              item.isSelect = true
            })
            .catch(() => {
              this.isAnnotationsLoading = false
            })
        } else {
          item.isSelect = false
        }
      })
    },
    // 保存批注
    saveAnnotations(styleId, id) {
      const meList = this.annotationsList[0]
      if (id) {
        this.updateAnnotations(styleId)
      } else {
        meList.list.forEach((item, index) => {
          if (item.styleId === styleId) {
            if (item.inputContent.trim().length < 1) {
              this.$message.warning('请输入内容!')
              return
            }
            this.isAnnotationsLoading = true
            const annotationsListTmp = []
            meList.list.map(m => {
              annotationsListTmp.push({
                id: m.id || undefined,
                content: m.inputContent,
                text: m.title,
                offset: m.offset,
                styleId: m.styleId || undefined
              })
            })
            const ft = this.$refs.textEditorRef.getHtml()
            // .replace(/<span tags="sensitive" style="color:red">/g, '')
            // .replace(/<\/span>/g, '')
            const params = {
              annotations: annotationsListTmp,
              fullText: ft,
              videoId: this.videoId
            }
            addAnnotions(params)
              .then(() => {
                item.status = 2
                item.isSelect = false
                this.updateMeAnnotions()
                  .then(() => {
                    this.updateSensitive()
                    this.isAnnotationsLoading = false
                  })
                  .catch(() => {
                    this.isAnnotationsLoading = false
                  })
              })
              .catch(() => {
                this.isAnnotationsLoading = false
              })
          }
        })
      }
    },
    // 获取文本所在位置
    getTextPosition() {
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      const selectTextHtmls = range.cloneContents()
      const selectTextHtmlFirst = selectTextHtmls.childNodes[0]
      const selectTextHtmlFirstText =
        selectTextHtmlFirst?.innerText || selectTextHtmlFirst?.data
      const queryText =
        selectTextHtmls.childNodes.length > 1
          ? selectTextHtmlFirstText
          : selection.toString()
      const el = document.getElementById('editor-text')
      let offset = 0
      let isOk = false
      el.childNodes.forEach((item, index) => {
        if (isOk) return
        if (item.nodeType === 1) {
          const regResult = this.queryMatchText(item.innerText, queryText)
          if (
            regResult.filter(f => f === range.startOffset).length > 0 ||
            (regResult.filter(f => f === range.endOffset).length > 0 &&
              selectTextHtmls.childNodes.length === 1)
          ) {
            offset += range.startOffset
            isOk = true
          } else {
            offset += item.innerText.length
          }
        }
        if (item.nodeType === 3) {
          const regResult = this.queryMatchText(item.data, queryText)
          if (
            regResult.filter(f => f === range.startOffset).length > 0 ||
            (regResult.filter(f => f === range.endOffset).length > 0 &&
              selectTextHtmls.childNodes.length === 1)
          ) {
            offset += range.startOffset
            isOk = true
          } else {
            offset += item.data.length
          }
        }
        // offset += index
      })

      return offset
    },
    queryMatchText(text, queryText) {
      const positions = []
      let position = text.indexOf(queryText)
      positions.push(position)
      if (position === -1) {
        return positions
      }

      while (position !== -1) {
        ''.indexOf()
        position = text.indexOf(queryText, position + 1)
        position !== -1 && positions.push(position)
      }
      return positions
    },
    // 新增批注列表
    addSuspension() {
      const removeList = []
      const meList = this.annotationsList[0]
      removeList.push(
        ...meList.list.filter(itemChild => itemChild.status === 1)
      )
      // 保留已保存的批注
      meList.list = meList.list.filter(itemChild => itemChild.status === 2)
      // 修改选中状态为为选中
      meList.list.forEach(itemChild => {
        itemChild.isSelect = false
      })

      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      const styleId = new Date().getTime() + 'Annotations'

      const insertObj = {
        styleId: styleId,
        title: this.selectText,
        inputContent: '',
        status: 1,
        isSelect: true,
        time: new Date(),
        offset: this.getTextPosition()
      }
      if (meList.list.length > 0) {
        let isPush = false
        meList.list.forEach((item, index) => {
          if (item.offset > insertObj.offset && !isPush) {
            isPush = true
            meList.list.splice(index, 0, insertObj)
          }
          if (index === meList.list.length - 1 && !isPush) {
            isPush = true
            meList.list.push(insertObj)
          }
        })
      } else {
        meList.list.push(insertObj)
      }

      document.getElementById('suspensionDialog').style.display = 'none'
      range.deleteContents()
      const el = document.createElement('span')
      el.id = styleId
      el.style.color = '#FF7D00'
      el.innerHTML = this.selectText.trim()
      range.insertNode(el)

      selection.removeAllRanges()
      // 清除新增但未保存的批注
      removeList.forEach(item => {
        const el = document.getElementById(item.styleId)
        el.removeAttribute('id')
        el.removeAttribute('style')
        el.outerHTML = item.title
      })
      this.updateSensitive()
      // 聚焦
      this.$nextTick(() => {
        document.getElementById(styleId + 'input')?.focus()
      })
      // 滚动条聚焦到有输入框的位置
      const scrollHeight = document.getElementById('textEditorId').scrollTop
      const elTop = document.getElementById(styleId).offsetTop
      const elHeight = document.getElementById(styleId).offsetHeight
      const elBottom = elTop + elHeight
      const elScrollTop = elBottom - 300
      if (elScrollTop > scrollHeight) {
        document.getElementById('textEditorId').scrollTop = elScrollTop
      }
    },
    updateSensitive() {
      !this.isShowChangeText &&
        this.$refs.textEditorRef.reductionSensitiveStyle()
      // 检测敏感词
      if (this.sensitiveList.length > 0) {
        !this.isShowChangeText &&
          this.$refs.textEditorRef.reductionSensitiveStyle()
        this.isNotSensitive = false
        this.sensitiveList.map(item => {
          const regItem = item.replace(/【/g, '').replace(/】/g, '')
          this.$refs.textEditorRef.setSensitiveStyle(regItem)
        })
      }
    },
    globalClick(event) {
      if (event.target.id !== 'textEditorId' && !this.isShowChangeText) {
        this.$nextTick(() => {
          const el = document.getElementById('suspensionDialog')
          el && (el.style.display = 'none')
        })
      }
    },
    scrollEditor() {
      console.log('滚动')
      this.getPosition()
      const selection = window.getSelection()
      if (selection.toString().length < 1) return
      document.getElementById('suspensionDialog').style.left =
        this.selectX + 'px'
      document.getElementById('suspensionDialog').style.top =
        this.selectY + 'px'
      document.getElementById('suspensionDialog').style.zIndex =
        this.originalY <= 189 ? -1 : 1
      document.getElementById('suspensionDialog').style.display = 'block'
    },
    mousemove(event) {
      const selection = window.getSelection()
      if (selection.toString().length < 1) {
        return
      }
      if (document.getElementById('suspensionDialog')?.contains(event.target)) {
        return
      }

      this.getPosition()
    },
    mousedown(event) {
      // 判断点击的文本是否能高亮批注列表
      if (
        event.target &&
        event.target.id &&
        event.target.id.includes('Annotations')
      ) {
        if (this.highlightId !== event.target.id) {
          this.clearHighlight()
          setTimeout(() => {
            this.annotationsList.forEach(item => {
              item.list.forEach(itemChild => {
                if (event.target.id === itemChild.styleId) {
                  this.itemAnnotationsClick(
                    event.target.id,
                    itemChild.status,
                    true
                  )
                } else {
                  itemChild.isSelect = false
                }
              })
            })
          })
        } else {
          this.clearHighlight()
        }
      } else {
        this.clearHighlight()
      }
      if (
        this.isShowChangeText ||
        document.getElementById('suspensionDialog')?.contains(event.target)
      ) {
        return
      }
      document.getElementById('suspensionDialog').style.display = 'none'
    },
    mouseup(event) {
      setTimeout(() => {
        this.setCopyHtml(event)
      })
    },
    setCopyHtml(event) {
      if (
        !document.getElementById('textEditorId').contains(event.target) ||
        event.target.classList.contains('suspension-dv')
      ) {
        return
      }
      const selection = window.getSelection()
      if (selection.toString().length < 1) return
      let isNextRun = true
      if (
        selection.anchorNode.id?.includes('Annotations') ||
        selection.focusNode.id?.includes('Annotations') ||
        selection.focusNode.parentNode?.id.includes('Annotations') ||
        selection.focusNode.parentNode?.id.includes('Annotations')
      ) {
        isNextRun = false
        document.getElementById('suspensionDialog').style.display = 'none'
      }
      const range = selection.getRangeAt(0)
      range.cloneContents().childNodes.forEach(item => {
        if (item.id?.includes('Annotations')) {
          isNextRun = false
          document.getElementById('suspensionDialog').style.display = 'none'
        }
      })
      if (!isNextRun || this.isShowChangeText) {
        return
      }
      document.getElementById('suspensionDialog').style.left =
        this.selectX + 'px'
      document.getElementById('suspensionDialog').style.top =
        this.selectY + 'px'
      document.getElementById('suspensionDialog').style.zIndex = 1
      document.getElementById('suspensionDialog').style.display = 'block'
    },
    getPosition() {
      const selection = window.getSelection()
      if (selection.toString().length < 1) {
        return
      }
      try {
        const range = selection.getRangeAt(0)
        const lastCharRange = range.cloneRange()
        lastCharRange.collapse(false) // 折叠到末尾
        lastCharRange.setEnd(
          lastCharRange.endContainer,
          lastCharRange.endOffset - 1
        )
        const rect = lastCharRange.getBoundingClientRect()
        const scrollTop = document.getElementById('textEditorId').scrollTop
        this.selectText = selection.toString()
        this.selectX = rect.left
        this.originalY = rect.bottom
        console.log(this.originalY, 'this.originalYthis.originalY')
        this.selectY = rect.bottom + scrollTop
      } catch (error) {
        console.log(error)
      }
    },
    ok() {
      localStorage.setItem(
        'readExamineInfoNoviceGuidanceV1-3-3' +
          this.$store.state.user.userInfo.userId,
        '1'
      )
      this.isShowNoviceGuidance = false
    },
    sensitiveChecking() {
      const textTmp = this.isShowChangeText
        ? this.textGlobal
        : this.$refs.textEditorRef.getText()
      if (textTmp.length < 1) {
        this.$message.warning('请填写内容!')
        return
      }
      return new Promise((resolve, reject) => {
        this.sensitiveLoading = true
        const text = textTmp
        sensitiveChecking({ content: text })
          .then(res => {
            this.sensitiveLoading = false
            if (res.code === 1) {
              this.sensitiveList = res.data
              if (this.sensitiveList.length > 0) {
                this.isNotSensitive = false
                this.sensitiveList.map(item => {
                  const regItem = item.replace(/【/g, '').replace(/】/g, '')
                  !this.isShowChangeText &&
                    this.$refs.textEditorRef.setSensitiveStyle(regItem)
                })
              } else {
                !this.isShowChangeText &&
                  this.$refs.textEditorRef.reductionSensitiveStyle()
                this.isNotSensitive = true
                this.sensitiveList = []
              }
              resolve(this.sensitiveList.length > 0)
            } else {
              resolve(false)
              this.sensitiveList = []
            }
          })
          .catch(() => {
            reject()
            this.sensitiveLoading = false
          })
      })
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.approveOrReject(false, this.form.opinion)
        }
      })
    },
    mapChangeText({ changes, textPre }) {
      const { changeDelta, deleteDelta, insertDelta } = changes
      const isExitChangs = !!changeDelta || !!deleteDelta || !!insertDelta
      if (isExitChangs) {
        // 把文本转换成对象key为下标，然后根据改动点的位置，将改动点替换成span标签
        const txObj = {}
        textPre.split('').map((m, i) => {
          txObj[i] = m
        })
        insertDelta.map(item => {
          const { position, text } = item
          const insertText = `<span style="color:#00B42A">${text}</span>`
          txObj[position > 0 ? position - 1 : position] += insertText
        })
        changeDelta.map(item => {
          const { position, text, textPre } = item
          const changeText = `<span style="color:#FF7D00">${text}【${textPre}】</span>`
          txObj[position] = changeText
          const textPreLength = textPre.length
          // 如果改动点长度大于1，将后面的改动点置空
          if (textPreLength > 1) {
            for (let i = 1; i < textPreLength; i++) {
              txObj[position + i] = ''
            }
          }
        })
        deleteDelta.map(item => {
          const { position, text } = item
          const deleteText = `<span style="color:#F53F3F;text-decoration: line-through;">${text}</span>`
          txObj[position] = deleteText
          const textPreLength = text.length
          // 如果改动点长度大于1，将后面的改动点置空
          if (textPreLength > 1) {
            for (let i = 1; i < textPreLength; i++) {
              txObj[position + i] = ''
            }
          }
        })

        const textRender = Object.keys(txObj)
          .map(item => txObj[item])
          .join('')

        this.textPreGlobal = textRender
        this.$refs.textEditorRef.setValue(this.textPreGlobal)
      } else {
        this.textPreGlobal = '<span style="color:#FF7D00">暂无改动</span>'
        this.$refs.textEditorRef.setValue(this.textPreGlobal)
      }
      // this.sensitiveChecking()
    },
    // 更新自己的批注
    updateMeAnnotions() {
      return new Promise((resolve, reject) => {
        getAnnotionsDeltas({ videoId: this.$route.query.videoId })
          .then(res => {
            res.data.annotationInfo?.forEach(item => {
              const ls = item.annotations.map(m => ({
                isSelect: false,
                status: 2,
                id: m.id,
                title: m.text,
                inputContent: m.content,
                styleId: m.styleId,
                time: moment(m.annotationTime).utc(true)
              }))
              // 当前审批人的批注
              if (
                item.createUserId === this.$store.getters.userInfo.userId &&
                item.isHistory === 0
              ) {
                this.textGlobal = item.fullText
                ls.forEach((itemChild, indexChild) => {
                  this.annotationsList[0].list[indexChild].id = itemChild.id
                })
              }
            })
            resolve()
          })
          .catch(() => {
            this.loading = false
            reject()
          })
      })
    },
    init() {
      if (!this.$route.query?.videoId) {
        this.$message.error('缺少视频id')
        this.$router.back()
        return
      }
      this.videoId = this.$route.query?.videoId
      this.sensitiveList = []
      this.form.opinion = ''
      this.isShowChangeText = true
      this.annotationsList = [
        {
          key: '当前的批注',
          list: []
        }
      ]
      this.loading = true
      getVideoDetail({ videoId: this.$route.query.videoId })
        .then(res => {
          this.info = res.data
          // this.videoPreview(this.decryptAES(this.info.videoUrl, keyVideo))

          getAnnotionsDeltas({ videoId: this.$route.query.videoId })
            .then(adres => {
              this.loading = false
              this.textGlobal = adres.data.text
              this.isShowChangeText =
                !!adres.data.textPre && !this.info.appealReason
              this.isShowTextEditorHeader =
                !!adres.data.textPre && !this.info.appealReason
              if (this.isShowTextEditorHeader) {
                this.mapChangeText({
                  changes: adres.data.changes,
                  textPre: adres.data.textPre
                })
              } else {
                this.$refs.textEditorRef.setValue(adres.data.text)
                this.sensitiveChecking()
              }
              adres.data.annotationInfo?.forEach(item => {
                const ls = item.annotations.map(m => ({
                  isSelect: false,
                  status: 2,
                  id: m.id,
                  loading: false,
                  title: m.text,
                  inputContent: m.content,
                  styleId: m.styleId,
                  offset: m.offset,
                  time: moment(m.annotationTime)
                }))
                // 当前审批人的批注
                if (
                  item.createUserId === this.$store.getters.userInfo.userId &&
                  item.isHistory === 0
                ) {
                  this.textGlobal = item.fullText
                  if (!this.isShowTextEditorHeader) {
                    this.$refs.textEditorRef.setValue(this.textGlobal)
                    this.sensitiveChecking()
                  }
                  this.annotationsList[0].list = ls || []
                } else {
                  this.annotationsList.push({
                    key: item.createUser + '的批注',
                    approveOpinion: item.approveOpinion,
                    list: ls || []
                  })
                }
              })
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {
          this.loading = false
        })
    },
    async checkBalance() {
      const res = await checkPackageOrderBalance({ type: 5 })
      if (res.data && res.data.length) {
        this.balanceNotTipsDialog = true
        this.balanceNotTipsDialogMsg = res.data
        return true
      }
      return false
    },
    async submitValidate(isPass) {
      this.btnLoading = true
      console.log(this.info.thirdType, 'this.info.thirdType')
      if (this.info.thirdType === 4 && (await this.checkBalance())) {
        this.btnLoading = false
        return
      }
      const sc = await this.sensitiveChecking().catch(() => {
        this.btnLoading = false
      })
      this.btnLoading = false
      if (sc || isPass) {
        this.passVisable = true
        this.btnLoading = false
      } else {
        this.operate(isPass)
      }
    },
    async operate(isPass) {
      this.btnLoading = false
      if (isPass) {
        this.$confirm('确认审批通过吗？', '操作确认', {
          confirmButtonText: '确认并审批下一条',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            this.approveOrReject(isPass)
          })
          .catch(() => {
            this.btnLoading = false
          })
      } else {
        this.rejectVisable = true
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
    },
    approveOrReject(isPass, opinion) {
      approveOrReject({
        videoId: this.info.videoId,
        status: isPass ? 5 : 6,
        opinion
      }).then(res => {
        this.passVisable = false
        this.rejectVisable = false
        this.$message({
          type: isPass ? 'success' : 'error',
          message: isPass ? '审批通过' : '审批驳回'
        })
        if (this.info.pendingVideoId) {
          this.$router.replace({
            path: '/digitalPerson/examineInfo',
            query: { videoId: this.info.pendingVideoId },
            replace: true
          })
        } else {
          // 跳页且刷新路由
          this.goBack()
        }
      })
    },
    goBack() {
      this.$router.replace({
        name: 'Approve',
        params: {
          isShow: true
        }
      })
    },
    videoPreview(url) {
      this.play(url)
    },
    playVideo() {
      if (
        this.playerSdk?.player?.state === 6 ||
        this.playerSdk?.player?.state === 7
      ) {
        this.playerSdk?.player?.paused
          ? this.player && this.player.pause()
          : this.player && this.player.play()
      }
    },
    // 销毁当前播放器
    destroy() {
      if (!this.playerSdk) {
        return Promise.resolve()
      } else {
        return this.playerSdk.destroy()
      }
    },
    play(option) {
      const _this = this
      console.log(this.playerSdk, '视频播放器')
      this.destroy()
        .then(res => {
          setTimeout(() => {
            try {
              // eslint-disable-next-line no-undef
              const playerSdk = new VePlayer({
                id: 'shareVideoDetailPlay',
                width: 788,
                height: 430,
                lang: 'zh',
                autoplayMuted: false,
                url: option,
                controls: {
                  autoHide: false
                },
                autoplay: false,
                sdkErrorPlugin: {
                  errorImg: false
                },
                playbackRate: [0.5, 1, 1.25, 1.5, 2, 3],
                ignores: ['sdkUnmutePlugin', 'DanmuPlugin']
              })
              // 需要在播放器创建完成后再去监听timeupdate事件
              playerSdk.on('player_create_finish', () => {
                console.log('播放器创建完成')
                _this.player_create_finish = true
                _this.player = playerSdk.getPlayerInstance()
                playerSdk.on('timeupdate', player => {
                  this.zimuArr?.some(item => {
                    if (
                      player.currentTime >= item.startTime / 1000 &&
                      player.currentTime <= item.endTime / 1000
                    ) {
                      this.nowWzData = item.content
                    }
                  })
                  _this.$emit('timeupdate', player.currentTime)
                })
                playerSdk.on('canplay', player => {
                  // _this.$emit('canplay')
                  _this.playerStatus = 'canplay'
                })
                playerSdk.on('play', () => {
                  _this.playerStatus = 'play'
                })
                playerSdk.on('pause', () => {
                  // console.log('视频播放暂停')
                  _this.playerStatus = 'pause'
                })
                playerSdk.on('ended', () => {
                  // console.log('视频播放结束')
                  _this.playerStatus = 'ended'
                })
                playerSdk.on('playing', () => {
                  // console.log('（暂停、卡顿后）恢复播放')
                  _this.playerStatus = 'play'
                })
                playerSdk.on('error', error => {
                  // _this.$message.error('视频播放错误')
                  console.log('视频播放错误', error)
                  _this.playerStatus = 'error'
                })
              })
              _this.playerSdk = playerSdk
            } catch (err) {
              console.log(err)
            }
          }, 100)
        })
        .catch(err => {
          console.log(err, 'err')
        })
    }
  }
}
</script>
<style lang="scss">
.custom-annotations-popover {
  min-width: 42px;
  width: 42px;
  padding: 2px 8px;
  text-align: initial;
  margin-top: 3px !important;
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
.rejectDialog {
  .el-dialog__body {
    padding: 10px 20px 0px 20px;
  }
}
</style>
<style lang="scss" scoped>
.page_wrap {
  height: 91.5%;
  min-width: 1630px;
  padding: 20px 20px 15px 20px;
  background-color: #fff;
  position: relative;
  border-radius: 10px;
  .page_content {
    .flex-content {
      display: flex;
      height: 100%;
      .title {
        margin-bottom: 20px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        padding-left: 10px;
        border-left: 4px solid #0c6fff;
      }
      .video_play {
        width: 100%;
        height: 333px;
      }
      .info-row {
        margin-top: 20px;
        padding: 20px 20px 0 20px;
        width: 100%;
        height: 325px;
        background: #f5f6fa;
        border: 1px solid #e1e6ed;
        border-radius: 10px;
        .info-el-row {
          div {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }
        }
        .label-info {
          font-size: 14px;
          color: #777777;
          display: inline-block;
        }
        .content-info {
          max-width: 73%;
          width: auto;
          display: inline-block;
          font-size: 14px;
          color: #333333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .video-cover {
        margin-right: 20px;
        width: 24.5%;
        height: 598px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #e1e6ed;
        border-radius: 10px;
        .vertical-screen {
          width: 230.4px;
          height: 409.6px;
        }
        .landscape-screen {
          width: 295.2px;
          height: 167.2px;
        }
      }

      .text-editor {
        overflow-y: hidden;
        border: 1px solid #e1e6ed;
        border-radius: 10px;
        width: 75%;
        height: 598px;
        cursor: text;
        &::-webkit-scrollbar {
          cursor: default;
        }
        ::selection {
          background: #ffcea0;
        }
        ::-webkit-selection {
          background: #ffcea0;
        }
        .textEditor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          border-bottom: 1px solid #e1e6ed;
          .left-header-te {
            display: flex;
            align-items: center;
            padding: 10px 0;
            user-select: none;
            .icon-show-dv {
              display: flex;
              align-items: center;
              cursor: pointer;
              .icon-show-img {
                width: 24px;
                height: 24px;
              }
              .icon-show-click-img {
                width: 24px;
                height: 24px;
              }
              span {
                margin-left: 4px;
                font-size: 14px;
                color: #0c6fff;
              }
            }
            .del-demo {
              font-size: 14px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #f53f3f;
              position: relative;
              .horizontal-line {
                position: absolute;
                top: 53%;
                left: -4px;
                width: 38px;
                height: 1px;
                background-color: #f53f3f;
              }
            }
            .add-demo {
              font-size: 14px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #00b42a;
            }
            .update-demo {
              font-size: 14px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #ff7d00;
            }
          }
          .right-header-te {
            display: flex;
            align-items: center;
            padding: 10px 0;
            .tips {
              font-size: 12px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #979797;
            }
          }
          .appeal-reason {
            user-select: none;
            color: #ff7d00;
            font-size: 14px;
            padding: 10px 15px;
            width: 100%;
            border-radius: 10px 10px 0 0;
            // border: 1px solid #e1e6ed;
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            background: #fff2e6;
            img {
              display: inline-block;
              margin-right: 4px;
              width: 14px;
              height: 14px;
            }
            .reason-row {
              width: 97%;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
        .textEditor-header-zero-padding {
          padding: 0 !important;
        }
      }
      .count-row {
        position: relative;
        width: 100%;
        height: 20px;
        padding: 0 20px;
        font-size: 14px;
        color: #999999;
        display: flex;
        justify-content: space-between;
        user-select: none;
        margin-top: 8px;
      }
      .sensitive {
        width: 100%;
        font-size: 14px;
        color: #333333;
        flex: 1;
        span {
          color: #f53f3f;
        }
      }
      .annotations-row {
        width: 20%;
        height: 598px;
        background: #ffffff;
        border-radius: 10px;
        border: 1px solid #e1e6ed;
        margin-top: 44px;
        margin-left: 20px;
        .annotations-title {
          width: 100%;
          padding: 10px 0px 10px 20px;
          border-bottom: 1px solid #e1e6ed;
          font-size: 14px;
          color: #333333;
          font-weight: 400;
        }
        .annotations-list {
          width: 100%;
          height: 530px;
          padding: 0 20px 20px 20px;
          overflow-y: auto;
          .divider-custom-item {
            display: flex;
            align-items: center;
            margin: 12px 0;
            .divider-custom-dv {
              flex: 1;
              border-top: 1px dashed #e1e6ed;
            }
            .span-t {
              font-size: 12px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #999999;
              margin: 0 15px;
            }
          }
          .annotations-item {
            width: 100%;
            height: 152px;
            background: #fff;
            border-radius: 6px;
            margin-bottom: 20px;
            border: 1px solid #e1e6ed;
            padding: 1px;
            .as-item-title {
              width: 100%;
              padding: 8px 10px;
              border-bottom: 1px solid #e1e6ed;
              display: flex;
              align-items: center;
              user-select: none;
              margin-bottom: 8px;
              position: relative;
              .as-sgang {
                width: 2px;
                height: 13px;
                background: #0c6fff;
                border-radius: 3px;
                margin-right: 8px;
              }
              .title-dv {
                max-width: 95%;
                width: auto;
                color: #777777;
                font-size: 14px;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
            .as-text {
              width: 100%;
              height: 66px;
              font-size: 14px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #333333;
              padding: 0 10px;
              overflow-y: auto;
              white-space: pre-wrap;
              word-break: break-all;
              cursor: pointer;
              &::-webkit-scrollbar {
                width: 3px;
                height: 3px;
                // display: none;
                background-color: transparent;
              }
              &::-webkit-scrollbar-thumb {
                border-radius: 6px;
                background: #d8d8d8;
                transition: all 0.4s ease;
              }

              &::-webkit-scrollbar-track {
                background: #fff;
              }
            }
            .as-bottom {
              width: 100%;
              height: 36px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 10px;
              user-select: none;
              .as-input-count {
                height: 100%;
                display: flex;
                align-items: end;
                font-size: 12px;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                color: #777777;
                padding-bottom: 5px;
              }
              .as-input-time {
                height: 100%;
                display: flex;
                align-items: end;
                font-size: 12px;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                color: #777777;
                padding-bottom: 5px;
              }
              .as-btn {
                display: flex;
                align-items: center;
                .btn-p {
                  width: 48px;
                  height: 24px;
                  border-radius: 4px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
                .btn-close-p {
                  font-size: 14px;
                  font-weight: 400;
                  color: #161616;
                }
                .btn-send-p {
                  font-size: 14px;
                  font-weight: 400;
                  color: #fff;
                }
                .icon-edit-dv {
                  user-select: none;
                  &:hover {
                    cursor: pointer;
                    .icon-edit-img {
                      display: none;
                    }
                    .icon-edit-hover-img {
                      display: block;
                    }
                  }
                  .icon-edit-img {
                    display: block;
                    width: 25px;
                    height: 25px;
                  }
                  .icon-edit-hover-img {
                    width: 25px;
                    height: 25px;
                    display: none;
                  }
                }
              }
            }
          }
          .annotations-item-select {
            box-shadow: 0px 4px 12px 0px rgba(22, 22, 22, 0.25);
            padding: 0;
            border: 2px solid #0c6fff;
          }
          &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
            // display: none;
            background-color: transparent;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 6px;
            background: #d8d8d8;
            transition: all 0.4s ease;
          }

          &::-webkit-scrollbar-track {
            background: #fff;
          }
        }
      }
    }
    .annotations-reject-list {
      width: 100%;
      height: auto;
      max-height: 148px;
      margin-bottom: 20px;
      overflow-y: auto;
      margin-top: 5px;
      .title-rl {
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #333333;
        display: flex;
        align-items: flex-start;
        padding-bottom: 4px;
      }
      .content-rl {
        font-size: 14px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #999999;
        display: flex;
        align-items: flex-start;
        .i-t-rl {
          visibility: hidden;
        }
      }

      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        // display: none;
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: #d8d8d8;
        transition: all 0.4s ease;
      }

      &::-webkit-scrollbar-track {
        background: #fff;
      }
    }
  }
  .btn-pass {
    background: #0bb01d;
    border-radius: 4px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    padding: 9px;
  }
  .btn-reject {
    background: #f53f3f;
    border-radius: 4px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    padding: 9px;
  }
  .suspension-dv {
    position: fixed;
    width: 66px;
    height: 32px;
    background: #ffffff;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.5);
    border-radius: 6px;
    border: 1px solid #0c6fff;
    text-align: center;
    display: none;
    color: #0c6fff;
    user-select: none;
    padding-top: 3px;
    border-radius: 4px;
    cursor: pointer;
  }
}
::v-deep .video_play {
  .xgplayer {
    width: 100% !important;
    height: 100% !important;
    border-radius: 10px;
    background: #333333;
  }
}
::v-deep .el-breadcrumb__item {
  // .el-breadcrumb__inner {
  //   font-size: 16px;
  //   font-family: PingFangSC-Regular, PingFang SC;
  //   font-weight: 400;
  //   color: #333333;
  // }
  .el-breadcrumb__separator {
    color: #000;
  }
  .el-breadcrumb__inner .is-link {
    color: #777777;
  }
}
::v-deep {
  .el-dialog__header {
    border-bottom: 1px solid rgb(231, 231, 231);
  }
  .el-divider--horizontal {
    margin: 20px 0;
  }
  .text-editor .editor {
    width: 100%;
    height: 558px !important;
    padding: 10px 10px 15px 10px !important;
    cursor: text;
    white-space: pre-wrap;
    &::-webkit-scrollbar {
      cursor: default;
    }
    // 鼠标选中文本时的背景色
    ::selection {
      background: #ffcea0;
    }
    ::-webkit-selection {
      background: #ffcea0;
    }
  }
  .text-editor-isheader {
    .editor {
      height: 505px !important;
    }
  }
  .as-input {
    textarea {
      max-height: 66px;
      height: 66px;
      border: none !important;
      padding: 0 10px 0 10px !important;
      overflow-y: auto;
      color: #000;

      &::-webkit-scrollbar {
        width: 3px;
        height: 3px;
        // display: none;
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: #d8d8d8;
        transition: all 0.4s ease;
      }

      &::-webkit-scrollbar-track {
        background: #fff;
      }
    }
  }
}
.standard-text {
  user-select: none;
  font-size: 14px;
  color: #0c6fff;
  position: relative;
  margin-left: 10px;
  &:hover {
    cursor: pointer;
    .dialog-standard {
      display: block;
    }
  }
}
.info-head-row {
  display: flex;
  align-items: center;
  margin-left: 60px;
  width: 84%;
  .info-head-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    white-space: nowrap;
    .info-head-title {
      color: #777777;
    }
    .info-head-value {
      font-size: 14px;
      color: #333333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.dialog-standard {
  display: none;
  position: absolute;
  top: 30px;
  width: 511px;
  height: 327px;
  background: #ffffff;
  z-index: 999;
  pointer-events: none;
  border-radius: 10px;
  box-shadow: 0px 4px 8px 0px rgba(194, 194, 194, 0.5);
  &:hover {
    display: block;
  }
  .header-standard {
    font-size: 16px;
    color: #333333;
    padding: 19px;
    border-bottom: 1px solid #e7e7e7;
  }
  .content-standard {
    padding: 19px 19px 0 19px;
    div {
      font-size: 14px;
      color: #333333;
      line-height: 2;
    }
  }
}
</style>
