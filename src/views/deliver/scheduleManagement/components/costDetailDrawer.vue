<template>
  <!-- 成本详情弹框 -->
  <el-drawer
    :size="758"
    :visible.sync="visibleDialog"
    v-bind="$attrs"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    v-on="$listeners"
  >
    <div class="drawerBody">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">{{ title }}</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div class="drawerContent overflowOuto">
        <div class="costConfirmDetail">
          <div class="dataCollect">
            <div class="dataCollectTitle">学员学费汇总</div>
            <div class="dataCollectValue">
              ￥<span v-if="form.tuitionAmount < 0">-</span>
              {{ form.tuitionAmount | filtersMoneyByZero }}
            </div>
          </div>
          <div class="dataCollect">
            <div class="dataCollectTitle">课程交付成本汇总</div>
            <div class="dataCollectValue">
              ￥<span v-if="form.totalCost < 0">-</span>
              {{ form.totalCost | filtersMoneyByZero }}
            </div>
          </div>
          <div class="dataCollect">
            <div class="dataCollectTitle">预期利润</div>
            <div class="dataCollectValue">
              ￥<span v-if="form.expectProfit < 0">-</span>
              {{ form.expectProfit | filtersMoneyByZero }}
            </div>
          </div>
        </div>
        <el-tabs v-model="activeName" class="m-t-20" @tab-click="handleClick">
          <el-tab-pane label="学员学费" name="studentTuition" />
          <el-tab-pane label="课程交付成本" name="courseDeliveryCost" />
        </el-tabs>
        <components :is="activeName" :file-list="fileList" :form="form" :table-column="tableColumn" class="mytabs" :schedule-id="scheduleId" />
      </div>
    </div>
  </el-drawer>
</template>

<script>
import courseDeliveryCost from './courseDeliveryCost.vue'
import studentTuition from './studentTuition.vue'
import { getDeliveryScheduleCost } from '@/api/deliver/scheduleManagement'
export default {
  components: {
    courseDeliveryCost,
    studentTuition
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    scheduleId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      activeName: 'studentTuition',
      tableColumn: [
        { key: 'travelCost', label: '差旅费', value: '' },
        { key: 'siteCost', label: '场地费', value: '' },
        { key: 'conferenceServiceCost', label: '会务服务费', value: '' },
        { key: 'projectMaterialCost', label: '项目物料费', value: '' },
        { key: 'commissionCost', label: '手续费', value: '' },
        { key: 'fixedLaborCost', label: '固定人工费', value: '' },
        { key: 'channelCost', label: '渠道费', value: '' },
        { key: 'teacherSalaryCost', label: '老师课酬费', value: '' },
        { key: 'performanceCommissionCost', label: '业务奖金/提成', value: '' }
      ],
      form: {
        tuitionAmount: '', // 学员学费汇总
        totalCost: '', // 课程交付成本汇总
        expectProfit: '', // 预期利润
        updateTime: '',
        updateUserName: ''
      },
      fileList: []
    }
  },
  computed: {
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    'visible'(val) {
      console.log('123', val)
      val && this.init()
    }
  },
  mounted() {},
  methods: {
    // 点击关闭
    close() {
      console.log('点击关闭')
      this.$emit('update:visible', false)
    },
    init() {
      this.activeName = 'studentTuition'
      this.getDetail()
      // console.log(this, 'this.scheduleId')
    },
    // tab切换触发
    handleClick() {},
    // 获取成本详情
    getDetail() {
      this.loading = true
      getDeliveryScheduleCost(this.scheduleId).then(res => {
        console.log(res)
        this.loading = false
        this.tableColumn.forEach(v => {
          v.value = res.data[v.key] || ''
        })
        this.form.tuitionAmount = res.data.tuitionAmount
        this.form.totalCost = res.data.totalCost
        this.form.expectProfit = res.data.expectProfit
        this.form.updateTime = res.data.updateTime
        this.form.updateUserName = res.data.updateUserName
        // console.log(res.data)
        if (res.data.url) {
          console.log(res.data.url)
          const arr = res.data.url.split(',')
          const fileList = []
          arr.map(v => {
            const arr = v.split('/')
            fileList.push({
              file: null,
              name: arr[arr.length - 1],
              status: 3,
              authProgress: 100,
              url: v
            })
          })
          this.fileList = fileList
          console.log(fileList, 'fileList')
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.drawerBody {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    background: #FFFFFF;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #f2f2f2;
    color: #353535;
    font-size: 16px;
    font-weight: bold;
    .ss-material-box-header-title {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .close {
    color: #b2b2b2;
    margin-left: auto;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .drawerContent {
    flex: 1 0 0;
    padding: 20px 20px 0;
    display: flex;
    flex-direction: column;
    .costConfirmDetail {
      display: flex;
      justify-content: space-between;
      .dataCollect {
        width: 218px;
        background: #F2F9FF;
        border-radius: 8px;
        padding: 16px;
        .dataCollectTitle {
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: #777777;
          line-height: 24px;
          margin-bottom: 8px;
        }
        .dataCollectValue {
          font-size: 20px;
          font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
          font-weight: bold;
          color: #161616;
          line-height: 32px;
        }
      }
    }
    .mytabs {
      flex: 1 0 0;
    }
  }
  .ss-material-box-footer {
    padding-right: 18px;
    border-top: 1px solid #E7E7E7;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
::v-deep {
  .el-tabs__item {
    font-size: 16px;
  }
}
</style>
