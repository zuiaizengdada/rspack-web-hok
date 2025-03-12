<template>
  <AppDialog
    v-model="visible"
    title="新增"
    width="480px"
    :loading="loading"
    class="dialog-container"
    @success="sure"
  >
    <el-form
      ref="form"
      :rules="rules"
      size="small"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="渠道" prop="platformId">
        <el-select
          v-model="form.platformId"
          placeholder="请选择渠道"
          clearable
          @change="changePlatform"
        >
          <el-option
            v-for="item in channelOptions"
            :key="item.platformId"
            :label="item.platformName"
            :value="item.platformId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="投放账号" prop="adAccountId">
        <el-select
          v-model="form.adAccountId"
          placeholder="请选择投放账号"
          @change="changeAdAccount"
        >
          <el-option
            v-for="item in advertiserOptions"
            :key="item.advertiserId"
            :label="`${item.advertiserName}(${item.advertiserId})`"
            :value="item.advertiserId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="投放计划" prop="planType">
        <el-radio-group v-model="form.planType" @change="changePlanType">
          <el-radio label="1">全部计划</el-radio>
          <el-radio label="2">
            <span style="margin-right: 15px">特定计划</span>
            <el-select
              v-model="form.adPlanList"
              multiple
              placeholder="请选择投放计划"
            >
              <el-option
                v-for="item in planOptions"
                :key="item.planId"
                :label="`${item.planName}(${item.planId})`"
                :value="item.planId"
              />
            </el-select>
            <!-- <div>
              <el-tag v-for="tag in form.adPlanList" :key="tag.planId" closable>
                {{ tag.planName }}
              </el-tag>
            </div> -->
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="城市" prop="cityType" @change="changeCityType">
        <el-radio-group v-model="form.cityType">
          <el-radio label="1">全部城市</el-radio>
          <el-radio label="2">
            <span style="margin-right: 15px">特定城市</span>
            <el-cascader
              ref="cascader"
              v-model="form.citys"
              :show-all-levels="false"
              :options="options"
              filterable
              clearable
              popper-class="popper-select"
              :props="{ multiple: true }"
            />
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { areaCodeList } from '@/api/privateArea/CRM'
import {
  queryAdPlanList,
  queryAdvertiserList,
  queryChannelList,
  saleTaskInfoFlowConditionDoAdd
} from '@/api/privateArea/CRM'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      form: {
        adPlanList: [],
        citys: [],
        platformId: '',
        adAccountId: '',
        planType: '',
        cityType: '',
        taskId: undefined
      },
      key: 1,
      options: [],
      visible: false,
      loading: false,
      planOptions: [],
      advertiserOptions: [],
      channelOptions: [],
      rules: {
        platformId: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
        adAccountId: [
          { required: true, message: '请选择投放账号', trigger: 'change' }
        ],
        planType: [
          { required: true, message: '请选择投放计划类型', trigger: 'change' }
        ],
        cityType: [
          { required: true, message: '请选择城市类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.queryChannelList()
    this.getAreaList()
  },
  methods: {
    sure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.add()
        }
      })
    },
    handleClickSelect(node, data) {
      if (node.isLeaf) {
        console.log(this.form.citys, data.value)
        if (!this.form.citys.includes(data.value)) {
          this.form.citys.push(data.value)
          this.$refs.cascader.getCheckedNodes()
        } else {
          this.form.citys = this.form.citys.filter(i => i !== data.value)
        }
      }
    },
    changePlanType() {
      if (this.form.planType === '1') {
        this.form.adPlanList = []
      }
    },
    changeCityType() {
      if (this.form.cityType === '1') {
        this.form.citys = []
      }
    },
    async add() {
      if (this.form.planType === '2' && !this.form.adPlanList.length) {
        this.$message.error('请至少选择一个投放计划')
        return
      }
      if (this.form.cityType === '2' && !this.form.citys.length) {
        this.$message.error('请至少选择一个城市')
        return
      }
      const adPlanList = []
      this.form.adPlanList.forEach(i => {
        this.planOptions.forEach(j => {
          if (i === j.planId) {
            adPlanList.push({
              adPlan: j.planName,
              id: i
            })
          }
        })
      })
      const citys = this.form.citys.map(i => {
        return {
          city: i[i.length - 1]
        }
      })
      let adChannel, adAccount
      this.channelOptions.forEach(i => {
        if (this.form.platformId === i.platformId) {
          adChannel = i.platformName
        }
      })
      this.advertiserOptions.forEach(i => {
        if (this.form.adAccountId === i.advertiserId) {
          adAccount = i.advertiserName
        }
      })
      const { data } = await saleTaskInfoFlowConditionDoAdd({
        adAccountId: this.form.adAccountId,
        adChannel,
        adAccount,
        adChannelId: this.form.platformId,
        cityType: this.form.cityType,
        planType: this.form.planType,
        adPlanList,
        citys,
        taskId: this.form.taskId || undefined
      })
      this.visible = false
      this.$emit('success', data)
    },
    changePlatform() {
      this.queryAdPlanList()
      this.queryAdvertiserList()
      this.form.adAccountId = ''
      this.form.adPlanList = []
    },
    getAreaList() {
      const params = [
        areaCodeList({
          level: 0
        }),
        areaCodeList({
          level: 1
        })
      ]
      Promise.all(params)
        .then(res => {
          const options = res[1].data
          this.options = res[0].data.map(i => {
            return {
              value: i.shortName,
              label: i.shortName,
              id: i.areaCode,
              children: []
            }
          })
          this.options.forEach(i => {
            options.forEach(j => {
              if (i.id === j.parentCode) {
                i.children.push({
                  value: j.shortName,
                  label: j.shortName,
                  id: j.areaCode,
                  children: null
                })
              }
            })
          })
        })
        .catch(() => {
          this.options = []
        })
    },
    changeAdAccount() {
      this.queryAdPlanList()
      this.form.adPlanList = []
    },
    reset() {
      this.form = {
        adPlanList: [],
        citys: [],
        platformId: '',
        adAccountId: '',
        planType: '',
        cityType: '',
        taskId: undefined
      }
      this.advertiserOptions = []
      this.planOptions = []
      this.queryAdPlanList()
      this.queryAdvertiserList()
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    async queryAdPlanList() {
      if (!this.form.platformId || !this.form.adAccountId) return
      const { data } = await queryAdPlanList({
        platformId: this.form.platformId,
        advertiserId: this.form.adAccountId
      })
      this.planOptions = data
    },
    async queryAdvertiserList() {
      if (!this.form.platformId) return
      const { data } = await queryAdvertiserList({
        platformId: this.form.platformId
      })
      this.advertiserOptions = data
    },
    async queryChannelList() {
      const { data } = await queryChannelList()
      this.channelOptions = data
    },
    open(data) {
      this.reset()
      this.visible = true
      this.form.taskId = data ?? undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container ::v-deep {
  .dialog-body-content {
    padding: 20px;
    height: 500px !important;
    overflow: auto;
  }
  .el-radio,
  .el-radio__label {
    display: flex;
    align-items: center;
  }
  .el-radio {
    margin-bottom: 10px;
  }
}
</style>
<style lang="scss">
.popper-select {
  li[aria-haspopup='true'] {
    .el-checkbox {
      display: none;
    }
  }
  .el-cascader-panel .el-checkbox {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
  }
  .el-cascader-node__label {
    margin-left: 10px;
  }
}
</style>
