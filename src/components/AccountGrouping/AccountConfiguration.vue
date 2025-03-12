<template>
  <AppDialog :height="'495px'" :width="'694px'" :value="visible" :title="'完善账号信息'" @success="submit()" @close="close()">
    <div class="content">
      <div class="top-info">
        <img src="http://tiebapic.baidu.com/forum/w%3D580/sign=9d3fa8074dfa513d51aa6cd60d6f554c/be9cbf5594eef01f3699251ea5fe9925bd317d6b.jpg?tbpicau=2023-03-08-05_63ddd71c18d0bd5caa488512ed575580">
        <div class="top-name">{{ form.name }}</div>
      </div>
      <div class="form-list">
        <el-form ref="ruleform" :rules="rules" :inline="true" :model="form" class="demo-form-inline" label-width="100px">
          <div>
            <el-form-item label="平台">
              <el-input v-model="form.terrace" placeholder="平台名称" class="w-200" disabled />
            </el-form-item>
            <el-form-item label="账号ID">
              <el-input v-model="form.id" placeholder="账号ID" class="w-200" disabled />
            </el-form-item>
          </div>
          <div>
            <el-form-item label="账号UID">
              <el-input v-model="form.uid" placeholder="账号UID" class="w-200" disabled />
            </el-form-item>
            <el-form-item label="电话号码">
              <el-input v-model.trim="form.phoneNumber" type="tel" class="w-200" maxlength="11" :min="0" @input="(e) => delNoNumber(e, 'phoneNumber')" />
            </el-form-item>
          </div>
          <div>
            <el-form-item label="运营者" prop="operatorId">
              <el-select v-model="form.operatorId" placeholder="请选择" class="w-200">
                <el-option label="区域一" value="shanghai" />
                <el-option label="区域二" value="beijing" />
              </el-select>
            </el-form-item>
            <el-form-item label="达人老师" prop="teacherIds">
              <el-select v-model="form.teacherIds" placeholder="请选择" class="w-200" multiple>
                <el-option
                  v-for="item in teacherList"
                  :key="item.lecturerId"
                  :label="item.lecturerName"
                  :value="item.lecturerId"
                />
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="分组">
              <el-select v-model="form.groups" placeholder="请选择" class="w-200">
                <el-option label="区域一" value="shanghai" />
                <el-option label="区域二" value="beijing" />
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getTeacherList } from '@/api/shop'

export default {
  name: 'AccountConfiguration',
  components: {
    AppDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => {
        return {
          name: '张琦新商业咨询',
          terrace: '抖音',
          id: '10086',
          uid: '10000000000086',
          phoneNumber: 15581117696,
          operatorId: '',
          teacherIds: [],
          groups: ''
        }
      }
    }
  },
  data() {
    return {
      teacherList: [],
      rules: {
        operatorId: [
          { required: true, message: '请选择运营者', trigger: 'change' }
        ],
        teacherIds: [
          { required: true, message: '请选择达人老师', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getTeacherList()
  },
  methods: {
    delNoNumber(e) {
      this.form.phoneNumber = e.replace(/[^0-9]/g, '')
    },
    close() {
      this.$emit('close')
    },
    async getTeacherList() {
      const { data } = await getTeacherList()
      this.teacherList = data
      console.log(data)
    },
    submit() {
      this.$refs['ruleform'].validate((valid) => {
        if (valid) {
          alert('submit!')
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
.content{
  display: flex;
  flex-direction: column;
  align-items: center;
  .form-list{
    margin-top: 24px;
  }
}
.top-info{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  .top-name{
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    margin-top: 10px;
  }
  img{
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
}
</style>
