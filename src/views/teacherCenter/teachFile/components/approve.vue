<template>
  <div class="page_wrap1">
    <div class="search">
      <el-form :inline="true" :model="search" class="form-container" size="small">
        <el-form-item label="IP姓名">
          <TeacherSelect
            ref="teacherSelect"
            v-model="search.teacherId"
            @selected="teacherSelect"
            @clear="searchFn"
            @select="searchFn()"
            @keyup.enter.native="searchFn"
          />
        </el-form-item>
        <el-form-item label="初审状态">
          <el-select
            v-model="search.auditStatus"
            clearable
            @change="searchFn"
            @clear="searchFn"
          >
            <el-option
              v-for="(item, index) in auditStatus"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否生成档案">
          <el-select
            v-model="search.isGenerateArchives"
            clearable
            @change="searchFn"
            @clear="searchFn"
          >
            <el-option
              v-for="(item, index) in isGenerateArchives"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="初审结果">
          <el-select
            v-model="search.auditResult"
            clearable
            @change="searchFn"
            @clear="searchFn"
          >
            <el-option
              v-for="(item, index) in initialResults"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="search.createUserName" placeholder="请输入IP推荐人" clearable :disabled="search.createSystem" />
        </el-form-item>
        <el-form-item>
          <el-checkbox
            v-model="search.createSystem"
            @change="createSystemChange"
          >系统招募</el-checkbox>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
            v-model="createTimeValue"
            type="daterange"
            style="width:228px"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            @change="handleCreateChange"
            @blur="currentTime = ''"
          />
        </el-form-item>
        <el-form-item label="初审日期">
          <el-date-picker
            v-model="dateTimeValue"
            type="daterange"
            style="width:228px"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            @change="handleDateChange"
            @blur="currentTime = ''"
          />
        </el-form-item>
        <el-form-item class="form-item">
          <div class="search_box">
            <el-button type="primary" :loading="loading" @click="searchFn">查询</el-button>
            <el-button :loading="loading" @click="clear">重置</el-button>
            <div class="search_right">
              <el-button
                v-if="permsList.includes('web:teacherPreliminaryAudit:addFile')"
                :loading="loading"
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="handOperationTeacher('新增IP')"
              >新增IP</el-button>
              <el-button
                v-if="permsList.includes('web:teacherPreliminaryAudit:notice')"
                class="fr m-l-10"
                size="small"
                :loading="loading"
                @click="openNotice"
              >初审通知提醒</el-button>
              <el-button
                v-if="permsList.includes('web:teacherPreliminaryAudit:pageConfig')"
                class="fr m-l-10"
                size="small"
                :loading="loading"
                @click="openDialog"
              >落地页配置</el-button>
            </div>
          </div>

        </el-form-item>
      </el-form>
    </div>
    <!-- 师资初审 -->
    <MPageLayout
      ref="MPageLayout"
      :slot-arr="slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <template slot="action" slot-scope="{ row }">
        <el-button
          v-if="permsList.includes('web:teacherPreliminaryAudit:edit') && row.auditStatus === 0"
          type="text"
          @click.native="handOperationTeacher('编辑IP',row)"
        >编辑</el-button>
        <el-button
          v-if="permsList.includes('web:teacherPreliminaryAudit:detail')"
          type="text"
          @click="openUserDetail(row)"
        >详情</el-button>
        <el-button
          v-if="permsList.includes('web:teacherPreliminaryAudit:del') && row.auditStatus === 0"
          type="text"
          @click="openDelToast(row)"
        >删除</el-button>
        <el-button
          v-if="row.isGenerateArchives && permsList.includes('web:teacherPreliminaryAudit:seeFile') && row.auditStatus === 1"
          type="text"
          @click.native="gotoDetail(row)"
        >查看档案</el-button>
        <el-button
          v-if="!row.isGenerateArchives && permsList.includes('web:teacherPreliminaryAudit:addFile') && row.auditStatus === 1"
          type="text"
          @click.native="gotoParamAdd(row)"
        >生成档案</el-button>
        <!-- <el-dropdown v-if="row.auditStatus === 1">
          <span v-if="hasMore" class="m-l-10" style="color:#0C6FFF;cursor: pointer;"> 更多<i class="el-icon-arrow-down el-icon--right" /> </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="row.isGenerateArchives && permsList.includes('web:teacherPreliminaryAudit:seeFile') && row.auditStatus === 1"
              type="text"
              @click.native="gotoDetail(row)"
            >查看档案</el-dropdown-item>

            <el-dropdown-item
              v-if="!row.isGenerateArchives && permsList.includes('web:teacherPreliminaryAudit:addFile') && row.auditStatus === 1"
              type="text"
              @click.native="gotoParamAdd(row)"
            >生成档案</el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown> -->
      </template>
      <template slot="assessResult" slot-scope="{row}">
        <el-button
          v-if="row.overallRating !== null && row.overallRating !== undefined && row.assessStatus === 3"
          type="text"
          @click="goAssessDetail(row)"
        >
          {{ (row.overallRating / 100).toFixed(2) + '分' }}
        </el-button>
        <span v-else>{{ getOptionsValue(row.mergeResult, ASSESS_RESULT_OTHER) || '—' }}</span>
      </template>
      <template slot="photoUrl" slot-scope="{ row }">
        <div class="photoUrl">
          <ImagePreviewer
            :preview-src-list="[row.photoUrl]"
            fit="contain"
            :src="row.photoUrl"
            style="width: 100%; height: 100%"
            :scale-width="70"
            :scale-height="80"
            error-slot
          >
            <img slot="error" src="@/assets/image/tupianjiazaishibai.png" alt="" style="width: 100%; height: 100%" />
          </ImagePreviewer>
        </div>
      </template>
      <template slot="experience" slot-scope="{ row }">
        <el-tooltip effect="dark" placement="top" width="400">
          <div slot="content" v-html="row.experience ? row.experience.replace(/\n/g, '<br />') : ''" />
          <span class="experience">
            {{ row.experience }}
          </span>
        </el-tooltip>
      </template>
      <template slot="remarks" slot-scope="{ row }">
        <span v-if="row.remarks && row.remarks.length > 20">
          <el-popover
            trigger="hover"
            :content="row.remarks"
            width="400"
            placement="top"
          >
            <div slot="reference">
              {{ row.remarks.length > 20 ? `${row.remarks.slice(0, 20)}...` : row.remarks }}
            </div>
          </el-popover>
        </span>
        <span v-else>{{ row.remarks ? row.remarks:'—' }}</span>
      </template>
    </MPageLayout>
    <assessDialog ref="assessDialog" @success="getList" />
    <followModal ref="followModal" @success="getList" />
    <noticeDialog ref="noticeDialog" />
    <!-- 用户详情弹框 -->
    <Modal
      :title="userInfoDialog.title"
      :type="userInfoDialog.type"
      size="1000px"
      width="1000px"
      :visible.sync="userInfoDialog.visible"
    >
      <div class="user-info">
        <div class="user-common">
          <div class="user-common-title">IP姓名：</div>
          <div class="user-common-info">{{ userInfoDialog.info.teacherName }}</div>
        </div>
        <div class="user-common">
          <div class="user-common-title">初审状态：</div>
          <div class="user-common-info">{{ userInfoDialog.info.auditStatusTxt }}</div>
        </div>
        <div class="user-common">
          <div class="user-common-title">初审结果：</div>
          <div class="user-common-info">{{ userInfoDialog.info.auditResultName }}</div>
        </div>
        <div class="user-common">
          <div class="user-common-title">初审备注：</div>
          <div class="user-common-info">{{ userInfoDialog.info.remarks }}</div>
        </div>
        <div class="user-common">
          <div class="user-common-title">初审时间：</div>
          <div class="user-common-info">{{ userInfoDialog.info.auditTimeLong }}</div>
        </div>
        <div class="user-common">
          <div class="user-common-title">创建人：</div>
          <div class="user-common-info">{{ userInfoDialog.info.createUserName }}</div>
        </div>
        <div class="user-common">
          <div class="user-common-title">创建时间：</div>
          <div class="user-common-info">{{ userInfoDialog.info.createTimeLong }}</div>
        </div>
        <div class="user-common">
          <div class="user-common-title">手机号码：</div>
          <div class="user-common-info">{{ userInfoDialog.info.phone }}</div>
        </div>
        <div class="user-common">
          <div class="user-common-title">是否有课程：</div>
          <div class="user-common-info">{{ userInfoDialog.info.isRecordCourseTxt }}</div>
        </div>
        <div class="user-common">
          <div class="user-common-title">是否生成档案：</div>
          <div class="user-common-info">{{ userInfoDialog.info.isGenerateArchivesTxt }}</div>
        </div>
        <div class="user-common">
          <div class="user-common-title">个人介绍：</div>
          <div class="user-common-info">{{ userInfoDialog.info.auditIntroduce }}</div>
        </div>
        <div class="user-common">
          <div class="user-common-title">评估视频：</div>
          <div class="user-common-info">
            <div class="img-list">
              <div v-for="(src, index) in userInfoDialog.info.urlsArray" :key="index" class="img-box" @click="playVideo(src)">
                <img src="@/assets/image/icon_showvideo.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <AppDialog
      v-model="teacherDialog.visible"
      :title="teacherDialog.title"
      width="120"
      height="280"
      max-height="280"
      @success="teacherDialog.visible = false"
    >
      <div class="teacher-box">
        <el-form v-if="teacherDialog.visible" ref="teacherForm" :model="teacherForm" label-width="120px" :rules="teacherRules">
          <el-form-item label="IP姓名：" prop="teacherName">
            <!-- <el-input v-model="teacherForm.teacherName" class="w-500" maxlength="10" /> -->
            <SelectTeacherName v-model="teacherForm.teacherName" />
          </el-form-item>
          <div v-for="(item, index) in linkUrls" :key="index">
            <!-- 有上传视频rules就不生效 -->
            <el-form-item v-if="videoUrls.length > 0" :key="'noProp' + index" :label="index === 0 ?'评估视频：':''" :prop="'videos.' + index + '.url'">
              <div class="video-url-box">
                <div class="video-url-box-l">
                  <div v-if="item.url && item.type !== 1 && (item.url.indexOf('dev.oss.hokkj.cn') > 0 || item.url.indexOf('oss.hokkj.cn')) > 0" class="img-box" @click="playVideo(item.url)">
                    <img src="@/assets/image/icon_showvideo.png" alt="" />
                  </div>
                  <el-input
                    v-else
                    v-model="item.url"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入抖音或第三方平台视频复制链接"
                    class="w-500"
                  />
                </div>
                <div class="video-url-box-r">
                  <el-button v-if="index === 0 && 10 > linkUrls.length" type="primary" icon="el-icon-plus" circle @click="addVideoUrl" />
                  <el-button v-if="index > 0" type="danger" icon="el-icon-delete" circle @click="delVideoUrl(index)" />
                </div>
              </div>
            </el-form-item>
            <el-form-item v-else :key="'prop' + index" :label="index === 0 ?'评估视频：':''" :prop="'videos.' + index + '.url'" :rules="[{ required: true, message: '请输入抖音或第三方平台视频复制链接', trigger: 'blur' }]">
              <div class="video-url-box">
                <div class="video-url-box-l">
                  <div v-if="item.url && item.type !== 1 && (item.url.indexOf('dev.oss.hokkj.cn') > 0 || item.url.indexOf('oss.hokkj.cn')) > 0" class="img-box" @click="playVideo(item.url)">
                    <img src="@/assets/image/icon_showvideo.png" alt="" />
                  </div>
                  <el-input
                    v-else
                    v-model="item.url"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入抖音或第三方平台视频复制链接"
                    class="w-500"
                  />
                </div>
                <div class="video-url-box-r">
                  <el-button v-if="index === 0 && 10 > linkUrls.length" type="primary" icon="el-icon-plus" circle @click="addVideoUrl" />
                  <el-button v-if="index > 0" type="danger" icon="el-icon-delete" circle @click="delVideoUrl(index)" />
                </div>
              </div>
            </el-form-item>
          </div>
          <el-form-item>
            <videoUpload
              ref="videoUpload"
              style="width: 660px"
              :limit="10"
              accept="video/mp4"
              @change="fileChange"
            />
            <div
              v-if="videoUrls.length === 0"
              class="tips"
            >注：大小限20G以内，格式为mp4</div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="footer">
        <el-button :loading="teacherDialog.loading" type="primary" @click="submitAddForm('teacherForm')">保存</el-button>
      </div>
      <div slot="footer" class="footer" />
    </AppDialog>
  </div>
