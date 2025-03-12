<template>
  <div class="schedule-summary-container">
    <el-date-picker
      v-model="search.time"
      type="daterange"
      :picker-options="pickerOptions"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      @change="getList"
      @blur="currentTime = ''"
    />
    <div v-if="items.length" class="schedule-summary-content">
      <el-scrollbar ref="scrollContainer" style="height: 100%">
        <div v-for="item in items" :key="item.scheduleDate" class="schedule-summary-item">
          <div class="item__header">{{ item.scheduleDateText }}</div>
          <div class="item__content">
            <!-- <div v-for="list in item.scheduleDetailDTOList" :key="list.teacherId" class="item-card">
              <div class="item-card__box">
                <div class="item-card__header">
                  <div class="item-card__name">
                    <el-avatar :size="24" src="" />
                    <span class="name">{{ list.teacherName }}</span>
                  </div>
                  <div class="time">
                    {{ list.notifyTime }}
                  </div>
                </div>
                <div class="item-card__tips">
                  {{ list.content }}
                </div>
              </div>
              <div class="item-card__footer">
                <img src="@/assets/image/icon_followUp.png" alt="">
                <span>跟进人：{{ list.followUsers.map(i=>i.userName).join('、') }}</span>
              </div>
            </div> -->
            <div v-for="(list,index) in item.scheduleDetailDTOList" :key="list.teacherId + index" class="card-row">
              <div class="card-col card-col-2" style="font-weight:600;margin-left:80px" :span="2">{{ list.notifyTime + (list.notifyEndTime ? ' - ' + list.notifyEndTime : ' - 20:20') }}</div>
              <div class="card-col card-col-4">{{ list.teacherName }}</div>
              <div class="card-col card-col-6">{{ list.content }}</div>
              <div v-if="list.followUsers.length" class="card-col">
                <div class="item-card__footer">
                  <span>跟进人：{{ list.followUsers.map(i=>i.userName).join('、') }}</span>
                  <img v-if="list.remindFlag" src="~@/assets/image/icon_followUp.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="height:50px" />
      </el-scrollbar>
    </div>
    <template v-else>
      <div class="noData">
        <img src="~@/assets/image/zanwusousuoneirong.png" alt="" />
      </div>
    </template>
  </div>
</template>

<script>
import { scheduleSummary } from '@/api/tearchCenter/index'
import moment from 'moment'
export default {
  data() {
    return {
      search: {
        time: []
      },
      pickerOptions: {
        disabledDate: (time) => {
          // eslint-disable-next-line eqeqeq
          if (this.currentTime != '') {
            // 一年以内
            const one = 30 * 24 * 3600 * 1000
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
      currentTime: '',
      items: [],
      permsList: this.$route.meta.permsList || []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.search.time = [moment().format('YYYY-MM-DD'), moment().add(6, 'day').format('YYYY-MM-DD')]
      this.getList()
    },
    async getList() {
      const { data } = await scheduleSummary({
        searchDateStart: this.search.time && this.search.time[0] || undefined,
        searchDateEnd: this.search.time && this.search.time[1] || undefined
      })
      this.items = data.map(i => {
        return {
          ...i,
          scheduleDateText: moment(i.scheduleDate).format('MM月DD日')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.schedule-summary-container {
  height: calc(100vh - 160px);
  .card-row{
    display: flex;
    margin:  10px 0;
    .el-col{
      text-align: start;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .card-col-2{
      width: 128px;
    }
    .card-col-4{
      width: 186px;
    }
    .card-col-6{
      width: 256px;
    }
  }
  .schedule-summary-content{
    height: calc(100vh - 196px);
    overflow: auto;
    margin-top: 16px;
    .schedule-summary-item{
      display: flex;
      flex-direction: column;
      .item__header{
        width: 100%;
        color: #333333;
        font-weight: bold;
        font-size: 16px;
        border-bottom: 1px solid #EFF2F6;
        padding: 8px 0;
      }
      .item__content{
        // display: flex;
        // flex-wrap: wrap;
        .el-col{
          margin-top: 15px;
        }
        .item-card{
          padding: 10px;
          width: 265px;
          border-radius: 4px;
          background: #F7FBFF;
          margin:  15px 20px 0 0;
          color: #777777;
          font-size: 14px;
          .item-card__box{
            .item-card__header{
              display: flex;
              justify-content: space-between;
              align-items: center;
              .item-card__name{
                display: flex;
                align-items: center;
                .name{
                  margin-left: 8px;
                  font-size: 14px;
                  color: #333333;
                }
              }
              .time{
                color: #333333;
                font-weight: bold;
              }
            }
            .item-card__tips{
              padding:16px 0;
              border-bottom: 1px solid #EFF2F6;
              margin-bottom: 15px;
            }
          }

        }
      }
    }
  }
  .item-card__footer{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img{
      height: 18px;
      width: 18px;
      margin-left:8px ;
    }
  }
  .noData{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
