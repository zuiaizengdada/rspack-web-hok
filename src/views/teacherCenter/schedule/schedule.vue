<template>
  <!-- 日历组件 -->
  <div class="calendarList">
    <div class="weekBox">
      <span v-for="item in weekStr" :key="item" class="weekItem">
        <span>{{ item }}</span>
      </span>
    </div>
    <div v-loading="loading" class="dayBox">
      <span
        v-for="(item, index) in arr"
        :key="index"
        class="dayItem"
        :style="{
          backgroundColor:data[index] && data[index].backgroundColor?data[index].backgroundColor:'#fff'
        }"
      >
        <!-- 当前时间的数据 -->
        <div class="day" :class="myDateDay(item, index)">
          <!-- 阳历数据 -->
          <span class="dayText">
            {{ item.time.cDay }}
          </span>
          <!-- 阴历数据 -->
          <span class="textValue m-r-10">
            {{ item.time.IDayCn === '初一' ? item.time.IMonthCn : item.time.IDayCn }}
          </span>
          <span class="festival">
            <!-- 阴历节日 -->
            <el-tag v-if="item.time.TFestival" size="mini">
              {{ item.time.TFestival }}
            </el-tag>
            <!-- 阳历节日 -->
            <el-tag v-if="item.time.VFestival" size="mini">
              {{ item.time.VFestival }}
            </el-tag>
          </span>
        </div>
        <div
          class="plan"
          @click="openSetting(item, data[index])"
          @mouseenter="mouseIndex = index"
          @mouseleave="mouseIndex = -1"
        >
          <template v-if="mouseIndex === index">
            <div
              v-if="
                data[index] &&
                  data[index].scheduleItem &&
                  data[index].scheduleItem.length === 0
              "
              class="plan_bianji"
            >
              <svg-icon v-if="permsList.includes('web:schedule:edit')" icon-class="bianji" class="plan_bianji_icon" />
            </div>
          </template>

          <!-- 计划/编辑 -->
          <el-popover
            v-if="data[index] && data[index].scheduleItem && data[index].scheduleItem.length > 0"
            placement="right"
            width="286"
            trigger="hover"
          >
            <div class="planDetailBox overflowOuto">
              <div v-for="(e, i) in data[index].scheduleItem" :key="i" class="planDetail">
                <div>
                  <span>{{ e.notifyTime + (e.notifyEndTime ? '-' + e.notifyEndTime : '') }}</span>
                  <span> {{ e.content }}</span>
                  <svg-icon
                    v-if="data[index].scheduleItem[i].remindFlag"
                    icon-class="tixing"
                    style="font-size: 18px; margin-left: 8px"
                  />
                </div>
                <div v-if="e.followUsers.length > 0">
                  跟进人:
                  <span v-for="followUser in e.followUsers" :key="followUser.userId">
                    {{ followUser.userName }}
                  </span>
                </div>
              </div>
            </div>
            <div slot="reference" class="planBox">
              <div v-for="(e, i) in data[index].scheduleItem" :key="i" class="planItem text_hidden_1">
                <template v-if="i < 3">
                  <span>{{ e.notifyTime + (e.notifyEndTime ? '-' + e.notifyEndTime : '') }}</span>
                  {{ e.content }}
                </template>
              </div>
            </div>
          </el-popover>
        </div>
      </span>
    </div>
    <!-- 排期侧边栏 -->
    <schedulingDrawer :config="schedulingConfig" @success="$emit('success')" />
  </div>
</template>

