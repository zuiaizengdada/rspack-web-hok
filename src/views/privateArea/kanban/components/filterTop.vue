<template>
  <div class="allHeader">
    <div class="headerTopBox">
      <div class="headerTop">
        <div class="headerTopLeft">
          <span>数据概况</span>
          <div class="headerTopLeftBtn">
            <div v-for="item in tabsList" :key="item.value" :class="{'activeClass':item.value===search.type}" @click="handleTab(item)">
              {{ item.label }}
            </div>
          </div>
          <div v-if="search.followDeptName" class="updateTime"> 当前部门：<span>{{ search.followDeptName }}</span> </div>
          <span class="updateTime"> 更新时间：{{ updateTime }} </span>
        </div>
        <AppDatepicker
          ref="AppDatepicker"
          style="width: 558px"
          :show="[7, 30, 'month', 'year']"
          :default="7"
          :is-whole="true"
          :search="search.time"
          :picker-options="pickerOptions"
          @change="timeChange"
          @blur="currentTime = ''"
        />
      </div>
      <div class="m-t-20">
        <el-form :inline="true" :model="search" size="small" label-width="70px">
          <el-form-item label="数据类型">
            <el-select
              v-model.trim="search.clueType"
              size="small"
              placeholder="请选择"
              class="w-200"
              filterable
              @change="clueTypeChange"
              @clear="$emit('onSearch')"
            >
              <!-- <el-option label="全部" value="" /> -->
              <el-option
                v-for="item in ChannelOption"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if="search.clueType !== 2" label="渠道来源">
            <el-select
              v-model.trim="search.channelId"
              size="small"
              placeholder="请选择"
              class="w-200"
              filterable
              clearable
              @clear="$emit('onSearch')"
            >
              <el-option
                v-for="item in channelSourceType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="search.clueType !== 2 && search.type === 0" label="来源老师">
            <TeacherSelect
              ref="teacherSelect"
              :default-tearch-id="search.teacherId"
              :value="search.teacherName"
              @selected="teacherSelect"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="onClear">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="trendList" :gutter="16">
      <template v-for="(item, index) in listData">
        <list
          :key="index"
          :loading="loading"
          :item="item"
          :icon="item.icon"
          :active="search.paramType === item.paramType"
          @onClick="onClick(item)"
        />
      </template>
    </div>
  </div>
</template>