</template>

<script>
import AppVideo from '@/components/AppVideo'
import Modal from '@/components/Modal'
import AppDialog from '@/components/AppDialog'
import TeacherSelect from '../../components/approveSelectTN/teacherSelect'
import SelectTeacherName from '@/components/SelectTeacherName'
import { ASSESS_TYPES, ASSESS_RESULT_All, ASSESS_RESULT_OTHER } from '../../enum'
import { mapGetters } from 'vuex'
import { getTeacherAudit, auditListDelete, getTeacherListExport, getTeacherCheckResult, addAuditTeacher, editAuditTeacher } from '@/api/tearchCenter/index'
import { getOptionsValue } from '@/filters'
import assessDialog from '../assessDialog'
import noticeDialog from '../noticeDialogAudit'
import { parseTime } from '@/utils/index'
import followModal from './followModal/index'
import { getDict } from '@/utils/index'
import videoUpload from '../../components/uploadVideo/index'
export default {
  components: {
    Modal,
    AppDialog,
    TeacherSelect,
    assessDialog,
    followModal,
    noticeDialog,
    SelectTeacherName,
    videoUpload
  },
  data() {
    return {
      COOPERATION_TYPE: [], // 合作状态
      ASSESS_TYPES: [...ASSESS_TYPES, { label: '无需评估', value: 4 }], // 评估状态
      ASSESS_RESULT_All,
      ASSESS_RESULT_OTHER,
      isGenerateArchives: [
        {
          label: '否',
          value: 0
        },
        {
          label: '是',
          value: 1
        }
      ],
      auditStatus: [
        {
          label: '待审核',
          value: 0
        },
        {
          label: '已审核',
          value: 1
        }
      ],
      initialResults: [],
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'photoUrl', 'domains', 'experience', 'assessResult', 'remarks'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'teacherId', label: 'IP编号', type: 'text' },
          { prop: 'teacherName', label: 'IP姓名', type: 'text', render: (row) => {
            return row.teacherName || '--'
          } },
          {
            prop: 'domains',
            label: '初审状态',
            type: 'text',
            align: 'center',
            'show-overflow-tooltip': true,
            slotFn: (row) => row.auditStatus === 0 ? '待审核' : '已审核' },
          {
            prop: 'auditResultName',
            label: '初审结果',
            type: 'text',
            align: 'center',
            'show-overflow-tooltip': true,
            slotFn: (row) => row.auditResultName ? row.auditResultName : '—' },
          {
            prop: 'remarks',
            label: '初审备注',
            type: 'slot',
            align: 'center' },
          {
            prop: 'auditTimeLong',
            label: '初审时间',
            type: 'text',
            width: 140,
            align: 'center',
            slotFn: (row) => parseTime(new Date(row.auditTimeLong).getTime(), '{y}-{m}-{d} {h}:{i}') || '—'
          },
          { prop: 'createUserName', label: '创建人', type: 'text', align: 'center' },
          {
            prop: 'createTimeLong',
            label: '创建时间',
            type: 'text',
            width: 140,
            align: 'center',
            slotFn: (row) => parseTime(new Date(row.createTimeLong).getTime(), '{y}-{m}-{d} {h}:{i}') || '—'
          },
          {
            prop: 'phone',
            label: '手机号码',
            type: 'text',
            align: 'center',
            'show-overflow-tooltip': true,
            slotFn: (row) => row.phone ? row.phone : '—' },
          {
            prop: 'isGenerateArchives',
            label: '是否有课程',
            type: 'text',
            'show-overflow-tooltip': true,
            align: 'center',
            slotFn: (row) => row.isRecordCourse === 1 ? '是' : '否' },
          {
            prop: 'isGenerateArchives',
            label: '是否生成档案',
            type: 'text',
            'show-overflow-tooltip': true,
            align: 'center',
            slotFn: (row) => row.isGenerateArchives ? '是' : '否' },
          { prop: 'action', label: '操作', width: 210, type: 'slot' }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      dateTimeValue: [],
      createTimeValue: [],
      currentTime: '',
      pickerOptions: {
        disabledDate: time => {
          // eslint-disable-next-line eqeqeq
          if (this.currentTime != '') {
            // 一年以内
            const one = 365 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            const minTime = this.currentTime - one
            const maxTime = this.currentTime + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      },
      search: {
        auditStatus: 1, // 审核状态
        isGenerateArchives: 0, // 是否生成了档案
        auditResult: '', // 初审结果
        teacherName: '', // IP姓名
        teacherId: '', // IPID
        domainId: '', // 所属领域
        serviceEnterprise: '', // 服务企业
        assessStatus: '', // 评估状态
        cooperateStatus: '', // 合作状态
        auditTimeEnd: '',
        auditTimeBegin: '',
        createTimeBegin: '',
        createTimeEnd: '',
        assessResult: '',
        createUserName: '',
        createSystem: false // 系统招募(创建人为system)
      },
      loading: false,
      multipleSelection: [],
      permsList: this.$route.meta.permsList || [],
      params: {},
      userInfoDialog: {
        title: '详情',
        type: 1,
        info: {},
        visible: false
      },
      teacherDialog: {
        visible: false,
        title: '',
        loading: false
      },
      teacherForm: {
        teacherId: '',
        teacherName: '',
        videos: [
          {
            platform: 0,
            type: 0,
            url: ''
          }
        ]
      },
      teacherRules: {
        teacherName: [
          { required: true, message: '请输入老师', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ]
      },
      videoUrls: [] // 用户上传的视频组
    }
  },
  computed: {
    ...mapGetters(['industryOption', 'areaOption', 'permission_routes']),
    hasMore() {
      return (
        this.permsList.includes('web:teacherPreliminaryAudit:seeFile') ||
        this.permsList.includes('web:teacherPreliminaryAudit:addFile')
      )
    },
    linkUrls() {
      return this.teacherForm.videos.filter(item => item.type !== 1)
    }
  },
  activated() {
    // this.getTeacherCheckResult()
    // setTimeout(() => {
    //   this.init()
    // }, 1000)
    this.init()
  },
  created() {
    this.getTeacherCheckResult()
  },
  mounted() {
    setTimeout(() => {
      this.init()
    }, 1000)
    // console.log('this.permsList', this.permsList)
  },
  methods: {
    init() {
      this.permission_routes.forEach(i => {
        if (i.path === '/teacherCenter') {
          i.children.forEach(j => {
            if (j.path === 'teachFile') {
              j.children.forEach(z => {
                if (z.path === 'teacherPreliminaryAudit') {
                  this.permsList = z.meta.permsList
                }
              })
            }
          })
        }
      })
      if (JSON.stringify(this.$route.query) !== '{}') {
        const {
          auditResult = '',
          createTimeBegin = '',
          createTimeEnd = '',
          auditTimeEnd = '',
          auditTimeBegin = '',
          assessResult = '',
          assessStatus = '',
          createUserName = ''
        } = this.$route.query
        this.createTimeValue = [createTimeBegin, createTimeEnd]
        this.dateTimeValue = [auditTimeBegin, auditTimeEnd]
        this.search = {
          auditStatus: '', // 审核状态
          isGenerateArchives: '', // 是否生成了档案
          auditResult, // 初审结果
          teacherName: '', // IP姓名
          teacherId: '', // IPID
          domainId: '', // 所属领域
          serviceEnterprise: '', // 服务企业
          assessStatus: assessStatus ? +assessStatus : '',
          cooperateStatus: assessResult ? +assessResult : '',
          auditTimeEnd,
          auditTimeBegin,
          createTimeBegin,
          createTimeEnd,
          assessResult: '',
          createSystem: false,
          createUserName
        }
        const { teacherId, teacherName } = this.$route.query
        if (teacherName && teacherId) {
          this.search.teacherName = teacherName
          this.search.teacherId = teacherId
          this.$refs.teacherInput.remoteMethod(teacherName)
        }
      }
      this.getAreaList()
      this.getList()
    },
    playVideo(srcLink) {
      if (srcLink) {
        const convertedString = srcLink.toLowerCase()
        if (/oss.hokkj/g.test(convertedString)) {
          AppVideo.play({
            url: srcLink
          })
        } else {
          window.open(srcLink, 'blank')
        }
      } else {
        this.$message.error('当前视频不支持在线播放')
      }
    },
    // 增加评估视频
    addVideoUrl() {
      if (this.teacherForm.videos.length < 10) {
        this.teacherForm.videos.push({
          platform: 0,
          type: 0,
          url: ''
        })
      } else {
        this.$message.error('最多添加10个视频地址')
      }
    },
    // 删除评估视频
    delVideoUrl(index) {
      this.teacherForm.videos.splice(index, 1)
    },
    // 老师查询
    teacherSelect(val) {
      console.log(val)
      this.search.teacherId = val.teacherId
      this.search.teacherName = val.teacherName
    },
    // 新增IP
    handOperationTeacher(title, info) {
      this.teacherDialog.title = title
      this.teacherDialog.visible = true
      this.clearFormAdd()
      if (title === '编辑IP') {
        console.log('info', info)
        this.teacherForm.teacherId = info.teacherId
        this.teacherForm.teacherName = info.teacherName
        // urls有链接就不加默认的空视频链接
        const isHasLink = info.urls.some(item => item.type === 0)
        if (isHasLink) {
          this.teacherForm.videos = info.urls
        } else {
          this.teacherForm.videos.push(...info.urls)
        }
        // 视频回显
        const videoUrls = []
        info.urls.map(item => {
          if (item.type === 1) {
            videoUrls.push({
              file: '', // 文件对象
              name: '', // 文件名
              status: 3, // 状态
              authProgress: 0, // 进度
              poster: '', // 封面
              alignUploadShow: false, // 重新上传mask控制
              abortCheckpoint: null, // 中断点
              url: item.url, // 视频播放地址
              platform: item.platform,
              type: item.type
            })
          }
        })
        this.videoUrls = videoUrls
        this.$nextTick(() => {
          this.$refs.videoUpload.setFileList(videoUrls)
        })
      }
    },
    clearFormAdd() {
      this.teacherForm = {
        teacherId: '',
        teacherName: '',
        videos: [
          {
            platform: 0,
            type: 0,
            url: ''
          }
        ]
      }
      this.videoUrls = []
    },
    // IP操作提交
    submitAddForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const repeatArr = this.teacherForm.videos.map(item => item.url)
          const arrSet = new Set(repeatArr)
          if (arrSet.size === this.teacherForm.videos.length) {
            this.teacherDialog.loading = true
            const linkUrls = this.linkUrls.filter(item => item.url !== '')
            const params = {
              teacherName: this.teacherForm.teacherName,
              videos: [...linkUrls]
            }
            // 加上本地上传视频
             this.videoUrls?.length > 0 && this.videoUrls.map(v => {
              v.status === 3 && params.videos.push({
                platform: 0,
                type: 1, // 1-本地视频 2-短视频平台 3-网址
                url: v.url
              })
            })
             if (this.teacherForm.teacherId) {
               params['teacherId'] = this.teacherForm.teacherId
               editAuditTeacher(params).then(res => {
                 this.teacherDialog.loading = false
                 this.teacherDialog.visible = false
                 if (res.code === 1) {
                   this.$message({
                     message: '编辑成功',
                     type: 'success'
                   })
                   this.clearFormAdd()
                   this.getList()
                 } else {
                   this.$message.error('编辑失败')
                 }
               }).catch(() => {
                 this.teacherDialog.loading = false
               })
             } else {
               addAuditTeacher(params).then(res => {
                 this.teacherDialog.loading = false
                 this.teacherDialog.visible = false
                 if (res.code === 1) {
                   this.$message({
                     message: '添加成功',
                     type: 'success'
                   })
                   this.clearFormAdd()
                   this.getList()
                 } else {
                   this.$message.error('添加失败')
                 }
               }).catch(() => {
                 this.teacherDialog.loading = false
               })
             }
          } else {
            this.$message.error('评估视频内容不能相同')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 打开详情
    openUserDetail(row) {
      row.auditStatus === 0 ? row['auditStatusTxt'] = '待审核' : row['auditStatusTxt'] = '已审核'
      row.auditResultName ? row.auditResultName : row.auditResultName = '—'
      row.auditTimeLong ? row.auditTimeLong = parseTime(new Date(row.auditTimeLong).getTime(), '{y}-{m}-{d} {h}:{i}') : row.auditTimeLong = '—'
      row.createTimeLong ? row.createTimeLong = parseTime(new Date(row.createTimeLong).getTime(), '{y}-{m}-{d} {h}:{i}') : row.createTimeLong = '—'
      row.isGenerateArchives ? row['isGenerateArchivesTxt'] = '是' : row['isGenerateArchivesTxt'] = '否'
      row.isRecordCourse === 1 ? row['isRecordCourseTxt'] = '是' : row['isRecordCourseTxt'] = '否'
      row['urlsArray'] = []
      if (row.urls.length) {
        const urlsArray = []
        row.urls.map(v => {
          const srcLink = v.url
          const convertedString = srcLink && srcLink.toLowerCase()
          if (convertedString && /oss.hokkj/g.test(convertedString)) {
            urlsArray.push(srcLink)
          } else if (convertedString) {
            urlsArray.push(this.getUrl(srcLink))
          }
        })
        row.urlsArray = urlsArray
      }
      this.userInfoDialog.visible = true
      this.userInfoDialog.info = row
    },
    openDelToast(e) {
      this.$confirm('此操作将永久删, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handListDel(e)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除
    async handListDel(e) {
      const params = {
        teacherId: e.teacherId
      }
      const { code } = await auditListDelete(params)
      if (code === 1) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getList()
      } else {
        this.$message.error('删除失败')
      }
    },
    // 获取领域数据
    async getAreaList() {
      this.COOPERATION_TYPE = await getDict('COOPERATION_TYPE')
      await this.$store.dispatch('option/getAreaOption')
    },
    // IP初审结果枚举查询
    async getTeacherCheckResult() {
      const { data } = await getTeacherCheckResult()
      this.initialResults = []
      data.map(v => {
        this.initialResults.push({
          label: v.resultName,
          value: v.result
        })
        // 设置默认
        if (v.resultName === '需要评估') {
          this.search.auditResult = v.result
        }
      })
    },
    getAuditResult(num) {
      // 审核结果 1-无需评估 2-同行在做 3-博商在做 4-需要评估 5-评估+建联
      const audit = this.initialResults
      let result = ''
      audit.map(v => {
        v.value === num ? result = v.label : '-'
      })
      console.log('result', result)
      return result
    },
    openGroup() {
      this.$refs.group.open()
    },
    openNotice() {
      this.$refs.noticeDialog.open()
    },
    goAssessDetail(row) {
      this.$router.push(`/teacherCenter/teacherAssessment/detail/${row.teacherId}`)
    },
    async handleExport() {
      const { data } = await getTeacherListExport(this.params)
      window.open(data)
    },
    getOptionsValue,

    // 搜索查询
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    handleDateChange(val) {
      if (val && val.length) {
        this.search.auditTimeBegin = val[0]
        this.search.auditTimeEnd = val[1]
      } else {
        this.search.auditTimeBegin = undefined
        this.search.auditTimeEnd = undefined
      }
      this.searchFn()
    },
    handleCreateChange(val) {
      if (val && val.length) {
        this.search.createTimeBegin = val[0]
        this.search.createTimeEnd = val[1]
      } else {
        this.search.createTimeBegin = undefined
        this.search.createTimeEnd = undefined
      }
      this.searchFn()
    },
    // 页码改变触发
    handleSizeChange(val) {
      this.config.currentPage = 1
      this.config.pageSize = val
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    // 多选触发
    handleSelectionChange() {},
    // 点击跳转详情页面
    gotoDetail(row) {
      const fdStart = row.normalOrDraftTeacherId.indexOf('D')
      if (fdStart === 0) {
        // console.log('是draft')
        this.$router.push(`/teacherCenter/teachFile/detail/${row.normalOrDraftTeacherId}?draft=true`)
      } else if (fdStart === -1) {
        // console.log('不是draft')
        this.$router.push(`/teacherCenter/teachFile/detail/${row.normalOrDraftTeacherId}`)
      }
    },
    getUrl(str) {
      const reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g
      const strValue = str.match(reg)
      if (strValue && strValue.length > 0) {
        return strValue[0]
      }
      return null
    },
    gotoParamAdd(row) {
      const urls = []
      let param = {}
      if (row.urls.length) {
        row.urls.map(v => {
          urls.push(this.getUrl(v.url))
        })
        param = {
          urls,
          name: row.teacherName,
          id: row.teacherId
        }
      }
      this.$router.push({
        name: 'TeachFileAdd',
        params: {
          param
        }
      })
    },
    goModifyLink() {
      this.$router.push('/teacherCenter/teachFile/teacherNameModify')
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        serviceEnterprise: this.search.serviceEnterprise, // 服务企业
        auditStatus: this.search.auditStatus, // 审核状态
        isGenerateArchives: this.search.isGenerateArchives, // 是否生成了档案
        auditResult: this.search.auditResult, // 初审结果
        teacherName: this.search.teacherName, // IP姓名
        teacherId: this.search.teacherId, // IPID
        domainId: this.search.domainId, // 所属领域编码
        cooperateStatus: this.search.cooperateStatus, // 合作状态
        assessStatus: this.search.assessStatus, // 评估状态
        auditTimeBegin: this.search.auditTimeBegin,
        auditTimeEnd: this.search.auditTimeEnd,
        createTimeBegin: this.search.createTimeBegin,
        createTimeEnd: this.search.createTimeEnd,
        assessResult: this.search.assessResult,
        createUserName: this.search.createUserName,
        createSystem: this.search.createSystem
      }
      this.params = params
      getTeacherAudit(params)
        .then((res) => {
          this.loading = false
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.$refs.MPageLayout.doLayout()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 清空筛选数据
    clear() {
      let auditResult = ''
      if (this.initialResults.length) {
        this.initialResults.map(v => {
          // 设置默认
          if (v.label === '需要评估') {
            auditResult = v.value
          }
        })
      }
      console.log('auditResult', auditResult)
      this.search = {
        auditStatus: 1, // 审核状态
        isGenerateArchives: 0, // 是否生成了档案
        auditResult, // 初审结果
        teacherName: '', // IP姓名
        teacherId: '', // IPID
        domainId: '', // 所属领域
        serviceEnterprise: '', // 服务企业
        assessStatus: '', // 评估状态
        cooperateStatus: '', // 合作状态
        auditTimeEnd: '',
        auditTimeBegin: '',
        createTimeBegin: '',
        createTimeEnd: '',
        assessResult: '',
        createUserName: '',
        createSystem: false
      }
      this.dateTimeValue = []
      this.createTimeValue = []
      this.searchFn()
    },
    // 点击跳转编辑页面
    gotoEdit(row) {
      this.$router.push(`/teacherCenter/teachFile/edit/${row.teacherId}`)
    },
    // 点击跳转排班表
    gotoSchedule(row) {
      this.$router.push({
        path: `/teacherCenter/schedule`,
        query: {
          teacherId: row.teacherId,
          teacherName: row.teacherName,
          tab: 'second'
        }
      })
    },
    // 点击跳转评估详情
    gotoEvaluate(row) {
      // this.$router.push(`/teacherCenter/teachFile/detail/${row.teacherId}`)
      this.$router.push({
        path: `/teacherCenter/teachFile/detail/${row.teacherId}`
      })
    },
    // 点击跳转授权页面
    gotoAuthorize(row) {
      this.$router.push({
        path: `/teacherCenter/teacherAuthorization/detail/${row.teacherId}`
      })
    },
    // // 点击跳转案例页面
    // gotoCase(row) {
    //   this.$router.push({
    //     path: `/productManage/caseManage/index`,
    //     query: {
    //       teacherId: row.teacherId,
    //       teacherName: row.teacherName
    //     }
    //   })
    // },
    openDialog() {
      this.$refs.assessDialog.open()
    },
    // 点击跳转订单页面
    gotoOrder(row) {},
    // 显示所属领域
    showDomains(row) {
      let str = ''
      row.map((v) => {
        str += v.domainName + ' '
      })
      return str
    },
    // 系统招募 change
    createSystemChange(e) {
      if (e) {
        this.search.createUserName = 'system'
      } else {
        this.search.createUserName = ''
      }
      this.searchFn()
    },
    // 上传视频改变时触发
    fileChange(res) {
      this.videoUrls = res
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap1 ::v-deep{
  // height: 100%;
  height: calc(100vh - 164px);
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  padding-top: 10px;
  .search {
    margin-left: 20px;
    margin-right: 20px;
    border-bottom: 1px solid #e7e7e7;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .form-container{
      display: flex;
      flex-wrap: wrap;
      .form-item{
        flex: 1;
        .el-form-item__content{
           display: flex;
        }
      }
    }
    .search_box{
      display: flex;
      height: 33px;
      width: 100%;
      .search_right {
        margin-left: 20px;
        flex: 1 0 0;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
      }
    }

  }
  .tablePage{
    height: 600px;
  }
}
.photoUrl {
  width: 70px;
  height: 80px;
  border-radius: 4px;
  background: rgb(250, 250, 250);
}
.experience {
  width: 135px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.w-500 {
  width:500px;
}
.w-400 {
  width: 80%;
}
.teacher-box {
  padding-top: 20px;
  overflow: auto;
  max-height: 500px;
  .video-url-box {
    display: flex;
    .video-url-box-r {
      padding-left: 10px;
      display: flex;
      align-items: center;
    }
  }
  & ::v-deep {
    .tips {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
  }
  .text-tips{
    margin-left: 15px;
    color:#f53f3f
  }
  .text-color {
    input {
      &::-webkit-input-placeholder{
        color: #777;
      }
    }
  }
  }
}
.footer {
  margin: 20px;
}
.user-info {
  padding: 20px;
  .user-common {
    display: flex;
    margin-bottom: 10px;
    margin-left: 40px;
    .user-common-title {
      font-size: 16px;
      color: #777777;
      width: 120px;
    }
    .user-common-info {
      flex: 1;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #333333;
      word-break: break-all;
      .img-list {
        display: flex;
        flex-wrap: wrap;
        margin-left: 10px;
        .img-box {
          width: 195px;
          height: 110px;
          margin-right: 10px;
          margin-bottom: 10px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 4px;
            cursor: pointer;
          }
        }
      }
    }
  }

}
</style>
