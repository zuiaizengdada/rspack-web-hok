<template>
  <MCard class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :slot-arr="slotArr"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="search">
        <filterTop
          :search="search"
          :live-channel="liveChannel"
          @onSearch="onSearchFn"
          @onClear="onClear"
          @onAdd="onhandleAdd"
        />
      </template>
      <template slot="liveUrl" slot-scope="scope">
        <div
          style="width: 100px; height: 60px; cursor: pointer; overflow: hidden"
          @click="showImg(scope.row)"
        >
          <img class="img-cls-slt" :src="scope.row.liveUrl" />
        </div>
      </template>
      <template slot="liveAccount" slot-scope="scope">
        <img
          style="
            width: 18px;
            height: 18px;
            border-radius: 100%;
            display: inline-block;
            margin-right: 3px;
          "
          :src="returnImgSrc(scope.row.liveChannel)"
        />
        <span>{{ scope.row.liveAccount }}</span>
      </template>
      <template slot="payForData" slot-scope="scope">
        <el-button type="text" @click="toDetail(scope.row)">查看</el-button>
      </template>
      <template slot="action" slot-scope="scope">
        <el-button type="text" @click="onhandleCopy(scope.row)">复制</el-button>
        <el-button type="text" @click="onhandleEdit(scope.row)">编辑</el-button>
        <el-button type="text" class="c_red" @click="onhandleDel(scope.row)">
          删除
        </el-button>
      </template>
      <template slot="liveChannel" slot-scope="{ row }">
        <div class="expertChannel">
          <svg-icon
            class-name="expertChannelicon"
            :icon-class="
              getOptionsValueByKey(
                'value',
                'icon',
                row.liveChannel,
                liveChannel
              )
            "
          />
          {{
            getOptionsValueByKey('value', 'label', row.liveChannel, liveChannel)
          }}
        </div>
      </template>
      <div slot="gmv" slot-scope="scope">
        <p>{{ returnNumber(scope.row.gmv) }}</p>
      </div>
      <div slot="revenue" slot-scope="scope">
        <p>{{ returnNumber(scope.row.revenue) }}</p>
      </div>
      <div slot="refundAmount" slot-scope="scope">
        <p>{{ returnNumber(scope.row.refundAmount) }}</p>
      </div>
      <template slot="liveType" slot-scope="{ row }">
        <div class="liveType" :class="`liveType${row.liveType}`">
          <i :class="`liveTypeImg${row.liveType}`" />
          <p>{{ liveTypeOption[row.liveType] }}</p>
        </div>
      </template>
    </MPageLayout>

    <!-- 弹框层 -->
    <addDialog
      :config="addConfig"
      :live-channel="liveChannel"
      @success="closeAddDialog"
    />
    <div v-if="imageMaskFlag" class="img-mask" @click="imageMaskFlag = false">
      <img :src="nowShowImg" />
    </div>
    <payDataDialog ref="payDataDialog" />
  </MCard>
</template>

