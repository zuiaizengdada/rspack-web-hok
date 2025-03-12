<template>
  <div class="pieChart-container">
    <div class="pieChart">
      <MTitle title="IP累计评估数据" />
      <span class="a_link" @click="gotoDetali">详情</span>
    </div>

    <div class="teacher-content">
      <template v-for="item in teacherAssessList">
        <div
          v-if="item.svgUrl"
          :key="item.key"
          class="teacher-content-item"
          :style="`background:${item.bg}`"
          @click="gotoDetail('teachFile',item.index)"
        >
          <svg-icon :icon-class="item.svgUrl" class="teacher-content-img" />
          <div class="teacher-content-box">
            <span class="label">{{ item.title }}</span>
            <span class="value">{{ item.value }}
              <span class="label">名</span>
            </span>
          </div>
        </div>
      </template>
      <!-- <div v-for="(item, index) in data" :key="index" class="contentView" @click="gotoDetail(item, index)">
        <div class="contentBox" :class="item.bg">
          <div class="title">{{ item.title }}</div>
          <div class="content_footer">
            <span class="content_value">{{ item.value }}</span>
            <span class="unit">{{ item.unit }}</span>
          </div>
        </div>
      </div> -->
    </div>
    <div class="teacher-content-footer">
      <template v-for="item in teacherAssessList">
        <div
          v-if="!item.svgUrl"
          :key="item.key"
          class="teacher-content-count"
          @click="gotoDetail('teacherAssessment',item.index)"
        >
          <span class="label">{{ item.title }}</span>
          <span class="value">{{ item.value }}
            <span class="label">名</span>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    teacherAssessList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    gotoDetali() {
      this.$router.push(`/teacherCenter/teacherAssessment/list`)
    },
    gotoDetail(link, index) {
      if (index > 6) {
        this.$router.push(`/teacherCenter/teacherAssessment/list?assessStatus=${index - 6}`)
        return
      }
      if (link === 'teachFile') {
        if (index === 4) {
          this.$router.push(`/teacherCenter/teachFile/list?assessStatus=${index}`)
          return
        }
        this.$router.push(`/teacherCenter/teachFile/list?query=false`)
        return
      }
      if (index === 1) {
        this.$router.push(`/teacherCenter/teacherAssessment/list?assessStatus=3`)
      } else {
        // 跳转师资评估(已评估，有潜力，可尝试，不推荐)
        this.$router.push(`/teacherCenter/teacherAssessment/list?assessStatus=3&assessResult=${index - 2}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pieChart {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pieChart-container{
  padding: 0 20px;
}
.teacher-content ::v-deep{
  display: flex;
  margin-top: 16px;
  .teacher-content-item{
    flex: 1;
    height: 90px;
    border-radius: 8px;
    margin: 0 20px 10px 0 ;
    display: flex;
    align-items: center;
    padding: 16px;
    cursor: pointer;
    &:nth-of-type(4){
      margin: 0 0px 10px 0 ;
    }
    .teacher-content-img{
      height: 58px;
      width: 58px;
    }
    .teacher-content-box{
      display: flex;
      flex-direction: column;
      margin-left: 12px;
    }
    .label{
      font-size: 14px;
      color: #777777;
    }
    .value{
      font-size: 20px;
      color: #333;
      font-weight: bold;
      margin-top: 8px;
    }
  }

}
.teacher-content-footer{
    border-radius: 8px;
    display: flex;
    margin-top: 16px;
    background: #F2F9FF;
    height: 90px;
    .teacher-content-count{
      flex: 1;
      cursor: pointer;
      min-width: 114px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 6px;
      margin: 10px;
      &:nth-of-type(1){
        border-right: 1px solid #CBCFD3;
      }
      .label{
        font-size: 14px;
        color: #777777;
      }
      .value{
        font-size: 20px;
        color: #333;
        font-weight: bold;
        margin-top: 8px;
      }
    }
  }
</style>
