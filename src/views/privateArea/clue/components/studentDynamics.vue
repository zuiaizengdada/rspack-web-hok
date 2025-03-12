<template>
  <div class="studentDynamics">
    <!-- 学员动态 -->
    <div class="searchTop">
      <div>日期：</div>
      <el-date-picker
        v-model="search.time"
        :picker-options="pickerOptions"
        size="small"
        style="width: 300px"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="timeChange"
      />
      <div style="margin-left: 10px">动态类型：</div>
      <m-select
        v-model="search.type"
        dict-key="DYNAMIC_STATUS"
        style="width: 200px"
        @change="hanleTypeChange"
      />
    </div>
    <div v-loading="loading" class="studentDynamicsContent">
      <div
        v-if="aiNone && (search.type === 2 || !search.type)"
        class="chatViewBox"
      >
        <div>AI外呼</div>
        <div>尚未拨打AI外呼</div>
      </div>
      <div
        v-if="noteNone && (search.type === 3 || !search.type)"
        class="chatViewBox"
      >
        <div>短信</div>
        <div>尚未发送短信</div>
      </div>
      <div v-for="(item, index) in list" :key="index" class="chatView">
        <div class="chatViewHeader">
          <div>
            {{
              {
                1: item.followRecord && item.followRecord.createTime,
                2: item.clueCallLog && item.clueCallLog.createTime,
                3: item.smsLog && item.smsLog.sendTime,
                5: item.clueEmailDTO&&item.clueEmailDTO.createTime
              }[item.type]
            }}
            <span v-if="item.type === 2">[Ai外呼]</span>
            <span v-if="item.type === 3">[短信]</span>
            <span v-if="item.type === 4">
              <div class="flex flex-middle">
                <img
                  v-if="item.clueCallRecordVo.callStatus == 3"
                  src="@/assets/image/outboundSeats/call-icon.png"
                  alt=""
                />
                <img
                  v-else
                  src="@/assets/image/outboundSeats/call-no-icon.png"
                  alt=""
                />
                <span
                  :style="{
                    color:
                      item.clueCallRecordVo.callStatus == 3
                        ? '#00B42A'
                        : '#F53F3F'
                  }"
                >
                  人工外呼
                </span>
                <span class="name-staff">呼叫员工：{{ item.clueCallRecordVo.callerName }}</span>
              </div>
            </span>
            <span v-if="item.type === 5">[邮件]</span>
          </div>
          <div v-if="item.type === 1">
            跟进人：{{ item.followRecord.followUserName }}
          </div>
          <div v-if="item.type === 3">
            接收状态：{{
              { 1: '未知', 2: '未送达', 3: '已送达' }[item.smsLog.receiveStatus]
            }}
          </div>
          <div v-if="item.type === 4">
            {{
              { 0: '未知', 1: '未接通', 2: '客服接通', 3: '双方接通' }[
                item.clueCallRecordVo.callStatus
              ]
            }}
          </div>
          <div v-if="item.type === 5">
            发送状态：{{
              { 1: '未发生', 2: '已发送'}[
                item.clueEmailDTO.sendStatus
              ]
            }}
          </div>
        </div>
        <div class="chatContent">
          <template v-if="item.type === 1">
            <template v-if="item.followRecord.typeName">
              [{{ item.followRecord.typeName }}]
            </template>
            {{ item.followRecord.content }}
          </template>
          <template v-else-if="item.type === 2">
            <div class="audioPlayBox">
              <div
                v-if="
                  item.clueCallLog.caller || item.clueCallLog.chargedDuration
                "
                class="phoneMsg"
              >
                <div>
                  <span v-show="item.clueCallLog.caller">
                    主叫号码：{{ item.clueCallLog.caller }}
                  </span>
                </div>
                <div>
                  <span v-show="item.clueCallLog.chargedDuration">
                    计费时长：{{ item.clueCallLog.chargedDuration }}
                  </span>
                </div>
              </div>
              <div v-if="!item.clueCallLog.totalDuration">已拨打，未拨通</div>
              <div v-else class="audioPlayViewwarp">
                <div class="audioPlayView">
                  <svg-icon icon-class="音频" class-name="audioIcon" />
                  <span class="audioTime">{{
                    item.clueCallLog.totalDuration | filterTime
                  }}</span>
                </div>
                <svg-icon
                  icon-class="audioPlayBtn"
                  class-name="playBtn"
                  @click="playAudio(item.clueCallLog.recordAddress)"
                />
              </div>
            </div>
          </template>
          <template v-if="item.type === 3">
            {{ item.smsLog.content }}
          </template>
          <template v-if="item.type === 4">
            <div class="list-call-info">
              <div class="item-call">
                <div>主叫外显号码：</div>
                <div>{{ item.clueCallRecordVo.showPhone }}</div>
              </div>
              <template v-if="item.clueCallRecordVo.callStatus == 3">
                <div class="item-call">
                  <div>通话内容：</div>
                  <!-- <div class="audio-call">
                    <div class="audio-callView">
                      <svg-icon icon-class="音频" class-name="audioIcon" />
                      <span class="audioTime">{{
                        item.clueCallRecordVo.totalDuration | filterTime
                      }}</span>
                    </div>
                  </div> -->
                  <svg-icon
                    icon-class="audioPlayBtn"
                    class-name="playBtn"
                    @click="playAudio(item.clueCallRecordVo.fileUrl)"
                  />
                </div>
                <div class="item-call">
                  <div>外呼时长：</div>
                  <div>
                    {{ item.clueCallRecordVo.answerDuration | filterTime }}
                  </div>
                </div>
                <!-- <div class="item-call">
                  <div>计费时长：</div>
                  <div>
                    {{ item.clueCallRecordVo.chargedDuration | filterTime }}
                  </div>
                </div> -->
              </template>
              <div
                v-if="
                  item.clueCallRecordVo.callStatus == 3 ||
                    item.clueCallRecordVo.callStatus == 2
                "
                class="item-call"
              >
                <div>计费时长：</div>
                <div>
                  {{ item.clueCallRecordVo.chargedDuration | filterTime }}
                </div>
              </div>
              <div class="item-call">
                <div>呼叫开始时间：</div>
                <div>{{ item.clueCallRecordVo.startTime }}</div>
              </div>
            </div>
          </template>
          <template v-if="item.type === 5">
            {{ item.clueEmailDTO.content }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userDynamics } from '@/api/privateArea/clue'
