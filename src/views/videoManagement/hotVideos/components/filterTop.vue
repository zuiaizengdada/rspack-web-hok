<template>
  <div class="search">
    <el-form :inline="true" :model="searchForm" class="form-container" size="small">
      <el-form-item label="日期">
        <el-date-picker
          v-model="searchForm.timeArray"
          class="m-l-10 datePicker"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          type="daterange"
          :clearable="false"
          range-separator="-"
          start-placeholder="日期选择：开始日期"
          end-placeholder="结束日期"
          @change="getListForSearch"
        />
      </el-form-item>
      <el-form-item label="部门">
        <el-cascader
          v-model="searchForm.deptArray"
          :options="deptTreeArray"
          :props="{ checkStrictly: true }"
          clearable
          @change="visibleChangeD($event)"
        />
      </el-form-item>
      <el-form-item label="运营者">
        <el-select
          v-model="searchForm.operatorId"
          size="mini"
          clearable
          filterable
          placeholder="运营者"
          @change="handleChangeUser"
        >
          <el-option-group
            v-for="group in userArray"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="IP">
        <el-select
          v-model="searchForm.teacherId"
          remote
          :remote-method="tearchFilter"
          clearable
          filterable
          placeholder="请选择IP"
          @blur="()=>tearchFilter('')"
          @change="handleChangeTeacher"
        >
          <el-option-group
            v-for="group in filteredGroups(tearchArray)"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span class="flex flex-between"><span>{{ item.label }} </span><span style="color: #f53f3f;">{{ item.cooperateStatus === 1?'已签合同':'' }}</span></span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item v-if="activeIndex == 1" label="视频类型">
        <el-select v-model="searchForm.videoType" clearable filterable placeholder="请选择视频类型" @change="getListForSearch">
          <el-option
            v-for="item in videoTypeArray"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getListForSearch">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import { filteredGroups } from '@/utils/videoMange'

export default {
  props: {
    tearchArray: {
      type: Array,
      default: () => {
        return []
      }
    },
    deptTreeArray: {
      type: Array,
      default: () => {
        return []
      }
    },
    userArray: {
      type: Array,
      default: () => {
        return []
      }
    },
    activeIndex: {
      type: Number,
      default: 0
    },
    searchForm: {
      type: Object,
      default: () => {
        return {
          deptArray: [],
          timeArray: [moment().subtract(0, 'day').format('YYYY-MM-DD'), moment().subtract(0, 'day').format('YYYY-MM-DD')],
          teacherId: '',
          operatorId: '',
          videoType: 0
        }
      }
    }
  },
  data() {
    return {
      filteredGroups,
      videoTypeArray: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '带货视频',
          value: 1
        },
        {
          label: '流量视频',
          value: 2
        }
      ],
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.cuttentTime = minDate.getTime()
          if (maxDate) {
            this.cuttentTime = ''
          }
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const date = new Date()
              picker.$emit('pick', [date, date])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [date, date])
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }],
        disabledDate: (time) => {
          // return time.getTime() > Date.now()
          if (time.getTime() > Date.now()) {
            return true
          }
          if (this.cuttentTime !== '') {
            const one = 30 * 24 * 3600 * 1000
            const minTime = this.cuttentTime - one
            const maxTime = this.cuttentTime + one
            return time.getTime() < minTime || time.getTime() > maxTime // 选择日期范围为一个月
          }
        }
      }
    }
  },
  methods: {
    visibleChangeD(events) {
      this.$emit('visibleChangeD', events)
    },
    clear() {
      this.$emit('clear')
    },
    handleChangeTeacher() {
      this.$emit('handleChangeTeacher')
    },
    handleChangeUser() {
      this.$emit('handleChangeUser', this.searchForm)
    },
    getListForSearch() {
      this.$emit('getListForSearch', this.searchForm)
    },
    async tearchFilter(query = '') {
      setTimeout(async() => {
        this.$emit('tearchFilter', query)
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  margin-top: 18px;
  //   margin-left: 20px;
  //   margin-right: 20px;
  border-bottom: 1px solid #e7e7e7;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .form-container{
    width: 100%;
    .form-item{
      flex: 1;
      min-width: 400px;
      .el-form-item__content{
         display: flex;
      }
    }
  }
  .search_box{
    display: flex;
    height: 33px;
    width: 100%;
    .search_right {
      margin-left: 20px;
      flex: 1 0 0;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
    }
  }
}
.right-float {
  float: right;
  margin-right: 0px;
}
.right-tools {
  float: right;
  border: 1px solid #0c6fff;
  color: #0c6fff;
  background: none !important;
  font-size: 14px;
}
.right-tools:hover {
  background: #0c6fff !important;
}
.el-icon-plus {
  font-weight: bold;
}
</style>
