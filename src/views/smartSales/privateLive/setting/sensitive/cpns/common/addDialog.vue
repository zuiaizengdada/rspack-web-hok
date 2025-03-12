<template>
  <AppDialog
    v-model="visible"
    :title="type === 'edit' ? '修改敏感词' : '新增敏感词'"
    width="540px"
    :loading="loading"
    height="auto"
    @success="handleClickOk"
    @close="handleClickCancel"
  >
    <el-form v-if="visible" ref="form" :model="form" :rules="rules" label-width="80px" size="mini" class="add-form">
      <el-form-item label="选择分类" :prop="form.sceneType === 3 ? 'groupName' :'groupId'">

        <div class="flex">
          <el-select v-model="form.sceneType" style="width:160px;margin-right:10px; " :disabled="isEditForm" @change="handleChangeSceneType">
            <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label" />
          </el-select>
          <template v-if="form.sceneType === 1">
            <el-select
              v-model="form.groupId"
              style="font-size: 14px"
              class="select-teacher"
              filterable
              clearable
              remote
              :remote-method="ipQueryByName"
              :popper-append-to-body="false"
              placeholder="请选择IP老师"
              :disabled="isEditForm"
              value-key="label"
              @change="ipChange"
            >
              <el-option
                v-for="item in ipOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <template v-else-if="form.sceneType === 2">
            <el-select
              v-model="form.groupId"
              style="font-size: 14px"
              class="select-teacher"
              filterable
              clearable
              remote
              :remote-method="videoQueryByName"
              :popper-append-to-body="false"
              placeholder="请搜索选择视频素材"
              :disabled="isEditForm"
              @change="ipChange"
            >
              <el-option
                v-for="item in ipOptions"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <template v-else-if="form.sceneType === 3">
            <el-input
              v-model="form.groupName"
              placeholder="请输入分组名称"
              :disabled="isEditForm"
            />
          </template>
        </div>
      </el-form-item>
      <el-form-item label="敏感词" prop="content">
        <p>输入回车即代表一个敏感词</p>
        <el-input
          v-model.trim="keyWord"
          class="m-b-10"
          style="width: 100%"
          placeholder="输入回车即代表一个敏感词"
          @keyup.enter.native="onhandleAdd"
        />
        <div v-if="form.content.length > 0" class="desensitizationBox clearfix">
          <div
            v-for="(item, index) in form.content"
            :key="index"
            class="desensitizationItem m-b-10 m-r-10"
          >
            {{ item }}
            <i class="el-icon-close closeBtn" @click="del(item, index)" />
          </div>
        </div>
      </el-form-item>
    </el-form>
  </AppDialog>
