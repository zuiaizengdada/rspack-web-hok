<template>
  <div class="allHeader">
    <div class="headerTop">
      <MTitle>
        数据概况
        <el-tooltip class="item" effect="dark" content="课程金额大于等于1000元订单汇总" placement="top-start">
          <svg-icon icon-class="tips" class="titleIcon" style="stroke:currentColor" />
        </el-tooltip>
      </MTitle>
      <AppDatepicker
        ref="AppDatepicker"
        style="width: 558px"
        :show="[1,7, 'month','year']"
        default="month"
        :search="search.time"
        :picker-options="pickerOptions"
        @change="timeChange"
        @blur="currentTime = ''"
      />
    </div>
    <div class="headerSelect">
      <el-form :inline="true" :model="form" size="small">
        <el-form-item label="渠道">
          <m-select v-model="form.channelSource" :all="true" :dict-list="channelsource" @change="onHandleChannelSource" />
        </el-form-item>
        <el-form-item label="IP">
          <TeacherSelect
            ref="teacherSelect"
            :default-tearch-id="form.tearch.lecturerId"
            :value="form.tearch.lecturerName"
            @selected="teacherSelect"
          />
        </el-form-item>
        <el-form-item label="交付形式">
          <m-select v-model="form.deliveryType" dict-key="DELIVERY_SHAPE" @change="handleDeliveryType" />
        </el-form-item>
        <el-form-item label="课程名称" prop="goodsName">
          <courseSelect
            ref="CourseSelect"
            :multiple="true"
            :lecturer-id="form.tearch.lecturerId"
            style="width: 200px"
            :tab-list="tabList"
            :default-id="form.goodsId"
            :current-id="tabList[0].id"
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
        <el-col :key="index" :span="4">
          <dataCource
            v-if="!(item.prop === 'costItem' && (form.channelSource!=='' || form.deliveryType===1 || form.goods.some(item=>item.goodsType!==5)))"
            :if-money="['recruitItem', 'deliveredFeeItem', 'refundedItem', 'costItem'].includes(item.prop) "
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
import { getDataBoardDeliveryItem } from '@/api/deliver/deliverStatistics'
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
        goodsName: [],
        goodsId: [],
        goods: []
      },
      dataCourceList: [
        { prop: 'recruitItem', key: '招生', title: '总招生金额', tips: '所选时间段内课程价格大于等于1000元的子订单付款金额汇总减去时间段内课程价格大于等于1000元的子订单已退款金额汇总<br>按订单付款时间', number: 0, arr: ['', ''] },
        { prop: 'deliveredFeeItem', key: '交付', title: '总交付金额', tips: '所选时间段内交付状态为已交付的课程订单付款总金额<br/>线下课按班期结束时间计算<br/>视频课按实际交付时间计算', number: 0, arr: ['', ''] },
        { prop: 'refundedItem', key: '退款', title: '总退款金额', tips: '所选时间段内已退款总金额(按退款通过时间统计)', number: 0, arr: ['', ''] },
        { prop: 'costItem', key: '支出成本', title: '支出成本金额', tips: '课程金额大于等于1000元并且已确认盈亏的支出成本汇总(按课程班期结束时间统计)', number: 0, arr: ['', ''] },
        { prop: 'toDeliveryUserItem', key: '待完成交付学员', title: '待完成交付学员数', tips: '查询时间段内支付成功的交付学员到目前为止仍未完成交付的学员人数;待完成交付是指:交付状态为待交付,延期交付,锁定交付,交付中', number: 0, arr: ['', ''] },
        { prop: 'deliveredUserItem', key: '已交付学员', title: '已交付学员数', tips: '交付状态为已交付的学员人数汇总(按班期结束时间计算)', number: 0, arr: ['', ''] }
      ],
      params: {
        deliveryFlag: 1 // 1交付 2导流
      }
    }
  },
  computed: {
    ...mapGetters(['channelsource', 'dictList']),
    tabList() {
      if (this.form.deliveryType === 1) {
        return [
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' }
        ]
      }
      if (this.form.deliveryType === 2) return [{ id: '5', name: '线下课', api: '' }]
      return [
        { id: '3', name: '普通专栏', api: '' },
        { id: '4', name: '大专栏', api: '' },
        { id: '5', name: '线下课', api: '' }
      ]
    }
  },
  created() {
    this.$store.dispatch('option/getConfigChannelsource')
  },
  mounted() {},
  methods: {
    timeChange(val) {
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
    teacherSelect(val) {
      this.form.tearch.lecturerId = val.lecturerId
      this.form.tearch.lecturerName = val.lecturerName

      this.getTabList()
    },
    handleDeliveryType() {
      this.form.goodsId = []
      this.form.goodsName = []
      this.form.goods = []
      this.getTabList()
    },
    courseSelect(val, keyList) {
      // // 选中的为空
      if (!keyList.length) {
        this.form.goodsId = []
        this.form.goodsName = []
        this.form.goods = []
        this.getTabList()
        return
      }

      // 存在选中状态
      // 合并过滤
      const newVal = [...val, ...this.form.goods]
      const copyVal = newVal.reduce((prev, cur) => {
        const bol = prev.every(item => item.goodsId !== cur.goodsId) && cur.goodsType
        if (bol) return [...prev, cur]
        return [...prev]
      }, [])
      const list = copyVal.filter(item => keyList.includes(item.goodsId))
      this.form.goodsId = list.map(item => item.goodsId)
      this.form.goodsName = list.map(item => item.contentName)
      this.form.goods = list
      this.getTabList()
    },
    // 获取tab栏数据
    getTabList() {
      this.loading = true
      const params = {
        channelSource: this.form.channelSource,
        endTime: this.search.time.time[1],
        startTime: this.search.time.time[0],
        goodsIdList: this.form.goodsId.join(','),
        lecturerId: this.form.tearch.lecturerId,
        deliveryType: this.form.deliveryType
      }
      getDataBoardDeliveryItem(params).then(res => {
        this.dataCourceList.forEach((v) => {
          v.number = res.data[v.prop].sumData
          v.arr = [res.data[v.prop].linkRelativeRatio, res.data[v.prop].yearBasisRatio]
        })
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
    // 渠道变化
    onHandleChannelSource(val) {
      console.log(val, '渠道变化')
      if (val !== '' && this.search.current === 3) {
        this.search.current = 0
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
        goodsName: [],
        goods: [],
        goodsId: []
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
