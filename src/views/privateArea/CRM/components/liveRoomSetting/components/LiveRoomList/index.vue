<template>
  <div>
    <div v-for="(item, index) in items" :key="index" class="copyLiveRoom">
      <div v-if="copyLive.status" class="copyLiveRoomTitle">
        {{ { 1: '正在复制中', 2: '复制完成', 3: '复制失败' }[copyLive.status] }}
      </div>
      <template v-if="copyLive.status === 0">
        <el-form
          :ref="`copyLiveRoomFormRef-${index}`"
          :model="item"
          label-width="92px"
          size="small"
          :rules="rules"
        >
          <el-form-item label="原目录名称">
            <span>{{ item.parentChapterName }}</span>
          </el-form-item>
          <el-form-item
            v-if="item.liveModel === 'PERSON_LIVE'"
            label="真人讲师"
          >
            <span>{{ item.realityTeacherUser | renderTearch }}</span>
          </el-form-item>
          <el-form-item
            v-else-if="item.liveModel === 'AI_LIVE'"
            label="视频讲师"
          >
            {{ item.recordingTeacherName }}
          </el-form-item>
          <el-form-item label="创建人">
            <span>{{ item.createUserName }}</span>
          </el-form-item>
          <el-form-item label="直播类型">
            <div
              :style="{
                color: item.liveModel === 'AI_LIVE' ? '#00B42A' : '#0C6FFF'
              }"
            >
              {{ item.liveModel | getOptionsValue(liveModeOption) }}
            </div>
          </el-form-item>
          <template v-if="item.liveModel === 'PERSON_LIVE'">
            <!-- <el-form-item label="真人讲师">
              <span>{{ form.realityTeacherUser | renderTearch }}</span>
            </el-form-item> -->
          </template>
          <template v-else-if="item.liveModel === 'AI_LIVE'">
            <el-form-item label="视频名称">
              <span class="formValue a_link" @click="gotoVideo(item)">{{
                item.videoName
              }}</span>
              <el-button
                style="margin-left: 10px"
                @click="openChangeVideoConfig(item, index)"
              >
                更换视频
              </el-button>
            </el-form-item>
            <el-form-item label="备课名称">
              <template v-if="item.scriptId">
                <span class="a_link" @click="gotoScript(item)">
                  {{ item.scriptName }}
                </span>
                <el-button
                  style="margin-left: 10px"
                  @click="openChangeVideoConfig(item, index)"
                >
                  更换备课内容
                </el-button>
              </template>
              <template v-else> - </template>
            </el-form-item>
          </template>
          <el-form-item label="直播间名称" prop="name">
            <el-input
              v-model="item.name"
              class="el_input_p40"
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="开播时间" prop="startTime2">
            <el-date-picker
              v-model="item.startTime1"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              style="width: 140px"
              type="date"
              placeholder="选择日期"
            />
            <el-autocomplete
              v-model="item.startTime2"
              clearable
              class="m-l-10"
              style="width: 120px"
              :fetch-suggestions="querySearch"
              placeholder="请输入"
              @blur.stop="handleBlurPlayTime(index)"
              @keyup.enter.native="handleBlurPlayTime(index)"
              @select="item => handleSelect(item, index)"
            />
            <span class="formTips">至少提前5分钟设置好</span>
          </el-form-item>

          <el-form-item label="运营助教" prop="tutorTeacherUser">
            <el-button
              type="primary"
              @click="addAssistant(index)"
            >添加助教({{ item.tutorTeacherUser.length }}/100)</el-button>
            <div>
              <div
                :class="{
                  assessBox: item.tutorTeacherUser.length > 0
                }"
              >
                <el-tag
                  v-for="(tag, index2) in item.tutorTeacherUser"
                  :key="tag.userId"
                  class="remindPersonListView"
                  :closable="!defaultDisabledUser.includes(tag.userId)"
                  @close="delAssistant(tag, index2, index)"
                >{{ tag.nickName }}</el-tag>
              </div>
            </div>
          </el-form-item>

          <el-form-item prop="copyOption">
            <div>需要复制以下内容，请进行勾选</div>
            <el-checkbox-group v-model="item.copyOption">
              <el-checkbox label="isApply">报名设置</el-checkbox>
              <el-checkbox label="isGoods">直播带货</el-checkbox>
              <el-checkbox label="isCoupon">优惠券</el-checkbox>
              <el-checkbox label="isPrizeDraw">抽奖</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Dialog from '@/views/smartSales/privateLive/room/components/Dialog'
import { copyLiveRoomApi } from '@/api/liveRoom/index'
import router from '@/router'
import { getIds } from '@/utils/index'
import { liveModeOption } from '@/views/smartSales/privateLive/room/columns.js'

