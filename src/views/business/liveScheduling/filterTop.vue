<template>
  <div class="filterTop">
    <el-form ref="form" :model="search" label-width="auto" size="small">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="直播编号">
            <el-input v-model.trim="search.liveId" placeholder="请输入直播编号" clearable style="width: 100%" maxlength="6" @input="delNoNumber" @clear="onSearch" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="直播时间">
            <el-date-picker
              v-model="search.liveTime"
              style="width: 100%"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              :unlink-panels="true"
              @focus="currentTime = ''"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="直播类型">
            <el-select v-model="search.liveType" placeholder="请选择" clearable style="width: 100%" @change="onSearch" @clear="onSearch">
              <el-option label="全部" value="" />
              <el-option v-for="(value, key) in liveTypeOption" :key="key" :label="value" :value="key" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="直播渠道">
            <el-select v-model="search.liveChannel" placeholder="请选择" style="width: 100%" clearable @change="onliveChannelChange" @clear="onSearch">
              <el-option v-for="(item) in liveChannel" :key="item.code" :label="item.message" :value="item.code">
                <img class="channel-cls" :src="item.imageUrl">
                {{ item.message }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="直播账号">
            <liveAccountSelect :params="{ expertChannel: search.liveChannel }" maxlength="30" style="width: 100%" :live-channel="liveChannel" :default-id="search.liveAccount.id" :value="search.liveAccount.name" @selected="liveAccountSelect" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="员工姓名">
            <AppUserSelect
              style="width: 100%"
              @change="changeUser"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="直播间">
            <el-select v-model="search.liveRoomId" placeholder="请选择" style="width: 100%" clearable @change="onSearch" @clear="onSearch">
              <el-option label="全部" value="" />
              <el-option v-for="(item) in liveRoomOption" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="6">
          <el-form-item label="直播老师">
            <TeacherSelect
              ref="teacherSelect"
              style="width: 100%"
              :default-tearch-id="search.liveTearch.id"
              :value="search.liveTearch.name"
              @selected="teacherSelect"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button type="primary" size="small" @click="onSearch">查询</el-button>
          <el-button size="small" @click="onClear">重置</el-button>
        </el-col>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="onhandleAdd">新增排班</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { liveTypeOption, liveRoomOption } from './columns'
import TeacherSelect from './components/tearchSelect.vue'
import liveAccountSelect from './components/liveAccountSelect.vue'
import AppUserSelect from '@/components/AppUserSelect'
import moment from 'moment'
export default {
  components: {
    TeacherSelect,
    AppUserSelect,
    liveAccountSelect
  },
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          liveId: '',
          liveTime: ['', ''],
          liveType: '',
          liveChannel: '',
          liveAccount: { name: '', id: '' },
          user: { name: '', id: '' },
          liveRoomId: '',
          liveTearch: { name: '', id: '' }
        }
      }
    },
    liveChannel: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    }
  },
  data() {
    return {
      currentTime: '',
      liveRoomOption,
      liveTypeOption,
      pickerOptions: {
        disabledDate: (time) => {
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            // 一年以内
            const minTime = moment(this.currentTime).subtract(1, 'years').valueOf()
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
      }
    }
  },
  mounted() {

  },
  methods: {
    delNoNumber(e) {
      this.search.liveId = e.replace(/[^0-9]/g, '')
    },
    delNoNumber2(e) {
      this.search.liveAccount = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    // 点击查询按钮
    onSearch() {
      this.$emit('onSearch')
    },
    // 点击重置按钮
    onClear() {
      this.$emit('onClear')
    },
    // 点击新增规则按钮
    onhandleAdd() {
      this.$emit('onAdd')
    },
    // 选择员工
    changeUser(userId) {
      this.search.user.id = userId
      this.$emit('onSearch')
    },
    // 清空选择得员工
    onhanldeUserClear() {
      this.search.user.name = ''
      this.search.user.id = ''
      this.$emit('onSearch')
    },
    // 点击选择直播老师
    teacherSelect(row) {
      this.search.liveTearch.name = row.lecturerName
      this.search.liveTearch.id = row.lecturerId
      this.$emit('onSearch')
    },
    // 点击选择直播账号
    liveAccountSelect(row) {
      this.search.liveAccount.name = row.expertName
      this.search.liveAccount.id = row.id
      this.search.liveChannel = row.expertChannel
      this.$emit('onSearch')
    },
    // 直播渠道改变清空直播账号
    onliveChannelChange() {
      this.search.liveAccount.name = ''
      this.search.id = ''
      this.$emit('onSearch')
    }
  }
}
</script>

<style lang='scss' scoped>
.filterTop {
  padding-bottom: 20px;
  border-bottom: 1px solid #E7E7E7;
  margin-bottom: 20px;
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
}
.channel-cls {
  width: 15px;
  height: 15px;
  border-radius: 100%;
  margin-right: 8px;
  margin-top: 9px;
  float: left;
}
</style>
