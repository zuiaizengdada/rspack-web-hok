<template>
  <div class="allHeader">
    <div class="headerTop">
      <MTitle>数据概况</MTitle>
      <AppDatepicker
        ref="AppDatepicker"
        style="width: 558px"
        :show="[7, 30, 'month']"
        :default="7"
        :search="search.time"
        :picker-options="pickerOptions"
        @change="timeChange"
        @blur="currentTime = ''"
      />
    </div>
    <div class="m-t-20 m-b-20">
      <span class="m-r-8 tips">渠道商</span>
      <el-select v-model.trim="search.channelId" size="small" placeholder="请选择" class="w-200" filterable clearable @clear="$emit('onSearch')" @change="channelChange">
        <el-option v-for="(item) in ChannelOption" :key="item.id" :value="item.id" :label="item.name" />
      </el-select>
    </div>

    <el-row class="trendList" :gutter="20">
      <template v-for="(item, index) in listData">
        <el-col :key="index" :span="8">
          <list
            :loading="loading"
            :line-color="item.color"
            :year-basis-ratio="item.linkRelativeRatio"
            :link-relative-ratio="item.yearBasisRatio"
            :sum-data="item.sumData"
            :title="item.text"
            :active="dataCourse[index].active"
            @onClick="$emit('onClick', index)"
          /></el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import AppDatepicker from '@/components/AppDatePicker'
import { getSmsChannelList, getDataBoard } from '@/api/system/sms.js'
import list from './list.vue'
import moment from 'moment'
export default {
  components: {
    AppDatepicker,
    list
  },
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          time: {
            active: 7,
            time: ['', '']
          },
          current: 0,
          channelId: ''
        }
      }
    },
    dataCourse: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentTime: '',
      pickerOptions: {
        disabledDate: (time) => {
          // 先限制今天之前
          if (time.getTime() > Date.now()) {
            return true
          }
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
      },
      ChannelOption: [],
      listData: [
        { linkRelativeRatio: '', sumData: '', yearBasisRatio: '', color: '#0C6FFF', text: '总发送条数' },
        { linkRelativeRatio: '', sumData: '', yearBasisRatio: '', color: '#00E3DB', text: '总发送成功条数' },
        { linkRelativeRatio: '', sumData: '', yearBasisRatio: '', color: '#FF5962', text: '总发送失败条数' }
      ],
      sumData: 100,
      loading: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 时间改变触发
    timeChange(val) {
      this.search.time = val
      this.getDataBoard()
      this.$emit('onSearch')
    },
    // 获取数据
    init() {
      this.getSmsChannelList()
    },
    // 获取渠道商
    getSmsChannelList() {
      const params = {
        pageIndex: 1,
        pageSize: 99999
      }
      getSmsChannelList(params).then(res => {
        this.ChannelOption = res.data.items
      })
    },
    // 获取筛选栏列表
    getDataBoard() {
      this.loading = true
      const params = {
        channelId: this.search.channelId,
        endTime: this.search.time.time[1] + ' 00:00:00',
        startTime: this.search.time.time[0] + ' 00:00:00'
      }
      return getDataBoard(params).then(res => {
        this.listData[0] = { ...res.data.totalSendItem, color: '#0C6FFF', text: '总发送条数' }
        this.listData[1] = { ...res.data.successItem, color: '#00E3DB', text: '总发送成功条数' }
        this.listData[2] = { ...res.data.failItem, color: '#FF5962', text: '总发送失败条数' }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 渠道商改变触发
    channelChange() {
      this.getDataBoard().then(() => {
        this.$emit('onSearch')
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.allHeader {
  .headerTop {
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #E0E0E0;
  }
  .tips {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
  }
}
</style>
