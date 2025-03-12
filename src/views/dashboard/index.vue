<template>
  <div class="home_page">
    <div class="page_header_title">实时状况</div>

    <el-row v-loading="loading1" :gutter="20">
      <el-col :span="12">
        <div class="page_header_col_box homebg1">
          <div class="fl w-100p data-overview-item">
            <div class="data-overview-item__title">今日活跃用户</div>
            <div class="data-overview-item__num b_c_CF1">341</div>
          </div>
          <div class="fl w-100p m-t-50 data-overview-content">
            <div class="w-184">
              <div class="data-overview-item__title">今日新增用户</div>
              <div class="f_24 b_c_CF1 m-t-10">37</div>
            </div>
            <div class="w-184">
              <div class="data-overview-item__title">累计用户</div>
              <div class="f_24 b_c_CF1 m-t-10">117,538</div>
            </div>
            <div class="w-184">
              <div class="data-overview-item__title">累计支付人数</div>
              <div class="f_24 b_c_CF1 m-t-10">56,235 </div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="page_header_col_box homebg2">
          <div class="fl w-100p data-overview-item">
            <div class="data-overview-item__title">今日活跃用户</div>
            <div class="data-overview-item__num b_c_F18">341</div>
          </div>
          <div class="fl w-100p m-t-50 data-overview-content">
            <div class="w-184">
              <div class="data-overview-item__title">今日订单数</div>
              <div class="f_24 b_c_F18 m-t-10">15</div>
            </div>
            <div class="w-184">
              <div class="data-overview-item__title">累计支付金额</div>
              <div class="f_24 b_c_F18 m-t-10">5117538.56</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="m-t-20 course-container">
      <div class="course-container_header">
        <div class="header_title">商品排行</div>
        <!-- <div>
          时间筛选
          <el-select></el-select>

        </div> -->
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="billboard">
            <div class="billboard_title">支付榜TOP5商品</div>
            <div class="m-t-10">
              <el-table
                v-loading="loading2"
                :data="tableData"
                style="width: 100%"
                :header-cell-style="{background: '#f5f5f5'}"
              >
                <el-table-column
                  prop="date"
                  label="排名"
                  width="180"
                />
                <el-table-column
                  prop="name"
                  label="商品名称"
                  width="180"
                />
                <el-table-column
                  prop="address"
                  label="支付人数"
                />
                <el-table-column
                  prop="address"
                  label="支付金额"
                />
              </el-table>
            </div>
          </div>
        </el-col>
        <!-- <el-col :span="12" /> -->
      </el-row>
    </div>
  </div>
</template>

<script>
import { homepayTop, homeList } from '@/api/home'
export default {
  name: 'Dashboard',
  data() {
    return {
      loading: false,
      search: '',
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'tenantName', 'managerName', 'status'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'name', label: '课程名称', type: 'text' },
          { prop: 'pv', label: '访问次数', type: 'slot', width: '240' },
          { prop: 'subscription', label: '订阅量', type: 'slot', width: '240' },
          { prop: 'studyMunber', label: '学习人数', type: 'slot', width: '240' },
          { prop: 'action', label: '操作', type: 'slot', width: '120' }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      tableData: [],
      loading2: false,
      loading1: false
    }
  },
  created() {
    // console.log(this.$route)
    this.init()
  },
  methods: {
    init() {
      this.getTop()
      this.getHomeList()
    },
    getTop() {
      this.loading2 = true
      homepayTop().then(res => {
        console.log('支付榜单', res)
        this.loading2 = false
      }).catch(() => {
        this.loading2 = false
      })
    },
    getHomeList() {
      this.loading1 = true
      homeList().then(res => {
        console.log(res, '首页数据')
        this.loading1 = false
      }).catch(() => {
        this.loading1 = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.home_page {
  // background: #EEEEEE;
  height: 100%;
  .page_header_title {
    font-size: 20px;
    font-weight: bold;
    color: rgba(51, 51, 51, 0.9);
    line-height: 28px;
    margin-bottom: 10px;
  }

  .page_header_col_box {
    background: #fff;
    height: 182px;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    .data-overview-content {

    }
  }
  .homebg1 {
    position: relative;
    overflow: hidden;
    &::before {
      position: absolute;
      top: 10px;
      left: -4px;
      content: '';
      width: 8px;
      border-radius: 8px;
      height: 162px;
      background: #498CF1;
    }
  }
  .homebg2 {
    position: relative;
    overflow: hidden;
    &::before {
      position: absolute;
      top: 10px;
      left: -4px;
      content: '';
      width: 8px;
      border-radius: 8px;
      height: 162px;
      background: #F18649;
    }
  }

  .data-overview-item {
    .data-overview-item__title {
      display: flex;
      align-items:flex-end;
      font-size: 16px;
      color: rgba(51, 51, 51, 0.9);
      line-height: 24px;
      margin-right: 10px;
    }
    .data-overview-item__num {
      font-size: 36px;
      font-weight: bold;
      line-height: 36px;
    }
  }

  .course-container {
    padding: 22px 10px;
    background: #fff;
    border-radius: 4px;
    .course-container_header {
      .header_title {
        font-size: 20px;
        font-weight: bold;
        color: rgba(51, 51, 51, 0.9);
        line-height: 28px;
      }
    }
    .billboard {
      margin-top: 12px;
      .billboard_title {
        font-size: 16px;
        color: rgba(51, 51, 51, 0.9);
        line-height: 24px;
      }
    }
  }
}
.b_c_CF1 {
  font-weight: bold;
  color: #498CF1;
}
.b_c_F18 {
  font-weight: bold;
  color: #F18649;
}
.f_24 {
  font-size: 24px;
}
.w-184 {
  width: 184px;
}
</style>
