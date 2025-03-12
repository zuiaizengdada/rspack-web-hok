<template>
  <MCard class="pageWrap">
    <filterTop
      :search="search"
      :list-data="search.type === 0 ? listData : listDataOne"
      @clear="initData"
      @onSearch="onSearch"
      @handleParam="handleParam"
    />
    <lineChat ref="lineCharts" :param-type="search.paramType" />
    <histogram
      ref="histogramRef"
      :tab-type="search.type"
      type="department"
      @handleFollowDept="handleFollowDept"
    />
    <tableList
      ref="tableListRef"
      :search="search"
      style="margin-top: 32px"
      :tab-type="search.type"
      type="department"
    />
    <filterBottom
      style="margin-bottom: 32px"
      :search="search"
      type="department"
      @clear="initData"
      @onSearch="onSearch"
      @handleParam="handleParam"
    />
  </MCard>
</template>

<script>
import filterTop from '../components/filterTop.vue'
import lineChat from '../components/lineChat.vue'
import tableList from '../components/tableList.vue'
import histogram from '../components/histogram.vue'
import filterBottom from '../components/filterBottom.vue'
import {
  getSelectData,
  getDailyLineChart,
  getClueStatPayBoard,
  getClueStatPayTrendDate
} from '@/api/privateArea/kanban'
export default {
  components: {
    filterTop,
    lineChat,
    tableList,
    filterBottom,
    histogram
  },
  data() {
    return {
      selectList: [1],
      dataMap: null,
      qoqDataMap: null,
      form: {
        endTime: '',
        startTime: '',
        pageType: 1,
        type: 3
      },
      total: 0,
      search: {
        type: 0,
        searchType: 2,
        time: { active: 7, time: ['', ''], type: undefined },
        clueType: 1, // 线索管理
        channelId: '', // 渠道ID
        deptIdChain: [], // 跟进人部门链
        followDeptId: '',
        followDeptName: '',
        teacherId: '',
        teacherName: '',
        paramType: 1
      },
      labelSearch: {},
      lineChartData: [],
      // 统计
      listData: [
        {
          paramType: 1,
          text: '分配线索数',
          tips: '查询条件内的分配线索数量',
          value: '0',
          basisRatio: 0,
          previousValue: 0,
          numKey: 'clueNum',
          ratioKey: 'upperClueNum'
        },
        {
          paramType: 2,
          text: 'AI外呼触达线索数',
          tips: '分配的线索中成功AI外呼的线索数，同一个线索只统计一次',
          value: '0',
          basisRatio: 0,
          previousValue: 0,
          numKey: 'outBoundNum',
          ratioKey: 'upperOutBoundNum',
          completingRate: '',
          completingTime: ''
        },
        {
          paramType: 3,
          text: '人工外呼触达线索数',
          tips: '分配的线索中成功人工外呼的线索数，同一个线索只统计一次',
          value: '0',
          basisRatio: 0,
          previousValue: 0,
          numKey: 'manualOutBoundNum',
          ratioKey: 'upperManualOutBoundNum',
          completingRate: '',
          completingTime: ''
        },
        {
          paramType: 4,
          text: '短信触达线索数',
          tips: '分配的线索中成功发送短信的线索数，同一个线索只统计一次，含送达和未知状态',
          value: '0',
          basisRatio: 0,
          previousValue: 0,
          deliveryRate: '',
          numKey: 'sendSmsNum',
          ratioKey: 'upperSendSmsNum'
        },
        {
          paramType: 5,
          text: [
            '总加微数',
            '总加企微数',
            '自动加企微数',
            '人工加企微数',
            '个微加微数'
          ],
          tips: `总加微数：分配的线索中成功加上企微或者个位的线索数，同一个线索只统计一次<br/>
            总加企微数：分配的线索中成功加上企微的线索数，同一个线索只统计一次<br/>
            自动加企微数：配的线索中通过系统自动加上企微的线索数，同一个线索只统计一次<br/>
            人工加企微数：分配的线索中非系统自动加上企微的线索数，同一个线索只统计一次<br/>
            个微加微数：分配的线索中成功加上个微的线索数，同一个线索只统计一次
          `,
          value: [],
          isCarousel: true,
          previousValue: 0,
          basisRatio: [],
          valueOne: 0,
          previousValueeOne: 0,
          basisRatioeOne: 0,
          numKey: [
            'addWxNum',
            'sumAddQwNum',
            'addQwNum',
            'manualAddQwNum',
            'addGwNum'
          ],
          ratioKey: [
            'upperAddWxNum',
            'upperSumAddQwNum',
            'upperAddQwNum',
            'upperManualAddQwNum',
            'upperAddGwNum'
          ],
          addWxRate: []
        },
        {
          paramType: 6,
          text: '到课数',
          tips: '分配的线索中，线索创建时间后产生过到课记录，一个线索算1次',
          value: 0,
          previousValue: 0,
          basisRatio: 0,
          numKey: 'coursesNum',
          ratioKey: 'upperCoursesNum',
          convertedRatio: 0
        },
        {
          paramType: 7,
          text: '线索转化订单数',
          tips: '分配的线索中，线索创建时间后产生的所有已支付订单数',
          value: 0,
          previousValue: 0,
          basisRatio: 0,
          numKey: 'convertedOrdersNum',
          ratioKey: 'upperConvertedOrdersNum',
          convertedRatio: 0
        },
        {
          paramType: 8,
          text: '订单金额(GMV)',
          tips: '分配的线索中，线索创建时间后产生的所有已支付订单金额',
          value: 0,
          previousValue: 0,
          basisRatio: 0,
          numKey: 'conversionAmount',
          ratioKey: 'upperConversionAmount',
          ismoney: true
        },
        {
          paramType: 9,
          text: '转化退款金额',
          tips: '分配的线索中，线索创建时间后产生的所有退款金额',
          value: 0,
          previousValue: 0,
          basisRatio: 0,
          numKey: 'refundAmount',
          ratioKey: 'upperRefundAmount',
          ismoney: true
        },
        {
          paramType: 10,
          text: '营收金额',
          tips: '订单金额-转化退款金额，并且招生老师是认领到私域班主任名下',
          value: 0,
          previousValue: 0,
          basisRatio: 0,
          numKey: 'revenueAmount',
          ratioKey: 'upperRevenueAmount',
          ismoney: true
        },
        {
          paramType: 11,
          text: '人均转化(RPL)',
          tips: 'RPL=订单金额(GMV)/分配线索数',
          value: 0,
          previousValue: 0,
          basisRatio: 0,
          numKey: 'perCapitaConversion',
          ratioKey: 'upperPerCapitaConversion'
        }
      ],
      listDataOne: [
        {
          paramType: 1,
          text: '分配线索数',
          tips: '选择时间段内分配的新线索数',
          value: '0',
          basisRatio: 0,
          previousValue: 0,
          numKey: 'clueNum',
          ratioKey: 'upperClueNum'
        },
        {
          paramType: 2,
          text: '转化订单数',
          tips: '选择时间段内支付的订单数，并且招生老师是认领到私域班主任名下',
          value: 0,
          previousValue: 0,
          basisRatio: 0,
          numKey: 'convertedOrdersNum',
          ratioKey: 'upperConvertedOrdersNum'
        },
        {
          paramType: 3,
          text: '订单金额(GMV)',
          tips: '选择时间段内支付的订单金额，并且招生老师是认领到私域班主任名下',
          value: 0,
          previousValue: 0,
          basisRatio: 0,
          numKey: 'conversionAmount',
          ratioKey: 'upperConversionAmount',
          ismoney: true
        },
        {
          paramType: 4,
          text: '转化退款金额',
          tips: '选择时间段内的退款金额，并且招生老师是认领到私域班主任名下',
          value: 0,
          previousValue: 0,
          basisRatio: 0,
          numKey: 'refundAmount',
          ratioKey: 'upperRefundAmount',
          ismoney: true
        },
        {
          paramType: 5,
          text: '营收金额',
          tips: '单金额-转化退款金额，并且招生老师是认领到私域班主任名下',
          value: 0,
          previousValue: 0,
          basisRatio: 0,
          numKey: 'revenueAmount',
          ratioKey: 'upperRevenueAmount',
          ismoney: true
        },
        {
          paramType: 6,
          text: '人均转化(RPL)',
          tips: 'RPL=订单金额/分配线索数',
          value: 0,
          previousValue: 0,
          basisRatio: 0,
          numKey: 'perCapitaConversion',
          ratioKey: 'upperPerCapitaConversion'
        }
      ],
      // 折线图
      lineChatData: [],
      // 加微统计
      UserClueStat: [],
      // 分页器
      pageData: {
        pageIndex: 1,
        pageSize: 10
      },
      orderByParam: '',
      orderByWay: '',
      loading: false
    }
  },
  mounted() {
    this.$uweb && this.$uweb.setAction('Event_salseData_page')
  },
  methods: {
    // 三个卡片切换
    handleParam(item) {
      // 折线图
      this.lineChartInitData(item)
      // 柱状图
      this.getClueStatHourlineChart()
    },
    // 查询
    onSearch() {
      this.queryAll()
    },

    queryAll() {
      // 统计
      this.getDetail()
      // 折线图
      this.getLineChatData()
      // 员工加微统计
      this.$nextTick(() => {
        this.$refs.tableListRef.init()
      })
      // 柱状图
      this.getClueStatHourlineChart()
    },
    // 初始化数据
    initData() {
      // this.search.time.active = 7
      this.search.clueType = 1
      this.search.channelId = ''
      this.search.deptIdChain = ''
      this.search.teacherId = ''
      this.search.teacherName = ''
      this.search.paramType = 1
      this.queryAll()
    },
    handleFollowDept(data) {
      this.search.followDeptId = data.followDeptId
      this.search.followDeptName = data.followDeptName
      // 统计
      this.getDetail()
      // 折线图
      this.getLineChatData()
      // 员工加微统计
      this.$nextTick(() => {
        this.$refs.tableListRef.init()
      })
    },
    // 柱状图
    async getClueStatHourlineChart() {
      const listData = this.search.type === 0 ? this.listData : this.listDataOne
      const data =
        listData.find(item => item.paramType === this.search.paramType) || {}
      const fieldNames = Array.isArray(data?.numKey)
        ? data.numKey
        : [data.numKey]
      const names = Array.isArray(data?.text) ? data.text : [data.text]
      const prama = {
        names,
        searchType: this.search.searchType,
        type: this.search.time?.type,
        channelId: this.search.channelId,
        clueType: this.search?.clueType, // 线索类型:1-订单、2线下表格
        endTime: this.search.time.time[1],
        startTime: this.search.time.time[0],
        teacherId: this.search.teacherId,
        fieldNames
      }
      this.$nextTick(() => {
        this.$refs.histogramRef.getData(prama, true)
      })
    },
    // 获取数据总览
    getDetail() {
      if (this.search?.type === 0) {
        this.getAllotSelectData()
      } else {
        this.getMakeSelectData()
      }
    },
    async getMakeSelectData() {
      const prama = {
        searchType: this.search.searchType,
        channelId: this.search.channelId,
        clueType: this.search?.clueType, // 线索类型:1-订单、2线下表格
        followDeptId: this.search?.followDeptId,
        // followDeptIdChain:
        //   this.search?.deptIdChain.length > 0
        //     ? `0-${this.search?.deptIdChain?.join('-')}-`
        //     : '',
        endTime: this.search.time.time[1],
        type: this.search.time?.type,
        startTime: this.search.time.time[0],
        teacherId: this.search.teacherId
      }
      const { code, data } = await getClueStatPayBoard(prama)
      if (code === 1 && data) {
        const {
          clueNum,
          clueNumLinkRatio,
          previousClueNum,
          convertedOrdersNum,
          convertedOrdersLinkRatio,
          conversionAmount,
          conversionLinkRatio,
          refundAmount,
          refundAmountLinkRatio,
          revenueAmount,
          revenueAmountLinkRatio,
          previousConvertedOrdersNum,
          previousConversionAmount,
          previousRefundAmount,
          previousRevenueAmount,
          perCapitaConversion,
          previousPerCapitaConversion,
          perCapitaConversionLinkRatio
        } = data
        this.listDataOne[0].value = clueNum || 0
        this.listDataOne[0].previousValue = previousClueNum || 0
        this.listDataOne[0].basisRatio = this.initNum(clueNumLinkRatio)

        this.listDataOne[1].value = convertedOrdersNum || 0
        this.listDataOne[1].previousValue = previousConvertedOrdersNum || 0
        this.listDataOne[1].basisRatio = this.initNum(convertedOrdersLinkRatio)

        this.listDataOne[2].value = (conversionAmount / 100 || 0).toFixed(2)
        this.listDataOne[2].previousValue = (
          Number(previousConversionAmount) / 100 || 0
        ).toFixed(2)
        this.listDataOne[2].basisRatio = this.initNum(conversionLinkRatio)

        this.listDataOne[3].value = (refundAmount / 100 || 0).toFixed(2)
        this.listDataOne[3].previousValue = (
          Number(previousRefundAmount) / 100 || 0
        ).toFixed(2)
        this.listDataOne[3].basisRatio = this.initNum(refundAmountLinkRatio)

        this.listDataOne[4].value = (revenueAmount / 100 || 0).toFixed(2)
        this.listDataOne[4].previousValue = (
          Number(previousRevenueAmount) / 100 || 0
        ).toFixed(2)
        this.listDataOne[4].basisRatio = this.initNum(revenueAmountLinkRatio)

        this.listDataOne[5].value = perCapitaConversion || 0
        this.listDataOne[5].previousValue = (previousPerCapitaConversion || 0).toFixed(2)
        this.listDataOne[5].basisRatio = this.initNum(
          perCapitaConversionLinkRatio
        )
      }
    },
    getAllotSelectData() {
      const data = {
        searchType: this.search.searchType,
        channelId: this.search.channelId,
        clueType: this.search?.clueType, // 线索类型:1-订单、2线下表格
        followDeptId: this.search?.followDeptId,
        // followDeptIdChain:
        //   this.search?.deptIdChain.length > 0
        //     ? `0-${this.search?.deptIdChain?.join('-')}-`
        //     : '',
        endTime: this.search.time.time[1],
        type: this.search.time?.type,
        startTime: this.search.time.time[0],
        teacherId: this.search.teacherId
      }
      getSelectData(data)
        .then(res => {
          if (res.code === 1) {
            // 卡片信息
            const {
              clueNum,
              clueNumLinkRatio,
              previousClueNum,
              addQwNum = 0,
              addQwLinkRatio,
              coursesNum,
              coursesLinkRatio,
              convertedOrdersNum,
              convertedOrdersLinkRatio,
              conversionAmount,
              conversionLinkRatio,
              refundAmount,
              refundAmountLinkRatio,
              revenueAmount,
              revenueAmountLinkRatio,
              previousCoursesNum,
              previousConvertedOrdersNum,
              previousConversionAmount,
              previousRefundAmount,
              previousRevenueAmount,
              outBoundNum,
              previousOutBoundNum,
              outBoundNumLinkRatio,
              callCompletingRate,
              callTotalDuration,
              sendSmsNum,
              previousSendSmsNum,
              sendSmsNumLinkRatio,
              manualOutBoundNum,
              previousManualOutBoundNum,
              manualOutBoundNumLinkRatio,
              manualOutBoundNumRate,
              manualOutBoundCallDuration,
              sendSmsNumRate,
              addWxNum,
              sumAddQwNum,
              manualAddQwNum,
              addGwNum,
              previousAddWxNum,
              previousSumAddQwNum,
              previousAddQwNum,
              previousManualAddQwNum,
              previousAddGwNum,
              addWxLinkRatio,
              sumAddQwNumLinkRatio,
              manualAddQwLinkRatio,
              addGwNumLinkRatio,
              addWxRate,
              sumAddQwNumRate,
              addQwLinkRate,
              manualAddQwLinkRate,
              addGwNumRate,
              perCapitaConversion,
              previousPerCapitaConversion,
              perCapitaConversionLinkRatio,
              convertedRatio
            } = res?.data
            this.listData[0].value = clueNum || 0
            this.listData[0].previousValue = previousClueNum || 0
            this.listData[0].basisRatio = this.initNum(clueNumLinkRatio)

            this.listData[1].value = outBoundNum || 0
            this.listData[1].previousValue = previousOutBoundNum || 0
            this.listData[1].basisRatio = this.initNum(outBoundNumLinkRatio)
            this.listData[1].completingRate = callCompletingRate
              ? `${Math.abs(this.initNum(callCompletingRate))}%`
              : ''
            this.listData[1].completingTime = callTotalDuration
              ? `${Math.ceil(callTotalDuration / 60)}`
              : ''

            this.listData[2].value = manualOutBoundNum || 0
            this.listData[2].previousValue = previousManualOutBoundNum || 0
            this.listData[2].basisRatio = this.initNum(
              manualOutBoundNumLinkRatio
            )
            this.listData[2].completingRate = manualOutBoundNumRate
              ? `${Math.abs(this.initNum(manualOutBoundNumRate))}%`
              : ''
            this.listData[2].completingTime = manualOutBoundCallDuration

            this.listData[3].value = sendSmsNum || 0
            this.listData[3].previousValue = previousSendSmsNum || 0
            this.listData[3].basisRatio = this.initNum(sendSmsNumLinkRatio)
            this.listData[3].deliveryRate = `${Math.abs(
              this.initNum(sendSmsNumRate)
            )}%`

            this.listData[4].value = [
              addWxNum,
              sumAddQwNum,
              addQwNum,
              manualAddQwNum,
              addGwNum
            ]
            this.listData[4].previousValue = [
              previousAddWxNum || 0,
              previousSumAddQwNum || 0,
              previousAddQwNum || 0,
              previousManualAddQwNum || 0,
              previousAddGwNum || 0
            ]
            this.listData[4].basisRatio = [
              this.initNum(addWxLinkRatio),
              this.initNum(sumAddQwNumLinkRatio),
              this.initNum(addQwLinkRatio),
              this.initNum(manualAddQwLinkRatio),
              this.initNum(addGwNumLinkRatio)
            ]
            this.listData[4].addWxRate = [
              `${this.initNum(addWxRate)}%`,
              `${this.initNum(sumAddQwNumRate)}%`,
              `${this.initNum(addQwLinkRate)}%`,
              `${this.initNum(manualAddQwLinkRate)}%`,
              `${this.initNum(addGwNumRate)}%`
            ]

            this.listData[5].value = coursesNum || 0
            this.listData[5].previousValue = previousCoursesNum || 0
            this.listData[5].basisRatio = this.initNum(coursesLinkRatio)

            this.listData[6].value = convertedOrdersNum || 0
            this.listData[6].previousValue = previousConvertedOrdersNum || 0
            this.listData[6].basisRatio = this.initNum(convertedOrdersLinkRatio)
            this.listData[6].convertedRatio = `${convertedRatio || 0}%`

            this.listData[7].value = (conversionAmount / 100 || 0).toFixed(2)
            this.listData[7].previousValue = (
              Number(previousConversionAmount) / 100 || 0
            ).toFixed(2)
            this.listData[7].basisRatio = this.initNum(conversionLinkRatio)

            this.listData[8].value = (refundAmount / 100 || 0).toFixed(2)
            this.listData[8].previousValue = (
              Number(previousRefundAmount) / 100 || 0
            ).toFixed(2)
            this.listData[8].basisRatio = this.initNum(refundAmountLinkRatio)

            this.listData[9].value = (revenueAmount / 100 || 0).toFixed(2)
            this.listData[9].previousValue = (
              Number(previousRevenueAmount) / 100 || 0
            ).toFixed(2)
            this.listData[9].basisRatio = this.initNum(revenueAmountLinkRatio)

            this.listData[10].value = perCapitaConversion || 0
            this.listData[10].previousValue = (previousPerCapitaConversion || 0).toFixed(2)
            this.listData[10].basisRatio = this.initNum(
              perCapitaConversionLinkRatio
            )
          }
        })
        .catch(() => {})
    },
    initNum(num = 0) {
      if (num % 1 === 0) {
        return num
      } else {
        return `${(num || 0).toFixed(2)}`
      }
    },
    // 折线图
    getLineChatData() {
      if (this.search.type === 0) {
        this.getAllotLineChatData()
      } else {
        this.getMakeLineChatData()
      }
    },
    getMakeLineChatData() {
      const data = {
        searchType: this.search.searchType,
        paramType: this.search.paramType,
        channelId: this.search.channelId,
        clueType: this.search?.clueType, // 线索类型:1-订单、2线下表格
        followDeptId: this.search?.followDeptId,
        // followDeptIdChain:
        //   this.search?.deptIdChain.length > 0
        //     ? `0-${this.search?.deptIdChain?.join('-')}-`
        //     : '',
        endTime: this.search.time.time[1],
        type: this.search.time?.type,
        startTime: this.search.time.time[0],
        teacherId: this.search.teacherId
      }
      getClueStatPayTrendDate(data)
        .then(res => {
          if (res.code === 1) {
            this.lineChartData = res.data
            this.lineChartInitData()
          }
        })
        .catch(() => {})
    },
    getAllotLineChatData() {
      const data = {
        searchType: this.search.searchType,
        paramType: this.search.paramType,
        channelId: this.search.channelId,
        clueType: this.search?.clueType, // 线索类型:1-订单、2线下表格
        followDeptId: this.search?.followDeptId,
        // followDeptIdChain:
        //   this.search?.deptIdChain.length > 0
        //     ? `0-${this.search?.deptIdChain?.join('-')}-`
        //     : '',
        endTime: this.search.time.time[1],
        type: this.search.time?.type,
        startTime: this.search.time.time[0],
        teacherId: this.search.teacherId
      }
      getDailyLineChart(data)
        .then(res => {
          if (res.code === 1) {
            this.lineChartData = res.data
            this.lineChartInitData()
          }
        })
        .catch(() => {})
    },

    lineChartInitData() {
      const xAxis = this.lineChartData?.map(item => item.date)
      const upperDate = this.lineChartData?.map(item => item.upperDate)
      const listData = this.search.type === 0 ? this.listData : this.listDataOne
      // 数量
      let seriesNumData = []
      if (!listData[this.search.paramType - 1]?.isCarousel) {
        seriesNumData = this.lineChartData?.map(item => {
          const ismoney = listData[this.search.paramType - 1]?.ismoney
          const money = item[listData[this.search.paramType - 1]?.numKey] || 0
          if (ismoney) return (money / 100 || 0).toFixed(2)
          return money
        })
      } else {
        seriesNumData = this.lineChartData?.map(item => {
          const data = []
          listData[this.search.paramType - 1]?.numKey?.forEach(k => {
            data.push(item[k])
          })
          return data
        })
      }

      // 环比
      let seriesLinkRatioData = []
      if (!listData[this.search.paramType - 1]?.isCarousel) {
        seriesLinkRatioData = this.lineChartData?.map(item => {
          const ismoney = listData[this.search.paramType - 1]?.ismoney
          const money = item[listData[this.search.paramType - 1]?.ratioKey] || 0
          if (ismoney) return (money / 100 || 0).toFixed(2)
          return money
        })
      } else {
        seriesLinkRatioData = this.lineChartData?.map(item => {
          const data = []
          listData[this.search.paramType - 1]?.ratioKey?.forEach(k => {
            data.push(item[k])
          })
          return data
        })
      }
      this.$refs.lineCharts &&
        this.$refs.lineCharts.setOptions(
          xAxis,
          upperDate,
          seriesNumData,
          seriesLinkRatioData,
          listData[this.search.paramType - 1].text
        )
    }
  }
}
</script>

<style lang="scss" scoped>
.pageWrap {
  background: #f6faff;
  padding-top: 0;
}
</style>
