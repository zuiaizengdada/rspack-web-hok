<template>
  <div class="familyInfo-container">
    <div class="familyInfo-top">
      <el-button class="familyInfo-editbtn" @click="editFamilyInfoDialog">
        <div class="editbtn-container">
          <img :src="editIcon" class="editbtn" /><span>&nbsp;编辑</span>
        </div>
      </el-button>
    </div>
    <baseTable
      key="familyTable"
      :table-data="detailBaseInfo.personnelKinshipList"
      :table-columns="familyConfig.tableColumns"
      v-loading="loading"
      style="height: 150px; margin-top: 16px"
    ></baseTable>
    <familyInfoDialog
      v-if="familyInfoDialogVisiable"
      :detailBaseInfo="detailBaseInfo"
      :info="detailBaseInfo.personnelKinshipList"
      :visible.sync="familyInfoDialogVisiable"
      @close="familyInfoDialogVisiable = false"
      @success="handleFamilyInfoSuccessDialog"
    >
    </familyInfoDialog>
  </div>
</template>
<script>
import baseTable from './baseTable.vue'
import { getFamilyColumns } from './columns'
import familyInfoDialog from './familyInfoDialog.vue'
import editIcon from '@/assets/image/oa/edit.png'

export default {
  components: {
    baseTable,
    familyInfoDialog
  },
  props: {
    detailBaseInfo: {
      type: Object,
      default: () => {
        return {
          personnelKinshipList: [],
          personnelBaseInfo: {}
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      familyConfig: {
        tableColumns: getFamilyColumns.call(this),
        tableData: this.detailBaseInfo.personnelKinshipList
      },
      familyInfoDialogVisiable: false,
      editIcon
    }
  },
  methods: {
    editFamilyInfoDialog() {
      this.familyInfoDialogVisiable = true
    },
    handleFamilyInfoSuccessDialog() {
      this.familyInfoDialogVisiable = false
      this.$emit('refresh')
    }
  }
}
</script>

<style lang="scss" scoped>
.familyInfo-container {
  border-radius: 10px;
  margin-bottom: 16px;
  border: 1px solid #f2f2f2;
  .familyInfo-top {
    margin: 16px 16px 0 0;
    text-align: right;
  }
  .familyInfo-editbtn {
    width: 90px;
    height: 32px;
    border-color: #0c6fff;
    color: #0c6fff;
    .editbtn-container {
      display: flex;
      align-items: center;
      margin-top: -2px;
    }
    .editbtn {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
