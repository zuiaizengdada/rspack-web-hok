<template>
  <!-- 顶部搜索栏 -->
  <div class="filterTop">
    <el-form ref="form" :model="search" label-width="auto" size="small">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="学员">
            <el-input
              v-model.trim="search.user.value"
              :placeholder="`请输入学员${
                { userName: '姓名', userPhone: '电话',email:'邮箱' }[search.user.label]
              }`"
              clearable
              @keyup.enter.native="$emit('searchFn')"
            >
              <el-select
                slot="prepend"
                v-model="search.user.label"
                style="width: 80px"
                placeholder="请选择"
              >
                <el-option label="电话" value="userPhone" />
                <el-option label="姓名" value="userName" />
                <el-option label="邮箱" value="email" />
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="IP">
            <TeacherSelect
              ref="teacherSelect"
              :default-tearch-id="search.lecturerId"
              :value="search.lecturerName"
              @selected="teacherSelect"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="课程类型">
            <el-select
              v-model="search.curriculumType"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in classTypeSource"
                :key="item.curriculumType"
                :value="item.curriculumType"
                :label="item.typeName"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="班期">
            <!-- <el-input
              v-model="search.scheduleNum"
              controls-position="right"
              clearable
              :disabled="!search.goodsName"
              maxlength="10"
              placeholder="请输入"
              @input="(e) => delNoNumber(e)"
              @keyup.enter.native="$emit('searchFn')"
            /> -->
            <el-select
              v-model="search.scheduleNum"
              filterable
              class="w-200"
              maxlength="10"
              remote
              clearable
              reserve-keyword
              placeholder="请输入班期"
              :remote-method="remoteMethod"
              :loading="scheduleLoading"
            >
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.scheduleNum"
                :value="item.scheduleNum"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <template v-if="!show">
          <el-col :span="6">
            <el-form-item label="订单号">
              <el-input
                v-model.trim="search.orderNo"
                placeholder="请输入订单号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="跟进状态">
              <el-select
                v-model="search.status"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="filterFooter">
            <el-form-item label-width="0px">
              <el-checkbox
                v-model="search.notInScheduleStatus"
                class="m-r-20"
                :true-label="2"
                :false-label="1"
              >未入班学员</el-checkbox>
              <el-button
                size="small"
                type="primary"
                @click="handleClickSearch"
              >查询</el-button>
              <el-button size="small" @click="clear">重置</el-button>
              <el-button size="medium" type="text" @click="show = !show">
                {{ show ? '收起' : '更多' }}
                <i
                  class="el-icon-arrow-up btn_more"
                  :class="{ btn_close: show }"
                />
              </el-button>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24" class="filterFooter">
            <el-form-item label-width="0px" class="custom">
              <div style="display:flex">
                <el-button v-permission="['web:myStudent:export', permsList]" :loading="exportLoading" type="text" style="margin-right: 26px" @click="handleExport">导出</el-button>
                <CustomTabelHeader :columns="columns" v-bind="$attrs" v-on="$listeners" />
              </div>
            </el-form-item>
          </el-col> -->
        </template>
      </el-row>
      <el-row v-if="show" :gutter="20">
        <el-col :span="6">
          <el-form-item label="招生">
            <el-input
              v-model.trim="search.enrollment.value"
              :placeholder="`模糊搜索招生${
                search.enrollment.label === 'enrollmentDeptName'
                  ? '部门'
                  : '老师'
              }`"
              clearable
            >
              <el-select
                slot="prepend"
                v-model="search.enrollment.label"
                style="width: 80px"
                placeholder="请选择"
              >
                <el-option label="部门" value="enrollmentDeptName" />
                <el-option label="老师" value="enrollmentUserName" />
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="招生老师">
            <el-input v-model.trim="search.enrollmentUserName" placeholder="模糊搜索招生老师" clearable @keyup.enter.native="$emit('searchFn')" />
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="渠道来源">
            <el-select
              v-model="search.channelSource"
              style="width: 100%"
              clearable
            >
              <el-option value="" label="全部" />
              <el-option
                v-for="item in channelsource"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单类型">
            <el-select v-model="search.orderType" style="width: 100%" clearable>
              <el-option value="" label="全部" />
              <el-option
                v-for="item in orderType"
                :key="item.id"
                :value="item.id"
                :label="item.type"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="转课状态">
            <el-select
              v-model="search.shiftStatus"
              style="width: 100%"
              clearable
            >
              <el-option value="" label="全部" />
              <el-option
                v-for="(value, key) in shiftStatus"
                :key="key"
                :value="key"
                :label="value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="show" :gutter="20">
        <el-col :span="6">
          <el-form-item label="交付状态">
            <el-select
              v-model="search.deliveryStatusList"
              multiple
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="(value, key) in deliveryStatus"
                :key="key"
                :value="key"
                :label="value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="作业状态">
            <el-select
              v-model="search.courseWorkStatus"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="(item, index) in courseWorkStatus"
                :key="index"
                :value="index"
                :label="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="交付日期">
            <el-date-picker
              v-model="search.deliveryTime"
              style="width: 100%"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              @blur="currentTime = ''"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单创建日期">
            <el-date-picker
              v-model="search.orderTime"
              style="width: 100%"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              @blur="currentTime = ''"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="show" :span="6">
          <el-form-item label="课程名称">
            <CourseSelect
              ref="CourseSelect"
              multiple
              :lecturer-id="search.lecturerId"
              :default-id="search.goodsIdList"
              :tearch-search="true"
              :init-search="{
                lecturerId: search.lecturerId,
                lecturerName: search.lecturerName
              }"
              :value="search.goodsNameList"
              :tab-list="tabList"
              current-id="5"
              :params="{ shelveFlag: '' }"
              @selected="courseSelect"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="show" :span="6">
          <el-form-item label="销售跟进人员">
            <el-select
              v-model="search.saleUserId"
              filterable
              clearable
              remote
              placeholder="请输入销售跟进人员"
              :remote-method="remoteMethodUser"
              :loading="userLoading"
            >
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="订单号">
            <el-input
              v-model.trim="search.orderNo"
              placeholder="请输入订单号"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col v-if="show" :span="6">
          <el-form-item label="跟进状态">
            <el-select
              v-model="search.status"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <template v-if="show">
          <el-col :span="6">
            <el-checkbox
              v-model="search.notInScheduleStatus"
              class="m-r-20"
              :true-label="2"
              :false-label="1"
            >未入班学员</el-checkbox>
            <el-button
              size="small"
              type="primary"
              @click="handleClickSearch"
            >查询</el-button>
            <el-button size="small" @click="clear">重置</el-button>
            <el-button size="medium" type="text" @click="show = !show">
              {{ show ? '收起' : '更多' }}
              <i
                class="el-icon-arrow-up btn_more"
                :class="{ btn_close: show }"
              />
            </el-button>
          </el-col>
        </template>
      </el-row>
      <el-row>
        <el-col :span="24" class="tabelHeader">
          <el-button
            v-permission="['web:myStudent:export', permsList]"
            :loading="exportLoading"
            type="text"
            style="margin-right: 26px"
            @click="handleExport"
          >导出</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import CourseSelect from '../../../components/courseSelect.vue'
import TeacherSelect from '../../../components/tearchSelect.vue'
import { deliveryStatus, shiftStatus } from './columns'
import { courseWorkStatus } from '@/utils/enum'
import { mapGetters } from 'vuex'
import { courseListWithDisable } from '@/api/course'
import {
  getDeliveryScheduleList,
  deliveryInfoExportV2
} from '@/api/deliver/scheduleManagement'
import moment from 'moment'
import { findTypeList } from '@/api/business'
import { userNoPage } from '@/api/addressBookApi'
export default {
  components: {
    CourseSelect,
    TeacherSelect
  },
  props: {
    // search: {
    //   type: Object,
    //   default: () => {
    //     return {
    //       user: { label: 'userPhone', value: '' }, // 学员搜索
    //       // userName: '', // 学员姓名
    //       // userPhone: '', // 学员电话
    //       lecturerName: '', // 教师名称
    //       lecturerId: '', // 教师编号
    //       goodsIdList: [], // 课程编号
    //       goodsNameList: [], // 课程名称
    //       scheduleNum: '', // 班期数
    //       enrollment: { label: 'enrollmentDeptName', value: '' },
    //       // recruitDepName: '', // 招生部门名字
    //       // enrollmentUserName: '', // 招生老师用户名字
    //       channelSource: '', // 渠道来源
    //       orderType: '',
    //       shiftStatus: '', // 转课状态
    //       deliveryStatusList: [], // 交付状态
    //       status: '', // 跟进状态
    //       deliveryTime: ['', ''], // 交付日期
    //       orderTime: ['', ''], // 订单创建日期
    //       orderNo: '', // 订单号
    //       notInScheduleStatus: '', // 未入班状态，1为入班 2未入班
    //       courseWorkStatus: '',
    //       curriculumType: ''
    //     }
    //   }
    // },
    columns: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    canExport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      search: {
        user: { label: 'userPhone', value: '' }, // 学员搜索
        // userName: '', // 学员姓名
        // userPhone: '', // 学员电话
        lecturerName: '', // 教师名称
        lecturerId: '', // 教师编号
        goodsIdList: [], // 课程编号
        goodsNameList: [], // 课程名称
        scheduleNum: '', // 班期数
        enrollment: { label: 'enrollmentDeptName', value: '' },
        // recruitDepName: '', // 招生部门名字
        // enrollmentUserName: '', // 招生老师用户名字
        channelSource: '', // 渠道来源
        orderType: '',
        shiftStatus: '', // 转课状态
        deliveryStatusList: [], // 交付状态
        status: '', // 跟进状态
        deliveryTime: ['', ''], // 交付日期
        orderTime: ['', ''], // 订单创建日期
        orderNo: '', // 订单号
        notInScheduleStatus: '', // 未入班状态，1为入班 2未入班
        courseWorkStatus: '',
        curriculumType: ''
      },
      deliveryStatus,
      shiftStatus,
      orderType: [],
      exportLoading: false,
      show: false,
      currentTime: '',
      courseWorkStatus,
      classTypeSource: [],
      statusList: [
        { id: '1', name: '待定 ', api: '' },
        { id: '2', name: '确定不来', api: '' },
        { id: '3', name: '确定来', api: '' },
        { id: '4', name: '未接电话', api: '' }
      ],
      pickerOptions: {
        disabledDate: time => {
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            // 一年以内
            // const one = 364 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            // const minTime = this.currentTime - one
            // const maxTime = this.currentTime + one
            const minTime = moment(this.currentTime)
              .subtract(1, 'years')
              .valueOf()
            const maxTime = moment(this.currentTime).add(1, 'years').valueOf()
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
      tabList: [
        { id: '5', name: '线下课', api: '' },
        { id: '3', name: '普通专栏', api: '' },
        { id: '4', name: '大专栏', api: '' }
      ],
      permsList: this.$route.meta.permsList || [],
      options: [],
      scheduleLoading: false,
      courseList: [],
      userLoading: false,
      userList: []
    }
  },
  computed: {
    ...mapGetters(['channelsource'])
  },
  created() {
    this.getOrderType()
    this.remoteMethod()
    this.remoteMethodUser()
    this.$store.dispatch('option/getConfigChannelsource')
    this.initSearch()
  },
  activated() {
    this.getOrderType()
    this.remoteMethod()
    this.remoteMethodUser()
    this.$store.dispatch('option/getConfigChannelsource')
    this.initSearch()
  },
  mounted() {},
  methods: {
    async remoteMethod(query) {
      this.scheduleLoading = true
      try {
        const { data } = await getDeliveryScheduleList({
          size: 99,
          current: 1,
          goodsIdList: this.search.goodsIdList,
          matchScheduleNum: query
        })
        this.options = data?.records
        this.scheduleLoading = false
      } catch (e) {
        this.scheduleLoading = false
        this.options = []
      }
    },
    async remoteMethodUser(query) {
      this.userLoading = true
      try {
        const { data } = await userNoPage({
          size: 99,
          current: 1,
          nickName: query
        })
        this.userList = data
        this.userLoading = false
      } catch (e) {
        this.userLoading = false
        this.userList = []
      }
    },
    teacherSelect(val) {
      this.search.lecturerId = val.lecturerId
      this.search.lecturerName = val.lecturerName
      this.search.goodsIdList = []
      this.search.goodsNameList = []
      this.search.scheduleNum = ''
    },
    courseSelect(val, keyList) {
      const ids = this.courseList.map(i => i.goodsId)
      val.forEach(i => {
        if (!ids.includes(i.goodsId)) {
          this.courseList.push(i)
        }
      })
      const goodsIdList = []
      const goodsNameList = []
      this.courseList.forEach(i => {
        if (keyList.includes(i.goodsId)) {
          goodsIdList.push(i.goodsId)
          goodsNameList.push(i.contentName)
        }
      })
      this.search.goodsIdList = goodsIdList
      this.search.goodsNameList = goodsNameList
      this.search.scheduleNum = ''
      this.remoteMethod()
    },
    clear() {
      this.search = {
        user: { label: 'userPhone', value: '' }, // 学员搜索
        // userName: '', // 学员姓名
        // userPhone: '', // 学员电话
        lecturerName: '', // 教师名称
        lecturerId: '', // 教师编号
        goodsIdList: [], // 课程编号
        goodsNameList: [], // 课程名称
        scheduleNum: '', // 班期数
        enrollment: { label: 'enrollmentDeptName', value: '' },
        // recruitDepName: '', // 招生部门名字
        // enrollmentUserName: '', // 招生老师用户名字
        channelSource: '', // 渠道来源
        orderType: '',
        shiftStatus: '', // 转课状态
        deliveryStatusList: [], // 交付状态
        status: '', // 跟进状态
        deliveryTime: ['', ''], // 交付日期
        orderTime: ['', ''], // 订单创建日期
        orderNo: '', // 订单号
        notInScheduleStatus: '', // 未入班状态，1为入班 2未入班
        courseWorkStatus: '',
        curriculumType: ''
      }
      this.$setPageSearch({ ...this.search })
      this.$emit('clear', { ...this.search })
    },
    initSearch() {
      const initSearchData = this.$getPageSearch()
      if (initSearchData) {
        this.search = { ...this.search, ...initSearchData }
      }
      this.$emit('searchFn', this.search)
    },
    handleClickSearch() {
      this.show = false
      this.$setPageSearch({ ...this.search })
      this.$emit('searchFn', { ...this.search })
    },
    // 点击导出按钮
    handleExport() {
      if (!this.search.scheduleNum) {
        return this.$message.error('请先选择班期!')
      }
      this.exportLoading = true
      const params = {
        ...this.search,
        [this.search.user.label]: this.search.user.value,
        [this.search.enrollment.label]: this.search.enrollment.value,
        deliveryStartTime: this.search.deliveryTime
          ? this.search.deliveryTime[0]
          : '',
        deliveryEndTime: this.search.deliveryTime
          ? this.search.deliveryTime[1]
          : '',
        orderStartTime: this.search.orderTime ? this.search.orderTime[0] : '',
        orderEndTime: this.search.orderTime ? this.search.orderTime[1] : ''
      }
      delete params.user
      delete params.enrollment
      delete params.deliveryTime
      delete params.orderTime
      deliveryInfoExportV2(params)
        .then(res => {
          var newWin = window.open('loading page', '_self')
          newWin.location.href = res.data // 成功 重定向到目标页面
          this.exportLoading = false
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    // 获取订单类型
    getOrderType() {
      findTypeList().then(res => {
        this.orderType = res?.data || []
      })
      courseListWithDisable().then(res => {
        this.classTypeSource = res?.data || []
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tabelHeader {
  display: flex;
  justify-content: flex-end;
  align-content: center;
  // margin-top: -30px;
}
.filterTop {
  margin-top: 16px;
  border-bottom: 1px solid #e7e7e7;
  .filterFooter {
    .custom {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .filterBottom {
      display: flex;
      align-items: center;
    }
  }
}
.custom {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.btn_close {
  transform: rotate(180deg);
}
::v-deep {
  .tearchInput {
    width: 100%;
  }
  label {
    font-weight: normal;
    color: #333;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
