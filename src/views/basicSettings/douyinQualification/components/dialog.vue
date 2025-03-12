<template>
  <Modal
    :visible.sync="visible"
    title="查看"
    size="600px"
    :type="1"
    :loading="loading"
  >
    <div v-if="visible" class="payChannelDialog overflowOuto">
      <el-form label-width="130px" label-position="right">
        <el-form-item label="小程序ID：">{{ current.appId }}</el-form-item>
        <el-form-item label="资质类型：">机构</el-form-item>
        <el-form-item label="机构LOGO：">
          <div>
            <uploadShow :url="current.institutionLogoUrl" style="width: 160px; height: 90px;" />
          </div>
        </el-form-item>
        <el-form-item label="机构头图：">
          <div>
            <uploadShow :url="current.imgUrl" style="width: 160px; height: 90px" />
          </div>
        </el-form-item>
        <el-form-item label="机构资质：">营业执照</el-form-item>
        <el-form-item label="营业执照照片：">
          <div>
            <uploadShow :url="current.imageUrl" style="width: 160px; height: 90px" />
          </div>
        </el-form-item>
        <el-form-item label="法人身份证照片：">
          <div style="display:flex">
            <uploadShow :url="current.legalPersonIdImgUrls[0]" style="width: 160px; height: 90px" />
            <uploadShow :url="current.legalPersonIdImgUrls[1]" style="width: 160px; height: 90px;margin-left:20px" />
          </div>
        </el-form-item>
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
import uploadShow from './uploadShow'
export default {
  components: {
    Modal,
    uploadShow
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
        imageUrl: douQualificationInfoVos.imageUrl,
        legalPersonIdImgUrls: row.legalPersonIdImgUrls ?? ['', '']
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
