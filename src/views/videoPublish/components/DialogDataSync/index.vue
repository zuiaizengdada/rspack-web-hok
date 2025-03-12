<template>
  <div class="eslint-popover" :style="isFull?'z-index:2001':'z-index:-1'">
    <div v-if="visibleDialog" class="mask" />
    <div v-if="visibleDialog" :class="dataSyncStep===2 || dataSyncStep===3?'syncDialog syncDialog1':'syncDialog syncDialog2'">
      <div class="eslint-top">
        <div v-if="dataSyncStep===2 || dataSyncStep===3">数据同步</div>
        <div v-else />
        <div slot="title" class="closeTit">
          <!-- <i class="el-icon-minus m-r-16" @click="handleMinimize" /> -->
          <i class="el-icon-close" @click="handleClose" />
        </div>
      </div>
      <account-eslint v-show="dataSyncStep===1" :list="accountList" @eslint="accountSuccessEslint" />
      <account-select v-show="dataSyncStep===2" ref="accountSelect" :list="optionalList" @syncData="syncData" />
      <!-- <data-syncing v-show="dataSyncStep===3" :list="accountSuccessList" @allSyncResult="allSyncResult" />
      <data-sync-result v-show="dataSyncStep===4" :success-nums="successNums" :err-nums="errNums" :lose-efficacy="loseEfficacy" /> -->
      <account-empty v-show="dataSyncStep===5" @addGround="$emit('addGround')" />
    </div>
  </div>
</template>
<script>
import AccountEmpty from './AccountEmpty.vue'
import AccountSelect from './AccountSelect.vue'
import AccountEslint from './AccountEslint.vue'
// import DataSyncing from './DataSyncing.vue'
// import DataSyncResult from './DataSyncResult.vue'

import { querySyncInfo } from '../../publish/api/index'
export default {
  components: {
    AccountEmpty,
    AccountEslint,
    // DataSyncing,
    AccountSelect
    // DataSyncResult
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isFull: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dataSyncStep: 1,
      accountList: [],
      accountSuccessList: [],
      optionalList: [],
      loseEfficacy: 0,
      successNums: 0,
      errNums: 0,
      accountErrorList: []
    }
  },
  computed: {
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    visibleDialog(val) {
      if (val) {
        this.dataSyncStep = 1
        this.accountList = []
        this.getSyncInfo()
      }
    }
  },
  methods: {
    // 点击了关闭按钮
    handleClose() {
      this.$accountSelect && this.$accountSelect.clearQrySyncStatus()
      this.$emit('closeSync')
    },
    // 最小化弹窗
    handleMinimize() {
      this.$emit('handleMinimize')
    },
    async getSyncInfo() {
      const res = await querySyncInfo({ type: 2 })
      //
      this.accountList = res.data
      if (this.accountList.length < 1) {
        this.dataSyncStep = 5
      }
    },
    allSyncResult(success, err) {
      this.$emit('syncOver')
      this.successNums = success.length
      this.errNums = err.length
      this.loseEfficacy = this.accountErrorList.length > 0 ? this.accountErrorList.length : 0
      this.dataSyncStep = 4
      console.log(success, err, '数据同步之后所有的成功数组跟所有的失败')
    },
    syncData(data) {
      this.dataSyncStep = 3
      this.accountSuccessList = [...data]
      this.$refs.accountSelect.resetLoading()
    },
    accountSuccessEslint(data) {
      this.$emit('getList')
      if (data.successList.length < 1) {
        this.loseEfficacy = data.errorList.length
        this.dataSyncStep = 4
      } else {
        this.dataSyncStep = 2
        this.optionalList = [...data.successList, ...data.errorList]
        // this.accountSuccessList = data.successList
        // this.accountErrorList = data.errorList
      }
    }
  }
}
</script>
<style scoped lang="scss">
.eslint-top{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
  box-sizing: border-box;
  border-bottom: 1px solid #ebeef5;
}
.eslint-popover{
  position: fixed;
}
.syncDialog{
  min-height: 300px;
  background: #fff;
  position: fixed;
  top: 15vh;
  left: 50%;
  z-index:999;
  padding-bottom: 16px;
  box-sizing: border-box;
}
.syncDialog1{
  width: 1300px;
  margin-left: -650px;
}
.syncDialog2{
  width: 690px;
  margin-left: -345px;
}
.syncDialogFooter{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 24px;
}
.mask{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.40);
  z-index:9
}
.closeTit{
  text-align: right;
  padding: 10px;
  //display: flex;
  //align-items: center;
  //justify-content: end;
}
</style>
