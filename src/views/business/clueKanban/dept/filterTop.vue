<template>
  <div class="allHeader">
    <div class="headerTop">
      <MTitle>{{ title }}<span class="updateTime">更新时间：{{ updateTime || '--' }}</span></MTitle>
      <AppDatepicker
        ref="AppDatepicker"
        style="width: 600px"
        :show="[0, 7, 'month', 'year']"
        :default="search.time.active"
        :search="search.time"
        :picker-options="pickerOptions"
        @change="timeChange"
        @blur="currentTime = ''"
      />
    </div>

    <div class="searchListCard">
      <div class="searchList" :class="{'active': search.current === 2}" style="width: 384px" @click="$store.commit('businessClue/SET_search', { key: 'current', data: 2 })">
        <div class="searchListUl">
          <formValue style="width: 230px;" label="已分配线索数" tips="定义：所有已入库的线索总数" :label-style="{fontSize: '16px'}" type="money" :value="clueBasicSum.allocatedClueSum" :loading="loading" />
          <formValue label="同比" type="scale" :value="clueBasicSum.allocatedClueSumWave" :loading="loading" />
        </div>
        <div class="searchListUl">
          <formValue style="width: 230px;" label="本月" :value="clueBasicSum.currentMonthClueSum" :loading="loading" />
          <formValue label="上月" :value="clueBasicSum.lastMonthClueSum" :loading="loading" />
        </div>
      </div>
      <!-- <div class="searchList" :class="{'active': search.current === 2}" @click="$store.commit('businessClue/SET_search', { key: 'current', data: 2 })">
        <div>
          <formValue style="width: 250px;" label="已分配线索" :label-style="{fontSize: '16px'}" type="money" tips="定义：所有已分配的线索总数" :value="clueBasicSum.allocatedClueSum" :loading="loading" />
        </div>
        <div style="margin-top: 12px"><formValue style="width: 230px;" label="同比" type="scale" :value="clueBasicSum.allocatedClueSumWave" :loading="loading" /></div>
      </div> -->
      <div class="searchList" :class="{'active': search.current === 3}" @click="$store.commit('businessClue/SET_search', { key: 'current', data: 3 })">
        <div>
          <formValue style="width: 250px;" label="已转化线索" :label-style="{fontSize: '16px'}" type="money" tips="定义：当前部门分配的线索中已转化的线索总数" :value="clueBasicSum.transformedClueSum" :loading="loading" />
        </div>
        <div style="margin-top: 12px"><formValue style="width: 230px;" label="同比" type="scale" :value="clueBasicSum.transformedClueSumWave" :loading="loading" /></div>
      </div>
      <div class="searchList" :class="{'active': search.current === 4}" @click="$store.commit('businessClue/SET_search', { key: 'current', data: 4 })">
        <div>
          <formValue style="width: 250px;" label="转化总金额" :label-style="{fontSize: '16px'}" type="money" tips="定义：已转化的线索，已支付金额之和" :value="clueBasicSum.transformedMoneySum" :loading="loading" />
        </div>
        <div style="margin-top: 12px"><formValue style="width: 230px;" label="同比" type="scale" :value="clueBasicSum.transformedMoneySumWave" :loading="loading" /></div>
      </div>
      <div class="searchList" :class="{'active': search.current === 5}" @click="$store.commit('businessClue/SET_search', { key: 'current', data: 5 })">
        <div>
          <formValue style="width: 230px;" label="转化率" :label-style="{fontSize: '16px'}" type="money" tips="定义：当前部门已分配线索中已转化的线索 / 当前部门分配线索总数" :value="clueBasicSum.transformedRate" :loading="loading" />
        </div>
        <div style="margin-top: 12px"><formValue style="width: 230px;" label="同比" type="scale" :value="clueBasicSum.transformedRateWave" :loading="loading" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import AppDatepicker from '@/components/AppDatePicker'
import formValue from '../component/formValue.vue'
import moment from 'moment'
import { mapState } from 'vuex'
export default {
  components: {
    AppDatepicker,
    formValue
  },
  props: {
    title: {
      type: String,
      default: '线索数据'
    }
  },
  data() {
    return {
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
      loading: false
    }
  },
  computed: {
    ...mapState({
      clueBasicSum: state => state.businessClue.clueBasicSum,
      updateTime: state => state.businessClue.updateTime,
      search: state => state.businessClue.search
    })
  },
  mounted() {},
  methods: {
    timeChange(val) {
      this.$store.commit('businessClue/SET_search', { key: 'time', data: val })
    }
  }
}
</script>

<style lang='scss' scoped>
.allHeader {
  padding: 0 20px;
  .headerTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .updateTime {
      margin-left: 20px;
      font-size: 14px;
      font-family: AppleSystemUIFont;
      color: #777777;
      line-height: 22px;
      font-weight: 500;
    }
  }
  .searchListCard {
    display: flex;
    flex-wrap: wrap;
    padding-top: 24px;
    .searchList {
      width: 275px;
      margin-bottom: 20px;
      margin-right: 20px;
      // height: 98px;
      background: #FAFAFA;
      border-radius: 8px;
      padding: 22px 16px 20px;
      cursor: pointer;
      border: 1px solid #fff;
      .searchListUl {
        display: flex;
      }
      .searchListUl + .searchListUl {
        margin-top: 12px;
      }
      &:nth-last-child(1) {
        margin-right: 0;
      }
    }
    .active {
      background: #F2F9FF;
      box-shadow: 0px 2px 4px 0px rgba(12,111,255,0.2);
      border-radius: 8px;
      border: 1px solid #0C6FFF;
    }
  }
}
</style>
