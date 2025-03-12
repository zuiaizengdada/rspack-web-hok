<template>
  <div v-if="menuList.length" class="order-wrap">
    <div class="order-car">
      <div class="menu-box">
        <div v-for="item in menuList" :key="item.id">
          <div
            class="menu-info"
            :class="[item.status ? 'menu-active' : '']"
            @click="handleMenuSelect(item.id)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
      <div v-show="tabShow === 1">
        <div class="search-box">
          <search-top
            ref="orderSearch"
            key="001"
            :options-approval="optionsApproval"
            @search="searchFn"
            @searchFnApproval="searchFnApproval"
          />
        </div>
        <div v-if="statusMenu" class="order-list">
          <order-list
            ref="orderList"
            key="001"
            @sizeChange="sizeChange"
            @tableDataNum="tableDataNum"
          />
        </div>
      </div>
      <div v-show="tabShow === 2">
        <div class="choose-channel-block">
          <span :class="myTabValue === 0?'active':''" @click="changeMyTab(0)">我的订单</span>
          <span v-permission="['system:MyScanOrder', permsList]" :class="myTabValue === 1?'active':''" @click="changeMyTab(1)">扫码录单</span>
        </div>
        <div class="search-box">
          <search-top-My
            v-if="myTabValue===0"
            ref="orderSearchMy"
            key="002"
            :search="searchMyOrder"
            :options-approval="optionsApproval"
            @search="searchFnMy"
            @searchFnApproval="searchFnApprovalMy"
          />
          <search-top-scan
            v-if="myTabValue===1"
            ref="orderSearchMy"
            key="006"
            :search="searchMyScanOrder"
            :options-approval="optionsApproval"
            @search="searchFnMyScan"
            @searchFnApproval="searchFnApprovalMy"
          />
        </div>
        <div class="order-list">
          <order-list-my
            v-if="myTabValue===0"
            ref="orderListMy"
            key="002"
            @sizeChange="sizeChangeMy"
            @tableDataNum="tableDataNumMy"
          />
          <order-list-my-scan
            v-if="myTabValue===1"
            ref="orderListMyScan"
            key="006"
            @sizeChange="sizeChangeMyScan"
            @tableDataNum="tableDataNumMyScan"
          />
        </div>
      </div>
      <div v-show="tabShow === 3">
        <div class="search-box">
          <search-top-audit
            ref="orderSearchAudit"
            key="003"
            :search="searchAudit"
            :options-approval="optionsApproval"
            @search="searchFnAudit"
            @searchFnApproval="searchFnApprovalAudit"
          />
        </div>
        <div v-if="statusMenu" class="order-list">
          <order-list-audit
            ref="orderListAudit"
            key="003"
            @sizeChange="sizeChangeAudit"
            @tableDataNum="tableDataNumAudit"
          />
        </div>
      </div>
      <div v-show="tabShow === 4">
        <div class="search-box">
          <search-complete
            ref="orderSearchComplete"
            key="004"
            :search="searchCompleteObj"
            @search="searchForComplete"
          />
        </div>
        <div v-if="statusMenu" class="order-list">
          <order-list-complete
            ref="orderListComplete"
            key="004"
            @sizeChange="sizeChangeAudit"
            @tableDataNum="tableDataNumAudit"
          />
        </div>
      </div>
      <div v-show="tabShow === 5">
        <decrypting />
      </div>
      <div v-show="tabShow === 6">
        <div class="search-box">
          <search-noassociated
            ref="orderNoAssociated"
            key="005"
            :search="searchNoAssociatedObj"
            @search="searchForNoAssociated"
          />
        </div>
        <div v-if="statusMenu" class="order-list">
          <order-list-no-associated
            ref="orderListNoAssociated"
            key="005"
            @sizeChange="sizeChangeNoAssociated"
            @tableDataNum="tableDataNumNoAssociated"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchTop from './components/search/index'
