<template>
  <div>
    <template v-if="info.isSender && info.status === 2">
      <el-button size="small" type="primary" @click="dialogChange('Shtg')">
        审核通过
      </el-button>
      <el-button size="small" type="danger" @click="dialogChange('Shbh')">
        审核驳回
      </el-button>
    </template>
    <AppDialog
      v-model="modal.visible"
      :title="modal.title"
      width="550px"
      height="auto"
    >
      <div v-loading="modal.loading" class="dialog-content">
        <div>
          <div
            v-if="info.remark && ['Jszzxy', 'Bhzzxy'].includes(modal.type)"
            class="cell"
          >
            <div class="cell-label remark">终止原因：</div>
            <div class="cell-cnt remark">
              {{ info.remark }}
            </div>
          </div>
          <div class="cell">
            <div class="cell-label">协议名称：</div>
            <div class="cell-cnt">
              {{ info.agreementName }}
            </div>
          </div>
          <div class="cell">
            <div class="cell-label">发送对象：</div>
            <div class="cell-cnt">
              {{
                orgInfo.organizationId === info.supplierOrgId
                  ? info.cpOrgName
                  : info.supplierOrgName
              }}
            </div>
          </div>
          <div class="cell">
            <div class="cell-label">合作范围：</div>
            <div class="cell-cnt">
              <template v-if="info.agreementCoopScopeList.length">
                <div
                  v-for="(item, index) in info.agreementCoopScopeList"
                  :key="index"
                  class="cell-cnt-item"
                >
                  {{ item | scopeNameJoin }}
                </div>
              </template>
              <template v-else>--</template>
            </div>
          </div>
          <div class="cell">
            <div class="cell-label">合作日期：</div>
            <div class="cell-cnt">{{ info.startDate }}~{{ info.endDate }}</div>
          </div>
        </div>
        <div v-if="modal.desc" class="desc">{{ modal.desc }}</div>
        <div v-if="['Shbh', 'Bhxy', 'Zzxy', 'Bhzzxy'].includes(modal.type)">
          <el-form
            ref="remarkFormRef"
            :model="ruleForm"
            :rules="rules"
            label-width="80px"
          >
            <el-form-item
              :label="
                ['Shbh', 'Bhxy'].includes(modal.type) ? '驳回原因' : '终止原因'
              "
              prop="remark"
            >
              <el-input
                v-model="ruleForm.remark"
                type="textarea"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template slot="footer">
        <div class="footer-btn">
          <el-button size="small" @click="dialogChange(false)">取消</el-button>
          <el-button
            size="small"
            :type="
              ['Shbh', 'Bhxy', 'Zzxy', 'Jszzxy', 'Bhzzxy'].includes(modal.type)
                ? 'danger'
                : 'primary'
            "
            @click="sure(modal.type)"
          >
            {{ modal.btnName }}
          </el-button>
        </div>
      </template>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { statusTransforBtn } from '../../../coOpProtocol/data.js'

import {
  agreementNotApprovedApi, // 审核不通过 审核驳回
  agreementApprovedApi // 审核通过
} from '@/api/coOpProtocol'
import { getItem } from '@/utils/localStorage'

export default {
  components: {
    AppDialog
  },
  filters: {
    scopeNameJoin(item) {
      let txt = `${item.coopScopeName}【合作内容：${item.coopContentName}；合作范围：`
      const keys = { coop_content: 'IP', coop_intelligent: '达人' }
      if (item.isAll) {
        txt += `所有${keys[item.coopScope]}`
      } else if (item.specifyContent.length) {
        const specifyContent = JSON.parse(item.specifyContent)
        txt += `${specifyContent
          .map(item => {
            const arr = item.split('-')
            arr.shift()
            return arr.join('-') || '--'
          })
          .join('、')}`
      }
      return txt + `】`
    }
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      orgInfo: getItem('orgInfo'),
      permsList: this.$route.meta.permsList || [],
      modal: {
        visible: false,
        title: '新增',
        loading: false,
        btnName: '确定',
        desc: '',
        type: ''
      },
      ruleForm: { remark: '' },
      rules: {
        remark: { required: true, message: '请填写原因', trigger: 'blur' }
      }
    }
  },
  methods: {
    dialogChange(type) {
      if (type) {
        this.modal = {
          visible: true,
          loading: false,
          desc: false,
          type,
          ...statusTransforBtn[type]
        }
      } else {
        this.modal = {
          visible: false,
          title: '新增',
          loading: false,
          btnName: '确定',
          desc: '',
          type: ''
        }
      }
    },
    sure(type) {
      this[`btn${type}`]()
    },
    // 审核通过
    async btnShtg() {
      this.modal.loading = true
      try {
        const { success } = await agreementApprovedApi({ id: this.info.id })
        if (success) {
          this.$message.success('审核通过')
          this.dialogChange(false)
          this.$router.go(-1)
        }
      } catch (error) {
        this.modal.loading = false
      }
      this.modal.loading = false
    },
    // 审核驳回
    async btnShbh() {
      this.$refs['remarkFormRef'].validate(async valid => {
        if (!valid) return
        this.modal.loading = true
        try {
          const { success } = await agreementNotApprovedApi({
            id: this.info.id,
            ...this.ruleForm
          })
          if (success) {
            this.$message.success('已驳回')
            this.dialogChange(false)
            this.$router.go(-1)
          }
        } catch (error) {
          this.modal.loading = false
        }
        this.modal.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  padding: 20px;
  min-height: 200px;
  max-height: 600px;
  overflow-y: auto;
  .cell {
    display: flex;
    margin-bottom: 20px;
    .cell-label {
      width: 80px;
      color: #777777;
      font-size: 14px;
      font-weight: 400;
      text-align: right;
      flex-shrink: 0;
      &.remark {
        color: #ff8d1a;
      }
    }
    .cell-cnt {
      color: #333333;
      font-size: 14px;
      font-weight: 400;
      &.remark {
        color: #ff8d1a;
      }
    }
  }
  .desc {
    color: #333333;
    font-size: 14px;
    font-weight: 400;
    padding-left: 80px;
  }
}
.footer-btn {
  width: 100%;
  height: 56px;
  border-radius: 0 0 10px 10px;
  background: #ffffff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  border-top: 1px solid #f2f2f2;
}
</style>
