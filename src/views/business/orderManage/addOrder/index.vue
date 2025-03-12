<template>
  <div class="entry-box">
    <div v-if="confirm" class="add-order-warp">
      <div class="crumbs-box">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="detail-breadcrumb">
          <el-breadcrumb-item :to="{ path: '/business/orderManage' }" class="nav-list">订单管理</el-breadcrumb-item>
          <el-breadcrumb-item class="nav-add">新增订单</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- crumbs end -->
      <el-form ref="form" :model="form" label-width="80px" :rules="rules" class="form-box">
        <div class="common-box">
          <div class="common-title">基本信息</div>
        </div>
        <el-row>
          <el-col :span="12">
            <div class="flex-box">
              <el-form-item label="订单类型" prop="orderType.o_one">
                <el-select v-model="form.orderType.o_one" placeholder="请选择" class="m-r8" :class="optionsGiftType.length?'w-200':'w-296'" @change="getOrderTypeChange">
                  <el-option
                    v-for="item in optionsType"
                    :key="item.id"
                    :label="item.type"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="optionsGiftType.length" label="" prop="orderType.o_two">
                <el-select v-model="form.orderType.o_two" placeholder="请选择" class="w-200" @change="getOrderGiftTypeChange">
                  <el-option
                    v-for="item in optionsGiftType"
                    :key="item.id"
                    :label="item.type"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成交来源" prop="channel">
              <el-select v-model="form.channel" placeholder="请选择" class="w-296">
                <el-option
                  v-for="item in channelSource"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="招生老师" prop="teacherName.name">
              <el-autocomplete
                v-model="form.teacherName.name"
                :fetch-suggestions="querySearchAsync"
                :maxlength="20"
                placeholder="请输入"
                class="w-296"
                @select="handleSelect"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="selectOrderType === '赠送'">
          <el-col :span="16">
            <el-form-item label="赠单原因" prop="giveDesc">
              <el-input
                v-model="form.giveDesc"
                type="textarea"
                :row="6"
                maxlength="200"
                show-word-limit
                style="width: 500px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="selectOrderType === '赠送'">
          <el-col :span="16">
            <el-form-item label="赠单凭证" prop="givePhoto">
              <div class="upload-img">
                <div v-for="(items, i) in form.givePhoto" :key="i">
                  <uploadItem
                    :key="i"
                    class="m-r-16 m-b-16 avatar-uploader-icon-box"
                    :status="items.status"
                    :url="items.url"
                    :auth-progress="items.authProgress"
                    @del="delFileGive(items, i)"
                    @again="alignUploadGive(items, i)"
                  />
                </div>
                <el-upload
                  v-if="form.givePhoto.length < 6"
                  ref="uploadGive"
                  class="avatar-uploader-icon-box"
                  action="#"
                  :limit="6"
                  :file-list="form.givePhoto"
                  :multiple="true"
                  :show-file-list="false"
                  accept=".jpg,.jpeg,.png,bmp,JPG,JPEG,PNG,BMP"
                  :on-exceed="exceedImgList"
                  :before-upload="beforeUpload"
                  :http-request="uploadGive"
                >
                  <i class="el-icon-plus" />
                  <div class="uploadViewText">点击上传</div>
                </el-upload>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="selectGiftType === '关联订单赠送' && selectOrderType === '赠送'">
          <el-col :span="16">
            <el-form-item label="关联订单" prop="orderNo">
              <div class="search-order">
                <el-input
                  v-model="form.orderNo"
                  maxlength="50"
                  class="w-296 search-in"
                />
                <!-- <el-button v-permission="['system:order:findOrderNo', permsList]" class="button-h32" type="primary" size="small" @click="selectThirdShop(form.orderNo)">查询</el-button> -->
                <el-button class="button-h32" type="primary" size="small" @click="selectThirdShop(form.orderNo)">查询</el-button>
                <el-button class="button-h32" size="small" @click="selectThirdShop('-')">重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="selectGiftType === '关联订单赠送' && selectOrderType === '赠送'">
          <div class="order-list">
            <order-list ref="orderList" :operation="false" :see-detail-model="false" @sizeChange="receiveSizeChange" @tableDataNum="receiveTableDataNum" @tableDataPrecisen="tableDataPrecisen" />
          </div>
          <div v-if="searchPrecisen.isGive" class="ok-txt"><svg-icon icon-class="pickUp_ok" class="icon-svg" /> 当前订单可赠送 </div>
          <div v-if="!searchPrecisen.isGive && searchPrecisen.content" class="no-txt"><svg-icon icon-class="pickUp_no" class="icon-svg" /> {{ searchPrecisen.content }}</div>
          <div v-if="giveOrderList.length && searchPrecisen.isGive" class="no-txt no-txt1">该订单已赠送过课程，赠送课程如下</div>
        </el-row>
        <el-row v-if="selectGiftType === '关联订单赠送' && selectOrderType === '赠送' && searchPrecisen.isGive && giveOrderList.length ">
          <div class="order-list">
            <giveList ref="giveList" :table-data="giveOrderList" />
          </div>
        </el-row>
        <div class="common-box m-t10">
          <div class="common-title">商品信息</div>
        </div>
        <div v-if="selectOrderType === '预存'">
          <div class="table-box" style="margin-bottom: 20px;">
            <el-table
              :data="depositGoodsObj"
              style="width: 1200px;border-radius: 8px;border: 1px solid #E7E7E7;"
            >
              <el-table-column
                label="商品名称"
                width="300"
              >
                <template slot-scope="scope">
                  <div class="table-img-box">
                    <div class="table-img-box-l"><img :src="scope.row.coverVerticalUrl" alt="" /></div>
                    <div class="table-img-box-r table-txt">{{ scope.row.contentName }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="商品类型">
                <template slot-scope="scope">
                  <span class="table-txt">{{ scope.row.goodsTypeName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="商品单价（元）" width="140">
                <span class="table-txt">0</span>
              </el-table-column>
              <el-table-column label="商品数量">
                <span class="table-txt">1</span>
              </el-table-column>
              <el-table-column label="优惠金额(元)">
                <span class="table-txt">0</span>
              </el-table-column>
              <el-table-column label="小计(元)">
                <span class="table-txt">0</span>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div v-else>
          <div v-for="(orderObject,index) in form.materialGoodsOrderVoList" :key="index">
            <el-row>
              <el-form-item
                label="选择商品"
                :prop="'materialGoodsOrderVoList.'+index+'.id'"
                :rules="[{
                  required: true, message: '请选择商品', trigger: 'change'
                }]"
              >
                <div class="flex-box">
                  <div v-if="orderObject.contentName" class="w-296 m-r32">
                    <el-input
                      v-model="orderObject.contentName"
                      placeholder="请输入商品名称搜索"
                      maxlength="50"
                      :disabled="true"
                      class="w-296"
                    />
                  </div>
                  <div v-else class="w-296 m-r32">
                    <div
                      class="input-box"
                      @click="selectGoodsPop(index)"
                    >请输入商品名称搜索</div>
                    <!-- <input-goods @selectedGoods="
                  /> -->
                  </div>
                  <el-button v-if="form.materialGoodsOrderVoList.length > 1" size="mini" type="danger" @click="deleteGoods(index)">删除当前选中商品</el-button>
                </div>
              </el-form-item>
            </el-row>
            <el-row v-if="orderObject.tableShow">
              <el-form-item label="">
                <div class="table-box">
                  <el-table
                    :data="orderObject.goodsData"
                    style="width: 1200px;border-radius: 8px;border: 1px solid #E7E7E7;"
                  >
                    <el-table-column
                      label="商品名称"
                      width="300"
                    >
                      <template slot-scope="scope">
                        <div class="table-img-box">
                          <div class="table-img-box-l"><img :src="scope.row.image" alt="" /></div>
                          <div class="table-img-box-r table-txt">{{ scope.row.goodsName }}</div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="商品类型">
                      <template slot-scope="scope">
                        <span class="table-txt">{{ scope.row.goodsType }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="商品单价（元）" width="140">
                      <template slot-scope="scope">
                        <span class="table-txt">{{ scope.row.goodsPrice }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="商品数量">
                      <template slot-scope="scope">
                        <el-input-number v-if="selectOrderType==='' || selectOrderType === '新购'" v-model="scope.row.goodsNum" class="goods-in-num50" :controls="false" controls-position="right" :min="1" :max="99" @blur="getIGoodsPreferentialPrice(index)" />
                        <span v-else class="table-txt">{{ scope.row.goodsNum }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column v-if="selectOrderType==='' || selectOrderType === '新购'" label="优惠金额(元)" width="160">
                      <!-- <template slot-scope="scope">
                    <span class="table-txt">- {{ scope.row.goodsPreferentialPrice }}</span>
                </template> -->
                      <template slot-scope="scope">
                        <div v-if="orderObject.goodsData.length" class="table-in">
                          <div v-if="orderObject.goodsData[0].goodsPreferentialPrice > 0">￥-</div>
                          <el-input-number v-model="scope.row.goodsPreferentialPrice" class="goods-in-num80" :class="orderObject.goodsData[0].priceIn?'goods-in-num-red':''" :controls="false" controls-position="right" :min="0" :precision="2" :max="999999" @blur="getIGoodsPreferentialPrice(index)" />
                          <!-- <el-input v-model="scope.row.goodsPreferentialPrice" placeholder="请输入" maxlength="6" @blur="getIGoodsPreferentialPrice" /> -->
                          <div v-if="orderObject.goodsData[0].priceIn">
                            <el-popover
                              placement="bottom"
                              title=""
                              width="200"
                              trigger="hover"
                              content="请输入正确的优惠金额"
                            >
                              <svg-icon slot="reference" icon-class="order_tab_no" class="icon-svg" />
                            </el-popover>
                          </div>
                        </div>
                      </template>

                    </el-table-column>
                    <el-table-column label="操作">
                      <span class="table-txt-del" @click="onClickTabDel(index)">删除</span>
                    </el-table-column>
                  </el-table>
                </div>
              </el-form-item>
            </el-row>
            <el-row v-if="orderObject.optionsSpecs.length">
              <el-form-item
                label="商品规格"
                :prop="'materialGoodsOrderVoList.'+index+'.specsId'"
                :rules="[{
                  required: true, message: '请选择商品规格', trigger: 'change'
                }]"
              >
                <el-select v-model="orderObject.specsId" filterable placeholder="请选择规格" class="w-296 m-r32" @change="onChangeGoodsSpecs($event,index)">
                  <el-option
                    v-for="item in orderObject.optionsSpecs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-row>
            <el-row v-if="selectOrderType === '新购' && orderObject.goodsData.length">
              <el-col v-if="orderObject.goodsData[0].goodsPreferentialPrice > 0" :span="16">
                <el-form-item
                  label="优惠原因"
                  :prop="'materialGoodsOrderVoList.'+index+'.goodsData[0].preferentialDesc'"
                  :rules="[{
                    required: true, message: '请输入优惠原因', trigger: 'change'
                  }]"
                >
                  <el-input
                    v-model="orderObject.goodsData[0].preferentialDesc"
                    type="textarea"
                    :row="6"
                    maxlength="200"
                    show-word-limit
                    placeholder="请输入"
                    style="width: 500px"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row class="add-goods-cls">
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-row>
          <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="选择商品" prop="goods.id">
              <div class="flex-box">
                <div v-if="form.goods.contentName" class="w-296 m-r32">
                  <el-input
                    v-model="form.goods.contentName"
                    placeholder="请输入商品名称搜索"
                    maxlength="50"
                    :disabled="true"
                    class="w-296"
                  />
                </div>
                <div v-else class="w-296 m-r32">
                  <div
                    class="input-box"
                    @click="selectGoodsPop"
                  >请输入商品名称搜索</div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row> -->

          <el-row>
            <el-col :span="12">
              <el-form-item label="来源大6P" prop="sixp">
                <el-select v-model="form.sixp" placeholder="请选择" class="w-296">
                  <el-option
                    v-for="item in optionsSixp"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  />
                </el-select>
                <div class="label-ps">注：非来源大6P默认选否即可</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="私域场次" prop="sessions">
                <el-input-number v-model="form.sessions" controls-position="right" :min="0" :max="999999" class="w-296" />
                <div class="label-ps">注：非需要录入私域场次填0即可</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="智能销售任务" prop="taskId">
              <el-select
                v-model="form.taskId"
                :remote-method="remoteMethod"
                filterable
                remote
                clearable
                placeholder="请选择"
                class="w-296"
                @change="handleChangeTask"
                @clear="handleClear"
              >
                <el-option
                  v-for="item in optionsTask"
                  :key="item.id"
                  :label="item.taskName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row v-if="selectOrderType !== '赠送'">
            <el-form-item label="备注" class="text-area-cls">
              <el-input v-model="form.remarks" type="textarea" placeholder="请输入备注信息" maxlength="200" show-word-limit />
            </el-form-item>
          </el-row>
          <el-row v-if="selectOrderType !== '赠送'" class="m-t20">
            <el-col :span="12">
              <el-form-item
                label="备注资料"
              >
                <div class="upload-img">
                  <div v-for="(items, i) in form.imageList" :key="i">
                    <uploadItem
                      :key="i"
                      class="m-r-16 m-b-16 avatar-uploader-icon-box"
                      :status="items.status"
                      :url="items.url"
                      :auth-progress="items.authProgress"
                      @del="delFileForText(item, i,index)"
                      @again="alignUploadForText(item, i,index)"
                    />
                  </div>
                  <el-upload
                    v-if="form.imageList.length < 6"
                    ref="uploadForTextarea"
                    class="avatar-uploader-icon-box"
                    action="#"
                    :limit="6"
                    :file-list="form.imageList"
                    :multiple="true"
                    :show-file-list="false"
                    accept=".jpg,.jpeg,.png,bmp,JPG,JPEG,PNG,BMP"
                    :on-exceed="exceedImgList"
                    :before-upload="beforeUpload"
                    :http-request="(option)=>{return uploadForTextarea(option)}"
                  >
                    <i class="el-icon-plus" />
                    <div class="uploadViewText">点击上传</div>
                  </el-upload>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="common-box m-t10">
          <div class="common-title">用户信息</div>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="user.name">
              <el-input
                v-model="form.user.name"
                maxlength="20"
                placeholder="请输入"
                class="w-296"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户账号" :prop="form.userType === 'phone' ? 'user.phone' : 'user.email'" class="user-account">
              <!--              <el-input-->
              <!--                v-model="form.user.phone"-->
              <!--                maxlength="11"-->
              <!--                oninput="if(value.length > 11) value=value.slice(0, 11)"-->
              <!--                type="number"-->
              <!--                placeholder="请输入"-->
              <!--                class="w-296"-->
              <!--              />-->

              <el-select v-model="form.userType" placeholder="请选择" style="width: 90px;">
                <el-option label="手机号" value="phone" />
                <el-option label="邮箱" value="email" />
              </el-select>
              <el-input v-if="form.userType === 'phone'" ref="userTypePhone" v-model="form.user.phone" class="w-350" maxlength="11" placeholder="请输入用户手机号" rule>
                <el-select slot="prepend" v-model="form.user.phoneAreaCode" filterable placeholder="请选择" @change="changeAreaCodes">
                  <!-- <el-option v-for="item of areaCodes" :key="item.id" :label="item.key" :value="item.value" /> -->
                  <el-option-group
                    v-for="group in areaCodes"
                    :key="group.label"
                    :label="group.label"
                  >
                    <el-option
                      v-for="(item,index) in group.options"
                      :key="item.areaCode +index"
                      :label="`+${item.areaCode} ${item.areaChineseName}`"
                      :value="item.areaCode"
                    >
                      <span>
                        <p>{{ item.areaChineseName }}<em style="float: right; font-style: normal;">+{{ item.areaCode }}</em></p>
                      </span>
                    </el-option>
                  </el-option-group>
                </el-select>
              </el-input>
              <el-input v-if="form.userType === 'email'" v-model="form.user.email" class="w-300" maxlength="30" placeholder="请输入用户邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <div class="common-box m-t10">
          <div class="common-title">用户公司信息</div>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司名称">
              <el-input v-model="form.firm.name" placeholder="请输入" maxlength="50" class="w-296" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位">
              <el-select v-model="form.firm.job" placeholder="请选择" class="w-296">
                <el-option
                  v-for="item in optionsPosition"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所在行业">
              <el-cascader
                v-model="form.firm.industry"
                class="w-296"
                placeholder="请选择所属行业"
                :options="tradeList"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年营业额">
              <el-select v-model="form.firm.turnover" placeholder="请选择" class="w-296">
                <el-option
                  v-for="item in optionsTurnover"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="主营业务">
              <el-input
                v-model="form.firm.business"
                placeholder="请输入"
                maxlength="50"
                class="w-296"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司地址">
              <AppChinaArea v-model="form.firm.firmAddress" propsvalue="name" class="w-296" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="详细地址">
              <el-input
                v-model="form.firm.detailAddress"
                placeholder="请输入"
                maxlength="50"
                class="w-496"
              />
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <div v-if="selectOrderType==='' || selectOrderType === '新购' || selectOrderType === '预存'" class="common-box m-t10">
        <div class="common-title">交易信息</div>
      </div>
      <div v-if="selectOrderType==='' || selectOrderType === '新购' || selectOrderType === '预存'" class="water-header">
        <div class="water-btn" @click="onClickAddWater"><i class="el-icon-plus icon-plus" />交易信息</div>
      </div>
      <div v-if="selectOrderType === '预存'" class="water-list">
        <el-form ref="formWater" :model="formWater" label-width="80px" class="form-box">
          <div v-for="(item, index) in formWater.list" :key="item.num" class="water-child">
            <div class="water-child-header">
              <div class="water-child-header-l">收款流水{{ item.num }}</div>
              <div class="water-child-header-r" @click="onClickDelWater(item.id,item)">删除</div>
            </div>
            <div class="water-child-box">
              <el-row class="m-t20">
                <el-col :span="12">
                  <div class="flex-box">
                    <el-form-item
                      label="收款渠道"
                      :prop="'list.' + index + '.channel'"
                      :rules="[{ required: true, message: '请选择收款渠道', trigger: 'change' }]"
                    >
                      <!-- <span class="water-child-box-title">收款渠道</span> -->
                      <el-select v-model="item.channel" placeholder="请选择" class="m-r8" :class="item.optionsUnit.length?'w-200':'w-296'" @change="getOptionsUnitChange($event,index)">
                        <el-option
                          v-for="e in optionsArrayNoMoneyBag"
                          :key="e.id"
                          :label="e.label"
                          :value="e.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      v-if="item.optionsUnit.length"
                      :prop="'list.' + index + '.unit'"
                      :rules="[{ required: true, message: '请选择收款单位', trigger: 'change' }]"
                    >
                      <el-select v-model="item.unit" placeholder="请选择" class="w-200" @change="getAccountChange($event,index,item.optionsUnit)">
                        <el-option
                          v-for="e in item.optionsUnit"
                          :key="e.id"
                          :label="e.label"
                          :value="e.value"
                        />
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="收款账号">{{ item.optionsUnit.length ? item.account : '--' }}</el-form-item>
                </el-col>
              </el-row>
              <el-row class="m-t20">
                <el-col :span="12">
                  <el-form-item
                    label="交易流水号"
                    :prop="'list.' + index + '.serialNum'"
                    :rules="[{ required: true, message: '请输入交易流水号', trigger: 'blur' }]"
                  >
                    <el-input
                      v-model="item.serialNum"
                      placeholder="请输入"
                      maxlength="50"
                      onkeyup="value=value.replace(/[\u4E00-\u9FA5]/g,'')"
                      class="w-296"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="支付时间"
                    :prop="'list.' + index + '.time'"
                    :rules="[{ required: true, message: '请选择时间', trigger: 'change' }]"
                  >
                    <el-date-picker
                      v-model="item.time"
                      type="datetime"
                      style="width: 296px"
                      :picker-options="pickerOptions"
                      placeholder="选择日期时间"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="m-t20">
                <el-col :span="12">
                  <el-form-item
                    label="流水金额"
                    :prop="'list.' + index + '.price'"
                    :rules="[{ required: true, trigger: 'blur' ,validator:
                      validatePass}]"
                  >
                    <el-input-number v-model="item.price" controls-position="right" :min="0" :max="99999999" :precision="2" class="w-296" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="m-t20">
                <el-col :span="12">
                  <el-form-item
                    label="交易凭证"
                    :prop="'list.' + index + '.imageUrl'"
                    :rules="[{ required: true, message: '请上传交易配图', trigger: 'change' }]"
                  >
                    <div class="upload-img">
                      <div v-for="(items, i) in item.imageUrl" :key="i">
                        <uploadItem
                          :key="i"
                          class="m-r-16 m-b-16 avatar-uploader-icon-box"
                          :status="items.status"
                          :url="items.url"
                          :auth-progress="items.authProgress"
                          @del="delFile(item, i,index)"
                          @again="alignUpload(item, i,index)"
                        />
                      </div>
                      <el-upload
                        v-if="item.imageUrl.length < 6"
                        ref="upload"
                        class="avatar-uploader-icon-box"
                        action="#"
                        :limit="6"
                        :file-list="item.imageUrl"
                        :multiple="true"
                        :show-file-list="false"
                        accept=".jpg,.jpeg,.png,bmp,JPG,JPEG,PNG,BMP"
                        :on-exceed="exceedImgList"
                        :before-upload="beforeUpload"
                        :http-request="(option)=>{return upload(option,index)}"
                      >
                        <i class="el-icon-plus" />
                        <div class="uploadViewText">点击上传</div>
                      </el-upload>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
      </div>
      <div v-if="selectOrderType==='' || selectOrderType === '新购' " class="water-list">
        <el-form ref="formWater" :model="formWater" :rules="formWaterRule" label-width="110px" class="form-box">
          <div v-for="(item, index) in formWater.list" :key="item.num" class="water-child">
            <div class="water-child-header">
              <div class="water-child-header-l">收款流水{{ item.num }}</div>
              <div class="water-child-header-r" @click="onClickDelWater(item.id,item)">删除</div>
            </div>
            <div class="water-child-box">
              <el-row class="m-t20">
                <el-col :span="12">
                  <div class="flex-box">
                    <el-form-item
                      v-if="type==='gift'"
                      label="收款渠道"
                      :prop="'list.' + index + '.channel'"
                      :rules="[{ required: true, message: '请选择收款渠道', trigger: 'change' }]"
                    >
                      <!-- <span class="water-child-box-title">收款渠道</span> -->
                      <el-select v-model="item.channel" placeholder="请选择" class="m-r8" :class="item.optionsUnit.length?'w-200':'w-296'" @change="getOptionsUnitChange($event,index)">
                        <el-option
                          v-for="e in optionsChannel"
                          :key="e.id"
                          :label="e.label"
                          :value="e.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      v-else-if="!moneyBagLocked || item.channel === optionsChannelValue"
                      label="收款渠道"
                      :prop="'list.' + index + '.channel'"
                      :rules="[{ required: true, message: '请选择收款渠道', trigger: 'change' }]"
                    >
                      <!-- <span class="water-child-box-title">收款渠道</span> -->
                      <el-select v-model="item.channel" placeholder="请选择" class="m-r8" :class="item.optionsUnit.length?'w-200':'w-296'" @change="getOptionsUnitChange($event,index)">
                        <el-option
                          v-for="e in optionsChannel"
                          :key="e.id"
                          :label="e.label"
                          :value="e.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      v-else
                      label="收款渠道"
                      :prop="'list.' + index + '.channel'"
                      :rules="[{ required: true, message: '请选择收款渠道', trigger: 'change' }]"
                    >
                      <!-- <span class="water-child-box-title">收款渠道</span> -->
                      <el-select v-model="item.channel" placeholder="请选择" class="m-r8" :class="item.optionsUnit.length?'w-200':'w-296'" @change="getOptionsUnitChange($event,index)">
                        <el-option
                          v-for="e in optionsArrayNoMoneyBag"
                          :key="e.id"
                          :label="e.label"
                          :value="e.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      v-if="item.optionsUnit.length &&
                        item.channel
                        !=optionsChannelValue
                      "
                      :prop="'list.' + index + '.unit'"
                      :rules="[{ required: true, message: '请选择收款单位', trigger: 'change' }]"
                    >
                      <el-select v-model="item.unit" placeholder="请选择" class="w-200" @change="getAccountChange($event,index,item.optionsUnit)">
                        <el-option
                          v-for="e in item.optionsUnit"
                          :key="e.id"
                          :label="e.label"
                          :value="e.value"
                        />
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col v-if="item.channel && item.channel != optionsChannelValue" :span="12">
                  <el-form-item label="收款账号">{{ item.optionsUnit.length ? item.account : '--' }}</el-form-item>
                </el-col>
                <el-col v-if="item.channel && item.channel === optionsChannelValue" :span="12">
                  <el-form-item
                    label="付款账号"
                    :prop="'list.' + index + '.paymentUserPhone'"
                    :rules="[{ required: true, validator: validatePhoneMoneyBag, message: moneyBag.userType === 'phone'?'请输入正确的手机号':'请输入正确的邮箱', trigger: 'blur' }
                    ]"
                  >
                    <el-select v-model="moneyBag.userType" placeholder="请选择" style="width: 90px;" @change="changeUx(item, index)">
                      <el-option label="手机号" value="phone" />
                      <el-option label="邮箱" value="email" />
                    </el-select>
                    <el-input v-if="moneyBag.userType === 'phone'" v-model="item.paymentUserPhone" style="margin-top: 2px;" class="w-350" maxlength="11" placeholder="请输入用户手机号" rule @blur="changePaymentUserPhone(index)">
                      <el-select slot="prepend" v-model="moneyBag.user.phoneAreaCode" placeholder="请选择" @change="changeAreaCodesChange(index)">
                        <!-- <el-option v-for="item of areaCodes" :key="item.id" :label="item.key" :value="item.value" /> -->
                        <el-option-group
                          v-for="group in areaCodes"
                          :key="group.label"
                          :label="group.label"
                        >
                          <el-option
                            v-for="(obj,indexs) in group.options"
                            :key="obj.areaCode+indexs"
                            :label="obj.areaCodePlus"
                            :value="obj.areaCode"
                          >
                            <span>
                              <p>{{ obj.areaChineseName }}<em style="float: right; font-style: normal;">+{{ obj.areaCode }}</em></p>
                            </span>
                          </el-option>
                        </el-option-group>
                      </el-select>
                    </el-input>
                    <el-input v-if="moneyBag.userType === 'email'" v-model="item.paymentUserPhone" class="w-300" maxlength="30" placeholder="请输入用户邮箱" @blur="changePaymentUserPhone(index)" />
                    <!-- <el-input
                      v-model="item.paymentUserPhone"
                      placeholder="请输入付款账号，并查询余额"
                      maxlength="11"
                      @blur="changePaymentUserPhone(index)"
                    /> -->
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="m-t20">
                <el-col v-if="item.channel && item.channel === optionsChannelValue" :span="12">
                  <el-form-item label="用户钱包余额">
                    <el-button v-if="!moneyShowFlag" type="text" @click="toSearchMoney(index)">点击查询</el-button>
                    <p v-else>{{ moneyNumberShow }}</p>
                  </el-form-item>
                </el-col>
                <el-col v-if="item.channel && item.channel === optionsChannelValue" :span="12">
                  <el-form-item
                    label="扣款金额"
                    :prop="'list.' + index + '.price'"
                    :rules="[{ required: true, trigger: 'blur' ,validator:
                      validatePass}]"
                  >
                    <el-input-number v-model="item.price" :disabled="!moneyShowFlag || !moneyThetue" controls-position="right" :min="0" :max="99999999" :precision="2" class="w-296" />
                  </el-form-item>
                </el-col>
              </el-row>
              <div v-if="item.channel && item.channel === optionsChannelValue">
                <el-row class="m-t20">
                  <el-col :span="16">
                    <el-form-item
                      label="交易凭证"
                      :prop="'list.' + index + '.imageUrl'"
                      :rules="[{ required: true, message: '请上传交易配图', trigger: 'change' }]"
                    >
                      <div class="upload-img">
                        <div v-for="(items, i) in item.imageUrl" :key="i">
                          <uploadItem
                            :key="i"
                            class="m-r-16 m-b-16 avatar-uploader-icon-box"
                            :status="items.status"
                            :url="items.url"
                            :auth-progress="items.authProgress"
                            @del="delFile(item, i,index)"
                            @again="alignUpload(item, i,index)"
                          />
                        </div>
                        <el-upload
                          v-if="item.imageUrl.length < 6"
                          ref="upload"
                          class="avatar-uploader-icon-box"
                          action="#"
                          :limit="6"
                          :file-list="item.imageUrl"
                          :multiple="true"
                          :show-file-list="false"
                          accept=".jpg,.jpeg,.png,bmp,JPG,JPEG,PNG,BMP"
                          :on-exceed="exceedImgList"
                          :before-upload="beforeUpload"
                          :http-request="(option)=>{return upload(option,index)}"
                        >
                          <i class="el-icon-plus" />
                          <div class="uploadViewText">点击上传</div>
                        </el-upload>
                      </div>
                    </el-form-item>
                  </el-col>

                </el-row>
              </div>
              <div v-else>
                <el-row class="m-t20">
                  <el-col :span="12">
                    <el-form-item
                      label="交易流水号"
                      :prop="'list.' + index + '.serialNum'"
                      :rules="[{ required: true, message: '请输入交易流水号', trigger: 'blur' }]"
                    >
                      <el-input
                        v-model="item.serialNum"
                        placeholder="请输入"
                        maxlength="50"
                        onkeyup="value=value.replace(/[\u4E00-\u9FA5]/g,'')"
                        class="w-296"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      label="支付时间"
                      :prop="'list.' + index + '.time'"
                      :rules="[{ required: true, message: '请选择时间', trigger: 'change' }]"
                    >
                      <el-date-picker
                        v-model="item.time"
                        type="datetime"
                        style="width: 296px"
                        :picker-options="pickerOptions"
                        placeholder="选择日期时间"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="m-t20">
                  <el-col :span="12">
                    <el-form-item
                      label="流水金额"
                      :prop="'list.' + index + '.price'"
                      :rules="[{ required: true,trigger: 'blur' ,validator:
                        validatePass}]"
                    >
                      <el-input-number v-model="item.price" controls-position="right" :min="0" :max="99999999" :precision="2" class="w-296" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="m-t20">
                  <el-col :span="12">
                    <el-form-item
                      label="交易凭证"
                      :prop="'list.' + index + '.imageUrl'"
                      :rules="[{ required: true, message: '请上传交易配图', trigger: 'change' }]"
                    >
                      <div class="upload-img">
                        <div v-for="(items, i) in item.imageUrl" :key="i">
                          <uploadItem
                            :key="i"
                            class="m-r-16 m-b-16 avatar-uploader-icon-box"
                            :status="items.status"
                            :url="items.url"
                            :auth-progress="items.authProgress"
                            @del="delFile(item, i,index)"
                            @again="alignUpload(item, i,index)"
                          />
                        </div>
                        <el-upload
                          v-if="item.imageUrl.length < 6"
                          ref="upload"
                          class="avatar-uploader-icon-box"
                          action="#"
                          :limit="6"
                          :file-list="item.imageUrl"
                          :multiple="true"
                          :show-file-list="false"
                          accept=".jpg,.jpeg,.png,bmp,JPG,JPEG,PNG,BMP"
                          :on-exceed="exceedImgList"
                          :before-upload="beforeUpload"
                          :http-request="(option)=>{return upload(option,index)}"
                        >
                          <i class="el-icon-plus" />
                          <div class="uploadViewText">点击上传</div>
                        </el-upload>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>

            </div>
          </div>
        </el-form>
      </div>

      <div v-if="selectOrderType==='' || selectOrderType === '新购'" class="pay-box">
        <div v-if="form.materialGoodsOrderVoList.length && goodsAllPrice > 0" class="price-num" :class="goodsAllPrice > 0 ? '':'m-b16'">商品金额：¥{{ goodsAllPrice }}</div>
        <!-- <div class="price-num m-b16">商品金额：¥{{ goodsAllPrice }}</div> -->
        <div v-if="form.materialGoodsOrderVoList.length && allYouhuiPay > 0" class="price-num m-b16">优惠金额：-¥{{ allYouhuiPay }}</div>
        <div class="price-common-title">应付金额：¥{{ allShouldPay }}</div>
        <div class="price-common-title">实付金额：<span class="price-num-red">¥{{ paidIn }}</span></div>
        <div v-if="Number(allShouldPay) != Number(paidIn)" class="price-tomast">实付金额必须等于应付金额</div>
      </div>
      <div v-if="selectOrderType === '赠送'" class="pay-box">
        <div class="price-num m-b16">商品金额：¥{{ goodsAllPrice }}</div>
        <div v-if="goodsAllPrice > 0" class="price-num m-b16">优惠金额：-¥{{ goodsAllPrice }}</div>
        <div class="price-common-title">应付金额：¥0.00</div>
      </div>
      <div v-if="selectOrderType === '预存'" class="pay-box">
        <div class="price-num m-b16">实付金额：¥ {{ paidMoneyNumber }}</div>
      </div>
      <div class="foot-box">
        <el-button type="primary" size="medium" @click="submitForm('form','formWater')">保存</el-button>
        <el-button size="medium" @click="goBack">取消</el-button>
      </div>
    <!-- common end -->
    </div>
    <div v-else class="confirm-box">
      <confirm-order
        ref="confirmOrder"
        :form="form"
        :list="formWater.list"
        :order-type="selectOrderType"
        :gift-type="selectGiftType"
        :deposit-goods-obj="depositGoodsObj"
        :goods-all-price="goodsAllPrice"
        :all-youhui-pay="allYouhuiPay"
        :options-channel-value="optionsChannelValue"
        :amount-pay="allShouldPay"
        :paid-money-number="paidMoneyNumber"
        :paid-in="paidIn"
        :submit-flag="submitFlag"
        @submitOK="submitOK"
        @submitNO="submitNO"
      />
    </div>
  </div>
