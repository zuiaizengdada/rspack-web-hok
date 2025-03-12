<template>
  <el-dialog
    width="1095px"
    :title="`编辑${detailBaseInfo.personnelBaseInfo.name}亲属信息`"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="closeDialog"
  >
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="姓名" width="176">
          <template slot-scope="{ row }">
            <el-input
              v-model="row.name"
              clearable
              placeholder="请输入"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="关系" width="176">
          <template slot-scope="{ row }">
            <el-select
              v-model="row.relationship"
              clearable
              filterable
              placeholder="请选择"
              style="width: 100%"
              size="small"
            >
              <el-option
                v-for="item in relationshipOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="工作单位" width="267">
          <template slot-scope="{ row }">
            <el-input
              v-model="row.workUnit"
              clearable
              placeholder="请输入"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="职务" width="176">
          <template slot-scope="{ row }">
            <el-input
              v-model="row.position"
              clearable
              placeholder="请输入"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="联系电话" width="176">
          <template slot-scope="{ row }">
            <el-input
              v-model="row.phone"
              clearable
              placeholder="请输入"
              maxlength="11"
              @input="e => delNumber(e, row, 'phone')"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column prop="action" width="80">
          <template slot-scope="{ row, $index }">
            <el-button
              type="danger"
              size="small"
              @click="del(row, $index)"
              v-if="tableData.length > 1"
              :loading="loading"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="add"
          size="small"
          v-if="tableData.length < 3"
          >添加</el-button
        >
      </div>
    </div>
    <template slot="footer" class="dialog-footer">
      <el-button @click="closeDialog" :loading="loading">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading"
        >确 定</el-button
      >
    </template>
  </el-dialog>
</template>
<script>
import { modifyPersonnelKinshipAjax } from '@/api/businessAdmin/talentFile'
import { relationshipOption } from '@/views/businessAdmin/talentFile/options'

export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    info: {
      type: Array,
      default: () => {
        return []
      }
    },
    detailBaseInfo: {
      type: Object,
      default: () => {
        return {
          personnelBaseInfo: {}
        }
      }
    }
  },
  data() {
    return {
      rules: {
        postId: [
          {
            required: true,
            message: '请选择岗位',
            trigger: 'change'
          }
        ]
      },
      tableData: [],
      relationshipOption,
      loading: false
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  mounted() {
    this.tableData = JSON.parse(JSON.stringify(this.info))
  },
  methods: {
    // 只输入数字
    delNumber(e, row, key) {
      row[key] = e.replace(/[^0-9]/g, '')
    },
    submit() {
      const tableData = [...this.tableData].filter(
        item => Object.keys(item).length > 0
      )
      if (tableData.length === 0) {
        return this.$message.error('至少保留一条亲属信息')
      }

      const itemsWithMissingPhone = tableData.filter(item => !item.phone)
      if (itemsWithMissingPhone.length > 0) {
        return this.$message.error('请填写联系电话')
      }
      const kinshipList = tableData.map(item => {
        return {
          ...item,
          personnelBaseInfoId:
            this.detailBaseInfo.personnelBaseInfo?.personnelBaseInfoId
        }
      })
      const params = {
        kinshipList,
        personnelBaseInfoId:
          this.detailBaseInfo.personnelBaseInfo?.personnelBaseInfoId
      }
      this.loading = true
      modifyPersonnelKinshipAjax(params)
        .then(res => {
          if (res.code === 1) {
            this.$emit('success')
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    closeDialog() {
      this.$emit('close')
    },
    add() {
      this.tableData.push({})
    },
    del(row, $index) {
      this.tableData.splice($index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  border-radius: 10px;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e7e7e7;
}
::v-deep .el-dialog__body {
  padding: 10px 20px 30px 20px;
}
::v-deep th {
  padding: 6px 0 6px 0 !important;
}
::v-deep .cell {
  padding-right: 16px !important;
  padding-left: 0 !important;
}
::v-deep .el-table__cell {
  border-bottom: none !important;
}
::v-deep .el-table::before {
  height: 0;
}
</style>
