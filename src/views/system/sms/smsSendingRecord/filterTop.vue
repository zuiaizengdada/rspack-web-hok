<template>
  <div class="filterTop">
    <el-form ref="form" :model="search" label-width="70px" size="small" :inline="true">
      <el-row>
        <el-form-item label="模板类型" label-width="70px">
          <el-select v-model="search.smsTypeId" placeholder="请选择" clearable @clear="onSearch" @change="onSearch">
            <el-option v-for="(item) in smsTypeOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道商名称" label-width="80px">
          <el-select v-model.trim="search.channelId" placeholder="请输入" class="w-200" filterable clearable @clear="onSearch" @change="onSearch">
            <el-option v-for="(item) in ChannelOption" :key="item.id" :value="item.id" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="到达状态">
          <el-select v-model="search.receiveStatus" placeholder="请选择" class="w-200" clearable @clear="onSearch" @change="onSearch">
            <el-option v-for="(item, key) in receiveStatusOption" :key="key" :label="item" :value="Number(key)" />
          </el-select>
        </el-form-item>
        <el-form-item label="发送时间">
          <el-date-picker
            v-model="search.sendTime"
            style="width: 220px"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="timeChange"
            @blur="currentTime = ''"
          />
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form-item label-width="0px">
            <el-input v-model.trim="search.tem.value" placeholder="请输入内容" style="width: 333px" clearable @clear="onSearch" @keyup.enter.native="onSearch">
              <el-select slot="prepend" v-model="search.tem.label" placeholder="请选择" style="width: 133px;">
                <el-option v-for="item in searchTemOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button @click="onClear">重置</el-button>
          </el-form-item>
        </el-col>
        <el-col>
          <div class="searchFooter">
            <CustomTabelHeader :columns="columns" v-bind="$attrs" v-on="$listeners" />
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import CustomTabelHeader from './CustomTabelHeader'
import { searchTemOptions, receiveStatusOption } from './columns'
import { getSmsChannelList } from '@/api/system/sms.js'
import { smsTypeOption } from '../channelProvider/columns'
import moment from 'moment'
export default {
  components: {
    CustomTabelHeader
  },
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          smsTypeId: '', // 模板类型
          channelId: '', // 渠道商名称
          receiveStatus: '', // 到达状态
          sendTime: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')], // 发送时间
          tem: { label: 'phone', value: '' }
        }
      }
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentTime: '',
      smsTypeOption,
      receiveStatusOption,
      searchTemOptions,
      ChannelOption: [],
      pickerOptions: {
        disabledDate: (time) => {
          // 先限制今天之前
          if (time.getTime() > Date.now()) {
            return true
          }
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            // 一年以内
            // const one = 364 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            // const minTime = this.currentTime - one
            // const maxTime = this.currentTime + one
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
    this.init()
  },
  methods: {
    // 获取数据
    init() {
      const params = {
        pageIndex: 1,
        pageSize: 99999
      }
      getSmsChannelList(params).then(res => {
        this.ChannelOption = res.data.items
      })
    },
    onhandleAdd() {
      this.$emit('onhandleAdd')
    },
    onSearch() {
      this.$emit('onSearch')
    },
    onClear() {
      this.$emit('onClear')
    },
    timeChange(val) {
      if (!val) {
        this.search.sendTime = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
        this.$emit('onSearch')
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.filterTop {
  margin-top: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #E7E7E7;
  .searchFooter {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
  .el-input-group__append, .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
