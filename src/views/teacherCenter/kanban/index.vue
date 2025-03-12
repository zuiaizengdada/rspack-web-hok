<template>
  <div class="page_wrap">
    <!-- 数据看板 -->
    <div class="page_wrap_header">
      <div class="page_wrap_header_top">
        <MCard style="height: 284px">
          <pieChart :teacher-assess-list="teacherAssessList" />
        </MCard>
        <MCard class="page_wrap_footer m-t-22">
          <MTitle title="IP合作状态累计数据" class="m-r-16" />
          <div class="status-sum">
            <div v-for="item in currentList" :key="item.key" class="status-item" :style="`background:${item.bg}`" @click="gotoDetail(item.index)">
              <div class="status-item_img">
                <svg-icon :icon-class="item.imgUrl" class="image" />
              </div>
              <div class="status-item_text">
                <span class="label">{{ item.label }}</span>
                <span class="value">{{ item.value }}
                  <span class="label">名</span>
                </span>
              </div>
            </div>
          </div>
        </MCard>
      </div>
      <div class="performance leaderboard">
        <MCard style="height: 512px;">
          <performant />
        </MCard>
      </div>

    </div>

    <!-- 讲师数据对比 -->
    <compared class="m-t-22" />
    <!-- 讲师最新跟进情况 -->
    <follow-up class="m-t-22" />
    <funnel-chart class="m-t-22" />
    <assess-table class="m-t-22" />
  </div>
</template>

