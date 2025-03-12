
<template>
  <el-dialog v-if="visible" :close-on-click-modal="false" class="dialog-container" title="生成链接" width="480px" :visible.sync="visible">
    <el-form ref="ruleForm" :model="form" label-width="70px">
      <el-form-item label="生成链接">
        <div class="ruleForm-item">
          <el-input v-model="form.shareSlug" disabled />
          <el-button type="text" @click="innerVisible = true">预览</el-button>
        </div>
      </el-form-item>
      <el-form-item label="设置口令" prop="selectCase">
        <div>{{ form.shareCode }}</div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button type="primary" @click="handleCopy">复制链接及口令</el-button>
    </span>
    <div v-if="innerVisible" class="el-dialog__wrapper">
      <div class="dialog-inner">
        <div class="dialog-inner-container">
          <div class="phone-header">选题评审</div>
          <div class="phone-content">
            <div class="phone-card">
              <div class="phone-body">
                <div>{{ current.caseName }}</div>
                <SrcrollPane style="height: 365px">
                  <div>
                    <img v-for="item in current.contents" :key="item" :src="item" alt="" />
                  </div>
                </SrcrollPane>
              </div>
            </div>
          </div>
          <div class="phone-footer">
            <el-button type="primary" :disabled="pageIndex === 1" plain @click="prev">上一个</el-button>
            <el-button type="primary" :disabled="pageIndex === total" @click="next">下一个</el-button>
          </div>
          <el-button class="phone-btn" @click="innerVisible = false">退出</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { copy } from '@/utils/index'
import { planProductCase } from '@/api/product/plan'
import SrcrollPane from '@/components/SelectCaseModal/ScrollPane'
export default {
  components: { SrcrollPane },
  data() {
    return {
      form: {},
      current: {},
      total: 0,
      pageIndex: 1,
      visible: false,
      innerVisible: false
    }
  },
  methods: {
    open(row) {
      this.visible = true
      this.form = {
        shareSlug: `${process.env.VUE_APP_TEMPLATE_URL}/caseReview/${row.shareSlug}`,
        shareCode: row.shareCode,
        planId: row.planId
      }
      this.getCaseList()
    },
    next() {
      if (this.pageIndex >= this.total) return
      this.pageIndex++
      this.getCaseList()
    },
    prev() {
      if (this.pageIndex === 1) return
      this.pageIndex--
      this.getCaseList()
    },
    async getCaseList() {
      const params = {
        pageSize: 1,
        pageIndex: this.pageIndex,
        planId: this.form.planId
      }
      const { data } = await planProductCase(params)
      this.current = data.items[0]
      this.total = data.total
    },
    handleCopy() {
      copy(`
    链接已生成：${this.form.shareSlug}
    口令是：${this.form.shareCode}
        `)
      this.visible = false
      this.$notify.success('复制成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container ::v-deep {
  height: 500px;
  .el-dialog {
    border-radius: 10px;
  }
  .el-dialog__header {
    border-bottom: 1px solid #e7e7e7;
    padding-bottom: 20px;
    font-weight: bold;
  }
  .ruleForm-item {
    display: flex;
    .el-button {
      margin-left: 20px;
    }
  }
  .table_wrap {
    height: 100%;
  }
  .dialog-inner {
    display: flex;
    position: relative;
    .dialog-inner-container {
      width: 325px;
      height: 600px;
      background-color: #fff;
      background-image: url(../../../../assets/image/phone-bg.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      border-radius: 60px;
      margin: 10vh auto 0;
      left: 0;
      position: relative;
      display: flex;
      flex-direction: column;
      .phone-header {
        height: 75px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        color: #333333;
        font-weight: 600;
        padding: 6px;
        font-size: 18px;
      }
      .phone-content {
        padding: 0 20px;
        flex: 1;
        .phone-card {
          background: #f9f9f9;
          height: 100%;
          padding: 16px;
          .phone-body {
            background: #ffffff;
            box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.12);
            border-radius: 10px;
            padding: 16px;
            height: 100%;
            overflow: auto;
          }
        }
      }
      .phone-footer {
        height: 78px;
        padding: 15px 40px;
        display: flex;
        .el-button {
          flex: 1;
          height: 40px;
        }
      }
    }
    .phone-btn {
      width: 100px;
      position: absolute;
      bottom: -68px;
      left: 112px;
    }
    .dialog-img {
      width: 300px;
    }
  }
}
</style>