<script>
import filterTop from './filterTop.vue'
import addDialog from './components/addDialog.vue'
import payDataDialog from '@/views/business/liveScheduling/components/payDataDialog'
import { getColumns, liveTypeOption } from './columns'
import { getOptionsValueByKey } from '@/filters/index.js'
import {
  getLiveSchedulePage,
  liveScheduleDel,
  searchExpertChannelEnums
} from '@/api/order/performanceShare'
export default {
  components: {
    filterTop,
    addDialog,
    payDataDialog
  },
  data() {
    return {
      imageMaskFlag: false,
      nowShowImg: '',
      liveTypeOption,
      slotArr: [
        'action',
        'search',
        'payForData',
        'footer',
        'gmv',
        'revenue',
        'refundAmount',
        'liveChannel',
        'liveAccount',
        'liveType',
        'liveUrl'
      ],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        liveId: '',
        liveTime: ['', ''],
        liveType: '',
        liveChannel: '',
        liveAccount: { name: '', id: '' },
        user: { name: '', id: '' },
        liveRoomId: '',
        liveTearch: { name: '', id: '' }
      },
      loading: false,
      addConfig: {
        type: 1, // 1：新增 2：编辑 3: 复制
        row: {},
        visible: false
      },
      liveChannel: []
    }
  },
  async mounted() {
    await this.$store.dispatch('user/viewingFlag', 'liveScheduling')
    this.onSearchFn()
    this.searchExpertChannelEnumsd()
  },
  methods: {
    toDetail(row) {
      this.$refs.payDataDialog.dialogTableVisible = true
      this.$nextTick(() => {
        this.$refs.payDataDialog.loadData(row)
      })
    },
    searchExpertChannelEnumsd() {
      searchExpertChannelEnums().then(res => {
        this.liveChannel = res.data
      })
    },
    returnImgSrc(channel) {
      let returnString = ''
      this.liveChannel.some(item => {
        if (item.code === channel) {
          returnString = item.imageUrl
        }
      })
      return returnString
    },
    returnNumber(num) {
      const nums = num / 100
      return nums.toFixed(2)
    },
    showImg(row) {
      this.nowShowImg = row.liveUrl
      this.imageMaskFlag = true
    },
    getOptionsValueByKey,
    // 分页改变触发
    handleSizeChange(row) {
      this.config.pageSize = row
      this.config.currentPage = 1
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(row) {
      this.config.currentPage = row
      this.getList()
    },
    // 点击编辑按钮
    onhandleEdit(row) {
      this.addConfig = {
        type: 2,
        row: row,
        visible: true
      }
    },
    onhandleCopy(row) {
      this.addConfig = {
        type: 3,
        row: row,
        visible: true
      }
    },
    // 点击删除按钮
    onhandleDel(row) {
      this.$delModal({
        width: '505px',
        tips: `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">删除提醒</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">删除排班信息，将导致该直播场次产出业绩，无法统计归属至个人业绩，请确认。</div>`,
        success: () => {
          this.loading = true
          const params = {
            ids: row.id
          }
          liveScheduleDel(params)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.loading = false
              this.onSearchFn()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击查询按钮
    onSearchFn() {
      console.log(this.search)
      this.config.currentPage = 1
      this.getList()
    },
    // 点击重置按钮
    onClear() {
      this.search = {
        liveId: '',
        liveTime: ['', ''],
        liveType: '',
        liveChannel: '',
        liveAccount: { name: '', id: '' },
        user: { name: '', id: '' },
        liveRoomId: '',
        liveTearch: { name: '', id: '' }
      }
      this.onSearchFn()
    },
    // 点击新增规则按钮
    onhandleAdd() {
      this.addConfig = {
        type: 1,
        row: {},
        visible: true
      }
      console.log('点击新增')
    },
    // 获取列表数据
    getList() {
      this.loading = true
      console.log(this.search.user.id)
      const params = {
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage,
        liveExpertManId: this.search.liveAccount.id,
        liveChannel: this.search.liveChannel,
        liveCode: this.search.liveId,
        liveRoomId: this.search.liveRoomId,
        liveTimeFrom: this.search.liveTime ? this.search.liveTime[0] : '',
        liveTimeTo: this.search.liveTime ? this.search.liveTime[1] : '',
        liveType: this.search.liveType,
        lecturerId: this.search.liveTearch.id,
        userId: this.search.user.id
      }
      getLiveSchedulePage(params)
        .then(res => {
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.loading = false
          this.$refs.MPageLayout && this.$refs.MPageLayout.doLayout()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 关闭弹框并刷新数据
    closeAddDialog() {
      this.addConfig.visible = false
      this.onSearchFn()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  min-width: 1200px;
  padding: 20px;
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 0px 0px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
.expertChannel {
  display: flex;
  align-items: center;
  .expertChannelicon {
    width: 20px;
    height: 20px;
    font-size: 20px;
    margin-right: 8px;
  }
}
.liveType {
  display: inline-block;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  padding: 5px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-family: MicrosoftYaHei;
  line-height: 12px;
  i {
    width: 14px;
    height: 14px;
    margin-right: 4px;
    float: left;
  }
  p {
    float: left;
  }
  .liveTypeImg1 {
    background-image: url(../../../assets/image/account/icn_myself.png);
    background-size: 100%;
  }
  .liveTypeImg2 {
    background-image: url(../../../assets/image/account/icn_teacher.png);
    background-size: 100%;
  }
  .liveTypeImg3 {
    background-image: url(../../../assets/image/account/icn_yunying.png);
    background-size: 100%;
  }
}
.liveType1 {
  background: #f4e7ff;
  color: #650cff;
}
.liveType3 {
  background: #e7f0ff;
  color: #0c6fff;
}
.liveType2 {
  background: #e6f7ea;
  color: #00b42a;
}
.img-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  img {
    position: absolute;
    margin: auto;
    top: -9999px;
    right: -9999px;
    bottom: -9999px;
    left: -9999px;
    max-height: 80%;
    max-width: 80%;
  }
}

.img-cls-slt {
  position: absolute;
  margin: auto;
  top: -9999px;
  right: -9999px;
  bottom: -9999px;
  left: -9999px;
  max-height: 80%;
  max-width: 80%;
}
</style>
