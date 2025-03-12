<template>
  <div class="groupDrawer">
    <div class="form">
      <div v-loading="loading" class="page_wrap">
        <el-form
          ref="form"
          :model="form"
          label-width="120px"
          label-position="left"
          :rules="rules"
        >
          <div class="header_tips">基本信息</div>

          <div class="m-t-20">
            <el-form-item label="专栏名称" prop="contentName">
              <el-input
                v-model.trim="form.contentName"
                style="width: 690px"
                maxlength="45"
                type="text"
                show-word-limit
                @input="handleInputChange"
              />
            </el-form-item>

            <el-form-item label="专栏简介" prop="columnContent">
              <el-input v-model.trim="form.columnContent" />
            </el-form-item>

            <el-form-item label="选择IP" prop="lecturerIdList">
              <el-select
                v-model="form.lecturerIdList"
                disabled
                placeholder="请选择老师"
                multiple
              >
                <el-option
                  v-for="item in teacherOption"
                  :key="item.lecturerId"
                  :label="item.lecturerName"
                  :value="item.lecturerId"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="选择类别" prop="curriculumType">
              <el-select v-model="form.curriculumType" placeholder="请选择类型">
                <el-option :value="1" label="基础课" />
                <el-option :value="2" label="进阶课" />
                <!-- <el-option :value="3" label="长期班" />
                    <el-option :value="4" label="讲座" /> -->
              </el-select>
            </el-form-item>

            <el-form-item label="人气值" prop="goodsPopularity">
              <el-input-number
                v-model.number="form.goodsPopularity"
                controls-position="right"
                style="width: 200px"
              />
            </el-form-item>

            <el-form-item label="专栏封面" prop="patchUrl">
              <div>
                <div
                  v-if="!form.patchUrl"
                  class="image_poster"
                  style="width: 200px; height: 112px"
                  @click="getImgUrl('patchUrl')"
                >
                  <i class="el-icon-plus" />
                  <span>点击上传图片</span>
                </div>
                <div v-else>
                  <AppMyImage
                    :src="form.patchUrl"
                    style="width: 200px; height: 112px"
                    :options="{
                      width: 567,
                      fixed: true,
                      option: {
                        fixed: true,
                        fixedNumber: [16, 9],
                        fixedBox: false
                      }
                    }"
                    @close="delImage('patchUrl')"
                    @success="res => changeImage('patchUrl', res)"
                  />
                </div>
                <div class="tips m-t-20">
                  <div>
                    专栏封面是指专栏展示的图片，建议尺寸750*422或比例16：9，
                  </div>
                  <div>小于500K的JPG格式图片</div>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="方形缩略图" prop="coverVerticalUrl">
              <div>
                <div
                  v-if="!form.coverVerticalUrl"
                  class="image_poster"
                  style="width: 138px; height: 138px"
                  @click="getImgUrl('coverVerticalUrl')"
                >
                  <i class="el-icon-plus" />
                  <span>点击上传图片</span>
                </div>
                <div v-else>
                  <AppMyImage
                    :src="form.coverVerticalUrl"
                    style="width: 138px; height: 138px"
                    :options="{
                      width: 750,
                      fixed: true,
                      option: {
                        fixed: true,
                        fixedNumber: [1, 1],
                        fixedBox: false
                      }
                    }"
                    @close="delImage('coverVerticalUrl')"
                    @success="res => changeImage('coverVerticalUrl', res)"
                  />
                </div>
                <div class="tips m-t-20">
                  <div>方形缩略图是指在商品列表展示的图片。</div>
                  <div>建议尺寸750*750，小于500K的JPG、PNG格式图片</div>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="横版缩略图" prop="coverUrl">
              <div>
                <div
                  v-if="!form.coverUrl"
                  class="image_poster"
                  style="width: 200px; height: 150px"
                  @click="getImgUrl('coverUrl')"
                >
                  <i class="el-icon-plus" />
                  <span>点击上传图片</span>
                </div>
                <div v-else>
                  <AppMyImage
                    :src="form.coverUrl"
                    style="width: 200px; height: 150px"
                    :options="{
                      width: 567,
                      fixed: true,
                      option: {
                        fixed: true,
                        fixedNumber: [4, 3],
                        fixedBox: false
                      }
                    }"
                    @close="delImage('coverUrl')"
                    @success="res => changeImage('coverUrl', res)"
                  />
                </div>
                <div class="tips m-t-20">
                  <div>横版缩略图是指在商品列表展示的图片。</div>
                  <div>建议尺寸750*563或比例4:3，小于500K的JPG格式图片</div>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="学习说明">
              <el-row
                v-for="(item, index) in learnExplain"
                :key="index"
                class="m-b-10"
              >
                <el-input
                  v-model="learnExplain[index]"
                  type="textarea"
                  :row="5"
                  show-word-limit
                  style="width: 500px"
                  class="m-r-10"
                />
                <el-button
                  v-if="learnExplain.length === index + 1"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addLearnExplain(item)"
                >添加</el-button>
                <el-button
                  v-if="learnExplain.length !== 1"
                  @click="learnExplain.splice(index, 1)"
                >删除</el-button>
              </el-row>
            </el-form-item>

            <el-form-item label="专栏详情" prop="content">
              <AppUEditor
                ref="AppUEditor"
                v-model="form.content"
                @change="change"
              />
            </el-form-item>

            <el-form-item label="金句" prop="goldenSentence">
              <el-row
                v-for="(item, index) in goldenSentence"
                :key="index"
                class="m-b-10"
              >
                <el-input
                  v-model="goldenSentence[index]"
                  type="textarea"
                  :row="5"
                  show-word-limit
                  style="width: 500px"
                  class="m-r-10"
                />
                <el-button
                  v-if="goldenSentence.length === index + 1"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addGoldenSentence(item)"
                >添加</el-button>
                <el-button
                  v-if="goldenSentence.length !== 1"
                  @click="goldenSentence.splice(index, 1)"
                >删除</el-button>
              </el-row>
            </el-form-item>

            <el-form-item label="内容更新顺序" prop="sortFlag">
              <el-radio-group v-model="form.sortFlag">
                <el-radio :label="0" style="width: 100%" class="m-t-10">
                  <span>最新添加在前</span>
                  <span
                    class="tips m-l-10"
                  >适用于资讯类等时效性较强的专栏</span>
                </el-radio>
                <el-radio :label="1" style="width: 100%" class="m-t-10">
                  <span>最新添加在后</span>
                  <span
                    class="tips m-l-10"
                  >适用于有声书等上下文关系较强的专栏</span>
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="相关资料">
              <!-- <div class="add-course-ware-btn" @click="getInforMationPic()"><i class="el-icon-plus" />添加资料</div> -->
              <div class="btnfl">
                <div
                  class="add-course-ware-btn m-r-20"
                  @click="getInforMationPic()"
                >
                  <i class="el-icon-plus" />添加资料
                </div>
                <div class="tips">
                  最多添加100个文件(后缀为pdf),单个文件不能大于100M;专栏和视频中均存在资料,只显示专栏中资料。
                </div>
              </div>

              <!-- 资料列表 -->
              <div class="ZiliaoTable">
                <el-table
                  v-if="form.informationPicReqList.length > 0"
                  class="m-t-20"
                  :header-cell-style="{ background: '#f5f5f5', padding: '0' }"
                  style="width: 800px"
                  :data="form.informationPicReqList"
                  max-height="450"
                  row-key="materialId"
                  cell-class-name="cursorMove"
                  border
                >
                  <el-table-column width="50" align="center">
                    <template>
                      <i class="el-icon-rank" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="materialName"
                    label="文件"
                    width="150"
                  />
                  <el-table-column prop="materialSize" label="大小" width="120">
                    <template slot-scope="scope">
                      {{ scope.row.materialSize | filterSize }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="createTime"
                    label="上传时间"
                    width="240"
                  />
                  <el-table-column label="操作" width="240">
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        size="small"
                        @click.native.prevent="
                          deleteRow(scope.$index, form.informationPicReqList)
                        "
                      >
                        移除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <div class="btnfl m-t-20">
                <div class="add-course-ware-btn m-r-20" @click="selectPPT">
                  <i class="el-icon-plus" />添加PPT
                </div>
                <div class="tips">
                  最多添加200张jpg/png图片,单张图片不能大于2M;专栏和视频中均存在图片,只显示视频中图片。
                </div>
              </div>

              <!-- PPT列表 -->
              <div class="PPTTable">
                <el-table
                  v-if="form.informationPptReqList.length > 0"
                  :header-cell-style="{ background: '#f5f5f5', padding: '0' }"
                  style="width: 800px; margin-top: 20px"
                  :data="form.informationPptReqList"
                  max-height="450"
                  row-key="materialId"
                  cell-class-name="cursorMove"
                  border
                >
                  <el-table-column width="50" align="center">
                    <template>
                      <i class="el-icon-rank" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="materialName" label="文件">
                    <template slot-scope="{ row }">
                      <div class="fl fl_ai_c">
                        <el-image
                          style="width: 100px; height: 100px"
                          :src="row.materialUrl"
                          :preview-src-list="srcList"
                        />
                        <div class="m-l-20">
                          <div
                            class="m-picture-title"
                            :title="row.materialName"
                          >
                            {{ row.materialName }}
                          </div>
                          <div class="m-picture-property">
                            {{ row.materialDes | filterDes }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="materialSize" label="大小" width="120">
                    <template slot-scope="scope">
                      {{ scope.row.materialSize | filterSize }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="createTime"
                    label="上传时间"
                    width="240"
                  />
                  <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        size="small"
                        @click.native.prevent="
                          deleteRow(scope.$index, form.informationPptReqList)
                        "
                      >
                        移除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </div>

          <!-- 商品信息 -->
          <div class="header_tips">商品信息</div>

          <div class="m-t-20">
            <el-form-item label="售卖方式" prop="sale">
              <el-checkbox
                v-model="form.relationSaleFlag"
                :true-label="0"
                :false-label="1"
              >支持单独售卖</el-checkbox>
              <span>客户可以通过店铺或链接的方式单独购买该商品</span>

              <div class="sale-container m-b-20 m-l-20">
                <el-radio-group
                  v-model="form.materialSalePicReq.saleType"
                  style="width: 776px"
                  @change="saleTypeChange"
                >
                  <el-radio :label="0">免费</el-radio>
                  <el-radio :label="1">付费</el-radio>
                  <!-- <el-radio :label="2">加密</el-radio> -->
                  <!-- <el-radio :label="3">指定学员</el-radio> -->
                </el-radio-group>

                <div>
                  <template v-if="form.materialSalePicReq.saleType === 1">
                    <el-form-item
                      label="商品价格"
                      prop="materialSalePicReq.salePrice"
                      :rules="rules.materialSalePicReqRule.salePrice"
                      style="margin-bottom: 20px"
                    >
                      <el-input-number
                        v-model.number="form.materialSalePicReq.salePrice"
                        :min="0.0001"
                        controls-position="right"
                        class="w-200 m-r-10"
                      />
                      <span class="m-l-10">元</span>
                    </el-form-item>
                    <el-form-item
                      label="划线价格"
                      prop="materialSalePicReq.marketPrice"
                      :rules="rules.materialSalePicReqRule.marketPrice"
                      style="margin-bottom: 20px"
                    >
                      <el-input
                        v-model="form.materialSalePicReq.marketPrice"
                        type="number"
                        :min="0"
                        controls-position="right"
                        style="width: 200px"
                      />
                      <span class="m-l-10">元</span>
                    </el-form-item>
                    <div class="tips m-t-10">
                      商品没有其他优惠（如拼团）的情况下，划线价格在商品详情会以划线形式显示
                    </div>
                  </template>

                  <div
                    v-if="form.materialSalePicReq.saleType === 2"
                    class="m-b-10"
                  >
                    <div class="sale-input__label">密码</div>
                    <div class="sale-input__input">
                      <el-input
                        v-model="form.materialSalePicReq.password"
                        placeholder="请设置3-12位字母、数字或汉字格式密码"
                        style="width: 328px"
                      />
                    </div>
                  </div>

                  <div
                    v-if="form.materialSalePicReq.saleType === 3"
                    class="tips m-b-10"
                  >
                    仅被指定学员可免费学习课程，添加指定学员请前往【课程详情-学员列表】手动操作
                  </div>

                  <div>
                    <div class="vaildTimeText">课程有效期</div>
                    <div class="validTime">
                      <el-radio-group
                        v-model="form.materialSalePicReq.saleValidity"
                      >
                        <el-radio
                          :label="0"
                          class="w-500 m-b-20"
                          disabled
                        >长期有效</el-radio>
                        <el-radio
                          :label="1"
                          class="w-500 m-b-20"
                          :disabled="form.materialSalePicReq.saleType === 0"
                        >
                          购买后
                          <el-input-number
                            v-model.number="
                              form.materialSalePicReq.validityDays
                            "
                            :disabled="
                              form.materialSalePicReq.saleValidity !== 1
                            "
                            :min="1"
                            :max="9999"
                            controls-position="right"
                            class="w-200 m-r-10"
                          />
                          <span>天有效</span>

                          <el-checkbox
                            v-model="form.materialSalePicReq.repeatPurchase"
                            class="m-l-20"
                            :true-label="0"
                            :false-label="1"
                            :disabled="
                              form.materialSalePicReq.saleValidity !== 1
                            "
                          >
                            允许学员在有效期内重复购买
                          </el-checkbox>
                        </el-radio>
                        <el-radio
                          :label="2"
                          class="w-500"
                          :disabled="form.materialSalePicReq.saleType === 0"
                        >
                          固定时间
                          <el-date-picker
                            v-model="form.materialSalePicReq.fixedTime"
                            class="m-l-10"
                            :disabled="
                              form.materialSalePicReq.saleValidity !== 2
                            "
                            type="datetime"
                            placeholder="选择日期时间"
                          />
                        </el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tips m-l-20 m-b-20">
                课程带货：可同时关联实物商品和课程售卖，实物商品运费由商家承担，最多支持添加10个实物商品和课程
              </div>

              <!-- <div v-if="form.materialSalePicReq.saleType === 1" class="add-course-ware-btn m-l-20 m-b-20"><i class="el-icon-plus" />选择商品</div> -->

              <el-checkbox
                v-model="form.saleFlag"
                :true-label="0"
                :false-label="1"
              >支持关联售卖</el-checkbox>
              <span class="tips m-l-20">该商品放入专栏/训练营中售卖</span>
              <div class="tips m-b-20" style="margin-left: 128px">
                [注：会员中新增、移除内容时，对于已经购买该会员的用户，需要一定时间更新该用户的权益（一般为10分钟左右）]
              </div>
              <div
                v-if="form.saleFlag === 0"
                class="add-course-ware-btn m-l-20"
                style="width: 195px"
                @click="selectColumn()"
              >
                <i class="el-icon-plus" />
                选择大专栏/训练营
              </div>
              <!-- 关联大专栏列表 -->
              <el-table
                v-if="
                  form.goodsReqList &&
                    form.goodsReqList.length > 0 &&
                    form.saleFlag === 0
                "
                :header-cell-style="{ background: '#f5f5f5', padding: '0' }"
                style="width: 800px; margin-top: 20px"
                :data="form.goodsReqList"
                max-height="450"
              >
                <el-table-column prop="materialName" label="文件">
                  <template slot-scope="{ row }">
                    <div class="fl fl_ai_c">
                      <el-image
                        style="width: 100px; height: 100px"
                        :src="row.coverUrl"
                      />
                      <div class="m-l-20">
                        <div class="m-picture-title" :title="row.contentName">
                          {{ row.contentName }}
                        </div>
                        <div v-if="row.saleType === 0" class="c_777">免费</div>
                        <div v-if="row.saleType === 2" class="c_777">加密</div>
                        <div v-if="row.saleType === 1" class="c_777">
                          ￥{{ row.salePrice | filtersMoney }}
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="materialSize" label="类型" width="120">
                  <template slot-scope="{ row }">
                    {{
                      {
                        0: '图片',
                        1: '音频',
                        2: '视频',
                        3: '专栏',
                        4: '大专栏'
                      }[row.goodsType]
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click.native.prevent="
                        deleteRow(scope.$index, form.goodsReqList)
                      "
                    >
                      取消关联
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label="店铺商品分类">
              <el-cascader
                v-model="form.groupingPicReqList"
                :options="goodsGroupingOption"
                placeholder="选择店铺商品分类"
                :props="{
                  multiple: true,
                  value: 'catalogueId',
                  label: 'catalogueName',
                  children: 'catalogueVos',
                  expandTrigger: 'hover',
                  checkStrictly: true,
                  emitPath: false
                }"
                clearable
              />
              <span
                v-loading="catalogueLoading"
                class="EC1 m-l-20 pointer"
                element-loading-spinner="el-icon-loading"
                @click="_getCatalogueList"
              >
                刷新
              </span>
              <!-- <el-divider direction="vertical" />
                <router-link :to="{name: 'GoodsDivisionList'}" target="_blank">
                    <span class="EC1 pointer">前往商品分类 ></span>
                </router-link> -->
            </el-form-item>

            <el-form-item label="平台商品分类" prop="catalogueReqList">
              <el-cascader
                v-model="form.catalogueReqList"
                :options="platformGoodsGroupingOption"
                placeholder="选择平台商品分类"
                :props="{
                  multiple: true,
                  value: 'catalogueId',
                  label: 'catalogueName',
                  children: 'catalogueVos',
                  expandTrigger: 'hover',
                  checkStrictly: true,
                  emitPath: false
                }"
                clearable
              />
              <span
                v-loading="catalogueLoading"
                class="EC1 m-l-20 pointer"
                element-loading-spinner="el-icon-loading"
                @click="_getPlatformCatalogueList"
              >
                刷新
              </span>
            </el-form-item>
          </div>

          <div class="header_tips m-t-50">上架设置</div>

          <div class="m-t-20">
            <el-form-item label="上架设置">
              <el-radio-group v-model="form.shelveFlag">
                <el-radio
                  :label="0"
                  style="width: 100%"
                  class="m-t-10"
                >立即上架</el-radio>
                <el-radio :label="2" class="m-t-10">
                  <span>定时上架</span>
                  <el-date-picker
                    v-model="form.shelveTime"
                    class="m-l-20"
                    :disabled="form.shelveFlag !== 2"
                    type="datetime"
                    placeholder="请设置时间"
                    :picker-options="pickerOptions"
                  />
                </el-radio>
                <el-radio
                  :label="1"
                  style="width: 100%"
                  class="m-t-10"
                >暂不上架</el-radio>
              </el-radio-group>

              <div class="EC1 m-t-20 m-b-10">更多设置</div>
              <div>
                <el-checkbox
                  v-model="form.shelveHideFlag"
                  :true-label="1"
                  :false-label="0"
                >隐藏</el-checkbox>
                <span
                  class="tips m-l-20"
                >上架的商品设置隐藏后，在店铺内不显示，但可以通过链接的方式访问</span>
              </div>
              <div>
                <el-checkbox
                  v-model="form.androidHideFlag"
                  :true-label="1"
                  :false-label="0"
                >在APP-安卓端隐藏</el-checkbox>
                <el-checkbox
                  v-model="form.iosHideFlag"
                  :true-label="1"
                  :false-label="0"
                >在APP-IOS端隐藏</el-checkbox>
                <el-checkbox
                  v-model="form.appletHideFlag"
                  :true-label="1"
                  :false-label="0"
                >在微信小程序端隐藏</el-checkbox>
                <el-checkbox
                  v-model="form.douAppletHideFlag"
                  :true-label="1"
                  :false-label="0"
                >在抖音小程序端隐藏</el-checkbox>
                <el-checkbox
                  v-model="form.htmlHideFlag"
                  :true-label="1"
                  :false-label="0"
                >在H5隐藏</el-checkbox>
              </div>
              <div>
                <el-checkbox
                  v-model="form.shelveHaltFlag"
                  :true-label="1"
                  :false-label="0"
                >停售</el-checkbox>
                <span
                  class="tips m-l-20"
                >上架的商品设置停售后，将停止售卖</span>
              </div>
              <el-divider />
              <div class="tips">
                <i class="el-icon-warning" />
                根据您上传的图文大小需要0-30分钟不等的转码时间，转码过程中该商品将隐藏不可显示，转码完成后会根据您的设置进行显示/隐藏。
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="demo-drawer__footer">
      <el-button size="small" @click="$emit('close')">取 消</el-button>
      <el-button type="primary" size="small" @click="save()">提交</el-button>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import AppUEditor from '@/components/AppUEditor'
import AppMyImage from '@/components/AppMyImage'
import { getTeacherList, getCatalogueList } from '@/api/shop'
import { editGoods, getGoodsDetail, getPlatformCatalogueList } from '@/api/course'
import axios from 'axios'
import { filterSpecialCharacters } from '@/utils/index'
export default {
  name: 'ColumnEdit',
  components: {
    AppUEditor,
    AppMyImage
  },
  props: {
    goodsId: {
      type: String,
      default: ''
    },
    success: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    var validateSale = (rule, value, callback) => {
      if (this.form.relationSaleFlag === 1 && this.form.saleFlag === 1) {
        callback(new Error('请选择售卖方式!'))
      } else {
        callback()
      }
    }
    var checkSalePrice = (rule, value, callback) => {
      if (this.form.materialSalePicReq.salePrice === '') {
        callback(new Error('请输入商品价格!'))
      } else if (Number(this.form.materialSalePicReq.salePrice) === 0) {
        callback(new Error('商品价格要大于0!'))
      } else if (
        this.form.materialSalePicReq.marketPrice &&
        this.form.materialSalePicReq.salePrice >=
          this.form.materialSalePicReq.marketPrice
      ) {
        callback(new Error('商品价格要小于划线价格!'))
      } else {
        if (
          this.form.materialSalePicReq.salePrice <
          this.form.materialSalePicReq.marketPrice
        ) {
          this.$refs.form.clearValidate('materialSalePicReq.marketPrice')
        }
        callback()
      }
    }
    var checkMarketPrice = (rule, value, callback) => {
      if (this.form.materialSalePicReq.marketPrice === '') {
        return callback()
      }
      if (
        this.form.materialSalePicReq.marketPrice <=
        this.form.materialSalePicReq.salePrice
      ) {
        callback(new Error('划线价格要大于商品价格!'))
      } else {
        if (
          this.form.materialSalePicReq.salePrice <
          this.form.materialSalePicReq.marketPrice
        ) {
          this.$refs.form.clearValidate('materialSalePicReq.salePrice')
        }
        callback()
      }
    }
    return {
      loading: false,
      form: {
        contentName: '', // 名称
        materialId: '', // 素材Id
        materialUrl: '', // 素材存储路径(图文，音频)
        materialFrameUrl: '', // 图文首帧图片url
        goodsPopularity: 100,
        curriculumType: 1, // (1基础课，2进阶课,3长期班，4讲座)
        materialVo: {
          // 选择的图文信息
          dirId: '',
          materialDes: '',
          materialId: '',
          materialFrameUrl: '',
          materialName: '',
          materialSize: '',
          materialType: '',
          materialUrl: ''
        },
        learnExplain: '',
        lecturerId: '', // 讲师id
        lecturerIdList: [],
        coverVerticalUrl: '', // 竖版封面存储路径
        coverUrl: '', // 横版封面存储路径
        patchUrl: '', // 图文贴片存储路径，goods_type=2生效

        goodsReqList: [], // 关联商品ids
        content: '', // 图文详情
        columnContent: '',
        teacher: '',
        contentSettingFlag: 0, // 详情设置(0购买前查看完整商品详情，1购买前仅查看介绍内容)goods_type=1生效
        forwardFlag: 0, // 倍速播放/快进(0允许，1禁止)，goods_type=2生效
        fragmentTrialFlag: 1, // 片段试看(0开启，1关闭)，goods_type=2生效
        goodsId: '', // 图文音频图文id
        goodsType: 3, // 0:图片,1:音频，2视频,3专栏，4大专栏
        groupingPicReqList: [], // 商品分类ids
        catalogueReqList: [], // 平台级商品分类

        informationPicReqList: [], // 相关资料列表ids
        informationPptReqList: [],

        lampFlag: 0, // 防录屏跑马灯(0关闭，1开启)，goods_type=2生效
        materialSalePicReq: {
          // 售卖方式关联商品集合
          fixedTime: '', // 课程有效期-固定时间 【sale_validity =2时生效】
          goodsId: '', // 商品信息关联id
          marketPrice: '', // 商品划线价格 单位分
          password: '', // 密码
          repeatPurchase: 0, // 是否允许学员重复购买 0允许,1,不允许
          salePrice: undefined, // 商品价格 单位：分
          saleType: 0, // 类型 0免费,1,付费 2,加密 3,指定学员
          saleValidity: 0, // 课程有效期 0长期有效,1,购买后 2,固定时间
          validityDays: 0 // 课程有效期-天数 【sale_validity =1时生效】
        },
        preventionFlag: 0, // 文字防复制(0允许复制，1禁止复制)
        relationSaleFlag: 0, // 支持单独售卖((0开启，1关闭))
        saleFlag: 0, // 支持关联售卖((0开启，1关闭))
        shelveFlag: 0, // 上架设置(0立即上架，1暂不上架，2定时上架)
        shelveHaltFlag: 0, // 上架更多设置是否停售(0不停售，1停售)
        shelveHideFlag: 0, // 上架更多设置是否隐藏(0不隐藏，1隐藏)
        shelveTime: '', // 定时上架时间shelveFlag==2是生效
        shelveTimingTime: '', // 定时上架时间shelveFlag==2是生效
        sortFlag: 0, // 内容更新顺序(0最新添加在前，1最新添加在后)goodsType==3生效
        trialContent: '', // 试看内容，goods_type=0生效
        trialMinute: 0, // 试看分钟
        androidHideFlag: 0,
        iosHideFlag: 0,
        appletHideFlag: 0,
        douAppletHideFlag: 0,
        htmlHideFlag: 0
      },
      isClear: false,
      teacherOption: [],
      goodsGroupingOption: [],
      platformGoodsGroupingOption: [],
      catalogueLoading: false,
      platformCatalogueLoading: false,
      rules: {
        contentName: [
          { required: true, message: '请输入专栏名称', trigger: 'blur' }
        ],
        coverVerticalUrl: [
          { required: true, message: '请选择方形缩略图', trigger: 'blur' }
        ],
        coverUrl: [
          { required: true, message: '请选择横版缩略图', trigger: 'blur' }
        ],
        catalogueReqList: [
          { required: true, message: '请选择平台商品分类', type: 'array', trigger: 'change' }
        ],
        curriculumType: [
          { required: true, message: '请选择类别', trigger: 'blur' }
        ],
        lecturerIdList: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个讲师',
            trigger: 'change'
          }
        ],
        patchUrl: [
          { required: true, message: '请选择专栏封面图', trigger: 'change' }
        ],
        sale: [{ required: true, validator: validateSale, trigger: 'change' }],
        content: [
          { required: true, message: '请输入专栏详情', trigger: 'blur' }
        ],
        goodsPopularity: [
          { required: true, message: '请输入人气值', trigger: 'blur' }
        ],
        materialSalePicReqRule: {
          salePrice: [
            { validator: checkSalePrice, trigger: 'change', required: true }
          ],
          marketPrice: [{ validator: checkMarketPrice, trigger: 'change' }]
        }
      },
      srcList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      goldenSentence: [''],
      learnExplain: [''],
      goodsPopularity: 0
    }
  },
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.loading = true
      axios
        .all([
          getTeacherList(),
          getCatalogueList(),
          getGoodsDetail(this.goodsId),
          getPlatformCatalogueList()
        ])
        .then(res => {
          console.log(res, '数据')
          this.teacherOption = res[0].data
          this.goodsGroupingOption = res[1].data.map(item => ({
            ...item,
            disabled: !!item?.catalogueVos?.length
          }))
          this.platformGoodsGroupingOption = res[3].data

          if (res[2].data.materialSaleVo) {
            res[2].data.materialSaleVo.salePrice =
              (res[2].data.materialSaleVo.salePrice || 0) / 100
            if (Number(res[2].data.materialSaleVo.marketPrice) === 0) {
              res[2].data.materialSaleVo.marketPrice = ''
            } else {
              res[2].data.materialSaleVo.marketPrice =
                (res[2].data.materialSaleVo.marketPrice || 0) / 100
            }
          }
          const groupingPicReqList = []
          if (res[2].data.catalogueGroupingVoList) {
            res[2].data.catalogueGroupingVoList.map(v => {
              groupingPicReqList.push(v.catalogueId)
            })
          }

          let informationPptReqList = []
          if (res[2].data.materialPptVoList) {
            informationPptReqList = res[2].data.materialPptVoList
          }
          let informationPicReqList = []
          if (res[2].data.materialVoList) {
            informationPicReqList = res[2].data.materialVoList
          }
          this.form = {
            ...this.form,
            ...res[2].data,
            materialSalePicReq: res[2].data.materialSaleVo,
            groupingPicReqList,
            informationPptReqList,
            informationPicReqList
          }
          this.goodsPopularity = this.form.goodsPopularity
          if (res[2].data.goldenSentence) {
            this.goldenSentence = res[2].data.goldenSentence.split('#')
          }
          if (res[2].data.learnExplain) {
            this.learnExplain = res[2].data.learnExplain.split('#')
          }
          console.log('res[2].data.learnExplain', res[2].data.learnExplain)
          console.log('this.learnExplain', this.learnExplain)
          console.log(this.form)
          this.loading = false

          this.$nextTick(() => {
            this.rowPPTDrop()
            this.rowZiliaoDrop()
          })
        })
    },
    handleInputChange(val) {
      this.form.contentName = filterSpecialCharacters(val)
    },
    // 刷新分组
    _getCatalogueList() {
      this.catalogueLoading = true
      getCatalogueList().then(res => {
        this.goodsGroupingOption = res.data
        this.catalogueLoading = false
      })
    },
    // 刷新平台商品分类
    _getPlatformCatalogueList() {
      this.platformCatalogueLoading = true
      getPlatformCatalogueList().then(res => {
        this.platformGoodsGroupingOption = res.data
        this.platformCatalogueLoading = false
      })
    },
    // 富文本编辑器内容改变时触发
    change(e) {},
    // 选择图文
    getImage() {
      this.$SelectMaterial({
        visible: true,
        types: [0],
        success: res => {
          this.form.materialVo = res
        }
      })
    },
    // 选择图片
    getImgUrl(key) {
      this.$SelectMaterial({
        visible: true,
        types: [0],
        success: res => {
          console.log(res, 'res')
          this.form[key] = res.materialUrl
        }
      })
    },
    // 删除图文
    delMaterialUrl() {
      this.form.materialVo = {
        dirId: '',
        materialDes: '',
        materialId: '',
        materialFrameUrl: '',
        materialName: '',
        materialSize: '',
        materialType: '',
        materialUrl: ''
      }
    },
    // 编辑图文
    changeMaterialUrl(res) {
      this.form.materialVo.materialUrl = res
    },
    // 删除图片
    delImage(key) {
      this.form[key] = ''
    },
    // 裁剪图片
    changeImage(key, res) {
      this.form[key] = res
    },
    // 选择讲师
    teacherChange(e) {
      console.log(e, '讲师')
      const obj = this.teacherOption.find(v => v.lecturerId === e)
      this.form.lecturerName = obj.lecturerName
    },
    // 售卖方式改变时触发
    saleTypeChange(e) {
      console.log(e)
      this.form.materialSalePicReq.saleValidity = 0
      // if (e === 0) {
      //   // 免费的图文不用设置片段试看
      //   this.$set(this.form, 'fragmentTrialFlag', 1)
      // }
      if (e !== 0) {
        this.form.materialSalePicReq.saleValidity = 1
      }
    },
    // 选择PPT;PPT都是图片
    selectPPT() {
      this.$SelectMaterialMultiple({
        visible: true,
        type: 'imageView',
        types: [0],
        max: 200,
        imageList: this.form.informationPptReqList,
        success: res => {
          console.log(res, 'res')
          this.form.informationPptReqList = res.imageList
          this.srcList = []
          res.imageList.map(v => {
            this.srcList.push(v.materialUrl)
          })
          this.$nextTick(() => {
            this.rowPPTDrop()
          })
        }
      })
    },
    // 选择相关资料
    getInforMationPic() {
      this.$SelectMaterialMultiple({
        visible: true,
        type: 'fileView',
        types: [4],
        fileType: ['pdf'],
        max: 100,
        fileList: this.form.informationPicReqList,
        success: res => {
          console.log(res, 'res')
          this.form.informationPicReqList = res.fileList
          this.$nextTick(() => {
            this.rowZiliaoDrop()
          })
        }
      })
    },

    // 移出相关资料
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },

    // 点击保存
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // alert('submit!')
          console.log(this.form)
          this._addGoods()
        } else {
          console.log('error submit!!')
          this.$notify({
            title: '警告',
            message: '请完成必填项!',
            type: 'warning'
          })
          return false
        }
      })
    },

    // 提交的方法
    _addGoods() {
      // 相关资料列表ids
      const informationPicReqList = []
      // 相关PPT列表ids
      const informationPptReqList = []
      // 关联大专栏ids
      const goodsReqList = []
      this.form.informationPicReqList &&
        this.form.informationPicReqList.map((v, i) => {
          informationPicReqList.push({
            informationId: v.materialId,
            sort: i
          })
        })
      this.form.informationPptReqList &&
        this.form.informationPptReqList.map((v, i) => {
          informationPptReqList.push({
            informationId: v.materialId,
            sort: i
          })
        })
      this.form.goodsReqList &&
        this.form.goodsReqList.map(v => {
          goodsReqList.push(v.goodsId)
        })
      let marketPrice
      if (
        typeof this.form.materialSalePicReq.marketPrice === 'number' ||
        typeof this.form.materialSalePicReq.marketPrice === 'string'
      ) {
        marketPrice = (this.form.materialSalePicReq.marketPrice || 0) * 100
      } else {
        marketPrice = ''
      }
      const materialSalePicReq = {
        ...this.form.materialSalePicReq,
        marketPrice: marketPrice,
        salePrice: Math.round(
          (this.form.materialSalePicReq.salePrice || 0) * 100
        )
      }
      const goldenSentence = this.goldenSentence.filter(Boolean).join('#')
      const learnExplain = this.learnExplain.filter(Boolean).join('#')
      if (this.goodsPopularity === this.form.goodsPopularity) {
        this.form.goodsPopularity = 0
      }
      const params = {
        ...this.form,
        materialSalePicReq,
        materialId: this.form.materialVo.materialId,
        informationPicReqList,
        informationPptReqList,
        goodsReqList,
        goldenSentence,
        learnExplain,
        onlineFlag: 0, // 0: 线上; 1: 线下
        content: this.$refs.AppUEditor.getContent()
      }
      editGoods(params).then(res => {
        console.log(res)
        this.$notify({
          title: '成功',
          message: '新建成功!',
          type: 'success'
        })
        // this.$router.push({ name: 'package', query: { type: 'collegeColumn' }})
        // this.$router.push({ path: '/course/package/packageColumn' })
        // this.visible = false
        this.success && this.success()
        this.$emit('close')
        // this.$router.go(-1)
      })
    },
    // 选择商品
    selectColumn() {
      const goodsReqList = []
      this.form.goodsReqList &&
        this.form.goodsReqList.map(v => {
          goodsReqList.push(v.goodsId)
        })
      this.$SelectGoods({
        visible: true,
        multiple: true,
        check: goodsReqList,
        tabList: [{ id: '4', name: '大专栏', api: '' }],
        currentId: '4',
        success: res => {
          console.log(res, 'res')
          this.form.goodsReqList = this.form.goodsReqList.concat(res)
        }
      })
    },
    // 新增学习说明
    addLearnExplain(row) {
      if (!row) {
        return this.$message.warning('请先填写后再添加')
      }
      if (this.learnExplain.length === 5) {
        return this.$message.warning('最多只能添加5条学习说明')
      }
      this.learnExplain.push('')
    },
    addGoldenSentence(row) {
      if (!row) {
        return this.$message.warning('请先填写后再添加')
      }
      this.goldenSentence.push('')
    },
    // 资料行拖拽
    rowZiliaoDrop() {
      const tbody = document.querySelector('.ZiliaoTable tbody')
      const _this = this
      if (tbody) {
        Sortable.create(tbody, {
          onEnd({ newIndex, oldIndex }) {
            console.log('拖动了行', '当前序号: ' + newIndex)
            const currRow = _this.form.informationPicReqList.splice(
              oldIndex,
              1
            )[0]
            currRow.sort = newIndex
            _this.form.informationPicReqList.splice(newIndex, 0, currRow)
          }
        })
      }
    },
    // PPT行拖拽
    rowPPTDrop() {
      const tbody = document.querySelector('.PPTTable tbody')
      const _this = this
      if (tbody) {
        Sortable.create(tbody, {
          onEnd({ newIndex, oldIndex }) {
            console.log('拖动了行', '当前序号: ' + newIndex)
            const currRow = _this.form.informationPptReqList.splice(
              oldIndex,
              1
            )[0]
            currRow.sort = newIndex
            _this.form.informationPptReqList.splice(newIndex, 0, currRow)
          }
        })
      }
    }
  }
  // beforeRouteLeave(to, from, next) {
  //   this.$destroy()
  //   next()
  // }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px 21px;
  .header {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: rgba(51, 51, 51, 0.9);
    line-height: 24px;
    margin-bottom: 30px;
  }
  .header_tips {
    font-size: 20px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 0.9);
    line-height: 28px;
    position: relative;
    padding-left: 10px;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 5px;
      width: 4px;
      height: 20px;
      background: #0c6fff;
      border-radius: 3px;
    }
  }
  .tips {
    // margin-top: 20px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 22px;
  }
  .image_poster {
    background: #f5f7fa;
    border-radius: 4px;
    border: 1px solid #dcdcdc;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    > span {
      margin-top: 13px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
      line-height: 20px;
    }
    &:hover {
      border: 1px dashed #1472ff;
    }
  }
  .setting-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 776px;
    padding: 27px 20px;
    background: #f5f7fa;
  }
  .add-course-ware-btn {
    width: 106px;
    height: 35px;
    border-radius: 4px;
    border: 1px dashed #1890ff;
    font-size: 14px;
    font-weight: 400;
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-align-items: center;
    align-items: center;
    cursor: pointer;
    color: #1890ff;
  }
  .EC1 {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #0052d9;
    line-height: 24px;
  }
  .sale-container {
    position: relative;
    width: 776px;
    padding: 20px;
    margin: 4px 0 10px 25px;
    background: #f5f5f5;
  }

  .vaildTimeText {
    display: inline-block;
    vertical-align: top;
  }
  .validTime {
    margin-top: 12px;
    display: inline-block;
    width: 600px;
    margin-left: 30px;
  }

  .sale-input__label {
    display: inline-block;
    width: 85px;
  }
  .sale-input__input {
    display: inline-block;
    // display: flex;
  }
}
.video-selector__left {
  position: relative;
  background: #f7f8f9;
  border-radius: 2px;
  overflow: hidden;
  > img {
    width: 100%;
    height: 100%;
  }
}

.video-preview {
  height: 112px;
  width: 200px;
  > audio {
    width: 100%;
    height: 100%;
  }
}
.m-picture-title {
  height: 18px;
  line-height: 18px;
  overflow: hidden;
  word-break: break-all;
  color: #333;
  width: 188px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.m-picture-property {
  height: 18px;
  line-height: 18px;
  color: #888;
}
.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;
  .form {
    // flex: 1;
    height: calc(100vh - 77px - 50px);
    width: 100%;
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .demo-drawer__footer {
    width: 100%;
    height: 50px;
    padding-top: 10px;
    padding-left: 10px;
    -webkit-box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%),
      0 0 3px 0 rgb(0 0 0 / 4%);
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }
  .form_avatar {
    display: flex;
    align-items: center;
    .form_btn {
      height: 30px;
      margin-left: 10px;
    }
  }
  .form_textarea {
    width: 600px;
    margin-right: 10px;
  }
}
::v-deep {
  .el-table {
    width: 99.9%;
  }
}
</style>
