<template>
  <div class="page_wrap">
    <div class="seachHeader">
      <filterTop :search="search" :type="queryType" @search="searchFn" />
    </div>
    <div class="m-t-20 table_module">
      <el-table v-loading="loading" style="width: 100%" :data="tableData" border>
        <el-table-column label="用户" min-width="200px">
          <template slot-scope="{ row }">
            <div class="table-name">
              <AppAvatar :avatar="row.headImg" :name="row.realName" :no-name="true" width="40" />
              <span>{{ row.realName || row.userName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="订单号" />
        <el-table-column prop="phone" label="用户手机" />
        <!-- <el-table-column prop="userStatus" label="订单激活">
          <template slot-scope="{ row }">
            <template v-if="row.activateFlag">已激活</template>
            <template v-else>未激活</template>
          </template>
        </el-table-column> -->
        <el-table-column prop="wechatFlag" label="添加企微">
          <template slot-scope="{ row }">
            <el-tooltip
              class="item"
              effect="dark"
              :content="row.autoFlag === 1 ? '系统添加,已点亮' : '系统添加,未点亮'"
              placement="top-start"
            >
              <svg-icon v-if="!row.autoFlag" icon-class="qywx_zidong_n" style="font-size: 20px" class="m-r-10" />
              <svg-icon v-else icon-class="qywx_zidong_s" style="font-size: 20px" class="m-r-10" />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="row.manualFlag === 2 ? '手动添加已点亮,可点击取消' : '手动添加未点亮，可点击点亮'"
              placement="top-start"
            >
              <svg-icon
                v-if="row.manualFlag === 1"
                icon-class="qywx_shou_n"
                style="font-size: 20px"
                class="a_link"
                @click="addWxuser(row)"
              />
              <svg-icon
                v-else
                icon-class="qywx_shou_s"
                style="font-size: 20px"
                class="a_link"
                @click="cancelWxuser(row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="delayPeriodNum" label="是否延期">
          <template slot-scope="{ row }">
            <template v-if="!row.delayPeriodNum"> 未延期 </template>
            <template v-else-if="row.delayPeriodNum > -1"> 延期到{{ row.delayPeriodNum }}期 </template>
            <template v-else>已失效</template>
          </template>
        </el-table-column>
        <el-table-column prop="afterSaleStatus" label="订单售后状态">
          <template slot-scope="{ row }">
            {{ { 1: '可申请', 2: '申请中', 3: '已完成', 4: '用户关闭', 5: '超时关闭' }[row.afterSaleStatus] }}
          </template>
        </el-table-column>
        <el-table-column prop="questionnaireAnswerFlag" label="填写问卷">
          <template slot-scope="{ row }">
            {{ { 0: '未填写', 1: '已填写' }[row.questionnaireAnswerFlag] }}
          </template>
        </el-table-column>
        <el-table-column prop="teacherName" label="班主任" />
        <el-table-column prop="orderCreateTime" label="订单支付时间">
          <template slot-scope="{ row }">
            {{ row.orderCreateTime | parseTime }}
          </template>
        </el-table-column>
      </el-table>
      <div class="m-t-20 table_footer">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import filterTop from './filterTop.vue'
import { getUserLiveList, manualUpdate } from '@/api/privateArea/class'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
export default {
  components: {
    filterTop,
    AppAvatar
  },
  data() {
    return {
      queryType: 2, // 1或者空查询全部,2部门3我的
      loading: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      teacherList: [],
      search: {
        teacher: '',
        goods: { contentName: '' },
        period: { id: '', periodNum: '' }
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    // pageSize改变触发
    handleSizeChange(val) {
      console.log(val)
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val
      this.getList()
    },
    searchFn(res) {
      this.search = res
      this.currentPage = 1
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        current: this.currentPage,
        goodsId: this.search.goods.goodsId,
        periodNum: this.search.period.periodNum,
        size: this.pageSize,
        teacherId: this.search.teacher,
        queryType: this.queryType
      }
      getUserLiveList(params)
        .then((res) => {
          console.log(res, '获取全部班级列表数据')
          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    addWxuser(row) {
      console.log('点击添加', row)
      this.loading = true
      const data = {
        manualFlag: 2, // 1: 不是 ,2: 是
        sysUserId: row.teacherUserId,
        userId: row.userId
      }
      manualUpdate(data)
        .then((res) => {
          this.$notify.success({
            title: '提示',
            message: '操作成功'
          })
          this.loading = false
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
      // addWxuser(row.userId)
      //   .then((res) => {
      //     this.$notify.success({
      //       title: '提示',
      //       message: '操作成功'
      //     })
      //     this.loading = false
      //     this.getList()
      //   })
      //   .catch(() => {
      //     this.loading = false
      //   })
    },
    cancelWxuser(row) {
      console.log('点击取消', row)
      this.loading = true
      const data = {
        manualFlag: 1, // 1: 不是 ,2: 是
        sysUserId: row.teacherUserId,
        userId: row.userId
      }
      manualUpdate(data)
        .then((res) => {
          this.$notify.success({
            title: '提示',
            message: '操作成功'
          })
          this.loading = false
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
      // cancelWxuser(row.userId)
      //   .then((res) => {
      //     this.$notify.success({
      //       title: '提示',
      //       message: '操作成功'
      //     })
      //     this.loading = false
      //     this.getList()
      //   })
      //   .catch(() => {
      //     this.loading = false
      //   })
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  // height;
  // padding: 10px;
  .seachHeader {
    padding: 10px;
    background: #fff;
  }
  .table_module {
    padding: 10px;
    background: #fff;
    .table_footer {
      display: flex;
      justify-content: flex-end;
    }
  }
}
.table-name {
  display: flex;
  align-items: center;
  span {
    margin-left: 10px;
  }
}
</style>
