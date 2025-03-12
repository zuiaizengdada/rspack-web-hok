<template>
  <div class="wrapper">
    <div class="live-content">
      <data-search
        :title="'企业经营数据'"
        :new-time="newTime"
        :search-active="searchActive"
        @submit="queryList"
        @updataForm="updataForm"
        @resetForm="resetForm"
      />
      <data-panel
        :select-list="selectList"
        :title="panelText"
        :list="list"
        @selectPanel="selectPanel"
      />
      <data-broken
        :title="panelText"
        :select-list="selectList"
        :broken-data="brokenData"
        :broken-qoq-data="brokenQoqData"
        :time-list="form"
        :broken-check="brokenCheck"
        @changeCheck="changeCheck"
      />
      <department-data :broken-data="brokenData" :time-list="form" :dept-total-data="deptTotalData" :dept-total-day-data="deptTotalDayData" @goPageDepartment="goPageDepartment" />
      <sales-channels :shop-data="shopData" :shop-data-day-total="shopDataDayTotal" :select-index="selectIndex" :broken-data="brokenData" :sell-total-data="sellTotalData" :sell-total-day-data="sellTotalDayData" :time-list="form" @goPage="goPage" @goShop="goShop" />
      <!--      <shop-data v-if="showShopData" :sell-detail-total-data="sellDetailTotalData" :content="shopContent" @goPage="goShop" @goBack="goBack" />-->
    </div>
  </div>
</template>