<script>
import AppDatepicker from '@/components/AppDatePicker'
import { getTeacherPage } from '@/api/shop'
import TeacherSelect from '@/views/deliver/components/tearchSelect.vue'
import {
  getSelectUpdateTime,
  getSelectListTeacher
} from '@/api/privateArea/kanban'
import { mapGetters } from 'vuex'
import list from './list.vue'
import { dataTypeOptionKanban } from '../../CRM/columns'
import moment from 'moment'
const tabsList = [
  { label: '分配时间维度', value: 0 },
  { label: '成交时间维度', value: 1 }
]
export default {
  components: {
    AppDatepicker,
    list,
    TeacherSelect
  },
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          type: 0,
          time: { active: 7, time: ['', ''] },
          clueType: 1, // 线索管理
          channelId: '', // 渠道ID
          deptArray: [], // 跟进人部门链
          teacherId: '',
          teacherName: '',
          followDeptId: '',
          followDeptName: '',
          paramType: 1
        }
      }
    },
    listData: {
      type: Array,
      default: () => {
        return [
          {
            paramType: 1,
            text: '分配线索数',
            tips: '查询条件内的分配线索数量',
            value: '0',
            basisRatio: 0
          },
          {
            paramType: 2,
            text: '加微数',
            tips: '同一客户同时加上个微和企微数量计算为1',
            value: 0,
            basisRatio: 0
          },
          {
            paramType: 3,
            text: '到课数',
            tips: '加微率=加微数/分配线索数',
            value: 0,
            basisRatio: 0
          },
          {
            paramType: 4,
            text: '线索转化订单数',
            tips: '加微率=加微数/分配线索数',
            value: 0,
            basisRatio: 0
          },
          {
            paramType: 5,
            text: '订单金额(GMV)',
            tips: '加微率=加微数/分配线索数',
            value: 0,
            basisRatio: 0
          },
          {
            paramType: 6,
            text: '转化退款金额',
            tips: '加微率=加微数/分配线索数',
            value: 0,
            basisRatio: 0
          },
          {
            paramType: 7,
            text: '营收金额',
            tips: '加微率=加微数/分配线索数',
            value: 0,
            basisRatio: 0
          }
        ]
      }
    }
  },
  data() {
    return {
      tabsList,
      getSelectListTeacher,
      tearchArray: [],
      updateTime: '',
      currentTime: '',
      pickerOptions: {
        disabledDate: time => {
          // 先限制今天之前
          if (time.getTime() > Date.now()) {
            return true
          }
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
      ChannelOption: dataTypeOptionKanban,
      sumData: 100,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['channelSourceType'])
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
  },
  mounted() {
    this.init()
  },
  methods: {
    teacherSelect(val) {
      this.search.teacherId = val.lecturerId
      this.search.teacherName = val.lecturerName
    },
    // 时间改变触发
    timeChange(val) {
      this.search.time = val
      this.$emit('onSearch')
    },
    handleTab(item) {
      this.search.type = item.value
      this.search.channelId = ''
      this.search.teacherId = ''
      this.search.teacherName = ''
      this.search.followDeptId = ''
      this.search.followDeptName = ''
      this.search.paramType = 1
      this.init()
      this.$emit('onSearch')
    },
    // 获取数据
    async init() {
      const { code, data } = await getSelectUpdateTime({ type: this.search.type })
      if (code === 1 && data) this.updateTime = data
    },
    getPage(params) {
      return getTeacherPage(params).then(res => {
        return {
          items: res.data.records,
          total: res.data.total
        }
      })
    },
    onClear() {
      this.init()
      this.$emit('clear')
    },
    onSubmit() {
      this.init()
      this.$emit('onSearch')
    },
    selected(res) {
      this.search.teacherName = res.lecturerName
      this.search.teacherId = res.lecturerId
      this.$emit('onSearch')
    },
    onClick(item) {
      this.search.paramType = item.paramType
      // this.$emit('handleParam')
      this.$emit('onSearch')
    },
    clueTypeChange() {
      this.search.channelId = ''
      this.search.teacherId = ''
      this.search.teacherName = ''
      this.$emit('onSearch')
    }
  }
}
</script>

<style lang="scss" scoped>
.allHeader {
  .updateTime {
    font-size: 14px;
    color: #999999;
    line-height: 19px;
    margin-left: 15px;
    >span{
      color:#0C6FFF;
    }
  }
  .headerTopBox{
    background: #ffffff;
    padding:15px 20px;
    border-radius: 0 0 8px 8px;
  }
  .headerTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    > div:nth-of-type(1) {
      color: #333333;
      font-family: 'Microsoft YaHei';
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px;
    }
    .headerTopLeft {
      display: flex;
      align-items: center;
      .headerTopLeftBtn {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-left: 19px;
        margin-right: 15px;
        cursor: pointer;
        >.activeClass{
          color:#0C6FFF;
          border-color:#0C6FFF;
        }
        > div:nth-of-type(1) {
          border-radius: 4px 0 0 4px;
        }
        > div {
          width: 128px;
          font-weight: 400;
          border-radius: 0 4px 4px 0;
          text-align: center;
          padding: 4px 0;
          border: 1px solid #cbcfd3;
        }
      }
    }
  }
  .tips {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
  }
  .trendList {
    display: flex;
    flex-wrap: wrap;
    .kanbanlist {
      margin-right: 1.2%;
      margin-top: 20px;
    }
    >div:nth-of-type(6n){
      margin-right: 0;
    }
  }
}
</style>
