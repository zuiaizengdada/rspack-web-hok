<template>
  <div class="groupChat">
    <el-button
      :loading="syncloading"
      size="small"
      class="btn_primary syncbtn"
      @click="syncWechatGroup"
      >手动同步最新数据</el-button
    >
    <el-table
      v-loading="loading"
      :data="tableData"
      class="tableBorder"
      border
      :header-cell-style="{ background: '#F2F9FF' }"
    >
      <el-table-column prop="name" label="群名称" width="142" />
      <el-table-column prop="owner" label="群主" width="135" />
      <el-table-column prop="groupMemberCount" label="群人数" width="91" />
      <el-table-column prop="joinTime" label="客户入群时间" />
      <el-table-column prop="chatCreateTime" label="群创建时间" />
    </el-table>
  </div>
</template>

<script>
import { getGroupList, syncWechatGroup } from '@/api/privateArea/clue'
export default {
  components: {},
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {
          age: '',
          avatar: '',
          corpAddress: '',
          corpName: '',
          description: '',
          externalUserId: '',
          followQwUserId: '',
          followWbUserId: '',
          gender: '',
          industries: '',
          mainBusiness: '',
          name: '',
          phone: '',
          position: '',
          relStatus: 0,
          remark: '',
          sparePhone: '',
          tags: [],
          wbExternalUserId: '',
          yearlyTurnover: ''
        }
      }
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      syncloading: false,
      tableData: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      console.log(this.userInfo, 'userino', this.data)
      this.loading = true
      const data = {
        wechatUserId: this.data[0].externalUserId
      }
      getGroupList(data)
        .then(res => {
          console.log(res)
          this.tableData = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    syncWechatGroup() {
      this.syncloading = true
      syncWechatGroup()
        .then(res => {
          this.getList()
          this.syncloading = false
        })
        .catch(() => {
          this.syncloading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.tableBorder {
  border-radius: 6px;
  width: 100%;
  margin-top: 16px;
}
.syncbtn {
  margin-bottom: 4px;
}
</style>
