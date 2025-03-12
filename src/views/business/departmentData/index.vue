<template>
  <div class="wrapper">
    <div class="live-content">
      <goBackHeader v-if="pageInfo.type || pageInfo.havaBack == 1" :from="departmentSting" :content="'企业经营数据'" />
      <data-search
        :title="`部门经营数据`"
        :new-time="newTime"
        :form="form"
        :search="search"
        :search-active="searchActive"
        :goods-info="goodsInfo"
        @submit="queryList"

        @updataForm="updataForm"
        @resetForm="resetForm"
      />
      <data-panel
        :title="panelText"
        :select-list="selectList"
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
      <sales-channels
        :shop-data="shopData"
        :shop-data-day-total="shopDataDayTotal"
        :select-index="selectIndex"
        :broken-data="brokenData"
        :sell-total-data="sellTotalData"
        :sell-total-day-data="sellTotalDayData"
        :time-list="form"
        @goPage="goPage"
        @goShop="goShop"
      />
      <member-data :person-total-data="personTotalData" :person-total-count="personTotalCountall" @goPage="goPersonalPage" />
      <!--      <department-data :broken-data="brokenData" />-->
    </div>
  </div>
</template>

<script>
import goBackHeader from '@/components/goBackHeader'
import DataSearch from './components/dataSearch'
import DataPanel from '@/components/AppPanelData/dataPanel'
import DataBroken from './components/dataBroken'
import SalesChannels from './components/salesChannels'
import MemberData from './components/memberData'
import { list } from '@/components/AppPanelData/dataList'
import { salesColor } from '@/components/AppPanelData/colorMap'
import { typeText } from '@/utils/enum'
import {
  getDataNewTime,
  getExpertSales,
  getLiveBroadcast,
  getQmv,
  getRefundAmount,
  getSellTotalData,
  getUnexpertSale,
  getSellTotalDayData,
  getPersonTotalData,
  getPersonTotalCount,
  getShopDataTotal,
  getShopDataDayTotal, getExpertSales1, getQmv1, getLiveBroadcast1, getRefundAmount1, getUnexpertSale1
} from '@/api/business'
import { mapGetters } from 'vuex'

