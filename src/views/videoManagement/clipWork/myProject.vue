<template>
  <div class="pageWrap">
    <div class="projectDetail">
      <div class="projectDetailForm overflowOuto">
        <div class="p-l-r-16 detailTitle flex flex-middle">
          <span>我的工程</span>
          <span v-if="disName" class="tag-dis">{{ disName }}</span>
        </div>
        <div
          v-if="detailForm === null"
          class="pd-nodata"
          style="margin: 290px auto 120px"
        >
          <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
          <div class="m-t-10 noDataText">暂无工程内容</div>
        </div>
        <div v-else class="detailForm">
          <div class="detailFormRow">
            <div class="form_item">
              <div class="form_item_label">工程名称：</div>
              <div
                v-if="!editFlag"
                class="form_item_value"
                style="width: 580px"
              >
                <span class="title-span">{{
                  detailForm && detailForm.projectName
                }}</span>
                <i class="edit-cls" @click="toEdit" />
              </div>
              <div v-else class="form_item_value" style="width: 580px">
                <el-input
                  v-model="inputProjectName"
                  class="title-input"
                  size="mini"
                  placeholder="请输入2~30个字符工程名称"
                  maxlength="30"
                  show-word-limit
                  @input="delNoNumber"
                />
                <el-button type="primary" size="mini" @click="tosave"
                  >保存</el-button
                >
                <div class="tips">{{ tips }}</div>
              </div>
            </div>
          </div>
          <div class="detailFormRow">
            <div class="form_item">
              <div class="form_item_label">创建时间：</div>
              <div class="form_item_value">
                {{
                  detailForm && detailForm.createTime
                    ? DateFormat(
                        new Date(detailForm.createTime),
                        'yyyy-MM-dd hh:mm:ss'
                      )
                    : ''
                }}
              </div>
            </div>
            <div class="form_item">
              <div class="form_item_label">工程来源：</div>
              <div class="form_item_value">
                {{ detailForm && detailForm.projectSourceDesc }}
              </div>
            </div>
          </div>

          <MTitle title="脱敏视频信息" class="m-t-32 m-b-12" />

          <div class="detailFormRow">
            <div class="form_item">
              <div class="form_item_label">视频组创建者：</div>
              <div class="form_item_value">
                {{ detailForm && detailForm.createUserName }}
              </div>
            </div>
            <div class="form_item">
              <div class="form_item_label">视频组名称：</div>
              <div class="form_item_value">
                {{ detailForm && detailForm.videoGroupName }}
              </div>
            </div>
            <div class="form_item">
              <div class="form_item_label">IP：</div>
              <div class="form_item_value">
                {{ (detailForm && detailForm.teacherName) || '--' }}
              </div>
            </div>
          </div>

          <div class="detailFormRow">
            <div class="form_item">
              <div class="form_item_label">视频类型：</div>
              <div class="form_item_value">
                {{ detailForm && detailForm.videoTypeDesc }}
              </div>
            </div>
            <div class="form_item">
              <div class="form_item_label">交付场景：</div>
              <div class="form_item_value">
                {{ (detailForm && detailForm.sceneName) || '--' }}
              </div>
            </div>
            <div class="form_item">
              <div class="form_item_label">共享对象：</div>
              <div v-if="detailForm.isOpen === 0" class="form_item_value">
                无
              </div>
              <div
                v-else-if="
                  detailForm.isOpen === 1 && detailForm.shareUsers === null
                "
              >
                所有人
              </div>
              <div v-else style="width: 600px">
                <span
                  v-for="(item, index) in detailForm.shareUsers"
                  :key="item.userId"
                  >{{ item.userName }}
                  {{
                    index === detailForm.shareUsers.length - 1 ? '' : '、'
                  }}</span
                >
              </div>
            </div>
          </div>
          <div class="detailFormRow">
            <div class="form_item">
              <div class="form_item_label">视频总时长：</div>
              <div class="form_item_value">
                {{
                  detailForm && secondIsLiveDuration(detailForm.totalDuration)
                }}
              </div>
            </div>
            <div class="form_item">
              <div class="form_item_label">视频组类型：</div>
              <div class="form_item_value">
                {{
                  detailForm && detailForm.type === 2
                    ? '多机位视频组'
                    : '单机位视频组'
                }}
              </div>
            </div>
          </div>
          <div class="show-jied">
            <MTitle :title="tmsplb" class="m-t-32" />
          </div>

          <div class="detailVideoList m-t-20">
            <template v-for="(item, index) in detailForm.videos">
              <videoListView
                :key="index"
                :name="item.name"
                :version="item.version"
                :video-create-time="item.videoCreateTime"
                :is-new-video="item.isNewVideo"
                :carema-type="detailForm.type"
                class="videoListView"
                :if-current="
                  item.projectVideoId === videoListObj.form.projectVideoId
                "
                :poster-url="item.posterUrl"
                :size="item.size"
                :data="item"
                :srt-url="item.srtUrl"
                :duration="item.duration"
                :url="item.videoUrl"
                :video-type="2"
                :project-video-id="item.projectVideoId"
                @click="videoClick(item, $event)"
              />
            </template>
            <div
              v-if="detailForm.videos && detailForm.videos.length === 0"
              class="noData video-nodata"
              style="margin: 290px auto 120px"
            >
              <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
              <div class="m-t-10 noDataText">暂无视频内容</div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="detailForm && detailForm.projectName"
        class="projectDetailFooter"
      >
        <el-button
          v-permission="['web:clipWork:editing', permsList]"
          type="primary"
          @click="gotoSubitleEditor"
          >在线剪辑</el-button
        >
        <el-button @click="toShareProject(detailForm)">工程共享</el-button>
        <el-button @click="checkSemiDetail">查看脱敏详情</el-button>
        <el-button class="btn_del" @click="deleteProject(detailForm)"
          >删除</el-button
        >
      </div>
    </div>
    <!-- <div class="videoList">
      <div class="video-list-top">
        <MTitle title="视频片段列表" class="p-l-r-16" />
        <el-button id="refreshBtn" v-loading="shuaxinFlag" element-loading-spinner="el-icon-loading" style="float: right; margin-right: 18px; margin-top: -25px;" type="text" size="mini" @click="shoudongdianji"> 刷新<i class="icn_refresh_btn" /></el-button>
      </div>
      <div class="video-list-top">
        <p class="video-list-t-p">{{ detailForm?clickVideoName:'' }}</p>
      </div>
      <div class="actionColumn p-l-r-16">
        <div v-if="!show" class="actionColumnLeft">
          <el-checkbox
            v-if="!downloadPFlag"
            ref="clicktoChooseAll"
            v-model="checkAll"
            :disabled="downloadPFlag"
            @change="handleCheckAllChange"
          >
            <span class="c_777">全选({{ checkedNums }})</span>
          </el-checkbox>
          <span v-if="!downloadPFlag" class="a_link" @click="downloadProject">下载工程</span>
          <div v-else>
            <span class="a_link">打包中<i class="el-icon-loading" /></span>
            <span style="margin-left: 10px;" class="a_link" @click="cancelDownloadData">取消下载</span>
          </div>
        </div>
        <div class="actionColumnRight" :class="show ? '' : 'shotAction'">
          <div class="searchIcon">
            <svg-icon class="pointer" icon-class="searchIcon" :style="{'margin-right': show ? '10px' : '0px'}" @click="changeShowSearch" />
            <el-input
              v-if="show"
              ref="myInput"
              v-model="partName"
              size="small"
              placeholder="请输入关键词搜索"
              :class="{show: show}"
              class="myinput"
              clearable
              @input="getVideoClipList"
              @clear="clearKeyword"
            />
          </div>
        </div>
      </div>
      <div ref="listOverFlow" class="list overflowOuto">
        <div
          v-for="(item, index) in data"
          :key="index"
          v-loading="videoClipLoading"
          class="list_li"
          :class="{mouseActive: index === activeIndex}"
          @mouseenter="mouseenter(index)"
          @mouseleave="mouseleave()"
        >
          <i v-if="item.isDownloadFinish" class="icn_fordownload" />
          <div class="list_header">
            <el-checkbox v-if="!downloadPFlag" v-model="item.checked" :disabled="item.disabled || item.exportStatus === 1 || item.exportStatus === 3" @change="(val) => handleCheckChange(item, val)" />
            <span class="list_header_title"><el-tooltip class="item" effect="light" :content="item.name" placement="bottom"><p style="cursor:pointer; color: #1890ff" @click="showVideoDetail(item)">{{ item.name }}</p></el-tooltip></span>
            <span :class="`status status_${item.exportStatus}`">{{ {1: '生成中...', 2: '生成成功', 3:'生成失败'}[item.exportStatus] }}</span>
          </div>
          <div class="btn_footer">
            <div class="list_time">{{ formatDuring(item.startTime*1000) }} - {{ formatDuring(item.endTime*1000) }}</div>
            <span class="btnView">
              <div v-if="item.exportStatus !== 1" class="btn delete-btn" @click="deletePartVide(item)">删除</div>
              <div v-if="item.exportStatus === 1" class="btn scz-btn">预计{{ item.progress }}分钟完成</div>
            </span>
          </div>
        </div>
        <div v-if="data && data.length === 0" class="noData pd-nodata" style="margin: 290px auto 120px">
          <img src="~@/assets/image/zanwusousuoneirong2.png" alt="">
          <div class="m-t-10 noDataText">暂无视频片段</div>
        </div>
      </div>
    </div> -->
    <projectSharing ref="setProtectShare" @loadDateFn="loadDate" />
    <div v-if="errorAlertFlag" class="error-tips">
      <i class="el-icon-warning" />
      <span
        >工程「{{
          detailForm.projectName
        }}」下载失败，请重新下载或联系数据化中心进行修复！</span
      >
      <em @click="errorAlertFlag = false">我知道了</em>
    </div>
  </div>
