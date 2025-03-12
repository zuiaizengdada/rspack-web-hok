<template>
  <!-- 顶部筛选栏 -->
  <div class="search-box">
    <div class="search-main">
      <el-form ref="form" class="filter-module" :model="search" label-width="100px" size="small" :inline="true">
        <el-row>
          <el-form-item label="订单搜索">
            <el-input v-model.trim="search.order.value" placeholder="请输入内容" class="input-with-input" clearable>
              <el-select slot="prepend" v-model="search.order.label" placeholder="请选择" class="input-with-select">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="订单时间">
            <div class="order-time-box">
              <el-select v-model="search.time.label" placeholder="请选择" class="input-with-select input-with-select-chang">
                <el-option v-for="item in optionsTime" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-date-picker
                v-model="search.time.value"
                class="input-with-time"
                type="daterange"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :unlink-panels="true"
              />
            </div>
          </el-form-item>
          <el-form-item label="订单类型">
            <el-select v-model="search.orderType" clearable placeholder="请选择" class="input-with-select select-width-200" @change="sureSearch" @clear="sureSearch">
              <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="订单金额">
            <div class="common-width">
              <el-input
                v-model="search.starPrice"
                placeholder="请输入"
                maxlength="6"
                clearable
                class="price-in"
              />
              -
              <el-input
                v-model="search.endPrice"
                placeholder="请输入"
                maxlength="6"
                clearable
                class="price-in"
              />
              <div />
            </div>
          </el-form-item>

          <el-form-item label="是否需要补齐">
            <el-select v-model="search.confirmUser" clearable placeholder="请选择" class="input-with-select select-width-200" @change="sureSearch" @clear="sureSearch">
              <el-option v-for="item in confirmUserType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="search-control">
      <div class="search-control-l">
        <el-button type="primary" size="small" class="control-btn-primary" @click="sureSearch">查询</el-button>
        <el-button size="small" class="control-btn" @click="clear()">重置</el-button>
      </div>
      <!-- <div class="search-control-r">
        <el-button
          v-if="tableDataNum>0"
          v-permission="['system:order:export', permsList]"
          size="small"
          class="control-btn"
          :loading="exportLoading"
          @click="goodsOrderExport"
        >导出</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
