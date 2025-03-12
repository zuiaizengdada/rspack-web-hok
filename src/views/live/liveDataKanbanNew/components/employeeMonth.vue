<template>
  <div class="bill-fees-home">
    <MTitle>员工月度业绩</MTitle>
    <div v-if="!isDetail" class="bill-fees-main">
      <div>
        <HokSearchForm
          :form-opts="formOptsEmployeeMonth"
          :ref-obj.sync="formOptsEmployeeMonth.ref"
          class="pd20 sh-top private-search"
        >
          <template #deptId>
            <el-cascader
              v-if="vascaderShow"
              ref="cascaderEmployee"
              v-model="deptIdMonthArray"
              :options="deptList"
              :props="cascaderProps"
              :show-all-levels="false"
              @change="update"
            />
          </template>
          <template #userIdList>
            <el-select v-model="formOptsEmployeeMonth.formData.userIdList" multiple clearable filterable @change="searchFn">
              <el-option
                v-for="item in userArray"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
          </template>
          <template #monthYear>
            <el-date-picker
              v-model="formOptsEmployeeMonth.formData.monthYear"
              :clearable="false"
              format="yyyy-MM"
              type="month"
              placeholder="选择月"
              @change="searchFn"
            />
          </template>
        </HokSearchForm>
      </div>
      <div class="right-fixed">
        <el-button class="right-fixed-btn" type="primary" size="small" @click="setTarget" v-permission="['btn:liveDataKanbanNew:setTarget', permsList]">目标值设置</el-button>
      </div>
      <div class="ranking-header">
        <div class="choose-con">
          <span :class="chooseType === 0?'active-span':''" @click="changeType(0)">营收</span>
          <span :class="chooseType === 1?'active-span':''" @click="changeType(1)">退款</span>
          <span :class="chooseType === 2?'active-span':''" @click="changeType(2)">GMV</span>
        </div>
        <div class="right-choose">
          <el-radio-group v-model="radio" v-removeAriaHidden @change="changeBiL">
            <el-radio :label="1">环比</el-radio>
            <el-radio :label="2">同比</el-radio>
          </el-radio-group>
          <el-select v-model="value" size="mini" placeholder="请选择" style="margin-left: 20px;" @change="changeOpPx">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="echart-data">
        <monthRevenueChart v-if="chooseType === 0" ref="monthRevenueChart" @chooseToDetailPage="chooseToDetailPage" />
        <monthRefundChart v-if="chooseType === 1" ref="monthRefundChart" />
        <monthGmvChart v-if="chooseType === 2" ref="monthGmvChart" />
      </div>
    </div>
    <div v-else class="month-detail-b">
      <span class="back-chart-data" @click="toBack">返回</span>
      <personalData ref="personalDataRef" />
    </div>
  </div>
</template>

