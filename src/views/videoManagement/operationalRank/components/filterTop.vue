<template>
  <div class="search">
    <div class="headerTop">
      <MTitle>榜单数据</MTitle>
      <AppDatepicker
        :size="'mini'"
        :show="[1, 7, 30]"
        :default="7"
        :search="searchForm.time"
        :picker-options="pickerOptions"
        @change="timeChange"
        @blur="currentTime = ''"
      />
    </div>
    <el-form
      :inline="true"
      :model="searchForm"
      class="form-container"
      size="small"
    >
      <div class="flex flex-middle flex-between">
        <span>
          <el-form-item>
            <el-select
              v-model="searchForm.platformId"
              filterable
              placeholder="请选择平台"
              clearable
              @change="getListForSearch"
            >
              <el-option
                v-for="item in platformArray"
                :key="item.platformId"
                :label="item.platformName"
                :value="item.platformId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="searchForm.teacherId"
              clearable
              filterable
              placeholder="请选择IP"
              remote
              :remote-method="tearchFilter"
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
          <el-form-item>
            <el-button type="primary" @click="getListForSearch">查询</el-button>
            <el-button @click="clear">重置</el-button>
          </el-form-item>
        </span>
        <span>
          <el-form-item style="margin-right: 0px;">
            <el-button
              type="primary"
              plain
              style="margin-right: 0px;"
              @click="exportData"
            >导出数据</el-button>
          </el-form-item>
        </span>
      </div>

    </el-form>
    <div class="worksList no-select">
      <span
        v-for="(item) in list"
        :key="item.value"
        :class="{ label_sty: true,'no-wrap':true, active: selectIndex === item.value }"
        @click="selectWorks(item)"
      >{{ item.label }}</span>
    </div>
  </div>
</template>

<script>
import AppDatepicker from '@/components/AppDatePicker'
import moment from 'moment'
import { listOfWorks, accountList } from '../columns.js'
import { filteredGroups } from '@/utils/videoMange'

export default {
  components: {
    AppDatepicker
  },
  props: {
    configIndex: {
      type: String,
      default: '0'
    },
    tearchArray: {
      type: Array,
      default: () => {
        return []
      }
    },
    platformArray: {
      type: Array,
      default: () => {
        return []
      }
    },
    searchForm: {
      type: Object,
      default: () => {
        return {
          platformId: '', // 平台ID
          teacherId: '', // IP
          orderByParam: 1, // 排行类型
          time: {
            active: 7,
            time: ['', '']
          }
        }
      }
    }
  },
  data() {
    return {
      filteredGroups,
      listOfWorks,
      accountList,
      selectIndex: '2',
      pickerOptions: {
        disabledDate: time => {
          // 先限制今天之前
          if (time.getTime() > Date.now()) {
            return true
          }
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            const minTime = moment(this.currentTime)
              .subtract(365, 'days')
              .valueOf()
            const maxTime = moment(this.currentTime).add(365, 'days').valueOf()
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
      list: [],
      currentTime: ''
    }
  },
  watch: {
    configIndex: {
      handler(val) {
        if (val === '1') {
          this.selectIndex = '6'
          this.list = this.listOfWorks
        } else {
          this.selectIndex = '1'
          this.list = this.accountList
        }
      },
      immediate: true
    }
  },
  methods: {
    clear() {
      this.$emit('clear')
    },
    selectWorks(item) {
      this.selectIndex = item.value
      this.$emit('selectWorks', item.value)
    },
    timeChange(data) {
      this.$emit('timeChange', { ...data })
    },
    getListForSearch() {
      this.$emit('getListForSearch', this.searchForm)
    },
    exportData() {
      this.$emit('exportData', this.searchForm)
    },
    handleChangeTeacher() {
      this.$emit('handleChangeTeacher', this.searchForm)
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
.headerTop {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}
.worksList {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .label_sty {
    flex: 1;
    background: #f3f3f3;
    border-radius: 8px;
    padding: 13px 0;
    text-align: center;
    box-sizing: border-box;
    font-size: 16px;
    font-weight: 400;
    margin-right: 26px;
    color: #333333;
    cursor: pointer;
  }
  :last-child{
    margin-right: 0;
  }
  .active {
    background: #f4fbff;
    font-weight: 500;
    color: #1778ff;
  }
}
</style>

