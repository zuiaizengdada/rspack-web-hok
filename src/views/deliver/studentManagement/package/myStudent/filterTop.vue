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
              current-id="7"
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
              dict-key="PACKAGE_DELIVERY_ONE_STATUS"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="销售跟进人员">
            <el-select
              v-model="search.saleUserId"
              style="width: 100%"
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
          <el-form-item label="招生老师" prop="teacherName">
            <el-select
              v-model="search.enrollmentUserId"
              style="width: 100%"
              filterable
              clearable
              remote
              placeholder="请选择"
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
            <!--            <el-input-->
            <!--              v-model.trim="search.teacherName"-->
            <!--              placeholder="请选择"-->
            <!--              clearable-->
            <!--              @focus="handleClickChangeSale"-->
            <!--              @change="handleChange"-->
            <!--            />-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="mb-4" justify="end">
        <el-col :span="6" class="flex justify-end">
          <el-button
            size="small"
            type="primary"
            @click="handleClickSearch"
          >查询
          </el-button>
          <el-button size="small" @click="clear">重置</el-button>
          <el-button
            v-permission="['web:myHeadRecorded:alter', permsList]"
            size="small"
            type="primary"
            @click="openChangeRead"
          >换人就读设置
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import CourseSelect from '../../../components/courseSelect'
import TeacherSelect from '../../../components/tearchSelect'
import { mapGetters } from 'vuex'
import moment from 'moment'
import { userNoPage } from '@/api/addressBookApi'

export default {
  components: {
    CourseSelect,
    TeacherSelect
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      currentTime: '',
      search: {
        user: { label: 'userPhone', value: '' }, // 学员搜索
        lecturerName: '', // 教师名称
        teacherId: '', // 教师编号
        goodsId: '', // 课程编号
        goodsName: '', // 课程名称
        deliveryStatusList: [], // 交付状态
        orderNo: '', // 订单号
        orderTime: ['', ''], // 订单创建日期
        watchClassPermission: '',
        saleUserId: '', // 销售跟进
        teacherName: '', // 招生老师组件输入名称
        enrollmentUserId: '' // 招生老师
      },
      userList: [],
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
      // tabList: [
      //   { id: '3', name: '普通专栏', api: '' },
      //   { id: '4', name: '大专栏', api: '' }
      // ],
      tabList: [
        // { id: '3', name: '普通专栏', api: '' },
        // { id: '4', name: '大专栏', api: '' }
        { id: '7', name: '套餐课', api: '' }
      ],
      options: [],
      scheduleLoading: false,
      courseList: []
    }
  },
  computed: {
    ...mapGetters(['channelsource'])
  },
  created() {
    this.$store.dispatch('option/getConfigChannelsource')
    this.getLastMonthDateRange()
    this.remoteMethodUser()
  },
  activated() {
    this.remoteMethodUser()
  },
  mounted() {
  },
  methods: {
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
      this.search.orderTime = [formatDateString(startDate), formatDateString(endDate)]
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
    },
    courseSelect(val) {
      const data = val && val.length ? val[0] : {}
      this.search.goodsId = data.goodsId ?? ''
      this.search.goodsName = data.contentName ?? ''
    },
    clear() {
      this.$emit('clear')
    },
    handleClickSearch() {
      this.$emit('searchFn', this.search)
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
    handleClickChangeSale() {
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [1],
        success: async res => {
          const userId = res.user[0]?.userId
          const userName = res.user[0]?.userName
          this.search.teacherName = userName
          this.search.enrollmentUserId = userId
        }
      })
    },
    handleChange(v) {
      if (this.search.teacherName === '') {
        this.search.enrollmentUserId = ''
      }
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
