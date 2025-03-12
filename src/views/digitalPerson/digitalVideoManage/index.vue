<template>
  <MCard class="page_wrap">
    <MPageLayout
      v-if="checkSignObj.employeeSignStatus === 1"
      ref="MPageLayout"
      type="tablePage"
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
    >
      <template slot="search">
        <filterTop
          :search="search"
          @onSearch="onSearchFn"
          @onClear="onClear"
          @onAdd="onhandleAdd"
          @goBgImg="goBgImg"
        />
      </template>
      <template slot="name" slot-scope="scope">
        <div
          v-if="!scope.row.isEdit"
          class="flex"
          style="align-items: baseline"
        >
          <div v-if="!scope.row.isEdit" class="name-slot">
            {{ scope.row.name }}
          </div>

          <i
            v-if="scope.row.auth === 1"
            class="el-icon-edit"
            style="color: #0c6fff; cursor: pointer"
            @click="editName(scope.row)"
          />
        </div>
        <div v-else class="name-slot">
          <el-input v-model="scope.row.name" maxlength="50" size="mini">
            <template slot="suffix">
              <el-button size="mini" type="text" @click="editName(scope.row)">
                保存
              </el-button>
            </template>
          </el-input>
        </div>
      </template>
      <template slot="status" slot-scope="{ row }">
        <div :class="{ status: true, [statusClass[row.status]]: true }">
          <div class="div-icon" />
          {{ statusMap[row.status] }}
        </div>
      </template>
      <template slot="action" slot-scope="scope">
        <!-- 草稿 -->
        <template v-if="scope.row.status === 99">
          <el-button
            v-if="scope.row.auth === 1"
            type="text"
            @click="editVideo(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.auth === 1"
            type="text"
            class="c_red"
            @click="onhandleDel(scope.row)"
          >
            删除
          </el-button>
          <!-- <el-button type="text" @click="openDetail(scope.row)">
            文案详情
          </el-button> -->
        </template>
        <!-- 排队中 -->
        <template v-if="scope.row.status === 0">
          <el-button type="text" @click="openDetail(scope.row)">
            文案详情
          </el-button>
          <el-button
            v-if="scope.row.auth === 1"
            type="text"
            class="c_red"
            @click="onhandleDel(scope.row)"
          >
            删除
          </el-button>
        </template>
        <!-- 待审核 -->
        <template v-if="scope.row.status === 4">
          <el-button
            v-if="scope.row.auth === 1 && scope.row.canUrgent === 1"
            type="text"
            class="c_red"
            @click="urgent(scope.row)"
          >
            <span class="urgent-btn">
              <img
                src="@/assets/image/aigc/digitalVideoManage/jiaji.png"
                alt=""
              />
              <span>加急</span>
            </span>
          </el-button>
          <el-button type="text" @click="openDetail(scope.row)">
            文案详情
          </el-button>

          <el-dropdown v-if="scope.row.auth === 1">
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="text" @click="withdraw(scope.row)">
                  撤回
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  type="text"
                  class="c_red"
                  @click="onhandleDel(scope.row)"
                >
                  删除
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <!-- 生成中 -->
        <template v-if="scope.row.status === 1">
          <el-button type="text" @click="openDetail(scope.row)">
            文案详情
          </el-button>
        </template>
        <!-- 生成成功 -->
        <template v-if="scope.row.status === 2">
          <el-button
            v-if="scope.row.auth === 1"
            type="text"
            @click="videoDownload(scope.row)"
          >
            下载
          </el-button>
          <el-button type="text" @click="videoPreview(scope.row)">
            视频预览
          </el-button>
          <el-button
            v-if="scope.row.auth !== 1"
            type="text"
            @click="openDetail(scope.row)"
          >
            文案详情
          </el-button>
          <el-dropdown v-if="scope.row.auth === 1">
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="scope.row.auth === 1">
                <p style="width: 100%" @click="copyVideo(scope.row)">
                  <el-button type="text"> 复制 </el-button>
                </p>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" @click="openDetail(scope.row)">
                  文案详情
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="scope.row.auth === 1"
                  type="text"
                  class="c_red"
                  @click="onhandleDel(scope.row)"
                >
                  删除
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <!-- 生成失败 -->
        <template v-if="scope.row.status === 3">
          <el-button
            v-if="scope.row.auth === 1"
            type="text"
            @click="editVideo(scope.row)"
          >
            编辑
          </el-button>
          <el-button type="text" @click="openDetail(scope.row)">
            文案详情
          </el-button>
          <el-dropdown v-if="scope.row.auth === 1">
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  v-if="scope.row.auth === 1"
                  type="text"
                  class="c_red"
                  @click="onhandleDel(scope.row)"
                >
                  删除
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <!-- 审核通过 -->
        <template v-if="scope.row.status === 5">
          <el-button type="text" @click="openDetail(scope.row)">
            文案详情
          </el-button>
          <el-button
            v-if="scope.row.auth === 1"
            type="text"
            class="c_red"
            @click="onhandleDel(scope.row)"
          >
            删除
          </el-button>
        </template>
        <!-- 审核驳回 -->
        <template v-if="scope.row.status === 6">
          <el-button
            v-if="scope.row.auth === 1"
            type="text"
            @click="editVideo(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="scope.row.auth === 1"
            type="text"
            class="text"
            @click="showRejectDialog(scope.row)"
          >
            驳回原因
          </el-button>
          <el-button
            v-if="scope.row.auth !== 1"
            type="text"
            @click="openDetail(scope.row)"
          >
            文案详情
          </el-button>
          <el-dropdown v-if="scope.row.auth === 1">
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="scope.row.auth === 1">
                <el-button type="text" @click="openDetail(scope.row)">
                  文案详情
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <p
                  v-if="scope.row.auth === 1"
                  class="c_red"
                  style="width: 100%"
                  @click="appeal(scope.row)"
                >
                  申诉
                </p>
              </el-dropdown-item>
              <el-dropdown-item>
                <p
                  v-if="scope.row.auth === 1"
                  type="text"
                  class="c_red"
                  style="width: 100%"
                  @click="onhandleDel(scope.row)"
                >
                  删除
                </p>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </template>
    </MPageLayout>
    <template v-else>
      <!-- <el-result icon="warning" title="数字人协议待签署">
        <template slot="extra" />
      </el-result> -->
      <div style="width: 100%; height: 72vh">
        <el-alert
          title="请前往企业微信进行签署"
          type="error"
          :closable="false"
        />
        <iframe
          v-if="checkSignObj.contractFileUrl"
          id="iframeCheckSignId"
          ref="iframeCheckSignRef"
          :src="checkSignObj.contractFileUrl"
          frameborder="0"
          style="width: 100%; height: 100%"
          allowFullScreen="true"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
        />
      </div>
      <div class="flex flex-middle flex-center" style="margin-top: 4.5vh">
        <el-button type="primary" @click="refreshCheckSign">刷新</el-button>
      </div>
    </template>
    <!-- 视频预览 -->
    <el-dialog
      title="预览视频"
      :visible.sync="dialogVisible"
      :before-close="closeVideo"
      width="870px"
      class="video-detail"
      :close-on-click-modal="false"
    >
      <div style="height: 500px">
        <div class="vdc-right">
          <div
            v-show="dialogVisible"
            id="shareVideoDetailPlay"
            class="video_play"
          />
          <div class="zimu_ls">
            <span>{{ nowWzData }}</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="flex">
          <el-button
            v-if="
              previewInfo.status == 5 &&
                previewInfo.auth === 1 &&
                previewInfo.subtitlesUrl
            "
            @click="subtitlesDownload(previewInfo)"
          >
            下载字幕
          </el-button>
        </div>

        <el-button @click="closeVideo">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 驳回原因 -->
    <el-dialog
      :visible.sync="visibleReject"
      :before-close="closeReject"
      width="870px"
      :close-on-click-modal="false"
    >
      <div slot="title" class="reason-title">
        <i class="el-icon-warning" />
        <span>驳回原因</span>
      </div>
      <el-form ref="formReject" :model="formReject" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="审核人：">
              <span>{{ formReject.auditName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核时间：">
              <span>{{
                moment(formReject.auditTime).format('YYYY-MM-DD HH:mm:ss')
              }}</span>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="审核原因：">
              <div class="reason-content-reason">
                <div v-for="(item, index) in list" :key="index">
                  <div class="title-rl">
                    <div>{{ index + 1 }}、{{ item.inputContent }}</div>
                  </div>
                  <div
                    :class="{
                      'content-rl': true,
                      'content-rl-select': item.isSelect
                    }"
                  >
                    <div>原文：{{ item.title }}</div>
                  </div>
                </div>
                <div v-if="formReject.auditReason">
                  <div class="title-rl">
                    <div>驳回原因:</div>
                  </div>
                  <div
                    :class="{
                      'content-rl': true
                    }"
                  >
                    <div>{{ formReject.auditReason }}</div>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <copyDetails
      v-if="copyDetailsVisible"
      :id="rowId"
      v-model="copyDetailsVisible"
      :content="content"
      @close="copyDetailsVisible = false"
    />
    <!-- 驳回申诉弹窗 -->
    <el-dialog
      :visible.sync="appealVisable"
      width="500px"
      :before-close="
        () => {
          appealVisable = false
        }
      "
    >
      <span slot="title" class="flex" style="align-items: center">
        驳回申诉
      </span>
      <el-form
        ref="appealForm"
        :model="appealForm"
        :rules="appealRules"
        label-width="50px"
      >
        <el-form-item label="理由" prop="reason">
          <el-input
            v-model="appealForm.reason"
            type="textarea"
            :rows="4"
            resize="none"
            :maxlength="500"
            show-word-limit
            placeholder="请输入申诉理由"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-appeal-footer">
        <el-button
          @click="
            () => {
              $refs.appealForm.resetFields()
              appealVisable = false
            }
          "
        >
          取 消
        </el-button>
        <el-button type="danger" @click="submitAppeal()"> 提交申诉 </el-button>
      </div>
    </el-dialog>
    <BalanceNotTipsDialog
      v-model="balanceNotTipsDialog"
      :msg="balanceNotTipsDialogMsg"
    />
  </MCard>
