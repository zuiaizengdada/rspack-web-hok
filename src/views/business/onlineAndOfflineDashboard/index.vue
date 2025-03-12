<template>
  <div class="wrapper-online-offline">
    <div ref="floatLevelCls" class="float-level-cls" :class="{ 'fixed': isFixed, 'expanded': isExpanded }">
      <searchForm ref="searchForm" :role-flag="roleFlag" @changeFormData="changeFormData" @changeFormDataCom="changeFormDataCom" />
      <!-- 展开按钮，仅在 fixed 状态显示 -->
      <div v-if="isFixed" class="expand-button" @click="toggleExpand">
        <i :class="['expand-icon', isExpanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" />
        {{ isExpanded ? '展开' : '收起' }}
      </div>
    </div>
    <onlineAndOfflineData ref="onlineAndOfflineData" @changeFormData="changeFormData" />
    <detailData v-if="form.chooseType === 1" ref="detailData" @changeDeptMent="changeDeptMent" @addTearcherData="addTearcherData" />
    <performanceDetail v-if="form.chooseType === 2" ref="performanceDetail" />
  </div>
</template>

<script>
import searchForm from './components/searchForm'
import detailData from './components/detailData.vue'
import onlineAndOfflineData from './components/onlineAndOfflineData.vue'
import performanceDetail from './components/onlineAndOffline/performanceDetail.vue'
import { getUserRoleType } from '@/api/business/onlineAndOffline.js'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  components: {
    searchForm,
    onlineAndOfflineData,
    detailData,
    performanceDetail
  },
  data() {
    return {
      isFixed: false,
      isExpanded: false,
      elementOffsetTop: 0,
      roleFlag: 0, // 标记用户是企业管理员身份还是部门管理员身份或者员工  1、企业管理员 2、部门负责人 3、普通员工
      form: {
        chooseType: 1, // 营收为1 业绩为2
        // deptArray: [],
        employeeDeptId: '',
        employeeSecondDeptId: '',
        employeeUid: '',
        teacherIdList: [],
        teacherId: '',
        lecturerName: '',
        orderChannel: [],
        itemIdList: [],
        offlineFlag: 0, // 线上或者线下状态
        productCategory: 999, // 商品类型 0 视频课、1直播课、2线下课、3组合课
        bizTypes: [3, 1, 2, 4, 5, 9, 12],
        bizTypeActive: 3,
        bizTypeActiveName: 'GMV',
        time: {
          active: 3,
          time: [moment().format('YYYY-MM-01'), moment().format('YYYY-MM-DD')],
          type: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  provide() {
  },
  mounted() {
    // 获取元素的初始位置
    this.$nextTick(() => {
      const element = document.querySelector('.float-level-cls')
      if (element) {
        this.elementOffsetTop = element.offsetTop
      }
    })

    // 添加滚动监听
    window.addEventListener('scroll', this.handleScroll)

    console.log('查询当前用户的机构id：：：：：', localStorage.getItem('userDeptId'))
    this.loadUserControlMessage()
    const setBusinessOtherData = JSON.parse(sessionStorage.getItem('setBusinessOtherData') || '{}')
    const nowUserOrgId = localStorage.getItem('userDeptId')
    if (this.userInfo.userId === setBusinessOtherData.userId && setBusinessOtherData.userOrgId === nowUserOrgId) {
      if (setBusinessOtherData.chooseType) {
        this.form.chooseType = setBusinessOtherData.chooseType
      } else {
        this.form.chooseType = 1
      }
      if (setBusinessOtherData.productCategory) {
        this.form.productCategory = setBusinessOtherData.productCategory
      } else {
        this.form.productCategory = 999
      }
      if (setBusinessOtherData.offlineFlag) {
        this.form.offlineFlag = setBusinessOtherData.offlineFlag
      } else {
        this.form.offlineFlag = 0
      }
      const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
      if (setBuObj.time) {
        this.form.time = setBuObj.time
      } else {
        this.form.time = {
          active: 3,
          time: [moment().format('YYYY-MM-01'), moment().format('YYYY-MM-DD')],
          type: ''
        }
      }
    }
  },
  beforeDestroy() {
    // 移除滚动监听
    window.removeEventListener('scroll', this.handleScroll)
  },
  created() {
  },
  methods: {
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      this.isFixed = scrollTop > this.elementOffsetTop

      // 当取消固定状态时，同时取消展开状态
      if (!this.isFixed) {
        this.isExpanded = false
      }
    },
    toggleExpand() {
      this.isExpanded = !this.isExpanded
    },
    changeFormDataCom(item) {
      this.form.offlineFlag = item.value
    },
    addTearcherData(obj) {
      this.$nextTick(() => {
        this.$refs.onlineAndOfflineData.addTearcherData(obj)
      })
    },
    changeDeptMent(obj, type) {
      this.$nextTick(() => {
        this.form.chooseType = type
        this.$refs.searchForm.changeRevenType(this.form.chooseType)
        this.$refs.searchForm.changeDeptment(obj)
      })
    },
    loadUserControlMessage() {
      getUserRoleType().then(res => {
        if (res.code === 1 && res.data) {
          this.roleFlag = res.data
          // this.generalControlInit()
        }
      })
    },
    generalControlInit() {
      this.$nextTick(() => {
        this.$refs.searchForm.init(this.form)
        this.$refs.onlineAndOfflineData.init(this.form)
        if (this.form.chooseType === 1) {
          this.$refs.detailData.init(this.form)
        } else {
          this.$refs.performanceDetail.init(this.form)
        }
      })
    },
    moment,
    returnBizTypeName() {
      if (this.form.bizTypeActive === 3) {
        this.form.bizTypeActiveName = 'GMV'
      }
      if (this.form.bizTypeActive === 1 && this.form.chooseType === 1) {
        this.form.bizTypeActiveName = '总营收'
      }
      if (this.form.bizTypeActive === 1 && this.form.chooseType === 2) {
        this.form.bizTypeActiveName = '总业绩'
      }
      if (this.form.bizTypeActive === 2) {
        this.form.bizTypeActiveName = '退款'
      }
      if (this.form.bizTypeActive === 4) {
        this.form.bizTypeActiveName = '直播带货'
      }
      if (this.form.bizTypeActive === 5) {
        this.form.bizTypeActiveName = '视频带货'
      }
      if (this.form.bizTypeActive === 9) {
        this.form.bizTypeActiveName = '线下录单'
      }
      if (this.form.bizTypeActive === 12) {
        this.form.bizTypeActiveName = '私域直播'
      }
    },
    changeFormData(item) {
      console.log('sssssd:!!!:', item)
      if (item.flag === 'bizType' && this.form.chooseType === 2) {
        this.form.bizTypeActive = item.value
        this.form.bizTypeActiveName = item.bizTypeName
        this.$nextTick(() => {
          if (this.form.chooseType === 2) {
            this.$refs.performanceDetail.init(this.form)
          }
          this.$refs.onlineAndOfflineData.changeBizActive(this.form)
        })
      } else {
        if (item.flag === 'bizType') {
          this.form.bizTypeActive = item.value
          this.form.bizTypeActiveName = item.bizTypeName
        }
        if (item.flag === 'offlineFlag') {
          this.form.offlineFlag = item.value
          if (item.value === 1) {
            this.form.chooseType = 1
            this.form.productCategory = 999
          } else if (item.value === 0) {
            this.form.productCategory = this.$refs.searchForm.changeChannelTypeReturn()
            this.$refs.searchForm.huidiaoChooseType()
            // return
          }
        } else if (item.flag === 'chooseType') {
          this.form.chooseType = item.value
          this.$nextTick(() => {
            this.$refs.searchForm.revenType = item.value
          })
        } else if (item.flag === 'channelFlag') {
          this.form.productCategory = item.value
        } else if (item.flag === 'searchForm') {
          this.$refs.searchForm.changeOnlineOrOffline()
          if (!item.obj.time?.time[0]) {
            return
          }
          this.form.employeeSecondDeptId = item.obj.employeeSecondDeptId
          this.form.employeeDeptId = item.obj.employeeDeptId
          this.form.employeeUid = item.obj.employeeUid
          this.form.teacherIdList = item.obj.teacherIdList && item.obj.teacherIdList.length > 0 ? item.obj.teacherIdList : (item.obj.teacherId ? [item.obj.teacherId] : [])
          this.form.orderChannel = item.obj.orderChannel
          this.form.itemIdList = item.obj.itemIdList
          this.form.time = item.obj.time
          this.form.offlineFlag = item.obj.offlineFlag
          if (!this.form.employeeDeptId) {
            this.form.chooseType = 1
            this.form.productCategory = this.$refs.searchForm.changeChannelTypeReturn()
            this.$refs.searchForm.setChooseType(this.form)
          } else {
            this.form.productCategory = 999
            // this.$refs.onlineAndOfflineData.changeProductCategory(this.form)
          }
        }
        console.log('all 总控： form：：：', this.form)
        if (this.form.employeeDeptId && this.form.offlineFlag === 0) {
          if (this.form.chooseType === 1) {
            this.form.bizTypes = [3, 1, 2, 4, 5, 9, 12]
          } else {
            this.form.bizTypes = [1, 4, 5, 9, 12]
          }
        } else if (this.form.employeeDeptId && this.form.offlineFlag === 1) {
          this.form.bizTypes = [3, 1, 2]
        } else if (!this.form.employeeDeptId && this.form.offlineFlag === 0) {
          this.form.bizTypes = [3, 1, 2, 4, 5, 9, 12]
        } else if (!this.form.employeeDeptId && this.form.offlineFlag === 1) {
          this.form.bizTypes = [3, 1, 2]
        }
        const setBusinessOtherData = JSON.parse(sessionStorage.getItem('setBusinessOtherData') || '{}')
        setBusinessOtherData.chooseType = this.form.chooseType
        setBusinessOtherData.offlineFlag = this.form.offlineFlag
        setBusinessOtherData.productCategory = this.form.productCategory
        setBusinessOtherData.userId = this.userInfo.userId
        setBusinessOtherData.userOrgId = localStorage.getItem('userDeptId')
        sessionStorage.setItem('setBusinessOtherData', JSON.stringify(setBusinessOtherData))
        console.log('EEEEEEE:', this.form)
        this.generalControlInit()
      }
    },
    changeBizTypeForForm(type, typeName) {
      this.form.bizTypeActive = type
      this.form.bizTypeActiveName = typeName
      this.$nextTick(() => {
        this.$refs.onlineAndOfflineData.clickBiz(this.form)
        this.$refs.chartExpert.init(this.form)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper-online-offline {
  width: 100%;
  min-width: 1400px;
  display: inline-block;
  border-radius: 10px;
}
.float-level-cls {
  float: left;
  width: 100%;

  &.fixed {
    position: fixed;
    z-index: 1001!important;
    top: 120px;
    left: 198px;
    overflow: hidden;
    width: calc(100% - 218px);
    z-index: 100;
    background: #fff; /* 确保背景色 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  }
  &.expanded {
    height: 68px;
  }

  .expand-button {
    display: none; /* 默认隐藏 */
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 5px 15px;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    color: #0C6FFF;

    &:hover {
      color: #0C6FFF;
      border-color: #0C6FFF;
    }

    .expand-icon {
      margin-right: 4px;
    }
  }

  &.fixed .expand-button {
    display: flex; /* 固定状态时显示展开按钮 */
    align-items: center;
    justify-content: center;
  }
}
/* 当元素固定时，为了防止页面跳动，需要添加一个占位元素 */
.float-level-cls.fixed + .placeholder {
  height: 60px; /* 设置为 float-level-cls 的高度 */
}

</style>
