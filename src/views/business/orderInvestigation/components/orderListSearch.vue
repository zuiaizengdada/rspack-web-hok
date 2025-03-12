<template>
  <!-- 顶部筛选栏 -->
  <div class="search-box">
    <div class="search-main">
      <el-form
        ref="form"
        v-model="search"
        class="filter-module"
        label-width="80px"
        size="small"
        :inline="true"
      >
        <el-form-item label="订单号">
          <el-input
            v-model.trim="search.orderNo"
            placeholder="请输入第三方订单号"
            maxlength="50"
            clearable
          />
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select
            v-model="search.orderSource"
            clearable
            placeholder="请选择"
            class="select-width-200"
            @change="sureSearch"
          >
            <el-option
              v-for="item in orderStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
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
        <el-form-item label="达人ID">
          <el-input
            v-model.trim="search.expertId"
            placeholder="请输入达人ID"
            maxlength="50"
            clearable
          />
        </el-form-item>
        <el-form-item label="达人昵称">
          <el-input
            v-model.trim="search.expertName"
            placeholder="请输入达人昵称"
            maxlength="50"
            clearable
          />
        </el-form-item>
        <el-form-item label="运营人员">
          <el-select
            v-model="search.operateUserId"
            filterable
            placeholder="请选择"
            clearable
            @change="sureSearch"
          >
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <template>
          <el-form-item label="渠道平台">
            <div>
              <el-select
                v-model="search.channelSource"
                @change="channelSourceChange()"
              >
                <el-option
                  v-for="item in newChannelSourceArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </el-form-item>
        </template>
        <el-form-item class="download-cls">
          <el-button
            type="primary"
            size="small"
            class="control-btn-primary"
            @click="sureSearch"
            >查询</el-button
          >
          <el-button size="small" class="control-btn" @click="clear()"
            >重置</el-button
          >
          <el-button
            v-loading="downloadFlag"
            type="primary"
            element-loading-spinner="el-icon-loading"
            size="small"
            class="control-btn-primary"
            @click="goodsOrderExport"
            >导出</el-button
          >
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
import { getOrderInvestigationData, getLxUrl } from '@/api/business/financial'
import { getNewChannelSource } from '@/api/option'
import { getItem } from '@/utils/localStorage'
export default {
  name: 'OrderListSearch',
  components: {},
  // eslint-disable-next-line vue/require-prop-types
  props: ['search'],
  data() {
    return {
      orgInfo: {},
      newChannelSourceArray: [],
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
        onPick: ({ maxDate, minDate }) => {
          if (minDate) {
            // 如果默认有最小日期
            this.choiceDate0 = minDate.getTime()
          } else {
            // 如果最小日期被清空，则最小日期为当天
            this.choiceDate0 = new Date()
          }
          if (maxDate) {
            this.choiceDate0 = ''
          }
        },
        disabledDate: time => {
          const choiceDateTime = new Date(this.choiceDate0).getTime() // 选中的第一个日期
          if (this.choiceDate0) {
            // 间隔15天，则加减14天---“这主要看需求”
            // 14天的时间戳：14*24*3600*1000=1209600000
            const timeNum = 30 * 24 * 3600 * 1000
            return (
              time.getTime() > choiceDateTime + timeNum ||
              time.getTime() < choiceDateTime - timeNum
            )
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
        { label: '自然流量', value: 0 },
        { label: '短视频', value: 1 },
        { label: '直播订单', value: 2 }
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
      }
    }
  },
  computed: {
    ...mapGetters(['thirdShopDataType'])
  },
  watch: {},
  created() {
    this.$store.dispatch('option/getChannelsourceType')
  },
  mounted() {
    this.orgInfo = getItem('orgInfo')
    console.log('this.search', this.search)
    this.orderTimeArray = [
      DateFormat(new Date(), 'yyyy-MM-dd'),
      DateFormat(new Date(), 'yyyy-MM-dd')
    ]
    this.loadUserNoPage()
    this.sureSearch()
    this.getNewChannelSource()
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
    sureSearch() {
      if (this.orderTimeArray) {
        this.search.createTime = this.orderTimeArray[0]
        this.search.endTime = this.orderTimeArray[1]
      } else {
        this.search.createTime = ''
        this.search.endTime = ''
      }
      this.search.pageIndex = 1
      this.$emit('search', this.search)
    },
    goodsOrderExport() {
      this.downloadFlag = true
      getOrderInvestigationData(this.search).then(res => {
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
          setTimeout(function () {
            that.downloadExecl(taskId)
          }, 5000)
        }
      })
    },
    clear() {
      this.orderTimeArray = [
        DateFormat(new Date(), 'yyyy-MM-dd'),
        DateFormat(new Date(), 'yyyy-MM-dd')
      ]
      const res = {
        orderNo: '',
        channelSource: 1, // 渠道来源
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页条数
        endTime: '', // 订单结束时间
        shopId: '', // 店铺ID
        createTime: '', // 订单开始时间
        thirdShopName: '', // 第三方店铺名称
        expertId: '', // 达人ID
        expertName: '', // 达人昵称
        operateUserId: '' // 员工
      }
      if (this.orderTimeArray) {
        res.createTime = this.orderTimeArray[0]
        res.endTime = this.orderTimeArray[1]
      } else {
        res.createTime = ''
        res.endTime = ''
      }
      console.log('ssss', this.search)
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
      ::v-deep .el-input__inner {
        border: none;
        border-radius: 3px 0px 0px 3px;
        border: 1px solid #d8dce6;
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

.download-cls {
  ::v-deep .el-loading-spinner {
    padding-top: 15px;
  }
}
</style>