<script>
import { curwordEmployeeOpts, columns } from './tableData.js'
import { cloneDeep } from 'lodash'
import HokSearchForm from '@/components/baseCpns/searchForm/index.vue'
import monthRevenueChart from './monthRevenueChart.vue'
import monthRefundChart from './monthRefundChart.vue'
import monthGmvChart from './monthGmvChart.vue'
import { userNoPage } from '@/api/addressBookApi'
import personalData from './personalData/index'
import {
  getDeptId
} from '@/api/liveRoom/kanban.js'
import {
  deptTree
} from '@/api/addressBookApi'
import moment from 'moment'
export default {
  components: {
    HokSearchForm,
    monthRevenueChart,
    monthRefundChart,
    monthGmvChart,
    personalData
  },
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      isDetail: false,
      userDeptFromApi: '', // 保存接口返回的用户部门
      vascaderShow: false,
      userArray: [],
      cascaderProps: {
        checkStrictly: true,
        emitPath: false,
        value: 'id'
      },
      deptIdMonthArray: '',
      deptList: [],
      radio: 1,
      chooseType: 0,
      columns: columns,
      formOptsEmployeeMonth: {
        ...cloneDeep(curwordEmployeeOpts.form),
        operatorList: [
          { label: '查询', type: 'primary', fn: this.searchFn, bind: { plain: true } },
          {
            label: '重置',
            fn: this.clearFn,
            type: 'plain',
            bind: { plain: true }
          }
        ]
      },
      value: 2,
      options: [{
        value: 2,
        label: '按完成度'
      }, {
        value: 1,
        label: '按目标值'
      }],
      config: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0,
        tableData: [],
        basics: cloneDeep(curwordEmployeeOpts.table)
      },
      loading: false
    }
  },

  created() {
    this.loadDeptList()
    this.loadUserNoPage()
  },
  methods: {
    toBack() {
      this.isDetail = false
      this.searchFn()
    },
    chooseToDetailPage(flag, obj) {
      this.isDetail = flag
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.personalDataRef.initData(obj)
        })
      }, 300)
    },
    setTarget() {
      this.$router.push({
        name: 'targetSettingNew',
        params: { month: moment(this.formOptsEmployeeMonth.formData.monthYear).format('YYYYMM'), deptId: this.formOptsEmployeeMonth.formData.deptId }
      })
    },
    moment,
    loadUserNoPage() {
      const params = {
        nickName: ''
      }
      userNoPage(params)
        .then((res) => {
          this.userArray = res.data
        })
        .catch(() => {
        })
    },
    update() {
      this.formOptsEmployeeMonth.formData.deptId = this.deptIdMonthArray
      this.searchFn()
    },
    changeBiL() {
      this.formOptsEmployeeMonth.formData.comparisonWay = this.radio
      this.searchFn()
    },
    changeOpPx() {
      this.formOptsEmployeeMonth.formData.sortBy = this.value
      this.searchFn()
    },
    findPathToId(tree, targetId) {
      const path = []

      function traverse(node, currentPath) {
        // 如果找到了目标节点
        if (node.id === targetId) {
          path.push(...currentPath, node.id)
          return true
        }

        // 否则，继续搜索子节点
        if (node.children) {
          for (const child of node.children) {
            if (traverse(child, [...currentPath, node.id])) {
              return true
            }
          }
        }

        return false
      }

      // 从树的每个根节点开始搜索
      for (const root of tree) {
        if (traverse(root, [])) {
          break
        }
      }

      return path // 返回从根到目标节点的路径，包括目标节点
    },
    loadDeptList() {
      deptTree({}).then(res => {
        if (res.code === 1) {
          if (res && res.data && res.data.length > 0) {
            const arr = res.data.reduce((pre, next) => {
              pre.push({ label: next.label, id: next.id, children: next.children })
              return pre
            }, [])
            this.deptList = arr
          }
        }
      })
      getDeptId().then(res => {
        if (res.code === 1) {
          this.$nextTick(() => {
            // this.deptIdModealArray.push(res.data)
            this.userDeptFromApi = res.data
            this.deptIdMonthArray = res.data// this.findPathToId(this.deptList, res.data)
            this.formOptsEmployeeMonth.formData.deptId = this.deptIdMonthArray// this.deptIdModealArray[this.deptIdModealArray.length - 1]
            // this.returnNewTreeList(this.formOptsEmployeeMonth.formData.deptId, this.deptList)
            this.$forceUpdate()
            setTimeout(() => {
              this.vascaderShow = true
              this.searchFn()
            }, 300)
          })
        }
      })
      // eslint-disable-next-line no-undef
      this.formOptsEmployeeMonth.formData.monthYear = moment().format('YYYY-MM')
    },
    changeType(type) {
      this.chooseType = type
      this.searchFn()
    },
    searchFn() {
      this.formOptsEmployeeMonth.formData.deptId = this.formOptsEmployeeMonth.formData.deptId + ''
      this.formOptsEmployeeMonth.formData.monthYear = moment(this.formOptsEmployeeMonth.formData.monthYear).format('YYYY-MM')
      if (this.chooseType === 0) {
        this.$nextTick(() => {
          this.$refs.monthRevenueChart.init(this.formOptsEmployeeMonth.formData)
        })
      } else if (this.chooseType === 1) {
        this.$nextTick(() => {
          this.$refs.monthRefundChart.init(this.formOptsEmployeeMonth.formData)
        })
      } else if (this.chooseType === 2) {
        this.$nextTick(() => {
          this.$refs.monthGmvChart.init(this.formOptsEmployeeMonth.formData)
        })
      }
    },
    clearFn() {
      this.formOptsEmployeeMonth.ref.resetFields()
      this.formOptsEmployeeMonth.formData = cloneDeep(curwordEmployeeOpts.form.formData)
      this.deptIdMonthArray = this.userDeptFromApi
      this.formOptsEmployeeMonth.formData.monthYear = moment().format('YYYY-MM')
      this.formOptsEmployeeMonth.formData.deptId = this.deptIdMonthArray
      this.searchFn()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.sh-top {
    margin-top: 18px;
}
.coupon-table {
    flex: 1;
    overflow: hidden;
    .title {
    color: #161616;
    font-family: 'PingFang SC';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    }
    .txt {
    color: #161616;
    font-family: 'PingFang SC';
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    }
    .blue-desc {
    color: #0c6fff;
    font-family: 'PingFang SC';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    }
    .orange-desc {
    color: #ff7d00;
    font-family: 'PingFang SC';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    }
    .grey-desc {
    color: #999999;
    font-family: 'PingFang SC';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    }
    .audit-status-box {
    font-family: 'PingFang SC';
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    padding: 0 10px;
    display: inline-block;
    position: relative;
    &.audit-status1 {
        padding-left: 24px;
        color: #ff7d00;
        flex-shrink: 0;
        border-radius: 12px;
        background: #fff2e6;
        &::before {
        content: '';
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        height: 12px;
        width: 12px;
        background: url('~@/assets/image/coupon/icn_chushen.png') no-repeat;
        background-size: 100%;
        }
    }
    &.audit-status2 {
        padding-left: 24px;
        color: #f53f3f;
        flex-shrink: 0;
        border-radius: 12px;
        background: #feecec;
        &::before {
        content: '';
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        height: 12px;
        width: 12px;
        background: url('~@/assets/image/coupon/icn_bohui.png') no-repeat;
        background-size: 100%;
        }
    }
    &.audit-status3 {
        padding-left: 24px;
        color: #00b42a;
        flex-shrink: 0;
        border-radius: 12px;
        background: #e6f7ea;
        &::before {
        content: '';
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        height: 12px;
        width: 12px;
        background: url('~@/assets/image/coupon/icn_check.png') no-repeat;
        background-size: 100%;
        }
    }
    }
}

.ranking-header {
    width: 100%;
    height: 32px;
    margin-top: 3px;
    display: inline-block;
}
.right-choose {
    float: right;
    .sort-span {
        color: #000;
        font-family: "Microsoft YaHei";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 14px;
        margin-left: 30px;
        margin-right: 12px;
    }
    ::v-deep .el-radio__label {
      color: #000!important;
    }
}
.choose-con {
    float: left;
    width: 245px;
    height: 32px;
    background: #F7F7F7;
    border-radius: 4px;
    span {
        width: 80px;
        height: 26px;
        text-align: center;
        color: #333;
        font-family: "Microsoft YaHei";
        font-size: 14px;
        line-height: 26px;
        font-style: normal;
        font-weight: 400;
        float: left;
        margin-top: 3px;
        margin-left: 1px;
        border-radius: 5px;
        cursor: pointer;
        border: 1px solid #F7F7F7;
    }
    .active-span {
        background: linear-gradient(90deg, #CEE2FF 0%, #BCC9FF 100%);
        color: #000;
        font-weight: bold;
    }

}

.right-fixed {
  width: 100%;
  height: 40px;
  position: relative;
  text-align: right;
  margin-top: -52px;
  z-index: 0;
  float: left;
  pointer-events: none;
}
.private-search {
  padding-bottom: 20px;
  pointer-events: auto;
}

.right-fixed-btn {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 999;
  pointer-events: auto;
}

.bill-fees-main {
  width: 100%;
}

.month-detail-b {
  position: relative;
}

.back-chart-data {
  border: 1px solid red;
  position: absolute;
  width: 60px;
  height: 32px;
  right: 0;
  top: -32px;
  line-height: 32px;
  text-align: center;
  font-size: 14px;
  color: '#CBCFD3';
  border: 1px solid #CBCFD3;
  cursor: pointer;
  border-radius: 3px;
}
</style>
