<template>
  <!-- 新增规则弹框 -->
  <AppDialog
    v-model="visibleFlag"
    title="修改投放账号信息"
    width="600px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <div v-loading="loading" class="addDialog overflowOuto">
      <el-form ref="form" class="m-t-16" :model="form" label-width="auto" size="small" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="投放账号:">
              <p>{{ form.advertiserId }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="渠道:">
              <p v-if="form.advertiseChannel === 1">千川</p>
              <p v-else-if="form.advertiseChannel === 2">腾讯</p>
              <p v-else-if="form.advertiseChannel === 3">枫页小店</p>
              <p v-else-if="form.advertiseChannel === 4">百度小店</p>
              <p v-else-if="form.advertiseChannel === 7">巨量Ad广告</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="投放人员:" prop="advertiserPutterUid">
              <div v-if="form.advertiserPutterUid && form.advertiserPutterName !== ''">
                <el-tag
                  closable
                  @close="delAssessUsers"
                >{{ form.advertiserPutterName }}</el-tag>
              </div>
              <el-select v-else v-model="form.advertiserPutterUid" filterable placeholder="请选择" @change="chooseUserId">
                <el-option
                  v-for="item in userArray"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号类型:">
              <el-select v-model="form.advertiseFlag" filterable placeholder="请选择">
                <el-option
                  v-for="item in advertiseFlagArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="tips">
        <i class="el-icon-warning tipsIcon" />
        <div class="tipsContent">
          <div class="tipsTitle">说明</div>
          <div class="tipsMsg">1、如需变更投放账号的归属人，对于已存在归属人的请先删除原有管理人，再重新选择归属人员。</div>
          <div class="tipsMsg">2、变更归属人，或变更账号类型后，当月的数据将会以变更后的重新统计，请核查变更操作是否正确。</div>
          <div class="tipsMsg">3、变更归属人，或变更账号类型后，之后产生的订单，将会以变更后的归属人进行统计，将会以变更后的账号类型达标标准进行统计</div>
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { userNoPage } from '@/api/addressBookApi'
import { employeeAdvertise } from '@/api/business/financial'
export default {
  components: {
    AppDialog
  },
  props: {
    objectRow: {
      type: Object,
      default: () => {
        return {

        }
      }
    }
  },
  data() {
    return {
      userArray: [],
      loading: false,
      visibleFlag: false,
      form: {
        id: '',
        advertiseChannel: '',
        advertiseFlag: '',
        advertiserId: '',
        advertiserPutterUid: '',
        advertiserPutterName: ''
      },
      advertiseFlagArray: [
        { label: '自投', value: 0 },
        { label: '代投', value: 1 }
      ],
      rules: {
        advertiserPutterUid: [
          { required: true, message: '请选择投放人员', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {

  },
  mounted() {
    this.loadUserNoPage()
  },
  methods: {
    delAssessUsers() {
      this.form.advertiserPutterUid = ''
      this.form.advertiserPutterName = ''
    },
    chooseUserId() {
      this.userArray.some(item => {
        if (item.userId === this.form.advertiserPutterUid) {
          this.form.advertiserPutterName = item.nickName
        }
      })
      this.$refs.form.clearValidate()
    },
    loadUserNoPage() {
      const params = {
        deptId: '',
        nickName: ''
      }
      userNoPage(params)
        .then((res) => {
          this.userArray = res.data
        })
        .catch(() => {
        })
    },
    // 限制输入英文数字和汉字
    delNoNumber2(e) {
      this.form.expertName // = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    // 限制输入英文和数字
    delNoNumber1(e) {
      this.form.expertId = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    loadData(row) {
      this.form.id = row.id
      this.form.advertiserPutterName = row.advertiserPutterName
      this.form.advertiseChannel = row.advertiseChannel
      this.form.advertiserId = row.advertiserId
      this.form.advertiseFlag = row.advertiseFlag
      this.form.advertiserPutterUid = (row.advertiserPutterUid === 0 || row.advertiserPutterUid === '0') ? '' : row.advertiserPutterUid
    },
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            ...this.form
          }
          delete params.advertiserPutterName
          this.loading = true
          employeeAdvertise(params).then(res => {
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.loading = false
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

  <style lang='scss' scoped>
  .addDialog {
      height: 450px;
      padding: 20px;
      .tips {
          width: 100%;
          padding: 20px;
          background: #FFF2E6;
          border-radius: 8px;
          display: flex;
          .tipsIcon {
              width: 24px;
              color: #FF7D00;
              font-size: 24px;
          }
          .tipsContent {
              flex: 1;
              padding-left: 8px;
              .tipsTitle {
                  font-size: 16px;
                  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                  font-weight: bold;
                  color: #FF7D00;
                  line-height: 24px;
              }
              .tipsMsg {
                  margin-top: 8px;
                  font-size: 14px;
                  font-family: MicrosoftYaHei;
                  color: #FF7D00;
                  line-height: 22px;
              }
          }
      }
  }
  .m-l-32 {
      margin-left: 32px;
  }
  .assessBox {
    width: 363px;
    box-sizing: border-box;
    padding: 18px 16px 2px;
    height: auto;
    background: #ffffff;
    border-radius: 6px;
    border: 1px dashed #979797;
  }
  .remindPersonListView {
    cursor: pointer;
  }
  </style>

