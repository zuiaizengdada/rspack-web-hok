<template>
  <div class="select-class-info">
    <div class="select-class-info-item">
      <div class="select-class-info-item-label">班级名称</div>
      <div class="select-class-info-item-value">{{ detail.scheduleNum }}</div>
    </div>

    <div class="select-class-info-item">
      <div class="select-class-info-item-label">课程名称</div>
      <div class="select-class-info-item-value">
        <el-tag
          v-for="item in detail.goodsNameList"
          :key="item"
          style="margin-right: 10px"
          size="medium"
          type="info"
        >
          {{ item }}
        </el-tag>
      </div>
    </div>

    <div class="select-class-info-item">
      <div class="select-class-info-item-label">开班时间</div>
      <div class="select-class-info-item-value">
        {{ detail.deliveryStartTime }}
      </div>
    </div>

    <div class="select-class-info-item">
      <div class="select-class-info-item-label">计划班级人数</div>
      <div v-if="detail.capacity" class="select-class-info-item-value">
        {{ detail.capacity }}人
      </div>
    </div>

    <div class="select-class-info-item">
      <div class="select-class-info-item-label">解锁方式</div>
      <div class="select-class-info-item-value">
        {{
          detail.courseUnlockType
            ? detail.courseUnlockType === 1
              ? '自由模式'
              : '闯关模式'
            : '自由模式'
        }}
      </div>
    </div>

    <div class="select-class-info-item">
      <div class="select-class-info-item-label">入班规则</div>
      <div class="select-class-info-item-value">
        {{
          detail.classNum || detail.autoEnterClass && detail.dateEnterClassStartTime
            ? `智能销售入班 、按日期入班: ${detail.dateEnterClassStartTime} - ${detail.dateEnterClassEndTime}`
            : detail.autoEnterClass
              ? '智能销售入班'
              : detail.dateEnterClassStartTime
                ? `按日期入班: ${detail.dateEnterClassStartTime} - ${detail.dateEnterClassEndTime}`
                : '智能销售入班'
        }}
      </div>
    </div>
  </div>
</template>

<script>
// import headmasterChange from '../../headmasterChange.vue'
import { getDeliveryScheduleDetail } from '@/api/deliver/scheduleManagement'
export default {
  components: {},
  filters: {
    filtersTearch(val) {
      if (!val || val.length === 0) {
        return '--'
      } else {
        return val.join(',')
      }
    },
    filtersDistrictName(val) {
      if (!val) {
        return ''
      } else {
        return val.replace('\t', '-')
      }
    }
  },
  props: {
    scheduleId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      selectedClass: {},
      detail: {
        capacity: '', // 容纳人数
        costCheckStatus: '', // 成本核算状态1待录入，2待确认，3已确认，默认未待录入
        deliveryEndTime: '', // 交付结束时间
        deliveryStartTime: '', // 交付开始时间
        expectProfit: 0, // 预期利润，单位分
        goodsName: '', // 课程名称
        id: '',
        lecturerNames: '', // 讲师名称
        scheduleHeadteacherVoList: [], // 班主任列表
        scheduleNum: '', // 班期数
        scheduleStatus: '', // 班期状态
        scheduleStatusName: '', // 班期状态名称
        sessionList: [], // 交付场次
        sessionNum: 0, // 场次数量
        districtName: '', // 交付地点
        totalCost: 0 // 总成本，单位分
      }
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    // 获取班期详情
    getDetail() {
      this.loading = true
      getDeliveryScheduleDetail(this.scheduleId)
        .then(res => {
          this.detail = {
            ...this.detail,
            ...res.data
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.select-class-info {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  margin-top: 20px;

  &-item {
    display: flex;
    margin-top: -1px;

    &:first-child {
      margin-top: 0;
      .select-class-info-item-label {
        border-radius: 10px 0 0 0;
      }
      .select-class-info-item-value {
        border-radius: 0 10px 0 0;
      }
    }

    &:last-child {
      .select-class-info-item-label {
        border-radius: 0 0 0 10px;
      }
      .select-class-info-item-value {
        border-radius: 0 0 10px 0;
      }
    }

    &-label {
      width: 120px;
      color: #000000;
      background-color: #fafafa;
      font-size: 14px;
      display: flex;
      align-items: center;
      padding: 10px 15px;
      border: 1px solid #dcdee1;
    }

    &-value {
      padding: 10px 15px;
      display: flex;
      align-items: center;
      flex: 1;
      color: #555555;
      font-size: 14px;
      border: 1px solid #dcdee1;
      margin-left: -1px;
      p {
        margin: 0;
        line-height: 1.5;
      }
    }
  }
}
</style>
