<!-- 直播管理页面弹框 -->
<template>
  <div v-loading="loading" :class="`group${type == 2 ? 'Dialog' : 'Drawer'}`">
    <el-form
      v-if="visible"
      ref="form"
      :model="form"
      label-width="100px"
      size="small"
      class="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="IP名称" prop="lecturerName">
        <!-- <el-input v-model.trim="form.lecturerName" /> -->
        <teacherSelect
          ref="teacherSelect"
          v-model="form.teacherId"
          :disabled="type === 3"
          @getDetail="onTeacherSelect"
        />
      </el-form-item>

      <el-form-item label="IP标签">
        <el-tag
          v-for="(tag, index) in dynamicTags"
          :key="index"
          closable
          :disable-transitions="false"
          class="m-r-10"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible && dynamicTags.length < 3"
          ref="saveTagInput"
          v-model="inputValue"
          class="input-new-tag"
          size="small"
          maxlength="6"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button
          v-if="!inputVisible && dynamicTags.length < 3"
          class="button-new-tag"
          @click="showInput"
        >+ 添加</el-button>
        <div class="tips m-t-20">
          <div>输入标签后点击回车即可添加，最多添加3个标签,标签最长6个字</div>
        </div>
      </el-form-item>

      <el-form-item label="头像">
        <div>
          <div
            v-if="!form.headUrl"
            class="image_poster b-r-50"
            style="width: 100px; height: 100px"
            @click="getImgUrl('headUrl')"
          >
            <i class="el-icon-plus" />
          </div>
          <div v-else>
            <AppMyImage
              class="b-r-50 ov-h"
              :src="form.headUrl"
              :m-class="'b-r-50 ov-h'"
              style="width: 100px; height: 100px"
              :options="{
                width: 240,
                fixed: true,
                option: {
                  fixed: true,
                  fixedNumber: [1, 1],
                  fixedBox: false
                }
              }"
              @close="delImage('headUrl')"
              @success="(res) => changeImage('headUrl', res)"
            />
          </div>
          <div class="tips m-t-20">
            <div>建议尺寸250*250，小于2M的JPG、PNG格式图片</div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="封面图">
        <div>
          <div
            v-if="!form.coverUrl"
            class="image_poster"
            style="width: 200px; height: 150px"
            @click="getImgUrl('coverUrl')"
          >
            <i class="el-icon-plus" />
            <span>点击上传图片</span>
          </div>
          <div v-else>
            <AppMyImage
              :src="form.coverUrl"
              style="width: 200px; height: 150px"
              :options="{
                width: 240,
                fixed: true,
                option: {
                  fixed: true,
                  fixedNumber: [4, 3],
                  fixedBox: false
                }
              }"
              @close="delImage('coverUrl')"
              @success="(res) => changeImage('coverUrl', res)"
            />
          </div>
          <div class="tips m-t-20">
            <div>建议尺寸750*563，小于2M的JPG、PNG格式图片</div>
          </div>
        </div>
      </el-form-item>

      <!-- <el-form-item label="背景图">
        <div>
          <div v-if="!form.backgroundUrl" class="image_poster" style="width: 240px;height: 120px" @click="getImgUrl('backgroundUrl')">
            <i class="el-icon-plus" />
            <span>点击上传图片</span>
          </div>
          <div v-else>
            <AppMyImage
              :src="form.backgroundUrl"
              style="width: 240px;height: 120px"
              :options="{
                width: 240,
                fixed: true,
                option: {
                  fixed: true,
                  fixedNumber: [2, 1],
                  fixedBox: false
                }
              }"
              @close="delImage('backgroundUrl')"
              @success="(res) => changeImage('backgroundUrl', res)"
            />
          </div>
          <div class="tips m-t-20">
            <div>建议尺寸720*360，小于2M的JPG、PNG格式图片</div>
          </div>
        </div>
      </el-form-item> -->

      <el-form-item label="老师简介">
        <el-row v-for="(item, index) in lecturerLabel" :key="index" class="m-b-10">
          <el-input
            v-model.trim="lecturerLabel[index]"
            maxlength="10"
            show-word-limit
            style="width: 300px"
            class="m-r-10"
          />
          <el-button
            v-if="lecturerLabel.length === index + 1 && lecturerLabel.length !== 3"
            type="primary"
            icon="el-icon-plus"
            @click="lecturerLabel.push('')"
          >添加</el-button>
          <el-button v-else @click="lecturerLabel.splice(index, 1)">删除</el-button>
        </el-row>
      </el-form-item>

      <el-form-item label="老师说明">
        <el-input v-model.trim="form.briefIntroduction" />
      </el-form-item>

      <!-- <el-form-item label="老师简介3">
        <el-input v-model.trim="form.briefIntroductionThree" />
      </el-form-item> -->

      <el-form-item label="详情介绍">
        <AppUEditor v-model="form.content" />
      </el-form-item>

      <el-form-item label="排序">
        <el-input v-model.trim="form.sort" type="number" :min="0" />
      </el-form-item>

      <el-form-item label="显示/隐藏">
        <el-switch v-model="form.lecturerState" :active-value="0" :inactive-value="1" />
        {{ form.lecturerState ? '隐藏' : '显示' }}
      </el-form-item>
    </el-form>

    <div class="demo-drawer__footer">
      <el-button size="small" @click="$emit('close')">取 消</el-button>
      <el-button v-if="type !== 2" type="primary" size="small" @click="send()">提交</el-button>
    </div>
  </div>
