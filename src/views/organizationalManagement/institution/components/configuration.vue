<template>
  <div class="config-box">
    <div class="config-title-wrap">
      <div
        class="config-title"
        :class="{ 'config-title-active': currentType === 'teacherSharing' }"
        @click="currentType = 'teacherSharing'"
      >
        师资共享
      </div>
      <div
        class="config-title"
        :class="{ 'config-title-active': currentType === 'smsSignature' }"
        @click="currentType = 'smsSignature'"
      >
        短信签名
      </div>
      <div
        class="config-title"
        :class="{ 'config-title-active': currentType === 'discountConfig' }"
        @click="currentType = 'discountConfig'"
      >
        折扣配置
      </div>
    </div>

    <template v-if="currentType === 'teacherSharing'">
      <div class="config-content">
        <div class="config-item">
          <div class="config-item-title">已共享给的企业</div>
          <div class="config-item-content">
            <div class="flex flex-wrap config-item-content-item">
              <div
                v-for="(item, index) in list2"
                :key="index"
                class="config-item-content-item-title"
              >
                {{ item.name }}
                <i
                  class="el-icon-close"
                  color="#0C6FFF"
                  size="16"
                  @click="deleteOrg(item.organizationId, 2)"
                />
              </div>
              <el-button
                type="primary"
                size="mini"
                class="btn"
                @click="handleAdd(2)"
                >新增</el-button
              >
            </div>
          </div>
        </div>
        <div class="config-item">
          <div class="config-item-title">可查看的企业</div>
          <div class="config-item-content">
            <div class="flex flex-wrap config-item-content-item">
              <div
                v-for="(item, index) in list1"
                :key="index"
                class="config-item-content-item-title"
              >
                {{ item.name }}
                <i
                  class="el-icon-close"
                  color="#0C6FFF"
                  size="16"
                  @click="deleteOrg(item.organizationId, 1)"
                />
              </div>
              <el-button
                class="btn"
                type="primary"
                size="mini"
                @click="handleAdd(1)"
                >新增</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="currentType === 'smsSignature'">
      <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
        <el-form-item
          prop="signatureName"
          label-width="10px"
          style="margin-bottom: 10px"
        >
          <div style="height: 30px; margin: 10px 0">
            <span style="color: #ff1f00">*</span>
            <span style="font-size: 14px; color: #000000; font-weight: 600"
              >短信签名</span
            >
          </div>
          <el-input
            v-model="formData.signatureName"
            placeholder="请输入"
            show-word-limit
            maxlength="15"
          />
        </el-form-item>

        <el-form-item
          class="use-type-checkbox"
          prop="scene"
          label-width="10px"
          style="margin-bottom: 10px"
          required
        >
          <div style="height: 30px">
            <span style="color: #ff1f00">*</span>
            <span style="font-size: 14px; color: #000000; font-weight: 600"
              >用途</span
            >
          </div>
          <el-checkbox v-model="formData.scene">智能销售</el-checkbox>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        size="small"
        style="margin-left: 10px"
        @click="handleSubmit"
        >新增</el-button
      >
      <div class="smsSignature-list">
        <div
          v-for="(item, index) in smsSignatureList"
          :key="index"
          class="smsSignature-list-item"
          style="position: relative"
        >
          <span class="signature-text">{{ item.signatureName }}</span>
          <img
            class="sort-wrap-content-item-close"
            src="@/assets/image/close2.png"
            style="width: 16px; height: 16px; cursor: pointer"
            @click="deleteSmsSignature(item.id)"
          />
        </div>
      </div>
    </template>
    <template v-if="currentType === 'discountConfig'">
      <DiscountConfig :tenant-id="info.organizationId" />
    </template>

    <AppDialog
      v-model="visible"
      :btn-footer="false"
      title="新增"
      width="400px"
      height="auto"
    >
      <div v-if="visible" class="config-box">
        <el-select
          v-model="organizationId"
          clearable
          placeholder="请选择"
          filterable
          @change="handlChange"
        >
          <el-option
            v-for="item in option"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="handleDisabled(item.value)"
          />
        </el-select>
      </div>
    </AppDialog>
  </div>
