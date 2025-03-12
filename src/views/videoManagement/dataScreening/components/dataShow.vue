<template>
  <div class="data_show">
    <div class="flex flex-middle top-data">
      <div class="data_show_row flex flex-1 flex-column" style="margin-right: 20px;">
        <div class="dataTips"><i class="el-icon-warning dataTips_icon" />各平台增量数据官方更新时间不一致，数据统计存在T+1的延迟（即更新至昨天）</div>
        <div class="flex flex-middle">
          <div class="dsr_block flex-1">
            <span class="dsr_span_title">新增作品</span>
            <p class="dsr_nums">{{ formatterForNumber(dataObj.addContent) }}</p>
            <span class="dsr_span_bottom" :class="dataObj.addContentLinkRatio < 0?'ds_xy_btn':''">
              <em>环比</em>
              <strong>{{ formatterForBFB(dataObj.addContentLinkRatio) }}%</strong>
              <i />
            </span>
          </div>
          <div class="dsr_block flex-1">
            <span class="dsr_span_title">新增粉丝</span>
            <p class="dsr_nums">{{ formatterForW(dataObj.addFans) }}</p>
            <span class="dsr_span_bottom" :class="dataObj.addFansLinkRatio < 0?'ds_xy_btn':''">
              <em>环比</em>
              <strong>{{ formatterForBFB(dataObj.addFansLinkRatio) }}%</strong>
              <i />
            </span>
          </div>
          <div class="dsr_block flex-1">
            <span class="dsr_span_title">新增播放</span>
            <p class="dsr_nums">{{ formatterForW(dataObj.addVideoView) }}</p>
            <span class="dsr_span_bottom" :class="dataObj.addVideoViewLinkRatio < 0?'ds_xy_btn':''">
              <em>环比</em>
              <strong>{{ formatterForBFB(dataObj.addVideoViewLinkRatio) }}%</strong>
              <i />
            </span>
          </div>
        </div>
        <div class="flex flex-middle m-t-18">
          <div class="dsr_block flex-1">
            <span class="dsr_span_title">新增点赞</span>
            <p class="dsr_nums">{{ formatterForW(dataObj.addGreats) }}</p>
            <span class="dsr_span_bottom" :class="dataObj.addGreatsLinkRatio < 0?'ds_xy_btn':''">
              <em>环比</em>
              <strong>{{ formatterForBFB(dataObj.addGreatsLinkRatio) }}%</strong>
              <i />
            </span>
          </div>
          <div class="dsr_block flex-1">
            <span class="dsr_span_title">新增评论</span>
            <p class="dsr_nums">{{ formatterForNumber(dataObj.addComment) }}</p>
            <span class="dsr_span_bottom" :class="dataObj.addCommentLinkRatio < 0?'ds_xy_btn':''">
              <em>环比</em>
              <strong>{{ formatterForBFB(dataObj.addCommentLinkRatio) }}%</strong>
              <i />
            </span>
          </div>
          <div class="dsr_block flex-1">
            <span class="dsr_span_title">新增分享</span>
            <p class="dsr_nums">{{ formatterForNumber(dataObj.addShared) }}</p>
            <span class="dsr_span_bottom" :class="dataObj.addSharedRatio < 0?'ds_xy_btn':''">
              <em>环比</em>
              <strong>{{ formatterForBFB(dataObj.addSharedRatio) }}%</strong>
              <i />
            </span>
          </div>
        </div>
      </div>
      <div class="data_show_row flex flex-1 flex-wrap">
        <div class="flex flex-column flex-middle  flex-1" style="border-right: 1px solid #E2E2E2;">
          <div class="dsr_block" :class="active === 7?'activeClass':''">
            <span class="dsr_span_title">新增订单</span>
            <p class="dsr_nums">{{ formatterForNumber(shareDataObj.addOrder) }}</p>
            <span class="dsr_span_bottom" :class="shareDataObj.addOrderLinkRatio < 0?'ds_xy_btn':''">
              <em>环比</em>
              <strong>{{ formatterForBFB(shareDataObj.addOrderLinkRatio) }}%</strong>
              <i />
            </span>
          </div>
          <div class="flex m-t-18">
            <div class="dsr_block" :class="active === 8?'activeClass':''">
              <span class="dsr_span_title">新增免费订单</span>
              <p class="dsr_nums">{{ formatterForNumber(shareDataObj.addFreeOrder) }}</p>
              <span class="dsr_span_bottom" :class="shareDataObj.addFreeOrderLinkRatio < 0?'ds_xy_btn':''">
                <em>环比</em>
                <strong>{{ formatterForBFB(shareDataObj.addFreeOrderLinkRatio) }}%</strong>
                <i />
              </span>
            </div>
            <div class="dsr_block" :class="active === 9?'activeClass':''">
              <span class="dsr_span_title">新增付费订单</span>
              <p class="dsr_nums">{{ formatterForNumber(shareDataObj.addPayOrder) }}</p>
              <span class="dsr_span_bottom" :class="shareDataObj.addPayOrderLinkRatio < 0?'ds_xy_btn':''">
                <em>环比</em>
                <strong>{{ formatterForBFB(shareDataObj.addPayOrderLinkRatio) }}%</strong>
                <i />
              </span>
            </div>
          </div>
        </div>
        <div class="flex flex-column flex-middle  flex-1">
          <div class="dsr_block" :class="active === 10?'activeClass':''">
            <span class="dsr_span_title">新增GMV</span>
            <p class="dsr_nums">{{ formatterForQW(shareDataObj.addGmv) }}</p>
            <span class="dsr_span_bottom" :class="shareDataObj.addGmvLinkRatio < 0?'ds_xy_btn':''">
              <em>环比</em>
              <strong>{{ formatterForBFB(shareDataObj.addGmvLinkRatio) }}%</strong>
              <i />
            </span>
          </div>
          <div class="flex m-t-18">
            <div class="dsr_block" :class="active === 11?'activeClass':''">
              <span class="dsr_span_title">新增免费GMV</span>
              <p class="dsr_nums">{{ formatterForQW(shareDataObj.addFreeGmv) }}</p>
              <span class="dsr_span_bottom" :class="shareDataObj.addFreeGmvLinkRatio < 0?'ds_xy_btn':''">
                <em>环比</em>
                <strong>{{ formatterForBFB(shareDataObj.addFreeGmvLinkRatio) }}%</strong>
                <i />
              </span>
            </div>
            <div class="dsr_block" :class="active === 12?'activeClass':''">
              <span class="dsr_span_title">新增付费GMV</span>
              <p class="dsr_nums">{{ formatterForQW(shareDataObj.addPayGmv) }}</p>
              <span class="dsr_span_bottom" :class="shareDataObj.addPayGmvLinkRatio < 0?'ds_xy_btn':''">
                <em>环比</em>
                <strong>{{ formatterForBFB(shareDataObj.addPayGmvLinkRatio) }}%</strong>
                <i />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="data-line-table">
      <span v-if="!search.platformId && !search.teacherId" class="title_span">
        <em />
        <p>数据明细<span class="title_span_tips">（可查看部门、运营者、平台的账号数据明细）</span></p>
      </span>
      <dataDetailsTable v-if="!search.platformId && !search.teacherId" ref="dataDetailsTable" :search="search" :table-data="dataDetailsData" @checkDept="checkDept" />
      <accountDataTable ref="accountData" :data="accountDetailsData" :search="search" @loadData="getAccountDetails" @exportData="exportData" />
    </div>
    <div class="data-line-echart flex flex-column">
      <div class="data_contrast">
        <span class="title_span">
          <em />
          <p>趋势对比</p>
        </span>
        <!-- <div class="qoq">
          <el-checkbox v-model="checked" @change="handleChange">环比</el-checkbox>
          <el-tooltip class="item" :content="'单指标查看环比'" placement="bottom">
            <img src="@/assets/image/product/icon.png" style="">
          </el-tooltip>
        </div> -->
      </div>
      <div class="opt-list flex flex-middle">
        <span v-for="(item,index) in tabList" :key="index" :class="{'opt-item':true,'opt-item-active':tabIndex === item.value}" @click="checkList(item.value)">
          {{ item.name }}
        </span>
      </div>
      <div id="lineImg" class="data-line-show m-t-20" />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getDataOverview, getOrderData, qryDataScreeningDetailList, qryDataScreeningAccountDetailList, lineChartDetail, lineChartDetailSingle, exportDataScreeningAccountDetail } from '@/api/videoManagement/dataApi'