export default {
  components: {
    MemberData,
    SalesChannels,
    DataPanel,
    DataSearch,
    DataBroken,
    goBackHeader
  },
  data() {
    return {
      departmentSting: 'department',
      selectList: [1],
      newTime: '',
      showShopData: false,
      sellDetailTotalData: [],
      personTotalCountall: {
        contentGoodsCountTotal: 0,
        contentCountOrder: 0,
        liveGoodsCountTotal: 0,
        liveCountOrder: 0,
        personTotalCount: 0,
        personOrderTotalCount: 0,
        refundCountRatio: 0
      },
      form: {
        deptId: '', // 部门ID
        copyDeptId: [], // 部门ID
        channelId: '', // 渠道ID
        orderType: '', // 订单类型
        productIdList: [], // 商品id
        teacherId: '', // ip老师ID
        contentName: '',
        lecturerName: '',
        endTime: '',
        startTime: '',
        pageType: 2,
        type: 3
      },
      searchActive: 0,
      search: {
        time: {
          active: 0,
          time: []
        },
        current: 0
      },
      selectIndex: -1,
      shopData: [],
      shopDataDayTotal: [],
      sellTotalDayData: [],
      brokenQoqData: [],
      brokenCheck: false,
      pageInfo: null,
      goodsInfo: [],
      sellTotalData: [],
      deptTotalData: [],
      personTotalData: [],
      colorMap: null,
      sellColorMap: null,
      nameMap: null,
      dataMap: null,
      brokenData: [],
      list,
      salesColor,
      panelText: '较昨日'
    }
  },
  provide() {
    return {
      dataList: this.list
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'userDeptId'])
  },
  mounted() {
    // this.chooseDate('week')
    // this.chooseAnLiDate('week')
    if (sessionStorage.getItem('departmentDataSet')) {
      const setBuObj = JSON.parse(sessionStorage.getItem('departmentDataSet') || '{}')
      console.log('&&&&&&&&&&&&&&&:', setBuObj)
      if (setBuObj.qudaoSelectIndex) {
        setTimeout(() => {
          this.selectIndex = setBuObj.qudaoSelectIndex
          this.goPage(setBuObj.qudaoItem, setBuObj.qudaoItemIndex)
        }, 300)
      }
    }
  },
  async created() {
    this.pageInfo = this.$route.query
    // 钻取带进来的参数
    const dataQuery = JSON.parse(sessionStorage.getItem('departmentQuery'))
    this.search.time.active = 0
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()
    const string = year + '-' + (month < 10 ? '0' + month : month + '') + '-' + (day < 10 ? '0' + day : day + '')
    this.search.time.time = [string, string]
    this.form.startTime = string
    this.form.endTime = string
    if (this.$route.query.type) {
      this.form = { ...this.form, ...dataQuery }
      this.form.deptId = this.$route.query.type
      this.form.copyDeptId = [Number(this.$route.query.type)]
      const timeType = new Map([[0, ''], [1, 0], [2, 7], [3, 'month'], [4, 'year']])
      this.searchActive = timeType.get(this.form.type)
      // 0表示没有选中按钮
      if (this.form?.type === 0) {
        this.search = {
          time: {
            active: '',
            time: [this.form.startTime, this.form.endTime]
          },
          current: 0
        }
      } else {
        this.search = {
          time: {
            active: timeType.get(this.form.type) ? timeType.get(this.form.type) : this.form.type,
            time: [this.form.startTime, this.form.endTime]
          },
          current: 0
        }
      }
    }
    console.log('aftterrreeeee::::create::!!!', this.search)
    this.colorMap = new Map([[1, '#0C6FFF'], [2, '#6C27FF'], [3, '#FF5962'], [4, '#2BC6FE'], [5, '#FFCA69'], [6, '#00E3DB'], [7, '#A5E20D'], [8, '#2BC6FE']])
    this.sellColorMap = new Map([[1, '#0051FF'], [2, '#FA9D3B'], [3, '#FF6931'], [4, '#0099FF'], [10, '#eb800f'], [11, '#2BC6FE'], [12, '#663645'], [13, '#a2dbf1'], [14, '#da1430'], [15, '#30b06b'], [16, '#f57474'], [17, '#ca81c7'], [20, '#7f9b4c']])
    this.nameMap = new Map([[1, '成交金额'], [2, '成交金额'], [3, '退款金额'], [4, '成交订单数'], [5, '退款订单数'], [6, '直播带货成交金额'], [7, '内容带货成交金额'], [8, '自然带货成交金额']])
    this.dataMap = new Map([[1, ''], [2, ''], [3, ''], [4, ''], [5, ''], [6, ''], [7, ''], [8, '']])
    this.qoqDataMap = new Map([[1, ''], [2, ''], [3, ''], [4, ''], [5, ''], [6, ''], [7, ''], [8, '']])
    this.list = JSON.parse(JSON.stringify(this.list))
    this.list[2].titleTips = '部门业绩中已成功退款的退款金额总和'
    this.list[5].titleTips = '由直播带货产生的业绩总和'
    this.list[6].titleTips = '由达人账号内容带货产生的业绩总和'
    this.list[0].titleTips = '部门产出业绩总和'
    this.list[7].titleTips = '用户自由进店购买的成交金额总和'
    this.initPage()
    this.updataBroken()
    if (this.$route.query.type) {
      delete this.form.type
      this.queryList(this.form)
    }
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
    // 跳转店铺
    goShop(item, ele) {
      const setBuObj = JSON.parse(sessionStorage.getItem('departmentDataSet') || '{}')
      this.$router.push({
        path: `/business/shopData?type=${ele.shopId}&name=${ele.shopName}&form=部门经营数据&timeType=${setBuObj.timeObject?.active ? setBuObj.timeObject?.active : ''}`
      })
      sessionStorage.setItem('shopDataQuery', JSON.stringify({ ...this.form, ...{ goodsInfo: this.goodsInfo }, ...{ channelId: item.orderChannel } }))
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
          active: 'month',
          time: [this.form.startTime, this.form.endTime]
        },
        current: 0
      }
      this.queryList(item)
    },
    goPersonalPage(item) {
      const setBuObj = JSON.parse(sessionStorage.getItem('departmentDataSet') || '{}')
      this.$router.push({
        path: `/business/personalData?type=${item.staffId}&name=${item.personName}&timeType=${setBuObj.timeObject?.active ? setBuObj.timeObject?.active : ''}`
      })
      sessionStorage.setItem('personalDataQuery', JSON.stringify({ ...this.form, ...{ goodsInfo: this.goodsInfo } }))
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
    updataForm(item) {
      this.form = { ...this.form, ...item }
      console.log(this.form, '选择老师')
    },
    // 查询
    async queryList(item, goodsInfo) {
      // this.$loading()
      this.form = { ...this.form, ...item }
      this.selectIndex = -1
      this.goodsInfo = goodsInfo
      this.panelText = typeText[item.type + '']
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
        console.log('奇奇怪怪：', res)
        const newArr = res.data.filter(item => item.orderChannel !== 5)
        this.sellTotalData = Object.assign([], newArr)
        console.log('奇ssfdsfdsafdsfds：', this.sellTotalData)
      })
      getPersonTotalData(this.form).then((res) => {
        this.personTotalData = Object.assign([], res.data)
      })
      getPersonTotalCount(this.form).then((res) => {
        this.personTotalCountall = { ...this.personTotalCountall, ...res.data }
        console.log(res, '成员业绩统计')
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
            data: e.sellChannelsDayDetailList.map(k => Number(k.totalCount / 100))
          })
        })
        this.sellTotalDayData = Object.assign([], arr)
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
