<template>
  <el-form ref="form" :model="form" label-width="120px">
    <el-form-item label="关键词" prop="damedkeyword">
      <el-autocomplete
        v-model="form.damedkeyword"
        style="width: 530px"
        class="inline-input"
        :fetch-suggestions="querySearchDamedKeyword"
        placeholder="请输入内容"
        :trigger-on-focus="false"
        value-key="keyword"
      />
      <!-- <el-input v-model="form.damedkeyword"  /> -->
      <!-- <damed-keyworld-input style="width: 400px" @select="damedkeyworldInputSelect" /> -->
    </el-form-item>
    <div class="flex">
      <!-- <el-form-item label="所属行业" prop="industry">
        <el-cascader
          v-model="form.industry"
          placeholder="请选择所属行业"
          :options="industryList"
          :show-all-levels="false"
          :props="{ checkStrictly: true, emitPath: false, value: 'catName', label: 'catName' }"
          clearable
        />
      </el-form-item> -->
      <el-form-item label="平台类型" prop="platformType" style="width: 300px">
        <el-radio-group v-model="form.platformType" @change="handleChnagePlatformType">
          <el-radio v-for="item in paltformTypeList" :key="item.id" :label="item.catalogCode">{{
            item.catalogName
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="所属领域" prop="domain" style="width: 340px">
        <el-select v-model="form.domain" clearable>
          <el-option
            v-for="item in domainList"
            :key="item.domainId"
            :label="item.domainName"
            :value="item.domainName"
          />
        </el-select>
      </el-form-item>
    </div>

    <el-form-item v-show="form.platformType === 'news'" ref="platfromValue" label="平台名称" prop="platfromValue">
      <el-radio-group v-model="form.platfromValue" class="check-item">
        <el-radio-button
          v-for="item in paltformNewsList"
          :key="item.id"
          border
          :label="item.catalogCode"
          @click.native="activeAccountCode = item.catalogCode"
        >{{ item.catalogName }}</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-show="form.platformType === 'video'" ref="platfromVideoValue" label="平台名称" prop="platfromVideoValue" class="check-item">
      <el-radio-group v-model="form.platfromVideoValue">
        <el-radio-button
          v-for="item in paltformVideoList"
          :key="item.id"
          border
          :label="item.catalogCode"
          @click.native="activeAccountCode = item.catalogCode"
        >{{ item.catalogName }}</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      v-show="form.platformType === 'news' && activeAccountCode === 'zxwz' && newsZixunList.length"
      ref="newsChecks"
      label="网站/账号名称"
      prop="newsChecks"
    >
      <p style="color:#777">注：以下名称一次最多选择3个</p>
      <el-checkbox-group v-model="form.newsChecks" :max="3">
        <el-checkbox v-for="item in newsZixunList" :key="item.id" :label="item.accountName" />
      </el-checkbox-group>
    </el-form-item>

    <el-form-item
      v-show="form.platformType === 'news' && activeAccountCode ==='wxgzh' && newsWeixinList.length"
      ref="weixinChecks"
      label="网站/账号名称"
      prop="weixinChecks"
    >
      <p style="color:#777">注：以下名称一次最多选择3个</p>
      <el-checkbox-group v-model="form.weixinChecks" :max="3">
        <el-checkbox v-for="item in newsWeixinList" :key="item.id" :label="item.accountName" />
      </el-checkbox-group>
    </el-form-item>

    <el-form-item
      v-show="form.platformType === 'video' && activeAccountCode === 'douyin' && videoDouyinList.length"
      ref="videoDouyinChecks"
      label="网站/账号名称"
      prop="videoDouyinChecks"
    >
      <p style="color:#777">注：以下名称一次最多选择3个</p>
      <el-checkbox-group v-model="form.videoDouyinChecks" :max="3">
        <el-checkbox
          v-for="item in videoDouyinList"
          :key="item.id"
          :label="item.accountName"
          :checked="item.check"
          :disabled="item.disabled"
        />
      </el-checkbox-group>
    </el-form-item>

    <el-form-item
      v-show="
        form.platformType === 'video' && activeAccountCode === 'xiaohongshu' && videoXiaohongshuList.length
      "
      ref="videoXiaohongshuChecks"
      label="网站/账号名称"
      prop="videoXiaohongshuChecks"
    >
      <p style="color:#777">注：以下名称一次最多选择3个</p>
      <el-checkbox-group v-model="form.videoXiaohongshuChecks" :max="3">
        <el-checkbox
          v-for="item in videoXiaohongshuList"
          :key="item.id"
          :label="item.accountName"
          :checked="item.check"
          :disabled="item.disabled"
        />
      </el-checkbox-group>
    </el-form-item>

    <el-form-item
      v-show="form.platformType === 'video' && activeAccountCode === 'kuaishou' && videoKuaishouList.length"
      ref="videoKuaishouChecks"
      label="网站/账号名称"
      prop="videoKuaishouChecks"
    >
      <p style="color:#777">注：以下名称一次最多选择3个</p>
      <el-checkbox-group v-model="form.videoKuaishouChecks" :max="3">
        <el-checkbox
          v-for="item in videoKuaishouList"
          :key="item.id"
          :label="item.accountName"
          :checked="item.check"
          :disabled="item.disabled"
        />
      </el-checkbox-group>
    </el-form-item>

    <el-form-item
      v-show="form.platformType === 'video' && activeAccountCode === 'bilibili' && videoBilibiliList.length"
      ref="videoBilibiliChecks"
      label="网站/账号名称"
      prop="videoBilibiliChecks"
    >
      <p style="color:#777">注：以下名称一次最多选择3个</p>
      <el-checkbox-group v-model="form.videoBilibiliChecks" :max="3">
        <el-checkbox
          v-for="item in videoBilibiliList"
          :key="item.id"
          :label="item.accountName"
          :checked="item.check"
          :disabled="item.disabled"
        />
      </el-checkbox-group>
    </el-form-item>

    <el-form-item
      v-show="form.platformType === 'video' && activeAccountCode === 'bdsp' && videoBaiduList.length"
      ref="videoBaiduChecks"
      label="网站/账号名称"
      prop="videoBaiduChecks"
    >
      <p style="color:#777">注：以下名称一次最多选择3个</p>
      <el-checkbox-group v-model="form.videoBaiduChecks" :max="3">
        <el-checkbox
          v-for="item in videoBaiduList"
          :key="item.id"
          :label="item.accountName"
          :checked="item.check"
          :disabled="item.disabled"
        />
      </el-checkbox-group>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleClickSearch">查询</el-button>
      <el-button @click="handleClickReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
const _ = require('lodash')
// import DamedKeyworldInput from './DamendKeyworldInput'
import { paltformTypeList, paltformVideoList, paltformNewsList, zxwzList } from './constants'
import { getTradeList, getDomainList } from '@/api/tearchCenter/index'
import { casePlatformAccountList, casePlatformList } from '@/api/product/case'
import { demandKeyword } from '@/api/product/demand'

export default {
  components: {
    // DamedKeyworldInput
  },
  data() {
    return {
      form: {
        damedkeyword: '',
        industry: '',
        domain: '',
        platformType: 'news',
        platfromValue: 'zxwz',
        platfromVideoValue: 'douyin',
        newsChecks: [],
        weixinChecks: [],
        videoDouyinChecks: [],
        videoXiaohongshuChecks: [],
        videoKuaishouChecks: [],
        videoBilibiliChecks: [],
        videoBaiduChecks: []
      },
      industryList: [],
      domainList: [],
      paltformTypeList,
      paltformVideoList,
      paltformNewsList,
      newsZixunList: zxwzList,
      newsWeixinList: [],
      videoDouyinList: [],
      videoXiaohongshuList: [],
      videoKuaishouList: [],
      videoBilibiliList: [],
      videoBaiduList: [],
      activeAccountCode: '',
      newsItem: {},
      videoItem: {}
    }
  },
  created() {
    this.initTradeList()
    this.initDomainList()
    this.getPlatformAccountList()

    this.getZixunAccountList()
    this.getAllVideoList()
    this.otherPageSearch()
    this.getCasePlatformlist()
  },
  methods: {
    otherPageSearch() {
      const query = this.$route.query
      if (Object.keys(query).length > 1) {
        const { fieldName, industryName, keyword } = this.$route.query
        this.form.damedkeyword = keyword
        this.form.industry = industryName
        this.form.domain = fieldName
      }
    },
    async getCasePlatformlist() {
      const { data } = await casePlatformList()
      this.paltformTypeList = _.sortBy(_.filter(data, { level: 1 }), ['sort'])
      this.newsItem = _.find(this.paltformTypeList, { catalogCode: 'news' })
      this.videoItem = _.find(this.paltformTypeList, { catalogCode: 'video' })
      this.paltformNewsList = _.sortBy(_.filter(data, { level: 2, parentId: this.newsItem.id }), ['sort'])
      this.paltformVideoList = _.sortBy(_.filter(data, { level: 2, parentId: this.videoItem.id }), ['sort'])
      console.log(this.newsItem, this.videoItem)
      this.activeAccountCode = this.paltformNewsList[0].catalogCode
    },
    // 话题关键字查询
    async querySearchDamedKeyword(key, cb) {
      const { data } = await demandKeyword({ keyword: this.form.damedkeyword })
      cb(data)
    },
    async initTradeList() {
      const { code, data } = await getTradeList()
      if (code) {
        data.forEach(item => {
          if (!item.children.length) {
            item.children = undefined
          }
        })
        this.industryList = data
      }
    },
    async initDomainList() {
      const { code, data } = await getDomainList()
      if (code) {
        this.domainList = data
      }
    },
    handleClickSearch() {
      const { platformType, damedkeyword, domain, industry, newsChecks, weixinChecks } = this.form
      if (platformType === 'news') {
        // 跨平台名称选择判断
        // if (platfromValue.length < 1) {
        //   this.$message.error('请选择平台名称')
        //   return false
        // }
        if ([...newsChecks, ...weixinChecks].length < 1) {
          this.$message.error('请选择资讯网站/账号名称')
          return false
        }
      }
      // if (platformType === 'video' && platfromVideoValue.length < 1) {
      //   this.$message.error('请选择平台名称')
      //   return false
      // }
      if (damedkeyword.length < 1 && domain.length < 1 && industry.length < 1) {
        this.$message.error('请输入话题关键字或行业和领域')
        return false
      }
      this.$emit('search', this.form)
    },
    handleClickReset() {
      this.$refs.form.resetFields()
      this.activeAccountCode = 'zxwz'
    },
    handleChnagePlatformType(val) {
      this.activeAccountCode = val === 'video' ? 'douyin' : 'zxwz'
      this.$refs.newsChecks.resetField()
      this.$refs.weixinChecks.resetField()
      this.$refs.videoDouyinChecks.resetField()
      this.$refs.videoXiaohongshuChecks.resetField()
      this.$refs.videoKuaishouChecks.resetField()
      this.$refs.videoBilibiliChecks.resetField()
      this.$refs.videoBaiduChecks.resetField()
      this.$refs.platfromValue.resetField()
      this.$refs.platfromVideoValue.resetField()
    },
    getAllVideoList() {
      this.getWeixinAccountList()
      this.getDouyinAccountList()
      this.getXiaohongshuAccountList()
      this.getBilibiliAccountList()
      this.getKuaishouAccountList()
      this.getBaiduAccountList()
    },
    async getPlatformAccountList(pName, pCode, ptName, ptCode) {
      const { code, data } = await casePlatformAccountList({
        platformName: ptName,
        platformCode: ptCode,
        platformTypeName: pName,
        platformTypeCode: pCode
      })
      if (code) {
        const list = _.sortBy(data, ['sort'])
        return list || []
      }
    },

    async getZixunAccountList() {
      this.newsZixunList = await this.getPlatformAccountList('资讯类', 'news', ' 资讯网站', 'zxwz')
    },
    async getWeixinAccountList() {
      this.newsWeixinList = await this.getPlatformAccountList('资讯类', 'news', '微信公众号', 'wxgzh')
    },
    async getDouyinAccountList() {
      const list = await this.getPlatformAccountList('视频', 'video', '抖音', 'douyin')
      this.videoDouyinList = list.length ? list : []
    },
    async getXiaohongshuAccountList() {
      const list = await this.getPlatformAccountList('视频', 'video', '小红书', 'xiaohongshu')
      this.videoXiaohongshuList = list.length ? list : []
    },
    async getKuaishouAccountList() {
      const list = await this.getPlatformAccountList('视频', 'video', '快手', 'kuaishou')
      this.videoKuaishouList = list.length ? list : []
    },
    async getBilibiliAccountList() {
      const list = await this.getPlatformAccountList('视频', 'video', 'B站', 'bilibili')
      this.videoBilibiliList = list.length ? list : []
    },
    async getBaiduAccountList() {
      const list = await this.getPlatformAccountList('视频', 'video', '百度视频', 'bdsp')
      this.videoBaiduList = list.length ? list : []
    }
  }
}
</script>
<style lang="scss" scoped>
.check-item ::v-deep .el-radio-button.is-active .el-radio-button__inner {
  margin-right: 16px;
  background: #e7f0ff;
  border-radius: 4px;
  border: 1px solid #3c8bff;
  color: #0c6fff;
  padding: 8px 20px;
  box-shadow: none;;
}
.check-item ::v-deep .el-radio-button__inner {
  margin-right: 16px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  color: #161616;
  padding: 8px 20px;
  &:hover {
    color: #0c6fff;
  }
}

</style>
