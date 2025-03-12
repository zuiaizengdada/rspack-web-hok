<template>
  <!-- 直播间敏感词 -->
  <div class="page_wrap">
    <div v-loading="loading" class="liveToolDesensitization">
      <el-scrollbar
        ref="P5ScrollContainer"
        :vertical="false"
        class="liveToolDesensitization_scroll"
      >
        <div ref="formView" class="form">
          <el-form ref="form" :model="form" label-position="top" :rules="rules">
            <el-form-item label="选择分类" prop="sceneType">
              <el-select
                v-model="form.sceneType"
                size="mini"
                style="width: 144px"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in classOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <template v-if="form.sceneType === 1">
                <app-select
                  class="filter_teacherSelect"
                  :get-api-fn="getTeacherList"
                  search-key="teacherName"
                  style="width: 141px; margin-left: 8px"
                  :value="form.teacherId"
                  :label="form.teacherName"
                  :props="{
                    label: 'teacherName',
                    value: 'teacherId'
                  }"
                  size-type="mini"
                  @selected="selectedTeacher"
                />
              </template>

              <template v-else-if="form.sceneType === 2">
                <AppSelect
                  :get-api-fn="getVideoList"
                  search-key="videoName"
                  style="width: 141px; margin-left: 8px"
                  :value="form.videoId"
                  :label="form.videoName"
                  :props="{
                    label: 'videoName',
                    value: 'videoId'
                  }"
                  @selected="selectedVideo"
                />
              </template>
              <el-input
                v-else-if="form.sceneType === 3"
                v-model.trim="form.groupName"
                size="small"
                style="width: 141px; margin-left: 8px"
              />
            </el-form-item>
            <el-form-item label="敏感词" prop="desensitization">
              <span slot="label" class="">
                <span>敏感词</span>
                <span
                  style="
                    margin-left: 10px;
                    color: #999999;
                    font-size: 12px;
                    font-weight: 400;
                  "
                  >输入回车即代表一个敏感词</span
                >
              </span>
              <el-input
                v-model.trim="keyWord"
                class="m-b-10"
                style="width: 100%"
                placeholder="输入回车即代表一个敏感词"
                @keyup.enter.native="onhandleAdd"
              />
              <div
                v-if="form.desensitization.length > 0"
                class="desensitizationBox clearfix"
              >
                <div
                  v-for="(item, index) in form.desensitization"
                  :key="index"
                  class="desensitizationItem m-b-10 m-r-10"
                >
                  {{ item }}
                  <i class="el-icon-close closeBtn" @click="del(item, index)" />
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </div>
    <div class="footerBtn">
      <el-button type="primary" size="small" :loading="loading" @click="sure"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
