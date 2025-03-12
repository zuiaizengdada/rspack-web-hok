<template>
  <div class="financial-instrument">
    <el-tabs v-model="activeName">
      <el-tab-pane label="业绩规则" name="dataScreen">
        <updateConfig />
      </el-tab-pane>
      <!-- <el-tab-pane label="数据上传" name="detailData">
        <uploadBrod />
      </el-tab-pane> -->
      <el-tab-pane label="默认分配" name="defaultAllocation">
        <defaultAllocation ref="defaultAllocationDataTable" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import updateConfig from '@/views/system/dataConfiguration/components/updateConfig'
// import uploadBrod from '@/views/system/dataConfiguration/components/uploadBrod'
import defaultAllocation from '@/views/system/dataConfiguration/components/defaultAllocation'
export default {
  name: 'DataConfiguration',
  components: {
    updateConfig,
    defaultAllocation
  },
  data() {
    return {
      activeName: 'dataScreen',
      fromChoose: this.$route.query.formChoose,
      configList: [
        {
          name: '业绩规则',
          nums: 0,
          authority: 'web:couponDetail:DataScreen',
          approveStatus: 'dataScreen'
        },
        {
          name: '数据上传',
          nums: 0,
          authority: 'web:couponDetail:DetailData',
          approveStatus: 'detailData'
        },
        {
          name: '默认分配',
          nums: 0,
          authority: 'web:couponDetail:defaultAllocation',
          approveStatus: 'defaultAllocation'
        }
      ],
      permsList: this.$route.meta.permsList || []
    }
  },
  watch: {
    activeName(newValue, oldValue) {
      if (newValue === 'defaultAllocation') {
        this.$nextTick(function () {
          console.log(
            '大图标的三个月后又上飞机：',
            this.$refs.defaultAllocationDataTable.loadDataString
          )
          this.$refs.defaultAllocationDataTable.loadData()
        })
      }
    }
  },
  created() {
    // this.configList = this.configList.filter(item => {
    // return this.permsList.includes(item.authority)
    // })
  },
  mounted() {
    if (this.fromChoose) {
      this.activeName = this.fromChoose
    } else {
      this.activeName = 'dataScreen'
    }
  },
  activated() {},
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.financial-instrument {
  @include responsive-height(20px);
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
}
</style>
