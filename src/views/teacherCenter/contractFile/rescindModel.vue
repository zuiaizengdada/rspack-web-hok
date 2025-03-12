<template>
  <!-- 解除合同详情弹框 -->
  <AppDialog v-model="config.visible" title="解除合同详情" width="916px" height="558px">
    <div v-loading="loading" class="rescindContent overflowOuto">
      <el-form ref="ruleForm" :model="form" label-width="100px">
        <el-form-item prop="teacherName">
          <span slot="label" class="teacherName">{{ form.teacherName }}</span>
          <span class="teacherLabel">{{ form.teacherId }}</span>
        </el-form-item>
        <el-form-item label="解除日期" prop="contractTerminateTime">
          <span class="formValue">{{ form.contractTerminateTime | parseTime('{y}-{m}-{d}') }}</span>
        </el-form-item>
        <el-form-item label="解除合同" prop="teacherContractMediaList">
          <!-- 解除合同 -->
          <div class="teacherContractMediaList">
            <imgShow v-for="(item, index) in form.teacherContractMediaList" :key="index" :url="item.fileUrl" />
          </div>
        </el-form-item>
        <el-form-item label="解除原因" prop="terminateReason">
          <span v-html="form.terminateReason.replace(/\n/g, '<br />')" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import imgShow from '../components/imgShow.vue'
import { getTeacherContarctTerminateDetail } from '@/api/tearchCenter'
export default {
  components: {
    AppDialog,
    imgShow
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          contractCode: '' // 合同id
        }
      }
    }
  },
  data() {
    return {
      loading: true,
      form: {
        teacherContractMediaList: [],
        contractTerminateTime: '',
        terminateReason: '',
        teacherId: '',
        teacherName: ''
      }
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        val && this.getDetail()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    // 获取解除合同详情
    getDetail() {
      this.loading = true
      const params = {
        contractCode: this.config.contractCode
      }
      getTeacherContarctTerminateDetail(params)
        .then((res) => {
          this.form = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.rescindContent {
  width: 916px;
  height: 558px;
  padding: 20px;
  box-sizing: border-box;
}
.teacherName {
  font-size: 20px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: rgba(51, 51, 51, 0.9);
  line-height: 28px;
}
.teacherLabel {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
.formValue {
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #333;
  line-height: 24px;
}
::v-deep {
  .el-form-item__label {
    color: #777777;
  }
}
.teacherContractMediaList {
  display: flex;
  flex-wrap: wrap;
}
</style>