</template>

<script>
import AppMyImage from '@/components/AppMyImage'
import AppUEditor from '@/components/AppUEditor'
import teacherSelect from './components/teacherSelect'
export default {
  components: {
    AppMyImage,
    AppUEditor,
    teacherSelect
  },
  props: {
    type: {
      type: Number,
      default: 1
    },
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {
          backgroundUrl: '',
          briefIntroduction: '',
          content: '',
          coverUrl: '',
          lecturerLabel: '',
          lecturerName: '',
          lecturerState: 0,
          teacherId: '',
          remake: '',
          headUrl: '',
          sort: ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      rules: {
        lecturerName: [{ required: true, message: '请输入IP名称', trigger: 'blur' }]
      },
      form: {
        backgroundUrl: '',
        briefIntroduction: '',
        content: '',
        coverUrl: '',
        lecturerLabel: '',
        lecturerName: '',
        lecturerState: 0,
        teacherId: '',
        sort: 1,
        headUrl: '',
        remark: ''
      },
      dynamicTags: [],
      inputVisible: false, // 标签输入框
      inputValue: '', // 输入值
      isClear: false,
      lecturerLabel: [''] // 老师简介
    }
  },
  watch: {
    visible: {
      handler(n) {
        if (n) {
          this.dynamicTags = []
          this.lecturerLabel = ['']
          this.form = JSON.parse(JSON.stringify(this.data))
          if (this.form.remark && this.form.remark.length > 0) {
            this.dynamicTags = this.form.remark.split(';')
          }
          if (this.form.lecturerName) {
            this.$nextTick(() => {
              this.$refs.teacherSelect.setDefaultValue(this.form.lecturerName)
            })
          }
          if (this.form.lecturerLabel && this.form.lecturerLabel.length > 0) {
            this.lecturerLabel = this.form.lecturerLabel.split(';')
          }
          // console.log(this.form.content, 'content')
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    send() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form))
          if (this.dynamicTags.length > 0) {
            params.remark = this.dynamicTags.filter(Boolean).join(';')
            // this.dynamicTags && this.dynamicTags.map((v, i) => {
            //   this.dynamicTags.length !== i + 1 ? (params.remark += v + ';') : (params.remark += v)
            // })
          }

          if (this.lecturerLabel.length > 0) {
            params.lecturerLabel = this.lecturerLabel.filter(Boolean).join(';')
            // this.lecturerLabel && this.lecturerLabel.map((v, i) => {
            //   this.lecturerLabel.length !== i + 1 ? (params.lecturerLabel += v + ';') : (params.lecturerLabel += v)
            // })
          }
          // this.dynamicTags = []
          // this.lecturerLabel = ['']
          // this.form = {
          //   backgroundUrl: '',
          //   briefIntroduction: '',
          //   content: '',
          //   coverUrl: '',
          //   lecturerLabel: '',
          //   lecturerName: '',
          //   lecturerState: 0,
          //   sort: 1,
          //   remark: ''
          // }
          console.log('提交内容', params)
          this.$emit('success', params)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getImgUrl(key) {
      console.log(key)
      this.$SelectMaterial({
        visible: true,
        types: [0],
        success: (res) => {
          this.$set(this.form, key, res.materialUrl)
        }
      })
    },
    // 删除选中图片
    delImage(key) {
      this.form[key] = ''
    },
    // 改变选中图片
    changeImage(key, res) {
      this.form[key] = res
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 富文本输入值改变状态
    change(e) {
      // console.log(e)
    },
    onTeacherSelect(e) {
      this.form.lecturerName = e.teacherName
      this.form['teacherId'] = e.teacherId
    }
  }
}
</script>

<style lang="scss" scoped>
.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;
  .form {
    // flex: 1;
    height: calc(100vh - 77px - 50px);
    width: 100%;
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .demo-drawer__footer {
    width: 100%;
    height: 50px;
    padding-top: 10px;
    padding-left: 10px;
    -webkit-box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }
  .form_headUrl {
    display: flex;
    align-items: center;
    .form_btn {
      height: 30px;
      margin-left: 10px;
    }
  }
  .form_textarea {
    width: 600px;
    margin-right: 10px;
  }
}

::v-deep {
  .el-headUrl > img {
    display: block;
    height: 100%;
    width: 100%;
    vertical-align: middle;
  }
  .headUrl-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .headUrl-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .headUrl-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
  }
  .headUrl {
    width: 178px;
    height: 178px;
    display: block;
  }
}

.addTenantName {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 1px dashed #ccc;
  text-align: center;
  line-height: 35px;
  cursor: pointer;
}

.addTenantName:hover {
  border-color: #409eff;
}

.flex {
  display: flex;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  // margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.image_poster {
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #dcdcdc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  > span {
    margin-top: 13px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    line-height: 20px;
  }
  &:hover {
    border: 1px dashed #1472ff;
  }
}
.tips {
  // margin-top: 20px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
</style>