import OrderList from './components/orderList/index'
import SearchTopMy from './components/my/search/index'
import OrderListMy from './components/my/orderList/index'
import SearchTopAudit from './components/audit/search/index'
import OrderListAudit from './components/audit/orderList/index'
import SearchComplete from './components/complete/search/index'
import orderListComplete from './components/complete/orderList/index'
import searchNoassociated from './components/noAssociated/search/index'
import orderListNoAssociated from './components/noAssociated/orderList/index'
import decrypting from './components/decrypting/index'
import searchTopScan from './components/my/search/scan'
import OrderListMyScan from './components/my/orderList/scan'
export default {
  name: 'CourseDoc',
  components: {
    SearchTop,
    OrderList,
    SearchTopMy,
    OrderListMy,
    SearchTopAudit,
    OrderListAudit,
    SearchComplete,
    orderListComplete,
    searchNoassociated,
    orderListNoAssociated,
    decrypting,
    searchTopScan,
    OrderListMyScan
  },
  data() {
    return {
      menuList: [],
      permsList: this.$route?.meta?.permsList || [],
      loading: false,
      visibleDialogOssUpload: false,
      activeIndex: 0,
      searchAll: {
        type: 1,
        status: true,
        order: { label: 'orderNo', value: '' }, // 订单搜索
        time: { label: 1, value: ['', ''] }, // 订单时间
        commerceInfo: '0',
        commerceInfoValue: '',
        trafficType: '',
        orderPlace: '',
        goodsName: '', // 商品名称
        liveRoomCode: '', // 直播间ID
        orderStatus: '', // 订单状态
        orderType: '', // 订单类型
        userTerminal: '', // 渠道来源
        channelSource: '', // 渠道来源
        thirdShopId: '', // 第三方店铺id
        thirdShopName: '', // 第三方店铺名称
        paymentType: '', // 支付方式
        folowerId: '', // 跟进人员id
        folowername: '', // 跟进人员姓名
        payPromotion: '', // 筛选推广
        orderAudit: '', // 全部我的订单审核状态
        current: 1, // 当前页
        size: 10, // 每页条数
        activeIndex: 0, // 当前类别
        activeName: '', // 当前类别名称
        approvalName: '', // 当前审批名称
        pagination: true, // 开启分页显示
        examineStatus: '' // 审核页面审核状态
      },
      searchMyOrder: {
        type: 2,
        status: true,
        order: { label: 'orderNo', value: '' }, // 订单搜索
        time: { label: 1, value: ['', ''] }, // 订单时间
        goodsName: '', // 商品名称
        liveRoomCode: '', // 直播间ID
        orderStatus: '', // 订单状态
        orderType: '', // 订单类型
        userTerminal: '', // 渠道来源
        channelSource: '', // 渠道来源
        thirdShopId: '', // 第三方店铺id
        thirdShopName: '', // 第三方店铺名称
        paymentType: '', // 支付方式
        folowerId: '', // 跟进人员id
        folowername: '', // 跟进人员姓名
        payPromotion: '', // 筛选推广
        orderAudit: '', // 全部我的订单审核状态
        current: 1, // 当前页
        size: 10, // 每页条数
        activeIndex: 0, // 当前类别
        activeName: '', // 当前类别名称
        approvalName: '', // 当前审批名称
        pagination: true, // 开启分页显示
        examineStatus: '', // 审核页面审核状态
        isQrcode: false
      },
      searchMyScanOrder: {
        type: 2,
        status: true,
        order: { label: 'orderNo', value: '' }, // 订单搜索
        time: { label: 1, value: ['', ''] }, // 订单时间
        goodsName: '', // 商品名称
        liveRoomCode: '', // 直播间ID
        orderStatus: '', // 订单状态
        orderType: '', // 订单类型
        userTerminal: '', // 渠道来源
        channelSource: '', // 渠道来源
        thirdShopId: '', // 第三方店铺id
        thirdShopName: '', // 第三方店铺名称
        paymentType: '', // 支付方式
        folowerId: '', // 跟进人员id
        folowername: '', // 跟进人员姓名
        payPromotion: '', // 筛选推广
        orderAudit: '', // 全部我的订单审核状态
        current: 1, // 当前页
        size: 10, // 每页条数
        activeIndex: 0, // 当前类别
        activeName: '', // 当前类别名称
        approvalName: '', // 当前审批名称
        pagination: true, // 开启分页显示
        examineStatus: '', // 审核页面审核状态
        isQrcode: true,
        confirmUser: ''
      },
      searchAudit: {
        type: 3,
        status: true,
        order: { label: 'orderNo', value: '' }, // 订单搜索
        time: { label: 1, value: ['', ''] }, // 订单时间
        goodsName: '', // 商品名称
        liveRoomCode: '', // 直播间ID
        orderStatus: '', // 订单状态
        orderType: '', // 订单类型
        userTerminal: '', // 渠道来源
        channelSource: '', // 渠道来源
        thirdShopId: '', // 第三方店铺id
        thirdShopName: '', // 第三方店铺名称
        paymentType: '', // 支付方式
        folowerId: '', // 跟进人员id
        folowername: '', // 跟进人员姓名
        payPromotion: '', // 筛选推广
        orderAudit: '', // 全部我的订单审核状态
        current: 1, // 当前页
        size: 10, // 每页条数
        activeIndex: 0, // 当前类别
        activeName: '', // 当前类别名称
        approvalName: '', // 当前审批名称
        pagination: true, // 开启分页显示
        examineStatus: '', // 审核页面审核状态
        auditType: 1 // 审批类型
      },
      searchCompleteObj: {
        orderTimeArray: [],
        operateTimeArray: [],
        orderId: '',
        channelSource: '', // 渠道来源
        current: 1, // 当前页
        size: 10, // 每页条数
        complementStatus: [1, 4], // 订单补齐状态
        complementType: '', // 补齐类型
        endTime: '', // 操作结束时间
        orderEndTime: '', // 订单结束时间
        orderStartTime: '', // 订单开始时间
        shopId: '', // 店铺ID
        startTime: '', // 操作开始时间
        thirdShopName: '', // 第三方店铺名称
        updateBy: '', // 操作人
        virtualPhone: '' // 虚拟号码
      },
      searchNoAssociatedObj: {
        orderId: '',
        channelSource: '', // 渠道来源
        current: 1, // 当前页
        size: 10, // 每页条数
        status: '',
        orderEndTime: '', // 订单结束时间
        orderStartTime: '', // 订单开始时间
        shopId: '', // 店铺ID
        thirdShopName: '' // 第三方店铺名称
      },
      tabShow: '',
      statusMenu: true,
      optionsApproval: [], // 审批按钮
      myTabValue: 0, // 1我的订单 2扫码录单
      myTabList: ['我的订单', '扫码录单']
    }
  },
  watch: {
    search(val) {
      console.log('search', val)
    },
    searchMy(val) {
      console.log('searchMy', val)
    }
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
    const menuList = []
    const optionsApproval = []
    // 订单页大tab
    this.permsList.map(v => {
      if (v === 'system:AllOrder') {
        menuList.push({
          name: '全部订单',
          status: true,
          perms: 'system:AllOrder',
          id: 1
        })
      } else if (v === 'system:MyOrder') {
        menuList.push({
          name: '我的订单',
          status: false,
          perms: 'system:MyOrder',
          id: 2
        })
      } else if (v === 'system:MyApproval') {
        menuList.push({
          name: '我的审批',
          status: false,
          perms: 'system:MyApproval',
          id: 3
        })
      } else if (v === 'system:replenishment') {
        menuList.push({
          name: '订单补齐',
          status: false,
          perms: 'system:replenishment',
          id: 4
        })
      } else if (v === 'system:decrypting') {
        menuList.push({
          name: '订单解密',
          status: false,
          perms: 'system:decrypting',
          id: 5
        })
      } else if (v === 'system:noAssociated') {
        menuList.push({
          name: '商品未关联',
          status: false,
          perms: 'system:noAssociated',
          id: 6
        })
      }
    })
    menuList.sort((a, b) => {
      return a.id - b.id
    })
    // 复审页小tab处理
    this.permsList.map(v => {
      if (v === 'system:order:trial') {
        optionsApproval.push({
          id: 0,
          label: 0,
          status: true,
          name: '初审订单'
        })
      } else if (v === 'system:order:review') {
        optionsApproval.push({
          id: 1,
          label: 1,
          status: false,
          name: '复审订单'
        })
      } else if (v === 'web:order:approved:pass') {
        optionsApproval.push({
          id: 3,
          label: 2,
          status: false,
          name: '审批通过'
        })
      } else if (v === 'web:order:approved:no') {
        optionsApproval.push({
          id: 2,
          label: 3,
          status: false,
          name: '审批驳回'
        })
      }
    })
    optionsApproval.sort((a, b) => {
      return a.label - b.label
    })
    this.menuList = menuList
    this.optionsApproval = optionsApproval
    this.getdateNoTime()
  },
  mounted() {
    const that = this
    this.retoolMenu()
    this.approvalMenu()
    const optionsApproval = this.optionsApproval
    // 首次请求
    setTimeout(() => {
      if (this.menuList.length) {
        this.menuList.map(v => {
          if (v.status) {
            if (v.name === '全部订单') {
              const config = that.searchAll
              // config['activeIndex'] = i
              config['activeName'] = '全部订单'
              config['approvalName'] = ''
              config['pagination'] = true
              config['optionsApproval'] = that.optionsApproval
              this.$refs.orderList.setSearchOption(config)
              this.searchAll.status = false
            } else if (v.name === '我的订单') {
              const config = that.searchMyOrder
              // config['activeIndex'] = i
              config['activeName'] = '我的订单'
              config['approvalName'] = ''
              config['pagination'] = true
              config['optionsApproval'] = that.optionsApproval
              this.$refs.orderListMy.setSearchOption(config)
              this.searchMyOrder.status = false
            } else if (v.name === '我的审批') {
              if (optionsApproval.length) {
                that.optionsApproval.map(e => {
                  console.log('e', e)
                  if (e.status) {
                    let approvalName = ''
                    that.$refs.orderSearchAudit.approvalChange(e.name)
                    if (e.name === '初审订单') {
                      approvalName = '初审订单'
                      that.searchAudit.examineStatus = 0
                    } else if (e.name === '复审订单') {
                      approvalName = '复审订单'
                      that.searchAudit.examineStatus = 1
                    } else if (e.name === '审批通过') {
                      approvalName = '审批通过'
                      that.searchAudit.examineStatus = 3
                    } else if (e.name === '审批驳回') {
                      approvalName = '审批驳回'
                      that.searchAudit.examineStatus = 2
                    }
                    const config = that.searchAudit
                    // config['activeIndex'] = i
                    config['activeName'] = '我的审批'
                    config['approvalName'] = approvalName
                    config['pagination'] = true
                    config['optionsApproval'] = that.optionsApproval
                    that.$refs.orderListAudit.setSearchOption(config)
                    that.searchAudit.status = false
                  }
                })
              }
            }
          }
        })
      }
    }, 100)
  },
  activated() {
    console.log('监听变化', this.tabShow)
    if (this.tabShow === 1) {
      this.$refs.orderList.setSearchOption(this.searchAll)
    } else if (this.tabShow === 2) {
      this.$refs.orderListMy.setSearchOption(this.searchMyOrder)
    } else if (this.tabShow === 3) {
      this.$refs.orderListAudit.setSearchOption(this.searchAudit)
    }
  },
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    // 我的订单 切换tab
    changeMyTab(index) {
      this.myTabValue = index
      this.$nextTick(() => {
        if (this.myTabValue === 0) {
          this.$refs.orderListMy.setSearchOption({
            ...this.searchMyOrder })
        } else {
          this.$refs.orderListMyScan.setSearchOption({
            ...this.searchMyScanOrder })
        }
      })
    },
    getdateNoTime() {
      const now = new Date()
      const y = now.getFullYear()
      const m = now.getMonth() + 1
      const d = now.getDate()
      const result =
        y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
      const startTime = now.setDate(now.getDate() - 30)
      const starty = new Date(startTime).getFullYear()
      const startm = new Date(startTime).getMonth() + 1
      const startd = new Date(startTime).getDate()
      const resultStart =
        starty +
        '-' +
        (startm < 10 ? '0' + startm : startm) +
        '-' +
        (startd < 10 ? '0' + startd : startd)
      this.searchAll.time.value = [resultStart, result]
      this.searchMyOrder.time.value = [resultStart, result]
      this.searchMyScanOrder.time.value = [resultStart, result]
      this.searchAudit.time.value = [resultStart, result]
      this.searchCompleteObj.orderTimeArray = [resultStart, result]
    },
    async retoolMenu() {
      const that = this
      let status = true
      await (function () {
        return new Promise(function (res, rej) {
          that.menuList.map((v, i) => {
            if (v.name === '全部订单') {
              that.searchAll.activeName = '全部订单'
              status = false
              that.tabShow = 1
            }
          })
          res()
        })
      })()
      await (function () {
        return new Promise(function (res, rej) {
          that.menuList.map((v, i) => {
            if (status) {
              if (v.name === '我的订单') {
                that.searchAll.activeName = '我的订单'
                v.status = true
                status = false
                that.tabShow = 2
              }
            }
          })
          res()
        })
      })()
      await (function () {
        return new Promise(function (res, rej) {
          that.menuList.map((v, i) => {
            if (status) {
              if (v.name === '我的审批') {
                that.searchAll.activeName = '我的审批'
                v.status = true
                status = false
                that.tabShow = 3
              }
            }
          })
          res()
        })
      })()
    },
    async approvalMenu() {
      const that = this
      let status = true
      await (function () {
        return new Promise(function (res, rej) {
          that.optionsApproval.map((v, i) => {
            if (v.name === '初审订单') {
              that.searchAudit.approvalName = '初审订单'
              status = false
            }
          })
          res()
        })
      })()
      await (function () {
        return new Promise(function (res, rej) {
          that.optionsApproval.map((v, i) => {
            if (status) {
              if (v.name === '复审订单') {
                that.searchAudit.approvalName = '复审订单'
                v.status = true
                status = false
              }
            }
          })
          res()
        })
      })()
      await (function () {
        return new Promise(function (res, rej) {
          that.optionsApproval.map((v, i) => {
            if (status) {
              if (v.name === '审批通过') {
                that.searchAudit.approvalName = '审批通过'
                v.status = true
                status = false
              }
            }
          })
          res()
        })
      })()
      await (function () {
        return new Promise(function (res, rej) {
          that.optionsApproval.map((v, i) => {
            if (status) {
              if (v.name === '审批驳回') {
                that.searchAudit.approvalName = '审批驳回'
                v.status = true
                status = false
              }
            }
          })
          res()
        })
      })()
    },
    // 内容切换
    async handleMenuSelect(key) {
      if (key === 4) {
        await this.$store.dispatch('user/viewingFlag', 'orderReplenishment')
      } else if (key === 5) {
        await this.$store.dispatch('user/viewingFlag', 'orderNoAssociated')
      }
      const that = this
      this.tabShow = key
      this.menuList.map((v, i) => {
        if (v.id === key) {
          this.menuList[i].status = true
          let approvalName = ''
          this.activeIndex = i
          this.searchAll.activeIndex = i
          if (this.optionsApproval.length) {
            this.optionsApproval.map((v, i) => {
              v.status ? (approvalName = v.name) : ''
            })
          }
          if (that.tabShow === 1) {
            console.log(that.searchAll.status, '全部订单')
            if (that.searchAll.status) {
              const config = that.searchAll
              config['activeIndex'] = i
              config['activeName'] = this.menuList[i].name
              config['approvalName'] = approvalName
              config['pagination'] = true
              this.$refs.orderList.setSearchOption(this.searchAll)
              that.searchAll.status = false
            }
          } else if (this.tabShow === 2) {
            this.myTabValue = 0
            console.log(that.searchMyOrder.status, '我的订单')
            if (that.searchMyOrder.status) {
              const config = that.searchMyOrder
              config['activeIndex'] = i
              config['activeName'] = this.menuList[i].name
              config['approvalName'] = approvalName
              config['pagination'] = true
              this.$refs.orderListMy.setSearchOption(this.searchMyOrder)
              that.searchMyOrder.status = false
            }
          } else if (this.tabShow === 3) {
            if (that.searchAudit.status) {
              const config = that.searchAudit
              config['activeIndex'] = i
              config['activeName'] = this.menuList[i].name
              config['approvalName'] = approvalName
              config['pagination'] = true
              config['optionsApproval'] = that.optionsApproval
              this.$refs.orderSearchAudit.listTypeChange(config)
              that.searchAudit.status = false
            }
          }
        } else {
          this.menuList[i].status = false
        }
      })
    },
    searchFn(e) {
      this.searchAll = e
      this.$refs.orderList.setSearchOption(e)
    },
    searchFnApproval(e) {
      console.log('执行；额2')
      this.searchAll = e
    },
    sizeChange(e) {
      this.$refs.orderSearch.sizeChange(e)
      console.log('this.search', this.searchAll)
    },
    tableDataNum(e) {
      console.log(e)
      this.$refs.orderSearch.tableDataNumChange(e)
    },
    handleChange(file, fileList) {
      console.log(file, fileList)
    },
    // 我的
    searchFnMy(e) {
      this.searchMyOrder = e
      this.$refs.orderListMy.setSearchOption(e)
    },
    // 我的扫码录单
    searchFnMyScan(e) {
      this.searchMyScanOrder = e
      this.$refs.orderListMyScan.setSearchOption(e)
    },
    searchFnApprovalMy(e) {
      console.log('执行；额1')
      this.searchMyOrder = e
    },
    sizeChangeMy(e) {
      this.$refs.orderSearchMy.sizeChange(e)
      console.log('this.searchMy', this.searchMy)
    },
    sizeChangeMyScan(e) {
      this.$refs.orderListMyScan.sizeChange(e)
      console.log('this.searchMy', this.searchMy)
    },
    tableDataNumMy(e) {
      console.log(e)
      this.$refs.orderSearchMy.tableDataNumChange(e)
    },
    tableDataNumMyScan(e) {
      console.log(e)
      this.$refs.orderSearchMyScan.tableDataNumChange(e)
    },
    handleChangeMy(file, fileList) {
      console.log(file, fileList)
    },
    searchForNoAssociated(e) {
      this.searchNoAssociatedObj = e
      this.$refs.orderListNoAssociated.loadData(e)
    },
    // 审批
    searchFnAudit(e) {
      this.searchAudit = e
      this.$refs.orderListAudit.setSearchOption(e)
    },
    // 店铺漏单
    searchForComplete(e) {
      this.searchCompleteObj = e
      this.$refs.orderListComplete.loadData(e)
    },
    searchFnApprovalAudit(e) {
      console.log('执行；额1')
      this.searchAudit = e
    },
    sizeChangeAudit(e) {
      this.$refs.orderSearchAudit.sizeChange(e)
      console.log('this.searchMy', this.searchMy)
    },
    tableDataNumAudit(e) {
      console.log(e)
      this.$refs.orderSearchMy.tableDataNumChange(e)
    },
    sizeChangeNoAssociated(e) {
      this.$refs.orderSearchAudit.sizeChange(e)
    },
    tableDataNumNoAssociated(e) {
      this.$refs.orderSearchMy.tableDataNumChange(e)
    },
    handleChangeAudit(file, fileList) {
      console.log(file, fileList)
    }
  }
}
</script>

