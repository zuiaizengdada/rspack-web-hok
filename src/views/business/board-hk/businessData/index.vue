<template>
  <div class="wrapper">
    <div class="content">
      <!--  查询条件 -->
      <Head
        ref="headRef"
        :new-time="newTime"
        @change="submitSearch"
        @moniAction="moniAction"
        @setDepartmentDeptArray="setDepartmentDeptArray"
        @resetForm="resetFormSearch"
      />
      <!--  数据分类——成交金额,退款金额,内容带货,直播带货,自然成交 -->
      <grid ref="gridChunkRef" @gridChage="gridChage" />
      <div v-if="queryParams.isRevenue" class="row">
        <!-- 渠道业绩 -->
        <channel ref="channelRef" @checkItem="checkItem" />
        <!-- 占比饼图 -->
        <typeProportion ref="typeProportionRef" />
        <!-- 免费/付费占比饼图 -->
        <payProportion ref="payProportionRef" />
      </div>
      <!-- 折线图 -->
      <lineChart v-if="queryParams.isRevenue" ref="lineChartRef" />
      <!-- 柱状图 -->
      <department
        ref="departmentRef"
        @deptIdEmit="setDeptId"
        @changeIsRevenueEmit="changeIsRevenueEmit"
        @selectThirdLevelDeptId="selectThirdLevelDeptId"
        @backDeptIdEmit="backDeptIdEmit"
        @deptToPerson="deptToPerson"
      />
      <member-data ref="memberDataRef" />
    </div>
  </div>
