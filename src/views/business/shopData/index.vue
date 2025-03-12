<template>
  <div class="wrapper">
    <div class="live-content">
      <goBackHeader :content="formName" />
      <!--      <data-overview :title="pageInfo.name" :new-time="newTime" @submit="queryList" />-->
      <data-search
        :title="`${pageInfo.name}经营数据`"
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
    </div>
  </div>
</template>

<script>
import DataSearch from './components/dataSearch'
import goBackHeader from '@/components/goBackHeader'
import DataPanel from '@/components/AppPanelData/dataPanel'
import DataBroken from './components/dataBroken'
import { list } from '@/components/AppPanelData/dataList'
import {
  getDataNewTime,
  getExpertSales, getExpertSales1,
  getLiveBroadcast, getLiveBroadcast1,
  getQmv, getQmv1,
  getRefundAmount, getRefundAmount1, getUnexpertSale, getUnexpertSale1
} from '@/api/business'
import { typeText } from '@/utils/enum'
export default {
  components: {
    DataPanel,
    DataSearch,
    DataBroken,
    goBackHeader
  },
  data() {
    return {
      selectList: [1],
      newTime: '',
      form: {
        endTime: '',
        startTime: '',
        pageType: 5,
        type: 3,
        deptId: '', // 部门ID
        channelId: '', // 渠道ID
        orderType: '', // 订单类型
        productIdList: [], // 商品id
        teacherId: '', // ip老师ID
        shopId: '',
        contentName: '',
        lecturerName: ''
      },
      searchActive: 'month',
      search: {
        time: {
          active: '',
          time: ['', '']
        },
        current: 0
      },
      goodsInfo: [],
      sellTotalData: [],
      pageInfo: null,
      formName: '',
      deptTotalData: [],
      sellTotalDayData: [],
      deptTotalDayData: [],
      brokenQoqData: [],
      brokenCheck: false,
      colorMap: null,
      qoqDataMap: null,
      nameMap: null,
      dataMap: null,
      brokenData: [],
      list,
      panelText: '较昨日'
    }
  },
  provide() {
    return {
      dataList: this.list
    }
  },
  mounted() {
    // this.chooseDate('week')
    // this.chooseAnLiDate('week')
  },
  created() {
    this.pageInfo = this.$route.query
    // 钻取带进来的参数
    const dataQuery = JSON.parse(sessionStorage.getItem('shopDataQuery'))
    if (this.$route.query.type) {
      this.form = { ...this.form, ...dataQuery }
      console.log('dddddd:', this.form)
      this.form.pageType = 5
      this.formName = this.pageInfo.form
      this.form.shopId = this.pageInfo.type
      const timeType = new Map([[0, ''], [1, 0], [2, 7], [3, 'month'], [4, 'year']])
      this.searchActive = timeType.get(this.pageInfo.timeType) ? timeType.get(this.pageInfo.timeType) : this.pageInfo.timeType
      // 0表示没有选中按钮
      if (this.pageInfo.timeType === 0) {
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
            active: timeType.get(this.pageInfo.timeType) ? timeType.get(this.pageInfo.timeType) : this.pageInfo.timeType,
            time: [this.form.startTime, this.form.endTime]
          },
          current: 0
        }
      }
    }
    this.colorMap = new Map([[1, '#0C6FFF'], [2, '#6C27FF'], [3, '#FF5962'], [4, '#2BC6FE'], [5, '#FFCA69'], [6, '#00E3DB'], [7, '#A5E20D'], [8, '#2BC6FE']])
    this.nameMap = new Map([[1, '成交金额'], [2, '成交金额'], [3, '退款金额'], [4, '成交订单数'], [5, '退款订单数'], [6, '直播带货成交金额'], [7, '内容带货成交金额'], [8, '自然带货成交金额']])
    this.qoqDataMap = new Map([[1, ''], [2, ''], [3, ''], [4, ''], [5, ''], [6, ''], [7, ''], [8, '']])
    this.dataMap = new Map([[1, ''], [2, ''], [3, ''], [4, ''], [5, ''], [6, ''], [7, ''], [8, '']])
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
      this.searchActive = 'month'
      this.queryList(item)
    },
    updataForm(item) {
      this.form = { ...this.form, ...item }
    },
    // 查询
    async queryList(item, goodsInfo) {
      // this.$loading()
      this.form = { ...this.form, ...item }
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
