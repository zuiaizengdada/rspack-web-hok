<template>
  <!-- 讲师数据对比图 -->
  <div v-show="isShow" class="compared">
    <MCard class="m-t-22">
      <div class="trend-container">
        <div class="search">
          <div class="search_left">
            <MTitle title="IP最新跟进情况" class="m-r-16" />
          </div>
          <div class="search_right">
            <div class="search_right--status">
              <span class="search_right--label">合作状态</span>
              <el-select
                v-model="search.cooperateStatus"
                clearable
                @change="init"
                @clear="init"
              >
                <el-option
                  v-for="(item) in COOPERATION_TYPE"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <AppDatepicker
              :show="[ 1, 7, 30]"
              :default="7"
              :search="search.time"
              :picker-options="pickerOptions"
              @change="timeChange"
              @blur="currentTime = ''"
            />
          </div>
        </div>
        <div class="histogram">
          <dynamicTable
            ref="table"
            key="followUp"
            v-model="tableData"
            immediate-check
            :hide-pagination="hidePagination"
            :columns="columns"
            :get-list-api="getList"
            :config-props="{layout:'total, prev, pager, next'}"
          >
            <template #teacherName="{ row }">
              <el-button type="text" @click="goLink(row)">{{
                row.teacherName
              }}</el-button>
            </template>
          </dynamicTable>
        </div>
      </div>
    </MCard>
    <!-- 表格 -->

  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { getFollowList } from '@/api/tearchCenter/index'
import AppDatepicker from '@/components/AppDatePicker'
import { getDict } from '@/utils/index'
import { getOptionsValue } from '@/filters'
export default {
  components: {
    AppDatepicker,
    dynamicTable
  },
  data() {
    return {
      search: {
        time: {
          active: 2,
          time: ['', '']
        },
        cooperateStatus: undefined
      },
      tableData: [], // 列表数据
      COOPERATION_TYPE: [],
      isShow: false,
      columns: [
        {
          prop: 'teacherName',
          label: 'IP姓名',
          type: 'slot',
          visible: true
        },
        {
          prop: 'teacherRealName',
          label: '真实姓名',
          type: 'text',
          visible: true
        },
        {
          prop: 'overallRating',
          label: '综合评分',
          type: 'text',
          visible: true,
          slotFn: (row) => row.overallRating ? (row.overallRating / 100).toFixed(2) + '分' : '——'
        },
        {
          prop: 'cooperateStatus',
          label: '合作状态',
          type: 'text',
          visible: true,
          slotFn: (row) => getOptionsValue(row.cooperateStatus, this.COOPERATION_TYPE)
        },
        {
          prop: 'phoneNumber',
          label: '联系手机',
          type: 'text',
          visible: true
        },
        {
          prop: 'wechatId',
          label: '微信号',
          type: 'text',
          visible: true
        },
        {
          prop: 'contactSituation',
          label: '联系情况',
          type: 'text',
          visible: true,
          width: 600
        }
      ],
      hidePagination: false,
      currentTime: '',
      pickerOptions: {
        disabledDate: (time) => {
          // 先限制今天之前
          if (time.getTime() > Date.now()) {
            return true
          }
          // eslint-disable-next-line eqeqeq
          if (this.currentTime != '') {
            // 一年以内
            const one = 364 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            const minTime = this.currentTime - one
            const maxTime = this.currentTime + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      }
    }
  },
  async mounted() {
    this.COOPERATION_TYPE = await getDict('COOPERATION_TYPE')
    this.init()
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.$refs.table?.onRefresh()
      })
    },
    timeChange(val) {
      this.search.time = val
      this.$refs.table?.onRefresh()
    },
    goLink(row) {
      this.$router.push(`/teacherCenter/teachFile/list?teacherId=${row.teacherId}&teacherName=${row.teacherName}`)
    },
    // 获取讲师数据对比
    async getList(params) {
      const beginTime = this.search.time.time[0] || undefined
      const endTime = this.search.time.time[1] || undefined
      const cooperateStatus = this.search.cooperateStatus ?? undefined
      const res = await getFollowList({
        ...params,
        beginTime,
        endTime,
        cooperateStatus
      })
      this.$nextTick(() => {
        this.isShow = res.code !== 7003
        this.hidePagination = res.data.total < this.$refs?.table?.config?.pageSize
      })
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.compared ::v-deep{
  .my-table{
    margin: 0px;
  }
  .trend-container{
    padding: 0 20px;
    .search {
      display: flex;
      justify-content: space-between;
      .search_left {
        display: flex;
        align-items: center;
      }
      .search_right{
        display: flex;
        align-items: center;
        color: #333333;
        font-size: 14px;
        .search_right--label{
            margin-right: 8px;
        }
        .search_right--status{
            margin-right: 40px;
        }
      }
    }
    .search_type{
      display: flex;
      width: 100%;
      margin-top: 42px;
      .search_item{
        flex: 1;
        border-radius: 6px;
        height: 116px;
        margin-right: 20px;
        font-size: 16px;
        color: #333333;
        cursor: pointer;
        .search_box{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          .value{
            margin-top: 15px;
            font-size: 24px;
            font-weight: bold;
            color: #161616;
          }
          .label{
            font-size: 16px;
            font-weight: 500;
            color: #161616;
          }
        }

        &:last-child{
          margin-right: 0px;
        }
      }
      .is-select.search_item{
        color: #FFFFFF;
        background-color: #0C6FFF;
        background-image: url('../../../assets/image/kanban_bg.png');
        background-repeat:no-repeat ;
        background-size: 151px 134px;
        background-position: 110% 8px;
        .value{
          color: #FFFFFF;
        }
        .label{
            font-size: 16px;
            font-weight: 500;
            color: #fff;
          }
      }
    }
  }
  .histogram {
    height: 432px;
  }
}
.radio {
  text-align: center;
}

</style>