</template>

<script>
import filterTop from './components/filterTop.vue'
import copyDetails from './components/copyDetails.vue'
import {
  getColumns,
  status as statusMap,
  statusClass
} from './components/columns'
import { getOptionsValueByKey } from '@/filters/index.js'
import {
  getVideoList,
  videoDelete,
  getReason,
  withdraw,
  getAnnotionsDeltas,
  updateVideoName,
  appeal,
  urgentReview,
  checkSignDigitalhuman
} from '@/api/aiVideoManage'
import { decryptAES } from '@/utils/crypto'
import { getLoginInfo } from '@/api/videoManagement/accountManage'
import moment from 'moment'
import BalanceNotTipsDialog from '@/views/digitalPerson/digitalPersonTraining/components/balanceNotTipsDialog/index.vue'
import { checkPackageOrderBalance } from '@/api/aiVideoManage/setMealModule'
const keyVideo = 'hnhokdatacenter0'
export default {
  components: {
    filterTop,
    copyDetails,
    BalanceNotTipsDialog
  },
  data() {
    return {
      moment,
      decryptAES,
      statusClass,
      statusMap,
      nowWzData: '',
      dialogVisible: false,
      slotArr: ['action', 'name', 'search', 'status', 'footer'],
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      player_create_finish: false,
      zimuArr: [],
      search: {
        teacherId: '',
        videoName: '',
        time: { value: '' }
      },
      loading: false,
      visibleReject: false,
      formReject: {
        auditName: '',
        auditTime: '',
        auditReason: ''
      },
      currentDeptId: '',
      isHead: false,
      copyDetailsVisible: false,
      previewInfo: {},
      rowId: '',
      lastApproveDetailId: '',
      content: '',
      list: [],
      appealVisable: false,
      appealForm: {
        reason: ''
      },
      appealRules: {
        reason: [{ required: true, message: '请输入申诉理由', trigger: 'blur' }]
      },
      checkSignObj: {
        contractFileUrl: '',
        employeeSignStatus: 0, //	员工签署状态（0-待签署，1-已签署）
        employeeSignTime: '',
        signFileId: 0,
        signFileVersion: 0,
        signUrl: ''
      },
      balanceNotTipsDialog: false,
      balanceNotTipsDialogMsg: ''
    }
  },
  created() {
    // this.getLoginInfo()
    checkSignDigitalhuman().then(res => {
      if (res.data) {
        this.checkSignObj = { ...res.data }
        localStorage.setItem(
          'checkSignDigitalhuman' + this.$store.state.user.userInfo.userId,
          this.checkSignObj.employeeSignStatus
        )
      }
    })
    document.addEventListener('contextmenu', function (e) {
      e.preventDefault()
    })
  },
  // mounted() {
  //   this.onSearchFn()
  // },
  methods: {
    async checkBalance() {
      const res = await checkPackageOrderBalance({ type: 3 })
      if (res.data && res.data.length) {
        this.balanceNotTipsDialog = true
        this.balanceNotTipsDialogMsg = res.data
        return true
      }
      return false
    },
    refreshCheckSign() {
      checkSignDigitalhuman().then(res => {
        if (res.data) {
          this.checkSignObj = { ...res.data }
          localStorage.setItem(
            'checkSignDigitalhuman' + this.$store.state.user.userInfo.userId,
            this.checkSignObj.employeeSignStatus
          )
          const iframe = this.$refs.iframeCheckSignRef
          iframe.src = this.checkSignObj.contractFileUrl
        }
      })
    },
    submitAppeal() {
      this.$refs.appealForm.validate(valid => {
        if (valid) {
          appeal({
            videoId: this.rowId,
            appealReason: this.appealForm.reason,
            lastApproveDetailId: this.lastApproveDetailId
          }).then(() => {
            this.$message.success('已申诉')
            this.appealVisable = false
            this.onSearchFn()
          })
        }
      })
    },
    appeal(record) {
      this.rowId = record.videoId
      this.lastApproveDetailId = record.lastApproveDetailId
      this.appealForm.reason = ''
      this.appealVisable = true
    },
    editName(record) {
      if (record.auth !== 1) return
      record.isEdit = !record.isEdit
      this.config.tableData.forEach(item => {
        if (item.videoId !== record.videoId) {
          item.isEdit = false
        }
      })
      if (!record.isEdit) {
        updateVideoName({
          videoId: record.videoId,
          videoName: record.name
        }).then(() => {
          this.$message.success('修改成功')
        })
      }
    },
    urgent(record) {
      // 距离上一次加急不能少于一分钟间隔
      if (record.lastUrgentTime) {
        const lut = new Date(record.lastUrgentTime).getTime()
        const now = new Date().getTime()
        if (now - lut < 60000) {
          const diff = Math.ceil((60000 - (now - lut)) / 1000)
          this.$message.error(`请${diff}秒后重试，最多可加急3次`)
          return
        }
      }
      this.loading = true
      urgentReview({ videoId: record.videoId })
        .then(() => {
          this.loading = false
          this.$message.success('加急成功')
          this.onSearchFn()
        })
        .catch(() => {
          this.loading = false
        })
    },
    withdraw(record) {
      this.$confirm(`确定撤回【${record.name}】视频吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        withdraw({ videoId: record.videoId })
          .then(res => {
            this.loading = false
            this.$message.success('撤回成功')
            this.onSearchFn()
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    openDetail(record) {
      this.rowId = record.videoId
      this.content = record.plainText
      this.copyDetailsVisible = true
    },
    async getLoginInfo() {
      const res = await getLoginInfo()
      this.isHead = res.data.role === 1
    },
    showRejectDialog(record) {
      this.$uweb &&
        this.$uweb.setAction('Event_AI_Video_Management_Reject_Video')
      this.list = []
      getReason({ approveDetailId: record.lastApproveDetailId })
        .then(res => {
          const {
            approverUser,
            approvedTime,
            approvalOpinion,
            approverUserId
          } = res.data
          this.formReject = {
            auditName: approverUser,
            auditTime: approvedTime,
            auditReason: approvalOpinion
          }
          getAnnotionsDeltas({ videoId: record.videoId }).then(res => {
            const info = res.data?.annotationInfo
              ? res.data?.annotationInfo.find(
                f => f.createUserId === approverUserId && f.isHistory === 0
              )
              : undefined
            if (info) {
              const ls = info.annotations.map(m => ({
                id: m.id,
                isSelect: false,
                status: 2,
                loading: false,
                title: m.text,
                inputContent: m.content,
                styleId: m.styleId,
                time: moment(m.annotationTime)
              }))
              this.list = ls
            }
          })

          this.visibleReject = true
        })
        .catch(() => {
          this.$message.error('查询审批原因失败')
        })
    },
    getOptionsValueByKey,
    // 分页改变触发
    handleSizeChange(row) {
      this.config.pageSize = row
      this.config.currentPage = 1
      this.getList()
    },
    closeReject() {
      this.visibleReject = false
    },
    closeVideo() {
      this.destroy()
      this.player = null
      this.playerSdk = null
      this.dialogVisible = false
      this.player_create_finish = false
    },
    // 当前页改变触发
    handleCurrentChange(row) {
      this.config.currentPage = row
      this.getList()
    },
    // 点击编辑按钮
    onhandleEdit(row) {
      this.addConfig = {
        type: 2,
        row: row,
        visible: true
      }
    },
    async editVideo(row) {
      // if (await this.checkBalance()) {
      //   return
      // }
      const res = await this.$store.dispatch('user/viewingFlag', 'digitalHuman')

      if (!res) {
        //  跳转创建视频
        this.$router.push({
          // rodoRouter--------------需要接口获取
          path: '/digitalPerson/createDigitaVideo',
          query: {
            videoId: row.videoId,
            type: 'edit',
            thirdType: row.thirdType,
            materialType: row.materialType,
            lastApproveDetailId:
              row.status === 6 || row.status === 99
                ? row.lastApproveDetailId
                : undefined
          }
        })
      }
    },
    async copyVideo(row) {
      // if (await this.checkBalance()) {
      //   return
      // }
      this.$uweb && this.$uweb.setAction('Event_AI_Video_Management_Copy_Video')
      //  跳转创建视频
      this.$router.push({
        // rodoRouter--------------需要接口获取
        path: `/digitalPerson/createDigitaVideo`,
        query: {
          videoId: row.videoId,
          type: 'copy',
          thirdType: row.thirdType,
          materialType: row.materialType
        }
      })
    },
    videoPreview(row) {
      this.previewInfo = {
        ...row
      }
      this.$uweb &&
        this.$uweb.setAction('Event_AI_Video_Management_Review_Video')
      this.dialogVisible = true
      this.play(this.decryptAES(row.videoUrl, keyVideo))
    },
    // downloadFile(url, fileName) {
    //   const x = new XMLHttpRequest()
    //   x.open('GET', url, true)
    //   x.setRequestHeader('Content-type', 'application/x-download')
    //   x.responseType = 'blob'
    //   x.onload = function(e) {
    //     const url = window.URL.createObjectURL(x.response)
    //     const a = document.createElement('a')
    //     a.href = url
    //     a.target = '_blank'
    //     a.download = fileName
    //     a.click()
    //     a.remove()
    //   }
    //   x.send()
    // },
    downloadFile(url, fileName) {
      console.log(888)
      // 将lob对象转换为域名结合式的url
      const link = document.createElement('a')
      document.body.appendChild(link)
      link.style.display = 'none'
      link.target = 'tempiframe'
      link.href = url
      // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
      link.download = ''
      // 自触发click事件
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
    // 下载字幕
    subtitlesDownload(row) {
      window.open(row.subtitlesUrl)
    },
    videoDownload(row) {
      this.$uweb &&
        this.$uweb.setAction('Event_AI_Video_Management_DownLoad_Video')
      // this.downloadFile(row.videoUrl, row.name)
      window.open(this.decryptAES(row.videoUrl, keyVideo))
    },
    // 按钮监听键盘
    keyDown() {
      const _this = this
      // 监听键盘按钮
      document.onkeydown = function (event) {
        var e = event || window.event
        var keyCode = e.keyCode || e.which
        switch (keyCode) {
          case 32:
            _this.playVideo && _this.playVideo()
            break
          default:
            break
        }
        /* if (e && e.preventDefault) {
          e.preventDefault()
        } else {
          window.event.returnValue = false
        } */
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
                  this.zimuArr.some(item => {
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
    },
    keyDownReview() {
      document.onkeydown = function (event) {
        var e = event || window.event
        e.returnValue = true
      }
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
    goBgImg() {
      this.$router.push({
        path: '/digitalPerson/bgImgManage'
      })
    },
    // 点击删除按钮
    onhandleDel(row) {
      this.$uweb &&
        this.$uweb.setAction('Event_AI_Video_Management_Delete_Video')
      this.$delModal({
        width: '505px',
        tips: `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">删除提醒</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">确定删除该视频?</div>`,
        success: () => {
          this.loading = true
          const data = {
            videoId: row.videoId
          }
          videoDelete(data)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.onSearchFn()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击查询按钮
    onSearchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 点击重置按钮
    onClear() {
      this.search = {
        teacherId: '',
        videoName: '',
        time: { value: '' }
      }
      this.onSearchFn()
    },
    // 点击新增规则按钮
    async onhandleAdd() {
      // if (await this.checkBalance()) {
      //   return
      // }
      const res = await this.$store.dispatch('user/viewingFlag', 'digitalHuman')
      if (!res) {
        this.$uweb &&
          this.$uweb.setAction('Event_AI_Video_Management_Create_Video')
        this.$uweb && this.$uweb.setAction('Event_huaweiAiVideo_create')
        //  跳转创建视频
        this.$router.push({
          // TODO: Router--------------需要接口获取
          path: '/digitalPerson/createDigitaVideo'
        })
      }
    },
    // 获取列表数据
    getList() {
      this.loading = true
      console.log(this.search.time, '选择的时间')
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        deptId: this.search.deptId || undefined,
        createUserId: this.search.userId || undefined,
        materialType: this.search.materialType || undefined,
        status: this.search.status ? Number(this.search.status) : undefined,
        teacherId: this.search.teacherId || undefined,
        videoName: this.search.videoName || undefined,
        startTime: this.search.time.value ? this.search.time.value[0] : '',
        endTime: this.search.time.value ? this.search.time.value[1] : '',
        plainText: this.search.plainText || undefined
      }
      getVideoList(params)
        .then(res => {
          this.config.tableData = res.data.items.map(m => ({
            ...m,
            isEdit: false
          }))
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击关闭弹框并刷新列表
    closeAddDialog() {
      this.addConfig.visible = false
      this.onSearchFn()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  min-width: 1200px;
  padding: 20px;
  .name-slot {
    max-width: 170px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    display: inline-block;
    i {
      cursor: pointer;
    }
  }
}
::v-deep .name-slot {
  .el-input input {
    padding: 0 34px 0 15px;
  }
}
.vdc-right {
  //position: relative;
  width: 794px;
  height: 500px;
  float: left;
  margin-left: 19px;
  border-radius: 10px;
  background-image: url('../../../assets/image/video/jx_bg.png');
  background-size: 100% 100%;
  overflow: hidden;
  .video_play {
    margin-top: 35px;
    width: 790px;
    margin-left: 1px;
    height: 443px;
  }
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
.expertChannel {
  display: flex;
  align-items: center;
  .expertChannelicon {
    width: 20px;
    height: 20px;
    font-size: 20px;
    margin-right: 8px;
  }
}
.reason-title {
  i {
    color: chocolate;
    margin-right: 6px;
    font-size: 18px;
  }
}
.status {
  padding: 1px 10px;
  width: fit-content;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  user-select: none;
  font-size: 12px;
  font-family: MicrosoftYaHei;

  .div-icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    background-repeat: round;
  }
}
.status-audit {
  background: #ffe0f0;
  color: #ff359c;
  .div-icon {
    background-image: url('../../../assets/image/aigc/digitalVideoManage/check-circle-filled2.png');
  }
}
.status-pending {
  background: #ebebeb;
  color: #666666;
  .div-icon {
    background-image: url('../../../assets/image/aigc/digitalVideoManage/check-circle-fille3.png');
  }
}
.status-generate {
  background: #fff2e6;
  color: #ff7d00;
  .div-icon {
    background-image: url('../../../assets/image/aigc/digitalVideoManage/genren.png');
  }
}
.status-fail {
  background: #feecec;
  color: #f53f3f;
  .div-icon {
    background-image: url('../../../assets/image/aigc/digitalVideoManage/close-circle-filledv.png');
  }
}
.status-success {
  background: #e6f7ea;
  color: #00b42a;
  .div-icon {
    background-image: url('../../../assets/image/aigc/digitalVideoManage/check-circle-fille4.png');
  }
}
.status-reject {
  background: #f2e0ff;
  color: #a836ff;
  .div-icon {
    background-image: url('../../../assets/image/aigc/digitalVideoManage/check-circle-filled.png');
  }
}
.status-pass {
  background: #e0f7ff;
  color: #0090c7;
  .div-icon {
    background-image: url('../../../assets/image/aigc/digitalVideoManage/success.png');
  }
}
.status-draft {
  width: 74px;
  background: #e8ebee;
  color: #777777;
  .div-icon {
    background-image: url('../../../assets/image/aigc/digitalVideoManage/draft.png');
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #0c6fff;
  margin-left: 10px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
::v-deep .el-dialog__footer {
  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dialog-appeal-footer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.reason-content-reason {
  width: 100%;
  max-height: calc(310px - 40px);
  padding: 12px 14px;
  font-size: 14px;
  color: #333333;
  word-break: break-all;
  overflow-y: auto;
  .title-rl {
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: initial;
  }
  .content-rl {
    background: #e8ebee;
    padding: 7px 9px;
    margin: 8px 0;
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #777777;
    border-radius: 4px;
    line-height: initial;
    cursor: pointer;
  }
  .content-rl-select {
    padding: 6px 8px;
    background: #e5f0ff;
    color: #0c6fff;
    border: 1px solid #0c6fff;
  }
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #d8d8d8;
    transition: all 0.4s ease;
  }

  &::-webkit-scrollbar-track {
    background: #fff;
  }
}
.urgent-btn {
  img {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 4px;
    margin-bottom: 2px;
  }
}
</style>