<style lang="scss" scoped>
.order-wrap {
  .order-car {
    background: #ffffff;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12),
      0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
    border-radius: 8px !important;
    .el-menu-header {
      border-radius: 8px 8px 0 0 !important;
      font-size: 16px;
      font-weight: bold;
      .el-menu-item {
        border-radius: 8px 8px 0 0 !important;
      }
      .is-active {
        color: #1890ff;
      }
    }
    .menu-box {
      display: flex;
      padding: 24px 20px 0 20px;
      border-bottom: 1px solid #e4e7ed;
      -webkit-user-select: none; /*webkit浏览器*/
      -moz-user-select: none; /*火狐*/
      -ms-user-select: none; /*IE10*/
      user-select: none;
      .menu-info {
        margin-right: 32px;
        padding-bottom: 20px;
        border-radius: 1px;
        cursor: pointer;
        font-size: 16px;
      }
      .menu-active {
        color: #0c6fff;
        border-bottom: 1px solid #0c6fff;
        transition: border-bottom 0.1s;
      }
    }
  }
  .order-list {
    overflow: auto;
    // padding: 0 20px;
  }
}
::v-deep .el-menu--horizontal > .el-menu-item.is-active {
  border: none;
}
::v-deep .el-dropdown-menu__item {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
}
::v-deep .el-dropdown-menu__item:hover,
.el-dropdown-menu__item:focus {
  background-color: #f5f7fa;
  color: #0c6fff;
  font-weight: bold;
}
::v-deep .el-table th > .cell {
  font-weight: bold;
  color: #777777;
  font-size: 15px;
}
::v-deep .el-table td {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
}

.choose-channel-block {
    height: 28px;
    margin: 20px 10px 0px;
    display: inline-block;
    background: #F7F7F7;
    span {
        margin-top: 1px;
        margin-left: 1px;
        width: 80px;
        height: 26px;
        color: #666666;
        text-align: center;
        font-family: "Microsoft YaHei";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 26px;
        cursor: pointer;
        display: inline-block;
    }
    span.active {
        font-weight: 600;
        color: #000;
        background: #fff;
    }
}
</style>
