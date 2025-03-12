<template>
  <div v-loading="loading" class="wrapper">
    <div class="link">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/oaManagement/approval/home">审批管理</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>修改审批模板</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="flex justify-between">
      <div class="step">
        <div :class="{ active: active === '1' }">基础设置</div>
        <div :class="{ active: active === '2' }">
          节点提交页设置
        </div>
        <div :class="{ active: active === '3' }">审批流设置</div>
      </div>
    </div>
    <div v-if="active === '3'" class="guide">
      <div class="guide-title">
        <img src="@/assets/image/guangpan.png" />操作指引
      </div>
      <div class="guide-content">
        <p>节点编辑</p>
        <div>
          选中节点，在右侧弹窗补充该节点的基本信息、审批过程和审批附件。
        </div>
        <p>节点新增</p>
        <div>
          点击<i class="el-icon-circle-plus" />
          ，再选择“审批”/“抄送”节点，右侧弹窗显示该新增节点编辑窗口，完成节点必填信息编辑，点击“保存”则完成节点新增。
        </div>
        <p>节点删除</p>
        <div>选中需要删除的节点，点击节点卡片右上角“X”，可删除该节点。</div>
        <p>审批流保存</p>
        <div>
          所有审批流节点编辑确认完成后，点击底部”提交“即完成该审批模板的保存。
        </div>
      </div>
    </div>

    <div v-if="info.id" class="content">
      <BaseForm v-show="active === '1'" ref="BaseForm" :info="info" />
      <Submission v-show="active === '2'" />
      <FlowFrom v-show="active === '3'" ref="FlowFrom" :info="info" />
    </div>
    <div class="approval-btn">
      <el-button
        @click="$router.push('/oaManagement/approval/home')"
      >取消</el-button>
      <el-button v-if="active !== '1'" @click="handlePre">上一步</el-button>
      <el-button
        v-if="active !== '3'"
        type="primary"
        @click="handleNext"
      >下一步</el-button>
      <el-button
        v-if="active === '3'"
        type="primary"
        @click="handleNext"
      >提 交</el-button>
    </div>
  </div>
</template>

<script>
import { templateDetail, unLockTemplate } from '../api/approval'
import BaseForm from './components/baseForm.vue'
import FlowFrom from './components/flow.vue'
import Submission from './components/submission.vue'
export default {
  components: {
    BaseForm,
    FlowFrom,
    Submission
  },
  data() {
    return {
      active: '1',
      info: {},
      loading: true
    }
  },
  mounted() {
    this.getDetail()
  },
  beforeRouteLeave(to, from, next) {
    unLockTemplate(this.$route.query.id)
    next()
  },
  methods: {
    async getDetail() {
      this.loading = true
      const res = await templateDetail(this.$route.query.id).finally(() => {
        this.loading = false
      })
      this.info = res.data
    },
    async handleNext() {
      if (this.active === '1') {
        await this.$refs.BaseForm.submit()
      } else if (this.active === '3') {
        await this.$refs.FlowFrom.submit()
        this.$router.push('/oaManagement/approval/home')
        return
      }
      const value = +this.active
      this.active = JSON.stringify(value + 1)
    },
    handlePre() {
      this.active = JSON.stringify(JSON.parse(this.active) - 1)
    },
    handleTabClick() {
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.wrapper {
  @include responsive-height(20px);
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  .content {
    @include responsive-height(20px);;
    overflow-y: auto;
    margin-top: 20px;
  }
  .link {
    margin-bottom: 20px;
  }
  .step {
    width: 100%;
    display: flex;
    border-bottom: 1px solid #eff2f6;
    > div {
      line-height: 40px;
      height: 40px;
      // padding:0 10px;
      margin: 0 40px 0 0px;
      font-size: 14px;
      &.active {
        font-weight: 600;
        border-bottom: 1px solid #0c6fff;
      }
    }
  }
  .guide {
    color: #0c6fff;
    margin-right: 20px;
    position: relative;
    cursor: pointer;
    height: 25px;
    width: 130px;
    margin-left: 94%;
    margin-top: -35px;
    z-index: 1;
    font-size: 14px;
    .guide-title {
      line-height: 40px;
    }
    &:hover {
      .guide-content {
        display: block;
      }
    }
    img {
      width: 20px;
      height: 20px;
      margin-right: 4px;
      display: inline-block;
      vertical-align: -5px;
    }
    .guide-content {
      width: 364px;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0 2px 8px 0 #00000026;
      padding: 10px 20px 20px;
      position: absolute;
      right: 40px;
      top: 40px;
      display: none;
      z-index: 11;
      text-align: left;
      p {
        color: #0c6fff;
        font-size: 14px;
        font-weight: 600;
        padding: 12px 0;
      }
      > div {
        color: #333333;
        font-size: 12px;
        font-weight: 400;
        i {
          color: #0c6fff;
          font-size: 18px;
        }
      }
    }
  }
  .approval-btn {
    width: 100%;
    padding-top: 10px;
    text-align: right;
    position: absolute;
    bottom: 50px;
    right: 80px;
  }
}
</style>
