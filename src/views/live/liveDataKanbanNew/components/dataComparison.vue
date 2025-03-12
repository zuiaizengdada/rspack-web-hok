<template>
  <el-card class="dataComparison">
    <div class="searchTop">
      <div class="searchTopTitle">直播数据对比</div>
    </div>
    <div class="my-table overflowOuto">
      <div v-if="listData.length === 0" class="noData">
        <div class="noDataText">目前暂无直播间对比数据，请进行选择</div>
        <el-button type="primary" size="small" @click="onhandleSelectLiveRoom">选择直播间</el-button>
      </div>

      <div v-else class="page_wrap">
        <div class="filterTop">
          <label class="searchLabel">
            <span class="p-t-5 m-r-10">分配时间</span>
            <el-date-picker
              v-model="search.time"
              type="daterange"
              align="right"
              unlink-panels
              size="small"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="searchFn"
            />
          </label>
          <label>
            <el-button type="text" class="m-l-10" @click="onhandleSelectLiveRoom">选择直播间</el-button>
          </label>
        </div>

        <div class="table_wrap">
          <div class="table_wrap_body">
            <div v-for="(col) in tableRenderList" :key="col.key" class="table_wrap_colum table_wrap_colum_1">{{ col.title }}</div>
          </div>
          <div class="table_wrap_flex">
            <draggable v-model="listData" class="table_wrap_body" @end="onDragEnd">
              <div v-for="(item, index) in listData" :key="index" class="table_wrap_body_colum">
                <div v-for="(col, i) in tableRenderList" :key="col.key" class="table_wrap_colum">
                  <div class="table_body_value">
                    <i v-if="loading && i > 2" class="el-icon-loading" />
                    <template v-else>{{ col.render ? col.render(item[col.key]) : item[col.key] }}</template>
                  </div>
                  <div v-if="i === 0" class="delIcon" @click="onhandleDel(item, i)">
                    <i class="el-icon-close" />
                  </div>
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { liveRoomStatisticsCompare } from '@/api/liveRoom/kanban.js'
import draggable from 'vuedraggable'
import Dialog from '@/views/live/Dialog/index.js'
import { parseTime, filtersMoneyByZero } from '@/filters/index.js'
export default {
  components: {
    draggable
  },
  data() {
    return {
      search: {
        time: ['', '']
      },
      loading: '',
      listData: [],
      tableRenderList: [
        { key: 'name', title: '直播间名称' },
        { key: 'startTime', title: '开播时间', render: (res) => { return parseTime(res) } },
        { key: 'appearSequence', title: '出场顺序' },
        { key: 'clueCount', title: '线索数' },
        { key: 'applyCount', title: '报名人数' },
        { key: 'courseCount', title: '到课人数' },
        { key: 'orderCount', title: '成交订单数' },
        { key: 'gmv', title: '成交GMV', render: (res) => { return filtersMoneyByZero(res) } },
        { key: 'courseOrderRate', title: '到课转化率', render: (res) => { return (res || 0) + '%' } },
        { key: 'clueOrderRate', title: '线索转化率', render: (res) => { return (res || 0) + '%' } },
        { key: 'viewCount', title: '累计观看人数' },
        { key: 'maxOnlineCount', title: '最高在线人数' },
        { key: 'avgViewTime', title: '人均观看时长', render: (res) => { return this.renderLiveDuration(res) } },
        { key: 'finishCourseRate', title: '完课率', render: (res) => { return (res || 0) + '%' } }
      ]
    }
  },
  mounted() {},
  methods: {
    renderLiveDuration(val) {
      if (!val || typeof val !== 'number') {
        return '0秒'
      } else {
        const result = parseInt(val / 1000)
        const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
        const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
        const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
        if (h === '00') {
          return m + '分' + s + '秒'
        } else {
          return h + '时' + m + '分'
        }
      }
    },
    // 拖拽结束
    onDragEnd() {
      console.log('111')
    },
    // 点击选择直播间
    onhandleSelectLiveRoom() {
      Dialog.open({
        type: 'SelectLiveRoom',
        visible: true,
        selectList: JSON.parse(JSON.stringify(this.listData)),
        success: (res) => {
          Dialog.close()
          this.listData = res
          if (res.length === 0) return
          this.searchFn()
        }
      })
    },
    onhandleDel(item, i) {
      const index = this.listData.findIndex(v => v.id === item.id)
      index > -1 && this.listData.splice(index, 1)
    },
    // 根据选择的直播间id获取数据列表
    searchFn() {
      console.log(this.search.time)
      this.loading = true
      const ids = this.listData.reduce((pre, next) => {
        pre.push(next.id)
        return pre
      }, [])
      const data = {
        startTime: this.search.time ? this.search.time[0] : '',
        endTime: this.search.time ? this.search.time[1] : '',
        liveRoomIdList: ids
      }
      liveRoomStatisticsCompare(data).then(res => {
        this.listData.map((v, i) => {
          const obj = res.data.find(e => v.id === e.liveRoomId)
          if (obj) {
            this.listData[i] = { ...v, ...obj }
          }
        })
        console.log(this.listData, 'listData')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.dataComparison {
  background: #FFFFFF;
  border-radius: 8px;
  .searchTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .searchTopTitle {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #2C3242;
      line-height: 22px;
    }
  }
  .my-table {
    .noData {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .noDataText {
            margin-top: 16px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 22px;
            margin-bottom: 20px;
        }
    }
    .page_wrap {
        margin-top: 20px;
        .filterTop {
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            .searchLabel {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 22px;
                margin-bottom: 20px;
                display: flex;
            }
        }
        .table_wrap {
            display: flex;
            border-left: 1px solid #dfe6ec;
            .table_wrap_body {
                border-top: 1px solid #dfe6ec;
                border-bottom: 1px solid #dfe6ec;
                .table_wrap_body_colum {
                  border-right: 1px solid #dfe6ec;
                }
                .table_wrap_colum {
                    height: 39px;
                    line-height: 39px;
                    padding: 0 10px;
                    text-align: center;
                    color: rgb(96, 98, 102);
                    box-sizing: border-box;
                    text-overflow: ellipsis;
                    vertical-align: middle;
                    position: relative;
                    font-size: 12px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis; /* 可选，当内容超出一行时，用省略号表示 */
                    position: relative;
                    .table_body_value {
                    }
                    .delIcon {
                        position: absolute;
                        right: -14px;
                        top: -14px;
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        background: red;
                        color: #fff;
                        cursor: pointer;
                        .el-icon-close {
                            position: absolute;
                            bottom: 1px;
                            left: 2px;
                        }
                    }
                }
               .table_wrap_colum + .table_wrap_colum {
                   border-top: 1px solid #dfe6ec;
               }
               .table_wrap_colum_1 {
                    font-size: 12px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: bolder;
                    color: #2C3242;
                    background: rgb(245, 245, 245);
                }
           }
           .table_wrap_flex {
                flex: 1 0 0px;
                display: flex;
                overflow: auto;
                .table_wrap_body {
                  display: flex;
                  cursor: move;
                }
                .table_wrap_colum {
                    height: 39px;
                    line-height: 39px;
                    padding: 0 10px;
                    text-align: center;
                    color: rgb(96, 98, 102);
                    box-sizing: border-box;
                    text-overflow: ellipsis;
                    vertical-align: middle;
                    position: relative;
                    font-size: 12px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis; /* 可选，当内容超出一行时，用省略号表示 */
                        position: relative;
                    .table_body_value {
                    }
                    .delIcon {
                        position: absolute;
                        right: -14px;
                        top: -14px;
                        width: 28px;
                        height: 28px;
                        border-radius: 50%;
                        background: red;
                        color: #fff;
                        cursor: pointer;
                        .el-icon-close {
                            position: absolute;
                            bottom: 1px;
                            left: 2px;
                        }
                    }
                }
               .table_wrap_colum + .table_wrap_colum {
                   border-top: 1px solid #dfe6ec;
               }
           }
          //  .table_wrap_body + .table_wrap_body {
          //       border-left: 1px solid #dfe6ec;
          //  }
        }
    }
  }
}
.p-t-5 {
  padding-top: 5px;
}
</style>
