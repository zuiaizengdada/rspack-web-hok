<template>
  <div class="detail-wrapper">
    <div style="padding: 10px">
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        class="form-breadcrumb"
      >
        <el-breadcrumb-item :to="{ path: '/product/productManage' }">
          <span style="color: #777777">产品管理</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>产品详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="addProduct overflowOuto">
      <el-form
        ref="form"
        v-loading="loading"
        :model="form"
        label-width="auto"
        size="small"
        :validate-on-rule-change="true"
        @submit.native.prevent
      >
        <el-form-item label="基本信息" class="f-title" />
        <el-form-item label="产品名称" class="zaaaaa">
          <span>{{ form.productName }}</span>
        </el-form-item>
        <el-form-item label="产品分类">
          <span>{{ returnSortLable(form.sortLabel) }}</span>
        </el-form-item>
        <el-form-item v-if="form.sortLabel == 3" label="商品属性">
          <span>{{ returnGoodsAttribute(form.goodsAttribute) }}</span>
        </el-form-item>
        <el-form-item label="讲师名称">
          <span>{{ form.teacherName }}</span>
        </el-form-item>

        <el-form-item label="商品价格">
          <span>{{ form.goodsPrice }}</span>
        </el-form-item>
        <!-- 课研人员 -->
        <el-form-item label="课研人员">
          <span>
            {{ keyanRenyuan }}
          </span>
        </el-form-item>
        <el-form-item v-if="form.researchProgress !== 1" label="课程介绍">
          <span>{{ form.courseIntroduction }}</span>
        </el-form-item>

        <el-form-item
          v-if="form.researchProgress !== 1"
          label="素材图地址"
          prop="materialAddress"
        >
          <span>{{ form.materialAddress }}</span>
        </el-form-item>
        <el-form-item v-if="form.researchProgress !== 1" label="有无赠品">
          <el-radio-group
            v-model="form.giveawayHas"
            :disabled="true"
            @change="giveawayHasChange"
          >
            <el-radio :label="1">无</el-radio>
            <el-radio :label="2">有</el-radio>
          </el-radio-group>
          <fileUpload
            v-show="form.giveawayHas === 2"
            ref="productfileUpload"
            :class="{ hide: ifReview }"
            style="width: 450px"
            :limit="10"
            accept=".pdf,.docx,.doc,.jpg,.word"
            :before-video-upload="beforeVideoUpload"
            is-review
            @change="fileChange"
          />
        </el-form-item>
        <el-form-item v-if="form.researchProgress !== 1" label="是否完结">
          <span>{{ form.completeStatus === 0 ? '已完结' : '未完结' }}</span>
        </el-form-item>
        <el-form-item v-if="form.researchProgress !== 1" label="上架计划">
          <span>{{ form.expectedClassHour }}</span>
        </el-form-item>
        <!-- 赠品 -->
        <!-- 是否完结 -->
        <!-- 上架计划 -->
        <template
          v-if="form.researchProgress !== 2 && form.researchProgress !== 1"
        >
          <el-form-item label="交付信息" class="f-title" />
          <el-form-item label="交付主体">
            <span>{{ returnDeliveryMainBody(form.deliveryMainBody) }}</span>
          </el-form-item>
          <el-form-item v-if="form.deliveryMainBody === 1" label="伏羲云分配人">
            <span>{{ form.distributionUserName }}</span>
          </el-form-item>
          <el-form-item label="ERP分配人">
            <span>{{ form.erpDistributionUser }}</span>
          </el-form-item>
          <el-form-item v-if="form.erpSalesTeam" label="ERP兜底销售团队">
            <span>{{ form.erpSalesTeam }}</span>
          </el-form-item>
          <el-form-item v-if="form.allocationRemark" label="备注">
            <span>{{ form.allocationRemark }}</span>
          </el-form-item>
        </template>
        <!-- ERP兜底销售团队 -->
        <!-- 备注 -->
        <el-form-item
          v-if="
            form.researchProgress !== 2 &&
              form.researchProgress !== 1 &&
              form.researchProgress !== 3
          "
          label="上架信息"
          class="f-title"
        >
          <groundingDetail
            v-model="isShowGroundingDetail"
            :product-id="productId"
            is-page
            @handleClose="
              () => {
                isShowGroundingDetail = false
              }
            "
          />
        </el-form-item>
        <el-form-item
          v-if="
            form.dispersingLink ||
              (form.dispersingUrlList && form.dispersingUrlList.length)
          "
          label="宣发周知"
        >
          <div v-if="form.dispersingLink">
            <el-link
              style="margin-left: 12px"
              type="primary"
              :underline="false"
              @click="openUrl()"
            >{{ form.dispersingLink }}</el-link>
          </div>
          <div v-if="form.dispersingUrlList && form.dispersingUrlList.length">
            <div
              v-for="(item, index) in form.dispersingUrlList"
              :key="index"
              type="primary"
              :style="{ 'margin-top': index < 1 ? '0px' : '10px' }"
              :underline="false"
              @click="openUrl(item)"
            >
              <FileListProduct is-review :url="item" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="跟进信息" class="f-title" />
        <el-form-item v-if="form.remark" label="店铺备注">
          <span>{{ form.remark || '-' }}</span>
        </el-form-item>
        <el-form-item v-if="form.updateList.length" label="更新记录">
          <a id="tableupdateList" name="tableupdateList" />
          <el-table border stripe :data="form.updateList" style="width: 850px">
            <el-table-column
              prop="content"
              label="更新内容"
              show-overflow-tooltip
              width="300px"
            />
            <el-table-column prop="updateBy" label="更新人" />
            <el-table-column prop="updateTime" label="更新时间">
              <template slot-scope="scope">
                {{ scope.row.updateTime | parseTime }}
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="研发进度">
          <span v-if="form.researchProgress === 1">制作中</span>
          <span v-if="form.researchProgress === 2">待分配</span>
          <span v-if="form.researchProgress === 3">待上架</span>
          <span v-if="form.researchProgress === 4">已上架</span>
          <span v-if="form.researchProgress === 5">已宣发</span>
          <span v-if="form.researchProgress === 6">已下架</span>
          <el-date-picker
            v-if="form.researchProgress === 7"
            v-model="form.shelfDate"
            format="yyyy-MM-dd HH:mm:ss"
            class="m-l-10"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 180px"
            :picker-options="pickerOptions"
            type="datetime"
            placeholder="请选择上架时间"
          />
        </el-form-item>
        <el-form-item label="最近更新时间">
          <span v-if="form.updateTime">{{
            moment(form.updateTime).format('YYYY-MM-DD HH:mm:ss')
          }}</span>
          <span v-else>-</span>
        </el-form-item>
        <el-form-item v-if="form.researchProgress === 6" label="下架时间">
          <span v-if="form.offShelfDate">{{
            moment(form.offShelfDate).format('YYYY-MM-DD HH:mm:ss')
          }}</span>
        </el-form-item>
      </el-form>
      <div
        v-if="!form.associationGoodsFlag"
        v-permission="['web:product:newZl', permsList]"
        style="text-algin: center"
      >
        <el-button
          style="margin-left: 420px"
          type="primary"
          @click="newGoods"
        >新建专栏</el-button>
      </div>
    </div>
    <el-dialog
      title="提醒"
      :visible.sync="dialogVisible"
      width="30%"
      center
      :before-close="handleClose"
    >
      <span>请选择您需要创建的专栏或者大专栏</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toChooseZhuanl(1)">专栏</el-button>
        <el-button type="primary" @click="toChooseZhuanl(2)">大专栏</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  researchProgressOption,
  sortLabelOption,
  deliveryMainBodyArray,
  goodsAttributeArray
} from '@/views/product/columns.js'
import { productDetailByIdAjax } from '@/api/product/productManage.js'
import groundingDetail from '@/views/product/productManage/groundingDetail.vue'
import fileUpload from '@/views/product/productManage/uploadFile'
import moment from 'moment'
import { mapActions } from 'vuex'
import FileListProduct from '../productManage/uploadFile/list'
export default {
  components: {
    fileUpload,
    groundingDetail,
    FileListProduct
  },
  data() {
    return {
      moment,
      dialogVisible: false,
      permsList: this.$route.meta.permsList || [],
      appPlaceholder: '请输入关键字选择分配人',
      deliveryMainBodyArray,
      goodsAttributeArray,
      loading: false,
      visible: false,
      title: '新增',
      ifEdit: false,
      ifReview: false,
      row: {},
      keyanRenyuan: '',
      form: {
        name: '',
        goodsAttribute: '',
        deliveryMainBody: 1,
        resetFields: '',
        researcherList: [],
        sortLabel: [],
        giveawayHas: 1,
        shelfDate: '',
        giveawayUrls: [],
        updateList: [],
        dispersingUrlList: []
      },
      top: '114px',
      sortable: null,
      researchProgressOption,
      sortLabelOption,
      success: () => {},
      // 设置选择今天以及今天之前的日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      isShowGroundingDetail: false,
      productId: undefined
    }
  },
  watch: {},
  mounted() {
    const productId = this.$route.query.productId
    const isTo = this.$route.query.isTo
    this.productId = productId
    setTimeout(() => {
      this.isShowGroundingDetail = true
    }, 1000)
    productDetailByIdAjax({
      productId: productId
    })
      .then(res => {
        if (res.code === 1) {
          this.row = res.data
          this.initEdit()
          if (isTo === '1') {
            this.$nextTick(() => {
              document.getElementById('tableupdateList').scrollIntoView()
            })
          }
        }
      })
      .finally(() => {})
  },
  methods: {
    ...mapActions('user', ['setSingleHistory']),
    handleClose() {
      this.dialogVisible = false
    },
    openUrl(item) {
      window.open(item || this.form.dispersingLink, '_blank')
    },
    toChooseZhuanl(number) {
      if (number === 1) {
        this.setSingleHistory('/shop/packageColumn')
        this.$router.push(
          `/shop/packageColumn/columnAdd?productId=${this.form.id}`
        )
      } else if (number === 2) {
        this.setSingleHistory('/shop/packageCollegeColumn')
        this.$router.push(
          `/shop/packageCollegeColumn/collegeColumnAdd?productId=${this.form.id}`
        )
      }
    },
    newGoods() {
      console.log(this.form)
      // eslint-disable-next-line eqeqeq
      if (this.form.sortLabel == 1 || this.form.sortLabel == 2) {
        this.dialogVisible = true
      }
      // eslint-disable-next-line eqeqeq
      if (this.form.sortLabel == 5 || this.form.sortLabel == 4) {
        this.setSingleHistory('/shop/packageCollegeColumn')
        this.$router.push(
          `/shop/packageCollegeColumn/collegeColumnAdd?productId=${this.form.id}`
        )
      }
      // eslint-disable-next-line eqeqeq
      if (this.form.sortLabel == 3) {
        this.setSingleHistory('/shop/offline')
        this.$router.push(`/shop/offline/offlineAdd?productId=${this.form.id}`)
      }
    },
    clearGoodsAttributte() {
      if (this.form.sortLabel !== 3) {
        this.form.goodsAttribute = ''
      }
    },
    // 限制只能输入数字
    delNumber(e, row) {
      let value = e
        .replace(/[^\d.]/g, '') // 将非数字和点以外的字符替换成空
        .replace(/^\./g, '') // 验证第一个字符是数字而不是点
        .replace(/\.{2,}/g, '.') // 出现多个点时只保留第一个
        .replace('.', '$#$') // 1、将数字的点替换成复杂字符$#$
        .replace(/\./g, '') // 2、将字符串的点直接清掉
        .replace('$#$', '.') // 3、将复杂字符再转换回点
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      if (value.indexOf('.') < 0 && value !== '') {
        value = parseFloat(value)
      } else if (value.indexOf('.') > 1 && value[0] === '0') {
        value = parseFloat(value)
      }
      if (value > 100000) {
        value = 100000
      }
      row.goodsPrice = value
    },
    returnSortLable(data) {
      let returnString = ''
      this.sortLabelOption.some(item => {
        // eslint-disable-next-line eqeqeq
        if (item.value == data) {
          returnString = item.label
        }
      })
      return returnString
    },
    returnDeliveryMainBody(data) {
      let returnString = ''
      this.deliveryMainBodyArray.some(item => {
        // eslint-disable-next-line eqeqeq
        if (item.value == data) {
          returnString = item.label
        }
      })
      return returnString
    },
    returnGoodsAttribute(data) {
      let returnString = ''
      this.goodsAttributeArray.some(item => {
        // eslint-disable-next-line eqeqeq
        if (item.value == data) {
          returnString = item.label
        }
      })
      return returnString
    },

    initEdit() {
      // this.row.sortLabel = this.row.sortLabel?.split(',') || []
      this.row.giveawayUrls =
        this.row.giveawayHas === 1 ? [] : this.row.giveawayUrls || []
      this.row.shelfDate =
        this.row.shelfDate && this.row.researchProgress === 7
          ? moment(this.row.shelfDate).format('YYYY-MM-DD HH:mm:ss')
          : moment().format('YYYY-MM-DD 00:00:00')
      this.row.goodsPrice = this.row?.goodsPrice / 100
      // this.row.goodsPrice = filtersMoneyByZero(this.row?.goodsPrice)
      const researcherList = []
      const giveawayUrls = []
      this.row.researcherList.map(v => {
        researcherList.push({
          userId: v.sysUserId,
          nickName: v.sysUserName
        })
      })
      this.row.giveawayUrls.map(v => {
        giveawayUrls.push({
          status: 3,
          url: v
        })
      })
      this.row.researcherList = researcherList

      this.row.sortLabel = this.row.sortLabel?.split(',')
        ? this.row.sortLabel?.split(',')[0]
        : ''
      this.form = { ...this.row }
      console.log('form::', this.form)
      this.form.researcherList.some(item => {
        this.keyanRenyuan += item.nickName + '、'
      })
      this.keyanRenyuan = this.keyanRenyuan.substring(
        0,
        this.keyanRenyuan.length - 1
      )
      this.$nextTick(() => {
        this.$refs.productfileUpload?.setFileList(giveawayUrls)
      })
    },
    initAdd() {
      this.form.shelfDate = moment().format('YYYY-MM-DD 00:00:00')
    },
    beforeVideoUpload(file) {
      const suffix = this.$getFileType(file.name).suffix
      const ifFileType = ['doc', 'docx', 'pdf', 'word', 'jpg'].includes(suffix)
      if (!ifFileType) {
        this.$message.error({
          message: '请上传支持的文件格式',
          customClass: 'amap-sug-result'
        })
        return false
      }
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error({
          message: '文件最大不超过20M',
          customClass: 'amap-sug-result'
        })
        return false
      }
      return isLt20M && ifFileType
    },
    fileChange(res) {
      const arr = []
      res.map(v => {
        arr.push(v.url)
      })
      this.form.giveawayUrls = arr
      if ([0, 1].includes(arr.length)) {
        this.$refs.form && this.$refs.form.validateField('giveawayHas')
      }
    },
    giveawayHasChange(e) {
      e === 1 && this.$refs.form && this.$refs.form.validateField('giveawayHas')
    }
  }
}
</script>

<style lang="scss" scoped>
.addProduct {
  max-height: 724px;
  padding: 20px 34px;
}
.tips {
  margin-top: 10px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 17px;
}
.myLotteryTable {
  width: 100%;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #cbcfd3;
  font-size: 12px;
  overflow: hidden;
}
.assessBox {
  margin-top: 16px;
  width: 450px;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  .remindPersonListView {
    margin-right: 16px;
    margin-bottom: 16px;
  }
}
.hide {
  ::v-deep .fileBtnIcon {
    display: none;
  }
}
::v-deep .f-title {
  .el-form-item__label-wrap {
    margin-left: -10px !important;
    label {
      font-weight: bold;
      font-size: 16px;
    }
  }

  .el-form-item__label::before {
    content: '' !important;
  }
}

.detail-wrapper {
  width: 100%;
  height: 750px;
  border-radius: 10px;
  background: #fff;
}
// 处理头
::v-deep .el-collapse {
  border: none;
  margin: 0 !important;
  .el-collapse-item__header {
    height: auto;
    line-height: initial;
    margin-top: 5px;
    margin-bottom: 10px;
    border: none;
  }
}
</style>
