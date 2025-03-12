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
            <el-form-item label="商品名称" prop="contentName">
              <el-input
                v-model.trim="form.contentName"
                style="width: 690px"
                maxlength="45"
                type="text"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="商品简称" prop="subTitle">
              <el-input
                v-model.trim="form.subTitle"
                style="width: 690px"
                maxlength="45"
                type="text"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="商品简介" prop="columnContent">
              <el-input
                v-model.trim="form.columnContent"
                style="width: 690px"
                maxlength="200"
                type="text"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="选择IP" prop="lecturerIdList">
              <m-select
                v-model="form.lecturerIdList"
                :disabled="true"
                filterable
                class="m-300"
                placeholder="请选择IP"
                multiple
                :dict-list="teacherOption"
                :param="{ value: 'lecturerId', label: 'lecturerName' }"
              />
            </el-form-item>
            <el-form-item label="封面图" prop="coverUrlList">
              <ImageUpload
                v-model="form.coverUrlList"
                :limit="7"
                @change="getCoverUrlList"
              />
              <div class="m-t-20 text-sm" style="color: #777777;">
                <div>
                  尺寸750*750或比例1:1,小于5M（图片会自动进行压缩）的jpg,png,jpeg格式的图片，最多上传7张
                </div>
              </div>
            </el-form-item>
            <el-form-item label="商品标签">
              <el-select v-model="form.labelCode" multiple placeholder="请选择商品标签">
                <el-option
                  v-for="item in materialTagList"
                  :key="item.tagId"
                  :label="item.tagName"
                  :value="item.tagId"
                />
              </el-select>
            </el-form-item>
            <div class="m-t-20">
              <el-form-item label="是否含实物" prop="goodsForm">
                <el-radio-group
                  v-model="form.goodsForm"
                  style="width: 776px"
                >
                  <el-radio :label="1">不含实物</el-radio>
                  <el-radio :label="2">含实物</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item>
                <template v-if="form.goodsForm === 2">
                  <el-form-item
                    label="商品编码"
                    prop="giftsCode"
                  >
                    <el-autocomplete
                      v-model="form.giftsCode"
                      style="width: 300px;"
                      :fetch-suggestions="querySearch"
                      placeholder="请输入商品编码"
                      :trigger-on-focus="false"
                      :maxlength="40"
                      show-word-limit
                      @select="handleSelectGiftsCode"
                    />
                  </el-form-item>
                  <el-form-item
                    label="商品名称"
                    prop="giftsName"
                    class="mt-6"
                  >
                    <el-input
                      v-model.trim="form.giftsName"
                      style="width: 300px"
                      type="text"
                      maxlength="30"
                      show-word-limit
                    />
                  </el-form-item>
                  <el-form-item
                    label="商品数量"
                    prop="giftsNum"
                    class="mt-6"
                  >
                    <el-input
                      v-model.trim="form.giftsNum"
                      style="width: 300px"
                      type="number"
                    />
                  </el-form-item>
                  <el-form-item
                    label="退还策略"
                    prop="policyType"
                    class="mt-6"
                  >
                    <el-select v-model="form.policyType" placeholder="请选择" style="width: 300px">
                      <el-option :value="1" label="退款不需要退回" />
                      <el-option :value="2" label="退款需要退回" />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="退还文案"
                    prop="policyDesc"
                    class="mt-6"
                  >
                    <el-input
                      v-model.trim="form.policyDesc"
                      prop="returnDesc"
                      style="width: 300px"
                      maxlength="30"
                      show-word-limit
                    />
                  </el-form-item>
                  <el-form-item label="商品图片" prop="giftsImgList" class="mt-6">
                    <ImageUpload
                      v-model="form.giftsImgList"
                      :limit="7"
                      :tips="['最多上传7张图片，图片不能大于5M，格式为jpg,png,jpeg']"
                      @change="getGiftsListChange"
                    />
                  </el-form-item>
                </template>
              </el-form-item>
            </div>
            <el-form-item label="详情" prop="content">
              <AppUEditor
                ref="AppUEditor"
                v-model="form.content"
                @change="change"
              />
            </el-form-item>
            <el-form-item label="自定义锚点" prop="anchorInfo">
              <el-input
                v-model.trim="form.anchorInfo"
                style="width: 200px"
                maxlength="12"
                type="text"
                show-word-limit
              />
            </el-form-item>
          </div>

          <!-- 售卖信息 -->
          <div class="header_tips">售卖信息</div>
          <div class="m-t-20">
            <el-form-item
              label="商品价格"
              prop="materialSalePicReq.salePrice"
              class="mt-6"
            >
              <el-input
                v-model="form.materialSalePicReq.salePrice"
                placeholder="请输入价格"
                style="width: 200px;"
                type="number"
              >
                <template v-slot:append>
                  <span>元</span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              label="划线价格"
              prop="materialSalePicReq.marketPrice"
              class="mt-6"
            >
              <el-input
                v-model="form.materialSalePicReq.marketPrice"
                placeholder="请输入价格"
                style="width: 200px;"
                :controls="false"
                type="number"
              >
                <template v-slot:append>
                  <span>元</span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              label="有效日期"
              prop="materialSalePicReq.validityDays"
              class="mt-6 validity-days"
            >
              <el-input
                v-model=" form.materialSalePicReq.validityDays"
                placeholder="请输入"
                style="width: 200px;"
              >
                <template v-slot:append>
                  <el-select v-model="form.validityType" placeholder="请选择">
                    <el-option key="001" label="天" :value="1" />
                    <el-option key="002" label="年" :value="2" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </div>
          <div class="header_tips m-t-50">服务与履约</div>
          <div class="m-t-20">
            <el-form-item label="售后服务">
              <el-select
                v-model="form.postSaleType"
              >
                <el-option label="未学七天可退" :value="1" />
                <el-option label="不支持退款" :value="2" />
              </el-select>
            </el-form-item>
          </div>
          <div class="header_tips m-t-50">上架设置</div>

          <div class="m-t-20">
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
              <router-link :to="{ name: 'GoodsDivisionList' }" target="_blank">
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

            <el-form-item label="上架设置">
              <el-radio-group v-model="form.shelveFlag">
                <el-radio
                  :label="0"
                  style="width: 100%"
                  class="m-t-10"
                >立即上架
                </el-radio>
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
                >暂不上架
                </el-radio>
              </el-radio-group>

              <div class="EC1 m-t-20 m-b-10">更多设置</div>
              <div>
                <el-checkbox
                  v-model="form.shelveHideFlag"
                  :true-label="1"
                  :false-label="0"
                >隐藏
                </el-checkbox>
                <span
                  class="tips m-l-20"
                >上架的商品设置隐藏后，在店铺内不显示，但可以通过链接的方式访问</span>
              </div>
              <div>
                <el-checkbox
                  v-model="form.androidHideFlag"
                  :true-label="1"
                  :false-label="0"
                >在APP-安卓端隐藏
                </el-checkbox>
                <el-checkbox
                  v-model="form.iosHideFlag"
                  :true-label="1"
                  :false-label="0"
                >在APP-IOS端隐藏
                </el-checkbox>
                <el-checkbox
                  v-model="form.appletHideFlag"
                  :true-label="1"
                  :false-label="0"
                >在微信小程序端隐藏
                </el-checkbox>
                <el-checkbox
                  v-model="form.douAppletHideFlag"
                  :true-label="1"
                  :false-label="0"
                >在抖音小程序端隐藏
                </el-checkbox>
                <el-checkbox
                  v-model="form.htmlHideFlag"
                  :true-label="1"
                  :false-label="0"
                >在H5隐藏
                </el-checkbox>
              </div>
              <div>
                <el-checkbox
                  v-model="form.shelveHaltFlag"
                  :true-label="1"
                  :false-label="0"
                >停售
                </el-checkbox>
                <span class="tips m-l-20">上架的商品设置停售后，将停止售卖</span>
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
    <copyDialog ref="copyDialog" @success="$emit('close','fromSuccess')" />
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import AppUEditor from '@/components/AppUEditor'
// import AppMyImage from '@/components/AppMyImage'
import ImageUpload from '../components/ImageUpload'
// import pdfUpload from '../components/pdfUpload'
import { getTeacherList, getCatalogueList, materialGifts, materialGoodsCopy } from '@/api/shop'
import { editGoods, getGoodsDetail, getPlatformCatalogueList,
  materialTagList } from '@/api/course'