import { sensitiveGroupAdd } from '@/api/liveRoom/liveRoom.js'
import { getTeacherList } from '@/api/tearchCenter/index'
import { getVideoList } from '@/api/liveRoom/script'
import AppSelect from '@/components/AppSelect/index'
export default {
  name: 'LiveToolDesensitization',
  components: {
    AppSelect
  },
  data() {
    var validateSceneType = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择分类'))
      } else if (this.form.sceneType === 1 && !this.form.teacherId) {
        return callback(new Error('请选择IP老师'))
      } else if (this.form.sceneType === 2 && !this.form.videoId) {
        return callback(new Error('请选择视频名称'))
      } else if (this.form.sceneType === 3 && !this.form.groupName) {
        return callback(new Error('请选择分组名称'))
      }
      callback()
    }
    var validateDesensitization = (rule, value, callback) => {
      if (value.length === 0 && !this.keyWord) {
        return callback(new Error('请输入敏感词'))
      }
      if (value.length > 1000) {
        return callback(new Error('最多可输入1000个敏感词'))
      }
      callback()
    }
    return {
      loading: false,
      form: {
        sceneType: 1,
        desensitization: [],
        groupId: '', // 分组id
        groupName: '', // 分组名称
        teacherId: '', // 老师id
        teacherName: '', // 老师名称
        videoId: '', // 视频Id
        videoName: '' // 视频名称
      },
      rules: {
        sceneType: [
          { required: true, validator: validateSceneType, trigger: 'change' }
        ],
        desensitization: [
          {
            type: 'array',
            validator: validateDesensitization,
            required: true,
            trigger: 'change'
          }
        ]
      },
      classOption: [
        { label: 'IP老师', value: 1 },
        { label: '视频名称', value: 2 },
        { label: '分组名称', value: 3 }
      ],
      keyWord: ''
    }
  },
  mounted() {
    console.log('首次打开')
  },
  methods: {
    getVideoList(params) {
      console.log(params)
      const data = {
        pageIndex: params.current,
        pageSize: 10,
        teacherId: '',
        videoName: params.videoName,
        covertStatus: 2, // 1-转码中 2-转码成功 3-转码失败
        status: 1 // 1:启用 2禁用
      }
      return getVideoList(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    getTeacherList(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        teacherName: params.teacherName,
        serviceEnterprise: '',
        domainId: '',
        cooperateStatus: '',
        assessStatus: '',
        searchDateStart: '',
        searchDateEnd: '',
        createTimeBegin: '',
        createTimeEnd: '',
        assessResult: '',
        recommendName: '',
        createUserName: '',
        assessFlag: ''
      }
      return getTeacherList(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    selectedVideo(res) {
      this.form.videoId = res.videoId
      this.form.videoName = res.videoName
    },
    selectedTeacher(res) {
      this.form.teacherId = res.teacherId
      this.form.teacherName = res.teacherName
    },
    // 回车添加敏感词
    onhandleAdd() {
      try {
        if (!this.keyWord) {
          return
        }
        !this.form.desensitization.includes(this.keyWord) &&
          this.form.desensitization.push(this.keyWord)
        this.keyWord = ''
        this.$refs.form.clearValidate()
      } catch (err) {
        console.log(err)
      }
    },
    del(item, index) {
      this.form.desensitization.splice(index, 1)
    },
    onSubmit() {
      if (this.form.desensitization.length === 0) {
        return this.$message.error('请添加至少一个敏感词')
      }
      this.loading = true
      let groupName = this.form.groupName
      let groupId = this.form.groupId
      if (this.form.sceneType === 1) {
        groupName = this.form.teacherName
        groupId = this.form.teacherId
      } else if (this.form.sceneType === 2) {
        groupName = this.form.videoName
        groupId = this.form.videoId
      }
      const data = {
        content: this.form.desensitization,
        groupId,
        groupName,
        sceneType: this.form.sceneType
      }
      sensitiveGroupAdd(data)
        .then(res => {
          this.$message.success('添加成功')
          this.form.desensitization = []
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 提交数据
    sure() {
      if (this.keyWord) {
        this.form.desensitization.push(this.keyWord)
        this.keyWord = ''
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.onSubmit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .liveToolDesensitization {
    // height: 100%;
    flex: 1 0 0;
    overflow: hidden;
  }
  .liveToolDesensitization_scroll {
    height: 100%;
  }
  .form {
    padding: 0 15px 15px 15px;
  }
  .desensitizationBox {
    width: 100%;
    min-height: 100px;
    border-radius: 5px;
    border: 1px solid #dcdee1;
    background: #fff;
    padding: 5px;
    .desensitizationItem {
      // height: 34px;
      flex-shrink: 0;
      border-radius: 5px;
      background: #f7f7f7;
      padding: 8px 10px;
      line-height: 20px;
      float: left;
      word-break: break-all;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #333333;
      font-size: 14px;
      font-weight: bolder;
      .closeBtn {
        font-size: 10px;
        color: #999;
        cursor: pointer;
        font-weight: bolder;
        margin-left: 7px;
        &:hover {
          color: #ff1f00;
        }
      }
    }
  }
}
.footerBtn {
  width: 100%;
  height: 52px;
  min-height: 52px;
  max-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #dcdee1;
  background: #fff;
  .footerBtnSure {
    width: 70px;
    height: 32px;
    flex-shrink: 0;
    border-radius: 5px;
    background: #0c6fff;
    color: #fff;
    line-height: 32px;
    padding: 0;
  }
  .revoke {
    border: 1px solid #dcdfe5;
    background: #f9f9f9;
    color: #000000;
  }
}
::v-deep {
  .el-form-item {
    padding-bottom: 10px;
    margin-bottom: 0;
  }
  .el-form-item__label {
    color: #000000;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-weight: bolder;
    padding-bottom: 0;
  }
}
</style>