import {
  goodsOrderExport,
  findTypeList,
  orderAdopt, getLxUrl
} from '@/api/business'
import { taskSelect } from '@/api/business/addOrder'
import { mapGetters } from 'vuex'
import { userTerminal } from '@/utils/enum'
import moment from 'moment'
export default {
  name: 'SearchTop',
  // eslint-disable-next-line vue/require-prop-types
  props: ['search', 'optionsApproval'],
  data() {
    return {
      searchStatus: true,
      permsList: this.$route.meta.permsList || [],
      exportLoading: false,
      searchs: '',
      approvalName: '',
      currentTime: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        },
        disabledDate: (time) => {
          if (this.currentTime) {
            // 一年以内
            const minTime = moment(this.currentTime).subtract(90, 'days').valueOf()
            const maxTime = moment(this.currentTime).add(90, 'days').valueOf()
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      },
      options: [
        { label: '订单号', value: 'orderNo' },
        { label: '交易单号', value: 'transactionId' },
        { label: '商品名称', value: 'goodsName' },
        { label: '备注', value: 'depositGoodsName' }
      ],
      optionsTime: [
        { label: '下单时间', value: 1 }
        // { label: '入账时间', value: 2 }
      ],
      optionsType: [
        { label: '全部', value: '' }
      ],
      confirmUserType: [
        { label: '全部', value: '' },
        { label: '待补齐', value: 0 },
        { label: '已补齐', value: 1 }
      ],
      optionsAudit: [
        { label: '全部', value: '' },
        { label: '待初审', value: 0 },
        { label: '待复审', value: 1 },
        { label: '审核失败', value: 2 },
        { label: '审核成功', value: 3 }
      ],
      optionsUserTerminal: [
        { label: '全部', value: '' },
        ...userTerminal
      ],
      paymentType: [
        { label: '全部', value: '' },
        { label: '微信', value: 1 },
        { label: '支付宝', value: 2 }
      ],
      orderStatus: [
        { label: '全部', value: '' },
        { label: '未支付', value: 1 },
        { label: '支付成功', value: 2 },
        { label: '超时已关闭', value: 3 },
        { label: '用户已取消', value: 4 },
        { label: '退款中', value: 5 },
        { label: '部分退款', value: 6 },
        { label: '全部退款', value: 7 },
        { label: '交易结束', value: 8 },
        { label: '没有向第三方发起支付请求', value: 9 },
        { label: '退款金额异常', value: 10 },
        { label: '部分付款', value: 11 },
        { label: '转课关闭', value: 12 }
      ],
      payPromotion: [
        { label: '全部', value: '' },
        { label: '推广付费', value: 1 }
      ],
      orderSignConfig: {
        visible: false,
        title: '订单标记'
      },
      tableDataNum: 0,
      receiveModel: {
        visible: false,
        title: '订单认领',
        order: { label: 'orderNo', value: '' } // 订单搜索
      },
      form: {
        taskId: ''
      },
      optionsTask: [],
      searchPrecisen: { // 精准搜索
        content: '',
        isGive: ''
      }
    }
  },
  computed: {
    ...mapGetters(['channelSourceType', 'paymentType_options'])
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
    this.getFindTypeList()
    this.remoteMethodTask()
  },
  mounted() {
    console.log('this.search', this.search)
  },
  methods: {
    getFindTypeList() {
      const param = {}
      findTypeList(param)
        .then((res) => {
          res.data.map(v => {
            if (['新购', '预存'].includes(v.type)) {
              this.optionsType.push({ label: v.type, value: Number(v.id) })
            }
          })
        })
        .catch(() => {
        })
    },
    async remoteMethodTask(query) {
      const { data } = await taskSelect({
        pageIndex: 1,
        pageSize: 100,
        taskName: query || undefined
      })
      this.optionsTask = data.items
    },
    async onClickEntryForm() {
      const res = await this.$store.dispatch('user/viewingFlag', 'newAddOrder')
      if (res) return
      this.$router.push({ path: `/business/orderManage/addOrder` })
    },
    handleChangeTask() {
      this.remoteMethodTask()
    },
    isNumeric(n) {
      var reg = /^[0-9]+\.?[0-9]*$/
      if (reg.test(n)) {
        return true
      }
      return false
    },
    sureSearch(type, num) {
      // if (type === 'audit') {
      //   if (num === 0) {
      //     this.onClickApproval(0, 0)
      //   } else if (num === 1) {
      //     this.onClickApproval(1, 1)
      //   } else if (num === 2) {
      //     this.onClickApproval(2, 3)
      //   } else if (num === 3) {
      //     this.onClickApproval(3, 2)
      //   } else {
      //     if (this.optionsApproval.length) {
      //       this.optionsApproval.map(v => {
      //         v.status = false
      //       })
      //     }
      //   }
      // }
      const starPrice = this.search.starPrice
      const endPrice = this.search.endPrice
      if (starPrice !== '' && starPrice !== undefined && starPrice !== null || endPrice !== '' && endPrice !== undefined && endPrice !== null) {
        if (this.isNumeric(starPrice) && this.isNumeric(endPrice)) {
          if (endPrice - starPrice >= 0) {
            this.search.current = 1
            this.$emit('search', this.search)
          } else {
            this.$message.error('订单金额开始值不能大于结束值')
          }
        } else {
          this.$message.error('订单金额请输入数字')
        }
      } else {
        this.search.current = 1
        this.$emit('search', this.search)
      }
    },
    clear() {
      const res = {
        type: 2,
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
        orderAudit: '', // 订单tab审核状态
        examineStatus: '', // 审核tab状态
        current: 1, // 当前页
        size: 10, // 每页条数
        activeIndex: 0, // 当前类别
        activeName: '', // 当前类别名称
        approvalName: '', // 当前审批名称
        pagination: true, // 开启分页显示
        noDate: '',
        confirmUser: ''
      }
      const now = new Date()
      const y = now.getFullYear()
      const m = now.getMonth() + 1
      const d = now.getDate()
      const result = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
      const startTime = now.setDate(now.getDate() - 30)
      const starty = new Date(startTime).getFullYear()
      const startm = new Date(startTime).getMonth() + 1
      const startd = new Date(startTime).getDate()
      const resultStart = starty + '-' + (startm < 10 ? '0' + startm : startm) + '-' + (startd < 10 ? '0' + startd : startd)
      res.time.value = [resultStart, result]
      // res.activeIndex = this.searchs.activeIndex
      // res.activeName = this.searchs.activeName
      // res.approvalName = this.searchs.approvalName

      // if (this.optionsApproval.length) {
      //   let statusBtn = true
      //   this.optionsApproval.map(v => {
      //     v.status = false
      //     if (statusBtn) {
      //       if (v.name === this.approvalName) {
      //         this.optionsApproval.map(v => {
      //           v.status = false
      //         })
      //         const key = v.name === '初审订单' ? 0 : 1
      //         res.examineStatus = key
      //         this.optionsApproval[key].status = true
      //         res.approvalName = this.optionsApproval[key].name
      //         statusBtn = false
      //       }
      //     }
      //   })
      // }
      this.$emit('search', res)
    },
    listTypeChange(val) {
      console.log('val===》》》', val)
      const res = val
      // const res = {
      //   order: { label: 'orderNo', value: '' }, // 订单搜索
      //   time: { label: 1, value: ['', ''] }, // 订单时间
      //   goodsName: '', // 商品名称
      //   orderStatus: '', // 订单状态
      //   orderType: '', // 订单类型
      //   userTerminal: '', // 渠道来源
      //   channelSource: '', // 渠道来源
      //   thirdShopId: '', // 第三方店铺id
      //   thirdShopName: '', // 第三方店铺名称
      //   paymentType: '', // 支付方式
      //   folowerId: '', // 跟进人员id
      //   folowername: '', // 跟进人员姓名
      //   payPromotion: '', // 筛选推广
      //   current: 1, // 当前页
      //   size: 10, // 每页条数
      //   activeIndex: val.key, // 当前类别
      //   activeName: val.name, // 当前类别名称
      //   approvalName: val.approvalName, // 当前审批名称
      //   pagination: true // 开启分页显示
      // }
      // const now = new Date()
      // const y = now.getFullYear()
      // const m = now.getMonth() + 1
      // const d = now.getDate()
      // const result = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
      // res.time.value = [result, result]
      if (val.name === '我的审批') {
        console.log(val)
        if (val.name === '我的审批') {
          this.approvalName = val.approvalName
          if (val.approvalName === '初审订单') {
            this.optionsApproval.map(v => {
              v.status = false
            })
            res.examineStatus = 0
            this.optionsApproval[0].status = true
            res.approvalName = this.optionsApproval[0].name
          } else {
            console.log('this.optionsApproval', this.optionsApproval)
            if (this.optionsApproval.length === 1) {
              this.optionsApproval.map(v => {
                v.status = false
              })
              res.examineStatus = 1
              this.optionsApproval[0].status = true
              res.approvalName = this.optionsApproval[0].name
            } else {
              this.optionsApproval.map(v => {
                v.status = false
              })
              res.examineStatus = 1
              this.optionsApproval[1].status = true
              res.approvalName = this.optionsApproval[1].name
            }
          }
        }
      }
      console.log('')
      // this.$emit('search', res)
      this.$emit('searchFnApproval', res)
    },
    approvalChange(val) {
      this.approvalName = val
    },
    sizeChange(e) {
      this.search.size = e
    },
    receiveSizeChange(e) {
      this.$refs.orderSearch.sizeChange(e)
      console.log('this.search', this.search)
    },
    receiveTableDataNum(e) {
      console.log(e)
      this.$refs.orderSearch.tableDataNumChange(e)
    },
    onClickApproval(key, id) {
      this.optionsApproval.map(v => {
        v.status = false
      })
      console.log('key', key)
      this.search.examineStatus = id
      this.optionsApproval[key].status = true
      this.search.approvalName = this.optionsApproval[key].name
      this.sureSearch()
    },
    selectThirdShop() {
      this.$Select({
        type: 'shop',
        visible: true,
        multiple: false,
        params: { type: this.search.channelSource },
        success: (res) => {
          const search = JSON.parse(JSON.stringify(this.search))
          search.current = 1
          search.thirdShopName = res.shopName
          search.thirdShopId = res.shopId
          this.$emit('search', search)
        }
      })
    },
    channelSourceChange() {
      const search = JSON.parse(JSON.stringify(this.search))
      search.current = 1
      search.thirdShopName = ''
      search.thirdShopId = ''
      this.$emit('search', search)
    },
    delFolower() {
      const search = JSON.parse(JSON.stringify(this.search))
      search.folowerId = ''
      search.folowername = ''
      search.current = 1
      this.$emit('search', search)
    },
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [1],
        success: (res) => {
          if (res.user.length > 0) {
            const search = JSON.parse(JSON.stringify(this.search))
            search.current = 1
            search.folowerId = res.user[0].userId
            search.folowerNickName = res.user[0].nickName
            search.folowername = res.user[0].userName
            this.$emit('search', search)
          }
        }
      })
    },
    // 点击导出
    goodsOrderExport() {
      this.exportLoading = true
      let type = 1 // 1、全部订单 2、我的订单 3、我的审核
      if (this.search.activeName === '全部订单') {
        type = 1
      } else if (this.search.activeName === '我的订单') {
        type = 2
      } else if (this.search.activeName === '我的审批') {
        type = 3
        if (this.search.approvalName === '初审订单') {
          console.log('初审订单')
          // this.search.orderAudit === 0 || this.search.orderAudit === '' ? this.search.orderAudit = 0 : ''
        } else if (this.search.approvalName === '复审订单') {
          console.log('复审订单')
          // this.search.orderAudit === 1 || this.search.orderAudit === '' ? this.search.orderAudit = 1 : ''
        }
      }
      const params = {
        // ...this.search,
        // order: this.search.order.value,
        current: this.search.current,
        size: this.search.size,
        [this.search.order.label]: this.search.order.value,
        timeType: this.search.time.label,
        createStartTime: this.search.time.value && this.search.time.value[0],
        createEndTime: this.search.time.value && this.search.time.value[1],
        orderStatus: this.search.orderStatus || '',
        paymentType: this.search.paymentType || '',
        userTerminal: this.search.userTerminal || '',
        channelSource: this.search.channelSource,
        thirdShopId: this.search.thirdShopId,
        folowerId: this.search.folowerId,
        payPromotion: this.search.payPromotion,
        examineStatus: this.search.orderAudit,
        maxPayerTotal: this.search.endPrice,
        minPayerTotal: this.search.starPrice,
        orderConfigId: this.search.orderType,
        type,
        confirmUser: this.search.confirmUser
      }
      const starPrice = this.search.starPrice
      const endPrice = this.search.endPrice
      if (starPrice !== '' && starPrice !== undefined && starPrice !== null || endPrice !== '' && endPrice !== undefined && endPrice !== null) {
        if (this.isNumeric(starPrice) && this.isNumeric(endPrice)) {
          if (endPrice - starPrice >= 0) {
            // 请求
            this.goodsOrderExportApi(params)
          } else {
            this.$message.error('订单金额开始值不能大于结束值')
          }
        } else {
          this.$message.error('订单金额请输入数字')
        }
      } else {
        // 请求
        this.goodsOrderExportApi(params)
      }
      console.log(params, '导出请求参数')
    },
    goodsOrderExportApi(params) {
      goodsOrderExport(params)
        .then((res) => {
          this.exportLoading = false
          console.log(res)
          // window.location = res.data
          // window.open(res.data, '_self')
          // var newWin = window.open('loading page', '_self')
          // newWin.location.href = res.data // 成功 重定向到目标页面

          this.downloadExecl(res.data.taskId)
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    downloadExecl(taskId) {
      const param = {
        taskId: taskId
      }
      getLxUrl(param)
        .then(res => {
          console.log('sssssss: ', res)
          if (res.code === 1 && res.data.status === 2) {
            this.exportLoading = false
            this.exportDeliveryLoading = false
            window.open(res.data.path, 'blank')
          } else {
            const that = this
            setTimeout(function() {
              that.downloadExecl(res.data.taskId)
            }, 1500)
          }
        })
        .catch(() => {
          this.exportLoading = false
          this.exportDeliveryLoading = false
        })
    },
    tableDataNumChange(e) {
      console.log('更新数据', e)
      this.tableDataNum = e
    },
    // 认领搜索
    onClickReceiveModelSearch() {
      const label = this.receiveModel.order.label
      const value = this.receiveModel.order.value
      console.log(label)
      console.log(value)
      const params = {
        [label]: value,
        type: 2 // 1 赠送关联订单精准查询 2 认领订单精准查询
      }
      this.$refs.orderList.searchPrecisen(params)
    },
    tableDataPrecisen(e) {
      console.log(e, '搜索结果')
      this.searchPrecisen = e
    },
    // 认领重置
    onClickReceiveModelReset() {
      this.receiveModel.order = { label: 'orderNo', value: '' }
      const params = {
        orderNo: '-',
        type: 2 // 1 赠送关联订单精准查询 2 认领订单精准查询
      }
      this.$refs.orderList.searchPrecisen(params)
      this.searchPrecisen = { // 精准搜索
        content: '',
        isGive: ''
      }
    },
    // 订单认领
    onClickReceiveModel() {
      this.receiveModel.visible = !this.receiveModel.visible
    },
    async onClickReceiveModelOk() {
      if (!this.searchPrecisen.isGive) {
        this.$message.error(this.searchPrecisen.content ? this.searchPrecisen.content : '没有可认领的关联订单')
      } else {
        const formData = new FormData()
        const value = this.receiveModel.order.value
        formData.append('orderNo', value)
        formData.append('taskId', this.form.taskId)
        const adoptData = await orderAdopt(formData)
        if (adoptData.code === 1) {
          this.$message({
            message: '认领成功',
            type: 'success'
          })
          this.onClickReceiveModel()
          this.onClickReceiveModelReset()
        }
      }
    }
  }
}
</script>

  <style lang="scss" scoped>
  .search-box {
    width: 100%;
    // display: flex;
    position: relative;
    .search-main {
        .input-with-select {
            width: 108px;
            height: 32px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #333333;
            border-radius: 3px 0px 0px 3px;

        }
        .input-with-select-chang {
            ::v-deep  .el-input__inner {
                border: none;
                border-radius: 3px 0px 0px 3px;
                border: 1px solid #D8DCE6;
                border-right: none;
            }
        }
        .input-with-input {
            width: 308px;
        }
        .input-with-time {
            width: 228px;
            border: none;
            border-radius: 0px 3px 3px 0px;
            border: 1px solid #D8DCE6;
        }
        .order-time-box {
            display: flex;
        }
        .select-width-200 {
            width: 200px;
        }
        .common-width {
            width: 308px;
            .folower-btn {
                width: 200px;
            }
            .price-in {
                width: 92px;
            }
        }
        .common-w336 {
          width: 336px;
        }
    }
    .search-control {
        display: flex;
        margin: 0 20px;
        padding-bottom: 16px;
        justify-content: space-between;
        border-bottom: 1px solid #E7E7E7;
        margin-bottom: 15px;
        .search-control-l {
            margin-left: 10px;
            .more-box {
                margin-left: 26px;
            }
        }
        .search-control-r {
          margin-right: 10px;
        }
        .control-btn-primary {
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #FFFFFF;
        }
        .control-btn {
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #161616;
        }
    }
    .approval-control {
        background: #F3F3F3;
        border-radius: 4px;
        padding: 2px;
        margin: 15px 30px;
        display: inline-block;
        .approval-list {
            display: flex;
            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
            -khtml-user-select: none; /* Konqueror HTML */
            -moz-user-select: none; /* Old versions of Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
            supported by Chrome, Edge, Opera and Firefox */
            .approval-child {
                width: 88px;
                height: 32px;
                line-height: 32px;
                background: #F3F3F3;
                border-radius: 2px;
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #333333;
                text-align: center;
                cursor: pointer;
            }
            .approval-active {
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #0C6FFF;
                background: #FFFFFF;
            }
        }

    }
  }
  .filter-module {
    padding: 16px 16px 0 16px;
    width: 100%;
  }

  .btn_ground {
    display: flex;
    margin-left: 8px;
    .btn {
      padding: 0 16px;
      color: #333;
      margin-right: 8px;
      margin-bottom: 0;
      float: left;
      height: 32px;
      line-height: 32px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      background: #fff;
      cursor: pointer;
    }
    .active {
      border-color: #2a75ed;
    }
  }
  .btn_more {
    transition: all 0.4s;
  }
  .btn_close {
    transform: rotate(180deg);
  }
  .model-conten {
    .notice-box {
        padding: 16px 20px 0 20px;
        .notice-title {
            font-size: 16px;
            font-family: MicrosoftYaHei;
            color: #777777;
            margin-bottom: 8px;
        }
        .notice-info {
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #333333;
        }
    }
    .notice-top {
        margin-top: 4px;
    }
    .list-box {
        padding: 16px 20px;
        .list-title {
            font-size: 16px;
            font-family: MicrosoftYaHei;
            color: #777777;
        }
        .list-info {
            .info-search {
            margin-top: 8px;
            .model-with-input {
                width: 426px;
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #333333;
                margin-right: 8px;
            }
            .model-with-select {
                width: 130px;
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #333333;
                height: 10px;
            }
            }
            .info-item {
              margin-top: 10px;
              height: 186px;
              overflow-x: auto;
            // overflow: scroll;
            }
            .info-pop {
            font-size: 16px;
            font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
            font-weight: bold;
            color: #F53F3F;
            .icon-svg {
                margin: 16px 8px 0 0;
            }
            }
            .info-pop-pass {
            color: #00B42A;
            }
        }
    }
  }
  .footer-box {
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
  }
  .w-200 {
    width: 200px;
  }
  ::v-deep .el-input-group__prepend {
    background-color: #FFFFFF;
  }
  ::v-deep .el-form-item__label {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    // color: #333333;
  }
  ::v-deep .el-input__inner{
    height: 32px;
  }
  ::v-deep .ss-material-box-header-title {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold !important;
    color: #333333;
  }
  ::v-deep ::-webkit-scrollbar-track {
    background: #ededed;
    border-radius: 0;
  }
  ::v-deep ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 10px;
    height: 10px;
  }
  ::v-deep :hover ::-webkit-scrollbar-track-piece {
    cursor: pointer;
    background: #ededed;
    border-radius: 0;
  }

  ::v-deep :hover::-webkit-scrollbar-thumb:hover {
    cursor: pointer;
    border-radius: 5px;
    background: #acacac;
    transition: color 0.2s ease;
  }

  ::v-deep :hover::-webkit-scrollbar-thumb:vertical {
    cursor: pointer;
    border-radius: 5px;
    background: #acacac;
    transition: color 0.2s ease;
  }
  </style>

