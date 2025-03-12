<template>
  <!-- 顶部筛选栏 -->
  <div class="search-box">
    <div class="search-main">
      <el-form
        ref="form"
        class="filter-module"
        :model="search"
        label-width="80px"
        size="small"
        :inline="true"
      >
        <el-form-item label="订单号">
          <el-input
            v-model.trim="search.orderId"
            placeholder="请输入第三方订单号"
            maxlength="50"
            clearable
          />
        </el-form-item>
        <el-form-item label="补齐类型">
          <el-select
            v-model="search.complementType"
            clearable
            placeholder="请选择补齐类型"
            class="input-with-select select-width-200"
            @change="sureSearch"
            @clear="sureSearch"
          >
            <el-option
              v-for="item in optionsType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单时间">
          <el-date-picker
            v-model="search.orderTimeArray"
            class="input-with-time"
            type="daterange"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="状态">
          <div>
            <el-select
              v-model="search.complementStatus"
              clearable
              multiple
              placeholder="请选择"
              class="select-width-200"
              @change="sureSearch"
              @clear="sureSearch"
            >
              <el-option
                v-for="item in orderStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="search.operateTimeArray"
            class="input-with-time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="操作人">
          <div>
            <el-input
              v-model="search.updateBy"
              placeholder="请输入操作人关键词"
            />
          </div>
        </el-form-item>

        <template>
          <el-form-item label="渠道平台">
            <div>
              <el-select
                v-model="search.channelSource"
                clearable
                placeholder="请选择"
                class="w-200"
                @change="channelSourceChange()"
              >
                <el-option
                  v-for="item in channelSourceType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item
            v-if="search.channelSource && search.channelSource !== 3"
            label="渠道来源"
          >
            <div>
              <el-input
                v-model="search.thirdShopName"
                disabled
                class="w-200 m-r-10"
              />
              <el-button type="primary" @click="selectThirdShop()"
                >选择</el-button
              >
            </div>
          </el-form-item>
          <el-form-item v-if="search.channelSource === 3" label="渠道来源">
            <div>
              <el-select
                v-model="search.userTerminal"
                clearable
                placeholder="请选择"
                class="w-200"
                @change="sureSearch"
                @clear="sureSearch"
              >
                <el-option
                  v-for="item in optionsUserTerminal"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </el-form-item>

          <el-form-item label="虚拟号码">
            <div>
              <el-input
                v-model="search.virtualPhone"
                placeholder="请输入虚拟号码"
              />
            </div>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" size="small" class="control-btn-primary" @click="onClickSearch">查询</el-button>
          <el-button size="small" class="control-btn" @click="clear()">重置</el-button>
          <el-button v-loading="exportLoadding" element-loading-text="" element-loading-spinner="el-icon-loading" type="primary" size="small" class="control-btn-primary" @click="exportData">导出</el-button>
          <el-button type="primary" size="small" class="control-btn-primary" @click="toPiliangbj">批量补齐</el-button>
        </el-form-item>
      </el-form>
    </div>
    <uploadOrder ref="uploadOrder" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { userTerminal } from '@/utils/enum'
