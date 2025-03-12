<template>
  <div class="page_wrap">
    <div class="videoDeliverySettings">师资共享设置</div>
    <el-form
      ref="form"
      :rules="rule"
      :model="form"
      label-width="140px"
      style="margin-top: 20px"
      disabled
    >
      <el-form-item label="已共享给的企业">
        <el-checkbox-group disabled>
          <el-checkbox v-for="org in list2" :key="org.organizationId" :label="org.organizationId">{{ org.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="可查看的企业">
        <el-radio-group disabled>
          <el-checkbox v-for="org in list1" :key="org.organizationId" :label="org.organizationId">{{ org.name }}</el-checkbox>
        </el-radio-group>
      </el-form-item>

      <!-- <el-form-item v-if="isBoSumInnerOrg" label="已共享机构">
        <el-checkbox-group v-model="innerOrgListIds" disabled>
          <el-checkbox v-for="org in innerOrgList" :key="org.organizationId" :label="org.organizationId">{{ org.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="!isBoSumInnerOrg" label="是否共享师资" prop="sharingTeacher">
        <el-radio-group v-model="form.sharingTeacher" :disabled="!ifEdit">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
        <div class="tips">共享后，将在师资共享跟进池和公海池出现。</div>
      </el-form-item>
      <el-form-item v-show="form.sharingTeacher" label="共享给如下机构" prop="tenants">
        <el-checkbox v-model="checkAll" :disabled="!ifEdit" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="form.tenants" :disabled="!ifEdit" @change="handleCheckedChange">
          <el-checkbox v-for="org in orgList" :key="org.organizationId" :label="org.organizationId">{{ org.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button v-if="ifEdit" :loading="loading" size="small" type="primary" @click="save">保存</el-button>
        <el-button v-else :loading="loading" size="small" type="primary" @click="onhandleEdit">编辑</el-button>
        <el-button v-if="ifEdit" :loading="loading" size="small" @click="cancel">取消</el-button>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import { getSharingSettingOrgByType } from '@/api/tearchCenter'
import { editSharingSetting, getSharingOrgans } from '@/api/tearchCenter/tearchSharing.js'
import axios from 'axios'
export default {
  components: {},
  data() {
    return {
      list1: [],
      list2: [],
      form: {
        sharingTeacher: true,
        tenants: []
      },
      defaultForm: {
        sharingTeacher: true,
        tenants: []
      },
      orgList: [],
      isIndeterminate: false,
      checkAll: false,
      ifEdit: false,
      loading: false,
      rule: {},
      isBoSumInnerOrg: false, // 博商内部机构
      innerOrgList: [], // 博商内部机构 已共享机构
      innerOrgListIds: [] // 博商内部机构 已共享机构
    }
  },
  mounted() {
    // this.getDetail()
    Promise.all([
      this.getSharingSettingOrgList(1),
      this.getSharingSettingOrgList(2)
    ]).then(([res1, res2]) => {
      this.list1 = res1.data
      this.list2 = res2.data
    })
  },
  methods: {
    async getSharingSettingOrgList(sharingSettingType) {
      return await getSharingSettingOrgByType({
        organizationId: JSON.parse(localStorage.getItem('orgInfo')).organizationId,
        sharingSettingType
      })
    },
    onhandleEdit() {
      this.ifEdit = true
    },
    save() {
      this.loading = true
      const data = {
        sharingTeacher: this.form.sharingTeacher,
        tenantIds: this.form.tenants
      }
      editSharingSetting(data).then(res => {
        this.ifEdit = false
        this.getDetail()
      }).catch(() => {
        this.loading = false
      })
    },
    cancel() {
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      this.ifEdit = false

      const checkedCount = this.form.tenants.length
      this.checkAll = checkedCount === this.orgList.length && checkedCount > 0
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.orgList.length
    },
    // 查询当前机构师资共享配置
    getDetail() {
      this.loading = true
      // getSharingSetting().then(res => {
      //   console.log(res, '查询当前机构师资共享配置')
      //   this.form.sharingTeacher = res.data.sharingTeacher
      //   this.form.tenants = res.data.tenantList.reduce((pre, next) => {
      //     pre.push(next.organizationId)
      //     return pre
      //   }, [])

      //   this.defaultForm = JSON.parse(JSON.stringify(this.form))
      //   const checkedCount = this.form.tenants.length
      //   console.log(checkedCount, 'checkedCount', this.orgList.length, this.form.tenants)
      //   this.checkAll = checkedCount === this.orgList.length && checkedCount > 0
      //   this.isIndeterminate = checkedCount > 0 && checkedCount < this.orgList.length
      //   this.loading = false
      // }).catch(() => {
      //   this.loading = false
      // })
      axios.all([
        // getSharingSetting(),
        getSharingOrgans()
      ]).then(results => {
        this.orgList = results[1].data
        const res = results[0]
        console.log(res, '查询当前机构师资共享配置')
        this.form.sharingTeacher = res.data.sharingTeacher
        this.isBoSumInnerOrg = res.data.isBoSumInnerOrg
        this.innerOrgList = res.data.innerOrgList
        if (this.innerOrgList.length) {
          this.innerOrgListIds = res.data.innerOrgList.reduce((pre, next) => {
            pre.push(next.organizationId)
            return pre
          }, [])
        }

        this.form.tenants = res.data.tenantList.reduce((pre, next) => {
          pre.push(next.organizationId)
          return pre
        }, [])

        this.defaultForm = JSON.parse(JSON.stringify(this.form))
        const checkedCount = this.form.tenants.length
        console.log(checkedCount, 'checkedCount', this.orgList.length, this.form.tenants)
        this.checkAll = checkedCount === this.orgList.length && checkedCount > 0
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.orgList.length
        this.loading = false

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleCheckedChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.orgList.length && checkedCount > 0
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.orgList.length
    },
    handleCheckAllChange(val) {
      // this.form.tenants = val ? orgList : []
      if (val) {
        this.form.tenants = this.orgList.reduce((pre, next) => {
          pre.push(next.organizationId)
          return pre
        }, [])
      } else {
        this.form.tenants = []
      }
      this.isIndeterminate = false
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  .videoDeliverySettings {
    height: 60px;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 60px;
    padding-bottom: 20px;
    margin: 0 20px;
    border-bottom: 1px solid #E7E7E7;
  }
  .tips {
    color: #666;
    font-size: 12px;
  }
}
</style>
