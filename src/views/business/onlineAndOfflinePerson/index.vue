<template>
  <div class="wrapper-online-person-wrapper">
    <searchForm ref="searchForm" @changeFormData="changeFormData" />
    <onlineAndOfflineData ref="onlineAndOfflineData" @changeFormData="changeFormData" @changeBizTypeForForm="changeBizTypeForForm" />
    <chartExpert ref="chartExpert" />
  </div>
</template>

<script>
import searchForm from './components/searchForm.vue'
import onlineAndOfflineData from './components/onlineAndOfflineData.vue'
import chartExpert from './components/chartExpert.vue'
import moment from 'moment'
import { mapGetters } from 'vuex'
// import { getDeptCategoryMess } from '@/api/business/onlineAndOffline'
export default {
  components: {
    searchForm,
    onlineAndOfflineData,
    chartExpert
  },
  data() {
    return {
      componentBizTypeActive: 3,
      componentChooseType: 1,
      form: {
        bizTypes: [3, 1, 2, 4, 5, 9, 12],
        employeeUid: '',
        employeeDeptId: '',
        employeeSecondDeptId: '', // '153',
        bizTypeActive: 3,
        bizTypeActiveName: 'GMV',
        chooseType: 1,
        offlineFlag: 0, // 线上或者线下状态
        time: {
          active: 3,
          time: [moment().format('YYYY-MM-01'), moment().format('YYYY-MM-DD')],
          type: ''
        }
      }
    }
  },
  provide() {
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    if (this.$route.query.employeeId) {
      this.form.employeeUid = this.$route.query.employeeId // '1768094793730285568'//
    } else {
      this.form.employeeUid = this.userInfo.userId // '1768094793730285568'//
    }
    if (this.$route.query.employeeDeptId) {
      this.form.employeeDeptId = this.$route.query.employeeDeptId
      this.form.employeeSecondDeptId = this.$route.query.employeeSecondDeptId
    } else {
      this.form.employeeDeptId = ''
      this.form.employeeSecondDeptId = ''
    }
    if (this.$route.query.startTime) {
      this.form.time.active = this.$route.query.timeActive ? this.$route.query.timeActive : ''
      this.form.time.time[0] = this.$route.query.startTime
      this.form.time.time[1] = this.$route.query.endTime
    }
    if (this.$route.query.chooseType && this.$route.query.chooseType === 2) {
      this.form.chooseType = this.$route.query.chooseType
      this.form.bizTypeActive = 1
    }
    if (this.$route.query.offlineFlag || this.$route.query.offlineFlag === 0) {
      this.form.offlineFlag = this.$route.query.offlineFlag
    }
    if (this.form.offlineFlag === 1) {
      this.form.bizTypes = [3, 1, 2]
    } else if (this.form.offlineFlag === 0 && this.form.chooseType === 1) {
      this.form.bizTypes = [3, 1, 2, 4, 5, 9, 12]
    } else if (this.form.offlineFlag === 0 && this.form.chooseType === 2) {
      this.form.bizTypes = [1, 4, 5, 9, 12]
    }
    this.generalControlInit()
  },
  created() {
  },
  methods: {
    generalControlInit() {
      this.$nextTick(() => {
        console.log('个人数据看板的form的data', this.form)
        this.$refs.searchForm.init(this.form)
        this.$refs.onlineAndOfflineData.init(this.form)
        this.$refs.chartExpert.init(this.form)
      })
    },
    changeBizTypeForForm(type, typeName) {
      this.form.bizTypeActive = type
      this.form.bizTypeActiveName = typeName
      this.$nextTick(() => {
        this.$refs.onlineAndOfflineData.clickBiz(this.form)
        this.$refs.chartExpert.init(this.form)
      })
    },
    moment,
    changeFormData(item) {
      if (item.flag === 'bizType') {
        this.form.bizTypeActive = item.value
        this.form.bizTypeActiveName = item.bizTypeName
      }
      if (item.flag === 'time') {
        this.form.time = item.time
      }
      if (item.flag === 'offlineFlag') {
        this.form.offlineFlag = item.value
        if (item.value === 1) {
          this.form.chooseType = 1
        } else {
          this.form.chooseType = this.componentChooseType
        }
      }
      if (item.flag === 'chooseType') {
        this.form.chooseType = item.value
        this.componentChooseType = item.value
      }
      if (this.form.offlineFlag === 1) {
        this.form.bizTypes = [3, 1, 2]
      } else if (this.form.offlineFlag === 0 && this.form.chooseType === 1) {
        this.form.bizTypes = [3, 1, 2, 4, 5, 9, 12]
      } else if (this.form.offlineFlag === 0 && this.form.chooseType === 2) {
        this.form.bizTypes = [1, 4, 5, 9, 12]
      }
      console.log('总控！！！！：：', this.form)
      this.generalControlInit()
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper-online-person-wrapper {
    width: 100%;
    min-width: 1500px;
    display: inline-block;
    border-radius: 10px;
}
</style>
