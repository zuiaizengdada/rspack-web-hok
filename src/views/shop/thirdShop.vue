<template>
  <div class="page_wrap">
    <!-- 第三方店铺 -->
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
      @handleSelectionChange="handleSelectionChange"
    >
      <div slot="headerLeft">
        <el-select
          v-model="select"
          placeholder="请选择"
          clearable
          @change="handerSearch()"
        >
          <el-option
            v-for="item in thirdShopType"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
        <el-input
          v-model.trim="search"
          placeholder="输入店铺名称"
          clearable
          class="w-200 m-l-10 m-r-10"
          @keyup.enter.native="handerSearch"
          @clear="handerSearch"
        />
        <el-button type="primary" @click="handerSearch()">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="init()" />
        <el-button
          v-permission="['system:shop:third:add', permsList]"
          type="primary"
          @click="allChange(0)"
        >新增</el-button>
        <el-button
          v-permission="['system:shop:third:authorize', permsList]"
          type="primary"
          @click="toDoudianAuthorize()"
        >抖店店铺授权
          <el-tooltip
            class="item"
            effect="dark"
            content="授权【伏羲云】使用抖店后台账号"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </el-button>
      </div>

      <div slot="headerRight">
        <el-button size="mini" type="primary" @click="handlePushConfig">
          推送配置
        </el-button>
      </div>

      <div slot="footer">
        <!-- <AppTableTools
          ref="tableTools"
          :tools="['新增', '批量删除', '上架', '下架']"
          @onAllChange="onAllChange"
          @onClick="allChange"
        />
        <el-button v-permission="['system:shop:third:add', permsList]" @click="allChange(0)">新增</el-button>
        <el-button v-permission="['system:shop:third:remove', permsList]" @click="allChange(1)">批量删除</el-button>
        <el-button v-permission="['system:shop:third:edit', permsList]" @click="allChange(2)">上架</el-button>
        <el-button v-permission="['system:shop:third:edit', permsList]" @click="allChange(3)">下架</el-button> -->
      </div>
      <div slot="channelImg" slot-scope="{ row }">
        <img class="img-cls" :src="row.channelImg" />
      </div>
      <div v-if="row.type == 1" slot="orders" slot-scope="{ row }">
        <span class="order-span" @click="gotoThridShopDetail(row)">
          <em :class="row.numClass">{{ row.afterNum }}</em>/{{ row.orderNum }}
        </span>
      </div>
      <div v-else slot="orders">
        <span class="order-span">---</span>
      </div>
      <div v-if="select === 1" slot="serveType" v-permission="['system:shop:third:authorize',permsList]" slot-scope="{ row }">
        <div v-if="row.serveTypeNum === 1" class="serve-type-cls">
          <span style="margin-right: 10px;">服务商</span>
          <el-switch
            v-model="serveTypeOne"
            disabled
            active-text=""
            inactive-text=""
          />
        </div>
        <div v-if="row.serveTypeNum === 2" class="serve-type-cls">
          <el-switch
            v-model="serveTypeTwo"
            disabled
            active-text=""
            inactive-text=""
          />
          <span style="margin-left: 10px;">服务商</span>
        </div>
        <div v-if="row.serveTypeNum === 3" class="serve-type-cls">
          <span style="margin-right: 10px;">自营</span>
          <el-switch
            v-model="serveTypeThree"
            disabled
            active-text=""
            inactive-text=""
          />
        </div>
        <div v-if="row.serveTypeNum === 4" class="serve-type-cls">
          <div style="width: 100%;">
            <span style="margin-right: 10px;">自营</span>
            <el-switch
              v-model="serveTypeFour"
              disabled
              active-text=""
              inactive-text=""
            />
          </div>
          <div style="width: 100%;">
            <span style="margin-right: 10px;">服务商</span>
            <el-switch
              v-model="serveTypeFive"
              disabled
              active-text=""
              inactive-text=""
            />
          </div>
        </div>
      </div>
      <div slot="action" slot-scope="{ row }">
        <el-button
          v-permission="['system:shop:third:edit', permsList]"
          type="text"
          @click="shopThirdShelve(row)"
        >
          {{ { 0: '下架', 1: '上架' }[row.shelveFlag] }}
        </el-button>
        <el-button
          v-permission="['system:shop:third:edit', permsList]"
          type="text"
          @click="openEdit(row)"
        >编辑</el-button>
        <el-button type="text" @click="gotoShopCheck(row)">商品核对</el-button>
        <el-button
          v-if="[1, 2, 10].includes(row.type) && row.shelveFlag === 0"
          type="text"
          @click="orderDecryption(row)"
        >
          订单解密
        </el-button>
        <el-button class="del-cls" type="text" @click="BulkDel(row)">
          删除
        </el-button>
      </div>
      <div slot="shopName" slot-scope="{ row }">
        <div class="a_link" title="点击编辑" @click="openEdit(row)">
          {{ row.shopName }}
        </div>
      </div>
      <div slot="shelveFlag" slot-scope="{ row }">
        <AppStatus :status="row.shelveFlag === 1 ? 'error' : 'success'">
          <span>{{ { 0: '上架', 1: '下架' }[row.shelveFlag] }}</span>
        </AppStatus>
      </div>
    </MPageLayout>

    <!-- 弹框层 -->
    <Modal
      :title="modal.title"
      :type="modal.type"
      size="900px"
      width="900px"
      :visible.sync="modal.visible"
    >
      <thirdShopModal
        v-if="modal.visible"
        :type="modal.type"
        :visible.sync="modal.visible"
        :data="modal.data"
        @success="sendSuccess"
        @close="closeModal"
      />
    </Modal>

    <PushConfigDialog
      ref="PushConfigDialogRef"
      v-model="pushConfigVisible"
      @save="handleSavePushConfig"
    />
  </div>
