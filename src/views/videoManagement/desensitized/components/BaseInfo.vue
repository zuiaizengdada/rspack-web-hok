<template>
  <div class="base-info mb-6">
    <base-title title="视频组基本信息" />
    <ul v-if="['detail','upload'].includes(origin)" class="detail-wapper flex flex-wrap">
      <li v-for="item in deatilData" :key="item.name" class="flex">
        <label>{{ item.name }}</label>
        <span>{{ computedDetailLabel(item) || '--' }}</span>
      </li>
    </ul>
    <el-form v-else ref="form" :model="form" label-width="120px" :rules="rules">
      <div class="flex">
        <el-form-item label="视频组标题" prop="title" class="width460" style="margin-right:110px;">
          <el-input v-model="form.title" placeholder="请输入2~30个字符视频组标题" class="width300" maxlength="30" :disabled="isEditTitle" filterable clearable show-word-limit />
        </el-form-item>
        <el-form-item label="IP" class="width460 relative" prop="teacherId">
          <filterSelectSingle ref="filterSelectSingle" class="width300" :placeholder-str="'请选择IP'" :disabled="origin==='edit'" @handleChange="changeHanldeTeacher" />
          <p class="error-tips">一旦确认选择，将不能更改，请谨慎操作</p>
        </el-form-item>
      </div>
      <div class="flex">
        <el-form-item label="交付场景" prop="sceneId" class="width460" style="margin-right:110px;">
          <el-select v-model="form.sceneId" filterable class="width300" :remote-method="getSenceOptions" clearable>
            <el-option v-for="item in senceOptions" :key="item.id" :label="item.sceneName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="视频组类型" prop="isMultiCamera" class="width460 relative">
          <el-select v-model="form.isMultiCamera" class="width300" clearable :disabled="origin==='edit'" @change="changeVideoGroup">
            <el-option v-for="item in videoGroupTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <p class="error-tips" style="color: #3e3e3e;">视频组类型，影响后续视频上传和视频脱敏规则，请请谨慎选择</p>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import BaseTitle from './Common/BaseTitle.vue'
import { baseDetailKeys } from './constants'
import { searchDeliveryData } from '@/api/product/setting'
import { teacherQueryByName } from '@/api/tearchCenter/index'
import { planFinalizedList } from '@/api/videoManagement/origin'
import filterSelectSingle from '@/components/filterSelectSingle/index.vue'
import _ from 'lodash'
const page = {
  pageIndex: 1,
  pageSize: 100
}
export default {
  components: {
    BaseTitle,
    filterSelectSingle
  },
  props: {
    origin: {
      type: String,
      default: 'add'
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        title: '',
        teacherId: '',
        sceneId: '',
        isMultiCamera: '',
        planId: ''
      },
      deatilData: [],
      senceOptions: [],
      teacherOptions: [],
      planOptions: [],
      videoGroupTypeOptions: [
        { label: '多机位视频组', value: 2 },
        { label: '单机位视频组', value: 1 }
      ],
      rules: {
        title: [{ required: true, message: '请输入视频组标题', trigger: 'blur' }, { min: 2, max: 30, message: '请输入2~30个字符视频组标题', trigger: 'blur' }],
        isMultiCamera: [{ required: true, message: '请选择视频组类型', trigger: 'change' }],
        sceneId: [{ required: true, message: '请选择交付场景', trigger: 'change' }]
      },
      isEditTitle: false,
      loading: false,
      isDataChangeCount: 0
    }
  },

  watch: {
    data(val) {
      this.form = val
      if (this.origin === 'edit') {
        this.isEditTitle = val.isShare
        this.getPlanFinalizedList()
        this.getSenceOptions()
        this.$refs.filterSelectSingle.defaultSelect(val.teacherId)
      }
      // 如果是多机位  删除key是reserveInterval的数据
      if (val.isMultiCamera === 2) {
        this.deatilData = this.assiginListValueBoObjectKey(val, baseDetailKeys).filter(item => item.key !== 'reserveInterval')
      } else {
        this.deatilData = this.assiginListValueBoObjectKey(val, baseDetailKeys)
      }
    },
    form: {
      handler(val) {
        this.isDataChangeCount++
      },
      deep: true
    }
  },
  mounted() {
    this.getTeacherOptions()
    if (['add'].includes(this.origin)) {
      this.getSenceOptions()
    }
  },
  methods: {
    async getTeacherOptions() {
      const res = await teacherQueryByName({ name: '' })
      this.teacherOptions = res.data
    },
    changeVideoGroup(val) {
      this.$emit('changeVideoGroup', val)
    },
    async getSenceOptions(query) {
      const { data } = await searchDeliveryData({ sceneName: query, ...page })
      const index = _.findIndex(data.items, { id: this.form.sceneId })
      this.senceOptions = data.items.filter(item => {
        return item.status === 1
      })
      if (this.origin === 'edit') {
        if (index < 0) {
          this.senceOptions.push({
            id: this.form.sceneId,
            sceneName: this.form.sceneName
          })
        } else {
          if (!data.items[index].status) {
            this.senceOptions.push(data.items[index])
          }
        }
      }
    },
    async getPlanFinalizedList() {
      const res = await planFinalizedList({ teacherId: this.form.teacherId })
      this.planOptions = res.data
    },
    async changeHanldeTeacher(val) {
      this.getPlanFinalizedList()
      this.form.teacherId = val
      this.form.planId = ''
      this.$emit('changeTeacher', val)
    },
    validateForm() {
      let isValid = false
      this.$refs.form.validate((valid) => {
        if (valid) {
          isValid = true
        }
      })
      return isValid
    },
    assiginListValueBoObjectKey(object, list) {
      return list.map(item => {
        return { ...item, value: object[item.key] }
      })
    },
    computedDetailLabel(item) {
      console.log(this.deatilData, '要展示的详情数据')
      let value = item.value
      if (item.key === 'reserveInterval') {
        value = `时长阈值${this.data?.videoTabRuleReq?.duration}秒  预留间隙${this.data?.videoTabRuleReq.reserveInterval}秒`
      }
      if (item.key === 'isMultiCamera') {
        value = item.value === 2 ? '多机位视频组' : '单机位视频组'
      }
      return value
    }
  }
}
</script>
<style lang="scss" scoped>
.base-info{
    padding-top:20px;
    line-height: 1;
}
.detail-wapper{
    background: #F7FBFF;
    border-radius: 8px;
    padding:16px 12px 0 12px;
    li{
        margin-bottom:20px;
        font-size:14px;
        width:33%;
        label{
            color:#777;
            margin-right:8px;
            width:100px;
            text-align: right;
            font-weight: normal;
        }
        span{
            color:#333;
        }
    }
}
.error-tips{
  color:#F53F3F;
  font-size:12px;
  position: absolute;
  left:310px;
  top:0;
  width: 100%;
}
</style>