</template>

<script>
import videoListView from './components/videoListView.vue'
import projectSharing from '@/views/videoManagement/clipWork/components/projectSharing'
import { getItem } from '@/utils/localStorage'

import {
  getMyprojectDetail,
  getPartList,
  deleteMyProject,
  deletePart,
  submitDownloadTask,
  getPartDownloadTask,
  getFileUrl,
  cancelDownload,
  sureConfirmFail,
  updateMyProject
} from '@/api/videoManagement/clipWork'
import axios from 'axios'
import { DateFormat, formatDuring, secondIsLiveDuration } from '@/utils/index'
import { urlVodExportZip } from '@/utils/zip'
import AppVideo from '@/components/AppVideo'
import { userCloudPc } from '@/api/videoManagement/cloudDesktop'
// import videoplayer from '@/views/videoManagement/component/videoplayer/index'
export default {
  components: {
    videoListView,
    projectSharing
  },
  props: {},
  data() {
    return {
      shuaxinFlag: true,
      tmsplb: '',
      tips: '注：名称不能包含下列任何字符： / : * ? " < > |',
      inputProjectName: '',
      editFlag: false,
      errorAlertFlag: false,
      clickVideoName: '',
      show: false,
      partName: '',
      detailForm: {},
      videoListObj: {
        form: {
          projectVideoId: ''
        }
      },
      checkAll: false,
      // isIndeterminate: false,
      // 视频片段列表
      data: [],
      // 脱敏视频列表
      videoList: [],
      activeIndex: '', // 当前鼠标移入的对象
      form: {},
      total: 0,
      current: 1,
      size: 10,
      checkedNums: 0,
      downloadProjectObject: {
        downloadId: '',
        partIds: [],
        projectId: '',
        status: 0
      },
      stopDownloadGetUrl: true,
      downloadPFlag: false,
      projectId: '',
      permsList: this.$route.meta.permsList || [],
      disName: '' // 分发而来机构name
    }
  },
  mounted() {},
  destroyed() {},
  methods: {
    changeSelect(id) {
      console.log(this.detailForm.videos, '选中的视频列表')
      const item = this.detailForm.videos.map(item => {
        if (item.projectVideoId === id) {
          return item
        }
      })
      console.log(item, '选中的视频')
    },
    delNoNumber(e) {
      this.inputProjectName = e.replace(
        /[(\/)(\\)(\:)(\*)(\?)(\")(\<)(\>)(\|)]/g,
        ''
      )
    },
    toEdit() {
      this.$uweb && this.$uweb.setAction('Event_clipWork_myProject_editName')
      this.editFlag = true
      this.inputProjectName = this.detailForm.projectName
    },
    tosave() {
      if (this.inputProjectName === '') {
        this.$message.error('请输入2~30个字符的工程名称')
        return
      }
      if (this.inputProjectName && this.inputProjectName.length < 2) {
        this.$message.error('请输入2~30个字符的工程名称')
        return
      }
      const params = {
        projectId: this.projectId,
        projectName: this.inputProjectName
      }
      updateMyProject(params).then(res => {
        if (res.success) {
          this.$message.success('修改成功！')
          this.editFlag = false
          this.detailForm.projectName = this.inputProjectName
          // this.$emit('loadProjectFzData')
          this.$emit('resetListData', this.detailForm)
        }
      })
    },
    cancelDownloadData() {
      this.$confirm(
        '取消下载后，将终止此次工程打包操作，是否确认取消？',
        '取消下载提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '关闭',
          type: 'info'
        }
      )
        .then(() => {
          const params = {
            downloadId: this.downloadProjectObject.downloadId
          }
          cancelDownload(params).then(res => {
            if (res.success) {
              this.$message.success('工程已取消下载！')
              this.downloadProjectObject = {
                downloadId: '',
                partIds: [],
                projectId: '',
                status: 0
              }
              this.clearDownloadStatus()
              this.clearAllCheck()
              this.stopDownloadGetUrl = false
              this.downloadPFlag = false
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作，工程继续下载'
          })
        })
    },
    shoudongdianji() {
      this.shuaxinFlag = true
      console.log('change')
      // this.getVideoClipList()
      const that = this
      setTimeout(function () {
        that.shuaxinFlag = false
      }, 1000)
      this.refreshVideoListData()
    },
    refreshVideoListData() {
      this.current = 1
      // this.getVideoClipList()
    },
    clearAllCheck() {
      this.checkAll = false
      // this.isIndeterminate = false
      this.checkedNums = 0
    },
    changeShowSearch() {
      this.show = !this.show
      if (!this.show) {
        this.partName = ''
        // this.getVideoClipList()
      }
    },
    showVideoDetail(item) {
      // videoplayer.play({
      //   visible: true,
      //   url: item.videoUrl,
      //   videoName: item.name,
      //   videoId: item.partId,
      //   // autoplayMuted: true,
      //   autoplay: false
      // })
      AppVideo.play({
        visible: true,
        url: item.videoUrl,
        videoName: item.name,
        videoId: item.partId,
        // autoplayMuted: true,
        autoplay: false
      })
    },
    async downloadVideo(object) {
      this.downloadFlag = true
      const list = []
      list.push({
        src: object.videoUrl,
        name: object.name.replace('.mp4', '') + '.mp4'
      })
      await urlVodExportZip(list, object.name.replace('.mp4', '') + '.zip')
      this.downloadFlag = false
    },
    clearKeyword() {
      this.partName = ''
    },
    getDownloadTaskNow(newName) {
      if (newName === '' || newName === undefined) {
        return false
      }
      this.downloadProjectObject = {
        downloadId: '',
        partIds: [],
        projectId: '',
        status: 0
      }
      getPartDownloadTask(newName).then(res => {
        if (res.success) {
          if (res.data !== null) {
            this.downloadProjectObject = res.data
            if (res.data && res.data.downloadId) {
              this.stopDownloadGetUrl = true
              this.downloadFill()
              this.toGetTheloadUrl()
            } else {
              this.stopDownloadGetUrl = false
              this.clearDownloadStatus()
            }
          }
        }
      })
    },
    downloadFill() {
      if (
        this.downloadProjectObject.status === 1 ||
        this.downloadProjectObject.status === 2 ||
        this.downloadProjectObject.status === 4
      ) {
        this.data.some(item => {
          this.$delete(item, 'disabled')
          this.$set(item, 'disabled', true)
        })
        this.downloadPFlag = true
        for (let i = 0; i < this.downloadProjectObject.partIds.length; i++) {
          this.data.some(obj => {
            if (this.downloadProjectObject.partIds[i] === obj.partId) {
              obj.checked = true
            }
          })
        }
        if (this.downloadProjectObject.partIds.length === this.data.length) {
          this.checkAll = true
          this.checkedNums = this.data.length
        } else {
          this.checkAll = false
          this.checkedNums = this.downloadProjectObject.partIds.length
        }
      } else if (this.downloadProjectObject.status === 3) {
        this.clearDownloadStatus()
        this.clearAllCheck()
        this.errorAlertFlag = true
        this.stopDownloadGetUrl = false
        const params = {
          downloadId: this.downloadProjectObject.downloadId
        }
        sureConfirmFail(params).then(res => {
          console.log('dsssssss:', res)
        })
      } else {
        this.clearDownloadStatus()
      }
    },
    clearDownloadStatus() {
      // this.clearAllCheck()
      this.downloadPFlag = false
      this.data.some(item => {
        this.$delete(item, 'checked')
        this.$delete(item, 'disabled')
        this.$set(item, 'disabled', false)
        this.$set(item, 'checked', false)
      })
    },
    toGetTheloadUrl() {
      if (
        this.downloadProjectObject.downloadId === null ||
        this.downloadProjectObject.downloadId === undefined ||
        this.downloadProjectObject.downloadId === ''
      ) {
        return false
      }
      getFileUrl(this.downloadProjectObject.downloadId).then(res => {
        if (res.success && res.data !== '') {
          this.clearDownloadStatus()
          this.clearAllCheck()
          this.downloadProjectObject = {
            downloadId: '',
            partIds: [],
            projectId: '',
            status: 0
          }
          this.downloadFile(res.data)
        } else {
          const that = this
          this.downloadFill()
          if (this.stopDownloadGetUrl) {
            setTimeout(function () {
              that.getDownloadTaskNow(that.projectId)
            }, 5000)
          } else {
            this.stopDownloadGetUrl = true
            this.clearDownloadStatus()
          }
        }
      })
    },
    DateFormat,
    formatDuring,
    secondIsLiveDuration,
    loadDate() {
      const params = {
        projectId: this.projectId
      }
      getMyprojectDetail(params)
        .then(res => {
          this.detailForm.shareUsers = res.data.shareUsers
          this.detailForm.isOpen = res.data.isOpen
          this.inputProjectName = this.detailForm.projectName
            ? this.detailForm.projectName
            : ''
          const orgInfo = getItem('orgInfo')
          this.disName =
            orgInfo.organizationId !== res.data.supplierOrgId
              ? res.data.supplierOrgName
              : ''
        })
        .catch(err => {
          if (err && err.message === 'cancel') {
            return
          }
          this.loading = false
        })
    },
    // 获取我的工程详情数据
    getDetail(newName, videoId) {
      this.loading = true
      this.projectId = newName
      if (newName === '') {
        return false
      }
      const params = {
        projectId: newName
      }
      // this.source = axios.CancelToken.source()
      getMyprojectDetail(params)
        .then(res => {
          this.detailForm = res.data
          this.editFlag = false
          this.tmsplb = '脱敏视频列表(' + this.detailForm.videos.length + ')'
          if (this.detailForm.videos && this.detailForm.videos.length > 0) {
            console.log(videoId, '是否有videoId')
            if (videoId) {
              this.detailForm.videos.some(item => {
                if (item.projectVideoId === videoId) {
                  this.videoListObj.form = item
                  this.clickVideoName = item.name
                  return true
                }
              })
            } else {
              this.videoListObj.form = this.detailForm.videos[0]
              this.clickVideoName = this.videoListObj.form.name
            }
            const orgInfo = getItem('orgInfo')
            this.disName =
              orgInfo.organizationId !== res.data.supplierOrgId
                ? res.data.supplierOrgName
                : ''
            // this.getVideoClipList()
          }
          // this.videoList = res.data.videos
          // this.clickAllVideoList()
          this.loading = false
        })
        .catch(err => {
          if (err && err.message === 'cancel') {
            return
          }
          this.loading = false
        })
    },
    // 删除视频片段
    deletePartVide(obj) {
      this.$confirm('视频片段删除后将不可恢复，确认删除吗？', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'del-model',
        type: 'error'
      })
        .then(() => {
          const params = {
            partId: obj.partId
          }
          deletePart(params).then(res => {
            if (res.success) {
              this.$message.success('删除成功！')
              const index = this.data.findIndex(ele => {
                return ele.partId === obj.partId
              })
              if (index >= 0) {
                this.data.splice(index, 1)
              }
              if (this.checkAll) {
                this.checkedNums = this.data.length
              }
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 点击脱敏视频列表
    videoClick(item, e) {
      console.log(item, '点击脱敏视频列表')
      // this.show = false
      // this.current = 1
      // this.clearAllCheck()
      // this.clearDownloadStatus()
      this.clickVideoName = item.name
      // if (this.videoListObj.form.projectVideoId && this.videoListObj.form.projectVideoId === item.projectVideoId) {
      //   // this.clickAllVideoList()
      // } else {
      //   this.videoListObj.ifAllVideoList = false
      this.videoListObj.form = item
      //   this.getVideoClipList()
      //   this.downloadFill()
      // }
    },
    // 删除当前工程
    deleteProject(obj) {
      this.$uweb && this.$uweb.setAction('Event_clipWork_myProject_del')
      this.$confirm(
        '工程删除后，个人在工程中做的所有标记、剪辑记录，以及所有的视频片段都将全部删除，且不可恢复，确认删除吗？',
        '',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'del-model',
          type: 'error'
        }
      )
        .then(() => {
          const params = {
            projectId: this.projectId
          }
          deleteMyProject(params).then(res => {
            if (res.success) {
              this.$message.success('删除成功！')
              localStorage.removeItem('myProjectChooseObj')
              // this.$emit('loadProjectFzData')
              this.$emit('loadProjectFzData')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 获取视频片段列表数据
    getVideoClipList() {
      this.videoClipLoading = true
      this.source_clip = axios.CancelToken.source()
      if (!this.videoListObj.form.projectVideoId) {
        return
      }
      const params = {
        projectId: this.projectId,
        pageSize: this.size,
        pageIndex: this.current,
        partName: this.partName,
        projectVideoId: this.videoListObj.form.projectVideoId
      }
      getPartList(params, this.source_clip.token)
        .then(res => {
          this.data = res.data.items
          this.data.some(item => {
            this.$delete(item, 'checked')
            this.$set(item, 'checked', false)
          })
          this.checkAll = false
          // this.isIndeterminate = true
          this.total = res.data.total
          this.videoClipLoading = false
        })
        .catch(err => {
          if (err && err.message === 'cancel') {
            return
          }
          this.videoClipLoading = false
        })
    },
    // 操作栏全选点击触发
    handleCheckAllChange(val) {
      this.checkedNums = 0
      // this.isIndeterminate = false
      this.data.forEach(v => {
        if (v.exportStatus === 2) {
          this.checkedNums++
          v.checked = val
        }
      })
      this.checkedNums = val ? this.checkedNums : 0
    },
    // 选择操作
    handleCheckChange(item, val) {
      const length = this.data.filter(v => v.checked).length
      this.checkedNums = length
      if (length === 0) {
        this.checkAll = false
        // this.isIndeterminate = false
      } else if (length === this.data.length) {
        this.checkAll = true
        // this.isIndeterminate = false
      } else {
        this.checkAll = false
        // this.isIndeterminate = true
      }
    },
    toShareProject(obj) {
      this.$uweb && this.$uweb.setAction('Event_clipWork_myProject_share')
      this.$refs.setProtectShare.show(obj)
    },
    checkSemiDetail() {
      // this.$router.push(`/subtitleEditor/1584496538720145408?videoGroupName=范德萨发的`)
      // 1584496538720145408
      this.$uweb && this.$uweb.setAction('Event_clipWork_detail')
      const res = this.detailForm.videos.every(item => {
        return item.isEmptyMirror === 1
      })
      if (res) {
        this.$message.error('视频列表均为空镜素材，无脱敏内容')
      } else {
        const toTaskLog = this.$router.resolve({
          path: `/showSemiVideoDetail/${this.projectId}?videoType=1&videoGroupName=${this.detailForm.projectName}`
        })
        window.open(toTaskLog.href, '_blank')
      }
    },
    // 鼠标移入
    mouseenter(index) {
      this.activeIndex = index
    },
    // 鼠标移出
    mouseleave() {
      this.activeIndex = ''
    },
    // 分页改变触发
    currentChange(val) {
      this.current = val
      this.clearAllCheck()
      // this.getVideoClipList()
    },
    // 点击跳转在线剪辑工作台
    async gotoSubitleEditor() {
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'operationOnlineEditing'
      )
      if (!res) {
        this.$uweb &&
          this.$uweb.setAction('Event_clipWork_myProject_onlineEditing')
        this.$router.push({
          path: `/videoEditor?projectId=${this.projectId}&projectVideoId=${this.videoListObj.form.projectVideoId}&type=1`
        })
        // const res = await userCloudPc()
        // const ecsStatus = res.data?.ecsStatus
        // // 环境变量是dev的时候可以直接进去或者url里面有localhost
        // // 获取浏览器的url地址
        // const url = window.location.href
        // if (ecsStatus || process.env.NODE_ENV === 'development' || url.includes('localhost')) {
        //   // 检测是否是否需要同步数据且今天已经同步过了
        //   const syncRes = await this.$store.dispatch('videoManage/syncCheck', {
        //     btnText: '继续使用',
        //     projectId: this.projectId,
        //     projectVideoId: this.videoListObj.form.projectVideoId,
        //     type: 1
        //   })
        //   if (syncRes) {
        //     this.$uweb &&
        //     this.$uweb.setAction('Event_clipWork_myProject_onlineEditing')
        //     this.$router.push({
        //       path: `/videoEditor?projectId=${this.projectId}&projectVideoId=${this.videoListObj.form.projectVideoId}&type=1`
        //     })
        //   }
        // } else {
        //   this.$message.error(
        //     '你还未创建云桌面，无法使用在线剪辑操作。请联系IT开通云桌面。'
        //   )
        // }
      }
    },
    // 下载工程
    downloadProject() {
      if (this.downloadPFlag) {
        return
      }
      if (this.checkedNums > 10) {
        this.$message.error('单次工程下载，最多支持10个视频片段')
        return
      }
      const checkArray = []
      this.data.some(item => {
        if (item.checked) {
          checkArray.push(item.partId)
        }
      })
      if (checkArray.length <= 0) {
        this.$message.error('请选择需要下载工程的视频片段！')
        return
      }
      this.downloadProjectObject = {
        downloadId: '',
        partIds: [],
        projectId: '',
        status: 0
      }
      const params = {
        projectId: this.projectId,
        partIds: checkArray
      }
      submitDownloadTask(params).then(res => {
        if (res.success) {
          getPartDownloadTask(this.projectId).then(res => {
            if (res.success) {
              if (res.data !== null) {
                this.downloadProjectObject = res.data
                this.stopDownloadGetUrl = true
                this.downloadFill()
                this.toGetTheloadUrl()
              }
            }
          })
        }
      })
    },
    downloadVideos() {
      const checkArray = []
      this.data.some(item => {
        if (item.checked) {
          checkArray.push(item)
        }
      })
      if (checkArray.length <= 0) {
        this.$message.error('请选择需要下载的视频片段！')
        return
      }
      this.bulkDownload(checkArray)
    },
    downloadFile(url) {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none' // 防止影响页面
      iframe.style.height = 0 // 防止影响页面
      iframe.src = url
      document.body.appendChild(iframe) // 这一行必须，iframe挂在到dom树上才会发请求
      // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
      setTimeout(() => {
        iframe.remove()
      }, 5 * 60 * 1000)
    },
    bulkDownload(urlList) {
      const jsonUrlList = urlList
      for (let i = 0; i < jsonUrlList.length; i++) {
        // 循环遍历调用downloadFile方法
        const url = jsonUrlList[i].videoUrl
        this.downloadFile(url)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-dis {
  padding: 2px 8px;
  line-height: 20px;
  border-radius: 4px;
  opacity: 1;
  background: #00b42a;
  color: #ffffff;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  margin-left: 8px;
  cursor: pointer;
}
body {
  overflow-y: hidden;
}
.tips {
  margin-top: 8px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #d9d9d9;
  line-height: 20px;
}
::v-deep .el-message-box__wrapper {
  .el-button--primary {
    background-color: #f53f3f;
    border-color: #f53f3f;
  }
}
.pageWrap {
  // width: 100%;
  width: calc(100% - 16px);
  height: 100%;
  background-color: skyblue;
  display: flex;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  .projectDetail {
    width: 100%;
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
    .projectDetailForm {
      flex: 1 0 0;
      overflow: auto;
      .detailTitle {
        margin-top: 20px;
        font-size: 20px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #333333;
        line-height: 28px;
      }
      .detailForm {
        margin-top: 16px;
        padding-left: 16px;
        padding-right: 16px;
        .form_item {
          display: flex;
          align-items: center;
          .form_item_label {
            width: 112px;
            text-align: right;
            margin-right: 8px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #777777;
            line-height: 24px;
          }
          .form_item_value {
            width: 240px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #333333;
            line-height: 22px;
          }
        }
        .detailFormRow {
          display: flex;
          margin-bottom: 16px;
        }
      }
      .detailVideoList {
        display: flex;
        flex-wrap: wrap;
        .videoListView {
          width: 283px;
        }
      }
    }
    .projectDetailFooter {
      height: 72px;
      background: #ffffff;
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      .btn_del {
        background: #ffffff;
        color: #f53f3f;
        border-radius: 4px;
        border: 1px solid #f98b8b;
      }
    }
  }
  .videoList {
    border-left: 1px solid #eff2f6;
    width: 400px;
    padding: 20px 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .actionColumn {
      margin-top: 10px;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .actionColumnLeft {
        flex: 1 0 0;
        display: flex;
        align-items: center;
        ::v-deep .el-checkbox__input {
          margin-left: 8px;
        }
        ::v-deep .el-loading-spinner {
          margin-top: -12px;
        }
        .a_link {
          margin-left: 16px;
          font-size: 14px;
        }
        .c_777 {
          color: #777;
        }
      }
      .actionColumnRight {
        display: flex;
        // align-items: center;
        width: 100%;
        overflow: hidden;
        .searchIcon {
          flex: 1 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          .el-icon-search {
            margin-right: 10px;
            cursor: pointer;
          }
          .myinput {
            transition: width 0.2s;
            width: 0;
            overflow: hidden;
          }
          .show {
            width: 220px;
          }
        }
      }
      .shotAction {
        width: 30px;
        margin-top: 2px;
      }
    }
    .list {
      flex: 1 0 0;
      overflow: auto;
      padding-left: 16px;
      padding-right: 16px;
      .list_li {
        margin-top: 15px;
        width: 100%;
        background: #fafcff;
        border-radius: 4px;
        border: 1px solid #fff;
        padding: 8px;
        position: relative;
        .icn_fordownload {
          position: absolute;
          width: 30px;
          height: 30px;
          z-index: 999;
          right: 0;
          top: 0;
          background-image: url(../../../assets/image/video/icn_download.png);
          background-size: 100%;
        }
        .list_header {
          display: flex;
          ::v-deep .el-checkbox:last-of-type {
            margin-top: -1px;
          }
          .list_header_title {
            margin-left: 8px;
            flex: 1 0 0;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            -webkit-box-orient: vertical;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #333333;
            p {
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .status {
            margin-left: 12px;
            width: 68px;
            line-height: 20px;
            text-align: center;
            border-radius: 4px;
            font-size: 12px;
          }
          .status_2 {
            color: #00b42a;
            background: #e6f7ea;
          }
          .status_1 {
            color: #ff7d00;
            background: #fff2e6;
          }
          .status_3 {
            color: #f53f3f;
            background: #feecec;
          }
        }
        .list_time {
          font-size: 12px;
          font-family: MicrosoftYaHei;
          color: #999999;
          line-height: 26px;
          margin-bottom: 8px;
          margin-top: 8px;
          padding-left: 22px;
        }
        .btn_footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .downStatus {
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #333333;
          }
          .btnView {
            display: flex;
            .btn {
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #0c6fff;
              line-height: 22px;
              margin-left: 16px;
            }
            .delete-btn {
              color: #f53f3f;
              cursor: pointer;
            }
            .scz-btn {
              font-size: 12px;
              color: #ff7d00;
            }
            .download-btn {
              color: #0c6fff;
              cursor: pointer;
            }
            .btnDisabled {
              color: #cee2ff;
            }
          }
        }
      }
      .mouseActive {
        border-color: #3c8bff;
      }
    }
    .pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 18px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #999999;
      line-height: 22px;
    }
  }
}
.p-l-r-16 {
  padding-left: 16px;
  padding-right: 16px;
}
.m-t-32 {
  margin-top: 32px;
}
.m-b-12 {
  margin-bottom: 12px;
}
.sticky {
  position: sticky;
}

.video-list-top {
  position: relative;
  width: 100%;
  height: 30px;
  .icn_refresh_btn {
    float: right;
    width: 14px;
    height: 14px;
    margin-left: 2px;
    background-image: url(../../../assets/image/video/icn_refresh.png);
    background-size: 100%;
  }
  .video-list-top-p {
    position: absolute;
    right: 15px;
    top: 3px;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: #0c6fff;
    cursor: pointer;
  }
  .video-list-t-p {
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 5px;
    color: #333;
    font-size: 14px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap;
  }
}

.pd-nodata {
  width: 100%;
  margin: 230px auto 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > img {
    width: 405px;
  }
  > .noDataText {
    margin-top: 10px;
    font-size: 14px;
    color: #919293;
    line-height: 26px;
  }
}
.video-nodata {
  width: 100%;
  margin: 60px auto 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > img {
    width: 405px;
  }
  > .noDataText {
    margin-top: 10px;
    font-size: 14px;
    color: #919293;
    line-height: 26px;
  }
}

.error-tips {
  position: fixed;
  width: 70%;
  height: 54px;
  background: #feecec;
  padding: 15px 20px;
  border-radius: 4px;
  z-index: 9999;
  top: 20px;
  left: 15%;
  color: #f53f3f;
  i {
    margin-right: 10px;
  }
  em {
    float: right;
    color: #777;
    font-size: 14px;
    font-style: normal;
    cursor: pointer;
  }
}

.title-span {
  max-width: 90%;
  float: left;
  height: 20px;
  line-height: 20px;
  margin-right: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
.edit-cls {
  float: left;
  width: 14px;
  height: 14px;
  margin-top: 3px;
  background-image: url(../../../assets/image/video/icn_edit.png);
  background-size: 100%;
  cursor: pointer;
  color: #0c6fff;
}

.title-input {
  float: left;
  width: 413px;
  margin-right: 13px;
}

::v-deep .el-loading-spinner i {
  margin-top: 10px;
}

.show-jied {
  width: 100%;
}
</style>
<style lang="scss">
.del-model {
  .el-message-box__btns {
    .el-button:nth-child(2) {
      background-color: #f53f3f;
      border-color: #f53f3f;
    }
  }
}
</style>
