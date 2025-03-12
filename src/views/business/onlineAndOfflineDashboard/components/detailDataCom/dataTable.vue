<template>
  <div class="wrapper-online-data-table">
    <!-- 企业  营收 数据表格（展示部门） -->
    <el-table
      v-if="!formDataTable.employeeDeptId && chooseType === 1"
      ref="qiyeYingshouDepartMentData"
      :header-cell-style="headerCellStyleFunc"
      :data="tableData"
      style="width: 100%"
      :row-key="getRowKey"
      border
      lazy
      :row-class-name="rowClassName"
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      show-summary
      :summary-method="getSummaryPart"
    >
      <el-table-column
        prop="deptName"
        width="160"
        label="部门"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.deptName !== '总计' && scope.row.deptName !== '归公营收'" class="blue-cls" @click="toDepartMent(scope.row)"><em v-if="!scope.row.hasChildren" class="width-cls-zw" />{{ scope.row.deptName }}</span>
          <span v-else><em v-if="!scope.row.hasChildren" class="width-cls-zw" />{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="formDataTable.offlineFlag === 0"
        sortable
        width="160"
        prop="freeRevenue"
        label="免费营收(单量)"
      >
        <template slot-scope="scope">
          <p>{{ filterPrice(scope.row.freeRevenue) }}</p>
          <p class="scope-em"> ({{ scope.row.freeOrderCount }}单) </p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="formDataTable.offlineFlag === 0"
        sortable
        width="160"
        prop="directAmount"
        label="直接付费(单量)"
      >
        <template slot-scope="scope">
          <p>{{ filterPrice(scope.row.directAmount) }}</p>
          <p class="scope-em"> ({{ scope.row.directOrderCount }}单) </p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="formDataTable.offlineFlag === 0"
        sortable
        width="160"
        prop="indirectAmount"
        label="间接付费(单量)"
      >
        <template slot-scope="scope">
          <p>{{ filterPrice(scope.row.indirectAmount) }}</p>
          <p class="scope-em"> ({{ scope.row.indirectOrderCount }}单) </p>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="revenue"
        width="160"
        label="总营收(单量)"
      >
        <template slot-scope="scope">
          <div :class="(formDataTable.bizTypeActive !== 2 && formDataTable.bizTypeActive !== 3)?'blue-cls':''">
            <p>{{ filterPrice(scope.row.revenue) }}</p>
            <p class="scope-em"> ({{ scope.row.revenueOrderCount }}单) </p>
          </div>
        </template>

      </el-table-column>
      <el-table-column
        prop="refundAmount"
        width="160"
        label="总退款(单量)"
        sortable
      >
        <template slot-scope="scope">
          <div :class="formDataTable.bizTypeActive === 2?'blue-cls':''">
            <p>{{ filterPrice(scope.row.refundAmount) }}</p>
            <p class="scope-em"> ({{ scope.row.refundOrderCount }}单) </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="refundPercent"
        label="退款率"
        sortable
      >
        <template slot-scope="scope">
          <span>{{ scope.row.refundPercent>1000?'1000%+':scope.row.refundPercent+'%' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="gmv"
        label="GMV"
        sortable
      >
        <template slot-scope="scope">
          <div :class="formDataTable.bizTypeActive === 3?'blue-cls':''">
            {{ filterPrice(scope.row.gmv) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="本月营收"
      >
        <template slot-scope="scope">
          {{ filterPrice(scope.row.amount) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="linkAmount"
        label="上月营收"
      >
        <template slot-scope="scope">
          {{ filterPrice(scope.row.linkAmount) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="amountLinkRatio"
        label="增长"
      >
        <template slot-scope="scope">
          {{ scope.row.amountLinkRatio>1000?'1000%+':scope.row.amountLinkRatio+'%' }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 企业  业绩 数据表格（展示部门） -->
    <el-table
      v-else-if="!formDataTable.employeeDeptId && chooseType === 2"
      ref="qiyeYejiDepartMentData"
      :header-cell-style="headerCellStyleFunc"
      :data="tableData"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      show-summary
      :summary-method="getSummaryPartYji"
    >
      <el-table-column
        prop="deptName"
        label="部门"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.deptName !== '总计' && scope.row.deptName !== '归公业绩'" class="blue-cls" @click="toDepartMent(scope.row)">
            <em v-if="!scope.row.hasChildren" class="width-cls-zw" />{{ scope.row.deptName }}</span>
          <span v-else> <em v-if="!scope.row.hasChildren" class="width-cls-zw" />{{ scope.row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="freePerformance"
        label="免费业绩(单量)"
        sortable
      >
        <template slot-scope="scope">
          <p>{{ filterPrice(scope.row.freePerformance) }}</p>
          <p class="scope-em"> ({{ scope.row.freePerformanceOrderCount }}单) </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="directAmount"
        label="直接付费(单量)"
        sortable
      >
        <template slot-scope="scope">
          <p>{{ filterPrice(scope.row.directAmount) }}</p>
          <p class="scope-em"> ({{ scope.row.directOrderCount }}单) </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="indirectAmount"
        label="间接付费(单量)"
        sortable
      >
        <template slot-scope="scope">
          <p>{{ filterPrice(scope.row.indirectAmount) }}</p>
          <p class="scope-em"> ({{ scope.row.indirectOrderCount }}单) </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalPerformance"
        sortable
        label="总业绩"
      >
        <template slot-scope="scope">
          <div class="blue-cls">
            <span>{{ filterPrice(scope.row.totalPerformance) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="currentPerformance"
        label="本月业绩"
      >
        <template slot-scope="scope">
          <span>{{ filterPrice(scope.row.currentPerformance) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="linkPerformance"
        label="上月同期"
      >
        <template slot-scope="scope">
          <span>{{ filterPrice(scope.row.linkPerformance) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="linkRatio"
        label="增长"
      >
        <template slot-scope="scope">
          {{ scope.row.linkRatio>1000?'1000%+':scope.row.linkRatio+'%' }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 部门  营收 员工数据表格（展示员工） -->
    <el-table
      v-if="formDataTable.employeeDeptId && chooseType === 1 && chooseTypePart === 3"
      ref="bumenYingshouYuangongMentData"
      :header-cell-style="headerCellStyleFunc"
      :data="tableData"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      show-summary
      :summary-method="getSummary"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="employeeName"
        label="个人"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.employeeName !== '总计'" class="blue-cls" @click="toUserInfoDetail(scope.row)">{{ scope.row.employeeName }}</span>
          <span v-else>{{ scope.row.employeeName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="formDataTable.offlineFlag === 0"
        prop="freeAmount"
        label="免费营收(单量)"
        sortable
      >
        <template slot-scope="scope">
          <p>{{ filterPrice(scope.row.freeAmount) }}</p>
          <p class="scope-em"> ({{ scope.row.freeOrderCount }}单) </p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="formDataTable.offlineFlag === 0"
        prop="directAmount"
        label="直接付费(单量)"
        sortable
      >
        <template slot-scope="scope">
          <p>{{ filterPrice(scope.row.directAmount) }}</p>
          <p class="scope-em"> ({{ scope.row.directOrderCount }}单) </p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="formDataTable.offlineFlag === 0"
        prop="indirectAmount"
        label="间接付费(单量)"
        sortable
      >
        <template slot-scope="scope">
          <p>{{ filterPrice(scope.row.indirectAmount) }}</p>
          <p class="scope-em"> ({{ scope.row.indirectOrderCount }}单) </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalAmount"
        label="总营收(单量)"
        sortable
      >
        <template slot-scope="scope">
          <div :class="(formDataTable.bizTypeActive !== 2 && formDataTable.bizTypeActive !== 3)?'blue-cls':''">
            <p>{{ filterPrice(scope.row.totalAmount) }}</p>
            <p class="scope-em"> ({{ scope.row.orderCount }}单) </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="refundAmount"
        label="总退款(单量)"
        sortable
      >
        <template slot-scope="scope">
          <div :class="(formDataTable.bizTypeActive === 2 )?'blue-cls':''">
            <p>{{ filterPrice(scope.row.refundAmount) }}</p>
            <p class="scope-em"> ({{ scope.row.refundOrderCount }}单) </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="refundRate"
        label="退款率"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.refundRate>1000?'1000%+':scope.row.refundRate+'%' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="gmv"
        label="GMV"
        sortable
      >
        <template slot-scope="scope">
          <div :class="(formDataTable.bizTypeActive === 3 )?'blue-cls':''">
            {{ filterPrice(scope.row.gmv) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="currentMonthAmount"
        label="本月营收"
      >
        <template slot-scope="scope">
          {{ filterPrice(scope.row.currentMonthAmount) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="lastMonthAmount"
        label="上月营收"
      >
        <template slot-scope="scope">
          {{ filterPrice(scope.row.lastMonthAmount) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="growthPercent"
        label="增长"
      >
        <template slot-scope="scope">
          {{ scope.row.growthPercent>1000?'1000%+':scope.row.growthPercent+'%' }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 部门  业绩 员工数据表格（展示员工） -->
    <el-table
      v-if="formDataTable.employeeDeptId && chooseType === 2 && chooseTypePart === 3"
      :header-cell-style="headerCellStyleFunc"
      :data="tableData"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      show-summary
      :summary-method="getSummaryEmployee"
    >
      <el-table-column
        prop="employeeName"
        label="个人"
      />
      <el-table-column
        prop="freePerformance"
        label="免费营收(单量)"
        sortable
      >
        <template slot-scope="scope">
          <p>{{ filterPrice(scope.row.freePerformance) }}</p>
          <p class="scope-em"> ({{ scope.row.freeOrderCount }}单) </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="directAmount"
        label="直接付费(单量)"
        sortable
      >
        <template slot-scope="scope">
          <p>{{ filterPrice(scope.row.directAmount) }}</p>
          <p class="scope-em"> ({{ scope.row.directOrderCount }}单) </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="indirectAmount"
        label="间接付费(单量)"
        sortable
      >
        <template slot-scope="scope">
          <p>{{ filterPrice(scope.row.indirectAmount) }}</p>
          <p class="scope-em"> ({{ scope.row.indirectOrderCount }}单) </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalPerformance"
        label="总业绩(单量)"
        sortable
      >
        <template slot-scope="scope">
          <p>{{ filterPrice(scope.row.totalPerformance) }}</p>
          <p class="scope-em"> ({{ scope.row.orderCount }}单) </p>
        </template>
      </el-table-column>
      <el-table-column
        prop="refundAmount"
        label="总退款(单量)"
        sortable
      >
        <template slot-scope="scope">
          <div :class="(formDataTable.bizTypeActive === 2 )?'blue-cls':''">
            <p>{{ filterPrice(scope.row.refundAmount) }}</p>
            <p class="scope-em"> ({{ scope.row.refundOrderCount }}单) </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="refundRate"
        label="退款率"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.refundRate>1000?'1000%+':scope.row.refundRate+'%' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="currentMonthPerformance"
        label="本月业绩"
      >
        <template slot-scope="scope">
          {{ filterPrice(scope.row.currentMonthPerformance) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="linkMonthPerformance"
        label="上月业绩"
      >
        <template slot-scope="scope">
          {{ filterPrice(scope.row.linkMonthPerformance) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="linkRatio"
        label="增长"
      >
        <template slot-scope="scope">
          {{ scope.row.linkRatio>1000?'1000%+':scope.row.linkRatio+'%' }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 部门  营收 达人数据表格（展示达人） -->
    <el-table
      v-if="formDataTable.employeeDeptId && chooseType === 1 && chooseTypePart === 4"
      ref="bumenYingshouDarenMentData"
      :header-cell-style="headerCellStyleFunc"
      :data="tableData"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      show-summary
      :summary-method="getSummaryDarenPart"
    >
      <el-table-column
        prop="expertName"
        label="达人"
      />
      <el-table-column
        prop="freeAmount"
        label="免费营收(单量)"
        sortable
      >
        <template slot-scope="scope">
          <span>{{ filterPrice(scope.row.freeAmount) }}</span>
          <em class="scope-em"> ({{ scope.row.freeOrderCount }}单) </em>
        </template>
      </el-table-column>
      <el-table-column
        prop="directAmount"
        label="直接付费(单量)"
        sortable
      >
        <template slot-scope="scope">
          <span>{{ filterPrice(scope.row.directAmount) }}</span>
          <em class="scope-em"> ({{ scope.row.directOrderCount }}单) </em>
        </template>
      </el-table-column>
      <el-table-column
        prop="indirectAmount"
        label="间接付费(单量)"
        sortable
      >
        <template slot-scope="scope">
          <span>{{ filterPrice(scope.row.indirectAmount) }}</span>
          <em class="scope-em"> ({{ scope.row.indirectOrderCount }}单) </em>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalAmount"
        label="总营收(单量)"
        sortable
      >
        <template slot-scope="scope">
          <div :class="formDataTable.bizTypeActive !== 3 && formDataTable.bizTypeActive !== 2 ? 'blue-cls':''">
            <span>{{ filterPrice(scope.row.totalAmount) }}</span>
            <em class="scope-em"> ({{ scope.row.orderCount }}单) </em>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="refundAmount"
        label="总退款(单量)"
        sortable
      >
        <template slot-scope="scope">
          <div :class="formDataTable.bizTypeActive === 2? 'blue-cls':''">
            <span>{{ filterPrice(scope.row.refundAmount) }}</span>
            <em class="scope-em"> ({{ scope.row.refundOrderCount }}单) </em>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="refundRate"
        label="退款率"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.refundRate>1000?'1000%+':scope.row.refundRate+'%' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="gmv"
        label="GMV"
        sortable
      >
        <template slot-scope="scope">
          <div :class="formDataTable.bizTypeActive === 3? 'blue-cls':''">
            <span>{{ filterPrice(scope.row.gmv) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="lastMonthAmount"
        label="同期"
      >
        <template slot-scope="scope">
          {{ filterPrice(scope.row.lastMonthAmount) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="growthPercent"
        label="增长"
      >
        <template slot-scope="scope">
          {{ scope.row.growthPercent>1000?'1000%+':scope.row.growthPercent+'%' }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 部门  业绩 达人数据表格（展示达人） -->
    <el-table
      v-if="formDataTable.employeeDeptId && chooseType === 2 && chooseTypePart === 4"
      :header-cell-style="headerCellStyleFunc"
      :data="tableData"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="expertName"
        label="达人"
      />
      <el-table-column
        prop="gmv"
        label="GMV"
        sortable
      >
        <template slot-scope="scope">
          <span>{{ filterPrice(scope.row.gmv) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalAmount"
        label="总营收(单量)"
        sortable
      >
        <template slot-scope="scope">
          <span>{{ filterPrice(scope.row.totalAmount) }}</span>
          <em class="scope-em"> ({{ scope.row.orderCount }}单) </em>
        </template>
      </el-table-column>
      <el-table-column
        prop="refundAmount"
        label="总退款(单量)"
        sortable
      >
        <template slot-scope="scope">
          <span>{{ filterPrice(scope.row.refundAmount) }}</span>
          <em class="scope-em"> ({{ scope.row.refundOrderCount }}单) </em>
        </template>
      </el-table-column>
      <el-table-column
        prop="refundPercent"
        label="退款率"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.refundPercent>1000?'1000%+':scope.row.refundPercent+'%' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="contemporaneousAmount"
        label="同期"
      >
        <template slot-scope="scope">
          {{ filterPrice(scope.row.contemporaneousAmount) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="increaseRate"
        label="增长"
      >
        <template slot-scope="scope">
          {{ scope.row.increaseRate>1000?'1000%+':scope.row.increaseRate+'%' }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getExpertLandscapeForPerson, // 部门数据中达人数据访问接口
  getDailyPerformanceExpert, // 部门数据中 业绩 达人数据
  getDeptLandscape, // 查询部门，营收的接口
  getDailyPerfomanceDeptData, // 查询部门，业绩的接口
  getEmployeeLandscape, // 查询员工  营收的接口
  getDailyPerfomanceDetailYj // 查询员工  业绩的接口
} from '@/api/business/onlineAndOffline.js'
import {
  deptTree
} from '@/api/addressBookApi'
import { filterPrice } from '@/utils'
export default {
  components: {
  },
  data() {
    return {
      formDataTable: {},
      chooseType: 0, // 营收还是业绩选项flag 控制调不同的接口  1、营收 2、业绩
      chooseTypePart: 0,
      tableData: [],
      deptListArray: [],
      secordDept: '',
      employeeObject: {}
    }
  },
  provide() {
  },
  mounted() {
    this.loadDeptDataTree()
  },
  created() {
  },
  methods: {
    getSummaryDarenPart() {
      const { columns, data } = params
      if (this.formDataTable.employeeDeptId && this.chooseType === 1 && this.chooseTypePart === 3) {
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计'
            return
          }
          if (column.property === 'freeAmount') {
            sums[index] = this.filterPrice(this.employeeObject.freeAmount) + '(' + this.employeeObject.freeOrderCount + '单)'
            return
          }
          if (column.property === 'directAmount') {
            sums[index] = this.filterPrice(this.employeeObject.directAmount) + '(' + this.employeeObject.directOrderCount + '单)'
            return
          }
          if (column.property === 'indirectAmount') {
            sums[index] = this.filterPrice(this.employeeObject.indirectAmount) + '(' + this.employeeObject.indirectOrderCount + '单)'
            return
          }
          if (column.property === 'totalAmount') {
            sums[index] = this.filterPrice(this.employeeObject.totalAmount) + '(' + this.employeeObject.orderCount + '单)'
            return
          }
          if (column.property === 'refundAmount') {
            sums[index] = this.filterPrice(this.employeeObject.refundAmount) + '(' + this.employeeObject.refundOrderCount + '单)'
            return
          }
          if (column.property === 'gmv') {
            sums[index] = this.filterPrice(this.employeeObject.gmv)
            return
          }
          if (column.property === 'currentMonthAmount') {
            sums[index] = this.filterPrice(this.employeeObject.currentMonthAmount)
            return
          }
          if (column.property === 'lastMonthAmount') {
            sums[index] = this.filterPrice(this.employeeObject.lastMonthAmount)
            return
          }
          if (column.property === 'refundRate') {
            sums[index] = this.employeeObject.refundRate > 1000 ? '1000%+' : this.employeeObject.refundRate + '%'
            return
          }
          if (column.property === 'growthPercent') {
            sums[index] = this.employeeObject.growthPercent > 1000 ? '1000%+' : this.employeeObject.growthPercent + '%'
            return
          }
        })
        return sums
      }
    },
    getSummaryEmployee(params) {
      const { columns, data } = params
      if (this.formDataTable.employeeDeptId && this.chooseType === 1 && this.chooseTypePart === 3) {
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计'
            return
          }
          if (column.property === 'freeAmount') {
            sums[index] = this.filterPrice(this.employeeObject.freeAmount) + '(' + this.employeeObject.freeOrderCount + '单)'
            return
          }
          if (column.property === 'directAmount') {
            sums[index] = this.filterPrice(this.employeeObject.directAmount) + '(' + this.employeeObject.directOrderCount + '单)'
            return
          }
          if (column.property === 'indirectAmount') {
            sums[index] = this.filterPrice(this.employeeObject.indirectAmount) + '(' + this.employeeObject.indirectOrderCount + '单)'
            return
          }
          if (column.property === 'totalAmount') {
            sums[index] = this.filterPrice(this.employeeObject.totalAmount) + '(' + this.employeeObject.orderCount + '单)'
            return
          }
          if (column.property === 'refundAmount') {
            sums[index] = this.filterPrice(this.employeeObject.refundAmount) + '(' + this.employeeObject.refundOrderCount + '单)'
            return
          }
          if (column.property === 'gmv') {
            sums[index] = this.filterPrice(this.employeeObject.gmv)
            return
          }
          if (column.property === 'currentMonthAmount') {
            sums[index] = this.filterPrice(this.employeeObject.currentMonthAmount)
            return
          }
          if (column.property === 'lastMonthAmount') {
            sums[index] = this.filterPrice(this.employeeObject.lastMonthAmount)
            return
          }
          if (column.property === 'refundRate') {
            sums[index] = this.employeeObject.refundRate > 1000 ? '1000%+' : this.employeeObject.refundRate + '%'
            return
          }
          if (column.property === 'growthPercent') {
            sums[index] = this.employeeObject.growthPercent > 1000 ? '1000%+' : this.employeeObject.growthPercent + '%'
            return
          }
        })
        return sums
      }
    },
    getSummaryPartYji(params) {
      const { columns, data } = params
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        if (column.property === 'freePerformance') {
          sums[index] = this.filterPrice(this.employeeObject.freePerformance) + '(单)'
          return
        }
        if (column.property === 'directAmount') {
          sums[index] = this.filterPrice(this.employeeObject.directAmount) + '(' + this.employeeObject.directOrderCount + '单)'
          return
        }
        if (column.property === 'indirectAmount') {
          sums[index] = this.filterPrice(this.employeeObject.indirectAmount) + '(' + this.employeeObject.indirectOrderCount + '单)'
          return
        }
        if (column.property === 'totalPerformance') {
          sums[index] = this.filterPrice(this.employeeObject.totalPerformance)
          return
        }
        if (column.property === 'currentPerformance') {
          sums[index] = this.filterPrice(this.employeeObject.currentPerformance)
          return
        }
        if (column.property === 'linkPerformance') {
          sums[index] = this.filterPrice(this.employeeObject.linkPerformance)
          return
        }
        if (column.property === 'refundPercent') {
          sums[index] = this.employeeObject.refundPercent > 1000 ? '1000%+' : this.employeeObject.refundPercent + '%'
          return
        }
        if (column.property === 'linkRatio') {
          sums[index] = this.employeeObject.linkRatio > 1000 ? '1000%+' : this.employeeObject.linkRatio + '%'
          return
        }
      })
      return sums
    },
    getSummaryPart(params) {
      const { columns, data } = params
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        if (column.property === 'freeRevenue') {
          sums[index] = this.filterPrice(this.employeeObject.freeRevenue) + '(' + this.employeeObject.freeOrderCount + '单)'
          return
        }
        if (column.property === 'directAmount') {
          sums[index] = this.filterPrice(this.employeeObject.directAmount) + '(' + this.employeeObject.directOrderCount + '单)'
          return
        }
        if (column.property === 'indirectAmount') {
          sums[index] = this.filterPrice(this.employeeObject.indirectAmount) + '(' + this.employeeObject.indirectOrderCount + '单)'
          return
        }
        if (column.property === 'revenue') {
          sums[index] = this.filterPrice(this.employeeObject.revenue) + '(' + this.employeeObject.revenueOrderCount + '单)'
          return
        }
        if (column.property === 'refundAmount') {
          sums[index] = this.filterPrice(this.employeeObject.refundAmount) + '(' + this.employeeObject.refundOrderCount + '单)'
          return
        }
        if (column.property === 'gmv') {
          sums[index] = this.filterPrice(this.employeeObject.gmv)
          return
        }
        if (column.property === 'amount') {
          sums[index] = this.filterPrice(this.employeeObject.amount)
          return
        }
        if (column.property === 'linkAmount') {
          sums[index] = this.filterPrice(this.employeeObject.linkAmount)
          return
        }
        if (column.property === 'refundPercent') {
          sums[index] = this.employeeObject.refundPercent > 1000 ? '1000%+' : this.employeeObject.refundPercent + '%'
          return
        }
        if (column.property === 'amountLinkRatio') {
          sums[index] = this.employeeObject.amountLinkRatio > 1000 ? '1000%+' : this.employeeObject.amountLinkRatio + '%'
          return
        }
      })
      return sums
    },
    getSummary(params) {
      const { columns, data } = params
      if (this.formDataTable.employeeDeptId && this.chooseType === 1 && this.chooseTypePart === 3) {
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计'
            return
          }
          if (column.property === 'freeAmount') {
            sums[index] = this.filterPrice(this.employeeObject.freeAmount) + '(' + this.employeeObject.freeOrderCount + '单)'
            return
          }
          if (column.property === 'directAmount') {
            sums[index] = this.filterPrice(this.employeeObject.directAmount) + '(' + this.employeeObject.directOrderCount + '单)'
            return
          }
          if (column.property === 'indirectAmount') {
            sums[index] = this.filterPrice(this.employeeObject.indirectAmount) + '(' + this.employeeObject.indirectOrderCount + '单)'
            return
          }
          if (column.property === 'totalAmount') {
            sums[index] = this.filterPrice(this.employeeObject.totalAmount) + '(' + this.employeeObject.orderCount + '单)'
            return
          }
          if (column.property === 'refundAmount') {
            sums[index] = this.filterPrice(this.employeeObject.refundAmount) + '(' + this.employeeObject.refundOrderCount + '单)'
            return
          }
          if (column.property === 'gmv') {
            sums[index] = this.filterPrice(this.employeeObject.gmv)
            return
          }
          if (column.property === 'currentMonthAmount') {
            sums[index] = this.filterPrice(this.employeeObject.currentMonthAmount)
            return
          }
          if (column.property === 'lastMonthAmount') {
            sums[index] = this.filterPrice(this.employeeObject.lastMonthAmount)
            return
          }
          if (column.property === 'refundRate') {
            sums[index] = this.employeeObject.refundRate > 1000 ? '1000%+' : this.employeeObject.refundRate + '%'
            return
          }
          if (column.property === 'growthPercent') {
            sums[index] = this.employeeObject.growthPercent > 1000 ? '1000%+' : this.employeeObject.growthPercent + '%'
            return
          }
        })
        return sums
      }
    },
    headerCellStyleFunc({ row, column, rowIndex, columnIndex }) {
      if (this.formDataTable.bizTypeActive === 3 && (column.property === 'gmv' || column.property === 'totalPerformance')) {
        return {
          background: '#EFF2F6',
          padding: '9px 0',
          color: '#0091ff',
          'font-weight': 700,
          'letter-spacing': '1px'
        }
      } else if (this.formDataTable.bizTypeActive === 2 && column.property === 'refundAmount') {
        return {
          background: '#EFF2F6',
          padding: '9px 0',
          color: '#0091ff',
          'font-weight': 700,
          'letter-spacing': '1px'
        }
      } else if ((this.formDataTable.bizTypeActive !== 3 && this.formDataTable.bizTypeActive !== 2) && (column.property === 'revenue' || column.property === 'totalAmount' || column.property === 'totalPerformance')) {
        return {
          background: '#EFF2F6',
          padding: '9px 0',
          color: '#0091ff',
          'font-weight': 700,
          'letter-spacing': '1px'
        }
      } else {
        return {
          background: '#EFF2F6',
          padding: '9px 0',
          color: '#333',
          'font-weight': 700,
          'letter-spacing': '1px'
        }
      }
    },
    rowClassName({ row }) {
      if (!row.hasChildren) {
        return 'no-expand'
      }
      return ''
    },
    toDepartMent(row) {
      this.$emit('changeDeptMent', row, this.formDataTable.chooseType)
    },
    filterPrice,
    getRowKey(row) {
      // 根据业务逻辑动态生成 row-key
      if (row.deptId) {
        return row.deptId
      } else {
        return row.deptName // 作为最后的备用方案
      }
    },
    hanlderData(arr) {
      if (this.formDataTable.employeeDeptId && this.chooseType === 1 && this.chooseTypePart === 3) {
        this.$refs.bumenYingshouYuangongMentData.clearSort()
        this.tableData = []
        arr.some(item => {
          if (item.employeeName === '总计') {
            this.employeeObject = item
          }
        })
        const filteredData = arr.filter(item => item.employeeName !== '总计')
        this.tableData = filteredData
      } else if (!this.formDataTable.employeeDeptId && this.chooseType === 1) {
        this.$refs.qiyeYingshouDepartMentData.clearSort()
        this.tableData = []
        arr.some(item => {
          if (item.deptName === '总计') {
            this.employeeObject = item
          }
        })
        const filteredData = arr.filter(item => item.deptName !== '总计')
        this.tableData = filteredData
      } else if (!this.formDataTable.employeeDeptId && this.chooseType === 2) {
        this.$refs.qiyeYejiDepartMentData.clearSort()
        this.tableData = []
        arr.some(item => {
          if (item.deptName === '总计') {
            this.employeeObject = item
          }
        })
        const filteredData = arr.filter(item => item.deptName !== '总计')
        this.tableData = filteredData
      } else if (this.formDataTable.employeeDeptId && this.chooseType === 2 && this.chooseTypePart === 3) {
        arr.some(item => {
          if (item.employeeName === '总计') {
            this.employeeObject = item
          }
        })
        const filteredData = arr.filter(item => item.employeeName !== '总计')
        this.tableData = filteredData
      } else if (this.formDataTable.employeeDeptId && this.chooseType === 1 && this.chooseTypePart === 4) {
        this.$refs.bumenYingshouDarenMentData.clearSort()
        this.tableData = []
        arr.some(item => {
          if (item.expertName === '总计') {
            this.employeeObject = item
          }
        })
        const filteredData = arr.filter(item => item.expertName !== '总计')
        this.tableData = filteredData
      } else {
        this.tableData = arr
      }
      if (this.formDataTable.bizTypeActive === 3) {
        this.tableData.sort((a, b) => b.gmv - a.gmv)
      } else if (this.formDataTable.bizTypeActive === 2) {
        this.tableData.sort((a, b) => b.refundAmount - a.refundAmount)
      } else {
        this.tableData.sort((a, b) => b.totalAmount - a.totalAmount)
      }
      if (this.chooseType === 2) {
        this.tableData.sort((a, b) => b.totalPerformance - a.totalPerformance)
      }

      this.tableData.some(item => {
        if (item.hasSubDepartment) {
          item.hasChildren = true
        } else {
          item.hasChildren = false
        }
      })
    },
    returnParams() {
      const item = this.formDataTable
      const params = {}
      params.bizType = item.bizTypeActive
      if (item.employeeDeptId) {
        params.employeeDeptId = item.employeeDeptId
      }
      if (item.employeeSecondDeptId) {
        params.employeeSecondDeptId = item.employeeSecondDeptId
      }
      if (item.employeeUid) {
        params.employeeUid = item.employeeUid
      }
      if (item.offlineFlag || item.offlineFlag === 0) {
        params.offlineFlag = item.offlineFlag
      }
      if (item.itemIdList && item.itemIdList.length > 0) {
        params.itemIdList = item.itemIdList
      }
      if (item.orderChannel && item.orderChannel.length > 0) {
        params.orderChannel = item.orderChannel[0]
      }
      if (item.orderChannel && item.orderChannel.length > 1) {
        params.shopId = item.orderChannel[1]
      }
      if ((item.productCategory && item.productCategory !== 999) || item.productCategory === 0) {
        params.productCategory = item.productCategory
      }
      if (item.teacherIdList && item.teacherIdList.length > 0) {
        params.teacherIdList = item.teacherIdList
      }
      params.timeType = item.time.active
      params.startTime = item.time.time[0]
      params.endTime = item.time.time[1]
      return params
    },
    init(item, type, typePart) {
      this.formDataTable = item
      this.chooseType = type
      this.chooseTypePart = typePart
      const params = this.returnParams()
      if (item.employeeDeptId) {
        // 有部门  查询员工
        if (type === 1) {
          if (typePart === 3) {
            // 查询营收
            getEmployeeLandscape(params).then(res => {
              if (res.code === 1 && res.data) {
                this.hanlderData(res.data)
              }
            })
          }
          if (typePart === 4) {
            // 营收达人数据
            getExpertLandscapeForPerson(params).then(res => {
              if (res.code === 1 && res.data) {
                this.hanlderData(res.data)
              }
            })
          }
        } else if (type === 2) {
          if (typePart === 3) {
            // 查询业绩
            getDailyPerfomanceDetailYj(params).then(res => {
              if (res.code === 1 && res.data) {
                this.hanlderData(res.data)
              }
            })
          }
          if (type === 4) {
            // 业绩达人数据
            getDailyPerformanceExpert(params).then(res => {
              if (res.code === 1 && res.data) {
                this.hanlderData(res.data)
              }
            })
          }
        }
      } else {
        // 无部门是企业的方式查询
        if (type === 1) {
          // 查询营收
          getDeptLandscape(params).then(res => {
            if (res.code === 1 && res.data) {
              this.hanlderData(res.data)
            }
          })
        } else if (type === 2) {
          // 查询业绩
          getDailyPerfomanceDeptData(params).then(res => {
            if (res.code === 1 && res.data) {
              this.hanlderData(res.data)
            }
          })
        }
      }
    },
    loadDeptDataTree() {
      deptTree({}).then(res => {
        if (res.code === 1) {
          if (res && res.data && res.data.length > 0) {
            const arr = res.data.reduce((pre, next) => {
              pre.push({ label: next.label, id: next.id, children: next.children })
              return pre
            }, [])
            this.deptListArray = arr
          }
        }
      })
    },
    findSecordDepartMentId(arr, val) {
      let flag = false
      arr.some(item => {
        if (item.id === val) {
          let secordDept = ''
          const ancestorsArr = item.ancestors.split(',')
          if (ancestorsArr && ancestorsArr.length >= 3) {
            secordDept = ancestorsArr[2]
          } else {
            secordDept = val
          }
          flag = true
          this.secordDept = secordDept
          return false
        } else if (item.children && !flag) {
          this.findSecordDepartMentId(item.children, val)
        }
      })
    },
    load(tree, treeNode, resolve) {
      if (tree.hasChildren) {
        this.findSecordDepartMentId(this.deptListArray, tree.deptId)
        const params = this.returnParams()
        params.employeeDeptId = tree.deptId
        params.employeeSecondDeptId = this.secordDept
        const children = []
        getDeptLandscape(params).then(res => {
          if (res.code === 1 && res.data) {
            res.data.some(objDept => {
              if (objDept.deptName !== '总计') {
                objDept.hasChildren = objDept.hasSubDepartment
                children.push(objDept)
              }
            })
            tree.children = children
            resolve(children)
          }
        })
      } else {
        resolve([])
      }

      // resolve([])
    },
    toUserInfoDetail(row) {
      this.$router.push({ path: '/business/onlineAndOfflinePerson', query: {
        employeeId: row.employeeUid,
        employeeDeptId: this.formDataTable.employeeDeptId,
        employeeSecondDeptId: this.formDataTable.employeeSecondDeptId,
        timeActive: this.formDataTable.time.active,
        startTime: this.formDataTable.time.time[0],
        endTime: this.formDataTable.time.time[1]
      } })
    }
  }
}
</script>

  <style lang="scss" scoped>
  .wrapper-online-data-table {
      width: 100%;
      margin-top: 20px;
      ::v-deep .el-table .no-expand .el-table__expand-icon {
        display: none;
      }
  }
  .scope-em {
    font-style: normal;
  }
  .blue-cls {
    color: #0091FF;
    cursor: pointer;
  }

  .active-cls {
    color: #0091ff;
  }
  .blue-cls {
    color: #0091ff;
  }
  .width-cls-zw {
    width: 25px;
    height: 30px;
    float: left;
  }
  </style>
