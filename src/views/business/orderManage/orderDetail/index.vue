<template>
  <div class="order-box" :class="contenShow ? '' : 'h100'">
    <div v-if="contenShow" class="order-box-main">
      <div class="crumbs-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            :to="{ path: getSourceObj.url }"
            class="nav-list"
          >{{ getSourceObj.lable }}</el-breadcrumb-item>
          <el-breadcrumb-item class="nav-add">订单详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <div
          class="order-status order-status-review"
          :class="orderStatusDataMap.className"
        >
          <span>
            <svg-icon
              :icon-class="orderStatusDataMap.iconClass"
              class="icon-svg"
            />{{ orderStatusDataMap.text }}
          </span>
        </div>
      </div>

      <div class="common-box m-t32">
        <div class="common-title">基本信息</div>
      </div>
      <div class="list-info m-b20">
        <div class="list-child">
          <div class="list-child-title">订单号：</div>
          <div class="list-child-info">{{ detail.orderNo || '--' }}</div>
        </div>
        <div class="list-child">
          <div class="list-child-title">成交来源：</div>
          <div v-if="detail.channelSource != 17" class="list-child-info">
            {{ detail.channelSource | getOptionsValue(channelSourceType) }}
          </div>
          <div v-else class="list-child-info">
            {{
              detail.transactionSource === 9 ? '获客线下收款' : '博商销售成交'
            }}
          </div>
        </div>
        <div class="list-child">
          <div class="list-child-title">下单时间：</div>
          <div class="list-child-info">{{ detail.createTime || '--' }}</div>
        </div>
      </div>
      <div class="list-info m-b20">
        <div v-if="detail.channelSource === 17" class="list-child">
          <div class="list-child-title">渠道：</div>
          <div class="list-child-info">线下录单</div>
        </div>
        <div class="list-child">
          <div class="list-child-title">下单场景：</div>
          <div class="list-child-info">
            {{ orderCommerceDTO.orderSourceName }}
          </div>
        </div>
        <div class="list-child">
          <div class="list-child-title">流量类型：</div>
          <div class="list-child-info">
            {{ orderCommerceDTO.orderClassificationName }}
          </div>
        </div>
        <div
          v-if="orderCommerceDTO.orderClassification === 1"
          class="list-child"
        >
          <div class="list-child-title">投放账号：</div>
          <div class="list-child-info">{{ orderCommerceDTO.liveAccount }}</div>
        </div>
      </div>

      <div class="list-info m-b20">
        <div class="list-child">
          <div class="list-child-title">订单类型：</div>
          <div class="list-child-info">{{ orderType }}</div>
        </div>
        <div v-if="orderType === '赠送'" class="list-child">
          <div class="list-child-title">赠送类型：</div>
          <div class="list-child-info">{{ detail.type || '--' }}</div>
        </div>
        <div v-if="orderType === '新购' || orderType === ''" class="list-child">
          <div class="list-child-title">录入操作者：</div>
          <div class="list-child-info">{{ detail.createUserName || '--' }}</div>
        </div>
        <div v-if="orderType === '新购'" class="list-child">
          <div class="list-child-title">是否转课中：</div>
          <div class="list-child-info">
            {{ detail.isTransfer === 1 ? '是' : '否' }}
          </div>
        </div>
        <div v-if="orderType === '赠送'" class="list-child">
          <div class="list-child-title">赠送操作者：</div>
          <div class="list-child-info">{{ detail.createUserName || '--' }}</div>
        </div>
        <div v-if="orderType === '转课'" class="list-child">
          <div class="list-child-title">转课操作人：</div>
          <div class="list-child-info">{{ detail.createUserName || '--' }}</div>
        </div>
        <div
          v-if="
            orderType === '转课' &&
              detail.transferParentOrderNo !== '' &&
              detail.transferParentOrderNo !== undefined
          "
          class="list-child"
        >
          <div class="list-child-title">转课原订单：</div>
          <div class="list-child-info">
            <div
              class="a-link"
              @click="openDetailPage(detail.transferParentOrderNo, true, 1)"
            >
              {{ detail.transferParentOrderNo }}
            </div>
          </div>
        </div>
      </div>
      <div class="list-info list-info-top-border m-b20">
        <div
          v-if="orderType === '新购' && transferNo.length"
          class="list-child"
        >
          <div class="list-child-title">转课订单号：</div>
          <div class="list-child-info">
            <div
              v-for="item in transferNo"
              :key="item.id"
              class="a-link"
              @click="openDetailPage(item.orderNo, true, 1)"
            >
              {{ item.orderNo }}
            </div>
          </div>
        </div>
        <!-- <div class="list-child">
          <div class="list-child-title">招生老师：</div>
          <div class="list-child-info list-child-info-height">{{ detail.enrollmentTeacherName || '--' }}</div>
        </div> -->
        <div class="list-child">
          <div class="list-child-title">优惠金额：</div>
          <div class="list-child-info list-child-info-height">
            {{ detail.discountsFee }}
          </div>
        </div>
        <!-- <div class="list-child">
          <div class="list-child-title">结算时间：</div>
          <div class="list-child-info list-child-info-height">---</div>
        </div> -->
        <div class="list-child">
          <div class="list-child-title">招生老师：</div>
          <div class="list-child-info list-child-info-height">
            {{ detail.enrollmentTeacherName || '--' }}
          </div>
        </div>
      </div>
      <div
        v-if="orgInfo.organizationId === 1000 && detail.channelSource === 13"
      >
        <div class="common-box m-t32">
          <div class="common-title">伏羲云直播信息</div>
        </div>
        <div class="list-info m-b20">
          <div class="list-child">
            <div class="list-child-title">直播类型：</div>
            <div class="list-child-info">
              {{ returnLiveModel(detail.liveModel) || '--' }}
            </div>
          </div>
          <div class="list-child">
            <div class="list-child-title">直播间ID：</div>
            <div class="list-child-info">{{ detail.liveRoomCode || '--' }}</div>
          </div>
        </div>
        <div class="list-info m-b20">
          <div class="list-child">
            <div class="list-child-title">直播老师：</div>
            <div class="list-child-info">{{ detail.teacherName || '--' }}</div>
          </div>
          <div class="list-child">
            <div class="list-child-title">素材名称：</div>
            <div class="list-child-info">{{ detail.videoName || '--' }}</div>
          </div>
        </div>
      </div>
      <div
        v-if="
          orderCommerceDTO.orderSource && orderCommerceDTO.orderSource !== 0
        "
      >
        <div class="common-box m-t32">
          <div class="common-title">带货信息</div>
        </div>
        <div class="list-info m-b20">
          <div class="list-child">
            <div class="list-child-title long-title">达人昵称：</div>
            <div class="list-child-info">{{ orderCommerceDTO.expertName }}</div>
          </div>
          <div class="list-child">
            <div class="list-child-title">达人ID：</div>
            <div class="list-child-info">{{ orderCommerceDTO.expertId }}</div>
          </div>
          <div class="list-child">
            <div class="list-child-title">达人运营：</div>
            <div class="list-child-info">
              {{ orderCommerceDTO.operateName }}
            </div>
          </div>
        </div>
        <template v-if="orderCommerceDTO.orderSource === 2">
          <div class="list-info m-b20">
            <div class="list-child">
              <div class="list-child-title long-title">直播排班计划ID：</div>
              <div class="list-child-info">{{ orderCommerceDTO.liveCode }}</div>
            </div>
            <div class="list-child">
              <div class="list-child-title">主播：</div>
              <div class="list-child-info">
                {{ orderCommerceDTO.anchorName }}
              </div>
            </div>
            <div class="list-child">
              <div class="list-child-title">主播运营：</div>
              <div class="list-child-info">
                {{ orderCommerceDTO.liveOperateName }}
              </div>
            </div>
          </div>
          <div class="list-info m-b20">
            <div class="list-child">
              <div class="list-child-title long-title">投手：</div>
              <div class="list-child-info">
                {{ orderCommerceDTO.advertiseName }}
              </div>
            </div>
            <div class="list-child">
              <div class="list-child-title">直播中控：</div>
              <div class="list-child-info">
                {{ orderCommerceDTO.controlName }}
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-if="orderType === '赠送'" class="list-info m-t20">
        <div v-if="detail.type === '关联订单赠送'" class="list-child">
          <div class="list-child-title">关联订单号：</div>
          <div
            v-if="detail.giveParentOrderNo"
            class="list-child-info"
            @click="openDetailPage(detail.giveParentOrderNo, true, 1)"
          >
            <span class="a-link">{{ detail.giveParentOrderNo }}</span>
          </div>
          <div v-else class="list-child-info">
            {{ detail.giveParentOrderNo || '--' }}
          </div>
        </div>
      </div>

      <div
        v-if="
          (orderType === '新购' ||
            orderType === '' ||
            orderType === '预存' ||
            orderType === '转课') &&
            paymentInfoVoList.length > 0
        "
        class="common-box m-t32"
      >
        <div class="common-title">支付信息</div>
      </div>
      <div
        v-if="
          orderType === '新购' ||
            orderType === '' ||
            orderType === '预存' ||
            orderType === '转课'
        "
        class="water-box"
      >
        <div
          v-for="(item, index) in paymentInfoVoList"
          :key="item.id"
          class="water-child"
        >
          <div class="water-child-title">
            <span>交易流水{{ index + 1 }}</span>
            <span v-if="item.type === 1" class="water-child-ok">收款</span>
            <span
              v-else-if="item.type === 3"
              class="water-child-no"
            >财务操作退款</span>
            <span v-else class="water-child-no">退款</span>
          </div>
          <div class="water-child-list">
            <div class="water-child-list-child">
              <div class="water-child-list-child-title">收款渠道：</div>
              <div class="water-child-list-child-info">{{ item.channel }}</div>
            </div>
            <div
              v-if="item.channel != '钱包支付'"
              class="water-child-list-child"
            >
              <div class="water-child-list-child-title">收款单位：</div>
              <div class="water-child-list-child-info">{{ item.company }}</div>
            </div>
            <div
              v-if="item.channel === '钱包支付'"
              class="water-child-list-child"
            >
              <div class="water-child-list-child-title">付款账号：</div>
              <div class="water-child-list-child-info">
                {{ item.paymentUserPhone }}
              </div>
            </div>
            <div
              v-if="item.channel != '钱包支付'"
              class="water-child-list-child"
            >
              <div class="water-child-list-child-title">收款账号：</div>
              <div class="water-child-list-child-info">{{ item.account }}</div>
            </div>
            <div
              v-if="item.channel === '钱包支付'"
              class="water-child-list-child"
            >
              <div class="water-child-list-child-title">实付金额：</div>
              <div class="water-child-list-child-info">
                <span
                  v-if="item.type === 1"
                  class="water-ok"
                >¥{{ item.payerTotal }}</span>
                <span v-else class="water-no">- ¥{{ item.payerTotal }}</span>
              </div>
            </div>
          </div>
          <div class="water-child-list">
            <div
              v-if="item.channel != '钱包支付'"
              class="water-child-list-child"
            >
              <div class="water-child-list-child-title">交易流水号：</div>
              <div class="water-child-list-child-info">
                {{ item.transactionId }}
              </div>
            </div>
            <div
              v-if="item.channel != '钱包支付'"
              class="water-child-list-child"
            >
              <div class="water-child-list-child-title">交易时间：</div>
              <div class="water-child-list-child-info">{{ item.payTime }}</div>
            </div>
            <div
              v-if="item.channel != '钱包支付'"
              class="water-child-list-child"
            >
              <div class="water-child-list-child-title">流水金额：</div>
              <div class="water-child-list-child-info">
                <span
                  v-if="item.type === 1"
                  class="water-ok"
                >¥{{ item.payerTotal }}</span>
                <span v-else class="water-no">- ¥{{ item.payerTotal }}</span>
              </div>
            </div>
          </div>
          <div
            v-if="item.voucherList.length && detail.channelSource !== 21"
            class="water-child-list"
          >
            <div class="water-child-list-child water-child-list-child-img-list">
              <div class="water-child-list-child-title">交易凭证：</div>
              <div
                class="water-child-list-child-info water-child-list-child-info-flex"
              >
                <div
                  v-for="(items, i) in item.voucherList"
                  :key="i"
                  class="img-box"
                  @click="imageUrlArr(item.voucherList)"
                >
                  <el-image
                    style="width: 120px; height: 90px; border-radius: 4px"
                    :src="items"
                    fit="cover"
                    :preview-src-list="imageUrlArray"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-if="JSON.stringify(receiverDetails) !== '{}'">
        <div class="common-box m-t32">
          <div class="common-title">客户收货</div>
        </div>
        <div class="water-box">
          <div class="list-info m-b20">
            <div class="list-child">
              <div class="list-child-title">收货姓名：</div>
              <div class="list-child-info">
                {{ receiverDetails.receiverName || '--' }}
              </div>
            </div>
            <div class="list-child">
              <div class="list-child-title">收货手机号：</div>
              <div class="list-child-info">
                {{ receiverDetails.receiverPhone || '--'
                }}<i
                  v-if="
                    receiverDetails.receiverPhone.indexOf('xxxx') > 0 ||
                      receiverDetails.receiverPhone.indexOf('XXXX') > 0
                  "
                  class="pointer el-icon-view"
                  @click="toShowReceiverPhone"
                />
              </div>
            </div>
            <div class="list-child">
              <div class="list-child-title">收货地址：</div>
              <div class="list-child-info">
                {{ receiverDetails.receiverAddress || '--' }}
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="logisticsDetails && logisticsDetails.dataList">
        <div class="common-box m-t32">
          <div class="common-title">物流动态</div>
        </div>
        <div
          v-for="(item, index) in logisticsDetails.dataList"
          :key="index"
          class="water-box"
        >
          <div class="logistics-box">
            <div
              style="display: flex; justify-content: space-between; width: 40%"
            >
              <div class="title">物流名称：{{ item.logisticName || '--' }}</div>
              <div class="title">物流单号：{{ item.expressCode || '--' }}</div>
            </div>
            <div
              v-for="(i, z) in item.dataList"
              :key="z"
              style="margin-top: 10px"
            >
              <span class="time">{{ i.acceptTime }}</span>
              <div>
                {{ i.acceptStation }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-if="transferVoList.length" class="common-box m-t32">
        <div class="common-title">转课信息</div>
      </div>
      <div v-if="transferVoList.length" class="turn-box">
        <div
          v-for="(item, index) in transferVoList"
          :key="item.id"
          class="turn-child"
        >
          <div class="turn-child-title">转课订单{{ index + 1 }}</div>
          <div class="turn-child-info">
            <div class="turn-info-child">
              <div class="turn-info-child-title">
                {{ orderType === '新购' ? '转课订单号：' : '转课原订单号：' }}
              </div>
              <div class="turn-info-child-info">
                <span
                  class="a-link"
                  @click="openDetailPage(item.orderNo, true, 1)"
                >{{ item.orderNo }}</span>
              </div>
            </div>
            <div class="turn-info-child">
              <div class="turn-info-child-title">商品名称：</div>
              <div class="turn-info-child-info">{{ item.goodsName }}</div>
            </div>
          </div>
          <div class="turn-child-info">
            <div class="turn-info-child">
              <div class="turn-info-child-title">转课操作人：</div>
              <div class="turn-info-child-info">{{ item.createUserName }}</div>
            </div>
            <div class="turn-info-child">
              <div class="turn-info-child-title">转课时间：</div>
              <div class="turn-info-child-info">{{ item.createTime }}</div>
            </div>
            <div class="turn-info-child">
              <div class="turn-info-child-title">转课金额：</div>
              <div class="turn-info-child-info">
                <span
                  v-if="orderType === '新购'"
                  class="span-red"
                >-¥{{ item.transferFee }}</span>
                <span
                  v-if="orderType === '转课'"
                  class="span-greed"
                >¥{{ item.transferFee }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="common-box m-t32">
        <div class="common-title">来源用户</div>
      </div>
      <div class="list-info m-b20">
        <div class="list-child">
          <div class="list-child-title">用户ID：</div>
          <div
            v-if="detail.sourceUserVo && detail.sourceUserVo.sourceUserId"
            class="list-child-info"
          >
            <span>{{
              (detail.sourceUserVo && detail.sourceUserVo.sourceUserId) ||
                '--'
            }}
            </span>
          </div>
          <div v-else class="list-child-info"><span>--</span></div>
        </div>
        <div class="list-child">
          <div class="list-child-title">用户手机：</div>
          <div class="list-child-info">
            <!-- {{ detail.sourceUserVo && detail.sourceUserVo.sourceUserPhone || '--' }} -->
            <div class="list-child-info">
              {{
                detail.sourceUserVo && detail.sourceUserVo.sourceUserPhone
                  ? `(+${detail.sourceUserVo.sourcePhoneAreaCode})${detail.sourceUserVo.sourceUserPhone}`
                  : '--'
              }}
              <i
                v-if="
                  detail.sourceUserVo &&
                    detail.sourceUserVo.sourceUserPhone &&
                    detail.sourceUserVo.sourceUserPhone.indexOf('***') > 0
                "
                class="pointer el-icon-view"
                @click="toShowSourceUserPhone"
              />
            </div>
          </div>
        </div>
        <div class="list-child">
          <div class="list-child-title">用户邮箱：</div>
          <div class="list-child-info">
            {{
              (detail.sourceUserVo && detail.sourceUserVo.sourceUserEmail) ||
                '--'
            }}
          </div>
        </div>
      </div>
      <div class="common-box m-t32">
        <div class="common-title">购买用户</div>
      </div>
      <div class="list-info m-b20">
        <div class="list-child">
          <div class="list-child-title">用户ID：</div>
          <div v-if="detail.addUserVo.id" class="list-child-info">
            <span>{{ detail.addUserVo.id || '--' }} </span>
          </div>
          <div v-else class="list-child-info"><span>--</span></div>
          <!-- <div class="list-child-info"><span class="a_link" @click="gotoUserDetails(detail.userId)">{{ detail.userId || '--' }}</span></div> -->
        </div>
        <div class="list-child">
          <div class="list-child-title">买家昵称：</div>
          <div class="list-child-info">{{ detail.addUserVo.name || '--' }}</div>
        </div>
        <div class="list-child">
          <div class="list-child-title">买家手机号：</div>
          <div class="list-child-info">
            {{
              detail.addUserVo.phone
                ? `(+${detail.addUserVo.phoneAreaCode})${detail.addUserVo.phone}`
                : '--'
            }}
            <i
              v-if="
                detail.addUserVo.phone &&
                  detail.addUserVo.phone.indexOf('***') > 0
              "
              class="pointer el-icon-view"
              @click="toShowPhoneNumber"
            />
          </div>
        </div>
      </div>
      <div class="list-info m-b20">
        <div class="list-child">
          <div class="list-child-title">买家邮箱：</div>
          <div class="list-child-info">
            {{ detail.addUserVo.email || '--' }}
            <i
              v-if="
                detail.addUserVo.email &&
                  detail.addUserVo.email.indexOf('*') > 0
              "
              class="pointer el-icon-view"
              @click="toShowEmail"
            />
          </div>
        </div>
        <div class="list-child">
          <div class="list-child-title">买家姓名：</div>
          <div class="list-child-info">
            {{ detail.addUserVo.realName || '--' }}
          </div>
        </div>
      </div>
      <div class="common-box m-t32">
        <div class="common-title">用户公司信息</div>
      </div>
      <div class="list-info m-b20">
        <div class="list-child">
          <div class="list-child-title">公司名称：</div>
          <div class="list-child-info">
            {{ detail.addUserVo.company || '--' }}
          </div>
        </div>
        <div class="list-child">
          <div class="list-child-title">职位：</div>
          <div class="list-child-info">
            {{ detail.addUserVo.position || '--' }}
          </div>
        </div>
        <div class="list-child">
          <div class="list-child-title">所在行业：</div>
          <div class="list-child-info">
            {{ detail.addUserVo.industry || '--' }}
          </div>
        </div>
      </div>
      <div class="list-info m-b20">
        <div class="list-child">
          <div class="list-child-title">年营业额：</div>
          <div class="list-child-info">
            {{ detail.addUserVo.turnover || '--' }}
          </div>
        </div>
        <div class="list-child">
          <div class="list-child-title">主营业务：</div>
          <div class="list-child-info">
            {{ detail.addUserVo.introduce || '--' }}
          </div>
        </div>
      </div>
      <div class="list-info m-b20">
        <div class="list-child">
          <div class="list-child-title">公司地址：</div>
          <div class="list-child-info">
            {{ detail.addUserVo.areaName_address || '--' }}
          </div>
        </div>
      </div>
      <div class="common-box m-t32">
        <div class="common-title">商品信息</div>
      </div>
      <div v-if="orderType === '预存'" class="table-box">
        <el-table
          :data="detail.list"
          style="width: 100%; border-radius: 8px; border: 1px solid #e7e7e7"
        >
          <el-table-column label="商品名称" width="280">
            <template slot-scope="scope">
              <div class="table-img-box">
                <div class="table-img-box-l">
                  <img :src="scope.row.coverUrl" alt="" />
                </div>
                <div class="table-img-box-r table-txt">钱包存款</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品类型" width="130">
            <p>专栏</p>
          </el-table-column>
          <el-table-column label="商品单价（元）">
            <p>0</p>
          </el-table-column>
          <el-table-column label="数量">
            <p>1</p>
          </el-table-column>
          <el-table-column label="优惠金额（元）">
            <p>0</p>
          </el-table-column>
          <el-table-column label="小计（元）">
            <p>0</p>
          </el-table-column>
        </el-table>
      </div>
      <div v-else class="table-box">
        <el-table
          :data="detail.list"
          style="width: 100%; border-radius: 8px; border: 1px solid #e7e7e7"
        >
          <el-table-column label="商品名称" width="280">
            <template slot-scope="scope">
              <div class="table-img-box">
                <div class="table-img-box-l">
                  <img :src="scope.row.coverUrl" alt="" />
                </div>
                <div class="table-img-box-r table-txt">
                  {{ scope.row.goodsName }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品类型" width="110">
            <template slot-scope="scope">
              <span class="table-txt">
                {{ goodsType_obj[scope.row.goodsType] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品规格序号" width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.materialSpecVo" class="table-txt">{{
                scope.row.materialSpecVo.sort
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="商品规格名称" width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.materialSpecVo" class="table-txt">{{
                scope.row.materialSpecVo.specName
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="商品单价（元）">
            <template slot-scope="scope">
              <!-- <span class="table-txt">{{ (scope.row.goodsPrices || 0) | filtersMoney }}</span> -->
              <span class="table-txt">{{ scope.row.goodsPrices }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量">
            <template slot-scope="scope">
              <!-- <span class="table-txt">{{ (scope.row.goodsNum || 0) | filtersMoney }}</span> -->
              <span class="table-txt">{{ scope.row.goodsNum }}</span>
            </template>
          </el-table-column>
          <el-table-column label="优惠金额（元）">
            <template slot-scope="scope">
              <!-- <span class="table-txt">{{ (scope.row.discountsFee || 0) | filtersMoney }}</span> -->
              <span class="table-txt">{{ scope.row.discountsFee }}</span>
            </template>
          </el-table-column>
          <el-table-column label="小计（元）">
            <template slot-scope="scope">
              <!-- <span class="table-txt"> {{ (scope.row.payerTotal || 0) | filtersMoney }}</span> -->
              <span class="table-txt"> {{ scope.row.subtotal }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" label="优惠原因">
            <template slot-scope="scope">
              <!-- <span class="table-txt"> {{ (scope.row.payerTotal || 0) | filtersMoney }}</span> -->
              <span> {{ scope.row.discountContent }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="a_link" @click="applyAfterSalesCard(scope.row)">
                开通售后卡
              </div>
              <div
                v-if="detail.hasDiscount && orderType === '新购'"
                class="a_link"
                @click="openDiscountModal(scope.row)"
              >
                修改优惠原因
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div v-if="materialSpecVo.length" class="preferential-box table-box">
        <div>商品规格</div>
        <el-table
          :data="materialSpecVo"
          style="width: 380px;border-radius: 8px;border: 1px solid #E7E7E7;margin: 10px 0;"
        >
          <el-table-column
            label="序号"
          >
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="名称"
          >
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.specName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div> -->
      <div class="preferential-box" style="margin-bottom: 15px">
        <div>备注</div>
        <p>{{ detail.remarks }}</p>
        <div class="preferential-info preferential-info-flex">
          <div
            v-for="(items, index) in detail.imageList"
            :key="index"
            class="img-box"
            @click="imageUrlArr(detail.imageList)"
          >
            <el-image
              style="width: 120px; height: 90px; border-radius: 4px"
              :src="items"
              fit="cover"
              :preview-src-list="imageUrlArray"
            />
          </div>
        </div>
      </div>
      <div class="flex preferential-box" style="margin-bottom: 15px">
        <div>智能销售任务：</div>
        <p>{{ detail.taskName }}</p>
      </div>
      <!--       预存的备注商品       -->
      <div v-if="orderType === '预存'" class="common-box m-t32">
        <div class="common-title">备注</div>
      </div>
      <div v-if="orderType === '预存'" class="table-box">
        <el-table
          :data="detail.depositGoodsList"
          style="width: 100%; border-radius: 8px; border: 1px solid #e7e7e7"
        >
          <el-table-column label="商品名称" width="280">
            <template slot-scope="scope">
              <div class="table-img-box">
                <div class="table-img-box-l">
                  <img :src="scope.row.coverUrl" alt="" />
                </div>
                <div class="table-img-box-r table-txt">
                  {{ scope.row.goodsName }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品类型" width="110">
            <template slot-scope="scope">
              <span class="table-txt">
                {{ goodsType_obj[scope.row.goodsType] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品规格序号" width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.specSort" class="table-txt">{{
                scope.row.specSort
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="商品规格名称" width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.specName" class="table-txt">{{
                scope.row.specName
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="商品单价（元）">
            <template slot-scope="scope">
              <!-- <span class="table-txt">{{ (scope.row.goodsPrices || 0) | filtersMoney }}</span> -->
              <span class="table-txt">{{ scope.row.salePrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量">
            <template slot-scope="scope">
              <!-- <span class="table-txt">{{ (scope.row.goodsNum || 0) | filtersMoney }}</span> -->
              <span class="table-txt">{{ scope.row.goodsNum }}</span>
            </template>
          </el-table-column>
          <el-table-column label="优惠金额（元）">
            <template slot-scope="scope">
              <!-- <span class="table-txt">{{ (scope.row.discountsFee || 0) | filtersMoney }}</span> -->
              <span class="table-txt">{{ scope.row.discountsFee }}</span>
            </template>
          </el-table-column>
          <el-table-column label="小计（元）">
            <template slot-scope="scope">
              <!-- <span class="table-txt"> {{ (scope.row.payerTotal || 0) | filtersMoney }}</span> -->
              <span class="table-txt"> {{ scope.row.totalAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" label="优惠原因">
            <template slot-scope="scope">
              <!-- <span class="table-txt"> {{ (scope.row.payerTotal || 0) | filtersMoney }}</span> -->
              <span> {{ scope.row.discountReason }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span
                class="a_link"
                @click="modifyRemarks(scope.row)"
              >修改备注</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div v-if="(orderType === '新购' || orderType === '') && detail.discountsFee > 0" class="preferential-box">
        <div>优惠原因</div>
        <div class="preferential-info">{{ detail.discountContent || '--' }}</div>
      </div> -->
      <div v-if="orderType === '赠送'" class="preferential-box m-b20">
        <div>赠送原因</div>
        <div class="preferential-info">{{ detail.content || '--' }}</div>
      </div>
      <div v-if="orderType === '赠送'" class="preferential-box">
        <div>赠单凭证</div>
        <div class="preferential-info preferential-info-flex">
          <div
            v-for="(items, index) in detail.giveVoucherList"
            :key="index"
            class="img-box"
            @click="imageUrlArr(detail.giveVoucherList)"
          >
            <el-image
              style="width: 120px; height: 90px; border-radius: 4px"
              :src="items"
              fit="cover"
              :preview-src-list="imageUrlArray"
            />
          </div>
        </div>
      </div>
      <div v-if="orderType === '转课'" class="preferential-box m-t32">
        <div>转课原因</div>
        <div class="preferential-info">
          {{ detail.transferContent || '--' }}
        </div>
      </div>
      <div v-if="imageData.length" class="image-box">
        <div v-for="item in imageData" :key="item" class="image-block">
          <el-image
            style="width: 120px; height: 90px; border-radius: 4px"
            :src="item"
            fit="cover"
            :preview-src-list="imageData"
          />
        </div>
      </div>
      <div v-if="afterSaleList.length" class="common-box m-t32">
        <div class="common-title">退款记录</div>
      </div>
      <div v-if="afterSaleList.length" class="table-box">
        <el-table
          :data="afterSaleList"
          style="width: 100%; border-radius: 8px; border: 1px solid #e7e7e7"
        >
          <el-table-column label="商品名称" width="330">
            <template slot-scope="scope">
              <div class="table-img-box">
                <div class="table-img-box-l">
                  <ImagePreviewer
                    :src="scope.row.coverUrl"
                    fit="contain"
                    style="width: 100%; height: 100%"
                  />
                </div>
                <div class="table-img-box-r table-txt">
                  {{ scope.row.goodsName }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="退款金额（元）" width="180">
            <template slot-scope="scope">
              <span class="table-txt">
                {{ (scope.row.refundFee || 0) | filtersMoney }}</span>
            </template>
          </el-table-column>
          <el-table-column label="退款状态">
            <template slot-scope="scope">
              <span class="table-txt">{{
                {
                  0: '未处理',
                  1: '退款中',
                  2: '已退款',
                  3: '已关闭',
                  4: '退款异常',
                  5: '处理中',
                  6: '商家拒绝退款',
                  7: '部分退款'
                }[scope.row.status]
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="退款类型">
            <template slot-scope="scope">
              <span class="table-txt">{{
                { 1: '仅退款', 3: '财务操作退款' }[scope.row.afterSaleMode]
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间">
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="退款时间">
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.refundTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作人" width="140">
            <template slot-scope="scope">
              <span>{{ scope.row.operationName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <el-button
                class="m-l-20"
                type="text"
                @click="gotoDetailDetail(scope.row)"
              >售后详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="common-box m-t32">
        <div class="common-title">优惠信息</div>
      </div>
      <div class="common-box">
        <el-table
          ref="shenHeDataTable"
          :data="shenheDataArray"
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="headerCellStyle"
        >
          <el-table-column prop="discountType" label="优惠类型">
            <template slot-scope="scope">
              <p v-if="scope.row.discountType === 1">录单优惠</p>
              <p v-if="scope.row.discountType === 2">改价优惠</p>
              <p v-if="scope.row.discountType === 3">第三方优惠</p>
              <p v-if="scope.row.discountType === 4">优惠券</p>
              <p v-if="scope.row.discountType === 5">银行卡优惠</p>
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="优惠商品" />
          <el-table-column prop="discountContent" label="优惠内容" />
          <el-table-column prop="userCouponNo" label="优惠券编码">
            <template slot-scope="scope">
              <p v-if="scope.row.userCouponNo">
                {{ scope.row.userCouponNo }}
              </p>
              <p v-else>-</p>
            </template>
          </el-table-column>
          <el-table-column prop="discountsFee" label="优惠金额">
            <template slot-scope="scope">
              <p>- {{ scope.row.discountsFee }}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="common-box m-t32">
        <div class="common-title">审核记录</div>
      </div>
      <div class="table-box">
        <el-table
          :data="auditRecords"
          style="width: 100%; border-radius: 8px; border: 1px solid #e7e7e7"
        >
          <el-table-column label="审核类型">
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作人">
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.operator }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核状态">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 0" class="audit-box">
                <svg-icon icon-class="audit_wait" class="icon-svg" />待初审
              </div>
              <div
                v-else-if="scope.row.status === 1"
                class="audit-box audit-box-review"
              >
                <svg-icon icon-class="audit_review" class="icon-svg" />待复审
              </div>
              <div
                v-else-if="scope.row.status === 2"
                class="audit-box audit-box-fail"
              >
                <svg-icon icon-class="audit_fail" class="icon-svg" />审核失败
              </div>
              <div v-else class="audit-box audit-box-succeed">
                <svg-icon icon-class="audit_success" class="icon-svg" />审核成功
              </div>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.remark }}</span>
            </template>
          </el-table-column>
          <el-table-column label="变更时间">
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.updateTime }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="common-box m-t32">
        <div class="common-title">跟进记录</div>
      </div>
      <div class="recording-box">
        <div class="add-recording" @click="openAddModal">
          <i class="el-icon-plus" />
          新增跟进记录
        </div>
      </div>
      <div class="table-box">
        <el-table
          :data="tableData"
          style="width: 100%; border-radius: 8px; border: 1px solid #e7e7e7"
        >
          <el-table-column label="跟进时间">
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="跟进内容">
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column label="跟进人">
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.createName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="跟进方式">
            <template slot-scope="scope">
              <span class="table-txt">
                {{
                  { 1: '电话', 2: '微信', 3: '站内' }[scope.row.followType]
                }}</span>
            </template>
          </el-table-column>
          <el-table-column label="下次跟进">
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.nextFollowTime }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div style="float: right; margin-top: 12px">
          <el-pagination
            background
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

      <div v-if="orderType === '预存'" class="pay-box m-t64">
        <div
          v-if="
            detail.channelSource === 8 ||
              detail.channelSource === 9 ||
              detail.channelSource === 17
          "
          class="price-common-title m-b8"
        >
          实付金额：<span
            class="price-num-green"
          >¥{{ detail.payerTotal }}</span>
        </div>
        <div v-else class="price-common-title m-b8">
          实付金额：<span
            class="price-num-green"
          >¥{{ detail.payAmountFee }}</span>
        </div>
      </div>
      <div v-else class="pay-box m-t64">
        <div class="price-num m-b8">商品金额：¥{{ detail.goodsTotalFee }}</div>
        <div v-if="detail.discountsFee > 0" class="price-num m-b16">
          优惠金额：-¥{{ detail.discountsFee }}
        </div>
        <div class="price-common-title m-b8">
          应付金额：<span>¥{{ detail.payableFee }}</span>
        </div>
        <div
          v-if="
            detail.channelSource === 8 ||
              detail.channelSource === 9 ||
              detail.channelSource === 17
          "
          class="price-common-title m-b8"
        >
          实付金额：<span
            class="price-num-green"
          >¥{{ detail.payerTotal }}</span>
        </div>
        <div v-else class="price-common-title m-b8">
          实付金额：<span
            class="price-num-green"
          >¥{{ detail.payAmountFee }}</span>
        </div>
        <div
          v-if="detail.transferFee > 0 && orderType === '新购'"
          class="price-common-title m-b8"
        >
          转课金额：<span>-¥{{ detail.transferFee }}</span>
        </div>
        <div
          v-if="detail.transferFee > 0 && orderType === '转课'"
          class="price-common-title m-b8"
        >
          转课金额：<span>¥{{ detail.transferFee }}</span>
        </div>
        <div v-if="detail.refundedFee > 0" class="price-common-title m-b8">
          退款金额：<span>-¥{{ detail.refundedFee }}</span>
        </div>
        <div
          v-if="orderStatus !== 1 && orderStatus !== 3 && orderStatus !== 4"
          class="price-common-title m-b8"
        >
          订单余额：<span class="price-num-blue">¥{{ detail.balanceFee }}</span>
        </div>
        <!-- <div class="price-num m-b8">商品金额：¥{{ detail.goodsTotalFee }}</div>
        <div class="price-num m-b16">优惠金额：-¥{{ detail.discountsFee | filtersMoney }}</div>
        <div class="price-common-title m-b8">应付金额：<span>¥{{ detail.payableFee | filtersMoney }}</span> </div>
        <div class="price-common-title m-b8">实付金额：<span class="price-num-green">¥{{ detail.payerTotal | filtersMoney }}</span></div> -->
      </div>
      <div class="audit-btn-box">
        <el-button
          v-if="
            auditStatus &&
              pageName === '我的审批' &&
              (detail.orderStatus === 10 || detail.orderStatus === 11)
          "
          v-permission="['system:order:addAuditRecords', permsList]"
          class="pass"
          :loading="passLoading"
          @click="onClickOrderPass"
        >通过</el-button>
        <el-button
          v-if="
            auditStatus &&
              pageName === '我的审批' &&
              (detail.orderStatus === 10 || detail.orderStatus === 11)
          "
          v-permission="['system:order:reject', permsList]"
          class="overrule"
          @click="openOverruleModal"
        >驳回</el-button>
        <el-button
          v-if="
            editStatus &&
              statusBtn &&
              (orderType === '新购' ||
                orderType === '赠送' ||
                orderType === '预存') &&
              pageName === '我的订单'
          "
          v-permission="['system:order:addOrderAndUpdate', permsList]"
          class="edit"
          @click="onClickEditForm"
        >修改订单信息</el-button>
        <el-button class="cancel" @click="goBack">返回</el-button>
        <!-- <el-button class="edit" @click="onClickEditForm">DEV测试修改订单信息</el-button> -->
      </div>

      <!-- 新增跟进弹框 -->
      <AppDialog
        v-model="modal.visible"
        :title="modal.title"
        width="700px"
        height="400px"
        @success="addUserFollow"
      >
        <div v-loading="modal.loading" class="p-10 choose_resource m-t-20">
          <el-form ref="form" :model="form" label-width="80px" :rules="rules">
            <el-form-item label="跟进内容" prop="content">
              <el-input
                v-model="form.content"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 10 }"
              />
            </el-form-item>
            <el-form-item label="跟进方式">
              <el-select v-model="form.followType" placeholder="请选择">
                <el-option label="电话" :value="1" />
                <el-option label="微信" :value="2" />
                <el-option label="站内" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="下次跟进">
              <el-date-picker
                v-model="form.nextFollowTime"
                :picker-options="DatePicker"
                type="datetime"
                placeholder="选择日期时间"
              />
            </el-form-item>
          </el-form>
        </div>
      </AppDialog>
      <!-- 驳回原因 -->
      <AppDialog
        v-model="overruleModal.visible"
        :title="overruleModal.title"
        width="700px"
        height="250px"
        @success="addOverrule"
      >
        <div v-loading="overruleModal.loading" class="overrule-box">
          <div class="overrule-title">驳回原因</div>
          <div class="overrule-info">
            <el-input
              v-model="overruleVal"
              type="textarea"
              :autosize="{ minRows: 8, maxRows: 8 }"
              placeholder="请输入内容"
              maxlength="200"
              show-word-limit
            />
          </div>
        </div>
      </AppDialog>
      <!-- 用户详情弹框 -->
      <Modal
        title="用户详情"
        :type="UserInfoDialog.type"
        size="1200px"
        width="1200px"
        :visible.sync="UserInfoDialog.visible"
      >
        <UserInfoModal
          :type="UserInfoDialog.type"
          :visible.sync="UserInfoDialog.visible"
          :user-id="UserInfoDialog.userId"
          @close="UserInfoDialog.visible = false"
        />
      </Modal>
      <!-- 售后订单详情弹框 -->
      <el-drawer
        title="售后订单详情"
        :visible.sync="AfterOrderDialog.visible"
        direction="rtl"
        size="1200px"
      >
        <AfterOrderDetailModal
          :visible="AfterOrderDialog.visible"
          :type="AfterOrderDialog.type"
          :order-no="AfterOrderDialog.orderNo"
        />
      </el-drawer>
      <!-- 修改优惠原因 -->
      <AppDialog
        v-model="discountModal.visible"
        :title="discountModal.title"
        width="700px"
        height="250px"
        @success="confirmDiscount"
      >
        <div class="overrule-box">
          <div class="overrule-title">
            修改优惠原因（<span
              class="text-discount"
            >优惠金额：￥{{ discountModal.discountsFee }}</span>）
          </div>
          <div class="overrule-info">
            <el-input
              v-model="discountReason"
              type="textarea"
              :autosize="{ minRows: 8, maxRows: 8 }"
              placeholder="请输入内容"
              maxlength="200"
              show-word-limit
            />
          </div>
        </div>
      </AppDialog>
    </div>
    <el-skeleton v-else :rows="6" animated />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getOrderDetail,
  goodsAfterSaleList,
  goodsAfterSaleCard,
  orderReject,
  orderPass,
  orderDetailLogistics,
  modifyPrestore,
  modifyDiscount
} from '@/api/business'
import { userFollow, addFollowByOrderNo } from '@/api/user/member'
import AppDialog from '@/components/AppDialog'
import Modal from '@/components/Modal'
import UserInfoModal from '@/components/Modal/user/userInfo'
import AfterOrderDetailModal from '@/components/Modal/order/afterOrderDetail'
import { parseTime } from '@/utils/index'
import { orderStatusMap } from './map'
import { orderSource, orderClassification } from '@/utils/enum'
import {
  getUserPhoneByOrderNo,
  getPhoneByOrderNo,
  getEmailByOrderNo,
  getReceiverPhone
} from '@/api/user/member'
import { findGoodsIdByList } from '@/api/course'
export default {
  name: 'OrderDetail',
  components: {
    AppDialog,
    Modal,
    UserInfoModal,
    AfterOrderDetailModal
  },
  data() {
    return {
      optionsChannel: [],
      optionsChannelValue: '',
      isShowPhoneNumber: true,
      shenheDataArray: [],
      headerCellStyle: {
        'background-color': 'rgb(245, 245, 245)'
      },
      orderStatusMap,
      permsList: this.$route.meta.permsList || [],
      type: '1', // 支付状态
      orderType: '',
      modal: {
        visible: false,
        title: '新增',
        loading: false
      },
      form: {
        content: '',
        userId: '',
        nextFollowTime: '',
        followType: 1
      },
      DatePicker: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      overruleModal: {
        visible: false,
        title: '驳回原因',
        loading: false
      },
      overruleVal: '',
      auditRecords: [], // 审核记录
      paymentInfoVoList: [], // 交易流水
      // 跟进记录数据
      pageSize: 10,
      tableData: [],
      currentPage: 1,
      total: 0,
      rules: {
        content: [
          { required: true, message: '请输入跟进内容', trigger: 'blur' }
        ]
      },
      transferParentOrderNo: [],
      imageData: [],
      detail: {
        orderNo: '', // 订单号
        orderStatus: '', // 订单状态
        createTime: '', // 下单时间
        paymentType: '', // 支付方式.1:微信 2:阿里
        userTerminal: '', // 渠道来源
        list: [],
        addUserVo: {
          areaName: '',
          company: '',
          id: '',
          industry: '',
          introduce: '',
          phone: '',
          email: '',
          position: '',
          realName: '',
          turnover: ''
        }
      },
      afterSaleList: [], // 退款记录
      UserInfoDialog: {
        title: '',
        visible: false,
        type: 1,
        userId: ''
      },
      userInfo: {
        nickName: '',
        userId: ''
      },
      statusBtn: false,
      materialSpecVo: [],
      auditStatus: true,
      pageName: '',
      AfterOrderDialog: {
        type: 1,
        visible: false,
        orderNo: ''
      },
      editStatus: false,
      transferNo: [],
      contenShow: true,
      audit: '',
      orderStatus: '',
      transferVoList: [], // 转课信息
      imageUrlArray: [],
      orderCommerceDTO: {},
      orgInfo: {},
      passLoading: false,
      logisticsDetails: {},
      receiverDetails: {},
      pageSource: '',
      discountReason: '',
      discountModal: {
        loading: false,
        visible: false,
        goodsId: '',
        discountsFee: '',
        title: '修改优惠原因'
      }
    }
  },
  computed: {
    ...mapGetters([
      'channelSourceType',
      'userTerminal_options',
      'orderStatus_options',
      'goodsType_options',
      'paymentType_options',
      'goodsType_obj'
    ]),
    thirdShopName() {
      const thirdShopName =
        this.detail.list &&
        this.detail.list.length &&
        this.detail.list[0].thirdShopName
      return thirdShopName ? ` | ${thirdShopName}` : ''
    },
    orderStatusDataMap() {
      return (
        orderStatusMap[this.detail.orderStatus] ?? {
          text: '',
          className: '',
          iconClass: ''
        }
      )
    },
    getSourceObj() {
      const ps = this.pageSource
      return ps === '资金结算'
        ? { url: '/business/divideAccounts', lable: '资金结算' }
        : { url: '/business/orderManage', lable: '订单管理' }
    }
  },
  watch: {},
  created() {
    // console.log(this.$store.getters.userInfo, 'this.$store.getters.')
    this.pageSource = this.$route.query.source
    this.userInfo = this.$store.getters.userInfo
    this.pageName = this.$route.params.type
  },
  mounted() {
    this.orgInfo = JSON.parse(localStorage.getItem('orgInfo'))
    this.getList()
    this.getDetail()
    this.getGoodsAfterSaleList()
    this.getOrderDetailLogistics()
    console.log(this.$route.meta.permsList, '权限列表')
  },
  methods: {
    async confirmDiscount() {
      if (this.discountReason) {
        await modifyDiscount({
          discountReason: this.discountReason,
          goodsId: this.discountModal.goodsId,
          orderNo: this.$route.params.id
        })
        this.discountReason = ''
        this.discountModal.discountsFee = ''
        this.discountModal.visible = false
        this.getDetail()
      } else {
        this.$notify.error({
          title: '',
          message: '优惠原因不能为空！'
        })
      }
    },
    modifyRemarks() {
      this.$SelectComonUseGoods({
        visible: true,
        tabList: [
          { id: '-1', name: '常用商品', api: '' },
          { id: '5', name: '线下课', api: '' },
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' }
        ],
        tearchSearch: false,
        filterateHidden: true,
        currentId: '-1',
        success: async res => {
          const item = res[0]
          const { data } = await findGoodsIdByList({ goodsId: item.goodsId })
          const specId = data[0]?.specId
          await modifyPrestore({
            goodsId: item.goodsId,
            orderNo: this.$route.params.id,
            salePrice: item.salePrice,
            specId: specId
          })
          this.$message.success('修改成功')
          this.getDetail()
        }
      })
    },
    toShowPhoneNumber() {
      getPhoneByOrderNo(this.detail.orderNo).then(res => {
        if (res.code === 1) {
          this.detail.addUserVo.phone = res.data
          this.isShowPhoneNumber = false
        }
      })
    },
    toShowSourceUserPhone() {
      getUserPhoneByOrderNo(this.detail.orderNo).then(res => {
        if (res.code === 1) {
          this.detail.sourceUserVo.sourceUserPhone = res.data
        }
      })
    },
    toShowEmail() {
      getEmailByOrderNo(this.detail.orderNo).then(res => {
        if (res.code === 1) {
          this.detail.addUserVo.email = res.data.email
        }
      })
    },
    toShowReceiverPhone() {
      getReceiverPhone(this.detail.orderNo).then(res => {
        if (res.code === 1) {
          this.receiverDetails.receiverPhone = res.data
          this.isShowPhoneNumber = false
        }
      })
    },
    async getOrderDetailLogistics() {
      const { data } = await orderDetailLogistics({
        orderNo: this.$route.params.id
      })
      this.logisticsDetails = data.logisticVO ?? {}
      this.receiverDetails = data.receivingReq ?? {}
    },
    getDetail() {
      // this.loading = true
      const that = this
      getOrderDetail(this.$route.params.id)
        .then(res => {
          console.log('详情信息', res)
          this.shenheDataArray = res.data.orderDiscountDetailList
          this.orderStatus = res.data.orderStatus
          if (
            res.data.type === undefined ||
            res.data.type === null ||
            res.data.type === ''
          ) {
            res.data['type'] = ''
            this.orderType = ''
          }
          if (
            res.data.giveVoucherList === undefined ||
            res.data.giveVoucherList === null ||
            res.data.giveVoucherList === ''
          ) {
            // 赠送处理
            res.data['giveVoucherList'] = []
          }
          if (res.data.auditRecordsVoList.length) {
            // 审核记录
            res.data.auditRecordsVoList.map((v, i) => {
              let type = '--'
              if (v.examineType === 0) {
                type = '发起审核'
              } else if (v.examineType === 1) {
                type = '订单初审'
              } else if (v.examineType === 2) {
                type = '订单复审'
              }
              that.auditRecords.push({
                id: v.id,
                type,
                operator: v.createdUserName ? v.createdUserName : '--',
                status: v.examineStatus,
                remark: v.remark ? v.remark : '--',
                examineType: v.examineType,
                updateTime: v.createTime
                  ? parseTime(
                    new Date(v.createTime).getTime(),
                    '{y}-{m}-{d} {h}:{i}:{s}'
                  )
                  : '--'
              })
            })
          }
          // 公司地址
          if (res.data.addUserVo !== undefined) {
            if (res.data.addUserVo.areaName) {
              const areaArray = res.data.addUserVo.areaName.split(',')
              let areaName = ''
              areaArray.map(v => {
                areaName = areaName + v
              })
              const address =
                res.data.addUserVo.address !== undefined
                  ? res.data.addUserVo.address
                    ? res.data.addUserVo.address
                    : ''
                  : ''
              res.data.addUserVo.areaName = areaArray
              res.data.addUserVo['areaName_address'] = areaName + address
            } else {
              res.data.addUserVo['areaName_address'] =
                res.data.addUserVo.address !== undefined
                  ? res.data.addUserVo.address
                    ? res.data.addUserVo.address
                    : ''
                  : ''
            }
          } else {
            res.data['addUserVo'] = {
              areaName: '',
              company: '',
              id: '',
              industry: '',
              introduce: '',
              phone: '',
              position: '',
              realName: '',
              turnover: '',
              address: '',
              areaName_address: '--'
            }
          }
          if (res.data.list.length) {
            res.data.list.map(v => {
              const price =
                v.goodsPrices > 0 ? Number(v.goodsPrices) * v.goodsNum : 0
              const discountsFee =
                v.discountsFee > 0 ? Number(v.discountsFee) : 0
              v['subtotal'] = (price - discountsFee).toFixed(2)
              v.goodsPrices =
                v.goodsPrices > 0 ? Number(v.goodsPrices).toFixed(2) : '0.00'
              v.discountsFee =
                v.discountsFee > 0 ? Number(v.discountsFee).toFixed(2) : '0.00'
              v.materialSpecVo !== undefined
                ? that.materialSpecVo.push(v.materialSpecVo)
                : ''
              if (res.data.type === '转课') {
                if (v.notesLink !== undefined) {
                  // 原因补充 图片
                  this.imageData = v.notesLink.split(',')
                }
              }
            })
          }
          if (res.data.depositGoodsList.length) {
            res.data.depositGoodsList.map(v => {
              v.salePrice =
                v.salePrice > 0 ? Number(v.salePrice / 100).toFixed(2) : '0.00'
              v.discountsFee =
                v.discountsFee > 0
                  ? Number(v.discountsFee / 100).toFixed(2)
                  : '0.00'
              v.totalAmount =
                v.totalAmount > 0
                  ? Number(v.totalAmount / 100).toFixed(2)
                  : '0.00'
              if (res.data.type === '转课') {
                if (v.notesLink !== undefined) {
                  // 原因补充 图片
                  this.imageData = v.notesLink.split(',')
                }
              }
            })
          }
          // 流水
          if (res.data.paymentInfoVoList !== undefined) {
            if (res.data.paymentInfoVoList.length) {
              res.data.paymentInfoVoList.map(v => {
                that.paymentInfoVoList.push({
                  id: v.id,
                  type: v.type,
                  account: v.account ? v.account : '--', // 收款账户
                  channel: v.channel ? v.channel : '--', // 渠道名称
                  company: v.company ? v.company : '--', // 收款单位
                  paymentUserPhone: v.email
                    ? v.email
                    : (v.phoneAreaCode ? '(+' + v.phoneAreaCode + ')' : '') +
                      v.paymentUserPhone,
                  payTime: v.payTime
                    ? parseTime(
                      new Date(v.payTime).getTime(),
                      '{y}-{m}-{d} {h}:{i}:{s}'
                    )
                    : '--', // 交易时间
                  payerTotal:
                    v.payerTotal > 0 ? Number(v.payerTotal).toFixed(2) : '0.00', // 金额
                  transactionId: v.transactionId ? v.transactionId : '--', // 支付系统交易编号
                  voucherList:
                    v.voucherList !== undefined
                      ? v.voucherList.length
                        ? v.voucherList
                        : []
                      : []
                })
              })
            }
          }
          // 新购
          if (res.data.type === '新购') {
            this.orderType = '新购'
          } else if (res.data.type === '直接赠送') {
            this.orderType = '赠送'
          } else if (res.data.type === '关联订单赠送') {
            this.orderType = '赠送'
          } else if (res.data.type === '转课') {
            this.orderType = '转课'
          } else if (res.data.type === '预存') {
            this.orderType = '预存'
          }
          if (res.data.transferOrderNoList !== undefined) {
            // 转课订单
            if (res.data.transferOrderNoList.length) {
              res.data.transferOrderNoList.forEach((v, i) => {
                this.transferNo.push({
                  id: i,
                  status: i,
                  orderNo: v
                })
              })
            }
          }
          if (res.data.transferVoList !== undefined) {
            // 转课信息列表
            if (res.data.transferVoList.length) {
              res.data.transferVoList.map(v => {
                v.createTime = v.createTime
                  ? parseTime(
                    new Date(v.createTime).getTime(),
                    '{y}-{m}-{d} {h}:{i}:{s}'
                  )
                  : '--'
                v.transferFee =
                  Math.abs(v.transferFee) > 0
                    ? Math.abs(v.transferFee).toFixed(2)
                    : '0.00'
              })
              this.transferVoList = res.data.transferVoList
            }
          }
          // 价格处理
          res.data.goodsTotalFee =
            res.data.goodsTotalFee > 0
              ? res.data.goodsTotalFee.toFixed(2)
              : '0.00'
          res.data.discountsFee =
            res.data.discountsFee > 0
              ? res.data.discountsFee.toFixed(2)
              : '0.00'
          res.data.payableFee =
            res.data.payableFee > 0 ? res.data.payableFee.toFixed(2) : '0.00'
          res.data.payerTotal =
            res.data.payerTotal > 0 ? res.data.payerTotal.toFixed(2) : '0.00'
          res.data.payAmountFee =
            res.data.payAmountFee > 0
              ? res.data.payAmountFee.toFixed(2)
              : '0.00'
          res.data.transferFee =
            Math.abs(res.data.transferFee) > 0
              ? Math.abs(res.data.transferFee).toFixed(2)
              : '0.00' // 暂时屏蔽
          res.data.balanceFee =
            res.data.balanceFee > 0 ? res.data.balanceFee.toFixed(2) : '0.00'
          this.transferParentOrderNo.push(res.data.transferParentOrderNo)
          // 状态处理
          // const audit = Number(this.$route.params.audit)
          const audit = res.data.examineStatus
          if (audit !== undefined) {
            if (audit === 0) {
              // 待初审
              res.data.orderStatus = 10
              this.audit = audit
            } else if (audit === 1) {
              // 待复审
              res.data.orderStatus = 11
              this.audit = audit
            } else if (audit === 2) {
              // 审核失败
              res.data.orderStatus = 9
              this.editStatus = true
              this.audit = audit
            } else if (audit === 3) {
              // 审核成功
              this.auditStatus = false
              this.audit = ''
              if (res.data.orderStatus === 11) {
                res.data.orderStatus = 12
              } else if (res.data.orderStatus === 12) {
                res.data.orderStatus = 13
              }
            }
          }
          const orderCommerceDTO = res.data.orderCommerceDTO ?? {}
          const isNull =
            orderCommerceDTO.orderClassification !== undefined &&
            orderCommerceDTO.orderClassification !== null
          const orderSourceIsNull =
            orderCommerceDTO.orderSource !== undefined &&
            orderCommerceDTO.orderSource !== null
          this.orderCommerceDTO = {
            orderSource: +orderCommerceDTO.orderSource,
            orderSourceName: orderSourceIsNull
              ? orderSource[orderCommerceDTO.orderSource + '']
              : '--',
            orderClassification: +orderCommerceDTO.orderClassification,
            orderClassificationName: isNull
              ? orderClassification[orderCommerceDTO.orderClassification + '']
              : '--',
            expertName: orderCommerceDTO.expertName ?? '--',
            expertId: orderCommerceDTO.expertId ?? '--',
            operateName: orderCommerceDTO.operateName ?? '--',
            liveCode: orderCommerceDTO.liveCode ?? '--',
            anchorName: orderCommerceDTO.anchorName ?? '--',
            liveOperateName: orderCommerceDTO.liveOperateName ?? '--',
            advertiseName: orderCommerceDTO.advertiseName ?? '--',
            controlName: orderCommerceDTO.controlName ?? '--',
            liveAccount: res.data.liveAccount ?? '--'
          }
          // 赠单凭证
          // res.data['giveVoucherLis'] = ['https://ms.bdimg.com/pacific/0/pic/-2082833283_-1554138504.jpg?x=0&y=0&vh=150.00&vw=242.00&oh=150.00&ow=242.00&w=146&h=91&rs=0', 'https://ms.bdimg.com/pacific/0/pic/-1862929493_494329150.jpg?x=0&y=0&vh=150.00&vw=242.00&oh=150.00&ow=242.00&w=146&h=91&rs=0']
          // 赠送
          this.$nextTick(() => {
            this.detail = res.data
            console.log('detail', this.detail)
            this.contenShow = true
            this.autoEditBtn()
          })
          // this.loading = false
        })
        .catch(() => {
          // this.loading = false
        })
    },
    imageUrlArr(e) {
      this.imageUrlArray = e
    },
    compare(prop, align) {
      // 时间排序
      // prop：对象数组排序的键，
      // align：排序方式，"positive"正序，"inverted"倒序。
      return function (a, b) {
        var value1 = a[prop]
        var value2 = b[prop]
        if (align === 'positive') {
          // 正序
          return new Date(value1) - new Date(value2)
        } else if (align === 'inverted') {
          // 倒序
          return new Date(value2) - new Date(value1)
        }
      }
    },
    autoEditBtn() {
      // 判断编辑按钮
      const enrollmentTeacherId = this.detail.enrollmentTeacherId // 招生Id
      const enrollmentTeacherName = this.detail.enrollmentTeacherName // 	招生老师
      const createUserId = this.detail.createUserId // 	录入操作者ID
      const createUserName = this.detail.createUserName // 	录入操作者
      const nickName = this.userInfo.nickName
      const userId = this.userInfo.userId
      let statusBtn = false
      if (userId === createUserId || userId === enrollmentTeacherId) {
        statusBtn = true
      }
      if (enrollmentTeacherId === '') {
        if (enrollmentTeacherName === nickName) {
          statusBtn = true
        }
      }
      if (createUserId === '') {
        if (createUserName === nickName) {
          statusBtn = true
        }
      }
      this.statusBtn = statusBtn
    },
    returnLiveModel(str) {
      let returnStr
      if (str === 'AI_LIVE') {
        returnStr = '智能直播'
      } else if (str === 'PERSON_LIVE') {
        returnStr = '真人直播'
      } else if (str === 'DIGITAL_PERSON_LIVE') {
        returnStr = '数字人直播'
      }
      return returnStr
    },
    // 获取跟进记录列表
    getList() {
      this.loading = true
      const params = {
        current: this.currentPage,
        size: this.pageSize,
        orderNo: this.$route.params.id
        // userId: this.$route.params.id
      }
      userFollow(params)
        .then(res => {
          this.loading = false
          // console.log(res, '获取跟进记录')
          this.tableData = res.data.records
          this.total = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取退款记录列表
    getGoodsAfterSaleList() {
      goodsAfterSaleList({ orderNo: this.$route.params.id }).then(res => {
        // console.log(res, '退款记录列表')
        this.afterSaleList = res.data
      })
    },
    // 打开新增跟进记录弹框
    openAddModal() {
      console.log('打开弹框')
      this.form = {
        content: '',
        followType: 1,
        nextFollowTime: '',
        orderNo: this.$route.params.id,
        userId: ''
      }
      this.modal.visible = true
    },
    addUserFollow() {
      console.log('点击确认按钮')
      this.$refs.form.validate(valid => {
        if (valid) {
          this.modal.loading = true
          addFollowByOrderNo(this.form)
            .then(res => {
              this.modal.loading = false
              this.modal.visible = false
              this.$notify.success({
                title: '提示',
                message: '提交成功'
              })
              this.getList()
            })
            .catch(() => {
              this.modal.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    openOverruleModal() {
      console.log('打开弹框')
      this.overruleModal.visible = true
    },
    openDiscountModal(row) {
      this.discountModal.goodsId = row.goodsId
      this.discountModal.discountsFee = row.discountsFee
      this.discountModal.visible = true
    },
    onClickOrderPass() {
      const params = {
        examineStatus: this.audit, // 	审核状态
        // examineType: this.auditRecords[0].examineType, // 	审核类型
        orderNo: this.detail.orderNo // 	订单编号
        // remark: ''
      }
      this.passLoading = true
      console.log('通过', params)
      orderPass(params)
        .then(res => {
          this.$notify.success({
            title: '',
            message: '操作成功'
          })
          this.passLoading = false
          this.goBack()
        })
        .catch(() => {
          this.passLoading = false
        })
    },
    addOverrule() {
      const remark = this.overruleVal
      const params = {
        examineStatus: this.audit, // 	审核状态
        // examineType: this.auditRecords[0].examineType, // 	审核类型
        orderNo: this.detail.orderNo, // 	订单编号
        remark
      }
      console.log('不通过', params)
      if (remark) {
        this.overruleModal.loading = true
        orderReject(params)
          .then(res => {
            this.overruleModal.loading = true
            this.$notify.success({
              title: '',
              message: '操作成功'
            })
            this.goBack()
          })
          .catch(() => {
            this.overruleModal.loading = false
          })
      } else {
        this.$notify.error({
          title: '',
          message: '驳回内容不能为空！'
        })
      }
    },
    goBack() {
      this.$router.push({
        path:
          this.pageSource === '资金结算'
            ? '/business/divideAccounts'
            : `/business/orderManage`
      })
    },
    onClickEditForm() {
      this.$router.push({
        path: `/business/orderManage/editOrder/${this.detail.orderNo}`
      })
    },
    // 跳转用户详情页面
    gotoUserDetails(userId) {
      // this.$router.push(`/messageManager/memberDetail/${userId}`)
      this.UserInfoDialog = {
        visible: true,
        type: 1,
        userId: userId
      }
    },
    applyAfterSalesCard(row) {
      console.log(row, '点击申请售后卡')
      this.$delModal({
        tips: `确定给【${row.goodsName}】商品发放售后卡?`,
        success: () => {
          this.loading = true
          goodsAfterSaleCard(row.id)
            .then(res => {
              console.log(res, 'res')
              this.$message({
                showClose: true,
                duration: 0,
                type: 'success',
                message: res.data
              })
              this.loading = false
              this.getDetail()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    gotoDetailDetail(row) {
      console.log('点击打开售后详情', row)
      this.AfterOrderDialog = {
        visible: true,
        type: 1,
        orderNo: row.afterSaleNo
      }
    },
    /** 跟进记录模块 */
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    // 跳转订单详情
    openDetailPage(orderNo, type, audit) {
      if (type) {
        this.$router.push({
          path: `/business/orderManage/orderDetail/${orderNo}/${audit}/${this.pageName}`
        })
      } else {
        const routeUrl = this.$router.resolve(
          `/business/orderManage/orderDetail/${orderNo}/${audit}/${this.pageName}`
        )
        window.open(routeUrl.href, '_blank')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.order-box {
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  .order-box-main {
    .crumbs-box {
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #eff2f6;
    }
    .order-status {
      padding: 18px 20px;
      border-radius: 6px;
      font-size: 20px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: rgba(51, 51, 51, 0.9);
      line-height: 28px;
      .icon-svg {
        margin-right: 10px;
      }
      margin-bottom: 4px;
    }
    .order-status-ok {
      background: #e6f7ea;
    }
    .order-status-fail {
      background: #feecec;
    }
    .order-status-wait {
      background: #fff2e6;
    }
    .order-status-review {
      background: #fff2cc;
    }
    .order-status-part {
      background: #fff2e6;
    }
    .common-box {
      .common-title {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #333333;
        position: relative;
        padding-left: 12px;
        margin-bottom: 16px;
        &:before {
          position: absolute;
          content: '';
          width: 4px;
          height: 24px;
          background: #0c6fff;
          border-radius: 6px;
          top: 0;
          left: 0;
        }
      }
    }
    .list-info {
      display: flex;
      .list-child {
        display: flex;
        align-items: center;
        width: 33.33%;
        .list-child-title {
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: #777777;
          width: 96px;
          text-align: right;
          height: 100%;
          vertical-align: text-top;
        }
        .long-title {
          width: 140px;
          text-align: right;
        }
        .list-child-info {
          flex: 1;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #333333;

          .list-child-info-a {
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #0c6fff;
          }
        }
        .list-child-info-height {
          height: 100%;
          padding-top: 2px;
        }
      }
    }
    .list-info-top-border {
      border-top: 1px solid #eff2f6;
      padding-top: 15px;
    }

    .line-box {
      margin: 16px 0;
      width: 100%;
      height: 1px;
      background-color: #eff2f6;
    }
    .water-box {
      .water-child {
        padding: 12px 16px;
        background: #f7fbff;
        border-radius: 8px;
        margin-top: 16px;
        .water-child-title {
          font-size: 16px;
          font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
          color: #333333;
          .water-child-ok {
            display: inline-block;
            width: 44px;
            height: 22px;
            line-height: 22px;
            text-align: center;
            background: #e6f7ea;
            border-radius: 12px;
            font-size: 12px;
            font-family: MicrosoftYaHei;
            color: #00b42a;
            margin-left: 8px;
          }
          .water-child-no {
            display: inline-block;
            // width: 92px;
            padding: 0 10px;
            height: 22px;
            line-height: 22px;
            text-align: center;
            background: #feecec;
            border-radius: 12px;
            font-size: 12px;
            font-family: MicrosoftYaHei;
            color: #f53f3f;
            margin-left: 8px;
          }
        }
        .water-child-list {
          display: flex;
          margin-top: 20px;
          .water-child-list-child {
            display: flex;
            align-items: center;
            width: 33.33%;
            .water-child-list-child-title {
              width: 96px;
              height: 100%;
              font-size: 16px;
              font-family: MicrosoftYaHei;
              color: #777777;
              line-height: 24px;
              text-align: right;
            }
            .water-child-list-child-info {
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #333333;
              .water-ok {
                font-size: 14px;
                font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                font-weight: bold;
                color: #00b42a;
              }
              .water-no {
                font-size: 14px;
                font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                font-weight: bold;
                color: #f53f3f;
              }
            }
            .water-child-list-child-info-flex {
              display: flex;
              .img-box {
                width: 120px;
                height: 90px;
                border-radius: 4px;
                margin-right: 10px;
                cursor: pointer;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
          .water-child-list-child-img-list {
            width: 100%;
          }
        }
      }
    }
    .turn-box {
      .turn-child {
        margin-top: 16px;
        padding: 16px 12px;
        background: #f7fbff;
        border-radius: 8px;
        .turn-child-title {
          font-size: 16px;
          font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
          font-weight: bold;
          color: #333333;
        }
        .turn-child-info {
          display: flex;
          margin-top: 20px;
          .turn-info-child {
            width: 33.33%;
            display: flex;
            align-items: center;
            .turn-info-child-title {
              width: 112px;
              height: 24px;
              font-size: 16px;
              font-family: MicrosoftYaHei;
              color: #777777;
              text-align: right;
            }
            .turn-info-child-info {
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #333333;
              .span {
                font-size: 14px;
                font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                font-weight: bold;
              }
              .span-red {
                color: #f53f3f;
              }
              .span-greed {
                color: #00b42a;
              }
            }
          }
        }
      }
    }
    .image-box {
      display: flex;
      margin-top: 15px;
      .image-block {
        width: 120px;
        height: 90px;
        margin-right: 20px;
      }
    }
    .table-box {
      background: #ffffff;
      margin-bottom: 16px;
      .table-img-box {
        display: flex;
        align-items: center;
        .table-img-box-l {
          width: 64px;
          height: 64px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 6px;
          }
        }
        .table-img-box-r {
          flex: 1;
          margin-left: 8px;
        }
      }
      .table-txt {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #777777;
        line-height: 22px;
        display: -webkit-box;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      .table-txt-del {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #f53f3f;
        cursor: pointer;
      }
      .table-in {
        display: flex;
        align-items: center;
        align-content: space-around;
        :nth-child(1) {
          margin-right: 6px;
        }
        :nth-child(3) {
          margin-left: 2px;
        }
      }
      .audit-box {
        padding: 5px 10px;
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

      .audit-box-review {
        background: #fff2cc;
        color: #ffc619;
      }

      .audit-box-fail {
        background: #feecec;
        color: #f53f3f;
      }
    }
    .preferential-box {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #333333;
      .preferential-info {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #777777;
        margin-top: 8px;
      }
      .preferential-info-flex {
        display: flex;
        .img-box {
          width: 120px;
          height: 90px;
          border-radius: 4px;
          margin-right: 10px;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .recording-box {
      .add-recording {
        width: 134px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #0c6fff;
        border-radius: 4px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #ffffff;
        cursor: pointer;
        margin-bottom: 16px;
      }
    }
    .pay-box {
      .price-num {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #777777;
        text-align: right;
      }
      .price-common-title {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #333333;
        text-align: right;
        .price-num-green {
          color: #00b42a;
        }
        .price-num-blue {
          color: #0c6fff;
        }
        .price-num-red {
          color: #f53f3f;
        }
      }
    }
    .audit-btn-box {
      display: flex;
      justify-content: center;
      .pass {
        width: 96px;
        height: 40px;
        background: #0c6fff;
        border-radius: 4px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #ffffff;
        border: none;
      }
      .overrule {
        width: 96px;
        height: 40px;
        background: #f53f3f;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #ffffff;
        border: none;
      }
      .cancel {
        width: 96px;
        height: 40px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
      }
      .edit {
        width: 124px;
        height: 40px;
        background: #0c6fff;
        border-radius: 4px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #ffffff;
        border: none;
      }
    }
  }
}
.nav-list ::v-deep .el-breadcrumb__inner {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold !important;
  color: #777777;
}
.nav-add ::v-deep .el-breadcrumb__inner {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold !important;
  color: #333333;
}
// nva end
.table-box ::v-deep .el-table th.el-table__cell {
  background: #f3f3f3;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
}
.table-in ::v-deep .el-input__inner {
  width: 92px;
}
// table end
.font-color-blue {
  color: #0c6fff;
}

.m-t32 {
  margin-top: 32px;
}
.m-t64 {
  margin-top: 64px;
}
.m-b8 {
  margin-bottom: 8px;
}
.m-b16 {
  margin-bottom: 16px;
}
.m-b20 {
  margin-bottom: 20px;
}
.m-t20 {
  margin-top: 20px;
}
.h100 {
  height: 100%;
}
::v-deep .ss-material-box-header-title {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold !important;
  color: #333333;
}
::v-deep .el-table {
  border-bottom: none !important;
}
.overrule-box {
  padding: 16px;
  .overrule-title {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
  }
  .overrule-info {
    margin-top: 8px;
  }
}
.a-link {
  cursor: pointer;
  color: #1890ff !important;
}
.pointer {
  cursor: pointer;
  color: #2c82ff;
}
.logistics-box {
  margin-left: 20px;
  font-size: 14px;
  color: #333;
  .title {
    font-size: 16px;
    font-weight: 600;
  }
  .time {
    color: #999;
  }
}
.text-discount {
  color: #f53f3f;
}
</style>
