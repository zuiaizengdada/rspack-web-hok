<template>
  <Modal
    :visible.sync="visible"
    title="查看补充资质"
    size="600px"
    :type="1"
    :loading="loading"
  >
    <div v-if="visible" class="payChannelDialog overflowOuto">
      <el-form label-width="130px" label-position="right">
        <el-form-item label="机构名称：">{{ current.name }}</el-form-item>
        <el-form-item label="机构昵称：">{{ current.nickname }}</el-form-item>
        <el-form-item label="机构介绍：">
          {{ current.institutionIntroduction }}
        </el-form-item>
        <el-form-item label="机构场景类型：">
          {{ current.institutionSceneType }}
        </el-form-item>
        <el-form-item label="机构主体类型：">{{ current.institutionSubjectType }}</el-form-item>
        <el-form-item label="企业名称：">
          {{ current.companyName }}
        </el-form-item>
        <el-form-item label="机构备案名称：">
          {{ current.institutionRecordName }}
        </el-form-item>
        <el-form-item label="执照有效期：">{{ current.douQualificationInfoVos && current.douQualificationInfoVos[0].validityDate }}</el-form-item>
        <el-form-item label="执照编号：">{{ current.douQualificationInfoVos && current.douQualificationInfoVos[0].licenseId }}</el-form-item>
        <el-form-item label="机构法人姓名：">{{ current.legalPersonName }}</el-form-item>
        <el-form-item label="法人身份证号码：">{{ current.legalPersonIdNumber }}</el-form-item>
        <el-form-item label="创建人：">{{ current.createUser }}</el-form-item>
        <el-form-item label="创建时间：">{{ current.createTime }}</el-form-item>
        <el-form-item label="修改人：">{{ current.updateUser }}</el-form-item>
        <el-form-item label="修改时间：">{{ current.updateTime }}</el-form-item>
      </el-form>

    </div>
    <div class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal'
export default {
  components: {
    Modal
  },
  data() {
    return {
      current: {},
      type: '',
      title: '上传资质',
      visible: false,
      loading: false
    }
  },
  mounted() {},
  methods: {
    open(row) {
      const douQualificationInfoVos = (row.douQualificationInfoVos && row.douQualificationInfoVos[0]) ?? {}
      this.visible = true
      this.current = {
        ...row,
        imageUris: douQualificationInfoVos.imageUris,
        legalPersonIdImgUris: row.legalPersonIdImgUris ?? ['', '']
      }
    },
    fileChange(fileList, key) {
      this.form[key] = fileList
    }
  }
}
</script>

<style lang='scss' scoped>
.payChannelDialog {
  height: calc(100vh - 150px);
  padding: 16px;
  box-sizing: border-box;
  .tips {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
  }
}
.dialog-footer{
    height: 62px;
    display: flex;
    padding: 0 20px;
    justify-content: flex-end;
    align-items: center;
}
</style>
