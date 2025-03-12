<template>
  <div class="filter-module">
    <!-- 顶部筛选栏 -->
    <el-form
      ref="form"
      :model="search"
      label-width="66px"
      size="small"
      :inline="true"
    >
      <!-- <el-form-item label="IP">
        <TeacherSelect
          ref="teacherSelect"
          :default-tearch-id="search.tearch.lecturerId"
          :value="search.tearch.lecturerName"
          @selected="teacherSelect"
        />
      </el-form-item> -->
      <el-form-item label="课程名称">
        <CourseSelect
          ref="CourseSelect"
          :params="{ shelveFlag: '' }"
          style="width: 200px"
          :default-id="search.goodsId"
          :init-search="{ lecturerId: search.tearch.lecturerId }"
          :lecturer-id="search.tearch.lecturerId"
          current-id="10"
          :tab-list="[{ id: '10', name: '直播课', api: '' }]"
          :value="search.goodsName"
          @selected="courseSelect"
        />
      </el-form-item>
      <el-form-item label="班级名称">
        <el-select
          v-model="search.scheduleNum"
          filterable
          class="w-200"
          maxlength="10"
          remote
          reserve-keyword
          placeholder="请输入班期"
          :remote-method="remoteMethod"
          :loading="scheduleLoading"
          @change="$emit('searchFn', true)"
        >
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.scheduleNum"
            :value="item.scheduleNum"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班级状态">
        <el-select
          v-model="search.scheduleStatus"
          style="width: 200px"
          clearable
          @change="search.costCheckStatus = ''"
        >
          <el-option value="" label="全部" />
          <el-option
            v-for="(value, key) in scheduleStatus"
            :key="key"
            :value="key"
            :label="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开班时间">
        <!-- type="month" -->
        <el-date-picker
          v-model="search.deliveryTime"
          value-format="yyyy-MM-dd"
          style="width: 200px"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleClickSearch">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="addView">
      <el-button
        v-permission="['web:allClass:curriculumInteractiveTool', permsList]"
        size="small"
        type="primary"
        @click="handleClickTool"
      >
        课程互动工具
      </el-button>
      <el-button
        v-permission="['web:allClass:add', permsList]"
        size="small"
        type="primary"
        @click="$emit('handleClickAdd')"
      >
        新增班期
      </el-button>
    </div>
  </div>
</template>

<script>
import TeacherSelect from '../../../components/tearchSelect.vue'
import CourseSelect from '../../../components/courseSelect.vue'
import { scheduleStatus, costCheckStatus } from './columns'
import { getDeliveryScheduleList } from '@/api/deliver/scheduleManagement'
export default {
  name: 'FilterTop',
  components: {
    TeacherSelect,
    CourseSelect
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    search: {
      type: Object,
      default: () => {
        return {
          tearch: {
            lecturerId: '',
            lecturerName: ''
          },
          goodsName: '',
          goodsId: '',
          deliveryTime: '',
          scheduleNum: '',
          scheduleStatus: '',
          costCheckStatus: ''
        }
      }
    }
  },
  data() {
    return {
      scheduleStatus,
      costCheckStatus,
      options: [],
      scheduleLoading: false,
      permsList: this.$route.meta.permsList || []
    }
  },
  created() {
    this.remoteMethod()
  },
  methods: {
    delNoNumber(e) {
      this.search.scheduleNum = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    teacherSelect(val) {
      this.search.tearch.lecturerId = val.lecturerId
      this.search.tearch.lecturerName = val.lecturerName
      this.search.goodsId = ''
      this.search.goodsName = ''
      this.search.scheduleNum = ''
    },
    clear() {
      console.log('点击重置')
      this.$emit('clear')
    },
    courseSelect(val) {
      this.search.goodsId = val[0].goodsId
      this.search.goodsName = val[0].contentName
      this.search.scheduleNum = ''
      if (val.length > 0) {
        this.remoteMethod()
      }
    },
    async remoteMethod(query) {
      this.scheduleLoading = true
      try {
        const { data } = await getDeliveryScheduleList({
          size: 90,
          current: 1,
          goodsId: this.search.goodsId,
          matchScheduleNum: query,
          type: 2
        })
        this.options = data?.records
        this.scheduleLoading = false
      } catch (e) {
        this.scheduleLoading = false
        this.options = []
      }
    },
    handleClickSearch() {
      console.log('点击查询')
      if (this.search.scheduleNum) {
        this.$emit('searchFn', true)
      } else {
        this.$emit('searchFn')
      }
    },
    handleClickTool() {
      const baseUrl = process.env.VUE_APP_BASE_URL || window.location.origin
      window.open(`${baseUrl}#/deliver/courseInteraction?type=certificate`)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-module {
  // padding: 16px 20px 0 20px;
  padding-top: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e7e7e7;
  display: flex;
  .addView {
    display: flex;
    align-items: flex-end;
    padding-bottom: 18px;
  }
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
}
</style>
