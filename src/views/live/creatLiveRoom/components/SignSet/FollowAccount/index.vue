<template>
  <div>
    <el-radio-group v-model="applyOfficialFlag" @input="handleInputRadio">
      <el-radio :label="0">关闭</el-radio>
      <el-radio :label="1">打开</el-radio>
      <el-radio :label="2">强制关注</el-radio>
    </el-radio-group>
    <div v-if="[1,2].includes(applyOfficialFlag)" class="officialFlag-container marginTop_8">
      <el-form-item
        label="选择公众号"

        class="marginBottom_0 marginTop_16"
        label-width="95px"
      >
        <el-select v-model="applyOfficialId" clearable @change="officialListChange">
          <el-option
            v-for="item in officialList"
            :key="item.officialId"
            :label="item.officialName"
            :value="item.officialId+''"
          />
        </el-select>
        <img v-if="applyOfficialId" width="88px" height="88px" class="officialFlag-img" :src="selectQrcodeUrl" />
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { applyConfigDetailAjax, officialListAjax } from '@/api/liveRoom/register'
export default {
  data() {
    return {
      applyOfficialFlag: 0,
      applyOfficialId: '',
      selectQrcodeUrl: '',
      officialList: [],
      pageloading: false,
      applyMsgsObj: {},
      liveRoomId: '9527'
    }
  },
  mounted() {
    // this.applyConfigDetail()
    this.getOfficialList()
  },
  methods: {
    handleInputRadio(val) {
      this.$emit('change', val)
    },
    // 获取报名设置详情
    applyConfigDetail() {
      this.pageloading = true
      this.initApplyMsgsObj()
      const liveRoomId = this.liveRoomId
      applyConfigDetailAjax({ liveRoomId }).then(async res => {
        if (res.code === 1) {
          const { applyImgUrl, applyMsgs, applyOfficialId, coverImgUrl } = res.data
          this.form = res.data
          // 回显报名详情页的图片
          if (applyImgUrl) {
            const applyImgUrlList = applyImgUrl.split(',').map(item => {
              return {
                url: item,
                status: 3
              }
            })
            this.$refs.registerUpload.setFileList(applyImgUrlList)
            // 回显手机模型的图片
            this.uploadChange(applyImgUrlList)
          }
          // 回显消息通知
          if (applyMsgs.length) {
            this.applyMsgsObj = this.handleGetApplyMsgs(applyMsgs)
          }
          // 回显公众号二维码
          if (applyOfficialId) {
            await this.getOfficialList()
            this.officialListChange(applyOfficialId)
          }
          if (coverImgUrl) {
            this.$refs.MUpload && this.$refs.MUpload.setFileList([{
              status: 3,
              url: coverImgUrl
            }])
          }
        }
      }).finally(() => {
        this.pageloading = false
      })
    },

    // 获取公众号二维码
    getOfficialList() {
      return new Promise((resolve, reject) => {
        officialListAjax().then(res => {
          if (res.code === 1) {
            this.officialList = res.data
            resolve()
          }
        }).catch(() => {
          reject()
        })
      })
    },
    initApplyMsgsObj() {
      this.applyMsgsObj = {
        '1': {
          msgType: 1,
          sendMsgFlag: 1,
          applyMsgs: [{
            timeType: 1,
            timeMinute: '',
            msgTemplateId: '',
            id: '',
            isSent: 0
          }]
        },
        '2': {
          msgType: 2,
          sendMsgFlag: 1,
          applyMsgs: [{
            timeType: 1,
            timeMinute: '',
            msgTemplateId: '',
            id: '',
            isSent: 0
          }]
        }
      }
    },
    // 公众号change
    officialListChange(e) {
      // eslint-disable-next-line
      this.selectQrcodeUrl = this.officialList.find(item => item.officialId == e)?.qrcodeUrl
      // eslint-disable-next-line eqeqeq
      const selectQrcodeId = this.officialList.find(item => item.officialId == e)?.officialId
      this.$emit('select', selectQrcodeId)
    }
  }
}
</script>
<style lang="scss" scoped>
 .officialFlag-container {
    border: 1px solid #E1E6ED;
    padding: 10px;
    width: 468px;
     border-radius: 6px;
    position: relative;
    .officialFlag-img {
      margin-top: 12px;
       border: 1px solid #dcdcdc;
      border-radius: 4px;
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.5) inset;
    }
  }
  .marginTop_8 {
    margin-top: 8px;
  }
::v-deep .el-form-item--mini.el-form-item{
  margin-bottom:0;
}
</style>
