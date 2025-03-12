<template>
  <div class="detail-page">
    <div class="title">基本信息</div>
    <div class="flex">
      <div class="flex-box flex">
        <div class="text-l">入驻类型：</div>
        <div class="text-r">{{ info.typeName }}</div>
      </div>
      <div class="flex-box flex">
        <div class="text-l">机构标识：</div>
        <div class="text-r">{{ abbreviation }}</div>
      </div>
    </div>
    <div class="flex">
      <div class="flex-box flex">
        <div class="text-l">{{ info.type ===1 ? '机构全称' :'团队全称' }}：</div>
        <div class="text-r">{{ companyName }}</div>
      </div>
      <div class="flex-box flex">
        <div class="text-l">{{ info.type ===1 ? '机构简称' :'团队简称' }}：</div>
        <div class="text-r">{{ info.companyAbbreviation }}</div>
      </div>
    </div>
    <div class="flex">
      <div class="flex-box flex">
        <div class="text-l">入驻模块：</div>
        <div class="text-r">{{ info.packageName }}</div>
      </div>
    </div>
    <div class="flex">
      <div class="flex-box flex">
        <div class="text-l">{{ info.status || info.organizationId ? '管理员姓名：' : '姓名：' }}</div>
        <div class="text-r">{{ administratorName }}</div>
      </div>
      <div class="flex-box flex">
        <div class="text-l">{{ info.status || info.organizationId ? '管理员手机号：' : '手机号：' }}</div>
        <div class="text-r"><Phone :default-value="JSON.stringify(phone)" /></div>
      </div>
    </div>
    <div class="flex">
      <div class="flex-box flex">
        <div class="text-l">LOGO：</div>
        <div class="text-r">
          <el-image
            v-if="info.bigLogo"
            style="width: 80px; height: 60px"
            :src="info.bigLogo"
            fit="contain"
            :preview-src-list="[info.bigLogo]"
          />
          <el-image
            v-if="info.smallLogo"
            style="width: 80px; height: 60px"
            :src="info.smallLogo"
            fit="contain"
            :preview-src-list="[info.smallLogo]"
          />
        </div>
      </div>
    </div>
    <template v-if="info.type ===1">
      <div class="flex">
        <div class="flex-box flex">
          <div class="text-l">营业执照：</div>
          <div class="text-r"><el-image
            v-if="info.businessLicense"
            style="width: 80px; height: 60px"
            :src="info.businessLicense"
            fit="contain"
            :preview-src-list="[info.businessLicense]"
          /></div>
        </div>
      </div>
      <div class="flex">
        <div class="flex-box flex">
          <div class="text-l">企业代码：</div>
          <div class="text-r">{{ info.enterpriseCode }}</div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import Phone from '@/components/watchPhoneNumber/index.vue'
export default {
  components: {
    Phone
  },
  props: {
    info: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
    abbreviation() {
      return this.info.companyEnglishAbbreviation || this.info.abbreviation
    },
    companyName() {
      return this.info.companyName || this.info.name
    },
    administratorName() {
      return this.info.administratorName || this.info.name
    },
    phone() {
      return this.info.administratorPhone || this.info.phone
    }
  }

}
</script>
  <style lang="scss" scoped>
  .title {
    line-height: 28px;
    position: relative;
    padding-left: 24px;
    font-weight: 600;
    font-size: 14px;
    color: #333333;
    margin: 10px 0;
  }

  .title1 {
    font-weight: normal;
  }

  .text-l {
    font-size: 14px;
    color: #777777;
    line-height: 32px;
    text-align: right;
    flex: 0 0 120px;
  }

  .text-r {
    font-size: 14px;
    color: #333333;
    line-height: 32px;
    word-break: break-all;
    white-space: pre-wrap;
    text-align: left;
  }

  .flex-box {
    flex: 1 0 50%;
  }
  </style>