<script>
import pieChart from './pieChart'
import performant from './performant'
import compared from './compared'
import followUp from './followUp'
import funnelChart from './funnelChart'
import assessTable from './assessTable'
import { teacherReportAssess, teacherStatusSum } from '@/api/tearchCenter'
export default {
  components: {
    pieChart,
    performant,
    compared,
    funnelChart,
    followUp,
    assessTable
  },
  data() {
    return {
      // 漏斗数据
      teacherAssess: {
        xAxis: ['寻找到的师资数量', '评估通过的师资数量', '合作中的师资数量'],
        yAxis: [
          { value: 0, name: '寻找到的师资数量', itemStyle: { color: '#33CC94' }, key: 'teacherSum' },
          { value: 0, name: '评估通过的师资数量', itemStyle: { color: '#35D3E2' }, key: 'assessPassSum' },
          { value: 0, name: '合作中的师资数量', itemStyle: { color: '#47A0FB' }, key: 'haveCooperationSum' }
        ]
      },
      // 累计评估数据
      teacherAssessList: [
        { title: '师资总数', bg: '#D8F2FF', index: 0, value: '0', key: 'teacherSum', svgUrl: 'teacher_icon1' },
        { title: '评估中', bg: '#FEEECE', index: 8, value: '0', key: 'assessingSum', svgUrl: 'teacher_icon2' },
        { title: '未评估', bg: '#FBD5D0', index: 7, value: '0', key: 'unAssessSum', svgUrl: 'teacher_icon3' },
        { title: '无需评估', bg: '#CCF2E4', index: 4, value: '0', key: 'unnecessaryAssessSum', svgUrl: 'teacher_icon4' },
        { title: '已评估总数', value: '0', index: 1, key: '' },
        { title: '50分以下', value: '0', index: 2, key: 'lessFive' },
        { title: '50-60分', value: '0', index: 3, key: 'five2Six' },
        { title: '60-70分', value: '0', index: 4, key: 'six2Seven' },
        { title: '70-80分', value: '0', index: 5, key: 'seven2Eight' },
        { title: '80-100分', value: '0', index: 6, key: 'eight2Ten' }
      ],
      currentList: [
        {
          label: '开发中IP',
          value: 0,
          key: 'developingSum',
          imgUrl: 'teacher-icon_count4',
          bg: 'linear-gradient(180deg, #FFF3E6 0%, #FFE9D6 100%);',
          index: 8
        },
        {
          label: '洽谈中IP',
          value: 0,
          key: 'negotiationSum',
          imgUrl: 'teacher-icon_count2',
          bg: 'linear-gradient(180deg, #E8FAF3 0%, #CCF2E4 100%)',
          index: 3
        },
        {
          label: '测试中IP',
          value: 0,
          key: 'testingSum',
          imgUrl: 'teacher-icon_count3',
          bg: 'linear-gradient(180deg, #EEFAFF 0%, #D8F2FF 100%)',
          index: 2
        },
        {
          label: '已签合同IP',
          value: 0,
          key: 'signedContractSum',
          imgUrl: 'teacher-icon_count1',
          bg: 'linear-gradient(180deg, #FFEFEF 0%, #FFDADA 100%)',
          index: 1
        }
      ],
      count: 0 // 总数
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    gotoDetail(index) {
      this.$router.push(`/teacherCenter/teachFile/list?assessResult=${index}`)
    },
    link2teacher(type) {
      if (type === 'second') {
        this.$router.push('/teacherCenter/schedule?tab=second')
        return
      }
      this.$router.push('/teacherCenter/schedule')
    },
    // 获取讲师累计评估数据
    async init() {
      teacherReportAssess()
        .then((res) => {
          this.count = res.data.teacherSum || 0
          this.teacherAssess.yAxis.map((v) => {
            if (this.count === 0) {
              res.data[v.key] && (v.value = 0)
            } else {
              res.data[v.key] && (v.value = ((res.data[v.key] / this.count) * 100).toFixed(2))
            }
            res.data[v.key] && (v.sum = res.data[v.key])
          })
          this.teacherAssessList.map((v) => {
            res.data[v.key] && (v.value = res.data[v.key])
          })
          this.teacherAssessList[4].value = +this.teacherAssessList[5].value + +this.teacherAssessList[6].value + +this.teacherAssessList[7].value + +this.teacherAssessList[8].value + +this.teacherAssessList[9].value
        })
      const { data, code } = await teacherStatusSum()
      if (code === 1) {
        for (const i in data) {
          this.currentList.forEach(j => {
            if (i === j.key) {
              j.value = data[i]
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  height: 100%;
  min-width: 1250px;
  .el-empty{
    padding: 12px 0;
  }
  .page_wrap_header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .page_wrap_header_top {
      flex: 1;
      height: 512px;
      margin-right: 20px;
    }
    .leaderboard {
      width: 508px;
      min-width: 508px;
      .page_wrap_footer_left{
        padding:20px;
        height: 206px;
        .image{
          height: 92px;
          width: 152px;
        }
      }
    }
  }
  .page_wrap_center {
    height: 528px;
    margin-top: 22px;
  }
  .page_wrap_footer {
    padding-left: 20px;
    padding-right: 20px;
    height: 208px;

  }
  .status-sum{
    display: flex;
    margin-top: 20px;
    .status-item{
      flex: 1;
      cursor: pointer;
      border-radius: 6px;
      display: flex;
      align-items: center;
      padding: 16px;
      margin-right: 32px;
      height: 98px;
      &:last-child{
        margin-right: 0px;
      }
      .status-item_img{
        width: 58px;
        height: 58px;
        background-color: rgb(255 255 255 / 60%);
        border-radius: 17px;
        display: flex;
        align-items: center;
        justify-content: center;
        .image{
        height: 39px;
        width: 39px;
      }
    }
    .status-item_text{
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      justify-content: center;
      .label{
        font-size: 12px;
        color: #777777;
      }
      .value{
        margin-top: 10px;
        font-weight: bold;
        color: #161616;
        font-size: 20px;
      }
    }
  }
  }
  .schedule-box{
    background: linear-gradient(180deg, #FFF3D1 0%, #FFECB2 100%);
    border-radius: 10px;
    margin: 17px auto;
    height: 98px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    .schedule-box__icon{
      width: 66px;
      height: 66px;
      border-radius: 12px;
      background: rgba(255,255,255,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .schedule-svg{
        width: 39px;
        height: 39px;
      }
    }
    .schedule-btn{
      width: 139px;
      height: 36px;
      background: #FFC000;
      box-shadow: 0px 2px 6px 0px rgba(153,115,0,0.2);
      border-radius: 18px;
      font-size: 16px;
      letter-spacing: 2px;
      color: #FFFFFF;
      text-align: center;
      line-height: 36px;
      cursor: pointer;
    }
    .schedule-btn__white{
      box-shadow: 0px 2px 6px 0px rgba(153,115,0,0.1);
      height: 36px;
      background: #FFFFFF;
      border-radius: 18px;
      font-size: 16px;
      color: #777777;
      letter-spacing: 2px;
      text-align: center;
      line-height: 36px;
      cursor: pointer;
      width: 139px;
    }
  }
}
</style>
