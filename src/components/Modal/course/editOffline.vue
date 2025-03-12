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
                @input="handleInputChange"
              />
            </el-form-item>

            <el-form-item label="商品简介" prop="columnContent">
              <el-input
                v-model.trim="form.columnContent"
                style="width: 690px"
                maxlength="200"
                type="textarea"
                show-word-limit
                :rows="4"
              />
            </el-form-item>

            <el-form-item label="交付主体" prop="deliverySubject">
              <el-radio-group
                v-model="form.deliverySubject"
                disabled
                @change="form.assistantList = []"
              >
                <el-radio :label="1">伏羲云交付</el-radio>
                <el-radio :label="2">非伏羲云交付</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="form.deliverySubject === 1"
              label="助教"
              prop="assistantList"
            >
              <el-button
                size="small"
                class="btn_primary"
                @click="handleClickAssistantList"
              >新增人员</el-button>
              <assistantChange
                v-if="form.assistantList.length > 0"
                ref="assistantChange"
                class="m-t-20"
                :data="form.assistantList"
                :listyle="{ width: '142px', marginRight: '20px' }"
                width="540px"
                del
                @onDel="handleClickAssistantDel"
                @autoAllocation="autoAllocation"
                @unAutoAllocation="unAutoAllocation"
                @onDelBatch="handleClickAssistantDelBatch"
                @onAdd="handleAssistantAdd"
              />
            </el-form-item>

            <el-form-item label="选择IP" prop="lecturerIdList">
              <m-select
                v-model="form.lecturerIdList"
                disabled
                style="width: 205px"
                filterable
                class="m-300"
                placeholder="请选择老师"
                multiple
                :dict-list="teacherOption"
                :param="{ value: 'lecturerId', label: 'lecturerName' }"
              />
            </el-form-item>

            <el-form-item label="选择类别" prop="curriculumType">
              <el-select v-model="form.curriculumType" placeholder="请选择类型">
                <el-option :value="3" label="公开课" />
                <el-option :value="4" label="一对一" />
                <el-option :value="5" label="落地班" />
              </el-select>
            </el-form-item>

            <el-form-item label="人气值" prop="goodsPopularity">
              <el-input-number
                v-model.number="form.goodsPopularity"
                controls-position="right"
                style="width: 200px"
              />
            </el-form-item>

            <el-form-item label="商品主图" prop="coverUrlList">
              <ImageUpload
                v-model="form.coverUrlList"
                :limit="8"
                @change="getCoverUrlList"
              />
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

            <el-form-item label="封面图" prop="contentUrl">
              <div class="fl w-100p">
                <div
                  v-if="form.contentUrl && form.contentUrl.length > 0"
                  class="fl m-r-10"
                >
                  <div
                    v-for="(item, index) in form.contentUrl"
                    :key="index"
                    class="m-r-10"
                  >
                    <AppMyImage
                      :src="item"
                      style="width: 160px; height: 120px"
                      :options="{
                        width: 750,
                        fixed: true,
                        option: {
                          fixed: true,
                          fixedNumber: [4, 3],
                          fixedBox: false
                        }
                      }"
                      @close="delContentUrl(item, index)"
                      @success="res => changeContentUrlImage(item, index, res)"
                    />
                  </div>
                </div>
                <div
                  v-if="form.contentUrl && form.contentUrl.length < 5"
                  class="image_poster"
                  style="width: 160px; height: 120px"
                  @click="addContentUrl()"
                >
                  <i class="el-icon-plus" />
                  <span>点击上传图片</span>
                </div>
              </div>
              <div class="tips m-t-20">
                <div>
                  封面图是指在商品详情展示的图片。最多可上传五张，最少上传一张。
                </div>
                <div>建议尺寸750*563，小于500K的JPG格式图片</div>
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

            <el-form-item label="商品详情" prop="content">
              <AppUEditor
                ref="AppUEditor"
                v-model="form.content"
                @change="change"
              />
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
            <el-form-item label="自定义锚点">
              <el-input
                v-model="form.anchorInfo"
                placeholder="请输入自定义锚点"
                style="width: 328px"
                maxlength="12"
                show-word-limit
              />
            </el-form-item>
          </div>

          <!-- 商品信息 -->
          <div class="header_tips">添加规格</div>

          <div class="m-t-20">
            <el-form-item label="添加规格" prop="onlineList">
              <el-table
                ref="onlinelisttable"
                border
                :header-cell-style="{ background: '#f5f5f5', padding: '0' }"
                style="width: 955px"
                :data="form.onlineList"
                max-height="450"
              >
                <el-table-column prop="sort" label="序号" width="55">
                  <template slot-scope="{ row }">
                    <span class="table_sort">{{ row.sort }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="specName" label="名称" width="240">
                  <!-- <template slot-scope="scope">
                <el-input v-model.trim="scope.row.specName" />
              </template> -->
                </el-table-column>
                <el-table-column prop="salePrice" label="价格" width="239">
                  <template slot-scope="scope">
                    <span>{{ scope.row.salePrice.toFixed(2) }}</span>元
                  </template>
                </el-table-column>
                <el-table-column prop="goodsNum" label="数量" width="150">
                  <!-- <template slot-scope="scope">
                <el-input v-model.trim="scope.row.goodsNum" type="number" :min="0" />
              </template> -->
                </el-table-column>
                <el-table-column prop="peopleNum" label="人数" width="150">
                  <!-- <template slot-scope="scope">
                <el-input v-model.trim="scope.row.peopleNum" type="number" :min="0" />
              </template> -->
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      size="small"
                      @click.native.prevent="
                        editOnLineList(scope.row, scope.$index)
                      "
                    >修改</el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click.native.prevent="
                        delSpecIds(scope.row, scope.$index)
                      "
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>

              <el-button
                class="m-t-20"
                @click="addOnlineList()"
              >添加规格</el-button>
            </el-form-item>

            <el-form-item label="划线价格" prop="marketPrice">
              <el-input
                v-model.trim="form.marketPrice"
                class="w-120 m-r-10"
                type="number"
                :min="0"
              />
              <span>元</span>
            </el-form-item>
          </div>

          <el-form-item label="添加地址" prop="city">
            <chinaAreaList v-if="form.placeList" v-model="form.placeList" />
          </el-form-item>
          <div class="header_tips m-t-50">服务与履约</div>
          <div class="m-t-20">
            <el-form-item label="售后服务">
              <el-select
                v-model="form.postSaleType"
              >
                <el-option label="7天无理由退款（使用后不支持）" :value="1" />
                <el-option label="不支持退款" :value="2" />
              </el-select>
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
    <!-- 添加规格弹框 -->
    <AppDialog
      v-model="addOnlineListModal.visible"
      title="添加规格"
      width="500px"
      height="260px"
    >
      <el-form
        ref="onlinelistForm"
        :model="addOnlineListModal.form"
        label-width="60px"
        class="p-20"
        :rules="onlinelistRule"
      >
        <el-form-item prop="specName" label="名称">
          <el-input v-model="addOnlineListModal.form.specName" />
        </el-form-item>
        <el-form-item prop="salePrice" label="价格">
          <el-input-number
            v-model="addOnlineListModal.form.salePrice"
            :precision="2"
            :min="0"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item prop="goodsNum" label="数量">
          <el-input-number
            v-model="addOnlineListModal.form.goodsNum"
            :step="1"
            :step-strictly="true"
            :min="0"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item prop="peopleNum" label="人数">
          <!-- <el-input-number
            v-model="addOnlineListModal.form.peopleNum"
            :step="1"
            :step-strictly="true"
            :min="0"
            style="width: 400px"
          /> -->
          {{ addOnlineListModal.form.peopleNum }}
        </el-form-item>
        <el-form-item prop="sort" label="序号">
          <el-input-number
            v-model="addOnlineListModal.form.sort"
            :step="1"
            :step-strictly="true"
            :min="0"
            style="width: 400px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="ss-material-box-bottom">
        <el-button @click="addOnlineListSure">确定</el-button>
        <el-button @click="addOnlineListCancel">取消</el-button>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppUEditor from '@/components/AppUEditor'
import AppMyImage from '@/components/AppMyImage'
import ImageUpload from './components/ImageUpload'
import chinaAreaList from '@/components/chinaAreaList/index.vue'
import { getTeacherList, getCatalogueList } from '@/api/shop'
import { editGoods, getGoodsDetail, getPlatformCatalogueList } from '@/api/course'
import AppDialog from '@/components/AppDialog'
import axios from 'axios'
import {
  deleteAssistant,
  distributeAssistant
} from '@/api/deliver/assistant'
import assistantChange from '@/views/course/offline/assistantChange.vue'
import { filterSpecialCharacters } from '@/utils/index'
export default {
  name: 'VideoEdit',
  components: {
    AppUEditor,
    AppMyImage,
    chinaAreaList,
    AppDialog,
    assistantChange,
    ImageUpload
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
    var validateOnlineList = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请添加规格!'))
      } else {
        callback()
      }
    }
    return {
      map: null,
      loading: false,
      form: {
        contentName: '', // 名称
        materialId: '', // 素材Id
        materialUrl: '', // 素材存储路径(图文，音频)
        materialFrameUrl: '', // 图文首帧图片url
        goodsPopularity: 100, // 人气值
        curriculumType: '', // (1基础课，2进阶课,3长期班，4讲座)
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
        learnExplain: '', // 学习说明
        contentUrl: [], // 详情图片url
        lecturerId: '', // 讲师id
        lecturerIdList: [],
        lecturerName: '', // 讲师名称
        coverVerticalUrl: '', // 竖版封面存储路径
        coverUrl: '', // 横版封面存储路径
        patchUrl: '', // 图文贴片存储路径，goods_type=2生效

        goodsReqList: [], // 关联商品ids
        content: '', // 图文详情
        teacher: '',
        contentSettingFlag: 0, // 详情设置(0购买前查看完整商品详情，1购买前仅查看介绍内容)goods_type=1生效
        forwardFlag: 0, // 倍速播放/快进(0允许，1禁止)，goods_type=2生效
        fragmentTrialFlag: 1, // 片段试看(0开启，1关闭)，goods_type=2生效
        goodsId: '', // 图文音频图文id
        goodsType: 5, // 5公开课，6一对一,7落地班
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
          marketPrice: '', // 商品划线价格 单位分
          password: '', // 密码
          repeatPurchase: 0, // 是否允许学员重复购买 0允许,1,不允许
          salePrice: '', // 商品价格 单位：分
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
        onlineList: [], // 商品规格list
        placeList: '',
        specIds: [], // 删除商品规格specIds
        androidHideFlag: 0,
        iosHideFlag: 0,
        appletHideFlag: 0,
        douAppletHideFlag: 0,
        htmlHideFlag: 0,
        deliverySubject: '', // 交付主体
        assistantList: [], // 助教
        anchorInfo: ''
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
        columnContent: [
          { required: true, message: '请输入商品简介', trigger: 'blur' }
        ],
        coverUrlList: [
          { required: true, message: '请选择商品主题', type: 'array', trigger: 'change' }
        ],
        coverUrl: [
          { required: true, message: '请选择横版缩略图', trigger: 'blur' }
        ],
        catalogueReqList: [
          { required: true, message: '请选择平台商品分类', type: 'array', trigger: 'change' }
        ],
        curriculumType: [
          { required: true, message: '请选择类别', trigger: 'change' }
        ],
        lecturerIdList: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个讲师',
            trigger: 'change'
          }
        ],
        contentUrl: [
          {
            type: 'array',
            required: true,
            message: '请至少上传一张封面图',
            trigger: 'change'
          }
        ],
        sale: [{ required: true, validator: validateSale, trigger: 'change' }],
        content: [
          { required: true, message: '请输入商品详情', trigger: 'blur' }
        ],
        onlineList: [
          { required: true, validator: validateOnlineList, trigger: 'change' }
        ],
        goodsPopularity: [
          { required: true, message: '请输入人气值', trigger: 'blur' }
        ],
        deliverySubject: [
          { required: true, message: '请选择交付主体', trigger: 'change' }
        ],
        assistantList: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个助教',
            trigger: 'change'
          }
        ]
      },
      srcList: [],
      // 设置选择今天以及今天之后的日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      goldenSentence: [''],
      learnExplain: [''],
      goodsPopularity: 0,
      addOnlineListModal: {
        visible: false,
        type: 1, // 1: 新增,2:修改
        form: {
          specName: '',
          goodsNum: 0,
          salePrice: 0,
          peopleNum: 0
        },
        index: ''
      },
      onlinelistRule: {
        specName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        salePrice: [
          {
            required: true,
            pattern: /^([1-9]\d*)(\.\d{1,6})?$|^0\.\d{1,6}?$/,
            message: '价格需要大于0',
            trigger: 'blur'
          }
        ],
        goodsNum: [
          {
            required: true,
            pattern: /^([1-9]\d*)(\.\d{1,6})?$|^0\.\d{1,6}?$/,
            message: '数量需要大于0',
            trigger: 'blur'
          }
        ],
        peopleNum: [
          {
            required: true,
            pattern: /^([1-9]\d*)(\.\d{1,6})?$|^0\.\d{1,6}?$/,
            message: '人数需要大于0',
            trigger: 'blur'
          }
        ]
      },
      assistantList: [], // 初始的助教列表
      imageList: []
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
          if (res[2].data.marketPrice) {
            res[2].data.marketPrice = res[2].data.marketPrice / 100
          } else {
            res[2].data.marketPrice = ''
          }
          let contentUrl = []
          if (res[2].data.contentUrl) {
            console.log(res[2].data)
            contentUrl = res[2].data.contentUrl.split(',')
          }
          if (res[2].data.onlineList) {
            res[2].data.onlineList.map(v => {
              v.salePrice = v.salePrice / 100
            })
          }
          if (res[2].data.learnExplain) {
            this.learnExplain = res[2].data.learnExplain.split('#')
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

          let assistantList = []
          if (res[2].data.assistantList) {
            assistantList = res[2].data.assistantList.reduce((pre, next) => {
              pre.push({
                autoDistribute: next.autoDistribute,
                createTime: next.createTime,
                userId: next.sysUserId,
                deptName: next.deptName,
                deptId: next.deptId,
                nickName: next.sysUserName,
                num: next.num || 1,
                id: next.id
              })
              return pre
            }, [])
          }
          this.form = {
            ...this.form,
            ...res[2].data,
            materialSalePicReq: res[2].data.materialSaleVo,
            goodsReqList: res[2].data.materialGoodsReVoList || [],
            contentUrl,
            groupingPicReqList,
            catalogueReqList,
            informationPptReqList,
            informationPicReqList,
            coverUrlList: res[2].data.coverUrlList ?? [],
            assistantList
          }
          this.assistantList = JSON.parse(JSON.stringify(assistantList))
          this.goodsPopularity = this.form.goodsPopularity
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
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
    change(e) {
      this.$refs.form && this.$refs.form.validateField('content')
    },
    getCoverUrlList(coverUrlList) {
      this.form.coverUrlList = coverUrlList
      this.$refs.form.clearValidate('coverUrlList')
    },
    pptChange(imageList) {
      this.imageList = imageList
      imageList.forEach((i) => {
        this.form.informationPptReqList.push(i)
        this.srcList.push(i.materialUrl)
      })
    },
    // 选择视频
    getVideo() {
      this.$SelectMaterial({
        visible: true,
        types: [2],
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
          this.$refs.form && this.$refs.form.validateField(key)
        }
      })
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
      if (e === 0) {
        // 免费的视频不用设置片段试看
        this.$set(this.form, 'fragmentTrialFlag', 1)
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
        max: 100,
        fileList: this.form.informationPicReqList,
        success: res => {
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
          console.log(valid, 'error submit!!')
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
      // 地址
      if (this.form.placeList.length) {
        const item = this.form.placeList.find(
          item =>
            (item?.districtName?.length && !item.address) ||
            (!item?.districtName?.length && item.address)
        )
        if (item) return this.$message.warning('请把地址填写完整')
      }
      this.loading = true
      // 相关资料列表ids
      const informationPicReqList = []
      // 相关PPT列表ids
      const informationPptReqList = []
      // 关联专栏ids
      const goodsReqList = []
      // 详情图
      let contentUrl = ''
      // 助教列表
      const assistantList = this.form.assistantList.reduce((pre, next) => {
        pre.push({
          createTime: next.createTime ? next.createTime : '',
          autoDistribute: next.autoDistribute,
          deptId: next.deptId,
          sysUserId: next.userId,
          num: next.num || 1
        })
        return pre
      }, [])
      // const { form } = this
      const form = JSON.parse(JSON.stringify(this.form))
      form.informationPicReqList &&
        form.informationPicReqList.map(v => {
          informationPicReqList.push(v.materialId)
        })
      form.informationPptReqList &&
        form.informationPptReqList.map(v => {
          informationPptReqList.push(v.materialId)
        })
      form.goodsReqList &&
        form.goodsReqList.map(v => {
          goodsReqList.push(v.goodsId)
        })
      form.onlineList &&
        form.onlineList.map(v => {
          v.salePrice = v.salePrice * 100
        })
      form.contentUrl &&
        form.contentUrl.map((v, i) => {
          contentUrl = `${contentUrl}${i === 0 ? '' : ','}${v}`
        })
      const learnExplain = this.learnExplain.filter(Boolean).join('#')
      if (this.goodsPopularity === form.goodsPopularity) {
        form.goodsPopularity = 0
      }
      const params = {
        ...form,
        materialId: form.materialVo.materialId,
        marketPrice: (form.marketPrice || 0) * 100,
        informationPicReqList,
        informationPptReqList,
        goodsReqList,
        learnExplain,
        onlineFlag: 1, // 0: 线上; 1: 线下
        contentUrl,
        content: this.$refs.AppUEditor.getContent(),
        assistantList
      }
      editGoods(params)
        .then(res => {
          this.$notify({
            title: '成功',
            message: '新建成功!',
            type: 'success'
          })
          this.success && this.success()
          this.$emit('close')
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },

    // 选择专栏
    selectColumn() {
      const goodsReqList = []
      this.form.goodsReqList &&
        this.form.goodsReqList.map(v => {
          goodsReqList.push(v.goodsId)
        })
      this.$SelectGoods({
        visible: true,
        check: goodsReqList,
        multiple: true,
        tabList: [{ id: '3', name: '普通专栏', api: '' }],
        currentId: '3',
        success: res => {
          console.log(res, 'res')
          this.form.goodsReqList = this.form.goodsReqList.concat(res)
        }
      })
    },
    // 点击添加详情图
    addContentUrl() {
      this.$SelectMaterial({
        visible: true,
        types: [0],
        success: (res) => {
          console.log(res, 'res')
          this.form.contentUrl.push(res.materialUrl)
          this.$refs.form && this.$refs.form.validateField('contentUrl')
        }
      })
    },
    // 删除详情图
    delContentUrl(item, index) {
      this.form.contentUrl.splice(index, 1)
    },
    // 改变详情图片
    changeContentUrlImage(item, index, res) {
      this.$set(this.form.contentUrl, index, res)
    },
    // 添加规格
    addOnlineList() {
      this.addOnlineListModal = {
        visible: true,
        type: 1,
        form: {
          goodsNum: '',
          salePrice: '',
          specName: '',
          peopleNum: 1,
          sort: ''
        },
        index: ''
      }
      // this.form.onlineList.push({
      //   goodsNum: 0,
      //   salePrice: 0,
      //   specName: '',
      //   peopleNum: 0
      // })
    },
    // 点击修改规格弹框
    editOnLineList(row, index) {
      const form = JSON.parse(JSON.stringify(row))
      this.addOnlineListModal = {
        type: 2,
        visible: true,
        form: form,
        index: index
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
    // 添加规格确认
    addOnlineListSure() {
      this.$refs.onlinelistForm.validate(valid => {
        if (valid) {
          console.log(this.addOnlineListModal.type, '1231')
          if (this.addOnlineListModal.type === 1) {
            const res = JSON.parse(JSON.stringify(this.addOnlineListModal.form))
            this.form.onlineList.push(res)
          } else {
            const res = JSON.parse(JSON.stringify(this.addOnlineListModal.form))
            console.log(this.addOnlineListModal.index, res)
            this.$set(this.form.onlineList, this.addOnlineListModal.index, res)
          }
          this.addOnlineListCancel()
          this.$refs.form && this.$refs.form.validateField('onlineList')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加规格取消
    addOnlineListCancel() {
      this.$refs.onlinelistForm && this.$refs.onlinelistForm.clearValidate()
      this.addOnlineListModal.visible = false
    },
    // 删除商品规格
    delSpecIds(row, index) {
      this.form.onlineList.splice(index, 1)
      if (row.specId) {
        this.form.specIds.push(row.specId)
      }
    },
    // 点击添加助教按钮
    handleClickAssistantList() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        minlength: 1,
        type: [1],
        checkUser: this.form.assistantList,
        success: res => {
          const assistantList = []
          res.user.map(v => {
            const index = this.form.assistantList.findIndex(
              e => e.userId === v.userId
            )
            assistantList.push({
              ...v,
              autoDistribute:
                index > -1
                  ? (v.autoDistribute =
                      this.form.assistantList[index].autoDistribute)
                  : (v.autoDistribute = 1),
              createTime:
                index > -1
                  ? (v.autoDistribute =
                      this.form.assistantList[index].createTime)
                  : (v.createTime = '')
            })
          })
          this.form.assistantList = assistantList
          this.$refs.form && this.$refs.form.validateField('assistantList')
        }
      })
    },
    // 删除助教
    handleClickAssistantDel(item) {
      console.log(item)
      this.loading = true
      const params = {
        goodsId: this.goodsId,
        ids: [item.userId]
      }
      deleteAssistant(params)
        .then(res => {
          this.loading = false
          const index = this.form.assistantList.findIndex(
            v => v.userId === item.userId
          )
          index > -1 && this.form.assistantList.splice(index, 1)
          this.$nextTick(() => {
            this.$refs.assistantChange.refresh()
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 批量删除助教
    handleClickAssistantDelBatch(arr) {
      if (arr.length === this.form.assistantList.length) {
        return this.$message.error('助教必须保留至少有1个在职人员')
      }
      this.loading = true
      const ids = arr.map(i => i.userId)
      const params = {
        goodsId: this.goodsId,
        ids
      }
      deleteAssistant(params)
        .then(res => {
          this.loading = false
          this.form.assistantList = this.form.assistantList.filter(
            v => !ids.includes(v.userId)
          )
          this.$nextTick(() => {
            this.$refs.assistantChange.refresh()
          })
        })
        .catch(() => {
          this.loading = false
        })
      // this.$nextTick(() => {
      //   this.$refs.assistantChange.refresh()
      // })
    },
    // 自动分配
    autoAllocation(item) {
      console.log(item)
      this.loading = true
      const params = {
        autoDistribute: 1,
        id: item.id
      }
      distributeAssistant(params)
        .then(res => {
          this.loading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          const index = this.form.assistantList.findIndex(
            v => v.userId === item.userId
          )
          this.form.assistantList[index].autoDistribute = 1
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 取消自动分配
    unAutoAllocation(item) {
      this.loading = true
      const params = {
        autoDistribute: 0,
        id: item.id
      }
      distributeAssistant(params)
        .then(res => {
          this.loading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          const index = this.form.assistantList.findIndex(
            v => v.userId === item.userId
          )
          this.form.assistantList[index].autoDistribute = 0
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 新增人员
    handleAssistantAdd(arr) {
      const assistantList = []
      arr.map(v => {
        const index = this.form.assistantList.findIndex(
          e => e.userId === v.userId
        )
        assistantList.push({
          ...v,
          autoDistribute:
            index > -1
              ? (v.autoDistribute = this.assistantList[index].autoDistribute)
              : (v.autoDistribute = 1),
          createTime:
            index > -1
              ? (v.autoDistribute = this.assistantList[index].createTime)
              : (v.createTime = '')
        })
      })
      this.form.assistantList = assistantList

      this.$nextTick(() => {
        this.$refs.assistantChange && this.$refs.assistantChange.refresh()
      })
      this.$refs.form && this.$refs.form.validateField('assistantList')
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
    width: 99.9% !important;
  }
}
</style>
