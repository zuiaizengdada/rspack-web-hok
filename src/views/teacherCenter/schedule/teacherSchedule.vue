<template>
  <div v-cloak class="calendar">
    <div class="header">
      <el-form :inline="true" :model="search" size="small">
        <el-form-item label="选择日期">
          <el-date-picker
            v-model="search.time"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            :clearable="false"
            placeholder="选择月"
            @change="changeMonth"
          />
        </el-form-item>
        <el-form-item label="选择IP">
          <!-- <TeacherSelect
            ref="teacherSelect"
            :default-tearch-id="search.teacher.teacherId"
            :value="search.teacher.teacherName"
            @selected="onTeacherSelect"
          /> -->
          <AppSelect
            :get-api-fn="getTearchPage"
            search-key="lecturerName"
            :value="search.teacher.teacherId"
            :label="search.teacher.teacherName"
            :props="{
              label: 'teacherName',
              value: 'teacherId'
            }"
            placeholder="请选择"
            @selected="onTeacherSelect"
          />
        </el-form-item>
        <el-form-item>
          <!-- <el-button  @click="searchFn()">查询</el-button> -->
          <el-button
            v-show="search.teacher.teacherId"
            type="primary"
            @click="clear()"
          >返回首页</el-button>
        </el-form-item>
      </el-form>
      <div class="tearcher-right">
        <el-button
          v-permission="['web:schduleList:setting', permsList]"
          @click="openRemindDialog"
        >排班提醒设置</el-button>
        <el-button
          type="primary"
          icon="el-icon-s-operation"
          plain
          @click="openTeacherDialog"
        >首页IP设置</el-button>
      </div>
    </div>
    <template>
      <div v-show="search.teacher.teacherId" class="tearchScheduleTitle">
        <span class="tearcher">{{ search.teacher.teacherName }}</span>
        <span class="text">IP排班表</span>
      </div>
      <schedule
        v-show="search.teacher.teacherId"
        ref="schedule"
        :teacher-id="search.teacher.teacherId"
        :teacher-name="search.teacher.teacherName"
        @success="searchFn"
      />
    </template>
    <template>
      <teacher-list
        v-show="!search.teacher.teacherId"
        ref="teacherList"
        @select="onTeacherSelect"
      />
    </template>
    <!-- 排班提醒弹框 -->
    <AppDialog
      v-model="remindDialog.visible"
      width="694px"
      height="270px"
      title="排班提醒"
      @success="sendRemind"
    >
      <div
        v-if="remindDialog.visible"
        v-loading="remindDialog.loading"
        class="remindDialog"
      >
        <el-row>
          <el-col :span="12">
            <div>
              到时间前
              <el-input
                v-model.number="remindDialog.form.beforeEnd"
                class="m-r-8 m-l-8"
                size="mini"
                style="width: 116px"
                @input="e => delNoNumber(e, 'beforeEnd')"
              >
                <el-button slot="append" size="mini">小时</el-button>
              </el-input>
              提醒
            </div>

            <div class="m-t-32">
              共提醒
              {{
                parseInt(
                  (remindDialog.form.beforeEnd * 60) /
                    remindDialog.form.intervalTime
                ) || '-'
              }}
              次
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              每隔
              <el-select
                v-model="remindDialog.form.intervalTime"
                placeholder="请选择"
                size="mini"
                style="width: 80px"
              >
                <el-option :label="15" :value="15" />
                <el-option :label="30" :value="30" />
                <el-option :label="60" :value="60" />
              </el-select>
              分钟
              <!-- <el-input v-model.number="remindDialog.form.intervalTime" class="m-r-8 m-l-8" style="width: 126px" size="mini" @input="(e) => delNoNumber(e, 'intervalTime')">
                <el-button slot="append" size="mini">分钟</el-button>
              </el-input> -->
              提醒
            </div>
            <div class="m-t-32 formView">
              <span class="m-r-8 formlabel">通知类型</span>
              <el-checkbox
                v-model="remindDialog.form.isFeishu"
                :true-label="1"
                :false-label="0"
              >
                通知
              </el-checkbox>
              <!-- <el-checkbox v-model="remindDialog.form.isSms" :true-label="1" :false-label="0">短信通知</el-checkbox> -->
            </div>
          </el-col>
        </el-row>
      </div>
    </AppDialog>
    <teacherDialog ref="teacherDialog" @success="reset" />
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import schedule from './schedule.vue'
import teacherDialog from './components/teacherModal'
// import TeacherSelect from '../components/teacherSelect'
import teacherList from './components/teacherList'
import AppSelect from '@/components/AppSelect'
import {
  teacherSchduleSettingInfo,
  schedulingSettings,
  getTeacherList
} from '@/api/tearchCenter/index'
export default {
  components: { schedule, AppDialog, AppSelect, teacherDialog, teacherList },
  data() {
    const date = new Date()
    const cYear = date.getFullYear()
    // 因为系统上的月份1-12分别为0-11,所以输出时应+1显示
    const cMonth = date.getMonth() + 1
    return {
      search: {
        time: '',
        teacher: {
          teacherId: '',
          teacherName: ''
        }
      },
      time: {
        // 当前展示的时间: "2020-11"
        cMonth: cMonth < 10 ? '0' + cMonth : cMonth,
        cYear
      },
      // 排班提醒弹框
      remindDialog: {
        type: 1,
        visible: false,
        loading: false,
        form: {
          beforeEnd: '',
          intervalTime: '',
          isFeishu: 0,
          isSms: 0
        }
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  created() {
    this.search.time = `${this.time.cYear}-${this.time.cMonth}`
    if (this.$route.query.teacherId) {
      this.search.teacher.teacherId = this.$route.query.teacherId
      this.search.teacher.teacherName = this.$route.query.teacherName
      this.searchFn()
    }
  },
  methods: {
    getTearchPage(params) {
      console.log(params, 'params1231231231')
      const data = {
        pageIndex: params.currentPage,
        pageSize: params.size,
        teacherName: params.lecturerName,
        serviceEnterprise: '',
        domainCode: '',
        cooperateStatus: '',
        assessStatus: ''
      }
      return getTeacherList(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    delNoNumber(e, key) {
      this.remindDialog.form[key] = e.replace(/\D/g, '')
    },
    changeMonth(item) {
      if (item) {
        const arr = item.split('-')
        const cYear = Number(arr[0])
        const cMonth = arr[1]
        this.time = { cYear, cMonth }
        this.$refs.schedule && this.$refs.schedule.dataPrint(new Date(item))
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
        this.search.time = `${this.time.cYear}-${this.time.cMonth}`
        this.$refs.schedule && this.$refs.schedule.dataPrint(new Date(ctime))
      }
    },
    reset() {
      this.$refs.teacherList.init()
    },
    // 点击打开提醒设置
    openRemindDialog() {
      this.remindDialog = {
        type: 1,
        visible: true,
        loading: true,
        form: {
          beforeEnd: '',
          intervalTime: '',
          isFeishu: 0,
          isSms: 0
        }
      }
      // 获取排班提醒详情
      teacherSchduleSettingInfo()
        .then(res => {
          console.log(res)
          this.remindDialog.form = res.data
          this.remindDialog.loading = false
        })
        .catch(() => {
          this.remindDialog.loading = false
        })
    },
    openTeacherDialog() {
      const items = this.$refs.teacherList.items
      this.$refs.teacherDialog.open(items)
    },
    // 点击重置按钮
    clear() {
      console.log('清空')
      this.search = {
        time: `${this.time.cYear}-${this.time.cMonth}`,
        teacher: {
          teacherId: '',
          teacherName: ''
        }
      }
    },
    // 选择老师时触发
    onTeacherSelect(item) {
      console.log(item, '选择老师触发')
      this.search.teacher = item
      this.$nextTick(() => {
        this.$refs.schedule &&
          this.$refs.schedule.dataPrint(new Date(this.search.time))
      })
    },
    // 点击查询
    searchFn() {
      let time = `${this.time.cYear}-${this.time.cMonth}`
      if (this.search.time) {
        time = this.search.time
      }
      this.$refs.schedule && this.$refs.schedule.dataPrint(new Date(time))
    },
    // 提醒弹框
    sendRemind() {
      const data = {
        ...this.remindDialog.form
      }
      this.remindDialog.loading = true
      schedulingSettings(data)
        .then(res => {
          this.remindDialog.loading = false
          this.remindDialog.visible = false
          this.$notify.success({ title: '提示', message: '操作成功' })
        })
        .catch(() => {
          this.remindDialog.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.calendar {
  height: 100%;
  min-width: 1200px;
  background: #fff;
  border-radius: 10px;
  .header {
    padding: 20px 10px 0 10px;
    display: flex;
    justify-content: space-between;
  }
}
[v-cloak] {
  display: none;
}
.remindDialog {
  padding: 20px 34px;
  box-sizing: border-box;
}
.formView {
  display: flex;
  .formlabel {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
  }
}
.m-t-32 {
  margin-top: 32px;
}
.noData {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 60px;
  padding-bottom: 60px;
  margin: 224px auto 0;
  > img {
    width: 405px;
    height: 238px;
  }
}
.tearchScheduleTitle {
  padding-left: 10px;
  padding-bottom: 10px;
  // font-weight: 700;
  .tearcher {
    color: #333333;
    font-weight: bold;
    font-size: 18px;
  }
  .text {
    font-size: 14px;
    font-weight: normal;
    color: #777777;
    margin-left: 8px;
  }
}
</style>