import axios from 'axios'
import { materialDetail } from '@/api/shop/detail'
import copyDialog from './components/copyDialog'

export default {
  name: 'ColumnEdit',
  components: {
    AppUEditor,
    // AppMyImage,
    ImageUpload,
    // pdfUpload,
    copyDialog
  },
  props: {
    goodsId: {
      type: String,
      default: ''
    },
    success: {
      type: Function,
      default: () => {
      }
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
      if (this.form.salePrice === '') {
        return callback(new Error('请输入商品价格!'))
      }
      const salePriceNumber = parseFloat(this.form.materialSalePicReq.salePrice)
      const marketPriceNumber = parseFloat(this.form.materialSalePicReq.marketPrice)
      if (salePriceNumber >= marketPriceNumber) {
        callback(new Error('商品价格要小于划线价格!'))
      } else {
        if (
          salePriceNumber < marketPriceNumber
        ) {
          this.$refs.form.clearValidate('marketPrice')
        }
        callback()
      }
    }
    var checkMarketPrice = (rule, value, callback) => {
      if (this.form.marketPrice === '') {
        return callback()
      }
      const salePriceNumber = parseFloat(this.form.materialSalePicReq.salePrice)
      const marketPriceNumber = parseFloat(this.form.materialSalePicReq.marketPrice)
      if (marketPriceNumber <= salePriceNumber) {
        callback(new Error('划线价格要大于商品价格!'))
      } else {
        if (salePriceNumber < marketPriceNumber) {
          this.$refs.form.clearValidate('materialSalePicReq.salePrice')
        }
        callback()
      }
    }
    return {
      hasPrudectFlag: false,
      hasGoodsFlag: false,
      permsList: this.$route.meta.permsList || [],
      loading: false,
      form: {
        productCategory: 0,
        labelCode: '',
        contentName: '', // 名称
        classHour: '', // 课程预计课时
        materialId: '', // 素材Id
        materialUrl: '', // 素材存储路径(图文，音频)
        materialFrameUrl: '', // 图文首帧图片url
        goodsPopularity: 100,
        curriculumType: 1, // (1基础课，2进阶课,3长期班，4讲座)
        physical: {
          type: 0,
          code: '',
          name: '',
          count: 0,
          returnType: 1,
          returnDesc: '',
          patchUrl: []
        },
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
        coverUrlList: [],
        learnExplain: '',
        lecturerId: '', // IPid
        lecturerIdList: [],
        coverVerticalUrl: '', // 竖版封面存储路径
        coverUrl: '', // 横版封面存储路径
        // patchUrl: '', // 图文贴片存储路径，goods_type=2生效
        // 2023这里修改为数组，因为要支持多张封面图
        patchUrl: [], // 图文贴片存储路径，goods_type=2生效

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
        postSaleType: 1,
        lampFlag: 0, // 防录屏跑马灯(0关闭，1开启)，goods_type=2生效
        materialSalePicReq: {
          // 售卖方式关联商品集合
          fixedTime: '', // 课程有效期-固定时间 【sale_validity =2时生效】
          goodsId: '', // 商品信息关联id
          salePrice: null, // 商品价格 单位：分
          marketPrice: undefined, // 商品划线价格 单位分
          password: '', // 密码
          repeatPurchase: 0, // 是否允许学员重复购买 0允许,1,不允许
          saleType: 0, // 类型 0免费,1,付费 2,加密 3,指定学员
          saleValidity: 0, // 课程有效期 0长期有效,1,购买后 2,固定时间
          validityDays: 0 // 课程有效期-天数 【sale_validity =1时生效】
        },
        salePrice: null, // 商品价格 单位：分
        marketPrice: null, // 商品划线价格 单位分
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
        htmlHideFlag: 0,
        warningReqList: [], // 预警人userId集合
        fullNotice: [], // 报满通知
        overAllocationNotice: [], // 超额分配通知
        anchorInfo: '',
        name: '',
        copyClassHour: 1,
        subTitle: '',
        goodsForm: '',
        countdown: '',
        // giftsType: 10086,
        giftsCode: '',
        giftsName: '',
        giftsNum: '',
        policyType: 1,
        policyDesc: '退款不需要退回',
        giftsImgList: []
      },
      isClear: false,
      teacherOption: [],
      goodsGroupingOption: [],
      platformGoodsGroupingOption: [],
      catalogueLoading: false,
      platformCatalogueLoading: false,
      rules: {
        contentName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        physical: {
          code: [
            { required: true, message: '请输入商品编码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          count: [
            { required: true, message: '请输入商品数量', trigger: 'blur' }
          ],
          returnType: [
            { required: true, message: '请选择退还策略', trigger: 'change' }
          ],
          returnDesc: [
            { required: true, message: '请输入退还文案', trigger: 'blur' }
          ],
          patchUrl: [
            { required: true, message: '请选择商品图片', trigger: 'change' }
          ]
          // ...
        },
        classHour: [
          { required: true, message: '请输入课程预计课时', trigger: 'blur' }
        ],
        coverUrlList: [
          { required: true, message: '请选择封面', type: 'array', trigger: 'change' }
        ],
        coverUrl: [
          { required: true, message: '请选择横版缩略图', trigger: 'blur' }
        ],
        productCategory: [
          { required: true, message: '请选择商品分类标签', trigger: 'blur' }
        ],
        curriculumType: [
          { required: true, message: '请选择类别', trigger: 'blur' }
        ],
        giftsType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        giftsCode: [
          { required: true, message: '请输入商品编码', trigger: 'blur' }
        ],
        giftsName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        giftsNum: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        policyType: [
          { required: true, message: '请选择退还策略', trigger: 'change' }
        ],
        policyDesc: [
          { required: true, message: '请输入退还文案', trigger: 'blur' }
        ],
        giftsImgList: [
          { required: true, message: '请选择图片', type: 'array', trigger: 'change' }
        ],
        goodsForm: [
          {
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        columnContent: [
          { required: true, message: '请输入商品简介', trigger: 'blur' }
        ],
        catalogueReqList: [
          { required: true, message: '请选择平台商品分类', type: 'array', trigger: 'change' }
        ],
        subTitle: [
          { required: true, message: '请输入商品简称', trigger: 'blur' }
        ],
        // lecturerIdList: [
        //   {
        //     type: 'array',
        //     required: true,
        //     message: '请至少选择一个IP',
        //     trigger: 'change'
        //   }
        // ],
        patchUrl: [
          { required: true, message: '请选择专栏封面图', trigger: 'change' }
        ],
        sale: [{ required: true, validator: validateSale, trigger: 'change' }],
        content: [
          { required: true, message: '请输入详情', trigger: 'blur' }
        ],
        goodsPopularity: [
          { required: true, message: '请输入人气值', trigger: 'blur' }
        ],
        countdown: [
          { required: true, message: '请输入倒计时', trigger: 'blur' }
        ],
        materialSalePicReq: {
          salePrice: [
            { required: true, validator: checkSalePrice, trigger: 'blur' },
            { message: '请输入正确价格', pattern: /^[1-9]\d*\.\d{1,2}$|^0\.\d{1,2}$|^[1-9]\d*$/, trigger: 'blur' }
          ],
          marketPrice: [
            { required: false, validator: checkMarketPrice, trigger: 'blur' },
            { message: '请输入正确价格', pattern: /^[1-9]\d*\.\d{1,2}$|^0\.\d{1,2}$|^[1-9]\d*$/, trigger: 'blur' }
          ],
          validityDays: [
            { required: true, message: '请输入', trigger: 'blur' },
            { message: '日期必须是正整数', trigger: 'blur', pattern: /^[1-9]\d*$/ }
          ]
        },
        goodsType: [
          { required: true, message: '请选择专栏类型', trigger: 'change' }
        ],
        fullNotice: [
          {
            required: true,
            message: '请选择报满通知人员',
            trigger: 'change',
            type: 'array'
          }
        ],
        overAllocationNotice: [
          {
            required: true,
            message: '请选择超额分配通知人员',
            trigger: 'change',
            type: 'array'
          }
        ]
      },

      srcList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      goldenSentence: [''],
      learnExplain: [''],
      goodsPopularity: 0,
      imageList: [],
      pdfLoading: false,
      goodsOptions: [
        {
          label: '虚拟',
          value: 1
        },
        {
          label: '虚拟+实物',
          value: 2
        }
      ],

      countdownType: 'm',
      isCopy: false,
      materialTagList: []
    }
  },
  created() {
  },
  mounted() {
    this.hasPrudectFlag = this.permsList.includes('messageManager:packageColumn:editGoodsFlag')
    this.hasGoodsFlag = this.permsList.includes('messageManager:packageColumn:editGoods')
    this.init()
    this.getMaterialTagList()
  },
  methods: {
    getMaterialTagList() {
      materialTagList().then(res => {
        this.materialTagList = res.data
      })
    },
    // 初始化
    init(isCopy = false) {
      this.loading = true
      this.isCopy = isCopy
      axios
        .all([
          getTeacherList(),
          getCatalogueList(),
          getGoodsDetail(this.goodsId),
          materialDetail(this.goodsId),
          getPlatformCatalogueList()
        ])
        .then(res => {
          this.teacherOption = res[0].data
          this.goodsGroupingOption = res[1].data.map(item => ({
            ...item,
            disabled: !!item?.catalogueVos?.length
          }))
          this.platformGoodsGroupingOption = res[4].data
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
          const catalogueReqList = []
          if (res[2].data.pfCatalogueGroupingVoList) {
            res[2].data.pfCatalogueGroupingVoList.map(v => {
              catalogueReqList.push(v.catalogueId)
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
          const fullNotice = []
          const overAllocationNotice = []
          res[2].data.sysUserWarnVos &&
          res[2].data.sysUserWarnVos.map(v => {
            if (v.type === 1) {
              fullNotice.push(v)
            } else if (v.type === 2) {
              overAllocationNotice.push(v)
            }
          })
          const materialSaleInfo = res[3].data ?? { subTitle: '', goodsForm: '' }
          const countdown = res[2].data.countdown
          if (countdown >= 60 && countdown % 60 === 0) {
            this.countdownType = 'h'
          } else {
            this.countdownType = 'm'
          }
          const materialGiftsVo = res[2].data.materialGiftsVo ?? {}
          const giftsImgList = []
          const giftsLargeImg = materialGiftsVo.giftsLargeImg?.split(',') ?? []
          const giftsMediumImg = materialGiftsVo.giftsMediumImg?.split(',') ?? []
          const giftsSmallImg = materialGiftsVo.giftsSmallImg?.split(',') ?? []
          const giftsImg = materialGiftsVo.giftsImg?.split(',') ?? []
          giftsImg.forEach((i, index) => {
            giftsImgList.push({
              big: giftsLargeImg[index],
              centre: giftsMediumImg[index],
              small: giftsSmallImg[index],
              materialUrl: i
            })
          })
          this.form = {
            ...this.form,
            ...res[2].data,
            shelveTime: res[2].data.shelveTimingTime,
            countdown: this.countdownType === 'h' ? countdown / 60 : countdown,
            materialSalePicReq: res[2].data.materialSaleVo ? res[2].data.materialSaleVo : this.form.materialSalePicReq,
            // salePrice: this.form.materialSalePicReq.salePrice,
            // marketPrice: this.form.materialSalePicReq.marketPrice,
            groupingPicReqList,
            catalogueReqList,
            informationPptReqList,
            informationPicReqList,
            labelCode: res[2].data.labelCode ?? '',
            fullNotice,
            coverUrlList: res[2].data.coverUrlList ?? [],
            overAllocationNotice,
            copyClassHour: res[2].data.classHour ?? 1,
            subTitle: materialSaleInfo.subTitle,
            goodsForm: materialSaleInfo.goodsForm,
            giftsImgList,
            giftsCode: materialGiftsVo.giftsCode,
            giftsName: materialGiftsVo.giftsName,
            giftsNum: materialGiftsVo.giftsNum,
            giftsType: materialGiftsVo.giftsType || 10086,
            policyDesc: materialGiftsVo.policyDesc,
            policyType: materialGiftsVo.policyType
          }
          console.log(222222222, this.form)
          if (!res[2].data.labelCode) {
            this.form.labelCode = []
          } else {
            this.form.labelCode = res[2].data.labelCode?.split(',') || []
          }
          this.goodsPopularity = this.form.goodsPopularity
          if (res[2].data.goldenSentence) {
            this.goldenSentence = res[2].data.goldenSentence.split('#')
          }
          if (res[2].data.learnExplain) {
            this.learnExplain = res[2].data.learnExplain.split('#')
          }

          // 处理有效期 validityType
          if (res[2].data.materialSaleVo.validityYears > 0) {
            this.form.validityType = 2
            this.form.materialSalePicReq.validityDays = this.form.materialSalePicReq.validityYears
          } else {
            this.form.validityType = 1
          }

          this.loading = false
          if (isCopy) {
            this.form.shelveHideFlag = 0
            this.form.androidHideFlag = 0
            this.form.iosHideFlag = 0
            this.form.appletHideFlag = 0
            this.form.douAppletHideFlag = 0
            this.form.htmlHideFlag = 0
            this.form.shelveHaltFlag = 0
            // this.form.labelCode = []
            this.form.shelveTime = ''
            this.form.shelveFlag = ''
          }
          this.$nextTick(() => {
            if (this.form.name) {
              this.$refs.pdfUpload.setFileList([{
                nickName: this.form.name,
                authProgress: 100
              }])
            }
            this.rowPPTDrop()
            this.rowZiliaoDrop()
          })
        })
    },
    handleInputChange(val) {
      this.form.contentName = val
    },
    handleValidator(val) {
      this.form.subTitle = val.replace(/[{}【】（）‘’\']/ig, '')
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
    change(e) {
    },
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
        success: (res) => {
          console.log(res, 'res')
          this.form[key] = res.materialUrl
        }
      })
    },
    getCoverUrlList(coverUrlList) {
      this.form.coverUrlList = coverUrlList
      this.$refs.form.clearValidate('coverUrlList')
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
    // 选择IP
    teacherChange(e) {
      console.log(e, 'IP')
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
    pptChange(imageList) {
      this.imageList = imageList
      imageList.forEach((i) => {
        this.form.informationPptReqList.push(i)
        this.srcList.push(i.materialUrl)
      })
    },
    handleDelPDF() {
      this.form.informationPptReqList = this.form.informationPptReqList.filter(i => i.materialId)
      this.srcList = this.form.informationPptReqList.map(i => i.materialUrl)
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
          res.imageList.forEach(v => {
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
      if (this.pdfLoading) {
        this.$notify({
          title: '警告',
          message: '请等待pdf上传解析完成!',
          type: 'warning'
        })
        return
      }
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
      this.form.informationPptReqList.forEach((v, i) => {
        informationPptReqList.push({
          informationId: v.materialId ? v.materialId : v.materialUrl,
          materialSize: v.materialSize,
          materialDes: v.materialDes,
          materialName: v.materialName,
          sort: i,
          type: v.materialId ? 1 : 2
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
        marketPrice = Math.round((this.form.materialSalePicReq.marketPrice || 0) * 100)
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
      const warningReqList = [
        ...this.form.fullNotice,
        ...this.form.overAllocationNotice
      ]
      var labelCodeString = ''
      if (this.form.labelCode.length > 0) {
        this.form.labelCode.some(item => {
          labelCodeString += item + ','
        })
        labelCodeString = labelCodeString.substring(0, labelCodeString.length - 1)
      }
      const giftsLargeImg = this.form.giftsImgList.map(i => i.big).join(',')
      const giftsMediumImg = this.form.giftsImgList.map(i => i.centre).join(',')
      const giftsSmallImg = this.form.giftsImgList.map(i => i.small).join(',')
      const giftsImg = this.form.giftsImgList.map(i => i.materialUrl).join(',')
      const params = {
        ...this.form,
        countdown: this.countdownType === 'h' ? this.form.countdown * 60 : this.form.countdown,
        materialSalePicReq,
        materialId: this.form.materialVo.materialId,
        informationPicReqList,
        informationPptReqList,
        goodsReqList,
        goldenSentence,
        learnExplain,
        coverUrlList: this.form.coverUrlList,
        coverVerticalUrl: this.form.coverUrlList[0].coverUrl,
        onlineFlag: 0, // 0: 线上; 1: 线下
        content: this.$refs.AppUEditor
          ? this.$refs.AppUEditor.getContent()
          : '',
        warningReqList,
        labelCode: labelCodeString,
        materialGiftsReq: {
          giftsLargeImg,
          giftsMediumImg,
          giftsSmallImg,
          giftsImg,
          giftsCode: this.form.giftsCode,
          giftsName: this.form.giftsName,
          giftsNum: this.form.giftsNum,
          giftsType: 1,
          policyDesc: this.form.policyDesc,
          policyType: this.form.policyType
        }
      }
      if (this.form.goodsForm !== 2) {
        params.materialGiftsReq = {
          giftsType: ''
        }
      }
      if (this.form.validityType === 2) {
        // 年
        materialSalePicReq.validityYears = this.form.materialSalePicReq.validityDays
        materialSalePicReq.validityDays = 0
      } else {
        // 天
        materialSalePicReq.validityDays = this.form.materialSalePicReq.validityDays
        materialSalePicReq.validityYears = 0
      }
      if (this.isCopy) {
        params.oldGoodsId = this.goodsId
      }
      const api = !this.isCopy ? editGoods : materialGoodsCopy // 复制的逻辑
      api(params).then(res => {
        if (this.isCopy) {
          this.$refs.copyDialog.open({
            goodsId: params.goodsId,
            id: res.data,
            type: 7
          })
          return
        }
        this.$notify({
          title: '成功',
          message: '编辑成功!',
          type: 'success'
        })
        // this.$router.push({ name: 'package', query: { type: 'collegeColumn' }})
        // this.$router.push({ path: '/course/package/packageColumn' })
        // this.visible = false
        this.success && this.success()
        this.$emit('close', 'fromSuccess')
        // this.$router.go(-1)
      })
    },
    changePolicyType() {
      const policyType = {
        1: '退款不需要退回',
        2: '退款需要退回'
      }
      if (!this.form.policyDesc) {
        this.form.policyDesc = policyType[this.form.policyType]
      }
    },
    getGiftsListChange(giftsImgList) {
      this.form.giftsImgList = giftsImgList
      this.$refs.form.clearValidate('giftsImgList')
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
    handleSelectGiftsCode(item) {
      this.form.giftsCode = item.value
      this.form.giftsType = item.giftsType
      this.form.giftsName = item.giftsName
      this.form.giftsNum = item.giftsNum
      this.form.policyDesc = item.policyDesc
      this.form.policyType = item.policyType
      this.form.giftsImgList = []
      const giftsLargeImg = item.giftsLargeImg?.split(',') ?? []
      const giftsMediumImg = item.giftsMediumImg?.split(',') ?? []
      const giftsSmallImg = item.giftsSmallImg?.split(',') ?? []
      const giftsImg = item.giftsImg?.split(',') ?? []
      giftsImg.forEach((i, index) => {
        this.form.giftsImgList.push({
          big: giftsLargeImg[index],
          centre: giftsMediumImg[index],
          small: giftsSmallImg[index],
          materialUrl: i
        })
      })
    },
    async querySearch(queryString, cb) {
      try {
        const { data } = await materialGifts(queryString)
        const items = data.map(i => {
          return {
            ...i,
            value: i.giftsCode
          }
        })
        cb(items)
      } catch (e) {
        cb([])
      }
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
    },
    // 点击新增报满人员
    selectFull() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkDept: [],
        checkUser: this.form.fullNotice,
        disabledUser: [],
        maxlength: 3,
        success: res => {
          console.log(res, 'res')
          res.user.map(v => {
            v.type = 1
          })
          this.form.fullNotice = res.user
        }
      })
    },
    // 点击新增超额分配通知
    selectOverallocation() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkDept: [],
        checkUser: this.form.overAllocationNotice,
        disabledUser: [],
        maxlength: 3,
        success: res => {
          res.user.forEach(v => {
            v.type = 2
          })
          this.form.overAllocationNotice = res.user
        }
      })
    },
    // 预警通知删除触发
    handleNoticeClose(key, row) {
      const index = this.form[key].findIndex(v => v.userId === row.userId)
      this.form[key].splice(index, 1)
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

  .spec-btn {
    background: #E7F0FF;
    color: #0C6FFF;
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

  .numberBox::v-deep{
    display: flex;
    >input{
      border:4px 0 0 4px !important;
    }
    >div:nth-last-of-type(1){
      height:36px;
      width:53px;
      display: flex;
      align-items: center;
      justify-content: center;
      color:#909399;
      background: #F5F7FA;
      border: 1px solid #DCDFE6;
      border-radius: 0 4px 4px 0;
      box-sizing: border-box;
      border-left: none;
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

::v-deep .validity-days .el-input-group__append .el-input__inner {
  width: 60px;
}
</style>
