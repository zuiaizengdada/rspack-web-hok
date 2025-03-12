<template>
  <div class="personData">
    <!-- <div class="personDataHeader">
      <div class="personDataHeaderLeft" @click="onHandleBack"><i class="el-icon-arrow-left backIcon" />返回</div>
    </div> -->
    <div class="formData">
      <div class="formDataItem formDataItem1  flex-1">
        <div class="formDataItemValue formDataItemValue1">员工姓名: {{ form.userName }}</div>
      </div>
      <div class="flex">
        <div class="formDataItem flex-1">
          <div class="formDataItemLabel">到课人数</div>
          <div class="formDataItemValue">{{ form.attendPeopleNum }}</div>
        </div>
        <div class="formDataItem flex-1">
          <div class="formDataItemLabel">未支付</div>
          <div class="formDataItemValue">{{ form.unpaidOrderCount }}</div>
        </div>
      </div>
      <div class="flex">
        <div class="formDataItem flex-1">
          <div class="formDataItemLabel">已支付笔数</div>
          <div class="formDataItemValue">{{ form.paidOrderCount }}</div>
        </div>
        <div class="formDataItem flex-1">
          <div class="formDataItemLabel">已付款GMV</div>
          <div class="formDataItemValue">{{ form.gmv | filtersMoneyByZero }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { personalOverview } from '@/api/liveRoom/liveRoom.js'
export default {
  components: {},
  data() {
    return {
      loading: false,
      form: {
        // 员工姓名
        userName: '',
        // 到课人数
        attendPeopleNum: 0,
        // 未支付
        unpaidOrderCount: 0,
        // 已支付笔数
        paidOrderCount: 0,
        // 已付款GMV
        gmv: 0
      },
      liveRoomId: this.$route.params.id
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ...mapState({
      groupId: state => state.im.liveRoomDetail.groupId
    })
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    onHandleBack() {
      this.$emit('onBack')
    },
    getDetail() {
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId,
        groupId: this.groupId,
        userId: this.userInfo.userId
      }
      personalOverview(data).then(res => {
        if (res.data) {
          this.form = res.data
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
.personData {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background: linear-gradient(180deg, #D7FEFF 0%, #FFF 100%);
  .personDataHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    .personDataHeaderLeft {
      color: #999999;
      font-family: "Microsoft YaHei";
      font-size: 12px;
      font-style: normal;
      font-weight: Normal;
      display: flex;
      align-items: center;
      cursor: pointer;
      &:hover {
        color: #0C6FFF;
      }
      .backIcon {
        font-size: 15px;
      }
    }
  }
  .formData {
    margin: 25px 90px 20px;
    .formDataItem {
      overflow: hidden;
      border-radius: 10px;
      background: #0000000d;
      padding: 20px 0 15px;
      margin-right: 20px;
      margin-bottom:20px;
      text-align: center;
      .formDataItemLabel {
        color: #000000;
        font-size: 14px;
        margin-bottom: 5px;
      }
      .formDataItemValue {
        color: #000000;
        font-size: 20px;
        font-weight: Bold;
        font-family: 'DIN Alternate';
        font-style: normal;
      }
      .formDataItemValue1{
        font-size: 16px;
      }
    }
    .formDataItem1{
      padding: 15px 0;
    }
  }
}
</style>