<script>
import calendar from '@/assets/js/date.js'
import schedulingDrawer from './schedulingDrawer.vue'
import { getScheduleList } from '@/api/tearchCenter/index'
import { dateFormat, getDays, firstWeek, prevMonthDays } from '@/assets/js/time.js'
export default {
  components: {
    schedulingDrawer
  },
  props: {
    teacherId: {
      type: String,
      default: ''
    },
    teacherName: {
      type: String,
      default: ''
    }
  },
  data() {
    const date = new Date()
    const cYear = date.getFullYear()
    // 因为系统上的月份1-12分别为0-11,所以输出时应+1显示
    const cMonth = date.getMonth() + 1
    const cDay = date.getDate()
    return {
      loading: false,
      message: '',
      myAlertVisible: false,
      weekStr: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      arr: [], // 日历列表
      time: {
        // 当前展示的时间: "2020-11"
        cMonth: cMonth < 10 ? '0' + cMonth : cMonth,
        cYear
      },
      active: '',
      today: {
        // 今日，用来还原
        cDay,
        cMonth,
        cYear
      },
      data: [], // 数据,共42个对象，
      // 新增/编辑排期弹框
      schedulingConfig: {
        visible: false,
        title: '新增排期',
        type: 1, // 1新增 2编辑
        form: {
          backgroundColor: '', // 背景颜色
          scheduleItem: [], // 日程事项
          scheduleDate: '', // 日期
          teacherId: '', // 教师id
          teacherName: '' // 教师名称
        }
      },
      permsList: this.$route.meta.permsList || [],
      mouseIndex: -1 // 鼠标移入的下标
    }
  },
  created() {
    var date = new Date()
    // 绘制当月日历表
    this.dataPrint(date)
  },
  mounted() {

  },
  methods: {
    changeMonth(item) {
      if (item) {
        const arr = item.split('-')
        const cYear = Number(arr[0])
        const cMonth = arr[1]
        this.time = { cYear, cMonth }
        console.log(this.time, 'time')
        this.dataPrint(new Date(item))
      } else {
        // 为null则重置为当前时间
        const date = new Date()
        const cYear = date.getFullYear()
        const cMonth = date.getMonth() + 1
        this.time = {
          cMonth: cMonth < 10 ? '0' + cMonth : cMonth,
          cYear
        }

        var ctime = cYear + '-' + cMonth
        this.dataPrint(new Date(ctime))
      }
    },
    // 日历表类目判断逻辑
    myDateDay: function (item, index) {
      // 判断是否上个月
      const d = this.time.cYear === item.time.cYear && Number(this.time.cMonth) === Number(item.time.cMonth)
      const lastYear = !d // 判断是否非当月
      // 判断是否今天
      const today = item.time.isToday
      // 判断大于等于小于今天
      const todayTime = this.today.cYear + '-' + this.today.cMonth + '-' + this.today.cDay
      const currentTime = item.time.cYear + '-' + item.time.cMonth + '-' + item.time.cDay
      const diffToday = new Date(todayTime).getTime() - new Date(currentTime).getTime()
      const ltToday = new Date(todayTime).getTime() - new Date(currentTime).getTime() > 0
      return {
        lastYear,
        today,
        diffToday,
        ltToday
      }
    },
    // 显示时间
    myHour() {
      // 获取当前系统的时间
      var date = new Date()
      // 根据所传入的当前系统时间和"hh:msa:ss"调用date.js文件中的dateFormat()函数
      var str = dateFormat(date, 'hh:msa:ss')
      console.log(str)
    },
    // 打印当前时间所代表的日历
    dataPrint(date) {
      var arr = []
      // //根据所传入的时间和"yyyy年mm月"time.js文件中的getDays()函数
      // var str = dateFormat(date, "yyyy年mm月");
      // 获取当前月
      // time.js文件中的getDays()函数,获取当月有多少天
      var date1 = getDays(date)
      // time.js文件中的firstWeek()函数,获取当月的第一天是星期几
      var date2 = firstWeek(date)
      // time.js文件中的prevMonthDays()函数,获取当月的上一个月总共有多少天
      var date3 = prevMonthDays(date)

      // 第一行的第一个格子所代表的日期为上一个月结束,才开始填入这个月的日期
      for (var i = date3 - date2 + 1; i <= date3; i++) {
        // 获取一个临时的时间,传入当前的上一个月的日期
        var nextDate1 = new Date(date.getFullYear(), date.getMonth() - 1, i)
        // 获取当前日期的阴历
        var char1 = calendar.solar2lunar(nextDate1)
        // 我是用一个li标签套着2个上下排列的p标签,分别显示日期和阴历,且阴历时间只截取最后2个字
        arr.push({
          time: char1
        })
      }

      // 开始填入当前月份的日期,直接从1,循环到当月的最后一天即可
      // eslint-disable-next-line no-redeclare
      for (let i = 1; i <= date1; i++) {
        // 获取一个临时的时间,传入当前的日期
        var nextDate2 = new Date(date.getFullYear(), date.getMonth(), i)
        // 获取当前日期的阴历
        var char2 = calendar.solar2lunar(nextDate2)
        arr.push({
          time: char2
        })
      }

      // 开始填入剩下空格的日期,即下一个月,从1号开始,到总共有42个格,减去当月的天数-当月第一天星期几
      for (let i = 1; i <= 42 - date1 - date2; i++) {
        // 获取一个临时的时间,传入当前的下一个月日期
        var nextDate = new Date(date.getFullYear(), date.getMonth() + 1, i)
        // 获取当前日期的阴历
        var char = calendar.solar2lunar(nextDate)
        arr.push({
          time: char
        })
      }
      this.arr = arr

      // 请求展示数据
      this.getListData()
    },
    // 请求展示数据
    getListData() {
      // console.log(this.arr, 'arr')
      this.loading = true
      this.data = []
      const params = {
        searchDateEnd: `${this.arr[41].time.cYear}-${
          this.arr[41].time.cMonth < 10 ? '0' + this.arr[41].time.cMonth : this.arr[41].time.cMonth
        }-${this.arr[41].time.cDay < 10 ? '0' + this.arr[41].time.cDay : this.arr[41].time.cDay}`,
        searchDateStart: `${this.arr[0].time.cYear}-${
          this.arr[0].time.cMonth < 10 ? '0' + this.arr[0].time.cMonth : this.arr[0].time.cMonth
        }-${this.arr[0].time.cDay < 10 ? '0' + this.arr[0].time.cDay : this.arr[0].time.cDay}`,
        teacherId: this.teacherId
      }
      getScheduleList(params)
        .then((res) => {
          this.loading = false
          // console.log(res, '排班表数据')
          this.arr.map((v) => {
            const mTime = `${v.time.cYear}-${v.time.cMonth < 10 ? '0' + v.time.cMonth : v.time.cMonth}-${
              v.time.cDay < 10 ? '0' + v.time.cDay : v.time.cDay
            }`
            const obj = res.data.find((v) => v.scheduleDate === mTime)
            if (obj) {
              obj.scheduleDetailDTOList.map((v) => {
                v.followUsers.map((v) => {
                  v.nickName = v.userName
                })
              })
              this.data.push({
                backgroundColor: obj.backgroundColor,
                scheduleItem: obj.scheduleDetailDTOList,
                scheduleDate: obj.scheduleDate,
                teacherId: obj.teacherId,
                teacherName: obj.teacherName
              })
            } else {
              this.data.push({
                backgroundColor: '',
                scheduleItem: [],
                scheduleDate: '',
                teacherId: '',
                teacherName: ''
              })
            }
          })
        })
        .catch(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击打开编辑排期
    /**
     * params item: 日历数据
     * params data: 排期数据 排班数据为undefined，说明这天啥也没有
     */
    openSetting(item, data) {
      if (!this.permsList.includes('web:schedule:edit')) {
        return
      }
      const mTime = `${item.time.cYear}-${item.time.cMonth < 10 ? '0' + item.time.cMonth : item.time.cMonth}-${
        item.time.cDay < 10 ? '0' + item.time.cDay : item.time.cDay
      }`
      // const tTime = `${this.today.cYear}-${this.today.cMonth < 10 ? '0' + this.today.cMonth : this.today.cMonth}-${
      //   this.today.cDay < 10 ? '0' + this.today.cDay : this.today.cDay
      // }`
      // if (new Date(mTime).getTime() < new Date(tTime).getTime()) {
      //   return console.log('不能编辑')
      // }
      console.log('该事件的数据为:', data)
      if (!data) {
        this.schedulingConfig = {
          title: '添加排期',
          visible: true,
          scheduleDate: mTime, // 日期
          teacherId: this.teacherId, // 教师id
          teacherName: this.teacherName, // 教师名称
          backgroundColor: '', // 背景颜色
          scheduleItem: [{ content: '', remindFlag: false, followUsers: [] }] // 日程事项
        }
      } else {
        const res = JSON.parse(JSON.stringify(data))
        this.schedulingConfig = {
          title: '添加排期',
          visible: true,
          scheduleDate: mTime, // 日期
          teacherId: this.teacherId, // 教师id
          teacherName: this.teacherName, // 教师名称
          backgroundColor: res.backgroundColor, // 背景颜色
          scheduleItem: res.scheduleItem // 日程事项
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.calendarList {
  padding: 0px 12px;
  height: calc(100vh - 277px);
  overflow: auto;
  .weekBox {
    display: flex;
    border-left: 1px solid #919293;
    .weekItem {
      border-top: 1px solid #919293;
      border-right: 1px solid #919293;
      flex: 1 0 0;
      padding: 10px 0 10px 16px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 22px;
      font-weight: 700;
    }
  }
  .dayBox {
    display: flex;
    flex-wrap: wrap;
    border-left: 1px solid #919293;
    border-bottom: 1px solid #919293;
    .dayItem {
      border-top: 1px solid #919293;
      border-right: 1px solid #919293;
      flex: calc(100% / 7) 0 0;
      height: 114px;
      background: #ffffff;
      padding: 8px;
      box-sizing: border-box;
      // box-shadow: inset 0px -1px 0px 0px #E5E6EB, inset -1px 0px 0px 0px #E5E6EB;
      &:hover {
        background: #fbfcfe;
      }
      .day {
        display: flex;
        align-items: center;
        // justify-content: center;
        .dayText {
          display: inline-block;
          width: 28px;
          min-width: 28px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          border-radius: 50%;
          background: #fff;
          font-size: 18px;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #161616;
          line-height: 28px;
          margin-right: 4px;
        }
      }
      .diffToday {
        .dayText {
          color: #161616;
        }
      }
      .lastYear {
        .dayText {
          color: #cbcfd3;
        }
      }
      .today {
        .dayText {
          color: #fff !important;
          background: #0c6fff;
        }
        .todayText {
          background: pink;
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          border-radius: 50%;
        }
      }
      .plan {
        height: calc(100% - 28px);
        // cursor: pointer;
        .plan_bianji {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          .plan_bianji_icon {
            font-size: 32px;
            cursor: pointer;
          }
        }
        .planBox {
          width: calc(100% - 20px);
          padding-top: 8px;
          cursor: pointer;
          .planItem {
            margin-bottom: 4px;
            font-size: 12px;
            font-family: MicrosoftYaHei;
            color: #333;
            line-height: 20px;
          }
        }
      }
    }
    .textValue {
      width: 34px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #777;
      line-height: 20px;
    }
  }
}
[v-cloak] {
  display: none;
}
.planDetailBox {
  max-height: 260px;
  .planDetail {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
    padding-top: 8px;
    padding-bottom: 8px;
  }
}
.planDetail + .planDetail {
  border-top: 1px solid #e7e7e7;
}
.festival {
  display: flex;
  flex-wrap: wrap;
}
</style>
