<!-- 搜索弹窗 -->
<template>
  <el-drawer
    :size="896"
    :visible.sync="searchFlag"
    :before-close="close"
    :with-header="false"
    :wrapper-closable="true"
  >
    <i class="el-icon-close close" @click="close()" />
    <!-- {{ getTimeName() }} -->
    <!-- <span class="quickDate">
      <el-date-picker
        v-model="value"
        type="daterange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        size="mini"
        @input="handleChange"
      /></span> -->
    <div
      v-if="searchFlag && renderContent"
      v-loading="loading"
      class="drawerBody"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="tab in tabList"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        >
          <div class="tab-content">
            <drawerTop
              v-if="activeName === tab.name"
              ref="drawerTop"
              :type="tab.type"
              @search="drawerSearch"
            />
            <!-- <div class="search-result">
              共<span style="color: #0c6fff">{{ total }}</span>个搜索结果
            </div> -->
            <div v-if="tableList !== null && tableList.length">
              <div
                v-if="type === '1' || config.subtitle === ''"
                class="search-content overflowOuto"
              >
                <div
                  v-for="(item, index) in tableList"
                  :key="index"
                  class="search-content-item flex flex-middle flex-between"
                >
                  <div class="flex flex-column">
                    <span
                      v-if="item.projectName"
                      class="item-title"
                      v-html="filterProjectName(item.projectName)"
                    />
                    <span class="item-details flex">
                      <!-- <span>创建时间：{{ item.createTime }}</span> -->
                      <span>IP：{{ item.teacherName || '--' }}</span>
                    </span>
                  </div>
                  <div>
                    <el-button size="mini" @click="checkSemiDetail(item)"
                      >查看脱敏详情</el-button
                    >
                    <el-button
                      v-if="activeName === 'ClipWorkMyProject'"
                      type="primary"
                      plain
                      size="mini"
                      @click="gotoSubitleEditor(item)"
                      >在线剪辑</el-button
                    >
                    <el-button
                      v-else
                      type="primary"
                      plain
                      size="mini"
                      @click="scproject(item)"
                      >生成自己的专属工程</el-button
                    >
                  </div>
                </div>
              </div>
              <div
                v-if="type === '2' && config.subtitle !== ''"
                :ref="`${activeName}contentScroll`"
                v-infinite-scroll="load"
                class="search-content overflowOuto"
                :infinite-scroll-disabled="disabled"
                @scroll="wctchScroll"
              >
                <div
                  v-for="(item, index) in tableList"
                  :key="index"
                  class="search-keywords-item flex flex-column"
                >
                  <!-- 工程名头部 -->
                  <div class="keywords-title flex flex-between flex-middle">
                    <span class="keywords-title-name">{{
                      item.projectName
                    }}</span>
                    <span class="keywords-time">
                      <el-button
                        size="mini"
                        type="primary"
                        plain
                        @click="checkSemiDetail(item)"
                        >查看脱敏详情</el-button
                      >
                      <el-button
                        v-if="activeName !== 'ClipWorkMyProject'"
                        type="primary"
                        plain
                        size="mini"
                        @click="scproject(item)"
                        >生成自己的专属工程</el-button
                      >
                      <!-- <span>创建时间：{{ item.createTime }}</span> -->
                      <span style="margin-left: 12px"
                        >IP：{{ item.teacherName || '--' }}</span
                      >
                    </span>
                  </div>
                  <!-- 视频内容 -->
                  <div
                    v-for="(ele, ind) in item.videoListDtos"
                    :key="ind"
                    class="keywords-video-content flex flex-column"
                  >
                    <!-- 视频名称及操作区 -->
                    <div class="flex flex-between flex-middle">
                      <span class="keywords-video-title">{{ ele.name }}</span>
                      <span>
                        <el-button size="mini" @click="playVideo(ele)"
                          >预览</el-button
                        >
                        <el-button
                          v-if="activeName === 'ClipWorkMyProject'"
                          type="primary"
                          plain
                          size="mini"
                          @click="gotoSubitleEditor(item, ele)"
                          >在线剪辑</el-button
                        >
                      </span>
                    </div>
                    <!-- 字幕区域 -->
                    <div style="margin-top: 12px" class="keywords-captions">
                      <el-tooltip
                        placement="bottom-start"
                        effect="light"
                        :visible-arrow="false"
                        :disabled="disabledStr(ele.list)"
                        popper-class="captionsContent"
                      >
                        <div slot="content">
                          <span v-html="filterStr(ele.list)" />
                        </div>
                        <span
                          class="text_hidden_3"
                          v-html="filterStr(ele.list)"
                        />
                      </el-tooltip>
                    </div>
                  </div>
                </div>
                <p v-if="config.pid === null && isBacktop" class="nomore">
                  没有更多了...
                </p>
                <div v-if="isBacktop" class="backtop" @click="backtop">
                  <img
                    class="img-icon"
                    src="@/assets/image/aigc/go-bottom.png"
                    alt=""
                  />
                  <img
                    class="img-icon-select"
                    src="@/assets/image/aigc/go-bottom-select.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div v-else style="margin-top: 30%">
              <el-empty :image-size="70" description="暂无数据" />
            </div>
            <!-- <div class="pagination">
              <el-pagination
                :current-page="config.pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="config.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div> -->
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      class="dialog-mask"
      :visible.sync="updateQryGroupFlag"
      :close-on-click-modal="false"
      :show-close="false"
      :append-to-body="true"
    >
      <p class="title-p"><i class="icn_checked" /> 专属工程已生成！</p>
      <el-form :model="videoGroupForm">
        <el-form-item label="设置分组：" :label-width="formLabelWidth">
          <el-cascader
            v-model="videoGroupForm.groupId"
            :options="options"
            :props="{ checkStrictly: true }"
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sureTosc(1)">确定</el-button>
        <el-button
          v-permission="['web:clipWork:editing', permsList]"
          type="primary"
          @click="sureTosc(2)"
          >在线剪辑</el-button
        >
      </div>
    </el-dialog>
  </el-drawer>
