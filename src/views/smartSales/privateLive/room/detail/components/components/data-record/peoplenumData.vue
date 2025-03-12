<template>
  <div class="pageWrap">
    <div class="titleHeader">
      <MTitle>
        <span>人数数据</span>
        <el-tooltip
          class="item"
          :content="'统计范围为创建直播时间到直播结束后48小时。'"
          placement="top"
        >
          <img src="@/assets/image/product/icon.png" class="iconText" />
        </el-tooltip>
      </MTitle>
      <div class="trp">
        统一按
        <el-select v-model="type" placeholder="" @change="typeChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        查看报名率、到课率、 完课率、转化率的数据。
      </div>
    </div>
    <div class="pageContent">
      <viewData
        :loading="orderData.loading"
        class="pageContentView"
        title="计划看播用户"
        :data="orderData.planWatchUserNum"
        tips="指关联任务线索和导入用户的计划看播用户。"
      />
      <viewData
        :loading="orderData.loading"
        class="pageContentView"
        title="邀约人数"
        :data="orderData.invitePeopleNum"
        tips="指发送了邀约链接，并且点击的人数，包含二次分享的人数。"
      />
      <viewData
        :loading="orderData.loading"
        class="pageContentView"
        title="报名人数"
        rate-text="报名率"
        :rate="(peopleData.signUpRate || 0) + '%'"
        :data="orderData.signUpPeopleNum | filtersMoneyByWang"
        tips="指在直播间报名页面报名的人数，包含二次分享的报名人数。"
      />
      <viewData
        :loading="orderData.loading"
        class="pageContentView"
        title="到课人数"
        rate-text="到课率"
        :rate="(peopleData.attendRate || 0) + '%'"
        :data="orderData.attendPeopleNum | filtersMoneyByWang"
        :tips="`指从开播时间开始，观看时长大于${attendClassTime}分钟的人数（含游客）`"
      />
      <viewData
        :loading="orderData.loading"
        class="pageContentView"
        title="完课人数"
        rate-text="完课率"
        :rate="(peopleData.finishRate || 0) + '%'"
        :data="orderData.finishPeopleNum | filtersMoneyByWang"
        :tips="`指直播中的听课时长大于${finishClassTime}分钟的人数（含游客）`"
      />
      <viewData
        :loading="orderData.loading"
        class="pageContentView"
        title="转化人数"
        rate-text="转化率"
        :rate="(peopleData.transformUserCountRate || 0) + '%'"
        :data="orderData.transformUserCount | filtersMoneyByWang"
        tips="指在直播间下订单已付款的人数"
      />
    </div>
  </div>
</template>

<script>
import viewData from './viewData.vue'
import { getpeopleData } from '@/api/liveRoom/kanban.js'
import { mapState } from 'vuex'

export default {
  components: {
    viewData
  },
  props: {
    orderData: {
      type: Object,
      default: () => {
        return {
          loading: false,
          invitePeopleNum: 0, // 邀约人数
          planWatchUserNum: 0,
          doneOrderAmount: 0, // 成交金额
          doneOrderCount: 0, // 成交订单数
          refundAmount: 0, // 退款金额
          revenue: 0, // 实际营收
          transformOrderCount: 0, // 转化订单数
          transformOrderCountRate: '0%', // 转化订单率
          transformUserCount: 0, // 转化人数
          transformUserCountRate: '0%', // 转化人数率
          waitingAmount: 0 // 待付款金额
        }
      }
    }
  },
  data() {
    return {
      peopleData: {
        attendRate: 0, // 到课率
        finishRate: 0, // 完课率
        signUpRate: 0, // 报名率
        transformUserCountRate: 0 // 转化人数率
      },
      type: 'planWatchRate',
      options: [
        {
          value: 'planWatchRate',
          label: '计划看播用户'
        },
        {
          value: 'planWatchRefundRate',
          label: '计划开播用户-退款用户'
        },
        {
          value: 'lastPeopleRate',
          label: '对比上一环节人数'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      attendClassTime: state => state.liveSetting.attendClassTime,
      finishClassTime: state => state.liveSetting.finishClassTime
    })
  },
  watch: {
    orderData: {
      handler() {
        this.typeChange()
      },
      deep: true
    }
  },
  mounted() {
    this.$store.dispatch('liveSetting/getLiveRoomOrgConfig')
    // this.getData()
  },
  methods: {
    typeChange() {
      this.peopleData = {
        ...this.orderData[this.type]
      }
    },
    getData() {
      this.peopleData.loading = true
      const data = {
        liveRoomId: this.$route.params.id
      }
      getpeopleData(data)
        .then(res => {
          this.peopleData = {
            attendPeopleNum: Number(res.data.attendPeopleNum), // 到课人数
            attendRate: Number(res.data.attendRate / 100), // 到课率
            finishPeopleNum: Number(res.data.finishPeopleNum), // 完课人数
            finishRate: Number(res.data.finishRate / 100), // 完课率
            invitePeopleNum: Number(res.data.invitePeopleNum), // 邀约人数
            signUpPeopleNum: Number(res.data.signUpPeopleNum), // 报名人数
            signUpRate: Number(res.data.signUpRate / 100), // 报名率
            loading: false
          }
        })
        .catch(() => {
          this.peopleData.loading = false
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.pageWrap {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  .titleHeader {
    padding-left: 20px;
    height: 62px;
    background: #f9fbff;
    display: flex;
    align-items: center;
    .iconText {
      width: 16px;
      height: 16px;
      margin-left: 4px;
    }
  }
  .pageContent {
    padding: 16px 30px 21px;
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    .pageContentView {
      flex: 1;
    }
  }
}
.trp {
  font-size: 12px;
  color: #535353;
  margin-left: 10px;
}
::v-deep {
  .MTitle {
    .title {
      display: flex;
      align-items: center;
    }
  }
}
</style>