import { userNoPage } from '@/api/addressBookApi'
import uploadOrder from '@/views/business/orderManage/components/complete/search/uploadOrder'
import {
  getComplementOrderPageExport
} from '@/api/business'
import moment from 'moment'
export default {
  name: 'SearchTop',
  components: {
    uploadOrder
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['search'],
  data() {
    return {
      exportLoadding: false,
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
        disabledDate: time => {
          if (this.currentTime) {
            // 一年以内
            const minTime = moment(this.currentTime)
              .subtract(90, 'days')
              .valueOf()
            const maxTime = moment(this.currentTime).add(90, 'days').valueOf()
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        }
      },
      options: [{ label: '订单号', value: 'orderId' }],
      optionsTime: [
        { label: '下单时间', value: 1 },
        { label: '操作时间', value: 2 }
      ],
      optionsType: [
        { label: '全部', value: '' },
        { label: '系统', value: 1 },
        { label: '人工', value: 2 }
      ],
      optionsUserTerminal: [{ label: '全部', value: '' }, ...userTerminal],
      orderStatus: [
        { label: '系统补偿中', value: 4 },
        { label: '系统补偿完成', value: 3 },
        { label: '待人工补偿', value: 1 },
        { label: '人工补偿成功', value: 2 }
      ],
      searchOpen: true,
      orderSignConfig: {
        visible: false,
        title: '订单标记'
      },
      tableDataNum: 0,
      searchPrecisen: {
        // 精准搜索
        content: '',
        isGive: ''
      },
      userArray: []
    }
  },
  computed: {
    ...mapGetters(['channelSourceType'])
  },
  watch: {},
  created() {
    this.$store.dispatch('option/getChannelsourceType')
  },
  mounted() {
    console.log('this.search', this.search)
    this.loadUserNoPage()
    this.sureSearch()
  },
  methods: {
    toPiliangbj() {
      this.$refs.uploadOrder.errorMsg = false
      this.$refs.uploadOrder.visible = true
    },
    loadUserNoPage() {
      const params = {
        deptId: '',
        nickName: ''
      }
      userNoPage(params)
        .then(res => {
          this.userArray = res.data
        })
        .catch(() => {})
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
    exportData() {
      this.exportLoadding = true
      if (this.search.orderTimeArray) {
        this.search.orderStartTime = this.search.orderTimeArray[0]
        this.search.orderEndTime = this.search.orderTimeArray[1]
      } else {
        this.search.orderStartTime = ''
        this.search.orderEndTime = ''
      }

      if (this.search.operateTimeArray) {
        this.search.startTime = this.search.operateTimeArray[0]
        this.search.endTime = this.search.operateTimeArray[1]
      } else {
        this.search.startTime = ''
        this.search.endTime = ''
      }
      getComplementOrderPageExport(this.search).then(res => {
        if (res.code === 1) {
          const _that = this
          setTimeout(function() {
            _that.exportLoadding = false
          }, 800)
        }
      })
    },
    onClickSearch() {
      this.search.current = 1
      this.sureSearch()
    },
    sureSearch() {
      if (this.search.orderTimeArray) {
        this.search.orderStartTime = this.search.orderTimeArray[0]
        this.search.orderEndTime = this.search.orderTimeArray[1]
      } else {
        this.search.orderStartTime = ''
        this.search.orderEndTime = ''
      }

      if (this.search.operateTimeArray) {
        this.search.startTime = this.search.operateTimeArray[0]
        this.search.endTime = this.search.operateTimeArray[1]
      } else {
        this.search.startTime = ''
        this.search.endTime = ''
      }
      this.$emit('search', this.search)
    },
    clear() {
      const res = {
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
        updateBy: '' // 操作人
      }
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
      res.orderTimeArray = [resultStart, result]
      if (res.orderTimeArray) {
        res.orderStartTime = res.orderTimeArray[0]
        res.orderEndTime = res.orderTimeArray[1]
      } else {
        res.orderStartTime = ''
        res.orderEndTime = ''
      }
      if (res.operateTimeArray) {
        res.startTime = res.operateTimeArray[0]
        res.endTime = res.operateTimeArray[1]
      } else {
        res.startTime = ''
        res.endTime = ''
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
        params: { type: this.search.channelSource },
        success: res => {
          // const search = JSON.parse(JSON.stringify(this.search))
          this.search.current = 1
          this.search.thirdShopName = res.shopName
          this.search.shopId = res.shopId
          // this.$emit('search', search)
        }
      })
    },
    channelSourceChange() {
      // const search = JSON.parse(JSON.stringify(this.search))
      this.search.current = 1
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
    }
    .input-with-input {
      width: 308px;
    }
    .input-with-time {
      width: 228px;
      border: none;
      border-radius: 0px 3px 3px 0px;
      border: 1px solid #d8dce6;
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
      ::v-deep .el-loading-spinner {
        margin-top: -6px!important;
      }
  }
  .search-control {
    display: flex;
    margin: 0 20px;
    padding-bottom: 16px;
    justify-content: space-between;
    border-bottom: 1px solid #e7e7e7;
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
      color: #ffffff;
    }
    .control-btn {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #161616;
    }
  }
  .approval-control {
    background: #f3f3f3;
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
        background: #f3f3f3;
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
        color: #0c6fff;
        background: #ffffff;
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
        color: #f53f3f;
        .icon-svg {
          margin: 16px 8px 0 0;
        }
      }
      .info-pop-pass {
        color: #00b42a;
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
  background-color: #ffffff;
}
::v-deep .el-form-item__label {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  // color: #333333;
}
::v-deep .el-input__inner {
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
