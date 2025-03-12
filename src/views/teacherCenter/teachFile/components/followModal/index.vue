<template>
  <div>
    <el-dialog
      v-if="visible"
      title="跟进"
      :visible.sync="visible"
      width="668px"
      :close-on-click-modal="false"
      class="dialog-container"
    >
      <div class="dialog-tips">
        <span>注：请认真填写每次老师跟进后的结果！点击</span>
        <el-button type="text" @click="handleClick">查看跟进记录</el-button>
      </div>
      <el-form ref="form" size="small" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="真实姓名" prop="teacherRealName">
          <el-input
            v-model.trim="form.teacherRealName"
            style="width:180px"
            :disabled="ifCanEditRealName"
            maxlength="20"
          />
          <div>真实姓名一旦填写，不可修改。</div>
        </el-form-item>
        <el-form-item label="合作状态" prop="cooperateStatus">
          <el-select v-model="form.cooperateStatus" style="width:180px" placeholder="请选择合作状态">
            <el-option v-for="item in COOPERATION_TYPE" :key="item.key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人和方式" prop="phoneNumber">
          <!-- <el-input
            v-model.trim="form.phoneNumber"
            :disabled="ifCanEditPhoneNumber"
            style="width:180px"
            maxlength="11"
            clearable
            placeholder="请输入手机号码"
          /> -->
          <el-input
            v-model="form.phoneNumber"
            type="textarea"
            clearable
            placeholder="可按此格式输入 姓名:18300000,老师助理"
            maxlength="200"
            show-word-limit
          />
          <span>
            注：可按此格式输入 姓名:18300000,老师助理
          </span>
        </el-form-item>
        <el-form-item label="微信号" prop="wechatId">
          <el-input v-model.trim="form.wechatId" maxlength="20" clearable placeholder="请输入微信号" />
        </el-form-item>
        <el-form-item label="联系情况" prop="contactSituation">
          <el-input
            v-model="form.contactSituation"
            type="textarea"
            clearable
            placeholder="请输入联系情况"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="沟通记录" prop="communicationUrls">
          <AppUploadView
            ref="MUpload"
            width="160"
            height="120"
            accept=".jpg,.jpeg,.png"
            :before-upload="beforeUpload"
            :max-length="5"
            oss-teacher-folder="hok_tearch"
            @onClick="delImg"
            @change="fileChange"
          />
          <div>注：可上传Jpg\Png格式图片，大小限2M以内，最多可传5张。</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading" size="small" type="primary" @click="handleSave">确 定</el-button>
        <el-button :loading="loading" size="small" @click="visible = false">取 消</el-button>
        <!-- <el-button
          :disabled="sharingTeacher"
          :loading="loading"
          size="small"
          class="btn_primary"
          @click="onhandleClickPlacedOpenSea"
        >放入公海</el-button> -->
      </span>
      <el-dialog width="1100px" title="跟进记录" :visible.sync="innerVisible" class="inner-dialog-container" append-to-body>
        <followTable ref="followTable" v-model="tableData" :show-communication-urls="true" />
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="innerVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>

</template>

