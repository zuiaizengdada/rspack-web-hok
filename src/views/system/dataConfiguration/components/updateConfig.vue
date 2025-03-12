<template>
  <div class="update-config-cls">
    <div class="update-row-cls">
      <span class="roi-cls">ROI达标标准</span><el-button v-if="isUpdate" type="text" size="small" style="font-size: 14px;" @click="cancelUpdate"><i class="el-icon-edit-outline" style="font-size: 14px; margin-right: 5px;" />修改</el-button>
    </div>
    <el-form ref="updateConfigForm" :inline="true" :rules="rules" :model="updateConfigForm" label-width="80px" center class="demo-form-inline">
      <div class="new-cls-row">
        <div class="new-cls-rchild">
          <el-row class="row-cls">
            <el-col :span="12">
              <el-form-item label="自投" prop="videoRateVoSelfRate">
                <el-input v-if="!isUpdate" v-model="updateConfigForm.videoRateVoSelfRate" placeholder="请输入" />
                <p v-else>{{ loadDataObject.videoRateVoSelfRate }}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="代投" prop="videoRateVoProxyRate">
                <el-input v-if="!isUpdate" v-model="updateConfigForm.videoRateVoProxyRate" placeholder="请输入" />
                <p v-else>{{ loadDataObject.videoRateVoProxyRate }}</p>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-form-item class="button-cls-bottom">
        <el-button v-if="!isUpdate" type="primary" size="mini" class="btn-cls" @click="onSubmit('updateConfigForm')">确认</el-button>
        <el-button v-if="!isUpdate" size="mini" class="btn-cls" @click="cancelUpdate">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { setROIDetailNew, getROIDetailNew } from '@/api/system/dataConfiguration'
export default {
  name: 'UpdateConfig',
  components: {
  },
  data() {
    const judeForTest = (rule, value, callback) => {
      if (value === '') {
        callback('请输入数据！')
        return
      } else if (!this.isNumber(Number(value))) {
        callback('请输入正确的数据类型')
        return
      } else if (!this.isDecimal(value, 1)) {
        callback('只能保留1位小数')
        return
      } else if ((Number(value) > 9.9 || Number(value) < 0.1)) {
        callback('请输入0.1~9.9的数据范围')
        return
      }
      callback()
    }
    return {
      isUpdate: true,
      updateConfigForm: {
        videoRateVoSelfRate: '',
        videoRateVoProxyRate: ''
      },
      loadDataObject: {
        videoRateVoSelfRate: '',
        videoRateVoProxyRate: ''
      },
      params: {
        liveRateProxyReq: {
          advertiseFlag: 0,
          bizType: 2,
          reachRate: 0
        },
        liveRateSelfReq: {
          advertiseFlag: 1,
          bizType: 2,
          reachRate: 0
        },
        videoRateProxyReq: {
          advertiseFlag: 1,
          bizType: 1,
          reachRate: 0
        },
        videoRateSelfReq: {
          advertiseFlag: 0,
          bizType: 1,
          reachRate: 0
        }
      },
      rules: {
        videoRateVoSelfRate: [
          { required: true, validator: judeForTest, trigger: 'blur' }
        ],
        videoRateVoProxyRate: [
          { required: true, validator: judeForTest, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
  },
  created() {
    this.loadData()
  },
  mounted() {
  },
  activated() {

  },
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    isNumber(val) {
      return /^[0-9]+.?[0-9]*$/.test(val)
    },
    isDecimal(n, len) {
      return new RegExp('^\\d+(\\.\\d{1,' + len + '})?$').test(n)
    },
    loadData() {
      const params = {
        month: ''
      }
      getROIDetailNew(params).then(res => {
        if (res.code === 1) {
          this.loadDataObject.videoRateVoProxyRate = res.data.proxyRateVo.rate
          this.loadDataObject.proxyRateVoId = res.data.proxyRateVo.id
          this.loadDataObject.videoRateVoSelfRate = res.data.selfRateVo.rate
          this.loadDataObject.selfRateVoId = res.data.selfRateVo.id
        }
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm(`该操作将变更订单ROI达标判定标准，请确认`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async () => {
              const params = {
                proxyRateVo: {
                  rate: this.updateConfigForm.videoRateVoProxyRate,
                  id: this.loadDataObject.proxyRateVoId
                },
                selfRateVo: {
                  rate: this.updateConfigForm.videoRateVoSelfRate,
                  id: this.loadDataObject.selfRateVoId
                }
              }
              setROIDetailNew(params).then(res => {
                if (res.code === 1) {
                  this.$message.success('修改成功！')
                  this.isUpdate = !this.isUpdate
                  this.loadData()
                }
              })
            })
            .catch(() => {})
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelUpdate() {
      this.isUpdate = !this.isUpdate
      this.updateConfigForm = { ... this.loadDataObject }
      this.$refs.updateConfigForm.clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.update-config-cls {
    width: 100%;
    height: 100%;
    padding-top: 10px;
    border-radius: 10px;
    background-color: #fff;
    .roi-cls {
        margin-right: 20px;
    }
    .row-cls {
        margin-top: 10px;
    }
    .row-cls-bottom {
        margin-bottom: 20px;
        padding-left: 20px;
    }
}

.new-cls-row {
  width: 100%;
  height: 70px;
  margin-top: 20px;
  .new-cls-rchild {
    float: left;
    width: 98%;
    padding-top: 10px;
    height: 70px;
    border-radius: 8px;
    background: #FAFAFA;
  }
  .right-rchild {
    float: right;
  }
}

.button-cls-bottom {
  width: 100%;
  margin-top: 20px;
  text-align: center;
  .btn-cls {
    width: 96px;
  }
}
.update-row-cls {
  height: 32px;
}
.btn-cls {
  font-size: 16px;
}
</style>