import { followStatus } from '../columns'
import moment from 'moment'
import { clueCallRecordList } from '@/api/privateArea/outboundSeats'
export default {
  components: {},
  props: {
    clueId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      followStatus,
      loading: false,
      search: { time: ['', ''] },
      aiNone: false,
      noteNone: false,
      isManualOutboundCall: false,
      list: [
        {
          type: 1,
          obj: {},
          followRecord: {
            content: '',
            createTime: '2023-04-15 ',
            followUserId: '',
            followUserName: '大白',
            type: ''
          }
        }
      ],
      pickerOptions: {
        disabledDate: time => {
          // 先限制今天之前
          if (time.getTime() > Date.now()) {
            return true
          }
          const minTime = moment().subtract(3, 'month').valueOf()
          return time.getTime() < minTime
          // if () {
          // }
          // // eslint-disable-next-line eqeqeq
          // if (this.currentTime) {
          //   // 3个月内
          //   const maxTime = moment(this.currentTime).add(3, 'month').valueOf()
          //   return time.getTime() < minTime || time.getTime() > maxTime
          // }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      },
      manualOutboundCall: []
    }
  },
  mounted() {
    this.getDetail()
    // this.getClueCallRecordList()
  },
  methods: {
    getClueCallRecordList() {
      const time = this.search.time
      clueCallRecordList({
        clueId: this.clueId,
        startDate: time ? time[0] : undefined,
        endDate: time ? time[1] : undefined
      }).then(res => {
        this.manualOutboundCall = res.data || []
        console.log(res)
      })
    },
    getDetail() {
      this.loading = true
      if (!this.clueId) return
      const data = {
        clueId: this.clueId,
        // clueId: '1',
        // clueId: 1,
        type: this.search.type,
        endDate:
          this.search.time && this.search.time[1] ? this.search.time[1] : '',
        startDate:
          this.search.time && this.search.time[0] ? this.search.time[0] : ''
      }
      userDynamics(data)
        .then(res => {
          this.list = res.data
          this.nonePage(res.data)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    nonePage(data = []) {
      this.aiNone = !data.some(item => item.type === 2)
      this.noteNone = !data.some(item => item.type === 3)
    },
    timeChange(val) {
      this.getDetail()
    },
    hanleTypeChange(val) {
      this.getDetail()
    },
    playAudio(src) {
      this.$AppAudio({
        visible: true,
        src
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.studentDynamics {
  .searchTop {
    margin-top: 12px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
  .studentDynamicsContent {
    margin-top: 30px;
    .chatView {
      background: #ffffff;
      border-radius: 6px;
      border: 1px solid #e7e7e7;
      overflow: hidden;
      margin-bottom: 16px;
      .chatViewHeader {
        background: #f2f9ff;
        border-radius: 6px 6px 0px 0px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #777777;
        line-height: 22px;
        padding: 0 20px;
        img {
          width: 14px;
          height: 14px;
          margin-right: 4px;
        }
      }
      .chatContent {
        padding: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
      }
    }
  }
}
.chatViewBox {
  border: 1px solid #e7e7e7;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 16px;
  > div:nth-of-type(1) {
    background: #f2f9ff;
    border-radius: 6px 6px 0px 0px;
    height: 42px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 500;
    color: #777777;
    line-height: 42px;
    padding: 0 20px;
    display: flex;
    align-items: center;
  }
  > div:nth-of-type(2) {
    padding: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
}
.list-call-info {
  .item-call {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 10px;
    .playBtn {
      font-size: 24px;
      font-size: 24px;
      cursor: pointer;
    }
    > div:nth-of-type(1) {
      color: #777777;
    }
    > div:nth-of-type(2) {
      color: #333333;
    }
  }
}
.audioPlayViewwarp {
  display: flex;
  align-items: center;
}
.audioPlayBox {
  // display: flex;
  align-items: center;
  .audioPlayView {
    display: flex;
    height: 36px;
    background: #e7f0ff;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
    padding: 8px 10px;
    .audioIcon {
      width: 20px;
      height: 20px;
      font-size: 20px;
    }
    .audioTime {
      margin-left: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3c8bff;
      line-height: 20px;
    }
  }
  .playBtn {
    width: 24px;
    height: 24px;
    font-size: 24px;
    margin-left: 20px;
    cursor: pointer;
  }
  .phoneMsg {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}
.audio-call {
  height: 36px;
  background: #e7f0ff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  margin-right: 16px;
  padding: 8px 10px;
  .audio-callView {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .audioIcon {
      font-size: 20px;
      margin-right: 16px;
    }
  }
}
.name-staff {
  margin-left: 10px;
  color: #409eff;
}
</style>
