<template>
  <div class="case-container">
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      :get-list-api="getList"
    >
      <template #headerBtn>
        <el-button
          v-permission="['web:caseManage:seek', permsList]"
          type="primary"
          size="small"
          plain
          @click="caseLink"
        >寻找选题</el-button>
        <el-button
          v-permission="['web:caseManage:add', permsList]"
          type="primary"
          size="small"
          plain
          @click="openModel"
        >新增选题</el-button>
      </template>
      <template #action="{ row }">
        <el-button
          v-permission="['web:caseManage:detail', permsList]"
          type="text"
          @click="openDetail(row)"
        >详情</el-button>
        <el-button
          v-permission="['web:caseManage:edit', permsList]"
          type="text"
          @click="openModel(row)"
        >编辑</el-button>
        <!-- v-premission="['web:demandManage:delete',permsList]" -->
        <el-button
          class="delete-r"
          type="text"
          @click="deleteXt(row)"
        >删除</el-button>
      </template>
    </dynamicTable>
    <el-dialog class="delete-diloag" width="344px" :visible.sync="deleteFormDialog" :close-on-click-modal="false">
      <p><i class="delete-doloag-tip" /><span> 确认要删除该选题？</span></p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="deleteTheWnj">确 定</el-button>
        <el-button size="small" @click="deleteFormDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import { getColumns } from './column'
import { caseList, caseDelete } from '@/api/product/case'
import { getDomainData } from '@/utils/getApiData'
import { deptTree } from '@/api/addressBookApi'

// import { getTradeData, getDomainData } from '@/utils/getApiData'

export default {
  name: 'DemandManagement',
  components: {
    dynamicTable
  },
  data() {
    return {
      tableData: [],
      deleteFormDialog: false,
      columns: getColumns.call(this),
      permsList: this.$route.meta.permsList || [],
      nowChooseObj: {}
    }
  },
  created() {
    console.log('sssssssss: ', this.permsList)
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    async init() {
      const domainList = await getDomainData()
      this.columns.forEach((i) => {
        if (i.prop === 'fieldName') {
          i.formProps.options = domainList
        }
      })
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.columns.forEach((i) => {
        if (i.prop === 'deptName') {
          i.formProps.options = res.data
        }
      })

      const { teacherId, teacherName } = this.$route.query
      this.$nextTick(() => {
        if (teacherName && teacherId) {
          this.columns.forEach((i) => {
            if (i.prop === 'suitableTeachers') {
              i.formProps.remoteMethod(teacherName)
                .then(res => {
                  this.$refs.table.query = {}
                  i.formProps.options = res.data
                  i.formProps.defaultValue = teacherId
                  this.$refs.table.onRefresh({
                    suitableTeacherId: teacherId
                  })
                })
            }
          })
        } else {
          this.$refs.table.onRefresh()
        }
      })
    },
    deleteXt(row) {
      this.nowChooseObj = row
      this.deleteFormDialog = true
    },
    deleteTheWnj() {
      caseDelete(this.nowChooseObj.id).then(res => {
        if (res.success) {
          this.$message.success('删除成功！')
          this.deleteFormDialog = false
          this.$refs.table.onRefresh()
        }
      })
    },
    caseLink() {
      window.open(`${location.origin}/#/productManage/caseFinding`)
    },
    getList(params) {
      return caseList(params)
    },
    openModel(params) {
      const id = params.id || undefined
      this.$router.push({
        name: 'caseManageModal',
        query: { id }
      })
    },
    openDetail(row) {
      this.$router.push(`/caseManage/details/${row.id}`)
    },
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.case-container {
  height: calc(100vh - 90px);
  .delete-r {
    color: #F53F3F;
  }
}

::v-deep .el-dialog__wrapper{
    display: flex;
    padding: 24px;
    .el-dialog {
      border-radius: 10px;
      margin: auto!important;
      .el-dialog__header {
        border-bottom: 1px solid #ececec;
        .el-dialog__title {
          font-weight: bold;
        }
      }
      .el-dialog__body {
        padding: 20px 20px;
      }
    }
  }
.delete-diloag {
  border-radius: 10px;
    ::v-deep .el-dialog__header {
      border-bottom: none!important;
    }
  ::v-deep .el-dialog__wrapper{
    display: flex;
    padding: 24px;
    width: 344px;
    .el-dialog {
      border-radius: 10px;
      margin: auto!important;

    }
  }
}
  .delete-doloag-tip {
    float: left;
    width: 24px;
    height: 24px;
    background-image: url(../../../assets/image/video/icn_delete_tip.png);
    background-size: 100%;
    margin-right: 10px;
  }

</style>
