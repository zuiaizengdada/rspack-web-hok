<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      width="1058px"
      :before-close="handleClose"
      :title="title"
      :close-on-click-modal="false"
      top="5vh"
    >
      <waitingPersonForm
        :personnel-info-id="form.personnelBaseInfoId"
        v-if="isRefreshWaitingPersonForm"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleRejectAudt" :loading="loading"
          >驳 回</el-button
        >
        <el-button
          @click="handleSuccssAudt"
          type="primary"
          v-if="index === selectList.length - 1"
          :loading="loading"
          >通 过</el-button
        >
        <el-button
          @click="handleSuccssNextAudt"
          type="primary"
          v-else
          :loading="loading"
          >通过并审核下一份</el-button
        >
        <el-button @click="handleClose" :loading="loading">关 闭</el-button>
      </div>
    </el-dialog>
    <rejectAudtDialog
      :row="form"
      v-if="rejectAudtVisible"
      :visible.sync="rejectAudtVisible"
      @close="rejectAudtVisible = false"
      @success="rejectAudtSuccess"
    />
  </div>
</template>
<script>
import waitingPersonForm from '../../../waitingPersonForm.vue'
import rejectAudtDialog from './rejectAudtDialog.vue'
import { entryInfoAuditAjax } from '@/api/businessAdmin/talentFile'

export default {
  components: { waitingPersonForm, rejectAudtDialog },
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },
    selectList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      form: {},
      rejectAudtVisible: false,
      index: 0,
      title: '人事登记表',
      isRefreshWaitingPersonForm: true,
      loading: false
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('getVisible', val)
      }
    }
  },
  created() {
    this.form = { ...this.selectList[this.index] }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    submit() {
      this.$emit('submit', {
        ...this.post
      })
    },
    handleRejectAudt() {
      this.rejectAudtVisible = true
    },
    closerejectAudtDialog() {},
    submitRejectAudtDialog() {},
    //处理下一份
    handleNext() {
      if (this.index < this.selectList.length - 1) {
        this.index++
        this.form = { ...this.selectList[this.index] }
        this.isRefreshWaitingPersonForm = false
        this.$nextTick(() => {
          this.isRefreshWaitingPersonForm = true
        })
      }
    },
    handleSuccssNextAudt() {
      const params = {
        entryRegisterAuditStatus: 2,
        personnelBaseInfoId: this.form.personnelBaseInfoId
      }
      this.loading = true
      entryInfoAuditAjax(params)
        .then(res => {
          if (res.code === 1) {
            this.$emit('search')
            this.handleNext()
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSuccssAudt() {
      const params = {
        entryRegisterAuditStatus: 2,
        personnelBaseInfoId: this.form.personnelBaseInfoId
      }
      this.loading = true
      entryInfoAuditAjax(params)
        .then(res => {
          if (res.code === 1) {
            this.$emit('success')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    //驳回确定
    rejectAudtSuccess() {
      this.rejectAudtVisible = false
      if (this.index === this.selectList.length - 1) {
        //最后一个
        this.$emit('success')
      } else {
        this.$emit('search')
        this.handleNext()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 0 20px;
  h1 {
    font-size: 20px;
    color: #333;
    font-weight: 700;
  }

  .title {
    font-size: 16px;
    margin-bottom: 16px;
  }
}
.del {
  background-color: #f53f3f;
  color: #ffffff;
}
.dialog-footer {
  text-align: right;
}
.el-textarea__inner::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.el-textarea__inner::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}
.el-textarea__inner::-webkit-scrollbar-track {
  background-color: transparent;
}

.innerbox {
  max-height: 150px;
  overflow: auto;
}

// 滚动条整体样式
.innerbox::-webkit-scrollbar {
  width: 6px;
}
// 滚动条内嵌滑块
.innerbox::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
// 滚动条边角
.innerbox::-webkit-scrollbar-corner {
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
