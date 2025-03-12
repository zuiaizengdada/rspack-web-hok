<template>
  <!-- 顶部筛选栏 -->
  <div class="search-box">
    <div class="search-main">
      <el-form ref="form" v-model="search" class="filter-module" label-width="80px" size="small" :inline="true">
        <el-form-item label="订单号">
          <el-input v-model.trim="search.orderNo" placeholder="请输入第三方订单号" maxlength="50" clearable />
        </el-form-item>
        <el-form-item label="订单时间">
          <el-select v-model="timeLabel" placeholder="请选择" class="input-with-select">
            <el-option v-for="item in optionsForTime" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-date-picker
            v-model="orderTimeArray"
            class="input-with-time"
            type="daterange"
            :clearable="true"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="渠道平台">
          <el-cascader ref="cascader1" v-model="orderChannelArray" :options="newChannelSourceArray" :props="cascaderProps" clearable @change="forSureSearch" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="search.orderStatus" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in orderStatusArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="直播类型">
          <el-select v-model="search.liveType" clearable placeholder="请选择" @change="sureSearch">
            <el-option v-for="item in liveTypeArray" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="search.orderSource" clearable placeholder="请选择" @change="sureSearch">
            <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="达人信息">
          <el-input v-model.trim="darenValue" placeholder="请输入内容" class="input-with-input" clearable>
            <el-select slot="prepend" v-model="darenLabel" placeholder="请选择" class="input-with-select">
              <el-option v-for="item in optionsForDaren" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="排班ID">
          <el-input v-model.trim="search.liveScheduleId" placeholder="请输入排班ID" maxlength="50" clearable />
        </el-form-item>
        <el-form-item label="直播间ID">
          <el-input v-model.trim="search.liveRoomId" placeholder="请输入排班ID" maxlength="50" clearable />
        </el-form-item>
        <el-form-item label="人员查询">
          <el-select v-model="guishuLabel" placeholder="请选择" class="input-with-select">
            <el-option v-for="item in optionsGuishu" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="guishuValue" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门筛选">
          <el-select v-model="partLabel" placeholder="请选择" class="input-with-select" @change="selectPartMent">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <!-- <el-cascader ref="cascader1" v-model="deptIdArray" :options="deptList" :props="cascaderProps" clearable :show-all-levels="false" @change="sureSearch" /> -->
          <el-select
            v-model="deptIdArray"
            placeholder="请选择"
            clearable
            @change="sureSearch"
          >
            <el-option
              v-for="item in deptList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="付费类型">
          <el-select v-model="search.feeType" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in payStatusArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="orgInfo.organizationId === 1000" label="归公类型">
          <el-select v-model="search.companyOwnFlag" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in guigongArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="orgInfo.organizationId === 1000" label="刷单状态">
          <el-select v-model="search.brushFlag" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in shuadanStatusArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="orgInfo.organizationId === 1000" label="达标状态">
          <el-select v-model="search.roiReachFlag" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in dabiaoArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="投放账号">
          <el-input v-model.trim="search.advertiserId" placeholder="请输入投放账号" maxlength="50" clearable />
        </el-form-item>
        <el-form-item v-if="orgInfo.organizationId === 1000" label="商品类型">
          <el-select v-model="search.productCategory" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in goodsTypeArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="orgInfo.organizationId === 1000" label="往月退款">
          <el-select v-model="search.refundAtDifferentMonth" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in oldTuikuanArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="orgInfo.organizationId === 1000" label="成交来源">
          <el-select v-model="transactionType" placeholder="请选择" class="input-with-select">
            <el-option v-for="item in transactionTypeArray" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="transactionSource" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in transactionSourceArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="download-cls">
          <el-button type="primary" size="small" class="control-btn-primary" @click="sureSearch">查询</el-button>
          <el-button size="small" class="control-btn" @click="clear()">重置</el-button>
          <el-button v-loading="downloadFlag" type="primary" element-loading-spinner="el-icon-loading" size="small" class="control-btn-primary" @click="goodsOrderExport">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { userTerminal } from '@/utils/enum'
