<template>
  <AppDialog
    v-model="visible"
    :title="title"
    width="696px"
    :loading="loading"
    :show-close="false"
    height="auto"
    :append-to-body="true"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="copyLiveRoom overflowOuto">
      <div class="copyLiveRoomTitle">{{ {1: '正在复制中', 2: '复制完成', 3: '复制失败'}[copyLive.status] }}</div>
      <template v-if="copyLive.status === 0">
        <el-form ref="form" label-position="left" :model="form" label-width="92px" size="small" :rules="rules">
          <el-form-item v-if="form.liveModel === 'PERSON_LIVE'" label="真人讲师">
            <span>{{ form.realityTeacherUser | renderTearch }}</span>
          </el-form-item>
          <el-form-item v-else-if="form.liveModel === 'AI_LIVE'" label="视频讲师">
            {{ form.recordingTeacherName }}
          </el-form-item>
          <el-form-item label="创建人">
            <span>{{ form.createUserName }}</span>
          </el-form-item>
          <el-form-item label="直播类型">
            <div class="liveMode" :class="`liveMode${form.liveModel}`">
              <div style="display: flex;align-items: center;">
                <svg-icon class-name="liveModeicon" :icon-class="getOptionsValueByKey('value', 'icon', form.liveModel, liveModeOption)" />
                {{ form.liveModel | getOptionsValue(liveModeOption) }}
              </div>
            </div>
          </el-form-item>
          <template v-if="form.liveModel === 'PERSON_LIVE'">
            <!-- <el-form-item label="真人讲师">
              <span>{{ form.realityTeacherUser | renderTearch }}</span>
            </el-form-item> -->
          </template>
          <template v-else-if="form.liveModel === 'AI_LIVE'">
            <!-- <el-form-item label="视频讲师">
              {{ form.recordingTeacherName }}
            </el-form-item> -->
            <el-form-item label="视频名称">
              <span class="formValue a_link" @click="gotoVideo(form)">{{ form.videoName }}</span>
            </el-form-item>
            <el-form-item label="脚本名称">
              <template v-if="form.scriptId">
                <span class="a_link" @click="gotoScript(form)">
                  {{ form.scriptName }}
                </span>
              </template>
              <template v-else>
                未使用脚本
              </template>
              <!-- {{ form.scriptName || '未使用脚本' }} -->
            </el-form-item>
          </template>
          <el-form-item label="直播间名称" prop="name">
            <el-input v-model="form.name" class="el_input_p40" maxlength="40" show-word-limit />
          </el-form-item>
          <el-form-item label="开播时间" prop="startTime2">
            <el-date-picker
              v-model="form.startTime1"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              style="width: 140px"
              type="date"
              placeholder="选择日期"
            />
            <el-autocomplete
              v-model="form.startTime2"
              clearable
              class="m-l-10"
              style="width: 120px"
              :fetch-suggestions="querySearch"
              placeholder="请输入"
              @blur.stop="handleBlurPlayTime"
              @keyup.enter.native="handleBlurPlayTime"
              @select="handleSelect"
            />
            <span class="formTips">至少提前5分钟设置好</span>
          </el-form-item>

          <el-form-item label="运营助教" prop="tutorTeacherUser">
            <el-button type="primary" @click="addAssistant">添加助教({{ form.tutorTeacherUser.length }}/100)</el-button>
            <div>
              <div :class="{ assessBox: form.tutorTeacherUser.length > 0 }">
                <el-tag
                  v-for="(tag, index) in form.tutorTeacherUser"
                  :key="tag.userId"
                  class="remindPersonListView"
                  :closable="!defaultDisabledUser.includes(tag.userId)"
                  @close="delAssistant(tag, index)"
                >{{ tag.nickName }}</el-tag>
              </div>
            </div>
          </el-form-item>

          <el-form-item prop="copyOption">
            <div>需要复制以下内容，请进行勾选</div>
            <el-checkbox-group v-model="form.copyOption">
              <el-checkbox label="isApply">报名设置</el-checkbox>
              <el-checkbox label="isGoods">直播带货</el-checkbox>
              <el-checkbox label="isCoupon">优惠券</el-checkbox>
              <el-checkbox label="isPrizeDraw">抽奖</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <!-- <div v-for="(item, index) in messageList" :key="index" class="errorMessage">
            {{ item }}
          </div> -->
        </el-form>
      </template>
    </div>

    <div slot="footer" class="exportScriptFooter">
      <el-button size="small" type="primary" :loading="loading" @click="sure">确定</el-button>
      <el-button size="small" :loading="loading" @click="visible = false">取消</el-button>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  getLiveRoomInfo,
  copyLiveRoomApi
} from '@/api/liveRoom/index'
import { liveModeOption } from '../columns.js'
import { getOptionsValueByKey } from '@/filters/index'
import { getIds } from '@/utils/index'
import moment from 'moment'
import router from '@/router'
export default {
  components: {
    AppDialog
  },
  filters: {
    renderTearch(arr) {
      return arr.reduce((pre, next) => {
        next && (pre = `${pre}${pre ? '、' : ''}${next.nickName}`)
        return pre
      }, '')
    }
  },
  data() {
    var validateStartTime = (rule, value, callback) => {
      this.form.starTime = (this.form.startTime1 + ' ' + this.form.startTime2)
      // 编辑
      if (!this.form.startTime1 || !this.form.startTime2) {
        return callback('请选择开播时间')
      }
      if (this.form.liveModel === 'PERSON_LIVE') {
        // 真人直播
        if (this.form.starTime < moment().format('YYYY-MM-DD HH:mm')) {
          return callback('开播时间需要大于当前时间')
        }
        return callback()
      } else if (this.form.liveModel === 'AI_LIVE') {
        // 数字直播
        if (moment(this.form.starTime).diff(moment(), 'minutes') < 5) {
          return callback('开播时间需要大于当前时间前5分钟')
        }
        return callback()
      } else {
        return callback()
      }
    }
    return {
      messageList: [],
      liveModeOption,
      visible: false,
      loading: false,
      title: '复制直播间',
      liveRoomId: '',
      createUserName: '',
      createUserId: '',
      form: {
        liveModel: 'PERSON_LIVE',
        name: '',
        displayMode: 1,
        imgUrl: 'https://hok-o.oss-cn-beijing.aliyuncs.com/live/livePoster.jpg',
        warmUp: 1, // 直播暖场
        warmImg: { // 直播暖场图片
          md5: '', // 文件md5
          url: '', // 文件url
          warmUpMaterialName: '' // 素材名称
        }, // 直播暖场图片
        warmVideo: { // 直播暖场视频url
          md5: '',
          url: '',
          warmUpMaterialName: ''
        }, // 直播暖场视频url
        isWarmUpMaterial: 0, // 上传视频同步到素材库
        startTime: '',
        startTime1: moment().format('YYYY-MM-DD'),
        startTime2: '',
        realityTeacherUser: [],
        tutorTeacherUser: [],
        isShow: false,
        playbackSet: 1,
        recordingTeacherId: '', // 录播讲师ID
        recordingTeacherName: '', // 录播讲师名称
        scriptId: '', // 互动脚本ID
        scriptName: '', // 互动脚本名称
        videoId: '', // 录播视频ID
        videoName: '', // 录播视频名称
        copyOption: ['isApply', 'isGoods', 'isCoupon'],
        isRepeatedViewing: true // 是否重复观看0否1是
      },
      rules: {
        startTime2: [
          { validator: validateStartTime, required: true, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入直播间名称', trigger: 'blur' }
        ]
      },
      success: () => {},
      fail: () => {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 86400000
        }
      },
      restaurants: [],
      copyLive: {
        status: 0, // 当前步骤: 0: 未开始, 1: 进行中，2：已完成，3：复制失败
        progress: 0, // 进度
        logList: []
      },
      top: '114px',
      // 编辑状态下直播中，不能删除的人员userid
      defaultDisabledUser: []
    }
  },
  computed: {
    disabled () {
      return this.loading || this.noMore
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.messageList = []
          this.getDetail()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.restaurants = this.loadAll()
    this.top = Math.abs(window.innerHeight - 740) / 2 + 'px'
  },
  methods: {
    gotoVideo(row) {
      const { href } = router.resolve({
        path: `/live/liveVideo?videoId=${row.videoId}&videoName=${row.videoName}`
      })
      window.open(href, '_blank')
    },
    gotoScript(row) {
      const { href } = router.resolve({
        path: `/live/script?scriptName=${row.scriptName}`
      })
      window.open(href, '_blank')
    },
    getOptionsValueByKey,
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.messageList = []
          const tutorTeacherUserIds = getIds(this.form.tutorTeacherUser, 'userId')
          this.loading = true
          const starTime = this.form.startTime1 + ' ' + this.form.startTime2 + ':00'
          const data = {
            liveRoomId: this.liveRoomId,
            name: this.form.name,
            startTime: starTime,
            copyOption: {
              isApply: this.form.copyOption.includes('isApply') ? 1 : 0,
              isGoods: this.form.copyOption.includes('isGoods') ? 1 : 0,
              isCoupon: this.form.copyOption.includes('isCoupon') ? 1 : 0,
              isPrizeDraw: this.form.copyOption.includes('isPrizeDraw') ? 1 : 0
            },
            teacherIdList: tutorTeacherUserIds
          }
          copyLiveRoomApi(data).then(res => {
            this.loading = false
            this.success && this.success(res)
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 获取详情数据
    getDetail() {
      this.loading = true
      const params = {
        liveRoomId: this.liveRoomId
      }
      getLiveRoomInfo(params).then(res => {
        const realityTeacherUser = []
        const tutorTeacherUser = []
        const defaultDisabledUser = []
        res.data.teacherInfoList.map(v => {
          v.teacherRole === 0 && realityTeacherUser.push({ userId: v.teacherId, nickName: v.teacherName })
          v.teacherRole === 1 && tutorTeacherUser.push({ userId: v.teacherId, nickName: v.teacherName })
          defaultDisabledUser.push(v.teacherId)
        })
        this.form = {
          liveModel: res.data.liveModel,
          displayMode: res.data.displayMode || 1,
          name: res.data.name,
          createUserName: res.data.createUserName,
          imgUrl: res.data.imgUrl || 'https://hok-o.oss-cn-beijing.aliyuncs.com/live/livePoster.jpg',
          warmUp: res.data.warmUp || 1, // 直播暖场
          warmImg: {
            md5: res.data.warmUp === 1 ? res.data.md5 : '',
            url: res.data.warmUp === 1 ? res.data.warmUpUrl : '',
            warmUpMaterialName: res.data.warmUp === 1 ? res.data.warmUpMaterialName : ''
          },
          warmVideo: {
            md5: res.data.warmUp === 2 ? res.data.md5 : '',
            url: res.data.warmUp === 2 ? res.data.warmUpUrl : '',
            warmUpMaterialName: res.data.warmUp === 2 ? res.data.warmUpMaterialName : ''
          },
          isWarmUpMaterial: 0, // 上传视频同步到素材库
          startTime: '',
          startTime1: moment().format('YYYY-MM-DD'),
          startTime2: '',
          realityTeacherUser,
          tutorTeacherUser,
          isShow: res.data.isShow,
          playbackSet: res.data.playbackSet,
          status: res.data.status,
          recordingTeacherId: res.data.liveRoomIntelligentInfo.videoTeacherId, // 录播讲师ID
          recordingTeacherName: res.data.liveRoomIntelligentInfo.videoTeacherName, // 录播讲师名称
          scriptId: res.data.liveRoomIntelligentInfo.scriptId, // 互动脚本ID
          scriptName: res.data.liveRoomIntelligentInfo.scriptName, // 互动脚本名称
          videoId: res.data.liveRoomIntelligentInfo.videoId, // 录播视频ID
          videoName: res.data.liveRoomIntelligentInfo.videoName, // 录播视频名称
          copyOption: ['isApply', 'isGoods', 'isCoupon'],
          isRepeatedViewing: res.data.liveRoomIntelligentInfo.isRepeatedViewing
        }
        console.log(this.form, 'form')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleSelect(item) {
      this.form.startTime2 = item.value
      this.$refs.form && this.$refs.form.validateField('startTime2')
    },
    querySearch(queryString, cb) {
      cb(this.restaurants)
    },
    loadAll() {
      const arr = []
      for (let i = 0; i < 24 * 60 * 60; i = i + 30 * 60) {
        arr.push({ value: this.filtersTime(i) })
      }
      return arr
    },
    // 秒转时分
    filtersTime(val) {
      const result = parseInt(val)
      const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
      return h + ':' + m
    },
    // 时间转秒
    formatPrTime(val) {
      const isValid = this.volidFormatTime(val)
      if (isValid) {
        const list = val.split(':').reverse()
        for (let i = 0; i < list.length; i++) {
          if (!list[i]) {
            list[i] = '00'
          }
        }
        const mss = Number(list[0]) || 0
        const ss = list.length > 1 ? Number(list[1]) * 60 : 0
        // const ms = list.length > 2 ? Number(list[2]) * 3600 : 0
        // const hs = list.length > 3 ? Number(list[3]) * 3600 : 0
        const total = mss + ss
        console.log(mss, ss, '1231')
        return total
      }
    },
    handleBlurPlayTime() {
      const total = this.formatPrTime(this.form.startTime2)
      if (total || total === 0) {
        this.form.startTime2 = this.getFormatHMS(total * 1000 * 60)
      } else {
        this.form.startTime2 = this.getFormatHMS(0)
      }
      // this.$refs.form && this.$refs.form.validateField('startTime2')
      return
      // this.isEditPlayTime = false
    },
    volidFormatTime(val) {
      let isValid = true
      if (val.includes(':')) {
        const list = val.split(':')
        list.forEach((item) => {
          isValid = !isNaN(Number(item))
        })
      } else {
        isValid = !isNaN(Number(val))
      }
      return isValid
    },
    // 接收豪秒的单位
    getFormatHMS(val) {
      return moment.utc(val).format('HH:mm')
    },
    // 点击添加助教
    addAssistant() {
      const disabledUser = []
      this.form.realityTeacherUser.forEach((i) => {
        disabledUser.push(i.userId)
      })
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.tutorTeacherUser,
        disabledUser,
        maxlength: 100,
        success: (res) => {
          this.form.tutorTeacherUser = res.user
        }
      })
    },
    // 点击删除助教
    delAssistant(tag, index) {
      this.form.tutorTeacherUser.splice(index, 1)
    }
  }
}
</script>

<style lang='scss' scoped>
.copyLiveRoom{
  max-height: 622px;
  padding: 20px 20px 0;
  .copyLiveRoomTitle {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  }
}
.formTips {
  margin-left: 10px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 22px;
}
::v-deep {
  .ss-material-box-header-title {
    position: relative;
    width: 100%;
  }
   .el_input_p40 {
    > input {
      padding-right: 45px;
    }
  }
}
.liveMode {
  display: inline-block;
  padding: 0 8px;
  border-radius: 13px;
  font-size: 10px;
  font-family: MicrosoftYaHei;
  height: 24px;
  line-height: 24px;
  .liveTypeicon,.liveModeicon {
    width: 13px;
    height: 13px;
    font-size: 13px;
    margin-right: 4px;
  }
}
.liveModePERSON_LIVE {
  background: #E7F0FF;
  color: #0C6FFF;
}
.liveModeAI_LIVE {
  background: #E6F7EA;
  color: #00B42A;
}
.liveModeDIGITAL_PERSON_LIVE {
  background: #E7F9FF;
  color: #0099FF;
}
.exportScriptFooter {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
}

.logList {
  margin-top: 10px;
  .logListUl {
    padding: 2px 10px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #F5F9FF;
  }
  .logListIcon {
    width: 14px;
  }
  .logListTips {
    padding-left: 10px;
    color: #333333;
    flex: 1 0 0;
  }
  .logListBtn {
    display: flex;
    .logListBtnview {
      color: #0099FF;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
.errorMessage {
  font-size: 16px;
  color: #ff4949;
}
.assessBox {
  margin-top: 16px;
  width: 450px;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
}
.remindPersonListView {
  margin-right: 16px;
  margin-bottom: 16px;
}
</style>
