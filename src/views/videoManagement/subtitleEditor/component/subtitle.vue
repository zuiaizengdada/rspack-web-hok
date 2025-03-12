<template>
  <div class="subtitleDesensitization">
    <div class="title">
      字幕脱敏<span class="title-tips">（按shift键可批量选中）</span>
      <span class="m-l-8">字幕大小： <el-select v-model="subtitleSize" size="mini" placeholder="请选择" @change="changeSubtitleSize">
        <el-option
          v-for="item in subtitleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select></span>
      <el-button v-if="type!==2" :loading="sumInfo.sumLoading" class="sum-btn" size="mini" plain subtitle-v-step="0" @click.stop="sumFn">
        <div class="sum-flex">
          <img class="icon-jqr" src="@/assets/image/aiIcon.gif" alt="" />
          {{ sumInfo.sumTranerTxt[sumInfo.status] }}
          <img v-show="sumInfo.status === 1" class="m-l-4" src="@/assets/svg/aiManage/animate_three.svg" alt="" />
        </div>
      </el-button>
    </div>
    <div class="search">
      <template v-if="type!==2">
        <el-checkbox v-model="checked" :indeterminate="isIndeterminate" :disabled="data.length === 0" @change="handleCheckAllChange">全选</el-checkbox>
        <div class="tips txt-nowrap">已选：{{ checkNumber }}条</div>
        <el-dropdown :disabled="multipleSelection.length === 0 || batchType !== 1" @command="(e)=>batchDesensitization(e,1)">
          <el-button :disabled="multipleSelection.length === 0 || batchType !== 1" :loading="loading" class="btn_primary" style="margin-left: 32px;margin-right: 8px;" size="mini">批量脱敏<i class="el-icon-arrow-down el-icon--right" /></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item) in sensitiveMark" :key="item.id" :command="item.id">{{ item.name }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button :loading="loading" size="mini" :disabled="multipleSelection.length === 0 || batchType !== 1" @click="batchDesensitization('',0)">批量取消</el-button>
        <el-dropdown @command="handleCommand">
          <el-button size="mini" plain style="margin: 0px 8px;">
            爆款标记<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item) in tagList" :key="item.id" :command="item.id">{{ item.name }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="mini" :type="batchType!=1?'primary':''" :plain="batchType == 2" @click="batchApply">批量申请取消锁定</el-button>
        <el-dropdown @command="handleCommandAi">
          <el-button size="mini" plain style="margin: 0px 8px;">
            AI推荐<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item) in aiRecommendList" :key="item.value" :command="item.value">{{ item.label }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <div class="inputSearch">
        <span class="positonSearchText txt-nowrap">定位</span>
        <positonSearch
          v-model.trim="positionSearch.type"
          class="m-r-23"
          :loading="loading"
          :current.sync="positionSearch.current"
          :total="positionSearch.total"
          @clickNext="positonSearchClickNext"
          @change="positonSearchChange"
        />
        <span class="positonSearchText txt-nowrap">关键词</span>
        <searchInput
          ref="searchInput"
          v-model="search.keyWord"
          :loading="loading"
          :current.sync="search.current"
          :total="search.total"
          @keyup.enter.native="submit"
          @clear="clear"
          @change="searchCurrentChange"
        />
      </div>
    </div>

    <div v-if="data.length === 0" id="subtitle" class="subtitle">
      <div class="noData">
        <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
        <div class="m-t-10 noDataText">暂无字幕内容</div>
      </div>
    </div>
    <VirtualList
      v-else
      :id="id"
      ref="Virtual"
      v-slot="{item, index}"
      :list-data="data"
      :tag-list="tagList"
      :sensitive-mark="sensitiveMark"
      :is-desensitized="isDesensitized"
      :multiple-selection="multipleSelection"
      :estimated-item-size="50"
      :current="current"
      :is-old="isOld"
      :type="type"
      @scrollEvent="scrollEvent"
      @setDesensitization="setDesensitization"
      @toStopVideo="toStopVideo"
      @loadZmData="loadZmDatad"
      @changeCheckFlag="changeCheckFlag"
      @clearXuanzhong="clearXuanzhong"
    >
      <div class="subtitleListLi" :class="{currentPlayer: current === Number(index),aiDesensitizedBg:allAiDesensitizedList.includes(item.id),hotWordBg:allAiHotWordList.includes(item.id)}">
        <span class="time">
          <!-- batchType 为1的时候禁用desensitizeType为1的  batchType不为1的时候禁用desensitizeType不为1或approveStatus不为0和不为4的数据 -->
          <el-checkbox
            :value="multipleSelection.includes(item.id)"
            :disabled="disabledCheck(item)"
            @change="(val) => handleCheckChange(val, item, index)"
          >
            <span class="m-l-8 a_link" :style="{fontSize:subtitleSize+'px'}">
              {{ item.startTime | getTime }}-{{ item.endTime | getTime }}
            </span>
          </el-checkbox>
        </span>
        <div class="text" :class="item.isHot === 1?'has-hot-line':''" @click="changeTime(item, index)">
          <span :style="{fontSize:subtitleSize+'px'}" class="text_value" :class="{selectCurrent:current === Number(index)}" v-html="filtersText(item.originalContent, item)" />
          <span :style="{fontSize:subtitleSize+'px',width:'100%',height:'50px',lineHeight:'50px'}" class="new_text_value" :class="{selectCurrent:current === Number(index)}" v-html="filtersTextNew(item.originalContent, item)" />
          <!-- <span class="text_value_render" :class="{desensitization: item.isDesensitized === 1}" v-html="filtersText2(item)" /> -->
          <span :style="{fontSize:subtitleSize+'px'}" class="text_value_render flex flex-middle" :class="{desensitization: (isDesensitized.includes(item.id)&&item.completedDesensitizationType!==1),automaticDesensitization:item.desensitizeType === 1&&filterAutoDesensitized(item.id),selectCurrent:current === Number(index)}" v-html="filtersText2(item)" />
          <span v-if="type!==2 && showDesensitizedTipsList.includes(item.id) && !showHotWordTipsList.includes(item.id)" :class="{'flex flex-column flex-top aiRecommend aiRecommend1 m-l-8':true,'top_before':index===0,'bottom_before':index === data.length-1 }" :style="computeMarginTop(index, data.length)" @click.stop>
            <div class="flex flex-middle">
              <img :src="aiDesensiti" alt="" class="ai_icon" />
              <span>脱敏推荐</span>
              <span class="flex flex-middle" style="margin-left: 34px;">
                <el-button class="m-l-8 flex flex-middle" style="height: 24px;" type="primary" size="mini" @click.stop="adoptDesensitized(item.id,1,1)">采纳</el-button>
                <el-button class="flex flex-middle" size="mini" style="height: 24px;" @click.stop="adoptDesensitized(item.id,2,1)">取消</el-button>
              </span>
            </div>
            <div v-if="item.remark" class="my_Describe">
              <el-tooltip class="item" effect="dark" placement="bottom">
                <div slot="content" class="my_describe_Content">
                  {{ item.remark }}
                </div>
                <span class="hotDescribe text_hidden_1">
                  {{ item.remark }}
                </span>
              </el-tooltip>
            </div>
          </span>
          <span v-if="item.hotMarkNum" class="text_hot_bj flex flex-middle">
            <span v-for="(ele) in item.list" :key="ele.id" class="myHotMark" :style="`background:${getPrColor(filterMarkTypeId(ele.markTypeId).color)}`" @click.stop="toShowTheCommentData($event,ele)">
              {{ filterMarkTypeId(ele.markTypeId).name }}
            </span>
            <span v-if="type!==2 && showHotWordTipsList.includes(item.id)" :class="{'flex flex-column flex-top aiRecommend aiRecommend1 m-l-8':true,'top_before':index===0,'bottom_before':index === data.length-1 }" :style="computeMarginTop(index, data.length)" @click.stop>
              <div class="flex flex-middle">
                <img :src="aiDesensiti" alt="" class="ai_icon" />
                <span>爆款推荐</span>
                <span class="flex flex-middle" style="margin-left: 34px;">
                  <el-button class="m-l-8 flex flex-middle" style="height: 24px;" type="primary" size="mini" @click.stop="adoptDesensitized(item.id,1,2)">采纳</el-button>
                  <el-button class="flex flex-middle" size="mini" style="height: 24px;" @click.stop="adoptDesensitized(item.id,2,2)">取消</el-button>
                </span>
              </div>
              <div v-if="item.list && item.list[item.list.length - 1].remarks" class="my_Describe">
                <el-tooltip class="item" effect="dark" :content="item.list[item.list.length-1].remarks" placement="bottom">
                  <div slot="content" class="my_describe_Content">
                    {{ item.list | getRemarks }}
                  </div>
                  <span class="hotDescribe text_hidden_1">
                    {{ item.list | getRemarks }}
                  </span>
                </el-tooltip>
              </div>
            </span>
          </span>
        </div>
        <span v-if="type!==2 " class="action">
          <!-- 脱敏过的列表 -->
          <span v-if="isDesensitized.includes(item.id)">
            <el-button v-if="item.desensitizeType !== 1 && isDesensitized.includes(item.id)" :loading="loading" size="small" @click="desensitizationFn(item, 0)">取消</el-button>
            <span v-if="item.desensitizeType === 1 && (item.approveStatus === 0 || item.approveStatus === 4) && filterAutoDesensitized(item.id)" class="flex flex-middle aiLock">
              <span v-if=" aicancelDesensitizedList.includes(item.id)" class="flex flex-middle aiRecommend m-l-8 m-r-16" @click.stop>
                <img :src="aiDesensiti" alt="" class="ai_icon" />
                <span class="lockRecommend">推荐</span>
                <el-button class="flex flex-middle m-l-8" size="mini" style="height: 24px;" @click.stop="cancelRecommen(item.id)">取消</el-button>
              </span>
              <el-button size="small" type="danger" plain @click="applyCancellation(item)">申请取消锁定</el-button>
            </span>
            <el-button v-if="item.desensitizeType === 1 && item.approveStatus === 1 && filterAutoDesensitized(item.id)" size="small" plain @click="applyCancellation(item)">撤销申请</el-button>
            <el-button v-if="item.desensitizeType === 1 && item.approveStatus ===3 && filterAutoDesensitized(item.id)" size="small" type="danger" plain @click="applyCancellation(item)">重新申请</el-button>
          </span>
          <!-- 没有脱敏过的 -->
          <span v-else>
            <span v-if="item.approveStatus === 2" class="approveStatusSuccess"><i class="el-icon-success" />取消锁定审核通过</span>
            <el-dropdown @command="(e)=>desensitizationFn(item, 1,e)">
              <el-button :loading="loading" size="small" class="btn_primary">脱敏<i class="el-icon-arrow-down el-icon--right" /></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item) in sensitiveMark" :key="item.id" :command="item.id">{{ item.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>

        </span>
      </div>
    </VirtualList>
    <div v-if="showCommentDataFlag" class="comment-block-d" @click="cancelTheCommentData">
      <div ref="commentDataContent" class="comment-data" @click.stop="function(){ return }">
        <div class="comment-data-line flex flex-column">
          <span class="com-top">
            <em />
            <el-tooltip class="item" effect="dark" placement="top" popper-class="myTool_comment">
              <div slot="content" class="myDataContent ">
                <div class="flex flex-between flex-middle myCommentTit">
                  <span style="font-size: 16px;">标记文案</span>
                  <span v-clipboard:copy="newShowCommentData.content" v-clipboard:success="clipboardSuccess" class="m-l-14 a_link">
                    <i class="el-icon-document-copy a_link " />
                    <span class="copyDescribe">复制</span>
                  </span>
                </div>
                <div class="overflowOuto2 commentDetails">
                  <template v-if="commentDataDetails.length>0">
                    <div v-for="(item,index) in commentDataDetails" :key="index+item.videoHotMarkId">
                      {{ item.content }}
                    </div>
                  </template>
                  <template v-else>
                    <div class="noData">
                      {{ newShowCommentData.content }}
                    </div>
                  </template>
                </div>
              </div>
              <p>{{ newShowCommentData.content }}</p>
            </el-tooltip>
          </span>
          <div class="com-data-cen">
            <!-- <img src="@/assets/image/video/mornetouxiang.png"> -->
            <div class="c-d-c-data">
              <span class="c-d-c-span flex flex-middle flex-between">
                <span>
                  <em style="font-size: 16px;">{{ showHotWordMarkId.includes(newShowCommentData.markId)?'AI推荐': newShowCommentData.name }}</em>
                  <i style="font-size: 14px;">{{ newShowCommentData.createTime }}</i>
                </span>
                <span v-if="!showHotWordMarkId.includes(newShowCommentData.markId)">
                  <!-- <i class="el-icon-edit" style="font-size: 24px;color: #3386FF;" @click="updateContent(newShowCommentData)" /> -->
                  <i class="el-icon-edit" style="font-size: 16px;color: #3386FF;" @click="updateHotMark()" />
                  <i class="el-icon-delete" style="font-size: 16px;color: #F54B4B;" @click="deleteBk(newShowCommentData)" />
                </span>
              </span>
              <div style="margin-top: 10px;">
                <el-input v-model="newShowCommentData.remarks" v-loading="hotMarkInfo.timer" size="mini" type="textarea" :rows="3" show-word-limit />
                <div class="action-block flex flex-middle flex-between">
                  <img class="icon-jqr" src="@/assets/image/aiIcon.gif" alt="" @click="aiHotMaskFn" />
                  <div>
                    <el-button size="mini" @click="cancelUpdate(newShowCommentData)">取消</el-button>
                    <el-button size="mini" type="primary" @click="sureToUpdate(newShowCommentData)">确定</el-button>
                  </div>
                </div>
              </div>
              <!-- <p v-else class="c-d-c-p">{{ newShowCommentData.remarks }}</p> -->
            </div>
          </div>
        </div>
        <!-- 编辑 -->
        <!-- v-if="showTagFlag" -->
        <div v-if="showTagFlag" class="myHotMarkList overflowOuto flex flex-column">
          <span v-for="(item,index) in tagList" :key="index" class="mySpan2 flex flex-middle" :style="newShowCommentData.markTypeId === item.id?'background:#eee;cursor:no-drop':''" @click.stop="checkHotsMark(item,newShowCommentData)">
            <span class="myHotTag" :style="`background:${getPrColor(item.color)}`" />
            <span>{{ item.name }}</span>
          </span>
        </div>
      </div>

    </div>
    <approve-opt ref="approveOpt" @submit="submitForm" @batchSubmit="batchSubmit" />
    <abstractDialog ref="abstractDialogRef" @reset="newVideoSubtitle" />
  </div>