import { debounce } from '@/utils'
import dataDetailsTable from './dataDetailsTable'
import accountDataTable from './accountDataTable'
import { tabList } from './constans'
import { downloadFile } from '@/utils'
export default {
  name: 'DataShow',
  components: {
    dataDetailsTable,
    accountDataTable
  },
  data() {
    return {
      checked: false,
      tabList,
      tabIndex: '1',
      dataObj: {
        addComment: 0,
        addCommentLinkRatio: 0,
        addContent: 0,
        addContentLinkRatio: 0,
        addFans: 0,
        addFansLinkRatio: 0,
        addGreats: 0,
        addGreatsLinkRatio: 0,
        addShared: 0,
        addSharedRatio: 0,
        addVideoView: 0,
        addVideoViewLinkRatio: 0
      },
      dataDetailsData: [],
      accountDetailsData: {},
      shareDataObj: {
        addFreeGmv: 0,
        addFreeGmvLinkRatio: 0,
        addFreeOrder: 0,
        addFreeOrderLinkRatio: 0,
        addGmv: 0,
        addGmvLinkRatio: 0,
        addOrder: 0,
        addOrderLinkRatio: 0,
        addPayGmv: 0,
        addPayGmvLinkRatio: 0,
        addPayOrder: 0,
        addPayOrderLinkRatio: 0
      },
      active: 1,
      search: {},
      searchActive: '',
      chart: {},
      chartBing: {},
      titleArray: ['', '新增作品', '新增粉丝', '新增播放', '新增点赞', '新增评论', '新增分享', '新增订单', '新增免费订单', '新增付费订单', '新增GMV', '新增免费GMV', '新增付费GMV']
    }
  },
  mounted() {
    this.chart = echarts.init(document.getElementById('lineImg'))
    this.$_resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
        this.chartBing.resize()
      }
    }, 100)
    this.$_initResizeEvent()
  },
  activated() {
    this.$_initResizeEvent()
  },
  created() {
  },
  methods: {
    checkList(value) {
      this.tabIndex = value
      if (value < 7) {
        this.showThisData(value)
      } else {
        this.showThisData(value)
      }
    },
    getList(data) {
      this.$refs.accountData.config.pageIndex = 1
      this.loadData(data)
    },
    showThisData(num) {
      const params = this.search
      delete params.active
      params.paramType = num
      if (num < 7) {
        lineChartDetailSingle(params).then(res => {
          if (res.success) {
            this.drawLine(res.data)
          }
        })
      } else {
        const obj = Object.assign({}, params)
        obj.paramType = params.paramType - 6
        lineChartDetail(obj).then(res => {
          if (res.success) {
            this.drawLine(res.data, true, num)
          }
        })
      }
    },
    drawLine(data, flag, num) {
      console.log(this.search, '当前点击的第几个')
      const xDataArr = []
      const yDataArr = []
      const seriesOne = []
      const seriesTwo = []
      const seriesThree = []
      const seriesList = []
      const chartConfig = {
        data: [],
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 1,
          color: '#0C6FFF'
        }
      }
      data.forEach(ele => {
        if (flag) {
          seriesOne.push(ele.seriesOne)
          seriesTwo.push(ele.seriesTwo)
          seriesThree.push(ele.seriesThree)
        } else {
          yDataArr.push(ele.yquantity)
        }
        const xNmae = flag ? ele.dateTime : ele.xname
        xDataArr.push(xNmae)
      })
      if (flag) {
        const config1 = Object.assign({}, chartConfig)
        config1.name = num === '7' ? '新增订单' : '新增GMV'
        config1.data = seriesOne
        seriesList.push(config1)
        const config2 = Object.assign({}, chartConfig)
        config2.name = num === '7' ? '新增免费订单' : '新增免费GMV'
        config2.data = seriesTwo
        seriesList.push(config2)
        const config3 = Object.assign({}, chartConfig)
        config3.name = num === '7' ? '新增付费订单' : '新增付费GMV'
        config3.data = seriesThree
        seriesList.push(config3)
      } else {
        const config1 = Object.assign({}, chartConfig)
        config1.data = yDataArr
        seriesList.push(config1)
      }
      const that = this
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            snap: true
          },
          showContent: true,
          alwaysShowContent: false,
          triggerOn: 'mousemove',
          confine: true,
          backgroundColor: 'rgba(255,255,255,1)',
          padding: 15,
          position: 'left',
          borderColor: '#75A0F9',
          borderWidth: 1,
          textStyle: {
            color: '#777'
          },
          formatter: function(params) {
            const s = params[0].data.syncType === 0 ? ' (未同步）' : ''
            let str = ''
            if (flag) {
              str += '<div><p style="margin-bottom: 5px;">' + params[0].name + '</p>'
            }
            params.forEach(ele => {
              if (!flag) {
                str += '<div><p style="margin-bottom: 5px;">' + params[0].name + '</p>' + '<p><span class="circle" style="background:#0C6FFF;margin-right: 5px;"></span>' + that.titleArray[that.tabIndex] + ' ' + that.formatterForNumber(params[0].data) + s + '</p></div>'
              } else {
                str += '<p><span class="circle" style="background:#0C6FFF;margin-right: 5px;"></span>' + ele.seriesName + ' ' + that.formatterForNumber(ele.data) + s + '</p>'
              }
            })
            return str
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xDataArr
        },
        grid: {
          left: '1.5%',
          right: '3%',
          bottom: '0%',
          top: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        series: seriesList
      }
      console.log(option, '掺入的数据')
      this.chart.setOption(option, true)
    },
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    formatterForNumber(num) {
      return String(num).replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&,')
    },
    formatterForW(num) {
      let numReturn = ''
      if (num > 10000) {
        const nums = (num / 10000).toFixed(2) + ''
        const numStr = nums.substring(nums.indexOf('.'), nums.length)
        numReturn = this.formatterForNumber(parseInt(num / 10000)) + numStr + 'w'
        return numReturn
      } else {
        numReturn = this.formatterForNumber(num)
        return numReturn
      }
    },
    formatterForQW(num) {
      let numReturn = ''
      if (num > 10000000) {
        const nums = (num / 10000).toFixed(2) + ''
        const numStr = nums.substring(nums.indexOf('.'), nums.length)
        numReturn = this.formatterForNumber(parseInt(num / 10000)) + numStr + 'w'
        return numReturn
      } else {
        numReturn = this.formatterForNumber(num)
        return numReturn
      }
    },
    formatterForBFB(num) {
      let nums = Math.abs(num)
      nums = (nums * 100).toFixed(2)
      return nums
    },
    checkDept(row) {
      console.log(row, this.search, '搜索条件')
      if (this.search.deptIdChain !== '' && this.search.operatorId === '') {
        this.search.operatorId = row.id
      }
      if (this.search.deptIdChain === '') {
        this.search.deptIdChain = row.id
      }
      this.$emit('reSearchData', this.search)
    },
    // 账号明细详情
    async getAccountDetails() {
      const params = { ...this.$refs.accountData.config, ...this.search }
      delete params.paramType
      delete params.active
      const res = await qryDataScreeningAccountDetailList(params)
      this.accountDetailsData = res.data
      console.log(res, '账号明细详情')
    },
    async exportData() {
      const params = { ...this.$refs.accountData.config, ...this.search }
      delete params.paramType
      delete params.active
      const res = await exportDataScreeningAccountDetail(params)
      console.log(res, '1111')

      downloadFile(res, '账号数据明细.xls')
    },
    loadData(search) {
      this.search = search
      this.searchActive = search.active
      delete search.active
      if (this.search.deptIdChain !== '') {
        this.$refs?.dataDetailsTable?.changeName('运营者')
      }
      if (this.search.operatorId !== '') {
        this.$refs?.dataDetailsTable?.changeName('平台')
      }
      if (this.search.deptIdChain === '' && this.search.operatorId === '') {
        this.$refs?.dataDetailsTable?.changeName('部门')
      }
      qryDataScreeningDetailList({ startTime: search.startTime, endTime: search.endTime, deptIdChain: search.deptIdChain, operatorId: search.operatorId }).then(res => {
        if (this.search.operatorId !== '' && this.search.platformId !== '') {
          console.log(res.data, this.search.platformId, '数据明细')
          this.dataDetailsData = res.data.filter(item => Number(item.id) === Number(this.search.platformId))
        } else {
          this.dataDetailsData = res.data
        }
      })
      this.getAccountDetails(search)
      getDataOverview(search).then(res => {
        if (res.success) {
          this.dataObj = res.data.weMedia
          this.showThisData(this.tabIndex)
        }
      })
      getOrderData(search).then(res => {
        if (res.success) {
          if (res.data != null) {
            this.shareDataObj = res.data
          } else {
            this.shareDataObj = {
              addFreeGmv: 0,
              addFreeGmvLinkRatio: 0,
              addFreeOrder: 0,
              addFreeOrderLinkRatio: 0,
              addGmv: 0,
              addGmvLinkRatio: 0,
              addOrder: 0,
              addOrderLinkRatio: 0,
              addPayGmv: 0,
              addPayGmvLinkRatio: 0,
              addPayOrder: 0,
              addPayOrderLinkRatio: 0
            }
          }
          this.$nextTick(() => {
            this.search.active = this.searchActive
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.data_show {
    width: 100%;
    padding-bottom: 5px;
    overflow-x: auto;
    overflow-y: hidden;
    .dataTips{
      font-size: 12px;
      position: absolute;
      color: #000;
      display: flex;
      top: 0px;
      align-items: center;
      width: 100%;
      background: #E7F0FF;
      padding: 6px 14px 6px 14px;
      border-radius: 8px 8px 0 0;
      box-sizing: border-box;
      .dataTips_icon{
        font-size: 16px;
        color: #E6A23C;
        margin-right: 6px;
      }
    }
    .opt-list{
      padding: 2px;
      box-sizing: border-box;
      background:#F3F3F3;
      margin-top: 20px;
      width: 712px;
      border-radius: 4px;
      .opt-item{
        padding: 5px 16px;
        box-sizing: border-box;
        font-size: 14px;
        cursor: pointer;
      }
      .opt-item-active{
        background: #fff;
        color: #0C6FFF;
        font-weight: 400;
      }
    }

    .title_span {
        color: #333;
        height: 24px;
        font-size: 16px;
        line-height: 24px;
        margin-right: 10px;
        .title_span_tips{
          font-size: 12px;
          font-weight: 400;
          color: #999999;
        }
        p {
            float: left;
            line-height: 24px;
            font-weight: bold;
        }
        em {
            float: left;
            width: 4px;
            height: 24px;
            border-radius: 6px;
            background: #0c6fff;
            margin-right: 8px;
        }
    }
    // padding: 15px 20px;
    .top-data{
      background: #fff;
      padding:0 20px 20px 20px;
      border-radius:0 0 10px 10px;
    }
    .data_contrast{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 20px;
    }
    .qoq{
      display: flex;
      align-items: center;
      // position: absolute;
      // z-index: 999;
      // left: 20px;
      // top: 50px;
      img{
        width: 16px;
        height: 16px;
        margin-left: 4px;
      }
    }
    .data_show_row {
        // width: calc(100% + 20px);
        // margin-top: 20px;
        // margin-left: -20px;
        display: flex;
        justify-content: space-between;
        background: #FAFAFA;
        border: 1px solid #FAFAFA;
        border-radius: 8px;
        padding:44px 0 18px 0 ;
        box-sizing: border-box;
        position: relative;
        // margin-right: 20px;
        .dsr_block {
            // width: 100%;
            // min-width: 220px;
            display: flex;
            flex-direction: column;
            align-items: center;
            // max-width: 250px;
            // margin-left: 20px;
            padding:0 18px;
            box-sizing: border-box;
            border-radius: 8px;
            .dsr_span_title {
                // width: 100%;
                font-size: 14px;
                color: #333;
            }
            .dsr_nums {
                float: left;
                word-break: break-word;
                font-size: 32px;
                // width: 100%;
                font-family: 'DINAlternate-Bold, DINAlternate';
                font-weight: bold;
                color: #161616;
            }
            .dsr_span_bottom {
                // width: 100%;
                margin-top: 5px;
                display: inline-block;
                em {
                    font-size: 14px;
                    color: #777;
                    font-style: normal;
                    float: left;
                    line-height: 20px;
                }
                i {
                    width: 10px;
                    height: 12px;
                    background-image: url(../../../../assets/image/product/up.png);
                    background-size: 100%;
                    margin-top: 4px;
                    float: left;
                }
                strong {
                    float: left;
                    line-height: 20px;
                    font-size: 16px;
                    margin-left: 8px;
                    margin-right: 5px;
                    color: #00CC81;
                    font-family: 'DINAlternate-Bold, DINAlternate';
                    font-weight: 400;
                    // font-weight: bold;
                }
            }
            .ds_xy_btn {
              strong {
                    color: #FF2C3D;
                }
              i {
                background-image: url(../../../../assets/image/product/down.png);
                background-size: 100%;
              }
            }
        }
        .activeClass {
          border: 1px solid #0C6FFF;
          background: #F2F9FF;
        }
    }
}
.data-line-table{
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
  margin-top: 20px;
  border-radius: 10px;
}

.data-line-echart {
  width: 100%;
  margin-top: 20px;
  height: 390px;
  background: #FFFFFF;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  .data-line-show {
    width: 100%;
    height: 325px;
  }
}
</style>