</template>

<script>
import Modal from '@/components/Modal'
import thirdShopModal from '@/components/Modal/shop/thirdShop'
import { mapGetters } from 'vuex'
import PushConfigDialog from './components/PushConfigDialog'
import {
  getSearchList,
  addThirdShop,
  editThirdShop,
  delThirdShop,
  getThirdDetail,
  shopThirdShelveBatch,
  shopThirdApplyByShopId,
  pushConfig,
  getPushConfigByTenantId
} from '@/api/shop/thirdShop'
// import AppTableTools from '@/components/AppTableTools/AppTableTools.vue'
import AppStatus from '@/components/AppStatus'
import { getOptionsValue } from '@/filters/index'
import { getItem } from '@/utils/localStorage'
export default {
  name: 'Teacher',
  components: {
    Modal,
    PushConfigDialog,
    // AppTableTools,
    thirdShopModal,
    AppStatus
  },
  data() {
    return {
      serveTypeOne: false,
      serveTypeTwo: true,
      serveTypeThree: true,
      serveTypeFour: false,
      serveTypeFive: true,
      loading: false,
      search: '',
      select: '',
      slotArr: [
        'headerRight',
        'headerLeft',
        'channelImg',
        'orders',
        'action',
        'footer',
        'shopName',
        'shelveFlag'
      ],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'channelImg', label: '图标', type: 'slot' },
          { prop: 'shopName', label: '店铺名称', width: 160, type: 'slot' },
          { prop: 'shopId', label: 'SHOP_ID', type: 'text' },
          { prop: 'remark', label: '备注', type: 'text' },
          {
            prop: 'type',
            label: '店铺类型',
            type: 'text',
            render: row => {
              return getOptionsValue(row.type, this.thirdShopType)
            }
          },
          { prop: 'shelveFlag', label: '状态', type: 'slot' },
          { prop: 'updateTime', label: '更新时间', type: 'text' },
          { prop: 'createTime', label: '创建时间', type: 'text' },
          { prop: 'orders', label: '售后单数量', type: 'slot' },
          { prop: 'action', label: '操作', type: 'slot', width: '300' }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      // 弹框属性
      modal: {
        title: '新增标',
        type: 1, // 1: 新增; 2查看; 3编辑;
        visible: false
      },
      multipleSelection: [],
      allChangeType: false,
      sortChange: '',
      permsList: this.$route.meta.permsList || [],
      pushConfigVisible: false
    }
  },
  computed: {
    ...mapGetters(['thirdShopType'])
  },
  mounted() {
    this.init()
  },
  methods: {
    async handlePushConfig() {
      const { code, data } = await getPushConfigByTenantId()
      if (code === 1 && data) {
        this.$refs.PushConfigDialogRef.formData = {
          pushStatus: data.pushStatus,
          pushUrl: data.pushUrl,
          orderDetail: data.orderDetail,
          orderRefund: data.orderRefund,
          secretKey: data.secretKey,
          id: data.id
        }
      }
      this.pushConfigVisible = true
    },
    toDoudianAuthorize() {
      const orgInfo = getItem('orgInfo')
      const str =
        'https://fuwu.jinritemai.com/authorize?service_id=33428&state=test_' +
        orgInfo.organizationId
      window.location.href = str
    },
    handleSizeChange(val) {
      console.log(val)
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.config.currentPage = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.$refs.tableTools &&
        this.$refs.tableTools.handleChangeType(
          val.length === this.config.tableData.length
        )
      this.multipleSelection = val
    },
    // 打开新建
    openAddModel() {
      this.modal = {
        title: '新建',
        type: 1,
        visible: true,
        data: {
          type: '',
          shopName: '',
          shopId: ''
        }
      }
    },
    // 关闭新增弹框
    closeModal() {
      // this.groupStore.clearForm()
      this.modal.visible = false
    },
    getList() {
      this.loading = true
      const params = {
        size: this.config.pageSize,
        shopName: this.search,
        type: this.select,
        current: this.config.currentPage,
        startTime: '',
        endTime: ''
      }
      getSearchList(params)
        .then(res => {
          console.log(res, '列表数据')
          this.loading = false
          this.config.total = res.data.total
          const list = res.data.records
          list.some(item => {
            if (item.appId === '7412971952605759012' && item.openServiceFlag === 0) {
              item.serveTypeNum = 1
            } else if (item.appId === '7412971952605759012' && item.openServiceFlag === 1) {
              item.serveTypeNum = 2
            } else if (item.appId === '7094475962795951652' && item.openServiceFlag === 0) {
              item.serveTypeNum = 3
            } else if (item.appId === '7094475962795951652' && item.openServiceFlag === 1) {
              item.serveTypeNum = 4
            } else {
              item.serveTypeNum = 0
            }
            item.afterNum = item.afterNum ? item.afterNum : '-'
            item.orderNum = item.orderNum ? item.orderNum : '-'
            if (item.afterNum > 1 && item.afterNum <= 10) {
              item.numClass = 'orange'
            }
            if (item.afterNum > 10) {
              item.numClass = 'fred'
            }
          })
          this.config.tableData = res.data.records
        })
        .catch(() => {
          this.loading = false
        })
    },
    init() {
      this.config.currentPage = 1
      this.search = ''
      this.select = ''
      this.getList()
    },
    // 打开编辑
    async openEdit(row) {
      const { data } = await getThirdDetail(row.id)
      this.modal = {
        title: '编辑',
        type: 3, // 1: 新增; 2查看; 3编辑;
        visible: true,
        data
      }
    },
    // 删除
    BulkDel(row) {
      const that = this
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          console.log('删除')
          that.loading = true
          const ids = []
          ids.push(row.id)
          const param = {
            ids
          }
          delThirdShop(param)
            .then(() => {
              return this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },

    // 新增或者编辑成功
    async sendSuccess(res) {
      if (this.modal.type === 1) {
        addThirdShop(res).then(res => {
          if (res.code === 1) {
            this.closeModal()
            this.loading = true
            this.init()
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        editThirdShop(res).then(res => {
          if (res.code === 1) {
            this.closeModal()
            this.loading = true
            this.init()
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },

    handerSearch() {
      if (this.select === 1) {
        this.changeTableData()
      } else {
        this.backTableData()
      }
      this.config.currentPage = 1
      this.getList()
    },
    changeTableData() {
      // 检查是否已经存在 serveType 列
      const hasServeType = this.config.tableColumns.some(col => col.prop === 'serveType')

      if (!hasServeType) {
        const obj = { prop: 'serveType', label: '服务类型', width: 160, type: 'slot' }
        // 移除最后一列
        const lastOne = this.config.tableColumns.pop()
        // 添加服务类型列和操作列
        this.config.tableColumns.push(obj)
        this.config.tableColumns.push(lastOne)

        // 检查并添加 slot
        if (!this.slotArr.includes('serveType')) {
          this.slotArr.push('serveType')
        }
      }
    },
    backTableData() {
      this.config.tableColumns = [
        { prop: 'channelImg', label: '图标', type: 'slot' },
        { prop: 'shopName', label: '店铺名称', width: 160, type: 'slot' },
        { prop: 'shopId', label: 'SHOP_ID', type: 'text' },
        { prop: 'remark', label: '备注', type: 'text' },
        {
          prop: 'type',
          label: '店铺类型',
          type: 'text',
          render: row => {
            return getOptionsValue(row.type, this.thirdShopType)
          }
        },
        { prop: 'shelveFlag', label: '状态', type: 'slot' },
        { prop: 'updateTime', label: '更新时间', type: 'text' },
        { prop: 'createTime', label: '创建时间', type: 'text' },
        { prop: 'orders', label: '售后单数量', type: 'slot' },
        { prop: 'action', label: '操作', type: 'slot', width: '300' }
      ]
      this.slotArr = [
        'headerRight',
        'headerLeft',
        'channelImg',
        'orders',
        'action',
        'footer',
        'shopName',
        'shelveFlag'
      ]
    },
    // 底部上架下架删除按钮点击事件
    allChange(index) {
      console.log(index, 'index')
      switch (index) {
        case 0:
          this.openAddModel()
          break
        case 1:
          this.BulkDel()
          break
        case 2:
          this.shopThirdShelveBatch(0)
          break
        case 3:
          this.shopThirdShelveBatch(1)
          break
      }
    },
    // 底部选中本页
    onAllChange(e) {
      if (e) {
        this.$refs.MPageLayout.handletoggleSelectionAll()
      } else {
        this.$refs.MPageLayout.clearSelection()
      }
    },

    // 点击前往商品核对
    gotoShopCheck(row) {
      console.log(row, 'row')
      this.$router.push(
        `thirdShopCheck?shopName=${row.shopName}&shopId=${row.shopId}&type=${row.type}`
      )
    },
    // 点击跳转单数量详情
    gotoThridShopDetail(row) {
      this.$router.push(`shopDetail?id=${row.id}`)
    },
    // 批量上架/下架
    shopThirdShelveBatch(shelveFlag) {
      if (this.multipleSelection.length < 1) {
        return this.$message.warning('请选择店铺')
      }
      const that = this
      this.$delModal({
        tips: `确定${shelveFlag === 1 ? '下架' : '上架'}这${
          this.multipleSelection.length
        }个店铺?`,
        success: () => {
          that.loading = true
          const ids = []
          this.multipleSelection.map(v => ids.push(v.id))
          const param = {
            ids,
            shelveFlag
          }
          shopThirdShelveBatch(param)
            .then(() => {
              return this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 单独上架/下架
    shopThirdShelve(row) {
      console.log(row)
      const that = this
      this.$delModal({
        tips: `确定${row.shelveFlag === 1 ? '上架' : '下架'}这个店铺?`,
        success: () => {
          that.loading = true
          const ids = [row.id]
          const param = {
            ids,
            shelveFlag: row.shelveFlag === 1 ? 0 : 1
          }
          shopThirdShelveBatch(param)
            .then(() => {
              return this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 订单解密
    orderDecryption(row) {
      console.log('row', row, '点击订单解密')
      this.loading = true
      shopThirdApplyByShopId(row.shopId)
        .then(res => {
          this.loading = false
          this.$notify.success({
            title: '提示',
            message: '操作成功'
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    async handleSavePushConfig(form) {
      const data = {
        ...form,
        tenantId: JSON.parse(localStorage.getItem('orgInfo')).organizationId
      }

      const { code } = await pushConfig(data)
      if (code === 1) {
        this.$message.success('配置保存成功')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  min-width: 1200px;
  background-color: #fff;
  border-radius: 4px;
  overflow: auto;
}
.nickName {
  display: flex;
  align-items: center;
}

.order-span {
  cursor: pointer;
  em {
    font-style: normal;
    color: #3cc619;
  }
  em.orange {
    color: #ff7919;
  }
  em.fred {
    color: #ef422b;
  }
}
.del-cls {
  color: #ef422b;
}

.img-cls {
  width: 40px;
  height: 40px;
}
.serve-type-cls {
  width: 100%；
}
</style>
