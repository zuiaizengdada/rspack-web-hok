<template>
  <div class="formList">
    <el-row>
      <el-col :span="12">
        <div class="detailForm">
          <div class="detailFormLabel">跟进人：</div>
          <div class="detailFormValue">{{ detail.nickName }}({{ detail.tenantName }})</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="detailForm">
          <div class="detailFormLabel">跟进时间：</div>
          <div class="detailFormValue">{{ detail.createTime }}</div>
        </div>
      </el-col>
    </el-row>
    <el-row class="m-t-16 detailForm">
      <div class="detailFormLabel">合作状态：</div>
      <div class="detailFormValue">{{ detail.cooperateStatus | getOptionsValue(COOPERATION_TYPE) }}</div>
    </el-row>
    <el-row class="m-t-16">
      <el-col :span="12" class="detailForm">
        <div class="detailFormLabel">真实姓名：</div>
        <div class="detailFormValue">{{ detail.teacherRealName }}</div>
      </el-col>
      <el-col :span="12" class="detailForm">
        <div class="detailFormLabel">手机号码：</div>
        <div class="detailFormValue">{{ detail.phoneNumber }}</div>
      </el-col>
    </el-row>
    <el-row class="m-t-16 detailForm">
      <div class="detailFormLabel">联系情况：</div>
      <div class="detailFormValue">{{ detail.contactSituation }}</div>
    </el-row>
    <el-row class="m-t-16 detailForm">
      <div class="detailFormLabel">沟通记录：</div>
      <div class="detailFormValue">
        <div class="imgList">
          <template v-for="(item, index) in detail.communicationUrls">
            <uploadItem
              :key="index"
              :index="index"
              class="m-r-16 m-b-16"
              :status="3"
              :url="item"
              :disabled="true"
            />
          </template>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import { getDict } from '@/utils/index'
import uploadItem from '@/components/AppUploadView/uploadItem.vue'
export default {
  components: {
    uploadItem
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {
          contactSituation: '',
          cooperateStatus: 0,
          createTime: '',
          createUed: '',
          id: 0,
          nickName: '',
          overallRating: null,
          phoneNumber: '',
          photoUrl: null,
          teacherId: '',
          teacherName: null,
          wechatId: '',
          claimRecord: []
        }
      }
    }
  },
  data() {
    return {
      COOPERATION_TYPE: []
    }
  },
  async created() {
    this.COOPERATION_TYPE = await getDict('COOPERATION_TYPE')
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.formList {
margin: 20px 20px 0 20px;
padding: 20px;
background: #f2f9ff;
border-radius: 8px;
}
.detailForm {
display: flex;
flex-wrap: wrap;
.detailFormLabel {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 24px;
    width: 80px;
    text-align: right;
}
.detailFormValue {
    flex: 1 0 0;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 24px;
}
}

.listView {
width: 504px;
background: #FFFFFF;
border-radius: 4px;
border: 1px dashed #979797;
display: flex;
flex-wrap: wrap;
padding: 8px 16px;
.listLi {
    padding: 4px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 143px;
    height: 32px;
    background: #E6F4FF;
    border-radius: 4px;
    margin-right: 20px;
    margin-top: 8px;
    margin-bottom: 8px;
    .text_hidden_ellipsis {
    width: 163px;
    }
    &:nth-child(3n + 3) {
    margin-right: 0;
    }
}
.More {
    background: #fff;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #0C6FFF;
    line-height: 22px;
    padding-left: 0;
    cursor: pointer;
}
}
.m-b-8 {
  margin-bottom: 8px;
}
.tagStype{
  margin-bottom: 5px;
  margin-right: 5px;
}
.imgList {
    display: flex;
    flex-wrap: wrap;
}
</style>
