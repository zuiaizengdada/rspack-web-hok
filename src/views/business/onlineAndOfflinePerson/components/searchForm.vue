<template>
  <div class="online-off-search">
    <div class="on-off-search-top">
      <div v-if="fromDepartment" @click="backToDepartMent">
        <MTitle class="on-off-search-title" style=" cursor: pointer;"><em class="back-to-qy">返回</em>个人经营数据</MTitle>
      </div>
      <MTitle v-else class="on-off-search-title" title="个人经营数据" />
      <div style="margin-left: 15px; float:left">
        <span>{{ nowUserData.nickName }}</span>
      </div>
      <AppDatepicker
        ref="HeadDatePickerPerson"
        style="width: 636px; float: right;"
        :show="[0,1, 2, 3, 4]"
        :default="3"
        :search="onlineAndOfflineForm.formData.time"
        :picker-options="pickerOptions"
        @change="timeChange"
      />
      <div class="right-fixed">
        <el-button class="right-fixed-btn" type="primary" size="small" @click="getAccountPlacement">投放账号数据</el-button>
      </div>
    </div>
    <div style="margin-bottom: 20px;">
      <chooseType ref="chooseType" @changeFormData="changeFormData" />
    </div>
    <div v-if="formSearchForm.offlineFlag === 0 || formSearchForm.offlineFlag === '0'" class="on-off-search-data" style="float: left;">
      <div class="on-off-revenue-performance">
        <span :class="revenType === 1?'active':''" @click="changeRevenType(1)">营收</span>
        <span :class="revenType === 2?'active':''" @click="changeRevenType(2)">业绩</span>
        <em :class="revenType === 2?'secord-em':''" />
      </div>
    </div>
    <tfDataDrawer ref="tfDataDrawer" />
  </div>

</template>

<script>
import AppDatepicker from './appDatePicker'
import chooseType from './onlineAndOffline/chooseType.vue'
import tfDataDrawer from './accountPlacement/tfDataDrawer.vue'
import { onlineAndOfflineForm } from './searchAndTable'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import {
  userNoPage
} from '@/api/addressBookApi'
export default {
  components: {
    AppDatepicker,
    tfDataDrawer,
    chooseType
  },
  data() {
    return {
      userArray: [],
      formSearchForm: {},
      fromDepartment: '',
      nowUserData: {},
      revenType: 1,
      onlineAndOfflineForm: {
        ...cloneDeep(onlineAndOfflineForm.form)
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
            // 2个月以内
            const minTime = moment(this.currentTime).subtract(12, 'month').valueOf()
            const maxTime = moment(this.currentTime).add(12, 'month').valueOf()
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
  provide() {
  },
  mounted() {
    this.fromDepartment = this.$route.query.employeeId
  },
  created() {
  },
  methods: {
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then((res) => {
          this.userArray = res.data
          this.userArray.some(item => {
            if (item.userId === this.formSearchForm.employeeUid) {
              this.nowUserData = item
            }
          })
        })
        .catch(() => {
        })
    },
    init(item) {
      this.formSearchForm = item
      console.log('ssssssss:', this.formSearchForm)
      this.revenType = this.formSearchForm.chooseType
      this.$nextTick(() => {
        this.onlineAndOfflineForm.formData.time = this.formSearchForm.time
        this.$refs.chooseType.loadData(item)
        this.$refs.HeadDatePickerPerson.changeAndFillDate(this.formSearchForm.time)
      })
      this.loadUserNoPage()
    },
    backToDepartMent() {
      this.$router.push({ path: '/business/onlineAndOffline' })
    },
    moment,
    // 时间改变触发
    timeChange(val) {
      this.onlineAndOfflineForm.formData.time = val
      console.log('IILLKKSS::', val)
      const item = {
        flag: 'time',
        time: val
      }
      this.$emit('changeFormData', item)
    },
    getAccountPlacement() {
      this.$nextTick(() => {
        this.$refs.tfDataDrawer.drawerFlag = true
        this.$refs.tfDataDrawer.toLoaderDeptID(this.formSearchForm.employeeDeptId, this.formSearchForm.employeeUid)
      })
    },
    changeRevenType(type) {
      this.revenType = type
      const item = {
        flag: 'chooseType',
        value: type
      }
      this.$emit('changeFormData', item)
    },
    changeFormData(item) {
      this.$emit('changeFormData', item)
    }
  }
}
</script>

    <style lang="scss" scoped>
    .online-off-search {
      width: 100%;
      padding: 20px;
      overflow: hidden;
      background: #fff;
      border-radius: 10px;
      padding-bottom: 0px;
      .on-off-search-title {
          float: left;
      }
    }
    .on-off-search-line {
      width: 100%;
      border-top: 1px solid #F2F2F2;
      display: inline-block;
    }
    .on-off-search-data {
      width: 100%;
      height: 60px;
    }
    .right-fixed {
      float: right;
      height: 40px;
      position: relative;
      text-align: right;
      z-index: 0;
      pointer-events: none;
      margin-right: 10px;
    }
    .right-fixed-btn {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 999;
      pointer-events: auto;
    }
    .on-off-revenue-performance {
      width: 100%;
      height: 40px;
      border-bottom: 1px solid #DCDEE1;
      position: relative;
      span {
        color: #000000;
        text-align: center;
        font-family: "Microsoft YaHei UI";
        font-size: 16px;
        height: 40px;
        line-height: 40px;
        font-style: normal;
        font-weight: 600;
        line-height: 16px;
        cursor: pointer;
        margin-right: 20px;
      }
      span.active {
        color: #0C6FFF;
      }
      em {
        position: absolute;
        width: 32px;
        height: 2px;
        left: 0;
        bottom: -1px;
        background: #0C6FFF;
        transition: all .3s;
      }
      em.secord-em {
        left: 52px;
      }
    }
    .back-to-qy {
      color: #000000;
      font-family: "Microsoft YaHei";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      width: 36px;
      text-align: center;
      height: 20px;
      flex-shrink: 0;
      border-radius: 4px;
      background: #EDEDED;
      font-style: normal;
      float: left;
      margin-right: 5px;
      margin-top: 3px;
    }
    </style>