</template>

<script>
// import orderSign from './orderSign.vue' // 订单标记弹框
// import AppDialog from '@/components/AppDialog'
import { getFileType } from '@/utils/index'
import { getTradeData } from '@/utils/getApiData'
import { getDict } from '@/utils/index'
import uploadItem from './uploadItem.vue'
import {
  getDeptAndChildren,
  getDepositGoods,
  getQueryMoneyByPhone,
  taskSelect,
  getPhoneAreaCodes
} from '@/api/business/addOrder'
import {
  findTypeList,
  getMaterialGoodsByNameList,
  findGoodsIdByList,
  addOrderAndUpdate,
  findUserByRealName
} from '@/api/business'
import {
  findCollectionList,
  listByGiveParentOrderNo
} from '@/api/order/index'
// import InputGoods from '../components/inputGoods/index.vue'
import ConfirmOrder from '../components/confirmOrder/index.vue'
import { mapGetters } from 'vuex'
import OrderList from '../components/orderList/index.vue'
import giveList from './giveList.vue'
// import AppChinaArea from '@/components/AppChinaArea'
import { getOssConfig } from '@/api/file'
import { deepClone } from '@/utils'
export default {
  name: 'AddOrder',
  components: {
    // InputGoods,
    ConfirmOrder,
    OrderList,
    // AppChinaArea,
    uploadItem,
    giveList
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['search', 'optionsApproval'],
  data() {
    const validatePass = (rule, value, callback) => {
      const str = rule.fullField
      const strArr = str.split('.')
      const index = strArr[1]
      if (this.formWater.list[index].channel === this.optionsChannelValue) {
        if (value <= 0) {
          callback(new Error('扣款金额不能为0'))
        } else if (value > this.moneyNumberShow) {
          callback(new Error('用户钱包余额不足'))
        } else {
          callback()
        }
      } else {
        if (value <= 0) {
          callback(new Error('流水金额不能为0'))
        } else {
          callback()
        }
      }
    }
    return {
      moneyBag: {},
      validatePass,
      pickerOptions: {
        // 设置禁用状态，参数为当前日期
        disabledDate(time) {
          // return time.getTime() < Date.now(); //当天不可选
          return time.getTime() > Date.now() // - 86400000 //  - 86400000是否包括当天
        },
        // 控制时分秒不可选
        selectableRange: '00:00:00 - 23:59:59' // + new Date().getHours() + ':' + (new Date().getMinutes() + 1) + ':59'
      },
      submitFlag: false,
      confirm: true,
      selectGoods: false,
      permsList: this.$route.meta.permsList || [],
      channelSource: [],
      form: {
        remarks: '',
        imageList: [],
        orderType: { // 订单类型
          o_one: '',
          o_two: ''
        },
        channel: '', // 渠道来源
        orderNo: '', // 订单编号
        teacherName: {
          name: '',
          content: ''
        }, // 招生老师
        taskId: '',
        taskName: '',
        materialGoodsOrderVoList: [
          {
            id: '',
            contentName: '',
            goodsData: [
              {
                id: '',
                goodsName: '',
                goodsType: '',
                goodsPrice: 0,
                goodsPreferentialPrice: 0, // 优惠金额
                goodsNum: '',
                image: '',
                goodsTypeNum: '',
                coverVerticalUrl: '',
                preferentialDesc: ''
              }
            ],
            tableShow: false, // tab默认关闭
            specsId: '',
            specs: '',
            optionsSpecs: [] // 商品规格
          }
        ],
        goods: { // 商品信息
          id: '',
          contentName: '',
          goodsData: [],
          tableShow: false, // tab默认关闭
          specsId: '',
          specs: ''
        },
        giveDesc: '', // 赠送理由
        givePhoto: [], // 赠单凭证
        preferentialDesc: '', // 优惠原因
        sixp: 0, // 6p
        sessions: '', // 场次
        userType: 'phone',
        user: { // 用户信息
          name: '',
          phoneAreaCode: '86',
          phone: '',
          email: ''
        },
        firm: { // 公司信息
          name: '',
          job: '',
          industry: '',
          turnover: '',
          business: '',
          firmAddress: [],
          detailAddress: ''
        }
      },
      formWaterRule: {
        'goods.id': [{ required: true, message: '请选择商品', trigger: 'blur' }]
      },
      rules: {
        'goods.goodsData[0].goodsPreferentialPrice': [{ required: true, message: '请输入优惠金额', trigger: 'blur' }],
        'orderType.o_one': [{ required: true, message: '请选择订单类型', trigger: 'change' }],
        'orderType.o_two': [{ required: true, message: '请选择赠送方式', trigger: 'change' }],
        labelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        giveDesc: [{ required: true, message: '请输入赠单原因', trigger: 'blur' }],
        givePhoto: [{ required: true, message: '请上传赠单凭证配图', trigger: 'change' }],
        channel: [{ required: true, message: '请选择成交来源', trigger: 'change' }],
        'teacherName.name': [{ required: true, message: '请输入招生老师', trigger: 'blur' }],
        orderNo: [{ required: true, message: '请输入订单编号', trigger: 'blur' }],
        'goods.id': [{ required: true, message: '请选择商品', trigger: 'blur' }],
        'goods.specsId': [{ required: true, message: '请选择规格', trigger: 'change' }],
        preferentialDesc: [{ required: true, message: '存在优惠金额请填写优惠原因', trigger: 'blur' }],
        sixp: [{ required: true, message: '请选择是否来源大6P', trigger: 'change' }],
        sessions: [{ required: true, message: '请输入场次', trigger: 'blur' }],
        'user.name': [{ required: true, message: '请正确输入用户姓名', trigger: 'blur' }],
        'user.phone': [
          { validator: this.validatePhoneArea, message: '请选择区号', trigger: 'blur' },
          { validator: this.validatePhone, message: '请输入正确的手机号', trigger: 'blur' },
          { required: true, message: '请正确输入手机号码', trigger: 'blur' }
          // { min: 11, max: 11, message: '手机号长度不正确', trigger: 'blur' }
        ],
        'user.email': [
          { required: true, message: '请输入邮箱号码', trigger: 'blur' },
          { message: '请输入正确的邮箱', pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, trigger: 'blur' }
        ],
        title: [{ required: true, message: '请输入视频组标题', trigger: 'blur' }, { min: 2, max: 30, message: '请输入2~30个字符视频组标题', trigger: 'blur' }],
        teacherId: [{ required: true, message: '请选择录制IP', trigger: 'change' }]
      },
      fileList: [],
      optionsType: [],
      optionsGiftType: [],
      selectOrderType: '', // 订单类型
      selectGiftType: '', // 所选赠送
      optionsPosition: [], // 职务
      optionsTurnover: [], // 营业额
      priceIn: false,
      formWater: {
        list: [{ // 默认
          id: this.getUuiD(25),
          num: 1,
          channel: '', // 渠道
          unit: '', // 单位
          account: '', // 账户
          serialNum: '', // 流水号
          time: '', // 支付时间
          price: '', // 金额
          optionsUnit: [], // 单位可选
          channelLabel: '', // 渠道名称
          phoneAreaCode: '',
          imageUrl: [] // 交易凭证
        }]
      },
      allShouldPay: 0,
      allYouhuiPay: 0,
      goodsAllPrice: '0.00', // 商品金额
      amountPay: '0.00', // 应付金额
      paidIn: '0.00', // 实付金额
      optionsChannel: [], // 收款渠道
      tradeList: [], // 所属行业
      optionsSixp: [{ id: 0, value: 0, label: '否' }, { id: 1, value: 1, label: '是' }],
      optionsGoods: [],
      disabledGoods: false,
      searchPrecisen: { // 精准搜索
        content: '',
        isGive: ''
      },
      paidInStatus: false,
      restaurantsTeacher: [], // 缓存搜索老师
      userInfo: '',
      depositGoodsObj: [],
      optionsArrayNoMoneyBag: [],
      moneyBagLocked: false,
      optionsChannelValue: '',
      moneyShowFlag: false,
      moneyNumberShow: '',
      moneyThetue: false,
      paidMoneyNumber: 0,
      optionsTask: [],
      areaCodes: [],
      type: '',
      giveOrderList: []
    }
  },
  computed: {
    ...mapGetters(['channelSourceType'])
  },
  watch: {
    'formWater.list': {
      handler(val) {
        let paidIn = 0
        this.paidMoneyNumber = 0
        val.map(v => {
          if (v.price !== '' && v.price !== null && v.price !== undefined) {
            paidIn = Number(v.price) + Number(paidIn)
          }
          this.paidMoneyNumber += Number(v.price)
          if (v.channel === this.optionsChannelValue) {
            // v.phoneAreaCode = this.moneyBag?.user.phoneAreaCode
            this.$set(v, 'phoneAreaCode', this.moneyBag.user.phoneAreaCode ? this.moneyBag.user.phoneAreaCode : '')
          }
        })

        this.paidIn = paidIn.toFixed(2)
        if (Number(this.amountPay) > 0) { paidIn >= Number(this.amountPay) ? this.paidInStatus = false : this.paidInStatus = true }
      },
      deep: true,
      immediate: true
    },
    'form.userType': {
      handler(val) {
        if (val === 'email') {
          this.form.user.phone = ''
        } else if (val === 'phone') {
          this.form.user.email = ''
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.type = this.$route.query.type
    this.$store.dispatch('option/getChannelsourceType')
    this.getOssConfig()
    this.getFindTypeList()
    this.getFindCollectionList()
    this.getTradeDomianList()
    this.getDict()
    this.remoteMethod()
    // this.getMaterialGoodsByNameList()
  },
  mounted() {
    this.userInfo = this.$store.getters.userInfo
    this.form.teacherName.name = this.$store.getters.userInfo.nickName
    this.form.teacherName.content = this.userInfo.userId
    getDeptAndChildren().then(res => {
      if (res.code === 1) {
        if (res.data) {
          this.channelSource = [{ id: 8, label: '博商销售成交', value: 8 }]
        } else {
          this.channelSource = [{ id: 9, label: '获客线下收款', value: 9 }]
        }
      }
    })
    this.getDepositGoods()
    this.getPhoneAreaCodes()
  },
  methods: {
    changePaymentUserPhone(index) {
      this.moneyShowFlag = false
      this.formWater.list[index].price = 0
      if (this.moneyBag.userType === 'phone') {
        this.moneyBag.user.phone = this.formWater.list[index].paymentUserPhone
      } else if (this.moneyBag.userType === 'email') {
        this.moneyBag.user.email = this.formWater.list[index].paymentUserPhone
      }
    },
    async remoteMethod(query) {
      const { data } = await taskSelect({
        pageIndex: 1,
        pageSize: 100,
        taskName: query || undefined,
        userId: this.form.teacherName.content
      })
      this.optionsTask = data.items
    },
    handleChangeTask() {
      const data = this.optionsTask.find(i => i.id === this.form.taskId)
      this.form.taskName = data?.taskName ?? ''
    },
    handleClear() {
      this.remoteMethod()
    },
    toSearchMoney(index) {
      this.moneyNumberShow = ''
      const params = {
        type: this.moneyBag.userType === 'phone' ? '1' : '2',
        phone: this.moneyBag.userType === 'phone' ? this.formWater.list[index].paymentUserPhone : '',
        email: this.moneyBag.userType === 'email' ? this.formWater.list[index].paymentUserPhone : '',
        phoneAreaCode: this.moneyBag.userType === 'phone' ? this.moneyBag.user.phoneAreaCode : ''
      }
      getQueryMoneyByPhone(params).then(res => {
        if (res.code === 1 && res.data) {
          this.moneyShowFlag = !this.moneyShowFlag
          this.moneyNumberShow = (Number(res.data.balance) / 100).toFixed(2)
          this.moneyThetue = true
          if (this.formWater.list[index].price !== 0) {
            const str = 'list.' + index + '.price'
            this.$refs.formWater.validateField(str)
          }
        } else {
          this.moneyShowFlag = !this.moneyShowFlag
          this.moneyThetue = false
          this.moneyNumberShow = '输入账号钱包无余额'
          this.formWater.list[index].price = 0
        }
      })
    },
    getDepositGoods() {
      getDepositGoods().then(res => {
        console.log('任务二手房：', res)
        if (res.code === 1) {
          this.depositGoodsObj = []
          const obj = res.data
          if (obj.goodsType === 0) {
            obj.goodsTypeName = '图片'
          } else if (obj.goodsType === 1) {
            obj.goodsTypeName = '音频'
          } else if (obj.goodsType === 2) {
            obj.goodsTypeName = '视频'
          } else if (obj.goodsType === 3) {
            obj.goodsTypeName = '专栏'
          } else if (obj.goodsType === 4) {
            obj.goodsTypeName = '大专栏'
          } else if (obj.goodsType === 5) {
            obj.goodsTypeName = '线下课'
          } else if (obj.goodsType === 6) {
            obj.goodsTypeName = '直播'
          }
          this.depositGoodsObj.push(res.data)
        }
      })
    },
    getPhoneAreaCodes() {
      getPhoneAreaCodes().then(res => {
        const allData = res.data || []
        this.areaCodes = allData
        this.areaCodes.some(item => {
          item.options.some(obj => {
            obj.areaCodePlus = '+' + obj.areaCode
          })
        })
      })
    },
    // 获取oss配置
    getOssConfig() {
      this.loading = true
      getOssConfig()
        .then((res) => {
          this.ossConfig = {
            region: 'oss-accelerate',
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            secure: true,
            bucket: res.data.ossBucket,
            ossBucketUrl: res.data.ossBucketUrl,
            ossEndPoint: res.data.ossEndPoint
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('获取oss配置失败')
          this.loading = false
        })
    },
    // 获取列表数据
    getMaterialGoodsByNameList() {
      const params = {
        contentName: ''
      }
      getMaterialGoodsByNameList(params)
        .then((res) => {
          res.data.map((v, i) => {
            v.goodsNum = 1
            v.marketPrice = v.marketPrice ? v.marketPrice.toFixed(2) : '0'
            this.optionsGoods.push({
              key: i,
              value: i,
              label: v.contentName,
              content: v
            })
          })
        })
    },
    async getTradeDomianList() {
      const trade = await getTradeData()
      this.tradeList = trade.map((i) => {
        return {
          id: i.label,
          value: i.label,
          label: i.label
        }
      })
    },
    clearGoods() {
      this.form.goods.goodsData = []
      this.form.goods.id = ''
      this.form.goods.contentName = ''
      this.disabledGoods = false
      this.optionsSpecs = []
      this.form.goods.specsId = ''
      this.form.goods.specs = ''
      this.form.goods.tableShow = false
      this.goodsAllPrice = '0.00'
      this.amountPay = '0.00'
    },
    getFindTypeList() {
      const param = {}
      findTypeList(param)
        .then((res) => {
          console.log('查询配置接口', res)
          res.data.map(v => {
            v.type !== '转课' ? this.optionsType.push(v) : ''
          })
          if (this.type === 'gift') {
            this.optionsType = this.optionsType.filter(i => ['新购', '赠送'].includes(i.type))
          }
          console.log('查询结果', this.optionsType)
        })
        .catch(() => {
        })
    },
    async getDict() {
      const position = await getDict('sys_position')
      const turnover = await getDict('sys_turnover')
      this.optionsPosition = position.map((i) => {
        return {
          id: i.dictLabel,
          value: i.dictLabel,
          label: i.dictLabel
        }
      })
      this.optionsTurnover = turnover.map((i) => {
        return {
          id: i.dictLabel,
          value: i.dictLabel,
          label: i.dictLabel
        }
      })
      console.log('optionsPosition', this.optionsPosition)
      console.log('optionsPosition', this.optionsTurnover)
    },
    selectThirdShop(orderNo) {
      console.log('查询订单')
      const params = {
        orderNo,
        type: 1 // 1 赠送关联订单精准查询 2 认领订单精准查询
      }
      this.searchPrecisen = { // 精准搜索
        content: '',
        isGive: ''
      }
      orderNo === '-' ? this.form.orderNo = '' : ''
      if (this.form.orderNo) {
        listByGiveParentOrderNo(params).then(res => {
          console.log('关联订单', res)
          this.giveOrderList = res.data
        })
      } else {
        this.giveOrderList = []
      }
      this.$refs.orderList.searchPrecisen(params)
    },
    getFindCollectionList() {
      const param = {}
      findCollectionList(param)
        .then((res) => {
          const channel = []
          if (res.data.length) {
            console.log('rrreeeddddaatattatat:', res.data)
            res.data.map(v => {
              if (v.channel === '抖音' || v.channel === '商学通' || v.channel === '获课一下' || v.channel === '小鹅通' || v.channel === '微信小商店' || v.channel === '有赞' || v.channel === '快手' || v.channel === '博商' || v.channel === '抖店测试' || v.channel === 'pos机扫码' || v.channel === 'pos机刷卡' || v.channel === '博商-建设银行') {
                return
              } else {
                channel.push({
                  label: v.channel, value: v.id, id: v.id, companyVo: v.companyVo
                })
              }
            })
            if (this.type === 'gift') {
              this.optionsChannel = channel.filter(i => i.label === '钱包支付')
            } else {
              this.optionsChannel = channel
            }
            this.optionsArrayNoMoneyBag = []
            this.optionsChannel.some(item => {
              if (item.label !== '钱包支付') {
                this.optionsArrayNoMoneyBag.push(item)
              } else if (item.label === '钱包支付') {
                this.optionsChannelValue = item.value
              }
            })
          }
        })
        .catch(() => {
        })
    },
    receiveSizeChange(e) {
      this.$refs.orderSearch.sizeChange(e)
      console.log('this.search', this.search)
    },
    receiveTableDataNum(e) {
      this.$refs.orderSearch.tableDataNumChange(e)
    },
    getUuiD(randomLength) {
      return Number(Math.random().toString().substr(2, randomLength) + Date.now()).toString(36) + Math.floor(Math.random() * 10) + 1
    },
    hasDuplicateField(array, field) {
      const map = {}
      for (let i = 0; i < array.length; i++) {
        const value = array[i][field]
        if (map[value]) {
          return true
        }
        map[value] = true
      }
      return false
    },
    async onChangeGoods(item, index) {
      console.log('tttttttttttttttt:', item)
      const goods = item
      const searchGoods = await findGoodsIdByList({ goodsId: goods.goodsId })
      this.form.materialGoodsOrderVoList[index].goodsData = []
      this.form.materialGoodsOrderVoList[index].optionsSpecs = []
      this.form.materialGoodsOrderVoList[index].specsId = ''
      this.form.materialGoodsOrderVoList[index].specs = ''
      this.form.materialGoodsOrderVoList[index].id = goods.goodsId
      this.form.materialGoodsOrderVoList[index].contentName = goods.contentName
      console.log('this.form.materialGoodsOrderVoList: ', this.form.materialGoodsOrderVoList)
      let goodsType = ''
      if (goods.goodsType === 0) {
        goodsType = '图片'
      } else if (goods.goodsType === 1) {
        goodsType = '音频'
      } else if (goods.goodsType === 2) {
        goodsType = '视频'
      } else if (goods.goodsType === 3) {
        goodsType = '专栏'
      } else if (goods.goodsType === 4) {
        goodsType = '大专栏'
      } else if (goods.goodsType === 5) {
        goodsType = '线下课'
      } else if (goods.goodsType === 6) {
        goodsType = '直播'
      }
      let pircePrice = 0
      if (goods.salePrice) {
        pircePrice = Number(goods.salePrice / 100).toFixed(2)
      } else {
        pircePrice = Number(0).toFixed(2)
      }
      this.form.materialGoodsOrderVoList[index].goodsData.push(
        {
          id: goods.goodsId,
          goodsName: goods.contentName,
          goodsType,
          goodsPrice: pircePrice,
          goodsPreferentialPrice: 0, // 优惠金额
          goodsNum: 1,
          image: goods.coverUrl,
          goodsTypeNum: goods.goodsType,
          coverVerticalUrl: goods.coverVerticalUrl
        }
      )

      if (searchGoods.data?.length) {
        this.form.materialGoodsOrderVoList[index].optionsSpecs = searchGoods.data.map((v, i) => {
          return {
            id: v.specId,
            value: v.specId,
            label: v.sort + '-' + v.specName + '-' + Number(v.salePrice / 100).toFixed(2),
            specId: v.specId,
            content: v
          }
        })
      } else {
        this.disabledGoods = true
        this.form.materialGoodsOrderVoList[index].tableShow = true
        this.countAllData()
      }

      console.log('this.form.goods.goodsData', this.form.materialGoodsOrderVoList[index].goodsData)
    },
    onChangeGoodsSpecs(e, index) {
      console.log('this.form.materialGoodsOrderVoList[index]: ', this.form.materialGoodsOrderVoList[index])
      console.log('eeeeeeeeeeeee: ', e)
      console.log(index)
      this.form.materialGoodsOrderVoList[index].optionsSpecs.map((v, i) => {
        if (v.id === e) {
          const goods = this.form.materialGoodsOrderVoList[index].optionsSpecs[i].content
          this.disabledGoods = true
          this.form.materialGoodsOrderVoList[index].tableShow = true
          this.form.materialGoodsOrderVoList[index].goodsData[0].goodsPrice = Number(goods.salePrice / 100).toFixed(2)
          this.form.materialGoodsOrderVoList[index].specsId = goods.specId
          this.form.materialGoodsOrderVoList[index].specs = goods
          const preferentialPrice = Number(this.form.materialGoodsOrderVoList[index].goodsData[0].goodsPreferentialPrice)
          this.form.materialGoodsOrderVoList[index].goodsData[0].goodsPreferentialPrice = Number(preferentialPrice).toFixed(2)
          this.form.materialGoodsOrderVoList[index].goodsData[0].materialSpecVo = v.content
          this.getIGoodsPreferentialPrice(index)
          console.log('当前商品信息', this.form.materialGoodsOrderVoList[index])
          console.log(goods, '选中规格商品')
        }
      })
    },
    async querySearchAsync(queryString, cb) {
      var results = []
      if (queryString === '') {
        cb(results)
      } else {
        const params = {
          realName: this.form.teacherName.name
        }
        const findResultse = await findUserByRealName(params)
        if (findResultse.code === 1) {
          var result = findResultse.data
          // 循环放到一个远程搜索需要的数组
          result.map(v => {
            results.push({
              value: v.nickName,
              id: v.userIdStr
            })
          })
          // for (let i = 0; i < result.length; i++) {
          //   const element = result[i]
          //   results.push({
          //     value: element.nickName,
          //     id: element.customer_id
          //   })
          // }
          cb(results)
        } else {
          results = []
          cb(results)
        }
      }
    },
    // 点击出现搜索后点击的每一项
    handleSelect(item) {
      // this.id = item.id
      this.form.teacherName.name = item.value
      this.form.teacherName.content = item.id
      this.form.taskId = ''
      this.remoteMethod()
    },
    async querySearchAsyncGoods(queryString, cb) {
      var results = []
      if (queryString === '') {
        cb(results)
      } else {
        const params = {
          contentName: this.form.goods.contentName
        }
        const findResultse = await getMaterialGoodsByNameList(params)
        if (findResultse.code === 1) {
          var result = findResultse.data
          // 循环放到一个远程搜索需要的数组
          result.map((v, i) => {
            v.goodsNum = 1
            v.marketPrice = v.marketPrice ? v.marketPrice.toFixed(2) : '0'
            // this.optionsGoods.push({
            //   key: i,
            //   value: i,
            //   label: v.contentName,
            //   content: v
            // })
            results.push({
              value: v.contentName,
              id: i,
              key: i,
              label: v.contentName,
              content: v
            })
          })
          // for (let i = 0; i < result.length; i++) {
          //   const element = result[i]
          //   results.push({
          //     value: element.nickName,
          //     id: element.customer_id
          //   })
          // }
          cb(results)
        } else {
          results = []
          cb(results)
        }
      }
    },
    handleSelectGoods(item, index) {
      const goodsId = item.goodsId
      console.log(goodsId, 'goodsId')
      this.$refs['form'].clearValidate(['materialGoodsOrderVoList.' + index + '.id'])
      this.form.materialGoodsOrderVoList[index].id = goodsId
      // this.form.goods.id = goodsId
      this.onChangeGoods(item, index)
      // // this.id = item.id
      // this.form.teacherName.name = item.value
    },
    selectedGoods(e) {
      console.log('搜索结果', e)
    },
    onClickTabDel(index) {
      this.$set(this.form.materialGoodsOrderVoList, index, {
        id: '',
        contentName: '',
        goodsData: [
          {
            id: '',
            goodsName: '',
            goodsType: '',
            goodsPrice: 0,
            goodsPreferentialPrice: 0, // 优惠金额
            goodsNum: '',
            image: '',
            goodsTypeNum: '',
            coverVerticalUrl: '',
            preferentialDesc: ''
          }
        ],
        tableShow: false, // tab默认关闭
        specsId: '',
        specs: '',
        optionsSpecs: [] // 商品规格
      })
      this.countAllData()
    },
    onSave() {
      console.log('流水', this.water_list)
      console.log('保存', this.form)
    },
    getOrderTypeChange(e) {
      const list = this.formWater.list
      console.log('this.formWater.list:', this.formWater.list)
      this.form.orderType.o_two = ''
      this.optionsType.map(v => {
        if (v.id === e) {
          this.selectOrderType = v.type
          this.optionsGiftType = v.childrenList
          if (v.type === '新购') {
            this.selectGiftType = ''
            this.moneyBagLocked = false
            console.log('新购delist', list)
          } else if (v.type === '预存') {
            console.log('预存的list', list)
            this.form.materialGoodsOrderVoList = [
              {
                id: '',
                contentName: '',
                goodsData: [
                  {
                    id: '',
                    goodsName: '',
                    goodsType: '',
                    goodsPrice: 0,
                    goodsPreferentialPrice: 0, // 优惠金额
                    goodsNum: '',
                    image: '',
                    goodsTypeNum: '',
                    coverVerticalUrl: '',
                    preferentialDesc: ''
                  }
                ],
                tableShow: false, // tab默认关闭
                specsId: '',
                specs: '',
                optionsSpecs: [] // 商品规格
              }
            ]
            this.form.sixp = 0
            this.form.sessions = 0
            this.form.remarks = ''
            this.form.imageList = []
            this.formWater.list?.some(item => {
              if (item.channel === this.optionsChannelValue) {
                item.channelLabel = ''
                item.channel = ''
                item.optionsUnit = []
                item.unit = ''
                item.account = ''
                item.price = 0
                item.serialNum = ''
                item.time = ''
                item.imageUrl = []
              }
            })
            this.$refs.formWater.clearValidate()
          } else {
            if (this.form.materialGoodsOrderVoList?.length > 0) {
              this.goodsAllPrice = 0
              this.form.materialGoodsOrderVoList.some((item, i) => {
                if (item.goodsData?.length > 0) {
                  this.goodsAllPrice = Number(this.goodsAllPrice) + Number(item.goodsData[0].goodsPrice)
                  item.goodsData[0].goodsNum = 1
                  item.goodsData[0].goodsPreferentialPrice = 0
                  // this.getIGoodsPreferentialPrice()
                }
              })
              this.goodsAllPrice = this.goodsAllPrice.toFixed(2)
            }
          }
        }
      })
      /* this.formWater = {
        list: [{ // 默认
          id: this.getUuiD(25),
          num: 1,
          channel: '', // 渠道
          unit: '', // 单位
          account: '', // 账户
          serialNum: '', // 流水号
          time: '', // 支付时间
          price: '', // 金额
          optionsUnit: [], // 单位可选
          channelLabel: '', // 渠道名称
          imageUrl: [] // 交易凭证
        }]
      }*/
      this.$nextTick(() => {
        console.log('ddd:', this.$refs.formWater)
        this.$refs.formWater.clearValidate()
      })
    },
    getOptionsUnitChange(e, index) {
      const unit = []
      if (e === this.optionsChannelValue) {
        this.moneyBagLocked = true
        this.moneyNumberShow = 0
        this.moneyShowFlag = false
        this.moneyBag = deepClone({ ... this.form })
      } else {
        this.moneyBagLocked = false
        this.formWater.list?.some(item => {
          if (item.channel === this.optionsChannelValue) {
            this.moneyBagLocked = true
          }
        })
      }
      this.optionsChannel.map((v, i) => {
        if (v.id === e) {
          console.log(v, '所选')
          this.formWater.list[index].channelLabel = v.label
          this.formWater.list[index].optionsUnit = []
          this.formWater.list[index].unit = ''
          this.formWater.list[index].account = ''
          this.formWater.list[index].price = 0
          this.formWater.list[index].serialNum = ''
          this.formWater.list[index].time = ''
          this.formWater.list[index].imageUrl = []
          console.log('this.formWater.list[index].channelLabel', this.formWater.list[index].channelLabel)
          v.companyVo.map(e => {
            unit.push({
              label: e.company, value: e.id, id: e.id, account: e.account
            })
          })
          if (v.id === this.optionsChannelValue) {
            this.moneyBagLocked = true
            if (this.moneyBag.userType === 'email') {
              this.$delete(this.formWater.list[index], 'paymentUserPhone')
              this.$set(this.formWater.list[index], 'paymentUserPhone', this.moneyBag.user.email)
            } else if (this.moneyBag.userType === 'phone') {
              this.$delete(this.formWater.list[index], 'paymentUserPhone')
              this.$set(this.formWater.list[index], 'paymentUserPhone', this.moneyBag.user.phone)
            }
            // this.$set(this.formWater.list[index], 'paymentUserPhone', this.form.user.phone)
          } else {
            this.moneyBagLocked = false
            this.formWater.list.some(item => {
              if (item.channel === this.optionsChannelValue) {
                this.moneyBagLocked = true
              }
            })
          }
        }
        this.formWater.list[index].optionsUnit = unit
      })
    },
    getAccountChange(e, index, optionsUnit) {
      optionsUnit.map(v => {
        if (v.id === e) {
          this.formWater.list[index].account = v.account
        }
      })
    },
    getOrderGiftTypeChange(e) {
      this.form.orderNo = ''
      this.optionsGiftType.map(v => {
        if (v.id === e) {
          this.selectGiftType = v.type
        }
      })
    },
    async submitForm(formName, formName1) {
      if (this.selectOrderType === '预存') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$refs[formName1].validate((valid) => {
              if (valid) {
                if (this.hasDuplicateField(this.formWater.list, 'serialNum')) {
                  this.$message.error('交易流水号重复，请重新修改')
                  return false
                }
                if (this.paidMoneyNumber === 0) {
                  this.$message.error('预存金额不能为0')
                  return
                }
                if (this.selectOrderType === '' || this.selectOrderType === '新购') {
                  if (!this.paidInStatus) {
                    this.$refs[formName1].validate((valid) => {
                      if (valid) {
                        if (this.hasDuplicateField(this.formWater.list, 'serialNum')) {
                          this.$message.error('交易流水号重复，请重新修改')
                          return false
                        }
                        this.confirm = !this.confirm
                      } else {
                        return false
                      }
                    })
                  } else {
                    this.$notify({
                      title: '警告',
                      message: '实付金额不能少于应付金额',
                      type: 'warning'
                    })
                  }
                } else {
                  this.confirm = !this.confirm
                }
              } else {
                this.$message.error('有内容未正确填写，请检查并填写！')
                return false
              }
            })
          } else {
            this.$message.error('有内容未正确填写，请检查并填写！')
            return false
          }
        })
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('in')
          } else {
            console.log('error in')
          }
        })
        const that = this
        const newArr = []
        this.form.materialGoodsOrderVoList.some(item => {
          item.goodsData[0].materialSpecVo = item.optionsSpecs[0]
        })
        if (Number(this.allShouldPay) <= 0) {
          if (Number(this.allShouldPay) < Number(this.paidIn) || Number(this.allShouldPay) > Number(this.paidIn)) {
            this.$message.error('实付金额必须等于应付金额！')
            return
          }
        }
        if (this.selectOrderType === '新购') {
          if (Number(this.allShouldPay) > Number(this.paidIn)) {
            this.$message.error('实付金额不能小于应付金额！')
            return
          }
          let jineFlag = false
          this.form.materialGoodsOrderVoList.some(item => {
            if (item.goodsData[0].priceIn) {
              jineFlag = true
            }
          })
          if (jineFlag) {
            this.$message.error('有优惠金额填写错误，请检查！')
            return
          }
        }
        if (this.priceIn && this.selectOrderType === '新购') {
          this.$message.error('商品信息优惠金额有误')
          return
        } else {
          if (this.selectGiftType === '关联订单赠送' && !this.searchPrecisen.isGive) {
            this.$message.error(this.searchPrecisen.content ? this.searchPrecisen.content : '没有可赠送的关联订单')
            return
          } else {
            await (function() {
              return new Promise(function(res, rej) {
                const arr = that.formWater.list
                for (let i = 0; i < arr.length - 1; i++) {
                  for (let j = i + 1; j < arr.length; j++) {
                    if (arr[i].serialNum === arr[j].serialNum) {
                      newArr.push(arr[j])
                    }
                  }
                }
                arr.map(v => {
                /* if (v.serialNum.length !== v.serialNum.replace(/[^\w]/g, '').length) {
                  newArr.push(v)
                }*/
                })
                res()
              })
            }())
            this.$refs[formName].validate((valid) => {
              if (valid) {
              //   if (this.form.goods.id) {
              //     this.form.goods.goodsData[0].goodsPreferentialPrice = Number(this.form.goods.goodsData[0].goodsPreferentialPrice)
              //   }
                if (this.selectOrderType === '' || this.selectOrderType === '新购') {
                  if (!this.paidInStatus) {
                    this.$refs[formName1].validate((valid) => {
                      if (valid) {
                        if (this.hasDuplicateField(this.formWater.list, 'serialNum')) {
                          this.$message.error('交易信息中的交易流水号不能重复且只能输入数字和英文:' + newArr[0].serialNum)
                          return false
                        }
                        newArr.length ? this.$message.error('交易信息中的交易流水号不能重复且只能输入数字和英文:' + newArr[0].serialNum) : that.confirm = !that.confirm
                      } else {
                        return false
                      }
                    })
                  } else {
                    this.$notify({
                      title: '警告',
                      message: '实付金额不能少于应付金额',
                      type: 'warning'
                    })
                  }
                } else {
                  this.confirm = !this.confirm
                }
              } else {
                this.$message.error('有内容未正确填写，请检查并填写！')
                return false
              }
            })
          }
        }
      }
    },
    goBack() {
      // this.resetForm('form')
      // this.resetForm('formWater')
      // this.confirm = !this.confirm
      this.$router.push({ path: `/business/orderManage` })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getIGoodsPreferentialPrice(index) {
      if (this.form.materialGoodsOrderVoList[index].goodsData.length) {
        if (this.form.materialGoodsOrderVoList[index].goodsData[0].goodsPreferentialPrice === '' || this.form.materialGoodsOrderVoList[index].goodsData[0].goodsPreferentialPrice === undefined) {
          this.form.materialGoodsOrderVoList[index].goodsData[0].goodsPreferentialPrice = 0.00
        }
        const preferentialPrice = Number(this.form.materialGoodsOrderVoList[index].goodsData[0].goodsPreferentialPrice)
        const price = Number(this.form.materialGoodsOrderVoList[index].goodsData[0].goodsPrice) * Number(this.form.materialGoodsOrderVoList[index].goodsData[0].goodsNum)
        this.form.materialGoodsOrderVoList[index].goodsData[0].goodsPreferentialPrice = preferentialPrice.toFixed(2)
        const price2 = price
        if (price - preferentialPrice > 0) {
          this.form.materialGoodsOrderVoList[index].goodsData[0].amountPay = Number(price - preferentialPrice).toFixed(2) // 优惠金额
        } else {
          this.form.materialGoodsOrderVoList[index].goodsData[0].amountPay = 0
        }
        if (preferentialPrice > 0 && preferentialPrice >= price2) {
          this.$set(this.form.materialGoodsOrderVoList[index].goodsData[0], 'priceIn', true)// this.form.materialGoodsOrderVoList[index].goodsData[0].priceIn = true
        } else {
          this.$set(this.form.materialGoodsOrderVoList[index].goodsData[0], 'priceIn', false) // this.form.materialGoodsOrderVoList[index].goodsData[0].priceIn = false
        }
      }
      console.log('this.form.materialGoodsOrderVoList[index].goodsData[0].amountPay:', this.form.materialGoodsOrderVoList[index].goodsData[0].amountPay)
      this.countAllData()
      /* if (this.form.materialGoodsOrderVoList[index].goodsData.length) {
        const preferentialPrice = Number(this.form.materialGoodsOrderVoList[index].goodsData[0].goodsPreferentialPrice)
        const price = Number(this.form.materialGoodsOrderVoList[index].goodsData[0].goodsPrice) * Number(this.form.materialGoodsOrderVoList[index].goodsData[0].goodsNum)
        const price2 = price
        this.form.materialGoodsOrderVoList[index].goodsData[0].goodsPreferentialPrice = preferentialPrice.toFixed(2)
        // this.amountPay = (price - preferentialPrice).toFixed(2) // 优惠金额
        if (price - preferentialPrice > 0) {
          this.amountPay = Number(price - preferentialPrice).toFixed(2) // 优惠金额
        } else {
          this.amountPay = '0.00'
        }
        this.paidIn >= (price2 - this.amountPay) ? this.paidInStatus = false : this.paidInStatus = true
        this.goodsAllPrice = price.toFixed(2)
        if (preferentialPrice > 0 && preferentialPrice >= price2) {
          // this.form.goods.goodsData[0].goodsPreferentialPrice = price2.toFixed(2)
          // this.paidIn > price2 ? this.paidInStatus = false : this.paidInStatus = true
          // this.amountPay = price2.toFixed(2) // 优惠金额
          this.priceIn = true
        } else {
          // this.form.goods.goodsData[0].goodsPreferentialPrice = preferentialPrice.toFixed(2)
          // this.amountPay = (price - preferentialPrice).toFixed(2) // 优惠金额
          // this.paidIn > price2 ? this.paidInStatus = false : this.paidInStatus = true
          this.priceIn = false
        }
      } */
    },
    countAllData() {
      console.log('this.amountPay:', this.amountPay)
      console.log('this.goodsAllPrice:', this.goodsAllPrice)
      // allShouldPay: 0, // 应付金额
      // allYouhuiPay: 0, // 所有的优惠金额的和
      // goodsAllPrice: '0.00', // 所有商品金额总和
      this.amountPay = 0
      this.allShouldPay = 0 // 应付金额
      this.goodsAllPrice = 0
      this.allYouhuiPay = 0 // 所有的优惠金额
      this.form.materialGoodsOrderVoList?.some((item, index) => {
        console.log('item.goodsData[0]:::::', item.goodsData[0])
        if (item.goodsData?.length > 0) {
          const price = Number(item.goodsData[0].goodsPrice) * Number(item.goodsData[0].goodsNum)
          this.allShouldPay = Number(this.allShouldPay) + Number(price) - Number(item.goodsData[0].goodsPreferentialPrice)
          this.allYouhuiPay = Number(this.allYouhuiPay) + Number(item.goodsData[0].goodsPreferentialPrice) // 优惠金额
          this.goodsAllPrice = Number(this.goodsAllPrice) + Number(price)
        }
      })
      this.allShouldPay = this.allShouldPay.toFixed(2)
      this.allYouhuiPay = this.allYouhuiPay.toFixed(2)
      this.goodsAllPrice = this.goodsAllPrice.toFixed(2)
    },
    onClickAddWater() {
      this.formWater.list.push({
        id: this.getUuiD(25),
        num: '',
        channel: '', // 渠道
        unit: '', // 单位
        account: '', // 账户
        serialNum: '', // 流水号
        time: '', // 支付时间
        price: '', // 金额
        optionsUnit: [], // 单位可选
        channelLabel: '', // 渠道名称
        imageUrl: [] // 交易凭证
      })
      this.formWater.list.map((v, i) => {
        v.num = i + 1
      })
    },
    onClickDelWater(id, item) {
      const list = this.formWater.list
      list.map((v, i) => {
        if (v.id === id) {
          list.splice(i, 1)
        }
      })
      this.formWater.list.map((v, i) => {
        v.num = i + 1
      })
      this.formWater.list = list
      if (item.channel === this.optionsChannelValue) {
        this.moneyBagLocked = false
      }
    },
    exceedImgList() {
      this.$notify.error({
        title: '操作失败',
        message: '上传图片数量最大限制：6个'
      })
    },
    beforeUpload(file) {
      console.log(file, 'file')
      const fileType = getFileType(file.name)
      console.log(fileType)
      if (fileType.fileType === 'img') {
        const isLt5M = file.size / 1024 / 1024 < 5
        !isLt5M && this.$message.error('上传图片大小不能超过 5MB!')
        console.log(isLt5M)
        return isLt5M
      } else {
        this.$message.error(`不支持${fileType.suffix}格式的文件上传`)
        return false
      }
      // 限制上传文件大小 500M
      // const isLt20M = file.size / 1024 / 1024 < 20
      // if (!isLt20M) {
      //   this.$message.error('上传文件大小不能超过 20MB!')
      // }
    },
    // 备注资料上传图片
    async uploadForTextarea(e) {
      // this.$refs.uploadGive[0].clearFiles()
      console.log(e)
      console.log('上传文件', e)
      // this.$refs.upload.clearFiles()
      if (!e) {
        return
      }
      const selectFile = e.file
      if (!this.beforeUpload(selectFile)) {
        return
      }
      const fileType = getFileType(selectFile.name)
      const obj = {
        file: selectFile, // 文件对象
        name: selectFile.name, // 文件名
        status: 1, // 状态
        authProgress: 0, // 进度
        ossTeacherFolder: `hok_order/${fileType.fileType}/`,
        poster: '', // 封面
        alignUploadShow: false, // 重新上传mask控制
        abortCheckpoint: null, // 中断点
        // eslint-disable-next-line no-undef
        client: new OSS(this.ossConfig),
        url: '' // 地址
      }
      this.form.imageList.push(obj)
      // this.fileList.push(obj)
      // const index = this.fileList.length - 1
      // const self = this.fileList[index]
      const index = this.form.imageList.length - 1
      const self = this.form.imageList[index]
      console.log('sseellff: ', self)
      try {
        const options = {
          // 获取分片上传进度、断点和返回值。
          progress: (p, cpt, res) => {
            self.authProgress = Number((p * 100).toFixed(2))
            console.log(p, '上传进度')
            self.abortCheckpoint = cpt
          },
          // 设置并发上传的分片数量。
          parallel: 4,
          // 设置分片大小。默认值为1 MB，最小值为100 KB。
          partSize: 1024 * 1024,
          // headers,
          // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
          // meta: { year: 2020, people: 'test' },
          mime: 'text/plain'
        }
        // 分片上传。
        const res = await self.client.multipartUpload(self.ossTeacherFolder + obj.name, obj.file, {
          ...options
        })
        console.log(res, '上传成功的回调')
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.ossConfig.ossBucketUrl}${self.ossTeacherFolder}${self.name}`
        // eslint-disable-next-line require-atomic-updates
        self.poster = self.url + '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,w_800,h_600,m_fast'
        // eslint-disable-next-line require-atomic-updates
        self.status = 3
        const fileList = []
        this.form.imageList.map((v) => {
          v.status === 3 && fileList.push(v)
        })
        this.$emit('change', fileList)
      } catch (err) {
        if (err.name === 'cancel') {
          // eslint-disable-next-line require-atomic-updates
          self.status = 4
        } else {
          console.log('上传失败:', err)
          // eslint-disable-next-line require-atomic-updates
          self.status = 2
        }
      }
    },

    async upload(e, i) {
      this.$refs.upload[0].clearFiles()
      // this.$refs.upload.clearFiles()
      if (!e) {
        return
      }
      const selectFile = e.file
      if (!this.beforeUpload(selectFile)) {
        return
      }
      const fileType = getFileType(selectFile.name)
      const obj = {
        file: selectFile, // 文件对象
        name: `${this.$getUuiD(10)}.${this.$getFileType(selectFile.name).suffix}`, // 文件名
        status: 1, // 状态
        authProgress: 0, // 进度
        ossTeacherFolder: `hok_order/${fileType.fileType}/`,
        poster: '', // 封面
        alignUploadShow: false, // 重新上传mask控制
        abortCheckpoint: null, // 中断点
        // eslint-disable-next-line no-undef
        client: new OSS(this.ossConfig),
        url: '' // 地址
      }
      const fileListWater = this.formWater.list[i]
      console.log(fileListWater, 'fileListWater')
      fileListWater.imageUrl.push(obj)
      this.formWater.list[i] = fileListWater
      // this.fileList.push(obj)
      // const index = this.fileList.length - 1
      // const self = this.fileList[index]
      const index = fileListWater.imageUrl.length - 1
      const self = fileListWater.imageUrl[index]
      try {
        const options = {
          // 获取分片上传进度、断点和返回值。
          progress: (p, cpt, res) => {
            self.authProgress = Number((p * 100).toFixed(2))
            console.log(p, '上传进度')
            self.abortCheckpoint = cpt
          },
          // 设置并发上传的分片数量。
          parallel: 4,
          // 设置分片大小。默认值为1 MB，最小值为100 KB。
          partSize: 1024 * 1024,
          // headers,
          // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
          // meta: { year: 2020, people: 'test' },
          mime: 'text/plain'
        }
        // 分片上传。
        const res = await self.client.multipartUpload(self.ossTeacherFolder + obj.name, obj.file, {
          ...options
        })
        console.log(res, '上传成功的回调')
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.ossConfig.ossBucketUrl}${self.ossTeacherFolder}${self.name}`
        // eslint-disable-next-line require-atomic-updates
        self.poster = self.url + '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,w_800,h_600,m_fast'
        // eslint-disable-next-line require-atomic-updates
        self.status = 3
        const fileList = []
        fileListWater.imageUrl.map((v) => {
          v.status === 3 && fileList.push(v)
        })
        const propString = 'list.' + i + '.imageUrl'
        this.$refs.formWater.clearValidate(propString)
        this.$emit('change', fileList)
      } catch (err) {
        if (err.name === 'cancel') {
          // eslint-disable-next-line require-atomic-updates
          self.status = 4
        } else {
          console.log('上传失败:', err)
          // eslint-disable-next-line require-atomic-updates
          self.status = 2
        }
      }
    },
    async uploadGive(e) {
      // this.$refs.uploadGive[0].clearFiles()
      this.$refs['form'].clearValidate('givePhoto')
      console.log(e)
      console.log('上传文件', e)
      console.log('上传文件', this.$refs.uploadGive)
      // this.$refs.upload.clearFiles()
      if (!e) {
        return
      }
      const selectFile = e.file
      if (!this.beforeUpload(selectFile)) {
        return
      }
      const fileType = getFileType(selectFile.name)
      const obj = {
        file: selectFile, // 文件对象
        name: `${this.$getUuiD(10)}.${this.$getFileType(selectFile.name).suffix}`, // 文件名
        status: 1, // 状态
        authProgress: 0, // 进度
        ossTeacherFolder: `hok_order/${fileType.fileType}/`,
        poster: '', // 封面
        alignUploadShow: false, // 重新上传mask控制
        abortCheckpoint: null, // 中断点
        // eslint-disable-next-line no-undef
        client: new OSS(this.ossConfig),
        url: '' // 地址
      }
      this.form.givePhoto.push(obj)
      // this.fileList.push(obj)
      // const index = this.fileList.length - 1
      // const self = this.fileList[index]
      const index = this.form.givePhoto.length - 1
      const self = this.form.givePhoto[index]
      console.log(self)
      try {
        const options = {
          // 获取分片上传进度、断点和返回值。
          progress: (p, cpt, res) => {
            self.authProgress = Number((p * 100).toFixed(2))
            console.log(p, '上传进度')
            self.abortCheckpoint = cpt
          },
          // 设置并发上传的分片数量。
          parallel: 4,
          // 设置分片大小。默认值为1 MB，最小值为100 KB。
          partSize: 1024 * 1024,
          // headers,
          // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
          // meta: { year: 2020, people: 'test' },
          mime: 'text/plain'
        }
        // 分片上传。
        const res = await self.client.multipartUpload(self.ossTeacherFolder + obj.name, obj.file, {
          ...options
        })
        console.log(res, '上传成功的回调')
        // eslint-disable-next-line require-atomic-updates
        self.url = `${this.ossConfig.ossBucketUrl}${self.ossTeacherFolder}${self.name}`
        // eslint-disable-next-line require-atomic-updates
        self.poster = self.url + '?spm=qipa250&x-oss-process=video/snapshot,t_2,f_jpg,w_800,h_600,m_fast'
        // eslint-disable-next-line require-atomic-updates
        self.status = 3
        const fileList = []
        this.form.givePhoto.map((v) => {
          v.status === 3 && fileList.push(v)
        })
        this.$emit('change', fileList)
      } catch (err) {
        if (err.name === 'cancel') {
          // eslint-disable-next-line require-atomic-updates
          self.status = 4
        } else {
          console.log('上传失败:', err)
          // eslint-disable-next-line require-atomic-updates
          self.status = 2
        }
      }
    },
    // 点击删除
    delFile(item, index, key) {
      console.log(item, index, key)
      if (item.abortCheckpoint) {
        item.client && item.client.abortMultipartUpload(item.abortCheckpoint.name, item.abortCheckpoint.uploadId)
      }
      this.formWater.list[key].imageUrl.splice(index, 1)
    },
    delFileForText(item, index, key) {
      this.form.imageList.splice(index, 1)
    },
    // 点击重新上传
    async alignUpload(item, index, key) {
      const self = this.formWater.list[key].imageUrl[index]
      await this.resumeUpload(self)
    },
    async alignUploadForText(item, index, key) {
      const self = this.form.imageList[index]
      await this.resumeUpload(self)
    },
    // 点击删除
    delFileGive(item, index) {
      console.log(item, index)
      if (item.abortCheckpoint) {
        item.client && item.client.abortMultipartUpload(item.abortCheckpoint.name, item.abortCheckpoint.uploadId)
      }
      this.form.givePhoto.splice(index, 1)
    },
    // 点击重新上传
    async alignUploadGive(item, index) {
      const self = this.form.givePhoto[index]
      await this.resumeUpload(self)
    },
    selectGoodsPop(index) {
      this.$SelectGoods({
        visible: true,
        initSearch: {
          tagType: 6
        },
        tabList: [
          { id: '5', name: '线下课', api: '' },
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '10', name: '直播课', api: '' }
        ],
        tearchSearch: false,
        filterateHidden: true,
        currentId: '5',
        success: (res) => {
          console.log(res, 'res')
          if (res.length > 0) {
            this.handleSelectGoods(res[0], index)
          }
        }
      })
    },
    submitOK() {
      console.log('this.formWater.list', this.formWater.list)
      const form = this.form
      const imageListArray = []
      this.form.imageList?.some(item => {
        imageListArray.push(item.url)
      })
      const materialGoodsOrderVoList = []
      if (this.selectOrderType === '预存') {
        materialGoodsOrderVoList.push({
          content: '',
          contentName: this.depositGoodsObj[0].contentName,
          coverUrl: this.depositGoodsObj[0].contentUrl,
          coverVerticalUrl: this.depositGoodsObj[0].coverVerticalUrl,
          discountContent: '',
          discountsFee: 0,
          goodsId: this.depositGoodsObj[0].goodsId,
          goodsNum: 1,
          goodsType: this.depositGoodsObj[0].goodsType,
          marketPrice: this.paidMoneyNumber,
          materialSpecVo: {
            availableNum: '',
            goodsId: '',
            goodsNum: '',
            peopleNum: '',
            salePrice: '',
            sort: '',
            specId: '',
            specName: ''
          }
        })
      } else {
        this.form.materialGoodsOrderVoList.some(item => {
          const obj = {
            content: form.giveDesc,
            contentName: item.goodsData[0].goodsName,
            coverUrl: item.goodsData[0].image,
            coverVerticalUrl: item.goodsData[0].coverVerticalUrl,
            discountContent: item.goodsData[0].preferentialDesc,
            discountsFee: item.goodsData[0].goodsPreferentialPrice,
            goodsId: item.id,
            goodsNum: item.goodsData[0].goodsNum,
            goodsType: item.goodsData[0].goodsTypeNum,
            marketPrice: item.goodsData[0].goodsPrice,
            materialSpecVo: {
              availableNum: item.specs.availableNum,
              goodsId: item.specs.goodsId,
              goodsNum: item.specs.goodsNum,
              peopleNum: item.specs.peopleNum,
              salePrice: item.specs.salePrice,
              sort: item.specs.sort,
              specId: item.specs.specId,
              specName: item.specs.specName
            }
          }
          materialGoodsOrderVoList.push(obj)
        })
      }

      // 用户信息
      const addUserVo = {
        areaName: form.firm.firmAddress.length ? form.firm.firmAddress.join(',') : '', // 公司所在地
        address: form.firm.detailAddress,
        company: form.firm.name, // 公司名称
        industry: form.firm.industry.length ? form.firm.industry[0] : '', // 行业
        introduce: form.firm.business, // 主营业务
        phoneAreaCode: form.userType === 'phone' ? form.user.phoneAreaCode : '', // 手机区号
        phone: form.userType === 'phone' ? form.user.phone : '', // 手机号码
        email: form.userType === 'email' ? form.user.email : '', // 邮箱号码
        position: form.firm.job, // 职位
        realName: form.user.name, // 用户名称
        turnover: form.firm.turnover// 年营业额
      }
      // 处理流水
      const addPaymentInfoList = []
      this.formWater.list.map(v => {
        const voucherList = []
        v.imageUrl.map(v => {
          voucherList.push(v.url)
        })
        addPaymentInfoList.push({
          channelId: v.channel, // 收款渠道ID
          chosenChannelId: v.unit ? v.unit : '',
          payTime: v.channel === this.optionsChannelValue ? null : new Date(v.time).getTime(), // 支付时间
          payerTotal: v.price, // 流水金额
          transactionId: v.serialNum, // 交易流水号
          paymentUserPhone: v.paymentUserPhone,
          phoneAreaCode: v.channel === this.optionsChannelValue ? (this.moneyBag.userType === 'phone' ? this.moneyBag.user.phoneAreaCode : '') : '',
          type: v.channel === this.optionsChannelValue ? (this.moneyBag.userType === 'phone' ? 1 : 2) : '',
          voucherList
        })
      })
      const params = {
        addUserVo, // 用户信息
        channelSource: '17',
        transactionSource: form.channel, // 渠道来源
        enrollmentTeacherName: form.teacherName.name, //	招生老师
        enrollmentTeacherId: form.teacherName.content,
        largeP: form.sixp, //	来源大6P
        materialGoodsOrderVoList, // 商品信息
        orderConfigId: form.orderType.o_two ? form.orderType.o_two : form.orderType.o_one, // 订单类型ID
        privateVenues: form.sessions, // 私域场次
        remarks: this.orderType === '赠送' ? '' : form.remarks,
        imageList: this.orderType === '赠送' ? '' : imageListArray,
        taskId: this.form.taskId
      }
      // this.form.goods.specs ? params['materialSpecVo'] = this.form.goods.specs : ''
      this.selectOrderType === '新购' ? params['addPaymentInfoList'] = addPaymentInfoList : '' // 流水
      this.selectOrderType === '预存' ? params['addPaymentInfoList'] = addPaymentInfoList : '' // 流水
      this.selectOrderType === '新购' ? params['discountContent'] = form.preferentialDesc : '' // 优惠原因
      this.selectOrderType === '赠送' ? params['content'] = form.giveDesc : '' // 赠单原因giveParentOrderNo
      if (this.selectOrderType === '赠送') { // 赠单凭证
        const givePhoto = []
        if (form.givePhoto.length > 0) {
          form.givePhoto.map(v => {
            givePhoto.push(v.url)
          })
        }
        params['giveVoucherList'] = givePhoto.length ? givePhoto : ''
      }
      // this.selectOrderType === '赠送' && this.selectGiftType === '关联订单赠送' ? params['orderNo'] = form.orderNo : '' // 订单号
      this.selectOrderType === '赠送' && this.selectGiftType === '关联订单赠送' ? params['giveParentOrderNo'] = form.orderNo : '' // 关联赠送订单号
      console.log(form, 'form')
      console.log('param', params)
      console.log('orderConfigId-->', params.orderConfigId)
      this.submitFlag = true
      addOrderAndUpdate(params)
        .then((res) => {
          this.submitFlag = false
          if (res.code === 1) {
            this.$message({
              message: '录入成功',
              type: 'success'
            })
            this.goBack()
          }
        })
        .catch(() => {
          this.submitFlag = false
        })
    },
    submitNO() {
      this.confirm = !this.confirm
    },
    tableDataPrecisen(e) {
      console.log(e, '搜索结果')
      this.searchPrecisen = e
    },
    giveTableDataPrecisen(e) {
      this.giveOrderList = e
    },
    changeAreaCodes() {
      this.$nextTick(() => {
        this.$refs.form.validateField('user.phone')
      })
    },
    changeAreaCodesChange(index) {
      this.$nextTick(() => {
        const str = 'list.' + index + '.paymentUserPhone'
        this.$refs.formWater.validateField(str)
      })
    },
    addGoods() {
      const obj = {
        id: '',
        contentName: '',
        goodsData: [
          {
            id: '',
            goodsName: '',
            goodsType: '',
            goodsPrice: 0,
            goodsPreferentialPrice: 0, // 优惠金额
            goodsNum: '',
            image: '',
            goodsTypeNum: '',
            coverVerticalUrl: '',
            preferentialDesc: ''
          }
        ],
        tableShow: false, // tab默认关闭
        specsId: '',
        specs: '',
        optionsSpecs: [] // 商品规格
      }
      this.form.materialGoodsOrderVoList.push(obj)
    },
    deleteGoods(index) {
      if (this.form.materialGoodsOrderVoList?.length <= 1) {
        this.$message.error('至少保留1个商品')
        return
      } else {
        this.form.materialGoodsOrderVoList.splice(index, 1)
        this.countAllData()
      }
    },
    validatePhoneArea (rule, value, callback) {
      if (this.form.user.phoneAreaCode === '') {
        callback(new Error('请选择区号'))
      } else {
        callback()
      }
    },
    validatePhone (rule, value, callback) {
      if (this.form.user.phoneAreaCode === '86') {
        if (this.form.user.phone.length !== 11) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      } else if (this.form.user.phoneAreaCode !== '86') {
        if (!(this.form.user.phone.length >= 6 && this.form.user.phone.length <= 100)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    validatePhoneMoneyBag(rule, value, callback) {
      console.log('PPPPP::::::', rule)
      console.log('WWWWWWWWWWWWWWW:P', value)
      // value = this.formWater
      if (this.moneyBag.userType === 'phone') {
        if (this.moneyBag.user.phoneAreaCode === '86') {
          if (value.length !== 11) {
            callback(new Error('请输入正确的手机号'))
          } else {
            callback()
          }
        } else if (this.moneyBag.user.phoneAreaCode !== '86') {
          if (!(value.length >= 6 && value.length <= 100)) {
            callback(new Error('请输入正确的手机号'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      } else if (this.moneyBag.userType === 'email') {
        var yz = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)
        if (yz) {
          callback()
        } else {
          callback('请输入正确的邮箱')
        }
      } else {
        callback()
      }
    },
    changeUx(item, index) {
      if (this.moneyBag.userType === 'phone') {
        item.paymentUserPhone = this.moneyBag.user.phone
        this.$nextTick(() => {
          setTimeout(() => {
            const str = 'list.' + index + '.paymentUserPhone'
            this.$refs.formWater.clearValidate(str)
          }, 30)
        })
      } else if (this.moneyBag.userType === 'email') {
        item.paymentUserPhone = this.moneyBag.user.email
        this.$nextTick(() => {
          setTimeout(() => {
            const str = 'list.' + index + '.paymentUserPhone'
            this.$refs.formWater.clearValidate(str)
          }, 30)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.entry-box {
  overflow: hidden;
    .add-order-warp {
        padding: 20px;
        background: #FFFFFF;
        border-radius: 10px;
        .crumbs-box {
            padding-bottom: 20px;
            margin-bottom: 20px;
            border-bottom: 1px solid #EFF2F6;
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
                    background: #0C6FFF;
                    border-radius: 6px;
                    top: 0;
                    left: 0;
                }
            }
        }
        .search-order {
            display: flex;
            .search-in {
                margin-right: 10px;
            }
        }
        .order-list {
          max-width: 1200px;
          overflow-x: auto;
          // overflow: scroll;
          // height: 186px;
          background: #FFFFFF;
        }
        .table-box {
          background: #FFFFFF;
          max-width: 1200px;
          overflow-x: auto;
          .table-img-box {
              display:  flex;
              align-items: center;
              .table-img-box-l {
                  width: 64px;
                  height: 64px;
                  img {
                      width: 100%;
                      height:  100%;
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
                display:-webkit-box;
                text-overflow:ellipsis;
                overflow:hidden;
                -webkit-line-clamp: 3;
                -webkit-box-orient:vertical;
            }
            .table-txt-del {
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #F53F3F;
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
        }

        .input-box {
          width: 296px;
          height: 32px;
          background: #FFFFFF;
          border-radius: 4px;
          border: 1px solid #DCDFE6;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          font-family: MicrosoftYaHei;
          color: #DCDFE6;
          padding: 0 15px;
        }

        .label-ps {
            margin-top: 8px;
            font-size: 12px;
            font-family: MicrosoftYaHei;
            color: #999999;
        }
        .water-header {
            display: flex;
            align-items: center;
            padding-bottom: 16px;
            .water-title {
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #333333;
                position: relative;
                padding-left: 10px;
                &::before {
                    position: absolute;
                    top: 2px;
                    left: 24px;
                    content: '*';
                    color: #F53F3F;
                }
            }
            .common-title-width {
              width: 92px !important;
              font-size: 14px;
              color: #606266;
              font-weight: bold;
              padding-left: 34px;
            }
            .water-btn {
                width: 132px;
                height: 32px;
                line-height: 32px;
                text-align: center;
                background: #FFFFFF;
                border-radius: 4px;
                border: 1px solid #DCDFE6;
                background: #FFFFFF;
                border-radius: 4px;
                border: 1px solid #DCDFE6;
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #333333;
                margin-left: 8px;
                cursor: pointer;
                .icon-plus {
                    font-size: 14px;
                    font-weight: bold;
                }
            }
        }
        .water-list {
            .water-child {
                padding: 20px 12px 16px 12px;
                background: #F7FBFF;
                border-radius: 8px;
                margin-bottom: 20px;
                overflow: hidden;
                min-width: 1000px;
                .water-child-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .water-child-header-l {
                        font-size: 16px;
                        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                        font-weight: bold;
                        color: #333333;
                    }
                    .water-child-header-r {
                        width: 68px;
                        height: 32px;
                        line-height: 32px;
                        text-align: center;
                        background: #FFFFFF;
                        border-radius: 4px;
                        border: 1px solid #F53F3F;
                        font-size: 14px;
                        font-family: MicrosoftYaHei;
                        color: #F53F3F;
                        cursor: pointer;
                    }
                }
            }
            .water-child-box {
                .water-child-box-title {
                    font-size: 14px;
                    font-family: MicrosoftYaHei;
                    color: #333333;
                    padding-right: 8px;
                    text-align: right;
                    white-space:nowrap;
                    display: inline-block;
                    width: 78px;
                }
                .water-child-box-title-max {
                    font-size: 16px;
                    font-family: MicrosoftYaHei;
                    color: #777777;
                }

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
                    color: #00B42A;
                }
                .price-num-blue {
                    color: #0C6FFF;
                }
                .price-num-red {
                    color: #F53F3F;
                }
            }
            .price-tomast {
                text-align: right;
                font-size: 12px;
                font-family: MicrosoftYaHei;
                color: #F53F3F;
            }
        }
        .foot-box {
            display: flex;
            justify-content: center;
            margin-top: 40px;
        }
        .upload-img {
          display: flex;
          .avatar-uploader-icon-box {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 90px;
            border-radius: 4px;
            background-color: #F3F3F3;
            margin-right: 10px;
          }
        }
    }
}
// main end
.nav-list ::v-deep  .el-breadcrumb__inner {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold !important;
    color: #777777;
}
.nav-add ::v-deep  .el-breadcrumb__inner {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold !important;
    color: #333333;
}
::v-deep .el-icon-arrow-right {
    font-size: 7px !important;
    color: #A9A9A9 !important;
}
// crumbs end
::v-deep .el-form-item__label {
    min-width: 100px !important;
    // width: 70px !important;
}
.water-child-box ::v-deep .el-form-item {
    margin: 0;
}
.el-form-item.el-form-item--medium {
    display: flex;
    justify-content: flex-start;
}
.form-box ::v-deep .el-form-item__content {
    margin: 0 !important;
}

.table-box ::v-deep .el-table th.el-table__cell {
    background: #F3F3F3;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
}
.table-in ::v-deep .el-input__inner{
    width: 92px;
}
// table end

.goods-in-num50 ::v-deep .el-input__inner{
    width: 50px;
    text-align: center;
}
.goods-in-num80 ::v-deep .el-input__inner{
    width: 80px;
    text-align: center;
}

.goods-in-num-red ::v-deep .el-input__inner{
    border: 1px solid #F53F3F;
}
::v-deep .el-input__inner{
    height: 32px;
}
.flex-box {
    display: flex;
}
.flex-item {
    align-items: center;
}
.m-r8 {
    margin-right: 8px;
}
.m-r32 {
    margin-right: 32px;
}
.m-t10 {
    margin-top: 10px;
}
.m-t20 {
    margin-top: 20px;
}
.m-b20 {
    margin-bottom: 20px;
}
.m-b16 {
    margin-bottom: 16px;
}
.no-txt {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #F53F3F;
    margin: 16px 0 32px 0;
}
.no-txt1 {
  margin: -20px 0 15px 0;
}
.ok-txt {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #00B42A;
    margin: 16px 0 32px 0;
}
.button-h32 {
    height: 32px;
}
.w-200 ::v-deep .el-input__inner{
    width: 200px;
}
.w-296 ::v-deep .el-input__inner{
    width: 296px;
}
::v-deep .el-input-number--medium{
    width: 296px;
}
.w-496 ::v-deep .el-input__inner{
    width: 496px;
}
::v-deep .table-module {
    padding: 0 !important;
}
::v-deep  input::-webkit-outer-spin-button,
::v-deep  input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type="number"]{
  -moz-appearance: textfield;
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

.text-area-cls {
  width: 100%;
  float: left;
  ::v-deep .el-form-item__content {
    width: 700px;
  }
  ::v-deep .el-textarea textarea {
    float: left;
    width: 100%
  }
}
.add-goods-cls {
  width: 100%;
  padding-bottom: 20px;
  padding-left: 25px;
}

::v-deep .el-icon-arrow-right:before {
  font-size: 16px!important;
}
::v-deep .el-input-group .el-input-group__prepend .el-input__inner {
  width: 100px;
}
::v-deep .form-box .user-account {
  .el-form-item__content {
    display: flex;
    justify-items: center;
    align-items: center;

  }
}
</style>
