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
                { userName: '姓名', userPhone: '电话', email: '邮箱' }[
                  search.user.label
                ]
              }`"
              clearable
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
          <el-form-item label="订单号">
            <el-input
              v-model.trim="search.orderNo"
              placeholder="请输入订单号"
              clearable
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
        <el-col :span="6">
          <el-form-item label="IP">
            <TeacherSelect
              ref="teacherSelect"
              :default-tearch-id="search.teacherId"
              :value="search.lecturerName"
              @selected="teacherSelect"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="课程名称">
            <CourseSelect
              ref="CourseSelect"
              :default-id="search.goodsId"
              :tearch-search="true"
              :lecturer-id="search.teacherId"
              :init-search="{
                lecturerId: search.teacherId,
                lecturerName: search.lecturerName
              }"
              :value="search.goodsName"
              :params="{ shelveFlag: '' }"
              :tab-list="tabList"
              current-id="3"
              @selected="courseSelect"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="交付状态">
            <m-select
              v-model="search.deliveryStatusList"
              multiple
              style="width: 100%"
              dict-key="DELIVERY_ONE_STATUS"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="看课权限">
            <el-select
              v-model="search.watchClassPermission"
              placeholder="请选择"
              clearable
            >
              <el-option label="开启" :value="1" />
              <el-option label="关闭" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="mb-4" justify="end">
        <el-col :span="6" class="flex justify-end">
          <el-button
            size="small"
            type="primary"
            @click="handleClickSearch"
          >查询</el-button>
          <el-button size="small" @click="clear">重置</el-button>
          <!-- TODO: v-permission="['web:allHeadRecorded:alter', permsList]" data中也没定义，控制台一直报错先注释 -->
          <el-button size="small" type="primary" @click="openChangeRead">
            换人就读设置
          </el-button>

          <el-button size="small" type="primary" @click="openCall()">
            呼叫
          </el-button>
          <el-button
            v-permission="['web:allRecorded:export', permsList]"
            v-loading="exportLoading"
            size="small"
            type="primary"
            @click="handleExport"
          >
            导出
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <customCallPhone
      ref="customCallPhone"
      v-model="visibleCallPhone"
      @close="visibleCallPhone = false"
    />
  </div>
</template>
<script>
import CourseSelect from '../../../components/courseSelect'
import TeacherSelect from '../../../components/tearchSelect'
import { mapGetters } from 'vuex'
import moment from 'moment'
import customCallPhone from './customCallPhone'
import { exportDeliveryUserProgress } from '@/api/deliver/studentManagement'
export default {
  components: {
    CourseSelect,
    TeacherSelect,
    customCallPhone
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => []
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      currentTime: '',
      permsList: this.$route.meta.permsList || [],
      search: {
        user: { label: 'userPhone', value: '' }, // 学员搜索
        lecturerName: '', // 教师名称
        teacherId: '', // 教师编号
        goodsId: '', // 课程编号
        goodsName: '', // 课程名称
        deliveryStatusList: [], // 交付状态
        orderNo: '', // 订单号
        orderTime: ['', ''], // 订单创建日期
        watchClassPermission: ''
      },
      pickerOptions: {
        disabledDate: time => {
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            // 一年以内
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
        { id: '3', name: '普通专栏', api: '' },
        { id: '4', name: '大专栏', api: '' }
      ],
      options: [],
      scheduleLoading: false,
      courseList: [],
      visibleCallPhone: false,
      exportLoading: false
    }
  },
  computed: {
    ...mapGetters(['channelsource'])
    // permsList() {
    //   return this.$route.meta.permsList || []
    // }
  },
  created() {
    this.$store.dispatch('option/getConfigChannelsource')
    this.getLastMonthDateRange()
    this.initSearch()
  },
  activated() {
    this.$store.dispatch('option/getConfigChannelsource')
    this.getLastMonthDateRange()
    this.initSearch()
  },
  mounted() {},
  methods: {
    async handleExport() {
      // 选择导出，必须选中订单创建时间和具体课程，且时间必须在半年内（6个月），不符合时提示
      if (!this.search.orderTime || !this.search.goodsId) {
        this.$message.error('请选选择订单创建时间和具体课程才能导出，且订单创建时间不能超过半年！')
        return
      }
      const exportKey = JSON.stringify({
        orderTime: this.search.orderTime,
        goodsId: this.search.goodsId
      })
      const now = Date.now()
      if (this.lastExportKey === exportKey && this.lastExportTime && now - this.lastExportTime < 300000) {
        this.$message.error('您有数据正在导出，请5分钟后再试，不要重复点击导出！也可以查看页面顶部任务中心-数据导出进行查看进度和下载数据!')
        return
      }
      this.lastExportKey = exportKey
      this.lastExportTime = now

      if (this.search.orderTime[1] - this.search.orderTime[0] > 180) {
        this.$message.error('订单创建时间不能超过半年！')
        return
      }
      if (this.exportLoading) {
        return
      }
      this.exportLoading = true
      const params = {
        current: this.currentPage,
        size: this.pageSize,
        [this?.search?.user?.label]: this.search?.user?.value || undefined,
        teacherId: this.search.teacherId || undefined,
        goodsId: this.search.goodsId || undefined,
        orderNo: this.search.orderNo || undefined,
        deliveryStatusList:
          this.search.deliveryStatusList?.join(',') || undefined,
        orderStartDate:
          this.search.orderTime && this.search?.orderTime[0]
            ? this.search?.orderTime[0]
            : undefined,
        orderEndDate:
          this.search.orderTime && this.search.orderTime[1]
            ? this.search.orderTime[1]
            : undefined,
        watchClassPermission: this.search.watchClassPermission || undefined
      }
      await exportDeliveryUserProgress(params).finally(() => {
        this.exportLoading = false
      })
      this.$notify.success({ title: '操作成功', message: '具体进度可前往任务中心查看！', offset: 50 })
      // window.open(res.data)
    },
    openCall() {
      this.visibleCallPhone = true
    },
    async openChangeRead() {
      this.$emit('openChangeRead')
    },
    teacherSelect(val) {
      this.search.teacherId = val.lecturerId
      this.search.lecturerName = val.lecturerName
      this.search.goodsId = ''
      this.search.goodsName = ''
    },
    getLastMonthDateRange() {
      const endDate = new Date() // 当前日期
      const startDate = new Date() // 当前日期

      // 设置开始日期为30天前
      startDate.setDate(startDate.getDate() - 30)

      const formatDateString = date => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，需要加1
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      // 返回开始日期和结束日期
      this.search.orderTime = [
        formatDateString(startDate),
        formatDateString(endDate)
      ]
    },
    reset() {
      this.search = {
        user: { label: 'userPhone', value: '' }, // 学员搜索
        lecturerName: '', // 教师名称
        teacherId: '', // 教师编号
        goodsId: '', // 课程编号
        goodsName: '', // 课程名称
        deliveryStatusList: [], // 交付状态
        orderNo: '', // 订单号
        orderTime: ['', ''], // 订单创建日期
        watchClassPermission: ''
      }
      this.getLastMonthDateRange()
      this.$setPageSearch({ ...this.search })
    },
    courseSelect(val) {
      const data = val && val.length ? val[0] : {}
      this.search.goodsId = data.goodsId ?? ''
      this.search.goodsName = data.contentName ?? ''
    },
    clear() {
      this.$emit('clear')
    },
    initSearch() {
      const initSearchData = this.$getPageSearch()
      if (initSearchData) {
        this.search = { ...this.search, ...initSearchData }
      }
      this.$emit('searchFn', this.search)
    },
    handleClickSearch() {
      this.$setPageSearch({ ...this.search })
      this.$emit('searchFn', this.search)
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  margin-top: 16px;
  border-bottom: 1px solid #e7e7e7;
  .filterFooter {
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // justify-content: flex-end;
  }
}
.tabelHeader {
  display: flex;
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
