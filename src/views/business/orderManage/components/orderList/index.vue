<template>
  <div v-loading="loading" class="page_wrap">
    <div class="content">
      <div
        class="table-module"
        :class="showBorder ? 'table-module-border' : ''"
      >
        <!-- <div class="m-b-20">
          <el-button
            v-if="tableData.length > 0"
            v-permission="['system:order:export', permsList]"
            :loading="exportLoading"
            @click="goodsOrderExport"
          >导出</el-button>
        </div> -->
        <div class="main-table">
          <div
            class="table-header clearfix"
            :style="{ borderRadius: showBorder ? '6px 6px 0 0' : '' }"
          >
            <div class="header-item">商品名称</div>
            <!-- <div class="header-item">订单状态</div>
            <div class="header-item">审核状态</div> -->
            <!-- <div class="header-item">售后</div> -->
            <div class="header-item">单价(元)</div>
            <div class="header-item">数量</div>
            <div class="header-item">实付金额(元)</div>
            <div class="header-item">买家</div>
            <div class="header-item">渠道</div>
            <!-- <div class="header-item">跟进人员</div> -->
            <div v-if="operationColumn" class="header-item">操作</div>
          </div>

          <div
            v-if="tableData && tableData.length === 0"
            class="table-empty-text"
          >
            所选时段，没有符合条件得订单，请重新筛选
          </div>

          <div v-else class="table-body">
            <div v-for="(item, itemIndex) in tableData" :key="itemIndex">
              <div class="table-title-row">
                <div class="table-title-row-l">
                  <div class="order-box">
                    <div v-if="item.orderNo" class="title-item title-item-font">
                      订单号:
                      <AppIconClipboard :src="item.orderNo">
                        <span
                          class="a_link"
                          title="点击前往订单详情"
                          @click="gotoDetail(item)"
                        >{{ item.orderNo }}</span>
                      </AppIconClipboard>
                    </div>
                    <div
                      v-if="item.createTime"
                      class="title-item title-item-font"
                    >
                      下单时间: <span>{{ item.createTime }}</span>
                    </div>
                    <!-- <div v-if="[1, 2, 3, 4, 5].includes(item.paymentType)" class="title-item">
                      渠道来源: {{ { 1: '微信', 2: '支付宝', 3: '赠送', 4: '抖店支付', 5: '快手支付' }[item.paymentType] }}
                    </div> -->
                    <div class="title-item title-item-font">
                      渠道平台:
                      <span>{{
                        item.channelSource | getOptionsValue(channelSourceType)
                      }}</span>
                    </div>
                    <div
                      v-if="item.cid && item.cid > 0"
                      class="title-item title-item-font"
                    >
                      付费推广
                    </div>
                    <!-- <div class="title-item">收款方式</div> -->
                    <!-- <div class="title-item">普通订单</div> -->
                  </div>
                  <div class="pay-box">
                    <AppStatus
                      v-if="item.orderStatus"
                      :status="orderStatus[item.orderStatus].type"
                    >
                      <span>{{ orderStatus[item.orderStatus].name }}</span>
                    </AppStatus>
                  </div>
                  <div class="audit-list">
                    <div v-if="item.examineStatus === 0" class="audit-box">
                      <svg-icon
                        icon-class="audit_wait"
                        class="icon-svg"
                      />待初审
                    </div>
                    <div
                      v-else-if="item.examineStatus === 1"
                      class="audit-box audit-box-review"
                    >
                      <svg-icon
                        icon-class="audit_review"
                        class="icon-svg"
                      />待复审
                    </div>
                    <div
                      v-else-if="item.examineStatus === 2"
                      class="audit-box audit-box-fail"
                    >
                      <svg-icon
                        icon-class="audit_fail"
                        class="icon-svg"
                      />审核失败
                    </div>
                    <div
                      v-else-if="item.examineStatus === 3"
                      class="audit-box audit-box-succeed"
                    >
                      <svg-icon
                        icon-class="audit_success"
                        class="icon-svg"
                      />审核成功
                    </div>
                  </div>
                  <div v-if="item.channelSource === 21" class="audit-list">
                    <div class="title-item title-item-font">
                      招生老师:
                      <span>{{ item.enrollmentTeacherName }}</span>
                    </div>
                  </div>
                  <div
                    v-if="item.channelSource === 21 && item.depositGoodsName"
                    class="audit-list"
                  >
                    <div class="title-item title-item-font">
                      备注:
                      <span>{{ item.depositGoodsName }}</span>
                    </div>
                  </div>
                  <!-- <el-button type="text" @click="gotoDetail(item)">订单详情</el-button> -->
                </div>
                <div class="table-title-row-r" />
              </div>
              <div class="table-body">
                <div
                  v-for="(listItem, index) in item.list"
                  :key="index"
                  class="table-body-row"
                  :class="
                    index === item.list.length - 1 ? 'table-body-row-box' : ''
                  "
                  :style="{
                    marginBottom:
                      showBorder && item.list.length - 1 == index ? '16px' : ''
                  }"
                >
                  <div class="body-item">
                    <div class="goods-img-info">
                      <div class="goods-img">
                        <ImagePreviewer
                          :src="listItem.coverUrl"
                          fit="contain"
                          style="width: 100%; height: 100%; border-radius: 6px"
                        />
                      </div>
                      <div class="goods-info">
                        <div class="EC3" :title="listItem.goodsName">
                          {{ listItem.goodsName }}
                        </div>
                        <div class="goods-type">
                          {{ goodsType_obj[item.goodsType] }}
                        </div>
                        <div class="goods-period">
                          获得有效期时长:
                          <span
                            v-if="listItem.saleValidity === 0"
                          >长期有效</span>
                          <span v-if="listItem.saleValidity === 1">{{
                            listItem.validityDays
                          }}</span>
                          <span v-if="listItem.saleValidity === 2">{{
                            listItem.fixedTime
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="body-item">
                    <AppStatus v-if="listItem.orderStatus" :status="orderStatus[listItem.orderStatus].type">
                      <span>{{ orderStatus[listItem.orderStatus].name }}</span>
                    </AppStatus>
                  </div> -->
                  <!-- <div class="body-item">
                    <div v-if="item.examineStatus === 0" class="audit-box"><svg-icon icon-class="audit_wait" class="icon-svg" />待初审</div>
                    <div v-else-if="item.examineStatus === 1" class="audit-box audit-box-review"><svg-icon icon-class="audit_review" class="icon-svg" />待复审</div>
                    <div v-else-if="item.examineStatus === 2" class="audit-box audit-box-fail"><svg-icon icon-class="audit_fail" class="icon-svg" />审核失败</div>
                    <div v-else-if="item.examineStatus === 3" class="audit-box audit-box-succeed"><svg-icon icon-class="audit_success" class="icon-svg" />审核成功</div>
                  </div> -->
                  <!-- <div class="body-item">
                    <template v-if="[5, 6, 7].includes(listItem.orderStatus)">
                      <AppStatus v-if="listItem.orderStatus" :status="orderStatus[listItem.orderStatus].type">
                        <span>{{ orderStatus[listItem.orderStatus].name }}</span>
                      </AppStatus>
                    </template>
                    <span v-else>--</span>
                  </div> -->
                  <div class="body-item">
                    {{ (listItem.goodsPrices || 0) | filtersMoney }}
                  </div>
                  <div class="body-item">{{ listItem.goodsNum }}</div>
                  <div class="body-item">
                    {{ listItem.payerTotal | filterPayerTotal }} 元
                    <div v-if="listItem.payerBeforeTotal" class="c_red m-t-10">
                      改价前: {{ listItem.payerBeforeTotal | filtersMoney }} 元
                    </div>
                  </div>
                  <div class="body-item">{{ item.userName }}</div>
                  <div class="body-item m-r-10">
                    {{ item.channelSource | getOptionsValue(channelSourceType)
                    }}{{ getThirdShopName(item, listItem) }}
                  </div>
                  <!-- <div class="body-item">
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
                  </div> -->
                  <div v-if="operationColumn" class="body-item">
                    <el-button
                      type="text"
                      @click="gotoDetail(item)"
                    >订单详情</el-button>
                    <!-- [5].includes(listItem.goodsType) || [1].includes(listItem.orderStatus) || ([1, 2, 4].includes(item.channelSource) && listItem.orderStatus === 2) -->
                    <el-dropdown
                      v-if="search.activeName !== '我的审批' && operation"
                    >
                      <el-button type="text" class="el-dropdown-link">
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
                          v-if="
                            [1].includes(listItem.orderStatus) &&
                              (item.channelSource === 3 ||
                                item.channelSource === 14 ||
                                item.channelSource === 15)
                          "
                          v-permission="['system:order:price', permsList]"
                          type="text"
                          @click.native="openChangePriceModelModel(item, index)"
                        >改价</el-dropdown-item>
                        <el-dropdown-item
                          v-if="
                            [1, 2, 4].includes(item.channelSource) &&
                              listItem.orderStatus === 2
                          "
                          v-permission="['system:order:send', permsList]"
                          type="text"
                          @click.native="sendActivationSMS(listItem)"
                        >激活短信</el-dropdown-item>
                        <el-dropdown-item
                          v-if="
                            [1, 2, 4].includes(item.channelSource) &&
                              listItem.orderStatus === 2
                          "
                          v-activation="listItem.orderNo"
                          v-permission="['system:order:active:send', permsList]"
                          type="text"
                        >激活链接</el-dropdown-item>
                        <el-dropdown-item
                          v-permission="['system:order:follower', permsList]"
                          type="text"
                          @click.native="openFollowLogModel(listItem)"
                        >跟进记录</el-dropdown-item>
                        <div v-if="item.orderConfigId != 6">
                          <el-dropdown-item
                            v-if="
                              search.activeName === '全部订单' &&
                                (item.orderStatus === 2 ||
                                  item.orderStatus === 6) &&
                                item.isTransfer === 0 &&
                                item.orderConfigId === 1 &&
                                (item.channelSource === 8 ||
                                  item.channelSource === 9 ||
                                  item.channelSource === 17)
                            "
                            v-permission="['system:order:refund', permsList]"
                            type="text"
                            @click.native="openFullRefund(listItem, item)"
                          >全部退款</el-dropdown-item>
                          <el-dropdown-item
                            v-if="
                              search.activeName === '全部订单' &&
                                (item.orderStatus === 2 ||
                                  item.orderStatus === 6) &&
                                item.isTransfer === 0 &&
                                item.orderConfigId === 1 &&
                                (item.channelSource === 8 ||
                                  item.channelSource === 9 ||
                                  item.channelSource === 17)
                            "
                            v-permission="[
                              'system:order:partRefund',
                              permsList
                            ]"
                            type="text"
                            @click.native="openPartialRefund(listItem, item)"
                          >部分退款</el-dropdown-item>
                        </div>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-pagination
          v-if="search.pagination"
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
    <div v-if="loading" class="loading-box" />
    <AppDialog
      v-model="memberModal.visible"
      :title="memberModal.title"
      width="550px"
      height="auto"
      @success="memberModal.visible = false"
    >
      <div v-loading="memberModal.loading" class="customer-info-box">
        <template v-if="memberList.length > 0">
          <el-card
            v-for="(item, index) in memberList"
            :key="index"
            shadow="always"
            class="memberCard"
          >
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
        <el-table
          :data="changePriceModel.data"
          style="width: 100%; max-height: 400px; overflow: auto"
          border
        >
          <el-table-column prop="name" label="商品" width="280">
            <template slot-scope="{ row }">
              <div class="fl">
                <div class="goods_picture m-r-10">
                  <ImagePreviewer fit="contain" :src="row.coverUrl" />
                </div>
                <div class="goods_info">
                  <div class="goods_name">{{ row.goodsName }}</div>
                  <div class="goods_salePrice">
                    原价: {{ row.goodsPrices | filtersMoney }}元
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsNum" label="数量" width="99" />
          <el-table-column
            prop="goodsTotalFee"
            label="应付价格(元)"
            width="190"
          />
          <el-table-column prop="name" label="改价(元)" width="190">
            <template slot-scope="{ row }">
              <!-- <el-input v-model="row.payerTotal" maxlength="8" type="number" :class="row.borderWarn ? 'border-warn':''" @input="changePrice()" /> -->
              <el-input-number
                v-model="row.payerTotal"
                controls-position="right"
                style="width: 120px"
                :precision="2"
                :step="0.01"
                :min="0.01"
                :max="row.goodsTotalFeeNum"
                @change="changePrice"
              />
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
            <div class="change-price-model-footer-view-name">
              ￥{{ changePriceModel.goodsTotalFee }}
            </div>
          </div>
          <div class="change-price-model-footer-view">
            <div class="change-price-model-footer-view-label">改价应付:</div>
            <div class="change-price-model-footer-view-name">
              ￥{{ changePriceModel.changePrice }}
            </div>
          </div>
        </div>
      </div>
    </AppDialog>

    <!-- 跟进人员弹框 -->
    <AppDialog
      v-model="followUserModel.visible"
      :title="followUserModel.title"
      width="800px"
      height="auto"
    >
      <div class="follow-user-model">
        <div v-for="(item, index) in followUserModel.data" :key="index">
          <div class="clearfix follow-user">
            <div class="fl roleName">{{ item.roleName }}</div>
            <div class="fl selectUser">
              <el-tag
                v-if="item.userId"
                closable
                @close="delFollowUser(item, index)"
              >{{ item.nickName }}</el-tag>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addFollowUser(index)"
              >+ 选择人员</el-button>
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
    <AppDialog
      v-model="followUserLogModel.visible"
      title="跟进记录"
      width="700px"
      height="490px"
    >
      <followUserLog
        :visible="followUserLogModel.visible"
        :order-no="followUserLogModel.orderNo"
      />
      <div slot="footer" />
    </AppDialog>

    <!-- 退款弹框 -->
    <AppDialog
      v-model="refundModel.visible"
      :title="refundModel.title"
      width="700px"
      height="140px"
    >
      <div style="padding-left: 20px; padding-top: 15px">
        <span>退款时间：</span>
        <el-date-picker
          v-model="refundDateTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期时间"
          :clearable="false"
        />
      </div>
      <div v-if="refundModel.title === '全额退款'" class="full-price">
        <div>
          请确认该操作将变更订单的退款状态为：<span
            class="full-price-ps"
          >已退款</span>
        </div>
        <div class="full-price-box">
          退款金额：<span class="refund-prcie">￥{{ refundModel.prcie }}</span>
        </div>
      </div>
      <div v-if="refundModel.title === '部分退款'" class="partial-price">
        <div class="partial-price-in-box">
          <span>请输入已退款金额</span>
          <el-input
            v-model="refundModel.refundPrice"
            placeholder="请输入"
            maxlength="6"
            class="partial-price-in"
            type="number"
            @blur="setRefundPrice"
          />
          <span>元</span>
          <span
            class="partial-price-in-ps"
          >注：部分退款金额不得大于等于订单金额</span>
        </div>
        <div v-if="refundModel.refundPrice > 0" class="partial-price-in-toast">
          <div class="partial-price-in-toast-l">
            请确认该操作将变更订单的退款状态为：<span>部分退款</span>
          </div>
          <div class="partial-price-in-toast-r">
            退款金额：<span
              class="refund-prcie"
            >￥{{ refundModel.refundPrice }}</span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="footer-box">
          <el-button
            v-if="refundModel.title === '全额退款'"
            type="primary"
            size="small"
            @click="onClickFullRefund"
          >确定</el-button>
          <el-button
            v-if="refundModel.title === '部分退款'"
            type="primary"
            size="small"
            @click="onClickPartialRefund"
          >确定</el-button>
          <el-button size="small" @click="onClickOffRefunds">取消</el-button>
        </div>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import {
  getOrderPage,
  getStudentList,
  goodsOrderPrice,
  goodsOrderExport,
  goodActivesSendSMS,
  addFollowSave,
  findOrderNo,
  orderListRefund,
  orderListPartRefund,
  getChildOrderNoList
} from '@/api/business'
import AppStatus from '@/components/AppStatus'
import AppIconClipboard from '@/components/AppIconClipboard'
import AppDialog from '@/components/AppDialog'
import followUserLog from '@/components/Modal/system/followUser.vue'
import { mapGetters } from 'vuex'
import { userTerminal } from '@/utils/enum'
import { DateFormat } from '@/utils/index'
import { getOptionsValue } from '@/filters'
export default {
  name: 'OrderList',
  components: {
    AppStatus,
    AppIconClipboard,
    AppDialog,
    followUserLog
  },
  props: {
    operation: {
      type: Boolean,
      default: true
    },
    seeDetailModel: {
      type: Boolean,
      default: true
    },
    showBorder: {
      type: Boolean,
      default: false
    },
    operationColumn: {
      type: Boolean,
      default: true
    }
    // search: {
    //   type: Object,
    //   default: null
    // }
  },
  data() {
    return {
      refundDateTime: new Date(),
      loading: false,
      search: {
        order: { label: 'orderNo', value: '' }, // 订单搜索
        time: { label: 1, value: ['', ''] }, // 订单时间
        goodsName: '', // 商品名称
        orderStatus: '', // 订单状态
        orderType: '', // 订单类型
        userTerminal: '', // 渠道来源
        channelSource: '', // 渠道来源
        thirdShopId: '', // 第三方店铺id
        thirdShopName: '', // 第三方店铺名称
        paymentType: '', // 支付方式
        folowerId: '', // 跟进人员id
        folowername: '', // 跟进人员姓名
        payPromotion: '', // 筛选推广
        orderAudit: '', // 审核状态
        current: 1, // 当前页
        size: 10, // 每页条数
        activeIndex: 0, // 当前类别
        activeName: '', // 当前类别名称
        approvalName: '', // 当前审批名称
        pagination: false // 开启分页显示
      },
      listTab: [
        { id: '1', name: '全部订单' },
        { id: '2', name: '线上订单' },
        { id: '3', name: '线下订单' },
        { id: '4', name: '退款订单' }
      ],
      currentTabIndex: '1',
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
        },
        11: {
          type: 'success',
          name: '部分付款'
        },
        12: {
          type: 'error',
          name: '转课关闭'
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
      permsList: this.$route.meta.permsList || [],
      refundModel: {
        visible: false,
        title: '',
        refundPrice: '',
        prcie: '',
        orderNo: ''
      }
    }
  },
  computed: {
    ...mapGetters(['goodsType_obj', 'channelSourceType'])
  },
  watch: {
    // search: {
    //   deep: true, // 深度监听
    //   handler(newVal, oldVal) {
    //     console.log('深度监听', newVal, oldVal)
    //   }
    // }
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
  },
  activated() {},
  methods: {
    getThirdShopName(item, list) {
      if (item.channelSource === 3 && item.userTerminal) {
        const userTerminalName = getOptionsValue(
          item.userTerminal,
          userTerminal
        )
        return `| ${userTerminalName}`
      }
      if (
        item.channelSource &&
        item.channelSource !== 3 &&
        list.thirdShopName
      ) {
        return `| ${list.thirdShopName}`
      }
      return ''
    },
    setSearchOption(search) {
      this.search = search
      console.log('列表查询', search)
      this.getList()
    },
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
      this.$emit('sizeChange', val)
    },
    getList() {
      const that = this

      let type = 1 // 1、全部订单 2、我的订单 3、我的审核
      if (this.search.activeName === '全部订单') {
        type = 1
      } else if (this.search.activeName === '我的订单') {
        type = 2
      } else if (this.search.activeName === '我的审批') {
        type = 3
        console.log('this.search.approvalName', this.search.approvalName)
        if (this.search.approvalName === '初审订单') {
          console.log('初审订单')
          // this.search.orderAudit === 0 || this.search.orderAudit === '' ? this.search.orderAudit = 0 : ''
        } else if (this.search.approvalName === '复审订单') {
          console.log('复审订单')
          // this.search.orderAudit === 1 || this.search.orderAudit === '' ? this.search.orderAudit = 1 : ''
        }
      }
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
        payPromotion: this.search.payPromotion,
        examineStatus:
          this.search.activeName === '我的审批'
            ? this.search.examineStatus
            : this.search.orderAudit,
        orderMax: this.search.endPrice,
        orderMin: this.search.starPrice,
        orderConfigId: this.search.orderType,
        liveRoomCode: this.search.liveRoomCode,
        orderClassification: this.search.orderClassification,
        orderSource: this.search.orderSource,
        type
      }
      /* if (!this.search.commerceInfoValue && !this.search.order.value && !params.orderStatus && !params.paymentType && !params.userTerminal && !params.channelSource && !params.thirdShopId && !params.folowerId && !params.payPromotion && !params.examineStatus && !params.orderConfigId && !params.orderClassification && !params.orderSource && !params.expertId && !params.endTime && !params.startTime) {
        this.$message.error('搜索条件为空，请选择查询条件!')
        return
      }*/
      if (this.search.order.value) {
        console.log()
      } else if (!params.endTime && !params.startTime) {
        this.$message.error('请选择订单时间范围!')
        return
      }
      this.loading = true
      const orderEnum = {
        0: 'expertId',
        1: 'expertId',
        2: 'operateUid',
        3: 'anchorUid',
        4: 'liveOperateUid',
        5: 'centralControlUid',
        6: 'pitcherUid',
        7: 'liveCode'
      }
      params[orderEnum[this.search.commerceEnum]] =
        this.search.commerceInfoValue
      getOrderPage(params)
        .then(res => {
          that.loading = false
          that.tableData = res.data.records.length ? res.data.records : []
          that.total = res.data.total
          this.$emit('tableDataNum', that.tableData.length)
        })
        .catch(() => {
          that.loading = false
          that.$forceUpdate()
        })
    },
    searchPrecisen(params) {
      // 认领精准查询
      this.loading = true
      findOrderNo(params)
        .then(res => {
          this.loading = false
          this.tableData = []
          if (res.code === 1 && res.data !== '' && res.data !== null) {
            this.tableData = [res.data]
            this.total = 1
            this.$emit('tableDataPrecisen', res.data)
          }
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
      if (this.seeDetailModel) {
        this.$router.push({
          path: `/business/orderManage/orderDetail/${row.orderNo}/${row.examineStatus}/${this.search.activeName}`
        })
      } else {
        const date = new Date().getTime()
        const routeUrl = this.$router.resolve(
          `/business/orderManage/orderDetail/${row.orderNo}/${row.examineStatus}/${date}`
        )
        window.open(routeUrl.href, '_blank')
      }
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
        .then(res => {
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
      this.memberModal.current = val
      const params = {
        goodsId: this.memberModal.row.goodsId,
        orderNo: this.memberModal.row.orderNo,
        current: this.memberModal.current,
        size: this.memberModal.size
      }
      getStudentList(params)
        .then(res => {
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
    async openChangePriceModelModel(row, key) {
      const childList = JSON.parse(JSON.stringify(row.list))
      const params = { orderNo: row.orderNo, goodsNo: childList[key].goodsId }
      const c_orderNoList = await getChildOrderNoList(params)
      if (c_orderNoList.code === 1) {
        this.changePriceModel.visible = true
        const list = c_orderNoList.data
        let goodsTotalFee = 0
        list.map(v => {
          v.goodsTotalFee = (Number(v.payerTotal) / 100).toFixed(2)
          v['goodsTotalFeeNum'] = Number(v.payerTotal) / 100
          v.payerTotal = Number(v.payerTotal) / 100
          goodsTotalFee += v.goodsTotalFeeNum
        })
        this.changePriceModel.data = list
        this.changePriceModel.goodsTotalFee = Number(goodsTotalFee).toFixed(2)
        this.changePriceModel.changePrice = Number(goodsTotalFee).toFixed(2)
        this.changePriceModel.orderNo = row.orderNo
      } else {
        this.$notify.error({
          title: '',
          message: '系统异常，无法改价，请重试！'
        })
      }
    },
    // 改价Input改变触发
    changePrice() {
      this.changePriceModel.changePrice = 0
      this.changePriceModel.data.map(v => {
        this.changePriceModel.changePrice += Number(v.payerTotal)
        // 判断是否正常
      })
      this.changePriceModel.changePrice = Number(
        this.changePriceModel.changePrice
      ).toFixed(2)
    },
    // 改价弹框确认按钮
    handleChangePrice() {
      const goodsTotalFee = Number(this.changePriceModel.goodsTotalFee)
      const changePrice = Number(this.changePriceModel.changePrice)
      if (goodsTotalFee > changePrice) {
        this.changePriceModel.loading = true
        const subOrderReqs = []
        this.changePriceModel.data.map(v => {
          subOrderReqs.push({
            id: v.id,
            payerBeforeTotal: v.goodsTotalFee * 100,
            payerTotal: v.payerTotal * 100
          })
        })

        const params = {
          orderNo: this.changePriceModel.orderNo,
          subOrderReqs: subOrderReqs
        }
        goodsOrderPrice(params)
          .then(res => {
            console.log(res, '改价成功')
            this.changePriceModel.loading = false
            this.changePriceModel.visible = false
            this.getList()
          })
          .catch(() => {
            this.changePriceModel.loading = false
          })
      } else {
        this.$notify.error({
          title: '',
          message: '当前无修改价格，请重新修改价格在提交！'
        })
      }
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
        thirdShopId: this.search.thirdShopId,
        orderClassification: this.search.orderClassification,
        orderSource: this.search.orderSource
      }
      // const params = {}
      // Object.keys(filters).forEach(item => {
      //   if (filters[item]) {
      //     params[item] = filters[item]
      //   }
      // })
      goodsOrderExport(params)
        .then(res => {
          this.exportLoading = false
          // window.location = res.data
          // window.open(res.data, '_self')
          var newWin = window.open('loading page', '_self')
          newWin.location.href = res.data // 成功 重定向到目标页面
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    // 点击发送激活短信
    sendActivationSMS(row) {
      this.$delModal({
        tips: '确定发送激活短信?',
        success: () => {
          const data = {
            orderNo: row.orderNo
          }
          // this.$emit('delHandle', node.data)
          goodActivesSendSMS(data).then(res => {
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
        success: res => {
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
        row.followers.map(v => {
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
        this.followUserModel.data.map(v => {
          v.userId && users.push(v)
        })
      }
      const data = {
        orderNo: this.followUserModel.orderNo,
        subOrderId: this.followUserModel.subOrderId,
        users
      }
      addFollowSave(data)
        .then(res => {
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
    },
    openFullRefund(row, e) {
      this.refundDateTime = new Date()
      this.refundModel.visible = true
      this.refundModel.title = '全额退款'
      this.refundModel.refundPrice = ''
      this.refundModel.prcie =
        e.balanceFee > 0 ? Number(e.balanceFee / 100).toFixed(2) : '0.00'
      this.refundModel.orderNo = row.orderNo
    },
    openPartialRefund(row, e) {
      this.refundDateTime = new Date()
      this.refundModel.visible = true
      this.refundModel.title = '部分退款'
      this.refundModel.refundPrice = ''
      this.refundModel.orderNo = row.orderNo
      this.refundModel.prcie =
        e.balanceFee > 0 ? Number(e.balanceFee / 100).toFixed(2) : '0.00'
    },
    setOrderRefund() {
      const formData = new FormData()
      formData.append('orderNo', this.refundModel.orderNo)
      formData.append(
        'refundDate',
        DateFormat(new Date(this.refundDateTime), 'yyyy-MM-dd hh:mm:ss')
      )
      orderListRefund(formData)
        .then(res => {
          if (res.code === 1) {
            this.$message({
              message: '退款成功',
              type: 'success'
            })
            this.getList()
            this.refundModel.visible = false
          }
        })
        .catch(() => {})
    },
    orderListPartRefund(prcie) {
      const formData = new FormData()
      formData.append('orderNo', this.refundModel.orderNo)
      formData.append('balanceFee', prcie)
      formData.append(
        'refundDate',
        DateFormat(new Date(this.refundDateTime), 'yyyy-MM-dd hh:mm:ss')
      )
      orderListPartRefund(formData)
        .then(res => {
          if (res.code === 1) {
            this.$message({
              message: '退款成功',
              type: 'success'
            })
            this.getList()
            this.refundModel.visible = false
          }
        })
        .catch(() => {})
    },
    // 全额退款
    onClickFullRefund() {
      this.setOrderRefund()
    },
    isNumeric(n) {
      var reg = /^[0-9]+\.?[0-9]*$/
      if (reg.test(n)) {
        return true
      }
      return false
    },
    // 部分退款
    onClickPartialRefund() {
      const prcie = this.refundModel.prcie
      const inPrice = this.refundModel.refundPrice
      if (this.isNumeric(inPrice) && this.isNumeric(prcie)) {
        if (prcie - inPrice >= 0) {
          this.orderListPartRefund(inPrice)
        } else {
          this.$message.error('部分退款金额不得大于等于订单金额')
        }
      } else {
        this.$message.error('金额请输入数字')
      }
    },
    setRefundPrice(val) {
      if (this.refundModel.refundPrice > 0) {
        this.refundModel.refundPrice = Number(
          this.refundModel.refundPrice
        ).toFixed(2)
      }
    },
    // 关闭退款弹窗
    onClickOffRefunds() {
      this.refundModel.visible = false
      this.refundModel.title = ''
      this.refundModel.refundPrice = ''
      this.refundModel.prcie = ''
    }
  }
}
</script>

<style scoped lang="scss">
.page_wrap {
  min-width: 1200px;
  height: 100%;
  // background-color: #fff;
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
    .footer-tabs {
      margin-top: 16px;
    }
    .table-module {
      padding: 0 20px;

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
          background: #f3f3f3;
          border-radius: 6px;
          .header-item {
            float: left;
            box-sizing: border-box;
            font-size: 16px;
            color: #333333;
            position: relative;
            &:nth-child(1) {
              width: 21%;
              padding-left: 16px;
            }
            &:nth-child(2) {
              width: 15%;
            }
            &:nth-child(3) {
              width: 15%;
            }
            &:nth-child(4) {
              width: 13%;
            }
            &:nth-child(5) {
              width: 15%;
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
              width: 8%;
            }
            &:nth-child(11) {
              width: 8%;
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
            background: #fbfcfe;
            border: 1px solid #eee;
            min-height: 44px;
            line-height: 28px;
            height: auto;
            overflow: hidden;
            color: #333;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            //   justify-content: space-between;
            border-radius: 8px 8px 0px 0px;
            .table-title-row-l {
              display: flex;
              height: 100%;
              align-items: center;
              .order-box {
                width: 750px;
              }
              .pay-box {
                width: 100px;
              }
              .audit-list {
                margin-left: 20px;
                display: flex;
                justify-items: center;
                .audit-box {
                  line-height: 24px;
                  padding: 0 10px;
                  height: 24px;
                  font-size: 12px;
                  font-family: MicrosoftYaHei;
                  color: #ff7d00;
                  background: #fff2e6;
                  border-radius: 12px;
                  display: inline;
                  .icon-svg {
                    margin-right: 4px;
                  }
                }
                .audit-box-succeed {
                  background: #e6f7ea;
                  color: #00b42a;
                }
                .audit-box-fail {
                  background: #feecec;
                  color: #f53f3f;
                }
                .audit-box-review {
                  background: #fff2cc;
                  color: #ffc619;
                }
              }
            }
            .title-item {
              margin-right: 24px;
              height: 42px;
              line-height: 42px;
              float: left;
            }
            .title-item-font {
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #777777;
              span {
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #333333;
              }
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
          .table-body {
            border-radius: 0px 0px 8px 8px;
            border: 1px solid #e7e7e7;
            border-top: none;
            padding: 13px 20px 0 13px;
            .table-body-row {
              border-bottom: 1px solid #e7e7e7;
              padding-bottom: 13px;
              margin-bottom: 13px;
              width: 100%;
              display: flex;
              align-items: center;
              .body-item {
                box-sizing: border-box;
                position: relative;
                &:nth-child(1) {
                  width: 23%;
                }
                &:nth-child(2) {
                  width: 15%;
                }
                &:nth-child(3) {
                  width: 15%;
                }
                &:nth-child(4) {
                  width: 14%;
                }
                &:nth-child(5) {
                  width: 15%;
                }
                &:nth-child(6) {
                  width: 10%;
                }
                &:nth-child(7) {
                  display: flex;
                  width: 10%;
                  justify-content: space-between;
                  // width: 10%;
                }
                &:nth-child(8) {
                  width: 10%;
                }
                &:nth-child(9) {
                  width: 10%;
                }
                &:nth-child(10) {
                  width: 8%;
                }
                &:nth-child(11) {
                  width: 8%;
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
            .table-body-row-box {
              // border-radius: 8px;
              border: none;
              padding-bottom: 0;
            }
          }
        }
      }
    }
    .table-module-border {
      padding: 0px;
      border-radius: 8px;
      border: 1px solid #e7e7e7;
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
::v-deep .ss-material-box-header-title {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold !important;
  color: #333333;
}
.full-price {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  padding: 20px;
  .full-price-ps {
    font-size: 14px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
  }
  .full-price-box {
    display: flex;
    justify-content: flex-end;
    font-size: 16px;
    padding-top: 32px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #333333;
  }
  .refund-prcie {
    color: #f53f3f;
  }
}
.partial-price {
  padding: 20px;
  .partial-price-in-box {
    .partial-price-in {
      width: 92px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      margin: 0 8px;
    }
    .partial-price-in-ps {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #f53f3f;
      margin-left: 18px;
    }
  }
  .partial-price-in-toast {
    display: flex;
    justify-content: space-between;
    margin-top: 23px;
    .partial-price-in-toast-l {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      span {
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
      }
    }
    .partial-price-in-toast-r {
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
    }
  }
  .refund-prcie {
    color: #f53f3f;
  }
}
.footer-box {
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}
.m-r20 {
  margin-right: 20px;
}
::v-deep .el-input__inner {
  height: 32px;
}
::v-deep ::-webkit-scrollbar-track {
  background: #ededed;
  border-radius: 0;
}
::v-deep ::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
}
::v-deep :hover ::-webkit-scrollbar-track-piece {
  cursor: pointer;
  background: #ededed;
  border-radius: 0;
}

::v-deep :hover::-webkit-scrollbar-thumb:hover {
  cursor: pointer;
  border-radius: 5px;
  background: #acacac;
  transition: color 0.2s ease;
}

::v-deep :hover::-webkit-scrollbar-thumb:vertical {
  cursor: pointer;
  border-radius: 5px;
  background: #acacac;
  transition: color 0.2s ease;
}
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type='number'] {
  -moz-appearance: textfield;
}
.border-warn ::v-deep .el-input__inner {
  border-radius: 4px;
  border: 1px solid #f53f3f !important;
}
.loading-box {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 1;
}
</style>
