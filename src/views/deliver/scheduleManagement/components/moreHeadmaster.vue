<template>
  <!-- 更多班主任弹框 -->
  <AppDialog
    v-model="config.visible"
    title="更多班主任"
    width="694px"
    height="510px"
  >
    <div class="moreHeadmaster overflowOuto">
      <div class="listView">
        <div v-for="(item, index) in list" :key="index" class="listLi">
          <el-tooltip class="item" effect="dark" :content="item.userName" placement="top-start">
            <div class="text_hidden_1">{{ item.userName }}</div>
          </el-tooltip>
          <el-switch :value="item.remindFlag" :disabled="disabled" :active-value="2" :inactive-value="1" @click.native="$emit('remindChange', item)" />
          <i v-if="del" class="el-icon-close m-l-8 delBtn" @click="$emit('del', item)" />
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <div slot="footer" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          data: []
        }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    del: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageSize: 36,
      currentPage: 1,
      total: 0,
      list: []
    }
  },
  computed: {},
  watch: {
    'config.visible'(val) {
      console.log(val)
      if (val) {
        this.currentPage = 1
        this.list = this.config.data.slice(this.pageSize * (this.currentPage - 1), this.currentPage * this.pageSize)
        this.total = this.config.data.length
      } else {
        this.currentPage = 1
        this.list = []
      }
    }
  },
  mounted() {},
  methods: {
    handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val
      this.list = this.config.data.slice(this.pageSize * (this.currentPage - 1), this.currentPage * this.pageSize)
    },
    refresh() {
      this.list = this.config.data.slice(this.pageSize * (this.currentPage - 1), this.currentPage * this.pageSize)
      this.total = this.config.data.length
      if (this.list.length === 0 && this.currentPage > 1) {
        this.currentPage = this.currentPage - 1
        this.refresh()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.moreHeadmaster {
  height: 510px;
  padding: 16px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .listView {
    flex: 1 0 0;
    .listLi {
      float: left;
      padding: 4px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 143px;
      height: 32px;
      background: #E6F4FF;
      border-radius: 4px;
      margin-right: 26px;
      margin-top: 8px;
      margin-bottom: 8px;
      .text_hidden_ellipsis {
          width: 163px;
      }
      &:nth-child(4n + 4) {
          margin-right: 0!important;
      }
      .delBtn {
          margin-top: 3px;
          cursor: pointer;
          &:hover {
              color: #5cb6ff;
          }
      }
    }
  }
  .pagination {
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