</template>
<script>
import AppDialog from '@/components/AppDialog'
import DiscountConfig from './discountConfig'
import {
  getSharingSettingOrgByType,
  addSharingSettingOrgByType,
  getAllOrgans,
  delSharingSettingOrgByType
} from '@/api/tearchCenter'
import {
  getSmsSignature,
  addSmsSignature,
  deleteSmsSignature
} from '@/api/smsSignature'
export default {
  components: {
    AppDialog,
    DiscountConfig
  },
  props: {
    info: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      visible: false,
      option: [],
      list1: [],
      list2: [],
      organizationId: undefined,
      sharingSettingType: '',
      currentType: 'teacherSharing',
      smsSignatureList: [],
      formData: {
        signatureName: '',
        scene: 0,
        tenantId: this.info.organizationId
      },
      rules: {
        signatureName: [
          { required: true, message: '请输入短信签名', trigger: 'blur' }
        ],
        scene: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请选择用途'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      Promise.all([
        this.getSharingSettingOrgList(1),
        this.getSharingSettingOrgList(2)
      ]).then(([res1, res2]) => {
        this.list1 = res1.data
        this.list2 = res2.data
      })
      this.getAllOrgansList()
      this.getSmsSignature()
    },
    async handlChange(e) {
      await addSharingSettingOrgByType({
        operateOrganizationId: this.info.organizationId,
        organizationId: e,
        sharingSettingType: this.sharingSettingType
      })
      this.visible = false
      this.$message.success('添加成功')
      this.getSharingSettingOrgList(this.sharingSettingType).then(res => {
        this[`list${this.sharingSettingType}`] = res.data
      })
    },
    handleAdd(sharingSettingType) {
      this.sharingSettingType = sharingSettingType
      this.visible = true
      this.organizationId = undefined
    },
    async getSharingSettingOrgList(sharingSettingType) {
      return await getSharingSettingOrgByType({
        organizationId: this.info.organizationId,
        sharingSettingType
      })
    },
    async getAllOrgansList() {
      const { data } = await getAllOrgans()
      this.option = data.map(item => {
        return {
          label: item.name,
          value: item.organizationId
        }
      })
    },
    async deleteOrg(organizationId, type) {
      // 二次确认
      await this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await delSharingSettingOrgByType({
        organizationId,
        sharingSettingType: type,
        operateOrganizationId: this.info.organizationId
      })
      this.$message.success('删除成功')
      this.getSharingSettingOrgList(type).then(res => {
        this[`list${type}`] = res.data
      })
    },
    handleDisabled(id) {
      return (
        !!this[`list${this.sharingSettingType}`].find(
          item => item.organizationId === id
        ) || id === this.info.organizationId
      )
    },
    async getSmsSignature() {
      const { data } = await getSmsSignature({
        tenantId: this.info.organizationId
      })
      this.smsSignatureList = data.map(item => ({
        ...item,
        signatureName: `${item.signatureName}-智能销售/${item.createUserName}`
      }))
    },
    async deleteSmsSignature(id) {
      const res = await this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
      if (res === 'confirm') {
        const { code } = await deleteSmsSignature(id)
        if (code === 1) {
          this.$message.success('删除成功')
          this.getSmsSignature()
        }
      }
    },
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const signatureItem = {
            signatureName: this.formData.signatureName,
            scene: this.formData.scene ? 1 : 0,
            tenantId: this.info.organizationId
          }

          const { code } = await addSmsSignature(signatureItem)
          if (code === 1) {
            this.$message.success('添加成功')
            this.getSmsSignature()
            this.formData.signatureName = ''
            this.formData.scene = ''
            this.$refs.form.resetFields()
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.use-type-checkbox ::v-deep {
  .el-form-item__error {
    top: 85%;
  }
}

.config-box {
  padding: 20px;
}
.config-title-wrap {
  display: flex;
  align-items: center;
  gap: 5px;
}
.config-title {
  border-radius: 5px;
  background: #f7f7f7;
  color: #000000;
  text-align: center;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  width: 120px;
  line-height: 34px;
  cursor: pointer;
}

.smsSignature-list {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  border-radius: 8px;
  border: 1px solid #dcdee1;
  padding: 15px;

  .smsSignature-list-item {
    border-radius: 4px;
    border: 1px solid #dcdee1;
    background: #f7f7f7;
    color: #000000;
    font-size: 14px;
    line-height: 28px;
    padding: 5px 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 7px;

    .signature-text {
      display: inline-block;
      vertical-align: middle;
    }
  }
}

.config-title-active {
  background: linear-gradient(90deg, #cee2ff 0%, #bcc9ff 100%);
}
.config-item-title {
  color: #000000;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 60px;
}
.config-item-content {
  border-radius: 5px;
  background: #f6f6f6;
  padding: 16px;
  height: 144px;
  overflow-y: auto;
}
.config-item-content-item-title {
  border-radius: 4px;
  border: 1px solid #dae9ff;
  background: #e7f0ff;
  color: #0c6fff;
  font-family: 'Microsoft YaHei';
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  margin-right: 8px;
  margin-bottom: 8px;
  padding: 0 8px;
}
.btn {
  height: 28px;
}
</style>