</template>
<script>
import { cloneDeep } from 'lodash'
import AppDialog from '@/components/AppDialog'
import { teacherQueryByName } from '@/api/tearchCenter'
import {
  sensitiveGroupAddApi,
  sensitiveGroupEditCheckApi,
  getVideoInfo
} from '@/api/liveRoom/sensitive'
export default {
  components: {
    AppDialog
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  inject: ['changeType'],
  data() {
    return {
      loading: false,
      visible: false,
      options: [
        // { label: '通用敏感词', value: 0 },
        { label: 'IP老师', value: 1 },
        { label: '视频名称', value: 2 },
        { label: '分组名称', value: 3 }
      ],
      ipOptions: [],
      rules: {},
      isEditForm: false,
      form: {
        sceneType: '',
        groupId: '',
        groupName: '',
        content: []
      },
      oldSceneType: '',
      inputVisible: false,
      keyWord: '',
      type: 'add' // 类型
    }
  },
  watch: {
    'form.sceneType': {
      handler(val) {
        if (val) {
          if (this.type !== 'add') return
          const rule = {}
          if (val === 3) {
            rule['groupName'] = [
              { required: true, message: '请输入分组名称', trigger: 'blur' }
            ]
          } else {
            rule['groupId'] = [
              { required: true, message: `请选择${val === 1 ? 'IP老师' : '视频名称'}`, trigger: 'change' }
            ]
          }
          rule['content'] = [{ required: true, validator: this.contentValid }]
          this.rules = rule
          this.form.groupId = ''
          this.form.groupName = ''
          this.ipOptions = []
          this.$nextTick(() => {
            this.$refs?.form?.clearValidate(['groupName', 'groupId', 'content'])
          })
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.data && Object.keys(this.data).length) {
      this.form = this.data
      this.isEditForm = true
    }
  },
  methods: {
    // 回车添加敏感词
    onhandleAdd() {
      try {
        if (!this.keyWord) {
          return
        }
        !this.form.content.includes(this.keyWord) &&
          this.form.content.push(this.keyWord)
        this.keyWord = ''
        this.$refs.form.clearValidate()
      } catch (err) {
        console.log(err)
      }
    },
    del(item, index) {
      this.form.content.splice(index, 1)
    },
    handleClose(tag) {
      this.form.content.splice(this.form.content.indexOf(tag), 1)
    },
    openDialog(data) {
      console.log('data-------', data)
      this.keyWord = ''
      this.type = data.type || 'add'
      if (data.type === 'add') {
        this.isEditForm = false
        this.form = {
          sceneType: data.sceneType,
          groupId: '',
          groupName: '',
          content: []
        }
        this.oldSceneType = data.sceneType
      } else {
        this.isEditForm = true
        this.ipOptions = [{ label: data.form.groupName, value: data.form.groupId }]
        this.form = data.form
        this.ipOptions = [
          { label: data.form.groupName,
            value: data.form.groupId }
        ]
        this.oldSceneType = data.form.sceneType
      }
      console.log('ipOptions=----', data.type, this.ipOptions)

      this.visible = true
    },
    handleChangeSceneType() {

    },
    contentValid(rule, value, callback) {
      if (!value) {
        callback(new Error('敏感词不能为空'))
      } else {
        // .split(/[\n]/g).filter(Boolean)
        const arr = value
        if (arr.length) {
          if (arr.length > 1000 || arr.some(v => v.length > 10)) {
            callback(new Error('敏感词每个词最大10个字,上限1000个'))
          }
          callback()
        } else {
          callback(new Error('请输入敏感词'))
        }
      }
    },

    handleClickOk() {
      if (this.loading) return
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            const req = cloneDeep(this.form)
            // req.content = req.content.split(/[\n]/g).filter(Boolean)
            console.log(req.content, 'content')
            let isOverMaxLength = false
            req.content.forEach(item => {
              isOverMaxLength = item.length > 10
            })
            if (isOverMaxLength) {
              this.$message.error('敏感词长度不能超过10个字符')
              return
            }
            if (req.content.length > 1000) {
              this.$message.error('敏感词不能超过1000个')
              return
            }
            this.loading = true
            const apiFn =
              this.type === 'edit'
                ? sensitiveGroupEditCheckApi
                : sensitiveGroupAddApi
            const { success, errorMsg } = await apiFn(req)
            if (success) {
              console.log(this.oldSceneType, req.sceneType, 'this.oldSceneType-----')
              console.log(this.changeType)
              if (this.oldSceneType !== req.sceneType) {
                this.changeType(['', 'IpTp', 'VideoTp', 'groupTp'][req.sceneType])
              } else {
                this.$emit('search')
              }
              this.handleClickCancel()
            } else {
              this.$message.error(errorMsg || '操作失败')
            }
          } catch (error) {
            this.$message.error(error.errorMsg || '操作失败')
          }
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClickCancel() {
      this.ipOptions = []
      this.$refs.form.resetFields()
      this.visible = false
      this.isEditForm = false
    },
    // IP
    ipQueryByName(query) {
      teacherQueryByName({ name: query }).then(res => {
        this.ipOptions = res.data.map(item => {
          return {
            value: item.teacherId,
            label: item.teacherName
          }
        })
      })
    },
    // 视频素材
    videoQueryByName(query) {
      getVideoInfo({ name: query }).then(res => {
        this.ipOptions = res.data.map(item => {
          return {
            value: item.videoId,
            label: item.videoName
          }
        })
      })
    },
    ipChange(value) {
      if (value) {
        // 处理选择变化的逻辑
        const obj = this.ipOptions.find(item => item.value === value)
        this.form.groupName = obj.label
        // 你可以在这里添加更多的逻辑
      } else {
        this.form.groupName = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.add-form {
  padding: 20px 20px 0 20px;
}
.desensitizationBox {
  width: 100%;
  min-height: 100px;
  border-radius: 5px;
  border: 1px solid #dcdee1;
  background: #fff;
  padding: 5px;
  max-height: 400px;
  overflow-y: auto;
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
</style>
