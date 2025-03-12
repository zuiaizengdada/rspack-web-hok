<template>
  <div v-loading="loading" class="scheduleDetails">
    <el-row>
      <el-col :span="24">
        <div class="detailForm">
          <div class="detailFormLabel">IP：</div>
          <div class="detailFormValue">{{ detail.lecturerNameList | filtersTearch }}</div>
        </div>
      </el-col>
      <el-col :span="24" class="m-t-16">
        <div class="detailForm">
          <div class="detailFormLabel">课程名称：</div>
          <div class="detailFormValue">
            <el-tag
              v-for="item in detail.goodsNameList"
              :key="item"
              class="tagStype"
              type="info"
            >
              {{ item }}
            </el-tag>
          </div>

          <!-- <div class="detailFormValue">{{ detail.goodsName }}</div> -->
        </div>
      </el-col>
    </el-row>
    <el-row class="m-t-16">
      <el-col :span="12">
        <div class="detailForm">
          <div class="detailFormLabel">班期：</div>
          <div class="detailFormValue">{{ detail.scheduleNum }}</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="detailForm">
          <div class="detailFormLabel">容纳人数：</div>
          <div class="detailFormValue">{{ detail.capacity }}人</div>
        </div>
      </el-col>
    </el-row>
    <el-row class="detailForm m-t-16">
      <div class="detailFormLabel">班主任：</div>
      <div class="detailFormValue">
        <headmasterChange v-if="detail.scheduleHeadteacherVoList.length > 0" :data="detail.scheduleHeadteacherVoList" :li-style="{width: '142px', marginRight: '20px'}" width="504px" disabled />
        <div v-else>
          暂无班主任
        </div>
      </div>
    </el-row>
    <el-row class="m-t-16 detailForm">
      <div class="detailFormLabel">交付日期：</div>
      <div class="detailFormValue">{{ detail.deliveryStartTime }}～{{ detail.deliveryEndTime }}</div>
    </el-row>
    <el-row class="m-t-16 detailForm">
      <div class="detailFormLabel">交付地点：</div>
      <div class="detailFormValue">{{ detail.districtName | filtersDistrictName }}</div>
    </el-row>
    <el-row class="m-t-16 detailForm">
      <div class="detailFormLabel">交付场次：</div>
      <div class="detailFormValue">
        <div v-for="(item, index) in detail.sessionList" :key="index" class="m-b-8">
          {{ item }}
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import headmasterChange from './headmasterChange.vue'
import { getDeliveryScheduleDetail } from '@/api/deliver/scheduleManagement'
export default {
  components: {
    headmasterChange
  },
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
      getDeliveryScheduleDetail(this.scheduleId).then(res => {
        this.detail = {
          ...this.detail,
          ...res.data
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.scheduleDetails {
  padding: 20px;
  .detailForm {
    display: flex;
    flex-wrap: wrap;
    .detailFormLabel {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 24px;
      width: 80px;
      text-align: right;
    }
    .detailFormValue {
      flex: 1 0 0;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 24px;
    }
  }

  .listView {
    width: 504px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px dashed #979797;
    display: flex;
    flex-wrap: wrap;
    padding: 8px 16px;
    .listLi {
      padding: 4px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 143px;
      height: 32px;
      background: #E6F4FF;
      border-radius: 4px;
      margin-right: 20px;
      margin-top: 8px;
      margin-bottom: 8px;
      .text_hidden_ellipsis {
        width: 163px;
      }
      &:nth-child(3n + 3) {
        margin-right: 0;
      }
    }
    .More {
      background: #fff;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #0C6FFF;
      line-height: 22px;
      padding-left: 0;
      cursor: pointer;
    }
  }
}
.m-b-8 {
  margin-bottom: 8px;
}
.tagStype{
  margin-bottom: 5px;
  margin-right: 5px;
}
</style>