</template>

<script>
import { DateFormat } from '@/utils/index'
import drawerTop from './drawerTop'
import {
  setMaterialGenrate,
  checkGenerateProject,
  searchQryGroup,
  qryDesensitizedSubtitleList,
  updateGroup,
  setShareGenrate
} from '@/api/videoManagement/clipWork'
import { userCloudPc } from '@/api/videoManagement/cloudDesktop'
import { quickDateList } from './constants'
import moment from 'moment'
export default {
  components: {
    drawerTop
  },
  props: {
    accountInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      value: quickDateList[1].value,
      searchFlag: false,
      isBacktop: false,
      loading: false,
      videoGroupForm: {},
      type: '1',
      options: [],
      renderContent: false,
      tableList: [],
      formLabelWidth: '80px',
      permsList: this.$route.meta.permsList || [],
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.cuttentTime = minDate.getTime()
          if (maxDate) {
            this.cuttentTime = ''
          }
        },
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [date, date])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ],
        disabledDate: time => {
          // return time.getTime() > Date.now()
          if (time.getTime() > Date.now()) {
            return true
          }
          if (this.cuttentTime !== '') {
            const one = 30 * 6 * 24 * 3600 * 1000
            const minTime = this.cuttentTime - one
            const maxTime = this.cuttentTime + one
            return time.getTime() < minTime || time.getTime() > maxTime // 选择日期范围为一个月
          }
        }
      },
      tabList: [
        {
          label: '我的工程',
          name: 'ClipWorkMyProject',
          timeName: '工程创建时间：',
          type: 1
        },
        {
          label: '我的素材',
          name: 'ClipWorkMyMaterial',
          timeName: '视频组创建时间：',
          type: 2
        },
        {
          label: '共享给我',
          name: 'ClipWorkShared',
          timeName: '工程创建时间：',
          type: 3
        }
      ],
      config: {
        teacherId: '',
        subtitle: '',
        sceneId: '',
        name: '',
        pid: ''
      },
      updateQryGroupFlag: false,
      activeName: 'ClipWorkMyProject',
      currentPage: 1,
      total: 0,
      pageSize: 10
    }
  },
  computed: {
    disabled() {
      return this.loading || this.noMore
    }
  },
  methods: {
    DateFormat,
    disabledStr(list) {
      let str = ''
      list.forEach(item => {
        str += item.content
      })
      if (str.length > 150) {
        return false
      } else {
        return true
      }
    },
    load() {
      console.log('无限滚动')
      if (this.config.pid !== null) {
        this.getList()
      }
    },
    wctchScroll(e) {
      console.log(e, '滚动事件')
      const scrollTop = e.target.scrollTop
      const scrollHeight = e.target.scrollHeight
      const clientHeight = e.target.clientHeight
      if (scrollTop + clientHeight > scrollHeight) {
        this.isBacktop = false
      } else {
        if (scrollTop < 100) {
          this.isBacktop = false
        } else {
          this.isBacktop = true
        }
      }
    },
    backtop() {
      this.$nextTick(() => {
        const srcollE = this.$refs[`${this.activeName}contentScroll`]
        const params = {
          top: 0,
          behavior: 'smooth'
        }
        srcollE.forEach(item => {
          this.isBacktop = false
          item.scrollTo(params)
        })
      })
    },
    getTimeName() {
      for (const tab of this.tabList) {
        if (tab.name === this.activeName) {
          return tab.timeName
        }
      }
      return null // 如果没有找到匹配的 timeName，返回 null
    },
    sureTosc(type) {
      const params = {
        projectId: this.toOnlineCheck,
        groupId:
          this.videoGroupForm.groupId && this.videoGroupForm.groupId.length > 0
            ? this.videoGroupForm.groupId[
                this.videoGroupForm.groupId.length - 1
              ]
            : 0,
        type: 2
      }
      updateGroup(params).then(async res => {
        console.log('dddddddddssssssssssssss: ', res)
        if (res.success) {
          // this.$message.success('分组设置成功！')
          this.updateQryGroupFlag = false
          if (type === 1) {
            // this.$emit('handerTab', 'ClipWorkMyProject')
            this.$message.success('专属工程已生成！')
            this.updateQryGroupFlag = false
          } else if (type === 2) {
            this.$router.push({
              path: `/videoEditor?projectId=${this.toOnlineCheck}&type=2`
            })
            // const res = await userCloudPc()
            // const ecsStatus = res.data?.ecsStatus
            // if (ecsStatus) {
            //   // 检测是否是否需要同步数据且今天已经同步过了
            //   const syncRes = await this.$store.dispatch(
            //     'videoManage/syncCheck',
            //     {}
            //   )
            //   if (syncRes) {
            //     this.$router.push({
            //       path: `/videoEditor?projectId=${this.toOnlineCheck}&type=2`
            //     })
            //   }
            // } else {
            //   this.$message.error(
            //     '你还未创建云桌面，无法使用在线剪辑操作。请联系IT开通云桌面。'
            //   )
            // }
            // this.$router.push({ path: `/videoEditor?projectId=${this.toOnlineCheck}` })
            // const toTaskLog = this.$router.resolve({ path: `/videoEditor?projectId=${this.toOnlineCheck}` })
            // window.open(toTaskLog.href, '_blank')
          }
        }
      })
    },
    drawerSearch(obj) {
      console.log(obj, 'obj')
      this.config.pid = ''
      if (obj.select === '1') {
        this.config.name = obj.input3
        this.config.subtitle = ''
      } else {
        this.config.subtitle = obj.input3
        this.config.name = ''
      }
      this.config.teacherId = obj.teacherId
      this.config.sceneId = obj.sceneId
      this.type = obj.select
      this.tableList = []
      this.getList()
    },
    checkSemiDetail(row) {
      console.log(row, '脱敏详情row')
      const toTaskLog = this.$router.resolve({
        path: `/showSemiVideoDetail/${row.projectId}?videoType=${
          this.activeName === 'ClipWorkMyMaterial' ? 2 : 1
        }&videoGroupName=${row.projectName}`
      })
      window.open(toTaskLog.href, '_blank')
    },
    playVideo(obj) {
      console.log(obj, 'yulan')
      const arr = []
      obj.list.forEach(item => {
        arr.push({
          time: item.startTime / 1000,
          duration: (item.endTime - item.startTime) / 1000,
          style: {
            background: '#FF7D00'
          }
        })
      })
      this.$Videoplayer({
        src: obj.url,
        videoName: obj.name,
        videoId: obj.projectVideoId,
        videoType: this.activeName === 'ClipWorkMyMaterial' ? 1 : 2,
        progressDot: arr
      })
    },
    filterProjectName(name) {
      const keyWords = this.config.name
      let str = '...'
      const regex = new RegExp(keyWords, 'g')
      str = name.replace(
        regex,
        '<span style="color: #0C6FFF;">' + keyWords + '</span>'
      )
      return str
    },
    show(name) {
      this.activeName = name
      this.renderContent = true
      this.searchFlag = true
      this.getList()
    },
    handleChange(val) {
      let list = []
      if (val) {
        list = [
          moment(val[0]).format('YYYY-MM-DD'),
          moment(val[1]).format('YYYY-MM-DD')
        ]
      } else {
        list = quickDateList[1].value
        this.value = quickDateList[1].value
      }
      this.value = list
      this.getList()
    },
    // 点击跳转在线剪辑工作台
    async gotoSubitleEditor(row, ele) {
      console.log(row, '在线剪辑row')
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'operationOnlineEditing'
      )
      if (!res) {
        this.$uweb &&
          this.$uweb.setAction('Event_clipWork_myProject_onlineEditing')
        const toTaskLog = this.$router.resolve({
          path: `/videoEditor?projectId=${row.projectId}&projectVideoId=${
            ele?.projectVideoId || ''
          }&type=1`
        })
        window.open(toTaskLog.href, '_blank')
        // const res = await userCloudPc()
        // const ecsStatus = res.data?.ecsStatus
        // // 环境变量是dev的时候可以直接进去
        // if (ecsStatus || process.env.NODE_ENV === 'development') {
        //   // 检测是否是否需要同步数据且今天已经同步过了
        //   const syncRes = await this.$store.dispatch(
        //     'videoManage/syncCheck',
        //     {}
        //   )
        //   if (syncRes) {
        //     this.$uweb &&
        //       this.$uweb.setAction('Event_clipWork_myProject_onlineEditing')
        //     const toTaskLog = this.$router.resolve({
        //       path: `/videoEditor?projectId=${row.projectId}&projectVideoId=${
        //         ele?.projectVideoId || ''
        //       }&type=1`
        //     })
        //     window.open(toTaskLog.href, '_blank')
        //   }
        // } else {
        //   this.$message.error(
        //     '你还未创建云桌面，无法使用在线剪辑操作。请联系IT开通云桌面。'
        //   )
        // }
      }
    },
    async getList() {
      this.loading = true
      const params = {
        ...this.config,
        type: this.tabList.find(item => item.name === this.activeName).type
      }
      // if (this.value.length > 0) {
      //   params.startTime = this.value[0]
      //   params.endTime = this.value[1]
      // }
      const res = await qryDesensitizedSubtitleList(params)
      this.config.pid = res.data.pid
      if (res.data.list === null && res.data.pid !== null) {
        this.getList()
        return
      }
      this.tableList = [...this.tableList, ...(res.data.list || [])]
      this.loading = false
    },
    filterStr(list) {
      console.log(list, 'list')
      const keyWords = this.config.subtitle
      let str = '...'
      let strArr = list.map(item => {
        return item.content
      })
      strArr = strArr.map(item => {
        // 匹配keyWords带关键词的文字变红
        const regex = new RegExp(keyWords, 'g')
        return item.replace(
          regex,
          '<span style="color: #0C6FFF;">' + keyWords + '</span>'
        )
      })
      strArr.forEach(item => {
        str += item + '...'
      })
      return str
    },
    teacherNameFormatTips(row) {
      let txt = `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">工程重复生成提醒</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">`
      if (row.teacherName) {
        txt += `【${row.teacherName}】的`
      }
      return `${txt}【${row.projectName}】已存在，是否继续生成？</div><div style="margin-top: 16px;color: #999;line-height: 22px;font-size: 12px;">如果继续，将会生成多份相同工程，请做好工程管理，避免混乱。</div>`
    },
    async scproject(row) {
      console.log(row, 'row')
      const res = await this.$store.dispatch(
        'user/viewingFlag',
        'operationOnlineClip'
      )
      if (!res) {
        this.$uweb && this.$uweb.setAction('Event_clipWork_create')
        this.loadGroupData()
        const searchParam = {
          projectId: row.projectId,
          type: this.activeName === 'ClipWorkShared' ? 2 : 1
        }
        checkGenerateProject(searchParam).then(res => {
          if (res.code === 1 && !res.data) {
            this.$delModal({
              width: '505px',
              tips: this.teacherNameFormatTips(row),
              success: () => {
                const params = {
                  projectId: row.projectId,
                  teacherId: row.teacherId
                }
                if (this.activeName === 'ClipWorkShared') {
                  setShareGenrate(params).then(res => {
                    console.log(res)
                    if (res.success) {
                      this.updateQryGroupFlag = true
                      this.toOnlineCheck = res.data
                    }
                  })
                } else {
                  setMaterialGenrate(params).then(res => {
                    console.log(res)
                    if (res.success) {
                      this.updateQryGroupFlag = true
                      this.toOnlineCheck = res.data
                    }
                  })
                }
              }
            })
          } else {
            const params = {
              projectId: row.projectId,
              teacherId: row.teacherId
            }
            if (this.activeName === 'ClipWorkShared') {
              setShareGenrate(params).then(res => {
                console.log(res)
                if (res.success) {
                  this.updateQryGroupFlag = true
                  this.toOnlineCheck = res.data
                }
              })
            } else {
              setMaterialGenrate(params).then(res => {
                console.log(res)
                if (res.success) {
                  this.updateQryGroupFlag = true
                  this.toOnlineCheck = res.data
                }
              })
            }
          }
        })
      }
    },
    loadGroupData() {
      searchQryGroup().then(res => {
        this.options = res.data
        this.changeData(this.options)
      })
    },
    changeData(array) {
      array.some(item => {
        item.value = item.groupId
        item.label = item.groupName
        if (item.childrenList && item.childrenList.length > 0) {
          item.children = item.childrenList
        }

        if (item.children && item.children.length > 0) {
          this.changeData(item.children)
        }
      })
    },
    close() {
      console.log('触发')
      // this.$refs.drawerTop.clearTeacher()
      // 触发drawerTop里面清空讲师列表的方法
      this.$refs.drawerTop.forEach(item => {
        console.log(item, 'item')
        item.clearTeacher()
      })
      this.renderContent = false
      this.config = {
        teacherId: '',
        subtitle: '',
        sceneId: '',
        name: ''
      }
      this.tableList = []
      this.type = '1'
      this.searchFlag = false
      this.$emit('close')
    },
    handleClick(tab, event) {
      this.config = {
        teacherId: '',
        subtitle: '',
        sceneId: '',
        name: ''
      }
      console.log(this.$refs.drawerTop)
      this.$refs.drawerTop.forEach(item => {
        item.clearTopSearch()
      })
      this.value = quickDateList[1].value
      this.currentPage = 1
      this.tableList = []
      this.type = '1'
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.captionsContent {
  max-height: 300px;
  line-height: 22px;
  box-shadow: 0px 4px 12px 0px rgba(22, 22, 22, 0.25);
  letter-spacing: 1px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 4px;
    height: 6px;
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
}
</style>

<style lang="scss" scoped>
.nomore {
  width: 100%;
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}
.title-p {
  width: 100%;
  height: 32px;
  line-height: 32px;
  font-size: 16px;
  font-weight: bold;
  color: #00b42a;
  margin-top: -25px;
  margin-bottom: 25px;
  .icn_checked {
    float: left;
    width: 16px;
    height: 16px;
    margin-top: 8px;
    margin-right: 8px;
    background-image: url(../../../../assets/image/video/icn_checked.png);
    background-size: 100%;
  }
}
.quickDate {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  margin-right: 12px;
  position: absolute;
  top: 4px;
  right: 28px;
  z-index: 1000;
}
.backtop {
  position: sticky;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  bottom: 8%;
  left: 93.8%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #e0e4e6;
  box-shadow: 0px 0px 6px 0px rgba(21, 36, 67, 0.1);
  transition: all 0.3s;
  .img-icon {
    width: 24px;
    height: 24px;
    transform: rotate(180deg);
  }
  .img-icon-select {
    display: none;
    width: 24px;
    height: 24px;
    transform: rotate(180deg);
  }
  &:hover {
    background: #1778ff;
    .img-icon {
      display: none;
    }
    .img-icon-select {
      display: block;
    }
  }
}
.close {
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;
  z-index: 1000;
}
.search-result {
  font-size: 12px;
  font-weight: 400;
  color: #333333;
  margin-top: 14px;
}
.tab-content {
  height: 100%;
  padding: 20px 20px 62px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.search-content {
  margin-top: 20px;
  height: 80vh;
}
.search-keywords-item {
  width: 100%;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #d8dce6;
  margin-bottom: 20px;
  .keywords-video-content {
    margin: 20px 20px 0 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;
    .keywords-captions {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
    }
    .keywords-video-title {
      font-size: 14px;
      font-weight: 500;
      color: #333333;
    }
  }
  .keywords-title {
    width: 100%;
    height: 50px;
    background: #e7f0ff;
    border-radius: 4px 4px 0px 0px;
    padding: 0 20px;
    box-sizing: border-box;
    .keywords-time {
      font-size: 14px;
      font-weight: 400;
      color: #777777;
    }
    .keywords-title-name {
      font-size: 16px;
      font-weight: 500;
      color: #333333;
    }
  }
}
.search-content-item {
  width: 100%;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #d8dce6;
  padding: 14px 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
  .item-title {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
  }
  .item-details {
    font-size: 14px;
    font-weight: 400;
    color: #777777;
    margin-top: 8px;
  }
}
::v-deep .el-tabs__nav-scroll {
  padding-left: 16px;
  box-sizing: border-box;
}
.drawerBody {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    background: #ffffff;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #f2f2f2;
    color: #353535;
    font-size: 16px;
    font-weight: bold;
    .ss-material-box-header-title {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .logging_content {
    padding: 20px;
    box-sizing: border-box;
    .mt-30 {
      margin-top: 30px;
    }
  }
  .account_info {
    width: 100%;
    padding: 16px;
    background: #f5f9ff;
    border-radius: 8px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    .mb-10 {
      margin-bottom: 10px;
    }
    .title1 {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #777777;
    }
  }
}
.dialog-mask {
  ::v-deep .el-dialog {
    height: 250px;
    margin-top: calc(50% - 125px);
    border-radius: 10px;
    z-index: 2100;
  }
}

::v-deep .el-dialog__wrapper {
  display: flex;
  padding: 24px;
  .el-dialog {
    margin: auto !important;
  }
}
.pagination {
  width: 860px;
  height: 62px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: fixed;
  bottom: 0;
  right: 20px;
}
</style>
