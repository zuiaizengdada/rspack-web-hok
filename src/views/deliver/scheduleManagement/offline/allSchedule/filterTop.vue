<template>
  <div class="filter-module">
    <!-- 顶部筛选栏 -->
    <el-form ref="form" :model="search" label-width="66px" size="small" :inline="true">
      <el-form-item label="IP">
        <TeacherSelect
          ref="teacherSelect"
          :default-tearch-id="search.tearch.lecturerId"
          :value="search.tearch.lecturerName"
          @selected="teacherSelect"
        />
      </el-form-item>
      <el-form-item label="课程名称">
        <CourseSelect
          ref="CourseSelect"
          :params="{shelveFlag: ''}"
          style="width: 200px"
          :default-id="search.goodsId"
          :init-search="{lecturerId:search.tearch.lecturerId}"
          :lecturer-id="search.tearch.lecturerId"
          :value="search.goodsName"
          @selected="courseSelect"
        />
      </el-form-item>
      <el-form-item label="班期">
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
          @change="$emit('searchFn')"
        >
          <el-option
            v-for="(item,index) in options"
            :key="index"
            :label="item.scheduleNum"
            :value="item.scheduleNum"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班期状态">
        <el-select v-model="search.scheduleStatus" style="width: 200px" clearable @change="search.costCheckStatus = ''">
          <el-option value="" label="全部" />
          <el-option v-for="(value, key) in scheduleStatus" :key="key" :value="key" :label="value" />
        </el-select>
      </el-form-item>
      <el-form-item label="交付月份">
        <el-date-picker
          v-model="search.deliveryTime"
          value-format="yyyy-MM"
          style="width: 200px"
          type="month"
          placeholder="选择月"
        />
      </el-form-item>
      <el-form-item label="成本核算">
        <el-select v-model="search.costCheckStatus" placeholder="请选择" :disabled="search.scheduleStatus === '1' || search.scheduleStatus === '2'" style="width: 200px" clearable>
          <el-option v-for="(value, key) in costCheckStatus" :key="key" :value="key" :label="value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleClickSearch">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-form-item>
    </el-form>
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
      scheduleLoading: false
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
        const { data } = await getDeliveryScheduleList(
          { size: 99, current: 1, goodsId: this.search.goodsId, matchScheduleNum: query }
        )
        this.options = data?.records
        this.scheduleLoading = false
      } catch (e) {
        this.scheduleLoading = false
        this.options = []
      }
    },
    handleClickSearch() {
      console.log('点击查询')
      this.$emit('searchFn')
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-module {
  // padding: 16px 20px 0 20px;
  padding-top: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #E7E7E7;
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
