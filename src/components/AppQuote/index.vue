<template>
  <AppDialog
    v-model="config.visible"
    :title="title"
    width="900px"
    height="465px"
    top="10vh"
    @success="successFn"
  >
    <div v-loading="loading" class="choose_resource">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="contentName" label="引用对象" />
        <el-table-column prop="goodsType" label="对象类型">
          <template slot-scope="{ row }">
            {{ goodsType_obj[row.goodsType] }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="gotoDetail(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="footer">
      <el-pagination
        :current-page="current"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="size"
        @current-change="handleCurrentChange"
      />
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { materialGoodsList } from '@/api/shop'
import { mapGetters } from 'vuex'
export default {
  name: 'AppClipboard',
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          id: ''
        }
      }
    }
  },
  data() {
    return {
      title: '引用位置',
      size: 10,
      current: 1,
      total: 0,
      tableData: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'goodsType_obj'
    ])
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          console.log(val, '打开弹框')
          this.init()
        }
      },
      deep: true
    }
  },
  methods: {
    successFn() {
      this.visible = false
    },
    getList() {
      this.loading = true
      const param = {
        size: this.size,
        current: this.current,
        materialId: this.config.id
      }
      materialGoodsList(param).then(res => {
        this.loading = false
        console.log(res, '获取引用位置列表')
        this.tableData = res.data.records
        this.total = res.data.total
      }).catch(() => {
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.current = val
      this.getList()
    },
    init() {
      this.current = 1
      this.tableData = []
      this.total = 0
      this.getList()
    },
    gotoDetail(row) {
      // const obj = {
      //   0: '/course/imageEdit/',
      //   1: '/course/audioEdit/',
      //   2: '/course/videoEdit/',
      //   3: '/course/columnEdit/',
      //   4: '/course/collegeColumnEdit/',
      //   5: '/course/offlineEdit/'
      // }
      // this.$router.push({ path: obj[row.goodsType] + row.goodsId })
      // window.open(window.location.origin + '#' + obj[row.goodsType] + row.goodsId, '_blank')
      console.log(row, 'row')
      const obj = {
        0: 'editImage',
        1: 'editAudio',
        2: 'editVideo',
        3: 'editColumn',
        4: 'editCollegeColumn',
        5: 'editOffline'
      }
      // // window.open(window.location.origin + `#${obj[row.goodsType]}${row.goodsId}`, '_blank')
      // if (row.goodsType === 5) {
      //   window.open(window.location.origin + `#/course/offlineEdit/${row.goodsId}`, '_blank')
      // } else {
      //   }
      this.$AppEditGoods({
        type: obj[row.goodsType],
        goodsId: row.goodsId,
        visible: true,
        width: '1200px',
        success: () => {
          this.getList()
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.choose_resource {
  padding: 20px;
}
.footer {
   display: flex;
    justify-content: center;
    align-items: center;
    margin-top: auto;
    width: 100%;
    height: 66px;
    background-color: #fafbfc;
    border-radius: 2px 2px 0 0;
}
</style>

