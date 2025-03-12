<template>
  <el-dialog title="选择标签" :visible.sync="visible" width="900px" :close-on-click-modal="false" :destroy-on-close="true" @close="handleClose">
    <div>
      <div class="title">常用标签</div>

      <div class="tagsBox tagsBox1">
        <div
          v-for="(item) in historyTag"
          :key="item.tagId"
          :class="{ 'active': chooseTagList.some(tag => tag.id === item.id) }"
          @click="handleChoose(item)"
        ><span>{{ item.tagName }}</span></div>
      </div>
      <div class="title">查找标签</div>
      <div class="inputBox">
        <el-input
          v-model="state"
          placeholder="请输入标签"
          size="small"
          :style="{ width: '450px' }"
          @keyup.enter.native="handleSearch"
        />
        <el-button
          type="primary"
          size="small"
          @click="handleSearch"
        >查询</el-button>
        <el-button
          size="small"
          @click="handleClear"
        >重置</el-button>
      </div>
      <div class="tagsBox tagsBox1">
        <div
          v-for="(item) in TagOptions"
          :key="item.tagId"
          :class="{ 'active': chooseTagList.some(tag => tag.id === item.id) }"
          @click="handleChoose(item)"
        ><span>{{ item.tagName }}</span></div>
      </div>
      <div class="title">选中标签</div>
      <div class="tagsBox">
        <el-tag
          v-for="(item) in chooseTagList"
          :key="item.tagId"
          size="small"
          closable
          :disable-transitions="true"
          @close="handleCloseTag(item)"
        >{{ item.tagName }}</el-tag>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getSaleTaskList, queryTagInfoCache } from '@/api/privateArea/CRM.js'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    platformUserId: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    state: '',
    historyTag: [],
    TagOptions: [],
    chooseTagList: []
  }),
  watch: {
    visible: {
      handler: function() {
        if (this.visible) {
          this.getHistoryTag()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async getHistoryTag() {
      await queryTagInfoCache().then(res => {
        this.historyTag = res.data.map(i => ({ ...i, id: i.tagId, isCompany: i.tagType === 2 }))
      })
    },
    getList(tagName = '') {
    //   const type = {
    //     my: 2,
    //     department: 3,
    //     all: 1
    //   }
      const params = {
        pageIndex: 1,
        pageSize: 50,
        tagName,
        sync: true
      }
      getSaleTaskList(params).then(res => {
        this.TagOptions = res.data.items
      })
    },
    handleClose() {
      // this.state = ''
      // this.chooseTagList = []
      // this.TagOptions = []
      this.$emit('update:visible', false)
    },
    handleOk() {
      localStorage.setItem('tagName', JSON.stringify(this.chooseTagList))
      this.$emit('handleChooseTag', this.chooseTagList)
      this.$emit('update:visible', false)
    },
    async handleSearch() {
      if (!this.state) return this.$message.warning('请输入标签！')
      this.getList(this.state)
    },
    handleClear() {
      this.state = ''
      this.chooseTagList = []
      this.TagOptions = []
    },
    handleChoose(item) {
      if (this.chooseTagList.some(tag => tag.id === item.id)) {
        return
      }
      if (this.chooseTagList.length >= 5) {
        return this.$message.warning('最多只能选择5个标签！')
      }
      this.chooseTagList.push(item)
    },
    handleCloseTag(item) {
      this.chooseTagList = this.chooseTagList.filter(tag => tag.id !== item.id)
    }
  }
}
</script>
  <style lang="scss" scoped>
  ::v-deep {
    .el-dialog__body {
      padding: 10px 20px 30px;
    }
  }
  .inputBox {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    > button {
      margin-left: 5px;
      height: 31px;
    }
  }
  .tagsBox {
    width: 100%;
    background: #ffffff;
    border-radius: 6px;
    margin-top: 10px;
    span {
        line-height: 38px;
        height: 38px;
        margin-right: 16px;
        margin-bottom: 10px;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        background: #F7F7F7;
        cursor: pointer;
    }
  }
  .tagsBox1 {
    max-height: 140px;
    overflow-y: auto;
     span {
        display: inline-block;
        background: #F7F7F7;
        padding: 0 8px;
        color: #000000;
        text-align: center;
        font-size: 14px;
    }
    div{display: inline-block;
      &.active{
        span{
            background: linear-gradient(90deg, #CEE2FF 0%, #BCC9FF 100%);
        }
      }
    }
  }
  .title {
    color: #000000;
    font-family: "Microsoft YaHei";
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 14px;
    margin-bottom: 20px;
    margin-top: 10px;
  }
  </style>