<script>
import DataSearch from './components/dataSearch'
import DataPanel from '@/components/AppPanelData/dataPanel'
import DataBroken from './components/dataBroken'
import SalesChannels from './components/salesChannels'
import DepartmentData from './components/departmentData'
import { list } from '@/components/AppPanelData/dataList'
import { salesColor } from '@/components/AppPanelData/colorMap'
import {
  getDataNewTime, getDeptTotalData, getDeptTotalDayData,
  getExpertSales, getExpertSales1,
  getLiveBroadcast, getLiveBroadcast1,
  getQmv, getQmv1,
  getRefundAmount, getRefundAmount1, getShopDataTotal, getShopDataDayTotal, getSellTotalData, getSellTotalDayData, getUnexpertSale, getUnexpertSale1
} from '@/api/business'
import { typeText } from '@/utils/enum'
export default {
  components: {
    SalesChannels,
    DataPanel,
    DataSearch,
    DataBroken,
    DepartmentData
  },
  data() {
    return {
      selectList: [1],
      newTime: '',
      form: {
        endTime: '',
        startTime: '',
        pageType: 1,
        type: 3
      },
      searchActive: 0,
      search: {
        time: {
          active: '',
          time: ['', '']
        },
        current: 0
      },
      sellTotalData: [],
      deptTotalData: [],
      sellTotalDayData: [],
      deptTotalDayData: [],
      brokenQoqData: [],
      brokenCheck: false,
      sellDetailTotalData: [],
      showShopData: false,
      selectIndex: -1,
      shopData: [],
      shopDataDayTotal: [],
      shopContent: '',
      deptColorMap: [],
      goodsInfo: [],
      colorMap: null,
      nameMap: null,
      dataMap: null,
      brokenData: [],
      list,
      salesColor,
      panelText: '较昨日'
    }
  },
  mounted() {
    // this.chooseDate('week')
    // this.chooseAnLiDate('week')
    if (sessionStorage.getItem('transationDataSet')) {
      const setBuObj = JSON.parse(sessionStorage.getItem('transationDataSet') || '{}')
      console.log('&&&&&&&&&&&&&&&:', setBuObj)
      if (setBuObj.qudaoSelectIndex) {
        setTimeout(() => {
          this.selectIndex = setBuObj.qudaoSelectIndex
          this.goPage(setBuObj.qudaoItem, setBuObj.qudaoItemIndex)
        }, 300)
      }
    }
  },
  created() {
    this.colorMap = new Map([[1, '#0C6FFF'], [2, '#6C27FF'], [3, '#FF5962'], [4, '#2BC6FE'], [5, '#FFCA69'], [6, '#00E3DB'], [7, '#A5E20D'], [8, '#2BC6FE']])
    this.nameMap = new Map([[1, '成交金额'], [2, '成交金额'], [3, '退款金额'], [4, '成交订单数'], [5, '退款订单数'], [6, '直播带货成交金额'], [7, '内容带货成交金额'], [8, '自然带货成交金额']])
    this.sellColorMap = new Map([[1, '#0051FF'], [2, '#FA9D3B'], [3, '#FF6931'], [4, '#0099FF'], [10, '#eb800f'], [11, '#2BC6FE'], [12, '#663645'], [13, '#a2dbf1'], [14, '#da1430'], [15, '#30b06b'], [16, '#f57474'], [17, '#ca81c7'], [20, '#7f9b4c']])
    this.deptColorMap = new Map([[1, '#FF6464'], [2, '#FFB323'], [3, '#00D6CA'], [4, '#FF1EBF'], [5, '#35C2FF'], [6, '#A31EFF'], [7, '#00E498'], [8, '#00B1FF'], [9, '#FF6B1E'], [10, '#00E8AE'], [11, '#FF1E61'], [12, '#1E73FF'], [13, '#D800FF'], [14, '#00E2D1'], [15, '#FF6BD7']])
    this.dataMap = new Map([[1, ''], [2, ''], [3, ''], [4, ''], [5, ''], [6, ''], [7, ''], [8, '']])
    this.qoqDataMap = new Map([[1, ''], [2, ''], [3, ''], [4, ''], [5, ''], [6, ''], [7, ''], [8, '']])
    this.list = JSON.parse(JSON.stringify(this.list))
    this.list[6].titleTips = '由达人账号内容带货产生的业绩总和'
    this.list[0].titleTips = '全渠道业绩总和'
    this.list[5].titleTips = '由直播带货产生的业绩总和'
    this.list[2].titleTips = '全渠道已成功退款的退款金额总和'
    this.list[7].titleTips = '用户自由进店购买的成交金额总和'
    this.initPage()
    this.updataBroken()
  },
  methods: {
    async initPage() {
      // const res = await getDept({})
      const res1 = await getDataNewTime({})
      this.newTime = res1.data
    },
    changeCheck(e) {
      this.brokenCheck = e
    },
    goBack() {
      this.showShopData = false
    },
    // 页面跳转
    goPage(item, index) {
      // 之前需求带渠道跳转 03-09更改为当前页面展示店铺数据
      if (this.selectIndex === item.orderChannel) {
        this.selectIndex = -1
      } else {
        const obj = Object.assign({}, this.form)
        getShopDataTotal({ ...obj, channelId: item.orderChannel }).then(res => {
          this.shopData = res.data
          console.log(res, '渠道数据')
        })
        getShopDataDayTotal({ ...obj, channelId: item.orderChannel }).then(res => {
          // 渠道折线图
          const arr = []
          res.data.forEach((e, ind) => {
            arr.push({
              color: this.salesColor.get(ind),
              name: e.shopName,
              type: 'line',
              smooth: true,
              data: e.shopDayDetailList?.map(k => Number(k.totalCount))
            })
          })
          this.shopDataDayTotal = Object.assign([], arr)
          this.selectIndex = item.orderChannel
          console.log(res, '渠道折线图数据')
        })
      }
      // this.shopContent = item.name
      // 之前需求带渠道跳转 03-08更改为当前页面展示店铺数据
      // const obj = { ...this.form, channelId: item.orderChannel }
      // // channelId
      // getSellDetailTotalData(obj).then(res => {
      //   this.sellDetailTotalData = res.data
      // })
      // this.showShopData = true
      // this.$router.push({
      //   path: `/business/channelData?type=${item.orderChannel}&name=${item.name}`
      // })
      // sessionStorage.setItem('channelDataQuery', JSON.stringify({ ...this.form, ...{ goodsInfo: this.goodsInfo } }))
    },
    // 跳转店铺
    goShop(item, ele) {
      const setBuObj = JSON.parse(sessionStorage.getItem('transationDataSet') || '{}')
      sessionStorage.setItem('shopDataQuery', JSON.stringify({ ...this.form, ...{ goodsInfo: this.goodsInfo }, ...{ channelId: item.orderChannel } }))
      this.$router.push({
        path: `/business/shopData?type=${ele.shopId}&name=${ele.shopName}&form=企业经营数据&timeType=${setBuObj.timeObject?.active ? setBuObj.timeObject?.active : ''}`
      })
    },
    // 跳转部门
    goPageDepartment(item) {
      const setBuObj = JSON.parse(sessionStorage.getItem('transationDataSet') || '{}')
      this.form.type = setBuObj.timeObject.active
      sessionStorage.setItem('departmentQuery', JSON.stringify({ ...this.form, ...{ goodsInfo: this.goodsInfo } }))
      this.$router.push({
        path: `/business/departmentData?type=${item.departmentId}&name=${item.departmentName}`
      })
    },
    setData() {
      this.list.forEach((ele, index) => {
        let arr = []
        let qoqArr = []
        if (ele.orderList) {
          arr = ele.orderList.map((e) => e.total)
        }
        if (ele.ringOrderList) {
          qoqArr = ele.ringOrderList.map((e) => e.total)
        }
        this.dataMap.set(index + 1, arr)
        this.qoqDataMap.set(index + 1, qoqArr)
      })
      this.list = Object.assign([], this.list)
      this.updataBroken()
    },
    resetForm(item) {
      this.search = {
        time: {
          active: 7,
          time: ['', '']
        },
        current: 0
      }
      this.queryList(item)
    },
    updataForm(item) {
      this.form = { ...this.form, ...item }
    },
    // 查询
    async queryList(item, goodsInfo) {
      // this.$loading()
      this.form = { ...this.form, ...item }
      this.selectIndex = -1
      this.panelText = typeText[item.type + '']
      this.goodsInfo = goodsInfo
      // 内容带货
      getExpertSales(this.form).then((res) => {
        this.list[6] = { ...this.list[6], ...res.data }
        if (this.form.type === 1 || this.form.startTime === this.form.endTime) {
          // 内容带货
          getExpertSales1(this.form).then((res) => {
            const { orderList, ringOrderList } = res.data
            this.list[6] = { ...this.list[6], ...{ orderList, ringOrderList } }
            this.setData()
          })
        } else {
          this.setData()
        }
      })
      // 成交金额
      getQmv(this.form).then((res) => {
        this.list[0] = { ...this.list[0], ...res.data }
        if (this.form.type === 1 || this.form.startTime === this.form.endTime) {
          // 成交金额
          getQmv1(this.form).then((res) => {
            const { orderList, ringOrderList } = res.data
            this.list[0] = { ...this.list[0], ...{ orderList, ringOrderList } }
            this.setData()
          })
        } else {
          this.setData()
        }
      })
      // 直播带货
      getLiveBroadcast(this.form).then((res) => {
        this.list[5] = { ...this.list[5], ...res.data }
        if (this.form.type === 1 || this.form.startTime === this.form.endTime) {
          // 成交金额
          getLiveBroadcast1(this.form).then((res) => {
            const { orderList, ringOrderList } = res.data
            this.list[5] = { ...this.list[5], ...{ orderList, ringOrderList } }
            this.setData()
          })
        } else {
          this.setData()
        }
      })
      // 退款金额
      getRefundAmount(this.form).then((res) => {
        this.list[2] = { ...this.list[2], ...res.data }
        if (this.form.type === 1 || this.form.startTime === this.form.endTime) {
          // 成交金额
          getRefundAmount1(this.form).then((res) => {
            const { orderList, ringOrderList } = res.data
            this.list[2] = { ...this.list[2], ...{ orderList, ringOrderList } }
            this.setData()
          })
        } else {
          this.setData()
        }
      })
      // 自然成交
      getUnexpertSale(this.form).then((res) => {
        this.list[7] = { ...this.list[7], ...res.data }
        if (this.form.type === 1 || this.form.startTime === this.form.endTime) {
          // 成交金额
          getUnexpertSale1(this.form).then((res) => {
            const { orderList, ringOrderList } = res.data
            this.list[7] = { ...this.list[7], ...{ orderList, ringOrderList } }
            this.setData()
          })
        } else {
          this.setData()
        }
      })
      getSellTotalData(this.form).then((res) => {
        console.log('reesssss:!!!!!!!!!!!!!!!!', res)
        const newArr = res.data.filter(item => item.orderChannel !== 5)
        this.sellTotalData = Object.assign([], newArr)
      })
      getSellTotalDayData(this.form).then((res) => {
        const newArr = res.data.filter(item => item.orderChannel !== 5)
        // 渠道折线图
        const arr = []
        newArr.forEach((e, ind) => {
          arr.push({
            color: this.sellColorMap.get(e.orderChannel),
            name: e.name,
            type: 'line',
            smooth: true,
            data: e.sellChannelsDayDetailList?.map(k => Number(k.totalCount / 100))
          })
        })
        this.sellTotalDayData = Object.assign([], arr)
        console.log(this.sellTotalDayData, '售卖渠道')
      })
      getDeptTotalData(this.form).then((res) => {
        this.deptTotalData = Object.assign([], res.data)
        getDeptTotalDayData(this.form).then((res) => {
          // 部门业绩折线图
          const arr1 = []
          this.deptTotalData.forEach((item, index) => {
            res.data.forEach((e, ind) => {
              if (item.departmentId === e.departmentId) {
                arr1.push({
                  color: this.deptColorMap.get(index % 15 + 1),
                  name: item.departmentName,
                  type: 'line',
                  smooth: true,
                  data: e.deptAchievementDayDetailList?.map(k => Number(k.totalCount))
                })
              }
            })
          })
          this.deptTotalDayData = Object.assign([], arr1)
        })
      })
    },
    selectPanel(val, list) {
      if (this.brokenCheck) {
        this.selectList = []
        this.selectList.push(val)
        this.updataBroken()
        return
      }
      if (this.selectList.length === 1 && this.selectList.indexOf(val) !== -1) {
        return
      }
      this.brokenCheck = false
      this.selectList.indexOf(val) !== -1 ? this.selectList.splice(this.selectList.indexOf(val), 1) : this.selectList.push(val)
      this.updataBroken()
    },
    updataBroken() {
      const arr = []
      const qoqArr = []
      this.selectList.forEach(e => {
        if (this.dataMap.get(e)) {
          arr.push({
            color: this.colorMap.get(e),
            name: this.nameMap.get(e),
            type: 'line',
            symbol: 'circle',
            smooth: true,
            data: this.dataMap.get(e).map(k => {
              if (e === 5 || e === 4) {
                return Number(k)
              } else {
                return Number(k / 100)
              }
            })
          })
          qoqArr.push({
            color: this.colorMap.get(e),
            name: '环比',
            type: 'line',
            smooth: true,
            lineStyle: {
              type: 'dashed'
            },
            data: this.qoqDataMap.get(e).map(k => {
              if (e === 5 || e === 4) {
                return Number(k)
              } else {
                return Number(k / 100)
              }
            })
          })
        }
      })
      console.log(this.brokenData, this.brokenQoqData, '最后传进去的数据')
      this.brokenData = arr
      this.brokenQoqData = qoqArr
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
}

.live-content {
  min-width: 1200px;
  border-radius: 10px;
  padding: 20px;
  background: #fff;
}

.secord-content {
  margin-top: 20px;
}

::v-deep .el-range__icon {
  display: none;
}

.tearchfor {
  margin-top: 20px;
  min-width: 1200px;
  border-radius: 10px;
  padding: 20px;
  background: #fff;
}
</style>
