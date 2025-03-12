<template>
  <div class="panel">
    <div class="top-panel">
      <panel-type3
        :content="list[0]"
        :select-list="selectList"
        :title="title"
        :sort="1"
        @selectPanel="selectPanel"
      />
      <div class="panel-list1">
        <panel-type2
          :content="list[6]"
          style="margin-bottom: 16px;"
          :select-list="selectList"
          :title="title"
          :sort="7"
          @selectPanel="selectPanel"
        />
        <panel-type2
          :content="list[5]"
          :select-list="selectList"
          :title="title"
          :sort="6"
          :flag="true"
          @selectPanel="selectPanel"
        />
      </div>
      <div class="panel-list1">
        <data-broken
          :select-list="selectList"
          :broken-data="brokenData"
          :title="title"
          :time-list="timeList"
          :broken-qoq-data="brokenQoqData"
          :broken-check="brokenCheck"
          @changeCheck="changeCheck"
        />
      </div>
    </div>
  </div>
</template>

<script>
import panelType3 from '@/components/AppPanelData/panelType3'
import panelType2 from '@/components/AppPanelData/panelType2'
import DataBroken from './dataBroken'

export default {
  name: 'DataPanel',
  components: {
    panelType3,
    panelType2,
    DataBroken
  },
  props: {
    brokenQoqData: {
      type: Array,
      default: () => {
        return []
      }
    },
    brokenCheck: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    timeList: {
      type: Object,
      default: () => {
        return {}
      }
    },
    brokenData: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectList: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: '较昨日'
    }
  },
  data() {
    return {
      // selectList: [1]
    }
  },
  methods: {
    selectPanel(val) {
      this.$emit('selectPanel', val)
    },
    changeCheck(val) {
      this.$emit('changeCheck', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel{
  width: 100%;
  margin-top: 25px;
  .top-panel,.bottom-panel{
    display: flex;
    align-items: center;
    justify-content: space-between;
    >div{
      flex: 1;
    }
  }
  .bottom-panel{
    margin-top: 16px;
  }
  .panel-list1,.panel-list2{
    margin-left: 16px;

  }
}
</style>
