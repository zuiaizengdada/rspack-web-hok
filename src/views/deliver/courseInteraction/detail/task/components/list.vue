<template>
  <div class="select-left">
    <div class="select-left-title">
      日记总数：{{ total }}
    </div>
    <div class="select-left-btn">
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
        >全选</el-checkbox
      >
      <el-button
        :disabled="!checkedCities.length"
        type="primary"
        plain
        size="mini"
        @click="handleEditAll"
          v-permission="['homework-task-comment', permsList]"  
        >批量点评</el-button
      >
    </div>
    <div style="margin: 15px 0"></div>
    <div
      class="select-left-checkBox-group"
      ref="scrollContainer"
      v-if="list.length"
    >
      <el-checkbox-group
        v-model="checkedCities"
        @change="handleCheckedCitiesChange"
      >
        <div v-for="item in list" :key="item.id" class="select-left-checkBox">
          <div class="select-left-checkBox-left">
            <el-checkbox :label="item.id" name=""></el-checkbox>
            <img :src="item.headImg" alt="" />
            <div class="taps">
              <p>{{ item.userName }}</p>
              <p>{{ item.content }}</p>
            </div>
          </div>
          <p class="select-left-checkBox-rigt">{{ item.createdAt }}</p>
        </div>
      </el-checkbox-group>
      <div class="loadingText">
        {{ isData ? '加载中~' : '已加载全部数据' }}
      </div>
    </div>
    <div v-else class="nullBox">暂无数据~</div>
    <el-dialog title="批量点评" :visible.sync="dialogVisible" width="30%">
      <el-input
        :rows="6"
        class="textarea"
        type="textarea"
        placeholder="请输入内容"
        v-model="form.content"
        maxlength="2000"
        show-word-limit
      />
      <Upload2OSS
        v-if="dialogVisible"
        :styles="{ width: '100px', height: '100px' }"
        ref="uploadImgList"
        v-model="form.punchFiles"
        :limit="6"
        :max-m="2"
        class="order-upload"
        tips=""
        @change="handleUrlsChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPunchComment"
          >提 交 点 评</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Upload2OSS from '@/components/AppTemplate/Upload2OSS'
import { submitPunchComment } from '@/api/deliver/punch'
import { debounce } from 'throttle-debounce'
export default {
  components: { Upload2OSS },
  props: {
    list: { type: Array, default: () => [] },
    isData: { type: Boolean, default: true },
    total: { type: [Number, String], default: 0 }
  },
  data: () => ({
    form: { punchFiles: [], content: '' },
    dialogVisible: false,
    observer: null,
    checkAll: false,
    checkedCities: [],
    isIndeterminate: false
  }),
  computed: { 
    permsList() {
      return this.$route.meta.permsList || []
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.scrollContainer.addEventListener('scroll',  debounce(300, this.handleScroll))
      }, 1000)
    })
  },
  beforeDestroy() {
    this.$refs.scrollContainer.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    async submitPunchComment() {
      if (!this.form.content) {
        this.$message({
          message: '请输入内容',
          type: 'warning'
        })
        return
      }
      const { code } = await submitPunchComment({
        punchId: this.list[0].punchId,
        ...this.form,
        punchTaskId: this.list[0].punchTaskId,
        punchUserRecordIds: this.checkedCities
      })
      if (code === 1) {
        this.form = { punchFiles: [], content: '' }
        this.$message({
          message: '批量评论成功',
          type: 'success'
        })
        this.dialogVisible = false
        this.checkedCities = []
        this.checkAll = false
        this.isIndeterminate = false
        this.$emit('refresh', 1)
      }
    },
    handleEditAll() {
      this.form = { punchFiles: [], content: '' }
      this.dialogVisible = true
    },
    handleUrlsChange(value) {
      this.form.punchFiles = value.map(item => ({
        fileName: item.materialName,
        fileType: 1,
        fileUrl: item.url,
        punchType: 1
      }))
    },
    handleScroll() {
      const container = this.$refs.scrollContainer
      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight

      // 检查是否滚动到底部
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if(this.isData){
          container.scrollTop = container.scrollHeight - container.clientHeight-40;
          this.$emit('onSearch')
        }
        // 在这里执行滚动到底部时的逻辑
      }
    },
    handleCheckAllChange(val) {
      this.isIndeterminate = false
      this.checkedCities = val ? this.list.map(item => item.id) : []
    },
    handleCheckedCitiesChange(value) {
      console.log(111111, value)
      let checkedCount = value.length
      this.checkAll = checkedCount === this.list.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.list.length
    }
  }
}
</script>
<style lang="scss" scoped>
.select-left::v-deep {
  width: 450px;
  min-height: 375px;
  flex-shrink: 0;
  margin-right: 10px;
  border-radius: 10px;
  border: 1px solid #dcdee1;
  background: #fff;
  padding: 14px 10px;
  .nullBox {
    width: 100%;
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999999;
    font-size: 14px;
    font-weight: 400;
  }
  .el-upload-dragger {
    width: 100px;
    height: 100px;
  }
  .upload {
    margin-top: 10px;
  }
  .image_poster {
    width: 100px;
    height: 100px;
  }
  .el-checkbox__label {
    display: none !important;
  }
  .select-left-checkBox-group {
    max-height: 580px;
    overflow-y: scroll;
    > .loadingText {
      width: 100%;
      display: flex;
      color: #999999;
      align-items: center;
      justify-content: center;
      height: 20px;
      font-size: 13px;
    }
  }
  .select-left-checkBox {
    height: 70px;
    border-radius: 10px;
    border: 1px solid #f2f2f2;
    background: #fff;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 0 12px;
    cursor: pointer;
    .select-left-checkBox-left {
      display: flex;
      align-items: center;
      .taps {
        color: #999999;
        font-family: 'Microsoft YaHei';
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px;
        max-width: 190px;
        > p:nth-of-type(1) {
          color: #000000;
          font-size: 14px;
          margin-bottom: 6px;
        }
        > p {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      > img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-left: 14px;
        margin-right: 10px;
        overflow: hidden;
      }
    }
    .select-left-checkBox-rigt {
      color: #999999;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 12px;
    }
  }
  .select-left-btn {
    padding: 14px 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f2f2f2;
  }
  .select-left-title {
    color: #000000;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 16px;
  }
}
</style>