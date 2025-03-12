<template>
  <!-- 新增规则弹框 -->
  <AppDialog
    v-model="config.visible"
    :title="'关联数字人形象'"
    width="624px"
    :loading="loading"
    height="380px"
    @success="sure"
  >
    <div v-loading="loading" class="addDialog">
      <el-form
        ref="form"
        class="m-t-16"
        :model="form"
        label-width="auto"
        size="small"
        :rules="rules"
      >
        <el-form-item label="IP" prop="teacherId">
          <!-- <el-input v-model="search.name" style="width: 194px" /> -->
          <teacherInput
            ref="teacherInput"
            v-model="form.teacherId"
            attribute="teacherId"
            @clear="searchFn"
            @select="searchFn()"
            @keyup.enter.native="searchFn"
          />
        </el-form-item>
        <el-form-item label="选择形象" prop="characterId">
          <div class="imgList overflowOuto">
            <div v-if="imgList.length === 0" class="imgcheckbox">
              <div class="open-image" @click="imageListVisible = true">
                <i class="el-icon-plus" />
              </div>
            </div>
            <template v-else>
              <div
                v-for="item in imgList"
                :key="item.characterId"
                class="imgcheckbox"
              >
                <div
                  class="imgBox"
                  :style="{ backgroundImage: `url(${item.photoUrl})` }"
                />
                <div class="imgName">{{ item.name }}</div>
                <div class="del_ab"><span @click="delImgList">删除</span></div>
              </div>
            </template>
          </div>
        </el-form-item>
        <el-form-item label="选择声音" prop="voiceIds">
          <el-select
            v-model="form.voiceIds"
            placeholder="请选择"
            style="width: 80%"
            multiple
          >
            <el-option
              v-for="item in soundList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <imageListDialog
      :visible="imageListVisible"
      @submit="imageListSubmit"
      @handleClose="imageListVisible = false"
    />
  </AppDialog>
</template>

<script>
import iconPanel from '@/assets/svg/panel/aiselect_icon.svg'
import aidisable from '@/assets/svg/panel/aidisable_icon.svg'
import teacherInput from './teacherSelect/index'
import imageListDialog from './imageListDialog'
import AppDialog from '@/components/AppDialog'
import {
  charactersConnect,
  getVoicesByOrg
} from '@/api/aiVideoManage'
export default {
  components: {
    AppDialog,
    teacherInput,
    imageListDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          type: 1, // 1新增 2编辑
          row: {},
          visible: false
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      iconPanel,
      aidisable,
      checked1: false,
      fit: 'contain',
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      form: {
        teacherId: '', // 讲师姓名
        characterId: undefined, // 选中的列表
        voiceIds: [] // 选中的声音
      },
      imgList: [],
      rules: {
        // teacherId: [
        //   { required: true, message: '请选择讲师', trigger: 'change' }
        // ],
        characterId: [
          { required: true, message: '请选择形象', trigger: 'change' }
        ],
        voiceIds: [
          { required: true, message: '请选择声音', trigger: 'change' }
        ]
      },
      soundList: [],
      imageListVisible: false
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          this.$refs.form && this.$refs.form.resetFields()
          if (this.config.type === 1) {
            this.form = {
              teacherId: '', // 讲师姓名
              characterId: undefined, // 选中的列表
              voiceIds: [] // 选中的声音
            }
            this.imgList = []
          } else {
            this.form = JSON.parse(JSON.stringify(this.config.row))
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getVoicesByOrg()
  },
  methods: {
    getVoicesByOrg() {
      getVoicesByOrg().then(res => {
        this.soundList = res.data.map(item => {
          return {
            label: item.name,
            value: item.voiceId
          }
        })
      })
    },
    delImgList() {
      this.imgList = []
      this.form.characterId = undefined
    },
    imageListSubmit(val) {
      this.imgList = [val]
      this.form.characterId = val.characterId
      this.imageListVisible = false
    },
    searchFn(e) {
      console.log(this.form, '讲师列表')
    },
    sure() {
      if (!this.form.characterId) {
        this.$message.error('请选择形象!')
        return
      }
      this.$refs.form.validate(async valid => {
        if (valid) {
          const res = await charactersConnect({
            characterId: this.form.characterId,
            teacherId: this.form.teacherId,
            voiceIds: this.form.voiceIds
          })
          if (res.code === 1) {
            this.$emit('success')
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.addDialog {
  height: 360px;
  padding: 20px;
  .imgList {
    display: flex;
    flex-wrap: wrap;
    max-height: 220px;
  }
  .imgcheckbox {
    width: 90px;
    margin-right: 10px;
    position: relative;
    .imgName {
      width: 100%;
      font-size: 14px;
      color: #333333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .open-image {
      width: 90px;
      height: 160px;
      background: #f5f5f5;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      border: 1px dashed transparent;
      cursor: pointer;
    }
  }
  .imgBox {
    background: #f5f5f5;
    border-radius: 4px;
    width: 90px;
    height: 160px;
    position: relative;
    border: 1px solid transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 4px;
  }
  .del_ab {
    position: absolute;
    width: 90px;
    height: 24px;
    background: #333333;
    border-radius: 0px 0px 4px 4px;
    opacity: 0.4;
    bottom: 33px;
    text-align: center;
    line-height: 1.8;
    z-index: 999;
    span {
      cursor: pointer;
      color: #ffffff;
    }
  }
  .imgActive {
    border: 1px solid #0c6fff;
  }
  .iconPanel {
    position: absolute;
    right: 0;
    top: 0;
    width: 16px;
    height: 16px;
    font-size: 16px;
  }
  .tips {
    width: 100%;
    padding: 10px;
    background: #fff2e6;
    border-radius: 8px;
    display: flex;
    .tipsIcon {
      width: 24px;
      color: #ff7d00;
      font-size: 24px;
    }
    .tipsContent {
      flex: 1;
      padding-left: 8px;
      .tipsTitle {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #ff7d00;
        line-height: 24px;
      }
      .tipsMsg {
        margin-top: 8px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #ff7d00;
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
::v-deep .imgBox {
  img {
    width: auto;
    height: 180px;
  }
}
</style>
