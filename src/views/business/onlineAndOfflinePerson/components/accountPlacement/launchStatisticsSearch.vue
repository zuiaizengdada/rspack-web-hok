<template>
  <!-- 顶部筛选栏 -->
  <div class="search-box">
    <div class="search-main">
      <el-form ref="form" v-model="search" class="filter-module" label-width="80px" size="small" :inline="true">
        <el-form-item label="时间">
          <el-select v-model="search.timeForYear" class="w-150" filterable placeholder="请选择">
            <el-option
              v-for="item in optionsTime"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.timeForMonth" class="w-150" filterable placeholder="请选择" @change="changeMonth">
            <el-option
              v-for="item in optionsTimeMonth"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="投放账号">
          <el-input v-model.trim="search.advertiserId" placeholder="请输入投放账号" maxlength="50" clearable />
        </el-form-item>
        <el-form-item label="投放人员">
          <el-select v-model="search.advertiserPutterUid" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!search.hasDeptFlag" label="投放部门">
          <el-select
            v-model="search.deptId"
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
        <el-form-item label="达标状态">
          <el-select v-model="search.roiReachFlag" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in dabiaoArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="投放平台">
          <el-select v-model="search.advertiseChannel" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in advertiseChannelArray"
              :key="item.code"
              :label="item.message"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="download-cls">
          <el-button type="primary" size="small" class="control-btn-primary" @click="sureSearch">查询</el-button>
          <el-button size="small" class="control-btn" @click="clear()">重置</el-button>
        </el-form-item>
      </el-form>
      <div>
        <span style="padding-left: 20px; margin-right: 50px; font-weight: bold;">{{ search.timeForMonth }}月ROI达标标准</span>
        <span style="margin-right: 50px;"><p style="display: inline-block; ">自投</p><em style="font-style: normal; margin-left: 10px; color: #2a75ed;">{{ zitouRoi }}</em></span>
        <span><p style="display: inline-block;">代投</p><em style="font-style: normal; margin-left: 10px;color: #2a75ed;">{{ daitouRoi }}</em></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { userTerminal } from '@/utils/enum'
import { userNoPage } from '@/api/addressBookApi'
import { DateFormat } from '@/utils/index'
import { getROIDetailNew } from '@/api/business/financial'
export default {
  name: 'OrderListSearch',
  components: {
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['search', 'advertiseChannelArray'],
  data() {
    return {
      zitouRoi: '',
      daitouRoi: '',
      orderChannelArray: [],
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
      timeLabel: '1',
      guishuLabel: 'operateUserId',
      guishuValue: '',
      darenLabel: 'expertId',
      darenValue: '',
      optionsTime: [
        { label: '2022', value: '2022' },
        { label: '2023', value: '2023' },
        { label: '2024', value: '2024' },
        { label: '2025', value: '2025' },
        { label: '2026', value: '2026' },
        { label: '2027', value: '2027' },
        { label: '2028', value: '2028' },
        { label: '2029', value: '2029' },
        { label: '2030', value: '2030' },
        { label: '2031', value: '2031' },
        { label: '2032', value: '2032' }
      ],
      optionsTimeMonth: [
        { label: '1月', value: '01' },
        { label: '2月', value: '02' },
        { label: '3月', value: '03' },
        { label: '4月', value: '04' },
        { label: '5月', value: '05' },
        { label: '6月', value: '06' },
        { label: '7月', value: '07' },
        { label: '8月', value: '08' },
        { label: '9月', value: '09' },
        { label: '10月', value: '10' },
        { label: '11月', value: '11' },
        { label: '12月', value: '12' }
      ],
      dabiaoArray: [
        { label: '全部', value: '' },
        { label: '达标', value: 1 },
        { label: '不达标', value: 0 }
      ],

      optionsUserTerminal: [
        { label: '全部', value: '' },
        ...userTerminal
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
      }
    }
  },
  computed: {
    ...mapGetters(['thirdShopDataType', 'newChannelSourceArray', 'deptList'])
  },
  watch: {
  },
  created() {
    this.$store.dispatch('option/getNewChannelSourceArray')
    this.$store.dispatch('option/getDeptList', { deptId: 0 })
  },
  mounted() {
    this.orderTimeArray = [DateFormat(new Date(), 'yyyy-MM-dd'), DateFormat(new Date(), 'yyyy-MM-dd')]
    this.loadUserNoPage()
    this.sureSearch()
  },
  methods: {

    getROIDetailNewLoad() {
      const params = {
        month: this.search.timeForYear + '-' + this.search.timeForMonth + '-01'
      }
      getROIDetailNew(params).then(res => {
        if (res.code === 1) {
          this.zitouRoi = res.data.selfRateVo ? res.data.selfRateVo.rate : '-'
          this.daitouRoi = res.data.proxyRateVo ? res.data.proxyRateVo.rate : '-'
        }
      })
    },
    changeMonth() {
      if (this.search.timeForYear === '') {
        this.$message.error('请先选择年份！')
        return
      }
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
      console.log('sssserrrrrsssssss:', this.search)
      this.$emit('search', this.search)
      this.getROIDetailNewLoad()
    },
    clear() {
      if (!this.search.hasDeptFlag) {
        this.search = {
          timeForYear: new Date().getFullYear() + '', // 选择日期的年份
          timeForMonth: (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1 + '', // 选择日期的月份
          pageIndex: 1,
          pageSize: 10,
          advertiserId: '', // 投放账号
          advertiserPutterUid: '', // 投放人员
          roiReachFlag: '', // 达标状态
          deptId: '', // 投放部门
          hasDeptFlag: this.search.hasDeptFlag
        }
      } else {
        this.search = {
          timeForYear: new Date().getFullYear() + '', // 选择日期的年份
          timeForMonth: (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1 + '', // 选择日期的月份
          pageIndex: 1,
          pageSize: 10,
          advertiserId: '', // 投放账号
          advertiserPutterUid: '', // 投放人员
          roiReachFlag: '', // 达标状态
          deptId: this.search.deptId, // 投放部门
          hasDeptFlag: this.search.hasDeptFlag
        }
      }
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
      .w-150 {
          width: 86px;
      }
      </style>