</template>

<script>
import searchInput from './searchInput.vue'
import approveOpt from './approveOpt.vue'
import abstractDialog from './abstractDialog.vue'
import aiDesensiti from '@/assets/svg/videoManga/aiDesensiti.svg'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
import {
  productOriginalVideoSubtitleRenewStatus,
  deleteHotMark,
  editHotMark, queryMarkSubtitle, editRecommendStatus, batchOperate, cancelRecommenSubtitle, videoSubtitleApi, newVideoSubtitleApi,
  hotMarkApi, getHotMarkGenerateResultApi
} from '@/api/videoManagement/subtitleEditor'
import {
  hotMarkTypeList, sensitiveMarkTypeList
} from '@/api/product/tagManage'
import { desensitizationCancel, newDesensitizationApplication } from '@/api/system/desensitiApproval'
import VirtualList from './virtualList'
import positonSearch from './positonSearch.vue'
import press from './press'
import { setItem, getItem } from '@/utils/localStorage'
export default {
  directives: {
    press,
    clipboard
  },
  filters: {
    // 毫秒转时:分:秒:毫秒
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
    },
    getRemarks(list) {
      return list[list.length - 1].remarks
    }
  },
  components: {
    searchInput,
    VirtualList,
    positonSearch,
    approveOpt,
    abstractDialog
  },
  props: {
    currentTime: {
      type: Number,
      default: 0
    },
    isOld: {
      type: Boolean,
      default: false
    },
    aiHotWordInfo: {
      type: Object,
      default: () => {}
    },
    aiDesensitizationInfo: {
      type: Object,
      default: () => {}
    },
    aicancelDesensitizedList: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    videoId: {
      type: [String, Number],
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      aiDesensiti,
      nowShowCommentData: [],
      newShowCommentData: null,
      showCommentDataFlag: false,
      tagList: [],
      sensitiveMark: [],
      subtitleSize: 14,
      subtitleOptions: [{ value: 12, label: '小号' }, { value: 14, label: '中号' }, { value: 16, label: '大号' }, { value: 18, label: '特大号' }],
      aiRecommendList: [{ value: 2, label: 'AI推荐一键取消' }, { value: 1, label: 'AI推荐一键采纳' }],
      hotTagType: '0',
      showTagFlag: false,
      search: {
        keyWord: '',
        current: 0,
        total: 0,
        arr: []
      },
      batchType: 1, // 按钮样式
      // 定位筛选
      positionSearch: {
        type: '', // 1: 脱敏字幕 2：敏感词 3：爆款标记
        current: 0,
        total: 0,
        arr: []
      },
      // 全选标识
      checked: false,
      isIndeterminate: false,
      checkNumber: 0,

      // 当前高亮选项
      current: '',
      z_current: false,
      z_current_index: '',

      // 当前多选的选项的id集合
      multipleSelection: [],
      // 当前脱敏的数据集合
      isDesensitized: [],
      // 所有自动脱敏id集合 不会根据手动改变
      autoDesensitized: [],
      isHotArray: [],
      // 是否在滚动中
      isScrolling: false,
      scrollTimer: null,
      commentDataDetails: [],
      searchKeyword: '',
      loading: false,
      ifScroll: false, // 给滚动加个锁
      endTop: 0,
      startTop: 0,
      step: 0,

      ifShift: false, // 是否按住了shfit
      isCheckedNow: false,
      moreSelection: [], // 记录最后勾选的操作以及按住shfit时的操作
      updateRemarks: '',

      // ai总结
      sumInfo: {
        sumLoading: false,
        timer: null,
        status: 0,
        sumTranerTxt: ['AI总结', 'AI生成中', '请查看总结', 'AI重新总结'],
        cnt: {}, // 视频总结内容
        options: { // 功能指引 配置文件
          useModalOverlay: true,
          keyboardNavigation: true,
          defaultStepOptions: {
            cancelIcon: {
              enabled: true
            },
            scrollTo: { behavior: 'smooth', block: 'center' },
            modalOverlayOpeningPadding: 8,
            modalOverlayOpeningRadius: 4,
            buttons: [
              {
                action() {
                  return this.back()
                },
                text: '上一步',
                classes: 'shepherd-back-button'
              },
              {
                action() {
                  return this.next()
                },
                text: '下一步',
                classes: 'shepherd-next-button'
              }
            ]
          }
        }
      },
      //  爆款标记 ai总结
      hotMarkInfo: {
        timer: null,
        status: 0
      }
    }
  },
  computed: {
    allAiDesensitizedList() {
      return this.aiDesensitizationInfo?.subtitleIds.flat() || []
    },
    showDesensitizedTipsList() {
      return this.aiDesensitizationInfo?.subtitleIds.map(item => item[0]) || []
    },
    allAiHotWordList() {
      return this.aiHotWordInfo?.list.map(item => item.subtitleIds).flat() || []
    },
    showHotWordTipsList() {
      return this.aiHotWordInfo?.list.map(item => item.beginSubtitleId) || []
    },
    showHotWordMarkId() {
      return this.aiHotWordInfo?.list.map(item => item.markId) || []
    }
  },
  watch: {
    currentTime: {
      handler(val) {
        // console.log('currentTime', val)
        const time = (val * 1000).toFixed(3)
        if (this.data.length > 0) {
          const index = this.data.findIndex((v, i) => {
            if (i === 0) {
              return this.data.length < 2 ? (time < v.endTime) : (time < this.data[i + 1].startTime)
            } else if (i === this.data.length - 1) {
              return time >= v.startTime
            } else {
              return (time >= v.startTime && time < this.data[i + 1].startTime)
            }
          })
          // console.log('index', index)
          if (index > -1) {
            this.current = index
            if (this.z_current) {
              if (index !== this.z_current_index) {
                this.current = this.z_current_index
                this.z_current = false
              }
            }
            if (this.isScrolling) {
              return
            }
            this.scrollTo(index)
          }
        }
      },
      deep: true,
      immediate: true
    },
    'search.current': {
      handler(val, oldVal) {
        this.$nextTick(() => {
          document.getElementById(`search_${oldVal}`) && (document.getElementById(`search_${oldVal}`).style.backgroundColor = '#FFFF05')
          if (document.getElementById(`search_${val}`)) {
            (document.getElementById(`search_${val}`).style.backgroundColor = '#FF9632')
          } else {
            const timer = setInterval(() => {
              if (document.getElementById(`search_${val}`) || val === 0) {
                clearInterval(timer)
              }
              document.getElementById(`search_${val}`) && (document.getElementById(`search_${val}`).style.backgroundColor = '#FF9632')
            }, 100)
          }
          // document.getElementById(`search_${val}`) && (document.getElementById(`search_${val}`).style.backgroundColor = '#FF9632')
        })
      }
    },
    // data: {
    //   handler() {
    //     this.initIsDesensitized()
    //   },
    //   immediate: true,
    //   deep: true
    // },
    'positionSearch.type': {
      handler(val) {
        console.log(val)
        this.positionSearch.current = 0
        this.positionSearch.total = 0
        this.positionSearch.arr = []
        if (val === '') {
          return console.log('清空')
        } else if (val === '1') {
          this.positonDesensitizedSubtitles()
          return console.log('定位脱敏字幕')
        } else if (val === '2') {
          this.positonSensitiveWords()
          return console.log('定位敏感词')
        } else if (val === '3') {
          this.isHotSubtitles()
          return console.log('定位爆款标记')
        } else if (val === '4') {
          this.positionApplication(1)
          return console.log('定位申请中')
        } else if (val === '5') {
          this.positionApplication(2)
          return console.log('定位审核通过')
        } else if (val === '6') {
          this.positionApplication(3)
          return console.log('定位审核驳回')
        } else if (val === '7' || val === '8' || val === '9') {
          this.positionAiRecommend(val)
          return console.log('AI推荐处理')
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.keyDown()
    this.getHotMarkTypeList()
    this.getSensitiveMark()
    const subtitleSize = localStorage.getItem('subtitleSize')
    this.subtitleSize = subtitleSize && Number(subtitleSize) || 14
  },
  beforeDestroy () {
    this.resetSumInfo()
    this.keyDownReview()
  },
  mounted() {
    this.resetSumInfo()
    this.initStep()
  },
  methods: {
    initStep() {
      if (getItem('subtitle-v-step')) return
      this.$nextTick(() => {
        setTimeout(() => {
          setItem('subtitle-v-step', true)
          const tour = this.$shepherd(this.sumInfo.options)
          const steps = [
            {
              title: '功能上新：AI爆款总结',
              text: `点击AI总结`,
              showCancelLink: true,
              canClickTarget: false,
              attachTo: {
                element: "[subtitle-v-step='0']",
                on: 'bottom'
              },
              when: {
                show: () => {
                  this.$refs.abstractDialogRef.close()
                }
              },
              buttons: [
                {
                  text: '下一步',
                  action: () => {
                    this.$refs.abstractDialogRef.open({
                      'result': '【全文摘要】这段文字主要描述了一辆车的状况，窗户未关导致车内泡水，座椅坐垫也受到影响。\n\n【具体大纲】\n1. 描述车辆的状况：窗户未关，车内泡水，座椅坐垫起来。\n2. 未提及车辆其他方面的信息。',
                      'fullTextAbstract': '这段文字主要描述了一辆车的状况，窗户未关导致车内泡水，座椅坐垫也受到影响。\n\n',
                      'outline': '\n1. 描述车辆的状况：窗户未关，车内泡水，座椅坐垫起来。\n2. 未提及车辆其他方面的信息。'
                    })
                    this.$nextTick(() => {
                      setTimeout(() => { tour.next() }, 200)
                    })
                  },
                  classes: 'shepherd-next-button'
                }
              ]
            },
            {
              title: '功能上新：AI爆款总结',
              text: `可以查看全文概要和章节概述，快速掌握视频主要内容`,
              showCancelLink: true,
              canClickTarget: false,
              when: {
                hide: () => {
                  this.$refs.abstractDialogRef.close()
                }
              },
              buttons: [
                {
                  text: '上一步',
                  action: () => {
                    this.$refs.abstractDialogRef.open({
                      'result': '【全文摘要】这段文字主要描述了一辆车的状况，窗户未关导致车内泡水，座椅坐垫也受到影响。\n\n【具体大纲】\n1. 描述车辆的状况：窗户未关，车内泡水，座椅坐垫起来。\n2. 未提及车辆其他方面的信息。',
                      'fullTextAbstract': '这段文字主要描述了一辆车的状况，窗户未关导致车内泡水，座椅坐垫也受到影响。\n\n',
                      'outline': '\n1. 描述车辆的状况：窗户未关，车内泡水，座椅坐垫起来。\n2. 未提及车辆其他方面的信息。'
                    })
                    this.$nextTick(() => {
                      setTimeout(() => { tour.back() }, 200)
                    })
                  },
                  classes: 'shepherd-back-button'
                },
                {
                  text: '下一步',
                  action: () => {
                    this.$refs.Virtual.stepCheckedNow(true)
                    this.$nextTick(() => {
                      setTimeout(() => { tour.next() }, 100)
                    })
                  },
                  classes: 'shepherd-next-button'
                }
              ],

              attachTo: {
                element: "[subtitle-v-step='1'] .el-dialog",
                on: 'bottom'
              }
            },
            {
              title: '功能上新：AI爆款总结',
              text: `选择要标记为爆款的文本，点击爆款标记`,
              canClickTarget: false,
              showCancelLink: true,
              attachTo: {
                element: "[subtitle-v-step='2']",
                on: 'bottom'
              },
              buttons: [
                {
                  text: '上一步',
                  action: () => {
                    this.$refs.Virtual.stepCheckedNow(false)
                    this.$refs.abstractDialogRef.open({
                      'result': '【全文摘要】这段文字主要描述了一辆车的状况，窗户未关导致车内泡水，座椅坐垫也受到影响。\n\n【具体大纲】\n1. 描述车辆的状况：窗户未关，车内泡水，座椅坐垫起来。\n2. 未提及车辆其他方面的信息。',
                      'fullTextAbstract': '这段文字主要描述了一辆车的状况，窗户未关导致车内泡水，座椅坐垫也受到影响。\n\n',
                      'outline': '\n1. 描述车辆的状况：窗户未关，车内泡水，座椅坐垫起来。\n2. 未提及车辆其他方面的信息。'
                    })
                    this.$nextTick(() => {
                      setTimeout(() => { tour.back() }, 0)
                    })
                  },
                  classes: 'shepherd-next-button'
                },
                {
                  text: '下一步',
                  action: () => {
                    this.$refs.Virtual.stepHotsMark(true)
                    this.$nextTick(() => {
                      setTimeout(() => {
                        tour.next()
                      }, 0)
                    })
                  },
                  classes: 'shepherd-next-button'
                }
              ]

            },
            {
              title: '功能上新：AI爆款总结',
              canClickTarget: false,
              text: `点击【AI管家】头像，唤醒【AI帮写】，AI可自动对该段文本进行总结。`,
              showCancelLink: true,
              attachTo: {
                element: "[subtitle-v-step='3']",
                on: 'bottom'
              },
              buttons: [
                {
                  text: '上一步',
                  action: () => {
                    this.$refs.Virtual.stepHotsMark(false)
                    this.$refs.Virtual.stepCheckedNow(true)
                    setTimeout(() => { tour.back() }, 0)
                  },
                  classes: 'shepherd-back-button'
                },
                {
                  text: '下一步',
                  action: tour.next,
                  classes: 'shepherd-next-button'
                }
              ]
            },
            {
              title: '功能上新：AI爆款总结',
              canClickTarget: false,
              text: `可对AI总结内容进行修改，点击确认，完成爆款总结`,
              showCancelLink: true,
              attachTo: {
                element: "[subtitle-v-step='3']",
                on: 'bottom'
              },
              buttons: [
                {
                  text: '上一步',
                  action: tour.back,
                  classes: 'shepherd-back-button'
                },
                {
                  text: '完成',
                  action: () => {
                    this.$refs.Virtual.stepHotsMark(false)
                    tour.next()
                  },
                  classes: 'shepherd-next-button'
                }
              ]
            }
          ]
          steps.forEach(item => {
            tour.addStep(item)
          })
          tour.on('cancel', () => {
            // 这里定义引导流程被取消时的逻辑
            this.$refs?.abstractDialogRef.close()
            this.$refs?.Virtual.stepHotsMark(false)
            this.$refs?.Virtual.stepCheckedNow(false)
          })
          tour.start()
        }, 500)
      })
    },
    disabledCheck(item) {
      // 副机位相同标识
      // if (item.isSame) {
      //   return true
      // }
      return this.batchType === 1 ? item.desensitizeType === 1 : (item.desensitizeType !== 1 || (item.approveStatus !== 0 && item.approveStatus !== 3 && item.approveStatus !== 4))
    },
    changeSubtitleSize(val) {
      localStorage.setItem('subtitleSize', val)
    },
    computeMarginTop(index, length) {
      // if (index === 0) {
      //   return { 'margin-top': '-30px' }
      // }
      // if (index === length - 1) {
      //   return { 'margin-top': '-64px' }
      // }
      // return {}
    },
    // 脱敏采纳
    async adoptDesensitized(id, status, type) {
      console.log('点击了')
      // 查找id在this.aiDesensitizationInfo?.subtitleIds哪个里面，并拿到这个数组
      let ids = []
      let markId = ''
      if (type === 1) {
        ids = this.aiDesensitizationInfo?.subtitleIds.find(item => item.includes(id))
      } else {
        ids = this.aiHotWordInfo?.list.find(item => item.subtitleIds.includes(id))?.subtitleIds
        markId = this.aiHotWordInfo?.list.find(item => item.subtitleIds.includes(id))?.markId
      }
      const res = await editRecommendStatus({ originalVideoId: this.id, reqId: type === 2 ? this.aiHotWordInfo.reqId : this.aiDesensitizationInfo.reqId, status: status, subtitleIds: ids, type: type, markId: markId })
      // 如果采纳且this.isDesensitized没有这一条push(item.id)
      if (res.code === 1) {
        this.$message.success('操作成功')
        if (status === 1 && !this.isDesensitized.includes(id)) {
          this.isDesensitized.push(id)
        }
        if (type === 1) {
          this.$emit('resetAiDesensitized')
        } else {
          this.$emit('resetAiHotWord')
        }
        this.$emit('loadZmData', this.id)
      }
    },
    // 取消Ai推荐申请锁定
    async cancelRecommen(ids) {
      const res = await cancelRecommenSubtitle({ originalVideoId: this.id, subtitleIds: [ids] })
      if (res.code === 1) {
        this.$message.success('操作成功')
        this.$emit('cancelRecommen')
      }
    },
    // 一键取消或者一键采纳
    async handleCommandAi(status) {
      let allIds = []
      if (this.allAiDesensitizedList.length === 0 && this.allAiHotWordList.length === 0 && this.aicancelDesensitizedList.length === 0) {
        this.$message.error('当前暂无推荐')
        return
      }
      // 合并去重
      allIds = this.allAiDesensitizedList
      const res = await batchOperate({ originalVideoId: this.videoId, status: status, subtitleIds: allIds })
      // 如果采纳且this.isDesensitized没有这一条push(item.id)
      if (res.code === 1) {
        this.$message.success('操作成功')
        if (status === 1) {
          this.allAiDesensitizedList.forEach(item => {
            if (!this.isDesensitized.includes(item)) {
              this.isDesensitized.push(item)
            }
          })
        }
        this.$emit('resetAiDesensitized')
        this.$emit('resetAiHotWord')
        this.$emit('cancelRecommen')
        this.$emit('loadZmData', this.id)
      }
    },
    async getHotMarkTypeList() {
      const res = await hotMarkTypeList()
      console.log(res, 'res标签类型')
      this.tagList = res.data
    },
    async getSensitiveMark() {
      const res = await sensitiveMarkTypeList()
      this.sensitiveMark = res.data
      console.log(res, 'res')
    },
    filterMarkTypeId(id) {
      const defArr = this.tagList.filter(item => item.id === '0')
      // 通过传入的id匹配tagList里面的数据
      const arr = this.tagList.filter(item => item.id === id)
      return arr[0] || defArr[0]
    },
    checkHotsMark(item, data) {
      if (data.markTypeId === item.id) {
        return
      }
      const params = {
        hotMarkId: data.markId,
        hotMarkTypeId: item.id,
        remarks: data.remarks
      }
      editHotMark(params).then(res => {
        if (res.code === 1) {
          this.$message.success('修改成功！')
          this.showTagFlag = false
          this.showCommentDataFlag = false
          this.$emit('loadZmData', this.id)
          this.$set(item, 'remarks', item.updateRemarks)
        }
      })
    },
    updateHotMark() {
      this.showTagFlag = !this.showTagFlag
    },
    async batchSubmit() {
      await newDesensitizationApplication({ videoSubtitleIds: this.multipleSelection })
      this.data.some(item => {
        this.multipleSelection.forEach(id => {
          if (item.id === id) {
            this.$set(item, 'approveStatus', 1)
          }
        })
      })
      this.$refs.approveOpt.handleClose()
      this.batchType = 1
      this.resetApplyStatus()
      // 提交
      this.$message.success('提交成功')
    },
    setDesensitization(flag, list, data) {
      const arr = []
      list.forEach(v => {
        arr.push({
          videoId: this.videoId,
          id: v.id,
          isDesensitized: Number(flag),
          sensitiveMarkTypeId: data && data.id || ''
        })
      })
      productOriginalVideoSubtitleRenewStatus(arr).then(res => {
        list.forEach((item) => {
          const i = this.isDesensitized.findIndex(v => v === item.id)
          console.log(i)
          if (i > -1) {
            !flag && this.isDesensitized.splice(i, 1)
          } else {
            flag && this.isDesensitized.push(item.id)
          }
        })
        console.log(this.isDesensitized, 'this.isDesensitized')
        this.resetData()
        this.$emit('changeUpdateTime', res.timestamp)
      }).catch(() => {
        this.loading = false
      })
    },
    // 批量申请取消锁定
    async batchApply() {
      if (this.batchType === 1) {
        this.resetApplyStatus()
        this.batchType = 2
        return
      }
      if (this.batchType === 2) {
        this.resetApplyStatus()
        this.batchType = 1
        return
      }
      if (this.batchType === 3) {
        // this.multipleSelection匹配this.data里面的数据
        const arr = []
        this.data.forEach(item => {
          this.multipleSelection.forEach(id => {
            if (item.id === id) {
              arr.push(item)
            }
          })
        })
        console.log(arr, 'arr2')
        this.$refs.approveOpt.show(arr, 0, true)
      }
    },
    checkVideoReset() {
      this.batchType = 1
      this.resetApplyStatus()
    },
    resetApplyStatus() {
      this.checked = false
      this.multipleSelection = []
      this.isIndeterminate = false
      this.checkNumber = 0
    },
    // 申请取消锁定
    applyCancellation(item) {
      if (item.approveStatus === 0) {
        this.$uweb && this.$uweb.setAction('Event_Onlinedesensiti_unlock')
      }
      if (item.approveStatus === 1) {
        this.$uweb && this.$uweb.setAction('Event_Onlinedesensiti_revoke')
      }
      if (item.approveStatus === 3) {
        this.$uweb && this.$uweb.setAction('Event_Onlinedesensiti_again')
      }
      this.$refs.approveOpt.show(item, item.approveStatus)
    },
    async submitForm(id, type) {
      // 申请取消脱敏
      if (type === 0 || type === 3 || type === 4) {
        const res = await newDesensitizationApplication({ videoSubtitleIds: [id] })
        // 根据传入的id改变this.data里面对应那条数据的approveStatus
        if (res.code === 1) {
          this.data.some(item => {
            if (item.id === id) {
              this.$set(item, 'approveStatus', 1)
              return true
            }
          })
          this.$refs.approveOpt.handleClose()
          this.$message.success('申请取消脱敏成功')
        }
      }
      // 撤销申请
      if (type === 1) {
        const res = await desensitizationCancel({ videoSubtitleId: id })
        if (res.code === 1) {
          this.data.some(item => {
            if (item.id === id) {
              this.$set(item, 'approveStatus', 0)
              return true
            }
          })
          this.$refs.approveOpt.handleClose()
          this.$message.success('撤销申请成功')
        }
      }
      this.$emit('cancelRecommen')
    },
    // autoDesensitized根据传入的参数判断是否包含传入id
    filterAutoDesensitized(value) {
      // autoDesensitized数据结构为[{id:''}]
      const arr = this.autoDesensitized.map(item => item.id)
      return arr.includes(value)
    },
    updateContent(item) {
      this.nowShowCommentData.some(obj => {
        this.$set(obj, 'updateFlag', false)
      })
      this.$set(item, 'updateRemarks', item.remarks)
      this.$set(item, 'updateFlag', true)
    },
    cancelUpdate(item) {
      this.showCommentDataFlag = false
      this.showTagFlag = !this.showTagFlag
      // this.$set(item, 'updateFlag', false)
    },
    sureToUpdate(item) {
      console.log(item, 'sureToUpdate')
      this.showTagFlag = !this.showTagFlag
      if (item.remarks.indexOf('“') >= 0 || item.remarks.indexOf('"') >= 0 || item.remarks.indexOf('\\') >= 0) {
        this.$message.error('标记名称不能包含“”、""、\\')
        return
      }
      const params = {
        hotMarkId: item.markId,
        remarks: item.remarks,
        hotMarkTypeId: item.markTypeId
      }
      editHotMark(params).then(res => {
        if (res.code === 1) {
          this.$message.success('修改成功！')
          this.showCommentDataFlag = false
          this.$set(item, 'updateFlag', false)
          this.$set(item, 'remarks', item.remarks)
          this.$emit('loadZmData', this.id)
        }
      })
    },
    changeCheckFlag(flag) {
      this.isCheckedNow = flag
    },
    toStopVideo() {
      this.$emit('toStopVideo')
    },
    deleteBk(obj) {
      console.log(obj)
      const params = {
        markId: obj.markId
      }
      deleteHotMark(params).then(res => {
        console.log(res)
        if (res.success) {
          this.$message.success('爆款标记删除成功！')
          this.nowShowCommentData.some((item, index) => {
            if (item.markId === obj.markId) {
              this.nowShowCommentData.splice(index, 1)
            }
          })
          if (this.nowShowCommentData.length <= 0) {
            this.showCommentDataFlag = false
          }
          this.$emit('loadZmData', this.id)
        }
      })
    },
    loadZmDatad() {
      this.$emit('loadZmData', this.id)
      setTimeout(() => {
        if (this.positionSearch.type === 3) {
          this.isHotSubtitles()
        }
      }, 500)
    },
    clearXuanzhong() {
      this.isIndeterminate = false
      this.multipleSelection = []
      this.checked = false
    },
    handleCommand(item) {
      const arr = []
      this.multipleSelection.forEach(v => {
        console.log('vvvvvvvvv:', v)
        this.data.some((item, index) => {
          if (v === item.id) {
            arr.push({ item, _index: index })
          }
        })
      })
      if (arr?.length === 0) {
        this.$message.error('请选择需要标记爆款的数据！')
        return
      }
      console.log('arrrrr:::::::', arr)
      this.$refs.Virtual.hotMarkTypeId = item
      this.$refs.Virtual.showComment(arr)
    },
    addBkBj() {
      const arr = []
      this.multipleSelection.forEach(v => {
        console.log('vvvvvvvvv:', v)
        this.data.some((item, index) => {
          if (v === item.id) {
            arr.push({ item, _index: index })
          }
        })
      })
      if (arr?.length === 0) {
        this.$message.error('请选择需要标记爆款的数据！')
        return
      }
      console.log('arrrrr:::::::', arr)
      this.$refs.Virtual.hotMarkTypeId = this.hotTagType
      this.$refs.Virtual.showComment(arr)
    },
    // 搜索框回车
    submit() {
      console.log(this.isDesensitized, 'this.isDesensitized')

      if (this.searchKeyword === this.search.keyWord) {
        return this.$refs.searchInput.clickNext()
      }
      this.loading = true
      this.search.current = 0
      this.searchKeyword = this.search.keyWord
      if (this.search.keyWord) {
        let sum = 0
        this.search.arr = []
        this.data.forEach((element, index) => {
          if (element.originalContent) {
            const str = element.originalContent.replace(new RegExp(this.search.keyWord, 'g'), (m, i) => {
              sum++
              this.search.arr.push({
                sum: sum,
                startTime: element.startTime,
                index: index
              })
              return `<span style="background-color:#FFFF05" id="search_${sum}" data-info="${index}">${this.search.keyWord}</span>`
            })
            element.search_content = str
          }
        })
        this.search.total = sum
        if (sum > 0) {
          this.search.current = 1
          this.gotoTarget(1)
        }
        this.loading = false
      } else {
        this.search.arr = []
        this.search.total = 0
        this.search.current = 0
        this.loading = false
      }
    },
    // 第一层渲染层展示文字背景色
    filtersText(text, item) {
      if (this.searchKeyword === '') {
        return text
      } else {
        if (this.search.current > 0 && item.search_content) {
          return item.search_content
        }
        return text
      }
    },
    // 真实操作层
    filtersTextNew(text, item) {
      return text
    },
    // 第二层渲染层展示文字主色与文字标记
    filtersText2(item) {
      if (item.content) {
        // const testStr = `因<span style='color: #999999;text-decoration:line-through' data-content="{content:'宗教敏感',color:'#00B42A'>为人</span><span style='color: #999999;text-decoration:line-through'>人都</span>在奋斗`
        // const str = item.content.replace(/style=['"]color: #999999.*?['"]/g, `class="showLabelPar" data-content="{content:'政治敏感',color:'#00B42A'}" style="color:#999999;text-decoration:line-through"`).replace(/(showLabelPar.*?>.*?)(<)/g, '$1<span class="showlabelChild">政治敏感</span>$2')
        // console.log(item.content, '进来的内容')
        const str = item.content.replace(/style=['"]color: #999999.*?['"]/g, `class="showLabelPar" style="color:#999999;text-decoration:line-through"`)
        // console.log(str, '加了父级的样式')
        // 分组 ，根据   正则匹配  (showLabelPar.*?>.*?)(<)   返回数组
        const arr1 = str.match(/(<span class="showLabelPar".*?>.*?)(<\/span>)/g)
        const arr = []
        // console.log(arr1, '正则匹配')
        arr1 && arr1.forEach((item) => {
          // 取item里面data-content里面的内容
          // data-content='{color:'YELLOW';content:'涉黄'}
          const item1 = item.match(/data-content=['"]{color:['"](.*?)['"];content:['"](.*?)['"]}['"]/)
          // 取item里面的内容
          if (item1) {
            const color = this.getPrColor(item1[1].trim())
            const item11 = item.replace(/(showLabelPar.*?>.*?)(<)/g, `$1<span class="showlabelChild" style='background:${color};'>${item1[2]}<span class='childBefore' style="border-bottom:6px solid ${color};"></span></span>$2`)
            arr.push(item11)
          } else {
            arr.push(item)
          }
        })

        // 根据分组内容 split 剩余字符串分解成数组
        const baseArr = str.split(/<span class="showLabelPar".*?>.*?<\/span>/g)
        let endStr = ''
        // console.log(baseArr, arr, '拼接的str')
        // 重新拼接 用baseArr ， arr 还原
        baseArr.forEach((item, index) => {
          endStr += item
          try {
            if (arr && arr[index]) {
              endStr += arr[index]
            }
          } catch (e) {
            console.log(e)
          }
        })
        // console.log(endStr, '最后返回的')
        return endStr
        // showLabelPar" data-content="{content:'政治敏感',color:…="color:#999999;text-decoration:line-through">好的<
      }
      return item.originalContent
    },
    // 判断当前播放时间是否在区域内
    renderCurrent(item, index) {
      console.log(item, index)
      const time = this.currentTime * 1000
      if (index === 0) {
        return this.data.length < 2 ? (time < item.endTime) : (time < this.data[index + 1].startTime)
      } else if (index === this.data.length - 1) {
        return time >= item.startTime
      } else {
        return (time >= item.startTime && time < this.data[index + 1].startTime)
      }
    },
    async toShowTheCommentData(e, item) {
      console.log(item, '当前点击的标签')
      if (this.type === 2) {
        return
      }
      // this.nowShowCommentData = item.list
      const res = await queryMarkSubtitle({ videoHotMarkId: item.markId })
      // 去掉res.data里面的span标签
      res.data.forEach(item => {
        item.content = item.content.replace(/<[^>]+>/g, '')
      })
      this.commentDataDetails = res.data
      console.log(res.data, 'res.data')
      this.newShowCommentData = Object.assign({}, item)
      this.showCommentDataFlag = true
      this.$nextTick(() => {
        const w = window.innerWidth
        const wLength = w - 505
        if (e.clientY > 650) {
          this.$refs.commentDataContent.style.top = (e.clientY - 260) + 'px'
        } else {
          this.$refs.commentDataContent.style.top = (e.clientY + 30) + 'px'
        }
        if ((e.clientX - 505) < (wLength / 2)) {
          this.$refs.commentDataContent.style.left = (e.clientX + 30) + 'px'
        } else {
          this.$refs.commentDataContent.style.left = (e.clientX - 320) + 'px'
        }
      })
    },
    cancelTheCommentData() {
      this.showCommentDataFlag = false
    },
    // 点击字幕
    changeTime(item, index) {
      console.log(item, 'item')
      this.current = index
      this.z_current = true
      this.z_current_index = index
      this.$emit('changTime', item.startTime / 1000)
    },
    // 字幕滚动(动画版本)
    scrollView(item) {
      const el = document.getElementById('subtitle')
      const el2 = document.getElementById(`subtitle${item.id}`)
      if (!el || !el2) {
        return
      }
      const setTop = el2.offsetTop - el.scrollTop - 152
      if (setTop > 600 || setTop < 0) {
        if (this.ifScroll) {
          return
        }
        if (this.timer) {
          this.ifScroll = false
          clearInterval(this.timer)
          this.timer = null
        }
        this.ifScroll = true
        this.endTop = el2.offsetTop - 200
        this.startTop = el.scrollTop
        const time = 10 // 时间(毫秒)
        this.step = (this.endTop - this.startTop) / time // 步进
        if (this.startTop < this.endTop) {
          this.timer = setInterval(() => {
            this.startTop = this.startTop + this.step
            el.scrollTop = this.startTop
            if (this.startTop >= this.endTop) {
              el.scrollTop = this.endTop
              this.ifScroll = false
              clearInterval(this.timer)
              this.timer = null
            }
          }, 10)
        } else {
          this.timer = setInterval(() => {
            this.startTop = this.startTop + this.step
            el.scrollTop = this.startTop
            if (this.startTop <= this.endTop) {
              el.scrollTop = this.endTop
              this.ifScroll = false
              clearInterval(this.timer)
              this.timer = null
            }
          }, 10)
        }
      }
    },
    // 跳转到指定的查询条件处
    gotoTarget(index) {
      this.z_current = true
      this.z_current_index = this.search.arr[index - 1].index
      this.$emit('changTime', this.search.arr[index - 1].startTime / 1000)
    },
    // 点击清空筛选项
    clear() {
      this.$emit('changTime', 0)
      this.submit()
    },
    // 筛选栏上一个下一个触发
    searchCurrentChange() {
      this.gotoTarget(this.search.current)
    },
    // 点击全选
    handleCheckAllChange(val) {
      if (this.isCheckedNow) {
        this.$message.error('请先结束当前的爆款标记操作！')
        return
      }
      this.isIndeterminate = false
      const multipleSelection = []
      console.log(val, 'val')
      if (val) {
        this.data.forEach(v => {
          // 第二步的时候选中desensitizeType=1数据
          if (this.batchType !== 1) {
            if (v.desensitizeType === 1 && (v.approveStatus === 0 || v.approveStatus === 3 || v.approveStatus === 4)) {
              multipleSelection.push(v.id)
            }
          } else {
            if (v.desensitizeType !== 1) {
              multipleSelection.push(v.id)
            }
          }
        })
      }
      if (this.batchType === 2 && multipleSelection.length > 0) {
        this.batchType = 3
      }
      if (this.batchType === 3 && multipleSelection.length === 0) {
        this.batchType = 2
      }
      this.multipleSelection = multipleSelection
      this.checkNumber = val ? this.multipleSelection.length : 0
    },
    // 字幕选择状态改变触发
    handleCheckChange(val, item, index) {
      if (this.isCheckedNow) {
        this.$message.error('请先结束当前的爆款标记操作！')
        return
      }
      if (this.batchMultipleSelection(val, item, index)) {
        return
      }

      const i = this.multipleSelection.findIndex(v => v === item.id)
      if (i < 0) {
        this.multipleSelection.push(item.id)
      } else {
        this.multipleSelection.splice(i, 1)
      }
      // const arr = this.data.filter(v => v.checked)
      if (this.multipleSelection.length === 0) {
        if (this.batchType === 3) {
          this.batchType = 2
        }
        this.checked = false
        this.isIndeterminate = false
        this.checkNumber = this.multipleSelection.length
        return
      }
      if (this.batchType === 2 && this.multipleSelection.length > 0) {
        this.batchType = 3
      }
      console.log(this.multipleSelection, 'this.multipleSelection')
      this.checkNumber = this.multipleSelection.length
      this.checked = this.multipleSelection.length === this.data.length
      this.isIndeterminate = this.multipleSelection.length !== this.data.length && this.multipleSelection.length !== 0
    },
    // 批量脱敏
    batchDesensitization(e, val) {
      if (val === 1) {
        this.$uweb && this.$uweb.setAction('Event_Onlinedesensiti_batchDesensiti')
      } else {
        this.$uweb && this.$uweb.setAction('Event_Onlinedesensiti_unlockDesensiti')
      }
      this.loading = true
      const arr = []
      this.multipleSelection.forEach(v => {
        arr.push({
          videoId: this.videoId,
          id: v,
          isDesensitized: val,
          sensitiveMarkTypeId: e || ''
        })
      })
      productOriginalVideoSubtitleRenewStatus(arr).then(res => {
        this.multipleSelection.forEach((item) => {
          const i = this.isDesensitized.findIndex(v => v === item)
          console.log(i)
          if (i > -1) {
            val === 0 && this.isDesensitized.splice(i, 1)
          } else {
            val === 1 && this.isDesensitized.push(item)
          }
        })
        console.log(this.isDesensitized, 'this.isDesensitized')
        this.resetData()
        this.$emit('changeUpdateTime', res.timestamp)
        this.$emit('cancelRecommen')
        this.$emit('loadZmData', this.id)
        console.log(val, this.isDesensitized)
      }).catch(() => {
        this.loading = false
      })
    },
    resetData() {
      this.loading = false
      this.multipleSelection = []
      this.checked = false
      this.isIndeterminate = false
      this.checkNumber = 0
    },
    // 点击脱敏/取消
    desensitizationFn(item, status, id) {
      this.$uweb && this.$uweb.setAction('Event_Onlinedesensiti_desensiti')
      this.loading = true
      const data = [
        {
          videoId: this.videoId,
          id: item.id,
          sensitiveMarkTypeId: id || '',
          isDesensitized: status,
          desensitizeType: 2
        }
      ]
      this.data.some(e => {
        if (e.id === item.id) {
          this.$set(item, 'desensitizeType', 2)
          return true
        }
      })
      console.log(data, '点击脱敏的data')
      productOriginalVideoSubtitleRenewStatus(data).then(res => {
        this.loading = false
        if (status === 1) {
          this.isDesensitized.push(item.id)
        } else {
          const i = this.isDesensitized.findIndex(v => v === item.id)
          i > -1 && (this.isDesensitized.splice(i, 1))
        }
        this.$emit('loadZmData', this.id)
        this.$emit('changeUpdateTime', res.timestamp)
      }).catch(() => {
        this.loading = false
      })
    },

    // 初始化字幕列表
    init() {
      this.search = {
        keyWord: '',
        current: 0,
        total: 0,
        arr: []
      }
      this.positionSearch = {
        type: '', // 1: 脱敏字幕 2：敏感词
        current: 0,
        total: 0,
        arr: []
      }
      // AI总结重置
      this.resetSumInfo()

      this.multipleSelection = []
      this.moreSelection = []
      this.current = ''
      this.checked = false
      this.isIndeterminate = false
      this.checkNumber = 0
      this.searchKeyword = ''
      this.loading = false
      console.log('resetSumInfo---', this.sumInfo)
    },
    // 滚动到指定位置
    scrollTo(index, fn = () => {}) {
      console.log(index, '滚动到指定位置')
      this.$refs.Virtual && this.$refs.Virtual.clearTime()
      this.$refs.Virtual && this.$refs.Virtual.scrollTo(index, fn)
    },
    // 初始化脱敏列表数据
    initIsDesensitized() {
      console.log(this.data, '123')
      this.isDesensitized = []
      this.moreSelection = []
      this.data.map(v => {
        v.isDesensitized === 1 && this.isDesensitized.push(v.id)
        v.isDesensitized === 1 && v.desensitizeType === 1 && this.autoDesensitized.push(v)
      })
      console.log(this.isDesensitized, this.autoDesensitized, '66668888')
    },
    // 计算生成视频时长
    getCreatTime(muteTime) {
      console.log('计算生成视频时长isDesensitized', this.isDesensitized)
      const sum = this.data.reduce((prev, cur, index, arr) => {
        if (!this.isDesensitized.includes(cur.id) || cur.editingType === 1) {
          return prev + (cur.endTime - cur.startTime)
        }
        return prev
      }, muteTime)
      return sum
    },
    // 滚动触发
    scrollEvent() {
      clearTimeout(this.scrollTimer)
      this.isScrolling = true
      this.scrollTimer = setTimeout(() => {
        this.isScrolling = false
      }, 2000)
      if (this.search.current && this.search.current > 0) {
        // console.log(this.search.current, '滚动触发')
        document.getElementById(`search_${this.search.current}`) && (document.getElementById(`search_${this.search.current}`).style.backgroundColor = '#FF9632')
        // return
      }
    },
    // 定位筛选类型改变触发
    positonSearchChange() {
      // this.gotoTarget(this.search.current)
    },
    // 定位筛选上一个下一个点击触发
    positonSearchClickNext() {
      this.isScrolling = false
      clearTimeout(this.scrollTimer)
      this.gotoTargetByPositon(this.positionSearch.current)
    },
    // 定位爆款标记
    isHotSubtitles() {
      // isHotArray
      this.loading = true
      console.log(this.isHotArray)
      let sum = 0
      this.positionSearch.arr = []
      this.data.forEach((v, index) => {
        console.log('v:', v)
        if (v.isHot === 1 && v.list?.length > 0) {
          for (var i = 0; i < v.list.length; i++) {
            sum++
            this.positionSearch.arr.push({
              sum: sum,
              startTime: v.startTime,
              index: index
            })
          }
        }
      })
      this.positionSearch.total = sum
      if (sum > 0) {
        this.positionSearch.current = 1
        this.gotoTargetByPositon(1)
      }
      this.loading = false
    },
    // ai推荐处理
    positionAiRecommend(val) {
      this.loading = true
      let sum = 0
      this.positionSearch.arr = []

      const checkLists = {
        '7': this.showDesensitizedTipsList,
        '8': this.showHotWordTipsList,
        '9': this.aicancelDesensitizedList
      }

      this.data.forEach((v, index) => {
        if (checkLists[val] && checkLists[val].includes(v.id)) {
          sum++
          this.positionSearch.arr.push({
            sum: sum,
            startTime: v.startTime,
            index: index
          })
        }
      })

      this.positionSearch.total = sum
      if (sum > 0) {
        this.positionSearch.current = 1
        this.gotoTargetByPositon(1)
      }
      this.loading = false
    },
    // 根据type类型定位
    positionApplication(type) {
      this.loading = true
      console.log(type)
      let sum = 0
      this.positionSearch.arr = []
      this.data.forEach((v, index) => {
        if (v.approveStatus === type) {
          sum++
          this.positionSearch.arr.push({
            sum: sum,
            startTime: v.startTime,
            index: index
          })
        }
      })
      this.positionSearch.total = sum
      if (sum > 0) {
        this.positionSearch.current = 1
        this.gotoTargetByPositon(1)
      }
      this.loading = false
    },
    // 定位脱敏字幕
    positonDesensitizedSubtitles() {
      this.loading = true
      console.log(this.isDesensitized)
      let sum = 0
      this.positionSearch.arr = []
      this.data.forEach((v, index) => {
        if (this.isDesensitized.includes(v.id)) {
          sum++
          this.positionSearch.arr.push({
            sum: sum,
            startTime: v.startTime,
            index: index
          })
        }
      })
      this.positionSearch.total = sum
      if (sum > 0) {
        this.positionSearch.current = 1
        this.gotoTargetByPositon(1)
      }
      this.loading = false
    },
    // 跳转到指定的查询条件处【定位用】
    gotoTargetByPositon(index) {
      this.z_current = true
      this.z_current_index = this.positionSearch.arr[index - 1].index
      this.$emit('changTime', this.positionSearch.arr[index - 1].startTime / 1000)
    },
    // 定位敏感词
    positonSensitiveWords() {
      this.loading = true
      let sum = 0
      this.positionSearch.arr = []
      this.data.forEach((v, index) => {
        if (v.content.includes('color: red') || v.content.includes('color: #F53F3F')) {
          console.log(index)
          sum++
          this.positionSearch.arr.push({
            sum: sum,
            startTime: v.startTime,
            index: index
          })
        }
      })
      this.positionSearch.total = sum
      if (sum > 0) {
        this.positionSearch.current = 1
        this.gotoTargetByPositon(1)
      }
      this.loading = false
    },
    // 框选触发
    handleClickLong(moveSelected, box) {
      // console.log('本次操作返回的对象', moveSelected)
      if (this.$refs.Virtual && this.$refs.Virtual.$refs.items.length > 0) {
        this.$refs.Virtual.$refs.items.map((el, i) => {
          const elTop = el.getBoundingClientRect().top
          const elBottom = elTop + el.offsetHeight
          const top = moveSelected.offsetTop
          const bottom = top + Number(moveSelected.style.height.split('px')[0])
          const topCover = top <= elTop && elTop <= bottom
          const bottomCover = top <= elBottom && elBottom <= bottom
          if ((topCover || bottomCover)) {
            // 在选区的
            const id = this.$refs.Virtual.visibleData[i].item.id
            if (!this.multipleSelection.includes(id)) {
              this.multipleSelection.push(id)
            } else {
              const index = this.multipleSelection.findIndex(v => v === id)
              this.multipleSelection.splice(index, 1)
            }
          }
        })
      }
      this.checkNumber = this.multipleSelection.length
      this.checked = this.multipleSelection.length === this.data.length
      this.isIndeterminate = this.multipleSelection.length !== this.data.length
    },
    // 按钮监听键盘
    keyDown () {
      const _this = this
      // 监听键盘按钮
      document.onkeydown = function (event) {
        var e = event || window.event
        var keyCode = e.keyCode || e.which
        switch (keyCode) {
          case 16:
            _this.ifShift = true
            break
        }
      }
      document.onkeyup = function (event) {
        var e = event || window.event
        var keyCode = e.keyCode || e.which
        switch (keyCode) {
          case 16:
            _this.ifShift = false
            break
        }
      }
    },
    keyDownReview () {
      document.onkeydown = function (event) {
        var e = event || window.event
        e.returnValue = true
      }
      document.onkeyup = function (event) {
        var e = event || window.event
        e.returnValue = true
      }
    },
    // 批量多选
    batchMultipleSelection(val, item, index) {
      console.log(this.data, 'data')
      console.log(val, item, index, this.ifShift)
      if (!this.ifShift) {
        this.moreSelection = [{ status: val, item: item, index: index }]
        return false
      }
      this.moreSelection.push({ status: val, item: item, index: index })

      if (this.moreSelection.length < 2) {
        return false
      }
      if (this.moreSelection[0].index === this.moreSelection[1].index) {
        this.moreSelection = [this.moreSelection[0]]
        return false
      }
      const start = this.moreSelection[0].index < this.moreSelection[1].index ? this.moreSelection[0] : this.moreSelection[1]
      const end = this.moreSelection[0].index < this.moreSelection[1].index ? this.moreSelection[1] : this.moreSelection[0]
      const endStatus = val
      const status = endStatus
      for (let i = start.index; i <= end.index; i++) {
        console.log(this.data[i], 'this.data[i]')
        const id = this.data[i].id
        if (status) {
          // 第二步的时候选中desensitizeType=1数据
          if (this.batchType !== 1) {
            if (!this.multipleSelection.includes(this.data[i].id) && status && status && this.data[i].desensitizeType === 1) {
              this.multipleSelection.push(id)
            }
          } else {
          // 全部置为选中
            if (!this.multipleSelection.includes(this.data[i].id) && status && this.data[i].desensitizeType !== 1) {
              this.multipleSelection.push(id)
            }
          }
        } else {
          // 全部置为取消
          const index = this.multipleSelection.findIndex(v => v === id)
          index !== -1 && this.multipleSelection.splice(index, 1)
        }
      }
      this.moreSelection = [{ status: val, item: item, index: index }]
      this.checkNumber = this.multipleSelection.length
      this.checked = this.multipleSelection.length === this.data.length
      this.isIndeterminate = this.multipleSelection.length !== this.data.length && this.multipleSelection.length !== 0
      return true
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功！',
        type: 'success',
        duration: 1500
      })
    },
    // ai总结---- start
    sumFn() {
      console.log('sumfn-------', this.sumInfo)
      //  总结过 有数据 不重新请求数据
      if (this.sumInfo.status === 2 && this.sumInfo.cnt && this.sumInfo.cnt.result) this.$refs.abstractDialogRef.open(this.sumInfo.cnt)
      if (this.sumInfo.tiemr) return
      this.sumInfo.tiemr = true
      if (this.sumInfo.status === 3) {
        this.newVideoSubtitle() // 重新生成
      } else {
        this.videoSubtitle(new Date().getTime()) // 生成
      }
    },
    // 生成
    videoSubtitle(time) {
      if (!this.sumInfo.tiemr) return
      videoSubtitleApi({ videoId: this.videoId }).then(({ success, data }) => {
        if (success) {
          const status = data.status //  // 1生成中， 2 成功， 3 失败
          this.sumInfo.status = status
          if (status === 1) {
            this.sumInfo.tiemr = setTimeout(() => this.videoSubtitle(time), 500)
            return
          }
          if (status === 2) {
            this.sumInfo.cnt = data
            this.sumInfo.timer = null
            // 3S内生成 直接弹出弹窗
            if (new Date().getTime() - time < 3000) this.$refs.abstractDialogRef.open(this.sumInfo.cnt)
          } else if (status === 3) {
            this.sumInfo.timer = null
            this.sumInfo.cnt = {}
            this.sumInfo.status = 3
            this.$message({
              message: '生成失败',
              type: 'error',
              duration: 1000
            })
          }
        } else {
          this.sumInfo.timer = null
          this.sumInfo.cnt = {}
          this.sumInfo.status = 3
          this.$message({
            message: '生成失败',
            type: 'error',
            duration: 1000
          })
        }
      }).catch(() => {
        this.sumInfo.timer = null
        this.sumInfo.cnt = {}
        this.sumInfo.status = 3
        this.$message({
          message: '生成失败',
          type: 'error',
          duration: 1000
        })
      })
    },
    // 重新生成 重置状态
    async newVideoSubtitle() {
      this.sumInfo.sumLoading = true
      const { success, message } = await newVideoSubtitleApi({ videoId: this.videoId })
      if (success) {
        this.sumInfo.status = 1
        this.sumInfo.cnt = {}
        this.sumInfo.timer = true
        this.$message({
          message: 'AI重新生成中',
          type: 'success',
          duration: 1000
        })
        this.videoSubtitle(new Date().getTime())
      } else {
        this.sumInfo.timer = null
        this.$message({
          message: message,
          type: 'error',
          duration: 1000
        })
      }
      this.sumInfo.sumLoading = false
    },
    // 重置
    resetSumInfo() {
      setTimeout(() => {
        this.$set(this.sumInfo, 'tiemr', null)
        this.$set(this.sumInfo, 'timer', null)
        this.$set(this.sumInfo, 'status', 0)
        this.$set(this.sumInfo, 'cnt', {})
      }, 500)
    },
    // ai总结---- end

    // ai爆款标记总结 ---start
    async aiHotMaskFn() {
      try {
        if (this.hotMarkInfo.timer) return
        this.hotMarkInfo.timer = true
        const { data: generationId } = await hotMarkApi({ hokMarkContent: this.newShowCommentData.content })
        await this.getHotMarkGenerateResult(generationId)
      } catch (error) {
        console.log('hokMarkContent--------error', error)
        this.hotMarkInfo.timer = null
      }
    },
    async getHotMarkGenerateResult(generationId) {
      // 弹窗关闭 取消请求
      if (!this.hotMarkInfo.timer) return
      try {
        const { data } = await getHotMarkGenerateResultApi({ generationId })
        const status = data.status // 生成中 GENERATING 生成成功 SUCCESS 生成失败 FAILED
        this.hotMarkInfo.status = status
        if (status === 'GENERATING') {
          setTimeout(() => {
            this.getHotMarkGenerateResult(generationId)
          }, 100)
          return
        }
        if (status === 'SUCCESS') {
          this.newShowCommentData.remarks = data.result
          this.hotMarkInfo.timer = null
        } else if (status === 'FAILED') {
          this.hotMarkInfo.timer = null
          this.hotMarkInfo.status = 0
          this.$message({
            message: '生成失败',
            type: 'error',
            duration: 1000
          })
        }
        this.hotMarkInfo.timer = null
      } catch (error) {
        console.log('getHotMarkGenerateResultApi-------error', error)
        this.hotMarkInfo.timer = null
      }
    }
  }
}
</script>
<style lang="scss">
  .myTool_comment{
    padding: 0;
  }
  .showLabelPar{
  position: relative;
  &:hover .showlabelChild{
    display: inline-block;
  }
  .showlabelChild{
    position: absolute;
    top: calc(50% + 25px);
    left: 50%;
    transform: translate(-50%, -50%);
    width: auto;
    white-space: nowrap;
    font-size: 12px;
    line-height: 12px;
    padding: 6px;
    box-sizing: border-box;
    color: #fff;
    border-radius: 6px;
    user-select: none;
    display: none;
    .childBefore{
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
    }
  }
}
</style>
<style lang='scss' scoped>
.title-tips{
  font-size: 12px;
  color: #777777;
}
.txt-nowrap{
  white-space: nowrap;
}
.sum-btn{
  background: linear-gradient(270deg, #293EFE 0%, #AA20FF 100%);
  color: #fff;
  border: none;
  margin-left: 8px;
  padding: 4px 14px 4px 8px;
  align-items: center;
  /* vertical-align: middle; */
  &:hover,&:focus{
    background: linear-gradient(270deg, #293EFE 0%, #AA20FF 100%);
    color: #fff;
    opacity: .9;
  }
  .sum-flex{
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
  }
  ::v-deep .el-icon-loading{
    vertical-align: middle;
  }
}
img.icon-jqr{
  height: 20px;
  width: 20px;
  margin-right: 4px;
  cursor: pointer;
}

.my_Describe{
  height: 14px;
  line-height: 14px;
  margin-top: 4px;
}
.hotDescribe{
  text-align: left;
  width: 240px;
  font-weight: 400;
  font-size: 12px;
  color: #979797;
  padding-left: 24px;
  margin-left:6px;
  box-sizing: border-box;
}
.myHotTag{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
}
.commentDetails{
  max-height: 230px;
  padding:8px 8px 0px 8px;
}
.myDataContent{
  min-width: 280px;
  max-width: 400px;
  max-height: 300px;
  font-size: 14px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 25px;
  padding-bottom: 4px;
  .myCommentTit{
    padding: 8px;
    border-bottom: 1px solid #E7E7E7;
  }
}
.my_describe_Content{
  min-width: 246px;
  max-width: 246px;
  max-height: 300px;
  font-size: 14px;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 25px;
  padding-bottom: 4px;
}
.copyDescribe{
    margin-left: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #0C6FFF;
  }
.approveStatusSuccess{
  color: #00B42A;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  margin-right: 8px;
  .el-icon-success{
    margin-right: 4px;
  }
}
.myHotMarkList{
    width: 166px;
    max-height: 200px;
    box-sizing: border-box;
    position: absolute;
    right: -168px;
    top: 52px;
    border-radius: 4px;
    background: #FFFFFF;
    box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.2);

    .mySpan2{
      width: 100%;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      padding: 10px;
      box-sizing: border-box;
      cursor: pointer;
    }
    span:hover{
    background: #F5F5F5;
  }
  }
.subtitleDesensitization {
    min-width: 1200px;
    height: 100%;
    position: relative;
    background-color: #fff;
    border-left: 1px solid #CBCFD3;
    display: flex;
    flex-direction: column;
    .title {
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: 700;
      color: #333333;
      line-height: 24px;
      padding-left: 10px;
      margin-top: 10px;
    }
    .search {
        color: #333333;
        height: 50px;
        line-height: 40px;
        margin-left: 10px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #E7E7E7;
        font-size: 14px;
        .tips {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #777777;
          line-height: 22px;
          margin-left: 16px;
        }
        .inputSearch {
          flex: 1 0 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .positonSearchText {
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #333333;
            line-height: 22px;
            margin-right: 8px;
          }
          .m-r-23 {
            margin-right: 23px;
          }
        }
    }
    .subtitle {
        flex: 1 0 0;
        // padding-left: 10px;
        // padding-right: 10px;
        color: #333333;
        overflow: auto;
        &::-webkit-scrollbar {
          width: 6px;
          height: 10px;
          // display: none;
          background-color: transparent;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 6px;
          background-color: rgba(0, 0, 0, 0.2);
          transition: all 0.4s ease;
        }
        &::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.1);
        }
        .subtitleList {
          padding-left: 10px;
          padding-right: 10px;
          .subtitleListLi {
            padding: 8px 0;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #E7E7E7;
            .time {
              // width: 157px;
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #6DA8FF;
              line-height: 22px;
              display: flex;
              align-items: center;
            }
            .text {
                margin-left: 8px;
                margin-right: 79px;
                box-sizing: border-box;
                flex: 1 0 0;
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #333333;
                line-height: 22px;
                display: flex;
                align-items: center;
                position: relative;
                cursor: pointer;
                .text_value,.new_text_value {
                  max-width: 97%;
                  height: 100%;
                  color: #333;
                  font-size: 14px;
                  font-family: MicrosoftYaHei;
                  line-height: 22px;
                  color: rgba(255, 255, 255, 0);
                  color: transparent;
                  user-select: none;
                  // opacity: 0;
                  // background: red;
                }
                .new_text_value{
                  position: absolute;
                  left: 0;
                  z-index: 3;
                }
                // 嵌套第二层渲染层
                .text_value_render {
                  position: absolute;
                  max-width: 97%;
                  left: 0;
                  color: #333333;
                  background-color: rgba(255, 255, 255, 0);
                  font-size: 14px;
                  font-family: MicrosoftYaHei;
                  line-height: 22px;
                  z-index: 999;
                  // user-select:none
                }
                .selectCurrent{
                  font-size: 18px;
                  font-weight: 500;
                  letter-spacing: 1px;
                }
                // 脱敏的样式
                .desensitization {
                  text-decoration:line-through;
                  color: #999999;
                }
            }
            .action {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
        .currentPlayer {
          background-color: #E8F1FF;
        }
        .noData {
          width: 405px;
          height: 202px;
          margin: 273px auto 0;
          > img {
            width: 100%;
            height: 100%;
          }
          .noDataText {
            font-size: 18px;
            font-family: MicrosoftYaHei;
            color: #919293;
            line-height: 26px;
            text-align: center;
          }
        }
    }
}
.m-l-4 {
  margin-left: 4px;
}
.aiDesensitizedBg{
  background: #F1F0FF;
}
.hotWordBg{
  background: #F0FEFF;
}
.m-l-8 {
  margin-left: 8px;
}
.subtitleListLi {
  padding: 8px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #E7E7E7;
  padding-right: 10px;
  padding-left: 10px;
  .time {
    // width: 157px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #6DA8FF;
    line-height: 22px;
    display: flex;
    align-items: center;
  }
  .text {
    // margin-top: ;
      margin-left: 8px;
      margin-right: 79px;
      box-sizing: border-box;
      flex: 1 0 0;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 22px;
      display: flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      .text_value,.new_text_value {
        max-width: 97%;
        height: 100%;
        color: #333;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        line-height: 22px;
        color: rgba(255, 255, 255, 0);
        user-select: none;
        // opacity: 0;
        // background: red;
      }
      .new_text_value{
        position: absolute;
        left: 0;
        z-index: 3;
      }
      .new_text_value::selection {
        background: #79a9f7;
        color: #000; /* 黑色 */
      }
      .new_text_value::-webkit-selection {
        background: #7eaaf1;
        color: #000; /* 黑色 */
      }
      // 嵌套第二层渲染层
      .text_value_render {
        position: absolute;
        max-width: 97%;
        left: 0;
        color: #333333;
        background-color: rgba(255, 255, 255, 0);
        font-size: 14px;
        font-family: MicrosoftYaHei;
        line-height: 22px;
        z-index: 999;
      //  user-select: none;
      }
      .selectCurrent{
        font-size: 18px;
        font-weight: 500;
        letter-spacing: 1px;
      }
      // 脱敏的样式
      .desensitization {
        text-decoration:line-through;
        color: #999999;
      }
      .automaticDesensitization{
       // text-decoration:line-through;
       // color: #FF7D00;
      }
  }
  .has-hot-line {
    .text_value {
      background-color: #FEECEC;
    }
  }
  .action {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.currentPlayer {
  background-color: #E8F1FF;
}

.aiRecommend{
    padding: 8px;
    box-sizing: border-box;
    position: relative;
    // top: 24px;
    // margin-top: -50px;
    background: #FFFFFF;
    border-radius: 6px;
    box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.1);
    z-index: 1002;
    margin-left: 16px;
    user-select: none;
    .ai_icon{
      margin-right: 8px;
    }
}
.aiRecommend1::before {
    content: "";
    display: block;
    position: absolute;
    left: -16px;  /* 调整三角形的位置 */
    top: 50%;
    transform: rotate(180deg) translateY(50%);
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent transparent white;  /* 调整三角形的颜色 */
  }
.aiLock{
  .aiRecommend::after {
    content: "";
    display: block;
    position: absolute;
    right: -16px;  /* 调整三角形的位置 */
    top: 50%;
    transform: translateY(-40%);
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent transparent white;  /* 调整三角形的颜色 */
    // box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.1);
  }
}
// .top_before::before{
//   top: 36%;
// }
// .bottom_before::before{
//   top: 64%;
// }
.lockRecommend{
  font-weight: 400;
  font-size: 14px;
  color: #333333;
  font-style: normal;
  text-transform: none;
  border-right: 1px solid #EDEDED;
  padding-right: 8px;
  box-sizing: border-box;
}
.text_hot_bj {
  float: left;
  margin-left: 10px;
  // width: 22px;
  // height: 22px;
  text-align: center;
  user-select: none;
  // background-image: url(../../../../assets/image/video/baokuan.png);
  // background-size: 100%;
  z-index: 1002;
  .myHotMark{
    border-radius: 2px;
    padding: 2px 4px;
    box-sizing: border-box;
    font-size: 12px;
    font-weight: 400;
    color: #FFFFFF;
    margin-right: 4px;
  }

  em {
    font-size: 8px;
    line-height: 24px;
    color: #FF4747;
    font-weight: 500;
    font-style: normal;
  }
}

.comment-block-d {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 3;
  display: block;
  .comment-data {
    position: fixed;
    width: 320px;
    // overflow-y: auto;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.1), 0px 8px 10px 1px rgba(0,0,0,0.06), 0px 3px 14px 2px rgba(0,0,0,0.05);
    border: 1px solid #E4E7ED;
    .comment-data-line {
      .com-top {
        padding: 20px 16px 16px 16px;
        box-sizing: border-box;
        width: 100%;
        display: inline-block;
        border-bottom: 1px solid #E7E7E7;
        cursor: pointer;
        em {
          float: left;
          width: 2px;
          height: 16px;
          background: #0C6FFF;
          border-radius: 1px;
          margin-right: 5px;
        }
        p {
          float: left;
          width: 268px;
          height: 16px;
          line-height: 16px;
          font-size: 12px;
          color: #777;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .com-data-cen {
        width: 100%;
        padding-top: 2px;
        // display: inline-block;
        img {
          width: 28px;
          height: 28px;
          float: left;
        }
        .c-d-c-data {
          // float: right;
          padding: 20px;
          box-sizing: border-box;
          width: 100%;
          margin-top: -3px;
          position: relative;
          .c-d-c-span {
            // height: 16px;
            width: 100%;
            line-height: 16px;
            em {
              font-style: normal;
              font-size: 12px;
              color: #333;
            }
            i {
              margin-left: 10px;
              font-style: normal;
              font-size: 12px;
              color: #999;
            }
            b{
              float: right;
              color: #F53F3F;
              font-size: 12px;
              cursor: pointer;
              font-weight: 500;
            }
            .update-blue {
              color: #1890ff;
              margin-right: 10px;
            }
          }
          .c-d-c-p {
            margin-top: 3px;
            width: 100%;
            line-height: 18px;
            color: #333;
            font-size: 12px;
            word-wrap:break-word;
          }
        }
      }
    }
  }
}

.action-block {
  margin-top: 10px;
  text-align: right;
}
</style>
