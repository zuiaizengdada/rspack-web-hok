<template>
  <div>
    <div v-for="(item, index) in list" :key="index" class="m-b-20 ">
      <div class="interactiveView">
        <span class="title m-r-10">{{ item.title }}</span>
        <el-switch v-model="item.visible" />
        <span class="tips m-l-10">{{ item.des }}</span>
      </div>
      <div v-if="item.visible">
        <components :is="item.label" />
      </div>
    </div>

    <!-- 添加卡片弹框 -->
    <AppDialog
      v-model="cardDialog.visible"
      :title="cardDialog.title"
      width="850px"
      height="500px"
      top="10vh"
    >
      <div>
        <el-tabs v-model="cardDialog.type">
          <el-tab-pane label="二维码卡片" name="1">二维码卡片</el-tab-pane>
          <el-tab-pane label="广告卡片" name="2">广告卡片</el-tab-pane>
        </el-tabs>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import card from './interactiveSetting/card.vue'
import lottery from './interactiveSetting/lottery.vue'
import questionnaire from './interactiveSetting/questionnaire.vue'
import task from './interactiveSetting/task.vue'
export default {
  components: {
    AppDialog,
    card,
    lottery,
    questionnaire,
    task
  },
  data() {
    return {
      // 配置列表
      list: [
        // {
        //   title: '优惠卷配置',
        //   label: 'coupon',
        //   visible: true,
        //   des: '可提前在营销推广板块新建好优惠卷',
        //   btn: '添加优惠卷',
        //   list: []
        // },
        {
          title: '卡片配置',
          label: 'card',
          visible: true,
          des: '添加推荐卡片，将二维码、广告等重要信息呈现在直播间',
          btn: '添加卡片',
          list: []
        },
        {
          title: '问卷配置',
          label: 'questionnaire',
          visible: true,
          des: '允许创建并发送问卷给学员，可用于收集学员反馈、调研、话题讨论等场景',
          btn: '添加问卷',
          list: []
        },
        {
          title: '抽奖配置',
          label: 'lottery',
          visible: true,
          des: '开启抽奖并设置抽奖后，IP可在直播间发起抽奖，提升直播间氛围以及用户活跃',
          btn: '添加抽奖',
          list: []
        },
        {
          title: '作业配置',
          label: 'task',
          visible: true,
          des: '开启作业开关后，直播详情页会出现作业选项卡',
          btn: '添加作业',
          list: []
        }
      ],
      coupon: true, // 优惠卷配置
      card: true, // 卡片配置
      questionnaire: true, // 问卷配置
      lottery: true, // 抽奖配置
      task: true, // 作业配置
      cardDialog: {
        visible: false,
        title: '添加卡片',
        form: {
          type: 1, // 卡片类型1:二维码卡片 2：广告卡片
          title: '', // 卡片标题
          img: '', // 卡片展示图
          des: '', // 卡片描述
          h5link: '' // h5页面地址
        }
      }
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.tips {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
.interactiveView {
  display: flex;
  align-items: center;
  >.title {
    text-align: right;
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    box-sizing: border-box;
  }
}
</style>