import { userNoPage } from '@/api/addressBookApi'
import { DateFormat } from '@/utils/index'
import { getDownloadData, getLxUrl } from '@/api/business/financial'
import { getItem } from '@/utils/localStorage'
import { getNewChannelSource } from '@/api/option'
export default {
  name: 'OrderListSearch',
  components: {
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['search'],
  data() {
    return {
      orderChannelArray: [],
      deptIdArray: '',
      cascaderProps: {
        checkStrictly: true,
        value: 'value'
      },
      channelSourceTypeArray: [],
      orderTimeArray: [],
      userArray: [],
      searchStatus: true,
      permsList: this.$route.meta.permsList || [],
      exportLoading: false,
      searchs: '',
      approvalName: '',
      choiceDate0: '',
      downloadFlag: false,
      pickerOptions: {
        // 设置不能选择的日期
        onPick: ({
          maxDate,
          minDate
        }) => {
          if (minDate) { // 如果默认有最小日期
            this.choiceDate0 = minDate.getTime()
          } else { // 如果最小日期被清空，则最小日期为当天
            this.choiceDate0 = new Date()
          }
          if (maxDate) {
            this.choiceDate0 = ''
          }
        },
        disabledDate: (time) => {
          const choiceDateTime = new Date(this.choiceDate0).getTime() // 选中的第一个日期
          if (this.choiceDate0) {
            // 间隔15天，则加减14天---“这主要看需求”
            // 14天的时间戳：14*24*3600*1000=1209600000
            const timeNum = 30 * 24 * 3600 * 1000
            return (time.getTime() > (choiceDateTime + timeNum)) || (time.getTime() < (choiceDateTime - timeNum))
          }
        }
      },
      partLabel: 'yunyingPart',
      timeLabel: '2',
      guishuLabel: 'operateUserId',
      guishuValue: '',
      darenLabel: 'expertId',
      darenValue: '',
      options: [],
      optionsForDaren: [
        { label: '达人ID', value: 'expertId' },
        { label: '达人昵称', value: 'expertName' }
      ],
      optionsForTime: [
        { label: '创建时间', value: '1' },
        { label: '支付时间', value: '2' },
        { label: '退款时间', value: '3' }
      ],
      optionsGuishu: [],
      optionsTime: [
        { label: '下单时间', value: 1 },
        { label: '操作时间', value: 2 }
      ],
      orderStatusArray: [
        { label: '未支付', value: 0 },
        { label: '已支付', value: 1 },
        { label: '已退款', value: 2 },
        { label: '部分退款', value: 3 }
      ],
      payStatusArray: [],
      guigongArray: [
        { label: '全部', value: '' },
        { label: '单量归公', value: 1 },
        { label: '营收归公', value: 2 },
        { label: '整单归公', value: 3 }
      ],
      shuadanStatusArray: [
        { label: '全部', value: '' },
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      dabiaoArray: [
        { label: '全部', value: '' },
        { label: '达标', value: 1 },
        { label: '不达标', value: 0 }
      ],
      tuikuanzhuangtaiArray: [
        { label: '全部', value: 0 },
        { label: '已退款', value: 1 },
        { label: '部分退款', value: 2 }
      ],
      goodsTypeArray: [
        { label: '全部', value: '' },
        { label: '视频课', value: 0 },
        { label: '直播课', value: 1 },
        { label: '线下课', value: 2 }
      ],
      oldTuikuanArray: [
        { label: '全部', value: '' },
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      optionsType: [
        { label: '全部', value: '' },
        { label: '系统', value: 1 },
        { label: '人工', value: 2 }
      ],
      optionsUserTerminal: [
        { label: '全部', value: '' },
        ...userTerminal
      ],
      orderStatus: [],
      liveTypeArray: [
        { label: '全部', value: '' },
        { label: '运营直播', value: 1 },
        { label: '老师直播', value: 2 },
        { label: '主播直播', value: 3 }
      ],
      transactionType: 'ne',
      transactionSource: '',
      transactionTypeArray: [
        { label: '等于', value: 'eq' },
        { label: '不等于', value: 'ne' }
      ],
      transactionSourceArray: [
        { label: '无', value: 0 },
        { label: '博商', value: 8 },
        { label: '获客线下', value: 9 }
      ],
      searchOpen: true,
      orderSignConfig: {
        visible: false,
        title: '订单标记'
      },
      tableDataNum: 0,
      searchPrecisen: { // 精准搜索
        content: '',
        isGive: ''
      },
      orgInfo: '',
      newChannelSourceArray: []
    }
  },
  computed: {
    ...mapGetters(['thirdShopDataType', 'deptList'])
  },
  watch: {
  },
  created() {
    this.$store.dispatch('option/getDeptList', { deptId: 0 })
  },
  mounted() {
    this.orderTimeArray = [DateFormat(new Date(), 'yyyy-MM-dd'), DateFormat(new Date(), 'yyyy-MM-dd')]
    this.loadUserNoPage()
    this.sureSearch()
    this.getNewChannelSource()
    this.orgInfo = getItem('orgInfo')
    if (this.orgInfo.organizationId === 1000) {
      this.options = [
        { label: '运营部门', value: 'yunyingPart' },
        { label: '直播部门', value: 'zhiboPart' },
        { label: '归属部门', value: 'guishuPart' },
        { label: '投放部门', value: 'toufangPart' }]
      this.optionsGuishu = [
        { label: '运营人员', value: 'operateUserId' },
        { label: '直播人员', value: 'anchorUserId' },
        { label: '归属人员', value: 'revenueOwnerName' },
        { label: '投放人员', value: 'toufangName' }]
      this.orderStatus = [
        { label: '自然成交', value: 0 },
        { label: '内容带货', value: 1 },
        { label: '直播带货', value: 2 },
        { label: '线下订单', value: 3 },
        { label: '认领订单', value: 4 }]
      this.payStatusArray = [{ label: '全部', value: '' },
        { label: '免费', value: 0 },
        { label: '付费', value: 1 },
        { label: '直接付费', value: 3 },
        { label: '间接付费', value: 4 }]
    } else {
      this.options = [
        { label: '运营部门', value: 'yunyingPart' },
        { label: '直播部门', value: 'zhiboPart' },
        { label: '投放部门', value: 'toufangPart' }
      ]
      this.optionsGuishu = [
        { label: '运营人员', value: 'operateUserId' },
        { label: '直播人员', value: 'anchorUserId' },
        { label: '投放人员', value: 'toufangName' }
      ]
      this.orderStatus = [
        { label: '自然成交', value: 0 },
        { label: '内容带货', value: 1 },
        { label: '直播带货', value: 2 }
      ]
      this.payStatusArray = [{ label: '全部', value: '' },
        { label: '免费', value: 0 },
        { label: '付费', value: 1 }
      ]
    }
  },
  methods: {
    getNewChannelSource() {
      const param = {
        isUse: true,
        tenantId: this.orgInfo.organizationId
      }
      getNewChannelSource(param).then(res => {
        if (res.code === 1) {
          this.newChannelSourceArray = res.data
          this.newChannelSourceArray.some(item => {
            item.value = item.channelSource
            item.label = item.channelSourceName
            item.children = item.shopList
            item.children.some(obj => {
              obj.value = obj.shopId
              obj.label = obj.shopName
            })
          })
        }
      })
    },
    forSureSearch() {
      /* this.orderChannelArray = []
      this.orderChannel = ''
      this.search.userTerminal = ''
      this.search.shopId = ''
      this.search.thirdShopName = ''*/
      if (this.orderChannelArray.length === 0) {
        this.orderChannel = ''
        this.search.userTerminal = ''
        this.search.shopId = ''
        this.search.thirdShopName = ''
      }
      this.sureSearch()
    },
    selectPartMent() {
      this.deptIdArray = ''
    },
    loadUserNoPage() {
      const params = {
        deptId: '',
        nickName: ''
      }
      userNoPage(params)
        .then((res) => {
          this.userArray = res.data
        })
        .catch(() => {
        })
    },
    onClickEntryForm() {
      this.$router.push({ path: `/business/orderManage/addOrder` })
    },
    isNumeric(n) {
      var reg = /^[0-9]+\.?[0-9]*$/
      if (reg.test(n)) {
        return true
      }
      return false
    },
    returnShopName(orderChannel, shopId) {
      var returnString = ''
      this.newChannelSourceArray.some(item => {
        if (item.value === orderChannel) {
          item.children.some(obj => {
            if (obj.value === shopId) {
              returnString = obj.label
            }
          })
        }
      })
      return returnString
    },
    sureSearch() {
      this.search.shopId = ''
      this.search.userTerminal = ''
      this.search.orderChannel = ''
      if (this.orderChannelArray?.length === 1) {
        this.search.orderChannel = this.orderChannelArray[0]
      } else if (this.orderChannelArray?.length === 2) {
        this.search.orderChannel = this.orderChannelArray[0]
        if (this.search.orderChannel === 3 || this.search.orderChannel === 13) {
          this.search.userTerminal = this.orderChannelArray[1]
        } else {
          this.search.shopId = this.orderChannelArray[1]
          this.search.thirdShopName = this.returnShopName(this.search.orderChannel, this.search.shopId)
        }
      }
      if (this.orderTimeArray) {
        this.search.orderStartTime = this.orderTimeArray[0]
        this.search.orderEndTime = this.orderTimeArray[1]
      } else {
        this.search.orderStartTime = ''
        this.search.orderEndTime = ''
      }
      this.search.orderTimeType = this.timeLabel
      this.search.pageIndex = 1
      if (this.partLabel === 'yunyingPart') {
        this.search.employeeDeptType = 1
        this.search.employeeDeptId = this.deptIdArray
      } else if (this.partLabel === 'zhiboPart') {
        this.search.employeeDeptType = 2
        this.search.employeeDeptId = this.deptIdArray
      } else if (this.partLabel === 'guishuPart') {
        this.search.employeeDeptType = 3
        this.search.employeeDeptId = this.deptIdArray
      } else if (this.partLabel === 'toufangPart') {
        this.search.employeeDeptType = 4
        this.search.employeeDeptId = this.deptIdArray
      }

      if (this.guishuLabel === 'operateUserId') {
        this.search.employeeUserId = this.guishuValue
        this.search.employeeInfoType = 1
      } else if (this.guishuLabel === 'anchorUserId') {
        this.search.employeeUserId = this.guishuValue
        this.search.employeeInfoType = 2
      } else if (this.guishuLabel === 'revenueOwnerName') {
        this.search.employeeUserId = this.guishuValue
        this.search.employeeInfoType = 3
      } else if (this.guishuLabel === 'toufangName') {
        this.search.employeeUserId = this.guishuValue
        this.search.employeeInfoType = 4
      }

      if (this.darenLabel === 'expertId') {
        this.search.expertInfoValue = this.darenValue
        this.search.exportInfoType = 1
      } else if (this.darenLabel === 'expertName') {
        this.search.expertInfoValue = this.darenValue
        this.search.exportInfoType = 2
      }
      this.search.transactionType = this.transactionType
      this.search.transactionSource = this.transactionSource
      this.$emit('search', this.search)
    },
    goodsOrderExport() {
      this.downloadFlag = true
      if (this.orderTimeArray) {
        this.search.orderStartTime = this.orderTimeArray[0]
        this.search.orderEndTime = this.orderTimeArray[1]
      } else {
        this.search.orderStartTime = ''
        this.search.orderEndTime = ''
      }
      if (this.partLabel === 'yunyingPart') {
        this.search.operateDeptId = this.deptIdArray
        this.search.anchorDeptId = ''
      } else if (this.partLabel === 'zhiboPart') {
        this.search.operateDeptId = ''
        this.search.anchorDeptId = this.deptIdArray
      }
      if (this.guishuLabel === 'operateUserId') {
        this.search.operateUserId = this.guishuValue
        this.search.anchorUserId = ''
      } else if (this.guishuLabel === 'anchorUserId') {
        this.search.anchorUserId = this.guishuValue
        this.search.operateUserId = ''
      }
      if (this.darenLabel === 'expertId') {
        this.search.expertId = this.darenValue
        this.search.expertName = ''
      } else if (this.darenLabel === 'expertName') {
        this.search.expertName = this.darenValue
        this.search.expertId = ''
      }
      getDownloadData(this.search).then(res => {
        if (res.code === 1) {
          this.downloadExecl(res.data)
        }
      })
    },
    downloadExecl(taskId) {
      const param = {
        taskId: taskId
      }
      getLxUrl(param).then(res => {
        console.log('sssssss: ', res)
        if (res.code === 1 && res.data?.status === 2) {
          this.downloadFlag = false
          window.open(res.data.fileUrl, 'blank')
        } else {
          const that = this
          setTimeout(function() {
            that.downloadExecl(taskId)
          }, 5000)
        }
      })
    },
    clear() {
      this.orderTimeArray = [DateFormat(new Date(), 'yyyy-MM-dd'), DateFormat(new Date(), 'yyyy-MM-dd')]
      this.orderChannelArray = []
      this.search = {
        anchorDeptId: '',
        operateDeptId: '',
        orderStatus: '',
        orderNo: '',
        orderChannel: '', // 渠道来源
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页条数
        orderEndTime: '', // 订单结束时间
        shopId: '', // 店铺ID
        orderStartTime: '', // 订单开始时间
        thirdShopName: '', // 第三方店铺名称
        expertId: '', // 达人ID
        expertName: '', // 达人昵称
        operateUserId: '', // 员工
        liveScheduleId: '',
        liveRoomId: '',
        orderTimeType: '1',
        transactionType: '', // 成交来源类型
        transactionSource: '' // 成交来源
      }
      if (this.orderTimeArray) {
        this.search.orderStartTime = this.orderTimeArray[0]
        this.search.orderEndTime = this.orderTimeArray[1]
      } else {
        this.search.orderStartTime = ''
        this.search.orderEndTime = ''
      }
      this.darenValue = ''
      this.guishuValue = ''
      this.deptIdArray = ''
      this.darenLabel = 'expertId'
      this.guishuLabel = 'operateUserId'
      this.partLabel = 'yunyingPart'
      this.transactionType = 'ne'
      this.transactionSource = ''
      this.sureSearch()
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
    selectThirdShop() {
      this.$Select({
        type: 'shop',
        visible: true,
        multiple: false,
        params: { type: this.search.orderChannel },
        success: (res) => {
          // const search = JSON.parse(JSON.stringify(this.search))
          this.search.pageIndex = 1
          this.search.thirdShopName = res.shopName
          this.search.shopId = res.shopId
          // this.$emit('search', search)
        }
      })
    },
    channelSourceChange() {
      // const search = JSON.parse(JSON.stringify(this.search))
      this.search.pageIndex = 1
      this.search.thirdShopName = ''
      this.search.shopId = ''
      // this.$emit('search', search)
    },
    tableDataNumChange(e) {
      console.log('更新数据', e)
      this.tableDataNum = e
    },
    tableDataPrecisen(e) {
      console.log(e, '搜索结果')
      this.searchPrecisen = e
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
            width: 250px;
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

  .download-cls  {
    ::v-deep .el-loading-spinner {
        padding-top: 15px;
    }

  }

  </style>