</template>
<script>
import { getSystemUserRole } from '@/api/business'
import Head from './components/head/index.vue'
import grid from './components/grid/index.vue'
import channel from './components/channel/index.vue'
import typeProportion from './components/typeProportion/index.vue'
import payProportion from './components/payProportion/index.vue'
import lineChart from './components/lineChart/index.vue'
import department from './components/departmentChart/index.vue'
import memberData from './components/memberData/index.vue'
import { getItem } from '@/utils/localStorage'
export default {
  components: {
    Head,
    grid,
    channel,
    typeProportion,
    payProportion,
    lineChart,
    department,
    memberData
  },
  data() {
    return {
      isQuanyu: false,
      newTime: '',
      queryParams: {
        isRevenue: true,
        startTime: '',
        endTime: '',
        type: 1,
        bizType: 3,
        isHistogramDept: false,
        isSearchGrid: false // 是否查询grid组件
      },
      goodsInfo: {},
      personTotalData: [],
      personTotalCountall: {
        contentGoodsCountTotal: 0,
        contentCountOrder: 0,
        liveGoodsCountTotal: 0,
        liveCountOrder: 0,
        personTotalCount: 0,
        personOrderTotalCount: 0,
        refundCountRatio: 0
      },
      isContinue: true
    }
  },
  created() {
    const orgItem = getItem('orgInfo')
    if (orgItem.organizationId === 1006) {
      this.isQuanyu = true
    }
    const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
    setBuObj.queryParamsIsRevenue = !this.isQuanyu ? false : this.queryParams.isRevenue
    sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(setBuObj))

    // 判断是否有权限 企业管理员 部门管理员
    getSystemUserRole().then(res => {
      if (res.code === 1) {
        const { corpMangerFlag, deptManagerFlag } = res.data
        if (corpMangerFlag === 1 && deptManagerFlag === 1) {
          this.$message({
            message: '没有权限访问',
            type: 'warning'
          })
          this.$refs.headRef.isContinue = false
          this.isContinue = false
          return
        }
      }
    })
    // 监听页面刷新
    window.addEventListener('beforeunload', () => {
    })
  },
  beforeDestroy() {},
  destroyed() {
  },
  methods: {
    setDepartmentDeptArray(departmentArray) {
      this.$nextTick(() => {
        this.$refs.departmentRef.deptIds = departmentArray
      })
    },
    deptToPerson({ id, uName, deptId, isShowLogo, qdCheckedIndex }) {
      this.$router.push({
        path: '/business/personData',
        query: {
          uId: id,
          deptId: deptId,
          uName: uName,
          isShowLogo: isShowLogo,
          qdCheckedIndex: qdCheckedIndex
        }
      })
    },
    changeIsRevenueEmit(deptId, deptIsRevenue) {
      this.queryParams.deptIsRevenue = deptIsRevenue
      this.$refs.memberDataRef.initData({
        ...this.queryParams,
        deptIsRevenue: deptIsRevenue
      })
    },
    selectThirdLevelDeptId(ids) {
      this.$refs.headRef.fillCascaderData(ids)
      /* console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT:', ids)
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.headRef.deptIdArray = ids
          this.$forceUpdate()
        }, 300)
      })*/
    },
    backDeptIdEmit(id, isHistogramDept, isRevenue) {
      this.queryParams.deptId = id
      this.$refs.headRef.form.deptId = id
      this.$refs.headRef.deptIdArray = id > -1 && id ? [id] : []
      const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
      setBuObj.deptIdArray = this.$refs.headRef.deptIdArray
      sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(setBuObj))
      this.queryParams.isHistogramDept = isHistogramDept
      if (!id) {
        this.queryParams.isRevenue = true
        const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
        setBuObj.queryParamsIsRevenue = this.queryParams.isRevenue
        sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(setBuObj))
        // this.queryParams.deptIsRevenue = undefined
        // this.$refs.departmentRef.isRevenue = true
        this.$refs.headRef.form.isRevenue = true
      }
      this.init()
    },
    // 部门柱状图 选择回调
    setDeptId(id, isHistogramDept, isRevenue) {
      this.queryParams.deptId = id
      this.$refs.headRef.form.deptId = id
      // this.$refs.headRef.deptIdArray =
      //   id > -1 && id ? [...this.$refs.departmentRef.deptIds] : []
      const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
      setBuObj.deptIdArray = [...this.$refs.departmentRef.deptIds]
      sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(setBuObj))
      this.queryParams.isHistogramDept = isHistogramDept
      if (this.$refs.headRef.form.isRevenue) {
        this.queryParams.isRevenue = isRevenue
        const setBuObj = JSON.parse(sessionStorage.getItem('setBusinessDataSessionObject') || '{}')
        setBuObj.queryParamsIsRevenue = this.queryParams.isRevenue
        sessionStorage.setItem('setBusinessDataSessionObject', JSON.stringify(setBuObj))
        this.$refs.headRef.form.isRevenue = isRevenue
      }
      if (this.queryParams.isSearchGrid) {
        this.queryParams.bizType = this.$refs.gridChunkRef.getBizType({
          ...this.queryParams,
          changeIsRevenue: true
        })
        this.$refs.gridChunkRef.initData(this.queryParams)
      }

      // 判断渠道业绩是否查询
      if (this.queryParams.isRevenue) {
        this.$refs.channelRef.initData(this.queryParams)
      }
      if (this.queryParams.isRevenue) {
        this.$refs.typeProportionRef.initData(this.queryParams)
        this.$refs.payProportionRef.initData(this.queryParams)
        this.$refs.lineChartRef.initData(this.queryParams)
      }

      this.$refs.memberDataRef.initData(this.queryParams)
    },
    // 渠道业绩组件 选择回调
    checkItem(record) {
      console.log('回调回来的参数：', record)
      this.queryParams.isSearchGrid = true
      this.queryParams.isShowLogo = record.isShowLogo
      this.queryParams.logoImgUrl = record.logoImgUrl
      this.queryParams.isCheckChannel = record.isCheck
      this.queryParams.shopId = record.shopId
      this.queryParams.orderChannel = record.orderChannel
      this.queryParams.channelLogoName = record.name
      this.queryParams.channelLevel = record.channelLevel
      this.init()
    },
    // 订单来源组件 选择回调
    gridChage(key) {
      console.log('333333333:', key)
      this.queryParams.isSearchGrid = true
      this.queryParams.bizType = key
      this.init()
    },
    moniAction(obj) {
      console.log('############:12112', obj)
      setTimeout(() => {
        if (obj.queryParamsIsRevenue) {
          this.queryParams.isRevenue = obj.queryParamsIsRevenue
        } else if (!obj.queryParamsIsRevenue && !obj.isShowLogo) {
          return
        }
        if (!obj.isRevenue) {
          this.$refs.headRef.changeIsRevenue()
        }
        if (obj.refsValue) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.$refs.gridChunkRef.$refs[obj.refsValue].handleClick(obj.refKey, obj.refsValue)
            }, 500)
          })
        }
        if (obj.isShowLogo) {
          setTimeout(() => {
            this.queryParams.isShowLogo = obj.isShowLogo
            this.$refs.channelRef.toDetail(obj.quDaoDetailRecord)
            if (obj.channelLevel === 2 && obj.quDaoRecord) {
              setTimeout(() => {
                this.$refs.channelRef.changeRecordActive(obj.quDaoRecord)
                this.checkItem({ ...obj.quDaoRecord, isShowLogo: obj.channelLevel > 1, shopId: obj.quDaoRecord.shopId, orderChannel: obj.orderChannel })
              }, 900)
            }
          }, 800)
        } else {
          if (obj.quDaoRecord) {
            setTimeout(() => {
              // this.$refs.channelRef.checkItem(obj.quDaoRecord)
              this.$refs.channelRef.changeRecordActive(obj.quDaoRecord)
              this.checkItem({ ...obj.quDaoRecord, isShowLogo: obj.channelLevel > 1 })
            }, 800)
          }
        }
        if (obj.mixiDataType) {
          setTimeout(() => {
            this.$refs.memberDataRef.changeType(obj.mixiDataType)
          }, 900)
        }
      }, 100)
    },
    // 搜索提交回调
    submitSearch(data, goodsInfo) {
      this.goodsInfo = { ...goodsInfo }
      this.queryParams.isCheckChannel = false

      const params = {
        ...data,
        isSearchGrid: true,
        deptIsRevenue: undefined
      }
      const deptIds = this.$refs.headRef.deptIdArray
      this.$refs.departmentRef.deptIds = deptIds ? [...deptIds] : []
      if (data.changeIsRevenue) {
        this.$refs.headRef.form.changeIsRevenue = undefined
        this.queryParams.deptIsRevenue = undefined
        this.queryParams.bizType = this.$refs.gridChunkRef.getBizType({
          ...data,
          bizType: this.queryParams.bizType
        })
      }

      this.init(params)
    },
    // 时间组件 重置回调
    resetFormSearch(record) {
      this.queryParams.isCheckChannel = false
      this.queryParams.channelLevel = undefined
      this.queryParams.orderChannel = undefined
      this.queryParams.channelId = undefined
      this.queryParams.shopId = undefined
      this.queryParams.isShowLogo = false
      this.init({
        ...record,
        isSearchGrid: true
      })
    },
    // 初始化
    init(record) {
      if (!this.isContinue) return
      if (record) {
        this.queryParams = {
          ...record,
          corpMangerFlag: this.$refs.headRef.form.corpMangerFlag,
          bizType: this.queryParams.bizType,
          isShowLogo: this.queryParams.isShowLogo,
          logoImgUrl: this.queryParams.logoImgUrl,
          channelLogoName: this.queryParams.channelLogoName,
          channelLevel: this.queryParams.channelLevel,
          orderChannel: this.queryParams.orderChannel,
          shopId: this.queryParams.shopId,
          startTime: record.time.time[0],
          endTime: record.time.time[1],
          type: record.time.active,
          deptId: record.deptId,
          isCheckChannel: this.queryParams.isCheckChannel,
          isHistogramDept: this.queryParams.isHistogramDept,
          deptIsRevenue: this.queryParams.deptIsRevenue,
          changeIsRevenue: record.changeIsRevenue
        }
        delete this.queryParams.time
      }
      this.$nextTick(() => {
        // isSearchGrid为true时，查询grid组件
        if (this.queryParams.isSearchGrid) {
          this.$refs.gridChunkRef.initData(this.queryParams)
        }

        // 判断渠道业绩是否查询
        if (this.queryParams.isRevenue) {
          this.$refs.channelRef.initData(this.queryParams)
        }
        if (this.queryParams.isRevenue) {
          this.$refs.typeProportionRef.initData(this.queryParams)
          this.$refs.payProportionRef.initData(this.queryParams)
          this.$refs.lineChartRef.initData(this.queryParams)
        }
        if (
          !this.queryParams.isHistogramDept ||
          this.queryParams.isCheckChannel ||
          this.queryParams.changeIsRevenue ||
          !this.queryParams.isThirdLevelParentDeptId
        ) {
          this.$refs.departmentRef.initData(this.queryParams)
          this.$refs.memberDataRef.initData(this.queryParams)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  background-color: #f8fafb;
  position: relative;
  border-radius: 10px;
  min-width: 1300px;

  .content {
    width: 100%;
    padding: 20px;

    .row {
      display: flex;
      align-items: center;
      margin: 24px 0;
    }
  }
}
</style>
