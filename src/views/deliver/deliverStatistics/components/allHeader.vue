<template>
  <div class="allHeader">
    <div class="headerTop">
      <MTitle>
        数据概况
        <el-tooltip class="item" effect="dark" content="所有订单汇总" placement="top-start">
          <svg-icon icon-class="tips" class="titleIcon" style="stroke:currentColor" />
        </el-tooltip>
      </MTitle>
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
    <div class="headerSelect">
      <el-form :inline="true" :model="form" size="small">
        <el-form-item label="渠道">
          <el-select v-model="form.channelSource" clearable @change="getTabList">
            <el-option label="全部" value="" />
            <el-option v-for="(item) in channelsource" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="IP">
          <TeacherSelect
            ref="teacherSelect"
            :default-tearch-id="form.tearch.lecturerId"
            :value="form.tearch.lecturerName"
            @selected="teacherSelect"
          />
        </el-form-item>
        <el-form-item label="课程名称">
          <courseSelect
            ref="CourseSelect"
            style="width: 200px"
            :default-id="form.goodsId"
            :tab-list="tabList"
            current-id="0"
            :value="form.goodsName"
            @selected="courseSelect"
          />
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="clear()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row :gutter="24">
      <template v-for="(item, index) in dataCourceList">
        <el-col :key="index" :span="8">
          <dataCource
            :if-current="search.current === index"
            :title="item.title"
            :number="item.number"
            :value-arr="item.arr"
            :tips="item.tips"
            @click="courceChange(index, item)"
          />
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import AppDatepicker from '@/components/AppDatePicker'
import dataCource from './dataCource.vue'
import TeacherSelect from '../../components/tearchSelect.vue'
import courseSelect from '../../components/courseSelect.vue'
import { getAllDataInfo } from '@/api/deliver/deliverStatistics'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  components: {
    AppDatepicker,
    dataCource,
    TeacherSelect,
    courseSelect
  },
  data() {
    return {
      search: {
        time: {
          active: 7,
          time: ['', '']
        },
        current: 0
      },
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
      },
      form: {
        channelSource: '',
        tearch: { lecturerName: '', lecturerId: '' },
        goodsName: '',
        goodsId: ''
      },
      dataCourceList: [
        {
          id: 1,
          prop: 'recruitItem',
          key: '招生',
          title: '总招生金额',
          tips: '所选时间段内订单付款金额汇总(减去已退款金额)',
          number: 0,
          arr: ['', '']
        },
        {
          id: 2,
          prop: 'deliveredFeeItem',
          key: '交付',
          title: '总交付金额',
          tips: '导流课程总招生金额+交付课程已交付金额',
          number: 0,
          arr: ['', '']
        },
        {
          id: 3,
          prop: 'refundedItem',
          key: '退款',
          title: '总退款金额',
          tips: '所选时间段内已退款总金额(按退款通过时间统计)',
          number: 0,
          arr: ['', '']
        }
      ],
      tabList: [
        { id: '0', name: '图文', api: '' },
        { id: '1', name: '音频', api: '' },
        { id: '2', name: '视频', api: '' },
        { id: '3', name: '普通专栏', api: '' },
        { id: '4', name: '大专栏', api: '' },
        { id: '5', name: '线下课', api: '' }
        // { id: '6', name: '直播专栏', api: '' }
      ],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['channelsource'])
  },
  created() {
    this.$store.dispatch('option/getConfigChannelsource')
  },
  mounted() {},
  methods: {
    // 时间改变触发
    timeChange(val) {
      console.log(val)
      this.search.time = val
      this.getTabList()
    },
    courceChange(index, item) {
      this.search.current = index
      this.$emit('change', {
        ...this.dataCourceList[this.search.current],
        time: this.search.time.time,
        ...this.form
      })
    },
    // 获取tab栏数据
    getTabList() {
      this.loading = true
      const params = {
        channelSource: this.form.channelSource,
        endTime: this.search.time.time[1],
        startTime: this.search.time.time[0],
        goodsId: this.form.goodsId,
        lecturerId: this.form.tearch.lecturerId
      }
      getAllDataInfo(params).then(res => {
        console.log(res)
        if (res.data) {
          this.dataCourceList.forEach((v) => {
            v.number = res.data[v.prop].sumData
            v.arr = [res.data[v.prop].linkRelativeRatio, res.data[v.prop].yearBasisRatio]
          })
        }
        this.$emit('change', {
          ...this.dataCourceList[this.search.current],
          time: this.search.time.time,
          ...this.form
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    teacherSelect(val) {
      this.form.tearch.lecturerId = val.lecturerId
      this.form.tearch.lecturerName = val.lecturerName

      this.getTabList()
    },
    courseSelect(val) {
      if (val.length > 0) {
        this.form.goodsId = val[0].goodsId
        this.form.goodsName = val[0].contentName
      }
      this.getTabList()
    },
    // 点击重置按钮
    clear() {
      this.search = {
        time: {
          active: 7,
          time: ['', '']
        },
        current: 0
      }
      this.form = {
        channelSource: '',
        tearch: { lecturerName: '', lecturerId: '' },
        goodsName: '',
        goodsId: ''
      }
      this.$refs.AppDatepicker.timeChange()
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
  .headerSelect {
    margin-top: 20px;
  }
  .titleIcon {
     color: #999;
  }
}
</style>
