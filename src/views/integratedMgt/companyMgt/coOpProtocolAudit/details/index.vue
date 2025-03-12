<template>
  <div class="audit-cnt" :loading="loading">
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="gray">
        <span @click="goBack">合作协议审核</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>合作协议详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="audit-main">
      <div
        v-if="reqform.status && [2, 4].includes(reqform.status)"
        class="status-box flex flex-between"
        :style="{
          background: statusTansforIcon[reqform.status].bgColor
        }"
      >
        <div class="status-box-left">
          <div class="flex">
            <span class="shrink">协议状态：</span>
            <i
              :class="[
                'home-icon',
                'mr8',
                statusTansforIcon[reqform.status].icon
              ]"
            />
            <span :style="{ color: statusTansforIcon[reqform.status].color }">{{
              statusTansforIcon[reqform.status].text
            }}</span>
          </div>
          <div v-if="reqform.remark" class="flex">
            <span class="shrink">原因：</span>
            <p>{{ reqform.remark }}</p>
          </div>
        </div>
        <template v-if="reqform.status">
          <Operation :info="reqform" class="shrink" />
        </template>
      </div>
      <el-form
        ref="coOpProtocolAddRef"
        :model="reqform"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="协议名称" prop="agreementName">
          <span class="txt">{{ reqform.agreementName || '--' }}</span>
        </el-form-item>
        <el-form-item label="合作机构" prop="cpOrgId">
          <span class="txt">{{ reqform.cpOrgName || '--' }}</span>
        </el-form-item>
        <el-form-item
          label="合作范围"
          prop="supplierOrgId"
          style="width: 100%"
          class="supplier-item"
        >
          <OperationRange
            v-if="reqform.agreementCoopScopeList"
            :list="reqform.agreementCoopScopeList"
          />
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <span class="txt">{{ reqform.startDate }}</span>
        </el-form-item>
        <el-form-item label="到期日期" prop="endDate">
          <span class="txt">{{ reqform.endDate }}</span>
        </el-form-item>
        <el-form-item label="上传附件" prop="attachment">
          <template v-if="reqform.attachment.length">
            <div class="attachment flex">
              <img-show
                v-for="item in reqform.attachment"
                :key="item.fileUrl"
                :url="item.fileUrl"
              />
            </div>
          </template>
        </el-form-item>
      </el-form>
      <OperationTable />
    </div>
  </div>
</template>

<script>
import { agreementAcceptAddApi, agreementDetailApi } from '@/api/coOpProtocol'
import { cloneDeep } from 'lodash'
import ImgShow from '../../coOpProtocol/add/cpns/imgShow.vue'
import Operation from './cpns/operation.vue'
import OperationTable from './cpns/table.vue'
import OperationRange from '../../coOpProtocol/details/cpns/range.vue'

import { statusTansforIcon } from '../../coOpProtocol/data'
export default {
  name: 'CoOpProtocolAuditDetails',
  components: {
    ImgShow,
    Operation,
    OperationTable,
    OperationRange
  },
  data() {
    return {
      loading: false,
      reqform: {
        agreementName: '', // 协议名称
        cpOrgId: '', // 合作机构
        startDate: '', // 协议开始日期
        endDate: '', // 结束日期
        supplierOrgId: null, // 合作范围
        attachment: [] // 附件
      },
      rules: {
        agreementName: [
          { required: true, message: '请输入协议名称', trigger: 'blur' }
        ],
        cpOrgId: [
          { required: true, message: '请选择合作机构', trigger: 'blur' }
        ],
        startDate: [
          { required: true, message: '请选择协议开始日期', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请选择协议结束日期', trigger: 'blur' }
        ],
        supplierOrgId: [
          { required: true, message: '请选择合作范围', trigger: 'blur' }
        ],
        attachment: [{ required: true, message: '请上传附件', trigger: 'blur' }]
      },
      cpOrgList: [],
      statusTansforIcon,
      htId: null
    }
  },
  mounted() {
    if (this.$route.query) {
      this.htId = this.$route.query.id
      this.agreementDetail()
    }
  },
  methods: {
    // 查询详情内容
    async agreementDetail() {
      this.loading = true
      try {
        const { data } = await agreementDetailApi({ id: this.htId })
        this.reqform = data || {}
      } catch (error) {
        console.log('error-------agreementDetailApi', error)
      }
      this.loading = true
    },
    onSubmit() {
      this.$refs.coOpProtocolAddRef.validate(async flag => {
        if (!flag) return
        try {
          this.loading = true
          const req = cloneDeep(this.reqform)
          await agreementAcceptAddApi(req)
          this.loading = false
        } catch (error) {
          console.log('error----agreementAcceptAddApi', error)
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.red {
  color: #ff2020;
}
.shrink {
  flex-shrink: 0;
}
@import '~@/styles/variables.scss';
.audit-cnt {
  @include responsive-height(20px);
  min-width: 1100px;
  width: 100%;
  background: #fff;
  border-radius: 5px;
  .header-left {
    div {
      color: #000000;
      font-size: 14px;
      font-weight: 400;
      padding-right: 32px;
    }
  }
  .breadcrumb {
    height: 48px;
    border-bottom: 1px solid #dfe4ed;
    padding: 0 20px;
    ::v-deep .el-breadcrumb__inner {
      font-size: 15px;
      font-weight: 500;
      line-height: 48px;
      color: #000;
    }
    .gray {
      ::v-deep .el-breadcrumb__inner {
        color: #777777;
        cursor: pointer;
      }
    }
  }
  .audit-main {
  @include responsive-height(68px);
    overflow-y: auto;
    padding: 20px;
    .mr8 {
      margin-right: 8px;
    }
    .status-box {
      padding: 18px 20px;
      width: 100;
      height: auto;
      border-radius: 4px;
      background: #fff5ed;
      &-left {
        padding: 6px 0;
        > div {
          margin-bottom: 16px;
          &:last-child {
            margin-bottom: 0;
          }
        }
        span {
          color: #333333;
          font-size: 14px;
          font-weight: 400;
        }
        p {
          color: #777777;
          font-size: 14px;
          font-weight: 400;
        }
      }
    }
  }
}

.home-icon {
  display: inline-block;
  height: 20px;
  width: 20px;
  background-image: url('~@/assets/image/coOpProtocol/status_detail_sprites.png');
  background-size: 120px 90px;
  background-repeat: no-repeat;
  &.dzz {
    background-position: -5px -5px;
  }
  &.dqs {
    background-position: -35px -5px;
  }
  &.yqs {
    background-position: -5px -35px;
  }
  &.dsh {
    background-position: -35px -35px;
  }
  &.cg {
    background-position: -65px -5px;
  }
  &.shbh {
    background-position: -65px -35px;
  }
  &.shtg {
    background-position: -5px -65px;
  }
  &.yzz {
    background-position: -95px -5px;
  }
  &.ysx {
    background-position: -95px -35px;
  }
  &.yjj {
    background-position: -95px -65px;
  }
}
</style>
