<template>
  <div class="top-cls">
    <div v-if="isBackDetp" class="back-detp">
      <i class="el-icon-arrow-left" @click="backDeptData" />
      <span @click="backDeptData">部门经营数据</span>
    </div>
    <div class="data-search">
      <span class="left-title"> <i class="gun" />{{ title }}</span>
      <span v-if="newTime" class="updata-time">更新时间：{{ newTime }}</span>
      <div v-if="!isQuanyu" class="switch-type" @click="changeIsRevenue">
        <div
          :class="{
            'switch-type-item': true,
            'switch-type-item-active': form.isRevenue
          }"
        >
          营收
        </div>
        <div
          :class="{
            'switch-type-item': true,
            'switch-type-item-active': !form.isRevenue
          }"
        >
          业绩
        </div>
      </div>
      <div class="right-search">
        <headDatePicker
          ref="HeadDatePicker"
          style="width: 558px"
          :show="[1, 2, 3, 4]"
          :search="form.time"
          :picker-options="pickerOptions"
          @change="timeChange"
          @blur="currentTime = ''"
        />
      </div>
    </div>
  </div>
</template>
<script>
import headDatePicker from './headDatePicker/index.vue'
import { getItem } from '@/utils/localStorage'
import moment from 'moment'

export default {
  components: {
    headDatePicker
  },
  props: {
    newTime: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isQuanyu: false,
      cascaderProps: {
        checkStrictly: true,
        value: 'id'
      },
      currentTime: '',
      pickerOptions: {
        disabledDate: time => {
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
            const minTime = moment(this.currentTime)
              .subtract(1, 'years')
              .valueOf()
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
        isRevenue: true,
        time: {
          active: 1,
          time: []
        }
      },
      showLoading: false,
      timeType: new Map([
        ['', ''],
        [1, 1],
        [2, 2],
        [3, 3],
        [4, 4]
      ])
    }
  },
  computed: {
    title() {
      const id = this.$route.query?.uId
      const name = id
        ? this.$route.query.uName
        : this.$store.state.user.userInfo.nickName
      return name
    },
    isBackDetp() {
      return !!this.$route.query?.uId
    }
  },
  created() {
    const orgItem = getItem('orgInfo')
    if (orgItem.organizationId === 1006) {
      this.isQuanyu = true
      this.form.isRevenue = !this.isQuanyu
    }
    if (this.$route.query?.uId) {
      this.$nextTick(() => {
        const tmpInfo = JSON.parse(localStorage.getItem('tmpFormPersonBoardHK'))
        this.form = {
          ...this.form,
          ...tmpInfo,
          employeeUid: this.$route.query?.uId
        }
        this.form.time = tmpInfo.time
      })
    }
  },
  destroyed() {
    localStorage.removeItem('tmpFormPersonBoardHK')
  },
  mounted() {},
  methods: {
    backDeptData() {
      localStorage.removeItem('tmpFormPersonBoardHK')
      localStorage.setItem(
        'tmpFormBusinessDataBoardHK',
        JSON.stringify({ ...this.form })
      )
      localStorage.removeItem('tmpFormPersonBoardHK')
      this.$router.push({
        path: '/business/businessData',
        query: {
          deptId: this.$route.query?.deptId
            ? this.$route.query.deptId
            : undefined
        }
      })
    },
    changeIsRevenue() {
      this.form.changeIsRevenue = true
      this.form.isRevenue = !this.form.isRevenue
      // this.form.bizType = this.form.isRevenue ? 3 : 1
      this.onSubmit()
    },
    onSubmit() {
      this.showLoading = true
      const that = this
      setTimeout(() => {
        that.showLoading = false
      }, 2000)
      this.$emit(
        'change',
        {
          ...this.form,
          isRevenue: this.form.isRevenue,
          time: {
            active: this.timeType.get(this.form.time.active),
            time: this.form.time.time
              ? [this.form.time.time[0], this.form.time.time[1]]
              : []
          }
        },
        {}
      )
    },
    resetForm() {
      this.form = {
        isRevenue: true,
        time: {
          active: 1,
          time: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
        }
      }
      this.$emit('resetForm', { ...this.form })
    },
    // 更新form数据
    update() {
      this.$emit('change', {
        ...this.form,
        isRevenue: this.form.isRevenue,
        time: {
          active: this.timeType.get(this.form.time.active),
          time: this.form.time.time
            ? [this.form.time.time[0], this.form.time.time[1]]
            : []
        }
      })
    },
    timeChange(val) {
      this.form.time = val
      this.loadOverviewData()
    },
    loadOverviewData() {
      this.$emit('change', {
        ...this.form,
        isRevenue: this.form.isRevenue,
        time: {
          active: this.timeType.get(this.form.time.active),
          time: this.form.time.time
            ? [this.form.time.time[0], this.form.time.time[1]]
            : []
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.data-search {
  width: 100%;
  margin-bottom: 20px;
  .switch-type {
    width: 146px;
    height: 28px;
    background: #e8ebee;
    border-radius: 4px;
    padding: 1px;
    display: inline-block;
    margin-left: 24px;
    .switch-type-item {
      display: inline-block;
      padding: 4px 24px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #424242;
      cursor: pointer;
      user-select: none;
      background: #e8ebee;
    }
    .switch-type-item-active {
      background: #ffffff;
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      border-radius: 3px;
      color: #2474ff;
    }
  }
  .updata-time {
    margin-left: 16px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 22px;
  }
  .left-title {
    width: 100px;
    height: 32px;
    line-height: 32px;
    padding-left: 10px;
    color: #333;
    font-size: 16px;
    font-weight: bold;
    font-family: '微软雅黑';
    .gun {
      width: 4px;
      height: 24px;
      margin-top: 3px;
      float: left;
      background: #0c6fff;
      border-radius: 8px;
    }
  }
  .right-search {
    float: right;
    height: 30px;
    .date-choose {
      margin-left: 10px;
      position: relative;
      .data_icon {
        position: absolute;
        top: 11px;
        right: 10px;
        z-index: 9;
        color: #c0c4cc;
        font-size: 14px;
        transform: translateY(-50%);
      }
      ::v-deep .el-range__close-icon {
        position: absolute;
        right: 10px;
        top: 11px;
        transform: translateY(-50%);
      }
    }
  }
}
.input-box {
  display: flex;
  align-items: center;
  padding: 0 15px;
}
.input-box,
.input-box1 {
  width: 196px;
  height: 32px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #dcdfe6;
}
.input-box1 {
  overflow: hidden;
  text-align: center;
}
.back-detp {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e8ebee;
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  cursor: pointer;
  user-select: none;
  i {
    margin-right: 4px;
  }
}
</style>
