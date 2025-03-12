<template>
  <el-dialog title="修改记录" :visible.sync="visible">
    <el-table :data="gridData" height="400px">
      <el-table-column property="oldPhone" label="修改原手机号" width="150">
        <template slot-scope="{ row }">
          <tablePhoneItem
            v-model="row.oldPhone"
            :row-data="{id:row.id,type:'oldPhone'}"
            type="record"
          />
        </template>
      </el-table-column>
      <el-table-column property="phone" label="修改后手机号" width="150">
        <template slot-scope="{ row }">
          <tablePhoneItem
            v-model="row.phone"
            :row-data="{id:row.id,type:'phone'}"
            type="record"
          />
        </template>
      </el-table-column>
      <el-table-column property="remark" label="变更原因" />
      <el-table-column label="图片证据" property="url">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row&&scope.row.url"
            style="width: 50px; height: 50px"
            :src="scope.row?scope.row.url:''"
            :preview-src-list="[scope.row?scope.row.url:'']"
          />
        </template>
      </el-table-column>
      <el-table-column property="modifyBy" label="操作人" />
      <el-table-column property="createTime" label="操作时间" />
    </el-table>
  </el-dialog>
</template>
<script>
import { getPhoneRecord } from '@/api/user/member'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
export default {
  components: {
    tablePhoneItem
  },
  data: () => ({
    visible: false,
    gridData: [],
    uid: ''
  }),
  methods: {
    async getQuery(id) {
      const res = await getPhoneRecord({ platformUserId: id })
      if (res.code !== 1) return
      this.gridData = res.data
    },
    // handleCurrentChange(val) {
    //   console.log(val)
    // },
    open(row) {
      this.getQuery(row.id)
      this.uid = row.id
      this.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.paginationBox{
    display: flex;
    justify-content: flex-end;
}
</style>
