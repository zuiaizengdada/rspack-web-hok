<template>
  <div class="page_wrap">
    <filterTop :loading="loading" :search="search" @searchFn="searchFn" />
    <el-table
      v-loading="loading"
      :data="tableData.records"
      style="width: 100%"
      height="1200"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
    >
      <el-table-column prop="assistantName" label="助教名称" width="150">
        <template slot-scope="{ row }">
          {{ row.assistantName || '未分配助教' }}
        </template>
      </el-table-column>
      <el-table-column prop="studentsNum" label="学员数" width="150">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            :disabled="!row.studentsNum"
            @click.native.prevent="handleRow(row, '')"
          >
            {{ row.studentsNum }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="交付状态">
        <el-table-column prop="toDeliveredNum" label="待交付学员数">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              :disabled="!row.toDeliveredNum"
              @click.native.prevent="handleRow(row, '待交付')"
            >
              {{ row.toDeliveredNum }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryInNum" label="交付中学员数">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              :disabled="!row.deliveryInNum"
              size="small"
              @click.native.prevent="handleRow(row, '交付中')"
            >
              {{ row.deliveryInNum }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="delayedDeliveryNum" label="延期交付学员数">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              :disabled="!row.delayedDeliveryNum"
              @click.native.prevent="handleRow(row, '延期交付')"
            >
              {{ row.delayedDeliveryNum }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="lockDeliveryNum" label="锁定交付学员数">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              :disabled="!row.lockDeliveryNum"
              @click.native.prevent="handleRow(row, '锁定交付')"
            >
              {{ row.lockDeliveryNum }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="deliveredNum" label="已交付学员数">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              :disabled="!row.deliveredNum"
              @click.native.prevent="handleRow(row, '已交付')"
            >
              {{ row.deliveredNum }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="closedNum" label="已关闭学员数">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              :disabled="!row.closedNum"
              @click.native.prevent="handleRow(row, '已关闭')"
            >
              {{ row.closedNum }}
            </el-button>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="入班情况">
        <el-table-column prop="enrollmentNum" label="入班学员数">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              :disabled="!row.enrollmentNum"
              @click.native.prevent="handleRow(row, '', 3)"
            >
              {{ row.enrollmentNum }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column prop="unEnrollmentNum" label="未入班学员数">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              :disabled="!row.unEnrollmentNum"
              @click.native.prevent="handleRow(row, '', 4)"
            >
              {{ row.unEnrollmentNum }}
            </el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
      class="paginationBox"
      :current-page="pageData.current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageData.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="+tableData.total || 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <StudentDrawer :visible.sync="visible" :param="param" />
  </div>
</template>

<script>
import { getDeliveryAssistant } from '@/api/deliver/followUp'
import StudentDrawer from './components/StudentDrawer.vue'
import { mapGetters } from 'vuex'
import filterTop from './filterTop'
export default {
  components: {
    filterTop,
    StudentDrawer
  },
  data() {
    return {
      param: {},
      visible: false,
      pageData: {
        size: 10,
        current: 1
      },
      search: {
        goodsName: [],
        goodsId: [],
        goods: [],
        goodsIdList: [], // 课程
        assistantName: '', // 助教姓名
        channelSourceList: [], // 渠道来源
        allocateTime: [], // 分配日期
        orderCreateTime: [] // 订单截至日期
      },
      loading: false,
      tableData: ''
    }
  },

  computed: {
    ...mapGetters(['dictList'])
  },
  mounted() {
    this.$uweb && this.$uweb.setAction('Event_AllocationSummary_page')
  },
  methods: {
    async getDeliveryAssistant() {
      this.loading = true
      const search = {
        goodsIdList: this.search.goodsId?.join(',') || '', // 课程
        assistantName: this.search.assistantName || '', // 助教姓名
        channelSourceList: this.search.channelSourceList?.join(',') || '', // 渠道来源
        allocateTimeStart: this.search?.allocateTime?.length
          ? this.search.allocateTime[0]
          : '',
        allocateTimeEnd: this.search?.allocateTime?.length
          ? this.search.allocateTime[1]
          : '',
        orderCreateTimeStart: this.search?.orderCreateTime?.length
          ? this.search.orderCreateTime[0]
          : '',
        orderCreateTimeEnd: this.search?.orderCreateTime?.length
          ? this.search.orderCreateTime[1]
          : ''
      }
      try {
        const res = await getDeliveryAssistant({ ...search, ...this.pageData })
        if (res.code === 1 && res.data) {
          this.tableData = res.data
        }
        this.loading = false
      } catch {
        this.loading = false
      }
    },

    // 点击数量
    handleRow(row, name, notInScheduleStatus) {
      console.log(row)
      const deliveryStatus = this.dictList?.DELIVERY_STATUS.find(
        item => item.label === name
      )?.value
      // 获取search缓存 数据
      const initSearchData = this.$getPageSearch()
      this.param = {
        deliveryStatus,
        assistantUserName: row.assistantName || '未分配助教',
        notInScheduleStatus,
        allocateTimeStart:
          initSearchData?.allocateTime && initSearchData?.allocateTime[0],
        allocateTimeEnd:
          initSearchData?.allocateTime && initSearchData?.allocateTime[1],
        orderCreateTimeStart:
          initSearchData?.orderCreateTime && initSearchData?.orderCreateTime[0],
        orderCreateTimeEnd:
          initSearchData?.orderCreateTime && initSearchData?.orderCreateTime[1],
        goodsIdList: initSearchData?.goodsId || [],
        channelSourceList: initSearchData?.channelSourceList?.join(',')
      }
      this.visible = true
    },
    // 查询
    searchFn(data) {
      this.pageData = {
        size: 10,
        current: 1
      }
      this.search = data
      this.getDeliveryAssistant()
    },
    // 分页
    handleSizeChange(value) {
      this.pageData.size = value
      this.getDeliveryAssistant()
    },
    // 分页
    handleCurrentChange(value) {
      this.pageData.current = value
      this.getDeliveryAssistant()
    }
  }
}
</script>
<style lang="scss" scoped>
.page_wrap {
  height: calc(100vh - 90px);
  padding: 0 20px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;

  .paginationBox {
    display: flex;
    justify-content: flex-end;
    margin: 20px 0;
  }
}
</style>
