<template>
  <div v-loading="loading" class="page_wrap">
    <div class="content">
      <div class="filter_top">
        <filterTop :search="search" @search="searchFn" />
      </div>

      <div class="table-module">
        <div class="m-b-20">
          <el-button
            v-if="tableData.length > 0"
            v-permission="['system:order:export', permsList]"
            :loading="exportLoading"
            @click="goodsOrderExport"
          >导出</el-button>
        </div>
        <div class="main-table">
          <div class="table-header clearfix">
            <div class="header-item">商品名称</div>
            <div class="header-item">状态</div>
            <div class="header-item">售后</div>
            <div class="header-item">单价(元)</div>
            <div class="header-item">数量</div>
            <div class="header-item">实付金额(元)</div>
            <div class="header-item">买家</div>
            <div class="header-item">渠道</div>
            <div class="header-item">跟进人员</div>
            <div class="header-item">操作</div>
          </div>

          <div v-if="tableData && tableData.length === 0" class="table-empty-text">
            所选时段，没有符合条件得订单，请重新筛选
          </div>

          <div v-else class="table-body">
            <div v-for="(item, itemIndex) in tableData" :key="itemIndex">
              <div class="table-title-row">
                <div v-if="item.orderNo" class="title-item">
                  订单号:
                  <AppIconClipboard :src="item.orderNo">
                    <span class="a_link" title="点击前往订单详情" @click="gotoDetail(item)">{{ item.orderNo }}</span>
                  </AppIconClipboard>
                </div>
                <div v-if="item.createTime" class="title-item">下单时间: {{ item.createTime }}</div>
                <div v-if="[1, 2, 3, 4, 5].includes(item.paymentType)" class="title-item">
                  支付方式: {{ { 1: '微信', 2: '支付宝', 3: '赠送', 4: '抖店支付', 5: '快手支付' }[item.paymentType] }}
                </div>
                <div v-if="item.cid && item.cid > 0" class="title-item">付费推广</div>
                <!-- <div class="title-item">收款方式</div> -->
                <!-- <div class="title-item">普通订单</div> -->
              </div>
              <div v-for="(listItem, index) in item.list" :key="index" class="table-body-row">
                <div class="body-item">
                  <div class="goods-img-info">
                    <div class="goods-img">
                      <ImagePreviewer :src="listItem.coverUrl" fit="contain" style="width: 100%; height: 100%" />
                    </div>
                    <div class="goods-info">
                      <div class="EC3" :title="listItem.goodsName">{{ listItem.goodsName }}</div>
                      <div class="goods-type">
                        {{ goodsType_obj[item.goodsType] }}
                      </div>
                      <div class="goods-period">
                        获得有效期时长:
                        <span v-if="listItem.saleValidity === 0">长期有效</span>
                        <span v-if="listItem.saleValidity === 1">{{ listItem.validityDays }}</span>
                        <span v-if="listItem.saleValidity === 2">{{
                          listItem.fixedTime
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="body-item">
                  <AppStatus v-if="listItem.orderStatus" :status="orderStatus[listItem.orderStatus].type">
                    <span>{{ orderStatus[listItem.orderStatus].name }}</span>
                  </AppStatus>
                </div>
                <div class="body-item">
                  <template v-if="[5, 6, 7].includes(listItem.orderStatus)">
                    <AppStatus v-if="listItem.orderStatus" :status="orderStatus[listItem.orderStatus].type">
                      <span>{{ orderStatus[listItem.orderStatus].name }}</span>
                    </AppStatus>
                  </template>
                </div>
                <div class="body-item">{{ (listItem.goodsPrices || 0) | filtersMoney }}</div>
                <div class="body-item">{{ listItem.goodsNum }}</div>
                <div class="body-item">
                  {{ listItem.payerTotal | filterPayerTotal }} 元
                  <div v-if="listItem.payerBeforeTotal" class="c_red m-t-10">
                    改价前: {{ listItem.payerBeforeTotal | filtersMoney }} 元
                  </div>
                </div>
                <div class="body-item">{{ item.userName }}</div>
                <div class="body-item">
                  {{ item.channelSource | getOptionsValue(channelSourceType) }}{{ getThirdShopName(item,listItem) }}
                </div>
                <div class="body-item">
                  <div
                    v-if="listItem.followers && listItem.followers.length > 0"
                    class="followerUserTips"
                    @click="clickFollowUser(listItem)"
                  >
                    <span v-for="(e, ei) in listItem.followers" :key="e.role">
                      {{ e.nickName }}
                      <template v-if="ei !== listItem.followers.length - 1">/</template>
                    </span>
                  </div>
                  <div v-else class="followerUserTips" @click="clickFollowUser(listItem)">无跟进人员</div>
                </div>
                <div class="body-item">
                  <el-button type="text" @click="gotoDetail(listItem)">订单详情</el-button>

                  <!-- [5].includes(listItem.goodsType) || [1].includes(listItem.orderStatus) || ([1, 2, 4].includes(item.channelSource) && listItem.orderStatus === 2) -->
                  <el-dropdown>
                    <el-button type="text" class="el-dropdown-link m-l-20">
                      更多<i class="el-icon-arrow-down el-icon--right" />
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-if="[5].includes(listItem.goodsType)"
                        v-permission="['system:student:query', permsList]"
                        type="text"
                        @click.native="openMemberModel(listItem)"
                      >成员信息</el-dropdown-item>
                      <el-dropdown-item
                        v-if="[1].includes(listItem.orderStatus)"
                        v-permission="['system:order:price', permsList]"
                        type="text"
                        @click.native="openChangePriceModelModel(item)"
                      >改价</el-dropdown-item>
                      <el-dropdown-item
                        v-if="[1, 2, 4].includes(item.channelSource) && listItem.orderStatus === 2"
                        v-permission="['system:order:send', permsList]"
                        type="text"
                        @click.native="sendActivationSMS(listItem)"
                      >激活短信</el-dropdown-item>
                      <el-dropdown-item
                        v-if="[1, 2, 4].includes(item.channelSource) && listItem.orderStatus === 2"
                        v-activation="listItem.orderNo"
                        v-permission="['system:order:active:send', permsList]"
                        type="text"
                      >激活链接</el-dropdown-item>
                      <el-dropdown-item
                        v-permission="['system:order:follower', permsList]"
                        type="text"
                        @click.native="openFollowLogModel(listItem)"
                      >跟进记录</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-pagination
          class="ss-pagination-warpper m-t-20 m-b-20"
          :current-page="search.current"
          :page-size="search.size"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

    <AppDialog
      v-model="memberModal.visible"
      :title="memberModal.title"
      width="550px"
      height="auto"
      @success="memberModal.visible = false"
    >
      <div v-loading="memberModal.loading" class="customer-info-box">
        <template v-if="memberList.length > 0">
          <el-card v-for="(item, index) in memberList" :key="index" shadow="always" class="memberCard">
            <div class="memberInfo">
              <div>
                <span>姓名:</span>
                <span>{{ item.name }}</span>
              </div>
              <div>
                <span>性别:</span>
                <span>{{ { 1: '男性', 2: '女性', 3: '未知' }[item.sex] }}</span>
              </div>
              <div>
                <span>手机号:</span>
                <span>{{ item.phone }}</span>
              </div>
              <div>
                <span>公司:</span>
                <span>{{ item.company }}</span>
              </div>
              <div>
                <span>职务:</span>
                <span>{{ item.position }}</span>
              </div>
              <div style="width: 100%">
                <span>所在地区:</span>
                <span>{{ item.areaName }}</span>
              </div>
              <div style="width: 100%">
                <span>详细地址:</span>
                <span>{{ item.address }}</span>
              </div>
            </div>
          </el-card>
        </template>
        <div v-else class="table-empty-text">暂无成员信息</div>
      </div>
      <div slot="footer" class="follow-user-footer">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="memberModal.total"
          :page-size="memberModal.size"
          :current-page.sync="memberModal.current"
          @current-change="memberCurrentChange"
        />
      </div>
    </AppDialog>

    <!-- 改价弹框 -->
    <AppDialog
      v-model="changePriceModel.visible"
      :title="changePriceModel.title"
      width="800px"
      height="auto"
      @success="handleChangePrice"
    >
      <div v-loading="changePriceModel.loading" class="change-price-model">
        <!-- <div>改价</div> -->
        <el-table :data="changePriceModel.data" style="width: 100%" border>
          <el-table-column prop="name" label="商品" width="280">
            <template slot-scope="{ row }">
              <div class="fl">
                <div class="goods_picture m-r-10">
                  <ImagePreviewer fit="contain" :src="row.coverUrl" />
                </div>
                <div class="goods_info">
                  <div class="goods_name">{{ row.contentName }}</div>
                  <div class="goods_salePrice">原价: {{ row.goodsPrices | filtersMoney }}元</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsNum" label="数量" width="99" />
          <el-table-column prop="goodsTotalFee" label="应付价格(元)" width="190" />
          <el-table-column prop="name" label="改价(元)" width="190">
            <template slot-scope="{ row }">
              <el-input v-model="row.payerTotal" type="text" @input="changePrice()" />
            </template>
          </el-table-column>
        </el-table>

        <div class="change-price-model-footer">
          <!-- <div class="change-price-model-footer-view">
            <div class="change-price-model-footer-view-label">优惠卷编码:</div>
            <div class="change-price-model-footer-view-name">xxxxxxxx</div>
          </div>
          <div class="change-price-model-footer-view">
            <div class="change-price-model-footer-view-label">优惠卷金额:</div>
            <div class="change-price-model-footer-view-name">￥123</div>
          </div> -->
          <div class="change-price-model-footer-view">
            <div class="change-price-model-footer-view-label">总价应付:</div>
            <div class="change-price-model-footer-view-name">￥{{ changePriceModel.goodsTotalFee }}</div>
          </div>
          <div class="change-price-model-footer-view">
            <div class="change-price-model-footer-view-label">改价应付:</div>
            <div class="change-price-model-footer-view-name">￥{{ changePriceModel.changePrice }}</div>
          </div>
        </div>
      </div>
    </AppDialog>

    <!-- 跟进人员弹框 -->
    <AppDialog v-model="followUserModel.visible" :title="followUserModel.title" width="800px" height="auto">
      <div class="follow-user-model">
        <div v-for="(item, index) in followUserModel.data" :key="index">
          <div class="clearfix follow-user">
            <div class="fl roleName">{{ item.roleName }}</div>
            <div class="fl selectUser">
              <el-tag v-if="item.userId" closable @close="delFollowUser(item, index)">{{ item.nickName }}</el-tag>
              <el-button v-else class="button-new-tag" size="small" @click="addFollowUser(index)">+ 选择人员</el-button>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="follow-user-footer">
        <el-button type="primary" @click="sureFollowUser">确定</el-button>
        <el-button @click="closeFollowUserModel">取消</el-button>
      </div>
    </AppDialog>

    <!-- 跟进记录弹框 -->
    <AppDialog v-model="followUserLogModel.visible" title="跟进记录" width="700px" height="490px">
      <followUserLog :visible="followUserLogModel.visible" :order-no="followUserLogModel.orderNo" />
      <div slot="footer" />
    </AppDialog>
  </div>
</template>

<script>
import filterTop from './filterTop.vue'
import {
  getOrderPage,
  getStudentList,
  goodsOrderPrice,
  goodsOrderExport,
  getLxUrl,
  goodActivesSendSMS,
  addFollowSave
} from '@/api/business'
import AppStatus from '@/components/AppStatus'
import AppIconClipboard from '@/components/AppIconClipboard'
import AppDialog from '@/components/AppDialog'
import followUserLog from '@/components/Modal/system/followUser.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'OrderList',
  components: {
    filterTop,
    AppStatus,
    AppIconClipboard,
    AppDialog,
    followUserLog
  },
  data() {
    return {
      loading: true,
      listTab: [
        { id: '1', name: '全部订单' },
        { id: '2', name: '线上订单' },
        { id: '3', name: '线下订单' },
        { id: '4', name: '退款订单' }
      ],
      currentTabIndex: '1',
      search: {
        order: { label: 'orderNo', value: '' }, // 订单搜索
        time: { label: 1, value: ['', ''] }, // 订单时间
        goodsName: '', // 商品名称
        orderStatus: '', // 订单状态
        orderType: '0', // 订单类型
        userTerminal: '', // 渠道来源
        channelSource: '', // 渠道来源
        thirdShopId: '', // 第三方店铺id
        thirdShopName: '', // 第三方店铺名称
        paymentType: '', // 支付方式
        folowerId: '', // 跟进人员id
        folowername: '', // 跟进人员姓名
        payPromotion: '', // 筛选推广
        current: 1, // 当前页
        size: 10 // 每页条数
      },
      total: 0,
      tableData: [],
      orderStatus: {
        1: {
          type: 'error',
          name: '未支付'
        },
        2: {
          type: 'success',
          name: '支付成功'
        },
        3: {
          type: 'error',
          name: '超时已关闭'
        },
        4: {
          type: 'error',
          name: '用户已取消'
        },
        5: {
          type: 'warning',
          name: '退款中'
        },
        6: {
          type: 'warning',
          name: '部分退款'
        },
        7: {
          type: 'success',
          name: '全部退款'
        },
        8: {
          type: 'success',
          name: '交易结束'
        },
        9: {
          type: 'warning',
          name: '没有向第三方发起支付请求'
        },
        10: {
          type: 'error',
          name: '退款金额异常'
        }
      },
      memberModal: {
        visible: false,
        title: '成员信息',
        loading: false,
        current: 1,
        size: 10,
        total: 0,
        row: {}
      },
      // 学员信息list
      memberList: [],
      changePriceModel: {
        visible: false,
        title: '改价',
        loading: false,
        data: {}, // 列表数据
        payerTotal: 0, // 总价应付
        changePrice: 0, // 改价应付
        orderNo: ''
      },
      // 跟进人员弹框
      followUserModel: {
        visible: false,
        data: [
          { userId: '', userName: '', roleName: '班主任', role: 1 },
          { userId: '', userName: '', roleName: '销售', role: 2 },
          { userId: '', userName: '', roleName: '客服', role: 3 }
        ],
        orderNo: '',
        subOrderId: '',
        title: '添加跟进人员'
      },
      followUserLogModel: {
        visible: false,
        orderNo: ''
      },
      exportLoading: false,
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters(['goodsType_obj', 'channelSourceType'])
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
    console.log('123')
    this.getList()
  },
  activated() {
    this.getList()
  },
  methods: {
    tabChange(i) {
      this.currentTabIndex = i
    },
    handleCurrentChange(val) {
      this.search.current = val
      this.getList()
    },
    handleSizeChange(val) {
      this.search.size = val
      this.getList()
    },
    getList() {
      console.log(!this.search.order.value && this.search.time.value === ['', ''], '123')
      if (
        !this.search.order.value &&
        (!this.search.time.value[0] || !this.search.time.value) &&
        !this.search.orderStatus &&
        !this.search.paymentType &&
        !this.search.folowerId &&
        !this.search.channelSource &&
        !this.search.payPromotion
      ) {
        this.tableData = []
        this.total = 0
        this.loading = false
        return
      }

      this.loading = true
      const params = {
        // ...this.search,
        // order: this.search.order.value,
        current: this.search.current,
        size: this.search.size,
        [this.search.order.label]: this.search.order.value,
        timeType: this.search.time.label,
        startTime: this.search.time.value && this.search.time.value[0],
        endTime: this.search.time.value && this.search.time.value[1],
        orderStatus: this.search.orderStatus || '',
        paymentType: this.search.paymentType || '',
        userTerminal: this.search.userTerminal || '',
        channelSource: this.search.channelSource,
        thirdShopId: this.search.thirdShopId,
        folowerId: this.search.folowerId,
        payPromotion: this.search.payPromotion
      }
      getOrderPage(params)
        .then((res) => {
          console.log(res, 'res')
          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    searchFn(res) {
      this.search = res
      this.getList()
    },
    // 跳转订单详情
    gotoDetail(row) {
      console.log(row)
      this.$router.push({ path: `/business/order/order/${row.orderNo}` })
    },
    // 打开成员信息弹框
    openMemberModel(row) {
      this.memberList = []
      this.memberModal.visible = true
      this.memberModal.loading = true
      this.memberModal.current = 1
      this.memberModal.size = 10
      this.memberModal.total = 0
      this.memberModal.row = row
      const params = {
        goodsId: this.memberModal.row.goodsId,
        orderNo: this.memberModal.row.orderNo,
        current: this.memberModal.current,
        size: this.memberModal.size
      }
      getStudentList(params)
        .then((res) => {
          this.memberList = res.data.records
          this.memberModal.loading = false
          this.memberModal.total = res.data.total
          console.log(res, '获取学员信息')
        })
        .catch(() => {
          this.memberModal.loading = false
        })
    },
    memberCurrentChange(val) {
      console.log('1232')
      this.memberModal.current = val
      const params = {
        goodsId: this.memberModal.row.goodsId,
        orderNo: this.memberModal.row.orderNo,
        current: this.memberModal.current,
        size: this.memberModal.size
      }
      getStudentList(params)
        .then((res) => {
          this.memberList = res.data.records
          this.memberModal.loading = false
          this.memberModal.total = res.data.total
          console.log(res, '获取学员信息')
        })
        .catch(() => {
          this.memberModal.loading = false
        })
    },
    // 打开改价弹框
    openChangePriceModelModel(row) {
      console.log(row)
      this.changePriceModel.visible = true
      const { list } = JSON.parse(JSON.stringify(row))
      let goodsTotalFee = 0
      list.map((v) => {
        v.goodsTotalFee = Number(v.payerTotal) / 100
        v.payerTotal = Number(v.payerTotal) / 100
        goodsTotalFee += v.goodsTotalFee
      })
      console.log(list, 'list')
      this.changePriceModel.data = list
      this.changePriceModel.goodsTotalFee = goodsTotalFee
      this.changePriceModel.changePrice = goodsTotalFee
      this.changePriceModel.orderNo = row.orderNo
    },
    // 改价Input改变触发
    changePrice() {
      this.changePriceModel.changePrice = 0
      this.changePriceModel.data.map((v) => {
        this.changePriceModel.changePrice += Number(v.payerTotal)
      })
    },
    // 改价弹框确认按钮
    handleChangePrice() {
      this.changePriceModel.loading = true
      const subOrderReqs = []
      this.changePriceModel.data.map((v) => {
        subOrderReqs.push({
          id: v.id,
          payerBeforeTotal: v.goodsTotalFee * 100,
          payerTotal: v.payerTotal * 100
        })
      })
      const data = {
        orderNo: this.changePriceModel.orderNo,
        subOrderReqs: subOrderReqs
      }
      goodsOrderPrice(data)
        .then((res) => {
          console.log(res, '改价成功')
          this.changePriceModel.loading = false
          this.changePriceModel.visible = false
          this.getList()
        })
        .catch(() => {
          this.changePriceModel.loading = false
        })
    },
    // 点击导出
    goodsOrderExport() {
      this.exportLoading = true
      const params = {
        current: this.search.current,
        size: this.search.size,
        [this.search.order.label]: this.search.order.value,
        timeType: this.search.time.label,
        startTime: this.search.time.value && this.search.time.value[0],
        endTime: this.search.time.value && this.search.time.value[1],
        orderStatus: this.search.orderStatus || '',
        paymentType: this.search.paymentType || '',
        userTerminal: this.search.userTerminal || '',
        channelSource: this.search.channelSource,
        thirdShopId: this.search.thirdShopId
      }
      // const params = {}
      // Object.keys(filters).forEach(item => {
      //   if (filters[item]) {
      //     params[item] = filters[item]
      //   }
      // })
      goodsOrderExport(params)
        .then((res) => {
          this.exportLoading = false
          console.log(res)
          // window.location = res.data
          // window.open(res.data, '_self')
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    getLxUrl(taskId) {
      getLxUrl(taskId).then(res => {
        var newWin = window.open('loading page', '_self')
        newWin.location.href = res.data // 成功 重定向到目标页面
      })
    },
    // 点击发送激活短信
    sendActivationSMS(row) {
      console.log(row)
      this.$delModal({
        tips: '确定发送激活短信?',
        success: () => {
          const data = {
            orderNo: row.orderNo
          }
          // this.$emit('delHandle', node.data)
          goodActivesSendSMS(data).then((res) => {
            // console.log
            this.$notify.success({
              title: '提示',
              message: '操作成功'
            })
          })
        }
      })
    },
    // 选择跟进人员
    addFollowUser(index) {
      this.$AddressBook({
        visible: true,
        type: [1],
        multiple: false,
        success: (res) => {
          console.log(res)
          if (res.user.length > 0) {
            const userInfo = res.user[0]
            this.followUserModel.data[index].userId = userInfo.userId
            this.followUserModel.data[index].userName = userInfo.userName
            this.followUserModel.data[index].nickName = userInfo.nickName
          }
        }
      })
    },
    delFollowUser(item, index) {
      this.followUserModel.data[index].userId = ''
      this.followUserModel.data[index].userName = ''
      this.followUserModel.data[index].nickName = ''
    },
    // 点击跟进人员
    clickFollowUser(row) {
      this.followUserModel.data = [
        { userId: '', userName: '', nickName: '', roleName: '班主任', role: 1 },
        { userId: '', userName: '', nickName: '', roleName: '销售', role: 2 },
        { userId: '', userName: '', nickName: '', roleName: '客服', role: 3 }
      ]
      this.followUserModel.orderNo = row.orderNo
      this.followUserModel.subOrderId = row.id
      if (row.followers && row.followers.length > 0) {
        // this.followUserModel.data
        row.followers.map((v) => {
          this.followUserModel.data[v.role - 1].userId = v.userId
          this.followUserModel.data[v.role - 1].userName = v.userName
          this.followUserModel.data[v.role - 1].nickName = v.nickName
        })
      }
      this.followUserModel.visible = true
    },
    closeFollowUserModel() {
      this.followUserModel.visible = false
    },
    sureFollowUser() {
      this.loading = true
      const users = []
      if (this.followUserModel.data.length > 0) {
        this.followUserModel.data.map((v) => {
          v.userId && users.push(v)
        })
      }
      const data = {
        orderNo: this.followUserModel.orderNo,
        subOrderId: this.followUserModel.subOrderId,
        users
      }
      addFollowSave(data)
        .then((res) => {
          this.getList()
          this.followUserModel.visible = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    openFollowLogModel(list) {
      this.followUserLogModel = {
        visible: true,
        orderNo: list.orderNo
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page_wrap {
  // min-width: 1200px;
  height: 100%;
  // background-color: #fff;
  border-radius: 4px;
  .content {
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 8px;
      height: 10px;
      background-color: rgba(0, 0, 0, 0);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.2);
      transition: all 0.4s ease;
      -moz-transition: all 0.4s ease;
      -webkit-transition: all 0.4s ease;
      -o-transition: all 0.4s ease;
    }
    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.1);
    }
    .filter_top {
      padding: 20px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08),
        0px 1px 10px 0px rgba(0, 0, 0, 0.05);
    }
    .footer-tabs {
      margin-top: 16px;
    }
    .table-module {
      padding: 20px;
      margin-top: 20px;
      width: 100%;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08),
        0px 1px 10px 0px rgba(0, 0, 0, 0.05);
      .ss-pagination-warpper {
        text-align: right;
      }
      .table-empty-text {
        width: 100%;
        height: 100px;
        line-height: 100px;
        font-size: 16px;
        text-align: center;
        color: #5e7382;
      }
      .main-table {
        width: 100%;
        .table-header {
          width: 100%;
          line-height: 40px;
          font-size: 14px;
          font-weight: 600;
          background: #f6f8fa;
          color: #353535;
          .header-item {
            float: left;
            box-sizing: border-box;
            position: relative;
            &:nth-child(1) {
              width: 23%;
              padding-left: 16px;
            }
            &:nth-child(2) {
              width: 10%;
            }
            &:nth-child(3) {
              width: 5%;
            }
            &:nth-child(4) {
              width: 10%;
            }
            &:nth-child(5) {
              width: 5%;
            }
            &:nth-child(6) {
              width: 10%;
            }
            &:nth-child(7) {
              width: 10%;
            }
            &:nth-child(8) {
              width: 10%;
            }
            &:nth-child(9) {
              width: 10%;
            }
            &:nth-child(10) {
              width: 10%;
            }
          }
        }

        .table-body {
          width: 100%;
          font-size: 14px;
          .table-title-row {
            position: relative;
            padding: 0 50px 0 15px;
            margin-top: 16px;
            background: #f7f9fb;
            border: 1px solid #eee;
            min-height: 44px;
            line-height: 28px;
            height: auto;
            overflow: hidden;
            color: #333;
            font-size: 14px;
            .title-item {
              margin-right: 24px;
              height: 42px;
              line-height: 42px;
              float: left;
            }

            .color-tag-area {
              display: flex;
              align-items: center;
              position: absolute;
              right: 0;
              top: 0;
              padding: 0 15px;
              height: 42px;
              line-height: 42px;
              color: #105cfb;
              cursor: pointer;
              > img {
                width: 16px;
                height: 16px;
              }
            }
          }
          .table-body-row {
            width: 100%;
            display: flex;
            align-items: center;
            min-height: 93px;
            border-left: 1px solid #eeeeee;
            border-right: 1px solid #eeeeee;
            border-bottom: 1px solid #eeeeee;
            .body-item {
              box-sizing: border-box;
              position: relative;
              height: 100%;
              &:nth-child(1) {
                width: 20%;
                padding-left: 15px;
              }
              &:nth-child(2) {
                width: 10%;
              }
              &:nth-child(3) {
                width: 5%;
              }
              &:nth-child(4) {
                width: 10%;
              }
              &:nth-child(5) {
                width: 5%;
              }
              &:nth-child(6) {
                width: 10%;
              }
              &:nth-child(7) {
                width: 10%;
              }
              &:nth-child(8) {
                width: 10%;
              }
              &:nth-child(9) {
                width: 10%;
              }
              &:nth-child(10) {
                width: 10%;
              }

              .goods-img-info {
                display: flex;
                align-items: center;
                .goods-img {
                  width: 64px;
                  height: 64px;
                  min-width: 64px;
                  background: #eee;
                }
                .goods-info {
                  min-height: 60px;
                  padding-left: 8px;
                  display: grid;

                  .goods-type {
                    width: 100%;
                    height: 18px;
                    line-height: 18px;
                    font-size: 14px;
                    color: #999999;
                    margin-right: 8px;
                  }
                  .goods-period {
                    width: 100%;
                    height: 16px;
                    font-size: 12px;
                    color: #b2b2b2;
                    line-height: 16px;
                    overflow: hidden;
                    -o-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
.customer-info-box {
  max-height: 400px;
  overflow: auto;
  padding-top: 20px;
}
.memberCard {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
}
.memberInfo {
  width: 450px;
  line-height: 20px;
  display: flex;
  flex-wrap: wrap;
  > div {
    width: 33.33%;
    > span:nth-child(1) {
      // margin-right: 8px;
      word-break: keep-all;
      line-height: 22px;
      font-size: 14px;
    }
    > span:nth-child(2) {
      white-space: pre-wrap;
      word-break: break-all;
      line-height: 22px;
      font-size: 14px;
    }
  }
}
.table-empty-text {
  width: 100%;
  height: 100px;
  line-height: 100px;
  font-size: 16px;
  text-align: center;
  color: #5e7382;
}
.change-price-model {
  width: 800px;
  padding: 20px;
  box-sizing: border-box;
}
.goods_picture {
  width: 82px;
  height: 60px;
  border-radius: 4px;
  background: rgb(245, 247, 250);
}
.goods_info {
  line-height: 1.5;
  width: calc(100% - 82px);
  height: 60px;
  flex: 1;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  .goods_name {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
    word-wrap: break-word;
    font-size: 14px;
    color: #353535;
    cursor: pointer;
  }
}
.change-price-model-footer {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .change-price-model-footer-view {
    display: flex;
    margin-top: 20px;
    width: 50%;
    .change-price-model-footer-view-label {
      width: 82px;
      margin-right: 12px;
      font-size: 14px;
      color: #606266;
    }
    .change-price-model-footer-view-name {
      font-size: 14px;
      color: #606266;
    }
  }
}
.follow-user-model {
  width: 800px;
  padding: 20px;
  box-sizing: border-box;
  .follow-user {
    margin-bottom: 20px;
    line-height: 32px;
    .roleName {
      width: 80px;
    }
  }
}
.follow-user-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  width: 100%;
  height: 66px;
  background-color: #fafbfc;
  border-radius: 2px 2px 0 0;
}
.followerUserTips {
  color: #1890ff;
  cursor: pointer;
  // &:active {
  //   color: ;
  // }
}
</style>