<script>
import { getDict } from '@/utils/index'
import { teacherFollowAdd, getFollowNewest } from '@/api/tearchCenter/index'
import followTable from './table'
import AppUploadView from '@/components/AppUploadView/upload.vue'
import { getFileType } from '@/utils/index'
import { throwCommon, getSharingSetting } from '@/api/tearchCenter/tearchSharing.js'
export default {
  components: {
    followTable,
    AppUploadView
  },
  data() {
    const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        return callback()
      } else if (!reg.test(value)) {
        callback('请输入正确的手机号')
      } else {
        return callback()
      }
    }
    return {
      loading: false,
      visible: false,
      innerVisible: false,
      COOPERATION_TYPE: [],
      tableData: [],
      form: {
        'contactSituation': '',
        'cooperateStatus': '',
        'phoneNumber': '',
        'teacherId': '',
        'wechatId': ''
      },
      rules: {
        cooperateStatus: [
          { required: true, message: '请选择合作状态', trigger: 'change' }
        ],
        contactSituation: [
          {
            validator: (rule, value, callback) => {
              if (this.form.cooperateStatus === 9 && !value) {
                callback(new Error('合作状态为“黑名单”时，联系情况必填'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      ifCanEditPhoneNumber: false, // 真实姓名和手机号填完，不能修改。
      ifCanEditRealName: false, // 真实姓名和手机号填完，不能修改。
      sharingTeacher: false
    }
  },
  async created() {
    this.COOPERATION_TYPE = await getDict('COOPERATION_TYPE')
  },
  methods: {
    async open(row) {
      // this.getSharingSetting()
      this.form = {
        teacherRealName: '',
        communicationUrls: '',
        'contactSituation': '',
        'cooperateStatus': '',
        'phoneNumber': '',
        'teacherId': '',
        'wechatId': ''
      }
      this.form.teacherId = row.teacherId
      const { data } = await getFollowNewest({ teacherId: row.teacherId })
      console.log(data, 'data')
      this.form.phoneNumber = data.phoneNumber ?? ''
      this.form.wechatId = data.wechatId ?? ''
      this.form.teacherRealName = data.teacherRealName ?? ''
      this.form.communicationUrls = data.communicationUrls ?? []
      this.ifCanEditPhoneNumber = !!(data.phoneNumber)
      this.ifCanEditRealName = !!(data.teacherRealName)
      this.$refs.MUpload && this.$refs.MUpload.setFileList([])
      this.visible = true
    },
    handleClick() {
      this.innerVisible = true
      this.$nextTick(() => {
        this.$refs.followTable.getList({ teacherId: this.form.teacherId })
      })
    },
    async save() {
      // if (!this.form.phoneNumber && !this.form.wechatId) {
      //   return this.$message.error('请输入手机号码或者微信号')
      // }
      const communicationUrls = this.form.communicationUrls.reduce((pre, next) => {
        pre.push(next.url)
        return pre
      }, [])
      const data = {
        ...this.form,
        communicationUrls: communicationUrls
      }
      teacherFollowAdd(data).then(res => {
        this.$notify.success('操作成功')
        this.visible = false
        this.$emit('success')
      }).catch((err) => {
        console.log(err)
        if (err.code && err.code === 202403) {
          this.$delModal({
            width: '505px',
            sureBtnText: '查看详情',
            sureBtnBgColor: '#0C6FFF',
            tips: `
              <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">友情提示</div>
              <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">${err.message}</div>
            `,
            success: () => {
              const { href } = this.$router.resolve({
                path: `/teacherCenter/teacherSharing?teacherPhoneNum=${this.form.phoneNumber}&teacherRealName=${this.form.teacherRealName}&queryDetail=true`
              })
              window.open(href, '_blank')
            }
          })
        } else if (err.code && err.code === 20240301) {
          this.$delModal({
            width: '505px',
            noCancelBtn: true,
            sureBtnText: '关闭',
            sureBtnBgColor: '#fff',
            cancelBtnBgColor: '#161616',
            sureBtnStyle: { 'background-color': '#fff', color: '#161616', border: '1px solid #DCDFE6' },
            tips: `
              <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">友情提示</div>
              <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">${err.message}</div>
            `,
            success: () => {
            }
          })
        } else {
          this.$message.error(err.message || err.msg || err)
        }
      })
    },
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.save()
        } else {
          return false
        }
      })
    },
    beforeUpload(file) {
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(
        type
      )
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      } else if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2M!')
      }
      return isIMAGE && isLt2M
    },
    fileChange(arr) {
      console.log(arr, 'arr')
      this.form.communicationUrls = arr
    },
    delImg(index) {
      console.log(index)
      this.$refs.MUpload && this.$refs.MUpload.delFile(this.form.communicationUrls[index], index)
      // this.form.communicationUrls.splice(index, 1)
    },
    onhandleClickPlacedOpenSea() {
      console.log('点击放入公海')
      this.$delModal({
        tips: `
        <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">确认放入公海？</div>
        <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">
        1、放入公海后，其他机构可进行领取！<br />
        2、不可以再填写跟进记录，只有领取回来，才可以填写
        </div>
        `,
        success: () => {
          this.throwCommon()
        }
      })
    },
    throwCommon() {
      this.loading = true
      const data = {
        originalTeacherId: this.form.teacherId
      }
      throwCommon(data).then(res => {
        this.$notify.success('操作成功')
        this.loading = false
        this.visible = false
      }).catch(() => {
        this.loading = false
      })
    },
    getSharingSetting() {
      getSharingSetting().then(res => {
        console.log(res, '查询当前机构师资共享配置')
        this.sharingTeacher = !res.data.sharingTeacher
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container::v-deep,
.inner-dialog-container ::v-deep {
  .el-dialog__title {
    font-weight: bold;
  }

  .el-dialog__header {
    border-bottom: 1px solid #E7E7E7;
  }

  .el-dialog__body {
    padding: 10px 20px;
  }

  .dialog-tips {
    border-radius: 4px;
    background: #FEECEC;
    padding: 0 16px;
    line-height: 22px;
    color: #F53F3F;
    font-size: 14px;
    margin-bottom: 20px;
  }
}

::v-deep {
  .el-upload {
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fbfcfe;
      width: 160px;
      height: 120px;
    }
  }

  .uploadView {
    margin-bottom: 10px;
  }

  .uploadItem {
    margin-bottom: 10px;
  }
}
</style>
