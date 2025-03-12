<template>
  <!-- 顶部筛选栏 -->
  <div class="search-box">
    <div class="search-main">
      <el-form ref="form" v-model="search" class="filter-module" label-width="80px" size="small" :inline="true">
        <el-form-item label="订单时间">
          <el-date-picker
            v-model="orderTimeArray"
            class="input-with-time"
            type="daterange"
            :clearable="false"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="search.deptId" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in deptList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="运营人员">
          <el-select v-model="search.operateUid" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="达人昵称">
          <el-select v-model="search.expertId" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in tanlentArray"
              :key="item.id"
              :label="item.expertName"
              :value="item.expertId"
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
import { userNoPage } from '@/api/addressBookApi'
import { DateFormat } from '@/utils/index'
import { getTablentExportTask, getLxUrl, getAllTalentData } from '@/api/business/financial'
export default {
  name: 'TanlentStatisticsSearch',
  components: {

  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['search'],
  data() {
    return {
      tanlentArray: [],
      cascaderProps: {
        checkStrictly: true,
        value: 'id'
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
          const choiceDateTime = new Date(this.choiceDate0) // 选中的第一个日期
          if (this.choiceDate0) {
            // 间隔15天，则加减14天---“这主要看需求”
            // 14天的时间戳：14*24*3600*1000=1209600000
            // const timeNum = 30 * 24 * 3600 * 1000
            var monthStart = new Date(choiceDateTime.getFullYear(), choiceDateTime.getMonth(), 1) // 获取本月第一天的日期时间
            var monthEnd = new Date(choiceDateTime.getFullYear(), choiceDateTime.getMonth() + 1, 0, 23, 59, 59) // 获取本月最后一天的日期时间（时间为23:59:59）
            // const timeNum = 30 * 24 * 3600 * 1000
            return (time.getTime() > monthEnd.getTime()) || (time.getTime() < monthStart.getTime())
          }
        }
      },
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
    ...mapGetters(['deptList'])
  },
  watch: {
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
  },
  mounted() {
    const today = new Date()
    today.setDate(today.getDate() - 1)
    this.orderTimeArray = [DateFormat(today, 'yyyy-MM-dd'), DateFormat(today, 'yyyy-MM-dd')]
    this.loadUserNoPage()
    // this.sureSearch()
    this.getAllTalentData()
  },
  methods: {
    getAllTalentData() {
      getAllTalentData().then(res => {
        if (res.code === 1) {
          this.tanlentArray = res.data
          console.log(this.tanlentArray)
        }
      })
    },
    // 点击清空部门
    onhanldeDeptClear() {
      this.search.deptId = ''
      this.sureSearch()
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
    sureSearch() {
      if (this.orderTimeArray) {
        this.search.orderStartTime = this.orderTimeArray[0]
        this.search.orderEndTime = this.orderTimeArray[1]
      } else {
        this.search.orderStartTime = ''
        this.search.orderEndTime = ''
      }
      this.search.pageIndex = 1
      this.$emit('search', this.search)
    },
    goodsOrderExport() {
      this.downloadFlag = true
      getTablentExportTask(this.search).then(res => {
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
      const today = new Date()
      today.setDate(today.getDate() - 1)
      this.orderTimeArray = [DateFormat(today, 'yyyy-MM-dd'), DateFormat(today, 'yyyy-MM-dd')]
      const res = {
        expertId: '', // 达人昵称
        deptId: '',
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页条数
        orderEndTime: '', // 订单结束时间
        orderStartTime: '', // 订单开始时间
        operateUid: '' // 员工
      }
      if (this.orderTimeArray) {
        res.orderStartTime = this.orderTimeArray[0]
        res.orderEndTime = this.orderTimeArray[1]
      } else {
        res.orderStartTime = ''
        res.orderEndTime = ''
      }
      this.$emit('search', res)
    },
    approvalChange(val) {
      this.approvalName = val
    },
    sizeChange(e) {
      this.search.size = e
    },
    receiveSizeChange(e) {
      this.$refs.orderSearch.sizeChange(e)
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
        params: { type: this.search.channelSource },
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
      this.tableDataNum = e
    },
    tableDataPrecisen(e) {
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

