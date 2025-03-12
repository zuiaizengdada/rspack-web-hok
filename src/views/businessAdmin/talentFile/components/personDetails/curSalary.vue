<template>
  <div class="curSalary-container">
    <div>
      当前薪资
      <i
        class="pointer"
        :class="loading && !ifReal ? 'el-icon-loading' : 'el-icon-view'"
        @click="onClick"
      />
    </div>
    <div class="curSalary-item">
      <span class="c_666">试用期薪资</span>：<span class="c_000 f_w_500">{{
        toFixedTwo(form.probationSalary)
      }}</span>
    </div>
    <div class="curSalary-item">
      <span class="c_F53F3F">约定转正薪资</span>：<span class="c_000 f_w_500">{{
        toFixedTwo(form.agreedRegularSalary)
      }}</span>
      <span v-if="form.agreedRegularSalaryMax" class="c_000 f_w_500">
        {{ '-' + toFixedTwo(form.agreedRegularSalaryMax) }}</span
      >
    </div>
  </div>
</template>

<script>
import { personnelDetailSalaryAjax } from '@/api/businessAdmin/talentFile'

export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    detailBaseInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      ifReal: false,
      loading: false,
      form: {
        probationSalary: '******',
        agreedRegularSalary: '******',
        agreedRegularSalaryMax: ''
      }
    }
  },
  methods: {
    personnelDetailSalary() {
      const params = {
        personnelInfoId: this.detailBaseInfo.personnelInfoId
      }
      this.loading = true
      personnelDetailSalaryAjax(params)
        .then(res => {
          if (res.code === 1) {
            this.form = {
              probationSalary: res.data?.probationSalary,
              agreedRegularSalary: res.data?.agreedRegularSalary,
              agreedRegularSalaryMax: res.data?.agreedRegularSalaryMax
            }
            this.ifReal = true
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    onClick() {
      if (this.ifReal === false) {
        this.personnelDetailSalary()
      } else {
        this.ifReal = false
        this.form = {
          probationSalary: '******',
          agreedRegularSalary: '******',
          agreedRegularSalaryMax: '******'
        }
      }
    },
    toFixedTwo(num) {
      if (num === '******') {
        return '******'
      }
      return num ? `${num.toFixed(2)}元` : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.curSalary-container {
  display: flex;
  align-items: center;
  height: 32px;
  border-radius: 10px;
  border: 1px solid #f2f2f2;
  margin-bottom: 16px;
  padding: 0 16px;
  font-size: 14px;
  .curSalary-item {
    margin-left: 46px;
  }
}
.pointer {
  color: #2c82ff;
}
.c_000 {
  color: #000;
}
.f_w_500 {
  font-weight: 500;
}
.c_666 {
  color: #666;
}
</style>