export default {
  filters: {
    renderTearch(arr) {
      return arr.reduce((pre, next) => {
        next && (pre = `${pre}${pre ? '、' : ''}${next.nickName}`)
        return pre
      }, '')
    }
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    var validateStartTime = (rule, value, callback, index) => {
      this.items[index].starTime =
        this.items[index].startTime1 + ' ' + this.items[index].startTime2
      // 编辑
      if (!this.items[index].startTime1 || !this.items[index].startTime2) {
        return callback('请选择开播时间')
      }
      if (this.items[index].liveModel === 'PERSON_LIVE') {
        // 真人直播
        if (this.items[index].starTime < moment().format('YYYY-MM-DD HH:mm')) {
          return callback('开播时间需要大于当前时间')
        }
        return callback()
      } else if (this.items[index].liveModel === 'AI_LIVE') {
        // 数字直播
        if (moment(this.items[index].starTime).diff(moment(), 'minutes') < 5) {
          return callback('开播时间需要大于当前时间前5分钟')
        }
        return callback()
      } else {
        return callback()
      }
    }

    return {
      liveModeOption,
      copyLive: {
        status: 0, // 当前步骤: 0: 未开始, 1: 进行中，2：已完成，3：复制失败
        progress: 0, // 进度
        logList: []
      },
      restaurants: [],
      rules: {
        startTime2: [
          {
            validator: (rule, value, callback) => {
              this.items.forEach((item, index) => {
                validateStartTime(rule, value, callback, index)
              })
            },
            required: true,
            trigger: 'blur'
          }
        ],
        name: [{ required: true, message: '请输入直播间名称', trigger: 'blur' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 86400000
        }
      },
      defaultDisabledUser: []
    }
  },
  mounted() {
    this.restaurants = this.loadAll()
  },
  methods: {
    openChangeVideoConfig(row, index) {
      Dialog.open({
        type: 'ChangeVideoConfig',
        visible: true,
        form: {
          scriptId: row.scriptId,
          scriptName: row.scriptName,
          videoId: row.videoId,
          videoName: row.videoName
        },
        liveRoomId: row.id,
        success: res => {
          if (res) {
            console.log(res, 'vvvvvv')
            this.items[index].videoId = res.videoId
            this.items[index].videoName = res.videoName
            this.items[index].scriptId = res.scriptId
            this.items[index].scriptName = res.scriptName
            Dialog.close()
          }
        }
      })
    },
    gotoVideo(row) {
      const { href } = router.resolve({
        path: `/privateLive/newMaterialLibrary/newLiveVideo?videoId=${row.videoId}&videoName=${row.videoName}`
      })
      window.open(href, '_blank')
    },
    gotoScript(row) {
      const { href } = router.resolve({
        path: `/privateLive/liveNewScript?videoId=${row.videoId}&coursewareName=${row.scriptName}`
      })
      window.open(href, '_blank')
    },
    async sure(index) {
      try {
        // 使用 Promise 包装表单验证
        const valid = await new Promise(resolve => {
          this.$refs[`copyLiveRoomFormRef-${index}`][0].validate(valid => {
            resolve(valid)
          })
        })

        if (!valid) {
          return false
        }

        this.messageList = []
        const tutorTeacherUserIds = getIds(
          this.items[index].tutorTeacherUser,
          'userId'
        )
        this.loading = true

        const starTime =
          this.items[index].startTime1 +
          ' ' +
          this.items[index].startTime2 +
          ':00'

        const data = {
          liveRoomId: this.items[index].liveRoomId,
          name: this.items[index].name,
          startTime: starTime,
          scriptId: this.items[index].scriptId || undefined,
          videoId: this.items[index].videoId || undefined,
          copyOption: {
            isApply: this.items[index].copyOption.includes('isApply') ? 1 : 0,
            isGoods: this.items[index].copyOption.includes('isGoods') ? 1 : 0,
            isCoupon: this.items[index].copyOption.includes('isCoupon') ? 1 : 0,
            isPrizeDraw: this.items[index].copyOption.includes('isPrizeDraw') ? 1 : 0
          },
          teacherIdList: tutorTeacherUserIds
        }

        // 等待 API 调用完成并返回结果
        const res = await copyLiveRoomApi(data)
        this.loading = false
        return res
      } catch (error) {
        this.loading = false
        return false
      }
    },
    handleSelect(item, index) {
      this.items[index].startTime2 = item.value
      this.$refs[`copyLiveRoomFormRef-${index}`][0] &&
        this.$refs[`copyLiveRoomFormRef-${index}`][0].validateField(
          'startTime2'
        )
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
      const h =
        Math.floor(result / 3600) < 10
          ? '0' + Math.floor(result / 3600)
          : Math.floor(result / 3600)
      const m =
        Math.floor((result / 60) % 60) < 10
          ? '0' + Math.floor((result / 60) % 60)
          : Math.floor((result / 60) % 60)
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
        const total = mss + ss
        console.log(mss, ss, '1231')
        return total
      }
    },
    handleBlurPlayTime(index) {
      const total = this.formatPrTime(this.items[index].startTime2)
      if (total || total === 0) {
        this.items[index].startTime2 = this.getFormatHMS(total * 1000 * 60)
      } else {
        this.items[index].startTime2 = this.getFormatHMS(0)
      }
      return
    },
    volidFormatTime(val) {
      let isValid = true
      if (val.includes(':')) {
        const list = val.split(':')
        list.forEach(item => {
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
    addAssistant(index) {
      const disabledUser = []
      this.items[index].realityTeacherUser.forEach(i => {
        disabledUser.push(i.userId)
      })
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.items[index].tutorTeacherUser,
        disabledUser,
        maxlength: 100,
        success: res => {
          this.items[index].tutorTeacherUser = res.user
        }
      })
    },
    // 点击删除助教
    delAssistant(tag, index2, index) {
      this.items[index].tutorTeacherUser.splice(index2, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.copyLiveRoom {
  max-height: 622px;
  padding: 20px 20px 0 20px;
  .copyLiveRoomTitle {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  }
}
</style>
