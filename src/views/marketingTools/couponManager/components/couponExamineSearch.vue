<template>
  <!-- 顶部筛选栏 -->
  <div class="search-box">
    <div class="search-main">
      <el-form ref="form" v-model="search" class="filter-module" label-width="80px" size="small" :inline="true">
        <el-form-item label="优惠券信息">
          <el-input v-model.trim="search.orderValue" placeholder="请输入内容" class="input-with-input" clearable>
            <el-select slot="prepend" v-model="search.orderLabel" placeholder="请选择" class="input-with-select">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="优惠券类型">
          <el-select v-model="search.couponType" clearable placeholder="请选择" @change="sureSearch">
            <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建人">
          <el-select v-model="search.createdBy" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <!--<el-form-item label="审核人">
          <el-select v-model="search.auditBy" filterable placeholder="请选择" clearable>
            <el-option
              v-for="item in userArray"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item class="download-cls">
          <el-button type="primary" size="small" class="control-btn-primary" @click="sureSearch">查询</el-button>
          <el-button size="small" class="control-btn" @click="clear()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { userNoPage } from '@/api/addressBookApi'
export default {
  name: 'CouponManagerSearch',
  components: {
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['search'],
  data() {
    return {
      preferentialTypeArray: [
        { label: '全部', value: 0 },
        { label: '指定商品满减券', value: 1 },
        { label: '指定商品直减券', value: 2 },
        { label: '指定商品折扣券', value: 3 }
      ],
      userArray: [],
      options: [
        { label: '优惠券名称', value: 'couponName' },
        { label: '优惠券ID', value: 'couponId' }
      ],
      searchStatus: true,
      permsList: this.$route.meta.permsList || [],
      exportLoading: false,
      searchs: '',
      approvalName: '',
      choiceDate0: '',
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
      orderStatus: [
        { label: '全部', value: '' },
        { label: '商品券', value: 1 },
        { label: '直播专享券', value: 3 }
      ],
      searchOpen: true,
      tableDataNum: 0,
      searchPrecisen: { // 精准搜索
        content: '',
        isGive: ''
      }
    }
  },
  computed: {
    ...mapGetters([])
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.loadUserNoPage()
    // this.sureSearch()
  },
  methods: {
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
    isNumeric(n) {
      var reg = /^[0-9]+\.?[0-9]*$/
      if (reg.test(n)) {
        return true
      }
      return false
    },
    sureSearch() {
      this.search.pageIndex = 1
      this.$emit('search', this.search)
    },
    clear() {
      const res = {
        pageIndex: 1, // 当前页
        pageSize: 10, // 每页条数
        auditBy: '',
        auditStatus: [],
        couponName: '',
        couponNo: '',
        couponType: '',
        createdBy: '',
        orderLabel: 'couponName',
        orderValue: ''
      }
      this.search = res
      this.sureSearch(this.search)
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
                width: 120px;
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

