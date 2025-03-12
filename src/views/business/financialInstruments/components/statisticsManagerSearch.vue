<template>
  <!-- 顶部筛选栏 -->
  <div class="search-box">
    <div class="search-main">
      <el-form ref="form" v-model="search" class="filter-module" label-width="80px" size="small" :inline="true">
        <el-form-item label="渠道">
          <el-select v-model="search.advertiseChannel" filterable placeholder="请选择" clearable @change="sureSearch">
            <el-option
              v-for="item in channelArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="投放账号">
          <el-input v-model.trim="search.advertiserId" placeholder="请输入投放账号" maxlength="50" />
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
        <el-form-item label="投放部门">
          <el-select
            v-model="search.secondDeptId"
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
        <el-form-item class="download-cls">
          <el-button type="primary" size="small" class="control-btn-primary" @click="sureSearch">查询</el-button>
          <el-button size="small" class="control-btn" @click="clear()">重置</el-button>
          <el-button type="primary" size="small" class="long-btn" :class="bindEmployeeFlag === 1?'unclear-cls':''" @click="checkBind">查看未关联</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { userTerminal } from '@/utils/enum'
import { userNoPage } from '@/api/addressBookApi'
export default {
  name: 'OrderListSearch',
  components: {
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['search'],
  data() {
    return {
      bindEmployeeFlag: 1,
      userArray: [],
      channelArray: [
        { label: '全部', value: '' },
        { label: '千川', value: 1 },
        { label: '腾讯', value: 2 },
        { label: '枫页小店', value: 3 },
        { label: '巨量Ad广告', value: 7 }
      ],
      optionsUserTerminal: [
        { label: '全部', value: '' },
        ...userTerminal
      ],
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
    this.loadUserNoPage()
    this.sureSearch()
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
    checkBind() {
      this.bindEmployeeFlag = this.bindEmployeeFlag === 1 ? 0 : 1
      this.search.bindEmployeeFlag = this.bindEmployeeFlag
      this.sureSearch()
    },
    sureSearch() {
      this.$emit('search', this.search)
    },
    clear() {
      this.search = {
        pageIndex: 1,
        pageSize: 10,
        advertiserId: '', // 投放账号
        advertiserPutterUid: '', // 投放人员
        advertiseChannel: '', // 广告渠道
        bindEmployeeFlag: 1, // 是否关联投放人
        secondDeptId: '' // 投放部门
      }
      this.bindEmployeeFlag = this.search.bindEmployeeFlag === 1 ? 1 : 0
      this.sureSearch()
    },
    sizeChange(e) {
      this.search.size = e
    },
    receiveSizeChange(e) {
      this.$refs.orderSearch.sizeChange(e)
      console.log('this.search', this.search)
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
      .w-150 {
          width: 86px;
      }
      .long-btn {
        width: 120px;
      }

      .unclear-cls {
        color: #2a75ed!important;
        background: none!important
      }
      </style>

